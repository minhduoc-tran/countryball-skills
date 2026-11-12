import React from 'react';
import { Schematic, SchLabel, SCH, FONT, kf, clamp, easeOut, backOut, camT, Sparkle, ShotProps } from '../../engine';
import { dots, ClockIcon, CalendarIcon, CoinPile, BillWall, CalcIcon, BigNum } from './chb-math-icons';

// Chapter B, the math (1/2): "Thử làm một phép tính nhé", then a minute, an hour, a day and a year of 1.000 đ a second as
// escalating schematic cards. The ping look is OFF here. Each shot is a pure function of its own clock t.

const cnt = (t: number, from: number, to: number, v: number) => v * easeOut(clamp((t - from) / (to - from)));

// ---------- B1: the calculator: "1.000 × 60" typed in, the equals key lit, a question mark pops ----------
export const B1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 940]]), 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Schematic t={t} id="b1" />
    <CalcIcon x={680} y={540} s={1.7} t={t} typed="1000x60" result="?" resultAt={26} />
    <SchLabel x={1360} y={480} t={t - 6} text="1.000 đ" size={130} color={SCH.live} />
    <SchLabel x={1360} y={590} t={t - 12} text="MỖI GIÂY" size={68} color={SCH.line} />
    <g transform={`translate(1560 280) scale(${backOut(clamp((t - 26) / 8))}) rotate(${Math.sin(t / 5) * 6})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={220} fill={SCH.glow}>?</text>
    </g>
    <Sparkle x={1010} y={300} t={t - 26} s={1} />
  </g>
);

// A card for one step of the scale: a clock icon with its caption on the left, the formula and the counting amount on
// the right, a growing pile of money below it.
const Card: React.FC<{
  t: number; len: number; id: string; caption: string; formula: string; amount: number; cFrom: number; cTo: number; numSize: number;
  icon: React.ReactNode; pile: React.ReactNode; zoom: [number, number]; cx?: [number, number]; dingAt: number;
}> = ({ t, len, id, caption, formula, amount, cFrom, cTo, numSize, icon, pile, zoom, cx = [940, 980], dingAt }) => {
  const done = t >= dingAt;
  return (
    <g transform={camT(kf(t, [[0, cx[0]], [len, cx[1]]]), 540, kf(t, [[0, zoom[0]], [len, zoom[1]]]))}>
      <Schematic t={t} id={id} />
      {icon}
      <SchLabel x={470} y={780} t={t - 4} text={caption} size={64} color={SCH.line} />
      <SchLabel x={1260} y={290} t={t - 5} text={formula} size={46} color={SCH.dim} />
      <BigNum x={1260} y={450} text={`${dots(cnt(t, cFrom, cTo, amount))} đ`} size={numSize} pop={done ? (t - dingAt) / 6 : 1} />
      {pile}
      <Sparkle x={1700} y={330} t={t - dingAt} s={1} />
    </g>
  );
};

// ---------- B2: one minute: the clock sweeps one turn, 60.000 đ, one coin column ----------
export const B2: React.FC<ShotProps> = ({ t, len }) => (
  <Card t={t} len={len} id="b2" caption="1 PHÚT" formula="1.000 đ × 60" amount={60000} cFrom={18} cTo={36} numSize={150} zoom={[1.0, 1.1]} dingAt={40}
    icon={<ClockIcon x={470} y={440} r={220} t={t} turns={1} dur={40} glow />}
    pile={<CoinPile x={1260} y={950} t={t - 20} cols={2} per={4} s={2.0} />} />
);

// ---------- B3: one hour: the minute hand whirls, 3.600.000 đ, a small pile ----------
export const B3: React.FC<ShotProps> = ({ t, len }) => (
  <Card t={t} len={len} id="b3" caption="1 GIỜ" formula="1.000 đ × 3.600" amount={3600000} cFrom={26} cTo={50} numSize={140} zoom={[1.1, 1.0]} dingAt={56} cx={[1000, 940]}
    icon={<ClockIcon x={470} y={440} r={220} t={t} turns={3} dur={40} glow />}
    pile={<CoinPile x={1260} y={950} t={t - 22} cols={5} per={8} s={1.6} />} />
);

// ---------- B4: one day: the hands blur round, 86.400.000 đ, a tall pile ----------
export const B4: React.FC<ShotProps> = ({ t, len }) => (
  <Card t={t} len={len} id="b4" caption="1 NGÀY" formula="1.000 đ × 86.400" amount={86400000} cFrom={16} cTo={40} numSize={128} zoom={[1.0, 1.12]} dingAt={43} cx={[940, 1000]}
    icon={<ClockIcon x={470} y={440} r={220} t={t} turns={8} dur={36} glow />}
    pile={<CoinPile x={1260} y={960} t={t - 12} cols={9} per={12} s={1.25} step={1.6} />} />
);

// ---------- B5: the same sum as a wall of banknote bricks climbing, the number shaking with weight ----------
export const B5: React.FC<ShotProps> = ({ t, len }) => {
  const shakeX = t > 3 && t < 14 ? Math.sin(t * 3.1) * 5 * (1 - (t - 3) / 11) : 0;
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <Schematic t={t} id="b5" />
      <BigNum x={960 + shakeX} y={290} text="86.400.000 đ" size={170} pop={t / 6} />
      <SchLabel x={960} y={380} t={t - 8} text="MỘT NGÀY" size={46} color={SCH.dim} />
      <BillWall x={960} y={1010} t={t - 2} cols={6} rows={7} s={1.0} step={0.7} />
      <Sparkle x={560} y={470} t={t - 18} s={0.9} />
      <Sparkle x={1380} y={520} t={t - 26} s={0.8} />
    </g>
  );
};

// ---------- B6: one year: pages fly off a calendar, 31 TỶ huge, the wall of money towers past the frame ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.round(31 * easeOut(clamp((t - 22) / 26)));
  const pop = clamp((t - 50) / 8);
  return (
    <g transform={camT(960, kf(t, [[0, 640], [len, 540]]), kf(t, [[0, 1.25], [len, 0.82]]))}>
      <Schematic t={t} id="b6" />
      <BillWall x={960} y={1070} t={t - 4} cols={12} rows={9} s={1.0} step={0.35} />
      <CalendarIcon x={1650} y={330} s={0.8} t={t} rate={4} label="365" />
      <SchLabel x={960} y={520} t={t - 10} text="1.000 đ × 31.536.000" size={44} color={SCH.dim} />
      <SchLabel x={500} y={380} t={t - 20} text="HƠN" size={72} color={SCH.line} anchor="end" />
      <g transform={`translate(960 ${pop > 0 ? 330 - Math.sin(clamp(pop) * Math.PI) * 14 : 400})`}>
        <rect x={-430} y={-210} width={860} height={270} rx={40} fill="#0B1220" opacity={0.72} />
        <BigNum x={0} y={30} text={`${n} TỶ`} size={290} pop={pop + 0.2} />
      </g>
      <Sparkle x={560} y={250} t={t - 52} s={1.2} />
      <Sparkle x={1380} y={230} t={t - 56} s={1.0} />
    </g>
  );
};
