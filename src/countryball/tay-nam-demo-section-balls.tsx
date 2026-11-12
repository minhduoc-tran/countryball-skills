import React from 'react';
import { Ball } from './countryball';
import { breathe, hop, mixMotion, REST, talk } from './ball-motion';
import { MuCoi } from './ball-accessories';
import { CAMBODIA_BALLS } from './ball-accessories-cambodia';
import { FlagCloth, FlagKind } from './flag-cloth';
import { Label } from './fx-demo-sections-balls';

// TayNamKitDemo section 2 (t = local frame, 1080x1920): Cambodian balls (regime DK + plain cap, people PRK + krama, farmer krama on the head,
// SOC, today KHM) next to bộ đội VNM, then the pole flags DK / PRK / SOC / KHM / THA / VNM waving. Text stays inside PORTRAIT_SAFE.
export const BALLS_SECTION_FRAMES = 150;

export const BallsSection: React.FC<{ t: number }> = ({ t }) => {
  const balls = [
    { ...CAMBODIA_BALLS.regime(), name: "'DK' + KrCap" },
    { ...CAMBODIA_BALLS.people('dp'), name: "'PRK' + Krama" },
    { ...CAMBODIA_BALLS.farmer('df'), name: "Krama 'head'" },
    { ...CAMBODIA_BALLS.soc('ds'), name: "'SOC' (1989-93)" },
    { ...CAMBODIA_BALLS.today('dt'), name: "'KHM' (hôm nay)" },
    { flag: 'VNM', hat: <MuCoi camo />, eyes: 'determined' as const, name: "'VNM' + MuCoi" },
  ];
  const flags: FlagKind[] = ['DK', 'PRK', 'SOC', 'KHM', 'THA', 'VNM'];
  return (
    <g>
      <rect width={1080} height={1920} fill="#1D3247" />
      <Label x={60} y={230} text="BÓNG + CỜ CAMPUCHIA 1975-NAY" size={34} color="#FFD166" anchor="start" />
      {balls.map((b, i) => {
        const x = 190 + (i % 3) * 300, y = 430 + Math.floor(i / 3) * 330;
        return (
          <g key={i}>
            <Ball id={`tnb${i}`} x={x} y={y} r={100} flag={b.flag} eyes={b.eyes} hat={b.hat} t={t} motion={mixMotion(breathe(t, 64 + i * 3, 0.03, i * 9), i === 1 ? hop(t, 34, 20) : REST, i === 5 ? talk(t) : REST)} />
            <Label x={x} y={y + 160} text={b.name} size={24} color="#DCE6EE" />
          </g>
        );
      })}
      {flags.map((k, i) => {
        const x = 70 + (i % 3) * 290, y = 1050 + Math.floor(i / 3) * 250;
        return (
          <g key={k}>
            <line x1={x} y1={y - 6} x2={x} y2={y + 200} stroke="#E9E4D3" strokeWidth={6} strokeLinecap="round" />
            <FlagCloth id={`tnfc${k}`} x={x + 3} y={y} w={216} h={144} kind={k} wave={0.85} t={t + i * 14} />
            <Label x={x + 110} y={y + 190} text={`'${k}'`} size={26} color="#DCE6EE" />
          </g>
        );
      })}
    </g>
  );
};
