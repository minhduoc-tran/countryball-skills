import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, backOut, LOOKS, Glow, Sparkle, FONT, ShotProps,
} from '../../engine';
import { DawnAlley, DawnMotes, CART } from '../tien-vo-han/che-dawn-alley-backdrop';
import { XoiCart } from '../tien-vo-han/che-xoi-cart-and-money-props';
import { GoldFloor } from './che-ending-balance-props';

// Chapter E, "question" (225.1-231.1 s): the end card over the dawn alley. The family stands at the left by mum's cart
// on the golden floor; the title sits at the top; the bottom-right third stays empty for YouTube's end-screen elements.
//   E19 "ĐỦ LÀ BAO NHIÊU?" pops on "đủ"; E20 "Viết ở phần bình luận nhé" joins it; the picture fades to black at the end.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const MOM = LOOKS.mom;
const { x: CX, y: CY, s: CS } = CART;
const E19_LEN = 58; // frames: 225.11 -> 227.05 s, so E20's clock continues E19's

/** The alley, mum at her cart, Pip and sis hand in hand beside it, the golden floor under all three. */
const EndWorld: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const sway = Math.sin(t / 14);
  const mum: Pose = { ...basePose, x: CX + 60 * CS, y: CY - 140 * CS, scale: CS, yaw: 0.45, facing: 1, headTilt: 3, armL: { a: 14, b: -6 }, armR: { a: 40 + 10 * Math.sin(t / 6), b: 36 } };
  const gy = CY;
  const pip: Pose = { ...basePose, x: CX + 330 * CS, y: gy - 255 * CS, scale: CS * 1.0, yaw: 0.45, facing: 1, headTilt: 3 * sway, armL: { a: 12, b: -6 }, armR: { a: 30, b: 10 } };
  const sis: Pose = { ...basePose, x: CX + 430 * CS, y: gy - 255 * CS * 0.72 - 0, scale: CS * 0.72, yaw: 0.45, facing: 1, headTilt: -3 * sway, sway: 4, armL: { a: 30, b: 10 }, armR: { a: 12, b: -6 } };
  return (
    <g>
      <DawnAlley t={t + 110} id={id} />
      <GoldFloor x0={CX - 260 * CS} x1={CX + 560 * CS} y={gy + 6} t={t} thick={7} />
      <Hero look={MOM} pose={{ ...mum, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <XoiCart x={CX} y={CY} s={CS} t={t} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Glow x={CX + 380 * CS} y={CY - 300 * CS} r={420} o={0.35} />
      <Sparkle x={CX + 330 * CS} y={CY - 560 * CS} t={t % 90 - 8} s={0.9} />
      <DawnMotes t={t} seed={30} />
    </g>
  );
};

/** The two end-card lines at the top: line 1 pops at t1, line 2 (a small mono pill) at t2 (null = not yet). */
const CardText: React.FC<{ t: number; t1: number; t2: number | null }> = ({ t, t1, t2 }) => {
  const p1 = backOut(clamp((t - t1) / 9));
  const p2 = t2 === null ? 0 : backOut(clamp((t - t2) / 9));
  return (
    <g>
      <g transform={`translate(960 170) scale(${p1})`} opacity={p1 > 0 ? 1 : 0}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={128} letterSpacing={2} fill="#FFE27A" stroke="#241236" strokeWidth={20} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 26px rgba(255,200,90,0.5))' }}>ĐỦ LÀ BAO NHIÊU?</text>
      </g>
      {p2 > 0 ? (
        <g transform={`translate(960 266) scale(${p2})`}>
          <rect x={-310} y={-42} width={620} height={76} rx={38} fill="#2A1830" opacity={0.82} />
          <rect x={-310} y={-42} width={620} height={76} rx={38} fill="none" stroke="#F6EFE3" strokeWidth={3} opacity={0.8} />
          <text y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#F6EFE3">Viết ở phần bình luận nhé</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- E19: wide: the family at the cart on the golden floor, the question pops on "đủ" ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, CX + 470 * CS], [len, CX + 500 * CS]]), CY - 300 * CS, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <EndWorld t={t} id="e19st" />
    </g>
    <CardText t={t} t1={19} t2={null} />
  </g>
);

// ---------- E20: the same card, "Viết ở phần bình luận nhé" joins; it holds, then a slow fade to black ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => {
  const T = t + E19_LEN;
  const fade = easeOut(clamp((t - (len - 26)) / 24));
  return (
    <g>
      <g transform={camT(kf(T, [[0, CX + 470 * CS], [E19_LEN + len, CX + 540 * CS]]), CY - 300 * CS, kf(T, [[0, 2.0], [E19_LEN + len, 2.2]]))}>
        <EndWorld t={T} id="e20st" />
      </g>
      <CardText t={T} t1={19} t2={E19_LEN + 4} />
      <rect x={-10} y={-10} width={1940} height={1100} fill="#000" opacity={fade} />
    </g>
  );
};
