import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Street, streetStand, Study, Desk, Glow, LightVeil,
  Tabletop, FONT, UI, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BlackCard, Terminal, SavingsBook, GroceryBasket } from './chd-props-money-and-icons';
import { GRAN, Spectacles } from './chd-props-cast-and-scenes';

// Chapter D, beat "savings" (D1-D4): ordinary people who did nothing; grandma and her passbook under the lamp; the card
// swiped on the terminal; the passbook and the shopping basket shrinking side by side.

// ---------- D1: wide: people waiting at the bus stop at dusk, doing nothing, minding their own lives ----------
const CROWD = [
  { X: 2.9, Z: 6.0, look: LOOKS.mom, yaw: -0.4, face: 'neutral' as const },
  { X: 1.5, Z: 5.2, look: GRAN, yaw: -0.5, face: 'neutral' as const },
  { X: 0.2, Z: 6.6, look: LOOKS.mo, yaw: 0.3, face: 'tired' as const },
  { X: -1.2, Z: 5.4, look: LOOKS.suit, yaw: 0.5, face: 'neutral' as const },
  { X: -2.6, Z: 6.2, look: LOOKS.sis, yaw: 0.2, face: 'happy' as const },
  { X: 4.0, Z: 7.4, look: LOOKS.mom, yaw: -0.2, face: 'neutral' as const },
  { X: -3.6, Z: 7.6, look: LOOKS.mo, yaw: 0.4, face: 'neutral' as const },
];
export const D1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1020], [len, 960]]), 640, kf(t, [[0, 1.45], [len, 1.62]]))}>
    <Street t={t + 90} id="d1st" bus />
    {[...CROWD].sort((a, b) => b.Z - a.Z).map((c, i) => {
      const at = streetStand(c.X, c.Z, { sidewalk: Math.abs(c.X) > 4.2 });
      const sc = at.scale;
      const pose: Pose = {
        ...basePose, ...at, yaw: c.yaw, look: Math.sin(t / 40 + i) * 0.4, headTilt: Math.sin(t / 30 + i * 2) * 2,
        armL: { a: 8 + Math.sin(t / 25 + i) * 2, b: 6 }, armR: { a: 10, b: 8 }, tilt: Math.sin(t / 50 + i) * 1.2,
        ...faceAt(t + i * 20, [[0, c.face]]), blink: Math.floor((t + i * 23) / 3) % 31 === 0 ? 1 : 0, scale: sc,
      };
      return <Hero key={i} look={c.look} pose={pose} rimId="rimL" shadow={0.6} />;
    })}
  </g>
);

// ---------- D2: medium: grandma at the wooden table under the lamp, the passbook between her hands ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 960, y: 726, scale: 1.0, yaw: 0.12, look: 0.1, armL: { a: 38, b: 28 }, armR: { a: 38, b: 28 }, headTilt: 2 } },
    { f: 30, p: { headTilt: -2, look: -0.2 } },
    { f: 70, p: { headTilt: 2, look: 0.15 } },
  ]);
  const bookIn = easeOut(clamp((t - 10) / 14));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 600], [len, 640]]), kf(t, [[0, 1.55], [len, 2.0]]))}>
      <Study t={t + 60} id="d2st" night />
      <Hero look={GRAN} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [34, 'happy']]) }} rimId="rimR" shadow={0} />
      <Spectacles pose={{ ...basePose, ...pose, ...faceAt(t, [[0, 'neutral']]) } as Pose} />
      <Desk x0={520} x1={1300} y={700} laptop={false} />
      <g transform={`translate(${960 + 14} ${690 - (1 - bookIn) * 40}) scale(1 0.62)`} opacity={bookIn}>
        <SavingsBook x={0} y={0} w={170} rot={-4} />
      </g>
      <Glow x={1090} y={560} r={420} o={0.35} />
    </g>
  );
};

// ---------- D3: insert: Pip's black card taps the terminal, the screen turns green ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const k = kf(t, [[0, 0], [30, 1], [36, 1], [41, 0.6]]);
  const cx = 480 + 400 * k;
  const cy = 780 - 400 * k;
  const ok = clamp((t - 33) / 5);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#4A3A44" grain="#3E3038" lip="#5A4652" floor="#1E1824" floorLines="#18121E" />
      <LightVeil id="d3veil" lights={[[900, 520, 620]]} o={0.55} />
      <Terminal x={940} y={1010} s={1.5} ok={ok} idle="QUẸT THẺ" />
      {ok > 0 ? <Glow x={940} y={500} r={440 * ok} kind="cool" o={0.35} /> : null}
      <BlackCard x={cx} y={cy} rot={-18 + 14 * k} s={1.5} />
      <InsertArm x={cx - 70} y={cy + 56} fx={cx - 520} fy={cy + 800} rot={-18 + 14 * k} s={5} width={120} />
    </g>
  );
};

// ---------- D4: split screen: the passbook loses its buying power while the basket beside it empties item by item ----------
const Half: React.FC<{ id: string; x0: number; children: React.ReactNode }> = ({ id, x0, children }) => (
  <g>
    <clipPath id={id}><rect x={x0} y={0} width={960} height={1080} /></clipPath>
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
);
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const prog = clamp((t - 10) / Math.max(1, len - 22));
  const left = 6 - 4.6 * prog;
  const power = 1 - 0.78 * easeOut(prog);
  const z = kf(t, [[0, 1.0], [len, 1.05]]);
  return (
    <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
      <Half id="d4L" x0={0}>
        <Tabletop edge={1500} wood="#6B4B42" grain="#5C4038" lip="#7A5747" />
        <LightVeil id="d4vL" lights={[[480, 470, 520]]} o={0.55} />
        <SavingsBook x={480} y={470} w={380 * (0.8 + 0.2 * power)} rot={-3} worn={1 - power} />
        <g transform="translate(480 930)">
          <rect x={-250} y={-26} width={500} height={52} rx={26} fill={UI.pill} opacity={0.75} />
          <rect x={-232} y={-12} width={464 * power} height={24} rx={12} fill={power > 0.45 ? UI.good : UI.bad} />
          <text x={0} y={-48} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={UI.text} letterSpacing={3}>SỨC MUA</text>
        </g>
      </Half>
      <Half id="d4R" x0={960}>
        <Tabletop edge={1500} wood="#8A6A52" grain="#78583F" lip="#9A7A62" />
        <LightVeil id="d4vR" lights={[[1440, 560, 560]]} o={0.55} />
        <GroceryBasket x={1440} y={760} s={2.0} left={left} />
      </Half>
      <rect x={950} y={0} width={20} height={1080} fill="#0B0816" />
      <g transform={`translate(960 540) rotate(${-8 + Math.sin(t / 4) * 3})`}>
        <BlackCard x={0} y={0} s={0.8} />
      </g>
    </g>
  );
};
