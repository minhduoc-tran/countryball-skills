import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Foreground, joints, toWorld, FONT, ShotProps,
  SCH, WallTexture,
} from '../../engine';
import { Pitch, Football, DustPuff, DrinkStall, Glass, NightWindow, WallCamera, Guard, SimCard, BankPhone } from './chd-props-scene';
import { SafetyCard } from './chd-safety-card';

// Chapter D, first half. D1-D3: Mo, the pitch and the drinks stall (he won't let Pip pay). D4-D7: "4 · AN TOÀN" card,
// Pip peeking through the curtains, cameras + a guard at the house, three SIM cards.

const PIP = LOOKS.pipHood;
const MO = LOOKS.mo;
const lerp = (a: number, b: number, k: number) => a + (b - a) * clamp(k);

// ---------- D1: wide, the dusty pitch at dusk; Pip and Mo pass the ball back and forth ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.9;
  const hy = 760;
  const pip = poseAt(t, [
    { f: 0, p: { x: 720, y: hy, scale: sc, yaw: 0.7, facing: 1, look: 0.6, legR: { a: -4, b: 8 }, armL: { a: -20, b: -10 }, armR: { a: 24, b: -8 } } },
    { f: 8, p: { legR: { a: -38, b: 36 }, tilt: -5, armL: { a: 38, b: -12 }, armR: { a: -26, b: -8 } }, ease: easeOut },
    { f: 12, p: { legR: { a: 66, b: -10 }, tilt: 5, armL: { a: -30, b: -10 }, armR: { a: 36, b: -8 } } },
    { f: 22, p: { legR: { a: -4, b: 8 }, tilt: 0, armL: { a: -8, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 60, p: { legR: { a: -4, b: 8 }, armR: { a: 12, b: -8 }, tilt: 0 } },
    { f: 76, p: { legL: { a: 14, b: 0 }, tilt: 3 } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1200, y: hy, scale: sc, yaw: -0.7, facing: -1, look: -0.6, armL: { a: 20, b: -8 }, armR: { a: -16, b: -8 } } },
    { f: 30, p: { legR: { a: 4, b: 0 } } },
    { f: 36, p: { legR: { a: 44, b: -30 }, tilt: -2 }, ease: easeOut },
    { f: 46, p: { legR: { a: 4, b: 0 }, tilt: 0 } },
    { f: 50, p: { legL: { a: -38, b: 36 }, tilt: 5, armR: { a: 30, b: -10 } }, ease: easeOut },
    { f: 54, p: { legL: { a: 66, b: -10 }, tilt: -5, armR: { a: -26, b: -10 } } },
    { f: 66, p: { legL: { a: 4, b: 0 }, tilt: 0 } },
  ]);
  const fly = (a: number, b: number) => clamp((t - a) / (b - a));
  const bx = t < 12 ? 800 : t < 36 ? lerp(800, 1130, fly(12, 36)) : t < 53 ? 1130 : lerp(1130, 820, fly(53, 77));
  const arc = t >= 12 && t < 36 ? Math.sin(fly(12, 36) * Math.PI) * 120 : t >= 53 ? Math.sin(fly(53, 77) * Math.PI) * 120 : 0;
  const ground = hy + 140 * sc - 22;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 650, kf(t, [[0, 1.1], [len, 1.22]]))}>
      <Pitch t={t + 30} id="d1p" />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
      <DustPuff x={800} y={ground + 20} t={t} t0={12} />
      <DustPuff x={1130} y={ground + 20} t={t} t0={36} />
      <Football x={bx} y={ground - arc} rot={bx * 1.6} />
      <ellipse cx={bx} cy={ground + 24} rx={20 - arc / 14} ry={5} fill="#000" opacity={0.3} />
      <Foreground blur={10}>
        <path d="M 60 1120 Q 40 960 120 900 Q 150 1000 230 1000 Q 250 920 330 880 Q 330 1010 380 1120 Z" fill="#2A2018" />
        <path d="M 1560 1120 Q 1580 1000 1650 960 Q 1680 1040 1760 1120 Z" fill="#2A2018" />
      </Foreground>
    </g>
  );
};

