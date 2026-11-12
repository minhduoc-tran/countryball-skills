import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { ArtilleryBattery, ShellArc, ShellBarrage } from '../../countryball/ground-artillery';
import { NavalBombardment } from '../../countryball/ground-naval-gunfire';
import { RuinedWallSide } from '../../countryball/ground-ruined-wall-side';
import { FlightPath } from '../../countryball/fx-flight-path';
import { BombCarpet, GroundBlast } from '../../countryball/fx-bomb-carpet';
import { Glow } from '../../countryball/fx-glow';
import { cameraOnCitadel, citadelScreen } from '../../countryball/citadel-geometry';
import { project } from '../../countryball/geo-camera';
import { QuangTriSites } from '../../countryball/quang-tri-map-labels';
import { UnitBox, SIDE_COLORS } from '../../countryball/ground-front-arrows';
import { clamp, easeInOut } from '../../countryball/fx-math';
import { Cell, Chip, drift, MapHud, Plan, QtMap, ramp, sec, Txt, Vignette } from './chd-common';
import { MoonIcon, SunIcon } from './chd-icons';

// Chapter D, beat "16 day night" (D15-D18, 5:35-5:47): day = tactical jets + artillery, night = B-52 carpet, sea = naval guns
// around the clock, and the 100-year-old brick walls breaking piece by piece (side view).

// ---------- D15: day ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(-20, 0, 0.55), cameraOnCitadel(20, 10, 0.7), len / 30), c = citadelScreen(cam, 0, 0);
  return (
    <g>
      <Plan id="d15" cam={cam} t={t} damage={0.5} />
      <ArtilleryBattery id="d15a" t={t} t0={2} x={1640} y={900} aim={-150} n={3} gap={90} period={34} s={80} />
      <ArtilleryBattery id="d15b" t={t} t0={10} x={250} y={950} aim={-30} n={2} gap={90} period={40} s={80} seed={3} />
      <ShellBarrage id="d15s" t={t} t0={4} from={[1640, 900]} to={c} n={9} span={50} spread={[160, 120]} dur={30} lift={170} r={26} seed={2} />
      <FlightPath id="d15f1" t={t} t0={4} t1={60} kind="f4" size={150} points={[[-150, 860], [600, 640], [1200, 470], [2100, 330]]} />
      <FlightPath id="d15f2" t={t} t0={20} t1={72} kind="f4" size={150} points={[[2100, 200], [1300, 420], [700, 520], [-150, 700]]} />
      <GroundBlast t={t} t0={34} x={c[0] - 60} y={c[1] + 70} r={44} linger={80} />
      <GroundBlast t={t} t0={46} x={c[0] + 140} y={c[1] - 40} r={44} linger={80} />
      <Vignette id="d15" o={0.35} />
      <Chip x={60} y={110} anchor="start" text="BAN NGÀY" size={64} stroke="#FFD166" icon={<SunIcon x={0} y={0} s={0.9} spin={s * 40} />} />
      <Txt x={960} y={1000} text="MÁY BAY CHIẾN THUẬT · PHÁO BINH" size={64} o={ramp(s, 0.3, 0.6)} />
    </g>
  );
};

// ---------- D16: night, B-52 carpet ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, cameraOnCitadel(60, -10, 0.5), cameraOnCitadel(0, 0, 0.62), len / 30), c = citadelScreen(cam, 0, 0);
  return (
    <g>
      <Plan id="d16" cam={cam} t={t} damage={0.56} night={0.88} fires={0.8} />
      <Cell id="d16c" t={t} t0={0} t1={90} size={110} points={[[2200, c[1] - 380], [c[0] + 60, c[1] - 30], [-300, c[1] + 330]]} />
      <BombCarpet id="d16b" t={t} t0={14} from={[c[0] + 420, c[1] - 200]} to={[c[0] - 420, c[1] + 220]} dur={44} n={22} width={150} r={34} seed={4} linger={160} />
      <Glow x={c[0]} y={c[1]} r={420} color="#FF7A2E" o={0.18 + 0.12 * Math.sin(t * 0.5)} />
      <Chip x={60} y={110} anchor="start" text="BAN ĐÊM" size={64} stroke="#8EA8E8" icon={<MoonIcon x={0} y={0} s={0.9} />} />
      <Txt x={960} y={1000} text="B-52 RẢI THẢM" size={86} color="#FFE3A0" o={ramp(s, 0.2, 0.5)} />
    </g>
  );
};

