import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, HEAD, LEG_LEN, rnd, walkPose,
  Schematic, SCH, SchLabel, DrawOn, FONT, Study, Bedroom, BedDuvet, BEDROOM, bedSit, Stairwell, Banister, hipGround,
  Kitchen, KITCHEN, KitchenIsland, stand, Glow, Dust, Foreground, ShotProps,
} from '../../engine';
import { PersonIcon, CigaretteIcon } from './insert-arm-and-icons';
import { Candle } from './chd-local-props';

// Chapter D, the fact and the hallucination. D16: loneliness = up to 15 cigarettes a day (retimed from the short
// cut's LonelinessCigarettes to this line). D17: "Đó là sự thật." D18-D19: schematics (people linked in a web; one
// icon alone in a box, the picture bending, a ghost flickering). D20-D22: a night, mum's voice from the kitchen,
// the run down the stairs, the empty kitchen.

const PIP = LOOKS.pipHood;

// ---------- D16: schematic: one lonely figure = 15 cigarettes, each cued on the voice; MỖI NGÀY ----------
const CIGS = Array.from({ length: 15 }).map((_, i) => ({ x: 1060 + (i % 5) * 170, y: 330 + Math.floor(i / 5) * 140, at: 77 + Math.round(i * 2.2) }));
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const lit = CIGS.filter((c) => t >= c.at).length;
  const pop = easeOut(clamp(t / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t + 90} id="sch16" />
      <SchLabel x={960} y={170} t={t - 2} text="CÁC NHÀ KHOA HỌC NÓI" size={34} color={SCH.dim} />
      <PersonIcon x={420} y={480} s={4.2 * (0.7 + 0.3 * pop)} on glow />
      <SchLabel x={420} y={720} t={t - 41} text="CÔ ĐƠN KÉO DÀI" size={44} />
      <SchLabel x={790} y={520} t={t - 61} text="=" size={150} color={SCH.live} />
      {CIGS.map((c, i) => {
        const k = t - c.at;
        if (k < 0) return null;
        const s = k < 6 ? 0.6 + 0.5 * easeOut(k / 6) - 0.1 * clamp((k - 3) / 3) : 1;
        return <CigaretteIcon key={i} x={c.x} y={c.y} s={s} t={t + i * 7} />;
      })}
      <text x={1400} y={790} textAnchor="middle" fontFamily={FONT.ui} fontSize={96} fill={SCH.live} style={{ filter: `drop-shadow(0 0 14px ${SCH.glow}66)` }}>
        {`${lit} ĐIẾU`}
      </text>
      <SchLabel x={1400} y={870} t={t - 110} text="MỖI NGÀY" size={56} />
      <SchLabel x={960} y={1030} t={t - 112} text="NGUỒN: HOLT-LUNSTAD 2010 · TỔNG Y SĨ HOA KỲ 2023" size={22} color={SCH.dim} />
    </g>
  );
};

// ---------- D17: extreme close-up, "Đó là sự thật.": Pip, worried, a candle at the edge of the frame ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 5.2 * (1 + 0.05 * clamp(t / len));
  const head = { x: 1010, y: 620 };
  const pose: Pose = { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: -0.2, look: -0.5, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, -2], [len, 3]]), ...faceAt(t, [[0, 'worried']]) };
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-700 -460) scale(2.1)">
          <Study t={t + 250} id="d17" night veil={0.5} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.3} />
      <Glow x={120} y={700} r={800} o={0.5} />
      <Hero look={PIP} pose={pose} rimId="rimL" shadow={0} />
      <Foreground blur={10}>
        <Candle x={110} y={1100} t={t + 3} s={3.4} h={70} seed={9} />
      </Foreground>
    </g>
  );
};

