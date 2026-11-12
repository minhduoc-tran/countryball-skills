import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, LEG_LEN, Rooftop, Stars, Schematic, SchLabel, Arrow, DrawOn,
  CountUp, SCH, FONT, ShotProps,
} from '../../engine';
import { SunIcon, EarthIcon, JupiterIcon, KmChip, Streaks } from './chb-local-props';

// Chapter B, 3/3: Earth leaves its orbit (B14, B15), 107,000 km/h (B16), a drift of 100,000 km every hour (B17) and, a
// year later, 940 million km out, past Jupiter's orbit (B18-B20). Schematics on the blueprint ground, Pip once more.

const PIP = LOOKS.pipHood;
const FEET = 822;

// ---------- B14 / B15: the orbit with the Sun gone; Earth circles, then leaves along the tangent ----------
const OC = { x: 960, y: 600, r: 330 };
const W = (2 * Math.PI * 1.2) / 75; // radians per frame: 1.2 laps over B14, so Earth is at the top at its end
const onOrbit = (phi: number) => ({ x: OC.x + OC.r * Math.sin(phi), y: OC.y - OC.r * Math.cos(phi) });
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const e = onOrbit(-W * (len - t));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [len, 1.05]]))}>
      <Schematic t={t} id="b14" />
      <SunIcon x={OC.x} y={OC.y} r={60} t={t} gone={1} />
      <circle cx={OC.x} cy={OC.y} r={OC.r} fill="none" stroke={SCH.dim} strokeWidth={4} strokeDasharray="4 14" strokeLinecap="round" />
      <EarthIcon x={e.x} y={e.y} r={36} />
      <SchLabel x={OC.x} y={OC.y + 120} t={t - 8} text="NOTHING TO CIRCLE" size={38} color={SCH.dim} />
      <SchLabel x={OC.x + 150} y={OC.y - 70} t={t - 30} text="?" size={90} color={SCH.live} />
    </g>
  );
};
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const top = onOrbit(0);
  const speed = OC.r * W;
  const x = top.x + speed * t;
  const wob = t < 4 ? 0 : 0;
  return (
    <g transform={camT(Math.max(960, x - 260), 520, 0.95)}>
      <g transform={`translate(${Math.max(0, x - 260 - 960)} 0)`}><Schematic t={t} id="b15" /></g>
      <SunIcon x={OC.x} y={OC.y} r={60} t={t} gone={1} />
      <circle cx={OC.x} cy={OC.y} r={OC.r} fill="none" stroke={SCH.dim} strokeWidth={4} strokeDasharray="4 14" opacity={0.6} />
      <path d={`M ${top.x} ${top.y} L ${x} ${top.y}`} stroke={SCH.live} strokeWidth={6} strokeDasharray="2 16" strokeLinecap="round" />
      <path d={`M ${x + 70} ${top.y - 46} L ${x + 130} ${top.y} L ${x + 70} ${top.y + 46}`} stroke={SCH.live} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <EarthIcon x={x} y={top.y + wob} r={36} />
      <SchLabel x={Math.max(960, x - 260) + 120} y={top.y - 110} t={t - 12} text="STRAIGHT LINE" size={46} color={SCH.live} />
    </g>
  );
};

// ---------- B16: Earth hurtling right with speed lines; the speed counts up to 107,000 km/h ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const v = Math.round(107000 * easeOut(clamp((t - 8) / 36)));
  const shk = Math.sin(t * 2.3) * 3;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t * 6} id="b16" />
      <Streaks t={t} n={22} speed={70} seed={9} o={0.45} />
      <g transform={`translate(0 ${shk})`}><EarthIcon x={620} y={500} r={120} /></g>
      <path d="M 800 500 L 1300 500 M 1240 450 L 1310 500 L 1240 550" stroke={SCH.live} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <KmChip x={960} y={820} t={t - 4} text={`${v.toLocaleString('en-US')} km/h`} size={86} />
    </g>
  );
};

// ---------- B17: Pip under the black sky, stars sliding past; a counter ticks up 100,000 km for every hour ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.0;
  const pose = poseAt(t, [
    { f: 0, p: { x: 860, y: FEET + 40 - LEG_LEN * sc, scale: sc, yaw: 0.3, tilt: -2, headTilt: -4, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, look: 0.4 } },
    { f: 60, p: { headTilt: 3, tilt: 1 } },
    { f: 110, p: { headTilt: -3 } },
  ]);
  const km = Math.round((100000 * easeInOut(clamp((t - 6) / (len - 20)))) / 1000) * 1000;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 520, kf(t, [[0, 1.35], [len, 1.6]]))}>
        <Rooftop t={t + 520} low={40} cityLit={2.5} sunGone={1} />
        <g transform={`translate(${-(t * 5) % 1200} 0)`}>
          <Stars seed={13} x0={0} y0={-200} w={2400} h={800} t={t} n={50} o={0.9} />
          <Stars seed={13} x0={1200} y0={-200} w={2400} h={800} t={t} n={50} o={0.9} />
        </g>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [70, 'worried']]) }} rimId="rimBlue" shadow={0} />
      </g>
      <KmChip x={960} y={140} t={t - 2} text={`+${km.toLocaleString('en-US')} km`} sub="EVERY HOUR" size={80} />
    </g>
  );
};

