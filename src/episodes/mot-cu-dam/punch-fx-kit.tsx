import React from 'react';
import { FONT, rnd, clamp, easeOut, backOut } from '../../engine';


// PUNCH KIT, part 1: the fight effects. Part 2 (PunchPip, punchPose, punchFist, FistInsert) is in
// punch-pip-and-fist.tsx. Every piece is a pure function of the shot clock `t` (frames, 30 fps) and the hit
// frame `hitT`, so it plays backwards or held. All positions are world units (1920 x 1080), drawn INSIDE the
// camera group, so they zoom with the shot. Draw order: set, monster, effects, Pip, ImpactFlash, BoomWord.
//
//   <SpeedLines t cx cy n? rIn? rOut? o? color? seed? />          radial manga lines converging on (cx, cy); re-rolled every 2 f
//   <StreakLines t x y dir? n? len? spread? o? color? seed? />    parallel streaks trailing behind a thing moving along `dir` deg
//   <ImpactFlash t hitT x y r? full? />                           3-frame impact burst: white star, inverted ring, fading star
//   <Shockwave t hitT x y kind? r? len? color? />                 'air' rings or 'ground' (flat dust ellipses)
//   <Debris t hitT x y n? power? seed? groundY? dir? cone? colors? sparks? />   seeded chunks + sparks flying ballistically
//   <DustCloud t hitT x y n? r? len? color? seed? />              billowing puffs
//   <BoomWord t at x y size? text? rot? />                        comic "BÙM!" that pops in (stays on)
//   shakeAt(t, hitT, amp?, len?) -> {x, y}                        in-shot camera shake: translate(x y) on the camera group
//
// Hit timing recipe (one punch): fist lands at hitT: ImpactFlash(hitT..+2), Shockwave + Debris + DustCloud from hitT,
// BoomWord at hitT+2, shakeAt(t, hitT, 18, 12), plus the engine edit fx {"kind":"flash"} / {"kind":"shake"} if wanted.

const INK = '#16101A';

/** Radial manga speed lines converging on (cx, cy). Lines are thin wedges from rOut to rIn and re-roll every `step` frames. */
export const SpeedLines: React.FC<{ t: number; cx: number; cy: number; n?: number; rIn?: number; rOut?: number; o?: number; color?: string; seed?: number; step?: number }> = ({
  t, cx, cy, n = 56, rIn = 300, rOut = 1800, o = 0.85, color = '#FFFFFF', seed = 1, step = 2,
}) => {
  const k = Math.floor(t / step);
  return (
    <g opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const a = ((i + rnd(seed + k, i) * 0.8) / n) * Math.PI * 2;
        const r0 = rIn * (0.8 + 0.7 * rnd(seed + k + 7, i));
        const w = 0.012 + 0.03 * rnd(seed + k + 3, i);
        const [c, s] = [Math.cos(a), Math.sin(a)];
        const [c1, s1, c2, s2] = [Math.cos(a - w), Math.sin(a - w), Math.cos(a + w), Math.sin(a + w)];
        if (rnd(seed + k + 11, i) < 0.12) return null;
        return <polygon key={i} points={`${cx + c * r0},${cy + s * r0} ${cx + c1 * rOut},${cy + s1 * rOut} ${cx + c2 * rOut},${cy + s2 * rOut}`} fill={color} opacity={0.55 + 0.45 * rnd(seed + 5, i)} />;
      })}
    </g>
  );
};

/** Parallel motion streaks trailing behind a moving fist/body whose head is at (x, y) moving along `dir` degrees (0 = right). */
export const StreakLines: React.FC<{ t: number; x: number; y: number; dir?: number; n?: number; len?: number; spread?: number; o?: number; color?: string; seed?: number; thick?: number }> = ({
  t, x, y, dir = 0, n = 14, len = 600, spread = 150, o = 0.8, color = '#FFFFFF', seed = 2, thick = 7,
}) => {
  const k = Math.floor(t / 2);
  return (
    <g transform={`translate(${x} ${y}) rotate(${dir})`} opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const yy = (rnd(seed + k, i) * 2 - 1) * spread;
        const l = len * (0.35 + 0.65 * rnd(seed + k + 4, i));
        const off = 30 + rnd(seed + k + 9, i) * len * 0.35;
        const w = thick * (0.5 + rnd(seed + k + 2, i));
        return <polygon key={i} points={`${-off},${yy} ${-off - l},${yy - w * 0.15} ${-off},${yy - w}`} fill={color} opacity={0.5 + 0.5 * rnd(seed + 8, i)} />;
      })}
    </g>
  );
};

const spiky = (cx: number, cy: number, r: number, pts: number, seed: number, inner = 0.38) =>
  Array.from({ length: pts * 2 }).map((_, i) => {
    const a = (i / (pts * 2)) * Math.PI * 2 + rnd(seed, i) * 0.12;
    const rr = i % 2 ? r * inner * (0.7 + 0.6 * rnd(seed + 1, i)) : r * (0.65 + 0.35 * rnd(seed + 2, i));
    return `${cx + Math.cos(a) * rr},${cy + Math.sin(a) * rr}`;
  }).join(' ');

