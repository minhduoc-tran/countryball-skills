import React from 'react';
import { Hero, Pose, basePose, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Schematic, SCH, FONT, ShotProps, rnd } from '../../engine';
import { Globe } from './kit-globe';
import { Fish } from '../sun-disappeared/chd-ocean-props';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { Anchovy, Lbl } from './chc-life-props';
import { FishPlate, ProteinPie, SauceBottle, RiceBowl } from './chc-food-econ-props';

// Chapter C, beat "5 food" (129.0-137.7 s): C8 globe of 3 TỶ NGƯỜI, C9 the fish plate, C10 protein pie ≥ 1/5, C11 cá cơm gone (crossed out),
// C12 Pip mourns his rice, the nước mắm bottle empty.

const PIP = LOOKS.pipHood;

// ---------- C8: a globe with glowing people-dots, "3 TỶ", a row of person icons lighting up ----------
const DOTS: [number, number][] = [[0.28, -0.22], [0.1, 0.1], [-0.3, -0.1], [0.4, 0.2], [-0.05, -0.4], [-0.2, 0.3], [0.5, -0.05]];
export const C8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Schematic t={t} id="c8sch" />
    <Globe id="c8g" t={t + 30} r={330} cx={560} cy={520} />
    {DOTS.map(([dx, dy], i) => {
      const p = easeOut(clamp((t - 4 - i * 2) / 6));
      return <circle key={i} cx={560 + dx * 330} cy={520 + dy * 330} r={(12 + Math.sin(t / 5 + i) * 3) * p} fill={SCH.live} stroke="#FFF3DC" strokeWidth={4} opacity={0.95} />;
    })}
    <g transform={`translate(1290 ${560 - 40 * (1 - easeOut(clamp(t / 8)))})`} opacity={clamp(t / 5)}>
      <text textAnchor="middle" y={0} fontFamily={FONT.ui} fontWeight={700} fontSize={250} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>3 TỶ</text>
      <text textAnchor="middle" y={120} fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill={SCH.line} letterSpacing={6}>NGƯỜI</text>
    </g>
    {Array.from({ length: 8 }).map((_, i) => <PersonIcon key={i} x={950 + i * 85} y={800} s={1.5} on={t > 10 + i * 2} glow={t > 10 + i * 2} o={clamp((t - 6 - i) / 4)} />)}
  </g>
);

