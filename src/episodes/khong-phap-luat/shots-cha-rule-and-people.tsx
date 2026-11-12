import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, Street, streetStand, CrossroadsTop, Glow, ShotProps,
} from '../../engine';
import { GRANDMA, WORKER } from '../khong-ai-ngheo/cast-looks';
import { TrafficFlow, Walkers, Biker } from './cha-street-traffic-and-walkers-props';
import { TopBike } from './cha-crossroads-top-props';
import { RoadSign } from './cha-law-icons-props';
import { OWNER } from './cha-shop-and-milk-props';

// Chapter A, "the rule": people, homes, scooters and shops are all still there (A15, A16); only the rules vanish: the
// paint on the road and the signs wipe away (A17); nobody has to listen to anybody (A18).

// ---------- A15: medium, the family and neighbours stroll across the road as on any evening ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1100]]), 600, 1.7)}>
    <Street t={t + 140} id="sa15" />
    <Walkers t={t + 40} people={[
      { look: LOOKS.mom, X0: -3.4, Z: 4.8, v: 0.05, wrap: false },
      { look: LOOKS.pipHood, X0: -2.2, Z: 4.4, v: 0.052, wrap: false },
      { look: LOOKS.sis, X0: -1.3, Z: 4.5, v: 0.05, k: 1.15, wrap: false },
      { look: GRANDMA, X0: -0.1, Z: 4.9, v: 0.045, k: 1.5, wrap: false },
      { look: WORKER, X0: 1.3, Z: 4.5, v: 0.055, wrap: false },
    ]} />
  </g>
);

const BIKERS: Biker[] = [
  { Z: 4.4, X0: -9, v: 0.12, look: WORKER, color: '#3E6A8A' },
  { Z: 5.6, X0: 4, v: -0.1, look: LOOKS.mom, color: '#EDE6D6', helmet: true },
  { Z: 7.0, X0: -2, v: 0.09, look: OWNER, color: '#B8483E' },
  { Z: 8.6, X0: 8, v: -0.12, look: GRANDMA, color: '#2FA595' },
  { Z: 10.4, X0: -6, v: 0.08, look: LOOKS.mo, color: '#7A5A8A' },
  { Z: 12.5, X0: 1, v: -0.07, look: WORKER, color: '#D9A441' },
  { Z: 15, X0: -10, v: 0.1, look: OWNER, color: '#2E2B3D', helmet: true },
];

// ---------- A16: wide, a normal busy street: stalls out, scooters crossing, people on the pavement ----------
export const A16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Street t={t + 40} id="sa16" market={1} light="green" />
    <TrafficFlow t={t + 30} bikers={BIKERS} />
    <Walkers t={t} people={[
      { look: LOOKS.mom, X0: -5.4, Z: 6.5, v: 0.03, k: 1.55 },
      { look: WORKER, X0: 5.3, Z: 8.5, v: -0.035 },
      { look: LOOKS.sis, X0: -5.2, Z: 10, v: 0.03, k: 1.1 },
    ]} />
  </g>
);

// ---------- A17: from above, the road's paint wipes away (zebra, lane dashes, stop lines) and the signs fade ----------
const ROAD_COL = '#5A5868';
export const A17: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeInOut(clamp((t - 6) / (len - 14)));
  const r = 40 + p * 980;
  const fadeSign = 1 - clamp((p - 0.2) * 2);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <CrossroadsTop t={t} id="xa17" />
      <clipPath id="xa17clip"><circle cx={960} cy={540} r={r} /></clipPath>
      <g clipPath="url(#xa17clip)">
        <rect x={690} y={-20} width={540} height={1120} fill={ROAD_COL} />
        <rect x={-20} y={270} width={1960} height={540} fill={ROAD_COL} />
        {Array.from({ length: 150 }).map((_, i) => <circle key={i} cx={30 + ((i * 97) % 1860)} cy={40 + ((i * 53) % 1000)} r={1 + (i % 3)} fill={i % 3 ? '#3E3C4A' : '#7A7888'} opacity={0.35} />)}
      </g>
      <circle cx={960} cy={540} r={r} fill="none" stroke="#FFF3DC" strokeWidth={6} opacity={0.5 * (1 - p)} />
      {[[640, 240], [1280, 840], [640, 840], [1290, 230]].map(([x, y], i) => (
        <g key={i} opacity={fadeSign}>
          <circle cx={x + 6} cy={y + 8} r={40} fill="#000" opacity={0.3} />
          <RoadSign kind={(['noPark', 'speed', 'noEntry', 'noLeft'] as const)[i]} x={x} y={y} r={38} />
        </g>
      ))}
      <TopBike x={kf(t, [[0, 780], [len, 800]])} y={kf(t, [[0, 1180], [len, -150]], (v) => v)} rot={0} color="#B8483E" shirt="#3E6A8A" />
      <TopBike x={kf(t, [[0, 1100], [len, 1120]])} y={kf(t, [[0, -150], [len, 1250]], (v) => v)} rot={180} color="#2FA595" shirt="#D9A441" />
      <Glow x={960} y={540} r={400} kind="warm" o={0.15 * p} />
    </g>
  );
};

// ---------- A18: medium, two people face each other mid-road and shrug: nobody has to listen to anybody ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const a = streetStand(-0.95, 4.6);
  const b = streetStand(0.95, 4.6);
  const pa = poseAt(t, [
    { f: 0, p: { x: a.x, y: a.y, scale: a.scale, yaw: 0.55, look: 0.6, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } },
    { f: 14, p: { armL: { a: 70, b: 72 }, armR: { a: 70, b: 72 }, headTilt: -6 }, ease: easeOut },
    { f: 40, p: { armL: { a: 70, b: 72 }, armR: { a: 70, b: 72 }, headTilt: -6, yaw: 0.55 } },
    { f: 54, p: { yaw: -0.55, look: -0.6, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: 0 }, ease: easeInOut },
  ]);
  const pb = poseAt(t, [
    { f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: -0.55, look: -0.6, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } },
    { f: 20, p: { armL: { a: 70, b: 72 }, armR: { a: 70, b: 72 }, headTilt: 6 }, ease: easeOut },
    { f: 44, p: { armL: { a: 70, b: 72 }, armR: { a: 70, b: 72 }, headTilt: 6, yaw: -0.55 } },
    { f: 58, p: { yaw: 0.55, look: 0.6, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: 0 }, ease: easeInOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), 640, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Street t={t + 260} id="sa18" />
      <Hero look={LOOKS.mom} pose={{ ...pa, ...faceAt(t, [[0, 'neutral'], [14, 'smug'], [54, 'neutral']]) }} rimId="rimR" shadow={0} />
      <Hero look={WORKER} pose={{ ...pb, ...faceAt(t, [[0, 'neutral'], [20, 'smug'], [58, 'neutral']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};
