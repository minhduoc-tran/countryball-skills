import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, Glow, Dust, Tabletop, LightVeil, Kitchen,
  LEG_LEN, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BankPhone, RiceBowl, FishPlate, Chopsticks, Steam, DinnerScene, dinnerSeats } from './che-dinner-props';

// Chapter E, the heart: Pip comes home (E18), turns the phone face down (E19), the money still runs, ignored (E20),
// and the family dinner (E21 to E24): rice, fish, soup, a warm pendant, a sister telling her day, mum's chopsticks,
// everyone laughing. The ping look is OFF in all of these: the phone is face down.

const PIP = LOOKS.pipHood;
const WOOD = { wood: '#6B4B42', grain: '#5C4038', lip: '#7A5747', floor: '#2E2228', floorLines: '#22181D' };

// ---------- E18: the family door at night: warm light spilling out, Pip on the step, shoes lined up inside ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const ps = 1.6;
  const step = easeOut(clamp(t / 18));
  const pose = poseAt(t, [
    { f: 0, p: { x: 640, y: 880 - LEG_LEN * ps, scale: ps, yaw: 0.35, facing: 1, look: 0.3, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 22, p: { x: 780, headTilt: 3 }, ease: easeOut },
    { f: len, p: { x: 800 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-300} y={-200} width={2520} height={1500} fill="#1A1424" />
      <rect x={-300} y={-200} width={2520} height={1050} fill="#2A2034" />
      <rect x={-300} y={840} width={2520} height={500} fill="#241C28" />
      {/* the door open: a lit hall inside, a cone of warm light across the step */}
      <rect x={1000} y={140} width={520} height={700} fill="#3A2A30" />
      <rect x={1030} y={170} width={460} height={670} fill="#FFD9A0" />
      <rect x={1030} y={170} width={460} height={670} fill="#FF9A4A" opacity={0.25} />
      <path d="M 1100 260 Q 1260 220 1420 260 L 1420 560 L 1100 560 Z" fill="#FFF3DC" opacity={0.35} />
      {/* the hall inside: a framed photo, a coat on a hook, a plant, a doorway to the kitchen */}
      <rect x={1090} y={250} width={130} height={96} rx={4} fill="#8A5A3E" />
      <rect x={1102} y={262} width={106} height={72} fill="#F2D6B8" />
      <circle cx={1136} cy={292} r={12} fill="#C98A6A" /><circle cx={1170} cy={288} r={14} fill="#8A5A6A" /><circle cx={1196} cy={300} r={9} fill="#3E8C86" />
      <path d="M 1380 250 L 1380 300 M 1350 300 L 1410 300" stroke="#6B4B42" strokeWidth={8} strokeLinecap="round" />
      <path d="M 1350 300 Q 1330 400 1344 520 L 1416 520 Q 1430 400 1410 300 Z" fill="#8A5A6A" stroke="#5A3A46" strokeWidth={4} />
      <rect x={1240} y={420} width={90} height={340} fill="#FFE9C4" opacity={0.6} />
      <path d="M 1450 840 L 1450 760 Q 1420 720 1440 690 Q 1470 700 1460 760" fill="#5E8E48" />
      <circle cx={1176} cy={560} r={46} fill="#FFF3DC" opacity={0.3} />
      <rect x={1030} y={760} width={460} height={80} fill="#B8845A" />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={1110 + i * 90} cy={812} rx={34} ry={14} fill={['#D9534F', '#3E8C86', '#E9C46A'][i]} stroke="#14121C" strokeWidth={3} />)}
      <path d="M 1030 840 L 700 1100 L 1700 1100 L 1490 840 Z" fill="#FFB46A" opacity={0.2} />
      <rect x={1520} y={300} width={90} height={60} rx={8} fill="#14121C" />
      <text x={1565} y={340} textAnchor="middle" fontFamily="Space Mono, monospace" fontSize={30} fill="#FFB46A">12</text>
      <Glow x={1260} y={520} r={760} o={0.5} />
      <ellipse cx={pose.x} cy={886} rx={90} ry={13} fill="#000" opacity={0.4} />
      <Hero look={PIP} pose={{ ...pose, y: (pose.y as number) - 6 * (1 - step), ...faceAt(t, [[0, 'tired'], [26, 'neutral']]) }} rimId="rimL" shadow={0} />
      <Dust t={t} seed={18} x0={900} y0={200} w={700} h={600} n={26} o={0.5} />
    </g>
  );
};

// ---------- E19: insert, the phone still lit: his mitten lays it face down on the table, the glow goes out ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const flip = easeInOut(clamp((t - 14) / 14));
  const x = kf(t, [[0, 1100], [14, 960], [len, 960]]);
  const land = t > 28 ? Math.max(0, 1 - (t - 28) / 8) * 6 : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Tabletop edge={1500} {...WOOD} />
      <LightVeil id="e19veil" lights={[[960, 540, 640]]} o={0.55} />
      <Glow x={1500} y={150} r={560} o={0.35} />
      <BankPhone x={x} y={540 + land} w={290} rot={kf(t, [[0, -14], [28, 4], [len, 3]])} flip={flip} />
      <InsertArm x={kf(t, [[0, 1280], [14, 1140], [28, 1130], [38, 1500]])} y={kf(t, [[0, 700], [14, 700], [28, 700], [38, 880]])} fx={1900} fy={1300} rot={-30} s={5.2} width={126} />
    </g>
  );
};

