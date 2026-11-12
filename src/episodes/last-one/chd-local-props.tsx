import React from 'react';
import { Glow, FONT, rnd, clamp } from '../../engine';

// Chapter D's own props, drawn in the engine's style (flat fills, a darker side away from the light, a warm rim on the
// lit edge, a contact shadow): a candle with a flickering flame and its smoke, the expired birthday cake with its
// crumpled HẾT HẠN sticker, a camera-phone propped on books (REC dot, timer) and its screen seen from the front.

// ---------- Candle: base centre at (x, y); `flame` 0..1 scales the flame (0 = unlit), `glow` the pool of light ----------
export const Candle: React.FC<{ x: number; y: number; t: number; s?: number; h?: number; flame?: number; glow?: number; seed?: number; wick?: boolean; lean?: number }> = ({
  x, y, t, s = 1, h = 40, flame = 1, glow = 1, seed = 0, wick = true, lean = 0,
}) => {
  const w = 14 * s;
  const hh = h * s;
  const top = y - hh;
  const fl = (Math.sin(t / 2.7 + seed) * 2.2 + Math.sin(t / 1.3 + seed * 2) * 1.0) * s * flame + lean * s;
  const fh = 34 * s * flame;
  const fw = 9 * s * flame;
  return (
    <g>
      <ellipse cx={x + w * 0.5} cy={y + 2 * s} rx={w * 1.5} ry={w * 0.34} fill="#000" opacity={0.4} />
      <rect x={x - w / 2} y={top} width={w} height={hh} rx={2 * s} fill="#E7DCC4" />
      <rect x={x + w * 0.12} y={top} width={w * 0.38} height={hh} rx={2 * s} fill="#C4B491" />
      {flame > 0 ? <rect x={x - w / 2} y={top} width={w * 0.2} height={hh} fill="#FFD9A0" opacity={0.7} /> : null}
      <ellipse cx={x} cy={top} rx={w / 2} ry={w * 0.2} fill="#F2E8D2" />
      {wick ? <path d={`M ${x} ${top} q ${1 * s} ${-5 * s} ${fl * 0.2} ${-8 * s}`} stroke="#2A2220" strokeWidth={2 * s} fill="none" strokeLinecap="round" /> : null}
      {flame > 0 ? (
        <g>
          <Glow x={x} y={top - 16 * s} r={(170 + 90 * glow) * s} o={0.55 * glow * flame} />
          <path d={`M ${x} ${top - 6 * s} Q ${x - fw * 1.2} ${top - 6 * s - fh * 0.4} ${x + fl} ${top - 6 * s - fh} Q ${x + fw * 1.2} ${top - 6 * s - fh * 0.4} ${x} ${top - 6 * s} Z`} fill="#FF9F3A" />
          <path d={`M ${x} ${top - 6 * s} Q ${x - fw * 0.6} ${top - 6 * s - fh * 0.3} ${x + fl * 0.6} ${top - 6 * s - fh * 0.62} Q ${x + fw * 0.6} ${top - 6 * s - fh * 0.3} ${x} ${top - 6 * s} Z`} fill="#FFF0B0" />
        </g>
      ) : null}
    </g>
  );
};

/** A curl of smoke rising from (x, y) after a candle goes out; k counts frames since it was blown out. */
export const Smoke: React.FC<{ x: number; y: number; k: number; s?: number }> = ({ x, y, k, s = 1 }) => {
  if (k < 0) return null;
  const rise = Math.min(1, k / 50);
  const o = clamp(1 - k / 64) * 0.75;
  return (
    <g opacity={o} style={{ mixBlendMode: 'screen' }}>
      {[0, 1, 2].map((i) => {
        const ph = k / 9 + i * 1.6;
        const len = (150 + i * 40) * s * rise;
        const sx = Math.sin(ph) * 16 * s;
        const ex = Math.sin(ph + 1.6) * 34 * s;
        return (
          <path key={i} d={`M ${x + i * 3 * s} ${y} C ${x + sx} ${y - len * 0.35} ${x - sx * 1.2} ${y - len * 0.7} ${x + ex} ${y - len}`} stroke="#C8CFE4" strokeWidth={(7 - i * 1.5) * s} fill="none" strokeLinecap="round" opacity={0.7 - i * 0.18} />
        );
      })}
    </g>
  );
};

