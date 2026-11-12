import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { TankSide } from '../../countryball/ground-tanks';
import { PalaceFacade } from '../../countryball/palace-facade';
import { Glow } from '../../countryball/fx-glow';
import { backOut, easeOut, hash, prog } from '../../countryball/fx-math';
import { Out } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { Drift, Veil } from './cha-common';

// Chapter A title block: A8 (20.6-22.9 s) "những ngày cuối cùng": calendar pages 26-29/4 torn off, the 30 stays; A9 (22.9-26.0 s) TITLE CARD
// "NGÀY 30 THÁNG 4 / XE TĂNG VÀO DINH ĐỘC LẬP" over the dusk palace, a Type 59 rolling in, red band + yellow outlined text (channel style).

const INK = '#120C1E';
const stroke = { stroke: INK, paintOrder: 'stroke', strokeLinejoin: 'round', fontFamily: FONT.title, fontWeight: 800 } as const;

const Page: React.FC<{ day: number; fill: string }> = ({ day, fill }) => (
  <g>
    <rect x={-250} y={-290} width={500} height={600} rx={26} fill="#F6F0DC" stroke={INK} strokeWidth={8} />
    <rect x={-250} y={-290} width={500} height={130} rx={26} fill="#C8322A" stroke={INK} strokeWidth={8} />
    <text y={-188} textAnchor="middle" fontSize={64} fill="#FFFFFF" strokeWidth={8} {...stroke}>THÁNG 4 · 1975</text>
    <text y={150} textAnchor="middle" fontSize={330} fill={fill} strokeWidth={14} {...stroke}>{day}</text>
  </g>
);

export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const days = [26, 27, 28, 29], tear = (i: number) => prog(t, 10 + i * 9, 26 + i * 9);
  return (
    <g>
      <defs>
        <linearGradient id="a8-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B1424" /><stop offset="0.7" stopColor="#3A2A3A" /><stop offset="1" stopColor="#8A4A2A" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#a8-sky)" />
      <Glow x={960} y={1060} r={1100} color="#FF8A3A" o={0.35} />
      <Drift t={t} len={len} z0={1} z1={1.06} cx={960} cy={500}>
        <g transform="translate(960,470)">
          <rect x={-250} y={-290} width={500} height={600} rx={26} fill="#000" opacity={0.4} transform="translate(12,16)" />
          <Page day={30} fill="#C8322A" />
          {/* torn pages fall away, 26 first (it is on top of the pile) */}
          {days.map((d, i) => {
            const k = tear(i), kk = k * k;
            if (k >= 1) return null;
            return (
              <g key={d} transform={`translate(${kk * (i % 2 ? 380 : -380)},${kk * 900}) rotate(${kk * (i % 2 ? 40 : -40)} 0 -290)`}>
                <Page day={d} fill="#1E2230" />
              </g>
            );
          }).reverse()}
        </g>
      </Drift>
      <Out x={960} y={1000} size={84} opacity={prog(t, 4, 16)}>NHỮNG NGÀY CUỐI CÙNG</Out>
    </g>
  );
};

/** Dusk sky + palace + dark ground; embers drifting; the Type 59 rolls in from the left. */
const TitleBackdrop: React.FC<{ t: number }> = ({ t }) => {
  const roll = easeOut(prog(t, 0, 70)), reveal = prog(t, 0, 12);
  return (
    <g>
      <PalaceFacade id="a9" x={1010} y={900} w={1700} tone="dusk" flag="RVN" t={t} />
      <rect width={1920} height={1080} fill="#07090F" opacity={0.42} />
      <Glow x={960} y={880} r={1200} color="#FF7A22" o={0.4} />
      {Array.from({ length: 50 }, (_, i) => {
        const sp = 0.5 + 1.2 * hash(i, 1), y = 1040 - ((t * sp + hash(i, 2) * 1100) % 1100), x = hash(i, 3) * 1920 + Math.sin(t / 18 + i) * 24;
        return <circle key={i} cx={x} cy={y} r={1.4 + 2.4 * hash(i, 4)} fill={hash(i, 5) > 0.5 ? '#FFB347' : '#FF6A1A'} opacity={0.2 + 0.5 * hash(i, 6)} />;
      })}
      <rect y={880} width={1920} height={200} fill="#0B0E15" />
      <TankSide id="a9t" x={-380 + 980 * roll} y={955} size={620} kind="type59" flag="PRG" t={t} />
      <rect width={1920} height={1080} fill="#000" opacity={1 - reveal} />
    </g>
  );
};

const Band: React.FC<{ x: number; y: number; w: number; h: number; text: string; size: number; rot: number; u: number }> = ({ x, y, w, h, text, size, rot, u }) => {
  const bx = (1 - backOut(u)) * -1900;
  return (
    <g transform={`translate(${x + bx},${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="#000" opacity={0.4} transform="translate(10,14)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="#E5143A" stroke={INK} strokeWidth={10} />
      <text y={size * 0.36} textAnchor="middle" fontSize={size} fill="#FFE600" strokeWidth={size * 0.1} letterSpacing={2} {...stroke}>{text}</text>
    </g>
  );
};

export const A9: React.FC<ShotProps> = ({ t }) => {
  const a1 = 26, a2 = 46;
  const u1 = prog(t, a1, a1 + 10), u2 = prog(t, a2, a2 + 11), k1 = 1 + 0.55 * (1 - u1) * (1 - u1);
  const shake = t >= a1 && t < a1 + 8 ? (hash(t, 4) - 0.5) * 22 * (1 - (t - a1) / 8) : 0;
  const flash = t >= a1 ? 0.45 * (1 - prog(t, a1, a1 + 9)) : 0, idle = 1 + 0.008 * Math.sin(t / 22);
  return (
    <g>
      <Drift t={t} len={93} z0={1} z1={1.05} cx={960} cy={700}><TitleBackdrop t={t} /></Drift>
      <Veil id="a9" o={0.5} />
      <g transform={`translate(${shake},${shake * 0.6}) translate(960,540) scale(${idle}) translate(-960,-540)`}>
        {u1 > 0 && (
          <text transform={`translate(960,330) rotate(-3) scale(${Math.max(0.01, k1)})`} textAnchor="middle" fontSize={190} fill="#FFE600" strokeWidth={24} letterSpacing={3} opacity={Math.min(1, u1 * 3)} {...stroke}>NGÀY 30 THÁNG 4</text>
        )}
        {u2 > 0 && <Band x={960} y={520} w={1740} h={176} text="XE TĂNG VÀO DINH ĐỘC LẬP" size={104} rot={-3} u={u2} />}
      </g>
      {flash > 0 && <rect width={1920} height={1080} fill="#FFF3DC" opacity={flash} />}
    </g>
  );
};
