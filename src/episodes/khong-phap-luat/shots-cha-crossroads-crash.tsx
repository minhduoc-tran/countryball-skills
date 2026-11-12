import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeIn, camT, LOOKS, Street, proj, propScale, Motorbike, shake, CrossroadsTop, ShotProps, Look,
} from '../../engine';
import { GRANDMA, WORKER } from '../khong-ai-ngheo/cast-looks';
import { Rider } from './cha-bike-rider-and-speed-props';
import { HornMarks, QMark, TopAmbulance } from './cha-crossroads-top-props';
import { JamLayer } from './cha-crossroads-traffic-layouts';
import { LyingBike, ImpactStar, AmbulanceFront, SirenWaves } from './cha-crash-and-ambulance-props';
import { OWNER } from './cha-shop-and-milk-props';

// Chapter A, hour one, the crossroads (2/2): horns (A29), the crash (A30), the junction jams solid (A31), two riders
// nose to nose (A32), nobody knows who goes first (A33), the ambulance behind the jam (A34, A35).

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;

type Spot = { X: number; Z: number; f: 1 | -1; look: Look; color: string; expr?: 'neutral' | 'shock' | 'worried' | 'smug' | 'cool' };

/** A stationary rider (jittering a little with the engine): a bike at ground (X, Z) with the horn marks over its bars. */
const Stuck: React.FC<{ spot: Spot; t: number; i: number; horn?: boolean; q?: boolean }> = ({ spot, t, i, horn = false, q = false }) => {
  const g = proj(spot.X, 0, spot.Z);
  const s = propScale(spot.Z);
  const jx = Math.sin(t * 1.9 + i * 2.1) * 2.5;
  return (
    <g transform={`translate(${jx} 0)`}>
      <Rider look={spot.look} x={g.x} y={g.y} s={s} facing={spot.f} t={t * 0.2 + i * 5} color={spot.color} expr={spot.expr ?? 'worried'} lean={6} bounce={0.2} />
      {horn ? <HornMarks x={g.x + spot.f * 60 * s} y={g.y - 190 * s} f={t + i * 5} s={s * 1.4} /> : null}
      {q ? <QMark x={g.x - spot.f * 10 * s} y={g.y - 330 * s} f={t + i * 6} s={s * 1.5} /> : null}
    </g>
  );
};

// ---------- A29: medium, scooters crammed into the junction, horns blaring; Pip winces among them ----------
const HORN_SPOTS: Spot[] = [
  { X: -2.4, Z: 5.8, f: 1, look: WORKER, color: '#3E6A8A' },
  { X: 2.2, Z: 5.4, f: -1, look: OWNER, color: '#B8483E' },
  { X: -0.4, Z: 5.0, f: -1, look: GRANDMA, color: '#2FA595' },
  { X: 1.0, Z: 3.7, f: 1, look: PIP, color: '#D9A441', expr: 'shock' },
  { X: -1.7, Z: 3.9, f: 1, look: MO, color: '#2FA595', expr: 'shock' },
];
export const A29: React.FC<ShotProps> = ({ t, len }) => {
  const sh = shake(t, 0, 28, 5);
  return (
  <g transform={`translate(${sh.x} ${sh.y}) ${camT(kf(t, [[0, 960], [len, 975]]), 600, kf(t, [[0, 1.45], [len, 1.6]]))}`}>
    <Street t={t + 500} id="sb29" light="red" />
    {[...HORN_SPOTS].sort((a, b) => b.Z - a.Z).map((sp, i) => <Stuck key={i} spot={sp} t={t} i={i} horn />)}
  </g>
  );
};

// ---------- A30: medium, two scooters meet in the middle: a bump, one bike goes over, its rider left standing shocked ----------
export const A30: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 4.4;
  const g = proj(0, 0, Z);
  const s = propScale(Z);
  const hit = 12;
  const k = t - hit;
  const ap = easeIn(clamp(t / hit));
  const recoil = clamp(k / 4) * 10;
  const xl = kf(ap, [[0, -200], [1, 960 - 98 * s]], (v) => v) - recoil;
  const xr = kf(ap, [[0, 2150], [1, 960 + 98 * s]], (v) => v) + recoil * 0.4;
  const tip = clamp(k / 5);
  const sc = 0.55 * s;
  const stand = poseAt(Math.max(0, k - 2), [
    { f: 0, p: { x: xl - 150 * s, y: g.y - 140 * sc, scale: sc, yaw: 0.5, look: 0.7, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 } } },
    { f: 6, p: { armL: { a: 100, b: 40 }, armR: { a: 100, b: 40 }, headTilt: -6, squash: 0.04 }, ease: easeOut },
  ]);
  return (
    <g transform={`translate(${k >= 0 && k < 8 ? Math.sin(t * 5) * 9 * (1 - k / 8) : 0} 0) ${camT(960, 640, 1.5)}`}>
      <Street t={t + 560} id="sb30" light="red" />
      {k < 1 ? <Rider look={WORKER} x={xl} y={g.y} s={s} facing={1} t={t} color="#3E6A8A" expr="shock" lean={6} /> : (
        <g>
          {tip < 0.6 ? <Motorbike x={xl} y={g.y} s={s} facing={1} color="#3E6A8A" lean={-36 * Math.sin(tip / 0.6 * Math.PI)} /> : <LyingBike x={xl + 10 * s} y={g.y - 30 * s} s={s} color="#3E6A8A" />}
          <Hero look={WORKER} pose={{ ...stand, ...faceAt(t, [[hit, 'shock']]) }} rimId="rimR" shadow={0} />
        </g>
      )}
      <Rider look={OWNER} x={xr} y={g.y} s={s} facing={-1} t={t} color="#B8483E" expr="shock" lean={4} />
      <ImpactStar x={960} y={g.y - 90 * s} k={k} r={110} />
    </g>
  );
};

