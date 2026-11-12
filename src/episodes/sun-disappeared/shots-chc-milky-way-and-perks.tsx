import React from 'react';
import {
  Hero, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, LEG_LEN, joints, toWorld, rnd, mixHex,
  Rooftop, Foreground, Sparkle, IceCreamCone, ShotProps, Glow, backOut,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { MilkyWay, StarSky, NightBeach, Sunscreen, Astronomer, ClockTower, NightCity, TimeChip } from './chc-sky-and-people-props';

// Chapter C, beats "milky way" and "perks" (C1-C9): the sky is black at noon and it is almost beautiful; the perks.

const PIP = LOOKS.pipHood;

/** Pip lying on his back on the deck (head to the left), rotated about his hips. */
const LyingPip: React.FC<{ x: number; y: number; scale: number; expr: 'happy' | 'neutral' | 'worried'; blink?: number }> = ({ x, y, scale, expr, blink = 0 }) => (
  <g transform={`rotate(-90 ${x} ${y})`}>
    <Hero look={PIP} pose={{ ...basePose, x, y, scale, yaw: 1, expr, blink, armL: { a: 150, b: 100 }, armR: { a: 160, b: 110 }, legL: { a: 4, b: 0 }, legR: { a: -2, b: 0 } }} rimId="rimBlue" shadow={0} />
  </g>
);

// ---------- C1: wide rooftop at "noon", black sky, the Milky Way arching over; Pip lying on the roof ----------
export const C1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 940]]), kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Rooftop t={t + 20} sunGone={1} low={110} cityLit={2.2} />
    <MilkyWay t={t} id="c1" cx={960 + kf(t, [[0, -20], [len, 20]])} cy={300} rot={-16} len={1500} w={330} />
    <LyingPip x={1060} y={925} scale={1.3} expr="happy" blink={t % 70 > 66 ? 1 : 0} />
    <Foreground blur={10}>
      <ellipse cx={-60} cy={1060} rx={420} ry={90} fill="#05060E" />
    </Foreground>
  </g>
);

// ---------- C2: close-up of Pip's face, eyes up, the galaxy turning slowly behind him ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1040, y: 1188, scale: 3.4, yaw: 0.35, look: 0.6, headTilt: -6, expr: 'happy' } },
    { f: len, p: { headTilt: -12, look: 0.9 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <StarSky t={t} id="c2sky" horizonY={1500} n={160} seed={43} />
      <MilkyWay t={t} id="c2" cx={760} cy={300} rot={kf(t, [[0, -40], [len, -34]])} len={1700} w={520} stars={340} seed={11} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimBlue" shadow={0} />
      <Sparkle x={820} y={420} t={t - 8} s={1.6} />
      <Sparkle x={1180} y={300} t={t - 30} s={1.2} />
    </g>
  );
};

// ---------- C3: wide city under the galaxy, a "12:00" clock chip: noon, and the stars are out ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 640], [len, 470]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Rooftop t={t + 60} sunGone={1} low={-30} cityLit={3} />
    <MilkyWay t={t} id="c3" cx={900} cy={250} rot={-12} len={1700} w={400} o={1} seed={23} stars={300} />
    <TimeChip x={1600} y={140} text="12:00" sub="NOON" />
  </g>
);

// ---------- C4: a city clock tower reading 12:00 against the Milky Way; push in ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 960]]), kf(t, [[0, 640], [len, 520]]), kf(t, [[0, 1.0], [len, 1.35]]))}>
    <StarSky t={t} id="c4sky" horizonY={900} n={120} seed={29} />
    <MilkyWay t={t} id="c4" cx={900} cy={330} rot={-30} len={1500} w={380} seed={17} />
    <NightCity t={t} y={930} />
    <ClockTower x={1000} y={980} s={1.5} t={t} />
    <TimeChip x={1330} y={330} text="12:00" s={0.9} />
  </g>
);

