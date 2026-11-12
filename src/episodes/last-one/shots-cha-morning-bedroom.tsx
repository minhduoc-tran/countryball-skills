import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, HEAD, Glow, Dust, Shaft, AlarmClock,
  Bedroom, BedDuvet, bedSit, WINDOW, Stairwell, Banister, ShotProps,
} from '../../engine';

// Chapter A, the first morning: 07:00, the alarm, Pip in bed waiting for his mum's voice (A10-A13), then the empty
// stairwell. The Bedroom set is a night set, so DawnBedroom turns it into early morning: lamp off, a pink-gold sky
// in the window and its shaft across the bed.

const PIP = LOOKS.pipHood;

/** The night bedroom at dawn: lamp off, day sky in the window, a pale shaft on the bed; the calendar has no crosses (day 1). */
export const DawnBedroom: React.FC<{ t: number; id: string; duvet?: boolean; clock?: string; ring?: boolean }> = ({ t, id, duvet = true, clock = '07:00' }) => {
  const x0 = WINDOW.x0 + 8;
  const w = WINDOW.x1 - WINDOW.x0 - 16;
  const y0 = WINDOW.y0 + 8;
  const h = WINDOW.y1 - WINDOW.y0 - 16;
  return (
    <g>
      <Bedroom t={t} id={id} lamp={0} veil={0.3} duvet={duvet} clock={clock} crossed={0} />
      <defs>
        <linearGradient id={`${id}dawn`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A9AD8" />
          <stop offset="55%" stopColor="#F4B08A" />
          <stop offset="100%" stopColor="#FFDDA6" />
        </linearGradient>
      </defs>
      <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}dawn)`} opacity={0.94} />
      <circle cx={x0 + w * 0.62} cy={y0 + h * 0.8} r={26} fill="#FFF1CE" />
      <path d={`M ${x0 + w / 2} ${y0} L ${x0 + w / 2} ${y0 + h} M ${x0} ${y0 + h * 0.5} L ${x0 + w} ${y0 + h * 0.5}`} stroke="#1E1824" strokeWidth={6} />
      <Shaft d={`M ${WINDOW.x0} ${WINDOW.y1} L ${WINDOW.x1} ${WINDOW.y1} L ${WINDOW.x1 - 360} 1000 L ${WINDOW.x0 - 520} 1000 Z`} o={0.5} />
      <Glow x={(WINDOW.x0 + WINDOW.x1) / 2} y={WINDOW.y1 - 40} r={420} o={0.6} />
      <rect x={470} y={310} width={980} height={440} fill="#FFD3A0" opacity={0.1} style={{ mixBlendMode: 'soft-light' }} />
      <Dust t={t} seed={23} x0={WINDOW.x0 - 380} y0={WINDOW.y1 - 40} w={560} h={340} n={22} o={0.55} />
    </g>
  );
};

// ---------- A10: macro, the alarm clock on the nightstand: 07:00, shaking and ringing, the room soft behind ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const ring = t < len - 4 ? 1 : 0.4;
  const jit = ring * (Math.sin(t * 2.7) * 7 + Math.sin(t * 5.1) * 3);
  const rot = ring * Math.sin(t * 3.1) * 2.6;
  const pulse = (t % 8) / 8;
  const cx = 1040;
  const cy = 760;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-520 -520) scale(1.9)">
          <DawnBedroom t={t + 20} id="ba10" clock="07:00" />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.28} />
      <Glow x={1500} y={300} r={700} o={0.45} />
      {/* ring marks flying off both sides of the bell caps */}
      {[0, 1, 2].map((k) => {
        const p = (pulse + k / 3) % 1;
        return [-1, 1].map((sd) => (
          <path key={`${k}${sd}`} d={`M ${cx + sd * (420 + 200 * p)} ${cy - 380} q ${sd * 40} 60 0 120`} stroke="#FFE7B8" strokeWidth={14} fill="none" strokeLinecap="round" opacity={ring * (1 - p) * 0.9} />
        ));
      })}
      <g transform={`translate(${cx + jit} ${cy}) rotate(${rot} 0 -60)`}>
        {/* two bell caps on top of the clock, and the hammer between them */}
        <ellipse cx={-210} cy={-388} rx={96} ry={44} fill="#8A8AA0" />
        <ellipse cx={-210} cy={-402} rx={80} ry={30} fill="#B8B6C4" />
        <ellipse cx={210} cy={-388} rx={96} ry={44} fill="#8A8AA0" />
        <ellipse cx={210} cy={-402} rx={80} ry={30} fill="#B8B6C4" />
        <rect x={-10} y={-470} width={20} height={100} rx={6} fill="#6E6C7C" />
        <g transform="scale(3.2) translate(0 -2)">
          <AlarmClock x={0} y={0} s={1} text="07:00" on={1} />
        </g>
      </g>
    </g>
  );
};

// ---------- A11: medium, Pip sits propped on the pillows, eyes open, waiting; he glances at the door ajar ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: -0.4, look: -0.9, armL: { a: 8, b: -6 }, armR: { a: 14, b: -6 }, headTilt: 2 } },
    { f: 20, p: { headTilt: -1 } },
    { f: 34, p: { look: -0.9, headTilt: -5, yaw: -0.55 }, ease: easeOut },
    { f: 52, p: { headTilt: -5 } },
    { f: 66, p: { headTilt: 1, yaw: -0.3, look: -0.5, armL: { a: 20, b: -4 } }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 780], [len, 740]]), kf(t, [[0, 520], [len, 505]]), kf(t, [[0, 1.9], [len, 2.3]]))}>
      <DawnBedroom t={t + 60} id="ba11" duvet={false} clock="07:00" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [30, 'neutral'], [56, 'worried']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
    </g>
  );
};

// ---------- A12: close-up, Pip frowning at the door: "no one calls" ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.07 * clamp(t / len));
  const head = { x: 1060, y: 590 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: kf(t, [[0, -0.2], [14, -0.4], [len, -0.4]]), look: kf(t, [[0, -0.9], [26, -0.9], [40, -0.4]]),
    headTilt: kf(t, [[0, 3], [20, -2], [len, 2]]), armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 },
    ...faceAt(t, [[0, 'neutral'], [16, 'worried']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-430 -470) scale(1.8)">
          <DawnBedroom t={t + 90} id="ba12" duvet clock="07:00" />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.22} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {/* the door's hall light, warm, on the left of the face */}
      <Glow x={160} y={560} r={520} o={0.35} />
    </g>
  );
};

// ---------- A13: wide, the stairwell with nobody on it: dust in the sun shaft, the lantern swaying ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 930], [len, 960]]), kf(t, [[0, 580], [len, 560]]), kf(t, [[0, 0.95], [len, 1.04]]))}>
    <Stairwell t={t + 100} id="sw13" />
    <Dust t={t} seed={41} x0={900} y0={250} w={700} h={600} n={30} o={0.7} />
    <Banister />
  </g>
);
