import React from 'react';
import { kf, clamp, easeOut, easeIn, easeInOut, camT, faceAt, poseAt, toWorld, joints, ShotProps, Glow, Hero, Pose, basePose, Schematic, SchLabel, SCH, FONT, Study, Desk, Sparkle, Foreground } from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { FactStamp, BigNum } from '../dai-duong-can/kit-hud';
import { RewindWave } from './kit-rewind-fx';
import { PipInBed, PIP, sitPose } from './chc-pip-in-bed';
import { toScreen } from './chc-forgetting-props';
import { RESEARCHER, DayBar, EyeIcon, BeerGlass, ReactionBox, Meter, HeavyCloud, Zs, popIn } from './chc-tired-props';

// Chapter C, beat "5 tired" (138.87-156.91 s): C11 Pip nodding off at night, C12 the waking day bar 06:00 -> 24:00
// (18 GIỜ), C13 a sleep researcher times Pip on a reaction tester, C14 "17-19 GIỜ KHÔNG NGỦ", C15 the late slap on the
// button, C16 17-19 GIỜ ≈ 0,05% + ĐÓ LÀ THẬT, C17 06:00: body refreshed (sparkles), C18 but the mind is grey.

// THE 06:00 bedroom framing used for every reset in this chapter (C3 is its medium; C17 the wide)
export const RESET_CAM = { x: 830, y: 548, z: 1.32 };

// ---------- C11: close-up at night: Pip in bed, heavy lids, head drooping and jerking up, a "z" drifting ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const nod = Math.max(0, Math.sin((t / 30) * Math.PI * 1.4));
  const pose = sitPose({ yaw: 0.25, headTilt: -4 + 14 * nod, tilt: 3 + 4 * nod, look: 0.2 });
  const head = toWorld(pose, { x: 0, y: -176 });
  const z = kf(t, [[0, 3.0], [len, 3.3]]);
  const hs = toScreen(head.x + 30, head.y + 30, z, head);
  return (
    <g>
      <g transform={camT(head.x + 30, head.y + 30, z)}>
        <PipInBed t={t + 200} id="c11b" dawn={0} clock="23:59" lamp={1} pose={{ ...pose, expr: 'tired', blink: nod > 0.8 ? 1 : 0 }} />
      </g>
      <Zs x={hs.x + 170} y={hs.y - 120} t={t} s={1.6} />
    </g>
  );
};

// ---------- C12: schematic: the waking day fills 06:00 -> 24:00, the eye riding it never closes; "18 GIỜ" ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <Schematic t={t} id="c12s" />
    <DayBar x={330} y={660} w={1260} t={t} p={(t - 6) / 62} />
  </g>
);