// ---------- C9: a plate of grilled fish on a wooden table, steam rising; a sauce dish beside it ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 990]]), 540, kf(t, [[0, 1.05], [len, 1.28]]))}>
    <rect x={-300} y={-300} width={2520} height={1700} fill="#7B4C2C" />
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-300} y={-300 + i * 190} width={2520} height={6} fill="#4F2F1A" opacity={0.7} />)}
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-200 + rnd(1, i) * 2200} ${-200 + rnd(2, i) * 1400} h ${80 + rnd(3, i) * 160}`} stroke="#935E38" strokeWidth={4} opacity={0.5} />)}
    <rect x={-300} y={-300} width={2520} height={1700} fill="#000" opacity={0.12} />
    <g transform="translate(1320 700)"><ellipse rx={110} ry={104} fill="#F7F3EA" stroke="#14121A" strokeWidth={5} /><ellipse rx={74} ry={68} fill="#8E3F12" /><ellipse rx={74} ry={68} cx={-12} cy={-12} fill="#B25A22" opacity={0.5} /></g>
    <path d="M 340 250 L 1540 880 M 380 210 L 1580 840" stroke="#E0B97A" strokeWidth={12} strokeLinecap="round" opacity={0.0} />
    <FishPlate x={900} y={540} s={1.55} t={t} />
    <path d="M 1500 170 L 1030 640 M 1560 200 L 1090 680" stroke="#D9AE6B" strokeWidth={13} strokeLinecap="round" />
  </g>
);

// ---------- C10: the protein pie: one slice of five lights up, "≥ 1/5 ĐẠM ĐỘNG VẬT" ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const lit = clamp((t - 8) / 14);
  const a = (-54 * Math.PI) / 180;
  const rr = 300 * 0.62 + easeOut(lit) * 38;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="c10sch" />
      <ProteinPie x={620} y={560} r={300} lit={lit} />
      <g transform={`translate(${620 + Math.cos(a) * rr} ${560 + Math.sin(a) * rr}) scale(${0.9 + 0.1 * Math.sin(t / 6)})`}><Fish x={0} y={0} s={1.0} t={t} /></g>
      <g transform={`translate(1330 ${520 - 30 * (1 - easeOut(clamp((t - 6) / 8)))})`} opacity={clamp((t - 6) / 5)}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={230} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>≥ 1/5</text>
        <text textAnchor="middle" y={110} fontFamily={FONT.ui} fontWeight={700} fontSize={70} fill={SCH.line} letterSpacing={4}>ĐẠM</text>
        <text textAnchor="middle" y={196} fontFamily={FONT.ui} fontWeight={700} fontSize={70} fill={SCH.line} letterSpacing={4}>ĐỘNG VẬT</text>
      </g>
    </g>
  );
};

// ---------- C11: a shoal of cá cơm swims by; at "không còn" the shoal vanishes and a big red X crosses the fish ----------
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const gone = easeOut(clamp((t - 19) / 7));
  const x1 = easeOut(clamp((t - 22) / 6));
  const x2 = easeOut(clamp((t - 26) / 6));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <defs><linearGradient id="c11g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4FA5DC" /><stop offset="1" stopColor="#14456B" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#c11g)" />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${300 + i * 520} -100 L ${100 + i * 520} 1200 L ${260 + i * 520} 1200 L ${480 + i * 520} -100 Z`} fill="#FFFFFF" opacity={0.06} />)}
      {Array.from({ length: 18 }).map((_, i) => {
        const x = ((rnd(5, i) * 2300 + t * (9 + rnd(6, i) * 5)) % 2300) - 200;
        const y = 180 + rnd(7, i) * 700 + Math.sin(t / 8 + i) * 12;
        return <g key={i} opacity={1 - gone} transform={`translate(${x} ${y}) scale(${1 - gone * 0.6})`}><Anchovy x={0} y={0} s={0.9 + rnd(8, i) * 0.5} t={t + i * 3} /></g>;
      })}
      <g style={{ filter: `grayscale(${gone})` }}><Anchovy x={960} y={520 + Math.sin(t / 9) * 10} s={3.4} t={t} /></g>
      <path d="M 700 280 L 1220 780" stroke="#E83A2E" strokeWidth={46} strokeLinecap="round" strokeDasharray="800" strokeDashoffset={800 * (1 - x1)} opacity={x1 > 0 ? 1 : 0} />
      <path d="M 1220 280 L 700 780" stroke="#E83A2E" strokeWidth={46} strokeLinecap="round" strokeDasharray="800" strokeDashoffset={800 * (1 - x2)} opacity={x2 > 0 ? 1 : 0} />
      <Lbl x={960} y={900} text="CÁ CƠM" size={64} o={clamp((t - 3) / 5)} />
    </g>
  );
};

// ---------- C12: Pip at the table: steaming rice (cooling), the nước mắm bottle runs dry; he slumps ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => {
  const S = 1.75;
  const slump = easeOut(clamp(t / 30));
  const pip: Pose = { ...basePose, x: 1010, y: 700, scale: S, yaw: -0.5, facing: -1, look: -0.9, headTilt: 4 * (1 - slump) + -12 * slump, tilt: -3 * slump, armL: { a: 6, b: 6 }, armR: { a: 8, b: 6 }, ...faceAt(t, [[0, 'neutral'], [10, 'tired']]) };
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <defs>
        <linearGradient id="c12w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C98F5A" /><stop offset="1" stopColor="#8F5A36" /></linearGradient>
        <radialGradient id="c12l" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFE2A0" stopOpacity="0.7" /><stop offset="1" stopColor="#FFE2A0" stopOpacity="0" /></radialGradient>
      </defs>
      <rect x={-200} y={-100} width={2320} height={900} fill="url(#c12w)" />
      <circle cx={900} cy={120} r={560} fill="url(#c12l)" />
      <path d="M 900 -100 V 120" stroke="#3A2A1E" strokeWidth={6} /><path d="M 820 150 Q 900 70 980 150 Z" fill="#E9C46A" stroke="#14121A" strokeWidth={5} />
      <rect x={1380} y={160} width={300} height={260} rx={10} fill="#8CCBE8" stroke="#5B3A22" strokeWidth={14} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0} />
      <rect x={-200} y={790} width={2320} height={400} fill="#5E3B22" />
      <rect x={-200} y={790} width={2320} height={64} fill="#8A5A34" /><rect x={-200} y={850} width={2320} height={6} fill="#3A2412" />
      <RiceBowl x={700} y={846} s={1.15} steam={1 - clamp(t / 34)} t={t} />
      <SauceBottle x={1470} y={850} s={1.05} level={0.14 * (1 - clamp(t / 22))} t={t} />
    </g>
  );
};
