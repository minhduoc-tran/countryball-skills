import React from 'react';
import { clamp, lerp, easeInOut, easeOut, rnd, mixHex } from '../../engine';

// STORM SKY: the big-sky monsters of the punch episode. All pure functions of t, drawn in 1920 x 1080 world units.
//
//   <CloudDeck t id split? tearX? base? city? />
//       A heavy dark cloud ceiling over a night-lit city skyline filling the frame (draw it as the whole backdrop).
//       split 0..1: the deck tears in two along a jagged line at x = tearX, the halves swing apart, a gold-edged
//       column of sunlight and blue sky opens, the city warms up and its windows go out. base = y of the cloud
//       underside (500). city false = no skyline (sky only). 0 = intact, 1 = fully open.
//   <TyphoonSpiral t id cx? cy? R? hole? spin? bg? />
//       A huge spiral storm seen from below, six arms turning (spin = degrees per frame, default 0.9). hole 0..1 is
//       how open the eye is: 0 a small dark eye, 1 a big hole of blue sky with sunbeams. Drive it with
//       holeCycle(t, at, open?, hold?, close?) = open, hold, then close again.
//   <Rain t intensity? slant? seed? x0? x1? y0? y1? color? />
//       A layer of slanted rain streaks (intensity 0..2; 1 = about 170 streaks), two depth layers. Draw above the sky.
//   holeCycle(t, at, open = 14, hold = 40, close = 26) -> 0..1..0

const INK = '#0F1220';

/** 0 -> 1 over `open` frames from `at`, holds for `hold`, then back to 0 over `close`. */
export const holeCycle = (t: number, at: number, open = 14, hold = 40, close = 26) =>
  t < at + open ? easeOut(clamp((t - at) / open)) : t < at + open + hold ? 1 : easeInOut(1 - clamp((t - at - open - hold) / close));

const jag = (y: number, k = 1) => (rnd(41, Math.round(y / 60)) - 0.5) * 70 * k;

