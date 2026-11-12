import React from 'react';
import {
  Hero, walkPose, faceAt, Schematic, SchLabel, SCH, FONT, Glow, Sparkle, camT, kf, clamp, easeOut, backOut, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { WORKER } from './cast-looks';
import { LivingRoom, Sofa, StressFace } from './chc-lazy-props';

// Chapter C, "4 doubt: lazy", part 2 (146.23-151.03 s): C27 the sofa is empty, someone leaves for work, C28 a bar of work
// climbs a little, C29 the stress meter falls and the face relaxes.

const zoom = (t: number, len: number, a = 1.0, b = 1.08) => camT(960, 540, kf(t, [[0, a], [len, b]]));

// ---------- C27: "Họ không nằm dài ở nhà": the sofa keeps only a dent; its owner walks out of the lit door to work ----------
export const C27: React.FC<ShotProps> = ({ t, len }) => {
  const x = 900 + clamp(t / (len - 10)) * 570;
  const door = clamp(t / 8);
  const pose = walkPose(x, t * 0.5, 800, 1.05, { yaw: 1, ...faceAt(t, [[0, 'happy']]) });
  const gone = clamp((t - (len - 14)) / 10);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 580, kf(t, [[0, 1.05], [len, 1.22]]))}>
      <LivingRoom t={t + 60} id="c27r" open={door} />
      <Sofa x={800} y={830} s={1.15} dent={1} />
      <g opacity={1 - gone}><Hero look={WORKER} pose={pose} rimId="rimR" shadow={0} /></g>
      <Glow x={1530} y={520} r={420} o={0.4 * door} />
    </g>
  );
};

// ---------- C28: two bars of work; the second one (cash, no strings) is a little taller ----------
export const C28: React.FC<ShotProps> = ({ t, len }) => {
  const a = easeOut(clamp((t - 2) / 14));
  const b = easeOut(clamp((t - 10) / 16));
  const base = 860;
  return (
    <g transform={zoom(t, len, 1.0, 1.08)}>
      <Schematic t={t} id="c28" />
      <path d="M 360 860 H 1560" stroke={SCH.dim} strokeWidth={6} strokeLinecap="round" />
      <rect x={560} y={base - 380 * a} width={220} height={380 * a} rx={10} fill={SCH.dim} opacity={0.85} />
      <rect x={1100} y={base - 380 * a - 60 * b} width={220} height={380 * a + 60 * b} rx={10} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}77)` }} />
      <path d="M 1110 480 H 780" stroke={SCH.line} strokeWidth={4} strokeDasharray="12 10" opacity={clamp((t - 20) / 6)} />
      <g opacity={clamp((t - 24) / 6)}>
        <path d="M 1380 480 v -60 M 1350 450 h 60" stroke={SCH.live} strokeWidth={12} strokeLinecap="round" />
      </g>
      <PersonIcon x={670} y={970} s={1.6} />
      <PersonIcon x={1210} y={970} s={1.6} on glow />
      <SchLabel x={960} y={170} t={t - 4} text="ĐI LÀM" size={120} color={SCH.line} />
      <Sparkle x={1380} y={base - 520} t={t - 28} s={1.2} />
    </g>
  );
};

// ---------- C29: the stress meter slides from red to green and the little face relaxes ----------
export const C29: React.FC<ShotProps> = ({ t }) => {
  const len = 50; // about 1.7 s; fixed so the last shot (which runs to the end in a preview) animates the same
  const p = easeOut(clamp((t - 6) / (len - 14)));
  const level = 0.85 - 0.6 * p;
  const col = p > 0.55 ? '#2DBE6C' : p > 0.3 ? '#F2C14E' : '#FF5A4A';
  return (
    <g transform={zoom(t, len, 1.0, 1.1)}>
      <Schematic t={t} id="c29" />
      <StressFace x={520} y={520} s={2.3} calm={p} t={t} />
      <g transform="translate(900 430)">
        <rect width={800} height={120} rx={60} fill="none" stroke={SCH.line} strokeWidth={8} />
        <rect x={10} y={10} width={780 * level} height={100} rx={50} fill={col} style={{ filter: `drop-shadow(0 0 14px ${col}88)` }} />
        <path d="M 200 130 v 30 M 400 130 v 30 M 600 130 v 30" stroke={SCH.dim} strokeWidth={5} />
      </g>
      <g transform={`translate(1300 760) scale(${backOut(clamp((t - 4) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={100} fill={SCH.line} letterSpacing={3}>CĂNG THẲNG</text>
      </g>
    </g>
  );
};
