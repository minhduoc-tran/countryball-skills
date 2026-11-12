import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Schematic, SCH, FONT, Glow, Dust, LightVeil, Foreground,
  joints, toWorld, ShotProps,
} from '../../engine';
import { WorldMap } from '../tien-vo-han/chb-hunger-map-props';
import { Banknote, SavingsBook, GroceryBasket } from '../tien-vo-han/chd-props-money-and-icons';
import { BigStat, Cap } from '../khong-ai-ngheo/cha-number-card-props';
import { FlatDusk, Balloon, TearCalendar, GdpBars, PlumWall } from './chd-economy-props';
import { SourceTag, ThatReal, Pin } from './chd-card-props';
import { SpareRoom, FLOOR } from './chd-spare-room-props';

// Chapter D (183.0-195.0 s), "year one: economy", look y1. D1 a tear-off calendar loses a year of months, D2 the KINH TẾ
// balloon goes flat, D3-D5 the real number on the blueprint (Ukraine 2022, GDP down about a third, source World Bank, "đó là
// thật"), D6-D7 mum counts the same notes while the basket they buy shrinks month by month.

const MOM = LOOKS.mom;

// ---------- D1: "Năm đầu tiên.": a tear-off calendar, the months fly off one after another ----------
export const D1: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(kf(t, [[0, 940], [45, 980]]), 520, kf(t, [[0, 1.0], [45, 1.12]]))}>
    <PlumWall />
    <TearCalendar x={960} y={240} w={620} p={kf(t, [[0, 0], [43, 11.8]], (v) => v)} />
    <Dust t={t} seed={61} x0={500} y0={200} w={900} h={600} n={26} o={0.5} />
    <Foreground blur={16}><path d="M -300 1100 L -300 640 Q 60 600 280 700 L 300 1100 Z" fill="#120C18" /></Foreground>
    <LightVeil id="d1veil" lights={[[960, 560, 820]]} o={0.34} />
  </g>
);

// ---------- D2: "co lại như một quả bóng xì hơi": the KINH TẾ balloon sinks and goes flat ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 540], [len, 700]]), kf(t, [[0, 1.3], [len, 1.55]]))}>
    <FlatDusk id="d2" />
    <Balloon x={960} y={470} k={kf(t, [[0, 1], [9, 1], [len - 6, 0.2]])} t={t} />
    <Dust t={t} seed={62} x0={300} y0={200} w={1300} h={600} n={20} o={0.4} />
  </g>
);

