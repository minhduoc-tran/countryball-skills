import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, backOut, LOOKS, LEG_LEN, Glow, Dust, FONT, Sparkle,
  Rooftop, joints, toWorld, ShotProps,
} from '../../engine';
import { BlackCard } from './che-xoi-cart-and-money-props';

// Chapter E, "friend" and "question" (246.4-267.6 s): E22 Mo asks Pip on the dusk roof, E23 Pip thinks (close-up),
// E24 Pip smiles at the sunset with the card, E25-E26 the end card: two questions over the roof, the card glowing, a fade out.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const FEET = 842;

// ---------- E22: Pip and Mo on the roof at dusk; Mo asks, Pip holds the card low; the camera drifts in ----------
export const E22: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.2;
  const pip: Pose = poseAt(t, [
    { f: 0, p: { x: 780, y: FEET - LEG_LEN * sc, scale: sc, yaw: 0.45, facing: 1, tilt: -2, headTilt: 0, armL: { a: 14, b: -6 }, armR: { a: 22, b: 30 } } },
    { f: 80, p: { headTilt: 5, look: 0.2 }, ease: easeOut },
  ]);
  const gest = Math.sin(clamp((t - 24) / 40) * Math.PI);
  const mo: Pose = {
    ...basePose, x: 1120, y: FEET - LEG_LEN * sc, scale: sc, yaw: -0.45, facing: -1, tilt: 4, headTilt: 4 * gest,
    armL: { a: 30 + 40 * gest, b: 30 }, armR: { a: 14, b: -6 }, ...faceAt(t, [[0, 'happy'], [60, 'neutral']]),
  };
  const hand = toWorld(pip, joints(pip).armR.end);
  const q = backOut(clamp((t - 78) / 9));
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 900]]), kf(t, [[0, 580], [len, 520]]), kf(t, [[0, 1.5], [len, 2.1]]))}>
      <Rooftop t={t + 120} sunX={1280} sunY={610} cityLit={1.4} />
      <Hero look={MO} pose={mo} rimId="rimL" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [90, 'worried']]) }} rimId="rimR" shadow={0.5} />
      <BlackCard x={hand.x + 10} y={hand.y + 30} s={0.3} rot={-70} glow={0.3} />
      <g transform={`translate(1130 ${FEET - 520}) scale(${q})`}>
        <ellipse rx={50} ry={42} fill="#F6EFE3" stroke="#1A1230" strokeWidth={4} />
        <text y={20} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill="#FF8A3D">?</text>
      </g>
      <Dust t={t} seed={221} x0={500} y0={250} w={900} h={500} n={22} o={0.5} />
    </g>
  );
};

// ---------- E23: close-up: Pip thinks for a long time, eyes on the sunset, a slow blink; the roof soft behind ----------
export const E23: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.2;
  const head = { x: 760, y: 470 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.55, facing: 1, headTilt: kf(t, [[0, 2], [len, -4]]), look: kf(t, [[0, 0.3], [len, 0.85]]),
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3,
    blink: t > 30 && t < 40 ? Math.sin(((t - 30) / 10) * Math.PI) : 0,
  };
  return (
    <g>
      <g filter="url(#blur16)"><g transform="translate(-250 -180) scale(1.35)"><Rooftop t={t + 300} sunX={1250} sunY={600} cityLit={1.4} /></g></g>
      <Glow x={1500} y={560} r={800} o={0.45} />
      <g transform={`translate(0 ${kf(t, [[0, 0], [len, -20]])})`}>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [44, 'smug']]) }} rimId="rimR" shadow={0} />
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#2A0E24" opacity={0.12} />
    </g>
  );
};