// ---------- D17: naval guns off the coast, around the clock ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), cam = drift(s, { lon: 107.17, lat: 16.82, zoom: 4300 }, { lon: 107.18, lat: 16.8, zoom: 5000 }, len / 30), c = project(cam, 107.1896, 16.7539);
  const dial = (s * 70) % 360;
  return (
    <g>
      <QtMap id="d17" camera={cam} night={0.25}><QuangTriSites only={['quangTri', 'citadel']} /></QtMap>
      <NavalBombardment id="d17a" t={t} t0={6} ship={{ x: 1640, y: 330, heading: 190, size: 360, kind: 'cruiser' }} target={[c[0] + 30, c[1] - 20]} every={38} flight={46} lift={230} spread={130} r={34} />
      <NavalBombardment id="d17b" t={t} t0={20} ship={{ x: 1700, y: 600, heading: 185, size: 230, kind: 'destroyer' }} target={[c[0] - 70, c[1] + 50]} every={34} flight={44} lift={200} spread={110} r={30} seed={4} />
      <UnitBox x={1640} y={150} kind="art" color={SIDE_COLORS.usa} label="Hạm đội 7" size={50} />
      {/* 24-hour dial: sun half + moon half rotating */}
      <g transform="translate(240,760)">
        <circle r={128} fill="#15181F" stroke="#E2B95A" strokeWidth={6} />
        <g transform={`rotate(${dial})`}>
          <path d="M0,0 L-112,0 A112,112 0 0 1 112,0 Z" fill="#7A6A38" opacity={0.85} /><path d="M0,0 L-112,0 A112,112 0 0 0 112,0 Z" fill="#26365E" />
          <SunIcon x={0} y={-62} s={0.8} /><MoonIcon x={0} y={64} s={0.8} />
        </g>
        <path d="M0,-146 L-14,-124 H14 Z" fill="#E0483C" />
        <text y={196} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#fff" stroke="#0A121C" strokeWidth={9} paintOrder="stroke">24/24</text>
      </g>
      <Txt x={960} y={1000} text="PHÁO HẠM BẮN SUỐT NGÀY ĐÊM" size={60} o={ramp(s, 0.4, 0.8)} />
      <MapHud s={s} cam={cam} dates={[{ t: 0, label: '1972' }]} />
    </g>
  );
};

// ---------- D18: the brick wall breaks piece by piece ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const s = sec(t), late = ramp(s, 2.4, 3.9), dmg = 0.08 + 0.1 * ramp(s, 0, 2.4) + 0.6 * easeInOut(late);
  const hits: [number, number][] = [[620, 760], [1180, 700], [900, 640], [1420, 780], [760, 820]];
  return (
    <g>
      <defs><linearGradient id="d18-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1C2434" /><stop offset="1" stopColor="#8A5A44" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#d18-sky)" />
      <rect y={900} width={1920} height={180} fill="#2E2218" />
      <Glow x={960} y={880} r={700} color="#FF8A3A" o={0.15 + 0.25 * late} />
      <RuinedWallSide id="d18w" x={960} y={915} w={1240} h={470} damage={clamp(dmg)} t={t} />
      {hits.map(([x, y], i) => <ShellArc key={i} t={t} t0={8 + i * 20} from={[i % 2 ? 2100 : -200, 120]} to={[x, y]} dur={28} lift={260} r={34} />)}
      <Txt x={960} y={150} text={late < 0.05 ? 'HƠN 100 NĂM' : 'VỠ DẦN TỪNG MẢNG'} size={late < 0.05 ? 150 : 124} color={late < 0.05 ? '#F4F4F4' : '#E2B95A'} o={ramp(s, 0.1, 0.4)} />
      <Txt x={960} y={1010} text="tường gạch Thành cổ, xây từ năm 1837" size={50} o={ramp(s, 0.3, 0.7)} />
    </g>
  );
};
