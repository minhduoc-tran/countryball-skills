import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { Beret, M1Helmet } from '../../countryball/ball-accessories-military';
import { breathe } from '../../countryball/ball-motion';
import { FrontArrow, SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { ShellBarrage } from '../../countryball/ground-artillery';
import { SmokeColumn } from '../../countryball/ground-weather-and-smoke';
import { RuinedWallSide } from '../../countryball/ground-ruined-wall-side';
import { GroundBlast } from '../../countryball/fx-bomb-carpet';
import { DateChip } from '../../countryball/hud-date-chip';
import { MiniMap } from '../../countryball/hud-minimap';
import { Camera } from '../../countryball/geo-camera';
import { cameraOnCitadel, citadelScreen, localToScreen } from '../../countryball/citadel-geometry';
import { Pt } from '../../countryball/fx-math';
import { COAST_ROAD, QL1 } from './chb-routes';
import { ASSAULT, Chip, drift, LP, MapHud, Plan, ramp, sec, Txt, proj, QtMap, Vignette, YELLOW } from './chf-common';

// Chapter F, beat "24 september" (F1-F5, 470.3-480.0 s): early September the Saigon side brings more forces and opens a big
// assault from many directions; the attack axes close in on the citadel; inside, the walls are rubble (damage 0.85-0.95).
// Yellow = VNCH arrows. Balls: RVN with M1 helmet / green beret (TQLC), VNM with mũ cối.

const lp = (cam: Camera, pts: LP[]): Pt[] => pts.map(([x, y]) => localToScreen(cam, x, y));
const HUD_DATES = [{ t: 0, label: '09.1972' }];

// ---------- F1: more forces arrive from the south along QL1 and the coast ----------
export const F1: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, { lon: 107.19, lat: 16.72, zoom: 6200 }, { lon: 107.19, lat: 16.745, zoom: 9500 }, len / 30), P = proj(cam);
  const pts = (ll: [number, number][]): Pt[] => ll.map(([a, b]) => P(a, b));
  const [ux, uy] = P(107.196, 16.712);
  return (
    <g>
      <QtMap cam={cam} id="f1m" sites={['quangTri', 'haiLang']} />
      <FrontArrow id="f1a" t={t} t0={8} points={pts(QL1)} width={50} color={SIDE_COLORS.rvn} dur={52} />
      <FrontArrow id="f1b" t={t} t0={16} points={pts(COAST_ROAD)} width={44} color={SIDE_COLORS.rvn} dur={52} />
      <g opacity={ramp(s, 0.5, 0.9)}><UnitBox x={ux} y={uy} kind="mar" color={YELLOW} label="THÊM QUÂN" size={84} /></g>
      <Ball id="f1b1" x={330} y={820} r={92} flag="RVN" eyes="determined" hat={<Beret color="#2F6B3A" badge="anchor" />} t={t} motion={breathe(t, 70, 0.02)} />
      <Ball id="f1b2" x={520} y={846} r={80} flag="RVN" eyes="worried" hat={<M1Helmet />} t={t} motion={breathe(t, 64, 0.02, 9)} />
      <Txt x={1100} y={190} text="ĐẦU THÁNG CHÍN" size={92} o={ramp(s, 0.1, 0.4)} />
      <Chip x={1100} y={282} text="phía Sài Gòn đưa thêm lực lượng" size={42} stroke={YELLOW} o={ramp(s, 0.9, 1.2)} />
      <MapHud s={s} cam={cam} date="09.1972" />
    </g>
  );
};

// ---------- F2: the big assault, many directions ----------
export const F2: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(120, 60, 0.36), cameraOnCitadel(60, 30, 0.44), len / 30);
  const c = citadelScreen(cam, 0, 0);
  return (
    <g>
      <Plan id="f2" cam={cam} t={t} damage={0.86} fires={0.35} night={0.12} />
      {ASSAULT.map((a, i) => <FrontArrow key={i} id={`f2a${i}`} t={t} t0={4 + i * 5} points={lp(cam, a.far)} width={56} color={SIDE_COLORS.rvn} dur={52} />)}
      <ShellBarrage id="f2s" t={t} t0={14} from={[2300, 380]} to={[c[0] + 20, c[1]]} n={8} span={50} spread={90} />
      <Txt x={1040} y={195} text="ĐỢT TẤN CÔNG LỚN" size={104} o={ramp(s, 0.1, 0.4)} />
      <Txt x={960} y={900} text="TỪ NHIỀU HƯỚNG" size={96} color="#F2C230" o={ramp(s, 0.6, 0.9)} />
      <DateChip dates={HUD_DATES} t={s} id="hud-date" /><MiniMap camera={cam} />
    </g>
  );
};

