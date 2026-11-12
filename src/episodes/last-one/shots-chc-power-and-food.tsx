import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, easeIn, rnd, camT, LOOKS, LEG_LEN, HEAD, reachAngle,
  Street, streetStand, Schematic, SCH, SchLabel, PlantIcon, Glow, LightVeil, KITCHEN, stand, ShotProps, FONT,
} from '../../engine';
import { PersonIcon } from './insert-arm-and-icons';
import { CostCard, Dim, DarkKitchen, Fly, StinkLines, mixHex } from './shots-chc-shared-props-and-cards';

// Chapter C, beats "power" and "food" (C1-C9): the first two costs. Power: the plants need people, the people go,
// the plants trip, the city goes dark. Food: a dark fridge, a four-hour clock, the food turning.

const PIP = LOOKS.pipHood;
const RED = '#FF5A4A';

// ---------- C1: "1 · ĐIỆN" ----------
export const C1: React.FC<ShotProps> = ({ t, len }) => <CostCard t={t} len={len} n={1} word="ĐIỆN" icon="bolt" id="sc1" />;

// ---------- C2: schematic: four plants, a person beside each; the people blink out, the plants trip one by one ----------
const PLANTS = [
  { kind: 'tower' as const, x: 420, off: 104 },
  { kind: 'wind' as const, x: 760, off: 113 },
  { kind: 'dam' as const, x: 1100, off: 122 },
  { kind: 'solar' as const, x: 1440, off: 131 },
];
export const C2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
    <Schematic t={t} id="sc2" />
    <SchLabel x={960} y={190} t={t - 2} text="NHÀ MÁY ĐIỆN" size={54} />
    <path d="M 330 720 L 1530 720" stroke={t < PLANTS[3].off ? SCH.live : SCH.dim} strokeWidth={6} strokeDasharray={t < PLANTS[3].off ? '0' : '16 14'} />
    {PLANTS.map((p, i) => {
      const flick = t > p.off - 8 && t < p.off ? Math.floor(t / 2) % 2 : 1; // a stutter before it trips
      const on = t < p.off - 8 ? 1 : t < p.off ? flick : 0;
      const opOff = 76 + i * 5; // each operator blinks out right after "Không còn ai"
      const k = t - opOff;
      const opFlick = k > 0 && k < 6 ? (Math.floor(k / 1.5) % 2 ? 1 : 0.2) : k >= 6 ? 0 : 1;
      return (
        <g key={i}>
          <path d={`M ${p.x} 640 L ${p.x} 720`} stroke={on ? SCH.live : SCH.dim} strokeWidth={5} />
          <PlantIcon x={p.x} y={520} kind={p.kind} on={on} t={t} s={1.9} />
          {opFlick > 0 ? <PersonIcon x={p.x + 130} y={590 + Math.sin(t / 6 + i) * 3} s={1.6} on o={opFlick} glow /> : null}
        </g>
      );
    })}
    {t < 100 ? (
      <SchLabel x={960} y={880} t={t - 22} text="CẦN NGƯỜI VẬN HÀNH" size={48} color={SCH.dim} />
    ) : (
      <SchLabel x={960} y={880} t={t - 104} text="TỰ NGẮT" size={84} color={RED} />
    )}
  </g>
);

// ---------- C3: schematic: a clock racing, a line from "VÀI GIỜ" to "VÀI NGÀY" ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  const spin = 1080 * easeIn(clamp(t / len)) * 0.55 + t * 4;
  const m = easeOut(clamp((t - 52) / 28));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.04], [len, 1]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sc3" />
      <g transform="translate(560 540)">
        <circle r={240} fill="#14223A" stroke={SCH.line} strokeWidth={8} />
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d="M 0 -218 L 0 -192" stroke={SCH.dim} strokeWidth={i % 3 === 0 ? 9 : 5} strokeLinecap="round" transform={`rotate(${i * 30})`} />
        ))}
        <path d="M 0 0 L 0 -150" stroke={SCH.line} strokeWidth={10} strokeLinecap="round" transform={`rotate(${spin / 12})`} />
        <path d="M 0 0 L 0 -205" stroke={SCH.live} strokeWidth={7} strokeLinecap="round" transform={`rotate(${spin})`} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} />
        <circle r={14} fill={SCH.live} />
      </g>
      <SchLabel x={1010} y={500} t={t - 46} text="VÀI GIỜ" size={62} anchor="start" />
      <SchLabel x={1700} y={500} t={t - 66} text="VÀI NGÀY" size={62} anchor="end" />
      <path d="M 1020 600 L 1700 600" stroke={SCH.dim} strokeWidth={6} strokeLinecap="round" />
      <path d="M 1020 600 L 1700 600" stroke={SCH.live} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - m} />
      <circle cx={1020 + 680 * m} cy={600} r={20} fill={SCH.live} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      <path d="M 1660 560 L 1700 600 L 1660 640" stroke={SCH.live} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={m > 0.9 ? 1 : 0} />
      <SchLabel x={1360} y={730} t={t - 20} text="THEO CHUYÊN GIA" size={34} color={SCH.dim} />
    </g>
  );
};

