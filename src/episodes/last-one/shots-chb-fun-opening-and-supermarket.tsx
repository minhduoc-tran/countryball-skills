import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, settle, camT, LOOKS, LEG_LEN, joints, toWorld, walkPose, rnd,
  Bedroom, BedDuvet, bedSit, Supermarket, SUPERMARKET, aisleStand, cartAt, ShoppingCart, IceCreamCone, SodaCan, SnackBag,
  MacroRow, macroRow, Foreground, Glow, LightVeil, Dust, Sparkle, PasteIn, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { HallDoor, CheckoutLane, Burst, popScale } from './shots-chb-local-props';

// Chapter B, the fun part (1/4): day one is frightening, day two is fun (the front door, the shades), then the
// supermarket is his: walking in with arms wide, the cart filling, the empty checkout, three fast bites and eating
// straight off the shelf. Each shot is a pure function of its own clock t.

const PIP = LOOKS.pipHood;

// ---------- B1: medium, the night bedroom: day one, Pip sits up in bed hugging his knees, the lamp on ----------
const BS = bedSit(0.22);
export const B1: React.FC<ShotProps> = ({ t, len }) => {
  const breathe = Math.sin(t / 8) * 1.6;
  const pose = poseAt(t, [
    { f: 0, p: { x: BS.x, y: BS.y, scale: BS.scale, facing: 1, yaw: -0.15, look: 0.3, tilt: 2, headTilt: 7, legL: { a: 104, b: -118 }, legR: { a: 100, b: -112 }, armL: { a: 26, b: -84 }, armR: { a: 22, b: -88 } } },
    { f: 20, p: { look: -0.5, headTilt: 9 } },
    { f: 40, p: { look: 0.5, headTilt: 5 } },
  ]);
  const face = faceAt(t, [[0, 'worried']]);
  const blink = Math.max(face.blink, t % 46 > 43 ? 1 : 0);
  return (
    <g transform={camT(kf(t, [[0, 830], [len, 800]]), 570, kf(t, [[0, 2.1], [len, 2.35]]))}>
      <Bedroom t={t + 20} id="b1" duvet={false} crossed={0} clock="02:14" />
      <Hero look={PIP} pose={{ ...pose, y: pose.y + breathe, ...face, blink }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
    </g>
  );
};

// ---------- B2: medium to close, the front door: day two, he steps out and slides the shades on ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 42) / 10));
  const pose = poseAt(t, [
    { f: 0, p: { x: 850, y: 640, scale: 1.25, yaw: 0.6, look: 0.8, armL: { a: 12, b: -8 }, armR: { a: 14, b: -6 }, headTilt: 3, squash: 0.04 } },
    { f: 8, p: { x: 870, armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, headTilt: -6, squash: -0.05 }, ease: easeOut },
    { f: 22, p: { x: 890, armL: { a: 140, b: 14 }, armR: { a: 140, b: 14 }, headTilt: -8, squash: -0.03 } },
    { f: 30, p: { x: 900, armL: { a: 12, b: -8 }, armR: { a: 14, b: -6 }, headTilt: -2, squash: 0.03 } },
    { f: 44, p: { headTilt: -7, armR: { a: 26, b: 40 }, squash: 0 } },
    { f: 54, p: { headTilt: -2, armR: { a: 14, b: -4 } } },
  ]);
  const zoom = kf(t, [[0, 1.45], [len, 2.15]]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 600], [len, 480]]), zoom)}>
      <HallDoor id="b2" t={t} />
      <Hero look={PIP} pose={{ ...pose, glasses: g, ...faceAt(t, [[0, 'tired'], [8, 'happy'], [32, 'neutral'], [38, 'happy'], [52, 'smug']]) }} rimId="rimR" shadow={0} />
      <Sparkle x={952} y={408} t={t - 52} s={0.8} />
    </g>
  );
};

