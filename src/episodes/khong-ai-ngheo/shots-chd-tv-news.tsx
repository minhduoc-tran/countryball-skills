import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, camT, faceAt, LOOKS, HEAD, Kitchen, KitchenIsland, KITCHEN, stand, Glow, LEG_LEN, ShotProps,
} from '../../engine';
import { TvSet, QuestionMark } from './chd-tv-news-props';

// Chapter D, beat "5 relative" opening (D17-D21): one evening in the kitchen the family watches the news. The TV
// switches on (D17-D18), the banner "CHÂU ÂU: HÀNG TRIỆU NGƯỜI CÓ NGUY CƠ NGHÈO" types itself (D19), the family
// listens (D20), Pip is puzzled: "Sao lại thế?" (D21).

const PIP = LOOKS.pipHood;
const PIP_AT = stand(KITCHEN, 0.45, 0.4);
const MOM_AT = stand(KITCHEN, 0.57, 0.4);
const SIS_SC = 0.72;
const SIS_AT = (() => {
  const a = stand(KITCHEN, 0.68, 0.4);
  const ground = a.y + LEG_LEN * a.scale;
  return { x: a.x, scale: a.scale * SIS_SC, y: ground - LEG_LEN * a.scale * SIS_SC };
})();
const TV_X = 300;
const TV_Y = 800;
const TV_W = 330;

const Evening: React.FC<{ t: number; id: string; glow?: number }> = ({ t, id, glow = 0.5 }) => (
  <g>
    <Kitchen t={t + 60} id={id} veil={0.5} />
    <rect x={-400} y={-300} width={2720} height={1700} fill="#0A0C24" opacity={0.34} />
    <Glow x={TV_X + 120} y={TV_Y - 200} r={760} kind="cool" o={glow * (0.85 + 0.15 * Math.sin(t * 0.9))} />
  </g>
);

/** The three of them at the island, looking at the TV on the left (yaw < 0). `look` is how far they lean in. */
const Family: React.FC<{ t: number; lean?: number; faces?: [number, 'neutral' | 'worried' | 'shock' | 'happy'][] }> = ({ t, lean = 0, faces = [[0, 'neutral']] }) => {
  const breathe = Math.sin(t / 9) * 1.2;
  const mk = (at: { x: number; y: number; scale: number }, yaw: number, extra: Partial<Pose> = {}): Pose => ({
    ...basePose, ...at, y: at.y + breathe * 0.4, yaw, look: -0.6, tilt: -lean * 4, headTilt: -lean * 3, armL: { a: 10, b: 8 }, armR: { a: 12, b: 8 }, ...extra,
  });
  return (
    <g>
      <Hero look={PIP} pose={{ ...mk(PIP_AT, -0.55), ...faceAt(t, faces) }} rimId="rimBlueL" shadow={0.4} />
      <Hero look={LOOKS.mom} pose={{ ...mk(MOM_AT, -0.5, { headTilt: 3 }), ...faceAt(t, [[0, 'neutral'], [faces.length > 1 ? 30 : 9999, 'worried']]) }} rimId="rimBlueL" shadow={0.4} />
      <Hero look={LOOKS.sis} pose={{ ...mk(SIS_AT, -0.45), ...faceAt(t, [[0, 'neutral']]) }} rimId="rimBlueL" shadow={0.4} />
      <KitchenIsland />
    </g>
  );
};

// ---------- D17: wide: the family at the island one evening; the TV is off, then lights up ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => {
  const on = clamp((t - 21) / 6);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), 560, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Evening t={t} id="d17k" glow={on * 0.9} />
      <TvSet x={TV_X} y={TV_Y} w={TV_W} t={t} on={on} id="d17tv" off={on <= 0} />
      <Family t={t} />
    </g>
  );
};

// ---------- D18: the TV close: the picture opens from a white line, the studio and the anchor ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#171526" />
    <rect x={-400} y={820} width={2720} height={600} fill="#2A2030" />
    <Glow x={960} y={520} r={1100} kind="cool" o={0.45} />
    <TvSet x={960} y={1020} w={1100} t={t} on={t / 9} id="d18tv" />
  </g>
);

// ---------- D19: push in on the banner: it types "CHÂU ÂU: HÀNG TRIỆU NGƯỜI CÓ NGUY CƠ NGHÈO" ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 960]]), kf(t, [[0, 540], [len, 610]]), kf(t, [[0, 1.2], [len, 1.55]]))}>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#171526" />
    <Glow x={960} y={520} r={1100} kind="cool" o={0.45} />
    <TvSet x={960} y={1020} w={1100} t={t + 30} on={1} type={t * 1.0} id="d19tv" />
  </g>
);

// ---------- D20: the family in the TV light: Mum's smile fades, Pip leans in ----------
export const D20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 880]]), 540, kf(t, [[0, 1.25], [len, 1.45]]))}>
    <Evening t={t + 20} id="d20k" glow={0.9} />
    <TvSet x={TV_X} y={TV_Y} w={TV_W} t={t + 60} on={1} type={99} id="d20tv" />
    <Family t={t} lean={easeOut(clamp(t / 40))} faces={[[0, 'neutral'], [34, 'worried']]} />
  </g>
);

// ---------- D21: Pip close: "Sao lại thế?" a question mark pops, the TV light flickers on his face ----------
export const D21: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.3;
  const pose: Pose = {
    ...basePose, x: 900, y: 570 - HEAD.y * sc, scale: sc, yaw: -0.35, look: kf(t, [[0, -0.7], [12, -0.2], [22, -0.6]]),
    headTilt: kf(t, [[0, -2], [10, 6], [len, 8]]), expr: 'worried', blink: t > 17 && t < 20 ? 1 : 0, armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 },
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -260) scale(1.5)"><Kitchen t={t + 50} id="d21k" veil={0.5} /></g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0C24" opacity={0.5} />
      <Glow x={150} y={520} r={900} kind="cool" o={0.55 + 0.1 * Math.sin(t * 1.1)} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [5, 'worried']]) }} rimId="rimBlueL" shadow={0} />
      <QuestionMark x={1090} y={190} t={t - 16} s={1.3} />
    </g>
  );
};
