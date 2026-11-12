import React from 'react';
import { basePose, poseAt, faceAt, kf, clamp, backOut, camT, FONT, Sparkle, LEG_LEN, ShotProps } from '../../engine';
import { NumCard } from '../khong-ai-ngheo/chb-cards-and-marks';
import { Sea, Island, Boat, PacificMap, Foam, Beach } from './chd-tonga-scenery';
import { Boy, TallyRock, NoSign, AdultIcon, ScalesIcon } from './chd-tonga-props';

// Chapter D, "5 twist: tonga" part 1 (166.25-176.07 s, look memory): D1 Pacific map, D2 1965, D3 six boys, D4 the
// wreck, D5 the island, D6 no adults / no law, D7 fifteen months of tally marks.

const Banner: React.FC<{ x: number; y: number; p: number; text: string; size?: number }> = ({ x, y, p, text, size = 104 }) => (
  <g transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * backOut(clamp(p))})`} opacity={clamp(p * 3)}>
    <rect x={-text.length * size * 0.36 - 40} y={-size * 0.8} width={text.length * size * 0.72 + 80} height={size * 1.3} rx={size * 0.4} fill="#2A1E14" opacity={0.85} />
    <rect x={-text.length * size * 0.36 - 40} y={-size * 0.8} width={text.length * size * 0.72 + 80} height={size * 1.3} rx={size * 0.4} fill="none" stroke="#F2D9A0" strokeWidth={5} />
    <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill="#FFF3CF" letterSpacing={4}>{text}</text>
  </g>
);

// ---------- D1: the Pacific on old parchment, a red dot pulsing at TONGA, slow push toward it ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1170]]), kf(t, [[0, 540], [len, 720]]), kf(t, [[0, 1.0], [len, 1.55]]))}>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#4A3320" />
    <PacificMap t={t} x={10} y={-30} s={1.9} />
  </g>
);

// ---------- D2: the year, on the number card ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => (
  <NumCard t={t} len={len} id="d2" to={1965} statik caption="NĂM">
    <Sparkle x={1330} y={290} t={t - 8} s={1.2} />
    <Sparkle x={600} y={330} t={t - 14} s={0.9} />
  </NumCard>
);

const HEIGHT = [0.8, 0.88, 0.74, 0.92, 0.82, 0.72];

// ---------- D3: six boys line up on the beach and pop in one by one, then wave ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Sea t={t} id="d3" horizon={420} />
    <Beach y={720} t={t} id="d3b" />
    {HEIGHT.map((s, i) => {
      const p = clamp((t - i * 3) / 7);
      if (p <= 0) return null;
      const sc = s * backOut(p);
      const wave = t > 20 ? Math.sin(t / 3 + i) : 0;
      const pose = { ...basePose, x: 470 + i * 196, y: 860 + (i % 2) * 24 - LEG_LEN * sc, scale: sc, armR: { a: 60 + (t > 20 ? 90 : 0) + 18 * wave, b: 10 }, ...faceAt(t, [[0, 'happy']]) };
      return <Boy key={i} i={i} pose={pose} />;
    })}
    <Banner x={960} y={260} p={(t - 10) / 8} text="6 CẬU BÉ" />
  </g>
);

// ---------- D4: a small boat tips in the storm; six dark heads bob in the water ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const rot = kf(t, [[0, -6], [14, -22], [len, -52]]);
  const sink = kf(t, [[0, 0], [len, 110]]);
  const bob = Math.sin(t / 5) * 10;
  return (
    <g transform={camT(960 + Math.sin(t * 1.7) * 5, 540 + Math.cos(t * 2.1) * 4, 1.0)}>
      <Sea t={t * 1.6} id="d4" horizon={400} storm={0.85} />
      <Boat x={900} y={640 + sink + bob} s={1.25} rot={rot} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const hx = 1180 + (i % 3) * 120 + Math.sin(t / 6 + i) * 8;
        const hy = 700 + Math.floor(i / 3) * 70 + Math.cos(t / 5 + i * 2) * 8;
        return (
          <g key={i} transform={`translate(${hx} ${hy})`}>
            <circle r={26} fill="#B0703F" stroke="#2A1810" strokeWidth={4} />
            <path d="M -24 -4 Q 0 -34 24 -4 Q 10 -14 -24 -4 Z" fill="#1A100C" />
            <path d={`M 26 4 L 50 ${-40 - 10 * Math.sin(t / 3 + i)}`} stroke="#B0703F" strokeWidth={10} strokeLinecap="round" />
            <path d="M -40 14 Q 0 28 40 14" stroke="#E4F4F0" strokeWidth={5} fill="none" opacity={0.8} />
          </g>
        );
      })}
      <path d={`M -100 ${820 + bob * 0.5} Q 300 ${780 - bob} 700 ${830} T 1500 ${820} T 2100 ${830} L 2100 1200 L -100 1200 Z`} fill="#2F6674" opacity={0.92} />
      <path d={`M -100 ${850 - bob} Q 400 ${820 + bob} 900 ${860} T 2100 ${850}`} stroke="#E4F4F0" strokeWidth={8} fill="none" opacity={0.7} />
    </g>
  );
};

// ---------- D5: the rocky island, a mini map with the dot, and its name ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 0.9], [len, 1.04]]))}>
    <Sea t={t} id="d5" horizon={470} />
    <Island x={960} y={700} s={1.45} t={t} />
    <Foam x={960} y={716} w={560} t={t} />
    <PacificMap t={t} x={60} y={60} s={0.4} mini />
    <Banner x={1340} y={200} p={(t - 6) / 8} text="ĐẢO 'ATA" size={92} />
  </g>
);

// ---------- D6: two crossed-out signs pop on over the beach: no adults, no law ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Sea t={t} id="d6" horizon={420} />
    <Island x={1560} y={470} s={0.4} t={t} />
    <Beach y={760} t={t} id="d6b" />
    {HEIGHT.map((s, i) => {
      const sc = s * 0.62;
      const pose = { ...basePose, x: 360 + i * 240, y: 960 - LEG_LEN * sc, scale: sc, armL: { a: 10 + 4 * Math.sin(t / 8 + i), b: -8 }, ...faceAt(t, [[0, 'worried']]) };
      return <Boy key={i} i={i} pose={pose} />;
    })}
    <rect x={-200} y={-300} width={2320} height={1700} fill="#1A120A" opacity={0.28} />
    <NoSign x={600} y={400} p={(t - 2) / 12} label="KHÔNG NGƯỜI LỚN"><AdultIcon /></NoSign>
    <NoSign x={1320} y={400} p={(t - 28) / 12} label="KHÔNG LUẬT PHÁP"><ScalesIcon /></NoSign>
  </g>
);

// ---------- D7: fifteen scratched marks on a rock, one a month, "15 THÁNG" ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 560]]), kf(t, [[0, 0.92], [len, 1.0]]))}>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#6E5236" />
    <circle cx={960} cy={420} r={720} fill="#F2D9A0" opacity={0.28} />
    <TallyRock x={960} y={560} s={1.45} n={t / 2.4} />
    <g transform={`translate(960 960) scale(${0.7 + 0.3 * backOut(clamp((t - 34) / 8))})`} opacity={clamp((t - 34) / 4)}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill="#FFF3CF" stroke="#2A1E14" strokeWidth={14} paintOrder="stroke" letterSpacing={4}>15 THÁNG</text>
    </g>
    <Sparkle x={1500} y={300} t={t - 40} s={1.2} />
  </g>
);
