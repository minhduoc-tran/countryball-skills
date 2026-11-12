import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, camT, LOOKS, LEG_LEN, HEAD, joints, toWorld,
  Schematic, SCH, SchLabel, Glow, LightVeil, Dust, Tabletop, KITCHEN, KitchenIsland, islandTop, stand,
  Bedroom, BedDuvet, bedSit, bedTop, CannedShelf, ShotProps, FONT,
} from '../../engine';
import { CostCard, Dim, DarkKitchen, Candle, Can, CanIcon } from './shots-chc-shared-props-and-cards';

// Chapter C, beats "cans", "water" and "health" (C10-C19): living on tins that run out, a dead seedling, a tap going
// dry, a sick day with no doctor, a small cut that could turn bad.

const PIP = LOOKS.pipHood;
const RED = '#FF5A4A';

// ---------- C10: medium: the kitchen by candlelight; Pip builds a pyramid of tins on the island ----------
const C10_STAND = stand(KITCHEN, 0.53, 0.4);
const C10_BASE = islandTop(0.66, 0.5);
const C10_SPOTS = [[-66, 0], [0, 0], [66, 0], [-33, -80], [33, -80]]; // the pyramid, left to right, bottom up
export const C10: React.FC<ShotProps> = ({ t, len }) => {
  const swing = Math.sin(((t - 4.5) / 14) * Math.PI * 2); // +1 as a tin goes down on the pile, every 14 frames
  const pose = poseAt(t, [
    { f: 0, p: { x: C10_STAND.x, y: C10_STAND.y, scale: C10_STAND.scale, yaw: 0.55, look: 0.7, armL: { a: 14, b: -6 }, headTilt: 0 } },
  ]);
  const p: Pose = { ...pose, armR: { a: 70 + 38 * swing, b: 30 - 24 * swing }, headTilt: 2 * swing, squash: 0.02 * Math.max(0, -swing) };
  const hand = toWorld(p, joints(p).armR.end);
  const placed = [8, 22, 36, 50, 64].map((at) => t >= at);
  const next = placed.filter(Boolean).length;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1100]]), 590, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <DarkKitchen t={t + 60} id="k10" dim={0.64} />
      <Hero look={PIP} pose={{ ...p, ...faceAt(t, [[0, 'neutral'], [56, 'worried']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland />
      {C10_SPOTS.map(([dx, dy], i) => {
        const k = t - [8, 22, 36, 50, 64][i];
        if (k < 0) return null;
        const drop = k < 5 ? -26 * (1 - easeOut(k / 5)) : 0;
        return <Can key={i} x={C10_BASE.x + dx * 0.78} y={C10_BASE.y + dy * 0.78 + drop} s={0.78} c={i} />;
      })}
      {next < 5 ? <Can x={hand.x + 6} y={hand.y + 40} s={0.78} c={next} shadow={false} rot={-8} /> : null}
      <Candle x={islandTop(0.36, 0.55).x} y={islandTop(0.36, 0.55).y} t={t} s={0.9} />
    </g>
  );
};

// ---------- C11: schematic: tins of every kind, then a bar from year 2 to year 5 ----------
const TIN_SHAPES = [[1, 1], [0.8, 1.2], [1.2, 0.75], [0.9, 1], [1.1, 1.15], [1, 0.8]];
export const C11: React.FC<ShotProps> = ({ t, len }) => {
  const band = easeOut(clamp((t - 48) / 20));
  const X = (yr: number) => 380 + yr * 232;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sc11" />
      <SchLabel x={960} y={170} t={t - 2} text="ĐỒ HỘP" size={54} />
      {TIN_SHAPES.map(([sx, sy], i) => {
        const k = clamp((t - 4 - i * 4) / 6);
        return k > 0 ? (
          <g key={i} transform={`translate(${460 + i * 200} 360) scale(${sx * k} ${sy * k})`}>
            <CanIcon x={0} y={0} s={1.15} on={t > 48 && i % 2 === 0} />
          </g>
        ) : null;
      })}
      <path d={`M ${X(0)} 690 L ${X(5)} 690`} stroke={SCH.dim} strokeWidth={6} strokeLinecap="round" />
      {[0, 1, 2, 3, 4, 5].map((y) => (
        <g key={y}>
          <path d={`M ${X(y)} 670 L ${X(y)} 710`} stroke={SCH.dim} strokeWidth={5} />
          <text x={X(y)} y={768} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={y >= 2 ? SCH.line : SCH.dim}>{y}</text>
        </g>
      ))}
      <path d={`M ${X(2)} 690 L ${X(2) + (X(5) - X(2)) * band} 690`} stroke={SCH.live} strokeWidth={22} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      <SchLabel x={960} y={940} t={t - 50} text="2–5 NĂM" size={150} color={SCH.live} />
    </g>
  );
};

// ---------- C12: medium: the pantry shelf; the tins vanish one by one; Pip watches, shoulders dropping ----------
export const C12: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1560, y: 880 - LEG_LEN * 1.5, scale: 1.5, yaw: -0.5, look: -0.8, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 50, p: {} },
    { f: 62, p: { armL: { a: 6, b: -2 }, armR: { a: 6, b: -2 }, headTilt: 6, look: -0.3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1080]]), 590, kf(t, [[0, 1.05], [len, 1.22]]))}>
      <rect x={-400} y={-400} width={2720} height={1280} fill="#2A2838" />
      <rect x={-400} y={880} width={2720} height={700} fill="#1A1620" />
      <rect x={-400} y={876} width={2720} height={4} fill="#FFC27A" opacity={0.3} />
      <CannedShelf x={560} y={330} w={720} rows={3} cols={6} s={1.5} count={18 * (1 - clamp((t - 12) / 44))} />
      <Dim o={0.5} />
      <Candle x={1100} y={292} t={t + 20} s={1.1} />
      <Dust t={t} seed={12} x0={560} y0={380} w={700} h={460} n={26} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'worried'], [52, 'tired']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- C13: close-up: a dead seedling and a seed packet; Pip has never grown a thing ----------
