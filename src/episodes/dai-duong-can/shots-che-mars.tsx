import React from 'react';
import { kf, clamp, easeOut, backOut, camT, Glow, Sparkle, FONT, ShotProps } from '../../engine';
import { Globe } from './kit-globe';
import { DrySeabed } from './kit-dry-seabed';
import { OceanMeter, FactStamp } from './kit-hud';
import { Space, MarsLand, Rover, Pill, MiniBar } from './che-mars-props';

// Chapter E, "7 mars" (240.93-258.67 s): the neighbour, ancient wet Mars, its water and air leaving, the red desert,
// the dry Earth, the Earth-to-Mars morph and the twin planets.
//   E1 space, dry Earth then Mars   E2 rivers   E3 lake + sea?   E4 water and air drain away   E5 red desert
//   E6 cold, dead + FactStamp       E7 dry-ocean Earth  E8 globe morphs to Mars   E9 the twins

// ---------- E1 "Hãy nhìn sang hàng xóm của chúng ta": the camera slides from dry Earth to Mars ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 640], [len, 1080]]), 540, kf(t, [[0, 1.05], [len, 1.0]]))}>
    <Space t={t} />
    <Globe id="e1a" t={t} r={250} cx={520} cy={560} water={0} rot={60} />
    <Globe id="e1b" t={t + 40} r={170} cx={1400} cy={520} mars={1} water={0} rot={20} />
    <Pill x={520} y={880} text="TRÁI ĐẤT" t={t} at={2} size={40} />
    <Pill x={1400} y={800} text="SAO HỎA" t={t} at={26} size={40} />
  </g>
);

// ---------- E2 "Hàng tỷ năm trước, sao Hỏa từng có sông,": ancient Mars, a river runs ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1000], [len, 900]]), kf(t, [[0, 600], [len, 700]]), kf(t, [[0, 1.0], [len, 1.22]]))}>
      <MarsLand id="e2m" t={t} river={1} lake={1} />
      <Pill x={560} y={820} text="SÔNG" t={t} at={50} size={46} />
    </g>
    <Pill x={420} y={110} text="HÀNG TỶ NĂM TRƯỚC" t={t} at={2} size={38} />
  </g>
);

// ---------- E3 "có hồ, có thể có cả biển.": the camera finds the lake, then the far sea on the horizon ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const sea = easeOut(clamp((t - 32) / 14));
  const toSea = easeOut(clamp((t - 28) / 24));
  return (
    <g transform={camT(kf(t, [[0, 1380], [28, 1380], [len, 1020]]), kf(t, [[0, 700], [28, 700], [len, 520]]), kf(t, [[0, 1.5], [28, 1.5], [len, 1.15]]))}>
      <MarsLand id="e3m" t={t + 80} river={1} lake={1} sea={sea} />
      <Pill x={1400} y={820} text="HỒ" t={t} at={4} size={46} />
      <g opacity={toSea}><Pill x={1000} y={400} text="BIỂN?" t={t} at={36} size={46} /></g>
      <Sparkle x={1500} y={690} t={t - 10} s={1.2} />
    </g>
  );
};

// ---------- E4 "Rồi nó mất nước, mất lớp khí quyển dày,": the water dries up, then the air thins away ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const w = 1 - easeOut(clamp(t / 34));
  const a = 1 - easeOut(clamp((t - 26) / 36));
  return (
    <g>
      <g transform={camT(960, 620, kf(t, [[0, 1.05], [len, 1.2]]))}>
        <MarsLand id="e4m" t={t + 160} river={w} lake={w} sea={w} air={a} dust={clamp(1 - a) * 0.5} />
      </g>
      <MiniBar x={1370} y={70} label="NƯỚC" p={w} />
      <MiniBar x={1370} y={166} label="KHÍ QUYỂN" p={a} col="#E9B26A" />
    </g>
  );
};

// ---------- E5 "và trở thành một sa mạc đỏ,": a dusty, rust-red desert ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t - 30) / 8));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 640, kf(t, [[0, 1.1], [len, 1.28]]))}>
        <MarsLand id="e5m" t={t + 230} river={0} lake={0} air={0} dust={0.9} />
      </g>
      <g transform={`translate(960 330) scale(${k})`} opacity={t < 30 ? 0 : 1}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} letterSpacing={3} fill="#FFE27A" stroke="#3A1408" strokeWidth={26} paintOrder="stroke">SA MẠC ĐỎ</text>
      </g>
    </g>
  );
};

// ---------- E6 "lạnh lẽo, chết chóc. Đó là thật.": cold dusk, a half-buried probe, snow motes, the stamp ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 760]]), 660, kf(t, [[0, 1.05], [len, 1.25]]))}>
      <MarsLand id="e6m" t={t + 300} river={0} lake={0} air={0} dust={0.35} />
      <rect x={-200} y={-200} width={2320} height={1500} fill="#2C4A8A" opacity={0.3} />
      <Rover x={560} y={800} s={1.3} t={t} buried />
      {Array.from({ length: 18 }).map((_, i) => {
        const x = ((i * 137 + t * (3 + (i % 3))) % 2200) - 150;
        const y = ((i * 211 + t * (2 + (i % 4))) % 800) + 120;
        return <path key={i} d={`M ${x - 12} ${y} L ${x + 12} ${y} M ${x} ${y - 12} L ${x} ${y + 12} M ${x - 8} ${y - 8} L ${x + 8} ${y + 8} M ${x - 8} ${y + 8} L ${x + 8} ${y - 8}`} stroke="#E6F2FF" strokeWidth={3} opacity={0.8} />;
      })}
    </g>
    <Pill x={420} y={130} text="LẠNH LẼO" t={t} at={4} size={50} col="#BFE4FF" />
    <Pill x={1380} y={130} text="CHẾT CHÓC" t={t} at={26} size={50} col="#FF9A8A" />
    <FactStamp t={t} at={46} x={1250} y={880} />
  </g>
);

// ---------- E7 "Một Trái Đất không có đại dương,": the drained seabed, ocean meter at 0% ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <DrySeabed id="e7s" t={t} salt={1} haze={0.55} dust={0.6} />
    </g>
    <OceanMeter x={1330} y={70} p={0} t={t} />
  </g>
);

// ---------- E8 "về lâu dài, sẽ trông rất giống": the dry Earth turns rust-red ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const m = easeOut(clamp((t - 4) / 40));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Space t={t} />
      <Globe id="e8g" t={t} r={330} cx={960} cy={540} water={0} mars={m} rot={140} />
      <Glow x={960} y={540} r={560} kind="red" o={0.35 * m} />
    </g>
  );
};

// ---------- E9 "sao Hỏa.": the twins side by side ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t - 6) / 10));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Space t={t} />
      <Globe id="e9a" t={t} r={250} cx={560} cy={520} water={0} mars={1} rot={140} />
      <Globe id="e9b" t={t + 90} r={250} cx={1360} cy={520} mars={1} water={0} rot={20} />
      <g transform={`translate(960 520) scale(${k})`}>
        <text textAnchor="middle" y={44} fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFE27A" stroke="#241236" strokeWidth={22} paintOrder="stroke">≈</text>
      </g>
      <Pill x={560} y={880} text="TRÁI ĐẤT KHÔ" t={t} at={12} size={38} />
      <Pill x={1360} y={880} text="SAO HỎA" t={t} at={18} size={38} />
    </g>
  );
};
