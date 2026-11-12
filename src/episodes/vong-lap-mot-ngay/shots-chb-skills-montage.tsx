import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, rnd, camT, Glow, LOOKS, ShotProps, toWorld, joints, basePose, Pose,
  Kitchen, KitchenIsland, KITCHEN, stand, Sparkle, Foreground,
} from '../../engine';
import { MorningBedroom, roomStand } from './kit-morning-bedroom';
import { BedsideClock } from './kit-bedroom-parts';
import { MemoryGlow } from './kit-rewind-fx';
import { PianoKeys } from './kit-props';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { PAL } from './kit-palette';
import { UprightPiano, Easel, SkillIcon, SkillKind, Panel, Note } from './chb-learning-props';

// Chapter B, the skills (B24-B27, 110.73-119.77 s): two panels, piano then painting; cooking in the kitchen with any
// skill popping round him; the fingers at the keys soft as the first time every morning; the notes all flowing into
// his head, where they stay.

const PIP = LOOKS.pipHood;

/** Pip seated in profile facing left at (x, y = hips), hands forward. */
const seatedLeft = (x: number, y: number, s: number, t: number): Pose => ({
  ...basePose, x, y, scale: s, facing: -1, yaw: -0.8, tilt: -6, look: -0.4,
  legL: { a: 82, b: -84 }, legR: { a: 78, b: -80 },
  armL: { a: 74 + Math.sin(t / 2.6) * 6, b: 16 }, armR: { a: -70 + Math.sin(t / 2.6 + 2) * 6, b: -14 },
});