// ---------- D18: schematic: people linked by lines, a web of us; every link lights up ----------
const NODES = [
  [420, 360], [700, 300], [980, 380], [1260, 300], [1540, 360],
  [330, 620], [610, 560], [880, 650], [1160, 560], [1440, 640], [1620, 560],
  [470, 850], [760, 800], [1050, 860], [1340, 800], [1590, 850],
].map(([x, y], i) => ({ x: x + (rnd(3, i) - 0.5) * 40, y: y + (rnd(4, i) - 0.5) * 40 }));
const LINKS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 8], [4, 10], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [5, 11], [6, 12], [7, 13], [8, 14], [9, 15], [11, 12], [12, 13], [13, 14], [14, 15], [1, 5], [2, 6], [3, 7], [8, 4], [7, 12], [8, 13], [9, 14],
];
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.02], [len, 1.08]])}) translate(-960 -540)`}>
      <Schematic t={t + 20} id="sch18" />
      {LINKS.map(([a, b], i) => {
        const at = 6 + i * 1.6;
        const p = clamp((t - at) / 8);
        const A = NODES[a];
        const B = NODES[b];
        const pulse = clamp((t - 44 - i * 0.7) / 10);
        return (
          <g key={i}>
            <path d={`M ${A.x} ${A.y} L ${B.x} ${B.y}`} stroke={pulse > 0 ? SCH.live : SCH.dim} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={0.85} />
            {pulse > 0 && pulse < 1 ? <circle cx={A.x + (B.x - A.x) * pulse} cy={A.y + (B.y - A.y) * pulse} r={7} fill={SCH.glow} /> : null}
          </g>
        );
      })}
      {NODES.map((n, i) => {
        const k = clamp((t - i * 1.1) / 6);
        const on = t > 40 + i;
        return <PersonIcon key={i} x={n.x} y={n.y} s={(0.8 + 0.2 * easeOut(k)) * (1 + 0.05 * Math.sin(t / 7 + i))} o={k} on={on} glow={on} />;
      })}
      <SchLabel x={960} y={1010} t={t - 38} text="SỐNG CÙNG NHAU" size={52} />
    </g>
  );
};

// ---------- D19: schematic: one icon alone in a box; the lines round it bend; a ghost icon flickers beside it ----------
const BOX = { x0: 690, x1: 1230, y0: 250, y1: 790 };
export const D19: React.FC<ShotProps> = ({ t, len }) => {
  const amp = 3 + 22 * clamp((t - 18) / 40);
  const ghostOn = t > 30 && rnd(5, Math.floor(t / 2)) > 0.42;
  const waves = Array.from({ length: 9 }).map((_, i) => {
    const y = BOX.y0 + 40 + i * 58;
    let d = '';
    for (let x = BOX.x0 - 330; x <= BOX.x1 + 330; x += 22) {
      const inside = x > BOX.x0 && x < BOX.x1;
      const a = amp * (inside ? 1 : 0.35);
      d += `${d ? ' L' : 'M'} ${x} ${y + Math.sin(x / 38 + t / 4 + i) * a}`;
    }
    return d;
  });
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.07]])}) translate(-960 -540)`}>
      <Schematic t={t + 50} id="sch19" />
      <SchLabel x={960} y={160} t={t - 2} text="BIỆT GIAM LÂU NGÀY" size={46} />
      {waves.map((d, i) => (
        <path key={i} d={d} stroke={SCH.dim} strokeWidth={3} fill="none" opacity={0.5 * clamp((t - 12) / 14)} />
      ))}
      <rect x={BOX.x0} y={BOX.y0} width={BOX.x1 - BOX.x0} height={BOX.y1 - BOX.y0} fill="#101A2A" opacity={0.55} />
      <DrawOn d={`M ${BOX.x0} ${BOX.y0} L ${BOX.x1} ${BOX.y0} L ${BOX.x1} ${BOX.y1} L ${BOX.x0} ${BOX.y1} Z`} t={t} dur={14} width={7} />
      <PersonIcon x={870} y={560} s={4.4} on glow />
      <g opacity={ghostOn ? 0.55 : 0.08}>
        <PersonIcon x={1090} y={540} s={4.4} />
      </g>
      <SchLabel x={960} y={900} t={t - 62} text="ẢO GIÁC" size={72} color={SCH.live} />
    </g>
  );
};

// ---------- D20: night, a candle by the bed: Pip dozing against the pillows bolts upright at mum's voice ----------
const BED_S = bedSit(0.2);
const DOOR = BEDROOM.P(0, 0.6, 0.64);
export const D20: React.FC<ShotProps> = ({ t, len }) => {
  const wake = 34;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: BED_S.x, y: BED_S.y, scale: BED_S.scale, yaw: 0.2, look: 0, tilt: -6, headTilt: 16, armL: { a: 16, b: 20 }, armR: { a: 20, b: 20 }, legL: { a: 80, b: 4 }, legR: { a: 80, b: 4 } } },
    { f: wake - 3, p: { tilt: -9, headTilt: 20 } },
    { f: wake + 3, p: { tilt: 5, headTilt: -3, armL: { a: 60, b: 30 }, armR: { a: 70, b: 30 }, yaw: -0.5, look: -0.9 }, ease: easeOut },
    { f: wake + 12, p: { tilt: 2, armL: { a: 30, b: 30 }, armR: { a: 40, b: 30 } } },
  ]);
  const awake = t >= wake;
  const light = 0.35 + 0.35 * clamp((t - 24) / 10);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 650]]), 600, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Bedroom t={t + 200} id="bd20" lamp={0} duvet={false} crossed={20} clock="--:--" />
      <Hero look={PIP} pose={{ ...pose, expr: awake ? 'shock' : 'tired', blink: awake ? 0 : 1 }} rimId="rimL" shadow={0} />
      <BedDuvet knees={1} />
      {!awake ? (
        <g fontFamily={FONT.title} fontWeight={800} fill="#C9CCE0">
          {[0, 1].map((i) => (
            <text key={i} x={BED_S.x + 60 + i * 26} y={BED_S.y - 330 - ((t + i * 18) % 36) * 1.2} fontSize={34 - i * 8} opacity={1 - ((t + i * 18) % 36) / 36}>z</text>
          ))}
        </g>
      ) : null}
      <Glow x={DOOR.x + 40} y={DOOR.y + 120} r={300} o={light} />
      <Dust t={t} seed={41} x0={DOOR.x} y0={DOOR.y} w={260} h={300} n={12} o={0.5} />
    </g>
  );
};

