import React from 'react';
import { kf, clamp, easeOut, camT, Dust, Foreground, ShotProps, LOOKS, Glow } from '../../engine';
import { Birds, Field, Frontier, edgeX, Deminer, RunningKid, Stake, KID_BOY } from './che-props-field-and-deminers';
import { VILLAGE_GIRL } from '../khong-ai-ngheo/cast-looks';

// Chapter E, "after" part 2 (243.9-248.3 s): the deminers of today, calm and unhurried. E8 three deminers in vests
// working the frontier of a field, E9 close on a detector sweeping the grass and a marker stake going in, E10 the cleared
// strip is green and children run across it. No weapons are drawn: the danger is only ever implied by the ribbon and the stakes.

const HOR = 560;

// ---------- E8: wide: three deminers in vests, one behind the other, sweeping across the frontier metre by metre ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const front = kf(t, [[0, 820], [len, 880]]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 700, kf(t, [[0, 1.05], [len, 1.18]]))}>
      <Field t={t + 20} id="e8f" front={front} />
      <Birds t={t + 10} seed={3} x0={-100} y0={160} w={2200} h={200} n={4} />
      <Frontier front={front} />
      <Deminer t={t} x={edgeX(HOR + 110, front) - 70} gy={HOR + 110} s={0.5} phase={0} />
      <Deminer t={t + 14} x={edgeX(HOR + 250, front) - 80} gy={HOR + 250} s={0.7} phase={2} />
      <Deminer t={t + 5} x={edgeX(HOR + 400, front) - 90} gy={HOR + 400} s={0.95} phase={4} />
      <Dust t={t} seed={81} x0={300} y0={400} w={1400} h={500} n={18} o={0.3} />
    </g>
  );
};

// ---------- E9: insert: a detector disc sweeping the grass, close; a marker stake goes in where it beeped ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const front = 1000;
  const drop = clamp((t - 22) / 8);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1060]]), 700, kf(t, [[0, 1.1], [len, 1.22]]))}>
      <Field t={t + 60} id="e9f" front={front} hor={470} />
      <Deminer t={t} x={560} gy={1000} s={1.45} phase={1} />
      {drop > 0 ? (
        <g transform={`translate(0 ${-120 * (1 - easeOut(drop))})`} opacity={clamp(drop * 3)}>
          <Stake x={900} y={1000} h={170} />
        </g>
      ) : null}
      <Glow x={1100} y={760} r={420} o={0.25} />
      <Foreground blur={10}>
        <path d="M -40 1100 Q 300 1000 700 1090 L 700 1160 H -40 Z" fill="#2F6A36" opacity={0.8} />
      </Foreground>
      <Dust t={t} seed={91} x0={500} y0={400} w={1000} h={500} n={16} o={0.35} />
    </g>
  );
};

// ---------- E10: wide: the cleared strip is green now; children run across it, the deminers small at the frontier ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const front = 1330;
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, 900]]), 720, kf(t, [[0, 1.08], [len, 1.0]]))}>
      <Field t={t + 90} id="e10f" front={front} dawn={1} />
      <Birds t={t + 50} seed={5} x0={-100} y0={150} w={2200} h={200} n={5} />
      <Frontier front={front} />
      <Deminer t={t + 8} x={edgeX(HOR + 110, front) - 70} gy={HOR + 110} s={0.5} phase={1} />
      <Deminer t={t + 20} x={edgeX(HOR + 250, front) - 80} gy={HOR + 250} s={0.7} phase={3} />
      <RunningKid t={t} look={LOOKS.sis} xa={150} xb={1000} gy={HOR + 380} s={0.62} seed={0} />
      <RunningKid t={t} look={KID_BOY} xa={100} xb={1050} gy={HOR + 250} s={0.5} seed={2} />
      <RunningKid t={t} look={VILLAGE_GIRL} xa={200} xb={1100} gy={HOR + 120} s={0.38} seed={1} />
      <Dust t={t} seed={101} x0={200} y0={400} w={1200} h={400} n={20} o={0.4} />
    </g>
  );
};
