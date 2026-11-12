import React from 'react';
import { kf, clamp, easeOut, backOut, camT, Schematic, SchLabel, CountUp, PlantIcon, SCH, FONT, UI, ShotProps } from '../../engine';
import { TyphoonSpiral, Rain } from './storm-sky';
import { SpiralIcon, FistIcon } from './che-props-storm-and-icons';

// Chapter E, beat "energy" (E26-E31): the science card. One typhoon icon against the world's power plants:
// a big storm gives off about 200 x the power of every power plant on Earth combined. "Đó là thật." No punch beats it.

const KINDS = ['tower', 'wind', 'solar', 'dam', 'factory'] as const;
const zoomIn = (t: number, len: number, a = 1.0, b = 1.06) => `translate(960 540) scale(${kf(t, [[0, a], [len, b]])}) translate(-960 -540)`;

// ---------- E26: "theo các nhà khí tượng Mỹ": the source tag, the typhoon icon draws on ----------
export const E26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={zoomIn(t, len)}>
    <Schematic t={t} id="e26sch" />
    <SchLabel x={960} y={200} t={t} text="THEO CÁC NHÀ KHÍ TƯỢNG MỸ" size={50} />
    <SpiralIcon x={960} y={640} r={300} t={t} draw={easeOut(clamp((t - 6) / 26))} />
  </g>
);

// ---------- E27: one big typhoon gives off energy: the icon glows, rings of energy ripple outward ----------
export const E27: React.FC<ShotProps> = ({ t, len }) => {
  const glow = clamp((t - 4) / 10);
  return (
    <g transform={zoomIn(t, len, 0.95, 1.08)}>
      <Schematic t={t} id="e27sch" />
      {[0, 1, 2, 3].map((i) => {
        const p = ((t * 0.9 + i * 20) % 80) / 80;
        return <circle key={i} cx={960} cy={600} r={320 + p * 520} fill="none" stroke={SCH.live} strokeWidth={6 * (1 - p)} opacity={(1 - p) * 0.7 * glow} />;
      })}
      <SpiralIcon x={960} y={600} r={310} t={t} glow={glow} />
      <SchLabel x={960} y={170} t={t - 6} text="1 CƠN BÃO LỚN" size={64} color={SCH.glow} />
    </g>
  );
};

// ---------- E28: storm vs the world's power plants: "≈ 200 x" counts up between them ----------
export const E28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={zoomIn(t, len, 1.0, 1.05)}>
    <Schematic t={t} id="e28sch" />
    <SpiralIcon x={330} y={560} r={230} t={t} glow={1} />
    <CountUp x={880} y={600} t={t - 4} to={200} dur={26} size={120} color={SCH.glow} format={(v) => `≈ ${Math.round(v)} x`} />
    {KINDS.map((k, i) => <PlantIcon key={k} x={1230 + i * 130} y={560} kind={k} on={t > 14 + i * 3 ? 1 : 0} t={t} s={0.95} />)}
    <SchLabel x={1490} y={700} t={t - 14} text="MỌI NHÀ MÁY ĐIỆN" size={36} />
    <SchLabel x={1490} y={750} t={t - 18} text="TRÊN THẾ GIỚI" size={36} />
  </g>
);

// ---------- E29: "cộng lại": 200 power-plant icons pop in, one after another, to match one typhoon ----------
export const E29: React.FC<ShotProps> = ({ t, len }) => {
  const shown = Math.floor(clamp(t / (len - 8)) * 200);
  return (
    <g transform={zoomIn(t, len, 1.0, 1.03)}>
      <Schematic t={t} id="e29sch" />
      {Array.from({ length: 200 }).map((_, i) => {
        if (i >= shown) return null;
        const c = i % 20;
        const r = Math.floor(i / 20);
        return <PlantIcon key={i} x={110 + c * 62} y={170 + r * 82} kind={KINDS[(c + r) % 5]} on={1} t={t} s={0.32} />;
      })}
      <SpiralIcon x={1570} y={500} r={230} t={t} glow={1} />
      <text x={1390} y={820} fontFamily={FONT.ui} fontWeight={700} fontSize={140} fill={SCH.glow} textAnchor="middle" style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>=</text>
      <SchLabel x={1570} y={880} t={t - 6} text="1 CƠN BÃO" size={44} color={SCH.glow} />
      <SchLabel x={690} y={1000} t={t - 8} text="200 x TOÀN BỘ NHÀ MÁY ĐIỆN" size={40} />
    </g>
  );
};

// ---------- E30: "Đó là thật.": a tick stamps on, with the source ----------
export const E30: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp(t / 8));
  const draw = easeOut(clamp((t - 4) / 10));
  return (
    <g transform={zoomIn(t, len, 1.0, 1.06)}>
      <Schematic t={t} id="e30sch" />
      <g transform={`translate(960 430) scale(${pop})`}>
        <circle cx={0} cy={0} r={190} fill="#0B2A1A" stroke={UI.good} strokeWidth={16} />
        <path d="M -90 10 L -30 80 L 100 -70" stroke={UI.good} strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
      </g>
      <text x={960} y={780} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={SCH.line} letterSpacing={4} opacity={clamp((t - 6) / 6)}>ĐÓ LÀ THẬT</text>
      <SchLabel x={960} y={860} t={t - 12} text="NGUỒN: NOAA, MỸ" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- E31: "không có cú đấm nào thắng được nó": a tiny fist next to the huge spiral ----------
export const E31: React.FC<ShotProps> = ({ t, len }) => {
  const trem = Math.sin(t * 2.7) * 2.5;
  const z = kf(t, [[0, 1.0], [len, 0.9]]);
  return (
    <g>
      <g transform={camT(1100, 440, z)}>
        <TyphoonSpiral t={t * 1.5} id="e31sp" cx={1100} cy={440} R={1250} />
      </g>
      <Rain t={t} intensity={0.8} slant={0.4} />
      <g transform={`translate(${420 + trem} ${830 - trem}) `}>
        <ellipse cx={0} cy={110} rx={120} ry={20} fill="#000" opacity={0.4} />
        <FistIcon x={0} y={0} s={kf(t, [[0, 1.5], [len, 1.3]])} />
      </g>
    </g>
  );
};
