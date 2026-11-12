import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, Study, Desk, streetStand, Schematic, SCH,
  SchLabel, Foreground, Glow, ShotProps, backOut, FONT, mixHex, rnd,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { StarSky, TimeChip } from './chc-sky-and-people-props';
import { NightStreet } from './chc-night-street-props';
import { WindowRoom, FLOOR_Y } from './chc-window-room-props';
import { BreathPuff, Thermometer, EarthLosingHeat, PhoneClock } from './chc-cold-science-props';

// Chapter C, beats "still on" and "cold" (C10-C21): the lights, the phone and the streetlamps still work; then the
// planet starts losing its heat: breath, frost, Earth radiating, the thermometer falling to -18 and -73.

const PIP = LOOKS.pipHood;
const ICE = '#9FD4FF';

// ---------- C10: the study at "noon": lamp and laptop on, a bolt pops: the power is still on ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, scale: 1, yaw: 0.45, look: 0.5, expr: 'neutral', armR: { a: 30, b: 60 }, armL: { a: 10, b: -8 } } },
    { f: len, p: { armR: { a: 36, b: 64 } }, ease: easeOut },
  ]);
  const pop = backOut(clamp((t - 8) / 8));
  const flick = t < 10 ? (Math.floor(t / 2) % 2 ? 0.55 : 1) : 1;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Study t={t + 80} id="c10" night />
      <rect x={782} y={380} width={396} height={226} fill="#060A1C" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={790 + rnd(3, i) * 380} cy={388 + rnd(4, i) * 210} r={1 + rnd(5, i) * 1.5} fill="#EAF0FF" opacity={0.3 + 0.5 * Math.abs(Math.sin(t / 10 + i))} />)}
      <path d="M 980 380 L 980 606 M 782 493 L 1178 493" stroke="#2A2E48" strokeWidth={10} />
      <rect x={782} y={380} width={396} height={226} fill="none" stroke="#2A2E48" strokeWidth={14} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [14, 'happy']]) }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} />
      <g opacity={flick}><Glow x={1240} y={600} r={260} kind="warm" o={0.5} /></g>
      <g transform={`translate(1400 330) scale(${pop})`}>
        <circle r={74} fill="#0A0E22" opacity={0.75} stroke="#FFC85A" strokeWidth={5} />
        <path d="M 12 -46 L -22 6 L 0 6 L -12 46 L 26 -10 L 4 -10 Z" fill="#FFC85A" />
      </g>
    </g>
  );
};

// ---------- C11: insert: his phone, big, 12:30 PM on a dark starry wallpaper ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <StarSky t={t} id="c11sky" horizonY={1400} n={120} seed={61} />
    <Glow x={960} y={520} r={620} kind="cool" o={0.4} />
    <PhoneClock x={960 + Math.sin(t / 30) * 6} y={500} w={470} rot={kf(t, [[0, -5], [len, -2]])} t={t} />
    <InsertArm x={1240} y={960} fx={1500} fy={1320} rot={-20} s={4.4} width={112} />
  </g>
);

// ---------- C12: the street at "noon": every lamp lit under a black sky; a 12:30 PM chip; push in ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => {
  const p = streetStand(1.5, 4.3, { k: 1.55 });
  const pose = poseAt(t, [{ f: 0, p: { ...p, yaw: -0.5, facing: -1, look: -0.6, expr: 'neutral' } }]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <NightStreet t={t + 40} id="c12" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimBlue" shadow={0} />
      <TimeChip x={1620} y={130} text="12:30" sub="PM" />
    </g>
  );
};

// ---------- C13: Pip at his window; the wall clock says noon, the sky says midnight ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 600, y: FLOOR_Y - 20 - LEG_LEN * 1.5, scale: 1.5, yaw: 0.8, look: 0.9, expr: 'neutral', armR: { a: 20, b: 20 }, armL: { a: 8, b: -6 } } },
    { f: len, p: { headTilt: -4 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 900]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <WindowRoom t={t + 20} id="c13" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimBlue" shadow={0.5} />
    </g>
  );
};