export const C13: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.3 * (1 + 0.05 * clamp(t / len));
  const head = { x: 760, y: 500 };
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.4, look: 0.9, headTilt: 0 } },
    { f: 15, p: {} },
    { f: 24, p: { headTilt: -7, yaw: 0.3 }, ease: easeOut },
  ]);
  const wilt = Math.sin(t / 20) * 2;
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-480 -420) scale(1.8)">
          <DarkKitchen t={t + 300} id="k13" dim={0.55} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050818" opacity={0.25} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [15, 'oops']]) }} rimId="rimR" shadow={0} />
      {/* the sill: a wooden edge, the pot with a drooping brown seedling, a packet leaning on it */}
      <rect x={1040} y={870} width={1000} height={260} fill="#4A3A30" />
      <rect x={1040} y={870} width={1000} height={6} fill="#FFC27A" opacity={0.55} />
      <g>
        <ellipse cx={1500} cy={878} rx={170} ry={16} fill="#000" opacity={0.4} />
        <path d="M 1380 690 L 1620 690 L 1580 870 L 1420 870 Z" fill="#B5683F" />
        <path d="M 1380 690 L 1440 690 L 1456 870 L 1420 870 Z" fill="#000" opacity={0.25} />
        <rect x={1366} y={660} width={268} height={38} rx={8} fill="#C97A4A" />
        <rect x={1366} y={660} width={268} height={5} rx={2} fill="#FFC27A" opacity={0.7} />
        <rect x={1380} y={668} width={240} height={14} fill="#2A1E18" />
        <path d={`M 1500 670 Q 1498 560 ${1548 + wilt} 520 Q ${1590 + wilt} 520 ${1610 + wilt} 600`} stroke="#7A5A32" strokeWidth={12} fill="none" strokeLinecap="round" />
        <path d={`M ${1548 + wilt} 530 Q 1470 480 1430 560 Q 1500 560 ${1548 + wilt} 530 Z`} fill="#A88A3A" />
        <path d={`M ${1604 + wilt} 590 Q 1670 560 1690 650 Q 1630 650 ${1604 + wilt} 590 Z`} fill="#8A6A2E" />
      </g>
      <g transform="translate(1210 870) rotate(-12)">
        <rect x={-70} y={-250} width={140} height={250} rx={6} fill="#F1E8D2" />
        <rect x={-70} y={-250} width={30} height={250} fill="#000" opacity={0.12} />
        <path d="M 0 -150 L -30 -210 L 30 -210 Z" fill="#E8833A" />
        <path d="M -8 -210 Q 0 -240 8 -210 M -20 -210 Q -22 -236 -12 -226 M 20 -210 Q 22 -236 12 -226" stroke="#4E7B3A" strokeWidth={7} fill="none" strokeLinecap="round" />
        <rect x={-50} y={-120} width={100} height={12} fill="#3A4A6A" opacity={0.7} />
        <rect x={-50} y={-96} width={70} height={9} fill="#3A4A6A" opacity={0.5} />
      </g>
      {t > 22 ? <path d={`M 1010 ${380 + Math.min(40, (t - 22) * 3)} q 14 24 0 36 q -14 -12 0 -36 Z`} fill="#9FD0FF" opacity={0.85} /> : null}
      <Candle x={1790} y={870} t={t + 5} s={1.25} />
    </g>
  );
};