// ---------- Cake: a small round cake, base centre (x, y), width w; the sticker reads HẾT HẠN ----------
export const Cake: React.FC<{ x: number; y: number; w?: number; sticker?: boolean }> = ({ x, y, w = 560, sticker = true }) => {
  const H = w * 0.36;
  const ry = w * 0.12;
  const top = y - H;
  return (
    <g>
      <ellipse cx={x + w * 0.04} cy={y + 8} rx={w * 0.66} ry={ry * 0.95} fill="#000" opacity={0.45} />
      <ellipse cx={x} cy={y - 2} rx={w * 0.62} ry={ry * 0.9} fill="#B9B3BF" />
      <ellipse cx={x} cy={y - 8} rx={w * 0.6} ry={ry * 0.86} fill="#D8D2DC" />
      {/* the sponge: lit on the left, darker on the right, a cream band halfway */}
      <path d={`M ${x - w / 2} ${top} L ${x - w / 2} ${y - 6} A ${w / 2} ${ry} 0 0 0 ${x + w / 2} ${y - 6} L ${x + w / 2} ${top} Z`} fill="#A9744E" />
      <path d={`M ${x + w * 0.16} ${top + ry * 0.9} L ${x + w * 0.16} ${y - 6 + ry * 0.92} A ${w / 2} ${ry} 0 0 0 ${x + w / 2} ${y - 6} L ${x + w / 2} ${top} Z`} fill="#8C5C3C" />
      <path d={`M ${x - w / 2} ${top + H * 0.5} A ${w / 2} ${ry} 0 0 0 ${x + w / 2} ${top + H * 0.5} L ${x + w / 2} ${top + H * 0.62} A ${w / 2} ${ry} 0 0 1 ${x - w / 2} ${top + H * 0.62} Z`} fill="#E9DCC0" />
      <path d={`M ${x - w / 2} ${top} L ${x - w / 2} ${y - 6}`} stroke="#FFC98A" strokeWidth={4} opacity={0.5} />
      {/* the frosting top with drips, and a few dried-out cracks: it is long past its date */}
      <ellipse cx={x} cy={top} rx={w / 2} ry={ry} fill="#EADFC6" />
      <ellipse cx={x} cy={top} rx={w / 2 - 14} ry={ry - 8} fill="#F2E8D2" />
      {[-0.36, -0.2, 0.0, 0.2, 0.34].map((u, i) => (
        <path key={i} d={`M ${x + u * w - 14} ${top + ry * 0.88} q 14 ${30 + (i % 3) * 18} 28 0`} fill="#EADFC6" />
      ))}
      <path d={`M ${x - w * 0.16} ${top - 6} l 20 8 l -6 12 M ${x + w * 0.2} ${top + 4} l 18 -6`} stroke="#B8A888" strokeWidth={3} fill="none" strokeLinecap="round" />
      <circle cx={x + w * 0.28} cy={top + 10} r={5} fill="#7E8A5E" opacity={0.7} />
      <circle cx={x + w * 0.31} cy={top + 16} r={3} fill="#7E8A5E" opacity={0.7} />
      {sticker ? <ExpiredSticker x={x - w * 0.1} y={top + H * 0.5} w={w * 0.34} /> : null}
    </g>
  );
};

/** A crumpled label stuck on the cake: HẾT HẠN in red mono caps, creased and curling at one corner. */
export const ExpiredSticker: React.FC<{ x: number; y: number; w: number }> = ({ x, y, w }) => (
  <g transform={`translate(${x} ${y}) rotate(-7)`}>
    <path d={`M ${-w / 2} ${-w * 0.2} L ${-w * 0.1} ${-w * 0.23} L ${w * 0.3} ${-w * 0.19} L ${w / 2} ${-w * 0.22} L ${w * 0.47} ${w * 0.02} L ${w / 2} ${w * 0.2} L ${w * 0.1} ${w * 0.17} L ${-w * 0.3} ${w * 0.21} L ${-w / 2 - 4} ${w * 0.18} L ${-w * 0.47} ${-w * 0.02} Z`} fill="#F4ECDC" stroke="#CBBFA6" strokeWidth={2} strokeLinejoin="round" />
    <path d={`M ${-w * 0.4} ${-w * 0.12} L ${-w * 0.36} ${w * 0.12} M ${w * 0.36} ${-w * 0.14} L ${w * 0.3} ${w * 0.1} M ${-w * 0.1} ${-w * 0.22} L ${-w * 0.04} ${w * 0.16}`} stroke="#D2C6AC" strokeWidth={2.5} fill="none" />
    <path d={`M ${w * 0.5} ${w * 0.2} L ${w * 0.34} ${w * 0.14} L ${w * 0.4} ${w * 0.3} Z`} fill="#D9CDB4" />
    <text x={0} y={w * 0.07} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.2} fill="#C23B3B" letterSpacing={1}>HẾT HẠN</text>
    <rect x={-w * 0.4} y={-w * 0.17} width={w * 0.8} height={3} fill="#C23B3B" opacity={0.7} />
    <rect x={-w * 0.4} y={w * 0.13} width={w * 0.8} height={3} fill="#C23B3B" opacity={0.7} />
  </g>
);

