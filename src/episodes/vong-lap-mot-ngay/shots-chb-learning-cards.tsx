import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, rnd, camT, Glow, LOOKS, FONT, UI, SCH, Schematic, ShotProps, toWorld,
  BEDROOM,
} from '../../engine';
import { MorningBedroom, roomStand, MB } from './kit-morning-bedroom';
import { MemoryGlow } from './kit-rewind-fx';
import { TearCalendar } from './kit-bedroom-parts';
import { MegaTicket, Dumbbell } from './kit-props';
import { QuestionMark } from '../khong-ai-ngheo/chd-tv-news-props';
import { PAL, fmtVN } from './kit-palette';
import { Ball, NUMS } from './chb-lottery-props';
import { DayBar, ColumnsIcon, JpBook, Kana } from './chb-learning-props';

// Chapter B, what you keep (B16-B23, 93.34-110.73 s): the ticket, the dumbbell and the money dissolve round Pip, only
// what's in his head stays (MemoryGlow); 18 waking hours a loop; the FSI; the tower of Japanese books; "2.200 GIỜ";
// the calendar that is always THỨ TƯ, "≈ 4 THÁNG"; one year of loops "> 6.500 GIỜ".

const PIP = LOOKS.pipHood;
const hhmm = (m: number) => `${String(Math.floor(m / 60) % 25).padStart(2, '0')}:${String(Math.floor(m) % 60).padStart(2, '0')}`;

/** A small 50.000 note (world space). */
const Note50k: React.FC<{ x: number; y: number; s: number; rot: number }> = ({ x, y, s, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-130} y={-60} width={260} height={120} rx={6} fill="#D98AB4" stroke="#6A2A4E" strokeWidth={5} />
    <circle cx={-70} cy={0} r={30} fill="#E9B4CF" stroke="#B05A8A" strokeWidth={3} />
    <text x={110} y={14} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#4A1A36">50.000</text>
  </g>
);

// ---------- B16: wide, 06:00: the ticket, the dumbbell and the money float round Pip and dissolve; a "?" ----------
export const B16: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.55, 0.5);
  const pose = poseAt(t, [
    { f: 0, p: { ...st, yaw: 0.1, look: -0.4, armL: { a: 14, b: -8 }, armR: { a: 14, b: -8 } } },
    { f: 30, p: { look: 0.4 } },
    { f: 40, p: { armL: { a: 56, b: -70 }, armR: { a: 56, b: -70 }, headTilt: 8 }, ease: easeOut },
  ]);
  const head = toWorld(pose, { x: 0, y: -176 });
  const items = [
    { x: st.x - 230, y: st.y - 170, el: <MegaTicket x={0} y={0} s={0.34} id="b16tk" nums={NUMS} rot={-10} /> },
    { x: st.x + 240, y: st.y - 200, el: <Dumbbell x={0} y={0} s={0.6} rot={20} /> },
    { x: st.x + 230, y: st.y + 30, el: <Note50k x={0} y={0} s={0.5} rot={8} /> },
  ];
  return (
    <g transform={camT(kf(t, [[0, 1030], [len, 1040]]), kf(t, [[0, 570], [len, 560]]), kf(t, [[0, 1.45], [len, 1.55]]))}>
      <MorningBedroom t={t + 600} id="b16mb" dawn={1} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [36, 'worried']]) }} rimId="rimR" />
      {items.map((it, i) => {
        const d = clamp((t - 14 - i * 8) / 12);
        const bob = Math.sin(t / 9 + i * 2) * 10;
        return (
          <g key={i}>
            <g transform={`translate(${it.x} ${it.y + bob - d * 30})`} opacity={1 - d} style={d > 0 ? { filter: `grayscale(${Math.min(1, d * 2)})` } : undefined}>{it.el}</g>
            {d > 0 && d < 1
              ? Array.from({ length: 10 }).map((_, m) => <rect key={m} x={it.x - 70 + rnd(i + 30, m) * 140} y={it.y - 40 + rnd(i + 31, m) * 80 - d * (40 + rnd(i + 32, m) * 70)} width={12} height={8} fill={PAL.cyan} opacity={(1 - d) * 0.9} />)
              : null}
          </g>
        );
      })}
      <QuestionMark x={head.x + 150} y={head.y - 120} t={t - 34} s={0.9} />
    </g>
  );
};

