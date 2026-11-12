import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LightVeil, Glow, Dust, Foreground, KITCHEN, stand, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { faceBlink, HomeNight, Heater, FuelCan, MonthTag, Blanket, FrontDoor, NeighbourWindow, FrostEdges, flick, SIS, PIP } from './che-home-and-door-props';

// Chapter E, "sister" and "choice": home at night by the heater (E1-E4), the heater and the fuel (E5, E6), the
// neighbours' dark window (E7), the knocking (E8) and Pip's hand over the door handle (E9).

/** Sister seated on the floor in the heater's glow, wrapped in a blanket; (u, w) = floor point in the kitchen. */
const sisSeated = (u: number, w: number, extra: Partial<Pose> = {}): Pose => {
  const p = stand(KITCHEN, u, w, 0.62);
  const sc = p.scale * 0.72;
  const fl = KITCHEN.P(u, 1, w);
  return {
    ...basePose, x: p.x, y: fl.y - 60 * sc, scale: sc, yaw: -0.9, facing: -1,
    legL: { a: 86, b: -4 }, legR: { a: 82, b: -8 }, armL: { a: 6, b: 30 }, armR: { a: 4, b: 34 }, headTilt: -4, sway: 2, ...extra,
  };
};
const SIS_AT = { u: 0.4, w: 0.74 };
const HEATER_X = 400;

// ---------- E1: wide: the dark home, one orange heater, the little sister wrapped in a blanket, Pip comes in ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const walk = easeOut(clamp(t / 40));
  const pip = stand(KITCHEN, 0.86 - 0.1 * walk, 0.5);
  const pipPose: Pose = { ...basePose, ...pip, yaw: -0.5, facing: -1, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 }, headTilt: 3, sway: 3, ...faceAt(t, [[0, 'tired']]) };
  const sis = sisSeated(SIS_AT.u, SIS_AT.w, { ...faceAt(t, [[0, 'neutral']]) });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 880]]), kf(t, [[0, 580], [len, 640]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <HomeNight t={t + 40} id="e1h" heaterAt={HEATER_X} dim={0.4} />
      <Hero look={PIP} pose={pipPose} rimId="rimL" shadow={0.5} />
      <Hero look={SIS} pose={sis} rimId="rimR" shadow={0.5} />
      <Blanket cx={sis.x + 4} top={sis.y - 108 * sis.scale} w={170 * sis.scale} h={190 * sis.scale} t={t} />
      <Dust t={t} seed={5} x0={300} y0={500} w={700} h={420} n={26} o={0.5} />
      <LightVeil id="e1v" lights={[[620, 850, 420], [1130, 700, 260]]} o={0.3} />
    </g>
  );
};

// ---------- E2: medium: she looks up at Pip, he stands over her ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const pip = stand(KITCHEN, 0.56, 0.74);
  const pipPose: Pose = { ...basePose, ...pip, yaw: -0.55, facing: -1, armL: { a: 8, b: -6 }, armR: { a: 12, b: -6 }, headTilt: 2, ...faceAt(t, [[0, 'worried']]) };
  const turn = easeOut(clamp(t / 12));
  const sis = sisSeated(SIS_AT.u, SIS_AT.w, { yaw: -0.9 + 1.2 * turn, facing: turn > 0.5 ? 1 : -1, headTilt: -8 * turn, look: 0.7 * turn, ...faceAt(t, [[0, 'neutral'], [18, 'worried']]) });
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 790]]), kf(t, [[0, 700], [len, 690]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <HomeNight t={t + 90} id="e2h" heaterAt={HEATER_X} />
      <Hero look={SIS} pose={sis} rimId="rimL" shadow={0.5} />
      <Blanket cx={sis.x - 2} top={sis.y - 108 * sis.scale} w={170 * sis.scale} h={190 * sis.scale} t={t} />
      <Hero look={PIP} pose={pipPose} rimId="rimL" shadow={0.5} />
      <Dust t={t} seed={6} x0={300} y0={500} w={700} h={420} n={20} o={0.5} />
    </g>
  );
};

