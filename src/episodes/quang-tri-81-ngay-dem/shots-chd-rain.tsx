import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { MonsoonRain } from '../../countryball/ground-weather-and-smoke';
import { FrontArrow, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { RiverCrossing } from '../../countryball/ground-river-crossing';
import { MiniMap } from '../../countryball/hud-minimap';
import { DateChip } from '../../countryball/hud-date-chip';
import { cameraOnCitadel, citadelScreen, localToScreen } from '../../countryball/citadel-geometry';
import { clamp, Pt } from '../../countryball/fx-math';
import { Chip, drift, Plan, Pop, ramp, sec, Txt, Vignette } from './chd-common';
import { Cutaway, FLOOR_Y } from './chd-cutaway';
import { AmmoBox } from './chd-icons';
import { posAt, RiverFlow } from './chd-river';

// Chapter D, beat "18 rain" (D35-D39, 6:26-6:40): the monsoon arrives (Aug-Sep), pouring rain, flooded trenches, the Thạch Hãn
// rises and runs fast, yet the river is the only supply road into the citadel (leads into chapter E). Citadel damage 0.66 -> 0.7.

// ---------- D35: the rainy season begins ----------
export const D35: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-60, 20, 0.6), cameraOnCitadel(-120, 10, 0.5), len / 30);
  return (
    <g>
      <Plan id="d35" cam={cam} t={t} damage={0.66} flood={0.1 + 0.2 * ramp(s, 1, 2.7)} />
      <rect width={1920} height={1080} fill="#2A3548" opacity={0.45 * ramp(s, 0, 1.8)} />
      <MonsoonRain t={t} intensity={0.15 + 0.55 * ramp(s, 0.3, 2.4)} angle={12} dim={0.1} />
      <DateChip dates={[{ t: 0, label: '07.1972' }, { t: 1.09, label: '08.1972' }, { t: 1.9, label: '09.1972' }]} t={s} id="hud-date" />
      <MiniMap camera={cam} />
      <Txt x={960} y={900} text="MÙA MƯA ĐẾN" size={128} o={ramp(s, 0.1, 0.4)} />
    </g>
  );
};

// ---------- D36: torrential rain, trenches fill with mud ----------
export const D36: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), water = 0.1 + 0.3 * ramp(s, 1.2, 3.2), late = ramp(s, 2.0, 2.2);
  return (
    <g>
      <Cutaway id="d36" t={t} camX={300} water={water} mud={1} dusk={0.3} period={90}>
        {[0, 1].map((i) => <Ball key={i} id={`d36b${i}`} x={800 + i * 190} y={FLOOR_Y - 80} r={80} flag="VNM" eyes={i ? 'sad' : 'worried'} hat={<MuCoi camo />} t={t} motion={breathe(t, 70, 0.02, i * 9)} />)}
      </Cutaway>
      <MonsoonRain t={t} intensity={0.85} angle={14} dim={0.25} />
      <Txt x={960} y={140} text="MƯA NHƯ TRÚT NƯỚC" size={108} o={ramp(s, 0.1, 0.4) * (1 - late)} />
      <Txt x={960} y={140} text="HẦM HÀO NGẬP BÙN" size={112} color="#E2B95A" o={late} />
    </g>
  );
};

