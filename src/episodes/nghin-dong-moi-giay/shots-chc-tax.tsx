import React from 'react';
import { Schematic, SchLabel, SCH, DrawOn, Sparkle, FONT, clamp, easeOut, backOut, kf, ShotProps } from '../../engine';
import { NumCard, ClockFace } from './chc-ui-phone-screens-cards-chips';
import { SplitCoin } from './chc-props-appliance-car-coin';

// Chapter C, the cost of tax (no ping look): the "1 · THUẾ" card, the five-step progressive ladder with its top bar
// lit at 35%, the 27 giờ 47 phút clock, and a 1.000 đ coin splitting into 650 and 350.

const BAR_X = [430, 680, 930, 1180, 1430];
const BAR_H = [120, 230, 350, 470, 600];
const BASE = 840;
const BW = 190;

/** The ladder of five tax bars. `grow` is the frame each bar starts rising (null = all up); `lit` 0..1 lights the top bar. */
const Ladder: React.FC<{ t: number; start?: number; lit?: number; dimTop?: boolean }> = ({ t, start = 4, lit = 0, dimTop = false }) => (
  <g>
    <path d={`M 340 ${BASE + 14} L 1680 ${BASE + 14}`} stroke={SCH.line} strokeWidth={5} strokeLinecap="round" />
    {BAR_X.map((x, i) => {
      const k = easeOut(clamp((t - start - i * 6) / 12));
      const h = BAR_H[i] * k;
      const top = i === 4;
      const c = top ? lit : 0;
      const fill = top ? `rgba(255,138,61,${0.18 + 0.6 * c})` : 'rgba(126,141,166,0.22)';
      const stroke = top && !dimTop ? (c > 0.05 ? SCH.live : SCH.dim) : SCH.dim;
      return (
        <g key={i}>
          <rect x={x - BW / 2} y={BASE - h} width={BW} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={top ? 7 : 5} style={top && c > 0 ? { filter: `drop-shadow(0 0 ${22 * c}px ${SCH.glow})` } : undefined} />
          <SchLabel x={x} y={BASE + 70} t={t - start - i * 6 - 6} text={`BẬC ${i + 1}`} size={34} color={top && c > 0 ? SCH.live : SCH.dim} />
        </g>
      );
    })}
  </g>
);

// ---------- C18: card "1 · THUẾ" ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => <NumCard t={t} len={len} n={1} word="THUẾ" icon="tax" id="c18s" />;

// ---------- C19: the ladder builds, "TỪ 7/2026" ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const pill = backOut(clamp((t - 6) / 7));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c19s" />
      <SchLabel x={960} y={170} t={t - 2} text="THUẾ THU NHẬP: 5 BẬC" size={56} />
      <Ladder t={t} />
      <g transform={`translate(700 330) scale(${pill})`}>
        <rect x={-190} y={-52} width={380} height={104} rx={52} fill="#0B0816" opacity={0.85} stroke={SCH.live} strokeWidth={4} />
        <text y={16} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={48} fill={SCH.live}>TỪ 7/2026</text>
      </g>
    </g>
  );
};

// ---------- C20: the top bar lights up, labelled "> 100 TRIỆU/THÁNG" ----------
export const C20: React.FC<ShotProps> = ({ t, len }) => {
  const lit = easeOut(clamp((t - 8) / 14));
  const cam = kf(t, [[0, 0], [len, 1]]);
  return (
    <g transform={`translate(960 540) scale(${1 + 0.25 * cam}) translate(${-960 - 220 * cam} -540)`}>
      <Schematic t={t + 40} id="c20s" />
      <Ladder t={t + 100} start={0} lit={lit} />
      <g opacity={clamp((t - 14) / 8)}>
        <DrawOn d="M 1430 190 L 1430 240" t={t - 14} color={SCH.live} width={6} />
        <SchLabel x={1430} y={170} t={t - 14} text="> 100 TRIỆU/THÁNG" size={50} color={SCH.live} />
      </g>
      <Sparkle x={1560} y={BASE - 560} t={t - 20} s={1.6} />
    </g>
  );
};

// ---------- C21: "35%" slams on ----------
export const C21: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t + 1) / 8));
  const flash = clamp(1 - t / 5);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t + 70} id="c21s" />
      <g opacity={0.14}><Ladder t={t + 100} start={0} lit={1} /></g>
      <g transform={`translate(960 560) scale(${0.6 + 0.4 * k})`} opacity={clamp((t + 1) / 3)}>
        <text textAnchor="middle" y={150} fontFamily={FONT.ui} fontWeight={700} fontSize={420} fill={SCH.live} style={{ filter: `drop-shadow(0 0 30px ${SCH.glow})` }}>35%</text>
      </g>
      <SchLabel x={960} y={900} t={t - 8} text="MỨC THUẾ CAO NHẤT" size={54} />
      <rect x={0} y={0} width={1920} height={1080} fill="#FFF3DC" opacity={flash * 0.35} />
    </g>
  );
};

// ---------- C22: a clock sweeps round and reads 27 GIỜ 47 PHÚT ----------
export const C22: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / (len - 14)));
  const mins = Math.round(1667 * p);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t + 30} id="c22s" />
      <ClockFace x={520} y={540} r={270} angle={p * 360 * 3.2} />
      <SchLabel x={1180} y={330} t={t - 2} text="ĐỂ CHẠM 100 TRIỆU" size={48} color={SCH.dim} />
      <text x={1180} y={500} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={140} fill={SCH.live} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }}>{`${h} GIỜ`}</text>
      <text x={1180} y={650} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={140} fill={SCH.line}>{`${String(m).padStart(2, '0')} PHÚT`}</text>
      <SchLabel x={1180} y={780} t={t - 20} text="= 100.000 GIÂY" size={44} color={SCH.dim} />
      <Sparkle x={1640} y={400} t={t - (len - 12)} s={1.6} />
    </g>
  );
};

// ---------- C23: a 1.000 đ coin splits: 650 đ stays, 350 đ is tax ----------
export const C23: React.FC<ShotProps> = ({ t, len }) => {
  const split = clamp((t - 30) / 12);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      <Schematic t={t + 50} id="c23s" />
      <SchLabel x={960} y={150} t={t - 2} text="MỖI 1.000 ĐỒNG" size={54} />
      <SplitCoin x={960} y={540} r={250} split={split} t={t} />
      <g opacity={clamp((t - 38) / 8)}>
        <rect x={1090} y={880} width={300} height={90} rx={45} fill="#E0554D" />
        <text x={1240} y={942} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#FFF3E6">THUẾ</text>
        <SchLabel x={700} y={930} t={t - 40} text="BẠN GIỮ" size={44} color={SCH.dim} />
      </g>
      <Sparkle x={1380} y={330} t={t - 38} s={1.6} />
    </g>
  );
};