// ---------- C13: medium: the study as a lab: a researcher with a clipboard and stopwatch times tired Pip on the tester ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const pip: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 860, y: 712, scale: 1, yaw: 0.3, facing: 1, look: 0.5, headTilt: 8, tilt: 4, armR: { a: 40, b: 30 }, armL: { a: 14, b: 20 } } },
    { f: 20, p: { headTilt: 14 } },
    { f: len, p: { headTilt: 10 } },
  ]);
  const doc: Pose = { ...basePose, x: 1450, y: 700, scale: 1.02, yaw: -0.5, facing: -1, look: -0.6, armL: { a: 70, b: 50 }, armR: { a: 20, b: -10 }, headTilt: -3 + Math.sin(t / 10) * 2 };
  const clip = toWorld(doc, joints(doc).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Study t={t + 120} id="c13s" veil={0.4} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={0} />
      <Hero look={RESEARCHER} pose={{ ...doc, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.5} />
      {/* the clipboard in her hand, a stopwatch on it */}
      <g transform={`translate(${clip.x - 30} ${clip.y - 40}) rotate(-12)`}>
        <rect x={-50} y={-66} width={100} height={132} rx={8} fill="#B88A5A" stroke="#2A1E18" strokeWidth={4} />
        <rect x={-40} y={-50} width={80} height={106} fill="#F4EEDF" />
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M -30 ${-30 + k * 22} L ${10 + (k % 2) * 16} ${-30 + k * 22}`} stroke="#22315A" strokeWidth={4} />)}
        <rect x={-16} y={-74} width={32} height={14} rx={4} fill="#8A8A92" />
      </g>
      <Desk x0={560} x1={1360} y={700} laptop={false} lamp={false} />
      <ReactionBox x={980} y={660} s={0.2} light={t % 40 > 20 ? 1 : 0} press={0} />
      <Glow x={980} y={630} r={160} o={t % 40 > 20 ? 0.35 : 0} kind="cool" />
      <Foreground blur={16}>
        {[[-30, 0], [10, 40], [-60, 70], [20, 110]].map(([dx, dy], k) => <path key={k} d={`M 420 ${960 - dy} Q ${560 + dx} ${820 - dy} ${640 + dx} ${700 - dy} Q ${520 + dx} ${800 - dy} 420 ${900 - dy} Z`} fill="#0E140E" />)}
      </Foreground>
    </g>
  );
};

// ---------- C14: big number card: a bloodshot open eye, "17-19 GIỜ", "KHÔNG NGỦ" ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => (
  <BigNum t={t} len={len} id="c14n" text="17-19 GIỜ" caption="KHÔNG NGỦ" size={210}>
    <EyeIcon x={960} y={300} s={1.05} t={t} red={clamp(t / 40)} />
  </BigNum>
);

// ---------- C15: insert: the lamp goes green; a cyan ghost hand (rested) slaps at once, Pip's real hand arrives late ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => {
  const go = 6;
  const ghost = easeIn(clamp((t - go - 2) / 5));
  const real = easeIn(clamp((t - go - 14) / 20));
  const press = Math.max(ghost >= 1 && t < go + 14 ? 0.6 : 0, real >= 1 ? 1 : 0);
  const bx = 1110;
  const by = 600;
  const hy = (k: number) => 40 + (by - 60 - 40) * k;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#141824" />
      <Glow x={960} y={500} r={800} kind="cool" o={0.3} />
      <ReactionBox x={960} y={560} s={1.25} light={t >= go ? 1 : 0} press={press} />
      {t >= go ? <Glow x={772} y={520} r={360} o={0.4} kind="cool" /> : null}
      {/* the ghost (a rested reaction): cyan outline mitten, fast */}
      {t >= go + 2 && t < go + 20 ? (
        <g opacity={1 - clamp((t - go - 10) / 10)}>
          <ellipse cx={bx} cy={hy(ghost)} rx={70} ry={64} fill="none" stroke="#5CE1E6" strokeWidth={8} strokeDasharray="18 12" style={{ filter: 'drop-shadow(0 0 12px #5CE1E6)' }} />
        </g>
      ) : null}
      <InsertArm x={bx + 10} y={hy(real) - 10} fx={bx + 380} fy={-300} rot={-8} s={5} width={124} />
      {/* the two reaction bars: rested (cyan, short) and Pip's (red, long) */}
      <g transform="translate(560 940)">
        <rect x={0} y={-16} width={Math.min(1, clamp((t - go) / 4)) * 140} height={30} rx={15} fill="#5CE1E6" />
        <rect x={0} y={30} width={clamp((t - go) / 34) * 800} height={30} rx={15} fill="#FF5A48" />
      </g>
    </g>
  );
};

// ---------- C16: the equation card: eye "17-19 GIỜ" ≈ beer glass "0,05%" NỒNG ĐỘ CỒN, then the stamp ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => {
  const a = popIn(t, 2);
  const b = popIn(t, 16);
  const c = popIn(t, 26);
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
        <Schematic t={t} id="c16s" />
        <g transform={`translate(480 420) scale(${a.s})`} opacity={a.o}>
          <EyeIcon x={0} y={0} s={0.9} t={t} red={1} />
          <text x={0} y={200} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={84} fill={SCH.line}>17-19 GIỜ</text>
        </g>
        <g transform={`translate(960 430) scale(${b.s})`} opacity={b.o}>
          <text x={0} y={50} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={190} fill={SCH.glow}>≈</text>
        </g>
        <g transform={`translate(1440 420) scale(${c.s})`} opacity={c.o}>
          <BeerGlass x={0} y={110} s={0.8} t={t} fill={c.e} />
          <text x={0} y={250} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={110} fill={SCH.live} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }}>0,05%</text>
        </g>
        <SchLabel x={1440} y={760} t={t - 34} text="NỒNG ĐỘ CỒN" size={52} color={SCH.dim} />
      </g>
      <FactStamp t={t} at={78} x={960} y={900} />
    </g>
  );
};

// ---------- C17: the 06:00 wide again: the reset flash, Pip sits up and stretches, sparkles: the body is new ----------
export const C17: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: sitPose({ yaw: 0.3, headTilt: -6, armL: { a: 10, b: -6 }, armR: { a: 12, b: -6 } }) },
    { f: 14, p: { armL: { a: 160, b: 8 }, armR: { a: 158, b: 10 }, headTilt: -8, tilt: -3 }, ease: easeOut },
    { f: 34, p: { armL: { a: 150, b: 12 }, armR: { a: 148, b: 14 }, headTilt: 4, tilt: 0 } },
  ]);
  const chest = toWorld(pose, { x: 0, y: -90 });
  return (
    <g>
      <g transform={camT(RESET_CAM.x, RESET_CAM.y, kf(t, [[0, RESET_CAM.z], [len, RESET_CAM.z + 0.06]]))}>
        <PipInBed t={t + 20} id="c17b" dawn={1} clock="06:00" ring={t < 30 ? 1 : 0} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [14, 'happy']]) }} />
        {[[-70, -120, 6], [60, -160, 12], [-40, 10, 18], [80, -40, 22], [0, -230, 26]].map(([dx, dy, d], i) => (
          <Sparkle key={i} x={chest.x + dx * pose.scale} y={chest.y + dy * pose.scale} t={t - d} s={0.9} />
        ))}
      </g>
      <RewindWave t={t} t0={0} id="c17rw" cx={760} cy={430} />
    </g>
  );
};

// ---------- C18: medium: body meter full, mind meter draining; a heavy grey cloud settles over Pip's head ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: sitPose({ yaw: 0.3, headTilt: 4, tilt: 4, look: 0.3 }) }, { f: 40, p: { headTilt: 10, tilt: 6 } }]);
  const head = toWorld(pose, { x: 0, y: -176 });
  const cx = head.x + 150;
  const cy = head.y + 60;
  const z = kf(t, [[0, 2.2], [len, 2.35]]);
  const hs = toScreen(cx, cy, z, head);
  const mind = 0.9 - 0.75 * easeInOut(clamp((t - 10) / 50));
  return (
    <g>
      <g transform={camT(cx, cy, z)}>
        <PipInBed t={t + 60} id="c18b" dawn={1} clock="06:01" pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'tired']]) }} />
      </g>
      <HeavyCloud x={hs.x} y={hs.y - 300 + 140 * easeOut(clamp(t / 30))} s={1.2} t={t} />
      <Meter x={1250} y={380} w={520} p={1} label="CƠ THỂ" color="#5BE08A" t={t} />
      <Meter x={1250} y={620} w={520} p={mind} label="TÂM TRÍ" color={mind > 0.4 ? '#F2B33D' : '#FF5A48'} t={t} />
    </g>
  );
};
