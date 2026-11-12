import React from 'react';
import { Hero, poseAt, faceAt, walkPose, joints, toWorld, camT, kf, clamp, easeOut, backOut, LOOKS, Schematic, SchLabel, CountUp, DrawOn, SCH, FONT, ShotProps } from '../../engine';
import { SepiaMarket, FilmWear } from './chc-sepia-market';
import { SEPIA_LOOKS, ConicalHat } from './chc-props-food-and-trade';
import { PriceTag, Note, INK } from './chc-props-money-and-prices';
import { BlurStreet } from './chc-street-scenes';

// Chapter C, 1986: the remembered market (C15), the year stamped on a timeline (C16), 774,7% counting up (C17), one
// item's price tag going from 1 đ in January to about 9 đ in December (C18, C19), a person hauling a bag of notes to
// buy a few greens (C20) and Pip's close-up, "Đó là sự thật" (C21).

// ---------- C15: the sepia market, wide, the crowd drifting, film scratches ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 980]]), 540, kf(t, [[0, 1], [len, 1.12]]))}>
    <SepiaMarket t={t + 40} id="c15" />
    <FilmWear t={t} id="c15" />
  </g>
);

// ---------- C16: "1986" stamps on, digit by digit, then a pin lands on 1986 along a timeline ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => {
  const digits = ['1', '9', '8', '6'];
  const at = [6, 13, 21, 29];
  const x0 = 260, step = 140;
  const pin = backOut(clamp((t - 32) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c16s" />
      <SchLabel x={960} y={250} t={t - 2} text="NĂM" size={46} color={SCH.dim} anchor="middle" />
      {digits.map((d, i) => {
        const k = clamp((t - at[i]) / 7);
        const sc = 1 + (1 - easeOut(k)) * 0.9;
        return k > 0 ? (
          <text key={i} x={620 + i * 230} y={640} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={380} fill={SCH.live} opacity={easeOut(k)} transform={`translate(${620 + i * 230} 640) scale(${sc}) translate(${-620 - i * 230} -640)`} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{d}</text>
        ) : null;
      })}
      <DrawOn d={`M ${x0} 820 H ${x0 + step * 10}`} t={t - 4} dur={16} width={5} />
      {Array.from({ length: 11 }).map((_, i) => (
        <g key={i} opacity={clamp((t - 10 - i) / 4)}>
          <path d={`M ${x0 + i * step} 806 V 834`} stroke={SCH.line} strokeWidth={4} />
          {i % 5 === 0 ? <text x={x0 + i * step} y={888} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim}>{1980 + i}</text> : null}
        </g>
      ))}
      <g transform={`translate(${x0 + 6 * step} ${820 - 40 * (1 - pin)}) scale(${pin})`}>
        <path d="M 0 0 L -22 -44 H 22 Z" fill={SCH.live} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
        <circle cx={0} cy={0} r={11} fill={SCH.live} />
      </g>
    </g>
  );
};

// ---------- C17: 774,7% counts up with a bar that grows beside it (a faint line marks 100%) ----------
export const C17: React.FC<ShotProps> = ({ t, len }) => {
  const v = 774.7 * easeOut(clamp((t - 24) / 70));
  const done = t > 94 ? 1 + 0.04 * Math.sin((t - 94) / 3) * Math.exp(-(t - 94) / 12) : 1;
  const h = 560 * (v / 774.7);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]]) * done}) translate(-960 -540)`}>
      <Schematic t={t} id="c17s" />
      <SchLabel x={800} y={270} t={t} text="LẠM PHÁT · VIỆT NAM · 1986" size={40} color={SCH.dim} anchor="middle" />
      <CountUp x={800} y={600} t={t - 24} to={774.7} dur={70} size={270} format={(x) => x.toFixed(1).replace('.', ',') + '%'} />
      <path d="M 1500 900 H 1760" stroke={SCH.line} strokeWidth={5} strokeLinecap="round" />
      <rect x={1540} y={900 - h} width={180} height={h} fill={SCH.live} opacity={0.85} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }} />
      <path d={`M 1500 ${900 - 72} H 1760`} stroke={SCH.line} strokeWidth={3} strokeDasharray="10 8" opacity={clamp((t - 10) / 8)} />
      <SchLabel x={1480} y={900 - 72 + 10} t={t - 10} text="100%" size={32} color={SCH.line} anchor="end" />
      <g transform={`translate(1630 ${900 - h - 40})`} opacity={clamp((t - 30) / 6)}>
        <path d="M 0 30 V -20 M -26 0 L 0 -30 L 26 0" stroke={SCH.live} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
};

// ---------- C18 / C19: one item, its tag and the calendar: 1 đ in January, about 9 đ in December ----------
const Carton: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} stroke={SCH.line} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" fill={`${SCH.line}14`}>
    <path d="M -170 -60 L -170 150 L 130 150 L 130 -60 Z" />
    <path d="M -170 -60 L -110 -130 L 190 -130 L 130 -60 Z" />
    <path d="M 130 -60 L 190 -130 L 190 80 L 130 150" />
    <path d="M -40 -60 V 40 M 20 -60 V 40" />
  </g>
);
const Calendar: React.FC<{ x: number; y: number; m: number; flip?: number }> = ({ x, y, m, flip = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(-4)`}>
    <rect x={-120} y={-130} width={240} height={270} rx={14} fill={SCH.ground} stroke={SCH.line} strokeWidth={6} />
    <rect x={-120} y={-130} width={240} height={64} rx={14} fill="#C8483E" stroke={SCH.line} strokeWidth={6} />
    <text x={0} y={-84} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={36} fill="#FFF3DC">THÁNG</text>
    <text x={0} y={80} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={140} fill={SCH.line} transform={`translate(0 ${-12}) scale(1 ${1 - 0.5 * flip})`}>{m}</text>
  </g>
);
const month = (t: number) => Math.min(12, 1 + Math.floor(clamp((t - 2) / 22) * 11.99));

