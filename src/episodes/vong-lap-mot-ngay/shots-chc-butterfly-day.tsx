import React from 'react';
import { kf, clamp, easeOut, camT, faceAt, poseAt, toWorld, joints, walkPose, ShotProps, Hero, Pose, basePose, Street, streetStand, FocusRings, Schematic, DrawOn, SCH, FONT, Glow, Foreground } from '../../engine';
import { FlipClock, DayCounter } from './kit-loop-clock';
import { Neighbour } from './kit-cast-figures';
import { PIP } from './chc-pip-in-bed';
import { toScreen, PipHeadIcon } from './chc-forgetting-props';
import { NeighbourFront, frontStand, WateringCan } from './chc-neighbour-front';
import { BranchIcon } from './chc-butterfly-map-props';

// Chapter C, beat "5 butterfly" part 1 (156.91-165.93 s): C19 Pip stops on his street, something is odd; C20 two
// loops side by side, synced to the frame; C21 he greets the neighbour one minute early (07:15 -> 07:14); C22 the day
// forks: the old branch greys out, a new one lights up.

// ---------- C19: wide street: Pip walking along the sidewalk stops mid-step; focus rings: "something is strange" ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 4.6;
  const X = kf(t, [[0, -5.7], [14, -5.0]], easeOut);
  const st = streetStand(X, Z, { sidewalk: true });
  const walk = walkPose(st.x, t * 0.55, st.y + 140 * st.scale, st.scale, {}, 1);
  const pose: Pose = t < 14 ? { ...walk, yaw: 0.55 } : poseAt(t - 14, [
    { f: 0, p: { ...basePose, x: st.x, y: st.y, scale: st.scale, yaw: 0.55, facing: 1, legL: { a: 14, b: -6 }, legR: { a: -10, b: -4 }, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 6, p: { yaw: 0.15, look: -0.6, headTilt: -6, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } }, ease: easeOut },
    { f: 24, p: { look: 0.6, headTilt: 4 } },
  ]);
  const cx = st.x + 260;
  const cy = st.y - 50;
  const z = kf(t, [[0, 2.3], [len, 2.45]]);
  const head = toScreen(cx, cy, z, toWorld(pose, { x: 0, y: -176 }));
  return (
    <g>
      <g transform={camT(cx, cy, z)}>
        <Street t={t + 400} id="c19s" veil={0.22} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [18, 'worried']]) }} rimId="rimR" shadow={0.6} />
        <Foreground blur={16}>
          <rect x={cx + 330} y={cy - 600} width={46} height={1400} fill="#100E16" />
          <rect x={cx + 300} y={cy - 160} width={110} height={36} rx={8} fill="#100E16" />
        </Foreground>
      </g>
      <FocusRings x={head.x} y={head.y} t={t - 16} r0={90} />
    </g>
  );
};