// ---------- D3: "Năm 2022,": a plain outline map, a pin and the label UKRAINE ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1040]]), kf(t, [[0, 540], [len, 480]]), kf(t, [[0, 1.0], [len, 1.15]]))}>
    <Schematic t={t} id="d3sch" />
    <WorldMap x={210} y={170} s={1.5} o={0.75} />
    <Pin x={1087} y={372} t={t - 6} s={1.1} />
    <g transform={`translate(1087 205) scale(${backOut(clamp((t - 10) / 7))})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={54} fill={SCH.line} stroke="#101A2A" strokeWidth={8} paintOrder="stroke" letterSpacing={4}>UKRAINE</text>
    </g>
    <g transform={`translate(600 880) scale(${backOut(clamp((t - 2) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={250} fill={SCH.live} stroke="#101A2A" strokeWidth={16} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}66)` }}>2022</text>
    </g>
  </g>
);

// ---------- D4: "kinh tế Ukraine giảm gần": two GDP bars, the second drops ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 990]]), 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t + 40} id="d4sch" />
    <GdpBars t={t} len={len} />
    <Cap x={1480} y={170} t={t - 4} text="UKRAINE · 2022" size={44} />
  </g>
);

// ---------- D5: "một phần ba. Đó là thật.": ≈ -1/3, the source tag, the tick ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Schematic t={t + 70} id="d5sch" />
    <Cap x={960} y={250} t={t - 1} text="GDP · UKRAINE · 2022" size={46} />
    <BigStat x={960} y={560} t={t - 2} text="≈ -1/3" size={300} />
    <ThatReal x={960} y={800} t={t - 33} />
    <SourceTag x={96} y={976} t={t - 8} text="WORLD BANK" />
  </g>
);

// ---------- D6: "Tiền tiết kiệm của mẹ mua được": mum in the spare room by the lamp, counting the same few notes ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.15;
  const hipY = FLOOR - 80 * sc;
  const flip = Math.sin(t / 5);
  const pose: Pose = {
    ...poseAt(t, [{ f: 0, p: { x: 900, y: hipY, scale: sc, yaw: 0.85, facing: 1, legL: { a: 84, b: -84 }, legR: { a: 88, b: -80 }, armL: { a: 20, b: 20 }, armR: { a: 58, b: 58 }, headTilt: 6, look: 0.5 } }]),
    armR: { a: 58 + flip * 5, b: 58 - flip * 8 },
    ...faceAt(t, [[0, 'worried']]),
  };
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1040], [len, 1070]]), 650, kf(t, [[0, 1.5], [len, 1.66]]))}>
      <SpareRoom t={t + 20} id="d6" night={1} />
      <rect x={836} y={FLOOR - 82 * 1.15 + 4} width={130} height={16} rx={6} fill="#7A5A3A" />
      <rect x={846} y={FLOOR - 82 * 1.15 + 20} width={14} height={82 * 1.15 - 22} fill="#5A4026" />
      <rect x={942} y={FLOOR - 82 * 1.15 + 20} width={14} height={82 * 1.15 - 22} fill="#5A4026" />
      <rect x={1060} y={FLOOR - 190} width={300} height={22} rx={6} fill="#7A5A3A" />
      <rect x={1080} y={FLOOR - 168} width={22} height={168} fill="#5A4026" />
      <rect x={1318} y={FLOOR - 168} width={22} height={168} fill="#5A4026" />
      <Hero look={MOM} pose={pose} rimId="rimR" shadow={0} />
      <SavingsBook x={1280} y={FLOOR - 252} w={104} rot={-8} worn={0.6} />
      {[-10, 0, 10].map((r, i) => <Banknote key={i} x={1130 + i * 6} y={FLOOR - 196 - i * 4} w={150} rot={r - 2 + (i === 2 ? flip * 4 : 0)} />)}
      <g transform={`translate(${hand.x} ${hand.y})`}><Banknote x={30} y={-8} w={140} rot={-14 + flip * 6} /></g>
      <LightVeil id="d6veil" lights={[[1190, 600, 520]]} o={0.5} />
      <Dust t={t} seed={63} x0={800} y0={400} w={600} h={400} n={18} o={0.5} />
    </g>
  );
};

// ---------- D7: "ít hơn sau mỗi tháng": the same three notes beside a basket that loses an item a month ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const prog = clamp(t / (len - 6));
  const month = Math.min(12, 1 + Math.floor(prog * 12));
  const left = 6 - 5.4 * prog;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <PlumWall glowX={960} glowY={420} />
      <rect x={-400} y={780} width={2720} height={40} fill="#6A4A32" />
      <rect x={-400} y={780} width={2720} height={5} fill="#FFC98A" opacity={0.4} />
      <rect x={-400} y={820} width={2720} height={700} fill="#2A1E26" />
      {[-9, 0, 9].map((r, i) => (
        <g key={i} transform={`translate(${470 + i * 70} ${780 - 70}) rotate(${r})`}><Banknote x={0} y={0} w={250} /></g>
      ))}
      <text x={850} y={640} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={140} fill="#F6EFE3">=</text>
      <g opacity={0.16}><GroceryBasket x={1300} y={780} s={1.7} left={6} /></g>
      <GroceryBasket x={1300} y={780} s={1.7} left={left} />
      <g transform={`translate(960 190)`}>
        <rect x={-210} y={-52} width={420} height={104} rx={52} fill="#0B0816" opacity={0.78} />
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#F6EFE3" letterSpacing={3}>THÁNG <tspan fill={SCH.live}>{month}</tspan></text>
        {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-165 + i * 30} cy={78} r={7} fill={i < month ? SCH.live : '#4A4660'} />)}
      </g>
      <Glow x={1300} y={640} r={420} o={0.18 * easeOut(clamp(t / 8))} />
    </g>
  );
};