/** The impact frame: 3 frames from hitT. 0: white star with black spikes; 1: inverted (dark star + ring); 2: small yellow-white star. `full` (default false) adds the full-screen white/dark wash: opt in only for the biggest hits. */
export const ImpactFlash: React.FC<{ t: number; hitT: number; x: number; y: number; r?: number; full?: boolean }> = ({ t, hitT, x, y, r = 1100, full = false }) => {
  const h = Math.floor(t - hitT);
  if (h < 0 || h > 2) return null;
  const B = 6000;
  if (h === 0)
    return (
      <g>
        {full ? <rect x={x - B} y={y - B} width={2 * B} height={2 * B} fill="#FFFFFF" /> : null}
        <polygon points={spiky(x, y, r * 1.6, 22, 5, 0.12)} fill="#0B0710" opacity={0.9} />
        <polygon points={spiky(x, y, r * 1.05, 18, 9, 0.3)} fill="#FFFFFF" />
        <circle cx={x} cy={y} r={r * 0.34} fill="none" stroke="#0B0710" strokeWidth={r * 0.05} />
      </g>
    );
  if (h === 1)
    return (
      <g>
        {full ? <rect x={x - B} y={y - B} width={2 * B} height={2 * B} fill="#0B0710" opacity={0.92} /> : null}
        <polygon points={spiky(x, y, r * 1.0, 16, 14, 0.3)} fill="#FFFFFF" />
        <circle cx={x} cy={y} r={r * 0.52} fill="none" stroke="#0B0710" strokeWidth={r * 0.07} />
        <circle cx={x} cy={y} r={r * 0.6} fill="none" stroke="#FFFFFF" strokeWidth={r * 0.03} />
      </g>
    );
  return (
    <g opacity={0.8}>
      <polygon points={spiky(x, y, r * 0.5, 14, 21, 0.35)} fill="#FFF6C8" />
    </g>
  );
};

/** One thin expanding ring after the hit (r default 480, 20 frames). 'air': a circle; 'ground': a flat ellipse on the floor line y. */
export const Shockwave: React.FC<{ t: number; hitT: number; x: number; y: number; kind?: 'air' | 'ground'; r?: number; len?: number; color?: string }> = ({
  t, hitT, x, y, kind = 'air', r = 480, len = 20, color = '#FFFFFF',
}) => {
  const p = (t - hitT) / len;
  if (p < 0 || p >= 1) return null;
  const rr = r * easeOut(p);
  const sw = 8 * Math.pow(1 - p, 1.3) + 1.2;
  const o = 0.65 * Math.pow(1 - p, 1.8);
  // one thin ring per instance: use one 'air' and one 'ground' at most per hit
  return kind === 'air' ? (
    <circle cx={x} cy={y} r={rr} fill="none" stroke={color} strokeWidth={sw} opacity={o} />
  ) : (
    <ellipse cx={x} cy={y} rx={rr} ry={rr * 0.17} fill="none" stroke={color} strokeWidth={sw} opacity={o} />
  );
};

/** Seeded chunks (dark-outlined polygons) and bright sparks flying out ballistically; `groundY` makes them land and slide. dir -90 = up. */
export const Debris: React.FC<{ t: number; hitT: number; x: number; y: number; n?: number; power?: number; seed?: number; groundY?: number; dir?: number; cone?: number; colors?: string[]; sparks?: boolean }> = ({
  t, hitT, x, y, n = 26, power = 1, seed = 3, groundY, dir = -90, cone = 150, colors = ['#8A7F73', '#5C544B', '#B8AB9A', '#3A342E'], sparks = true,
}) => {
  const h = t - hitT;
  if (h < 0 || h > 90) return null;
  const g = 1.15;
  const pos = (px: number, py: number, vx: number, vy: number, hh: number) => {
    let yy = py + vy * hh + 0.5 * g * hh * hh;
    let xx = px + vx * hh;
    let landed = false;
    if (groundY !== undefined && yy > groundY) {
      // landing time: py + vy*tl + g/2*tl^2 = groundY
      const tl = (-vy + Math.sqrt(vy * vy + 2 * g * (groundY - py))) / g;
      xx = px + vx * tl + vx * 0.25 * Math.min(10, hh - tl);
      yy = groundY;
      landed = true;
    }
    return { x: xx, y: yy, landed };
  };
  const fade = clamp((90 - h) / 30);
  return (
    <g opacity={fade}>
      {Array.from({ length: n }).map((_, i) => {
        const a = ((dir + (rnd(seed, i) - 0.5) * cone) * Math.PI) / 180;
        const sp = (9 + rnd(seed + 1, i) * 24) * power;
        const q = pos(x, y, Math.cos(a) * sp, Math.sin(a) * sp, h);
        const sz = 5 + rnd(seed + 2, i) * 15 * (i % 6 === 0 ? 1.7 : 1);
        const rot = rnd(seed + 3, i) * 360 + (rnd(seed + 4, i) - 0.5) * 40 * (q.landed ? 0 : h);
        const pts = [0, 1, 2, 3, 4].map((k) => {
          const aa = (k / 5) * Math.PI * 2;
          const rr = sz * (0.6 + 0.5 * rnd(seed + 5 + k, i));
          return `${Math.cos(aa) * rr},${Math.sin(aa) * rr}`;
        });
        return <polygon key={i} transform={`translate(${q.x} ${q.y}) rotate(${rot})`} points={pts.join(' ')} fill={colors[i % colors.length]} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />;
      })}
      {sparks && h < 18
        ? Array.from({ length: Math.round(n * 0.9) }).map((_, i) => {
            const a = ((dir + (rnd(seed + 20, i) - 0.5) * (cone + 60)) * Math.PI) / 180;
            const sp = (18 + rnd(seed + 21, i) * 30) * power;
            const [vx, vy] = [Math.cos(a) * sp, Math.sin(a) * sp];
            const q = pos(x, y, vx, vy, h);
            const L = Math.min(40, 10 + sp * 0.9) * (1 - h / 18);
            const m = Math.hypot(vx, vy + g * h) || 1;
            return <line key={`s${i}`} x1={q.x} y1={q.y} x2={q.x - ((vx / m) * L)} y2={q.y - (((vy + g * h) / m) * L)} stroke={i % 2 ? '#FFE27A' : '#FFFFFF'} strokeWidth={5} strokeLinecap="round" />;
          })
        : null}
    </g>
  );
};

