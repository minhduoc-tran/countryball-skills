import React from 'react';
import { ShotProps, kf, camT, clamp, easeInOut, easeOut, WallCalendar, HudChip, TapeLines, Glow, LOOKS } from '../../engine';
import { ImpactFlash, Shockwave, StreakLines, SpeedLines, BoomWord, shakeAt } from './punch-fx-kit';
import { punchFist, FistInsert } from './punch-pip-and-fist';
import { CalmPunchPip } from './chc-calm-punch-pip';
import { CloudDeck, Rain } from './storm-sky';
import { RainWindow, RoofSlab, BalconyBuilding, Rainbow, PopPill } from './chc-city-props';

// CHAPTER C, rainy season (C11-C20): three grey days, Pip punches straight up, the cloud deck splits, the city cheers,
// then the freeze-frame "Nhưng khoan đã". Words: "Rồi mùa mưa đến. ... Cả thành phố vỗ tay. Nhưng khoan đã."
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);
const PIPR = { x: 640, ground: 1004, scale: 0.9, side: 1 as const, aim: 125, lunge: 24, lean: -8 };
const HIT = 2; // C16: the hit is on frame 2; the tear carries on into C17 (20 frames later)
const splitAt = (h: number) => easeInOut(lin(h, 2, 60));

// ---------- C11: "Rồi mùa mưa đến.": rain on the window, the city a blur of lights ----------
export const C11: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [37, 1.12]]))}>
    <RainWindow t={t + 30} id="c11" />
  </g>
);

// ---------- C12: "Mây đen che kín thành phố": the cloud ceiling sinks over the roofs ----------
export const C12: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, kf(t, [[0, 520], [44, 600]]), kf(t, [[0, 1.0], [44, 1.12]]))}>
    <CloudDeck t={t + 40} id="c12" base={kf(t, [[0, 330], [44, 560]])} />
    <Rain t={t} intensity={1.3} />
  </g>
);

// ---------- C13: "ba ngày liền không thấy mặt trời": the calendar crosses off three grey days ----------
export const C13: React.FC<ShotProps> = ({ t }) => {
  const day = (d: number) => lin(t, 4 + d * 14, 10);
  const crossed = day(0) >= 1 ? (day(1) >= 1 ? (day(2) >= 1 ? 3 : 2) : 1) : 0;
  const drawing = crossed === 0 ? day(0) : crossed === 1 ? day(1) : crossed === 2 ? day(2) : 0;
  const grey = Math.min(0.5, 0.18 + 0.1 * crossed);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [54, 1.06]]))}>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#1B2030" />
      <rect x={1120} y={170} width={560} height={640} fill="#2A334D" stroke="#0E1120" strokeWidth={10} />
      <rect x={1120} y={170} width={560} height={640} fill="#46547A" opacity={grey} />
      <path d="M 1400 170 V 810 M 1120 490 H 1680" stroke="#0E1120" strokeWidth={10} />
      <g transform="translate(1120 170)"><Rain t={t} intensity={0.35} x0={0} x1={560} y0={0} y1={640} /></g>
      <rect x={1090} y={800} width={620} height={24} fill="#0E1120" />
      <WallCalendar x={600} y={150} w={620} crossed={crossed} drawing={drawing} />
      <PopPill x={1400} y={900} t={t - 38} text="3 NGÀY" />
    </g>
  );
};

// ---------- C14: "Bạn đấm thẳng lên trời.": low angle, Pip on the roof in the rain, fist coiling ----------
export const C14: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(kf(t, [[0, 900], [42, 860]]), 600, kf(t, [[0, 1.0], [42, 1.08]]))}>
    <CloudDeck t={t + 90} id="c14" />
    <Rain t={t} intensity={1.3} />
    <RoofSlab y={1010} />
    <CalmPunchPip t={t} hitT={56} {...PIPR} rimId="rimBlue" />
    <Rain t={t + 7} intensity={0.35} seed={9} />
  </g>
);

// ---------- C15: "Một cú đấm.": the fist clenches and drives at the lens ----------
export const C15: React.FC<ShotProps> = ({ t }) => {
  const sk = shakeAt(t, 22, 14, 4);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <FistInsert t={t} id="c15" clenchAt={1} thrustAt={21} side={-1} />
    </g>
  );
};