// ---------- B17: extreme close-up: the six numbers stream into his head, the memory glow brightens ----------
export const B17: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.55, 0.5);
  const pose = poseAt(t, [{ f: 0, p: { ...st, yaw: 0.7, look: 0.3, headTilt: -4 } }, { f: len, p: { headTilt: 2 } }]);
  const z = kf(t, [[0, 3.5], [len, 3.8]]);
  const c = { x: 1100, y: 540 };
  const head = toWorld(pose, { x: 0, y: -176 });
  const hs = { x: 960 + (head.x - c.x) * z, y: 540 + (head.y - c.y) * z };
  return (
    <g>
      <g transform={camT(c.x, c.y, z)}>
        <g filter="url(#blur6)"><MorningBedroom t={t + 640} id="b17mb" dawn={1} /></g>
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [14, 'smug']]) }} rimId="rimR" />
      </g>
      <MemoryGlow x={hs.x} y={hs.y} r={62 * pose.scale * z * 1.6} t={t} id="b17mg" o={0.6 + 0.4 * clamp(t / 20)} />
      {NUMS.map((n, i) => {
        const p = easeOut(clamp((t - i * 4) / 14));
        if (p <= 0 || p >= 1) return null;
        const sx = 1960;
        const sy = 160 + i * 150;
        return <Ball key={i} x={sx + (hs.x - sx) * p} y={sy + (hs.y - sy) * p} r={70 * (1 - p * 0.7)} n={n} c={['#E8553E', '#F2B33D', '#3E8C86', '#5C7CFA', '#C8382E', '#8A6AC9'][i]} />;
      })}
    </g>
  );
};

