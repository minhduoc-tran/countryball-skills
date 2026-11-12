import React from 'react';
import { ShotProps, Street, Hero, LOOKS, Look, walkPose, camT, kf, clamp, easeOut, FONT, Motorbike, rnd } from '../../engine';
import { SpeedLines, StreakLines } from './punch-fx-kit';
import { PunchPip } from './punch-pip-and-fist';
import { GiantCockroach } from './giant-cockroach';

// Chapter B, cockroach part 1: B14-B19 (56.20-63.79 s). The street at night, the manhole, the bus-sized cockroach climbs out,
// the street runs screaming, Pip steps forward, the wind-up (cut right before the hit, which is B20 in shots-chb-roach-punch.tsx).

const PIP = LOOKS.pipHood;
export const FLOOR_Y = 735; // the ground line Pip and the crowd stand on (as in the kit demo Z1)
export const MANHOLE = { x: 960, y: 660 };

const Manhole: React.FC<{ x: number; y: number; r: number; lid: number }> = ({ x, y, r, lid }) => (
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.2} fill="#0A070C" stroke="#2A2630" strokeWidth={6} />
    <ellipse cx={x} cy={y - 1} rx={r * 0.9} ry={r * 0.16} fill="#000" />
    <g transform={`translate(${x + lid * r * 1.7} ${y - lid * r * 0.5}) rotate(${lid * 40})`} opacity={lid > 0.02 ? 1 : 0}>
      <ellipse cx={0} cy={0} rx={r} ry={r * 0.2} fill="#4A4752" stroke="#16131C" strokeWidth={5} />
      <ellipse cx={0} cy={-2} rx={r * 0.7} ry={r * 0.12} fill="none" stroke="#2A2630" strokeWidth={3} />
    </g>
    {lid <= 0.02 ? (
      <g>
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.2} fill="#4A4752" stroke="#16131C" strokeWidth={5} />
        <ellipse cx={x} cy={y - 2} rx={r * 0.7} ry={r * 0.12} fill="none" stroke="#2A2630" strokeWidth={3} />
      </g>
    ) : null}
  </g>
);

// ---------- B14: night street, the manhole cover rattles and pops ----------
export const B14: React.FC<ShotProps> = ({ t }) => {
  const rattle = t > 6 ? (t % 2 ? 1 : -1) * Math.min(6, (t - 6) * 0.5) : 0;
  const lid = clamp((t - 24) / 6);
  return (
    <g transform={camT(960 + rattle, 600, kf(t, [[0, 1.0], [33, 1.55]]))}>
      <Street t={t + 40} id="b14" night />
      <Manhole x={MANHOLE.x} y={MANHOLE.y} r={64} lid={easeOut(lid)} />
      {lid > 0 ? Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={MANHOLE.x + (rnd(2, i) - 0.5) * 120} cy={MANHOLE.y - (t - 24) * (4 + rnd(3, i) * 4)} r={10 + 14 * rnd(4, i)} fill="#6A6480" opacity={0.5 * (1 - clamp((t - 24) / 10))} />) : null}
    </g>
  );
};

// ---------- B15: size check, the cockroach beside the city bus: same length ----------
export const B15: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp((t - 14) / 8));
  return (
    <g transform={camT(kf(t, [[0, 1000], [49, 1080]]), 620, kf(t, [[0, 1.1], [49, 1.3]]))}>
      <Street t={t + 90} id="b15" night bus />
      <GiantCockroach t={t} x={560} y={700} scale={0.66} facing={1} walk={0.15} rimId="rimBlue" />
      <g transform={`translate(1000 340) scale(${k})`} opacity={k}>
        <text x={0} y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#FFD23F" stroke="#16101A" strokeWidth={16} paintOrder="stroke">=</text>
      </g>
    </g>
  );
};

// ---------- B16: low angle on the manhole, the cockroach hauls itself out ----------
export const B16: React.FC<ShotProps> = ({ t }) => {
  const rise = easeOut(clamp(t / 38));
  const sy = MANHOLE.y + 60;
  return (
    <g transform={camT(990, 560, kf(t, [[0, 1.5], [47, 1.25]]))}>
      <Street t={t + 130} id="b16" night />
      <Manhole x={MANHOLE.x} y={MANHOLE.y} r={110} lid={1} />
      <defs><clipPath id="b16c"><rect x={-400} y={-600} width={3000} height={MANHOLE.y + 600 + 6} /></clipPath></defs>
      <g clipPath="url(#b16c)">
        <GiantCockroach t={t} x={MANHOLE.x + 140} y={sy - 60 + (1 - rise) * 330} scale={0.95} facing={1} walk={t < 38 ? 0.5 : 1} rimId="rimBlue" />
      </g>
      {Array.from({ length: 5 }).map((_, i) => <circle key={i} cx={MANHOLE.x + (rnd(6, i) - 0.5) * 340} cy={MANHOLE.y - 20 - t * (3 + rnd(7, i) * 4)} r={16 + 18 * rnd(8, i)} fill="#6A6480" opacity={0.4 * (1 - clamp(t / 40))} />)}
    </g>
  );
};