// ---------- C16: "Bùm.": the uppercut at the sky; the cloud deck begins to tear ----------
export const C16: React.FC<ShotProps> = ({ t }) => {
  const fist = punchFist(t, HIT, PIPR);
  const sk = shakeAt(t, HIT, 22, 12);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <CloudDeck t={t + 110} id="c16" split={splitAt(t)} tearX={fist.x + 260} />
      <Rain t={t} intensity={1.1 * (1 - splitAt(t))} />
      <RoofSlab y={1010} />
      <Shockwave t={t} hitT={HIT} x={fist.x} y={fist.y} kind="air" r={900} len={22} />
      <Shockwave t={t} hitT={HIT + 3} x={fist.x} y={fist.y - 200} kind="air" r={1300} len={22} />
      <CalmPunchPip t={t} hitT={HIT} {...PIPR} rimId="rimBlue" />
      <StreakLines t={t} x={fist.x} y={fist.y} dir={-62} n={t >= HIT - 2 && t < HIT + 6 ? 12 : 0} len={560} />
      <SpeedLines t={t} cx={fist.x} cy={fist.y} o={t >= HIT && t < HIT + 8 ? 0.8 : 0} rIn={320} />
      <ImpactFlash t={t} hitT={HIT} x={fist.x} y={fist.y} r={760} />
      <BoomWord t={t} at={HIT + 4} x={1330} y={640} size={250} rot={-6} />
    </g>
  );
};

// ---------- C17: "Mây tách ra làm đôi.": the whole sky splits, the halves swing apart ----------
export const C17: React.FC<ShotProps> = ({ t }) => {
  const h = t + 20;
  const fist = punchFist(h, HIT, PIPR);
  const sp = splitAt(h);
  return (
    <g transform={camT(960, kf(t, [[0, 470], [41, 540]]), kf(t, [[0, 1.12], [41, 1.0]]))}>
      <CloudDeck t={h + 110} id="c17" split={sp} tearX={fist.x + 260} />
      <Rain t={t} intensity={1.1 * (1 - sp)} />
      <RoofSlab y={1010} />
      <CalmPunchPip t={h} hitT={HIT} {...PIPR} rimId="rimBlue" />
    </g>
  );
};

// ---------- C18: "Nắng chiếu xuống.": a column of sunlight on the city, a rainbow draws in ----------
export const C18: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(kf(t, [[0, 960], [35, 1000]]), kf(t, [[0, 640], [35, 600]]), kf(t, [[0, 1.35], [35, 1.2]]))}>
    <CloudDeck t={t + 300} id="c18" split={1} tearX={1060} />
    <Rainbow p={lin(t, 6, 26)} cx={1160} cy={900} r={760} />
    <Glow x={1060} y={500} r={900} kind="warm" o={0.55} />
  </g>
);

// ---------- C19: "Cả thành phố vỗ tay.": neighbours clap on their balconies in the sun ----------
export const C19: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.12], [56, 1.0]]))}>
    <BalconyBuilding t={t} id="c19" />
  </g>
);

// ---------- C20: "Nhưng khoan đã.": the cheering frame freezes, desaturates and rewinds ----------
export const C20: React.FC<ShotProps> = ({ t }) => {
  const hold = 40 - (t % 8 < 2 ? 6 : 0); // the picture is stuck; a stutter jumps it back a few frames every 8
  return (
    <g>
      <defs>
        <filter id="c20g" filterUnits="userSpaceOnUse" x={0} y={0} width={1920} height={1080}>
          <feColorMatrix type="saturate" values="0.12" />
          <feComponentTransfer><feFuncR type="linear" slope="0.9" intercept="0.02" /><feFuncG type="linear" slope="0.95" intercept="0.03" /><feFuncB type="linear" slope="1.1" intercept="0.08" /></feComponentTransfer>
        </filter>
      </defs>
      <g filter="url(#c20g)" transform={camT(960, 540, kf(t, [[0, 1.0], [28, 1.06]]))}>
        <BalconyBuilding t={hold} id="c20" />
      </g>
      <TapeLines f={t} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0B1230" opacity={0.25} />
      <HudChip x={96} y={112} f={t} label="DỪNG" icon="pause" />
    </g>
  );
};