// ---------- A phone propped on books, seen from behind (the back, a camera lens, a red light) ----------
export const PhoneOnBooks: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const blink = Math.floor(t / 15) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={8} cy={4} rx={150} ry={16} fill="#000" opacity={0.45} />
      <rect x={-136} y={-28} width={260} height={28} rx={4} fill="#5A4A7A" />
      <rect x={-124} y={-52} width={244} height={26} rx={4} fill="#8A6A4A" />
      <rect x={-130} y={-74} width={236} height={24} rx={4} fill="#4A6A7A" />
      <rect x={-136} y={-26} width={14} height={24} fill="#FFC98A" opacity={0.35} />
      {/* the phone leans against a book: dark back, lens block, a record light */}
      <rect x={-72} y={-330} width={144} height={262} rx={20} fill="#1A1922" stroke="#3A3846" strokeWidth={4} />
      <rect x={-72} y={-330} width={10} height={262} rx={5} fill="#FFC98A" opacity={0.28} />
      <rect x={-52} y={-312} width={58} height={58} rx={14} fill="#0E0D14" stroke="#3A3846" strokeWidth={3} />
      <circle cx={-23} cy={-283} r={17} fill="#15161F" stroke="#4A4856" strokeWidth={3} />
      <circle cx={-23} cy={-283} r={8} fill="#2A3A66" />
      <circle cx={-26} cy={-287} r={3} fill="#9FC0FF" opacity={0.8} />
      <circle cx={40} cy={-300} r={7} fill="#FF3B3B" opacity={blink ? 1 : 0.25} />
      {blink ? <circle cx={40} cy={-300} r={22} fill="#FF3B3B" opacity={0.25} /> : null}
    </g>
  );
};

/** "● REC 00:00:12" on a dark pill: the recording counter. `sec` is the running time in seconds. */
export const RecPill: React.FC<{ x: number; y: number; f: number; sec: number; s?: number }> = ({ x, y, f, sec, s = 1 }) => {
  const m = Math.floor(sec / 60);
  const ss = Math.floor(sec % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={0} y={-30} width={262} height={52} rx={26} fill="#0A0A12" opacity={0.78} />
      <circle cx={30} cy={-4} r={11} fill="#FF3B3B" opacity={Math.floor(f / 15) % 2 === 0 ? 1 : 0.3} />
      <text x={56} y={6} fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#FFE9E0">REC</text>
      <text x={118} y={6} fontFamily={FONT.ui} fontSize={26} fill="#FFE9E0">{`00:${pad(m)}:${pad(ss)}`}</text>
    </g>
  );
};

/** A little scatter of dust-like motes in warm light, deterministic. */
export const Motes: React.FC<{ t: number; seed: number; x0: number; y0: number; w: number; h: number; n?: number }> = ({ t, seed, x0, y0, w, h, n = 14 }) => (
  <g style={{ mixBlendMode: 'screen' }}>
    {Array.from({ length: n }).map((_, i) => (
      <circle key={i} cx={x0 + ((rnd(seed, i) * w + t * 0.3 * (0.5 + rnd(seed + 1, i))) % w)} cy={y0 + ((rnd(seed + 2, i) * h - t * 0.2) % h + h) % h} r={1.5 + rnd(seed + 3, i) * 2} fill="#FFE2B0" opacity={0.2 + 0.3 * Math.abs(Math.sin(t / 11 + i))} />
    ))}
  </g>
);
