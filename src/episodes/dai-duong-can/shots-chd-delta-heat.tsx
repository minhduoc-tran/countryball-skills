import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, camT, shake, LOOKS, ShotProps, Glow, FONT, SCH, rnd } from '../../engine';
import { DrySeabed } from './kit-dry-seabed';
import { Globe } from './kit-globe';
import { BigNum } from './kit-hud';
import { SkyBand, SeaStrip, Thermo, ACUnit, ColdAir, Sweat, Pill } from './chd-sky-props';
import { CrackedGround, RiceStalk } from './chd-delta-props';
import { Factory, SpaceBack } from './chd-icon-props';

// Chapter D, "6 rain" end + "6 heat" (196.51-214.28 s): D9 cracked mud, D10 Earth loses its sea, D11 desert heat, D12 day /
// night swing, D13 the sea soaks up sun, D14 "90%", D15 warming Earth, D16 Pip in the heat, D17 the air-conditioner switches off.

// ---------- D9: macro: the mud cracks open, rice stalks wilt ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 3, 12, 14);
  const wilt = kf(t, [[0, 0.1], [22, 1]]);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(960, 560, kf(t, [[0, 1], [len, 1.1]]))}`}>
      <SkyBand id="d9sk" top="#F2C98A" bottom="#FCEFD2" h={640} />
      <Glow x={1500} y={200} r={500} o={0.6} />
      <clipPath id="d9clip"><rect x={-100} y={600} width={2120} height={600} /></clipPath>
      <g clipPath="url(#d9clip)"><g transform="translate(0 600) scale(1 0.55)"><CrackedGround id="d9c" p={kf(t, [[0, 0], [18, 1]])} h={900} /></g></g>
      <path d="M -100 600 L 2020 600" stroke="#FFF4D6" strokeWidth={10} opacity={0.5} />
      {[[380, 900, 560, 1], [900, 980, 640, -1], [1450, 920, 580, 1], [1780, 1010, 520, -1]].map(([x, y, h, d], i) => (
        <RiceStalk key={i} x={x} y={y} h={h} wilt={wilt} t={t} lean={d} />
      ))}
    </g>
  );
};

// ---------- D10: Earth's oceans vanish and a red heat aura swells ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const aura = kf(t, [[0, 0.15], [40, 0.95]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.12]]))}>
      <SpaceBack id="d10b" t={t} />
      <defs><radialGradient id="d10a"><stop offset="0.5" stopColor="#FF4A2A" stopOpacity="0.85" /><stop offset="1" stopColor="#FF4A2A" stopOpacity="0" /></radialGradient></defs>
      <circle cx={960} cy={540} r={400 + 20 * Math.sin(t / 4)} fill="url(#d10a)" opacity={aura} />
      {[0, 1, 2].map((i) => { const ph = (t * 0.03 + i / 3) % 1; return <circle key={i} cx={960} cy={540} r={260 + ph * 280} fill="none" stroke="#FFB15A" strokeWidth={8} opacity={(1 - ph) * 0.6 * aura} />; })}
      <Globe id="d10g" t={t} r={250} cx={960} cy={540} water={kf(t, [[4, 1], [30, 0]])} rot={100} />
    </g>
  );
};

// ---------- D11: a desert-like wide: giant sun, dust, Mo fanning himself ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 1130, y: 780, scale: 1, yaw: -0.4, facing: -1, expr: 'tired', armL: { a: 10, b: -8 }, armR: { a: 100 + 0, b: -40 } } }]);
  const fan = { ...pose, armR: { a: 95 + Math.sin(t / 2.2) * 22, b: -50 }, headTilt: 5 };
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 1130]]), 580, kf(t, [[0, 1.05], [len, 1.2]]))}>
      <DrySeabed id="d11s" t={t} salt={0.35} haze={1} dust={0.5} />
      <Glow x={1380} y={150} r={760} o={0.7} />
      <circle cx={1380} cy={150} r={120} fill="#FFFFFF" opacity={0.95} />
      <Hero look={LOOKS.mo} pose={fan} rimId="rimL" shadow={0.8} />
      <Sweat x={1130} y={500} t={t} s={1.2} />
    </g>
  );
};

// ---------- D12: BAN NGÀY nóng như lò nung -> BAN ĐÊM lạnh buốt: thermometer and Pip swing ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const night = easeOut(clamp((t - 47) / 4));
  const level = kf(t, [[0, 0.45], [20, 0.95], [46, 0.95], [62, 0.1]]);
  const shiv = night * Math.sin(t * 2.6) * 4;
  const pose = poseAt(t, [
    { f: 0, p: { x: 1330, y: 690, scale: 1.3, yaw: -0.4, facing: -1, expr: 'tired', armL: { a: 8, b: -8 }, armR: { a: 8, b: -8 } } },
    { f: 48, p: { armL: { a: 8, b: -8 }, armR: { a: 8, b: -8 } } },
    { f: 57, p: { armL: { a: 28, b: -118 }, armR: { a: 28, b: -118 }, tilt: -4 } },
  ]);
  const face = faceAt(t, [[0, 'tired'], [48, 'worried']]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <SkyBand id="d12day" top="#FF8A3D" bottom="#FFE3A0" />
      <Glow x={1560} y={190} r={520} o={0.8} />
      <circle cx={1560} cy={190} r={110} fill="#FFFDEB" />
      <g opacity={night}>
        <SkyBand id="d12ngt" top="#0B1330" bottom="#2A4272" />
        {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={rnd(80, i) * 1920} cy={rnd(81, i) * 600} r={2 + rnd(82, i) * 3} fill="#FFFFFF" opacity={0.4 + 0.5 * Math.abs(Math.sin(t / 14 + i))} />)}
        <circle cx={1560} cy={190} r={96} fill="#EEF2FF" />
        <circle cx={1596} cy={170} r={86} fill="#2A4272" />
      </g>
      <rect x={-100} y={880} width={2120} height={300} fill={night > 0.5 ? '#CFE0F2' : '#E8C27A'} />
      <rect x={-100} y={880} width={2120} height={14} fill="#FFFFFF" opacity={0.4} />
      <Thermo x={520} y={470} s={1.05} level={level} cold={night > 0.5} wob={Math.sin(t / 3) * 2} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...face, x: pose.x + shiv }} rimId={night > 0.5 ? 'rimBlueL' : 'rimL'} shadow={0.8} />
      {night < 0.5 ? <Sweat x={1330} y={410} t={t} s={1.1} /> : (
        <g fill="#EAF6FF" opacity={0.8}>{[0, 1, 2].map((i) => { const ph = (t * 0.06 + i / 3) % 1; return <circle key={i} cx={1250 - ph * 70} cy={470 - ph * 30} r={10 + ph * 26} opacity={1 - ph} />; })}</g>
      )}
      <Pill x={960} y={110} t={t} text={night > 0.5 ? 'BAN ĐÊM' : 'BAN NGÀY'} size={50} col={night > 0.5 ? '#9AD8FF' : '#FFB15A'} />
    </g>
  );
};

// ---------- D13: the sun's arrows hit the sea and sink into the water ----------
export const D13: React.FC<ShotProps> = ({ t, len }) => {
  const warm = kf(t, [[0, 0.1], [len, 0.8]]);
  const targets = [560, 760, 960, 1160, 1360, 1560];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.07]]))}>
      <SkyBand id="d13sk" top="#FF9A4A" bottom="#FFE9B5" h={680} />
      <Glow x={300} y={170} r={520} o={0.9} />
      <circle cx={300} cy={170} r={120} fill="#FFFDEB" />
      <SeaStrip id="d13sea" x0={-100} x1={2020} y={680} depth={500} t={t} />
      <defs><linearGradient id="d13w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FF8A3D" stopOpacity="0.85" /><stop offset="1" stopColor="#FF8A3D" stopOpacity="0" /></linearGradient></defs>
      <rect x={-100} y={680} width={2120} height={400} fill="url(#d13w)" opacity={warm * 0.6} style={{ mixBlendMode: 'screen' }} />
      {targets.map((x, i) => {
        const ph = (t * 0.045 + i * 0.16) % 1;
        const len2 = Math.hypot(x - 330, 680 - 200);
        return (
          <g key={x}>
            <path d={`M 330 200 L ${x} 680`} stroke="#FF8A3D" strokeWidth={14} strokeLinecap="round" strokeDasharray={`${len2 * 0.3} ${len2 * 0.7}`} strokeDashoffset={-ph * len2 * 1.0} opacity={0.95} />
            <path d={`M ${x} 700 L ${x} ${700 + 150 * ph}`} stroke="#FFD27A" strokeWidth={12} strokeLinecap="round" opacity={0.7 * (1 - ph)} />
            <circle cx={x} cy={680} r={10 + 40 * ph} fill="none" stroke="#FFF3C4" strokeWidth={5} opacity={1 - ph} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- D14: "90%" counting up; nine of ten blocks are the ocean ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(90 * easeOut(clamp(t / 30)));
  return (
    <BigNum t={t} len={len} id="d14s" text={`${n}%`} caption="NHIỆT DƯ THỪA">
      <g transform="translate(420 840)">
        {Array.from({ length: 10 }).map((_, i) => {
          const k = easeOut(clamp((t - 12 - i * 2) / 6));
          return <rect key={i} x={i * 112} y={86 * (1 - k)} width={100} height={86 * k} rx={14} fill={i < 9 ? '#4FB4F0' : '#6B7280'} stroke={SCH.line} strokeWidth={3} />;
        })}
        <text x={504} y={146} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill="#9AD8FF" opacity={clamp((t - 34) / 6)}>ĐẠI DƯƠNG</text>
      </g>
      <Glow x={200} y={200} r={260} o={0.6} />
      <circle cx={200} cy={200} r={70} fill="#FFD84A" />
    </BigNum>
  );
};

// ---------- D15: factory smoke feeds a glowing Earth; the thermometer climbs ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
    <SpaceBack id="d15b" t={t} />
    <defs><radialGradient id="d15a"><stop offset="0.55" stopColor="#FF4A2A" stopOpacity="0.8" /><stop offset="1" stopColor="#FF4A2A" stopOpacity="0" /></radialGradient></defs>
    <rect x={-100} y={1000} width={2120} height={200} fill="#14172A" />
    <Factory x={700} y={1010} s={1.1} t={t} />
    <circle cx={900} cy={430} r={330 + 14 * Math.sin(t / 4)} fill="url(#d15a)" opacity={kf(t, [[0, 0.2], [40, 0.9]])} />
    <Globe id="d15g" t={t} r={210} cx={900} cy={430} rot={110} />
    <Thermo x={1450} y={460} s={0.95} level={kf(t, [[0, 0.3], [40, 0.92]])} wob={Math.sin(t / 3) * 2} />
  </g>
);

// ---------- D16: Pip slumps on the scorched seabed, sweat flying ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 730, scale: 1.4, yaw: 0.35, expr: 'tired', tilt: 4, headTilt: -4, armL: { a: 6, b: -6 }, armR: { a: 10, b: -6 } } },
    { f: 40, p: { tilt: 9, headTilt: -9 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 640, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <DrySeabed id="d16s" t={t} salt={0.2} haze={0.9} dust={0.2} />
      <Glow x={1380} y={150} r={700} o={0.6} />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimL" shadow={0.8} />
      <Sweat x={900} y={420} t={t} s={1.5} />
    </g>
  );
};

// ---------- D17: the AC (with the ocean's wave logo) blows cold, then powers down and the room turns hot ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => {
  const on = kf(t, [[0, 1], [12, 1], [16, 0]]);
  const hot = easeOut(clamp((t - 18) / 30));
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1], [len, 1.08]]))}>
      <SkyBand id="d17w" top="#E7DCC8" bottom="#C9BBA2" />
      <rect x={-100} y={900} width={2120} height={300} fill="#A8987C" />
      <ACUnit x={960} y={330} s={1.4} on={on} t={t} />
      <ColdAir x={960} y={520} t={t} k={on} />
      <defs><linearGradient id="d17h" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stopColor="#FF5A2A" stopOpacity="0.8" /><stop offset="1" stopColor="#FF8A3D" stopOpacity="0" /></linearGradient></defs>
      <rect x={-100} y={-100} width={2120} height={1280} fill="url(#d17h)" opacity={hot} />
      {hot > 0 ? Array.from({ length: 6 }).map((_, i) => (
        <path key={i} d={`M 100 ${650 + i * 60} ` + Array.from({ length: 30 }).map((__, k) => `L ${100 + k * 62} ${650 + i * 60 + Math.sin(k * 0.8 + t * 0.3 + i) * 10}`).join(' ')} stroke="#FFF1D0" strokeWidth={5} fill="none" opacity={0.35 * hot} />
      )) : null}
      <Pill x={960} y={890} t={t - 22} text="ĐẠI DƯƠNG: 0%" size={54} col="#FF8A7A" />
    </g>
  );
};

