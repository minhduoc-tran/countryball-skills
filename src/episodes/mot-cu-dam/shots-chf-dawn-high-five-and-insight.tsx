import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, reachAngle, kf, clamp, easeOut, camT, LOOKS, Glow, ShotProps, LEG_LEN, Sparkle,
} from '../../engine';
import { FistInsert } from './punch-pip-and-fist';
import { SpeedLines } from './punch-fx-kit';
import { DawnStreet, Birds, HighFiveHands } from './chf-dawn-props';

// CHAPTER F, the morning after: "Sáng hôm sau, trời quang. Em gái bạn giơ tay lên, đòi đập tay. Bạn sợ. Bạn mở nắm
// tay ra, và chạm thật khẽ. Không có tiếng nổ. Không có gì vỡ cả. Hóa ra điều khó nhất không phải là đấm thật mạnh.
// Mà là biết khi nào nên mở nắm tay ra."
// F12 dawn street wet and empty, F13 tilt up to the clear sky, F14 she raises her hand, F15 her hand close, F16 his fist
// trembles, F17 it opens, F18 palms meet, F19 held, F20 wide: nothing breaks, F21 he looks at his hand, F22 the strong
// fist, F23 both smiling, F24 the open hand.

const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;
const GROUND = 880; // feet line on the dawn street for the mediums
const hipY = (sc: number) => GROUND - LEG_LEN * sc;

/** Both kids on the dawn street, hands raised to a shared point; `raise` 0..1 brings the hands up. */
const duo = (raise: number, o: { px?: number; sx?: number; ps?: number; ss?: number; target?: { x: number; y: number } } = {}) => {
  const { px = 700, sx = 1150, ps = 1.0, ss = 0.72, target = { x: 925, y: 560 } } = o;
  const pip: Pose = { ...basePose, x: px, y: hipY(ps), scale: ps, yaw: 0.55, facing: 1, look: 0.7, tilt: 3, sway: 4 };
  const sis: Pose = { ...basePose, x: sx, y: hipY(ss), scale: ss, yaw: -0.55, facing: -1, look: -0.7, tilt: -3, sway: 4 };
  const aP = reachAngle(pip, target);
  const aS = reachAngle(sis, target);
  return {
    pip: { ...pip, armR: { a: 12 + (aP - 12) * raise, b: 0 } },
    sis: { ...sis, armL: { a: 12 + (-aS - 12) * raise, b: 0 } },
  };
};

// ---------- F12: the alley at dawn, wet and glistening, birds crossing; nobody ----------
export const F12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <DawnStreet t={t + 60} id="f12" />
    <Birds t={t} n={5} seed={3} y0={140} />
  </g>
);

// ---------- F13: the camera tilts up to a clear sky, the sun, a few birds ----------
export const F13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <DawnStreet t={t + 90} id="f13" low={kf(t, [[0, 110], [len, 330]], easeOut)} shine={0.6} />
    <Birds t={t} n={8} seed={9} y0={60} speed={3.2} />
  </g>
);

// ---------- F14: medium: his little sister raises her hand, Pip watches, a tiny smile ----------
export const F14: React.FC<ShotProps> = ({ t, len }) => {
  const raise = easeOut(clamp((t - 6) / 22));
  const { pip, sis } = duo(raise, { target: { x: 1000, y: 560 } });
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 600, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <DawnStreet t={t + 130} id="f14" blur={6} />
      <Hero look={PIP} pose={{ ...pip, armR: { a: 8, b: 6 }, ...faceAt(t, [[0, 'neutral'], [30, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- F15: close on the little sister, hand up and waiting, bright-eyed ----------
export const F15: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 2.6;
  const pose: Pose = {
    ...basePose, x: 860, y: 640 + 190 * sc * 0.0 + 330, scale: sc, yaw: -0.3, facing: -1, tilt: -4, look: -0.8,
    armL: { a: 168 - 5 * Math.sin(t * 0.3), b: 0 }, armR: { a: 12, b: -6 }, sway: 6, ...faceAt(t, [[0, 'happy']]),
  };
  return (
    <g>
      <DawnStreet t={t + 200} id="f15" blur={16} />
      <g transform={camT(kf(t, [[0, 900], [len, 940]]), 520, 1)}>
        <Hero look={SIS} pose={pose} rimId="rimL" shadow={0} />
      </g>
    </g>
  );
};

const InsertBack: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <DawnStreet t={t + 300} id={id} blur={16} shine={0.5} />
    <rect x={0} y={0} width={1920} height={1080} fill="#FFB890" opacity={0.12} />
  </g>
);

// ---------- F16: insert: his fist, clenched, trembling ----------
export const F16: React.FC<ShotProps> = ({ t }) => (
  <g>
    <InsertBack t={t} id="f16" />
    <FistInsert t={14 + t} id="f16" bg={false} clenchAt={0} thrustAt={400} />
  </g>
);

// ---------- F17: the fist slowly opens, the fingers unfurl; the hand stays open ----------
export const F17: React.FC<ShotProps> = ({ t, len }) => {
  const rev = 14 - clamp((t - 8) / 22) * 14; // 14 = shut, 0 = open
  const z = kf(t, [[0, 1.0], [len, 1.12]]);
  return (
    <g>
      <InsertBack t={t} id="f17" />
      <g transform={`translate(960 600) scale(${z}) translate(-960 -600)`}>
        <FistInsert t={rev} id="f17" bg={false} clenchAt={0} thrustAt={400} />
      </g>
      <Glow x={960} y={420} r={520} o={0.25 * clamp((t - 14) / 20)} />
    </g>
  );
};

// ---------- F18: two open hands, a big one and a small one, palms meeting ever so softly ----------
export const F18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <InsertBack t={t} id="f18" />
    <HighFiveHands t={t} touchAt={22} />
    <Sparkle x={960} y={520} t={t - 22} />
  </g>
);

// ---------- F19: held: the palms stay together, the camera drifts back; a bird, quiet ----------
export const F19: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.0], [len, 0.8]]);
  return (
    <g>
      <InsertBack t={t + 40} id="f19" />
      <g transform={`translate(960 600) scale(${z}) translate(-960 -600)`}>
        <HighFiveHands t={t + 60} touchAt={22} />
      </g>
      <Birds t={t} n={3} seed={14} y0={110} speed={1.2} />
    </g>
  );
};

