import React from 'react';
import {
  Hero, Look, LOOKS, basePose, faceAt, Schematic, SchLabel, DrawOn, SCH, FONT, Glow, Sparkle, camT, kf, clamp, easeOut, backOut, ShotProps,
} from '../../engine';
import { PriceTag } from '../tien-vo-han/chc-props-money-and-prices';
import { Coin, MiniStall, quadAt } from './chc-doubt-props';

// Chapter C, "4 doubt: inflation", part 2 (131.13-137.97 s): C19 one coin goes round a small market (shop, farmer, tailor),
// C20 it becomes "x2,5", C21 the price tag barely moves, C22 "< 1%" and "Đó là thật".

const SHOP: Look = { ...LOOKS.mom, jacket: '#D9604A', jacketShade: '#B84A38', accent: '#F2C14E' };
const FARMER: Look = { ...LOOKS.mo, jacket: '#6E9A52', jacketShade: '#587C40', accent: '#E9D8A0', extra: undefined };
const TAILOR: Look = { ...LOOKS.sis, jacket: '#7A62B0', jacketShade: '#604C92', accent: '#E9C46A', extra: 'bunches' };
const GROUND = 800;
const STALLS = [
  { x: 480, awning: '#D9604A', goods: 'shop' as const, look: SHOP },
  { x: 960, awning: '#5E9A5C', goods: 'veg' as const, look: FARMER },
  { x: 1440, awning: '#7A62B0', goods: 'cloth' as const, look: TAILOR },
];
const SEG = 15; // frames per hop
const hop = (t: number, i: number) => clamp((t - 4 - i * SEG) / SEG);
const top = (i: number): [number, number] => [STALLS[i].x, GROUND - 170];

// ---------- C19: wide: one coin hops shop -> farmer -> tailor; each stop leaves a coin glowing above the stall (1, 1, and half) ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const start: [number, number] = [120, 110];
  const stops: [number, number][] = [start, top(0), top(1), top(2)];
  const seg = Math.min(2, Math.floor(clamp((t - 4) / SEG, 0, 2.999)));
  const k = easeOut(hop(t, seg));
  const a = stops[seg];
  const b = stops[seg + 1];
  const [cx, cy] = quadAt(a, [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 150], b, k);
  const arrived = [t >= 4 + SEG, t >= 4 + 2 * SEG, t >= 4 + 3 * SEG];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <defs>
        <linearGradient id="c19sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#BFE3F0" /><stop offset="1" stopColor="#F9E7C0" /></linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1100} fill="url(#c19sky)" />
      <rect x={-300} y={GROUND} width={2520} height={500} fill="#C9A87A" />
      <rect x={-300} y={GROUND} width={2520} height={12} fill="#9A7A52" />
      <g filter="url(#blur10)"><ellipse cx={200} cy={560} rx={300} ry={160} fill="#7FB070" /><ellipse cx={1750} cy={540} rx={320} ry={170} fill="#6FA064" /></g>
      {[0, 1].map((i) => <DrawOn key={i} d={`M ${STALLS[i].x + 70} ${GROUND - 380} Q ${(STALLS[i].x + STALLS[i + 1].x) / 2} ${GROUND - 540} ${STALLS[i + 1].x - 70} ${GROUND - 380}`} t={t - 10 - i * SEG} dur={14} color="#8A6A4A" width={6} />)}
      {STALLS.map((s, i) => (
        <g key={i}>
          <Hero look={s.look} pose={{ ...basePose, x: s.x, y: GROUND - 140 * 0.8, scale: 0.8, yaw: 0.2, facing: 1, armR: { a: arrived[i] ? 100 : 12, b: 10 }, ...faceAt(t, [[0, 'neutral'], [4 + (i + 1) * SEG, 'happy']]) }} rimId="rimR" shadow={0} />
          <MiniStall x={s.x} y={GROUND} s={1.15} awning={s.awning} goods={s.goods} />
        </g>
      ))}
      {/* what each stop keeps: a coin, a coin, half a coin */}
      {arrived.map((on, i) => on ? (
        <g key={i} transform={`translate(${STALLS[i].x} ${GROUND - 450 - 8 * Math.sin(t / 6 + i)}) scale(${backOut(clamp((t - 4 - (i + 1) * SEG) / 6))})`}>
          <Coin x={0} y={0} s={0.8} half={i === 2} />
        </g>
      ) : null)}
      <Glow x={cx} y={cy} r={160} o={0.45} />
      <Coin x={cx} y={cy} s={1.05} rot={(t * 9) % 360} o={t >= 4 + 3 * SEG ? 0 : 1} />
      <Sparkle x={cx + 40} y={cy - 50} t={t - 4 - seg * SEG - SEG} s={0.9} />
    </g>
  );
};

