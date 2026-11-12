import React from 'react';
import { ShotProps, kf, camT, clamp, easeOut, easeIn, Sparkle } from '../../engine';
import { Pier, BigWave, QuayTowers, SprayColumn, HarborBack, SeaFront, CargoShip, OctoBody, OctoArms, OctoOpts, Ripples } from './chc-harbour-props';
import { HarborScene, SHIP0, OCTO0 } from './chc-harbour-scene';
import { CalmPunchPip } from './chc-calm-punch-pip';
import { PIP_PIER } from './shots-chc-octopus-rise';
import { FistInsert, punchFist } from './punch-pip-and-fist';
import { ImpactFlash, Shockwave, BoomWord, SpeedLines, StreakLines, shakeAt } from './punch-fx-kit';

// CHAPTER C, octopus part 2 (C6-C10): fist insert, THE HIT on "Bùm" (C7), the building-tall wave, the ship set free.
const bobShip = (t: number, k = 1) => ({ ...SHIP0, dy: Math.sin(t * 0.1) * 6 * k, rot: Math.sin(t * 0.07) * 0.8 * k });

// ---------- C6: "Một cú đấm.": the fist clenches and drives at the lens ----------
export const C6: React.FC<ShotProps> = ({ t }) => {
  const sk = shakeAt(t, 31, 14, 4);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <FistInsert t={t} id="c6" clenchAt={2} thrustAt={30} />
      <SpeedLines t={t} cx={960} cy={560} o={t > 26 ? 0.8 : 0} rIn={260} color="#FFF3C4" seed={4} />
    </g>
  );
};

// ---------- C7: "Bùm.": the punch lands, a shockwave runs over the water, the octopus is flung away ----------
export const C7: React.FC<ShotProps> = ({ t }) => {
  const hitT = 2;
  const h = t - hitT;
  const fist = punchFist(t, hitT, PIP_PIER);
  const p = clamp(h / 24);
  const octo: OctoOpts = { ox: OCTO0.ox + 1500 * easeIn(p) * 0.9 + 120 * p, oy: OCTO0.oy - 1250 * easeOut(p) + 300 * p * p, sc: 1.0 - 0.15 * p, rot: 540 * p };
  const wrap = 1 - easeOut(clamp(h / 5));
  const sk = shakeAt(t, hitT, 26, 14);
  return (
    <g transform={`translate(${sk.x} ${sk.y})`}>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [hitT + 2, 1.06], [23, 1.0]]))}>
        <HarborScene t={t + 300} id="c7" octo={octo} wrap={t < hitT ? 1 : wrap} flail={2.2} squeeze={t < hitT ? 0.6 : 0} look={0.8} lookY={-0.5} lid={0} mouth={1} ship={{ ...SHIP0, dy: Math.sin(h * 0.5) * clamp(h / 4) * 14, rot: h > 0 ? -2.5 * Math.exp(-h / 10) : 0 }} />
        {Array.from({ length: 7 }).map((_, i) => <SprayColumn key={i} t={t} at={hitT + 1 + i * 2} x={840 + i * 140} y={746 + (i % 2) * 6} h={330 - i * 14} w={120} seed={5 + i} />)}
        <Shockwave t={t} hitT={hitT} x={fist.x + 20} y={fist.y} kind="air" r={1000} len={24} />
        <Shockwave t={t} hitT={hitT} x={820} y={780} kind="ground" r={1500} len={26} />
        <Pier id="c7p" />
        <CalmPunchPip t={t} hitT={hitT} {...PIP_PIER} rimId="rimR" />
        <SpeedLines t={t} cx={fist.x + 40} cy={fist.y} o={h >= 0 && h < 8 ? 0.8 : 0} rIn={300} />
        <ImpactFlash t={t} hitT={hitT} x={fist.x + 40} y={fist.y} r={760} />
        <BoomWord t={t} at={hitT + 3} x={1130} y={300} size={230} rot={-6} />
      </g>
    </g>
  );
};

// ---------- C8: "Sóng dâng cao như tòa nhà": a wave taller than the port tower ----------
export const C8: React.FC<ShotProps> = ({ t }) => {
  const rise = clamp(t / 34);
  return (
    <g transform={`translate(${shakeAt(t, 0, 10, 14).x} ${shakeAt(t, 0, 10, 14).y})`}>
      <g transform={camT(kf(t, [[0, 980], [55, 1000]]), kf(t, [[0, 600], [55, 470]]), kf(t, [[0, 0.95], [55, 0.85]]))}>
        <HarborBack t={t + 400} id="c8" />
        <QuayTowers x={1430} y={812} id="c8t" />
        <BigWave t={t} x={480} y={790} w={900} h={800} rise={rise} id="c8w" />
        <SeaFront t={t + 400} wl={790} />
        <Pier id="c8p" />
        <CalmPunchPip t={t} hitT={-40} {...PIP_PIER} rimId="rimR" />
      </g>
    </g>
  );
};

// ---------- C9: "Con tàu được thả ra": the ship rocks free on the swell; far away, the octopus is a speck in the sky ----------
export const C9: React.FC<ShotProps> = ({ t }) => {
  const k = Math.exp(-t / 40);
  const p = clamp(t / 38);
  const far: OctoOpts = { ox: 1480 + 330 * p, oy: 330 + 170 * p * p - 190 * Math.sin(p * Math.PI), sc: 0.17, rot: 200 * p };
  return (
    <g transform={camT(1300, 520, 1.05)}>
      <HarborScene t={t + 500} id="c9" hideOcto ship={{ ...SHIP0, dy: Math.sin(t * 0.22) * 16 * k, rot: Math.sin(t * 0.17) * 3 * k }} />
      <Ripples t={t} x={1230} y={730} rx={470} />
      <g opacity={p < 1 ? 1 : 0}>
        <OctoBody o={far} t={t} look={0} />
        <OctoArms o={far} t={t} ship={SHIP0} flail={2} />
      </g>
      <SprayColumn t={t} at={36} x={1745} y={456} h={70} w={50} seed={2} />
    </g>
  );
};

// ---------- C10: "nguyên vẹn": close on the containers, every one intact; they sparkle ----------
export const C10: React.FC<ShotProps> = ({ t }) => {
  const k = Math.exp(-t / 30);
  return (
    <g transform={camT(1240, 560, kf(t, [[0, 2.2], [24, 2.0]]))}>
      <HarborScene t={t + 540} id="c10" hideOcto ship={{ ...SHIP0, dy: Math.sin(t * 0.22 + 2) * 9 * k, rot: Math.sin(t * 0.17) * 1.6 * k }} />
      {[[1060, 520], [1180, 470], [1300, 530], [1420, 480], [1130, 600]].map(([x, y], i) => <Sparkle key={i} x={x} y={y} t={t - 2 - i * 3} s={2} />)}
      <g transform={`translate(${1420 + 0} ${420}) scale(${clamp((t - 4) / 5) * 1.2})`}>
        <circle r={54} fill="#3EC878" stroke="#16101A" strokeWidth={8} />
        <path d="M -24 2 L -6 22 L 28 -18" stroke="#FFFFFF" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};
