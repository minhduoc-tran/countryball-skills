import React from 'react';
import { Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, LEG_LEN, Glow, TitleCard, Street, streetStand, walkPose, toWorld, ShotProps } from '../../engine';
import { Globe } from '../dai-duong-can/kit-globe';
import { MiniPerson } from './cha-screens-and-bubbles';
import { MorningBedroom, MB } from './kit-morning-bedroom';
import { ResetClock, DayCounter } from './kit-loop-clock';
import { RewindWave, MemoryGlow } from './kit-rewind-fx';
import { TearCalendar } from './kit-bedroom-parts';
import { Granny, Boss, Neighbour } from './kit-cast-figures';
import { CalPage } from './cha-places-props';
import { SleepingPip, toScreen } from './shots-cha-cold-open';
import { PAL } from './kit-palette';

// Chapter A, the premise (14.1-23.5 s): the title over Pip's room at midnight, the whole world snapping back from
// 23:59 to 06:00 THỨ TƯ, the calendar that always lands on THỨ TƯ ("mãi mãi"), and a street of people who remember
// nothing, Pip the only one glowing.
const PIP = LOOKS.pipHood;

// ---------- A7: wide, the title over Pip's dark room at 23:59, Pip asleep, the clock's red glow ----------
export const A7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 940], [len, 920]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
      <MorningBedroom t={t + 300} id="ca7" dawn={0} clock="23:59" duvet={false} veil={0.36} />
      <SleepingPip t={t + 300} />
    </g>
    <rect x={0} y={0} width={1920} height={330} fill="#06081A" opacity={0.35} />
    <TitleCard t={t} lines={['SẼ RA SAO NẾU CHỈ MÌNH BẠN', 'NHỚ NGÀY HÔM QUA?']} accent="NHỚ" accentT={30} size={112} y={140} />
  </g>
);

// ---------- A8: the whole world snaps back: the reset clock over the Earth, tiny people rewinding on its rim ----------
const RIM = Array.from({ length: 23 }).map((_, i) => -66 + i * 6);
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const t0 = 0;
  const spin = clamp((t - t0 - 9) / 21);
  const rot = 40 - 300 * easeIn(spin);
  const G = { cx: 960, cy: 1330, r: 760 };
  const back = t >= t0 + 9 && t < t0 + 31;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill={PAL.midnight} />
      {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 211) % 620} r={i % 5 ? 1.6 : 2.6} fill="#F6EFE3" opacity={0.3 + 0.4 * Math.abs(Math.sin(t / 12 + i))} />)}
      <Glow x={G.cx} y={G.cy - G.r} r={900} kind="cool" o={0.35} />
      <Globe id="ca8g" t={t} r={G.r} cx={G.cx} cy={G.cy} rot={rot} />
      {/* the people on the rim: they jitter backwards with a cyan echo while the clock spins */}
      {RIM.map((deg, i) => {
        const a = ((deg - 90) * Math.PI) / 180;
        const x = G.cx + Math.cos(a) * (G.r + 22);
        const y = G.cy + Math.sin(a) * (G.r + 22);
        const j = back ? Math.sin(t * 1.7 + i) * 8 : 0;
        return (
          <g key={i} transform={`rotate(${deg} ${x} ${y})`}>
            {back ? <MiniPerson x={x + 16} y={y} s={0.9} color={PAL.cyan} o={0.5} /> : null}
            <MiniPerson x={x + j} y={y} s={0.9} color={back ? PAL.cyanSoft : '#F6EFE3'} />
          </g>
        );
      })}
      <ResetClock t={t} t0={t0} x={960} y={300} s={0.86} />
      <RewindWave t={t} t0={t0 + 30} id="ca8rw" cx={960} cy={300} />
    </g>
  );
};

