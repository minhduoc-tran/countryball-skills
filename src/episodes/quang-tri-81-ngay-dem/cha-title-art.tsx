import React from 'react';
import { FONT } from '../../engine/fonts';
import { Glow, Puff } from '../../countryball/fx-glow';
import { backOut, flicker, hash, prog } from '../../countryball/fx-math';

// Title card art for "81 NGÀY ĐÊM / THÀNH CỔ QUẢNG TRỊ": burning dusk sky, smoke plumes, embers, the broken citadel wall in
// silhouette on the Thạch Hãn, river reflecting the glow. Everything is a function of `t` (shot frames).

const HORIZON = 980;
const INK = '#06070B';

/** Ragged wall top edge (ruins): breaches, bastions at both ends, a two-tier gate tower. */
const wallPath = (): string => {
  const pts: [number, number][] = [[-40, HORIZON + 4]];
  for (let x = -40; x <= 1960; x += 28) {
    const i = x / 28, breach = hash(Math.floor(i / 5), 7) > 0.62;
    const h = breach ? 10 + 30 * hash(i, 2) : 80 + 46 * hash(i, 3) * (hash(i, 4) > 0.5 ? 1 : 0.35);
    pts.push([x, HORIZON - h], [x + 28, HORIZON - h]);
  }
  pts.push([1960, HORIZON + 4]);
  return `M${pts.map((p) => p.join(',')).join(' L')} Z`;
};
const WALL = wallPath();

const Gate: React.FC<{ x: number }> = ({ x }) => (
  <g transform={`translate(${x},${HORIZON})`} fill={INK}>
    <rect x={-120} y={-92} width={240} height={96} />
    <path d="M-150,-92 L-100,-134 L100,-134 L150,-92 Z" />
    <rect x={-84} y={-176} width={168} height={46} />
    <path d="M-112,-176 Q-60,-188 0,-232 Q60,-188 112,-176 Z" />
    <path d="M-30,4 L-30,-52 Q0,-84 30,-52 L30,4 Z" fill="#6A2A12" opacity={0.75} />
  </g>
);

const Bastion: React.FC<{ x: number; flip?: boolean }> = ({ x, flip }) => (
  <path transform={`translate(${x},${HORIZON}) scale(${flip ? -1 : 1},1)`} d="M-150,4 L-110,-60 L-40,-104 L40,-104 L90,-70 L150,4 Z" fill={INK} />
);

/** A burnt tree stump: trunk + two broken branches. */
const Stump: React.FC<{ x: number; h: number }> = ({ x, h }) => (
  <path transform={`translate(${x},${HORIZON})`} d={`M-9,6 L-6,${-h} L-22,${-h - 26} L-12,${-h - 22} L-2,${-h - 40} L4,${-h} L20,${-h - 18} L12,${-h + 4} L9,6 Z`} fill={INK} />
);