// ---------- B18 - B20: a year later: Earth is 940 million km from the Sun's old place, past Jupiter's orbit ----------
const SUN = { x: 240, y: 540 };
const RING = 520; // Jupiter's orbit: 778 million km at 0.668 px per million km
const EARTH_X = SUN.x + 628; // 940 million km
const JUP_A = { x: SUN.x + RING * Math.cos(0.5), y: SUN.y - RING * Math.sin(0.5) };
const YearMap: React.FC<{ t: number; id: string; earthP: number; hot: number; children?: React.ReactNode }> = ({ t, id, earthP, hot, children }) => (
  <g>
    <Schematic t={t} id={id} />
    <circle cx={SUN.x} cy={SUN.y} r={RING} fill="none" stroke={hot > 0 ? SCH.live : SCH.dim} strokeWidth={4 + 4 * hot} strokeDasharray={hot > 0 ? undefined : '4 14'} strokeLinecap="round" opacity={0.5 + 0.5 * hot} />
    <SunIcon x={SUN.x} y={SUN.y} r={46} t={t} gone={1} />
    <JupiterIcon x={JUP_A.x} y={JUP_A.y} r={42} />
    <path d={`M ${SUN.x + 60} ${SUN.y} L ${SUN.x + 60 + (EARTH_X - SUN.x - 110) * earthP} ${SUN.y}`} stroke={SCH.dim} strokeWidth={4} strokeDasharray="2 14" strokeLinecap="round" />
    <EarthIcon x={SUN.x + 60 + (EARTH_X - SUN.x - 60) * earthP} y={SUN.y} r={34} />
    {children}
  </g>
);
export const B18: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeInOut(clamp((t - 6) / 46));
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 640]]), 540, kf(t, [[0, 0.95], [len, 1.05]]))}>
      <YearMap t={t} id="b18" earthP={p} hot={0}>
        <SchLabel x={1000} y={250} t={t - 4} text="1 YEAR" size={120} color="#FFE2A8" />
        <SchLabel x={SUN.x} y={SUN.y + 110} t={t - 10} text="SUN WAS HERE" size={28} color={SCH.dim} />
      </YearMap>
    </g>
  );
};
export const B19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 640], [len, 700]]), 600, kf(t, [[0, 1.05], [len, 1.15]]))}>
    <YearMap t={t} id="b19" earthP={1} hot={0}>
      <DrawOn d={`M ${SUN.x} ${SUN.y + 150} L ${EARTH_X} ${SUN.y + 150} M ${SUN.x} ${SUN.y + 130} L ${SUN.x} ${SUN.y + 170} M ${EARTH_X} ${SUN.y + 130} L ${EARTH_X} ${SUN.y + 170}`} t={t - 14} dur={26} color={SCH.live} width={6} />
      <CountUp x={(SUN.x + EARTH_X) / 2} y={SUN.y + 270} t={t - 22} to={940000000} dur={60} size={84} suffix=" km" />
      <SchLabel x={SUN.x} y={SUN.y - 130} t={t - 58} text="WHERE THE SUN" size={30} color={SCH.dim} />
      <SchLabel x={SUN.x} y={SUN.y - 94} t={t - 58} text="USED TO BE" size={30} color={SCH.dim} />
    </YearMap>
  </g>
);
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const hot = easeOut(clamp((t - 36) / 10));
  const pulse = 1 + 0.04 * Math.sin(t / 4);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 760]]), kf(t, [[0, 600], [len, 480]]), kf(t, [[0, 1.15], [len, 1.0]]))}>
      <YearMap t={t} id="b20" earthP={1} hot={hot}>
        <DrawOn d={`M ${SUN.x} ${SUN.y - 150} L ${SUN.x + RING} ${SUN.y - 150}`} t={t - 30} dur={16} color={SCH.live} width={6} />
        <SchLabel x={440} y={SUN.y - 180} t={t - 40} text="778,000,000 km" size={44} color={SCH.live} />
        <SchLabel x={440} y={SUN.y - 235} t={t - 40} text="JUPITER'S ORBIT" size={28} color={SCH.dim} />
        <g transform={`translate(${EARTH_X + 100} ${SUN.y + 130}) scale(${pulse})`}>
          <SchLabel x={0} y={0} t={t - 6} text="EARTH" size={34} color="#BFE0FF" />
          <SchLabel x={0} y={52} t={t - 12} text="940,000,000 km" size={40} color="#FFE2A8" />
        </g>
        <g transform={`translate(${SUN.x + RING + 190} ${SUN.y - 90})`}>
          <SchLabel x={0} y={0} t={t - 52} text="FARTHER" size={84} color="#FFE2A8" anchor="start" />
        </g>
      </YearMap>
    </g>
  );
};