// ---------- D21: the stairwell at night: he runs down the stairs toward the kitchen ----------
const SW_SC = 0.9;
export const D21: React.FC<ShotProps> = ({ t }) => {
  const x = kf(t, [[0, 430], [31, 1250]], (u) => u);
  const ph = t * 0.95;
  const pump = Math.sin(ph);
  const pose: Pose = { ...walkPose(x, ph, hipGround, SW_SC, { tilt: 14, expr: 'worried', look: 0.8, armL: { a: 55 * pump, b: 70 }, armR: { a: -55 * pump, b: 70 } }, 1), blink: 0 };
  return (
    <g transform={camT(clamp(pose.x + 80, 760, 1200), clamp(pose.y - 60, 420, 640), 1.12)}>
      <Stairwell t={t + 280} id="sw21" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#3A4488" opacity={0.62} style={{ mixBlendMode: 'multiply' }} />
      <Glow x={1500} y={760} r={460} kind="cool" o={0.4} />
      <Glow x={430} y={300} r={380} o={0.35} />
      <Hero look={PIP} pose={pose} shadow={0.5} rimId="rimBlue" />
      <Banister />
    </g>
  );
};

// ---------- D22: the kitchen at night: empty, a pushed-back chair, moonlight on the floor; Pip small in the doorway ----------
const K_STAND = stand(KITCHEN, 0.07, 0.62, 0.5);
const Chair: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={10} cy={4} rx={70} ry={11} fill="#000" opacity={0.45} />
    <path d="M -40 0 L -34 -96 L -22 -96 L -26 0 Z M 28 0 L 24 -96 L 36 -96 L 38 0 Z" fill="#5A4648" />
    <rect x={-48} y={-112} width={96} height={20} rx={5} fill="#7A6262" />
    <path d="M -40 -112 L -36 -250 L 34 -250 L 40 -112 Z" fill="#6A5456" />
    <rect x={-36} y={-250} width={70} height={10} rx={4} fill="#58403C" />
    <path d="M -48 -112 L 48 -112" stroke="#9FB4FF" strokeWidth={3} opacity={0.5} />
  </g>
);
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const px0 = 340;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: px0, y: K_STAND.y, scale: K_STAND.scale, yaw: 0.6, look: 0.9, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 22, p: { armR: { a: 22, b: 16 }, headTilt: 2, look: 0.7 } },
    { f: 44, p: { armR: { a: 14, b: 10 }, headTilt: 5, look: 0.2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 600, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Kitchen t={t + 200} id="k22" veil={0.62} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#3A4488" opacity={0.6} style={{ mixBlendMode: 'multiply' }} />
      {/* moonlight from the window: a cool bloom, a long pool on the floor with the window bars in it */}
      <Glow x={860} y={540} r={560} kind="cool" o={0.6} />
      <path d="M 640 700 L 1040 700 L 1320 1060 L 460 1060 Z" fill="#B4C6FF" opacity={0.3} style={{ mixBlendMode: 'screen' }} />
      <path d="M 840 700 L 850 700 L 920 1060 L 880 1060 Z M 700 700 L 710 700 L 640 1060 L 600 1060 Z" fill="#0A1030" opacity={0.28} />
      <Dust t={t} seed={51} x0={640} y0={600} w={600} h={420} n={20} o={0.5} />
      {/* the empty chair, pushed back from the island, in the pool of light */}
      {/* the stair light behind him: Pip is backlit in the doorway, a dark silhouette with a hot rim */}
      <Glow x={px0 - 20} y={760} r={620} o={0.75} />
      <path d={`M ${px0 - 90} 1000 L ${px0 + 130} 1000 L 760 1080 L 420 1080 Z`} fill="#FFC27A" opacity={0.22} style={{ mixBlendMode: 'screen' }} />
      <g style={{ filter: 'brightness(0.35)' }}>
        <Hero look={PIP} pose={{ ...pose, expr: 'worried', blink: 0 }} rimId="rimR" shadow={0} />
      </g>
      <KitchenIsland />
      <Chair x={960} y={1075} s={1.1} />
      <Foreground blur={6}>
        <rect x={-300} y={-100} width={430} height={1300} fill="#0A0812" />
        <rect x={490} y={-100} width={90} height={1300} fill="#0A0812" />
        <rect x={-300} y={-100} width={880} height={110} fill="#0A0812" />
      </Foreground>
    </g>
  );
};