// ---------- C20: card: one coin becomes two and a half: "x2,5" ----------
export const C20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t} id="c20" />
    <Coin x={380} y={600} s={1.9} o={backOut(clamp(t / 6))} />
    <path d="M 560 600 H 720 M 690 570 L 724 600 L 690 630" stroke={SCH.line} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={clamp((t - 4) / 4)} />
    {[0, 1].map((i) => <g key={i} transform={`translate(${940 + i * 190} 600) scale(${backOut(clamp((t - 8 - i * 4) / 6))})`}><Coin x={0} y={0} s={1.7} /></g>)}
    <g transform={`translate(1500 600) scale(${backOut(clamp((t - 16) / 6))})`}><Coin x={0} y={0} s={1.7} half /></g>
    <g transform={`translate(960 280) scale(${backOut(clamp((t - 2) / 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={230} fill={SCH.live} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}77)` }}>x2,5</text>
    </g>
    <Sparkle x={1560} y={540} t={t - 20} s={1.1} />
  </g>
);

// ---------- C21: card: the price tag nudges up a hair against its dashed baseline while the scary steep line fades behind it ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const nudge = easeOut(clamp((t - 8) / 14)) * 16;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="c21" />
      <path d="M 300 900 L 1650 150" stroke={SCH.dim} strokeWidth={10} strokeDasharray="26 20" opacity={0.4 * (1 - clamp((t - 6) / 14))} strokeLinecap="round" />
      <path d="M 340 640 H 1580" stroke={SCH.line} strokeWidth={5} strokeDasharray="16 12" opacity={0.7} />
      <PriceTag x={830} y={640 - nudge} s={2.1} text="GIÁ" />
      <g transform="translate(1330 640)">
        <path d={`M 0 0 V ${-nudge}`} stroke={SCH.live} strokeWidth={16} strokeLinecap="round" />
        <path d="M -40 8 h 80 M -40 -36 h 80" stroke={SCH.line} strokeWidth={6} opacity={0.7 * clamp((t - 14) / 6)} strokeLinecap="round" />
      </g>
      <SchLabel x={960} y={250} t={t - 4} text="CHỈ NHÍCH LÊN" size={110} color={SCH.line} />
    </g>
  );
};

// ---------- C22: "< 1%" fills the card; "ĐÓ LÀ THẬT" stamps on with a tick ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const stamp = backOut(clamp((t - 24) / 6));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="c22" />
      <g transform={`translate(960 430) scale(${backOut(clamp(t / 7))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={360} fill={SCH.live} style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}77)` }}>&lt; 1%</text>
      </g>
      <g transform={`translate(960 800) rotate(-3) scale(${stamp})`} opacity={stamp > 0 ? 1 : 0}>
        <rect x={-380} y={-70} width={760} height={140} rx={70} fill="#2DBE6C" stroke="#0E5A32" strokeWidth={6} />
        <path d="M -330 0 l 28 30 l 52 -62" stroke="#E9FFF2" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={50} y={26} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={78} fill="#06301B" letterSpacing={3}>ĐÓ LÀ THẬT</text>
      </g>
      <Sparkle x={1420} y={760} t={t - 28} s={1.3} />
    </g>
  );
};
