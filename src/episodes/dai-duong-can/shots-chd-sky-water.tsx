import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, ShotProps, Schematic, SCH, Glow, FONT } from '../../engine';
import { DrySeabed } from './kit-dry-seabed';
import { BigNum } from './kit-hud';
import { PAL } from './kit-palette';
import { Cloud, Rain, SkyBand, SeaStrip, Steam, BoilPot, Pill } from './chd-sky-props';
import { Delta } from './chd-delta-props';
import { Donut, ThreatIcon } from './chd-icon-props';

// Chapter D, "6 rain" part 1 (176.60-194.45 s): D1 the empty sky, D2 the ocean as a boiling pot, D3 "85%", D4 vapour ->
// cloud -> rain, D5 "60%", D6 donut of rain from the ocean, D7 clouds thin, D8 the lush Mekong delta.

// ---------- D1: wide, Pip small on the dry seabed; the camera tilts up to an empty, scorching sky ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 700, y: 790, scale: 0.9, yaw: 0.45, look: 0.5, expr: 'worried', armL: { a: 8, b: -8 }, armR: { a: 12, b: -8 } } }]);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 960]]), kf(t, [[0, 720], [len, 360]]), kf(t, [[0, 1.5], [len, 1.2]]))}>
      <DrySeabed id="d1s" t={t} haze={0.6} />
      <Cloud x={1050} y={230} s={0.8} o={0.55 * (1 - clamp((t - 20) / 30))} />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimL" shadow={0.8} />
    </g>
  );
};

// ---------- D2: the ocean as a giant boiling pot, the sun under it as the burner ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.12]]))}>
    <SkyBand id="d2sk" top="#2F7FC0" bottom="#CFE6F2" />
    <Cloud x={300} y={240} s={0.9} o={0.9} />
    <Cloud x={1650} y={200} s={0.7} o={0.9} />
    <BoilPot x={960} y={560} s={1.25} t={t} />
  </g>
);

// ---------- D3: "85%" counting up with steam rising; at "là từ biển" a sea / land bar pops ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(85 * easeOut(clamp(t / 30)));
  const bar = easeOut(clamp((t - 72) / 12));
  return (
    <BigNum t={t} len={len} id="d3s" text={`${n}%`} caption="HƠI NƯỚC BỐC LÊN TỪ BIỂN">
      <Steam x={330} y={960} t={t} n={6} h={760} col="#BFE6FA" w={18} />
      <Steam x={1590} y={960} t={t + 20} n={6} h={760} col="#BFE6FA" w={18} />
      <g opacity={bar} transform={`translate(360 ${860})`}>
        <rect width={1020 * bar} height={86} rx={20} fill={PAL.seaTop} stroke={SCH.line} strokeWidth={4} />
        <rect x={1020 * bar} width={180 * bar} height={86} rx={20} fill="#5DB04A" stroke={SCH.line} strokeWidth={4} />
        <text x={510} y={60} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={46} fill="#F6EFE3" opacity={bar}>BIỂN</text>
      </g>
    </BigNum>
  );
};

// ---------- D4: vapour rises off the sea, the cloud swells, rain falls on the land ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const grow = easeOut(clamp((t - 8) / 22));
  const rain = easeOut(clamp((t - 30) / 10));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <SkyBand id="d4sk" top="#4D9AD6" bottom="#CFE6F2" />
      <path d="M 840 820 Q 1000 640 1200 700 Q 1500 560 1700 700 Q 1860 640 2040 760 L 2040 1100 L 840 1100 Z" fill="#5DB04A" stroke="#2F7A3F" strokeWidth={6} />
      {[1180, 1380, 1580, 1780].map((x) => <path key={x} d={`M ${x - 90} 880 L ${x + 90} 880 M ${x - 100} 940 L ${x + 100} 940`} stroke="#3E8F3B" strokeWidth={10} strokeLinecap="round" />)}
      {[1250, 1700].map((x) => <g key={x} transform={`translate(${x} 700)`}><path d="M 0 0 Q 10 -80 6 -160" stroke="#6B4A2C" strokeWidth={14} fill="none" strokeLinecap="round" />{[-160, -120, -60, -20].map((a) => <path key={a} d={`M 6 -160 q ${Math.cos((a * Math.PI) / 180) * 50} ${Math.sin((a * Math.PI) / 180) * 30 - 24} ${Math.cos((a * Math.PI) / 180) * 90} ${Math.sin((a * Math.PI) / 180) * 50 + 20}`} stroke="#2F7A3F" strokeWidth={10} fill="none" strokeLinecap="round" />)}</g>)}
      <SeaStrip id="d4sea" x0={-100} x1={900} y={800} depth={400} t={t} />
      <Steam x={440} y={800} t={t} n={7} h={460} col="#FFFFFF" w={16} />
      <Cloud x={1060} y={300} s={0.35 + 0.95 * grow} o={clamp(grow * 2)} />
      <Rain x0={820} x1={1320} y0={380} y1={800} t={t} n={40} dens={rain} />
    </g>
  );
};

