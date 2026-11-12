import React from 'react';
import { ShotProps } from '../../engine';
import { WaterRipples, WaterSplash } from '../../countryball/ground-water-splash';
import { HoaDang } from '../../countryball/ground-memorial-props';
import { MonsoonRain } from '../../countryball/ground-weather-and-smoke';
import { Flare } from '../../countryball/fx-tracers-and-lights';
import { easeInOut, easeOut, lerp, hash } from '../../countryball/fx-math';
import { Dim, Pop, ramp, sec, Txt } from './chb-common';
import { FlatRiver, Push, SoldierIcon, SrcPlate } from './che-common';

// Chapter E, beat "20 company" (E8-E11, 415.8-426.8 s): "Theo lời kể của các cựu chiến binh": one company crosses at night, the next
// day only a few remain. Losses are shown as pale empty-helmet outlines and quiet lights on the water: nothing graphic.

const COLS = 6, Y0 = 400, Y1 = 690;
const rest = (i: number) => ({ x: 600 + (i % COLS) * 144, y: 800 + Math.floor(i / COLS) * 120 });    // rear bank
const goal = (i: number) => ({ x: 600 + (i % COLS) * 144, y: 120 + Math.floor(i / COLS) * 130 });    // inside the citadel bank

// ---------- E8: source stamp + the company gathers on the rear bank ----------
export const E8: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Push s={s} dur={1.9} to={1.04}>
        <FlatRiver s={s} id="e8" y0={Y0} y1={Y1} />
        {Array.from({ length: 12 }, (_, i) => <Pop key={i} s={s} at={0.15 + i * 0.07} x={rest(i).x} y={rest(i).y}><SoldierIcon x={rest(i).x} y={rest(i).y} s={2.0} /></Pop>)}
        <SrcPlate x={960} y={250} text="THEO LỜI KỂ CỰU CHIẾN BINH" o={ramp(s, 0.1, 0.4)} w={900} />
        <Txt x={960} y={560} text="MỘT ĐẠI ĐỘI" size={88} o={ramp(s, 0.6, 0.9)} />
      </Push>
      <MonsoonRain t={t} intensity={0.35} angle={12} dim={0.08} />
    </g>
  );
};

// ---------- E9: the company crosses in waves (icons + ripples), flares, splashes ----------
export const E9: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <FlatRiver s={s} id="e9" y0={Y0} y1={Y1} />
      <WaterSplash t={t} t0={30} x={780} y={540} r={34} />
      <WaterSplash t={t} t0={62} x={1220} y={500} r={30} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = rest(i), b = goal(i), u = easeInOut(ramp(s, 0.2 + (i % COLS) * 0.14 + Math.floor(i / COLS) * 0.35, 2.4 + (i % COLS) * 0.1 + Math.floor(i / COLS) * 0.35));
        const x = lerp(a.x, b.x, u) + Math.sin(u * Math.PI * 2 + i) * 14, y = lerp(a.y, b.y, u), inWater = y > Y0 && y < Y1;
        return <g key={i}>{inWater && <WaterRipples t={t} t0={t - 5} x={x} y={y + 14} r={36} n={2} life={34} />}<SoldierIcon x={x} y={y} s={2.0} /></g>;
      })}
      <Flare t={t} t0={6} x={1500} y={150} r={150} life={150} />
      <Txt x={960} y={Y1 + 190} text="VÀO THÀNH TIẾP VIỆN" size={72} o={ramp(s, 1.9, 2.3)} />
      <MonsoonRain t={t} intensity={0.4} angle={12} dim={0.08} />
    </g>
  );
};

// ---------- E10: next day: most icons turn into pale empty outlines, a few remain ----------
export const E10: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), keep = [1, 6, 9];
  return (
    <g>
      <Push s={s} dur={2.3} to={1.05} cy={300}>
        <FlatRiver s={s} id="e10" y0={Y0} y1={Y1} glow={0.2} />
        {Array.from({ length: 12 }, (_, i) => {
          const g = goal(i), gone = keep.includes(i) ? 0 : ramp(s, 0.8 + hash(i, 5) * 0.55, 1.2 + hash(i, 5) * 0.55);
          return <SoldierIcon key={i} x={g.x} y={g.y} s={2.0} ghost={gone} />;
        })}
      </Push>
      <Dim o={0.35 * ramp(s, 0.8, 1.9)} />
      <Txt x={960} y={Y1 + 150} text="HÔM SAU" size={60} color="#B9C6D6" o={ramp(s, 0.05, 0.3) * (1 - ramp(s, 0.8, 1.0))} />
      <Txt x={960} y={Y1 + 170} text="CHỈ CÒN VÀI NGƯỜI" size={84} o={ramp(s, 1.3, 1.7)} />
    </g>
  );
};

// ---------- E11: quiet: dotted crossing routes stop mid-river, each ends in one soft light ----------
export const E11: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  const routes = Array.from({ length: 7 }, (_, i) => ({ x: 420 + i * 180 + (hash(i, 2) - 0.5) * 60, end: 0.28 + 0.5 * hash(i, 4), dr: (hash(i, 6) - 0.5) * 120 }));
  return (
    <g>
      <Push s={s} dur={3.8} from={1.0} to={1.07} cy={560}>
        <FlatRiver s={s * 0.5} id="e11" y0={Y0} y1={Y1} glow={0.1} />
        {routes.map((r, i) => {
          const u = easeOut(ramp(s, 0.2 + i * 0.12, 1.6 + i * 0.12)) * r.end, ex = r.x + r.dr * u, ey = Y1 + 30 - (Y1 - Y0 + 30) * u;
          const lit = ramp(s, 1.6 + i * 0.12, 2.2 + i * 0.12);
          return <g key={i}>
            <path d={`M${r.x},${Y1 + 30} Q${r.x + r.dr * u * 0.2},${(Y1 + ey) / 2} ${ex},${ey}`} fill="none" stroke="#9DB0C4" strokeWidth={4} strokeDasharray="4 12" strokeLinecap="round" opacity={0.7} />
            {lit > 0 && <g opacity={lit}><HoaDang x={ex} y={ey} s={44 + 8 * lit} t={t} color="white" ph={i * 11} /></g>}
          </g>;
        })}
      </Push>
      <Dim o={0.28 + 0.12 * ramp(s, 1, 3)} />
      <MonsoonRain t={t} intensity={0.25} angle={10} dim={0.05} />
    </g>
  );
};