// ---------- C4: wide: the street at nightfall; the lamps, windows and signs go out in a ragged sweep; Pip stands in the road ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const at = streetStand(2.6, 6.4);
  const pose = poseAt(t, [
    { f: 0, p: { ...at, yaw: -0.3, look: -0.4, armL: { a: 14, b: 8 }, armR: { a: 14, b: 8 } } },
    { f: 24, p: { look: 0.3, headTilt: 3 } },
    { f: 50, p: { look: -0.2, headTilt: -2, armL: { a: 24, b: 40 } } },
  ]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.14]]))}>
      <Street t={t + 330} id="st4" night blackout={clamp((t - 2) / 36)} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [26, 'worried']]) }} rimId="rimBlue" shadow={0.5} />
    </g>
  );
};

// ---------- C5: "2 · THỨC ĂN" ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => <CostCard t={t} len={len} n={2} word="THỨC ĂN" icon="fridge" id="sc5" />;

// ---------- C6: medium: the dark kitchen; Pip pulls open the fridge and no light comes on ----------
const K_STAND = stand(KITCHEN, 0.62, 0.4);
const HANDLE = { x: 1290, y: 585 };
const FR = { x0: 1270, x1: 1477, y0: 379, y1: 785 }; // the fridge's front, from the kitchen set
const OpenFridge: React.FC<{ p: number }> = ({ p }) => {
  if (p <= 0) return null;
  const xf = 1270 + (1560 - 1270) * p; // the door's free edge swings from the handle side out past the hinge
  const out = Math.max(0, xf - FR.x1);
  const dy = out * 0.38;
  const lit = xf < FR.x1;
  return (
    <g>
      <rect x={FR.x0} y={FR.y0} width={FR.x1 - FR.x0} height={FR.y1 - FR.y0} fill="#07090E" />
      {[0.3, 0.52, 0.74].map((k, i) => (
        <rect key={i} x={FR.x0 + 6} y={FR.y0 + (FR.y1 - FR.y0) * k} width={FR.x1 - FR.x0 - 12} height={6} fill="#141B28" />
      ))}
      <rect x={FR.x0 + 30} y={FR.y0 + 168} width={26} height={44} rx={5} fill="#0E131C" />
      <rect x={FR.x0 + 110} y={FR.y0 + 150} width={36} height={62} rx={5} fill="#0E131C" />
      <rect x={FR.x0 + 60} y={FR.y0 + 262} width={70} height={30} rx={8} fill="#0E131C" />
      <polygon
        points={`${FR.x1},${FR.y0} ${xf},${FR.y0 - dy} ${xf},${FR.y1 + dy} ${FR.x1},${FR.y1}`}
        fill={lit ? '#8E9497' : '#6C7276'}
        stroke="#4A5054"
        strokeWidth={3}
      />
      <polygon points={`${FR.x1},${FR.y0} ${xf},${FR.y0 - dy} ${xf},${FR.y0 - dy + 8} ${FR.x1},${FR.y0 + 8}`} fill="#C9B48A" opacity={0.5} />
    </g>
  );
};
export const C6: React.FC<ShotProps> = ({ t, len }) => {
  const base: Pose = { ...basePose, x: K_STAND.x, y: K_STAND.y, scale: K_STAND.scale, yaw: 0.5 };
  const reach = reachAngle(base, HANDLE);
  const pose = poseAt(t, [
    { f: 0, p: { x: K_STAND.x - 30, y: K_STAND.y, scale: K_STAND.scale, yaw: 0.5, look: 0.4, armL: { a: 12, b: -6 }, armR: { a: 14, b: -6 } } },
    { f: 8, p: { x: K_STAND.x }, ease: easeOut },
    { f: 15, p: { armR: { a: reach, b: 0 }, handR: 'point' }, ease: easeOut },
    { f: 24, p: { armR: { a: reach - 8, b: 30 }, x: K_STAND.x - 20, headTilt: 4 }, ease: easeOut },
    { f: 40, p: { look: 0.9, headTilt: 2 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1240], [len, 1260]]), 575, kf(t, [[0, 1.85], [len, 2.0]]))}>
      <DarkKitchen t={t + 90} id="k6" dim={0.58} />
      <OpenFridge p={easeOut(clamp((t - 19) / 14))} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [24, 'worried']]) }} rimId="rimL" shadow={0} />
    </g>
  );
};