// ---------- A31: from above, the whole crossroads locked solid: scooters and taxis at every angle, horns pulsing ----------
export const A31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.02], [len, 1.12]])}) translate(-960 -540)`}>
    <CrossroadsTop t={t + 80} id="xb31" />
    <JamLayer f={t} shake={1.4} />
    <HornMarks x={900} y={380} f={t} s={0.9} />
    <HornMarks x={1070} y={700} f={t + 5} rot={180} s={0.9} />
    <HornMarks x={680} y={560} f={t + 9} rot={-90} s={0.9} />
    <HornMarks x={1240} y={500} f={t + 3} rot={90} s={0.9} />
  </g>
);

// ---------- A32: medium, two riders nose to nose at the crossing, each waiting for the other to give way ----------
export const A32: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 4.2;
  const g = proj(0, 0, Z);
  const s = propScale(Z);
  const nudge = (ph: number) => Math.sin(t * 0.55 + ph) * 3;
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.55], [len, 1.7]]))}>
      <Street t={t + 620} id="sb32" light="yellow" />
      <Rider look={WORKER} x={960 - 100 * s + nudge(0)} y={g.y} s={s} facing={1} t={t * 0.3} color="#3E6A8A" expr="smug" lean={8} bounce={0.2} />
      <Rider look={OWNER} x={960 + 100 * s + nudge(2)} y={g.y} s={s} facing={-1} t={t * 0.3 + 4} color="#B8483E" expr="smug" lean={8} bounce={0.2} />
      <HornMarks x={960 - 40 * s} y={g.y - 190 * s} f={t} s={s * 1.2} />
      <HornMarks x={960 + 40 * s} y={g.y - 190 * s} f={t + 7} s={s * 1.2} />
    </g>
  );
};

// ---------- A33: wide, the stalled junction: every rider with a "?" over their head: who goes first? ----------
const Q_SPOTS: Spot[] = [
  { X: -2.9, Z: 6.2, f: 1, look: WORKER, color: '#3E6A8A', expr: 'worried' },
  { X: 2.6, Z: 6.6, f: -1, look: OWNER, color: '#B8483E', expr: 'worried' },
  { X: -0.2, Z: 7.4, f: -1, look: GRANDMA, color: '#2FA595', expr: 'worried' },
  { X: 1.2, Z: 5.0, f: 1, look: PIP, color: '#D9A441', expr: 'worried' },
  { X: -1.6, Z: 4.8, f: 1, look: MO, color: '#2FA595', expr: 'worried' },
  { X: 0.2, Z: 9.4, f: 1, look: LOOKS.mom, color: '#EDE6D6', expr: 'worried' },
];
export const A33: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.4]]))}>
    <Street t={t + 700} id="sb33" light={Math.floor(t / 9) % 2 ? 'yellow' : 'red'} />
    {[...Q_SPOTS].sort((a, b) => b.Z - a.Z).map((sp, i) => <Stuck key={i} spot={sp} t={t} i={i} q />)}
  </g>
);

// ---------- A34: from above, the ambulance creeps up behind the jam, lights wheeling, siren waves rolling out ----------
export const A34: React.FC<ShotProps> = ({ t, len }) => {
  const y = kf(t, [[0, 1360], [len, 940]], easeOut);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
      <CrossroadsTop t={t + 100} id="xb34" />
      <JamLayer f={t} shake={0.8} skip={[7, 12, 13]} />
      <SirenWaves x={960} y={y} f={t} s={1.2} />
      <TopAmbulance x={960} y={y} f={t} s={1.0} />
    </g>
  );
};

// ---------- A35: medium, the ambulance fronts the camera, lights flashing; the riders in front shrug and look away ----------
export const A35: React.FC<ShotProps> = ({ t, len }) => {
  const zA = 5.0;
  const gA = proj(0.15, 0, zA);
  const Z = 3.9;
  const g = proj(0, 0, Z);
  const s = propScale(Z);
  const glance = clamp((t - 6) / 8);
  const turnAway = clamp((t - 20) / 10);
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Street t={t + 760} id="sb35" light="red" />
      <AmbulanceFront x={gA.x} y={gA.y} s={propScale(zA) * 1.0} f={t} />
      <SirenWaves x={gA.x} y={gA.y - 250 * propScale(zA)} f={t} s={propScale(zA) * 1.2} />
      <Rider look={WORKER} x={960 - 420 * s} y={g.y} s={s} facing={1} t={t * 0.3} color="#3E6A8A" expr={turnAway > 0.5 ? 'smug' : 'worried'} lean={4} bounce={0.2} />
      <Rider look={OWNER} x={960 + 420 * s} y={g.y} s={s} facing={-1} t={t * 0.3 + 3} color="#B8483E" expr={glance > 0.5 ? 'shock' : 'worried'} lean={4} bounce={0.2} />
    </g>
  );
};