// ---------- C5: the astronomer dances beside her telescope on the rooftop under the galaxy ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 960]]), 590, kf(t, [[0, 1.1], [len, 1.0]]))}>
    <Rooftop t={t + 90} sunGone={1} low={60} cityLit={2} />
    <MilkyWay t={t} id="c5" cx={1000} cy={260} rot={-18} len={1500} w={330} seed={31} o={0.9} />
    <Astronomer x={760} y={925} t={t} s={1.45} dance={clamp(t / 6)} />
    <Sparkle x={1120} y={430} t={(t % 40) - 4} s={1.4} />
    <Sparkle x={560} y={380} t={((t + 20) % 40) - 4} s={1.1} />
  </g>
);

// ---------- C6: the dark beach: Pip in shades flings the sunscreen aside (on "No sunburns") ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const TOSS = 39;
  const keys = [
    { f: 0, p: { x: 800, y: 1010 - LEG_LEN * 1.5, scale: 1.5, yaw: 0.45, facing: 1 as const, look: 0.3, glasses: 1, expr: 'cool' as const, armR: { a: 36, b: 20 }, armL: { a: 10, b: -8 } } },
    { f: 30, p: { armR: { a: -30, b: 20 } }, ease: easeOut },
    { f: TOSS, p: { armR: { a: 118, b: 8 } }, ease: easeIn },
    { f: TOSS + 10, p: { armR: { a: 100, b: 6 } }, ease: easeOut },
  ];
  const pose = poseAt(t, keys);
  const hand = toWorld(pose, joints(pose).armR.end);
  const k = t - TOSS;
  const relPose = poseAt(TOSS, keys);
  const rel = toWorld(relPose, joints(relPose).armR.end);
  const ground = 1000;
  let bx = hand.x + 8;
  let by = hand.y - 6;
  let rot = -10;
  if (k >= 0) {
    const vx = 17;
    const vy = -24;
    const g = 1.5;
    const tFall = (-vy + Math.sqrt(vy * vy + 2 * g * (ground - rel.y))) / g;
    if (k < tFall) {
      bx = rel.x + vx * k;
      by = rel.y + vy * k + 0.5 * g * k * k;
      rot = -10 + k * 22;
    } else {
      const j = k - tFall;
      const bounce = Math.max(0, Math.sin(j * 0.5)) * 34 * Math.exp(-j / 6);
      bx = rel.x + vx * tFall + j * 3 * Math.exp(-j / 8);
      by = ground - bounce - 20;
      rot = -10 + tFall * 22 + 70 * (1 - Math.exp(-j / 4));
    }
  }
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1000]]), 560, kf(t, [[0, 1.05], [len, 1.0]]))}>
      <NightBeach t={t} id="c6" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'cool']]) }} rimId="rimBlue" shadow={0.6} />
      <Sunscreen x={bx} y={by} rot={rot} s={1.1} />
      <Sparkle x={bx + 10} y={by - 40} t={k - 36} s={1.2} />
    </g>
  );
};