// ---------- C14: "3 · NƯỚC" ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => <CostCard t={t} len={len} n={3} word="NƯỚC" icon="drop" id="sc14" />;

// ---------- C15: insert: the kitchen tap; a stream that thins to drips, then nothing ----------
const DROPS = [46, 60, 78];
export const C15: React.FC<ShotProps> = ({ t, len }) => {
  const sx = 1010;
  const stream = 1 - easeIn(clamp(t / 40));
  const w = t < 40 ? Math.max(0, 36 * stream * (t > 26 ? 0.55 + 0.45 * Math.sin(t * 2.4) : 1)) : 0;
  const bead = (at: number) => clamp((t - (at - 11)) / 11);
  const lastBead = clamp((t - 74) / 14) * (t > 90 ? clamp(1 - (t - 90) / 3) : 1);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#1B2638" />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d={`M ${-300 + i * 160} -200 L ${-300 + i * 160} 1200 M -400 ${-100 + i * 100} L 2400 ${-100 + i * 100}`} stroke="#222F44" strokeWidth={3} />
      ))}
      <Glow x={1560} y={120} r={700} kind="cool" o={0.35} />
      {/* the basin: steel, with the drain under the spout */}
      <path d="M 160 800 L 1760 800 L 1700 1080 L 220 1080 Z" fill="#4A5668" />
      <ellipse cx={sx} cy={900} rx={150} ry={20} fill="#222C3A" />
      <ellipse cx={sx} cy={900} rx={48} ry={9} fill="#0A0E16" />
      <rect x={160} y={796} width={1600} height={8} fill="#9FC0FF" opacity={0.4} />
      {/* the stream, with a splash where it lands */}
      {w > 0.5 ? (
        <g>
          <rect x={sx - w / 2} y={368} width={w} height={532} fill="#7FB8E8" opacity={0.9} />
          <rect x={sx - w / 2 + 2} y={368} width={w * 0.25} height={532} fill="#E9F6FF" opacity={0.7} />
          <ellipse cx={sx} cy={900} rx={w * 1.6} ry={w * 0.3} fill="#CFE6FF" opacity={0.6} />
        </g>
      ) : null}
      {/* drips: a bead swells at the spout, falls, rings the water */}
      {DROPS.map((at, i) => {
        const b = bead(at);
        const fall = clamp((t - at) / 12);
        const y = 368 + 520 * fall * fall;
        const ring = clamp((t - at - 12) / 12);
        return (
          <g key={i}>
            {t < at ? <ellipse cx={sx} cy={372 + 10 * b} rx={4 + 9 * b} ry={5 + 12 * b} fill="#8EC4F0" /> : null}
            {t >= at && fall < 1 ? <path d={`M ${sx} ${y - 24} Q ${sx + 14} ${y + 2} ${sx} ${y + 8} Q ${sx - 14} ${y + 2} ${sx} ${y - 24} Z`} fill="#8EC4F0" /> : null}
            {ring > 0 && ring < 1 ? <ellipse cx={sx} cy={900} rx={20 + ring * 90} ry={4 + ring * 14} fill="none" stroke="#CFE6FF" strokeWidth={4} opacity={1 - ring} /> : null}
          </g>
        );
      })}
      {lastBead > 0 ? <ellipse cx={sx} cy={374 + 4 * lastBead} rx={3 + 7 * lastBead} ry={4 + 9 * lastBead} fill="#8EC4F0" /> : null}
      {/* the tap: a chrome neck over the basin, a nozzle at its tip */}
      <g>
        <path d="M 760 800 L 760 330 Q 760 200 900 200 L 960 200 Q 1010 200 1010 260 L 1010 340" stroke="#222C3A" strokeWidth={84} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 760 800 L 760 330 Q 760 200 900 200 L 960 200 Q 1010 200 1010 260 L 1010 340" stroke="#A9B4C4" strokeWidth={70} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 742 800 L 742 330 Q 742 220 880 220" stroke="#5A6678" strokeWidth={20} fill="none" strokeLinecap="round" opacity={0.7} />
        <path d="M 784 790 L 784 340 Q 784 236 900 236 L 960 236" stroke="#EAF2FF" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.75} />
        <rect x={sx - 38} y={332} width={76} height={36} rx={10} fill="#8A96A8" />
        <rect x={sx - 38} y={332} width={26} height={36} rx={10} fill="#000" opacity={0.25} />
        <rect x={680} y={760} width={160} height={50} rx={12} fill="#8A96A8" />
        <path d="M 760 760 L 760 680 M 724 680 L 800 680" stroke="#D9E2F0" strokeWidth={14} strokeLinecap="round" />
      </g>
      <LightVeil id="c15veil" lights={[[1010, 420, 600]]} o={0.42} />
    </g>
  );
};

