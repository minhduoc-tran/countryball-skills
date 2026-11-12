import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { breathe, mixMotion, talk } from '../../countryball/ball-motion';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { MuCoi } from '../../countryball/ball-accessories';
import { RadioMicrophone, TransistorRadio } from '../../countryball/radio-props';
import { SaigonBridgeSide } from '../../countryball/saigon-bridge-side';
import { TankSide } from '../../countryball/ground-tanks';
import { ClockChip } from '../../countryball/hud-clock-chip';
import { Cap, NameCard, Plate, Stage, easeOut, prog } from './che-common';

// Chapter E, part 5 (6:17-6:28, beat "8c ceasefire", 30.04.1975): E23 10:24 Dương Văn Minh's broadcast (no photo in this chapter: plain name card, no caricature),
// E24 soldiers on both sides hear it: stop firing, stay in place, wait to hand over (paraphrase of the narration, no quotes), E25 the guns fall quiet (smoke thins out).

/** E23 377.37 "Mười giờ hai mươi tư phút, giọng của Tổng thống Dương Văn Minh vang lên trên đài phát thanh." ON AIR studio, sound arcs, the clock chip reads 10:24. */
export const E23: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="e23" tone="night" />
    <rect x={0} y={760} width={1920} height={320} fill="#1A1710" />
    <RadioMicrophone x={640} y={900} s={1.5} t={t} onAir />
    {[0, 1, 2].map((i) => {
      const u = ((t * 1.2 + i * 40) % 120) / 120;
      return <path key={i} d={`M${940 + u * 60},${620 - 40 - u * 90} Q${1010 + u * 130},620 ${940 + u * 60},${620 + 40 + u * 90}`} fill="none" stroke="#FFE08A" strokeWidth={8} strokeLinecap="round" opacity={0.7 * (1 - u)} />;
    })}
    <NameCard t={t} at={40} x={1500} y={340} name="DƯƠNG VĂN MINH" sub="Tổng thống" w={760} accent="#E8B422" />
    <Plate t={t} at={96} x={1500} y={640} text="TRÊN ĐÀI PHÁT THANH" size={46} />
    <ClockChip date="30.04.1975" clock="10:24" t={t / 30} id="e23-clock" />
  </g>
);

/** E24 381.80 "Ông kêu gọi binh sĩ ngừng nổ súng, ở nguyên vị trí, chờ để bàn giao chính quyền." a radio between two soldiers (VNM / RVN balls) listening. */
export const E24: React.FC<ShotProps> = ({ t }) => {
  const text = t < 60 ? 'KÊU GỌI NGỪNG NỔ SÚNG' : t < 93 ? 'Ở NGUYÊN VỊ TRÍ' : 'CHỜ BÀN GIAO CHÍNH QUYỀN';
  const at = t < 60 ? 0 : t < 93 ? 60 : 93;
  return (
    <g>
      <Stage id="e24" tone="dawn" dim={0.1} />
      <rect y={820} width={1920} height={260} fill="#4E5A3A" /><rect y={812} width={1920} height={14} fill="#6B7A4A" />
      <TransistorRadio x={960} y={940} s={2.3} t={t} waves={0.55 + 0.45 * Math.sin(t / 6)} />
      <Ball id="e24a" x={420} y={780} r={150} flag="VNM" eyes="normal" look={0.7} hat={<MuCoi />} tilt={5} motion={mixMotion(breathe(t, 90, 0.02), talk(t, false))} t={t} />
      <Ball id="e24b" x={1500} y={780} r={150} flag="RVN" eyes="worried" look={-0.7} hat={<M1Helmet />} tilt={-5} motion={breathe(t, 90, 0.02, 0.3)} t={t} />
      <Plate t={t} at={at} x={960} y={190} text={text} size={74} color={t < 93 ? '#FFFFFF' : '#FFE08A'} />
    </g>
  );
};

/** E25 386.47 "Ở nhiều nơi, súng bắt đầu im lặng." the bridge again: both tanks stand still, the smoke columns thin out. */
export const E25: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SaigonBridgeSide id="e25" y={600} n={0} t={t} tone="day" smoke={1 - 0.85 * easeOut(prog(t, 0, 66))} />
    <TankSide x={600} y={600 - 18 * 1.6} size={320} kind="t54" flag="PRG" t={t} id="e25a" />
    <TankSide x={1260} y={600 - 18 * 1.7} size={340} kind="m48" flip t={t} id="e25b" />
    <Plate t={t} at={6} x={960} y={170} text="SÚNG BẮT ĐẦU IM LẶNG" size={70} />
  </g>
);
