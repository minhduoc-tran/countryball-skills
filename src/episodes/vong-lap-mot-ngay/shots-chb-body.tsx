import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeIn, lerp, camT, Street, Bicycle, bikePose, streetStand, proj, Sparkle, Glow, LOOKS,
  ShotProps, Pose, basePose, Foreground, toWorld, joints,
} from '../../engine';
import { MorningBedroom, roomStand, bedTop } from './kit-morning-bedroom';
import { TearCalendar } from './kit-bedroom-parts';
import { RewindWave } from './kit-rewind-fx';
import { DayCounter } from './kit-loop-clock';
import { Dumbbell } from './kit-props';
import { RefreshScan, KneeScrape, Muscles, SweatDrops, DustPuff } from './chb-body-props';

// Chapter B, the body beat (B1-B5, 61.00-70.81 s): the body refreshes every morning (scan), the bike fall and the
// scraped knee that is clean again at 06:00, a day of weights that melts back to skinny arms at the reset, and the
// mirror: the same face every day while the day counter climbs and the calendar stays on THỨ TƯ.

const PIP = LOOKS.pipHood;

// ---------- B1: medium, 06:00 light: Pip stretches by the window, a cyan scan refreshes him head to toe ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.6, 0.42);
  const pose = poseAt(t, [
    { f: 0, p: { ...st, yaw: -0.25, look: -0.2, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 10, p: { armL: { a: 158, b: 12 }, armR: { a: 158, b: 12 }, squash: -0.04, headTilt: -6 }, ease: easeOut },
    { f: 40, p: { armL: { a: 150, b: 16 }, armR: { a: 150, b: 16 }, squash: -0.03 } },
    { f: 50, p: { armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, squash: 0, headTilt: 0 } },
  ]);
  const face = faceAt(t, [[0, 'tired'], [12, 'neutral'], [40, 'happy']]);
  const head = st.y - 176 * st.scale;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1080], [len, 1095]]), kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 1.75], [len, 1.9]]))}>
        <MorningBedroom t={t + 300} id="b1mb" dawn={1} />
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" />
        <RefreshScan x={st.x} y0={head - 80 * st.scale} y1={st.y + 150 * st.scale} w={240 * st.scale} p={clamp((t - 8) / 30)} t={t} />
        <Sparkle x={st.x - 70} y={head - 40} t={t - 36} s={0.8} />
        <Sparkle x={st.x + 80} y={st.y + 20} t={t - 40} s={0.7} />
      </g>
    </g>
  );
};

// ---------- B2: street, low wide: Pip's bike hits a stone, he tumbles and sits clutching a scraped knee ----------
const Z2 = 3.7;
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const gy = proj(0, 0, Z2).y;
  const sc = streetStand(0, Z2).scale;
  const X = lerp(-3.6, -1.0, clamp(t / 12));
  const bx = proj(X, 0, Z2).x;
  const hit = clamp((t - 12) / 4);
  const fall = easeIn(clamp((t - 14) / 6));
  const tumble = clamp((t - 12) / 8);
  const sitX = bx + 230 * sc;
  const ride = { ...bikePose(t, bx, gy, sc), ...faceAt(t, [[0, 'happy'], [12, 'shock']]) };
  const sit: Pose = poseAt(t, [
    { f: 20, p: { ...basePose, x: sitX, y: gy - 24 * sc, scale: sc, facing: 1, yaw: 0.75, tilt: 8, legL: { a: 75, b: 6 }, legR: { a: 128, b: -118 }, armR: { a: 10, b: 40 }, armL: { a: -40, b: 20 }, squash: 0.16, headTilt: 10, look: 0.6 } },
    { f: 24, p: { squash: 0 }, ease: easeOut },
    { f: len, p: { tilt: 12, headTilt: 14 } },
  ]);
  // mid-air: the rider pose spinning forward along an arc
  const fly: Pose = { ...ride, x: lerp(ride.x, sitX, tumble), y: lerp(ride.y, gy - 24 * sc, tumble) - Math.sin(tumble * Math.PI) * 90 * sc, spin: 200 * easeOut(tumble) };
  const pose = t < 12 ? ride : t < 20 ? fly : sit;
  const face = faceAt(t, [[0, 'happy'], [12, 'shock'], [22, 'worried']]);
  const bikeRot = 26 * hit * (1 - fall);
  const fx = bx + 110 * sc;
  return (
    <g transform={camT(kf(t, [[0, 640], [14, 900], [len, 930]]), kf(t, [[0, 720], [len, 740]]), kf(t, [[0, 2.2], [len, 2.45]]))}>
      <Street t={t + 120} id="b2st" veil={0.24} light="green" />
      {/* the stone */}
      <ellipse cx={proj(-1.0, 0, Z2).x + 110 * sc} cy={gy - 4} rx={18} ry={9} fill="#5A5262" stroke="#1E1A24" strokeWidth={3} />
      {/* the bike: rides, pitches forward over the stone, then lies on its side */}
      <g transform={`translate(${fx} ${gy}) rotate(${bikeRot}) scale(1 ${1 - 0.66 * fall}) translate(${-fx} ${-gy})`}>
        <Bicycle x={t < 12 ? bx : proj(-1.0, 0, Z2).x} y={gy} s={sc} t={Math.min(t, 12)} shadow={1 - fall} />
      </g>
      <Hero look={PIP} pose={{ ...pose, ...(t < 12 ? {} : face) }} rimId="rimL" shadow={t >= 20 ? 0.8 : 0} />
      {t >= 21 ? <KneeScrape pose={pose} o={clamp((t - 21) / 3)} /> : null}
      <DustPuff x={sitX} y={gy} t={t - 19} s={sc * 1.6} />
      {/* the sting: little red lines round the knee */}
      {t > 22
        ? [0, 1, 2].map((i) => {
            const a = -1.2 + i * 0.7;
            const kx = sitX + 64 * sc;
            const ky = gy - 70 * sc;
            const r0 = 34 * sc + (t % 8) * 1.2;
            return <path key={i} d={`M ${kx + Math.cos(a) * r0} ${ky + Math.sin(a) * r0} l ${Math.cos(a) * 18 * sc} ${Math.sin(a) * 18 * sc}`} stroke="#FF5A4A" strokeWidth={6 * sc} strokeLinecap="round" />;
          })
        : null}
    </g>
  );
};

