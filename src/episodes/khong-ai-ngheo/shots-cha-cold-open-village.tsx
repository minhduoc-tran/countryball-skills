import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, walkPose, joints, toWorld, LEG_LEN, Classroom, SchoolDesk, Glow, Dust, Foreground, Sparkle, ShotProps,
} from '../../engine';
import { VILLAGE_GIRL } from './cast-looks';
import { VillageBackdrop, WaterPole, VillageTap, GoldFloor } from './cha-village-and-school-props';

// Chapter A, cold open 1/3 (0.00-4.51 s): the girl in the mountain village. BEFORE: she carries water past the school.
// AFTER: she walks into class on the golden floor, and the village tap runs beside her abandoned pole.

// ---------- A1: wide, the mountain village at dawn; the girl with her pole and buckets walks past the school ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.62;
  const gy = 892;
  const x = 1010 + t * 6.1;
  const ph = t * 0.6;
  const pose = walkPose(x, ph, gy, sc, { look: 0.2, expr: 'tired' });
  const sh = toWorld(pose, { x: 20, y: -108 });
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1330]]), kf(t, [[0, 600], [len, 640]]), kf(t, [[0, 1.0], [len, 1.28]]))}>
      <VillageBackdrop t={t} id="a1v" />
      <Hero look={VILLAGE_GIRL} pose={pose} rimId="rimL" shadow={0.6} />
      <WaterPole sx={sh.x} sy={sh.y + 4} s={sc} phase={ph + 0.6} tilt={-2} />
      <Foreground blur={10}><ellipse cx={80} cy={1060} rx={420} ry={110} fill="#4A5A3A" /></Foreground>
    </g>
  );
};

const ChalkDoodle: React.FC = () => (
  <g stroke="#F4F1E6" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
    <circle cx={560} cy={290} r={42} />
    <path d="M 560 226 v -22 M 560 354 v 22 M 496 290 h -22 M 624 290 h 22 M 515 245 l -16 -16 M 605 245 l 16 -16 M 515 335 l -16 16 M 605 335 l 16 16" />
    <path d="M 760 440 v -90 l 70 -60 l 70 60 v 90 z M 800 440 v -46 h 60 v 46" />
    <path d="M 440 470 q 120 -40 240 0" />
  </g>
);

// ---------- A2: medium, she walks into the classroom on the golden floor, a seat waiting ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const gy = 905;
  const x = 520 + t * 10.5;
  const walking = x < 1130;
  const pose = walkPose(Math.min(x, 1130), t * 0.62, gy, 1.0, walking ? { look: 0.3 } : { yaw: 0.4, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } });
  const stop = poseAt(Math.max(0, t - 38), [{ f: 0, p: { ...pose } }, { f: 5, p: { legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 }, armR: { a: 150, b: 10 } }, ease: easeOut }]);
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 1000]]), 640, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <Classroom t={t + 60} id="a2cls" board={<ChalkDoodle />} />
      <GoldFloor x0={-100} x1={2000} y={gy + 8} t={t} id="a2fl" th={24} />
      <SchoolDesk x={1260} />
      <Hero look={VILLAGE_GIRL} pose={{ ...(t > 38 ? stop : pose), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <Glow x={900} y={380} r={520} o={0.2} />
      <Sparkle x={1230} y={520} t={t - 30} s={1.2} />
    </g>
  );
};

// ---------- A3: macro at the school gate: the tap runs clean water, the shoulder pole leans unused against the wall ----------
export const A3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 930], [len, 980]]), 640, kf(t, [[0, 1.2], [len, 1.4]]))}>
    <rect x={-200} y={-200} width={2320} height={1100} fill="#E9C77C" />
    <rect x={-200} y={-200} width={2320} height={90} fill="#C9553A" />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-100 + i * 430} -110 V 900`} stroke="#C9A55E" strokeWidth={4} opacity={0.6} />)}
    <rect x={1280} y={370} width={300} height={520} fill="#8A4A2E" stroke="#4A2A18" strokeWidth={6} />
    <path d="M 1430 370 V 890" stroke="#4A2A18" strokeWidth={5} />
    <rect x={-200} y={880} width={2320} height={300} fill="#B58B5C" />
    <path d="M -200 884 H 2120" stroke="#E8C68F" strokeWidth={6} />
    <GoldFloor x0={-100} x1={2000} y={896} t={t} id="a3fl" th={20} o={0.9} />
    <VillageTap x={760} y={892} s={1.65} t={t} flow={clamp(t / 6)} />
    <g transform="translate(1540 892)">
      <ellipse cx={0} cy={2} rx={50} ry={9} fill="#000" opacity={0.3} />
      <path d="M -150 0 L -60 -420" stroke="#B8943E" strokeWidth={16} strokeLinecap="round" transform={`rotate(${Math.sin(t / 20) * 0.6} 0 0)`} />
      <path d="M -150 0 L -60 -420" stroke="#E8CC7A" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
    </g>
    <Glow x={1000} y={300} r={560} o={0.35} />
    <Dust t={t} seed={7} x0={300} y0={100} w={1400} h={760} n={30} o={0.6} />
    <Foreground blur={16}><path d="M -200 1100 Q 300 880 800 1100 Z" fill="#3A2A1C" /></Foreground>
  </g>
);
