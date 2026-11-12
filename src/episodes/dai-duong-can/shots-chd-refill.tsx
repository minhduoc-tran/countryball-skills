import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, ShotProps, SCH, UI, FONT } from '../../engine';
import { DrySeabed } from './kit-dry-seabed';
import { BasinSection } from './kit-ocean-section';
import { Pill } from './chd-sky-props';
import { IceBlock } from './chd-icon-props';
import { Jug, PourStream, Drip, WaveArcs, spoutOf, surfaceY } from './chd-refill-props';

// Chapter D, "7 refill" (229.87-240.93 s): D24 the empty basin and a "?", D25 rivers and lakes poured in, D26 polar ice melts in,
// D27 the level barely rises: "< 2%", D28 Pip listens for a wave that never comes.

const NO_LABELS = { names: false, volcano: false } as const;

// ---------- D24: the empty basin, a huge question mark pulsing ----------
export const D24: React.FC<ShotProps> = ({ t, len }) => {
  const q = 1 + 0.06 * Math.sin(t / 3.5);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.07]]))}>
      <BasinSection id="d24b" t={t + 26} water={0} show={NO_LABELS} />
      <g transform={`translate(900 520) scale(${q * backOut(clamp((t + 3) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={380} fill={UI.live} stroke="#14121A" strokeWidth={10} style={{ filter: `drop-shadow(0 0 24px ${SCH.glow}88)` }}>?</text>
      </g>
    </g>
  );
};

// ---------- D25: a jug of rivers pours into the trench, then a jug of lakes (at "mọi hồ nước") ----------
export const D25: React.FC<ShotProps> = ({ t, len }) => {
  const water = kf(t, [[0, 0], [len, 0.1]]);
  const ty = surfaceY(water) - 4;
  const a = spoutOf(1440, 210, -40, 1, 0.8);
  const b = spoutOf(1000, 210, -40, -1, 0.8);
  return (
    <g transform={camT(1100, 540, kf(t, [[0, 1], [len, 1.05]]))}>
      <BasinSection id="d25b" t={t + 26} water={water} show={NO_LABELS} />
      <Jug x={1440} y={210} rot={-40} dir={1} s={0.8} label="SÔNG" k={(t + 2) / 8} />
      <PourStream sx={a.x} sy={a.y} tx={1255} ty={ty} t={t} t0={4} />
      <Jug x={1000} y={210} rot={-40} dir={-1} s={0.8} label="HỒ" col="#6FC7E8" k={(t - 43) / 8} />
      <PourStream sx={b.x} sy={b.y} tx={1175} ty={ty} t={t} t0={47} />
    </g>
  );
};

// ---------- D26: polar ice melts into the trench ----------
export const D26: React.FC<ShotProps> = ({ t, len }) => {
  const water = kf(t, [[0, 0.1], [len, 0.17]]);
  const ty = surfaceY(water) - 4;
  const melt = clamp(t / len);
  const pop = easeOut(clamp((t + 2) / 8));
  return (
    <g transform={camT(1100, 540, kf(t, [[0, 1], [len, 1.04]]))}>
      <BasinSection id="d26b" t={t + 26} water={water} show={NO_LABELS} />
      <g opacity={pop}>
        <IceBlock x={1110} y={190} s={0.8} melt={melt} />
        <IceBlock x={1340} y={170} s={0.7} melt={melt * 0.9} />
      </g>
      <PourStream sx={1130} sy={236} tx={1190} ty={ty} t={t} t0={6} w={12} />
      <PourStream sx={1330} sy={208} tx={1250} ty={ty} t={t} t0={12} w={12} />
      <Drip x={1215} y0={250} y1={ty - 10} t={t} n={6} spread={120} />
      <Pill x={620} y={120} t={t - 4} text="BĂNG HAI CỰC" size={44} col="#CFF0FF" />
    </g>
  );
};

// ---------- D27: the level barely rises above the trench floor: "< 2%" ----------
export const D27: React.FC<ShotProps> = ({ t, len }) => {
  const water = 0.17;
  const ty = surfaceY(water);
  const k = easeOut(clamp((t - 6) / 10));
  const pop = backOut(clamp((t - 2) / 9));
  return (
    <g transform={camT(1000, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <BasinSection id="d27b" t={t + 26} water={water} show={NO_LABELS} />
      <g opacity={k}>
        <path d={`M 1215 340 L 1215 ${ty - 10}`} stroke={UI.live} strokeWidth={7} strokeLinecap="round" strokeDasharray="14 12" />
        <path d={`M 1195 365 L 1215 335 L 1235 365 M 1195 ${ty - 36} L 1215 ${ty - 6} L 1235 ${ty - 36}`} stroke={UI.live} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform={`translate(840 250) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={230} fill={UI.live} stroke="#14121A" strokeWidth={12} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{'< 2%'}</text>
      </g>
    </g>
  );
};

// ---------- D28: Pip on the shelf lip listens; sound arcs drift out over the abyss and die ----------
export const D28: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 760, y: 640, scale: 1.1, yaw: 0.7, look: 0.9, expr: 'worried', headTilt: 6, armL: { a: 8, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 30, p: { headTilt: 10 } },
  ]);
  const face = faceAt(t, [[0, 'worried'], [30, 'tired']]);
  const k = (t % 26) / 26;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 600, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <DrySeabed id="d28s" t={t} haze={0.4} dust={0.2} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...face }} rimId="rimL" shadow={0.8} />
      <WaveArcs x={1000} y={560} k={k} s={1.4} />
      <path d="M 1130 560 L 1290 560" stroke="#BFE6FA" strokeWidth={8} strokeLinecap="round" strokeDasharray="22 16" opacity={clamp((t - 22) / 8) * 0.7} />
    </g>
  );
};
