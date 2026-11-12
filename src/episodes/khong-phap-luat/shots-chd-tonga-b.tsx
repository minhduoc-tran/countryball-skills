import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, walkPose, joints, toWorld, kf, clamp, easeOut, backOut, camT, Glow, FONT, Sparkle, LEG_LEN, Schematic, SCH, LOOKS, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { TickStamp } from '../khong-ai-ngheo/chb-cards-and-marks';
import { Sea, Beach, Foam } from './chd-tonga-scenery';
import { Boy, Fire, Novel, RescueBoat } from './chd-tonga-props';

// Chapter D, "5 twist: tonga" part 2 (177.85-190.81 s, look memory): D8 the novel crossed out, D9 they write rules,
// D10 work in pairs, D11 turns at the fire, D12 quarrel / apart / make up, D13 rescue, D14 6/6 and "ĐÓ LÀ THẬT".

const hipY = (ground: number, s: number) => ground - LEG_LEN * s;

// ---------- D8: a closed, title-less novel gets a big red X; a gentle bob ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960 + (t > 34 && t < 42 ? Math.sin(t * 3) * 6 : 0), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <rect x={-400} y={-300} width={2720} height={1700} fill="#4A3524" />
    <Glow x={960} y={520} r={820} o={0.5} />
    <Novel x={960} y={540 + Math.sin(t / 9) * 8} s={1.0} rot={kf(t, [[0, -5], [len, 2]])} cross={clamp((t - 22) / 24)} />
    <Sparkle x={1360} y={250} t={t - 44} s={1.2} />
  </g>
);

// ---------- D9: boys gather round a bark slate; three rules scratch themselves in, each with a tick ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Sea t={t} id="d9" horizon={400} />
    <Beach y={690} t={t} id="d9b" />
    <path d="M 960 520 V 820" stroke="#4A3220" strokeWidth={16} strokeLinecap="round" />
    <rect x={800} y={340} width={320} height={230} rx={16} fill="#8A6440" stroke="#3E2814" strokeWidth={7} />
    {[0, 1, 2].map((r) => {
      const p = easeOut(clamp((t - 6 - r * 8) / 8));
      return (
        <g key={r} opacity={p > 0 ? 1 : 0}>
          <path d={`M 830 ${400 + r * 66} L ${830 + 74 * p} ${400 + r * 66 + 12 * p} L ${830 + 130 * p} ${400 + r * 66 - 26 * p}`} stroke="#6AD08A" strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={`M 990 ${402 + r * 66} H ${990 + 100 * p}`} stroke="#F2E6C8" strokeWidth={11} strokeLinecap="round" />
        </g>
      );
    })}
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const left = i < 3;
      const k = left ? i : i - 3;
      const sc = [0.84, 0.9, 0.8][k];
      const pose: Pose = {
        ...basePose, x: left ? 330 + k * 170 : 1590 - k * 170, y: hipY(850 + (k % 2) * 20, sc), scale: sc, yaw: left ? 0.5 : -0.5, facing: left ? 1 : -1,
        ...(i === 1 ? { armR: { a: 100 + 6 * Math.sin(t / 3), b: -6 }, handR: 'point' as const } : {}),
        ...(i === 4 ? { armL: { a: 100 + 6 * Math.sin(t / 3), b: -6 }, handL: 'point' as const } : {}),
        ...faceAt(t, [[0, 'happy']]),
      };
      return <Boy key={i} i={i} pose={pose} rimId={left ? 'rimR' : 'rimL'} />;
    })}
  </g>
);