// ---------- C14: slow push-in on Pip's face at the window; the black sky in his eyes ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 600, y: FLOOR_Y - 20 - LEG_LEN * 1.5, scale: 1.5, yaw: 0.8, look: 0.9, expr: 'tired', armR: { a: 20, b: 20 }, armL: { a: 8, b: -6 } } },
    { f: len, p: { headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 720]]), kf(t, [[0, 560], [len, 480]]), kf(t, [[0, 1.2], [len, 2.1]]))}>
      <WindowRoom t={t + 60} id="c14" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0.5} />
    </g>
  );
};

// ---------- C15: "Then the cold arrives": his breath clouds in the street, shivering ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => {
  const sh = Math.sin(t * 2.4) * 2.2;
  const pose = poseAt(t, [
    { f: 0, p: { x: 800 + sh, y: 1040 - LEG_LEN * 2.1, scale: 2.1, yaw: -0.85, facing: -1, look: -0.8, expr: 'worried', armL: { a: 30, b: 120 }, armR: { a: 30, b: 120 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 900]]), 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur6)"><NightStreet t={t + 90} id="c15" /></g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlueL" shadow={0} />
      <BreathPuff x={pose.x - 22 * 2.1} y={pose.y - 164 * 2.1} t={t} dir={-1} s={1.9} />
    </g>
  );
};

// ---------- C16: frost grows across the window glass ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), kf(t, [[0, 450], [len, 430]]), kf(t, [[0, 1.5], [len, 1.62]]))}>
    <WindowRoom t={t + 100} id="c16" frost={clamp((t + 4) / (len + 6)) * 0.8} />
    <BreathPuff x={760} y={720} t={t} dir={1} s={1.2} />
  </g>
);

// ---------- C17: schematic: Earth radiating heat into space; the dead Sun crossed out ----------
export const C17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
    <Schematic t={t} id="c17" />
    <g transform="translate(300 540)">
      <circle r={96} fill="none" stroke={SCH.dim} strokeWidth={8} strokeDasharray="14 12" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d="M 0 -122 L 0 -146" stroke={SCH.dim} strokeWidth={7} strokeLinecap="round" transform={`rotate(${i * 30})`} />)}
      <path d="M -70 -70 L 70 70 M 70 -70 L -70 70" stroke="#FF5A4A" strokeWidth={14} strokeLinecap="round" />
    </g>
    <SchLabel x={300} y={760} t={t - 6} text="NO SUN" size={44} color={SCH.dim} />
    <EarthLosingHeat x={1080} y={540} r={170} t={t} />
    <SchLabel x={1080} y={900} t={t - 12} text="HEAT LEAVES INTO SPACE" size={46} color={SCH.live} />
    <SchLabel x={1080} y={120} t={t - 4} text="SPACE" size={40} color={SCH.dim} />
  </g>
);

