import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, easeInOut, camT, LOOKS, Glow, Dust, Study, FocusRings, FloatLabel,
  Schematic, SchLabel, CountUp, DrawOn, SCH, FONT, backOut, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { Dial24, Hourglass, NotePile, vnInt, vnDec } from './che-clock-and-hourglass-props';

// Chapter E, the time section, part one: Pip realises (E1), the day has 86.400 seconds for everyone (E2, E3), the
// average Vietnamese life is 74,7 years, about 2,3 billion seconds (E4, E5), and the sand never goes back up (E6).
// Schematic cards: the look is OFF here; the money chips are drawn by hand where the line is about the money.

const PIP = LOOKS.pipHood;

// ---------- E1: close-up, Pip stops: the penny drops (focus rings), the night study soft behind ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.4 * (1 + 0.05 * clamp(t / len));
  const head = { x: 960, y: 500 };
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.15, facing: 1, look: kf(t, [[0, 0.6], [14, 0.0], [40, -0.3]]),
    headTilt: kf(t, [[0, 0], [14, -3], [50, 2]]), armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 3,
    ...faceAt(t, [[0, 'neutral'], [12, 'shock'], [34, 'tired']]),
  };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -200) scale(1.4)">
          <Study t={t + 300} id="e1st" night />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.3} />
      <Glow x={960} y={520} r={560} kind="warm" o={0.22} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <g transform={`translate(${head.x} ${head.y}) scale(0.5) translate(${-head.x} ${-head.y})`}>
        <FocusRings x={head.x} y={head.y} t={t - 12} r0={200} />
      </g>
      <Dust t={t} seed={5} x0={300} y0={200} w={1300} h={700} n={18} o={0.3} />
    </g>
  );
};

// ---------- E2: the day as a 24-hour dial: the hand sweeps once round, money chips tick each second, 86.400 GIÂY ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeInOut(clamp(t / (len - 10)));
  const k = t % 30;
  const lblT = t - 80; // "tám mươi sáu nghìn" at 230.58 s
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t} id="e2sch" />
      <Dial24 x={640} y={540} r={330} p={p} />
      {/* a chip leaves the dial every second: the money is steady, the day is not */}
      <FloatLabel x={1330} y={780} t={k} text="+1.000 đ" color={SCH.live} size={52} />
      {lblT >= 0 ? (
        <g>
          <CountUp x={1330} y={540} t={lblT} to={86400} dur={26} size={118} format={vnInt} />
          <SchLabel x={1330} y={620} t={lblT + 18} text="GIÂY TRONG MỘT NGÀY" size={34} color={SCH.line} />
        </g>
      ) : null}
      <SchLabel x={640} y={960} t={6} text="MỘT NGÀY = 24 GIỜ" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- E3: "like everyone": a row of people, each with the same dial on their chest ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const p = (t * 0.012) % 1;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t + 50} id="e3sch" />
      {Array.from({ length: 7 }).map((_, i) => {
        const x = 270 + i * 230;
        const pop = backOut(clamp((t - i * 3) / 7));
        return (
          <g key={i} transform={`translate(${x} 560) scale(${pop})`}>
            <PersonIcon x={0} y={-30} s={2.6} on={i === 3} glow={i === 3} />
            <Dial24 x={0} y={110} r={62} p={p} numerals={false} hand={SCH.live} />
          </g>
        );
      })}
      <SchLabel x={960} y={880} t={14} text="AI CŨNG CÓ MỘT CHIẾC ĐỒNG HỒ NHƯ NHAU" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- E4: 74,7 NĂM: a life line drawing on, a tick every ten years, the source small in the corner ----------
export const E4: React.FC<ShotProps> = ({ t, len }) => {
  const prog = easeOut(clamp(t / 44));
  const x0 = 260;
  const x1 = 1660;
  const xe = x0 + (x1 - x0) * prog;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="e4sch" />
      <PersonIcon x={x0 - 10} y={650} s={2.2} on />
      <path d={`M ${x0 + 50} 700 L ${x1} 700`} stroke={SCH.dim} strokeWidth={4} strokeDasharray="4 12" />
      <path d={`M ${x0 + 50} 700 L ${xe} 700`} stroke={SCH.live} strokeWidth={12} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      {[0, 10, 20, 30, 40, 50, 60, 70].map((yr) => {
        const x = x0 + 50 + ((x1 - x0 - 50) * yr) / 74.7;
        return (
          <g key={yr} opacity={x <= xe + 4 ? 1 : 0.35}>
            <path d={`M ${x} 684 L ${x} 716`} stroke={SCH.line} strokeWidth={4} />
            <text x={x} y={760} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill={SCH.dim}>{yr}</text>
          </g>
        );
      })}
      <CountUp x={960} y={440} t={t} to={74.7} dur={44} size={150} format={(v) => vnDec(v)} suffix=" NĂM" />
      <SchLabel x={960} y={540} t={20} text="TUỔI THỌ TRUNG BÌNH CỦA NGƯỜI VIỆT NAM" size={34} color={SCH.line} />
      <text x={1790} y={968} textAnchor="end" fontFamily={FONT.ui} fontSize={26} fill={SCH.dim} opacity={clamp((t - 30) / 10)}>NGUỒN: CỤC THỐNG KÊ 2025</text>
    </g>
  );
};

// ---------- E5: an hourglass, and next to it ≈ 2,3 TỶ GIÂY counting up ----------
export const E5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Schematic t={t + 30} id="e5sch" />
    <Hourglass x={600} y={560} s={1.25} top={kf(t, [[0, 0.95], [len, 0.8]])} t={t} id="e5hg" />
    <CountUp x={1280} y={540} t={t - 14} to={2.3} dur={34} size={140} format={(v) => '≈ ' + vnDec(v)} />
    <SchLabel x={1280} y={650} t={t - 30} text="TỶ GIÂY" size={72} color={SCH.line} />
    <SchLabel x={1280} y={730} t={t - 38} text="CẢ MỘT ĐỜI NGƯỜI" size={30} color={SCH.dim} />
  </g>
);

// ---------- E6: the sand keeps falling, the money piles beside it, and nothing goes back up ----------
export const E6: React.FC<ShotProps> = ({ t, len }) => {
  const arrowT = t - 91; // "cũng không bao giờ quay lại" at 243.08 s
  const cross = backOut(clamp(arrowT / 8));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Schematic t={t + 80} id="e6sch" />
      <Hourglass x={560} y={540} s={1.3} top={kf(t, [[0, 0.8], [len, 0.55]])} t={t} id="e6hg" />
      <NotePile x={1340} y={860} n={t / 4.5} s={1.1} />
      <SchLabel x={1340} y={250} t={8} text="TIỀN CỨ CHẤT CAO" size={34} color={SCH.dim} />
      {/* the way back up, drawn then struck out */}
      {arrowT > 0 ? (
        <g>
          <DrawOn d="M 800 760 C 900 560 900 420 800 250" t={arrowT} dur={10} color={SCH.dim} width={6} />
          <g transform={`translate(880 505) scale(${cross})`}>
            <circle r={64} fill="#1A0E12" stroke="#FF5A4A" strokeWidth={8} />
            <path d="M -32 -32 L 32 32 M 32 -32 L -32 32" stroke="#FF5A4A" strokeWidth={10} strokeLinecap="round" />
          </g>
          <SchLabel x={930} y={190} t={arrowT - 4} text="KHÔNG QUAY LẠI" size={38} color="#FF8A7A" />
        </g>
      ) : null}
    </g>
  );
};