// ---------- C7: schematic: the fridge on a four-hour ring that runs down to nothing ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp((t - 4) / (len - 8));
  const R = 250;
  const circ = 2 * Math.PI * R;
  const col = p > 0.7 ? RED : SCH.live;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="sc7" />
      <g transform="translate(640 540)">
        <circle r={R} fill="none" stroke="#1C2C44" strokeWidth={26} />
        <circle r={R} fill="none" stroke={col} strokeWidth={26} strokeLinecap="round" strokeDasharray={`${circ * (1 - p)} ${circ}`} transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow}88)` }} />
        <g transform="scale(2.3)" stroke={SCH.line} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x={-30} y={-52} width={60} height={104} rx={7} />
          <path d="M -30 -8 L 30 -8 M -18 -34 L -18 -20 M -18 4 L -18 22" />
        </g>
      </g>
      <SchLabel x={1390} y={500} t={t - 4} text="4 TIẾNG" size={150} color={col} />
      <SchLabel x={1390} y={600} t={t - 12} text="AN TOÀN" size={50} color={SCH.dim} />
      <text x={1390} y={720} textAnchor="middle" fontFamily={FONT.ui} fontSize={70} fill={SCH.line}>
        {`0${Math.max(0, Math.ceil(4 * (1 - p)))}:00`}
      </text>
    </g>
  );
};

// ---------- C8: insert: meat, milk, greens on the fridge shelf, going off; stink lines, a fly ----------
const FOOD = [{ x: 680, at: 23 }, { x: 960, at: 40 }, { x: 1240, at: 60 }];
const rotOf = (t: number, at: number) => clamp((t - at - 8) / 44);
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const pop = (at: number) => {
    const k = clamp((t - at + 4) / 6);
    return k <= 0 ? 0 : 1 + 0.25 * Math.sin(k * Math.PI) * (1 - k * 0.2) - 0.25 * (1 - k);
  };
  const sick = '#8FA24A';
  return (
    <g transform={`translate(960 700) scale(${kf(t, [[0, 1.35], [len, 1.5]])}) translate(-960 -700)`}>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0E16" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={-400} y={80 + i * 230} width={2720} height={10} fill="#16202E" />
      ))}
      <rect x={-400} y={760} width={2720} height={20} fill="#2A3A52" />
      <rect x={-400} y={760} width={2720} height={4} fill="#9FC0FF" opacity={0.35} />
      <rect x={-400} y={780} width={2720} height={600} fill="#060810" />
      {/* meat on a plate */}
      <g transform={`translate(${FOOD[0].x} 760) scale(${pop(FOOD[0].at)}) translate(${-FOOD[0].x} -760)`}>
        <ellipse cx={FOOD[0].x} cy={752} rx={210} ry={40} fill="#C9C2B4" />
        <ellipse cx={FOOD[0].x} cy={738} rx={186} ry={28} fill="#B3AC9E" />
        <path d={`M ${FOOD[0].x - 130} 730 Q ${FOOD[0].x - 150} 640 ${FOOD[0].x - 40} 622 Q ${FOOD[0].x + 90} 600 ${FOOD[0].x + 140} 670 Q ${FOOD[0].x + 160} 735 ${FOOD[0].x + 20} 744 Q ${FOOD[0].x - 90} 750 ${FOOD[0].x - 130} 730 Z`} fill={mixHex('#B5483F', '#6C7F42', rotOf(t, FOOD[0].at))} />
        <path d={`M ${FOOD[0].x - 110} 700 Q ${FOOD[0].x - 40} 640 ${FOOD[0].x + 130} 690`} stroke={mixHex('#EAC9B0', '#B8C27A', rotOf(t, FOOD[0].at))} strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d={`M ${FOOD[0].x - 60} 690 q 30 -20 60 0 M ${FOOD[0].x + 20} 718 q 30 -14 60 4`} stroke="#00000033" strokeWidth={6} fill="none" />
        <circle cx={FOOD[0].x - 40} cy={680} r={16 * rotOf(t, FOOD[0].at)} fill={sick} />
        <circle cx={FOOD[0].x + 70} cy={710} r={22 * rotOf(t, FOOD[0].at)} fill={sick} />
      </g>
      {/* milk carton */}
      <g transform={`translate(${FOOD[1].x} 760) scale(${pop(FOOD[1].at)}) translate(${-FOOD[1].x} -760)`}>
        <rect x={FOOD[1].x - 78} y={540} width={156} height={220} fill={mixHex('#E9EDF3', '#B9C46A', rotOf(t, FOOD[1].at))} />
        <rect x={FOOD[1].x - 78} y={540} width={50} height={220} fill="#000" opacity={0.22} />
        <path d={`M ${FOOD[1].x - 78} 540 L ${FOOD[1].x - 40} 476 L ${FOOD[1].x + 40} 476 L ${FOOD[1].x + 78} 540 Z`} fill={mixHex('#D0D6E0', '#A0AA58', rotOf(t, FOOD[1].at))} />
        <rect x={FOOD[1].x - 30} y={460} width={60} height={18} fill="#B8453A" />
        <path d={`M ${FOOD[1].x - 50} 620 Q ${FOOD[1].x} 580 ${FOOD[1].x + 50} 620 L ${FOOD[1].x + 50} 690 L ${FOOD[1].x - 50} 690 Z`} fill="#4A7AA8" />
        <rect x={FOOD[1].x + 72} y={540} width={5} height={220} fill="#FFC27A" opacity={0.6} />
        <circle cx={FOOD[1].x - 20} cy={740} r={20 * rotOf(t, FOOD[1].at)} fill={sick} />
      </g>
      {/* lettuce */}
      <g transform={`translate(${FOOD[2].x} 760) scale(${pop(FOOD[2].at)}) translate(${-FOOD[2].x} -760)`}>
        {[[-80, 0], [70, 6], [0, -30], [-30, 20], [40, 24]].map(([dx, dy], i) => (
          <ellipse key={i} cx={FOOD[2].x + dx} cy={690 + dy} rx={96 - i * 5} ry={78 - i * 4} fill={mixHex(['#5E9A42', '#6FAE4C', '#7DBA58', '#5A8E3E', '#6AA648'][i], '#6B5A32', rotOf(t, FOOD[2].at))} />
        ))}
        <path d={`M ${FOOD[2].x} 750 L ${FOOD[2].x - 10} 640 M ${FOOD[2].x + 30} 748 L ${FOOD[2].x + 50} 650`} stroke="#00000033" strokeWidth={5} />
        <ellipse cx={FOOD[2].x} cy={752} rx={120} ry={14} fill="#000" opacity={0.35} />
        <circle cx={FOOD[2].x + 40} cy={690} r={24 * rotOf(t, FOOD[2].at)} fill="#8A7A3A" />
      </g>
      {FOOD.map((f, i) => {
        const r = rotOf(t, f.at);
        return r > 0.15 ? <StinkLines key={i} x={f.x} y={430} t={t + i * 11} o={r} /> : null;
      })}
      <LightVeil id="c8veil" lights={[[1000, 600, 760]]} o={0.55} />
      <Glow x={1000} y={560} r={700} kind="cool" o={0.22} />
      {t > 46 ? <Fly cx={1000} cy={520} t={t} r={260} s={1.4} /> : null}
    </g>
  );
};

// ---------- C9: extreme close-up: Pip recoils from the smell; a fly; the truth sinks in ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.6 * (1 + 0.04 * clamp(t / len));
  const head = { x: 900, y: 600 };
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.35, look: -0.2, headTilt: 0 } },
    { f: 8, p: { headTilt: -9, yaw: 0.15, look: -0.9 }, ease: easeOut },
    { f: 34, p: { headTilt: -5 } },
    { f: 44, p: { headTilt: 1, look: 0.2, yaw: 0.3 } },
  ]);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-480 -420) scale(1.8)">
          <DarkKitchen t={t + 200} id="k9" dim={0.6} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#050818" opacity={0.25} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [34, 'tired']]) }} rimId="rimL" shadow={0} />
      <g transform="translate(1180 760)">
        <StinkLines x={0} y={0} t={t} w={260} o={0.9} s={1.6} />
      </g>
      <Fly cx={1380} cy={430} t={t + 14} r={230} s={2.2} />
    </g>
  );
};