export const CloudDeck: React.FC<{ t: number; id: string; split?: number; tearX?: number; base?: number; city?: boolean }> = ({ t, id, split = 0, tearX = 960, base = 500, city = true }) => {
  const s = clamp(split);
  const open = easeOut(s);
  const edge = Array.from({ length: 24 }).map((_, i) => ({ x: tearX + jag(-120 + i * 60), y: -120 + i * 60 }));
  const left = `M -3000 -400 L ${edge.map((p) => `${p.x} ${p.y}`).join(' L ')} L -3000 1400 Z`;
  const right = `M 5000 -400 L ${edge.map((p) => `${p.x} ${p.y}`).join(' L ')} L 5000 1400 Z`;
  const col = (c: string, k: number) => mixHex(c, '#8FA0BF', s * k);
  const lightning = s < 0.05 && ((t % 83) < 2 || (t % 83) === 4 || (t + 40) % 131 < 1);
  // the cloud mass: five rows of lumpy puffs from the dark top down to a heavy underside; each puff has a lit top-left
  // crescent and a shaded underside. x spans the whole frame so both halves (clipped) carry their share.
  const rows = 5;
  const deck = (
    <g>
      <rect x={-300} y={-700} width={2600} height={base - 380 + 700} fill={col('#1B2133', 0.7)} />
      {Array.from({ length: rows }).map((_, L) => (
        <g key={L}>
          {Array.from({ length: 19 }).map((__, j) => {
            const k = L / (rows - 1);
            const r = 130 + rnd(70 + L, j) * 110 + k * 30;
            const px = -120 + j * 118 + (rnd(50 + L, j) - 0.5) * 90 + (L % 2) * 50;
            const py = base - 440 + k * 440 + Math.sin(j * 1.3 + L * 2) * 38 + (rnd(60 + L, j) - 0.5) * 50 + Math.sin(t * 0.02 + j + L) * 5;
            const body = col(['#34405A', '#2B3550', '#232C44', '#1B2338', '#131828'][L], 0.75);
            const lit = col(['#4A587A', '#3E4B6B', '#33405E', '#2A354F', '#1E2740'][L], 0.85);
            return (
              <g key={j}>
                <circle cx={px} cy={py} r={r} fill={body} />
                <path d={`M ${px - r * 0.86} ${py - r * 0.3} A ${r} ${r} 0 0 1 ${px + r * 0.2} ${py - r * 0.98} A ${r * 0.9} ${r * 0.9} 0 0 0 ${px - r * 0.86} ${py - r * 0.3} Z`} fill={lit} />
                <ellipse cx={px + r * 0.1} cy={py + r * 0.78} rx={r * 0.8} ry={r * 0.2} fill="#0B0E1A" opacity={0.28} />
              </g>
            );
          })}
        </g>
      ))}
    </g>
  );
  const skyline = () => {
    const bl = 1000;
    return (
      <g>
        {Array.from({ length: 22 }).map((_, i) => {
          const bw = 70 + rnd(81, i) * 70;
          const bx = -60 + i * 96 + (rnd(82, i) - 0.5) * 30;
          const bh = 230 + rnd(83, i) * 360;
          return (
            <g key={i}>
              <rect x={bx} y={bl - bh} width={bw} height={bh + 90} fill={mixHex('#10131F', '#3A4766', s)} stroke={INK} strokeWidth={4} />
              <rect x={bx + bw * 0.7} y={bl - bh} width={bw * 0.3} height={bh + 90} fill={mixHex('#0B0D17', '#F2B36A', s * 0.85)} opacity={0.5 + 0.4 * s} />
              {Array.from({ length: 9 }).map((__, k) => (
                <rect key={k} x={bx + 10 + (k % 3) * (bw / 3.4)} y={bl - bh + 24 + Math.floor(k / 3) * 56 + (i % 2) * 14} width={bw / 6} height={18} fill="#FFC864" opacity={(rnd(84 + k, i) < 0.55 ? 0.8 : 0.1) * (1 - s * 0.9)} />
              ))}
            </g>
          );
        })}
        <rect x={-100} y={bl + 40} width={2200} height={200} fill={mixHex('#0A0C14', '#2C3850', s)} />
      </g>
    );
  };
  const gapW = 40 + 130 * open;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B9BEA" />
          <stop offset="60%" stopColor="#8FD0FA" />
          <stop offset="100%" stopColor="#F6E9C4" />
        </linearGradient>
        <linearGradient id={`${id}beam`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6C8" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#FFE08A" stopOpacity={0.28} />
        </linearGradient>
        <clipPath id={`${id}cl`}><path d={left} /></clipPath>
        <clipPath id={`${id}cr`}><path d={right} /></clipPath>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1700} fill={`url(#${id}sky)`} />
      {/* soft white clouds in the opened sky */}
      {[[420, 330, 150], [1480, 280, 170], [1120, 560, 120], [700, 600, 110]].map(([cx, cy, r], i) => (
        <g key={i} opacity={clamp(s * 2 - 0.4)}>
          <ellipse cx={cx} cy={cy} rx={r * 1.5} ry={r * 0.45} fill="#FFFFFF" opacity={0.85} />
          <ellipse cx={cx + r * 0.3} cy={cy - r * 0.28} rx={r * 0.8} ry={r * 0.4} fill="#FFFFFF" />
        </g>
      ))}
      <circle cx={tearX} cy={250} r={90 + 80 * open} fill="#FFF8D6" opacity={clamp(s * 3)} />
      <circle cx={tearX} cy={250} r={360} fill="#FFE9A8" opacity={0.25 * clamp(s * 3)} />
      {/* the storm's gloom under the deck fades as the sky opens */}
      <rect x={-300} y={-300} width={2520} height={1700} fill="#18203A" opacity={0.92 * Math.pow(1 - s, 1.6)} />
      {/* the column of sunlight */}
      {s > 0.02 ? <polygon points={`${tearX - gapW * 0.5},-100 ${tearX + gapW * 0.5},-100 ${tearX + gapW * 1.8 + 260 * open},1000 ${tearX - gapW * 1.8 - 260 * open},1000`} fill={`url(#${id}beam)`} opacity={clamp(s * 2.5)} /> : null}
      {city ? skyline() : null}
      {s > 0.02 && city ? <polygon points={`${tearX - gapW * 0.5},-100 ${tearX + gapW * 0.5},-100 ${tearX + gapW * 1.8 + 260 * open},1000 ${tearX - gapW * 1.8 - 260 * open},1000`} fill="#FFE9A8" opacity={0.22 * clamp(s * 2.5)} /> : null}
      {/* the two halves of the deck, swung apart */}
      <g transform={`translate(${-open * 800} ${open * -30}) rotate(${-open * 6} -300 -200)`}>
        <g clipPath={`url(#${id}cl)`}>{deck}</g>
        <polyline points={edge.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#FFD98A" strokeWidth={12} strokeLinejoin="round" opacity={clamp(s * 3) * 0.95} />
      </g>
      <g transform={`translate(${open * 800} ${open * -30}) rotate(${open * 6} 2220 -200)`}>
        <g clipPath={`url(#${id}cr)`}>{deck}</g>
        <polyline points={edge.map((p) => `${p.x},${p.y}`).join(' ')} fill="none" stroke="#FFD98A" strokeWidth={12} strokeLinejoin="round" opacity={clamp(s * 3) * 0.95} />
      </g>
      {lightning ? <rect x={-300} y={-300} width={2520} height={1700} fill="#CFE0FF" opacity={0.22} /> : null}
    </g>
  );
};

