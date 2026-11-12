import React from 'react';
import {
  Hero, poseAt, faceAt, walkPose, kf, clamp, easeOut, camT, LOOKS, hipGround, Stairwell, Banister, Dust, Street, streetStand, proj,
  propScale, Motorbike, TrafficLight, trafficState, CrossroadsTop, PaperBall, ROAD_BIKES, ShotProps,
} from '../../engine';

// Chapter A, out into the city: Pip runs down the stairs (A30) and bursts onto the street (A31); the street, empty
// (A32); a bike left in the road with its key in (A33, A34); the traffic light still changing for nobody (A35) over
// the empty crossing seen from above (A36).

const PIP = LOOKS.pipHood;

// ---------- A30: the stairwell, side-on: he takes the stairs at a run, the camera racing with him ----------
export const A30: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 140], [10, 330], [len, 1620]], (v) => v);
  const pose = walkPose(x, t * 0.95, hipGround, 0.9, { tilt: 14, armL: { a: 52 * Math.sin(t * 0.95), b: 40 }, armR: { a: -52 * Math.sin(t * 0.95), b: 40 } });
  const cx = clamp(x + 100, 760, 1200);
  return (
    <g transform={camT(cx, kf(t, [[0, 520], [len, 640]]), 1.12)}>
      <Stairwell t={t + 40} id="sw30" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimL" shadow={0} />
      <Banister />
    </g>
  );
};

// ---------- A31: he bursts out of the shophouse door and across the road, skids to a stop in the middle ----------
export const A31: React.FC<ShotProps> = ({ t, len }) => {
  const run = clamp(t / 19);
  const X = -3.6 + 4.2 * (easeOut(run) * 0.9 + 0.1 * run);
  const s = streetStand(X, 4.3);
  const stop = clamp((t - 19) / 8);
  const w = walkPose(s.x, t * 1.0, s.y + 140 * s.scale, s.scale, { tilt: 12 - 12 * stop, armL: { a: 50 * Math.sin(t) * (1 - stop), b: 40 }, armR: { a: -50 * Math.sin(t) * (1 - stop), b: 40 } });
  const pose = t < 19 ? w : poseAt(t - 19, [
    { f: 0, p: { ...w } },
    { f: 4, p: { tilt: -6, legL: { a: 18, b: 0 }, legR: { a: -18, b: 0 }, armL: { a: 70, b: 10 }, armR: { a: 70, b: 10 }, squash: 0.05 } },
    { f: 9, p: { tilt: 0, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 }, armL: { a: 100, b: 10 }, armR: { a: 100, b: 10 }, squash: 0, look: -0.5 } },
  ]);
  const shk = t > 19 && t < 24 ? Math.sin(t * 5) * 4 : 0;
  return (
    <g transform={`translate(${shk} 0) ${camT(kf(t, [[0, 640], [len, 1000]]), 640, kf(t, [[0, 1.7], [len, 1.5]]))}`}>
      <Street t={t + 100} id="st31" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [22, 'worried']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- A32: the street wide and low, empty: only a paper tumbling across the road; Pip tiny in the middle ----------
export const A32: React.FC<ShotProps> = ({ t, len }) => {
  const low = 170;
  const s = streetStand(0.2, 16, { low });
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0, look: 0, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 } } },
    { f: 26, p: { yaw: -0.5, look: -0.8 }, ease: easeOut },
    { f: 50, p: { yaw: 0.5, look: 0.8 }, ease: easeOut },
    { f: 66, p: { yaw: 0, look: 0, headTilt: 3 } },
  ]);
  const px = 400 + t * 11;
  const hop = Math.abs(Math.sin(t / 4.5)) * 22;
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 560]]), kf(t, [[0, 0.95], [len, 1.1]]))}>
      <Street t={t + 40} id="st32" low={low} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [40, 'worried']]) }} rimId="rimR" shadow={0} />
      <PaperBall x={px} y={900 + low * 0.1 - hop} r={16} rot={t * 14} />
    </g>
  );
};

// ---------- A33: medium, Pip walks up to a scooter left in the road ----------
const BIKE = ROAD_BIKES[0];
const bikeAt = proj(BIKE.X, 0, BIKE.Z);
export const A33: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(kf(t, [[0, -1.3], [len, -0.1]], (v) => v), 6.2);
  const pose = walkPose(s.x, t * 0.55, s.y + 140 * s.scale, s.scale, { yaw: 0.6, tilt: 3 }, 1);
  const settle = clamp((t - (len - 8)) / 8);
  return (
    <g transform={camT(kf(t, [[0, 1010], [len, 1050]]), 640, kf(t, [[0, 2.0], [len, 2.3]]))}>
      <Street t={t + 160} id="st33" />
      <Motorbike x={bikeAt.x} y={bikeAt.y} s={propScale(BIKE.Z)} facing={BIKE.facing} lean={BIKE.lean} color={BIKE.color} keys t={t} />
      <Hero look={PIP} pose={{ ...pose, look: 0.8 * settle + 0.3, ...faceAt(t, [[0, 'neutral'], [22, 'worried']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};

// ---------- A34: macro, the key still in the ignition, its red tag swinging ----------
export const A34: React.FC<ShotProps> = ({ t, len }) => {
  const S = 9.5;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-200 -220) scale(1.4)">
          <Street t={t + 210} id="st34" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.3} />
      <Motorbike x={960 - 74 * S} y={600 + 92 * S} s={S} facing={1} color={BIKE.color} keys t={t * 1.4} shadow={0} />
    </g>
  );
};

// ---------- A35: low angle, the traffic light on its mast changing green, yellow, red, the counter running ----------
export const A35: React.FC<ShotProps> = ({ t, len }) => {
  const st = trafficState(62 + t);
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), kf(t, [[0, 620], [len, 560]]), 1.0)}>
      <g filter="url(#blur6)">
        <g transform="translate(960 470) scale(1.5) translate(-960 -470)">
          <Street t={t + 260} id="st35" low={150} light={st.state} />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.25} />
      <TrafficLight x={360} y={1500} s={2.0} state={st.state} count={st.count} flip={false} glow />
      <Dust t={t} seed={91} x0={400} y0={200} w={1200} h={700} n={20} o={0.4} />
    </g>
  );
};

// ---------- A36: from above, the empty crossing: the zebra stripes, a flip-flop, shadows of clouds crossing ----------
export const A36: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${-2 + t * 0.05}) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
    <CrossroadsTop t={t + 50} id="xr36" />
    <PaperBall x={kf(t, [[0, 400], [len, 1250]], (v) => v)} y={700 + Math.sin(t / 3) * 6} r={14} rot={t * 16} />
  </g>
);
