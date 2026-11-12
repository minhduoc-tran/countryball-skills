import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, Schematic, SchLabel, SCH, PlantIcon, Glow,
  LightVeil, Foreground, ShotProps, rnd,
} from '../../engine';
import { VolcanoIcon, GlowPin, HouseIcon, ReactorIcon, HotSpring, EarthCut } from './chd-heat-props';

// Chapter D, beat "power: heat" (D16-D21): volcano pin, Iceland's houses, a reactor tower, the underground city.

// ---------- D16: a glowing map pin drops onto a volcano ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 500]]), kf(t, [[0, 1.0], [len, 1.16]]))}>
    <Schematic t={t} id="sd16" />
    <VolcanoIcon x={960} y={820} s={1.5} t={t} />
    <GlowPin x={960} y={330} s={1.3} t={t - 4} />
    <SchLabel x={960} y={940} t={t - 60} text="THEIR OWN HEAT" size={58} color={SCH.glow} />
  </g>
);

// ---------- D17: ten houses, nine of them lit orange with hot pipes under them: "9 OUT OF 10" ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t} id="sd17" />
    <SchLabel x={960} y={150} t={t - 2} text="ICELAND" size={46} color={SCH.dim} />
    <path d="M 160 800 L 1760 800" stroke={SCH.live} strokeWidth={10} strokeLinecap="round" opacity={0.9} />
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 960 + (i - 4.5) * 165;
      const on = i < 9;
      const lit = on ? easeOut(clamp((t - 14 - i * 4) / 8)) : 0;
      return (
        <g key={i}>
          <path d={`M ${x} 800 L ${x} 716`} stroke={on ? SCH.live : SCH.dim} strokeWidth={7} strokeDasharray={on ? '14 10' : '4 12'} strokeDashoffset={on ? -t * 1.5 : 0} opacity={on ? 0.35 + 0.65 * lit : 0.5} />
          <HouseIcon x={x} y={716} s={1.05} lit={lit} t={t + i * 3} />
        </g>
      );
    })}
    <SchLabel x={960} y={380} t={t - 38} text="9 OUT OF 10" size={110} color={SCH.live} />
  </g>
);

// ---------- D18: cutaway: hot water rises through a pipe from the ground to a lit house ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 760]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <EarthCut id="d18" t={t} surface={430} />
    <HouseIcon x={960} y={430} s={2.0} lit={1} t={t} />
    <rect x={948} y={440} width={24} height={500} fill="#3A2A30" stroke="#8A6A58" strokeWidth={3} />
    {Array.from({ length: 7 }).map((_, i) => {
      const k = ((t / 38 + i / 7) % 1);
      return <rect key={i} x={952} y={930 - k * 480} width={16} height={28} rx={8} fill="#FF8A3D" opacity={Math.sin(k * Math.PI)} style={{ filter: 'drop-shadow(0 0 8px #FFB15A)' }} />;
    })}
    <ellipse cx={960} cy={980} rx={330} ry={80} fill="#7A2E14" opacity={0.9} />
    <ellipse cx={960} cy={970} rx={250} ry={52} fill="#2E7FA8" />
    <ellipse cx={960} cy={962} rx={170} ry={24} fill="#8FE0F8" opacity={0.5} />
    <Glow x={960} y={1000} r={520} kind="warm" o={0.6} />
    {Array.from({ length: 8 }).map((_, i) => {
      const k = ((t / 50 + i / 8) % 1);
      return <circle key={i} cx={760 + rnd(3, i) * 400 + Math.sin(k * 6 + i) * 10} cy={960 - k * 120} r={4 + rnd(4, i) * 5} fill="none" stroke="#DFF6FF" strokeWidth={2} opacity={1 - k} />;
    })}
  </g>
);

// ---------- D19: a cooling tower glowing on the blueprint; a crossed-out Sun beside it ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => {
  const x = clamp((t - 40) / 8);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Schematic t={t} id="sd19" />
      <Glow x={1080} y={560} r={520} kind="warm" o={0.4 + 0.08 * Math.sin(t / 4)} />
      <PlantIcon x={1080} y={560} kind="tower" on={1} t={t} s={4.2} />
      <g transform="translate(430 440)">
        <circle r={78} fill="none" stroke={SCH.dim} strokeWidth={7} />
        {Array.from({ length: 10 }).map((_, i) => <path key={i} d="M 0 -100 L 0 -132" stroke={SCH.dim} strokeWidth={7} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}
        <path d={`M -110 -110 L ${-110 + 220 * x} ${-110 + 220 * x}`} stroke="#FF4A4A" strokeWidth={16} strokeLinecap="round" />
        <path d={`M 110 -110 L ${110 - 220 * x} ${-110 + 220 * x}`} stroke="#FF4A4A" strokeWidth={16} strokeLinecap="round" />
      </g>
      <SchLabel x={430} y={700} t={t - 30} text="NO SUN" size={58} color="#FF7A6A" />
      <SchLabel x={1080} y={900} t={t - 12} text="NUCLEAR" size={62} />
    </g>
  );
};