// ---------- D2: the drinks stall: Pip holds out his phone to pay, Mo pushes his hand back ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.0;
  const push = clamp((t - 30) / 8);
  const pip = poseAt(t, [
    { f: 0, p: { x: 760, y: 790, scale: sc, yaw: 0.5, facing: 1, look: 0.6, armR: { a: 16, b: -8 }, armL: { a: 10, b: -8 } } },
    { f: 12, p: { armR: { a: 98, b: -6 }, tilt: 3 }, ease: easeOut },
    { f: 30, p: { armR: { a: 98, b: -6 } } },
    { f: 40, p: { armR: { a: 52, b: -22 }, tilt: -5, headTilt: -4 }, ease: easeOut },
    { f: 80, p: { armR: { a: 46, b: -26 }, tilt: -4, headTilt: -3 } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1110, y: 790, scale: sc, yaw: -0.5, facing: -1, look: -0.6, armL: { a: 12, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 24, p: { armL: { a: 14, b: -8 } } },
    { f: 31, p: { armL: { a: 96, b: -4 }, tilt: -3 }, ease: easeOut },
    { f: 44, p: { armL: { a: 92, b: -8 }, tilt: -2 } },
    { f: 80, p: { armL: { a: 90, b: -8 }, tilt: -2 } },
  ]);
  const hand = toWorld(pip, joints(pip).armR.end);
  const jar = t > 40 ? Math.sin((t - 40) * 1.3) * 4 * Math.exp(-(t - 40) / 14) : 0;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 690, kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Pitch t={t + 60} id="d2p" dim={0.22} />
      <DrinkStall t={t} x0={380} x1={1500} top={720} />
      <g transform={`rotate(${jar} 1000 700)`}><Glass x={1000} y={706} s={1.1} fill={0.7} /></g>
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [12, 'smug'], [34, 'worried']]) }} rimId="rimR" shadow={1} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'happy'], [31, 'smug']]) }} rimId="rimR" shadow={1} />
      <BankPhone x={hand.x + 14 - push * 16} y={hand.y - 28} w={62} rot={-10 - push * 14} />
    </g>
  );
};

// ---------- D3: Mo looks away, awkward; a gap between the two friends, the ball lies between them ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { x: 640, y: 770, scale: 1.0, yaw: 0.45, facing: 1, look: 0.7, armL: { a: 8, b: -8 }, armR: { a: 12, b: -10 }, headTilt: 3 } },
    { f: len, p: { headTilt: -2, tilt: -2 } },
  ]);
  const mo = poseAt(t, [
    { f: 0, p: { x: 1250, y: 770, scale: 1.0, yaw: 0.75, facing: 1, look: 0.9, armL: { a: 10, b: -8 }, armR: { a: 14, b: -12 }, headTilt: -4 } },
    { f: 14, p: { headTilt: -7, tilt: 2 } },
    { f: len, p: { headTilt: -5, tilt: 1 } },
  ]);
  const sweat = clamp((t - 6) / 20);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 950]]), 640, kf(t, [[0, 1.45], [len, 1.62]]))}>
      <Pitch t={t + 90} id="d3p" dim={0.3} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'tired']]) }} rimId="rimR" shadow={1} />
      <Hero look={MO} pose={{ ...mo, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={1} />
      <Football x={960} y={886} r={22} rot={20} />
      {/* a sweat drop slides down beside Mo's head */}
      <path d={`M 1300 ${540 + sweat * 22} q -9 16 0 24 q 9 -8 0 -24 Z`} fill="#BFE6FF" opacity={0.85 * (1 - sweat * 0.3)} />
    </g>
  );
};

// ---------- D4: the chapter card ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => <SafetyCard t={t} len={len} id="d4sch" />;

// ---------- D5: Pip peeks through the curtain at the night street; a bike's light sweeps across his face ----------
export const D5: React.FC<ShotProps> = ({ t, len }) => {
  const sway = Math.sin(t / 11) * 5;
  const pose = poseAt(t, [
    { f: 0, p: { x: 930, y: 700, scale: 1.25, yaw: 0.6, facing: 1, look: 0.2, armL: { a: 10, b: -8 }, armR: { a: 14, b: -10 }, headTilt: 4 } },
    { f: 20, p: { look: 0.9, headTilt: 7, tilt: 2 } },
    { f: len, p: { look: 0.6, headTilt: 4 } },
  ]);
  const pass = clamp(((t * 9) % 1500) / 1500);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 520, kf(t, [[0, 1.05], [len, 1.22]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#241E36" />
      <WallTexture rect={[-300, -300, 2520, 1700]} />
      <NightWindow t={t + 20} x0={800} y0={170} x1={1480} y1={800} />
      <Glow x={1140} y={500} r={620} kind="cool" o={0.28} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [24, 'shock']]) }} rimId="rimBlue" shadow={0} />
      {/* the left curtain: hangs over his shoulder, only a gap of window and the right half of his face show */}
      <path d={`M 360 100 L 920 100 Q ${930 + sway} 380 ${918 + sway} 620 Q ${900 + sway} 800 ${800 + sway * 0.6} 960 L 360 980 Z`} fill="#4A3A5E" />
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={i} d={`M ${430 + i * 100} 100 Q ${450 + i * 100 + sway * 0.4} 520 ${410 + i * 100} 980`} stroke="#2E2342" strokeWidth={9} fill="none" opacity={0.8} />
      ))}
      <path d={`M ${918 + sway} 140 Q ${928 + sway} 420 ${914 + sway} 640`} stroke="#8C74A8" strokeWidth={6} fill="none" opacity={0.7} />
      <rect x={340} y={86} width={1260} height={16} rx={8} fill="#6A5A48" />
      <path d={`M 1440 100 L 1620 100 L 1620 980 L 1480 980 Q 1468 600 1440 100 Z`} fill="#3E3252" />
      <Glow x={1000 + pass * 300} y={540} r={240} kind="cool" o={0.18} />
      <Foreground blur={10}>
        <path d="M 1560 1100 Q 1500 840 1620 740 L 1760 740 L 1760 1100 Z" fill="#0C0A14" />
      </Foreground>
    </g>
  );
};