// ---------- C7: "no sweaty summer afternoons": Pip stretches out, dry and happy; a sweat drop gets a "no" sign ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 800, y: 900 - LEG_LEN * 1.35, scale: 1.35, yaw: 0.5, look: 0.3, expr: 'happy', armR: { a: 168, b: 10 }, armL: { a: 20, b: -10 }, tilt: -3 } },
    { f: len, p: { tilt: -7, armR: { a: 150, b: 20 } }, ease: easeOut },
  ]);
  const pop = backOut(clamp((t - 6) / 7));
  const ring = clamp((t - 20) / 8);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Rooftop t={t + 140} sunGone={1} low={0} cityLit={2.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimBlue" shadow={0.7} />
      <g transform={`translate(1230 430) scale(${pop * 1.4})`}>
        <circle r={150} fill="#0A0E22" opacity={0.72} />
        <path d="M 0 -100 C 20 -50 80 0 70 40 C 62 84 -62 84 -70 40 C -80 0 -20 -50 0 -100 Z" fill="#7FC4FF" stroke="#EAF6FF" strokeWidth={7} strokeLinejoin="round" />
        <path d="M -34 10 Q -42 40 -22 58" stroke="#fff" strokeWidth={9} strokeLinecap="round" fill="none" opacity={0.6} />
        <circle r={118} fill="none" stroke="#FF5A4A" strokeWidth={16} strokeDasharray={`${742 * ring} 742`} transform="rotate(-90)" />
        <path d={`M -84 -84 L ${-84 + 168 * ring} ${-84 + 168 * ring}`} stroke="#FF5A4A" strokeWidth={16} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- C8: insert: Pip's hand holds a perfect ice-cream cone; it just sits there, glinting ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
    <StarSky t={t} id="c8sky" horizonY={820} n={90} seed={37} />
    <Foreground blur={10}>
      <NightCity t={t} y={800} />
    </Foreground>
    <Glow x={940} y={420} r={520} kind="cool" o={0.35} />
    <IceCreamCone x={930} y={560} s={4} rot={-4 + Math.sin(t / 14) * 1.2} id="c8ic" />
    <InsertArm x={925} y={720} fx={1160} fy={1300} rot={-6} s={4} width={110} fist />
    <Sparkle x={870} y={360} t={(t % 34) - 2} s={2} />
    <Sparkle x={1040} y={420} t={((t + 17) % 34) - 2} s={1.5} />
  </g>
);

// ---------- C9: "soon nothing will melt": the cone he holds out grows frost; he gulps ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 620, y: 1010 - LEG_LEN * 2.1, scale: 2.1, yaw: 0.45, look: 0.9, expr: 'worried', armR: { a: 82, b: 6 }, armL: { a: 14, b: -8 } } },
    { f: 22, p: { armR: { a: 86, b: 8 } }, ease: easeOut },
    { f: 32, p: { headTilt: -4, squash: 0.03 }, ease: easeOut },
    { f: 40, p: { headTilt: 0, squash: 0 }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const fr = clamp((t - 14) / 46);
  const cx = hand.x + 8;
  const cy = hand.y - 52;
  const S = 2.6;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 580, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <StarSky t={t} id="c9sky" horizonY={820} n={90} seed={47} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [28, 'shock'], [40, 'worried']]) }} rimId="rimBlue" shadow={0} />
      <IceCreamCone x={cx} y={cy} s={S} rot={4} id="c9ic" c1={mixHex('#F29CB8', '#C8D8F4', fr)} c2={mixHex('#F6E4B8', '#DCEBFF', fr)} />
      <g transform={`translate(${cx} ${cy}) rotate(4) scale(${S})`}>
        <circle cx={0} cy={-78} r={26} fill="#EAF6FF" opacity={0.3 * fr} />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = rnd(2, i) * Math.PI * 2;
          const rr = 6 + rnd(3, i) * 26;
          const px = Math.cos(a) * rr;
          const py = -70 + Math.sin(a) * rr * 1.1;
          const sz = (2 + rnd(4, i) * 4) * clamp(fr * 1.6 - rnd(5, i) * 0.6);
          return <path key={i} d={`M ${px - sz} ${py} L ${px + sz} ${py} M ${px} ${py - sz} L ${px} ${py + sz} M ${px - sz * 0.7} ${py - sz * 0.7} L ${px + sz * 0.7} ${py + sz * 0.7} M ${px + sz * 0.7} ${py - sz * 0.7} L ${px - sz * 0.7} ${py + sz * 0.7}`} stroke="#fff" strokeWidth={1.3} strokeLinecap="round" />;
        })}
        <path d="M -30 -38 L -30 -20 M -8 -36 L -8 -10 M 14 -38 L 14 -22 M 28 -36 L 28 -26" stroke="#EAF6FF" strokeWidth={5} strokeLinecap="round" opacity={fr} />
      </g>
    </g>
  );
};