// ---------- E20: insert, the phone face down, only a faint green edge pulsing each second; his hand takes the chopsticks ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = Math.max(0, 1 - (t % 30) / 14);
  const arm = { x: kf(t, [[0, 1700], [24, 1280], [len, 1230]]), y: kf(t, [[0, 900], [24, 640], [len, 630]]) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 560, kf(t, [[0, 1.05], [len, 1.0]]))}>
      <Tabletop edge={1500} {...WOOD} />
      <LightVeil id="e20veil" lights={[[1150, 500, 640]]} o={0.55} />
      <BankPhone x={560} y={600} w={170} rot={-6} flip={1} pulse={pulse} />
      <RiceBowl x={1180} y={760} s={1.9} t={t} />
      <Chopsticks x0={arm.x - 30} y0={arm.y - 20} x1={1120} y1={560} gap={16} />
      <InsertArm x={arm.x} y={arm.y} fx={1950} fy={1350} rot={-40} s={4.8} width={118} />
      <Glow x={1180} y={420} r={500} o={0.35} />
    </g>
  );
};

// ---------- E21: the kitchen wide: Pip, mum and the little sister at the island, a slow push-in, he stops counting ----------
export const E21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.0], [len, 1.45]]))}>
    <DinnerScene t={t} id="e21k" mode="eat" pipFaces={[[0, 'neutral'], [100, 'happy']]} />
  </g>
);

// ---------- E22: medium on the little sister, waving both arms to tell her day; mum laughs behind her ----------
export const E22: React.FC<ShotProps> = ({ t, len }) => {
  const s = dinnerSeats.sis;
  return (
    <g transform={camT(kf(t, [[0, s.x + 70], [len, s.x + 110]]), s.y - 90, kf(t, [[0, 2.5], [len, 2.8]]))}>
      <DinnerScene t={t + 40} id="e22k" mode="tell" />
    </g>
  );
};

// ---------- E23: insert from above: mum's chopsticks lay a piece of braised fish in Pip's bowl ----------
export const E23: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeInOut(clamp((t - 6) / 24));
  const fish = { x: kf(t, [[0, 1400], [6, 1400], [30, 800]]), y: kf(t, [[0, 520], [6, 520], [18, 380], [30, 560]]) };
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Tabletop edge={1500} {...WOOD} />
      <LightVeil id="e23veil" lights={[[1000, 520, 700]]} o={0.5} />
      <FishPlate x={1400} y={640} s={2.0} t={t} pieces={p > 0.2 ? 1 : 2} />
      <RiceBowl x={780} y={720} s={2.3} t={t} />
      {/* the piece of fish riding the chopsticks, then resting on the rice */}
      <g transform={`translate(${fish.x} ${fish.y}) rotate(${-12 + p * 12})`}>
        <path d="M -48 0 Q -44 -28 0 -30 Q 44 -28 50 0 Q 22 14 -48 0 Z" fill="#9A5A2E" stroke="#4A2412" strokeWidth={3} />
        <path d="M -32 -8 Q 0 -24 32 -8" stroke="#E0A060" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
      <Chopsticks x0={fish.x + 360} y0={fish.y - 330 + p * 40} x1={fish.x - 10} y1={fish.y - 22} gap={16} />
      <InsertArm x={fish.x + 380} y={fish.y - 340 + p * 40} fx={1960} fy={-300} rot={150} s={4.6} width={116} />
      <Steam x={780} y={560} t={t} n={3} s={1.6} o={0.35} />
      <Glow x={900} y={420} r={520} o={0.35} />
    </g>
  );
};

// ---------- E24: the wide again, slower and warmer, everyone laughing, a long push-in: the best meal of the month ----------
export const E24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.3], [len, 1.8]]))}>
    <DinnerScene t={t + 200} id="e24k" mode="laugh" />
  </g>
);

// ---------- E25: Pip leans in toward us with a smug smile and points at the lens (the ping is back for a wink) ----------
export const E25: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.6;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 960, y: 1010, scale: sc, yaw: 0.0, facing: 1, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: 0, look: 0 } },
    { f: 20, p: { armR: { a: 118, b: -6 }, headTilt: -4, tilt: -3 }, ease: easeOut },
    { f: len, p: { headTilt: 3 } },
  ]);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -200) scale(1.4)">
          <Kitchen t={t + 400} id="e25k" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0C0A12" opacity={0.2} />
      <Glow x={960} y={500} r={600} o={0.3} />
      <Hero look={PIP} pose={{ ...pose, handR: 'point', ...faceAt(t, [[0, 'neutral'], [18, 'smug']]), blink: t > 40 && t < 45 ? 1 : 0 }} rimId="rimR" shadow={0} />
    </g>
  );
};