export const TitleBackdrop: React.FC<{ t: number }> = ({ t }) => {
  const pulse = flicker(t * 0.8, 3), reveal = prog(t, 0, 16);
  return (
    <g>
      <defs>
        <linearGradient id="a10-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#04060B" /><stop offset="0.45" stopColor="#1C0F16" /><stop offset="0.72" stopColor="#6B2A14" /><stop offset="0.9" stopColor="#D9611F" /><stop offset="1" stopColor="#FF9A3C" />
        </linearGradient>
        <linearGradient id="a10-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5C2814" /><stop offset="0.35" stopColor="#1C1218" /><stop offset="1" stopColor="#05080F" />
        </linearGradient>
      </defs>
      <rect width={1920} height={HORIZON} fill="url(#a10-sky)" />
      {/* drifting smoke plumes */}
      {[260, 840, 1330, 1760].map((bx, p) => (
        <g key={p}>
          {Array.from({ length: 14 }, (_, i) => {
            const life = 200, age = (t * 0.9 + (i * life) / 14 + p * 40) % life, k = age / life, up = k * (620 + 80 * p % 3);
            return <Puff key={i} x={bx + up * (0.28 + 0.1 * p) + Math.sin(k * 5 + i + p) * 30} y={HORIZON - 40 - up} r={50 + 150 * k} color={k < 0.3 ? '#241513' : '#2B2528'} o={0.62 * (1 - Math.pow(k, 1.5))} seed={i + p * 20} />;
          }).reverse()}
        </g>
      ))}
      <Glow x={960} y={HORIZON - 30} r={1150 * (0.96 + 0.04 * pulse)} color="#FF7A22" o={0.7} />
      <Glow x={1700} y={HORIZON - 60} r={520} color="#FFC070" o={0.4 * pulse} />
      <Glow x={240} y={HORIZON - 40} r={420} color="#FFB347" o={0.3 * pulse} />
      {/* embers rising */}
      {Array.from({ length: 70 }, (_, i) => {
        const sp = 0.5 + 1.4 * hash(i, 1), y = 1000 - ((t * sp + hash(i, 2) * 1100) % 1100), x = hash(i, 3) * 1920 + Math.sin(t / 18 + i) * 26;
        return <circle key={i} cx={x} cy={y} r={1.4 + 2.8 * hash(i, 4)} fill={hash(i, 5) > 0.5 ? '#FFB347' : '#FF6A1A'} opacity={(0.25 + 0.65 * hash(i, 6) * (0.6 + 0.4 * Math.sin(t / 6 + i))) * (y / 1000)} />;
      })}
      {/* the broken citadel, silhouette */}
      <path d={WALL} fill={INK} />
      <Bastion x={110} /><Gate x={1770} />
      {[330, 470, 610, 780, 1010, 1130, 1420, 1560].map((x, i) => <Stump key={i} x={x} h={50 + 60 * hash(i, 9)} />)}
      {/* river */}
      <rect y={HORIZON} width={1920} height={1080 - HORIZON} fill="url(#a10-river)" />
      <Glow x={960} y={HORIZON + 40} r={640} color="#FF6A1A" o={0.22} />
      {Array.from({ length: 46 }, (_, i) => {
        const y = HORIZON + 8 + 140 * Math.pow(hash(i, 1), 1.4), w = 40 + 160 * hash(i, 2), x = hash(i, 3) * 2100 - 100 + Math.sin(t / 25 + i) * 22;
        return <line key={i} x1={x} y1={y} x2={x + w} y2={y} stroke={hash(i, 4) > 0.45 ? '#FF9A4A' : '#7C8AA0'} strokeWidth={2 + 2 * hash(i, 5)} strokeLinecap="round" opacity={(0.12 + 0.3 * hash(i, 6)) * (0.6 + 0.4 * Math.sin(t / 9 + i * 1.7))} />;
      })}
      <rect width={1920} height={1080} fill="#000" opacity={1 - reveal} />
    </g>
  );
};

const stroke = { stroke: '#120C1E', paintOrder: 'stroke', strokeLinejoin: 'round', fontFamily: FONT.title, fontWeight: 800 } as const;

/** "81" slams (frame a1), "NGÀY ĐÊM" rises (a2), red band "THÀNH CỔ QUẢNG TRỊ" flies in (a3). */
export const TitleText: React.FC<{ t: number; a1?: number; a2?: number; a3?: number }> = ({ t, a1 = 34, a2 = 50, a3 = 72 }) => {
  const u1 = prog(t, a1, a1 + 10), k1 = 1 + 0.6 * (1 - u1) * (1 - u1);
  const shake = t >= a1 && t < a1 + 8 ? (hash(t, 4) - 0.5) * 22 * (1 - (t - a1) / 8) : 0;
  const u2 = prog(t, a2, a2 + 12), u3 = prog(t, a3, a3 + 10), bx = (1 - backOut(u3)) * -1700;
  const flash = 0.4 * (1 - prog(t, a1, a1 + 9)) * (t >= a1 ? 1 : 0), idle = 1 + 0.008 * Math.sin(t / 22);
  return (
    <g transform={`translate(${shake},${shake * 0.6}) translate(960,540) scale(${idle}) translate(-960,-540)`}>
      {u1 > 0 && <text transform={`translate(960,436) scale(${Math.max(0.01, k1)})`} textAnchor="middle" fontSize={540} fill="#FFE600" strokeWidth={54} opacity={Math.min(1, u1 * 3)} {...stroke}>81</text>}
      {u2 > 0 && <text transform={`translate(960,${628 + (1 - u2) * 70})`} textAnchor="middle" fontSize={214} fill="#FFFFFF" strokeWidth={26} opacity={u2} letterSpacing={6} {...stroke}>NGÀY ĐÊM</text>}
      {u3 > 0 && (
        <g transform={`translate(${960 + bx},812) rotate(-3)`}>
          <rect x={-720} y={-96} width={1440} height={176} rx={22} fill="#000" opacity={0.4} transform="translate(10,14)" />
          <rect x={-720} y={-96} width={1440} height={176} rx={22} fill="#E5143A" stroke="#120C1E" strokeWidth={10} />
          <text y={36} textAnchor="middle" fontSize={112} fill="#FFE600" strokeWidth={11} letterSpacing={3} {...stroke}>THÀNH CỔ QUẢNG TRỊ</text>
        </g>
      )}
      {flash > 0 && <rect width={1920} height={1080} fill="#FFF3DC" opacity={flash} />}
    </g>
  );
};
