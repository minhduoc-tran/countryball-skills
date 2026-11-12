import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, camT, LOOKS, LEG_LEN, HEAD, Glow, Classroom, AlarmClock, Schematic, SCH, SchLabel,
  FONT, ShotProps,
} from '../../engine';
import { InsertArm, PersonIcon } from './insert-arm-and-icons';
import { BigRedButton, LightCone, Motes } from './che-night-props';

// Chapter E, "choice": a big red button glows in the dark (E11), everyone pops back on the schematic (E12), three
// quick memories of what comes back (E13-E15: the traffic jam is in shots-che-memory-street.tsx), a wide of Pip
// alone on the dark roof (E16), his mitten over the button (E17) and his face as he weighs it (E18).

const PIP = LOOKS.pipHood;

/** The dark void the button stands in: a faint floor, a red pool under the button, specks in its light. */
const ButtonVoid: React.FC<{ t: number; btn: { x: number; y: number }; lit: number; s?: number }> = ({ t, btn, lit, s = 1 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1900} fill="#05040A" />
    <rect x={-400} y={btn.y - 6} width={2720} height={900} fill="#0C0A14" />
    <ellipse cx={btn.x} cy={btn.y + 4} rx={520 * s} ry={70 * s} fill="#FF3A3A" opacity={0.3 * lit} style={{ mixBlendMode: 'screen' }} />
    <ellipse cx={btn.x} cy={btn.y + 4} rx={900 * s} ry={120 * s} fill="#FF3A3A" opacity={0.12 * lit} style={{ mixBlendMode: 'screen' }} />
    <LightCone cx={btn.x} floorY={btn.y} w={720 * s} top={-300} o={0.5 * lit} />
    <Motes t={t} cx={btn.x} cy={btn.y - 260 * s} r={480 * s} n={60} />
  </g>
);

// ---------- E11: "trước mặt bạn có một cái nút": darkness, then a cone of light and the big red button glowing ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const btn = { x: 1240, y: 900 };
  const lit = easeOut(clamp((t - 36) / 10));
  const pulse = t >= 74 ? Math.max(0, 1 - (t - 74) / 16) : 0;
  const pip: Pose = {
    ...basePose, x: 470, y: 900 - LEG_LEN * 1.25, scale: 1.25, yaw: 0.55, look: 0.7, armL: { a: 8, b: 4 }, armR: { a: 12, b: 6 },
    sway: 3, ...faceAt(t, [[0, 'neutral'], [38, 'shock']]),
  };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 990]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <ButtonVoid t={t} btn={btn} lit={lit} />
      <BigRedButton x={btn.x} y={btn.y} s={1.15} glow={lit + 0.6 * pulse} t={t} id="e11b" />
      <g opacity={lit}>
        <Hero look={PIP} pose={pip} rimId="rimRed" shadow={0} />
      </g>
      {pulse > 0 ? <Glow x={btn.x} y={btn.y - 250} r={520} kind="red" o={0.5 * pulse} /> : null}
    </g>
  );
};

// ---------- E12: schematic, the reverse of the countdown: people icons pop back in; 1 climbs to 8.200.000.000 ----------
export const COLS = 16;
const ROWS = 5;
export const KEEP = 2 * COLS + 8; // the one who was left: you
export const CROWD = Array.from({ length: COLS * ROWS }).map((_, i) => ({
  x: 285 + (i % COLS) * 90,
  y: 330 + Math.floor(i / COLS) * 100,
  at: 12 + rnd(i, 11) * 44, // when this one comes back
}));
const dotted = (v: number) => Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const E12: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 10) / 52);
  const count = p >= 1 ? 8.2e9 : Math.max(1, 8.2e9 * easeOut(p));
  const done = p >= 1;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t + 30} id="e12sch" />
      <SchLabel x={960} y={190} t={t - 2} text="DÂN SỐ THẾ GIỚI" size={50} />
      {CROWD.map((c, i) => {
        if (i === KEEP) return <PersonIcon key={i} x={c.x} y={c.y} s={1.25} on glow />;
        const k = t - c.at;
        if (k < 0) return null;
        const s = k < 5 ? 0.4 + 0.75 * easeOut(k / 5) - 0.15 * clamp((k - 3) / 2) : 1;
        return (
          <g key={i}>
            <PersonIcon x={c.x} y={c.y} s={s} on={k < 9} />
            {k < 8 ? <circle cx={c.x} cy={c.y} r={14 + k * 7} fill="none" stroke={SCH.glow} strokeWidth={3} opacity={0.7 * (1 - k / 8)} /> : null}
          </g>
        );
      })}
      <text x={960} y={920} textAnchor="middle" fontFamily={FONT.ui} fontSize={100} fill={done ? SCH.live : SCH.line} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>
        {dotted(count)}
      </text>
      <SchLabel x={960} y={1000} t={t - 4} text="NGƯỜI" size={36} color={SCH.dim} />
    </g>
  );
};

