import React from 'react';
import { Hero, joints, toWorld, poseAt, faceAt, camT, kf, clamp, backOut, Glow, Dust, FONT, SCH, Look, ShotProps } from '../../engine';
import { Grass } from '../last-one/shots-chc-shared-props-and-cards';
import { RiceTruck, RiceSack, ConicalHat, FARMER, VENDOR, NEIGHBOURS } from './chc-props-food-and-trade';
import { PosTerminal, BlackCard, PriceTag, INK } from './chc-props-money-and-prices';

// Chapter C, the rice: the truck of 10.000 sacks heads for the flood (C8), the farmer can only plant so fast (C9),
// slow paddy against fast card swipes in a split frame (C10), and the rice stall runs dry while the price climbs (C11).

const Sky: React.FC<{ id: string; a: string; b: string; h?: number }> = ({ id, a, b, h = 700 }) => (
  <g>
    <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient></defs>
    <rect x={-100} y={-100} width={2200} height={h + 100} fill={`url(#${id})`} />
  </g>
);

// ---------- C8: the truck of rice sacks drives along a road, the flooded village on the horizon ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = t * 5;
  const wrap = (x: number, w = 2600) => ((x % w) + w) % w - 300;
  const truckX = kf(t, [[0, 640], [len, 1000]], (v) => v);
  return (
    <g>
      <Sky id="c8sky" a="#5B3F7A" b="#F0A070" h={700} />
      <circle cx={1500} cy={560} r={150} fill="#FFD9A0" opacity={0.9} />
      <Glow x={1500} y={560} r={700} o={0.5} />
      <path d={`M -100 640 Q 300 520 700 610 T 1500 590 T 2100 640 V 700 H -100 Z`} fill="#4A3868" opacity={0.8} />
      <rect x={-100} y={640} width={2200} height={140} fill="#6F8CA8" />
      <rect x={-100} y={640} width={2200} height={10} fill="#FFD9A0" opacity={0.5} />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M ${wrap(i * 380 - sc * 0.2 + 40)} ${670 + (i % 3) * 36} h 120`} stroke="#B8D0E4" strokeOpacity={0.5} strokeWidth={5} strokeLinecap="round" />)}
      {Array.from({ length: 6 }).map((_, i) => {
        const x = wrap(i * 460 - sc * 0.35);
        return (
          <g key={i} transform={`translate(${x} 700)`}>
            <rect x={-60} y={-70} width={120} height={70} fill="#D9B788" stroke={INK} strokeWidth={3} />
            <path d="M -76 -70 L 0 -122 L 76 -70 Z" fill="#B5583E" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
            <rect x={-80} y={-26} width={160} height={30} fill="#6F8CA8" opacity={0.85} />
          </g>
        );
      })}
      <rect x={-100} y={760} width={2200} height={260} fill="#4A4658" />
      <rect x={-100} y={760} width={2200} height={12} fill="#FFD9A0" opacity={0.45} />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={wrap(i * 300 - sc * 2.4)} y={888} width={150} height={10} rx={5} fill="#E8DCC0" opacity={0.8} />)}
      <RiceTruck x={truckX} y={880} s={1.0} t={t} />
      {Array.from({ length: 5 }).map((_, i) => {
        const p = ((t * 0.04 + i / 5) % 1);
        return <circle key={i} cx={truckX - 400 - p * 200} cy={870 - p * 40} r={14 + p * 40} fill="#D9C7A6" opacity={0.35 * (1 - p)} />;
      })}
      <g transform={`translate(${960} 150) scale(${backOut(clamp((t - 6) / 8))})`}>
        <rect x={-250} y={-46} width={500} height={92} rx={46} fill="#0B0816" opacity={0.7} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill="#F6EFE3" letterSpacing={2}>10.000 BAO GẠO</text>
      </g>
    </g>
  );
};

// ---------- C9: the farmer plants one seedling at a time; a snail crosses the front ----------
const ROWS = [0, 1, 2, 3, 4];
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const dip = Math.sin(t / 9);
  const pose = poseAt(t, [{ f: 0, p: { x: 780, y: 650, scale: 1.45, yaw: 0.65, tilt: 24, armL: { a: 52 + dip * 14, b: -30 }, armR: { a: 40, b: -20 }, legL: { a: 12, b: 0 }, legR: { a: -10, b: 0 } } }]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 540, kf(t, [[0, 1], [len, 1.1]]))}>
      <Sky id="c9sky" a="#8FB8C0" b="#F7DDB0" h={560} />
      <Glow x={1450} y={430} r={800} o={0.6} />
      <path d="M -100 470 Q 250 330 560 450 T 1200 420 T 2100 450 V 560 H -100 Z" fill="#6E8F7A" opacity={0.8} />
      <path d="M -100 520 Q 400 470 900 520 T 2100 510 V 600 H -100 Z" fill="#4E7B52" />
      <rect x={-100} y={560} width={2200} height={600} fill="#9CC4B4" />
      {ROWS.map((r) => (
        <g key={r}>
          <rect x={-100} y={600 + r * 90 + 70} width={2200} height={8} fill="#6E9E8E" opacity={0.7} />
          {Array.from({ length: 9 - r }).map((_, i) => <Grass key={i} x={100 + i * (230 + r * 18) + (r % 2) * 90} y={640 + r * 100} t={t + i * 7} h={56 + r * 14 + kf(t, [[0, 0], [len, 5]], (v) => v)} w={80 + r * 14} n={7} seed={r * 11 + i} />)}
        </g>
      ))}
      <ellipse cx={780} cy={800} rx={220} ry={22} fill="#000" opacity={0.25} />
      <Hero look={FARMER} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
      <ConicalHat pose={pose} dy={18} />
      <g transform={`translate(${toWorld(pose, joints(pose).armR.end).x} ${toWorld(pose, joints(pose).armR.end).y + 8}) rotate(${Math.sin(t / 9) * 6})`}>
        {[-40, -22, -8, 8, 22, 40].map((a, i) => (
          <g key={i} transform={`rotate(${a})`}>
            <path d="M 0 0 L 0 -92" stroke={INK} strokeWidth={13} strokeLinecap="round" />
            <path d="M 0 0 L 0 -92" stroke={i % 2 ? '#8FD45E' : '#6FB352'} strokeWidth={7} strokeLinecap="round" />
          </g>
        ))}
        <rect x={-22} y={-16} width={44} height={14} rx={5} fill="#C9A24A" stroke={INK} strokeWidth={3} />
      </g>
      <g transform={`translate(${1260 + t * 0.6} 960)`}>
        <ellipse cx={4} cy={6} rx={70} ry={9} fill="#000" opacity={0.3} />
        <path d="M -52 0 Q 0 -14 56 0 Q 66 -2 70 -14 Q 54 -8 48 -8" fill="#D9B896" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <circle cx={0} cy={-34} r={36} fill="#C9884A" stroke={INK} strokeWidth={4} />
        <path d="M 0 -34 m -18 0 a 18 18 0 1 1 18 18" fill="none" stroke={INK} strokeWidth={4} />
        <path d="M 64 -12 L 78 -44 M 70 -10 L 90 -36" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </g>
      <Dust t={t} seed={61} x0={200} y0={200} w={1500} h={500} n={22} o={0.5} />
    </g>
  );
};

// ---------- C10: split frame. Left: the seedling barely grows. Right: the card swipes again and again ----------
const SWIPE = 7;
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const sprout = kf(t, [[0, 62], [len, 76]], (v) => v);
  const ph = (t % SWIPE) / SWIPE;
  const n = Math.floor(t / SWIPE);
  const cardY = 300 + 120 * Math.abs(Math.sin(ph * Math.PI));
  return (
    <g>
      <defs>
        <clipPath id="c10l"><rect x={0} y={0} width={945} height={1080} /></clipPath>
        <clipPath id="c10r"><rect x={975} y={0} width={945} height={1080} /></clipPath>
      </defs>
      <g clipPath="url(#c10l)">
        <Sky id="c10sky" a="#9CC4B4" b="#F7DDB0" h={620} />
        <rect x={0} y={620} width={945} height={460} fill="#6E9E8E" />
        <path d="M 0 700 H 945 M 0 820 H 945 M 0 940 H 945" stroke="#4E7B52" strokeOpacity={0.5} strokeWidth={6} />
        <g transform="translate(470 860)">
          <ellipse cx={0} cy={10} rx={120} ry={16} fill="#4A3A28" />
          <path d={`M 0 0 V ${-sprout * 3.2}`} stroke="#4E9B4A" strokeWidth={14} strokeLinecap="round" />
          <path d={`M 0 ${-sprout * 2.6} Q -80 ${-sprout * 2.9} -96 ${-sprout * 2.2} Q -40 ${-sprout * 2.4} 0 ${-sprout * 2.6} Z`} fill="#6FB352" stroke={INK} strokeWidth={4} />
          <path d={`M 0 ${-sprout * 3.2} Q 80 ${-sprout * 3.5} 100 ${-sprout * 2.8} Q 40 ${-sprout * 3} 0 ${-sprout * 3.2} Z`} fill="#6FB352" stroke={INK} strokeWidth={4} />
          <path d={`M 150 0 V ${-sprout * 3.2}`} stroke={SCH.live} strokeWidth={4} strokeDasharray="8 8" />
          <path d="M 130 -208 L 150 -232 L 170 -208" stroke={SCH.live} strokeWidth={5} fill="none" />
        </g>
        <text x={472} y={200} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={110} fill="#2F5A3A">LÚA</text>
        <g transform={`translate(${200 + t * 0.7} 990)`}>
          <path d="M -40 0 Q 0 -10 44 0 Q 52 -2 54 -12" fill="#D9B896" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={-26} r={26} fill="#C9884A" stroke={INK} strokeWidth={4} />
        </g>
      </g>
      <g clipPath="url(#c10r)">
        <rect x={945} y={0} width={975} height={1080} fill="#14182A" />
        <PosTerminal x={1470} y={640} s={0.95} ok={n >= 0 ? 1 : 0} t={t} rot={-2} />
        <BlackCard x={1370} y={cardY} rot={-8} s={1.1} />
        {[0, 1, 2].map((k) => {
          const p = clamp(((t - k * SWIPE * 0.6) % (SWIPE * 3)) / (SWIPE * 3));
          const nn = Math.floor((t - k * SWIPE * 0.6) / (SWIPE * 3));
          return nn >= 0 ? <text key={k} x={1650 + (k % 2) * 110} y={560 - p * 300} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={46} fill={SCH.live} opacity={Math.sin(p * Math.PI)}>+10.000</text> : null;
        })}
        <text x={1085} y={200} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={110} fill="#7FE0A8">THẺ</text>
      </g>
      <rect x={945} y={0} width={30} height={1080} fill="#F2B33D" />
    </g>
  );
};

// ---------- C11: the rice stall runs dry, then the price tag climbs and everyone frowns ----------
const PRICES = ['20.000', '24.000', '29.000', '35.000'];
const SELLER: Look = { ...VENDOR, jacket: '#7A9A6A', jacketShade: '#5E7C50', limb: '#7A9A6A' };
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const step = t < 36 ? 0 : t < 52 ? 1 : t < 68 ? 2 : 3;
  const since = t - [0, 36, 52, 68][step];
  const bump = step > 0 ? 1 + 0.25 * Math.max(0, 1 - since / 8) : 1;
  const rice = kf(t, [[0, 0.5], [30, 0.08], [len, 0.02]], (v) => v);
  const scoop = poseAt(t, [{ f: 0, p: { x: 960, y: 590, scale: 1.3, yaw: 0, armR: { a: 40, b: -50 }, armL: { a: 20, b: -20 } } }, { f: 14, p: { armR: { a: 70, b: -40 } } }, { f: 28, p: { armR: { a: 36, b: -50 } } }, { f: 44, p: { armR: { a: 70, b: -40 } } }, { f: 60, p: { armR: { a: 36, b: -50 } } }]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.1]]))}>
      <rect x={-100} y={-100} width={2200} height={1300} fill="#3A2A30" />
      <Glow x={960} y={200} r={900} o={0.55} />
      <path d="M -100 120 H 2100 V 260 L 1960 300 Q 1860 330 1760 300 Q 1660 330 1560 300 Q 1460 330 1360 300 Q 1260 330 1160 300 Q 1060 330 960 300 Q 860 330 760 300 Q 660 330 560 300 Q 460 330 360 300 Q 260 330 160 300 L -100 260 Z" fill="#C8483E" />
      <path d="M -100 120 H 2100 V 150 H -100 Z" fill="#FFD9A0" opacity={0.4} />
      <rect x={-100} y={640} width={2200} height={500} fill="#6A4A34" />
      <rect x={-100} y={640} width={2200} height={14} fill="#FFD9A0" opacity={0.5} />
      <rect x={-100} y={600} width={2200} height={40} fill="#8A6A4E" />
      <Hero look={SELLER} pose={{ ...scoop, ...faceAt(t, [[0, 'neutral'], [30, 'worried']]) }} rimId="rimR" shadow={0} />
      <RiceSack x={770} y={600} s={1.1} rot={-8} open={1} />
      <RiceSack x={1180} y={600} s={1.1} rot={9} open={1} />
      {[560, 960, 1360].map((x, i) => (
        <g key={i} transform={`translate(${x} 640)`}>
          <ellipse cx={0} cy={4} rx={190} ry={16} fill="#000" opacity={0.35} />
          <path d="M -170 0 Q -180 -60 -150 -100 L 150 -100 Q 180 -60 170 0 Z" fill="#B8935A" stroke={INK} strokeWidth={4} />
          <path d="M -150 -50 H 160 M -165 -22 H 168" stroke="#8A6A3A" strokeWidth={4} />
          <ellipse cx={0} cy={-100} rx={152} ry={22} fill="#7A5A32" stroke={INK} strokeWidth={4} />
          <path d={`M -140 -100 Q 0 ${-100 - 110 * rice * (1 - i * 0.15)} 140 -100 Z`} fill="#F7F1DC" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      <g transform="translate(640 270)">
        <g transform={`scale(${bump})`}><PriceTag x={0} y={0} s={1.1} rot={Math.sin(t / 7) * 3} text={PRICES[step]} sub="đ/KG" ink={step ? '#C23A2E' : INK} /></g>
      </g>
      {[[200, 1.45, 0], [470, 1.35, 1], [1500, 1.4, 2], [1760, 1.5, 3]].map(([x, s, i]) => {
        const pose = poseAt(t, [{ f: 0, p: { x: x + Math.sin(t / 18 + i) * 3, y: 760, scale: s, yaw: i < 2 ? 0.55 : -0.55, facing: i < 2 ? 1 : -1, tilt: i < 2 ? 3 : -3, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } } }]);
        return <Hero key={i} look={NEIGHBOURS[(i + 1) % 5]} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [38 + i * 6, i % 2 ? 'tired' : 'worried']]) }} rimId="rimR" shadow={0} />;
      })}
      <Dust t={t} seed={62} x0={100} y0={200} w={1700} h={500} n={22} o={0.4} />
    </g>
  );
};
