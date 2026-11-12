import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe, hop, mixMotion } from '../../countryball/ball-motion';
import { RuinedWallSide } from '../../countryball/ground-ruined-wall-side';
import { FrontArrow, SIDE_COLORS, TrenchLine } from '../../countryball/ground-front-arrows';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { PhotoCard } from '../../countryball/photo-card';
import { Flare } from '../../countryball/fx-tracers-and-lights';
import { cameraOnCitadel, citadelScreen, citadelToLocal, localToScreen } from '../../countryball/citadel-geometry';
import { easeInOut, Pt } from '../../countryball/fx-math';
import { Backdrop, Chip, CREDIT, drift, Plan, Pop, ramp, sec, Txt, Vignette } from './chd-common';
import { Cutaway, FLOOR_Y } from './chd-cutaway';
import { AmmoBox, MedBox, SunIcon } from './chd-icons';
import { posAt } from './chd-river';

// Chapter D, beat "17 trenches" (D25-D29, 6:00-6:14): life in bunkers and trenches (cutaway), under the wall by day, repairs +
// ammunition by night, the way to the river bank (a medical crate, nobody drawn), a photo of the ruined wall, metre by metre.

// ---------- D25: bunker, then the trench corridor ----------
export const D25: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), camX = 1000 * easeInOut(ramp(s, 0.3, len / 30)), inTrench = ramp(s, 1.4, 1.7);
  return (
    <g>
      <Cutaway id="d25" t={t} camX={camX}>
        {[0, 1].map((i) => <Ball key={i} id={`d25a${i}`} x={800 + i * 200} y={FLOOR_Y - 84} r={84} flag="VNM" eyes={i ? 'worried' : 'determined'} hat={<MuCoi camo />} t={t} motion={breathe(t, 66, 0.025, i * 13)} />)}
        <Ball id="d25t" x={2150} y={FLOOR_Y - 76} r={76} flag="VNM" eyes="determined" hat={<MuCoi camo />} t={t} look={0.5} motion={mixMotion(breathe(t, 60, 0.03), hop(t, 70, 8, 5))} />
      </Cutaway>
      <Txt x={960} y={140} text="TRONG HẦM" size={120} o={ramp(s, 0.05, 0.3) * (1 - inTrench)} />
      <Txt x={960} y={140} text="TRONG GIAO THÔNG HÀO" size={110} color="#E2B95A" o={inTrench} />
    </g>
  );
};

// ---------- D26: under the wall by day ----------
export const D26: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t);
  return (
    <g>
      <Cutaway id="d26" t={t} camX={300} lamp>
        <RuinedWallSide id="d26w" x={900} y={334} w={860} h={290} damage={0.55} t={t} />
        {[0, 1].map((i) => <Ball key={i} id={`d26b${i}`} x={820 + i * 150} y={FLOOR_Y - 76} r={76} flag="VNM" eyes="worried" hat={<MuCoi camo />} tilt={i ? 4 : -4} t={t} motion={breathe(t, 90, 0.015, i * 20)} />)}
      </Cutaway>
      <Txt x={1560} y={150} text="DƯỚI CHÂN" size={84} o={ramp(s, 0.05, 0.3)} />
      <Txt x={1560} y={235} text="TƯỜNG THÀNH" size={84} o={ramp(s, 0.15, 0.4)} />
      <Pop s={s} at={1.18} x={1500} y={760}><Chip x={1500} y={760} text="BAN NGÀY: NẰM IM" size={46} stroke="#FFD166" icon={<SunIcon x={0} y={0} s={0.9} spin={s * 40} />} /></Pop>
    </g>
  );
};

