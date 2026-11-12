import React from 'react';
import { SCH, FONT, clamp, easeOut, easeInOut, backOut, kf } from '../../engine';

// Chapter D props, part 1: the sonic-boom science. Schematic pieces (dark blueprint ground, cream lines, orange live
// value). All pure functions of the shot clock t (30 fps), drawn in 1920 x 1080 screen units.
//
//   <SpeedDial x y r v vMax? mark? />          half-circle speedometer; needle at v (m/s); a red mark line at `mark`
//   <SpeedBars t y />                           boxer 9 m/s bar vs Pip's bar running off screen, "x37"
//   <MachWaves t x y c v n? mach? />            object moving right at speed v with circular sound waves; cone when v > c
//   <Whip t hx hy p L? />                       whip held at (hx, hy); p 0..1 plays wind-up -> loop runs to the tip (crack at 1)
//   <CrackWord t at x y />                      "CHÁT!" comic word that pops in at frame `at`

const INK = '#16101A';

export const SpeedDial: React.FC<{ x: number; y: number; r: number; v: number; vMax?: number; mark?: number; over?: number }> = ({ x, y, r, v, vMax = 400, mark = 343, over = 0 }) => {
  const ang = (val: number) => -180 + 180 * clamp(val / vMax); // degrees, -180 = left, 0 = right
  const pt = (val: number, rr: number) => {
    const a = (ang(val) * Math.PI) / 180;
    return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
  };
  const arc = (v0: number, v1: number, rr: number) => `M ${pt(v0, rr)} A ${rr} ${rr} 0 0 1 ${pt(v1, rr)}`;
  const ticks = Array.from({ length: 9 }).map((_, i) => i * 50);
  const needleA = ang(v);
  return (
    <g>
      <path d={arc(0, vMax, r)} stroke={SCH.dim} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={arc(0, Math.max(0.1, Math.min(v, vMax)), r)} stroke={v > mark ? '#FF5A4A' : SCH.live} strokeWidth={14} fill="none" strokeLinecap="round" />
      {ticks.map((tv) => (
        <g key={tv}>
          <line x1={x + Math.cos((ang(tv) * Math.PI) / 180) * (r - 22)} y1={y + Math.sin((ang(tv) * Math.PI) / 180) * (r - 22)} x2={x + Math.cos((ang(tv) * Math.PI) / 180) * (r - 46)} y2={y + Math.sin((ang(tv) * Math.PI) / 180) * (r - 46)} stroke={SCH.line} strokeWidth={5} />
          <text x={x + Math.cos((ang(tv) * Math.PI) / 180) * (r - 78)} y={y + Math.sin((ang(tv) * Math.PI) / 180) * (r - 78) + 10} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill={SCH.dim}>{tv}</text>
        </g>
      ))}
      {/* the speed-of-sound mark */}
      <line x1={x + Math.cos((ang(mark) * Math.PI) / 180) * (r - 30)} y1={y + Math.sin((ang(mark) * Math.PI) / 180) * (r - 30)} x2={x + Math.cos((ang(mark) * Math.PI) / 180) * (r + 40)} y2={y + Math.sin((ang(mark) * Math.PI) / 180) * (r + 40)} stroke="#FF5A4A" strokeWidth={9} strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${needleA})`}>
        <path d={`M -16 -10 L ${r - 34} 0 L -16 10 Z`} fill="#FFF3DC" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      </g>
      <circle cx={x} cy={y} r={26} fill="#FFF3DC" stroke={INK} strokeWidth={5} />
      {over > 0 ? <circle cx={x + Math.cos((ang(mark) * Math.PI) / 180) * (r + 10)} cy={y + Math.sin((ang(mark) * Math.PI) / 180) * (r + 10)} r={30 + 150 * easeOut(over)} fill="none" stroke="#FF5A4A" strokeWidth={10 * (1 - over)} opacity={1 - over} /> : null}
    </g>
  );
};

/** Two speed bars: the boxer's 9 m/s sliver and Pip's bar that never ends. Scale 4.4 px per m/s. */
export const SpeedBars: React.FC<{ t: number; y: number }> = ({ t, y }) => {
  const k = 4.4;
  const boxer = 9 * k * easeOut(clamp(t / 10));
  const pip = kf(t, [[6, 0], [30, 343 * k + 700]], easeInOut);
  const x0 = 220;
  return (
    <g>
      <text x={x0} y={y - 76} fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} letterSpacing={2}>NHÀ VÔ ĐỊCH QUYỀN ANH · 9 m/s</text>
      <rect x={x0} y={y - 56} width={boxer} height={48} rx={10} fill={SCH.line} />
      <text x={x0} y={y + 140} fontFamily={FONT.ui} fontSize={34} fill={SCH.live} letterSpacing={2}>NẮM ĐẤM CỦA BẠN · 343 m/s</text>
      <rect x={x0} y={y + 160} width={Math.min(pip, 2200)} height={78} rx={12} fill={SCH.live} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow})` }} />
      {/* the speed-of-sound line */}
      <path d={`M ${x0 + 343 * k} ${y - 100} V ${y + 280}`} stroke="#FF5A4A" strokeWidth={5} strokeDasharray="14 12" />
      <text x={x0 + 343 * k} y={y + 330} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FF5A4A">ÂM THANH</text>
      {t >= 22 ? (
        <g transform={`translate(1500 ${y + 80}) scale(${backOut(clamp((t - 22) / 8))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#FFD23F" stroke={INK} strokeWidth={14} paintOrder="stroke" strokeLinejoin="round" transform="rotate(-5)">x37</text>
        </g>
      ) : null}
    </g>
  );
};

/** Sound waves around a body moving right at speed v (px/frame); the waves travel at c px/frame. v > c draws the Mach cone. */
export const MachWaves: React.FC<{ t: number; x: number; y: number; c: number; v: number; n?: number; cone?: number; label?: string; body?: boolean }> = ({ t, x, y, c, v, n = 12, cone = 1, label, body = true }) => {
  const step = 7;
  const supers = v > c;
  const waves = Array.from({ length: n }).map((_, i) => {
    const age = (i + 1) * step + (t % step);
    return { cx: x - v * age, r: c * age, o: clamp(1 - age / (step * n)) };
  });
  const sinA = c / v;
  const L = 1400;
  const ca = Math.asin(Math.min(1, sinA));
  return (
    <g>
      {waves.map((w, i) => (
        <circle key={i} cx={w.cx} cy={y} r={w.r} fill="none" stroke="#7FD4FF" strokeWidth={5} opacity={0.75 * w.o} />
      ))}
      {supers && cone > 0 ? (
        <g opacity={cone}>
          <polygon points={`${x},${y} ${x - Math.cos(ca) * L},${y - Math.sin(ca) * L} ${x - Math.cos(ca) * L},${y + Math.sin(ca) * L}`} fill="#7FD4FF" opacity={0.14} />
          <path d={`M ${x - Math.cos(ca) * L} ${y - Math.sin(ca) * L} L ${x} ${y} L ${x - Math.cos(ca) * L} ${y + Math.sin(ca) * L}`} stroke="#FFF3DC" strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 12px #7FD4FF)' }} />
        </g>
      ) : null}
      {/* the fist: a rounded block with knuckle ticks, nose to the right */}
      {body ? <g transform={`translate(${x} ${y})`}>
        <rect x={-62} y={-44} width={92} height={88} rx={26} fill="#F6EFE3" stroke={INK} strokeWidth={6} />
        <path d="M 6 -30 v 22 M 6 -4 v 22 M 6 20 v 14" stroke={INK} strokeWidth={4} opacity={0.45} strokeLinecap="round" />
        <path d="M -62 -22 L -140 -22 L -140 22 L -62 22 Z" fill="#2E2B3D" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g> : null}
      {label ? <text x={x - 520} y={y - 330} fontFamily={FONT.ui} fontSize={40} fill={SCH.line} letterSpacing={3}>{label}</text> : null}
    </g>
  );
};

/** A whip from the hand at (hx, hy) pointing right. p: 0 coiled back, then a hairpin loop runs to the tip; p >= 1 the tip has cracked. */
export const Whip: React.FC<{ t: number; hx: number; hy: number; p: number; L?: number; sag?: number }> = ({ t, hx, hy, p, L = 900, sag = 0.1 }) => {
  const N = 90;
  const u = p < 1 ? 0.04 + 1.0 * easeInOut(clamp(p)) : 1.2;
  const w = 0.1;
  let x = hx;
  let y = hy;
  const pts: string[] = [`${x},${y}`];
  const seg = L / N;
  for (let i = 0; i < N; i++) {
    const s = i / N;
    const k = clamp((s - u) / w + 0.5);
    const th = Math.PI * (k * k * (3 - 2 * k)) * 0.93 + sag * (1 - k) * s - 0.18 * (1 - s) * (1 - k);
    x += Math.cos(th) * seg;
    y += Math.sin(th) * seg;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  const flick = p >= 1 ? Math.sin(t * 2.2) * 6 : 0;
  return (
    <g transform={`translate(0 ${flick})`}>
      <polyline points={pts.join(' ')} fill="none" stroke={INK} strokeWidth={25} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.join(' ')} fill="none" stroke="#B8793F" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={pts.slice(0, 22).join(' ')} fill="none" stroke="#D99A5B" strokeWidth={3} strokeLinecap="round" />
      {/* the handle and the hand's fist round it */}
      <rect x={hx - 150} y={hy - 17} width={160} height={34} rx={14} fill="#5A3A22" stroke={INK} strokeWidth={5} />
      <ellipse cx={hx - 24} cy={hy} rx={44} ry={40} fill="#F6EFE3" stroke={INK} strokeWidth={6} />
      <path d={`M ${hx - 44} ${hy - 22} v 44 M ${hx - 24} ${hy - 26} v 52 M ${hx - 4} ${hy - 22} v 44`} stroke={INK} strokeWidth={3} opacity={0.4} />
      <path d={`M ${hx - 66} ${hy + 8} L ${hx - 320} ${hy + 40} L ${hx - 320} ${hy + 130} L ${hx - 66} ${hy + 60} Z`} fill="#2E2B3D" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    </g>
  );
};

/** "CHÁT!" pops in at frame `at` (backOut, jitter 6 frames). */
export const CrackWord: React.FC<{ t: number; at: number; x: number; y: number; size?: number; text?: string; rot?: number }> = ({ t, at, x, y, size = 190, text = 'CHÁT!', rot = -8 }) => {
  const h = t - at;
  if (h < 0) return null;
  const s = backOut(clamp(h / 5));
  const j = h < 6 ? [(((h * 7) % 5) - 2) * 4, (((h * 3) % 5) - 2) * 4] : [0, 0];
  return (
    <g transform={`translate(${x + j[0]} ${y + j[1]}) rotate(${rot}) scale(${s})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#E5322D" stroke={INK} strokeWidth={size * 0.1} strokeLinejoin="round" paintOrder="stroke" transform="translate(8 8)">{text}</text>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#FFD23F" stroke={INK} strokeWidth={size * 0.1} strokeLinejoin="round" paintOrder="stroke">{text}</text>
    </g>
  );
};