// ---------- B3: wide, the supermarket: he walks in from the doors with his arms wide ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / len));
  const A = aisleStand(0.5 - 0.04 * k, 0.1 + 0.5 * k);
  const pose = walkPose(A.x, t * 0.55, A.y + LEG_LEN * A.scale, A.scale, { yaw: 0.35, tilt: -3, armL: { a: 78, b: -4 }, armR: { a: 78, b: -4 }, look: 0.2, headTilt: -2 });
  return (
    <g transform={camT(960, kf(t, [[0, 545], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Supermarket t={t + 10} id="b3" cart={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B4: medium, the cart: Pip tosses things from the shelf and each pops into the basket ----------
const B4_CART = cartAt(0.54, 0.74);
const B4_ITEMS: { at: number; x: number; y: number; el: (s: number) => React.ReactNode }[] = [
  { at: 3, x: -40, y: -98, el: (s) => <SnackBag x={0} y={0} s={0.9 * s} color="#F6B93B" accent="#D94452" rot={-12} /> },
  { at: 10, x: 6, y: -96, el: (s) => <SodaCan x={0} y={0} s={0.95 * s} color="#2F8FD4" accent="#F6F1E3" /> },
  { at: 17, x: -62, y: -92, el: (s) => <SnackBag x={0} y={0} s={0.85 * s} color="#58B368" accent="#F6F1E3" rot={10} /> },
  { at: 24, x: -14, y: -108, el: (s) => <SodaCan x={0} y={0} s={0.95 * s} color="#D94452" accent="#F6F1E3" rot={-8} /> },
  { at: 31, x: 20, y: -104, el: (s) => <SnackBag x={0} y={0} s={0.85 * s} color="#8E6AD8" accent="#F6D04D" rot={6} /> },
];
export const B4: React.FC<ShotProps> = ({ t, len }) => {
  const A = aisleStand(0.3, 0.74);
  const toss = B4_ITEMS.reduce((m, it) => Math.max(m, 1 - Math.abs(t - (it.at - 2)) / 3), 0);
  const pose = poseAt(t, [
    { f: 0, p: { x: A.x, y: A.y, scale: A.scale, yaw: 0.55, look: 0.7, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 915]]), 640, kf(t, [[0, 1.75], [len, 1.9]]))}>
      <Supermarket t={t + 40} id="b4" cart={false} veil={0.4} />
      <Hero look={PIP} pose={{ ...pose, armR: { a: 20 + 105 * toss, b: -10 + 20 * toss }, armL: { a: 14, b: -6 }, tilt: 4 * toss, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <ShoppingCart x={B4_CART.x} y={B4_CART.y} s={B4_CART.s}>
        {B4_ITEMS.map((it, i) => (t >= it.at ? (
          <g key={i} transform={`translate(${it.x} ${it.y}) scale(${popScale(t - it.at)})`}>{it.el(1)}</g>
        ) : null))}
      </ShoppingCart>
      <Sparkle x={B4_CART.x - 20} y={B4_CART.y - 190} t={t - 31} s={0.7} />
    </g>
  );
};

// ---------- B5: wide-ish, the checkout: the lane stands empty, the light green, and Pip strolls straight past ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  const x = 280 + 1380 * k;
  const pose = walkPose(x, t * 0.42, 950, 1.25, { yaw: 0.8, armL: { a: 16, b: 8 }, armR: { a: 18, b: 10 }, look: 0.1 });
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur6)">
        <g transform="translate(-440 -120) scale(1.45)"><Supermarket t={t + 70} id="b5" cart={false} /></g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#07040C" opacity={0.22} />
      <CheckoutLane x={1310} y={880} s={1.25} t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.8} />
    </g>
  );
};

// ---------- B6: medium at the open freezer chest: an ice cream cone lifted out, first lick ----------
const B6_AT = aisleStand(0.5, 0.17);
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / 7));
  const pose = poseAt(t, [
    { f: 0, p: { x: B6_AT.x, y: B6_AT.y + 6, scale: B6_AT.scale, yaw: -0.55, look: -0.7, armL: { a: 20, b: 40 }, armR: { a: 10, b: -8 } } },
    { f: 7, p: { armL: { a: 74, b: 104 }, headTilt: -4, squash: -0.03 }, ease: easeOut },
    { f: 13, p: { armL: { a: 68, b: 110 }, squash: 0 } },
  ]);
  const hand = toWorld(pose, joints(pose).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 905], [len, 915]]), 505, kf(t, [[0, 2.7], [len, 2.9]]))}>
      <Supermarket t={t + 60} id="b6" cart={false} chestOpen={1} veil={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [5, 'happy']]) }} rimId="rimL" shadow={0} />
      <IceCreamCone x={hand.x - 6} y={hand.y - 34 + (1 - up) * 40} s={0.6 * B6_AT.scale / 0.74} rot={-10} bite={clamp((t - 9) / 6) * 0.5} id="b6c" />
      <Sparkle x={hand.x + 20} y={hand.y - 130} t={t - 6} s={0.8} />
    </g>
  );
};

