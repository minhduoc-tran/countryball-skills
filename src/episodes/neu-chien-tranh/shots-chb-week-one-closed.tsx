import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, LEG_LEN, Classroom, SchoolDesk, Dust, Glow, joints, toWorld, ShotProps,
} from '../../engine';
import { WORKER } from '../khong-ai-ngheo/cast-looks';
import { SchoolGate, FactoryFront } from './chb-place-props';
import { PriceTag } from './chb-scene-props';

// Chapter B, "week one" what stops (B15-B18): the school gate is chained shut with Pip and his sister outside (B15), her
// empty desk (B16), Mo's dad at the factory whose gate comes down under TẠM NGỪNG (B17), the price tags flipping up (B18).

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;

// ---------- B15: the gate slides shut and gets its padlock; Pip and his sister stand outside ----------
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const close = clamp((t - 4) / 32);
  const ps = 0.9;
  const ss = 0.62;
  const pip = poseAt(t, [
    { f: 0, p: { x: 1290, y: 930 - LEG_LEN * ps, scale: ps, yaw: -0.5, look: -0.6, armL: { a: 12, b: 8 }, armR: { a: 12, b: 8 } } },
    { f: 36, p: { headTilt: 3 } },
    { f: 46, p: { headTilt: -3, look: -0.2 } },
  ]);
  const sis = poseAt(t, [
    { f: 0, p: { x: 1130, y: 930 - LEG_LEN * ss, scale: ss, yaw: -0.5, look: -0.5, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 } } },
    { f: 38, p: { headTilt: 4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1000]]), kf(t, [[0, 540], [len, 620]]), kf(t, [[0, 1.0], [len, 1.22]]))}>
      <SchoolGate t={t} close={close} id="sb15" />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'neutral'], [36, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [36, 'worried']]) }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- B16: the classroom with nobody in it: her desk, her notebook, a pencil that rolls off the edge ----------
const DESK_X = 900;
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const roll = clamp((t - 14) / 24);
  const px = DESK_X + 60 + roll * 120;
  const fall = clamp((t - 38) / 8);
  const py = 737 + (roll > 0.99 ? easeIn(fall) * 70 : 0);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, DESK_X + 40]]), kf(t, [[0, 520], [len, 700]]), kf(t, [[0, 1.0], [len, 1.75]]))}>
      <Classroom t={t + 50} id="sb16" empty board={<g />} />
      {/* her teal-and-coral backpack, left on the floor by the desk */}
      <g transform={`translate(${DESK_X - 215} 975)`}>
        <ellipse cx={4} cy={6} rx={60} ry={10} fill="#000" opacity={0.35} />
        <path d="M -46 0 Q -52 -90 -26 -104 Q 0 -112 26 -104 Q 52 -90 46 0 Z" fill="#3E8C86" stroke="#12101C" strokeWidth={4} />
        <rect x={-30} y={-52} width={60} height={34} rx={8} fill="#F28C6A" stroke="#12101C" strokeWidth={3} />
        <path d="M -16 -108 Q 0 -128 16 -108" stroke="#12101C" strokeWidth={6} fill="none" />
      </g>
      <SchoolDesk x={DESK_X} />
      {/* her notebook (coral cover, a doodled star), a pencil case, and the pencil */}
      <polygon points={`${DESK_X - 120},746 ${DESK_X - 10},746 ${DESK_X - 22},726 ${DESK_X - 108},726`} fill="#F28C6A" stroke="#12101C" strokeWidth={3} />
      <polygon points={`${DESK_X - 112},742 ${DESK_X - 16},742 ${DESK_X - 26},728 ${DESK_X - 102},728`} fill="#FFF1CC" opacity={0.9} />
      <rect x={DESK_X + 80} y={722} width={60} height={20} rx={8} fill="#3E8C86" stroke="#12101C" strokeWidth={3} />
      <path d={`M ${px - 26} ${py} L ${px + 26} ${py - 2}`} stroke="#E9B949" strokeWidth={7} strokeLinecap="round" transform={`rotate(${roll * 300} ${px} ${py})`} />
      <path d={`M ${px + 26} ${py - 2} l 8 -0.5`} stroke="#12101C" strokeWidth={6} strokeLinecap="round" transform={`rotate(${roll * 300} ${px} ${py})`} />
      <Dust t={t} seed={4} x0={380} y0={150} w={900} h={620} n={46} o={0.55} />
      <Glow x={470} y={380} r={520} o={0.22} />
    </g>
  );
};

// ---------- B17: Mo's dad at the factory gate; the roller gate comes down, the smoke thins, a TẠM NGỪNG sign swings ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const close = clamp((t - 18) / 26);
  const run = 1 - clamp((t - 40) / 30);
  const sc = 1.0;
  const dad = poseAt(t, [
    { f: 0, p: { x: 640, y: 930 - LEG_LEN * sc, scale: sc, yaw: 0.5, look: 0.6, armL: { a: 8, b: 6 }, armR: { a: 14, b: 10 } } },
    { f: 44, p: { headTilt: 0 } },
    { f: 56, p: { headTilt: 4, look: 0.1, armR: { a: 6, b: 4 }, tilt: -2 } },
  ]);
  const hand = toWorld(dad, joints(dad).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 560, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <FactoryFront t={t} run={run} close={close} id="sb17" />
      <Hero look={WORKER} pose={{ ...dad, ...faceAt(t, [[0, 'neutral'], [44, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <g transform={`translate(${hand.x} ${hand.y})`}>
        <rect x={-18} y={-4} width={42} height={30} rx={5} fill="#B8B6C4" stroke="#12101C" strokeWidth={3} />
        <path d="M -10 -4 Q 3 -18 16 -4" stroke="#12101C" strokeWidth={4} fill="none" />
      </g>
    </g>
  );
};

// ---------- B18: price tags on a rail; one after another each flips to a higher number with a red arrow ----------
const TAGS: { x: number; from: string; to: string; at: number }[] = [
  { x: 360, from: '12.000', to: '13.500', at: 5 },
  { x: 760, from: '28.500', to: '31.000', at: 13 },
  { x: 1160, from: '9.000', to: '10.500', at: 21 },
  { x: 1560, from: '45.000', to: '49.000', at: 29 },
];
export const B18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <defs>
      <linearGradient id="sb18bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A3250" /><stop offset="1" stopColor="#15121F" /></linearGradient>
    </defs>
    <rect x={-300} y={-300} width={2520} height={1700} fill="url(#sb18bg)" />
    <g filter="url(#blur16)" opacity={0.7}>
      {[760, 900].map((y, r) => Array.from({ length: 14 }).map((_, i) => (
        <rect key={`${r}${i}`} x={-60 + i * 150} y={y - 90} width={110} height={90} rx={8} fill={['#E4572E', '#F6B93B', '#3E9BD6', '#58B368', '#8E6AD8'][(i + r * 2) % 5]} />
      )))}
    </g>
    <Glow x={960} y={200} r={900} o={0.3} kind="warm" />
    <rect x={-100} y={70} width={2120} height={22} fill="#8C92A4" stroke="#12101C" strokeWidth={4} />
    {TAGS.map((g, i) => (
      <PriceTag key={i} x={g.x + Math.sin(t / 14 + i) * 3} y={330} t={t} at={g.at} from={g.from} to={g.to} s={1.6} />
    ))}
  </g>
);