// ---------- D10: two boys work as a pair: one digs, one waters; sprouts grow ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const S = 1.0;
  const dig = Math.sin(t / 3.2);
  const a: Pose = { ...basePose, x: 640, y: hipY(860, S), scale: S, yaw: 0.8, facing: 1, tilt: 16, armR: { a: 70 + 40 * dig, b: 10 }, ...faceAt(t, [[0, 'happy']]) };
  const b: Pose = { ...basePose, x: 1190, y: hipY(860, S), scale: S, yaw: -0.8, facing: -1, tilt: -14, armL: { a: 84, b: -12 + 6 * Math.sin(t / 4) }, ...faceAt(t, [[0, 'happy']]) };
  const ha = toWorld(a, joints(a).armR.end);
  const hb = toWorld(b, joints(b).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 600, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Sea t={t} id="d10" horizon={380} />
      <Beach y={640} t={t} id="d10b" />
      <ellipse cx={920} cy={880} rx={520} ry={46} fill="#5E4026" stroke="#3A2616" strokeWidth={5} />
      {[0, 1, 2, 3, 4].map((k) => {
        const h = 20 + 70 * easeOut(clamp((t - 6 - k * 6) / 22));
        return (
          <g key={k} transform={`translate(${770 + k * 90} 884)`}>
            <path d={`M 0 0 Q 4 ${-h * 0.5} 0 ${-h}`} stroke="#4E8A3C" strokeWidth={8} fill="none" strokeLinecap="round" />
            <path d={`M 0 ${-h} q -34 -6 -40 -34 q 34 -2 40 34 q 34 -8 42 -34 q -36 -4 -42 34 Z`} fill="#6AA84C" stroke="#2F5A26" strokeWidth={3} />
          </g>
        );
      })}
      <Boy i={0} pose={a} />
      <Boy i={1} pose={b} />
      <path d={`M ${ha.x} ${ha.y} L ${ha.x + 70} ${ha.y + 110}`} stroke="#5E4026" strokeWidth={9} strokeLinecap="round" />
      <path d={`M ${hb.x - 18} ${hb.y - 8} q 18 30 44 -6 Z`} fill="#6E4A2C" stroke="#2A1810" strokeWidth={4} />
      {Array.from({ length: 5 }).map((_, k) => {
        const p = ((t / 14 + k / 5) % 1);
        return <circle key={k} cx={hb.x - 26 - p * 30} cy={hb.y + 6 + p * 90} r={5 * (1 - p * 0.4)} fill="#9CD8E8" opacity={1 - p * 0.6} />;
      })}
    </g>
  );
};

// ---------- D11: the fire never goes out: dusk falls, one boy hands the watch to the next ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const night = clamp(t / (len - 4));
  const G = 860;
  const S = 0.95;
  const seated: Pose = { ...basePose, x: 640, y: G - 68 * S - 22, scale: S, yaw: 1, facing: 1, legL: { a: 80, b: -80 }, legR: { a: 80, b: -80 }, armR: { a: 50, b: 40 }, ...faceAt(t, [[0, 'tired']]) };
  const up = poseAt(t, [{ f: 0, p: seated }, { f: 20, p: {} }, { f: 30, p: { y: hipY(G, S), legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 }, armR: { a: 12, b: -6 } } }]);
  const a: Pose = t < 34 ? up : walkPose(640 - (t - 34) * 9, (t - 34) * 0.6, G, S, { ...faceAt(t, [[0, 'tired']]) }, -1);
  const bx = kf(t, [[0, 1420], [24, 1160]], easeOut);
  const b: Pose = t < 24 ? walkPose(bx, t * 0.6, G, S, { ...faceAt(t, [[0, 'neutral']]) }, -1) : { ...basePose, x: bx, y: hipY(G, S), scale: S, yaw: -0.8, facing: -1, armL: { a: 50, b: 30 }, ...faceAt(t, [[0, 'happy']]) };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Sea t={t} id="d11" horizon={420} night={night} />
      <Beach y={700} t={t} id="d11b" />
      <rect x={-200} y={-300} width={2320} height={1700} fill="#101A38" opacity={0.0} />
      <ellipse cx={700} cy={G - 20} rx={90} ry={16} fill="#6E4A2C" stroke="#2A1810" strokeWidth={4} opacity={t < 34 ? 1 : 0} />
      <Glow x={960} y={G - 90} r={300 + 260 * night} o={0.25 + 0.55 * night} />
      <Fire x={960} y={G} s={1.4} t={t} size={0.7 + 0.4 * night} />
      <Boy i={2} pose={a} rimId="rimR" />
      <Boy i={4} pose={b} rimId="rimL" />
    </g>
  );
};