// ---------- D5: "60%" counting up, a raincloud over land on the left, sea + steam on the right ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(60 * easeOut(clamp(t / 28)));
  return (
    <BigNum t={t} len={len} id="d5s" text={`${n}%`} caption="MƯA RƠI XUỐNG ĐẤT LIỀN">
      <Cloud x={380} y={250} s={1.05} />
      <Rain x0={240} x1={540} y0={330} y1={870} t={t} n={22} />
      <path d="M 40 960 Q 260 840 520 900 Q 700 860 760 960 L 760 1100 L 40 1100 Z" fill="#5DB04A" stroke="#2F7A3F" strokeWidth={5} />
      <SeaStrip id="d5sea" x0={1240} x1={1900} y={880} depth={200} t={t} />
      <Steam x={1560} y={880} t={t} n={5} h={460} col="#BFE6FA" w={14} />
    </BigNum>
  );
};

// ---------- D6: a donut: 60% of land rain comes from the ocean ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 20);
  const pop = easeOut(clamp((t - 14) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <Schematic t={t} id="d6s" />
      <g transform="translate(960 500)">
        <circle r={236} fill="#0B0816" opacity={0.5} />
        <Donut slices={[[0.6, '#4FB4F0'], [0.4, '#5DB04A']]} r={200} th={58} k={k} />
        <text y={44} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={130} fill={SCH.live} opacity={pop} style={{ filter: `drop-shadow(0 0 18px ${SCH.glow}88)` }}>60%</text>
      </g>
      <g transform={`translate(420 500) scale(${1.1 * easeOut(clamp(t / 10))})`}><ThreatIcon kind="rain" t={t} /></g>
      <g transform={`translate(1500 500) scale(${1.1 * easeOut(clamp((t - 4) / 10))})`}><circle r={120} fill="#4FB4F0" stroke="#14121A" strokeWidth={8} /><path d="M -80 -10 q 20 -26 40 0 t 40 0 t 40 0 t 40 0 M -80 30 q 20 -26 40 0 t 40 0 t 40 0 t 40 0" stroke="#FFFFFF" strokeWidth={12} fill="none" strokeLinecap="round" /></g>
      <Pill x={960} y={880} t={t - 22} text="TỪ ĐẠI DƯƠNG" size={56} col="#9AD8FF" />
    </g>
  );
};

// ---------- D7: clouds fade, the rain thins and stops; Pip holds out an empty palm ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 640, y: 770, scale: 1.15, yaw: 0.35, look: 0.2, expr: 'neutral', armL: { a: 8, b: -8 }, armR: { a: 95, b: -8 }, handR: 'open' } },
    { f: 53, p: { armR: { a: 95, b: -8 } } },
    { f: 62, p: { armR: { a: 40, b: -20 }, headTilt: 6 } },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [53, 'worried']]);
  const dry = kf(t, [[0, 0.1], [len, 0.55]]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 800]]), 540, kf(t, [[0, 1], [len, 1.12]]))}>
      <Delta id="d7d" t={t} dry={dry} />
      {[[300, 150, 2.2], [820, 110, 2], [1320, 170, 2.3], [1750, 120, 1.9]].map(([x, y, s], i) => (
        <Cloud key={i} x={x - t * 0.3} y={y} s={s} col="#B8C8D6" shade="#8DA2B4" o={0.95 * clamp(1 - (t - 6 * i) / 48)} />
      ))}
      <Rain x0={80} x1={1850} y0={240} y1={930} t={t} n={70} dens={kf(t, [[0, 1], [53, 0]])} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...face }} rimId="rimR" shadow={0.8} />
    </g>
  );
};

// ---------- D8: the lush Mekong delta, a farmer in a conical hat; labels pop on ----------
const Farmer: React.FC<{ x: number; y: number; s: number; t: number }> = ({ x, y, s, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cy={6} rx={64} ry={10} fill="#000" opacity={0.25} />
    <path d="M -30 0 L -26 -70 L 26 -70 L 30 0 Z" fill="#2E3A52" stroke="#14121A" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -34 -66 Q -40 -118 -22 -128 L 22 -128 Q 40 -118 34 -66 Z" fill="#8A5A3A" stroke="#14121A" strokeWidth={5} strokeLinejoin="round" />
    <path d={`M -28 -118 L ${-62 - Math.sin(t / 14) * 4} -72 M 28 -118 L ${62 + Math.sin(t / 14) * 4} -72`} stroke="#8A5A3A" strokeWidth={13} strokeLinecap="round" />
    <circle cy={-150} r={26} fill="#E8B58A" stroke="#14121A" strokeWidth={5} />
    <circle cx={-9} cy={-146} r={3} fill="#14121A" /><circle cx={9} cy={-146} r={3} fill="#14121A" />
    <path d="M -76 -168 L 0 -246 L 76 -168 Q 0 -154 -76 -168 Z" fill="#EBD48E" stroke="#14121A" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -40 -178 L 0 -228 M 0 -170 L 0 -228 M 40 -178 L 0 -228" stroke="#B59A55" strokeWidth={3} />
  </g>
);

export const D8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 560, kf(t, [[0, 1.02], [len, 1.12]]))}>
    <Delta id="d8d" t={t} dry={0} />
    <Farmer x={520} y={900} s={1.3} t={t} />
    <Pill x={960} y={140} t={t - 3} text="ĐỒNG BẰNG SÔNG CỬU LONG" size={46} />
    <Pill x={960} y={990} t={t - 41} text="VỰA LÚA" size={56} col="#FFE27A" />
    <Glow x={1500} y={150} r={300} o={0.3} />
  </g>
);