// ---------- F20: wide: the two kids high-five on the wet street; nothing breaks: a bird lands, a pot of flowers stands ----------
export const F20: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, sis } = duo(1, { px: 740, sx: 1110, target: { x: 925, y: 570 } });
  const land = clamp((t - 8) / 14);
  return (
    <g transform={camT(940, 600, kf(t, [[0, 1.18], [len, 1.05]]))}>
      <DawnStreet t={t + 160} id="f20" blur={3} />
      <g>
        <rect x={1300} y={GROUND - 70} width={64} height={70} rx={8} fill="#B8603C" stroke="#14121A" strokeWidth={4} />
        <path d="M 1332 818 q -30 -60 -40 -90 M 1332 818 q 4 -70 14 -100 M 1332 818 q 34 -50 54 -72" stroke="#3E8C5A" strokeWidth={7} fill="none" strokeLinecap="round" />
        <circle cx={1292} cy={726} r={15} fill="#FF8AA0" /><circle cx={1346} cy={716} r={15} fill="#FFD84A" /><circle cx={1386} cy={746} r={14} fill="#FF8AA0" />
      </g>
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Sparkle x={925} y={560} t={t - 4} />
      {/* a small bird lands on the pot's rim */}
      <g transform={`translate(${1500 - 140 * easeOut(land)} ${620 + 100 * land - 14 * Math.sin(land * Math.PI)})`}>
        <ellipse rx={20} ry={14} fill="#6A4A3A" stroke="#14121A" strokeWidth={3} />
        <circle cx={-16} cy={-8} r={8} fill="#6A4A3A" stroke="#14121A" strokeWidth={3} />
        <path d={`M 4 -4 q 10 ${-18 * (1 - land) - 4} 22 ${-10 * (1 - land)}`} stroke="#14121A" strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- F21: Pip beside his sister, looking at his own open hand, a soft smile ----------
export const F21: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 800, y: hipY(1.2), scale: 1.2, yaw: 0.4, facing: 1, look: 0.2, headTilt: 5, armR: { a: 32, b: 70 }, armL: { a: 10, b: -6 } } },
    { f: len, p: { armR: { a: 40, b: 86 }, look: 0.5 } },
  ]);
  const sis: Pose = { ...basePose, x: 1190, y: hipY(0.86), scale: 0.86, yaw: -0.5, facing: -1, look: -0.5, sway: 5 };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), 560, kf(t, [[0, 1.25], [len, 1.5]]))}>
      <DawnStreet t={t + 220} id="f21" blur={6} />
      <Hero look={SIS} pose={{ ...sis, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [20, 'happy']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- F22: the huge clenched fist again: the strength that could have crushed anything ----------
export const F22: React.FC<ShotProps> = ({ t }) => (
  <g>
    <FistInsert t={14 + t} id="f22" bg clenchAt={0} thrustAt={400} />
    <SpeedLines t={t} cx={960} cy={560} n={40} rIn={420} o={0.25} color="#FFD9A0" seed={3} />
  </g>
);

// ---------- F23: both smiling, a slow push-in ----------
export const F23: React.FC<ShotProps> = ({ t, len }) => {
  const { pip, sis } = duo(0, { px: 780, sx: 1140, ps: 1.1, ss: 0.8 });
  return (
    <g transform={camT(960, kf(t, [[0, 620], [len, 560]]), kf(t, [[0, 1.5], [len, 1.9]]))}>
      <DawnStreet t={t + 260} id="f23" blur={6} />
      <Hero look={PIP} pose={{ ...pip, y: hipY(1.1), armR: { a: 10, b: -8 }, yaw: 0.45, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={SIS} pose={{ ...sis, y: hipY(0.8), yaw: -0.45, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- F24: the open hand, slow push-in, warm light: the lesson ----------
export const F24: React.FC<ShotProps> = ({ t, len }) => {
  const rev = 14 - clamp((t - 3) / 22) * 14;
  const z = kf(t, [[0, 1.0], [len, 1.3]]);
  return (
    <g>
      <InsertBack t={t + 80} id="f24" />
      <g transform={`translate(960 560) scale(${z}) translate(-960 -560)`}>
        <FistInsert t={rev} id="f24" bg={false} clenchAt={0} thrustAt={400} />
      </g>
      <Glow x={960} y={380} r={640} o={0.32} />
    </g>
  );
};