// ---------- A9: insert, the tear-off calendar: page after page flies off, and every new page is THỨ TƯ ----------
const TEARS = [6, 20, 30, 37, 42, 46, 49, 52, 54, 56, 58, 60, 62, 64, 66, 68];
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const W = 470;
  const C = { x: 960, y: 110 };
  const done = TEARS.filter((f) => t >= f).length;
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform={camT(MB.CAL.x, MB.CAL.y + 90, 3.6)}>
          <MorningBedroom t={t + 40} id="ca9bg" dawn={1} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.3} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
        <TearCalendar x={C.x} y={C.y} w={W} day="THỨ TƯ" />
        {TEARS.map((f, i) => {
          const p = (t - f) / 14;
          if (p < 0 || p > 1) return null;
          const e = easeOut(p);
          const side = i % 2 ? -1 : 1;
          return <CalPage key={i} x={C.x + side * 900 * e} y={C.y - 260 * e + 500 * p * p} w={W} rot={side * 70 * e} o={1 - p * 0.6} />;
        })}
      </g>
      <DayCounter x={960} y={985} n={1 + done} />
      <Glow x={960} y={400} r={700} o={0.3} />
    </g>
  );
};

// ---------- A10: wide street, the morning crowd walks past with blank faces; Pip stands still, the only one glowing ----------
type Walker = { look: 'mo' | 'mom' | 'granny' | 'boss' | 'neighbour' | 'suit'; X0: number; v: number; Z: number; f: 1 | -1 };
const WALKERS: Walker[] = [
  { look: 'mom', X0: -2.8, v: 0.02, Z: 8.6, f: 1 },
  { look: 'boss', X0: 3.2, v: -0.03, Z: 6.4, f: -1 },
  { look: 'mo', X0: 2.6, v: -0.02, Z: 9.6, f: -1 },
  { look: 'neighbour', X0: -1.7, v: -0.03, Z: 6.0, f: -1 },
  { look: 'granny', X0: 1.0, v: 0.012, Z: 8.0, f: 1 },
  { look: 'suit', X0: -3.6, v: 0.03, Z: 10.8, f: 1 },
];
const Walk: React.FC<{ w: Walker; t: number }> = ({ w, t }) => {
  const X = w.X0 + w.v * t;
  const s = streetStand(X, w.Z);
  const base: Pose = walkPose(s.x, t * 0.6 + w.X0, s.y + LEG_LEN * s.scale, s.scale, { yaw: 0.8 * w.f, expr: 'neutral' }, w.f);
  if (w.look === 'granny') return <Granny pose={{ ...base, tilt: 10 * w.f }} rimId="rimR" shadow={1} />;
  if (w.look === 'boss') return <Boss pose={base} rimId="rimR" shadow={1} />;
  if (w.look === 'neighbour') return <Neighbour pose={base} rimId="rimR" shadow={1} />;
  return <Hero look={LOOKS[w.look]} pose={base} rimId="rimR" shadow={1} />;
};
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const p = streetStand(-0.4, 7.2);
  const cam = { x: p.x + 20, y: kf(t, [[0, p.y - 10], [len, p.y - 20]]), z: kf(t, [[0, 2.3], [len, 2.45]]) };
  const pose = poseAt(t, [{ f: 0, p: { ...p, yaw: 0.15, look: -0.6, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 } } }, { f: 22, p: { look: 0.6 } }, { f: 36, p: { look: 0, headTilt: -3 } }]);
  const head = toScreen(cam.x, cam.y, cam.z, toWorld(pose, { x: 0, y: -176 }));
  const sorted = [...WALKERS].sort((a, b) => b.Z - a.Z);
  const near = sorted.filter((w) => w.Z < 7.2);
  return (
    <g>
      <g transform={camT(cam.x, cam.y, cam.z)}>
        <Street t={t + 400} id="ca10st" veil={0.26} light="green" />
        {sorted.filter((w) => w.Z >= 7.2).map((w, i) => <Walk key={i} w={w} t={t} />)}
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [34, 'neutral']]) }} rimId="rimR" shadow={1} />
        {near.map((w, i) => <Walk key={`n${i}`} w={w} t={t} />)}
      </g>
      <MemoryGlow x={head.x} y={head.y} r={62 * p.scale * cam.z * 1.6} t={t} id="ca10mg" o={clamp((t - 36) / 6)} />
    </g>
  );
};