// ---------- B3: match cut, 06:00: the same pose on the bed, the reset wipes the scrape, a sparkle on the knee ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const seat = bedTop(0.27, 0.36);
  const sc = 0.9;
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: seat.x, y: seat.y - 24 * sc, scale: sc, facing: 1, yaw: 0.75, tilt: 12, legL: { a: 75, b: 6 }, legR: { a: 128, b: -118 }, armR: { a: 10, b: 40 }, armL: { a: -40, b: 20 }, headTilt: 14, look: 0.6 } },
    { f: 12, p: { tilt: 2, headTilt: 4, look: 0.5 } },
    { f: len, p: { tilt: 0, headTilt: 0, look: 0.7 } },
  ]);
  const face = faceAt(t, [[0, 'worried'], [8, 'shock'], [18, 'happy']]);
  const knee = toWorld(pose, joints(pose).legR.mid);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 820], [len, 800]]), kf(t, [[0, 590], [len, 580]]), kf(t, [[0, 2.5], [len, 2.65]]))}>
        <MorningBedroom t={t + 340} id="b3mb" dawn={1} ring={1} duvet={false} />
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
        <KneeScrape pose={pose} o={clamp(1 - t / 5)} />
        <Glow x={knee.x} y={knee.y} r={90} kind="cool" o={0.6 * clamp(1 - t / 16)} />
        <Sparkle x={knee.x + 6} y={knee.y - 10} t={t - 5} s={1.1} />
        <Sparkle x={knee.x + 40} y={knee.y + 18} t={t - 11} s={0.7} />
      </g>
      <RewindWave t={t} t0={0} id="b3rw" cx={960} cy={540} />
    </g>
  );
};

// ---------- B4: medium: 23:59, Pip presses dumbbells, arms swell; the reset: 06:00, the same spot, skinny arms ----------
const R4 = 32;
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.635, 0.42);
  const before = t < R4;
  const rep = Math.sin(t / 4.2);
  const k = before ? easeOut(clamp(t / 26)) : 0;
  const press: Pose = poseAt(0, [{ f: 0, p: { ...st, yaw: 0.15, armL: { a: 88, b: -82 - rep * 40 }, armR: { a: 88, b: -82 + rep * 40 }, squash: 0.02 * rep } }]);
  const after = poseAt(t - R4, [
    { f: 0, p: { ...st, yaw: 0.15, armL: { a: 120, b: -60 }, armR: { a: 120, b: -60 }, look: 0.5 } },
    { f: 8, p: { armL: { a: 92, b: -112 }, armR: { a: 92, b: -112 }, headTilt: 10 }, ease: easeOut },
    { f: 30, p: { armL: { a: 88, b: -118 }, armR: { a: 88, b: -118 }, headTilt: 14, look: 0.8 } },
    { f: 46, p: { armL: { a: 18, b: -10 }, armR: { a: 18, b: -10 }, headTilt: 4, look: 0.1 } },
  ]);
  const pose = before ? press : after;
  const face = before ? faceAt(t, [[0, 'cool'], [18, 'happy']]) : faceAt(t - R4, [[0, 'shock'], [12, 'worried'], [40, 'oops']]);
  const hl = toWorld(press, joints(press).armL.end);
  const hr = toWorld(press, joints(press).armR.end);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1060], [len, 1090]]), kf(t, [[0, 590], [len, 600]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
        <MorningBedroom t={t + 360} id="b4mb" dawn={before ? 0 : 1} lamp={before ? 1 : 0} clock={before ? '23:59' : '06:00'} ring={before ? 0 : 1} />
        {!before ? (
          <g>
            <Dumbbell x={st.x - 150} y={st.y + 128} s={0.55} rot={-8} />
            <Dumbbell x={st.x + 160} y={st.y + 132} s={0.55} rot={10} />
          </g>
        ) : null}
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" />
        <Muscles pose={pose} k={k} />
        {before ? (
          <g>
            <Dumbbell x={hl.x} y={hl.y} s={0.42} rot={90} />
            <Dumbbell x={hr.x} y={hr.y} s={0.42} rot={90} />
            <SweatDrops x={st.x} y={st.y - 250 * st.scale} t={t} s={st.scale} />
          </g>
        ) : null}
      </g>
      <RewindWave t={t} t0={R4} id="b4rw" />
    </g>
  );
};