// ---------- B24: two panels: Pip at the piano ("học đàn"), then at the easel painting a sunset ("học vẽ") ----------
export const B24: React.FC<ShotProps> = ({ t }) => {
  const p1 = seatedLeft(700, 750, 1.15, t);
  const p2 = poseAt(t - 31, [
    { f: 0, p: { ...basePose, x: 1640, y: 742, scale: 1.15, yaw: -0.6, look: -0.4, armL: { a: 70, b: -10 }, armR: { a: 12, b: -8 } } },
    { f: 6, p: { armL: { a: 104, b: -30 } }, ease: easeOut },
    { f: 21, p: { armL: { a: 96, b: -16 } } },
  ]);
  const brush = toWorld(p2, joints(p2).armL.end);
  return (
    <g>
      <rect x={-20} y={-20} width={1960} height={1120} fill="#241C2C" />
      {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={rnd(91, i) * 1920} cy={rnd(92, i) * 1080} r={40 + rnd(93, i) * 60} fill="#FFD9A0" opacity={0.06} />)}
      <Panel x={80} y={150} w={850} h={780} id="b24a" t={t + 8} from={-200}>
        <rect x={80} y={150} width={850} height={780} fill="#4A3644" />
        <rect x={80} y={760} width={850} height={170} fill="#36262E" />
        <Glow x={300} y={320} r={420} o={0.55} />
        <UprightPiano x={420} y={900} s={1.25} t={t} />
        <rect x={650} y={760} width={120} height={20} rx={6} fill="#5A3E2C" />
        <path d="M 665 780 V 900 M 755 780 V 900" stroke="#2A1E1C" strokeWidth={10} />
        <Hero look={PIP} pose={{ ...p1, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" />
        {[0, 1, 2].map((i) => {
          const a = ((t + i * 11) % 33) / 33;
          return <Note key={i} x={300 + i * 50 - a * 60} y={560 - a * 300} s={1.2} c={['#FFE27A', PAL.cyanSoft, '#FFB98A'][i]} rot={Math.sin(t / 5 + i) * 10} />;
        })}
      </Panel>
      <Panel x={990} y={150} w={850} h={780} id="b24b" t={t - 31} from={200}>
        <rect x={990} y={150} width={850} height={780} fill="#3E4652" />
        <rect x={990} y={760} width={850} height={170} fill="#2C323C" />
        <Glow x={1700} y={260} r={420} o={0.55} />
        <Easel x={1280} y={900} s={1.25} paint={clamp((t - 34) / 16)} />
        <Hero look={PIP} pose={{ ...p2, ...faceAt(t - 31, [[0, 'neutral'], [8, 'happy']]) }} rimId="rimR" />
        <path d={`M ${brush.x} ${brush.y} L ${brush.x - 40} ${brush.y - 34}`} stroke="#6A4A2E" strokeWidth={8} strokeLinecap="round" />
        <circle cx={brush.x - 42} cy={brush.y - 36} r={8} fill="#F2A65A" />
      </Panel>
    </g>
  );
};

// ---------- B25: medium in the kitchen: a pancake flip, then any skill pops round him: "học bất cứ thứ gì" ----------
const ICONS: SkillKind[] = ['guitar', 'chess', 'globe', 'code', 'ball', 'camera'];
export const B25: React.FC<ShotProps> = ({ t, len }) => {
  const st = stand(KITCHEN, 0.5, 0.4);
  const flip = clamp((t - 2) / 16);
  const pose = poseAt(t, [
    { f: 0, p: { ...st, yaw: 0.35, look: 0.5, armR: { a: 60, b: -50 }, armL: { a: 20, b: -20 } } },
    { f: 4, p: { armR: { a: 75, b: -80 } }, ease: easeOut },
    { f: 18, p: { armR: { a: 62, b: -52 }, headTilt: -8 } },
    { f: 30, p: { headTilt: -2, look: 0.2 } },
  ]);
  const h = toWorld(pose, joints(pose).armR.end);
  const pan = { x: h.x + 60 * st.scale, y: h.y };
  const cake = { x: pan.x + 10, y: pan.y - 12 - Math.sin(flip * Math.PI) * 170 * st.scale };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1000], [len, 1010]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.75], [len, 1.9]]))}>
        <Kitchen t={t + 800} id="b25k" />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [16, 'happy']]) }} rimId="rimR" />
        <KitchenIsland />
        {/* the pan and the pancake turning over in the air */}
        <path d={`M ${h.x - 6} ${h.y + 4} L ${pan.x - 40 * st.scale} ${pan.y}`} stroke="#1A1820" strokeWidth={12 * st.scale} strokeLinecap="round" />
        <ellipse cx={pan.x} cy={pan.y} rx={64 * st.scale} ry={16 * st.scale} fill="#1A1820" stroke="#3A3446" strokeWidth={4} />
        <g transform={`translate(${cake.x} ${cake.y}) scale(1 ${Math.cos(flip * Math.PI * 2)})`}>
          <ellipse cx={0} cy={0} rx={44 * st.scale} ry={12 * st.scale} fill={flip > 0.25 && flip < 0.75 ? '#C98A3A' : '#F2C14E'} stroke="#7A4A12" strokeWidth={3} />
        </g>
        {[0, 1, 2].map((i) => {
          const a = ((t + i * 9) % 27) / 27;
          return <path key={i} d={`M ${pan.x - 30 + i * 30} ${pan.y - 20 - a * 120} q 12 -20 0 -40`} stroke="#F6EFE3" strokeWidth={5} fill="none" opacity={0.5 * (1 - a)} strokeLinecap="round" />;
        })}
      </g>
      {ICONS.map((k, i) => {
        const a = Math.PI * (1.08 + i * 0.17);
        return <SkillIcon key={k} kind={k} x={960 + Math.cos(a) * 760 + 0} y={600 + Math.sin(a) * 430} r={88} t={t - 24 - i * 3} />;
      })}
    </g>
  );
};