// ---------- B18: wide time-lapse of one loop: light runs dawn to night, the clock races, the day bar fills: 18 GIỜ ----------
export const B18: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 4) / 50);
  const st = roomStand(0.6, 0.45);
  const pose = poseAt(t, [{ f: 0, p: { ...st, yaw: 0.35, look: 0.3 } }, { f: len, p: { yaw: -0.3, look: -0.3 } }]);
  const lab = backOut(clamp((t - 30) / 8));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 960], [len, 980]]), 520, kf(t, [[0, 1.08], [len, 1.14]]))}>
        <MorningBedroom t={t + 680} id="b18mb" dawn={1 - p} lamp={clamp((p - 0.6) / 0.15)} clock={hhmm(360 + 1080 * p)} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" />
      </g>
      <rect x={0} y={790} width={1920} height={290} fill="#0B0816" opacity={0.55} />
      <DayBar x={960} y={880} w={1240} p={p} t={t} />
      {lab > 0 ? (
        <g transform={`translate(960 140) scale(${lab})`}>
          <rect x={-230} y={-70} width={460} height={130} rx={65} fill={UI.pill} opacity={0.85} stroke={UI.live} strokeWidth={4} />
          <text y={34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={96} fill={UI.live}>18 GIỜ</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- B19: the FSI card: a government building draws itself on, "FSI", "VIỆN NGOẠI GIAO HOA KỲ" ----------
export const B19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
    <Schematic t={t} id="b19sch" />
    <ColumnsIcon x={960} y={400} s={1.05} t={t} />
    <g opacity={easeOut(clamp((t - 10) / 8))} transform={`translate(960 ${720 + 20 * (1 - easeOut(clamp((t - 10) / 8)))})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={140} fill={SCH.live} style={{ filter: `drop-shadow(0 0 18px ${SCH.glow}88)` }}>FSI</text>
    </g>
    <text x={960} y={850} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill={SCH.line} letterSpacing={3} opacity={easeOut(clamp((t - 16) / 8))}>VIỆN NGOẠI GIAO HOA KỲ</text>
  </g>
);

// ---------- B20: medium at the desk: a wobbling tower of Japanese textbooks, Pip looks up at it and gulps ----------
const STACK_C = ['#C8382E', '#3E6A8A', '#D9A441', '#3F5E44', '#8A6AC9', '#C96A5A', '#2F6E69', '#B8483E'];
export const B20: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.55, 0.3);
  const pose = poseAt(t, [
    { f: 0, p: { ...st, yaw: 0.6, look: 0.3, headTilt: 0 } },
    { f: 10, p: { look: 0.8, headTilt: -14 }, ease: easeOut },
    { f: len, p: { headTilt: -16 } },
  ]);
  const base = BEDROOM.P(0.72, 0.735, 0.08);
  const sway = Math.sin(t / 6) * 3;
  return (
    <g transform={camT(kf(t, [[0, 1110], [len, 1120]]), kf(t, [[0, 520], [len, 480]]), kf(t, [[0, 1.85], [len, 2.0]]))}>
      <MorningBedroom t={t + 720} id="b20mb" dawn={1} />
      <g transform={`rotate(${sway} ${base.x} ${base.y})`}>
        {STACK_C.map((c, i) => {
          const y = base.y - 22 - i * 44;
          const dx = Math.sin(i * 1.7) * 12;
          return (
            <g key={i} transform={`translate(${base.x + dx} ${y})`}>
              <rect x={-120} y={-22} width={240} height={44} rx={5} fill={c} stroke="#14121C" strokeWidth={4} />
              <rect x={-120} y={-22} width={240} height={8} fill="#FFFFFF" opacity={0.15} />
              <text x={0} y={12} textAnchor="middle" fontWeight={700} fontSize={30} fill="#FFF6E2">日本語</text>
            </g>
          );
        })}
      </g>
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [9, 'worried']]) }} rimId="rimR" />
      <Glow x={base.x} y={base.y - 200} r={260} o={0.3} />
    </g>
  );
};

// ---------- B21: card: "2.200" counts up, GIỜ HỌC; the textbook; あ い う pop as he says "tiếng Nhật" ----------
export const B21: React.FC<ShotProps> = ({ t, len }) => {
  const v = Math.round(2200 * easeOut(clamp((t - 8) / 32)));
  const pop = 0.9 + 0.1 * backOut(clamp((t + 2) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="b21sch" />
      <JpBook x={330} y={480} w={250} h={340} c="#C8382E" rot={-8 + Math.sin(t / 12) * 2} />
      <g transform={`translate(1090 430) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={260} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{fmtVN(v)}</text>
      </g>
      <text x={1090} y={570} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={100} fill={SCH.line} letterSpacing={6} opacity={easeOut(clamp((t - 6) / 7))}>GIỜ HỌC</text>
      <Kana x={1090} y={800} t={t - 58} s={0.9} />
    </g>
  );
};

// ---------- B22: insert, the tear-off calendar: page after page flies off and it is always THỨ TƯ; "≈ 4 THÁNG" ----------
export const B22: React.FC<ShotProps> = ({ t, len }) => {
  const every = 4;
  const n = Math.floor(t / every);
  const ph = (t % every) / every;
  const pop = backOut(clamp((t - 30) / 8));
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform={camT(MB.CAL.x, MB.CAL.y + 80, 2.2)}><MorningBedroom t={t + 760} id="b22mb" dawn={1} /></g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={0.25} />
      <Glow x={1500} y={300} r={700} o={0.4} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
        <TearCalendar x={820} y={150} w={560} day="THỨ TƯ" />
        {/* the page being torn off: the same THỨ TƯ, flying up and away */}
        {n < 15 ? (
          <g transform={`translate(${820 + easeOut(ph) * 700} ${150 - easeOut(ph) * 380}) rotate(${ph * 70} 0 0)`} opacity={1 - ph * 0.6}>
            <TearCalendar x={0} y={0} w={560} day="THỨ TƯ" />
          </g>
        ) : null}
      </g>
      {pop > 0 ? (
        <g transform={`translate(1500 860) scale(${pop}) rotate(-4)`}>
          <rect x={-300} y={-82} width={600} height={150} rx={75} fill={UI.pill} opacity={0.9} stroke={UI.live} strokeWidth={5} />
          <text y={36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={100} fill={UI.live}>≈ 4 THÁNG</text>
        </g>
      ) : null}
      <g opacity={easeOut(clamp(t / 6))}>
        <rect x={1110} y={90} width={760} height={92} rx={46} fill={UI.pill} opacity={0.85} />
        <text x={1490} y={151} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={46} fill={UI.text}>2.200 ÷ 18 ≈ 122 NGÀY</text>
      </g>
    </g>
  );
};

// ---------- B23: card: one year of loops, 365 Wednesday ticks fill in, "> 6.500 GIỜ", 365 × 18 = 6.570 ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => {
  const filled = Math.floor(365 * easeOut(clamp((t - 4) / 44)));
  const big = backOut(clamp((t - 34) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="b23sch" />
      <text x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill={SCH.line} letterSpacing={4} opacity={easeOut(clamp(t / 6))}>1 NĂM LẶP LẠI</text>
      {Array.from({ length: 365 }).map((_, i) => {
        const cx = 210 + (i % 52) * 29;
        const cy = 640 + Math.floor(i / 52) * 34;
        const on = i < filled;
        return <rect key={i} x={cx - 10} y={cy - 12} width={20} height={24} rx={4} fill={on ? SCH.live : 'none'} stroke={on ? SCH.live : SCH.grid} strokeWidth={2} opacity={on ? 0.85 : 0.6} />;
      })}
      <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill={SCH.dim} letterSpacing={2} opacity={easeOut(clamp((t - 20) / 8))}>365 × 18 = 6.570</text>
      {big > 0 ? (
        <g transform={`translate(960 460) scale(${0.85 + 0.15 * big})`} opacity={clamp(big)}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={196} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{'> 6.500 GIỜ'}</text>
        </g>
      ) : (
        <text x={960} y={460} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={200} fill={SCH.line} opacity={0.9}>{fmtVN(filled * 18)}</text>
      )}
    </g>
  );
};