/** One loop of the same morning at the neighbour's (identical for the same t): Pip walks past, she waters the plant. */
const SameMorning: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const nb: Pose = { ...basePose, ...frontStand(1240, 1.4), yaw: -0.45, facing: -1, look: -0.3, armL: { a: 60 + Math.sin(t / 8) * 6, b: 30 }, armR: { a: 12, b: -8 } };
  const can = toWorld(nb, joints(nb).armL.end);
  const px = 140 + t * 9;
  const pip = walkPose(px, t * 0.5, frontStand(px, 1.4).y + 140 * 1.4, 1.4, { yaw: 0.6 }, 1);
  return (
    <g>
      <NeighbourFront t={t} id={id} />
      <Neighbour pose={{ ...nb, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <WateringCan x={can.x} y={can.y} rot={40} s={1.2} t={t} />
      <Hero look={PIP} pose={{ ...pip, expr: 'neutral' }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- C20: split screen: NGÀY #7 and NGÀY #8 play the same morning, frame for frame ----------
export const C20: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#0E0C16" />
    {[0, 1].map((k) => (
      <g key={k}>
        <svg x={30 + k * 945} y={250} width={915} height={515} viewBox="0 0 1920 1080">
          <SameMorning t={t + 10} id={`c20p${k}`} />
        </svg>
        <rect x={30 + k * 945} y={250} width={915} height={515} fill="none" stroke="#F6EFE3" strokeWidth={5} rx={4} />
        <DayCounter x={30 + k * 945 + 457} y={170} n={7 + k} t={t - 2 - k * 4} s={0.95} />
      </g>
    ))}
    {/* the frames match: tick marks pulsing in sync under both */}
    {[0, 1].map((k) => (
      <g key={`m${k}`} transform={`translate(${30 + k * 945 + 457} 850)`}>
        <rect x={-260} y={-14} width={520} height={28} rx={14} fill="#FFFFFF" opacity={0.1} />
        <rect x={-260} y={-14} width={520 * ((t % 86) / 86)} height={28} rx={14} fill="#5CE1E6" />
      </g>
    ))}
    <text x={960} y={196} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={90} fill="#5CE1E6">=</text>
  </g>
);

// ---------- C21: medium-wide: Pip waves at the neighbour one minute early; she startles, then waves back; 07:15 -> 07:14 ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const pip: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, ...frontStand(640, 1.5), yaw: 0.5, facing: 1, look: 0.6, armR: { a: 12, b: -8 }, armL: { a: 10, b: -8 } } },
    { f: 8, p: { armR: { a: 150, b: 20 }, handR: 'open' }, ease: easeOut },
    { f: 16, p: { armR: { a: 138, b: 34 } } },
    { f: 24, p: { armR: { a: 152, b: 18 } } },
    { f: 32, p: { armR: { a: 140, b: 32 } } },
    { f: 44, p: { armR: { a: 150, b: 20 } } },
  ]);
  const nb: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, ...frontStand(1220, 1.5), yaw: -0.5, facing: -1, look: -0.5, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 16, p: { squash: -0.06, headTilt: -6 }, ease: easeOut },
    { f: 22, p: { squash: 0, headTilt: 0 } },
    { f: 30, p: { armL: { a: 150, b: 20 } }, ease: easeOut },
    { f: 40, p: { armL: { a: 140, b: 32 } } },
    { f: 50, p: { armL: { a: 152, b: 18 } } },
  ]);
  const flipped = t >= 8;
  return (
    <g>
      <g transform={camT(kf(t, [[0, 940], [len, 960]]), 610, kf(t, [[0, 1.12], [len, 1.2]]))}>
        <NeighbourFront t={t + 60} id="c21f" />
        <Neighbour pose={{ ...nb, ...faceAt(t, [[0, 'neutral'], [16, 'shock'], [28, 'happy']]) }} rimId="rimL" shadow={0.5} />
        <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
        <Foreground blur={16}>
          <path d="M -60 1120 L 120 980 L 300 960 L 330 990 L 150 1010 L 40 1120 Z" fill="#0E0C14" />
          <ellipse cx={330} cy={930} rx={60} ry={40} fill="#0E0C14" />
          <path d="M 300 960 L 320 930" stroke="#0E0C14" strokeWidth={14} />
        </Foreground>
      </g>
      <FlipClock x={1560} y={150} s={0.42} time="07:14" from="07:15" flipAt={6} t={t} cyan={flipped ? 0.8 : 0} />
      {flipped ? <Glow x={1560} y={150} r={260} kind="cool" o={0.3 * clamp((t - 6) / 6)} /> : null}
    </g>
  );
};

// ---------- C22: schematic: the day forks: 07:15 runs on grey (same events), 07:14 lights a brand-new branch ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const up = 'M 620 540 C 760 540 760 300 1000 300 L 1840 300';
  const dn = 'M 620 540 C 760 540 760 790 1000 790 L 1840 790';
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="c22s" />
      <path d="M 300 540 L 620 540" stroke={SCH.line} strokeWidth={10} strokeLinecap="round" />
      <path d={up} stroke={SCH.dim} strokeWidth={8} fill="none" strokeDasharray="22 16" opacity={0.7} />
      <g style={{ filter: `drop-shadow(0 0 14px ${SCH.glow})` }}><DrawOn d={dn} t={t - 4} dur={22} color={SCH.live} width={10} /></g>
      <PipHeadIcon x={250} y={540} s={1.4} t={t} />
      {(['cat', 'pot', 'rain'] as const).map((k, i) => <BranchIcon key={k} kind={k} x={1080 + i * 270} y={300} s={0.9} o={0.55} />)}
      {(['star', 'bike', 'heart'] as const).map((k, i) => {
        const at = 12 + i * 6;
        const p = easeOut(clamp((t - at) / 8));
        return p > 0 ? <BranchIcon key={k} kind={k} x={1080 + i * 270} y={790} s={0.9 * (0.5 + 0.5 * p)} on o={p} /> : null;
      })}
      <text x={800} y={290} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill={SCH.dim}>07:15</text>
      <text x={800} y={860} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill={SCH.live} opacity={clamp((t - 6) / 6)}>07:14</text>
    </g>
  );
};
