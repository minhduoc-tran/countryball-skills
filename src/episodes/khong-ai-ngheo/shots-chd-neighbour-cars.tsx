import React from 'react';
import { Hero, Pose, basePose, kf, clamp, camT, faceAt, LOOKS, HEAD, LEG_LEN, ShotProps } from '../../engine';
import { PopCar, Villa, Fence, NeighbourBackdrop, SadCloud, CountTag } from './chd-cars-and-yard-props';

// Chapter D, the neighbour (D30-D33): the man in the suit next door (LOOKS.suit) proudly owns three shiny cars, and
// is sad anyway, because over the fence his friend has four. A comic beat: dusk, a villa, a picket fence.

const SUIT = LOOKS.suit;

// ---------- D30: "Người đàn ông mặc vest ở khu bên cạnh": the suit, hands on hips, in front of his villa ----------
export const D30: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.25;
  const ground = 800;
  const pose: Pose = {
    ...basePose, x: 560, y: ground - LEG_LEN * sc + Math.sin(t / 9) * 1.5, scale: sc, yaw: 0.45, look: 0.5, headTilt: Math.sin(t / 12) * 2,
    armL: { a: 38, b: 70 }, armR: { a: 34, b: 74 }, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 },
  };
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 760]]), 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <NeighbourBackdrop id="d30b" ground={760} t={t} />
      <Villa x={900} y={780} s={1.2} />
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimL" shadow={0.7} />
    </g>
  );
};

// ---------- D31: "có ba chiếc xe hơi": three shiny cars pop in on the driveway, one after another, a big "3" ----------
export const D31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <NeighbourBackdrop id="d31b" ground={640} t={t + 30} />
    <Villa x={80} y={650} s={2.0} />
    <PopCar x={380} y={850} s={1.0} c="#E9B12E" t={t} at={2} id="d31a" />
    <PopCar x={960} y={850} s={1.0} c="#D9473A" t={t} at={9} id="d31b2" />
    <PopCar x={1540} y={850} s={1.0} c="#3E9AA8" t={t} at={16} id="d31c" />
    <CountTag x={960} y={170} n="3" t={t - 12} />
  </g>
);

// ---------- D32: "Ông ấy vẫn buồn": the suit close, sad, a little rain cloud over his head ----------
export const D32: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.0;
  const pose: Pose = {
    ...basePose, x: 900, y: 620 - HEAD.y * sc, scale: sc, yaw: 0.35, look: 0.7, headTilt: kf(t, [[0, 0], [len, 6]]), armL: { a: 12, b: 6 }, armR: { a: 12, b: 6 },
  };
  return (
    <g>
      <g filter="url(#blur10)">
        <NeighbourBackdrop id="d32b" ground={800} t={t + 60} />
        <Villa x={1000} y={820} s={1.4} />
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#120E22" opacity={0.25} />
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [4, 'tired']]) }} rimId="rimL" shadow={0} />
      <SadCloud x={900} y={kf(t, [[0, 40], [10, 130]])} t={t} s={1.5} />
    </g>
  );
};

// ---------- D33: "vì bạn ông có bốn chiếc": the suit over the fence, watching his friend's four cars pop in ----------
export const D33: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.7;
  const pose: Pose = {
    ...basePose, x: 440, y: 800 - LEG_LEN * sc, scale: sc, yaw: 0.6, look: kf(t, [[0, 0.3], [20, 0.95]]), headTilt: kf(t, [[0, 0], [30, 7]]),
    armL: { a: 12, b: 6 }, armR: { a: 14, b: 6 },
  };
  const cars: [number, string, number][] = [[780, '#C9CCD6', 10], [1060, '#3E7FC8', 14], [1340, '#D9473A', 18], [1620, '#3A3D4A', 22]];
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 480, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <NeighbourBackdrop id="d33b" ground={560} t={t + 90} />
      <Villa x={1100} y={600} s={0.8} wall="#D9E3C8" roof="#3E6A8A" />
      {cars.map(([x, c, at], i) => <PopCar key={i} x={x} y={622} s={0.85} c={c} t={t} at={at} id={`d33c${i}`} />)}
      <Hero look={SUIT} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'tired']]) }} rimId="rimL" shadow={0} />
      <Fence x0={-100} x1={2100} y={650} h={200} />
      <rect x={-100} y={850} width={2200} height={400} fill="#6FA860" />
      <SadCloud x={440} y={kf(t, [[0, -30], [12, 70]])} t={t} s={1.1} />
      <CountTag x={1500} y={130} n="4" t={t - 20} />
    </g>
  );
};