// ---------- D37: the Thạch Hãn rises and runs fast ----------
export const D37: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-260, 10, 0.75), cameraOnCitadel(-300, 0, 0.8), len / 30), fl = 0.3 + 0.65 * ramp(s, 0, 2.2);
  const gx = 1760, gy0 = 880, h = 520;
  return (
    <g>
      <Plan id="d37" cam={cam} t={t} damage={0.67} flood={fl} labels={['river']} night={0.15} />
      <RiverFlow cam={cam} t={t} n={16} speed={4} />
      <MonsoonRain t={t} intensity={0.7} angle={12} dim={0.2} />
      {/* water gauge */}
      <rect x={gx - 26} y={gy0 - h} width={52} height={h} rx={10} fill="#15181F" fillOpacity={0.8} stroke="#E2B95A" strokeWidth={5} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${gx - 26},${gy0 - (i * h) / 4} h18`} stroke="#fff" strokeWidth={4} />)}
      <rect x={gx - 20} y={gy0 - h * fl} width={40} height={h * fl} rx={6} fill="#5AA6E0" />
      <path d={`M${gx - 50},${gy0 - h * fl} l20,-12 v24 Z`} fill="#E0483C" />
      <Txt x={gx} y={gy0 + 60} text="NƯỚC" size={40} />
      <Txt x={760} y={140} text="NƯỚC SÔNG THẠCH HÃN" size={80} o={ramp(s, 0.05, 0.3)} />
      <Txt x={760} y={236} text="DÂNG CAO, CHẢY XIẾT" size={80} color="#E2B95A" o={ramp(s, 0.6, 0.9)} />
    </g>
  );
};

// ---------- D38: ... but the river is the only road ----------
export const D38: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-300, 0, 0.9), cameraOnCitadel(-260, 0, 1.0), len / 30);
  const a = localToScreen(cam, -780, -150), b = localToScreen(cam, -430, -20), g = citadelScreen(cam, -240, 0);
  const road: Pt[] = [a, b, [g[0] + 40, g[1] + 10]];
  return (
    <g>
      <Plan id="d38" cam={cam} t={t} damage={0.68} flood={0.95} night={0.25} />
      <RiverFlow cam={cam} t={t} n={14} speed={4} o={0.55} />
      <FrontArrow id="d38a" t={t} t0={6} points={road} width={44} dur={50} color={SIDE_COLORS.vnm} />
      <MonsoonRain t={t} intensity={0.6} angle={12} dim={0.2} />
      <Txt x={a[0] + 40} y={a[1] - 90} text="HẬU PHƯƠNG" size={52} o={ramp(s, 0.2, 0.5)} />
      <Txt x={g[0] + 120} y={g[1] - 110} text="THÀNH CỔ" size={52} color="#E2B95A" o={ramp(s, 0.2, 0.5)} />
      <Txt x={960} y={140} text="CON ĐƯỜNG DUY NHẤT" size={116} o={ramp(s, 0.5, 0.9)} />
      <Vignette id="d38" o={0.4} />
    </g>
  );
};

// ---------- D39: supplies into the citadel by river ----------
export const D39: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-300, 0, 1.0), cameraOnCitadel(-220, 0, 1.3), len / 30);
  const a = localToScreen(cam, -780, -150), b = localToScreen(cam, -440, -20), g = citadelScreen(cam, -240, 0);
  const road: Pt[] = [a, b, [g[0] + 60, g[1] + 10]];
  return (
    <g>
      <Plan id="d39" cam={cam} t={t} damage={0.7} flood={0.95} night={0.5} fires={0.35} />
      <RiverFlow cam={cam} t={t} n={12} speed={4} o={0.45} />
      <RiverCrossing id="d39r" t={t} t0={4} t1={70} from={a} to={b} n={3} size={46} spacing={64} drift={46} splashes={5} />
      {[0, 1, 2, 3].map((i) => { const p = posAt(road, (s * 0.3 + i * 0.25) % 1); return <AmmoBox key={i} x={p.x} y={p.y - 30} s={0.9} />; })}
      <MonsoonRain t={t} intensity={0.75} angle={12} dim={0.25} />
      <Vignette id="d39" o={0.5} />
      <Txt x={960} y={140} text="TIẾP TẾ CHO THÀNH CỔ" size={104} o={ramp(s, 0.1, 0.4)} />
      <Pop s={s} at={0.8} x={960} y={950}><Chip x={960} y={950} text="chỉ có thể vượt sông" size={48} /></Pop>
    </g>
  );
};
