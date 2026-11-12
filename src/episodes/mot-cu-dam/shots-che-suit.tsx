import React from 'react';
import {
  Hero, Pose, basePose, joints, toWorld, poseAt, faceAt, kf, clamp, easeOut, easeInOut, backOut, camT, LEG_LEN, HEAD, Street, streetStand, walkPose,
  Tabletop, LightVeil, Glow, Schematic, SchLabel, FONT, UI, ShotProps,
} from '../../engine';
import { ArmHand } from '../tien-vo-han/chd-props-cast-and-scenes';
import { Gate, Tablet, PipSilhouette, Contract, SUIT, PIP } from './che-props-suit-and-drone';

// Chapter E, beat "the suit" (E1-E8): an afternoon, the man in the suit waits at Pip's alley gate; the tablet shows
// Pip's silhouette turning into a weapon blueprint; the contract; Pip shakes his head.

const GATE = streetStand(-5.0, 6, { sidewalk: true });
const GROUND = GATE.y + LEG_LEN * GATE.scale;

/** Afternoon: the VN street with a warm amber wash; blur 0 = sharp. */
const Afternoon: React.FC<{ t: number; id: string; blur?: number }> = ({ t, id, blur = 0 }) => (
  <g>
    <g filter={blur ? `url(#blur${blur})` : undefined}>
      <Street t={t + 30} id={id} veil={0.2} />
      <rect x={-400} y={-300} width={2720} height={1700} fill="#FFB060" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
    </g>
  </g>
);

// ---------- E1: wide, the afternoon alley; the man in the suit walks up to Pip's gate and stops ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const walkEnd = 52;
  const k = easeOut(clamp(t / walkEnd));
  const z = 16 - 9.6 * k; // depth along the sidewalk
  const p = streetStand(-5.0, z, { sidewalk: true });
  const walking = t < walkEnd;
  const pose: Pose = walking
    ? walkPose(p.x, t * 0.55, p.y + LEG_LEN * p.scale, p.scale, { yaw: 0.15, tilt: 0 })
    : { ...basePose, ...p, yaw: 0.3, armL: { a: 8, b: 6 }, armR: { a: 14, b: 10 }, ...faceAt(t, [[0, 'tired']]) };
  const g = streetStand(-5.0, 6, { sidewalk: true });
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 600]]), 610, kf(t, [[0, 1.5], [len, 1.9]]))}>
      <Afternoon t={t} id="e1s" />
      <Gate x={g.x - 130} y={g.y + LEG_LEN * g.scale + 4} s={0.5} />
      <Hero look={SUIT} pose={{ ...pose, y: walking ? pose.y : g.y + 0 }} rimId="rimR" shadow={0.5} />
    </g>
  );
};

// ---------- E2: medium, he waits at the gate, unsmiling, checks his watch ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const watch = easeInOut(clamp((t - 6) / 12)) * (1 - easeInOut(clamp((t - 28) / 10)));
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 1180, y: 700, scale: 1.1, yaw: -0.55, armL: { a: 6, b: 8 }, armR: { a: 14, b: 10 }, look: -0.6 } },
  ]);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Afternoon t={t} id="e2s" blur={6} />
      <Gate x={640} y={900} s={1.5} />
      <Hero look={SUIT} pose={{ ...pose, armR: { a: 14 + 70 * watch, b: 10 + 95 * watch }, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={0.6} />
    </g>
  );
};

// ---------- E3: close-up, his unsmiling face; a slow push ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 3.2], [len, 3.7]]);
  const pose: Pose = {
    ...basePose, x: 960, y: 540 - HEAD.y * sc, scale: sc, yaw: -0.25, look: kf(t, [[0, -0.5], [30, 0.4], [50, 0.1]]),
    headTilt: kf(t, [[0, 0], [len, -2]]), expr: 'tired', blink: (t > 22 && t < 25) ? 1 : 0,
  };
  return (
    <g>
      <Afternoon t={t} id="e3s" blur={16} />
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0A12" opacity={0.3} />
      <Glow x={1250} y={380} r={700} o={0.25} />
      <Hero look={SUIT} pose={pose} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- E4: insert, the tablet: Pip's silhouette turns into a weapon blueprint with a target on its chest ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const m = easeInOut(clamp((t - 16) / 40));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#3A3248" grain="#2E283A" lip="#4A4258" floor="#14101C" floorLines="#100C16" />
      <LightVeil id="e4veil" lights={[[960, 540, 900]]} o={0.5} />
      <Tablet x={940} y={520} w={1240} h={760} rot={-3} id="e4t">
        <rect x={-640} y={-390} width={1280} height={780} fill="#0C1626" />
        <path d="M -640 -300 H 640 M -640 0 H 640 M -640 300 H 640 M -400 -390 V 390 M 0 -390 V 390 M 400 -390 V 390" stroke="#17315A" strokeWidth={2} />
        <g transform="translate(0 330) scale(1.55)"><PipSilhouette m={m} t={t} /></g>
        <text x={-590} y={-330} fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill={m > 0.5 ? '#FF5A4A' : '#9FE8FF'} letterSpacing={4} opacity={t % 20 < 14 ? 1 : 0.5}>{m > 0.5 ? 'MỤC TIÊU' : 'ĐANG QUÉT'}</text>
        <rect x={-590} y={-290} width={clamp(m) * 280 + 20} height={12} rx={6} fill="#FFB347" />
      </Tablet>
      <ArmHand look={SUIT} x={1530} y={800} fx={1900} fy={1300} rot={-25} s={4.4} width={120} />
    </g>
  );
};

