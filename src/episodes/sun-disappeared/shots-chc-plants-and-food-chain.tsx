import React from 'react';
import { kf, clamp, easeOut, camT, Schematic, SCH, SchLabel, ShotProps, FONT, mixHex, backOut } from '../../engine';
import { StarSky } from './chc-sky-and-people-props';
import { PottedPlant, GrassRow, BigTree, ChainIcon, ChainArrow, Cap } from './chc-plants-and-food-chain-props';

// Chapter C, beat "plants" (C22-C27): plants stop making food when the light goes out; small plants die in weeks; a big
// tree lives on its stored sugar for years; then everything that eats plants, and everything that eats those, starves.

// ---------- C22: schematic: sunlight in, sugar out; the light goes out and the plant wilts ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const OFF = 46;
  const off = t >= OFF;
  const droop = easeOut(clamp((t - OFF - 4) / 34));
  const fade = off ? clamp(1 - (t - OFF) / 6) : 1;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c22" />
      {/* the Sun and its rays, going dark at "the light goes out" */}
      <g transform="translate(330 250)">
        <circle r={80} fill={off ? '#2A3350' : '#FFC85A'} stroke={off ? SCH.dim : '#FFE2A8'} strokeWidth={6} style={{ filter: off ? 'none' : 'drop-shadow(0 0 24px #FFB15A)' }} />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M 0 -104 L 0 -134" stroke={off ? SCH.dim : '#FFC85A'} strokeWidth={8} strokeLinecap="round" opacity={off ? 0.35 : 1} transform={`rotate(${i * 30})`} />)}
        {off ? <path d="M -56 -56 L 56 56 M 56 -56 L -56 56" stroke="#FF5A4A" strokeWidth={12} strokeLinecap="round" /> : null}
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${430 + i * 30} ${300 + i * 60} L ${640 + i * 20} ${430 + i * 70}`} stroke="#FFC85A" strokeWidth={8} strokeLinecap="round" strokeDasharray="22 16" strokeDashoffset={-t * 3} opacity={fade * 0.9} />
      ))}
      <PottedPlant x={900} y={900} s={2.0} droop={droop} t={t} />
      {/* sugar: golden dots flowing down the stem to the roots while the light is on */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p = ((t * 0.03 + i / 6) % 1);
        return <circle key={i} cx={1010 + Math.sin(p * 6 + i) * 16} cy={560 + p * 260} r={11} fill="#FFE27A" opacity={fade * Math.sin(p * Math.PI)} style={{ filter: 'drop-shadow(0 0 8px #FFB15A)' }} />;
      })}
      <SchLabel x={1440} y={420} t={t - 4} text="LIGHT IN" size={48} color="#FFC85A" />
      <SchLabel x={1440} y={520} t={t - 12} text="SUGAR OUT" size={48} color="#FFE27A" />
      {off ? <SchLabel x={1440} y={780} t={t - OFF - 2} text="NO LIGHT = NO FOOD" size={44} color="#FF5A4A" /> : null}
    </g>
  );
};

// ---------- C23: a dark field: the grass yellows, browns and flops over as the weeks tick by ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / (len - 6));
  const week = 1 + Math.floor(p * 3.99);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <StarSky t={t} id="c23sky" horizonY={640} n={110} seed={71} />
      <rect x={-400} y={640} width={2720} height={600} fill="#1A1C2E" />
      <rect x={-400} y={640} width={2720} height={4} fill="#5A6CB0" opacity={0.35} />
      <GrassRow x0={-100} x1={2020} y={700} n={60} brown={p} lean={clamp(p * 1.3 - 0.3)} h={70} t={t} seed={4} />
      <GrassRow x0={-100} x1={2020} y={800} n={40} brown={p} lean={clamp(p * 1.3 - 0.3)} h={110} t={t} seed={8} />
      <GrassRow x0={-100} x1={2020} y={960} n={26} brown={p} lean={clamp(p * 1.3 - 0.3)} h={190} t={t} seed={12} />
      <g transform="translate(1500 190)">
        <rect x={-210} y={-52} width={420} height={104} rx={52} fill="#0A0E22" opacity={0.82} stroke={SCH.line} strokeWidth={4} />
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={58} fill={mixHex('#FFE27A', '#FF8A3D', p)} letterSpacing={3}>{`WEEK ${week}`}</text>
      </g>
    </g>
  );
};

// ---------- C24: a big tree stands in the dark, leaves still on ----------
export const C24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
    <StarSky t={t} id="c24sky" horizonY={760} n={120} seed={73} />
    <rect x={-400} y={880} width={2720} height={500} fill="#14162A" />
    <rect x={-400} y={880} width={2720} height={4} fill="#5A6CB0" opacity={0.3} />
    <GrassRow x0={-100} x1={2020} y={930} n={30} brown={1} lean={0.8} h={80} t={t} seed={15} />
    <BigTree x={960} y={930} s={1.0} t={t} />
  </g>
);

// ---------- C25: into the trunk: a warm glow of stored sugar; pulls back as "years" lands ----------
export const C25: React.FC<ShotProps> = ({ t, len }) => {
  const zoom = kf(t, [[0, 2.4], [44, 2.2], [len, 1.1]]);
  const cy = kf(t, [[0, 780], [44, 760], [len, 520]]);
  const glow = clamp(t / 12);
  const yr = backOut(clamp((t - 48) / 8));
  return (
    <g>
      <g transform={`translate(960 540) scale(${zoom}) translate(-960 ${-cy})`}>
        <StarSky t={t} id="c25sky" horizonY={760} n={120} seed={79} />
        <rect x={-400} y={880} width={2720} height={500} fill="#14162A" />
        <GrassRow x0={-100} x1={2020} y={930} n={30} brown={1} lean={0.8} h={80} t={t} seed={15} />
        <BigTree x={960} y={930} s={1.0} t={t + 30} glow={glow} />
      </g>
      <g transform="translate(1440 260)">
        <rect x={-290} y={-54} width={580} height={108} rx={54} fill="#0A0E22" opacity={0.85} stroke="#FFC85A" strokeWidth={4} />
        <circle cx={-228} cy={0} r={20} fill="#FFE27A" style={{ filter: 'drop-shadow(0 0 10px #FFB15A)' }} />
        <text x={30} y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill="#FFE2A8" letterSpacing={3}>STORED SUGAR</text>
      </g>
      <g transform={`translate(1440 430) scale(${yr})`}>
        <rect x={-210} y={-60} width={420} height={120} rx={60} fill="#0A0E22" opacity={0.85} stroke={SCH.line} strokeWidth={4} />
        <text x={0} y={24} textAnchor="middle" fontFamily={FONT.ui} fontSize={72} fill={SCH.line} letterSpacing={4}>YEARS</text>
      </g>
    </g>
  );
};

// ---------- the food chain (C26-C27): grass > rabbit > fox, greying out link by link ----------
const grey = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
const Chain: React.FC<{ t: number; id: string; gGrass: number; gRabbit: number; gFox: number }> = ({ t, id, gGrass, gRabbit, gFox }) => (
  <g>
    <Schematic t={t} id={id} />
    <ChainIcon kind="grass" x={420} y={500} g={gGrass} t={t} />
    <ChainArrow x0={575} x1={745} y={500} g={Math.max(gGrass, gRabbit * 0.6)} />
    <ChainIcon kind="rabbit" x={960} y={500} g={gRabbit} t={t} />
    <ChainArrow x0={1115} x1={1285} y={500} g={Math.max(gRabbit, gFox * 0.6)} />
    <ChainIcon kind="fox" x={1500} y={500} g={gFox} t={t} />
    <Cap x={420} y={720} text="PLANTS" size={40} color={mixHex(SCH.line, '#6A7288', gGrass)} />
    <Cap x={960} y={720} text="EAT PLANTS" size={40} color={mixHex(SCH.line, '#6A7288', gRabbit)} />
    <Cap x={1500} y={720} text="EAT THEM" size={40} color={mixHex(SCH.line, '#6A7288', gFox)} />
  </g>
);

// ---------- C26: "everything that eats plants starts to starve": grass already grey, the rabbit follows ----------
export const C26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 640], [len, 860]]), 540, kf(t, [[0, 1.2], [len, 1.4]]))}>
    <Chain t={t} id="c26" gGrass={grey(t, 2, 14)} gRabbit={grey(t, 52, 68)} gFox={0} />
  </g>
);

// ---------- C27: "and then everything that eats those animals": the fox greys; the whole chain is dead ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1250], [len, 1000]]), 540, kf(t, [[0, 1.35], [len, 1.0]]))}>
    <Chain t={t} id="c27" gGrass={1} gRabbit={1} gFox={grey(t, 10, 30)} />
    <g opacity={grey(t, 34, 42)}>
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#FF5A4A" letterSpacing={4}>NOTHING TO EAT</text>
    </g>
  </g>
);
