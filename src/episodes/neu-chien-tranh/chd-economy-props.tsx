import React from 'react';
import { clamp, easeOut, backOut, Glow, SCH, FONT, WallTexture } from '../../engine';

// Chapter D, year one: the economy beat's local props: the "KINH TẾ" balloon that goes flat, the tear-off calendar
// whose months fly away, and the GDP bars (one drops by about a third). Pure functions of the shot clock.

/** A dusk backdrop for the balloon: a plum-to-amber sky, a flat dark ground, a few far roofs. `id` must be unique. */
export const FlatDusk: React.FC<{ id: string; groundY?: number }> = ({ id, groundY = 900 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1E1740" />
        <stop offset="0.65" stopColor="#6A3A62" />
        <stop offset="1" stopColor="#D9825A" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={groundY + 400} fill={`url(#${id}sky)`} />
    <path d={`M -400 ${groundY} L -400 ${groundY - 70} L -120 ${groundY - 70} L -120 ${groundY - 120} L 200 ${groundY - 120} L 200 ${groundY - 60} L 520 ${groundY - 60} L 520 ${groundY - 150} L 760 ${groundY - 150} L 760 ${groundY - 80} L 1200 ${groundY - 80} L 1200 ${groundY - 130} L 1500 ${groundY - 130} L 1500 ${groundY - 70} L 2320 ${groundY - 70} L 2320 ${groundY} Z`} fill="#2A1B45" opacity={0.9} />
    <rect x={-400} y={groundY} width={2720} height={700} fill="#2B2030" />
    <rect x={-400} y={groundY} width={2720} height={5} fill="#FFC98A" opacity={0.35} />
  </g>
);

/**
 * A balloon labelled KINH TẾ on a string tied to a sandbag. `k` 1 = full, ~0.2 = flat and sagging; it sinks and wrinkles
 * as k falls, and air streams out of the neck while it is deflating. (x, y) = the full balloon's centre.
 */
export const Balloon: React.FC<{ x: number; y: number; k: number; t: number; groundY?: number }> = ({ x, y, k, t, groundY = 900 }) => {
  const R = 250;
  const sink = (1 - k) * 330;
  const r = R * (0.3 + 0.7 * k);
  const rx = r * 0.86;
  const ry = r;
  const cx = x + Math.sin(t / 5) * (1 - k) * 8;
  const cy = y + sink;
  const neckY = cy + ry;
  const leak = k < 0.97 && k > 0.24 ? 1 : 0;
  const sag = (1 - k) * 90;
  const wr = (1 - k) * 1.3;
  return (
    <g>
      <ellipse cx={x} cy={groundY + 18} rx={150} ry={22} fill="#000" opacity={0.35} />
      <path d={`M ${cx} ${neckY + 14} Q ${x - 60 + sag * 0.5} ${(neckY + groundY) / 2 + sag} ${x - 36} ${groundY - 30}`} stroke="#E9DEC6" strokeWidth={5} fill="none" strokeLinecap="round" />
      <rect x={x - 86} y={groundY - 44} width={100} height={52} rx={18} fill="#8A6A4A" stroke="#4A3220" strokeWidth={4} />
      <g transform={`translate(${cx} ${cy}) rotate(${Math.sin(t / 7) * 3 * (1 - k)})`}>
        <path d={`M 0 ${ry} L -16 ${ry + 26} L 16 ${ry + 26} Z`} fill="#B93C2E" />
        <path d={`M 0 ${-ry} C ${rx * 1.15} ${-ry} ${rx * 1.1} ${ry * 0.6} 0 ${ry} C ${-rx * 1.1} ${ry * 0.6} ${-rx * 1.15} ${-ry} 0 ${-ry} Z`} fill="#E5533F" stroke="#7A2218" strokeWidth={6} strokeLinejoin="round" />
        <path d={`M 0 ${-ry} C ${-rx * 1.15} ${-ry} ${-rx * 1.1} ${ry * 0.6} 0 ${ry} C ${-rx * 0.2} ${ry * 0.3} ${-rx * 0.1} ${-ry * 0.5} 0 ${-ry} Z`} fill="#FF8A6E" opacity={0.28} />
        <ellipse cx={-rx * 0.45} cy={-ry * 0.45} rx={rx * 0.1} ry={ry * 0.2} fill="#FFFFFF" opacity={0.4 * k} transform={`rotate(24 ${-rx * 0.45} ${-ry * 0.45})`} />
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M ${-rx * 0.8} ${-ry * 0.35 + i * ry * 0.4} q ${rx * 0.4} ${(i % 2 ? -1 : 1) * 26 * wr} ${rx * 0.8} 0 t ${rx * 0.8} 0`} stroke="#7A2218" strokeWidth={4} fill="none" opacity={clamp(wr * 0.9)} />
        ))}
        <text x={0} y={14 * (0.5 + k)} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80 * (0.45 + 0.55 * k)} fill="#FFF3DC" stroke="#5A1A12" strokeWidth={6} paintOrder="stroke" transform={`skewX(${Math.sin(t / 4) * 8 * wr})`}>KINH TẾ</text>
        {leak ? (
          <g stroke="#FFEFD8" strokeWidth={6} strokeLinecap="round" opacity={0.75}>
            {[0, 1, 2, 3].map((i) => {
              const ph = (((t * 0.09 + i / 4) % 1) + 1) % 1;
              return <path key={i} d={`M ${18 + ph * 120} ${ry + 24 + i * 8 + ph * 30} l ${26} ${4 + i * 3}`} opacity={1 - ph} />;
            })}
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** A tear-off calendar (x = centre, y = top). `p` = months torn so far (0..11.9): the page for month floor(p)+1 shows, older pages fly away. */
export const TearCalendar: React.FC<{ x: number; y: number; w?: number; p: number }> = ({ x, y, w = 560, p }) => {
  const h = w * 0.86;
  const cur = Math.min(12, Math.floor(p) + 1);
  const page = (n: number, key: string, tf = '', o = 1) => (
    <g key={key} transform={tf} opacity={o}>
      <rect x={-w / 2 + 10} y={14} width={w} height={h} rx={14} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={0} width={w} height={h} rx={14} fill="#F4EEDD" />
      <rect x={-w / 2} y={0} width={w} height={h * 0.2} rx={14} fill="#D9534F" />
      <rect x={-w / 2} y={h * 0.12} width={w} height={h * 0.08} fill="#D9534F" />
      <text x={0} y={h * 0.145} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.1} fill="#FFF3DC" letterSpacing={6}>THÁNG</text>
      <text x={0} y={h * 0.74} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w * 0.46} fill="#2A2438">{n}</text>
      {[-0.36, -0.12, 0.12, 0.36].map((d) => <circle key={d} cx={w * d} cy={-6} r={w * 0.024} fill="#3A3444" />)}
    </g>
  );
  const flyers = [cur - 1, cur - 2, cur - 3].filter((n) => n >= 1).map((n) => {
    const age = p - (n - 0.0) + 1; // how far since page n was torn
    const a = easeOut(clamp(age / 1.4));
    return page(n, `f${n}`, `translate(${a * 760} ${-a * 260 + a * a * 420}) rotate(${a * 38})`, 1 - clamp((age - 0.6) / 0.8));
  });
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-w / 2 - 20} y={-26} width={w + 40} height={34} rx={12} fill="#3A3444" />
      {page(cur, 'cur')}
      {flyers}
    </g>
  );
};

/** Two GDP bars on the blueprint: last year's stays full, this year's drops by `drop` (0..0.29) and the lost part shows dashed. */
export const GdpBars: React.FC<{ t: number; len: number }> = ({ t, len }) => {
  const H = 520;
  const base = 860;
  const grow = easeOut(clamp(t / 10));
  const drop = 0.29 * easeOut(clamp((t - 14) / 22));
  const h1 = H * grow;
  const h2 = H * grow * (1 - drop);
  const fall = easeOut(clamp((t - 14) / 22));
  return (
    <g>
      <path d={`M 440 ${base} H 1480`} stroke={SCH.line} strokeWidth={6} strokeLinecap="round" />
      <rect x={560} y={base - h1} width={260} height={h1} rx={10} fill={`${SCH.line}22`} stroke={SCH.line} strokeWidth={6} />
      <rect x={1100} y={base - h2} width={260} height={h2} rx={10} fill={`${SCH.live}33`} stroke={SCH.live} strokeWidth={6} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }} />
      {fall > 0 ? <rect x={1100} y={base - h1} width={260} height={h1 - h2} rx={10} fill="none" stroke={SCH.live} strokeWidth={4} strokeDasharray="16 12" opacity={0.8} /> : null}
      {fall > 0.1 ? <path d={`M 1480 ${base - h1} V ${base - h2 - 4} M 1458 ${base - h2 - 30} L 1480 ${base - h2 - 4} L 1502 ${base - h2 - 30}`} stroke={SCH.live} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      <path d={`M 440 ${base - H} H 1480`} stroke={SCH.dim} strokeWidth={3} strokeDasharray="10 12" opacity={0.6 * grow} />
      <text x={690} y={base + 66} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={SCH.line}>2021</text>
      <text x={1230} y={base + 66} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={SCH.live} opacity={easeOut(clamp((t - 6) / 6))}>2022</text>
      <text x={440} y={base - H - 28} fontFamily={FONT.ui} fontWeight={700} fontSize={60} fill={SCH.dim} letterSpacing={6} opacity={backOut(clamp(t / 8))}>GDP</text>
      <Glow x={1230} y={base - h2 / 2} r={360} o={0.18 * fall} />
    </g>
  );
};

/** A plain wall for the calendar insert: muted plum, faint texture, a warm lamp's glow. */
export const PlumWall: React.FC<{ glowX?: number; glowY?: number }> = ({ glowX = 1500, glowY = 300 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#2E2438" />
    <WallTexture rect={[-400, -400, 2720, 1880]} />
    <rect x={-400} y={930} width={2720} height={600} fill="#241B2A" />
    <rect x={-400} y={930} width={2720} height={6} fill="#FFC98A" opacity={0.3} />
    <Glow x={glowX} y={glowY} r={760} o={0.5} />
  </g>
);