// ---------- C16: "4 · SỨC KHỎE" ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => <CostCard t={t} len={len} n={4} word="SỨC KHỎE" icon="cross" id="sc16" />;

// ---------- C17: medium: Pip in bed with a cold, tissues on the duvet, the lamp barely alive ----------
const SICK = bedSit(0.2);
export const C17: React.FC<ShotProps> = ({ t, len }) => {
  const sneeze = t > 30 && t < 40 ? Math.sin(((t - 30) / 10) * Math.PI) : 0;
  const pose = poseAt(t, [
    { f: 0, p: { x: SICK.x, y: SICK.y, scale: SICK.scale, yaw: 0.8, look: 0.2, headTilt: 4, tilt: -3, legL: { a: 86, b: -4 }, legR: { a: 82, b: -4 }, armL: { a: 20, b: 40 }, armR: { a: 20, b: 40 } } },
  ]);
  const shiver = Math.sin(t * 2.7) * 1.4;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 600, kf(t, [[0, 2.1], [len, 2.3]]))}>
      <Bedroom t={t + 120} id="bd17" duvet={false} clock="--:--" lamp={0.45 + 0.1 * Math.sin(t / 3)} crossed={4} veil={0.55} />
      <Hero look={PIP} pose={{ ...pose, headTilt: pose.headTilt + shiver - 9 * sneeze, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={0.05} />
      {[[0.3, 0.28], [0.36, 0.2], [0.27, 0.18]].map(([u, w], i) => {
        const p = bedTop(u, w);
        return <circle key={i} cx={p.x} cy={p.y - 8} r={12 - i} fill="#F4F1EA" stroke="#BDB6A6" strokeWidth={2} />;
      })}
      {sneeze > 0 ? (
        <g fill="#CFE6FF" opacity={sneeze}>
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={SICK.x + 120 + i * 22 * sneeze} cy={SICK.y - 280 + (i - 2) * 16 * sneeze} r={4 + (i % 2) * 2} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// ---------- C18: schematic: the ambulance icon, crossed out; 0 ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => {
  const x1 = easeOut(clamp((t - 12) / 7));
  const x2 = easeOut(clamp((t - 17) / 7));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sc18" />
      <g transform="translate(960 500) scale(1.35)" stroke={SCH.line} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -260 80 L -260 -120 L 40 -120 L 40 -40 L 150 -40 L 240 30 L 260 30 L 260 80 Z" />
        <path d="M 70 -22 L 135 -22 L 178 22 L 70 22 Z" />
        <circle cx={-150} cy={86} r={38} fill={SCH.ground} />
        <circle cx={150} cy={86} r={38} fill={SCH.ground} />
        <path d="M -110 -80 V -10 M -145 -45 H -75" stroke={SCH.live} strokeWidth={14} />
        <rect x={-136} y={-146} width={52} height={22} rx={6} stroke={SCH.dim} />
      </g>
      <path d="M 560 250 L 1360 760" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - x1} />
      <path d="M 1360 250 L 560 760" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - x2} />
      <SchLabel x={960} y={930} t={t - 6} text="XE CẤP CỨU: 0" size={66} />
    </g>
  );
};

