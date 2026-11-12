import React from 'react';
import { Schematic, kf, clamp, camT, easeOut, ShotProps } from '../../engine';
import { Globe } from './kit-globe';
import { OceanMeter, BigNum } from './kit-hud';
import { BasinSection, SECTION } from './kit-ocean-section';
import { WaterCube, DropGrid, DepthBracket, BigText, Caption } from './cha-scale-props';

// Chapter A, the scale (28.0-42.1 s): 71% of the surface, 1,3 tỷ km³, 97% of all water, the whole sea as one giant
// hole (Globe water 1 -> 0 with the ocean meter), and the basin's mean depth ≈ 3.700 m on a section.

// ---------- A19: the Earth, 71% counting up beside it ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const pct = Math.round(71 * easeOut(clamp((t - 4) / 26)));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="cd19" />
      <Globe id="cd19g" t={t} r={330} cx={600} cy={540} rot={-40} />
      <BigText x={1330} y={600} text={`${pct}%`} size={300} t={t} />
      <Caption x={1330} y={690} text="BỀ MẶT TRÁI ĐẤT" t={t - 10} />
    </g>
  );
};

// ---------- A20: 1,3 TỶ KM³, a cube of water beside the counting number ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => (
  <BigNum t={t} len={len} id="cd20" to={1.3} dec={1} unit="TỶ KM³" caption="NƯỚC TRONG ĐẠI DƯƠNG">
    <WaterCube x={330} y={560} s={1.25} t={t - 2} />
    <WaterCube x={1590} y={560} s={1.25} t={t - 6} />
  </BigNum>
);

// ---------- A21: 97%: a hundred droplets fill in, ninety-seven blue, three pale ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t} id="cd21" />
    <DropGrid x={190} y={230} t={t} />
    <BigText x={1330} y={560} text="97%" size={290} t={t - 18} />
    <Caption x={1330} y={650} text="TOÀN BỘ NƯỚC" t={t - 26} />
    <Caption x={1330} y={705} text="TRÊN HÀNH TINH" t={t - 28} />
  </g>
);

// ---------- A22: the whole sea drains off the globe and the ocean meter falls 100% -> 0% ----------
export const A22: React.FC<ShotProps> = ({ t, len }) => {
  const water = kf(t, [[6, 1], [52, 0]]);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
        <Schematic t={t} id="cd22" />
        <Globe id="cd22g" t={t} r={340} cx={1000} cy={560} water={water} rot={20} />
      </g>
      <OceanMeter x={70} y={70} p={water} t={t} />
    </g>
  );
};

// ---------- A23: the empty basin on its section: the mean depth ≈ 3.700 m bracketed ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 900]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <BasinSection id="cd23" t={t} water={kf(t, [[2, 1], [22, 0]])} show={{ names: false, volcano: false }} />
    <DepthBracket x={780} y0={SECTION.SEA_Y} y1={SECTION.PLAIN_Y} t={t - 34} label="≈ 3.700 M" />
  </g>
);
