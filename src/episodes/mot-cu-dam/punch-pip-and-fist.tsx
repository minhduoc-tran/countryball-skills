import React from 'react';
import { Hero, Pose, poseAt, faceAt, joints, toWorld, basePose, LOOKS, Look, clamp, lerp, easeIn, easeOut, easeInOut, kf, rnd } from '../../engine';
import { SpeedLines, StreakLines } from './punch-fx-kit';

// PUNCH KIT, part 2: Pip throwing the punch, and the huge fist close-up. Pure functions of the shot clock t (30 fps).
//
//   punchPose(t, hitT, o) -> Pose      stance -> wind-up (crouch, fist back, lean back) -> strike (3 f) -> follow-through
//   punchFist(t, hitT, o) -> {x, y}    world position of the striking fist (aim effects/BoomWord/Debris at it)
//   <PunchPip t hitT ground x scale? side? aim? lunge? ... />   Hero + smear arm + big fist + streaks on the strike
//   <FistInsert t id clenchAt? thrustAt? side? bg? />            close-up: open hand clenches (trembles), thrusts at camera
//
// PunchOpts: x (stance hip x), ground (y of the floor under his feet: feet stay on it), scale (hero scale, 1 = 378 px
// tall), side (1 = faces/punches screen-right, -1 left), aim (degrees of the punching arm, 90 = level with the
// shoulder, 120 = up at something tall, 60 = down), lunge (px at scale 1 that he steps in; default 70), windLen
// (frames of wind-up, default 22), yaw (0.9 3/4-ish, 1 pure profile), lean (torso lean at the strike, default 20; use -8 for
// an uppercut at the sky so the head clears the raised arm). Frames are relative to hitT: the fist lands ON hitT.

export type PunchOpts = { x: number; ground: number; scale?: number; side?: 1 | -1; aim?: number; lunge?: number; windLen?: number; yaw?: number; lean?: number };

const leg = (a: number, b: number) => ({ a, b });
/** Hip height that puts the lower foot on the floor (thigh 72 + shin 68, shoe ~14 below the ankle). */
const hipY = (p: Pose, ground: number) => {
  const ext = (l: { a: number; b: number }) => 72 * Math.cos((l.a * Math.PI) / 180) + 68 * Math.cos(((l.a + l.b) * Math.PI) / 180);
  return ground - (Math.max(ext(p.legL), ext(p.legR)) + 14) * p.scale;
};

export const punchPose = (t: number, hitT: number, o: PunchOpts): Pose => {
  const { x, ground, scale = 1, side = 1, aim = 90, lunge = 70, windLen = 22, yaw = 0.9, lean = 20 } = o;
  const s = side;
  const near: 'armR' | 'armL' = s > 0 ? 'armR' : 'armL';
  const far: 'armR' | 'armL' = s > 0 ? 'armL' : 'armR';
  // "forward" angles: the near arm swings forward with +a, the far arm with -a. Front leg = the one in the facing direction.
  const key = (f: number, v: { nearA: number; nearB: number; farA: number; farB: number; front: [number, number]; back: [number, number]; tilt: number; dx: number; head: number; ease?: (t: number) => number; expr?: undefined }) => ({
    f: hitT + f,
    ease: v.ease,
    p: {
      x: x + s * v.dx * scale,
      [near]: { a: v.nearA, b: v.nearB },
      [far]: { a: -v.farA, b: -v.farB },
      legL: s > 0 ? leg(v.back[0], v.back[1]) : leg(v.front[0], v.front[1]),
      legR: s > 0 ? leg(v.front[0], v.front[1]) : leg(v.back[0], v.back[1]),
      tilt: s * v.tilt,
      headTilt: s * v.head,
    } as Partial<Pose>,
  });
  const stance = { nearA: 40, nearB: 110, farA: 55, farB: 100, front: [14, -12] as [number, number], back: [-16, 8] as [number, number], tilt: 2, dx: 0, head: 0 };
  const wind = { nearA: -38, nearB: 128, farA: 62, farB: 90, front: [55, -92] as [number, number], back: [-45, 80] as [number, number], tilt: -12, dx: -20, head: -4 };
  const strike = { nearA: aim, nearB: 0, farA: -35, farB: 50, front: [62, -72] as [number, number], back: [-48, 6] as [number, number], tilt: lean, dx: lunge, head: 5 };
  const pose = poseAt(
    t,
    [
      { ...key(-windLen - 12, stance), p: { ...key(-windLen - 12, stance).p, yaw: s * yaw, facing: s, scale } },
      key(-6, { ...wind, ease: easeInOut }),
      key(-3, { ...wind, nearA: -46, tilt: -15, dx: -26, head: -6, ease: easeOut }), // the last coil
      key(0, { ...strike, ease: easeIn }), // 3 frames, fastest at the end: the fist lands on hitT
      key(3, { ...strike, nearA: aim + 5, tilt: lean + 4, dx: lunge + 12, head: 7, ease: easeOut }), // overshoot
      key(14, { ...strike, nearA: aim - 2, dx: lunge + 16, ease: easeInOut }),
      key(60, { ...strike, nearA: aim - 4, tilt: lean - 4, dx: lunge + 22, ease: easeInOut }),
    ],
    { ...basePose, yaw: s * yaw, facing: s, scale, y: 0, x },
  );
  const face = faceAt(t - hitT, [[-100, 'neutral'], [-windLen, 'cool'], [-2, 'shock'], [10, 'smug']]);
  const out: Pose = { ...pose, ...face, handR: 'open', handL: 'open', sway: 14 * Math.sin((t - hitT) * 0.5) * Math.exp(-Math.abs(t - hitT) / 20), look: 0.8 * s };
  out.y = hipY(out, ground);
  return out;
};

