import React from 'react';
import { Ball } from './countryball';
import { breathe, hop, mixMotion, REST, talk } from './ball-motion';
import { MuCoi } from './ball-accessories';
import { M1Helmet, NavyCap, TankCrewHelmet } from './ball-accessories-military';
import { FlagCloth } from './flag-cloth';
import { RadioMicrophone, TransistorRadio } from './radio-props';
import { SpeechBubble } from './ball-speech-and-props';
import { Label } from './fx-demo-sections-balls';
import { ClockChip } from './hud-clock-chip';

// SaigonKitDemo section 9 (t = local frame): balls with the 1975 flags and hats, the three pole flags with a wind ripple, the studio desk of the
// surrender broadcast and the transistor radio, and the ClockChip running 10:45 -> 11:30.
export const PROPS_FRAMES = 150;
const BALLS: { flag: string; hat: React.ReactNode; name: string; eyes: 'normal' | 'determined' | 'smug' | 'worried' | 'happy' | 'sad' }[] = [
  { flag: 'VNM', hat: <TankCrewHelmet />, name: 'VNM + mũ lái xe tăng', eyes: 'determined' },
  { flag: 'VNM', hat: <MuCoi camo />, name: 'VNM + mũ cối', eyes: 'happy' },
  { flag: 'PRG', hat: <MuCoi />, name: 'PRG (MTDTGP)', eyes: 'normal' },
  { flag: 'RVN', hat: <M1Helmet />, name: 'RVN + M1', eyes: 'worried' },
  { flag: 'USA', hat: <NavyCap />, name: 'USA + NavyCap', eyes: 'smug' },
  { flag: 'MTDTGP', hat: <TankCrewHelmet color="#222B3A" />, name: "'MTDTGP' + mũ (xanh)", eyes: 'sad' },
];

export const PropsSection: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#1D3247" />
    <Label x={60} y={170} text="BÓNG 1975, CỜ, ĐÀI, RADIO, ĐỒNG HỒ" size={28} color="#FFD166" anchor="start" />
    {BALLS.map((b, i) => (
      <g key={b.name}>
        <Ball id={`pb${i}`} x={170 + i * 300} y={330} r={92} flag={b.flag} eyes={b.eyes} hat={b.hat} t={t} motion={mixMotion(breathe(t, 64 + i * 3, 0.03, i * 9), i === 1 ? hop(t, 30, 24) : REST)} />
        <Label x={170 + i * 300} y={470} text={b.name} size={20} />
      </g>
    ))}
    {(['PRG', 'RVN', 'VNM', 'USA'] as const).map((k, i) => (
      <g key={k}>
        <line x1={110 + i * 220} y1={520} x2={110 + i * 220} y2={800} stroke="#E9E4D3" strokeWidth={6} strokeLinecap="round" />
        <FlagCloth id={`fc${k}`} x={113 + i * 220} y={524} w={150} h={100} kind={k} wave={0.9} t={t + i * 14} />
        <Label x={190 + i * 220} y={830} text={k === 'PRG' ? 'PRG / MTDTGP' : k} size={20} />
      </g>
    ))}
    <RadioMicrophone x={1230} y={930} s={0.8} t={t} />
    <TransistorRadio x={1640} y={900} s={1.5} t={t} waves={0.9} />
    <Ball id="pl" x={1500} y={760} r={70} flag="VNM" eyes="worried" hat={<TankCrewHelmet />} motion={mixMotion(talk(t), breathe(t))} />
    <SpeechBubble x={1700} y={540} tipX={1560} tipY={700} text={'Đài phát thanh Sài Gòn...'} size={30} t={t} at={10} />
    <Label x={1230} y={1070} text="RadioMicrophone · ReelToReel (bàn đài)" size={20} /><Label x={1640} y={990} text="TransistorRadio" size={20} />
    <ClockChip date="30.04.1975" clock={[{ t: 0, time: '10:45' }, { t: 5, time: '11:30' }]} t={t / 30} id="ck9" />
  </g>
);
