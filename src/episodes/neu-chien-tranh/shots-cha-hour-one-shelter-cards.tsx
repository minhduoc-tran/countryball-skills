import React from 'react';
import {
  Schematic, SchLabel, DrawOn, Tag, SCH, FONT, kf, clamp, easeOut, backOut, camT, Glow, ShotProps,
} from '../../engine';
import { ukrainePath, UKRAINE_H, PlatformIcon } from './cha-shelter-props';

// Chapter A, hour one, the number cards (A25, A26, A28, 51.81-61.06 s): "2022, UKRAINE" on a plain outline; "HÀNG NGHÌN
// NGƯỜI" asleep on a metro platform (a simple icon); "ĐÓ LÀ THẬT" with the source. The places are only labels on a card.

const SOURCE = 'NGUỒN: REUTERS, AP, BBC (2/2022–3/2022)';

// ---------- A25: "Năm 2022, ở Ukraine": the year pops, a plain outline draws on and is labelled ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => {
  const W = 800;
  const H = UKRAINE_H(W);
  const yearIn = backOut(clamp((t - 2) / 9));
  const d = ukrainePath(W);
  const fillP = clamp((t - 70) / 12);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="a25sch" />
      <SchLabel x={540} y={330} t={t - 1} text="NĂM" size={44} color={SCH.dim} />
      <g transform={`translate(540 560) scale(${yearIn})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={250} fill={SCH.line} stroke="#101A2A" strokeWidth={8} paintOrder="stroke">2022</text>
      </g>
      <g transform={`translate(${1370 - W / 2} ${520 - H / 2})`}>
        <DrawOn d={d} t={t - 22} dur={30} width={7} color={SCH.line} fill={`rgba(255,138,61,${0.2 * fillP})`} />
      </g>
      <SchLabel x={1370} y={540} t={t - 56} text="UKRAINE" size={72} color={SCH.live} />
      <SchLabel x={960} y={960} t={t - 60} text={SOURCE} size={26} color={SCH.dim} />
      <Glow x={1370} y={520} r={460} o={0.12} />
    </g>
  );
};

// ---------- A26: "hàng nghìn người đã ngủ trong các ga tàu điện ngầm": the platform icon fills with sleepers ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 545]]), kf(t, [[0, 1.0], [len, 1.04]]))}>
    <Schematic t={t + 40} id="a26sch" />
    <g transform={`translate(960 215) scale(${backOut(clamp(t / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill={SCH.live} stroke="#101A2A" strokeWidth={9} paintOrder="stroke" style={{ filter: `drop-shadow(0 0 20px ${SCH.glow}88)` }}>HÀNG NGHÌN NGƯỜI</text>
    </g>
    <PlatformIcon x={960} y={610} t={t} t0={10} id="a26pl" s={1.3} />
    <SchLabel x={960} y={990} t={t - 46} text="GA TÀU ĐIỆN NGẦM" size={34} color={SCH.dim} />
  </g>
);

// ---------- A28: "Đó là thật.": the tick on the card, the source tag ----------
export const A28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t + 90} id="a28sch" />
    <PlatformIcon x={960} y={330} t={t + 60} t0={0} id="a28pl" s={0.8} />
    <Tag x={960} y={790} t={t - 1} text="ĐÓ LÀ THẬT" mark="check" markT={9} w={740} />
    <SchLabel x={960} y={950} t={t - 16} text={SOURCE} size={26} color={SCH.dim} />
    <Glow x={960} y={780} r={560} o={0.14} />
  </g>
);
