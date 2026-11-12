import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, walkPose, kf, clamp, easeOut, camT, backOut, rnd, LOOKS, Glow, Dust, FONT, Sparkle,
  Study, Desk, Schematic, SCH, DrawOn, Arrow, SchLabel, PlantIcon, ShotProps,
} from '../../engine';
import { Stuff, StuffKind, CoinIcon, SchoolIcon, CrateIcon } from './che-stuff-and-schematic-icons';
import { BlackCard } from './che-xoi-cart-and-money-props';
import { DayHills, MedSchool, Rice, COAT, KID_A, KID_B, Backpack, School } from './che-world-icons-and-people';

// Chapter E, "smart" (209.5-222.7 s): E6 Pip thinks at his desk, E7 the pile of stuff crossed out, E8 money -> factories
// and schools -> more goods, E9 a medical school rising, E10 scientists in a rice paddy, E11 kids walking to school.

const PIP = LOOKS.pipHood;
const PHASE = 0.62;

// ---------- E6: medium, Pip at his study desk, chin up, thinking; the card lies by the laptop; a thought bubble of "?" ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 900, y: 712, yaw: 0.3, look: 0.5, headTilt: 3, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 30, p: { headTilt: -4, look: 0.1, armR: { a: 40, b: 60 } }, ease: easeOut },
    { f: 64, p: { headTilt: 5, look: 0.6, armR: { a: 18, b: 20 } } },
  ]);
  const bub = backOut(clamp((t - 8) / 10));
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), 590, kf(t, [[0, 1.6], [len, 1.82]]))}>
      <Study t={t + 60} id="e6" veil={0.4} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [30, 'smug'], [70, 'happy']]) }} rimId="rimR" shadow={0} />
      <Desk x0={520} x1={1300} y={700} lamp={false} />
      <BlackCard x={1140} y={688} s={0.34} rot={-8} glow={0.15} />
      <g transform={`translate(1180 360) scale(${bub})`}>
        <circle cx={-90} cy={110} r={9} fill="#F6EFE3" /><circle cx={-64} cy={76} r={14} fill="#F6EFE3" />
        <ellipse cx={0} cy={0} rx={96} ry={66} fill="#F6EFE3" stroke="#1A1230" strokeWidth={5} />
        <text y={26} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={90} fill="#FF8A3D">?</text>
      </g>
      <Glow x={1100} y={470} r={520} o={0.3} />
      <Dust t={t} seed={61} x0={700} y0={380} w={700} h={320} n={16} o={0.4} />
    </g>
  );
};

// ---------- E7: the pile of stuff pops in, then a big red cross draws over it ----------
const PILE: [StuffKind, number, number, number, number][] = [
  ['gift', 760, 700, 1.35, -8], ['bag', 1180, 700, 1.4, 6], ['burger', 960, 720, 1.3, 0],
  ['shoe', 860, 560, 1.3, -10], ['pad', 1090, 560, 1.3, 8], ['phone', 970, 440, 1.2, -5],
];
export const E7: React.FC<ShotProps> = ({ t, len }) => {
  const cross = (t - 30) / 12;
  const c1 = easeOut(clamp(cross));
  const c2 = easeOut(clamp(cross - 0.7));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <defs><radialGradient id="e7bg" cx="0.5" cy="0.5" r="0.75"><stop offset="0" stopColor="#F6C9A0" /><stop offset="1" stopColor="#5B3A52" /></radialGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#e7bg)" />
      <ellipse cx={960} cy={800} rx={520} ry={50} fill="#000" opacity={0.25} />
      <g opacity={1 - 0.45 * c1}>
        {PILE.map(([k, x, y, s, r], i) => {
          const p = backOut(clamp((t - 2 - i * 3) / 7));
          return <Stuff key={k} kind={k} x={x} y={y - (1 - p) * 120} s={s * p} rot={r} />;
        })}
      </g>
      <g stroke="#E23A3A" strokeWidth={40} strokeLinecap="round" style={{ filter: 'drop-shadow(0 4px 0 rgba(26,18,34,0.6))' }}>
        <path d="M 620 330 L 1300 840" strokeDasharray={900} strokeDashoffset={900 * (1 - c1)} />
        <path d="M 1300 330 L 620 840" strokeDasharray={900} strokeDashoffset={900 * (1 - c2)} />
      </g>
    </g>
  );
};

// ---------- E8: schematic: money -> factories and schools -> more goods ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t} id="e8" />
    <CoinIcon x={330} y={520} s={1.6} />
    <SchLabel x={330} y={680} t={t - 4} text="MONEY" />
    <Arrow x0={460} y0={520} x1={700} y1={520} t={t - 8} dur={10} bend={0} />
    <PlantIcon x={900} y={470} kind="factory" on={t > 20 ? 1 : 0} t={t} s={1.5} />
    <SchoolIcon x={1180} y={480} s={1.5} on={t > 24} />
    <SchLabel x={1040} y={680} t={t - 24} text="FACTORIES · SCHOOLS" size={32} />
    <Arrow x0={1330} y0={520} x1={1480} y1={520} t={t - 34} dur={9} bend={0} />
    {[[1580, 430], [1700, 430], [1640, 530], [1580, 630], [1700, 630]].map(([x, y], i) => <CrateIcon key={i} x={x} y={y} s={1.1} t={t - 42 - i * 4} />)}
    <SchLabel x={1640} y={760} t={t - 44} text="MORE" size={34} color={SCH.live} />
  </g>
);