const fistOf = (p: Pose, side: 1 | -1) => {
  const j = joints(p)[side > 0 ? 'armR' : 'armL'];
  return { fist: toWorld(p, j.end), mid: toWorld(p, j.mid), shoulder: toWorld(p, j.root), ang: (Math.atan2(j.end.x - j.mid.x, j.end.y - j.mid.y) * 180) / Math.PI };
};
/** World position of the striking fist at clock t. */
export const punchFist = (t: number, hitT: number, o: PunchOpts) => fistOf(punchPose(t, hitT, o), o.side ?? 1).fist;

/** Pip throwing one punch (see PunchOpts). `fx` adds the smear arm, motion streaks and the clenched fist; `look` defaults to the hoodie hero. */
export const PunchPip: React.FC<PunchOpts & { t: number; hitT: number; rimId?: string; look?: Look; fx?: boolean; shadow?: number }> = ({ t, hitT, rimId = 'rimR', look = LOOKS.pipHood, fx = true, shadow = 1, ...o }) => {
  const side = o.side ?? 1;
  const sc = o.scale ?? 1;
  const pose = punchPose(t, hitT, o);
  const { fist, ang } = fistOf(pose, side);
  const h = t - hitT;
  // smear: the arm's sweep over the last 3 frames, a cream wedge from the shoulder through the fist's recent positions
  const smear = h >= -3 && h <= 2 ? [3, 2, 1, 0].map((k) => fistOf(punchPose(t - k, hitT, o), side).fist) : null;
  const sh = fistOf(pose, side).shoulder;
  const fr = 19 * sc;
  return (
    <g>
      <Hero look={look} pose={pose} rimId={rimId} shadow={shadow} />
      {fx && smear ? (
        <g>
          <polygon points={[sh, ...smear].map((p) => `${p.x},${p.y}`).join(' ')} fill="#F6EFE3" opacity={0.5} />
          <polyline points={smear.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#FFFFFF" strokeWidth={30 * sc} strokeLinecap="round" strokeLinejoin="round" opacity={0.55} />
        </g>
      ) : null}
      {fx && h >= -2 && h <= 4 ? <StreakLines t={t} x={fist.x - side * 10 * sc} y={fist.y} dir={side > 0 ? 0 : 180} n={10} len={420 * sc} spread={90 * sc} thick={7 * sc} o={h > 2 ? 0.5 : 0.9} seed={5} /> : null}
      {fx ? (
        // the clenched fist drawn over the mitten: cream, dark outline, three knuckle ticks
        <g transform={`translate(${fist.x} ${fist.y}) rotate(${-ang})`}>
          <ellipse cx={0} cy={fr * 0.4} rx={fr * (h >= -1 && h < 4 ? 1.12 : 0.95)} ry={fr * 0.95} fill={look.hand} stroke={look.line} strokeWidth={4.5 * Math.max(0.6, sc)} />
          <path d={`M ${-fr * 0.5} ${fr * 1.05} L ${-fr * 0.5} ${fr * 1.5} M 0 ${fr * 1.1} L 0 ${fr * 1.55} M ${fr * 0.5} ${fr * 1.05} L ${fr * 0.5} ${fr * 1.5}`} stroke={look.line} strokeWidth={2.4 * Math.max(0.6, sc)} opacity={0.5} strokeLinecap="round" />
        </g>
      ) : null}
      {fx && h >= 0 && h < 6 ? <circle cx={fist.x + side * 8 * sc} cy={fist.y} r={(40 + 26 * h) * sc} fill="none" stroke="#FFFFFF" strokeWidth={8 * sc} opacity={1 - h / 6} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- the fist close-up
// the clenched fist seen from the front: wrist, heel of the palm, and a scalloped row of four knuckles across the top
const FIST = 'M -200 150 L -212 -60 Q -214 -172 -150 -174 Q -100 -174 -98 -126 Q -96 -180 -48 -180 Q 0 -180 2 -130 Q 6 -182 52 -182 Q 100 -180 100 -130 Q 104 -178 150 -176 Q 214 -172 212 -60 L 200 150 Q 0 196 -200 150 Z';
const SLEEVE = '#2E2B3D';
const SLEEVE_SHADE = '#24212F';
const SKIN = '#F6EFE3';
const SKIN_SHADE = '#E2D3BE';
const LINE = '#121019';

/**
 * Huge close-up of Pip's fist, 1920 x 1080 screen space (no camera needed). From `clenchAt` the open hand curls shut and
 * trembles; the fist pulls back (anticipation) and at `thrustAt` thrusts at the lens in 3 frames, filling the frame. The
 * sleeve comes in from the lower side opposite `side`. `bg` draws a hot red radial backdrop with converging speed lines
 * (stronger on the thrust). Add <ImpactFlash t hitT={thrustAt + 3} x y /> and a BoomWord from the shot as needed.
 */
export const FistInsert: React.FC<{ t: number; id: string; clenchAt?: number; thrustAt?: number; side?: 1 | -1; bg?: boolean; cx?: number; cy?: number }> = ({
  t, id, clenchAt = 0, thrustAt = 40, side = 1, bg = true, cx = 960, cy = 590,
}) => {
  const c = easeInOut(clamp((t - clenchAt) / 14));
  const thrust = clamp((t - (thrustAt - 1)) / 3);
  const base = kf(t, [[clenchAt, 1.3], [thrustAt - 6, 1.1], [thrustAt - 1, 1.25]]);
  const sc = t < thrustAt - 1 ? base : lerp(1.25, 3.7, easeIn(thrust)) + (t > thrustAt + 2 ? 0.12 * clamp((t - thrustAt - 2) / 10) : 0);
  const trem = c > 0.6 && t < thrustAt - 1 ? 1 : 0;
  const tx = cx + (trem ? (rnd(3, Math.floor(t)) - 0.5) * 8 : 0) - side * 30 * thrust;
  const ty = cy + (trem ? (rnd(4, Math.floor(t)) - 0.5) * 8 : 0) + 40 * thrust;
  const open = 1 - c;
  // thumb: out to the side while open, then wrapped ACROSS the front of the fingers
  const thumbA = lerp(-70, -9, c);
  const thumbX = lerp(-250, -8, c);
  const thumbY = lerp(10, 62, c);
  return (
    <g>
      {bg ? (
        <g>
          <defs>
            <radialGradient id={`${id}fbg`} cx="50%" cy="52%" r="75%">
              <stop offset="0%" stopColor="#FF6B3D" />
              <stop offset="55%" stopColor="#B3202E" />
              <stop offset="100%" stopColor="#2A0B22" />
            </radialGradient>
          </defs>
          <rect x={-100} y={-100} width={2120} height={1280} fill={`url(#${id}fbg)`} />
          <SpeedLines t={t} cx={cx} cy={cy} n={64} rIn={Math.max(180, 520 - 400 * thrust)} rOut={1700} o={0.35 + 0.55 * clamp((t - clenchAt) / 24) + 0.1 * thrust} color={thrust > 0.3 ? '#FFF3C4' : '#FFFFFF'} seed={7} />
        </g>
      ) : null}
      <g transform={`translate(${tx} ${ty}) scale(${sc})`}>
        {/* wrist (skin) and the dark hoodie sleeve with a ribbed cuff, from the lower side away from `side` */}
        <g transform={`rotate(${side * -14} 0 150)`}>
          <rect x={-128} y={100} width={256} height={110} rx={30} fill={SKIN} stroke={LINE} strokeWidth={8} />
          <path d="M -180 160 L 180 160 L 290 1200 L -290 1200 Z" fill={SLEEVE} stroke={LINE} strokeWidth={8} strokeLinejoin="round" />
          <path d="M 70 160 L 180 160 L 290 1200 L 150 1200 Z" fill={SLEEVE_SHADE} opacity={0.7} />
          <path d="M -90 300 Q -40 370 -110 460 M 60 340 Q 110 420 50 510" stroke={SLEEVE_SHADE} strokeWidth={9} fill="none" strokeLinecap="round" />
          <rect x={-196} y={150} width={392} height={78} rx={20} fill="#3A3650" stroke={LINE} strokeWidth={8} />
          {[-150, -95, -40, 15, 70, 125].map((rx) => <path key={rx} d={`M ${rx} 160 L ${rx} 220`} stroke={LINE} strokeWidth={4} opacity={0.4} />)}
        </g>
        <g transform={`scale(${side} 1)`}>
          {/* fingers still straight up while the hand is open: they fold down behind the knuckle row as it clenches */}
          {open > 0.02
            ? [-150, -50, 50, 150].map((fx, i) => (
                <rect key={i} x={fx - 46} y={-175 - 230 * open} width={92} height={230 * open + 80} rx={44} fill={SKIN} stroke={LINE} strokeWidth={8} transform={`rotate(${(i - 1.5) * 8 * open} ${fx} -120)`} />
              ))
            : null}
          {/* the fist: one silhouette, a scalloped row of 4 knuckles on top */}
          <path d={FIST} fill={SKIN} stroke={LINE} strokeWidth={9} strokeLinejoin="round" />
          <path d="M 120 -150 Q 215 -150 212 -50 L 200 140 Q 150 168 90 170 Q 150 40 120 -150 Z" fill={SKIN_SHADE} opacity={0.75} />
          {/* finger segments folded into the palm: creases between the fingers and the second-knuckle row */}
          <g opacity={clamp(c * 1.6 - 0.4)} fill="none" stroke={LINE} strokeLinecap="round">
            <path d="M -100 -122 L -98 22 M 0 -126 L 2 26 M 100 -122 L 102 22" strokeWidth={7} />
            <path d="M -190 8 Q -150 -14 -108 8 M -92 12 Q -50 -12 -8 12 M 8 12 Q 50 -12 92 12 M 108 8 Q 150 -14 192 8" strokeWidth={6} />
            <path d="M -176 -70 Q -150 -82 -124 -70 M -76 -72 Q -50 -84 -24 -72 M 24 -72 Q 50 -84 76 -72 M 124 -70 Q 150 -82 176 -70" strokeWidth={4} opacity={0.5} />
          </g>
          {/* knuckle highlights */}
          <g stroke="#FFFFFF" strokeLinecap="round" fill="none" opacity={0.3 + 0.5 * c}>
            {[-150, -50, 50, 150].map((fx) => <path key={fx} d={`M ${fx - 30} -140 Q ${fx} -158 ${fx + 22} -146`} strokeWidth={9} />)}
          </g>
          {/* the thumb, wrapped across the front of the fingers (tip on the right when closed) */}
          <g transform={`translate(${thumbX} ${thumbY}) rotate(${thumbA})`}>
            <rect x={-150} y={-38} width={300} height={76} rx={38} fill={SKIN} stroke={LINE} strokeWidth={9} />
            <path d="M -150 4 Q -60 30 40 26" stroke={SKIN_SHADE} strokeWidth={14} fill="none" opacity={0.8} strokeLinecap="round" />
            <rect x={96} y={-22} width={44} height={44} rx={16} fill="none" stroke={LINE} strokeWidth={5} opacity={0.5} />
            <path d="M -20 -30 Q 30 -42 80 -30" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.55} />
            <path d="M 20 -34 Q 28 0 20 34" stroke={LINE} strokeWidth={5} fill="none" opacity={0.4} strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  );
};