// ---------- B7: macro insert: a bag of snacks torn open, crumbs flying ----------
const ROW_BG = macroRow(11, ['box', 'bag', 'carton', 'bag', 'jar'], -60, 2100, 210);
export const B7: React.FC<ShotProps> = ({ t, len }) => {
  const rip = clamp((t - 3) / 5);
  const shake = Math.sin(t * 1.9) * 5 * (1 - rip);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#262B39" />
      <g filter="url(#blur6)" opacity={0.8}><MacroRow slots={ROW_BG} y={700} h={330} lip /></g>
      <Glow x={1000} y={140} r={800} kind="cool" o={0.35} />
      <LightVeil id="b7veil" lights={[[960, 480, 700]]} o={0.5} />
      <g transform={`translate(${shake} 0)`}>
        <SnackBag x={900} y={880} s={5.6} color="#F6B93B" accent="#D94452" rot={-6 - 8 * rip} squeeze={rip * 2} />
        {/* the torn top: a jagged flap folded back */}
        <path d={`M 690 ${470 - 40 * rip} L 740 ${420 - 70 * rip} L 790 ${468 - 40 * rip} L 840 ${410 - 76 * rip} L 890 ${462 - 40 * rip} Z`} fill="#F6B93B" opacity={rip} />
      </g>
      <Burst x={900} y={430} k={t - 4} n={14} seed={8} color={['#F6D04D', '#E8A33A', '#FFF0B0']} speed={24} g={1.1} r={22} chip />
      <Burst x={900} y={430} k={t - 4} n={20} seed={18} color={['#F6D04D', '#E8A33A', '#FFF0B0']} speed={22} g={1.1} r={12} />
      <InsertArm x={kf(t, [[0, 1700], [4, 1180]])} y={kf(t, [[0, 760], [4, 600]])} fx={2200} fy={kf(t, [[0, 700], [4, 560]])} rot={70} s={4.6} fist />
      <Dust t={t} seed={5} x0={300} y0={100} w={1400} h={700} n={22} o={0.35} />
    </g>
  );
};

