import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, walkPose, Schematic, SCH, FONT, Glow, Sparkle, Marquee, Foreground, ShotProps,
} from '../../engine';
import { WorldMap } from '../tien-vo-han/chb-hunger-map-props';
import { GROUND_Y } from './chb-village-scenes';
import { BulbLine } from './chb-props-world';
import { CaneField, FARMER, FarmerHat, HeadProfile, TagPill } from './chb-props-mind';
import { TestPanel, Pocket } from './chb-test-panel';

// Chapter B, "Rồi đến cái đầu" (1/2): a head with a light bulb, scientists follow cane farmers (a selection box), the map
// label ẤN ĐỘ, BEFORE harvest: the farmer worried, the empty pocket, the test with a low score.

// ---------- B21: "Rồi đến cái đầu": a head in profile, a bulb glowing inside it ----------
export const B21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 980]]), 520, kf(t, [[0, 1.0], [len, 1.16]]))}>
    <rect x={-400} y={-300} width={2720} height={1500} fill="#141A2E" />
    <Glow x={960} y={460} r={760} kind="cool" o={0.35} />
    <HeadProfile x={960} y={560} s={1.6} fill="#27304C" stroke="#9FB4E0" clipId="b21c">
      <Glow x={-10} y={-90} r={330} o={0.9} />
      <g transform="translate(-10 -70)"><BulbLine x={0} y={0} s={1.1} on={1} t={t} /></g>
    </HeadProfile>
    <Sparkle x={1200} y={300} t={t - 6} s={1.3} />
    <Sparkle x={700} y={380} t={t - 14} s={1} />
  </g>
);

// ---------- B22: wide, cane field: the farmer walks the row, a selection box follows him (scientists watching) ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const x = 700 + t * 3.4;
  const w = walkPose(x, t * 0.5, GROUND_Y + 70, 1.0, { look: 0.3 });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1060]]), 560, kf(t, [[0, 1.0], [len, 1.18]]))}>
      <CaneField id="b22" t={t} mood="dry" />
      <Hero look={FARMER} pose={{ ...w, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={1} />
      <FarmerHat pose={w} />
      <Marquee x={x - 150} y={360} w={300} h={560} t={t - 14} color="#7FD4FF" label="THEO DÕI" />
    </g>
  );
};

// ---------- B23: the map zooms toward India, a pin pulses, the label "ẤN ĐỘ" ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => {
  const pin = backOut(clamp((t - 4) / 8));
  const ring = (t / 18) % 1;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1200]]), kf(t, [[0, 540], [len, 470]]), kf(t, [[0, 1.0], [len, 1.5]]))}>
      <Schematic t={t} id="b23" />
      <WorldMap x={110} y={130} s={1.7} color="#27406A" />
      <path d="M 1236 452 Q 1300 430 1364 452 Q 1346 500 1300 566 Q 1254 500 1236 452 Z" fill="#FF8A3D" opacity={0.6} stroke="#FFB15A" strokeWidth={4} />
      <g transform="translate(1300 520)">
        <circle r={30 + ring * 70} fill="none" stroke={SCH.glow} strokeWidth={4 * (1 - ring)} opacity={1 - ring} />
        <g transform={`scale(${pin})`}>
          <path d="M 0 0 C -34 -42 -34 -90 0 -90 C 34 -90 34 -42 0 0 Z" fill="#FF8A3D" stroke="#F6EFE3" strokeWidth={5} />
          <circle cx={0} cy={-62} r={10} fill="#F6EFE3" />
        </g>
      </g>
      <g transform={`translate(1300 360) scale(${easeOut(clamp((t - 8) / 8))})`}>
        <rect x={-190} y={-62} width={380} height={96} rx={48} fill="#0B0816" opacity={0.8} />
        <text y={20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={68} fill="#F6EFE3" letterSpacing={4}>ẤN ĐỘ</text>
      </g>
    </g>
  );
};

// ---------- B24: BEFORE harvest: the farmer in the dry field, worried, pockets turned in ----------
export const B24: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 690, scale: 1.12, yaw: 0.3, look: 0.4, headTilt: -5, tilt: 3, armL: { a: 14, b: -14 }, armR: { a: 14, b: -14 } } },
    { f: 20, p: { headTilt: -8, tilt: 5 } },
  ]);
  const bob = Math.sin(t / 10) * 2.5;
  const p = { ...pose, y: pose.y - bob };
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.3], [len, 1.5]]))}>
      <CaneField id="b24" t={t} mood="dry" />
      <rect x={-400} y={-300} width={2720} height={1500} fill="#1A2230" opacity={0.25} />
      <Hero look={FARMER} pose={{ ...p, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={1} />
      <FarmerHat pose={p} />
      <path d={`M 1060 ${440 + Math.sin(t / 5) * 4} q 12 26 0 36 q -12 -10 0 -36`} fill="#9FD6F2" stroke="#4A7A96" strokeWidth={3} />
      <TagPill x={360} y={312} text="TRƯỚC THU HOẠCH" />
    </g>
  );
};

// ---------- B25: insert, the almost-empty pocket: one coin falls out ----------
export const B25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
    <Pocket t={t} />
    <Foreground blur={12}><rect x={-100} y={1040} width={2200} height={200} fill="#150E08" /></Foreground>
  </g>
);

// ---------- B26: the test: worried farmer, a pattern sheet, a LOW score bar ----------
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.28 * easeOut(clamp(t / 16));
  return (
    <g transform={`translate(960 600) scale(${kf(t, [[0, 1.2], [len, 1.32]])}) translate(-480 -540)`}>
      <TestPanel id="b26" t={t} mood="before" score={sc} tag="TRƯỚC THU HOẠCH" />
    </g>
  );
};
