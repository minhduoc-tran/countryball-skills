import React from 'react';
import { Hero, Pose, basePose, faceAt, walkPose, kf, clamp, easeOut, camT, LOOKS, Glow, ShotProps, LEG_LEN } from '../../engine';
import { DawnStreet, Birds, QuestionCard } from './chf-dawn-props';

// CHAPTER F, the end card: "Vậy nếu bạn có cú đấm mạnh nhất thế giới, bạn sẽ đấm thứ gì đầu tiên? Viết ở phần bình luận
// nhé." F25 Pip alone, fist raised, glowing; F26 the first question pops; F27 the second line; F28 the two kids walk away
// to the left. Characters stay in the left half and the text in the top two thirds: the bottom-right third is empty
// for YouTube's end-screen elements, through the tail.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const G = 900;
const hip = (sc: number) => G - LEG_LEN * sc;

const pipPose = (x: number, extra: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: hip(0.95), scale: 0.95, yaw: 0.4, facing: 1, look: 0.3, sway: 5, ...extra });
const sisPose = (x: number, extra: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: hip(0.68), scale: 0.68, yaw: 0.4, facing: 1, look: 0.3, sway: 5, ...extra });

// ---------- F25: Pip raises his fist in the dawn light: the strongest punch in the world ----------
export const F25: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp((t - 14) / 26));
  const pose = pipPose(560, { armR: { a: 10 + 100 * up, b: 120 * up }, tilt: -3 * up });
  const fx = 560 + 70 * up, fy = 540 - 20 * up;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 800]]), 560, kf(t, [[0, 1.0], [len, 1.25]]))}>
      <DawnStreet t={t + 340} id="f25" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [20, 'neutral']]) }} rimId="rimR" shadow={0} />
      <Glow x={fx + 20} y={fy} r={240 * up} o={0.45} />
      <Birds t={t} n={4} seed={21} y0={120} />
    </g>
  );
};

const Kids: React.FC<{ t: number; x?: number }> = ({ t, x = 520 }) => (
  <g>
    <Hero look={SIS} pose={{ ...sisPose(x + 190), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
    <Hero look={PIP} pose={{ ...pipPose(x), armR: { a: 12, b: -6 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
  </g>
);

// ---------- F26: line 1: BẠN SẼ ĐẤM THỨ GÌ ĐẦU TIÊN? ----------
export const F26: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 800], [len, 830]]), 560, 1.1)}>
      <DawnStreet t={t + 400} id="f26" />
      <Kids t={t} />
      <Birds t={t} n={4} seed={23} y0={100} />
    </g>
    <QuestionCard t={t} line1At={3} line2At={9999} />
  </g>
);

// ---------- F27: line 2: Viết ở phần bình luận ----------
export const F27: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 830], [len, 860]]), 560, 1.1)}>
      <DawnStreet t={t + 470} id="f27" />
      <Kids t={t} />
      <Birds t={t} n={4} seed={25} y0={100} />
    </g>
    <QuestionCard t={t + 100} line1At={3} line2At={103} />
  </g>
);

// ---------- F28: the tail: the kids walk off to the left along the wet street, the question stays ----------
export const F28: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 520], [len, -260]], (v) => v);
  const ph = t * 0.3;
  const mk = (sc: number, xx: number): Pose => walkPose(xx, ph, G, sc, { yaw: -0.6, tilt: -3 }, -1);
  const fade = clamp((t - (len - 16)) / 16);
  return (
    <g>
      <g transform={camT(860, 560, 1.1)}>
        <DawnStreet t={t + 560} id="f28" />
        <Hero look={SIS} pose={{ ...mk(0.68, x + 190), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        <Hero look={PIP} pose={{ ...mk(0.95, x), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        <Birds t={t} n={4} seed={27} y0={100} />
      </g>
      <QuestionCard t={t + 200} line1At={3} line2At={103} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.7 * fade} />
    </g>
  );
};
