import React from 'react';
import { Hero, Street, Foreground, Glow, Dust, poseAt, faceAt, kf, clamp, easeOut, easeIn, settle, camT, LOOKS, ShotProps } from '../../engine';
import { LookArm } from '../khong-ai-ngheo/chb-cards-and-marks';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { ShopFront, ClosedNote, DrinkCrate, BigPot, WarmCounter, OWNER, PASSER } from './chb-shop-props';

// Chapter B, "day one: shops" (B11-B16): the alley at dawn with nothing open (B11), the convenience store's shutter
// slams down (B12), the owner peeks through the gap while a hand takes a drink (B13), the market is empty (B14), mum
// hesitates at her xôi cart (B15), her hands guard the pot (B16).

const MOM = LOOKS.mom;
const { x: CX, y: CY, s: CS } = CART;

// ---------- B11: wide: the alley at dawn, shutters down, nobody about ----------
export const B11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 600], [len, 570]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
    <DawnAlley t={t + 60} id="sb11" cart />
    <DawnMotes t={t} seed={11} />
  </g>
);

// ---------- B12: the convenience store: the shutter slams down, a note swings on it ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => {
  const down = kf(t, [[0, 0.62], [9, 1]], easeIn);
  const rattle = settle(t - 9, 7, 1.7, 5);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), kf(t, [[0, 500], [len, 540]]), kf(t, [[0, 0.95], [len, 1.2]]))}>
      <ShopFront t={t} down={down} />
      <g transform={`translate(0 ${rattle})`}>
        <ClosedNote x={1130} y={460 + rattle} t={t} s={1.5} />
      </g>
      <Glow x={300} y={420} r={600} o={0.3} />
      <Dust t={t} seed={12} x0={300} y0={300} w={1000} h={600} n={18} o={0.4} />
    </g>
  );
};

// ---------- B13: close: the owner peeks through the gap under the shutter; a hand takes a bottle ----------
const GAP = 190;
export const B13: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp((t - 30) / 12));
  const back = easeOut(clamp((t - 48) / 14));
  const handX = 1500 - 360 * reach + 320 * back;
  const grabbed = t >= 44;
  const owner = poseAt(t, [
    { f: 0, p: { x: 790, y: 1028, scale: 1.05, yaw: 0.35, facing: 1, look: -0.7, headTilt: -4 } },
    { f: 14, p: { look: 0.2, headTilt: 3 } },
    { f: 28, p: { look: 0.9, headTilt: 6 } },
    { f: 46, p: { look: 0.9, headTilt: 10 } },
  ]);
  const gapTop = 354 + (570 - GAP);
  return (
    <g transform={camT(1010, kf(t, [[0, 810], [len, 790]]), kf(t, [[0, 2.7], [len, 3.1]]))}>
      <ShopFront t={t} down={1} gap={GAP} />
      <clipPath id="sb13gap"><rect x={300} y={gapTop} width={1160} height={900 - gapTop} /></clipPath>
      <g clipPath="url(#sb13gap)">
        <Hero look={OWNER} pose={{ ...owner, ...faceAt(t, [[0, 'worried'], [46, 'shock']]) }} rimId="rimR" shadow={0} />
      </g>
      <DrinkCrate x={1120} y={904} s={1.15} taken={grabbed ? 2 : -1} />
      <LookArm look={PASSER} x={handX} y={850} fx={handX + 520} fy={960} rot={-72} s={1.5} width={44} fist={reach > 0.9 && back < 0.5} />
      {grabbed && back < 1 ? (
        <g transform={`translate(${handX - 10} ${830})`}>
          <rect x={-14} y={-30} width={28} height={80} rx={9} fill="#7A5A8A" stroke="#12101C" strokeWidth={3} />
        </g>
      ) : null}
      <Glow x={1300} y={700} r={420} o={0.25} />
    </g>
  );
};

// ---------- B14: the market with its stalls set up and nobody there; a plastic bag blows along the road ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[0, 300], [len, 1500]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 820]]), 660, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <Street t={t + 100} id="sb14" market={1} veil={0.3} />
      <g transform={`translate(${bx} ${790 + Math.sin(t / 3) * 14}) rotate(${t * 9}) scale(1.6)`} opacity={0.95}>
        <path d="M -22 -14 Q 0 -30 24 -12 Q 34 6 12 20 Q -10 28 -24 10 Z" fill="#F4F1EA" stroke="#B9B4C4" strokeWidth={3} />
        <path d="M 20 -12 Q 44 -22 52 -6 Q 40 -6 26 4 Z" fill="#F4F1EA" stroke="#B9B4C4" strokeWidth={3} strokeLinejoin="round" />
      </g>
      <Foreground blur={10}>
        <rect x={-300} y={1000} width={1000} height={200} fill="#14101C" opacity={0.7} />
      </Foreground>
    </g>
  );
};

// ---------- B15: mum beside her xôi cart, a hand reaching for the handle, pulling back, glancing at the street ----------
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const S = CS;
  const mum = poseAt(t, [
    { f: 0, p: { x: CX + 250 * S, y: CY - 140 * S, scale: S, yaw: -0.45, facing: -1, look: -0.4, armL: { a: 14, b: -6 }, armR: { a: 10, b: -8 } } },
    { f: 14, p: { armL: { a: 72, b: 10 } }, ease: easeOut },
    { f: 26, p: { armL: { a: 76, b: 14 } } },
    { f: 38, p: { armL: { a: 40, b: 100 }, armR: { a: 36, b: 104 }, yaw: 0.45, facing: 1, look: 0.8, headTilt: 5 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, CX + 130 * S], [len, CX + 160 * S]]), CY - 230 * S, kf(t, [[0, 3.6], [len, 4.1]]))}>
      <DawnAlley t={t + 40} id="sb15" cart />
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'worried'], [38, 'oops']]) }} rimId="rimR" shadow={0} />
      <DawnMotes t={t} seed={15} />
    </g>
  );
};

// ---------- B16: insert: mum's two hands close round the pot of xôi and pull it in ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 22));
  const pull = easeOut(clamp((t - 30) / 30));
  const ps = 2.1 + 0.25 * pull;
  const py = 900 + 40 * pull;
  const hx = 800 - 140 * k + 20 * pull;
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 600]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <WarmCounter t={t} />
      <BigPot x={960} y={py} s={ps} t={t} />
      <LookArm look={MOM} x={hx + 40} y={py - 220} fx={-200} fy={1250} rot={20} s={4.4} width={100} fist />
      <LookArm look={MOM} x={1920 - hx - 40} y={py - 220} fx={2120} fy={1250} rot={-20} s={4.4} width={100} fist />
      <Glow x={960} y={py - 300} r={520} o={0.3} />
    </g>
  );
};
