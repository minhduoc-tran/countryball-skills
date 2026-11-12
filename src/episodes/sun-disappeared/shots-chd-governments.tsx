import React from 'react';
import {
  Hero, walkPose, kf, clamp, camT, LOOKS, LEG_LEN, Street, streetStand, Schematic, SchLabel, Glow, Foreground,
  ShotProps, shake, Pose,
} from '../../engine';
import { AlertMap, Tv, Suitcase } from './chd-screens-and-map-props';

// Chapter D, beat "power: governments" (D12-D15): alerts blink on the map, the man in the suit is on every screen,
// nobody stays calm.

// ---------- D12: the world as a map on the blueprint; alert dots blink on one after another ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 900]]), kf(t, [[0, 520], [len, 470]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
    <Schematic t={t} id="sd12" />
    <AlertMap t={t} t0={4} />
    <SchLabel x={960} y={110} t={t - 2} text="GOVERNMENTS: ALERT" size={52} color="#FF5A4A" />
  </g>
);

// ---------- D13: a dark shop window at night: a wall of TVs, the man in the suit on every one ----------
const WALL: { x: number; y: number; w: number; calm: number }[] = [
  { x: 560, y: 380, w: 380, calm: 0 }, { x: 960, y: 380, w: 380, calm: 5 }, { x: 1360, y: 380, w: 380, calm: 11 },
  { x: 480, y: 700, w: 300, calm: 3 }, { x: 800, y: 700, w: 300, calm: 8 }, { x: 1120, y: 700, w: 300, calm: 1 }, { x: 1440, y: 700, w: 300, calm: 6 },
];
export const D13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1010]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.22]]))}>
    <rect x={-400} y={-300} width={2800} height={1800} fill="#0A0B12" />
    <rect x={200} y={140} width={1520} height={780} fill="#0E1018" stroke="#3A3C4C" strokeWidth={10} />
    <rect x={200} y={560} width={1520} height={12} fill="#2A2C3A" />
    <rect x={200} y={880} width={1520} height={12} fill="#2A2C3A" />
    {WALL.map((w, i) => <Tv key={i} id={`d13t${i}`} x={w.x} y={w.y} w={w.w} t={t + 40} calm={w.calm} on={t < 3 + i ? 0 : 1} />)}
    <path d="M 240 160 L 760 160 L 520 900 L 240 900 Z" fill="#FFFFFF" opacity={0.05} />
    <rect x={-400} y={920} width={2800} height={500} fill="#07080D" />
    <Foreground blur={10}><rect x={-400} y={990} width={1000} height={400} fill="#030408" /></Foreground>
  </g>
);

// ---------- D14: close-up: one big screen, the suit at his desk with a ticker "STAY CALM", dark heads in front ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <rect x={-400} y={-300} width={2800} height={1800} fill="#090A10" />
    <Tv id="d14t" x={960} y={500} w={1150} t={t + 90} calm={2} />
    <Glow x={960} y={500} r={900} kind="cool" o={0.22} />
    <Foreground blur={16}>
      <g fill="#04050A">
        <circle cx={160} cy={900} r={130} /><path d="M -60 1100 Q 40 780 160 780 Q 330 780 440 1100 Z" />
        <circle cx={1700} cy={940} r={150} /><path d="M 1440 1200 Q 1500 830 1700 830 Q 1900 830 1990 1200 Z" />
      </g>
    </Foreground>
  </g>
);

// ---------- D15: night street: people hurry past with suitcases and blankets, a little chaos ----------
const RUNNERS: { look: keyof typeof LOOKS; X0: number; X1: number; Z: number; k: number; ph: number; fast: number; case_?: boolean; blanket?: boolean }[] = [
  { look: 'mom', X0: -3.2, X1: 3.2, Z: 3.8, k: 1.65, ph: 0, fast: 0.7, case_: true },
  { look: 'sis', X0: -6.4, X1: 3.6, Z: 3.9, k: 1.1, ph: 1.4, fast: 0.9 },
  { look: 'mo', X0: 4, X1: -4, Z: 4.8, k: 1.7, ph: 2.2, fast: 0.8, blanket: true },
  { look: 'pipInk', X0: 4.5, X1: -4.8, Z: 6.5, k: 1.6, ph: 0.6, fast: 0.85, case_: true },
  { look: 'mom', X0: -4, X1: 4.5, Z: 8, k: 1.5, ph: 3, fast: 0.75, blanket: true },
];
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 0, len, 3);
  return (
    <g transform={`${camT(960, 540, 1.0)} translate(${sh.x ?? 0} ${sh.y ?? 0})`}>
      <Street t={t + 500} id="st15" night moon={false} blackout={0.3 + 0.1 * Math.sin(t / 4)} />
      {RUNNERS.map((r, i) => {
        const u = clamp((t + i * 6) / (len + 24));
        const X = r.X0 + (r.X1 - r.X0) * u;
        const st = streetStand(X, r.Z, { k: r.k });
        const dir: 1 | -1 = r.X1 > r.X0 ? 1 : -1;
        const pose: Pose = walkPose(st.x, t * r.fast + r.ph, st.y + LEG_LEN * st.scale, st.scale, {}, dir);
        return (
          <g key={i}>
            <Hero look={LOOKS[r.look]} pose={pose} rimId={dir > 0 ? 'rimR' : 'rimL'} shadow={0.5} />
            {r.case_ ? <Suitcase pose={pose} side="armR" color={i % 2 ? '#3E7A8C' : '#B5543E'} /> : null}
            {r.blanket ? <g transform={`translate(${pose.x - dir * 18 * st.scale} ${pose.y - 96 * st.scale}) scale(${st.scale})`}><path d="M -44 -26 Q 0 -52 44 -26 L 52 56 L -52 56 Z" fill="#9A4A5A" stroke="#1A1218" strokeWidth={3} /><path d="M -30 0 L 30 0 M -34 24 L 34 24" stroke="#C97A8A" strokeWidth={3} /></g> : null}
          </g>
        );
      })}
    </g>
  );
};