// ---------- E9: a medical school rises out of the ground, a crane swinging beside it ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const rise = clamp((t - 4) / 44);
  const sw = Math.sin(t / 12) * 16;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 940]]), kf(t, [[0, 700], [len, 600]]), kf(t, [[0, 1.2], [len, 1.0]]))}>
      <DayHills id="e9" t={t} y0={640} sunX={1500} />
      <rect x={-400} y={800} width={2720} height={500} fill="#8A6A4A" />
      <rect x={-400} y={800} width={2720} height={14} fill="#B99466" />
      <MedSchool x={900} y={850} s={1.15} rise={rise} id="e9m" />
      {/* tower crane */}
      <g transform="translate(1440 850)" stroke="#F2B33D" strokeWidth={9} fill="none" strokeLinejoin="round">
        <path d="M 0 0 V -520 M 24 0 V -520 M 0 -80 L 24 -140 L 0 -200 L 24 -260 L 0 -320 L 24 -380 L 0 -440" strokeWidth={5} />
        <path d="M -330 -520 H 150 M -330 -520 L 0 -600 L 150 -520" />
        <path d={`M ${-250 + sw} -520 V ${-380 + sw * 0.4}`} stroke="#3A3446" strokeWidth={4} />
        <rect x={-282 + sw} y={-380 + sw * 0.4} width={64} height={40} fill="#C9CDD6" stroke="#3A3446" strokeWidth={4} />
      </g>
      <Sparkle x={900} y={620 - 300 * rise} t={t - 40} s={1.6} />
      <Dust t={t} seed={91} x0={500} y0={400} w={800} h={420} n={18} o={0.35} />
    </g>
  );
};

// ---------- E10: two scientists in a rice paddy: the new rice grows taller than the old ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const grow = easeOut(clamp((t - 6) / 40));
  const sc = 0.95;
  const gy = 850;
  const mk = (x: number, face: 1 | -1): Pose => ({
    ...basePose, x, y: gy - 140 * sc, scale: sc, yaw: face * 0.45, facing: face, headTilt: Math.sin(t / 12 + x) * 3, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 },
  });
  const a = { ...mk(900, 1), armR: { a: 72, b: 10 + 6 * Math.sin(t / 6) } };
  const b = { ...mk(1080, -1), armL: { a: 28, b: 40 } };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1000]]), 640, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <DayHills id="e10" t={t} y0={560} sunX={1400} />
      <rect x={-400} y={620} width={2720} height={700} fill="#6FA8C4" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M -400 ${700 + i * 70} H 2320`} stroke="#9FD0E4" strokeWidth={3} opacity={0.5} />)}
      <Rice x={400} y={800} w={560} h={150} n={13} t={t} seed={3} />
      <Rice x={1560} y={800} w={560} h={150 + 190 * grow} n={13} t={t + 5} seed={7} grain="#F2C94C" />
      <Hero look={COAT} pose={{ ...a, ...faceAt(t, [[0, 'neutral'], [20, 'happy']]) }} rimId="rimR" shadow={0.4} />
      <Hero look={KID_B} pose={{ ...b, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0.4} />
      <g transform={`translate(1010 ${gy - 235})`}><rect x={-26} y={-34} width={52} height={68} rx={5} fill="#F6EFE3" stroke="#1A1230" strokeWidth={4} /><path d="M -14 -14 H 14 M -14 0 H 14 M -14 14 H 8" stroke="#3E8C86" strokeWidth={4} /></g>
      <Rice x={960} y={900} w={1700} h={70} n={30} t={t + 9} seed={11} />
      <Sparkle x={1500} y={430 - 120 * grow} t={t - 34} s={1.4} />
    </g>
  );
};

// ---------- E11: kids with new backpacks walk to school in the morning light ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const gy = 840;
  const kids: [typeof KID_A, number, number, string][] = [[KID_A, 500, 0.74, '#E9654B'], [KID_B, 330, 0.8, '#3E8C86'], [KID_A, 130, 0.7, '#6A7BD9']];
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1050]], (v) => v), 640, 1.25)}>
      <DayHills id="e11" t={t} y0={620} sunX={1100} />
      <rect x={-400} y={800} width={3200} height={500} fill="#C9A878" />
      <rect x={-400} y={800} width={3200} height={12} fill="#E6CC9A" />
      <School x={1650} y={800} s={1.5} t={t} />
      {kids.map(([look, x0, sc, col], i) => {
        const x = x0 + t * 5.2;
        const ph = t * PHASE + i * 1.3;
        const pose = walkPose(x, ph, gy, sc, { ...faceAt(t, [[0, 'happy']]), armL: { a: 22 * Math.sin(ph), b: 14 }, armR: { a: -22 * Math.sin(ph), b: 14 } }, 1);
        return (
          <g key={i}>
            <Backpack x={x - 34 * sc} y={pose.y - 92 * sc} s={sc * 1.15} color={col} flip />
            <Hero look={look} pose={pose} rimId="rimR" shadow={0.5} />
          </g>
        );
      })}
      <Dust t={t} seed={111} x0={400} y0={400} w={1600} h={420} n={16} o={0.35} />
    </g>
  );
};