/** Billowing dust puffs rising from (x, y) (on the ground line): they swell, drift outward and up, and fade over `len` frames. */
export const DustCloud: React.FC<{ t: number; hitT: number; x: number; y: number; n?: number; r?: number; len?: number; color?: string; seed?: number }> = ({
  t, hitT, x, y, n = 16, r = 120, len = 70, color = '#A89C8E', seed = 4,
}) => {
  const p = (t - hitT) / len;
  if (p < 0 || p >= 1) return null;
  const e = easeOut(p);
  return (
    <g opacity={0.95 * Math.pow(1 - p, 1.2)}>
      {Array.from({ length: n }).map((_, i) => {
        const side = rnd(seed, i) * 2 - 1;
        const rr = r * (0.55 + 0.7 * rnd(seed + 1, i)) * (0.35 + 0.95 * e);
        const cx = x + side * r * (1.3 + 3.4 * e);
        const cy = y - (rnd(seed + 2, i) * 0.6 + 0.4) * r * 1.7 * e - rr * 0.35;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={rr} fill={i % 3 ? color : '#8E8274'} />
            <circle cx={cx - rr * 0.18} cy={cy - rr * 0.25} r={rr * 0.6} fill="#BBAF9F" />
          </g>
        );
      })}
    </g>
  );
};

/** Comic onomatopoeia: pops in at frame `at` with overshoot and a tilt, jitters for 8 frames, then wobbles to rest. Stays on after. */
export const BoomWord: React.FC<{ t: number; at: number; x: number; y: number; size?: number; text?: string; rot?: number }> = ({ t, at, x, y, size = 300, text = 'BÙM!', rot = -7 }) => {
  const h = t - at;
  if (h < 0) return null;
  const pop = h < 6 ? backOut(clamp(h / 6)) : 1 + 0.035 * Math.sin((h - 6) * 0.8) * Math.exp(-(h - 6) / 14);
  const jx = h < 8 ? (rnd(9, h) - 0.5) * 14 : 0;
  const jy = h < 8 ? (rnd(10, h) - 0.5) * 14 : 0;
  const sw = size * 0.1;
  const st = { fontFamily: FONT.title, fontWeight: 800, fontSize: size, textAnchor: 'middle' as const, strokeLinejoin: 'round' as const, paintOrder: 'stroke' as const };
  return (
    <g transform={`translate(${x + jx} ${y + jy}) rotate(${rot}) scale(${pop})`}>
      <polygon points={spiky(0, -size * 0.3, size * 1.15, 14, 33, 0.62)} fill="#E5322D" stroke={INK} strokeWidth={sw * 0.6} strokeLinejoin="round" opacity={0.96} />
      <polygon points={spiky(0, -size * 0.3, size * 0.85, 12, 35, 0.66)} fill="#FF8A3D" opacity={0.95} />
      <text x={size * 0.045} y={size * 0.05} {...st} fill="#E5322D" stroke={INK} strokeWidth={sw}>{text}</text>
      <text x={0} y={0} {...st} fill="#FFD23F" stroke={INK} strokeWidth={sw}>{text}</text>
      <text x={0} y={0} {...st} fill="#FFD23F" stroke="none">{text}</text>
    </g>
  );
};

/** In-shot camera shake after a hit: add to the camera translate, or wrap the whole shot in <g transform={`translate(${s.x} ${s.y})`}>. Deterministic; 0 outside [hitT, hitT+len). */
export const shakeAt = (t: number, hitT: number, amp = 16, len = 12): { x: number; y: number } => {
  const h = t - hitT;
  if (h < 0 || h >= len) return { x: 0, y: 0 };
  const d = Math.pow(1 - h / len, 1.5);
  return { x: Math.sin(h * 2.9 + 1) * amp * d, y: Math.cos(h * 3.7) * amp * 0.7 * d };
};

