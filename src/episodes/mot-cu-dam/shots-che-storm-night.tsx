import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LEG_LEN, Bedroom, BEDROOM, WINDOW, stand, Street, walkPose,
  Tabletop, LightVeil, Glow, FONT, UI, LOOKS, ShotProps,
} from '../../engine';
import { StreakLines } from './punch-fx-kit';
import { TyphoonSpiral, Rain } from './storm-sky';
import { AlertPhone, StormGround, SchoolBuilding, RadarScreen } from './che-props-storm-and-icons';
import { PIP } from './che-props-suit-and-drone';

// Chapter E, beat "typhoon" setup (E15-E20, "storm" look): a night in Pip's room, the emergency alert, the radar, the
// little sister still at school, Pip runs out into the rain and looks up at the giant spiral.

const lightning = (t: number, seed = 0) => ((t + seed) % 83 < 2 || (t + seed + 41) % 137 < 1 ? 0.35 : 0);

// ---------- E15: Pip in his room at night, looking out at the rain on the window ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const at = stand(BEDROOM, 0.9, 0.5);
  const pose: Pose = { ...basePose, ...at, yaw: -0.85, look: -0.8, armL: { a: 8, b: 8 }, armR: { a: 10, b: 10 }, headTilt: 2 };
  const w = WINDOW;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1100]]), 500, kf(t, [[0, 1.15], [len, 1.4]]))}>
      <Bedroom t={t + 60} id="e15b" lamp={0.8} clock="21:40" />
      <clipPath id="e15wc"><rect x={w.x0} y={w.y0} width={w.x1 - w.x0} height={w.y1 - w.y0} /></clipPath>
      <g clipPath="url(#e15wc)">
        <rect x={w.x0} y={w.y0} width={w.x1 - w.x0} height={w.y1 - w.y0} fill="#0B1020" opacity={0.75} />
        <Rain t={t} intensity={0.55} slant={0.4} x0={w.x0 - 60} x1={w.x1 + 60} y0={w.y0 - 20} y1={w.y1 + 20} />
        <rect x={w.x0} y={w.y0} width={w.x1 - w.x0} height={w.y1 - w.y0} fill="#CFE0FF" opacity={lightning(t)} />
      </g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [20, 'worried']]) }} rimId="rimBlue" shadow={0.5} />
    </g>
  );
};

// ---------- E16: the emergency alert on the phone: siren red pulses, CẢNH BÁO BÃO KHẨN CẤP ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = 0.5 + 0.5 * Math.sin(t * 0.6);
  const pop = easeOut(clamp(t / 6));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#2E2A3A" grain="#262232" lip="#3A3548" floor="#120F1A" floorLines="#0E0B16" />
      <LightVeil id="e16veil" lights={[[960, 560, 700]]} o={0.55} />
      <Glow x={960} y={560} r={900 * (0.8 + 0.3 * pulse)} o={0.55} />
      <rect x={-100} y={-100} width={2120} height={1280} fill="#FF2A2A" opacity={0.12 * pulse} />
      <AlertPhone x={960} y={560 + (1 - pop) * 200} w={560} rot={-6} t={t} />
    </g>
  );
};

// ---------- E17: the radar: a big spiral heading for the coast ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const blink = t % 20 < 13 ? 1 : 0.3;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <rect width={1920} height={1080} fill="#0B1018" />
      <path d="M 0 140 H 1920 M 0 940 H 1920" stroke="#18222E" strokeWidth={3} />
      <RadarScreen cx={680} cy={540} r={400} t={t} id="e17r" />
      <g transform="translate(1400 400)" opacity={clamp(t / 8)}>
        <text x={0} y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#FF4A3A" opacity={blink}>BÃO</text>
        <text x={0} y={130} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#FFD23F" letterSpacing={6}>SẮP ĐỔ BỘ</text>
        <rect x={-260} y={190} width={520} height={20} rx={10} fill="#223" />
        <rect x={-260} y={190} width={520 * clamp(t / len)} height={20} rx={10} fill="#FF4A3A" />
      </g>
    </g>
  );
};

// ---------- E18: the school at night in the rain; the little sister at a lit window; push-in ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const bx = 960;
  const by = 1010;
  const k = easeOut(clamp(t / (len - 4)));
  const cx = 960 + (bx + 105 - 960) * k;
  const cy = 520 + (by - 245 - 520) * k;
  const wx = bx + 105;
  const wy = by - 245;
  const sc = 0.95 + (3.3 - 0.95) * k;
  const sis: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: wx, y: wy + 36, scale: 0.34, yaw: 0, armL: { a: 150, b: -10 }, armR: { a: 150, b: -10 }, headTilt: 4 } },
    { f: 30, p: { headTilt: -4, armL: { a: 156, b: -6 } } },
  ]);
  return (
    <g transform={camT(cx, cy, sc)}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#0B1020" />
      <Glow x={960} y={300} r={900} o={0.12} />
      <SchoolBuilding x={bx} y={by} t={t} />
      <clipPath id="e18wc"><rect x={wx - 75} y={wy - 65} width={150} height={130} /></clipPath>
      <g clipPath="url(#e18wc)">
        <Hero look={LOOKS.sis} pose={{ ...sis, ...faceAt(t, [[0, 'worried']]) }} rimId="rimL" shadow={0} />
      </g>
      <Rain t={t} intensity={1.0} slant={0.35} />
      <rect x={-400} y={-400} width={2720} height={1900} fill="#CFE0FF" opacity={lightning(t, 20)} />
    </g>
  );
};

// ---------- E19: Pip bursts out of the house and runs through the rain ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 360], [len, 1500]], (v) => v);
  const base = walkPose(x, t * 0.95, 800, 0.78, { look: 0.5, tilt: 10, expr: 'worried' });
  const pose: Pose = {
    ...base,
    armL: { a: base.armL.a * 2.4, b: 50 + base.armL.b },
    armR: { a: base.armR.a * 2.4, b: 50 + base.armR.b },
    legL: { a: base.legL.a * 1.7, b: base.legL.b - 15 },
    legR: { a: base.legR.a * 1.7, b: base.legR.b - 15 },
  };
  return (
    <g transform={camT(kf(t, [[0, 640], [len, 1180]], (v) => v), 560, 1.25)}>
      <Street t={t} id="e19s" night />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#0C1430" opacity={0.25} />
      <StreakLines t={t} x={x - 60} y={650} dir={180} n={9} len={380} spread={240} thick={4} o={0.35} seed={9} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0.4} />
      <Rain t={t} intensity={1.2} slant={0.4} />
    </g>
  );
};

// ---------- E20: low angle: small Pip looks up at the giant spiral filling the sky ----------
export const E20: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / len));
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 700, y: 830 - LEG_LEN * 0.8, scale: 0.8, yaw: 0.55, look: 0.9, headTilt: -4, armL: { a: 6, b: 8 }, armR: { a: 6, b: 8 } } },
    { f: 24, p: { headTilt: -12 } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 700], [len, 520]]), kf(t, [[0, 1.5], [len, 0.95]]))}>
      <TyphoonSpiral t={t} id="e20sp" cx={960} cy={250} R={1300} />
      <StormGround t={t} y={830} id="e20g" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [30, 'worried']]) }} rimId="rimBlue" shadow={0.4} />
      <Rain t={t} intensity={1.1} slant={0.4} />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#CFE0FF" opacity={lightning(t, 5) * (1 - k * 0.3)} />
    </g>
  );
};