// ---------- E3: close-up: the little sister's face, heater light, "Is the Sun coming back?" ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.3], [len, 3.6]]);
  const head = { x: 900, y: 480 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: -0.2, facing: 1, headTilt: kf(t, [[0, -6], [len, -2]]), look: 0.1,
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3, ...faceBlink(t, [[0, 'worried']], 60, 55),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-700 -600) scale(2)"><HomeNight t={t + 130} id="e3h" heaterAt={HEATER_X} /></g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.3} />
      <Glow x={200} y={760} r={900} o={0.5 * flick(t, 1)} />
      <Hero look={SIS} pose={pose} rimId="rimL" shadow={0} />
      <Blanket cx={head.x} top={head.y + 66 * sc} w={150 * sc} h={420} t={t} />
    </g>
  );
};

// ---------- E4: close-up: Pip's face, no answer, worried ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.4], [len, 3.7]]);
  const head = { x: 1000, y: 480 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: -0.35, facing: -1, headTilt: 4, look: -0.5,
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3, ...faceBlink(t, [[0, 'worried']], 40, 35),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -500) scale(2)"><HomeNight t={t + 170} id="e4h" heaterAt={HEATER_X} /></g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.35} />
      <Glow x={150} y={800} r={900} o={0.45 * flick(t, 4)} />
      <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
    </g>
  );
};

const DarkBack: React.FC<{ id: string; t: number; hx?: number }> = ({ id, t, hx = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1900} fill="#171220" />
    <rect x={-400} y={800} width={2720} height={700} fill="#0F0B16" />
    <rect x={-400} y={800} width={2720} height={4} fill="#FFB46A" opacity={0.25} />
    <Glow x={hx} y={760} r={900} o={0.55 * flick(t, 2)} />
  </g>
);

// ---------- E5: insert: the little heater, glowing, heat shimmering above it ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 700], [len, 640]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <DarkBack id="e5" t={t} hx={960} />
    <Heater x={960} y={900} t={t} s={3.4} />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M ${760 + i * 130} ${300 - ((t * 2 + i * 40) % 120)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#FFD9A0" strokeWidth={5} fill="none" opacity={0.18} strokeLinecap="round" />
    ))}
    <Dust t={t} seed={7} x0={600} y0={200} w={720} h={600} n={30} o={0.7} />
  </g>
);

