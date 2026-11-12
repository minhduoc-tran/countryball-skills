import React from 'react';
import { clamp, rnd } from '../../engine';

// GiantCockroach: a cockroach as big as a city bus (about 760 units long at scale 1, hips ~110 above the floor).
// Side view, glossy brown shell, twitching antennae, tripod-gait six-leg scuttle (3 legs per side, far side darker).
// Pure function of t. Draw it AFTER the set (e.g. <Street>) and BEFORE the effects.
//
//   <GiantCockroach t x y scale? facing? hit? walk? flyDist? flyH? id? rimId? />
//     t, x, y     shot clock, body centre x, y of the floor under its feet (world units)
//     scale       1 = bus-sized (~760 long); beside Street at Z 8 use ~1.0, in a close-up 1.6+
//     facing      1 = head screen-right, -1 = head screen-left
//     hit         0..1 after the punch: it is thrown backwards (away from its head), tumbles head-over-tail, legs flail,
//                 and lands belly-up with legs in the air at 1. 0 = scuttling, undamaged. (Drive: kf(t, [[hitT,0],[hitT+34,1]]).)
//     walk        scuttle speed multiplier (0 = legs still, antennae still twitch)
//     flyDist     px (at scale 1) it travels when hit reaches 1; flyH the arc height
//     rimId       optional filter id for a rim light ('rimBlue' at night)

const INK = '#1E0F08';
const SH = { dark: '#4A2410', mid: '#6F3A1C', cover: '#8A4A22', light: '#B5702F', pron: '#A15A28', head: '#5A2C14' };
const HIPS: [number, number, number][] = [[150, -105, 0.92], [15, -112, 1], [-135, -108, 1.15]]; // x, y, leg-length multiplier
const L1 = 175;
const L2 = 195;

const ik = (hx: number, hy: number, fx: number, fy: number, a: number, b: number) => {
  const dx = fx - hx;
  const dy = fy - hy;
  const d = clamp(Math.hypot(dx, dy), 20, a + b - 2);
  const ux = dx / (Math.hypot(dx, dy) || 1);
  const uy = dy / (Math.hypot(dx, dy) || 1);
  const al = (a * a - b * b + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, a * a - al * al));
  const k1 = { x: hx + ux * al - uy * h, y: hy + uy * al + ux * h };
  const k2 = { x: hx + ux * al + uy * h, y: hy + uy * al - ux * h };
  return { knee: k1.y < k2.y ? k1 : k2, foot: { x: hx + ux * d, y: hy + uy * d } };
};

const Leg: React.FC<{ hx: number; hy: number; fx: number; fy: number; m: number; far: boolean }> = ({ hx, hy, fx, fy, m, far }) => {
  const { knee, foot } = ik(hx, hy, fx, fy, L1 * m, L2 * m);
  const c1 = far ? SH.dark : SH.mid;
  const c2 = far ? '#5A2C14' : SH.light;
  const seg = (a: { x: number; y: number }, b: { x: number; y: number }, w: number, col: string) => (
    <g>
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={INK} strokeWidth={w + 9} strokeLinecap="round" />
      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={col} strokeWidth={w} strokeLinecap="round" />
    </g>
  );
  // spines on the shin: small ticks along the lower segment
  const spines = [0.35, 0.6, 0.85].map((u, i) => {
    const px = knee.x + (foot.x - knee.x) * u;
    const py = knee.y + (foot.y - knee.y) * u;
    return <line key={i} x1={px} y1={py} x2={px + 16} y2={py - 10} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
  });
  return (
    <g>
      {seg({ x: hx, y: hy }, knee, 30, c1)}
      {seg(knee, foot, 20, c2)}
      {spines}
      <circle cx={knee.x} cy={knee.y} r={15} fill={c1} stroke={INK} strokeWidth={5} />
    </g>
  );
};

