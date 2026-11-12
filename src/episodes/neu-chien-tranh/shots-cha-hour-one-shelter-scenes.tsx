import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, Glow, Dust, Stairwell, Banister, hipGround, walkPose, rnd, ShotProps, Look,
} from '../../engine';
import { GRANDMA, WORKER } from '../khong-ai-ngheo/cast-looks';
import { PIP, MOM, SIS, RunnerSil } from './cha-cafe-and-alley-props';
import { StationEntrance } from './cha-shelter-props';

// Chapter A, hour one, shelter scenes (A23, A24, A27): the siren again and people hurrying down the stairs into the
// basement, a crowd going down into a metro station, then Pip's family sitting on the floor underground by phone light.

// ---------- A23: the stairwell down to the basement garage: the siren's red pulsing, neighbours and Pip's family hurry down ----------
const WALKERS: { look: Look; x0: number; scale: number; extra: Partial<Pose> }[] = [
  { look: GRANDMA, x0: -160, scale: 0.8, extra: { expr: 'worried' } },
  { look: WORKER, x0: -60, scale: 0.9, extra: { expr: 'worried' } },
  { look: MOM, x0: -330, scale: 0.88, extra: { expr: 'worried', armR: { a: 70, b: 10 } } },
  { look: SIS, x0: -260, scale: 0.64, extra: { expr: 'worried' } },
  { look: PIP, x0: -430, scale: 0.9, extra: { expr: 'worried' } },
];
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const pulse = 0.5 + 0.5 * Math.sin(t / 3.2);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1060]]), 580, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Stairwell t={t + 100} id="a23sw" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#B3101E" opacity={0.08 + 0.12 * pulse} style={{ mixBlendMode: 'multiply' }} />
      <Glow x={420} y={160} r={420} kind="red" o={0.3 + 0.35 * pulse} />
      {WALKERS.map((w, i) => {
        const x = w.x0 + (t + 20) * (11.5 - i * 0.3);
        const p = walkPose(x, t * 0.7 + i * 1.4, hipGround, w.scale, { ...w.extra }, 1);
        return <Hero key={i} look={w.look} pose={{ ...p, tilt: 8 }} rimId="rimR" shadow={0} />;
      })}
      <Banister />
      <Dust t={t} seed={43} x0={600} y0={250} w={700} h={600} n={20} o={0.5} />
    </g>
  );
};

// ---------- A24: the street entrance to the metro: a crowd going down the steps into the dark ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <StationEntrance t={t} id="a24" />
    {Array.from({ length: 11 }).map((_, i) => {
      const at = i * 3.5;
      const p = clamp((t - at) / 34);
      if (p <= 0 || p >= 1) return null;
      const side = (rnd(6, i) - 0.5) * 2;
      const e = easeOut(p);
      const x = 960 + side * (620 * (1 - e) + 40);
      const y = 1010 - 560 * e * (1 - 0.1 * e);
      return <RunnerSil key={i} x={x} y={y} s={1.5 - 1.1 * e} phase={t * 0.6 + i * 1.7} color={['#14101E', '#1C1628', '#241C30'][i % 3]} bag={i % 2 === 0} />;
    })}
    <Glow x={960} y={760} r={300} kind="cool" o={0.2} />
  </g>
);

// ---------- A27: underground at night: Pip's family sits on the floor in the dim, faces lit by their phones; sis asleep on mum ----------
const FLOOR = 800;
const sitting = (x: number, s: number, facing: 1 | -1, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: FLOOR - 30 * s, scale: s, facing, yaw: facing * 0.45, legL: { a: 72, b: -118 }, legR: { a: 64, b: -112 }, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 }, ...extra,
});
export const A27: React.FC<ShotProps> = ({ t, len }) => {
  const breathe = Math.sin(t / 12) * 2;
  const phone = (x: number, y: number, rot: number) => (
    <g>
      <Glow x={x} y={y - 40} r={230} kind="cool" o={0.65} />
      <rect x={x - 18} y={y - 34} width={36} height={60} rx={7} fill="#CFE6FF" transform={`rotate(${rot} ${x} ${y})`} />
    </g>
  );
  const pip = sitting(800, 1.25, 1, { armR: { a: 66, b: 66 }, headTilt: 8, look: 0.3, expr: 'worried' });
  const mum = sitting(1040, 1.3, -1, { armL: { a: 52, b: 60 }, expr: 'worried', headTilt: 6 });
  const sis = sitting(1190, 0.9, -1, { yaw: -0.5, headTilt: 12, blink: 1, expr: 'neutral', legL: { a: 84, b: 4 }, legR: { a: 78, b: 6 } });
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 990]]), kf(t, [[0, 640], [len, 620]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#1B1726" />
      {/* the vault: tiled wall, pillars, a ceiling lamp that barely lights it, the floor lit by faces */}
      {Array.from({ length: 28 }).map((_, i) => <rect key={i} x={-300 + i * 100} y={160} width={6} height={640} fill="#2A2438" opacity={0.7} />)}
      {[200, 700, 1420, 1860].map((x) => <rect key={x} x={x - 44} y={-100} width={88} height={900} fill="#242030" />)}
      <rect x={-300} y={FLOOR} width={2520} height={600} fill="#15111C" />
      <rect x={-300} y={FLOOR - 4} width={2520} height={8} fill="#3A3048" />
      <Glow x={960} y={120} r={420} o={0.22} />
      {/* people far away, asleep on mats, blurred */}
      <g filter="url(#blur6)" opacity={0.85}>
        {[[330, 1], [520, 0.8], [1560, 0.9], [1760, 1]].map(([x, s], i) => (
          <g key={i} transform={`translate(${x} ${FLOOR - 4}) scale(${s})`}>
            <ellipse cx={0} cy={0} rx={96} ry={14} fill="#000" opacity={0.3} />
            <path d="M -86 -4 Q -80 -50 0 -44 Q 86 -44 90 -4 Z" fill={['#4A3A5A', '#3A4A5E', '#5E4A3A', '#3A5E4E'][i]} />
            <circle cx={-96} cy={-30} r={22} fill="#D9B896" />
          </g>
        ))}
      </g>
      <Hero look={PIP} pose={{ ...pip, y: pip.y + breathe * 0.4, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlue" shadow={0} />
      <Hero look={MOM} pose={{ ...mum, y: mum.y - breathe * 0.4, ...faceAt(t, [[0, 'worried']]) }} rimId="rimBlueL" shadow={0} />
      <Hero look={SIS} pose={{ ...sis, y: sis.y - breathe * 0.5 }} rimId="rimBlueL" shadow={0} />
      {phone(800 + 90, 640, 8)}
      {phone(1040 - 82, 660, -10)}
      <Dust t={t} seed={51} x0={500} y0={300} w={900} h={450} n={24} o={0.45} />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#05030A" opacity={0.18} />
    </g>
  );
};