// ---------- E5: medium, he speaks, the tablet held up in his hand beside him ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 1250, y: 690, scale: 1.2, yaw: -0.45, armL: { a: 10, b: 8 }, armR: { a: 50, b: 80 }, look: -0.5 } },
    { f: 20, p: { armR: { a: 62, b: 70 }, headTilt: 3 } },
    { f: 40, p: { armR: { a: 46, b: 84 }, headTilt: -2 } },
  ]);
  const full: Pose = { ...pose, ...faceAt(t, [[0, 'tired']]) };
  const hand = toWorld(full, joints(full).armR.end);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.05], [len, 1.0]])}) translate(-960 -540)`}>
      <Afternoon t={t} id="e5s" blur={10} />
      <Gate x={420} y={900} s={1.4} />
      <Hero look={SUIT} pose={full} rimId="rimR" shadow={0.6} />
      <Tablet x={hand.x + 130} y={hand.y + 10} w={300} h={190} rot={-8} id="e5t">
        <rect x={-150} y={-95} width={300} height={190} fill="#0C1626" />
        <g transform="translate(0 85) scale(0.4)"><PipSilhouette m={1} t={t} /></g>
      </Tablet>
    </g>
  );
};

// ---------- E6: the blueprint full screen: the target outline and a red stamp "VŨ KHÍ" ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const st = clamp((t - 10) / 8);
  const sc = backOut(st);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <Schematic t={t} id="e6sch" />
      <g transform="translate(560 960) scale(2.2)"><PipSilhouette m={1} t={t} /></g>
      <SchLabel x={1180} y={250} t={t - 4} text="CHIỀU CAO 1,62 m" size={38} />
      <SchLabel x={1180} y={320} t={t - 8} text="LỰC ĐẤM: KHÔNG ĐO ĐƯỢC" size={38} color="#FF8A3D" />
      <g transform={`translate(1230 680) rotate(-8) scale(${sc})`} opacity={st}>
        <rect x={-330} y={-100} width={660} height={200} rx={16} fill="none" stroke="#FF3B3B" strokeWidth={14} />
        <text x={0} y={42} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={140} fill="#FF3B3B" letterSpacing={6}>VŨ KHÍ</text>
      </g>
    </g>
  );
};

// ---------- E7: insert, he holds out the contract: HỢP ĐỒNG ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 18));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.07]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#5A4636" grain="#4C3B2D" />
      <LightVeil id="e7veil" lights={[[900, 560, 700]]} o={0.5} />
      <Contract x={1700 - 740 * k} y={560 + Math.sin(t / 9) * 3} rot={-5} s={1.05} />
      <ArmHand look={SUIT} x={2000 - 740 * k} y={380} fx={2500} fy={1100} rot={110} s={5} width={130} />
    </g>
  );
};

// ---------- E8: medium, Pip at his gate shakes his head ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 900, y: 690, scale: 1.2, yaw: 0.1, armL: { a: 6, b: 6 }, armR: { a: 8, b: 8 } } },
    { f: 6, p: { yaw: 0.45, headTilt: 6 } },
    { f: 12, p: { yaw: -0.3, headTilt: -6 } },
    { f: 18, p: { yaw: 0.4, headTilt: 5 } },
    { f: 24, p: { yaw: 0.0, headTilt: 0 } },
  ]);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <Afternoon t={t} id="e8s" blur={10} />
      <Gate x={1300} y={900} s={1.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0.6} />
    </g>
  );
};