export const GiantCockroach: React.FC<{ t: number; x: number; y: number; scale?: number; facing?: 1 | -1; hit?: number; walk?: number; flyDist?: number; flyH?: number; id?: string; rimId?: string }> = ({
  t, x, y, scale = 1, facing = 1, hit = 0, walk = 1, flyDist = 1700, flyH = 640, rimId,
}) => {
  const ph = t * 0.55 * walk;
  const e = 1 - Math.pow(1 - clamp(hit), 1.5);
  const flail = clamp(hit * 6);
  const arc = hit > 0 ? Math.sin(Math.PI * clamp(hit / 0.88)) * flyH : 0;
  const land = clamp((hit - 0.88) / 0.12) * 52;
  const ox = -e * flyDist;
  const oy = -arc + land;
  const rot = -e * 540;
  const bob = hit > 0 ? 0 : Math.abs(Math.sin(ph)) * 6;
  const twitch = (k: number) => (rnd(3 + k, Math.floor(t / 3)) - 0.5) * 22;

  const legs = (far: boolean) =>
    HIPS.map(([hx, hy, m], k) => {
      const p = ph + ((k + (far ? 1 : 0)) % 2) * Math.PI;
      const walkF = { x: hx + (far ? 28 : 0) - 70 * Math.cos(p) + (k === 0 ? 70 : k === 2 ? -50 : 0), y: -Math.max(0, Math.sin(p)) * 70 * (walk ? 1 : 0) };
      // hit: legs curl up and kick (the body is belly-up by the end, so these hang "down" in the body frame)
      const fl = { x: hx + (far ? 40 : 0) + Math.sin(t * 0.9 + k * 1.7 + (far ? 2 : 0)) * 90 + (k - 1) * 70, y: -30 + Math.cos(t * 0.8 + k * 2.3) * 80 };
      return <Leg key={k} hx={hx + (far ? 22 : 0)} hy={hy - bob} fx={walkF.x + (fl.x - walkF.x) * flail} fy={walkF.y + (fl.y - walkF.y) * flail} m={m} far={far} />;
    });

  const ant = (k: number, sgn: number) => {
    const base = { x: 292, y: -178 - k * 6 };
    const sw = Math.sin(t * 0.33 + k * 2) * 26 + twitch(k);
    const a1 = { x: base.x + 190, y: base.y - 120 - sgn * 28 + sw };
    const tip = { x: base.x + 430 + sw * 0.6, y: base.y - 40 + sgn * 70 - sw * 1.3 };
    const d = `M ${base.x} ${base.y} Q ${a1.x} ${a1.y} ${tip.x} ${tip.y}`;
    return (
      <g key={k}>
        <path d={d} stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d={d} stroke={k ? SH.mid : SH.light} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    );
  };

  return (
    <g>
      <ellipse cx={x} cy={y + 8} rx={380 * scale * (1 - 0.5 * clamp(arc / flyH))} ry={26 * scale} fill="#000" opacity={0.35 * (1 - 0.7 * clamp(arc / flyH))} transform={`translate(${facing * ox * scale} 0)`} />
      <g transform={`translate(${x + facing * ox * scale} ${y + oy * scale}) scale(${scale * facing} ${scale}) rotate(${rot} 0 -150)`} filter={rimId ? `url(#${rimId})` : undefined}>
        {legs(true)}
        {/* abdomen + wing covers */}
        <g transform={`translate(0 ${-bob})`}>
          <path d="M -8 -118 Q -330 -92 -405 -168 Q -380 -262 -150 -272 Q 60 -270 130 -212 Z" fill={SH.mid} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d="M -400 -168 Q -368 -230 -190 -246 Q 0 -250 120 -208 Q 30 -150 -120 -128 Q -300 -118 -400 -168 Z" fill={SH.cover} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
          <path d="M 110 -214 Q -140 -200 -396 -170" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
          <path d="M -330 -216 Q -140 -262 80 -238" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.28} />
          <path d="M -280 -200 Q -180 -226 -60 -222" stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.4} />
          {[-300, -230, -160].map((bx) => <path key={bx} d={`M ${bx} -128 Q ${bx + 8} -150 ${bx + 4} -170`} stroke={INK} strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round" />)}
          {/* rear cerci */}
          <path d="M -396 -170 L -452 -184 M -392 -158 L -446 -150" stroke={INK} strokeWidth={14} strokeLinecap="round" />
          <path d="M -396 -170 L -450 -184 M -392 -158 L -444 -150" stroke={SH.light} strokeWidth={6} strokeLinecap="round" />
          {/* pronotum (the shield behind the head) */}
          <ellipse cx={128} cy={-186} rx={126} ry={92} fill={SH.pron} stroke={INK} strokeWidth={8} />
          <ellipse cx={132} cy={-190} rx={92} ry={62} fill="#7A3E1C" opacity={0.85} />
          <ellipse cx={92} cy={-222} rx={52} ry={16} fill="#FFFFFF" opacity={0.3} transform="rotate(-14 92 -222)" />
          {/* head */}
          <ellipse cx={252} cy={-138} rx={64} ry={58} fill={SH.head} stroke={INK} strokeWidth={8} />
          <ellipse cx={268} cy={-158} rx={30} ry={26} fill="#0C0709" stroke={INK} strokeWidth={4} />
          <circle cx={276} cy={-168} r={9} fill="#FFFFFF" opacity={0.9} />
          <path d="M 296 -108 L 318 -92 L 292 -88 M 270 -98 L 286 -80" stroke={INK} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {ant(0, 1)}
        {ant(1, -1)}
        {legs(false)}
      </g>
    </g>
  );
};