// ---------- C19: insert: a raised finger, a small cut, a plaster, then the red glow of infection ----------
export const C19: React.FC<ShotProps> = ({ t, len }) => {
  const cut = clamp((t - 8) / 4);
  const plaster = easeOut(clamp((t - 18) / 8));
  const inf = clamp((t - 36) / 8);
  const pulse = 0.65 + 0.35 * Math.sin(t / 2.2);
  const fx = 1060;
  return (
    <g transform={`translate(960 540) rotate(${kf(t, [[0, -2], [len, 2]])}) scale(${kf(t, [[0, 1], [len, 1.1]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#4A3A30" grain="#3C2F27" lip="#5A4636" />
      <Glow x={340} y={260} r={800} o={0.4} />
      <LightVeil id="c19veil" lights={[[1000, 560, 620]]} o={0.5} />
      {/* the sleeve, the palm, the curled fingers, the thumb, and the raised index finger */}
      <g filter="url(#rimR)">
        <path d="M 960 900 Q 1100 1020 1260 1240" stroke={PIP.line} strokeWidth={190} fill="none" strokeLinecap="round" />
        <path d="M 960 900 Q 1100 1020 1260 1240" stroke={PIP.limb} strokeWidth={166} fill="none" strokeLinecap="round" />
        <ellipse cx={fx - 90} cy={800} rx={150} ry={126} fill={PIP.hand} stroke={PIP.line} strokeWidth={8} />
        {[730, 790, 850].map((y, i) => (
          <path key={i} d={`M ${fx - 200} ${y} Q ${fx - 130} ${y - 34} ${fx - 40} ${y + 4}`} stroke={PIP.line} strokeWidth={6} fill="none" strokeLinecap="round" />
        ))}
        <rect x={fx - 48} y={420} width={104} height={400} rx={52} fill={PIP.hand} stroke={PIP.line} strokeWidth={8} />
        <path d={`M ${fx - 30} 790 Q ${fx - 10} 740 ${fx + 40} 770`} stroke={PIP.line} strokeWidth={5} fill="none" />
      </g>
      {cut > 0 ? (
        <g>
          <path d={`M ${fx - 20} 520 L ${fx + 24} 508`} stroke="#B8332F" strokeWidth={9 * cut} strokeLinecap="round" />
          {plaster < 0.2 ? <circle cx={fx + 4} cy={540} r={9 * cut} fill="#D9443B" /> : null}
        </g>
      ) : null}
      {plaster > 0 ? (
        <g transform={`translate(${fx} 514) rotate(-8) scale(${1 + (1 - plaster) * 0.2})`} opacity={plaster}>
          <rect x={-52} y={-24} width={104} height={50} rx={10} fill="#E8C49A" stroke="#B8946A" strokeWidth={3} />
          <rect x={-22} y={-24} width={44} height={50} fill="#F6E4C8" />
          <rect x={46} y={-24} width={6} height={50} fill="#FFC27A" opacity={0.7} />
        </g>
      ) : null}
      {inf > 0 ? (
        <g opacity={inf}>
          <circle cx={fx} cy={540} r={330 * pulse} fill="url(#g3red)" opacity={0.8} style={{ mixBlendMode: 'screen' }} />
          {[-1, 0, 1].map((k) => (
            <path key={k} d={`M ${fx + k * 18} 580 L ${fx + k * 26} 430`} stroke={RED} strokeWidth={5} strokeLinecap="round" opacity={0.7} />
          ))}
          <g transform={`translate(1420 330) scale(${(0.9 + 0.1 * pulse) * easeOut(inf)})`}>
            <path d="M 0 -110 L 120 90 L -120 90 Z" fill="#1A0A10" stroke={RED} strokeWidth={14} strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 16px ${RED})` }} />
            <rect x={-9} y={-50} width={18} height={80} rx={9} fill={RED} />
            <circle cx={0} cy={58} r={11} fill={RED} />
          </g>
        </g>
      ) : null}
      <Candle x={300} y={420} t={t + 9} s={1.2} glow={0.4} />
    </g>
  );
};