// ---------- D6: the house front: cameras pop onto the walls one by one, then a big guard steps in by the door ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => {
  const guardX = kf(t, [[34, -260], [50, 380]], easeOut);
  const pip = poseAt(t, [
    { f: 0, p: { x: 1330, y: 896, scale: 0.7, yaw: -0.2, facing: -1, look: 0.0, armL: { a: 10, b: -8 }, armR: { a: 12, b: -8 } } },
    { f: 10, p: { look: -0.6, headTilt: -3 } },
    { f: 44, p: { look: -0.9, yaw: -0.5 } },
  ]);
  const lamp = 0.85 + 0.15 * Math.sin(t / 9);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#2B2540" />
      <WallTexture rect={[-300, -300, 2520, 1700]} />
      <rect x={-300} y={1000} width={2520} height={300} fill="#1A1626" />
      <rect x={-300} y={992} width={2520} height={12} fill="#3C3450" />
      {/* the door and its lamp */}
      <rect x={760} y={330} width={380} height={670} rx={10} fill="#5A3A30" stroke="#2A1A18" strokeWidth={8} />
      <rect x={800} y={370} width={130} height={260} rx={8} fill="#6E4A3C" /><rect x={970} y={370} width={130} height={260} rx={8} fill="#6E4A3C" />
      <circle cx={1090} cy={690} r={12} fill="#E3B84A" />
      <circle cx={950} cy={250} r={18} fill="#FFE4A8" opacity={lamp} />
      <Glow x={950} y={250} r={380} o={0.65 * lamp} />
      {[[240, 380], [1620, 380]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 90} y={y - 70} width={180} height={300} rx={8} fill="#1E1A30" stroke="#3C3450" strokeWidth={6} />
          <path d={`M ${x - 90} ${y + 20} H ${x + 90} M ${x - 90} ${y + 100} H ${x + 90} M ${x} ${y - 70} V ${y + 230}`} stroke="#3C3450" strokeWidth={5} />
        </g>
      ))}
      <WallCamera x={420} y={250} t={t} t0={3} s={1.1} ang={24} />
      <WallCamera x={1500} y={270} t={t} t0={10} s={1.1} flip ang={24} />
      <WallCamera x={680} y={620} t={t} t0={17} s={0.85} ang={10} />
      <WallCamera x={1230} y={620} t={t} t0={24} s={0.85} flip ang={10} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimL" shadow={1} />
      {t >= 34 ? <Guard x={guardX} y={1030} s={0.82} t={t} /> : null}
      <rect x={-300} y={-300} width={2520} height={1700} fill="#0A0818" opacity={0.18} />
    </g>
  );
};

// ---------- D7: a phone lying on the desk; three SIM cards slide out of its tray one after another ----------
const NUMS = ['SỐ MỚI 1', 'SỐ MỚI 2', 'SỐ MỚI 3'];
const FAN = [[1150, 330], [1560, 560], [1150, 790]];
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const shake = Math.sin(t * 2.2) * 1.2;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
      <rect x={-300} y={-300} width={2520} height={1700} fill="#211C30" />
      <rect x={-300} y={-300} width={2520} height={1700} fill="#2E2640" opacity={0.5} />
      <Glow x={300} y={200} r={700} o={0.5} />
      {/* the phone, lying sideways, tray on its right edge */}
      <g transform={`translate(${620 + shake} 560) rotate(-4)`}>
        <rect x={-300} y={-170} width={630} height={350} rx={52} fill="#000" opacity={0.35} transform="translate(14 20)" />
        <rect x={-310} y={-180} width={630} height={350} rx={52} fill="#16151C" stroke="#4A4660" strokeWidth={6} />
        <rect x={-286} y={-156} width={582} height={302} rx={36} fill="#0B0A10" />
        <rect x={-250} y={-120} width={200} height={20} rx={8} fill="#2FBF71" opacity={0.7} />
        <rect x={-250} y={-80} width={300} height={14} rx={7} fill="#5A5870" /><rect x={-250} y={-50} width={240} height={14} rx={7} fill="#5A5870" />
        <rect x={316} y={-14} width={14} height={34} fill="#05050A" />
      </g>
      {NUMS.map((n, i) => {
        const t0 = 8 + i * 17;
        const k = easeOut(clamp((t - t0) / 14));
        if (t < t0) return null;
        // out of the slot (960, 560), then fanned to its own spot so the cards never cross
        const [fx, fy] = FAN[i];
        const x = 960 + k * (fx - 960);
        const y = 560 + k * (fy - 560) + Math.sin(t / 12 + i) * 4;
        return (
          <g key={i}>
            <SimCard x={x} y={y} s={1.15} rot={-8 + i * 7 + (1 - k) * 12} label={n} />
            {k > 0.6 ? <text x={x - 110} y={y - 60} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill={SCH.live}>{i + 1}</text> : null}
          </g>
        );
      })}
      <g transform={`translate(1660 870) scale(${easeOut(clamp((t - 50) / 6))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={96} fill="#F6EFE3" letterSpacing={2}>×3</text>
      </g>
    </g>
  );
};
