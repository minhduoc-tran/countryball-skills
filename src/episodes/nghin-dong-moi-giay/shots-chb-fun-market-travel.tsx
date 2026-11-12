import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, walkPose, kf, clamp, easeOut, backOut, camT, LOOKS, LEG_LEN, joints, toWorld, basePose,
  Supermarket, aisleStand, ShoppingCart, SnackBag, SodaCan, CanFood, GiftBox, Foreground, Sparkle, Tag, FONT, ShotProps, rnd,
} from '../../engine';
import { Zzz } from '../last-one/shots-chb-local-props-rooftop-and-night';
import { Backdrop } from './chb-park-and-face-props';
import { ClockIcon } from './chb-math-icons';
import { BeachDusk, PlaneWindow, HotelRoom, BedDuvet, BED, Ticket } from './chb-travel-scenery-props';

// Chapter B, the fun part (2/2): the supermarket (two carts, no looking at prices), then the weekend trip: a plane window,
// the beach at dusk, the boarding pass, the sea-view hotel and the big bed. The ping look is ON. Pure functions of t.

const PIP = LOOKS.pipHood;

/** Goods heaped in a cart, popping in one by one from `t0` (`n` of them, a frame apart `gap`); overflowing above the rim. */
const GOODS: ((s: number) => React.ReactNode)[] = [
  (s) => <SnackBag x={0} y={0} s={0.9 * s} color="#F6B93B" accent="#D94452" rot={-12} />,
  (s) => <SodaCan x={0} y={0} s={0.95 * s} color="#2F8FD4" accent="#F6F1E3" />,
  (s) => <GiftBox x={-22 * s} y={-40 * s} w={44 * s} h={40 * s} c1="#D94452" c2="#F6D04D" />,
  (s) => <CanFood x={0} y={0} s={1.2 * s} label="#D94452" pic="#58B368" />,
  (s) => <SnackBag x={0} y={0} s={0.85 * s} color="#58B368" accent="#F6F1E3" rot={10} />,
  (s) => <SodaCan x={0} y={0} s={0.95 * s} color="#D94452" accent="#F6F1E3" rot={-8} />,
];
const Cart: React.FC<{ x: number; y: number; s: number; t: number; t0: number; gap: number; n?: number }> = ({ x, y, s, t, t0, gap, n = 10 }) => (
  <ShoppingCart x={x} y={y} s={s}>
    {Array.from({ length: n }).map((_, i) => {
      const at = t0 + i * gap;
      if (t < at) return null;
      const row = Math.floor(i / 4);
      return (
        <g key={i} transform={`translate(${-70 + (i % 4) * 36 + rnd(2, i) * 10} ${-104 - row * 40 - (i % 2) * 6}) scale(${backOut(clamp((t - at) / 6))})`}>{GOODS[i % GOODS.length](1)}</g>
      );
    })}
  </ShoppingCart>
);

// ---------- B25: wide, the supermarket: Pip strides in pushing TWO carts at once, goods piling up above the rims ----------
export const B25: React.FC<ShotProps> = ({ t, len }) => {
  const A = aisleStand(0.5, 0.62);
  const x = A.x - 260 + 520 * easeOut(clamp(t / len));
  const gy = A.y + LEG_LEN * A.scale;
  const pose = walkPose(x, t * 0.5, gy, A.scale, { yaw: 0.6, armL: { a: 72, b: 8 }, armR: { a: 78, b: 6 }, look: 0.3, tilt: 3 });
  const cs = A.scale * 1.15;
  return (
    <g transform={camT(kf(t, [[0, A.x - 40], [len, A.x + 280]]), 640, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Supermarket t={t + 10} id="b25" cart={false} />
      <Cart x={x + 330 * cs + 40} y={gy - 40 * cs} s={cs * 0.92} t={t} t0={8} gap={4} n={8} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Cart x={x + 235 * cs} y={gy + 6} s={cs} t={t} t0={4} gap={4} n={10} />
    </g>
  );
};

// ---------- B26: medium: eyes shut, shades on, he strides past the shelves; price tags whip by in the blurred foreground ----------
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const A = aisleStand(0.5, 0.66);
  const gy = A.y + LEG_LEN * A.scale;
  const x = A.x - 160 + 340 * (t / len);
  const pose = walkPose(x, t * 0.5, gy, A.scale, { yaw: 0.6, armL: { a: 72, b: 8 }, armR: { a: 78, b: 6 }, look: 0.2, tilt: -2, headTilt: -6, glasses: 1 });
  const cs = A.scale * 1.15;
  return (
    <g transform={camT(x + 140, 620, 1.75)}>
      <Supermarket t={t + 50} id="b26" cart={false} veil={0.4} />
      <Cart x={x + 330 * cs + 40} y={gy - 40 * cs} s={cs * 0.92} t={t} t0={-100} gap={1} n={8} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]), blink: 1 }} rimId="rimR" shadow={0} />
      <Cart x={x + 235 * cs} y={gy + 6} s={cs} t={t} t0={-100} gap={1} n={10} />
      <Foreground blur={6}>
        <g transform={`translate(${-((t * 26) % 700)} 0)`}>
          <rect x={-400} y={930} width={4000} height={170} fill="#1A1230" opacity={0.85} />
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i} transform={`translate(${i * 350} 960)`}>
              <rect width={250} height={110} rx={10} fill={i % 2 ? '#F6E27A' : '#F2F2F2'} />
              <text x={125} y={80} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#C0392B">{['99.000', '249.000', '59.000', '1.290.000', '35.000'][i % 5]}</text>
            </g>
          ))}
        </g>
      </Foreground>
    </g>
  );
};