// ---------- thermometer scenes (C18-C21) ----------
const ThermoScene: React.FC<{ t: number; len: number; id: string; v: number; frost?: number; chip: string; right: React.ReactNode; zoom?: [number, number]; showV?: boolean }> = ({ t, len, id, v, frost = 0, chip, right, zoom = [1, 1.06], showV = true }) => {
  const cold = clamp((14 - v) / 40);
  const col = mixHex('#FFB15A', ICE, clamp(cold * 2));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, zoom[0]], [len, zoom[1]]])}) translate(-960 -540)`}>
      <Schematic t={t} id={id} />
      <Thermometer x={470} y={120} h={640} v={v} frost={frost} size={1.2} />
      {showV ? (
        <text x={1160} y={560} textAnchor="middle" fontFamily={FONT.ui} fontSize={200} fill={col} style={{ filter: `drop-shadow(0 0 16px ${col})` }}>{`${Math.round(v)} °C`}</text>
      ) : null}
      <g transform="translate(1160 230)">
        <rect x={-(chip.length * 20 + 56)} y={-54} width={chip.length * 40 + 112} height={108} rx={54} fill="#0A0E22" opacity={0.82} stroke={SCH.line} strokeWidth={4} />
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} fill={SCH.line} letterSpacing={3}>{chip}</text>
      </g>
      {right}
    </g>
  );
};

// ---------- C18: "within a week": seven days tick off, the mercury starts to slide ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => (
  <ThermoScene t={t} len={len} id="c18" v={kf(t, [[0, 14], [len, 4]])} chip="1 WEEK" showV={false} right={
    <g transform="translate(860 520)">
      {Array.from({ length: 7 }).map((_, i) => {
        const k = clamp((t - 6 - i * 5) / 5);
        return (
          <g key={i} transform={`translate(${(i % 4) * 150} ${Math.floor(i / 4) * 150})`}>
            <rect width={126} height={126} rx={14} fill="#14223A" stroke={SCH.line} strokeWidth={5} />
            <text x={63} y={80} textAnchor="middle" fontFamily={FONT.ui} fontSize={50} fill={SCH.dim}>{i + 1}</text>
            <path d={`M 22 22 L ${22 + 82 * k} ${22 + 82 * k}`} stroke="#FF5A4A" strokeWidth={10} strokeLinecap="round" />
            <path d={`M 104 22 L ${104 - 82 * clamp(k * 2 - 1)} ${22 + 82 * clamp(k * 2 - 1)}`} stroke="#FF5A4A" strokeWidth={10} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  } />
);

// ---------- C19: "the average temperature on Earth's surface would fall below minus eighteen": it falls ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => (
  <ThermoScene t={t} len={len} id="c19" v={kf(t, [[0, 4], [len - 4, -18]])} frost={clamp((t - 30) / 40) * 0.4} chip="EARTH'S SURFACE" right={
    <g transform="translate(1330 790)">
      <circle r={72} fill="#1E4A7A" stroke={SCH.line} strokeWidth={6} />
      <path d="M -40 -20 Q -20 -52 8 -30 Q 12 -4 -18 8 Z M 14 6 Q 44 -6 48 22 Q 30 44 12 28 Z" fill="#4E9A5A" />
    </g>
  } />
);

// ---------- C20: close on "-18 °C": the tube starts to frost, the number lands ----------
export const C20: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp(t / 8));
  return (
    <ThermoScene t={t} len={len} id="c20" v={-18} frost={clamp(t / 40) * 0.5} chip="1 WEEK" zoom={[1.1, 1.0]} right={
      <g transform={`translate(1160 700) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim} letterSpacing={5}>BELOW FREEZING EVERYWHERE</text>
      </g>
    } />
  );
};

// ---------- C21: "Within a year, minus seventy three": the tube plunges and frosts over; a year dial sweeps ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / (len - 10));
  const v = -18 - 55 * (p * p * (3 - 2 * p));
  const sweep = p * 360;
  return (
    <ThermoScene t={t} len={len} id="c21" v={v} frost={clamp(p * 1.4)} chip="1 YEAR" zoom={[1.0, 1.08]} right={
      <g transform="translate(1160 800)">
        <circle r={86} fill="#14223A" stroke={SCH.line} strokeWidth={6} />
        <path d={`M 0 0 L 0 -86 A 86 86 0 ${sweep > 180 ? 1 : 0} 1 ${Math.sin((sweep * Math.PI) / 180) * 86} ${-Math.cos((sweep * Math.PI) / 180) * 86} Z`} fill={ICE} opacity={0.35} />
        <path d="M 0 0 L 0 -80" stroke={ICE} strokeWidth={8} strokeLinecap="round" transform={`rotate(${sweep})`} />
        <text x={150} y={14} fontFamily={FONT.ui} fontSize={40} fill={SCH.dim} letterSpacing={3}>12 MONTHS</text>
      </g>
    } />
  );
};
