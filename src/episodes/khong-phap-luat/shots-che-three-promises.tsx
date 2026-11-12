import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, backOut, LOOKS, Glow, Sparkle, Street, streetStand, walkPose,
  Bicycle, joints, toWorld, ShotProps, LEG_LEN,
} from '../../engine';
import { GRANDMA, WORKER } from '../khong-ai-ngheo/cast-looks';
import { ArmIn } from './che-hands-and-sleeves';
import { Thread } from './che-law-book-and-board-props';

// Chapter E, "7 insight" three promises (246.8-252.1 s), look "peace": E16 red light, everyone stops; E17 a borrowed
// bicycle handed back; E18 a hand pulls someone up; E19 the neighbours hold one glowing thread.

const PIP = LOOKS.pipHood, MO = LOOKS.mo, SIS = LOOKS.sis, MOM = LOOKS.mom;

/** A red octagon with a white open palm: STOP. Screen space. */
const StopHand: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  const p = backOut(clamp((t - 2) / 7));
  const pulse = 1 + 0.04 * Math.sin(t / 3);
  return (
    <g transform={`translate(${x} ${y}) scale(${p * pulse})`}>
      <path d="M -50 -120 H 50 L 120 -50 V 50 L 50 120 H -50 L -120 50 V -50 Z" fill="#D9322E" stroke="#fff" strokeWidth={9} strokeLinejoin="round" />
      <g fill="#fff"><rect x={-60} y={-4} width={22} height={60} rx={11} transform="rotate(-8 -50 56)" /><rect x={-34} y={-62} width={22} height={90} rx={11} /><rect x={-6} y={-72} width={22} height={100} rx={11} /><rect x={22} y={-60} width={22} height={90} rx={11} /><path d="M -60 20 H 44 Q 46 76 -10 92 Q -56 84 -60 20 Z" /></g>
    </g>
  );
};

// ---------- E16: the light is red; Pip, Mo and sis wait at the kerb, Mo with a palm up ----------
export const E16: React.FC<ShotProps> = ({ t, len }) => {
  const spots = [{ X: 2.0, look: PIP, k: 1.6 }, { X: 3.0, look: MO, k: 1.6 }, { X: 3.9, look: SIS, k: 1.15 }];
  const ring = 1 + 0.25 * Math.sin(t / 3);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1070], [len, 1050]]), 520, kf(t, [[0, 2.0], [len, 2.2]]))}>
        <Street t={t + 30} id="e16st" light="red" market={0.7} />
        <circle cx={1023} cy={402} r={34 * ring} fill="none" stroke="#FF4538" strokeWidth={5} opacity={0.7} />
        {spots.map((s, i) => {
          const g = streetStand(s.X, 7.0, { k: s.k });
          const wave = i === 1 ? easeOut(clamp((t - 6) / 8)) : 0;
          const pose: Pose = { ...basePose, x: g.x, y: g.y, scale: g.scale, yaw: -0.55, facing: -1, look: -0.6, armL: { a: 10, b: -6 }, armR: { a: 10 + 100 * wave, b: -8 }, tilt: -2, headTilt: Math.sin(t / 12 + i) * 2, ...faceAt(t, [[0, 'neutral']]) };
          return <Hero key={i} look={s.look} pose={pose} rimId="rimR" shadow={0} />;
        })}
      </g>
      <StopHand x={240} y={250} t={t} />
    </g>
  );
};

// ---------- E17: Pip walks the borrowed bicycle back to Mo, who takes the handlebars ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 6.0;
  const arrive = easeOut(clamp(t / (len - 6)));
  const pg = streetStand(-1.9 + 2.0 * arrive, Z, { k: 1.6 });
  const mg = streetStand(1.1, Z, { k: 1.6 });
  const gy = pg.y + LEG_LEN * pg.scale;
  const walk = walkPose(pg.x, t * 0.55 * (1 - arrive * 0.9), gy, pg.scale, { yaw: 0.55, tilt: 2 }, 1);
  const take = easeOut(clamp((t - (len - 14)) / 8));
  const mo: Pose = { ...basePose, x: mg.x, y: mg.y, scale: mg.scale, yaw: -0.55, facing: -1, look: 0.4, armL: { a: 10, b: -6 }, armR: { a: 10 + 60 * take, b: -10 }, ...faceAt(t, [[0, 'neutral'], [len - 14, 'happy']]) };
  return (
    <g transform={camT(kf(t, [[0, 920], [len, 960]]), 560, kf(t, [[0, 2.0], [len, 2.2]]))}>
      <Street t={t + 90} id="e17st" market={0.7} />
      <Bicycle x={pg.x + 150 * pg.scale} y={gy} s={pg.scale} facing={1} t={t * (1 - arrive * 0.9) * 0.8} color="#C75B48" />
      <Hero look={PIP} pose={{ ...walk, armR: { a: 55, b: 10 }, ...faceAt(t, [[0, 'neutral'], [len - 14, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={MO} pose={mo} rimId="rimR" shadow={0} />
      <Sparkle x={mg.x - 30} y={mg.y - 120} t={t - (len - 10)} s={1.0} />
    </g>
  );
};

// ---------- E18: insert: a hand from above clasps another and pulls it up ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeInOut(clamp((t - 6) / (len - 12)));
  const y = 780 - 260 * up;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)"><g transform="translate(-300 -260) scale(1.5)"><Street t={t + 120} id="e18st" /></g></g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#2A1830" opacity={0.18} />
      <Glow x={960} y={y} r={520} o={0.5} />
      <ArmIn x={905} y={y + 110} fx={520} fy={y + 640} color="#3E8C86" rot={198} s={6.6} width={80} />
      <ArmIn x={985} y={y - 20} fx={1500} fy={y - 640} color="#2E2B3D" rot={20} s={6.6} width={80} />
      <Sparkle x={1130} y={y + 80} t={t - 20} s={1.4} />
    </g>
  );
};

// ---------- E19: six neighbours across the road hold one glowing thread from hand to hand ----------
export const E19: React.FC<ShotProps> = ({ t, len }) => {
  const cast = [{ l: GRANDMA, k: 1.45 }, { l: MOM, k: 1.6 }, { l: PIP, k: 1.6 }, { l: MO, k: 1.6 }, { l: WORKER, k: 1.65 }, { l: SIS, k: 1.15 }];
  const xs = [-3.6, -2.2, -0.8, 0.6, 2.0, 3.4];
  const poses = cast.map((c, i) => {
    const g = streetStand(xs[i], 6.4, { k: c.k });
    return { c, p: { ...basePose, x: g.x, y: g.y, scale: g.scale, yaw: 0.15, look: 0, armL: { a: 80, b: 0 }, armR: { a: 80, b: 0 }, headTilt: Math.sin(t / 14 + i) * 3, ...faceAt(t, [[0, 'happy']]) } as Pose };
  });
  const hands = poses.map(({ p }) => ({ L: toWorld(p, joints(p).armL.end), R: toWorld(p, joints(p).armR.end) }));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <Street t={t + 150} id="e19st" market={0.7} />
      {poses.map(({ c, p }, i) => <Hero key={i} look={c.l} pose={p} rimId="rimR" shadow={0} />)}
      {hands.slice(0, -1).map((h, i) => <Thread key={i} x1={h.R.x} y1={h.R.y} x2={hands[i + 1].L.x} y2={hands[i + 1].L.y} sag={14} ph={clamp(((t - 2) / 22) * 6 - i)} w={5} />)}
      <Glow x={960} y={520} r={700} o={0.25} />
    </g>
  );
};
