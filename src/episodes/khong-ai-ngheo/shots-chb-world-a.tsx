import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Schematic, SCH, Glow, Dust, Sparkle, Bokeh, Foreground, ShotProps,
} from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { WorldMap } from '../tien-vo-han/chb-hunger-map-props';
import { VILLAGE_GIRL } from './cast-looks';
import { HutRoom, HangingBulb } from './chb-village-scenes';
import { BulbLine } from './chb-props-world';
import { NumCard } from './chb-cards-and-marks';

// Chapter B, "Khắp thế giới, những thứ nhỏ bé bắt đầu thay đổi" (1/2): little lights come on over the world map, a bulb
// lights a hut that never had electricity, kids do homework under it, then the card "685 TRIỆU" people without power.

/** Where the small lights come on, in map units (1000 x 520), with the frame each one starts. */
const SPOTS: [number, number, number][] = [
  [170, 150, 4], [290, 380, 12], [535, 125, 8], [545, 300, 20], [720, 140, 16], [830, 190, 30], [880, 400, 26],
  [230, 110, 36], [600, 240, 42], [690, 215, 48], [500, 215, 52], [760, 260, 58],
];

// ---------- B12: the world map, small lights popping on one after another, rings spreading ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Schematic t={t} id="b12" />
    <WorldMap x={160} y={170} s={1.6} color="#27406A" />
    {SPOTS.map(([mx, my, at], i) => {
      const k = backOut(clamp((t - at) / 8));
      const ring = clamp((t - at) / 20);
      const x = 160 + mx * 1.6;
      const y = 170 + my * 1.6;
      if (t < at) return null;
      return (
        <g key={i}>
          <Glow x={x} y={y} r={110 * k} o={0.8} />
          <circle cx={x} cy={y} r={30 + ring * 60} fill="none" stroke={SCH.glow} strokeWidth={4 * (1 - ring)} opacity={1 - ring} />
          <circle cx={x} cy={y} r={11 * k} fill="#FFF1B8" />
        </g>
      );
    })}
    <Sparkle x={1180} y={360} t={t - 30} s={1.1} />
  </g>
);

const MAT_Y = 975;
const sitPose = (x: number, yaw: number, scale: number) => ({ x, y: MAT_Y - 12 - 30 * scale, scale, yaw, facing: (yaw > 0 ? 1 : -1) as 1 | -1, legL: { a: 84, b: 0 }, legR: { a: 78, b: 0 }, armL: { a: 12, b: 6 }, armR: { a: 12, b: 6 } });

// ---------- B13: wide, a dark hut; the bulb flickers once, then floods the room with warm light ----------
export const B13: React.FC<ShotProps> = ({ t, len }) => {
  const lit = t < 12 ? 0 : t < 15 ? 0.3 : t < 17 ? 0.05 : easeOut(clamp((t - 17) / 12));
  const on = t < 12 ? 0 : t < 15 ? 0.8 : t < 17 ? 0.1 : 1;
  const kid = (look: typeof VILLAGE_GIRL, x: number, yaw: number, s: number) => <Hero look={look} pose={{ ...poseAt(t, [{ f: 0, p: sitPose(x, yaw, s) }]), ...faceAt(t, [[0, 'neutral'], [18, 'happy']]) }} rimId="rimR" shadow={0} />;
  return (
    <g transform={camT(960, kf(t, [[0, 540], [len, 600]]), kf(t, [[0, 1.0], [len, 1.16]]))}>
      <HutRoom id="b13" t={t} lit={lit}>
        {kid(VILLAGE_GIRL, 760, 0.7, 0.8)}
        {kid(LOOKS.sis, 1150, -0.7, 0.72)}
      </HutRoom>
      <HangingBulb x={960} y={240} on={on} t={t} />
      {t > 16 ? <Sparkle x={1010} y={330} t={t - 16} s={1.4} /> : null}
      {on > 0.9 ? <Dust t={t} seed={31} x0={600} y0={240} w={720} h={500} n={18} o={0.6} /> : null}
    </g>
  );
};

// ---------- B14: medium, two kids doing homework on a low table under the bulb ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const write = (ph: number) => ({ a: 46 + Math.sin(t * 0.8 + ph) * 7, b: 52 + Math.sin(t * 1.6 + ph) * 8 });
  const a = { ...poseAt(t, [{ f: 0, p: sitPose(740, 0.8, 0.82) }]), armR: write(0) };
  const b = { ...poseAt(t, [{ f: 0, p: sitPose(1180, -0.8, 0.74) }]), armL: write(2) };
  return (
    <g transform={camT(960, kf(t, [[0, 760], [len, 740]]), kf(t, [[0, 1.45], [len, 1.6]]))}>
      <HutRoom id="b14" t={t} lit={1}>
        <Hero look={VILLAGE_GIRL} pose={{ ...a, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
        <Hero look={LOOKS.sis} pose={{ ...b, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
        {/* the low table with two notebooks and a pencil */}
        <rect x={780} y={862} width={360} height={30} rx={8} fill="#A8723E" stroke="#4E3322" strokeWidth={4} />
        <path d="M 810 892 V 970 M 1110 892 V 970" stroke="#4E3322" strokeWidth={14} />
        <rect x={810} y={836} width={110} height={26} rx={4} fill="#F4EBD0" stroke="#8A7A58" strokeWidth={3} transform="rotate(-3 865 849)" />
        <rect x={1000} y={836} width={110} height={26} rx={4} fill="#DDEAF2" stroke="#6A8AA0" strokeWidth={3} transform="rotate(3 1055 849)" />
        <path d="M 936 850 l 40 -6" stroke="#F2C14E" strokeWidth={8} strokeLinecap="round" />
      </HutRoom>
      <HangingBulb x={960} y={220} on={1} t={t} />
      <Dust t={t} seed={33} x0={700} y0={250} w={520} h={500} n={16} o={0.6} />
    </g>
  );
};

// ---------- B15: card "685 TRIỆU": a dark bulb that flickers and fails, a row of dim people ----------
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const flick = t > 52 && t < 58 ? 0.5 : 0;
  return (
    <NumCard t={t} len={len} id="b15" to={685} unit="TRIỆU" caption="NGƯỜI CHƯA CÓ ĐIỆN" cx={1180} dur={42}>
      <BulbLine x={440} y={420} s={2.1} on={flick} slash={clamp((t - 24) / 10)} t={t} />
      {Array.from({ length: 12 }).map((_, i) => (
        <PersonIcon key={i} x={420 + i * 98} y={900} s={0.8} o={0.35 + 0.15 * Math.sin(t / 9 + i)} />
      ))}
    </NumCard>
  );
};