// ---------- F3: the axes close in (a ring shrinking around the walls) ----------
export const F3: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(40, 20, 0.5), cameraOnCitadel(0, 0, 0.66), len / 30), ppm = cam.zoom / 110574;
  const c = citadelScreen(cam, 0, 0), ring = (900 - 560 * ramp(s, 0.2, 2.0)) * ppm;
  return (
    <g>
      <Plan id="f3" cam={cam} t={t} damage={0.88} fires={0.4} night={0.15} />
      {ASSAULT.map((a, i) => <FrontArrow key={i} id={`f3a${i}`} t={t} t0={i * 3} points={lp(cam, a.near)} width={50} color={SIDE_COLORS.rvn} dur={46} />)}
      <circle cx={c[0]} cy={c[1]} r={ring} fill="none" stroke="#F2C230" strokeWidth={8} strokeDasharray="34 22" opacity={0.85} />
      <Txt x={1040} y={195} text="KHÉP DẦN VÀO THÀNH CỔ" size={96} o={ramp(s, 0.1, 0.4)} />
      <DateChip dates={HUD_DATES} t={s} id="hud-date" /><MiniMap camera={cam} />
    </g>
  );
};

// ---------- F4: inside the citadel: ruins ----------
export const F4: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-20, 60, 1.05), cameraOnCitadel(40, 0, 1.25), len / 30);
  const a = citadelScreen(cam, 120, -80), b = citadelScreen(cam, -90, 100);
  return (
    <g>
      <Plan id="f4" cam={cam} t={t} damage={0.93} fires={0.5} night={0.12} />
      <SmokeColumn t={t} x={a[0]} y={a[1]} h={380} w={120} fire />
      <SmokeColumn t={t} x={b[0]} y={b[1]} h={320} w={100} />
      <GroundBlast t={t} t0={20} x={b[0] + 60} y={b[1] - 40} r={44} />
      <Vignette id="f4" o={0.5} />
      <Txt x={1040} y={195} text="BÊN TRONG THÀNH CỔ" size={96} o={ramp(s, 0.1, 0.4)} />
      <DateChip dates={HUD_DATES} t={s} id="hud-date" />
    </g>
  );
};

// ---------- F5: the wall seen from the side: almost bricks and dust ----------
export const F5: React.FC<ShotProps> = ({ t }) => {
  const s = sec(t), d = 0.55 + 0.42 * ramp(s, 0, 1.2);
  return (
    <g>
      <defs>
        <linearGradient id="f5-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#59525A" /><stop offset="0.7" stopColor="#A98F78" /><stop offset="1" stopColor="#C2A27D" /></linearGradient>
        <linearGradient id="f5-gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4E4332" /><stop offset="1" stopColor="#2C251B" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#f5-sky)" />
      <rect y={800} width={1920} height={280} fill="url(#f5-gr)" />
      <SmokeColumn t={t} x={1500} y={820} h={420} w={130} fire />
      <RuinedWallSide id="f5w" x={1000} y={820} w={1000} h={380} damage={d} t={t} />
      <Ball id="f5b" x={330} y={720} r={92} flag="VNM" eyes="sad" hat={<MuCoi camo />} t={t} motion={breathe(t, 80, 0.02)} />
      <Txt x={960} y={170} text="TƯỜNG THÀNH" size={110} o={ramp(s, 0.1, 0.4)} />
      <Txt x={960} y={300} text="GẦN NHƯ LÀ GẠCH VỤN" size={92} color="#F2C230" o={ramp(s, 0.5, 0.8)} />
      <Vignette id="f5" o={0.5} />
    </g>
  );
};