// ---------- E6: insert: fuel cans lined up on the floor, a tag "1 MONTH" ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const drop = easeOut(clamp(t / 10));
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1000]]), 640, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <DarkBack id="e6" t={t} hx={300} />
      <Heater x={300} y={960} t={t} s={1.9} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(0 ${(1 - drop) * -40 * (i + 1)})`} opacity={clamp(t / 4 - i * 0.4)}>
          <FuelCan x={800 + i * 330} y={930} s={3} rot={i === 1 ? 2 : -1} />
        </g>
      ))}
      <MonthTag x={1130} y={520} t={t} s={1.5} />
      <LightVeil id="e6v" lights={[[330, 760, 380], [1090, 700, 420]]} o={0.3} />
    </g>
  );
};

// ---------- E7: across the way: the neighbours' window, dark and frosted, seen past our own frame ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), 500, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#0A1122" />
      {/* the neighbours' wall: brick courses, other dark windows, a frozen drainpipe */}
      <rect x={-200} y={-100} width={2420} height={1300} fill="#1A2238" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={-200} y={-80 + i * 70} width={2420} height={3} fill="#0E1426" opacity={0.7} />
      ))}
      {[[420, 140], [1560, 140], [420, 640], [1560, 640]].map(([wx, wy], i) => (
        <g key={i}>
          <rect x={wx} y={wy} width={260} height={320} fill="#0A0F1E" stroke="#2A3452" strokeWidth={10} />
          <rect x={wx} y={wy} width={260} height={320} fill="#9FC8F0" opacity={0.06} />
        </g>
      ))}
      <rect x={1000} y={-100} width={26} height={1300} fill="#2A3452" />
      <NeighbourWindow x={1100} y={300} w={380} h={420} t={t} />
      <rect x={-400} y={900} width={2720} height={400} fill="#DCEBFA" opacity={0.14} />
      <Glow x={1290} y={500} r={560} kind="cool" o={0.16} />
      {Array.from({ length: 50 }).map((_, i) => (
        <circle key={i} cx={((i * 197 + t * (1 + (i % 3) * 0.5)) % 2200) - 150} cy={((i * 83 + t * 2) % 1100) - 20} r={2 + (i % 3)} fill="#E8F4FF" opacity={0.55} />
      ))}
    </g>
    <Foreground blur={16}>
      <path d="M -60 -60 L 380 -60 L 300 1140 L -60 1140 Z" fill="#05060C" />
      <rect x={-60} y={960} width={2100} height={200} fill="#05060C" />
      <Glow x={120} y={820} r={500} o={0.45 * flick(t, 6)} />
    </Foreground>
  </g>
);

// ---------- E8: the front door, frosted at the edges, knocked three times ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const knock = [14, 22, 30].reduce((a, k) => a + (t >= k && t < k + 6 ? Math.sin(((t - k) / 6) * Math.PI) * (1 - (k - 14) / 40) : 0), 0);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 520, kf(t, [[0, 1.12], [len, 1.24]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#1A1424" />
      <rect x={-400} y={900} width={2720} height={500} fill="#0F0B16" />
      <FrontDoor x0={700} y0={120} w={520} h={780} shake={knock} seed={3} />
      <rect x={700} y={890} width={520} height={10} fill="#8EC8FF" opacity={0.55} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${1250 + i * 30} 500 l 22 -8 M ${1250 + i * 30} 530 l 28 0 M ${1250 + i * 30} 560 l 22 8`} stroke="#F6EFE3" strokeWidth={6} strokeLinecap="round" opacity={t >= 14 + i * 8 && t < 14 + i * 8 + 6 ? 0.9 : 0} />
      ))}
      <Glow x={200} y={900} r={760} o={0.4 * flick(t, 3)} />
      <LightVeil id="e8v" lights={[[960, 520, 560], [200, 900, 300]]} o={0.4} />
      <FrostEdges x={700} y={880} w={520} h={60} grow={1} seed={8} o={0.6} />
    </g>
  );
};

// ---------- E9: extreme close-up: Pip's mitten hovering over the door handle, trembling ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 20));
  const hx = 960 - 40 * k + Math.sin(t / 2.2) * 3;
  const hy = 480 + 20 * k + Math.cos(t / 3.1) * 3;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2720} height={1900} fill="#5A3C2A" />
      <rect x={-400} y={-400} width={2720} height={14} fill="#FFC98A" opacity={0.0} />
      <rect x={1650} y={-400} width={500} height={1900} fill="#8EC8FF" opacity={0.18} />
      <FrostEdges x={1250} y={-100} w={1000} h={1300} grow={1.6} seed={11} o={0.7} />
      {/* lock plate + handle, huge */}
      <rect x={1160} y={380} width={150} height={330} rx={26} fill="#8A6A3A" stroke="#4A3010" strokeWidth={6} />
      <circle cx={1235} cy={470} r={44} fill="#C9A46A" stroke="#6A4A20" strokeWidth={6} />
      <circle cx={1235} cy={620} r={22} fill="#2A1C10" />
      <rect x={1100} y={430} width={420} height={78} rx={39} fill="#D9B676" stroke="#6A4A20" strokeWidth={6} />
      <rect x={1110} y={438} width={400} height={18} rx={9} fill="#FFE9B0" opacity={0.6} />
      <Glow x={200} y={900} r={900} o={0.35 * flick(t, 8)} />
      <InsertArm x={hx} y={hy} fx={-250} fy={1000} rot={-72} s={9} width={190} />
      <LightVeil id="e9v" lights={[[1200, 500, 520]]} o={0.34} />
    </g>
  );
};

export { poseAt };
