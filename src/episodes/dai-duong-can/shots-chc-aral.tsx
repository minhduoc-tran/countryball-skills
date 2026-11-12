import React from 'react';
import { Hero, Pose, basePose, faceAt, kf, clamp, easeOut, camT, LOOKS, Look, Schematic, SCH, FONT, ShotProps, rnd, Foreground } from '../../engine';
import { Globe } from './kit-globe';
import { StrandedShip } from './kit-dry-seabed';
import { FactStamp } from './kit-hud';
import { Lbl } from './chc-life-props';
import { FaceHand } from './chc-cast-gestures';
import { RiceField, AralMap, LakeBars } from './chc-salt-props';

// Chapter C, beat "6 salt" part 2 (164.6-176.6 s): C30 "has happened before" (globe, pulsing ring over Central Asia), C31 the Aral Sea in 1960,
// C32 4th-largest lake bars, C33 the lake shrinks, C34 a salt dust storm over the dead fields, C35 a villager child coughing, C36 the rusty
// ship in the desert + FactStamp ("Đó là thật" at 175.43).

const VILLAGER: Look = { ...LOOKS.mom, jacket: '#C0643C', jacketShade: '#9E4E2D', accent: '#F2D58A', limb: '#3A3446', hair: '#2A1C18', extra: 'bunches' };

// ---------- C30: Earth turns to Central Asia, a red ring pulses ----------
export const C30: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Schematic t={t} id="c30sch" />
    <Globe id="c30g" t={t} r={380} cx={960} cy={540} rot={20} />
    {[0, 1, 2].map((i) => {
      const p = ((t / 30 + i / 3) % 1);
      return <circle key={i} cx={1150} cy={385} r={20 + p * 120} fill="none" stroke="#FF5A4A" strokeWidth={10 * (1 - p)} opacity={1 - p} />;
    })}
    <circle cx={1150} cy={385} r={16} fill="#FF5A4A" stroke="#FFF3DC" strokeWidth={4} />
  </g>
);

// ---------- C31: the Aral Sea in 1960, a big blue lake in Central Asia ----------
export const C31: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <AralMap id="c31m" t={t} shrink={0} />
    <g opacity={clamp((t - 3) / 6)}>
      <text x={960} y={580} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={108} fill="#FFFFFF" stroke="#14456B" strokeWidth={10} paintOrder="stroke" letterSpacing={4}>BIỂN ARAL</text>
    </g>
    <Lbl x={330} y={130} text="1960" size={64} o={clamp(t / 6)} />
    <Lbl x={1500} y={960} text="TRUNG Á" size={56} o={clamp((t - 8) / 6)} />
  </g>
);

// ---------- C32: four lake bars, the 4th (Aral) lit: "THỨ 4" ----------
export const C32: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="c32sch" />
    <LakeBars t={t} />
    <g transform={`translate(1560 ${520 - 30 * (1 - easeOut(clamp((t - 18) / 8)))})`} opacity={clamp((t - 18) / 6)}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={118} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>THỨ 4</text>
      <text textAnchor="middle" y={92} fontFamily={FONT.ui} fontWeight={700} fontSize={58} fill={SCH.line} letterSpacing={3}>THẾ GIỚI</text>
    </g>
  </g>
);

// ---------- C33: the lake dries up: the shoreline retreats to a few puddles ----------
export const C33: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <AralMap id="c33m" t={t} shrink={clamp((t - 2) / 26)} />
    <Lbl x={330} y={130} text="1960" size={64} o={1 - clamp((t - 6) / 8)} />
    <Lbl x={330} y={130} text="NAY" size={64} fg="#FF8A6A" o={clamp((t - 14) / 8)} />
  </g>
);

// ---------- C34: a salt dust storm wall rolls over the white fields ----------
export const C34: React.FC<ShotProps> = ({ t, len }) => {
  const front = -400 + easeOut(clamp(t / (len * 0.95))) * 2000;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 640, kf(t, [[0, 1.1], [len, 1.25]]))}>
      <RiceField id="c34r" t={t} white={1} dust={0.2} />
      <path d={`M -700 -200 L ${front} -200 ` + Array.from({ length: 12 }).map((_, i) => `Q ${front + 110 + Math.sin(t / 8 + i) * 30} ${-200 + i * 120 + 60} ${front + Math.sin(t / 9 + i * 2) * 25} ${-200 + (i + 1) * 120}`).join(' ') + ' L -700 1300 Z'} fill="#B49F7A" opacity={0.9} />
      {Array.from({ length: 16 }).map((_, i) => <ellipse key={i} cx={front - 150 - rnd(35, i) * 700 + Math.sin(t / 10 + i) * 20} cy={-60 + (i / 16) * 1250} rx={200 + rnd(36, i) * 120} ry={120 + rnd(37, i) * 60} fill={i % 2 ? '#9C8760' : '#C7B590'} opacity={0.6} />)}
      {Array.from({ length: 14 }).map((_, i) => {
        const ph = (t / 14 + rnd(33, i)) % 1;
        return <path key={i} d={`M ${front - 700 + ph * 900} ${150 + rnd(34, i) * 800} h 260`} stroke="#F6EFE0" strokeWidth={9} strokeLinecap="round" opacity={0.6} />;
      })}
      <Foreground blur={10}>
        <g transform="translate(1700 1100)" stroke="#2A2230" strokeWidth={18} strokeLinecap="round" fill="none" opacity={0.85}><path d="M 0 0 V -520 M 0 -300 L -120 -420 M 0 -380 L 110 -500 M -60 -360 L -150 -300" /></g>
      </Foreground>
    </g>
  );
};