// ---------- B27: medium: an airliner window at dusk, clouds streaming by, Pip's face lit by it ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 760, y: 740, scale: 1.3, yaw: 1, look: 1, headTilt: -2, armL: { a: 14, b: 30 }, armR: { a: 20, b: 40 } } },
    { f: 20, p: { headTilt: 2 } },
  ]);
  const vib = Math.sin(t * 1.9) * 1.2;
  return (
    <g transform={camT(kf(t, [[0, 920], [len, 960]]), 520, kf(t, [[0, 1.35], [len, 1.5]]))}>
      <g transform={`translate(0 ${vib})`}>
        <PlaneWindow id="b27" t={t} cx={1160} cy={470} />
        <rect x={430} y={220} width={400} height={900} rx={120} fill="#3A4A6A" stroke="#1E2840" strokeWidth={6} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      </g>
    </g>
  );
};

// ---------- B28: wide: the beach at dusk, Pip on the sand with his arms spread wide to the sea; the breeze in his hood ----------
export const B28: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 790, scale: 1.0, yaw: 0.35, look: 0.5, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 10, p: { armL: { a: 112, b: 8 }, armR: { a: 112, b: 8 }, headTilt: -6, squash: -0.05 }, ease: easeOut },
    { f: 22, p: { squash: 0, headTilt: -3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <BeachDusk id="b28" t={t} />
      <Hero look={PIP} pose={{ ...pose, sway: 1, ...faceAt(t, [[0, 'neutral'], [8, 'happy']]) }} rimId="rimL" shadow={0} />
      <Sparkle x={1000} y={560} t={t - 14} s={1.0} />
    </g>
  );
};

// ---------- B29: insert: the boarding pass slides in, "2.000.000 đ", then the tag with its clock: = 33 PHÚT ----------
export const B29: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 12));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Backdrop id="b29" t={t} top="#2A3A6A" bottom="#C0707A" />
      <g transform={`translate(${960 + (1 - k) * 900} ${470 + Math.sin(t / 14) * 8}) rotate(${-5 + (1 - k) * 12})`}><Ticket t={t} /></g>
      <Tag x={960} y={860} t={t - 36} text="2.000.000 đ = 33 PHÚT" w={1120} />
      <g transform="translate(250 860)" opacity={clamp((t - 38) / 4)}><ClockIcon x={0} y={0} r={62} t={t - 38} turns={0.55} dur={30} color="#FFE9D0" /></g>
      <Sparkle x={1500} y={280} t={t - 40} s={1.1} />
    </g>
  );
};

// ---------- B30: wide: the hotel room: the sea through the window, the big bed, Pip steps in with his arms out ----------
export const B30: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / len);
  const pose = walkPose(1180 - 160 * k, t * 0.4, 840, 1.05, { yaw: -0.6, armL: { a: 74, b: 6 }, armR: { a: 74, b: 6 }, look: -0.2 }, -1);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 900]]), 560, kf(t, [[0, 1.0], [len, 1.15]]))}>
      <HotelRoom id="b30" t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- B31: medium: Pip asleep in the big bed, the duvet breathing, "z z z", the sea at the window ----------
export const B31: React.FC<ShotProps> = ({ t, len }) => {
  const lineY = BED.top - 6; // the body's long axis sits on the mattress
  const sc = 1.0;
  const pose: Pose = {
    ...basePose, x: 410, y: lineY + 90 * sc + Math.sin(t / 12) * 1.5, scale: sc, facing: 1, yaw: 0.2, spin: -90, headTilt: -50,
    armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 }, expr: 'neutral', blink: 1,
  };
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 760]]), 640, kf(t, [[0, 1.55], [len, 1.7]]))}>
      <HotelRoom id="b31" t={t} lamp={0.5} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <BedDuvet x0={430} t={t} />
      <Zzz x={250} y={430} t={t} size={60} />
    </g>
  );
};