// ---------- B5: close-up in the bathroom mirror: the same face every day, NGÀY # climbs, the calendar stays THỨ TƯ ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const every = 6;
  const n = 1 + Math.floor(t / every);
  const ph = (t % every) / every;
  const m = { x0: 430, x1: 1150, y0: 170, y1: 900 };
  const face = faceAt(t, [[0, 'neutral'], [34, 'smug']]);
  const head = { x: 790, y: 560 };
  const sc = 2.3;
  const pose: Pose = { ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.12, look: 0.1, headTilt: Math.sin(t / 16) * 2, armL: { a: 8, b: 0 }, armR: { a: 8, b: 0 } };
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.07]])}) translate(-960 -540)`}>
      <defs>
        <clipPath id="b5mir"><rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} rx={36} /></clipPath>
      </defs>
      {/* the bathroom wall: muted teal tiles */}
      <rect x={-20} y={-20} width={1960} height={1120} fill="#34474C" />
      {Array.from({ length: 14 }).map((_, i) => <path key={`h${i}`} d={`M -20 ${i * 84} H 1960`} stroke="#283A3F" strokeWidth={4} />)}
      {Array.from({ length: 22 }).map((_, i) => <path key={`v${i}`} d={`M ${i * 96 + (i % 2) * 0} -20 V 1100`} stroke="#283A3F" strokeWidth={4} />)}
      {/* the wall light over the mirror (the practical) */}
      <rect x={m.x0 + 160} y={112} width={400} height={30} rx={15} fill="#FFE6B8" />
      <Glow x={(m.x0 + m.x1) / 2} y={140} r={620} o={0.75} />
      {/* the mirror and its reflection */}
      <rect x={m.x0 - 18} y={m.y0 - 18} width={m.x1 - m.x0 + 36} height={m.y1 - m.y0 + 36} rx={46} fill="#1E2428" stroke="#121618" strokeWidth={6} />
      <g clipPath="url(#b5mir)">
        <rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} fill="#46585C" />
        <rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} fill="#FFE6B8" opacity={0.12} />
        <path d={`M ${m.x0 + 40} ${m.y0} L ${m.x0 + 220} ${m.y0} L ${m.x0 + 60} ${m.y1} L ${m.x0 - 120} ${m.y1} Z`} fill="#FFFFFF" opacity={0.06} />
        {/* ghosts of yesterday's face slide in and sit exactly on today's: identical */}
        {t > 2 ? (
          <g opacity={0.35 * (1 - ph)}>
            <Hero look={PIP} pose={{ ...pose, x: pose.x + 120 * (1 - easeOut(ph)), ...face }} rimId="rimR" shadow={0} />
          </g>
        ) : null}
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
        <rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} fill="#9FC0D0" opacity={0.06} />
      </g>
      <path d={`M ${m.x0 + 30} ${m.y0 + 20} Q ${m.x0 + 20} ${m.y0 + 200} ${m.x0 + 28} ${m.y0 + 330}`} stroke="#FFFFFF" strokeWidth={8} opacity={0.18} fill="none" strokeLinecap="round" />
      {/* the tear-off calendar taped by the mirror: stuck on THỨ TƯ */}
      <g transform={`rotate(${3 + Math.sin(t / 9) * 0.6} 1520 320)`}>
        <TearCalendar x={1520} y={250} w={250} day="THỨ TƯ" />
      </g>
      <DayCounter x={1520} y={700} n={n} s={0.95} />
      {/* the sink's rim at the bottom, the tap */}
      <path d="M -20 960 Q 960 930 1940 960 L 1940 1100 L -20 1100 Z" fill="#D9D4CA" />
      <path d="M -20 962 Q 960 932 1940 962" stroke="#FFF4DC" strokeWidth={6} opacity={0.7} fill="none" />
      <path d="M 780 960 L 780 900 Q 780 870 820 870 L 880 870" stroke="#A8B0B6" strokeWidth={24} fill="none" strokeLinecap="round" />
      {/* Pip's own shoulder, near the lens, dark and soft */}
      <Foreground blur={16}>
        <ellipse cx={1640} cy={1130} rx={460} ry={330} fill="#15131C" />
        <path d="M 1300 1000 Q 1500 860 1760 900" stroke="#FFC98A" strokeWidth={14} fill="none" opacity={0.5} />
      </Foreground>
    </g>
  );
};