// ---------- E24: low angle: Pip holds the glowing card up to the sunset, smiling; it comes down to his chest ----------
export const E24: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.45;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 800, y: FEET + 40 - LEG_LEN * sc, scale: sc, yaw: 0.6, facing: 1, look: 0.7, armL: { a: 14, b: -6 }, armR: { a: 40, b: 40 } } },
    { f: 26, p: { armR: { a: 128, b: 14 }, headTilt: -4 }, ease: easeOut },
    { f: 84, p: { armR: { a: 128, b: 14 } } },
    { f: 108, p: { armR: { a: 70, b: 92 }, headTilt: 3 }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 930]]), kf(t, [[0, 620], [len, 560]]), kf(t, [[0, 1.5], [len, 1.9]]))}>
      <Rooftop t={t + 200} sunX={1180} sunY={560} low={120} cityLit={1.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'happy']]) }} rimId="rimR" shadow={0} />
      <BlackCard x={hand.x + 10} y={hand.y - 26} s={0.55} rot={-12} glow={clamp((t - 20) / 14) * 0.9} shine={t > 50 && t < 74 ? (t - 50) / 24 : 0} />
      <Sparkle x={hand.x + 50} y={hand.y - 80} t={t - 36} s={1.5} />
      <Sparkle x={hand.x - 40} y={hand.y - 20} t={t - 52} s={1.1} />
      <Dust t={t} seed={241} x0={500} y0={250} w={900} h={500} n={22} o={0.5} />
    </g>
  );
};

/** The end card's text on the screen: line 1 pops at t1, line 2 at t2 (null = not yet); both stay. */
const EndText: React.FC<{ t: number; t1: number; t2: number | null }> = ({ t, t1, t2 }) => {
  const p1 = backOut(clamp((t - t1) / 9));
  const p2 = t2 === null ? 0 : backOut(clamp((t - t2) / 9));
  const hot = (w: string) => w === 'THAY' || w === 'ĐỔI';
  return (
    <g>
      <g transform={`translate(960 150) scale(${p1})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={68} letterSpacing={3} fill="#F6EFE3" stroke="#120B24" strokeWidth={10} paintOrder="stroke">THỨ ĐẦU TIÊN BẠN QUẸT LÀ GÌ?</text>
      </g>
      {p2 > 0 ? (
        <g transform={`translate(960 262) scale(${p2})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={76} fill="#FF8A3D" stroke="#120B24" strokeWidth={12} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.5))' }}>
            {'BẠN CÓ DÁM THAY ĐỔI THẾ GIỚI?'.split(' ').map((w, i) => <tspan key={i} fill={hot(w) ? '#FFE27A' : undefined}>{(i ? ' ' : '') + w}</tspan>)}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** The end card's world: the dusk roof, Pip small at the left gazing at the black card, which floats and glows at the right. */
const EndWorld: React.FC<{ t: number; dim: number }> = ({ t, dim }) => {
  const sc = 0.95;
  const bob = Math.sin(t / 16) * 10;
  const pose: Pose = { ...basePose, x: 640, y: FEET - LEG_LEN * sc, scale: sc, yaw: 0.55, facing: 1, headTilt: 3, look: 0.8, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, sway: 4 };
  return (
    <g>
      <Rooftop t={t + 500} sunX={1000} sunY={640} cityLit={1.6} sunGone={dim} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Glow x={1360} y={620 + bob} r={260 + 60 * dim} o={0.5 + 0.3 * dim} />
      <BlackCard x={1360} y={620 + bob} s={0.7} rot={-8 + Math.sin(t / 20) * 3} glow={0.7 + 0.3 * dim} shine={(t % 90) / 90 > 0.7 ? ((t % 90) / 90 - 0.7) / 0.3 : 0} />
      <Dust t={t} seed={251} x0={900} y0={380} w={900} h={440} n={22} o={0.5} />
    </g>
  );
};

// ---------- E25: end card, wide: the first question over the dusk roof ----------
export const E25: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 1010]]), 570, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <EndWorld t={t} dim={0} />
    </g>
    <EndText t={t} t1={4} t2={null} />
  </g>
);

// ---------- E26: end card: the second question, the sun slips away and the card glows; then a soft fade to black ----------
export const E26: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - (len - 44)) / 40));
  const dim = easeOut(clamp((t - 30) / 140)) * 0.6;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1010], [len, 1090]]), kf(t, [[0, 570], [len, 600]]), kf(t, [[0, 1.06], [len, 1.22]]))}>
        <EndWorld t={t + 119} dim={dim} />
      </g>
      <EndText t={t + 119} t1={4} t2={123} />
      <rect x={-10} y={-10} width={1940} height={1100} fill="#000" opacity={fade} />
    </g>
  );
};