// ---------- B8: macro insert: a can of fizz, the tab pops, foam sprays ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const pop = clamp((t - 4) / 3);
  const spray = t - 5;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#242838" />
      <g filter="url(#blur6)" opacity={0.8}><MacroRow slots={macroRow(23, ['bottle', 'carton', 'bottle', 'jar', 'bottle'], -60, 2100, 200)} y={720} h={320} lip /></g>
      <Glow x={900} y={120} r={800} kind="cool" o={0.4} />
      <LightVeil id="b8veil" lights={[[940, 480, 700]]} o={0.5} />
      <g transform={`translate(${Math.sin(t * 2.4) * 4 * (1 - pop)} 0)`}>
        <SodaCan x={940} y={940} s={9.4} color="#D94452" accent="#F6F1E3" rot={-4} />
      </g>
      {/* foam rising from the opening */}
      <Burst x={950} y={300} k={spray} n={40} seed={12} color={['#F6F1E3', '#CFE6FF', '#FFFFFF']} speed={30} g={1.0} r={20} spread={0.7} />
      {spray > 0 ? <ellipse cx={950} cy={300 - 8 * Math.min(spray, 10)} rx={60 + 8 * Math.min(spray, 8)} ry={26} fill="#F6F1E3" opacity={0.85 * (1 - clamp(spray / 24))} /> : null}
      <InsertArm x={kf(t, [[0, 1500], [3, 1180]])} y={kf(t, [[0, 900], [3, 560]])} fx={2200} fy={1100} rot={50} s={4.4} fist />
      <Dust t={t} seed={9} x0={300} y0={100} w={1400} h={700} n={22} o={0.35} />
    </g>
  );
};

// ---------- B9: medium, eating straight off the shelf: chips poured into his mouth, the cart full beside him ----------
const B9_AT = aisleStand(0.3, 0.7);
const B9_CART = cartAt(0.62, 0.74);
export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const chew = Math.sin(t / 2.0) * 2.5;
  const pose = poseAt(t, [
    { f: 0, p: { x: B9_AT.x, y: B9_AT.y, scale: B9_AT.scale, yaw: -0.8, look: -0.4, armL: { a: 78, b: 100 }, armR: { a: 12, b: -8 }, headTilt: 8 } },
    { f: 14, p: { armL: { a: 84, b: 96 }, headTilt: 11 } },
    { f: 30, p: { armL: { a: 76, b: 102 }, headTilt: 8 } },
    { f: 46, p: { armL: { a: 82, b: 98 }, headTilt: 11 } },
  ]);
  const hand = toWorld(pose, joints(pose).armL.end);
  const mouth = toWorld(pose, { x: -26, y: -150 });
  const bag = { x: hand.x - 10, y: hand.y - 20 };
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 895]]), 600, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Supermarket t={t + 120} id="b9" cart={false} />
      <ShoppingCart x={B9_CART.x} y={B9_CART.y} s={B9_CART.s}>
        <SnackBag x={-48} y={-96} s={0.9} color="#F6B93B" accent="#D94452" rot={-10} />
        <SodaCan x={-4} y={-96} s={0.95} color="#2F8FD4" />
        <SnackBag x={30} y={-98} s={0.85} color="#58B368" accent="#F6F1E3" rot={9} />
      </ShoppingCart>
      <Hero look={PIP} pose={{ ...pose, headTilt: pose.headTilt + chew * 0.5, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <SnackBag x={bag.x} y={bag.y} s={0.55 * B9_AT.scale} color="#F6B93B" accent="#D94452" rot={200 + Math.sin(t / 6) * 5} squeeze={0.6} />
      {/* chips tumbling from the bag into his mouth, over and over */}
      {[0, 1, 2, 3].map((i) => {
        const k = ((t + i * 5) % 20) / 20;
        const px = bag.x + (mouth.x - bag.x) * k;
        const py = bag.y + 30 * B9_AT.scale + (mouth.y - bag.y - 30 * B9_AT.scale) * k * k;
        return <path key={i} d="M -1 -0.8 Q 0.4 -1.2 1 -0.3 Q 0.6 0.4 0.1 1 Q -0.9 0.5 -1 -0.8 Z" transform={`translate(${px} ${py}) rotate(${k * 300 + i * 70}) scale(${11 * B9_AT.scale})`} fill="#F6D04D" stroke="#B9782F" strokeWidth={0.12} opacity={k < 0.95 ? 1 : 0} />;
      })}
      <Burst x={mouth.x - 20} y={mouth.y + 40} k={t % 16} n={5} seed={4} color="#F6D04D" speed={3} g={0.4} r={4} />
    </g>
  );
};