// ---------- B26: insert on the keys at 06:00: his mitten hovers, wobbles, presses one key, then fumbles two ----------
const KW = 1760 / 14;
const keyX = (i: number) => 960 - 880 + (i + 0.5) * KW;
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const hover = Math.sin(t / 3) * 10 * clamp(1 - Math.abs(t - 30) / 30);
  const tap1 = t >= 39 && t < 50;
  const tap2 = t >= 61;
  const x = t < 55 ? keyX(6) : keyX(6) + KW * 0.5 * clamp((t - 55) / 6);
  const y = kf(t, [[0, 360], [12, 520], [36, 540], [39, 600], [48, 600], [52, 540], [58, 540], [61, 604]], easeOut) + hover;
  const press = tap1 ? [6] : tap2 ? [6, 7] : [];
  return (
    <g>
      <g filter="url(#blur16)"><g transform={camT(1200, 560, 2.2)}><MorningBedroom t={t + 840} id="b26mb" dawn={1} /></g></g>
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.2} />
      <Glow x={1500} y={160} r={760} o={0.5} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
        <PianoKeys x={960} y={1000} w={1760} t={t} press={press} />
        <InsertArm x={x} y={y - 60} fx={x + 260} fy={-300} rot={0} s={5.4} width={126} point />
        {/* soft fingers: little jelly wobble marks round the mitten tip */}
        {t > 34 && t < 70
          ? [-1, 1].map((sd) => <path key={sd} d={`M ${x + sd * 40} ${y + 96} q ${sd * 14} ${10 + Math.sin(t) * 6} 0 ${24}`} stroke="#FFE2B0" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />)
          : null}
        {tap2 ? <path d={`M ${keyX(6) + 280} 330 q 30 -40 60 0 t 60 0 t 60 0`} stroke="#FF8A6A" strokeWidth={8} fill="none" strokeLinecap="round" opacity={clamp((t - 61) / 4)} /> : null}
        {tap1 ? <Note x={keyX(6) - 220} y={380 - (t - 39) * 6} s={1.6} c="#FFE27A" /> : null}
      </g>
      <BedsideClock x={1700} y={210} s={0.85} text="06:00" t={t} />
      <Foreground blur={16}><rect x={-40} y={1010} width={2000} height={120} fill="#0E0C14" /></Foreground>
    </g>
  );
};

// ---------- B27: close-up: notes stream into his head and stay: a staff of remembered notes grows above it ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.5, 0.5);
  const pose = poseAt(t, [{ f: 0, p: { ...st, yaw: -0.55, look: -0.3, headTilt: 4 } }, { f: len, p: { headTilt: -4, look: -0.5 } }]);
  const z = kf(t, [[0, 3.2], [len, 3.45]]);
  const c = { x: 940, y: 520 };
  const head = toWorld(pose, { x: 0, y: -176 });
  const hs = { x: 960 + (head.x - c.x) * z, y: 540 + (head.y - c.y) * z };
  const kept = Math.max(0, Math.min(8, Math.floor((t - 6) / 7)));
  return (
    <g>
      <g transform={camT(c.x, c.y, z)}>
        <g filter="url(#blur6)"><MorningBedroom t={t + 880} id="b27mb" dawn={1} /></g>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [20, 'smug']]) }} rimId="rimL" />
      </g>
      <MemoryGlow x={hs.x} y={hs.y} r={62 * pose.scale * z * 1.6} t={t} id="b27mg" o={0.7 + 0.3 * Math.abs(Math.sin(t / 3.5))} />
      {/* notes flying in from the piano side (bottom left) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const p = easeOut(clamp((t - i * 7) / 12));
        if (p <= 0 || p >= 1) return null;
        const sx = -60 + rnd(71, i) * 300;
        const sy = 1100;
        return <Note key={i} x={sx + (hs.x - sx) * p} y={sy + (hs.y - sy) * p} s={1.8 * (1 - 0.6 * p)} c={['#FFE27A', PAL.cyanSoft, '#FFB98A'][i % 3]} rot={(1 - p) * 30} />;
      })}
      {Array.from({ length: kept }).map((_, i) => <Sparkle key={i} x={hs.x + Math.cos(i * 2.1) * 130} y={hs.y + Math.sin(i * 2.1) * 110} t={t - 6 - i * 7 - 12} s={0.6} />)}
      {/* the staff of remembered notes, filling up over his head */}
      <g transform="translate(1180 170)" opacity={easeOut(clamp((t - 4) / 8))}>
        <rect x={-30} y={-40} width={700} height={190} rx={30} fill="#0B0816" opacity={0.7} stroke={PAL.cyan} strokeWidth={3} />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M 10 ${k * 26} H 630`} stroke="#F6EFE3" strokeWidth={3} opacity={0.6} />)}
        {Array.from({ length: kept }).map((_, i) => <Note key={i} x={60 + i * 74} y={[78, 52, 26, 52, 64, 38, 90, 26][i]} s={0.85} c={PAL.cyanSoft} />)}
      </g>
    </g>
  );
};