// ---------- E14: MEMORY: the "KIỂM TRA 15 PHÚT" board in a full classroom ----------
const ChalkTest: React.FC = () => (
  <g fontFamily={FONT.hand} fill="#EDE9DD" opacity={0.88}>
    <text x={740} y={330} textAnchor="middle" fontSize={92}>KIỂM TRA</text>
    <text x={740} y={440} textAnchor="middle" fontSize={84}>15 PHÚT</text>
  </g>
);
export const E14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 880], [len, 960]]), 520, kf(t, [[0, 1.5], [len, 1.7]]))}>
    <Classroom t={t + 60} board={<ChalkTest />} id="e14cls" />
  </g>
);

// ---------- E15: MEMORY: the alarm clock reads 07:00 and rings; mum's shape calls from the doorway, out of focus ----------
export const E15: React.FC<ShotProps> = ({ t, len }) => {
  const ring = Math.sin(t * 2.4) * 3 * (t % 8 < 6 ? 1 : 0.3);
  return (
    <g>
      <g filter="url(#blur10)">
        <rect x={0} y={0} width={1920} height={1080} fill="#4A3A4E" />
        <rect x={1180} y={140} width={420} height={420} fill="#FFE9B8" />
        <path d="M 1390 140 L 1390 560 M 1180 350 L 1600 350" stroke="#7A6070" strokeWidth={14} />
        <rect x={0} y={800} width={1920} height={300} fill="#3A2C3A" />
        <Hero look={LOOKS.mom} pose={{ ...basePose, x: 380, y: 880 - LEG_LEN * 2.1, scale: 2.1, yaw: 0.3, armL: { a: 120, b: 10 }, armR: { a: 40, b: 10 }, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={0} />
      </g>
      <Glow x={1390} y={350} r={620} o={0.55} />
      <g transform={`translate(0 ${kf(t, [[0, 0], [len, -10]])}) rotate(${ring} 960 820)`}>
        <rect x={0} y={880} width={1920} height={300} fill="#5A4030" />
        <rect x={0} y={880} width={1920} height={8} fill="#FFC98A" opacity={0.6} />
        <AlarmClock x={940} y={880} s={3.9} text="07:00" on={1} />
        {[-1, 1].map((sd) => [0, 1, 2].map((k) => (
          <path key={`${sd}${k}`} d={`M ${940 + sd * (520 + k * 70)} ${560 - k * 20} q ${sd * 34} 60 0 120`} stroke="#FFD8A0" strokeWidth={9} strokeLinecap="round" fill="none" opacity={(t + k * 3) % 8 < 5 ? 0.8 - k * 0.2 : 0.2} />
        )))}
      </g>
    </g>
  );
};

// ---------- E17: extreme close-up: his mitten trembling just above the button ----------
export const E17: React.FC<ShotProps> = ({ t, len }) => {
  const btn = { x: 960, y: 1090 };
  const down = easeOut(clamp(t / 30));
  const trem = t > 30 ? Math.sin(t * 2.6) * 3 : 0;
  const hand = { x: 960 + trem, y: kf(t, [[0, 150], [30, 300], [len, 320]], easeOut) + (t > 30 ? Math.sin(t * 1.7) * 3 : 0) };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <ButtonVoid t={t} btn={{ x: 960, y: 1000 }} lit={1} s={2.2} />
      <BigRedButton x={btn.x} y={btn.y} s={2.9} glow={0.9 + 0.1 * down} t={t} id="e17b" />
      <InsertArm x={hand.x} y={hand.y} fx={hand.x + 260} fy={hand.y - 760} rot={180} s={5.4} width={150} />
    </g>
  );
};

// ---------- E18: medium: Pip faces the glowing button, red light on his face, deciding ----------
export const E18: React.FC<ShotProps> = ({ t, len }) => {
  const btn = { x: 1420, y: 960 };
  const sc = 2.0;
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 640, y: 1000 - LEG_LEN * sc, scale: sc, yaw: 0.7, look: 0.9, armL: { a: 8, b: 4 }, armR: { a: 14, b: 6 }, headTilt: 2, sway: 4 } },
    { f: 30, p: { look: 0.2, headTilt: -3 } },
    { f: 52, p: { look: 0.9, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 620, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <ButtonVoid t={t} btn={{ x: btn.x, y: 1000 }} lit={1} s={1.3} />
      <BigRedButton x={btn.x} y={btn.y} s={1.5} glow={1} t={t} id="e18b" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [34, 'tired'], [50, 'worried']]) }} rimId="rimRed" shadow={0} />
      <Glow x={900} y={520} r={460} kind="red" o={0.3} />
    </g>
  );
};