// ---------- D20: cutaway: a warm underground city under a frozen, starry surface ----------
const BLOCKS: [number, number, number][] = [[420, 90, 150], [540, 120, 210], [690, 80, 120], [1130, 100, 180], [1260, 130, 240], [1410, 90, 140], [1520, 70, 110]];
export const D20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 700]]), kf(t, [[0, 1.0], [len, 1.14]]))}>
    <EarthCut id="d20" t={t} surface={300} />
    {[280, 700, 1500, 1700].map((x, i) => <path key={i} d={`M ${x} 300 l 0 -90 M ${x} -0 M ${x} 250 l 30 -34 M ${x} 230 l -26 -30`} stroke="#0A0F1C" strokeWidth={8} strokeLinecap="round" />)}
    <path d="M 960 300 L 960 520" stroke="#8A6A58" strokeWidth={26} />
    <rect x={930} y={300 + 80 * (0.5 + 0.5 * Math.sin(t / 24))} width={60} height={50} fill="#FFB15A" opacity={0.9} />
    <path d="M 300 560 Q 300 480 420 480 L 1500 480 Q 1620 480 1620 560 L 1620 880 L 300 880 Z" fill="#241714" stroke="#8A5A40" strokeWidth={6} />
    <Glow x={960} y={720} r={900} kind="warm" o={0.45} />
    {BLOCKS.map(([x, w, h], i) => (
      <g key={i}>
        <rect x={x} y={880 - h} width={w} height={h} fill="#3A2622" stroke="#8A5A40" strokeWidth={3} />
        {Array.from({ length: Math.floor(h / 46) }).map((_, j) => Array.from({ length: Math.floor(w / 38) }).map((__, k) => (
          <rect key={`${j}${k}`} x={x + 10 + k * 38} y={880 - h + 12 + j * 46} width={20} height={26} fill="#FFC070" opacity={0.55 + 0.4 * (Math.sin(t / 8 + i + j * 2 + k) > -0.6 ? 1 : 0.2)} />
        )))}
      </g>
    ))}
    <ReactorIcon x={960} y={880} s={1.0} t={t} />
    {[0, 1, 2, 3].map((i) => {
      const px = 360 + ((t * (0.8 + i * 0.2) + i * 300) % 1200);
      return <g key={i} transform={`translate(${px} ${872 - (i % 2) * 2})`}><circle cy={-26} r={8} fill="#FFE2A8" /><rect x={-6} y={-18} width={12} height={20} rx={4} fill="#F6C27A" /></g>;
    })}
  </g>
);

// ---------- D21: closer: in the cavern Pip and his sister between a reactor and a hot spring ----------
export const D21: React.FC<ShotProps> = ({ t, len }) => {
  const floor = 840;
  const pip = poseAt(t, [{ f: 0, p: { x: 880, y: floor - LEG_LEN, scale: 1, yaw: 0.35, look: 0.5, armL: { a: 8, b: 8 }, armR: { a: 10, b: 10 } } }, { f: 40, p: { look: 0.8, headTilt: 3 } }]);
  const sis = poseAt(t, [{ f: 0, p: { x: 1050, y: floor - LEG_LEN * 0.7 + 14, scale: 0.7, yaw: 0.3, look: 0.6 } }, { f: 36, p: { headTilt: -3 } }]);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.05], [len, 1.18]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#1A100F" />
      <path d="M -300 160 Q 400 300 960 220 T 2220 180 L 2220 -300 L -300 -300 Z" fill="#0C0707" />
      {Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx={rnd(5, i) * 2000 - 40} cy={320 + rnd(6, i) * 400} rx={50 + rnd(7, i) * 90} ry={20 + rnd(8, i) * 30} fill="#2A1A16" opacity={0.7} />)}
      <rect x={-300} y={floor} width={2520} height={500} fill="#2A1C18" />
      <path d="M 600 790 L 1250 790" stroke="#8A6A58" strokeWidth={14} />
      <ReactorIcon x={420} y={floor} s={1.6} t={t} />
      <HotSpring x={1480} y={floor - 20} s={1.3} t={t} />
      <LightVeil id="d21v" lights={[[420, 640, 520], [1480, 720, 420]]} o={0.4} />
      <Glow x={420} y={660} r={460} kind="warm" o={0.45} />
      <Glow x={1480} y={760} r={340} kind="warm" o={0.3} />
      <Hero look={LOOKS.pipHood} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [26, 'happy']]) }} rimId="rimL" shadow={0.6} />
      <Hero look={LOOKS.sis} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.6} />
      <Foreground blur={10}><path d="M -300 1100 Q 100 960 400 1040 L 400 1300 L -300 1300 Z" fill="#0C0707" /></Foreground>
    </g>
  );
};