// ---------- B17: the whole street runs, screaming, bikes bolt ----------
const CROWD: { look: Look; x0: number; dir: 1 | -1; v: number; sc: number; g: number; ph: number }[] = [
  { look: LOOKS.mom, x0: 1300, dir: -1, v: 19, sc: 0.78, g: 760, ph: 0 },
  { look: LOOKS.suit, x0: 1700, dir: -1, v: 23, sc: 0.7, g: 735, ph: 1.4 },
  { look: LOOKS.mo, x0: 700, dir: 1, v: 21, sc: 0.74, g: 770, ph: 2.2 },
  { look: LOOKS.sis, x0: 300, dir: 1, v: 17, sc: 0.6, g: 725, ph: 0.8 },
  { look: LOOKS.mom, x0: 2000, dir: -1, v: 25, sc: 0.64, g: 722, ph: 3 },
];
export const Crowd: React.FC<{ t: number; t0?: number }> = ({ t, t0 = 0 }) => (
  <g>
    {CROWD.map((c, i) => {
      const x = c.x0 + c.dir * c.v * (t + t0);
      const pose = walkPose(x, (t + t0) * 0.95 + c.ph, c.g, c.sc, { expr: 'shock', armL: { a: 150, b: 20 }, armR: { a: 140 + (i % 2) * 20, b: 30 }, tilt: 8 * c.dir }, c.dir);
      return <Hero key={i} look={c.look} pose={pose} rimId={c.dir > 0 ? 'rimBlue' : 'rimBlueL'} />;
    })}
  </g>
);
export const B17: React.FC<ShotProps> = ({ t }) => {
  const bx = (t: number, x0: number, dir: number, v: number) => x0 + dir * v * t;
  return (
    <g transform={camT(960, 600, 1.0)}>
      <Street t={t + 160} id="b17" night />
      <GiantCockroach t={t} x={kf(t, [[0, 1500], [37, 1360]])} y={690} scale={0.9} facing={-1} walk={1.2} rimId="rimBlue" />
      <Crowd t={t} />
      <Motorbike x={bx(t, 1500, -1, 46)} y={800} s={0.95} facing={-1} color="#B8483E" t={t} />
      <Motorbike x={bx(t, 100, 1, 40)} y={830} s={1.0} facing={1} color="#3E6A8A" t={t} />
      <StreakLines t={t} x={bx(t, 1500, -1, 46) + 150} y={770} dir={180} n={6} len={260} spread={40} o={0.5} />
      {[0, 1, 2].map((i) => <text key={i} x={220 + i * 640 + rnd(2, Math.floor(t / 4) + i) * 60} y={250 + (i % 2) * 90} fontFamily={FONT.title} fontWeight={800} fontSize={90 + i * 10} fill="#FFFFFF" stroke="#16101A" strokeWidth={10} paintOrder="stroke" transform={`rotate(${-10 + i * 9} ${220 + i * 640} 250)`}>{['AAA!', 'A!!', 'AAA!'][i]}</text>)}
    </g>
  );
};

// ---------- B18: Pip steps forward against the stream; the roach scuttles in ----------
export const B18: React.FC<ShotProps> = ({ t }) => {
  const px = kf(t, [[0, 300], [29, 700]], (u) => u);
  const pip = walkPose(px, t * 0.6, FLOOR_Y, 0.72, { expr: 'neutral', yaw: 0.9 }, 1);
  const c0 = CROWD[0];
  return (
    <g transform={camT(kf(t, [[0, 980], [29, 1000]]), 600, kf(t, [[0, 1.0], [29, 1.12]]))}>
      <Street t={t + 197} id="b18" night />
      <GiantCockroach t={t} x={kf(t, [[0, 1700], [29, 1520]])} y={690} scale={1.08} facing={-1} walk={1} rimId="rimBlue" />
      <Hero look={c0.look} pose={walkPose(1700 - 20 * t * 0 - 50 * t, t * 0.95, 800, 0.8, { expr: 'shock', armL: { a: 150, b: 20 }, armR: { a: 150, b: 20 } }, -1)} rimId="rimBlueL" />
      <Hero look={PIP} pose={pip} rimId="rimBlue" />
    </g>
  );
};

// ---------- B19: wind-up (same layout as the kit demo Z1; the hit is frame 3 of B20, so this is hitT 36 virtual) ----------
export const B19: React.FC<ShotProps> = ({ t }) => {
  const pipOpts = { x: 700, ground: FLOOR_Y, scale: 0.72, side: 1 as const, aim: 98, lunge: 70 };
  const rx = kf(t, [[0, 1500], [36, 1200]]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [33, 960]]), 600, kf(t, [[0, 1.12], [33, 1.5]]))}>
      <Street t={t + 226} id="b19" night />
      <GiantCockroach t={t} x={rx} y={690} scale={1.08} facing={-1} walk={1} rimId="rimBlue" />
      <PunchPip t={t} hitT={36} {...pipOpts} rimId="rimBlue" />
      <SpeedLines t={t} cx={905} cy={540} o={clamp((t - 8) / 22) * 0.55} rIn={420} n={40} />
    </g>
  );
};
