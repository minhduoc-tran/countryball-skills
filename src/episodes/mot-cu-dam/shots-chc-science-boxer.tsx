import React from 'react';
import { ShotProps, kf, camT, clamp, easeOut, easeIn, backOut, Schematic, SchLabel, CountUp, Arrow, SCH, FONT } from '../../engine';
import { FistIcon, BoxerFigure, DialGauge, WeightBlock, punchPhase, vnNum } from './chc-science-props';

// CHAPTER C science, part 1 (C21-C25): the Olympic boxer. Numbers match episode.json: ~3.400 N, ~350 kg, ~9 m/s.
const lin = (t: number, a: number, len: number) => clamp((t - a) / len);

// ---------- C21: "Một cú đấm thật thì mạnh đến đâu?" ----------
export const C21: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [60, 1.06]]))}>
    <Schematic t={t} id="c21" />
    <FistIcon x={700} y={520} s={2.1} t={t} />
    <g transform={`translate(1230 560) scale(${backOut(lin(t, 14, 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={440} fill={SCH.live} style={{ filter: `drop-shadow(0 0 18px ${SCH.glow}88)` }}>?</text>
    </g>
    <SchLabel x={960} y={900} t={t - 24} text="MỘT CÚ ĐẤM THẬT" size={54} />
  </g>
);

// ---------- C22: the Olympic boxer hits a force pad, the gauge needle jumps ----------
export const C22: React.FC<ShotProps> = ({ t }) => {
  const { hit } = punchPhase(t);
  const needle = hit >= 0 ? 0.82 * Math.exp(-hit / 14) + 0.06 : 0.06;
  const shake = hit >= 0 && hit < 8 ? Math.sin(hit * 2.2) * 8 * (1 - hit / 8) : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [87, 1.05]]))}>
      <Schematic t={t} id="c22" />
      <BoxerFigure x={520} y={930} s={1.5} t={t} />
      <g transform={`translate(${shake} 0)`} stroke={SCH.line} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x={858} y={640} width={70} height={200} rx={26} fill="#1A2C47" />
        <path d="M 893 840 V 930 M 820 930 H 966" />
      </g>
      {hit >= 0 && hit < 5 ? <path d="M 820 740 L 770 720 M 820 770 L 760 780 M 822 800 L 776 836" stroke={SCH.glow} strokeWidth={8} strokeLinecap="round" /> : null}
      <DialGauge x={1400} y={640} r={230} v={needle} />
      <SchLabel x={1400} y={720} t={t - 4} text="LỰC (N)" size={40} color={SCH.dim} />
      <g transform="translate(520 220)">
        <g transform={`scale(${backOut(lin(t, 8, 8))})`} stroke={SCH.line} strokeWidth={7} fill="none" strokeLinecap="round">
          <path d="M -34 -60 L -10 -14 M 34 -60 L 10 -14" />
          <circle r={44} cy={30} fill="#1A2C47" /><circle r={26} cy={30} stroke={SCH.live} />
        </g>
      </g>
      <SchLabel x={520} y={350} t={t - 12} text="VÕ SĨ OLYMPIC" size={42} />
    </g>
  );
};

// ---------- C23: "khoảng ba nghìn bốn trăm niu tơn": the number counts up, a force bar fills ----------
export const C23: React.FC<ShotProps> = ({ t }) => {
  const f = easeOut(lin(t, 2, 34));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [50, 1.05]]))}>
      <Schematic t={t} id="c23" />
      <FistIcon x={400} y={400} s={1.2} />
      <CountUp x={1060} y={450} t={t - 2} to={3400} dur={34} size={190} format={(v) => `≈ ${vnNum(Math.round(v / 100) * 100)} N`} />
      <g transform="translate(360 700)">
        <rect width={1200} height={44} rx={22} fill="none" stroke={SCH.line} strokeWidth={6} />
        <rect x={5} y={5} width={Math.max(0, 1190 * 0.85 * f)} height={34} rx={17} fill={SCH.live} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <path d={`M ${i * 300} 56 V 80`} stroke={SCH.dim} strokeWidth={4} />
            <text x={i * 300} y={126} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim}>{vnNum(i * 1000)}</text>
          </g>
        ))}
      </g>
    </g>
  );
};

// ---------- C24: "như có gần ba trăm rưỡi ký đè xuống": a 350 kg weight presses a spring scale ----------
export const C24: React.FC<ShotProps> = ({ t }) => {
  const fall = easeIn(lin(t, 0, 20));
  const sq = t < 20 ? 0 : Math.max(0, 1 + 0.35 * Math.sin((t - 20) * 0.5) * Math.exp(-(t - 20) / 14)) * 1;
  const plat = 640 + (t < 20 ? 0 : sq * 70);
  const wy = t < 20 ? lerp0(-80, plat, fall) : plat;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="c24" />
      <g stroke={SCH.line} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 540 850 H 1020" strokeWidth={12} />
        <path d={`M 700 850 ${Array.from({ length: 8 }).map((_, i) => `L ${i % 2 ? 700 : 860} ${850 - ((i + 1) * (850 - plat)) / 9}`).join(' ')} L 780 ${plat}`} />
        <path d={`M 560 ${plat} H 1000`} strokeWidth={14} />
      </g>
      <WeightBlock x={780} y={wy} s={1.1} label="350 kg" />
      {t > 18 ? <g opacity={clamp((t - 18) / 6)}>{[640, 780, 920].map((x) => <Arrow key={x} x0={x} y0={120} x1={x} y1={250} t={t - 18} dur={8} color={SCH.live} bend={0} />)}</g> : null}
      <CountUp x={1440} y={520} t={t - 14} to={350} dur={30} size={150} format={(v) => `≈ ${Math.round(v / 10) * 10} kg`} />
      <SchLabel x={1440} y={610} t={t - 30} text="TƯƠNG ĐƯƠNG" size={40} color={SCH.dim} />
    </g>
  );
};
const lerp0 = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------- C25: "Nắm đấm bay khoảng chín mét mỗi giây": a fist crosses 9 one-metre marks in one second ----------
export const C25: React.FC<ShotProps> = ({ t }) => {
  const p = easeOut(lin(t, 6, 44)) * 0.0 + lin(t, 6, 42);
  const x = 230 + 1400 * p;
  return (
    <g transform={camT(960, 540, 1.0)}>
      <Schematic t={t} id="c25" />
      <g transform="translate(230 760)" stroke={SCH.line} strokeWidth={6} strokeLinecap="round">
        <path d="M 0 0 H 1400" />
        {Array.from({ length: 10 }).map((_, i) => (
          <g key={i}>
            <path d={`M ${i * (1400 / 9)} -18 V 18`} />
            <text x={i * (1400 / 9)} y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={i === 9 ? SCH.live : SCH.dim} stroke="none">{i}</text>
          </g>
        ))}
        <text x={700} y={118} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} stroke="none">MÉT</text>
      </g>
      {p > 0.02 ? [1, 2, 3, 4].map((i) => <path key={i} d={`M ${x - 90 - i * 40} ${560 + i * 18 - 40} H ${x - 110 - i * 90}`} stroke={SCH.glow} strokeWidth={6} strokeLinecap="round" opacity={0.7 - i * 0.14} />) : null}
      <FistIcon x={x} y={560} s={0.95} fill="#1A2C47" />
      <SchLabel x={330} y={300} t={t - 2} text={`${(p * 1).toFixed(1).replace('.', ',')} giây`} size={64} color={SCH.line} anchor="start" />
      <CountUp x={1400} y={330} t={t - 26} to={9} dur={14} size={170} format={(v) => `${Math.round(v)} m/s`} />
    </g>
  );
};