// ---------- D12: an argument, each goes to an opposite end of the island to cool off, then they shake hands ----------
const ring = (t: number, x: number, y: number) => {
  const r = (t % 24) / 24;
  return <circle cx={x} cy={y} r={30 + r * 70} fill="none" stroke="#BFE8D8" strokeWidth={6 * (1 - r)} opacity={1 - r} />;
};
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const G = 880;
  const S = 0.92;
  const ax = kf(t, [[0, 840], [10, 840], [26, 540], [50, 540], [68, 840], [len, 840]], (v) => v);
  const bx = kf(t, [[0, 1080], [10, 1080], [26, 1380], [50, 1380], [68, 1080], [len, 1080]], (v) => v);
  const moving = (t >= 10 && t < 26) || (t >= 50 && t < 68);
  const phase = t * 0.6;
  const argue = t < 10;
  const shake = t >= 72 ? Math.sin(t * 1.2) * 6 : 0;
  const pa: Pose = moving
    ? walkPose(ax, phase, G, S, { ...faceAt(t, [[0, 'worried']]) }, t < 40 ? -1 : 1)
    : { ...basePose, x: ax, y: hipY(G, S), scale: S, yaw: t < 50 ? -0.7 : 0.6, facing: t < 50 ? -1 : 1, ...(argue ? { armR: { a: 80 + 12 * Math.sin(t), b: 0 }, handR: 'point' as const } : {}), ...(t >= 68 ? { armR: { a: 86 + shake, b: -4 } } : {}), blink: t >= 26 && t < 50 ? 1 : 0, expr: argue ? 'oops' : t >= 68 ? 'happy' : 'neutral' };
  const pb: Pose = moving
    ? walkPose(bx, phase, G, S, { ...faceAt(t, [[0, 'worried']]) }, t < 40 ? 1 : -1)
    : { ...basePose, x: bx, y: hipY(G, S), scale: S, yaw: t < 50 ? 0.7 : -0.6, facing: t < 50 ? 1 : -1, ...(argue ? { armL: { a: 80 + 12 * Math.cos(t), b: 0 }, handL: 'point' as const } : {}), ...(t >= 68 ? { armL: { a: 86 - shake, b: -4 } } : {}), blink: t >= 26 && t < 50 ? 1 : 0, expr: argue ? 'shock' : t >= 68 ? 'happy' : 'neutral' };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.04]]))}>
      <Sea t={t} id="d12" horizon={400} />
      <Beach y={680} t={t} id="d12b" />
      <Boy i={0} pose={pa} />
      <Boy i={3} pose={pb} />
      {argue ? [0, 1].map((k) => <path key={k} d={`M ${k ? 1000 : 780} ${hipY(G, S) - 270} l 20 -26 l -10 0 l 24 -30`} stroke="#E0562A" strokeWidth={8} fill="none" strokeLinecap="round" />) : null}
      {t >= 28 && t < 50 ? <g>{ring(t, ax, hipY(G, S) - 190)}{ring(t + 8, bx, hipY(G, S) - 190)}</g> : null}
      {t >= 70 ? <Sparkle x={960} y={hipY(G, S) - 10} t={t - 70} s={1.5} /> : null}
    </g>
  );
};

// ---------- D13: a boat comes in; all six boys jump and wave on the shore ----------
export const D13: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[0, 2300], [len, 1320]], easeOut);
  const crew = (x: number, s: number, ph: number): Pose => ({ ...basePose, x, y: -40 - LEG_LEN * s, scale: s, yaw: -0.4, facing: -1, armR: { a: 150 + 20 * Math.sin(t / 3 + ph), b: 8 }, ...faceAt(t, [[0, 'happy']]) });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 560, 1.0)}>
      <Sea t={t} id="d13" horizon={440} />
      <Beach y={760} t={t} id="d13b" />
      <Foam x={1180} y={760} w={260} t={t} />
      <RescueBoat x={bx} y={660 + Math.sin(t / 6) * 6} s={0.98} rot={Math.sin(t / 8) * 2} t={t}>
        <Hero look={LOOKS.mo} pose={crew(-120, 0.5, 0)} rimId="rimL" shadow={0} />
        <Hero look={LOOKS.suit} pose={crew(-10, 0.5, 2)} rimId="rimL" shadow={0} />
      </RescueBoat>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const sc = 0.78 + (i % 3) * 0.04;
        const jump = Math.abs(Math.sin(t / 3.4 + i * 1.3)) * 34;
        const pose: Pose = { ...basePose, x: 200 + i * 150, y: hipY(900 + (i % 2) * 26, sc) - jump, scale: sc, yaw: 0.3, facing: 1, armL: { a: 150 + 14 * Math.sin(t / 2.6 + i), b: 8 }, armR: { a: 150 - 14 * Math.sin(t / 2.6 + i), b: 8 }, squash: jump < 4 ? 0.1 : -0.04, ...faceAt(t, [[0, 'happy']]) };
        return <Boy key={i} i={i} pose={pose} shadow={0.5} />;
      })}
    </g>
  );
};

// ---------- D14: "6/6" with six lit people, then the green "ĐÓ LÀ THẬT" stamp ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => {
  const SPLIT = 23;
  if (t >= SPLIT) return <TickStamp t={t - SPLIT} id="d14b" text="ĐÓ LÀ THẬT" />;
  const pop = 0.88 + 0.12 * backOut(clamp((t + 2) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.04]])}) translate(-960 -540)`}>
      <Schematic t={t} id="d14" />
      <g transform={`translate(960 520) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={380} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>6/6</text>
      </g>
      {[0, 1, 2, 3, 4, 5].map((i) => <PersonIcon key={i} x={620 + i * 136} y={800} s={1.5} on={t > i * 2} glow={t > i * 2} />)}
      <Sparkle x={1500} y={330} t={t - 6} s={1.2} />
    </g>
  );
};
