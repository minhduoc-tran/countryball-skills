import React from 'react';
import { Hero, LOOKS, faceAt, kf, clamp, camT, poseAt, Schematic, Dust, Sparkle, ShotProps, FONT, UI, backOut } from '../../engine';
import { DrySeabed } from './kit-dry-seabed';
import { BasinSection } from './kit-ocean-section';
import { FactStamp } from './kit-hud';
import { fmtVN } from '../khong-ai-ngheo/chb-cards-and-marks';
import { Volcano, PeakCompare, RidgeGlow } from './cha-world-props';

// Chapter A, the hidden world, part 2 (52.6-66.4 s): the Pacific volcano, > 10.000 m from its base, taller than Everest;
// the Mariana trench 10.935 m, Everest lowered in with > 2 km to spare; "ĐÓ LÀ THẬT" at the end.

// ---------- A30: the volcano rising out of the dry Pacific floor, smoke and glow at its crater ----------
export const A30: React.FC<ShotProps> = ({ t, len }) => {
  const s = backOut(clamp((t - 18) / 8));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1000]]), kf(t, [[0, 520], [len, 440]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <DrySeabed id="cf30" t={t + 90} haze={0.3} />
      <Volcano x={1000} base={700} h={560} w={560} t={t} />
      <g transform={`translate(520 190) scale(${s})`}>
        <rect x={-210} y={-34} width={420} height={68} rx={34} fill={UI.pill} opacity={0.75} />
        <text y={13} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={UI.text} letterSpacing={2}>THÁI BÌNH DƯƠNG</text>
      </g>
    </g>
  );
};

// ---------- A31: on the section: the volcano's foot-to-peak bracket labelled > 10.000 m ----------
export const A31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1560], [len, 1600]]), kf(t, [[0, 360], [len, 330]]), kf(t, [[0, 1.25], [len, 1.35]]))}>
    <BasinSection id="cf31" t={t} water={0} show={{ names: false, ticks: false }} />
  </g>
);

// ---------- A32: Everest 8.849 m against the volcano: the volcano rises past it ----------
export const A32: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="cf32" />
    <PeakCompare t={t} />
  </g>
);

const CAM = (t: number) => camT(1200, 640, kf(t, [[0, 1.2], [90, 1.27]]));

// ---------- A33: the Mariana trench: 10.935 M counting up in a panel ----------
export const A33: React.FC<ShotProps> = ({ t }) => {
  const v = Math.round(10935 * (1 - Math.pow(1 - clamp((t - 6) / 30), 3)));
  return (
    <g>
      <g transform={CAM(t)}><BasinSection id="cf33" t={t + 20} water={0} show={{ volcano: false, names: false }} /></g>
      <g transform="translate(60 60)">
        <rect width={700} height={170} rx={34} fill={UI.pill} opacity={0.8} />
        <text x={36} y={56} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill={UI.text} letterSpacing={3}>RÃNH MARIANA</text>
        <text x={36} y={140} fontFamily={FONT.ui} fontWeight={700} fontSize={92} fill={UI.live}>{`${fmtVN(v)} M`}</text>
      </g>
    </g>
  );
};

// ---------- A34: Everest is lowered into the trench ----------
export const A34: React.FC<ShotProps> = ({ t }) => (
  <g transform={CAM(t)}>
    <BasinSection id="cf34" t={t + 60} water={0} everest={kf(t, [[4, 0], [44, 0.69]])} show={{ volcano: false }} />
  </g>
);

// ---------- A35: ...and the bracket shows more than two kilometres left above it ----------
export const A35: React.FC<ShotProps> = ({ t }) => (
  <g transform={CAM(t + 51)}>
    <BasinSection id="cf35" t={t + 110} water={0} everest={kf(t, [[0, 0.69], [34, 1]])} show={{ volcano: false }} />
  </g>
);

// ---------- A36: "ĐÓ LÀ THẬT": Pip at the lip, the stamp thumps on ----------
export const A36: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 440, y: 790, scale: 0.85, yaw: 0.85, look: 0.8, tilt: 5, armR: { a: 22, b: -6 } } }, { f: len, p: { tilt: 8 } }]);
  return (
    <g>
      <g transform={camT(800, 540, kf(t, [[0, 1.2], [len, 1.28]]))}>
        <DrySeabed id="cf36" t={t + 120} haze={0.2} />
        <RidgeGlow t={t} />
        <Hero look={LOOKS.pipHood} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
        <Dust t={t} seed={4} x0={0} y0={420} w={1920} h={520} n={26} o={0.5} />
        <Sparkle x={1260} y={410} t={t - 6} s={1.4} />
      </g>
      <FactStamp t={t} at={3} />
    </g>
  );
};