// ---------- C35: a village girl coughs into her hand in the white dust ----------
export const C35: React.FC<ShotProps> = ({ t, len }) => {
  const S = 1.25;
  const cough = Math.max(0, Math.sin((t / 22) * Math.PI * 2 - 0.6));
  const pose: Pose = { ...basePose, x: 760, y: 1010 - 138 * S, scale: S, yaw: 0.45, facing: 1, look: 0.4, tilt: 12 * cough, headTilt: 5 * cough, armL: { a: 8, b: 6 }, armR: { a: 10, b: 6 }, ...faceAt(t, [[0, 'tired'], [20, 'worried']]) };
  const k = easeOut(clamp(t / 8));
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 760]]), 720, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <RiceField id="c35r" t={t} white={1} dust={0.5} />
      <g transform="translate(1180 520)">
        <rect x={-130} y={-120} width={260} height={120} fill="#F1ECE0" stroke="#14121A" strokeWidth={6} />
        <path d="M -150 -116 L 0 -190 L 150 -116 Z" fill="#B55A3A" stroke="#14121A" strokeWidth={6} strokeLinejoin="round" />
        <path d="M -16 -100 h 32 M 0 -116 v 32" stroke="#D9453A" strokeWidth={14} strokeLinecap="round" transform="translate(0 20)" />
      </g>
      <rect x={-100} y={300} width={2120} height={900} fill="#F4EEDD" opacity={0.3} />
      <Hero look={VILLAGER} pose={pose} rimId="rimR" shadow={0} />
      <FaceHand pose={pose} look={VILLAGER} k={k} at="mouth" />
      {Array.from({ length: 7 }).map((_, i) => {
        const ph = ((t + i * 4) % 22) / 22;
        return <circle key={i} cx={760 + 90 + ph * 220 + i * 6} cy={1010 - 138 * S - 176 * S + 30 - ph * 40 + (i % 3) * 14} r={7 + ph * 10} fill="#F6EFE0" opacity={cough * (1 - ph)} />;
      })}
    </g>
  );
};

// ---------- C36: a rusty ship in the white desert where the sea was; the FactStamp thumps on "thật" ----------
export const C36: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <defs><linearGradient id="c36s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFE0E8" /><stop offset="1" stopColor="#F6E8C6" /></linearGradient></defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill="url(#c36s)" />
      <circle cx={1500} cy={180} r={80} fill="#FFF6D8" opacity={0.9} />
      <path d="M -200 640 Q 300 520 700 610 Q 1100 700 1500 590 Q 1800 530 2120 620 L 2120 1280 L -200 1280 Z" fill="#E9DDBE" />
      <path d="M -200 760 Q 400 690 900 770 Q 1400 850 2120 740 L 2120 1280 L -200 1280 Z" fill="#F1E9D2" />
      <path d="M -200 900 Q 500 860 1000 920 Q 1500 980 2120 900 L 2120 1280 L -200 1280 Z" fill="#F7F3E8" />
      {[300, 1560, 1760].map((x, i) => <path key={i} d={`M ${x} 880 l 0 -50 M ${x} 850 l -26 -34 M ${x} 840 l 28 -30`} stroke="#8A7552" strokeWidth={6} strokeLinecap="round" />)}
      <g style={{ filter: 'sepia(0.7) saturate(0.9) brightness(0.88)' }}><StrandedShip x={960} y={840} sc={0.95} rot={-6} t={t} mud="#C9B78C" crust={1} /></g>
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${((t * 16 + i * 300) % 2300) - 200} ${700 + rnd(41, i) * 260} h ${100 + rnd(42, i) * 120}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" opacity={0.5} />)}
    </g>
    <FactStamp t={t} at={7} x={960} y={930} />
  </g>
);