export const C18: React.FC<ShotProps> = ({ t, len }) => {
  const sw = Math.sin(t / 8) * 3;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <Schematic t={t} id="c18s" />
      <Calendar x={300} y={330} m={1} />
      <Carton x={740} y={560} />
      <g style={{ filter: `drop-shadow(0 0 12px ${SCH.glow}66)` }}><PriceTag x={1330} y={540} s={1.6} rot={sw} text="1 đ" sub="ĐẦU NĂM" /></g>
      <SchLabel x={1330} y={800} t={t - 10} text="MỘT MÓN ĐỒ" size={38} color={SCH.dim} anchor="middle" />
    </g>
  );
};

export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const m = month(t);
  const flip = Math.abs(Math.sin(clamp((t - 2) / 22) * 11.99 * Math.PI));
  const hot = clamp((t - 26) / 6);
  const pop = backOut(clamp((t - 26) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.04], [len, 1.1]]))}>
      <Schematic t={t} id="c19s" />
      <Calendar x={300} y={330} m={m} flip={t < 26 ? flip : 0} />
      <Carton x={740} y={560} />
      <g style={{ filter: `drop-shadow(0 0 12px ${SCH.glow}66)` }}>
        <g transform={`translate(1330 540) scale(${t < 26 ? 1 : 0.8 + 0.2 * pop}) translate(-1330 -540)`}>
          <PriceTag x={1330} y={540} s={1.6} rot={Math.sin(t / 8) * 3} text={t < 26 ? '1 đ' : '≈ 9 đ'} sub={t < 26 ? 'ĐẦU NĂM' : 'CUỐI NĂM'} c={hot > 0 ? '#F7C8B8' : '#F2E6D0'} ink={hot > 0 ? '#C23A2E' : INK} />
        </g>
      </g>
      {Array.from({ length: 9 }).map((_, i) => {
        const k = backOut(clamp((t - 30 - i * 2) / 6));
        return <circle key={i} cx={1130 + i * 52} cy={800} r={20 * k} fill={SCH.live} stroke={SCH.line} strokeWidth={3} />;
      })}
    </g>
  );
};

// ---------- C20: a sepia figure lugs a bag stuffed with notes to the stall that sells a few greens ----------
export const C20: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 560], [len, 1000]], (v) => v);
  const p = walkPose(x, t * 0.5, 880, 1.2, { yaw: 0.7, tilt: 9, armR: { a: 4, b: -4 } }, 1);
  const hand = toWorld(p, joints(p).armR.end);
  const swing = Math.sin(t * 0.5) * 4;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1060]]), 560, kf(t, [[0, 1.05], [len, 1.15]]))}>
      <SepiaMarket t={t + 90} id="c20" />
      <rect x={1380} y={640} width={420} height={110} fill="#7A5A38" stroke={INK} strokeWidth={4} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={1470 + i * 110} cy={630} rx={44} ry={26} fill="#7A7A44" stroke={INK} strokeWidth={3} />)}
      <Hero look={SEPIA_LOOKS[1]} pose={poseAt(t, [{ f: 0, p: { x: 1590, y: 600, scale: 1.0, yaw: -0.5, facing: -1 } }])} rimId="rimL" shadow={0} />
      <Hero look={SEPIA_LOOKS[0]} pose={p} rimId="rimR" shadow={0} />
      <ConicalHat pose={p} color="#C9A870" dy={-8} />
      <g transform={`translate(${hand.x} ${hand.y + 6}) rotate(${swing}) scale(1.25)`}>
        <path d="M -70 0 Q -130 150 -100 250 Q 0 290 100 250 Q 130 150 70 0 Z" fill="#8A5A3A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <path d="M -70 0 Q 0 -26 70 0" fill="none" stroke={INK} strokeWidth={5} />
        {[[-40, -20, -24], [10, -34, 8], [44, -16, 30], [-8, -4, -4]].map(([nx, ny, r], i) => <Note key={i} x={nx} y={ny} rot={r} s={0.6} c={['#C9A870', '#B8935A', '#D9BC8A', '#A8754A'][i]} />)}
        <Note x={-12} y={150} s={0.9} rot={-6} c="#D9BC8A" label="đ" />
      </g>
      <FilmWear t={t} id="c20" />
    </g>
  );
};

// ---------- C21: Pip, close, steady: "Đó là sự thật." ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 790, scale: 1, yaw: 0.18, look: 0.1, headTilt: 3 } },
    { f: 12, p: { headTilt: -2 } },
    { f: len, p: { headTilt: 0 } },
  ]);
  return (
    <g transform={camT(960, 600, kf(t, [[0, 3.3], [len, 3.7]]))}>
      <BlurStreet t={t + 60} id="c21" blur={16} warm={0.5} zoom={2.2} />
      <rect x={-300} y={-300} width={2600} height={1800} fill="#120C18" opacity={0.35} />
      <Hero look={LOOKS.pipHood} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />
    </g>
  );
};
