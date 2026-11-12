import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { HoaDang } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { backOut } from '../../countryball/fx-math';
import { LanternField, RiverScene } from './chh-river-night';
import { SoftT, prog } from './chh-text-and-plan';

// Chapter H part 3 (10:39-10:49, beat "33 lanterns"): 27 July on the Thạch Hãn. The most important picture of the chapter:
// lanterns by the hundred drifting on the dark river under a moon, each with its own candle glow and reflection.

/** H11 "Mỗi năm, vào dịp hai mươi bảy tháng bảy," a calendar page over the first lanterns. */
export const H11: React.FC<ShotProps> = ({ t }) => {
  const k = backOut(prog(t, 4, 22));
  return (
    <g>
      <RiverScene id="h11" t={t} tone={0.6} H={600} pan={t * 0.3} moonX={1560}>
        <LanternField id="h11" t={t} n={22} H={600} t0={10} span={50} speed={0.3} seed={3} dMin={0.1} />
      </RiverScene>
      <g transform={`translate(960,${330}) scale(${0.4 + 0.6 * k})`} opacity={Math.min(1, k * 1.6)}>
        <rect x={-210} y={-250} width={430} height={500} rx={30} fill="#000" opacity={0.4} transform="translate(10,14)" />
        <rect x={-220} y={-260} width={440} height={510} rx={30} fill="#F6F0DD" stroke="#0B1018" strokeWidth={8} />
        <path d="M-220,-170 L-220,-230 Q-220,-260 -190,-260 L190,-260 Q220,-260 220,-230 L220,-170 Z" fill="#B3262B" stroke="#0B1018" strokeWidth={8} strokeLinejoin="round" />
        <text y={-193} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFF1D6">THÁNG BẢY</text>
        <text y={130} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill="#1B2430">27</text>
      </g>
    </g>
  );
};

/** H12 "hàng nghìn ngọn hoa đăng được thả trên sông Thạch Hãn." */
export const H12: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RiverScene id="h12" moonX={1720} t={t} tone={0.82} H={540} pan={t * 0.3}>
      <LanternField id="h12" t={t} n={170} H={540} t0={0} span={55} speed={0.34} seed={5} />
    </RiverScene>
    <SoftT t={t} x={960} y={150} text="HÀNG NGHÌN HOA ĐĂNG" size={92} at={6} ls={3} glow="#FFB347" />
    <SoftT t={t} x={960} y={225} text="trên sông Thạch Hãn" size={52} at={26} font="hand" weight={700} color="#FFE9B8" />
  </g>
);

/** H13 "Những đốm nến nhỏ trôi chậm trên mặt nước," close: big lanterns drift past the camera. */
export const H13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RiverScene id="h13" moonX={1720} t={t} tone={0.9} H={470} pan={t * 0.2}>
      <LanternField id="h13" t={t} n={60} H={470} t0={-80} span={1} speed={0.3} seed={8} dMin={0.2} size={1.25} />
      <HoaDang x={430 + t * 0.5} y={820} s={130} t={t} color="pink" ph={4} />
      <HoaDang x={1020 + t * 0.7} y={730} s={104} t={t} color="white" ph={20} />
      <HoaDang x={1560 + t * 0.4} y={900} s={150} t={t} color="yellow" ph={31} />
      <Glow x={960} y={820} r={900} color="#FF9A3C" o={0.1} />
    </RiverScene>
    <SoftT t={t} x={960} y={170} text="những đốm nến nhỏ trôi chậm" size={70} at={4} font="hand" weight={700} color="#FFE9B8" />
  </g>
);

/** H14 "như để thắp sáng cho những người lính chưa về." Pull back: a river full of light. */
export const H14: React.FC<ShotProps> = ({ t }) => {
  const z = 1.12 - 0.12 * Math.min(1, t / 72);
  return (
    <g>
      <g transform={`translate(960,700) scale(${z}) translate(-960,-700)`}>
        <RiverScene id="h14" moonX={1720} t={t} tone={1} H={500} pan={t * 0.2}>
          <LanternField id="h14" t={t} n={260} H={500} t0={-90} span={1} speed={0.32} seed={11} />
          <Glow x={960} y={760} r={1100} color="#FF9A3C" o={0.12} />
        </RiverScene>
      </g>
      <SoftT t={t} x={960} y={150} text="thắp sáng cho những người lính chưa về" size={66} at={6} font="hand" weight={700} color="#FFE9B8" glow="#FFB347" />
    </g>
  );
};