// ---------- D27: night, repairs + ammunition, then the path to the river bank ----------
export const D27: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-90, 10, 1.0), cameraOnCitadel(-300, 10, 1.0), len / 30), late = ramp(s, 2.07, 2.3);
  const L = (u: number, v: number): Pt => citadelScreen(cam, u, v);
  const route: Pt[] = [L(60, 20), L(-120, 10), L(-240, 0), localToScreen(cam, -445, -8)];
  const ammo = [0, 1, 2].map((i) => posAt(route.slice(0, 3).reverse(), ((s * 0.35 + i / 3) % 1)));
  const med = posAt(route, ramp(s, 2.1, 3.7));
  return (
    <g>
      <Plan id="d27" cam={cam} t={t} damage={0.6} night={0.85} fires={0.5} flood={0.1} />
      <TrenchLine id="d27t" t={t} t0={2} points={[L(-150, -90), L(-60, -80), L(30, -90)]} style="zigzag" dur={50} />
      {[0, 1].map((i) => <Ball key={i} id={`d27b${i}`} x={L(-120 + i * 70, -70)[0]} y={L(-120 + i * 70, -70)[1]} r={26} flag="VNM" eyes="determined" hat={<MuCoi camo />} t={t} shadow={false} motion={hop(t, 40, 9, i * 12)} />)}
      {ammo.map((p, i) => <AmmoBox key={i} x={p.x} y={p.y} s={0.8} rot={p.heading + 180} />)}
      {late > 0 && <g opacity={late}>
        <path d={`M${route.map((p) => p.join(',')).join(' L')}`} fill="none" stroke="#E8F4FF" strokeWidth={5} strokeDasharray="14 12" opacity={0.7} />
        <MedBox x={med.x} y={med.y} s={0.9} />
        {[-1, 1].map((k) => <Ball key={k} id={`d27m${k}`} x={med.x + k * 36} y={med.y - 4} r={16} flag="VNM" eyes="normal" hat={<MuCoi />} t={t} shadow={false} />)}
      </g>}
      <ShellBarrage id="d27s" t={t} t0={6} from={[2100, 120]} to={L(120, -60)} n={7} span={70} spread={[200, 120]} dur={34} lift={190} r={24} seed={3} />
      <Flare t={t} t0={0} x={L(-250, -150)[0]} y={L(-250, -150)[1]} r={150} life={140} />
      <Vignette id="d27" o={0.5} />
      <Txt x={960} y={140} text="SỬA CÔNG SỰ · TIẾP ĐẠN" size={92} o={ramp(s, 0.05, 0.3) * (1 - late)} />
      <Txt x={960} y={140} text="ĐƯA RA BỜ SÔNG" size={110} color="#E2B95A" o={late} />
      <Chip x={60} y={990} anchor="start" text="BAN ĐÊM" size={44} stroke="#8EA8E8" />
    </g>
  );
};

// ---------- D28: photo of the ruined wall and moat ----------
export const D28: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t);
  return (
    <g>
      <Backdrop s={s} id="d28" top="#26201C" bottom="#0B0908" />
      <PhotoCard t={s} src="quang-tri-81-ngay-dem/img/023.jpg" caption="Hào và tường Thành cổ bị tàn phá, 1972" credit={CREDIT.usmc}
        x={640} y={520} w={720} h={614} rot={-2} from={-0.4} to={len / 30 + 0.5} id="d28p" kb={{ z0: 1.03, z1: 1.15, px0: 0.01, px1: -0.02 }} />
      <Txt x={1430} y={400} text="GIÀNH NHAU" size={100} o={ramp(s, 0.2, 0.5)} />
      <Txt x={1430} y={520} text="TỪNG GÓC" size={110} color="#E2B95A" o={ramp(s, 0.5, 0.8)} />
      <Txt x={1430} y={640} text="TƯỜNG" size={110} color="#E2B95A" o={ramp(s, 0.7, 1.0)} />
    </g>
  );
};

// ---------- D29: every dugout, every metre (arrows pressing at the east gate) ----------
export const D29: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(230, 0, 3.0), cameraOnCitadel(236, 0, 3.6), len / 30), ppm = cam.zoom / 110574, g = citadelScreen(cam, 240, 0);
  const second = ramp(s, 0.87, 1.1);
  return (
    <g>
      <Plan id="d29" cam={cam} t={t} damage={0.7} fires={0.3} />
      <FrontArrow id="d29a" t={t} t0={4} points={[[g[0] - 760, g[1] + 20], [g[0] - 420, g[1] - 10], [g[0] - 90, g[1]]]} width={46} color={SIDE_COLORS.vnm} dur={40} />
      <FrontArrow id="d29b" t={t} t0={10} points={[[g[0] + 780, g[1] - 30], [g[0] + 440, g[1] + 10], [g[0] + 90, g[1] - 4]]} width={46} color={SIDE_COLORS.rvn} dur={40} />
      <TrenchLine id="d29t" t={t} t0={0} points={[[g[0] - 40, g[1] - 190], [g[0] - 20, g[1] - 60], [g[0] - 50, g[1] + 120]]} style="zigzag" dur={40} />
      <g opacity={second} transform={`translate(${g[0]},${g[1] + 250})`} stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none">
        <path d={`M${-5 * ppm},0 v-16 M${5 * ppm},0 v-16 M${-5 * ppm},-8 H${5 * ppm}`} />
      </g>
      <Txt x={g[0]} y={g[1] + 300} text="≈ 10 m" size={46} o={second} />
      <Vignette id="d29" o={0.4} />
      <Txt x={960} y={140} text="TỪNG CĂN HẦM" size={112} o={1 - second} />
      <Txt x={960} y={140} text="TỪNG MÉT ĐẤT" size={120} color="#E2B95A" o={second} />
    </g>
  );
};
