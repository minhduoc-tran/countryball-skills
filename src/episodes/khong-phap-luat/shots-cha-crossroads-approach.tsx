import React from 'react';
import { kf, easeOut, camT, LOOKS, Street, TrafficLight, CrossroadsTop, proj, propScale, Glow, ShotProps } from '../../engine';
import { Rider } from './cha-bike-rider-and-speed-props';
import { MovingTraffic, Veh } from './cha-crossroads-traffic-layouts';

// Chapter A, hour one, the crossroads (1/2): Pip and Mo ride up to the junction (A25), the light only blinks (A26), nobody
// stops (A27) and traffic pours in from all four sides (A28).

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const blinkOn = (t: number, every = 8) => Math.floor(t / every) % 2 === 0;

// ---------- A25: wide, Pip and Mo roll up to the crossing and brake; the light ahead blinks ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => {
  const slow = (a: number, b: number) => kf(t, [[0, a], [len - 8, b], [len, b]], easeOut);
  const gP = proj(0, 0, 4.6);
  const gM = proj(0, 0, 5.8);
  const xP = slow(-260, 1150);
  const xM = slow(-620, 700);
  return (
    <g transform={camT(960, 540, 1.25)}>
      <Street t={t + 400} id="sb25" light={blinkOn(t) ? 'yellow' : 'red'} />
      <Rider look={MO} x={xM} y={gM.y} s={propScale(5.8)} facing={1} t={t} color="#2FA595" expr="happy" lean={8} />
      <Rider look={PIP} x={xP} y={gP.y} s={propScale(4.6)} facing={1} t={t} color="#D9A441" expr={t > len - 14 ? 'worried' : 'happy'} lean={8} />
    </g>
  );
};

// ---------- A26: macro, the signal head blinking amber over a blurred street ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => {
  const on = blinkOn(t, 7);
  return (
    <g>
      <g filter="url(#blur10)">
        <g transform="translate(-300 -160) scale(1.4)"><Street t={t + 420} id="sb26" light="yellow" /></g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.4} />
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
        <TrafficLight x={-60} y={2100} s={3.4} state="yellow" flip={false} glow on={on ? 1 : 0.12} />
        {on ? <Glow x={960} y={2100 - 458 * 3.4} r={460} kind="warm" o={0.8} /> : null}
      </g>
    </g>
  );
};

// ---------- A27: from above, the amber light blinks in the corner and the traffic sails straight through ----------
const THROUGH: Veh[] = [
  { kind: 'bike', from: 'B', lane: 1050, t0: -10, speed: 24, color: '#B8483E', shirt: '#3E6A8A' },
  { kind: 'bike', from: 'L', lane: 620, t0: -2, speed: 24, color: '#2FA595', shirt: '#D9A441' },
  { kind: 'car', from: 'T', lane: 880, t0: 6, speed: 24, color: '#3FA66A' },
  { kind: 'bike', from: 'R', lane: 460, t0: 14, speed: 25, color: '#EDE6D6', shirt: '#7A5A8A' },
  { kind: 'bike', from: 'B', lane: 900, t0: 20, speed: 24, color: '#7A5A8A', shirt: '#E07A2E' },
];
export const A27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${kf(t, [[0, -1.5], [len, 1.5]])}) scale(1.05) translate(-960 -540)`}>
    <CrossroadsTop t={t + 20} id="xb27" />
    <MovingTraffic t={t} vehicles={THROUGH} />
    <g transform="translate(640 250)">
      <circle r={30} fill="#14101C" />
      <circle r={20} fill={blinkOn(t) ? '#FFC83A' : '#5A4A1A'} />
      {blinkOn(t) ? <Glow x={0} y={0} r={120} kind="warm" o={0.9} /> : null}
    </g>
  </g>
);

// ---------- A28: from above, vehicles from all four sides pile into the junction at once ----------
const POUR: Veh[] = [
  { kind: 'bike', from: 'T', lane: 840, t0: 0, speed: 15, color: '#B8483E', stopAt: 640 },
  { kind: 'car', from: 'T', lane: 1090, t0: 4, speed: 14, color: '#E8B83A', stopAt: 590 },
  { kind: 'bike', from: 'B', lane: 880, t0: 2, speed: 16, color: '#2FA595', stopAt: 640 },
  { kind: 'bike', from: 'B', lane: 1060, t0: 8, speed: 15, color: '#7A5A8A', stopAt: 560 },
  { kind: 'bike', from: 'L', lane: 470, t0: 0, speed: 16, color: '#EDE6D6', stopAt: 1020 },
  { kind: 'bike', from: 'L', lane: 640, t0: 6, speed: 15, color: '#D9A441', stopAt: 940 },
  { kind: 'car', from: 'R', lane: 440, t0: 3, speed: 14, color: '#3FA66A', stopAt: 1000 },
  { kind: 'bike', from: 'R', lane: 650, t0: 9, speed: 16, color: '#3E6A8A', stopAt: 940 },
];
export const A28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
    <CrossroadsTop t={t + 60} id="xb28" />
    <MovingTraffic t={t} vehicles={POUR} />
  </g>
);
