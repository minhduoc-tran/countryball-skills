import React from 'react';
import { Hero, LOOKS, poseAt, faceAt, kf, camT, clamp, easeOut, rnd, ShotProps } from '../../engine';

import { HaLongValley } from './chb-halong-valley';
import { VietnamMap, MapPill } from './chb-vietnam-and-sunda-maps';
import { Seabed } from './chb-seabed-props';
import { Duo, Rod, standAt } from './chb-cast-helpers';

// Chapter B, Việt Nam (B1-B5, 66.35-77.66 s): the coast map drying out, Hạ Long's towers on a dry valley floor, the walk
// Đà Nẵng -> Hoàng Sa, the plateaus in the desert.

// ---------- B1: "Còn Việt Nam thì sao?": the S-shaped coast, the sea dries away east, a big ? pops ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <VietnamMap id="b1" t={t} dry={clamp((t - 4) / 26)} labels={false} qmark={clamp((t - 14) / 8)} />
  </g>
);

// ---------- B2: Hạ Long turned into a dry valley: wide, slow push-in, Pip and Mo tiny in front ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.5;
  const pip = poseAt(t, [{ f: 0, p: standAt(760, 1010, sc, { yaw: 0.7, armR: { a: 12, b: -6 }, look: 0.5 }) }, { f: 20, p: { armR: { a: 150, b: -10 } } }]);
  const mo = poseAt(t, [{ f: 0, p: standAt(610, 1018, sc, { yaw: 0.7, armR: { a: 18, b: -30 }, look: 0.5 }) }]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1010]]), kf(t, [[0, 620], [len, 700]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <HaLongValley id="b2" t={t} />
      <Rod x={mo.x} y={mo.y} s={sc} t={t} />
      <Hero look={LOOKS.mo} pose={{ ...mo, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={1} />
      <Hero look={LOOKS.pipHood} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [18, 'shock']]) }} rimId="rimR" shadow={1} />
    </g>
  );
};

// ---------- B3: thousands of limestone towers: tilt up from the mud to the crowns ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1020]]), kf(t, [[0, 900], [len, 470]]), kf(t, [[0, 1.75], [len, 1.12]]))}>
    <HaLongValley id="b3" t={t + 40} />
    {Array.from({ length: 7 }).map((_, i) => {
      const x = ((rnd(7, i) * 2400 + t * (3 + rnd(8, i) * 3)) % 2400) - 240;
      return <ellipse key={i} cx={x} cy={560 + rnd(9, i) * 340} rx={160 + rnd(10, i) * 160} ry={9} fill="#FBF8F0" opacity={0.16} />;
    })}
  </g>
);

// ---------- B4: map: the dotted path from Đà Nẵng out to Hoàng Sa over the dry sea ----------
export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1120]]), kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.28]]))}>
    <VietnamMap id="b4" t={t} dry={1} walk={easeOut(clamp((t - 6) / 52))} />
  </g>
);

// ---------- B5: Hoàng Sa is a row of plateaus in the desert; Pip and Mo trek toward them ----------
const Mesa: React.FC<{ x: number; w: number; h: number; base: number; seed: number }> = ({ x, w, h, base, seed }) => (
  <g>
    <ellipse cx={x} cy={base + 4} rx={w * 0.62} ry={9} fill="#000" opacity={0.2} />
    <path d={`M ${x - w / 2} ${base} L ${x - w * 0.42} ${base - h} L ${x + w * 0.4} ${base - h - rnd(seed, 1) * 8} L ${x + w / 2} ${base} Z`} fill="#B58B5A" stroke="#4E3A28" strokeWidth={3} strokeLinejoin="round" />
    <path d={`M ${x + w * 0.1} ${base} L ${x + w * 0.14} ${base - h} L ${x + w * 0.4} ${base - h - 4} L ${x + w / 2} ${base} Z`} fill="#7E5C3A" opacity={0.7} />
    <path d={`M ${x - w * 0.42} ${base - h} L ${x + w * 0.4} ${base - h - 5}`} stroke="#EBD3A0" strokeWidth={7} strokeLinecap="round" />
    {[0.3, 0.55, 0.78].map((u, i) => <path key={i} d={`M ${x - w * 0.46 + w * 0.04 * i} ${base - h * u} L ${x + w * 0.46 - w * 0.04 * i} ${base - h * u}`} stroke="#8E6A42" strokeWidth={3} opacity={0.6} />)}
  </g>
);
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const lab = clamp((t - 14) / 8);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1180]]), 620, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Seabed id="b5" t={t} haze={0.35} />
      <Mesa x={1020} w={210} h={74} base={500} seed={1} />
      <Mesa x={1250} w={310} h={104} base={512} seed={2} />
      <Mesa x={1520} w={190} h={62} base={498} seed={3} />
      <g opacity={lab} transform={`translate(0 ${(1 - lab) * -20})`}>
        <MapPill x={1250} y={300} t={t - 14} text="HOÀNG SA" color="#FFE27A" size={58} />
        <path d="M 1250 330 L 1250 372 M 1230 356 L 1250 380 L 1270 356" stroke="#FFE27A" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Duo t={t} x={300 + t * 6.5} ground={930} sc={0.5} />
    </g>
  );
};