export const TyphoonSpiral: React.FC<{ t: number; id: string; cx?: number; cy?: number; R?: number; hole?: number; spin?: number; bg?: boolean }> = ({ t, id, cx = 960, cy = 540, R = 1100, hole = 0, spin = 0.9, bg = true }) => {
  const h = clamp(hole);
  const rIn = lerp(0.07, 0.36, easeOut(h)) * R;
  const N = 5;
  const ang0 = -t * spin;
  // every arm is a chain of lumpy puffs along a logarithmic spiral; inner puffs are drawn last (on top)
  const puffs: { x: number; y: number; r: number; k: number }[] = [];
  for (let a = 0; a < N; a++) {
    const jitterA = (rnd(95, a) - 0.5) * 22;
    for (let i = 0; i < 46; i++) {
      const f = i / 45;
      const r = rIn * 1.04 + (R * 1.4 - rIn * 1.04) * Math.pow(f, 1.1);
      const th = ((ang0 + (a * 360) / N + jitterA) * Math.PI) / 180 + 2.3 * Math.log(r / (rIn * 1.04 + 40));
      const lat = (rnd(96 + a, i) - 0.5) * (14 + r * 0.07);
      const px = cx + Math.cos(th) * r - Math.sin(th) * lat;
      const py = cy + (Math.sin(th) * r + Math.cos(th) * lat) * 0.82;
      puffs.push({ x: px, y: py, r: (26 + r * 0.14) * (0.75 + 0.6 * rnd(97 + a, i)), k: rnd(98 + a, i) });
    }
  }
  puffs.sort((p, q) => Math.hypot(q.x - cx, q.y - cy) - Math.hypot(p.x - cx, p.y - cy));
  return (
    <g>
      <defs>
        <radialGradient id={`${id}bg`} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#141A30" />
          <stop offset="100%" stopColor="#05070F" />
        </radialGradient>
        <radialGradient id={`${id}eye`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={mixHex('#0A0D18', '#FFF3B8', h)} />
          <stop offset="55%" stopColor={mixHex('#0A0D18', '#9ADAFF', h)} />
          <stop offset="100%" stopColor={mixHex('#10142A', '#3C9BE8', h)} />
        </radialGradient>
      </defs>
      {bg ? <rect x={-300} y={-300} width={2520} height={1700} fill={`url(#${id}bg)`} /> : null}
      {puffs.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.r} fill={p.k < 0.5 ? '#35426A' : '#2C3858'} />
          <path d={`M ${p.x - p.r * 0.85} ${p.y - p.r * 0.35} A ${p.r} ${p.r} 0 0 1 ${p.x + p.r * 0.3} ${p.y - p.r * 0.95} A ${p.r * 0.9} ${p.r * 0.9} 0 0 0 ${p.x - p.r * 0.85} ${p.y - p.r * 0.35} Z`} fill={p.k < 0.3 ? '#9AA9CC' : '#6A7AA3'} />
        </g>
      ))}
      {/* the eye */}
      <ellipse cx={cx} cy={cy} rx={rIn * 0.98} ry={rIn * 0.98 * 0.82} fill={`url(#${id}eye)`} />
      {h > 0.15
        ? Array.from({ length: 16 }).map((_, i) => {
            const th = (i / 16) * Math.PI * 2 + t * 0.01;
            const w = 0.05;
            return <polygon key={i} points={`${cx},${cy} ${cx + Math.cos(th - w) * R * 1.3},${cy + Math.sin(th - w) * R * 1.3} ${cx + Math.cos(th + w) * R * 1.3},${cy + Math.sin(th + w) * R * 1.3}`} fill="#FFF3B8" opacity={0.13 * clamp((h - 0.15) * 2)} />;
          })
        : null}
      {/* ragged eye wall over the edge of the hole */}
      {Array.from({ length: 26 }).map((_, i) => {
        const th = (i / 26) * Math.PI * 2 + (ang0 * Math.PI) / 180;
        const rr = rIn * (0.14 + 0.2 * rnd(94, i)) + 10;
        const rad = rIn * (0.98 + 0.1 * rnd(99, i));
        const px = cx + Math.cos(th) * rad;
        const py = cy + Math.sin(th) * rad * 0.82;
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={rr} fill="#2E3856" />
            <circle cx={px - rr * 0.2} cy={py - rr * 0.3} r={rr * 0.62} fill={i % 3 ? '#56648A' : '#7482A6'} />
          </g>
        );
      })}
    </g>
  );
};

export const Rain: React.FC<{ t: number; intensity?: number; slant?: number; seed?: number; x0?: number; x1?: number; y0?: number; y1?: number; color?: string }> = ({
  t, intensity = 1, slant = 0.28, seed = 1, x0 = -300, x1 = 2220, y0 = -120, y1 = 1200, color = '#D4E4FF',
}) => {
  const n = Math.round(170 * Math.max(0, intensity));
  const H = y1 - y0;
  return (
    <g strokeLinecap="round">
      {Array.from({ length: n }).map((_, i) => {
        const d = rnd(seed + 1, i);
        const len = 40 + d * 90;
        const y = y0 + ((rnd(seed + 2, i) * H + t * (30 + d * 36)) % H);
        const x = x0 + rnd(seed + 3, i) * (x1 - x0 + H * slant) - slant * (y - y0) + H * slant * 0.5;
        return <line key={i} x1={x} y1={y} x2={x + slant * len} y2={y - len} stroke={color} strokeWidth={1.5 + d * 3} opacity={0.14 + d * 0.42} />;
      })}
    </g>
  );
};
