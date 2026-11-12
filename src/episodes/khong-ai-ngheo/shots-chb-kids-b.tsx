import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, walkPose, LOOKS, Schematic, Glow, Dust, LightVeil, Foreground, Bokeh, Sparkle, Haze, ShotProps,
} from '../../engine';
import { VILLAGE_GIRL, DOCTOR } from './cast-looks';
import { VillageBg, GoldFloor, Clinic, FamilyTable, GROUND_Y } from './chb-village-scenes';
import { Cake, Blister, LungsIcon, DropIcon, MosquitoIcon, IconPop, IconWord } from './chb-icons-health';
import { LookArm } from './chb-cards-and-marks';

// Chapter B, "Thay đổi đầu tiên là trẻ em" (2/2): the three causes as clean icons (lungs, droplet, mosquito), then the new
// world: the village clinic, a hand takes a blister pack of medicine, a child blows out 5 candles with her family.

const ICONS = { lungs: LungsIcon, drop: DropIcon, mosq: MosquitoIcon } as const;

/** One cause on the blueprint: a huge line icon popping on its word, tilted a different way each time. */
const IconShot: React.FC<{ t: number; len: number; id: string; kind: keyof typeof ICONS; word: string; x: number; rot: number; push: number }> = ({ t, len, id, kind, word, x, rot, push }) => {
  const Ic = ICONS[kind];
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, push]])}) translate(-960 -540)`}>
      <Schematic t={t + (kind.length * 17)} id={id} />
      <Glow x={x} y={470} r={480} kind="cool" o={0.3} />
      <IconPop x={x} y={460} s={2.5} t={t} rot={rot}><Ic t={t} /></IconPop>
      <IconWord x={x} y={850} t={t} text={word} />
      <Sparkle x={x + 300} y={300} t={t - 6} s={1} />
    </g>
  );
};

export const B6: React.FC<ShotProps> = ({ t, len }) => <IconShot t={t} len={len} id="b6" kind="lungs" word="VIÊM PHỔI" x={960} rot={-3} push={1.1} />;
export const B7: React.FC<ShotProps> = ({ t, len }) => <IconShot t={t} len={len} id="b7" kind="drop" word="TIÊU CHẢY" x={900} rot={4} push={1.14} />;
export const B8: React.FC<ShotProps> = ({ t, len }) => <IconShot t={t} len={len} id="b8" kind="mosq" word="SỐT RÉT" x={1000} rot={-5} push={1.1} />;

// ---------- B9: wide, the village clinic at sunrise: mum and her girl walk up, the doctor waves from the door ----------
export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const g = GROUND_Y + 22;
  const mum = walkPose(380 + t * 4.2, t * 0.5, g, 0.95, { look: 0.3 });
  const girl = walkPose(560 + t * 4.2, t * 0.5 + 1, g, 0.7, { look: 0.3 });
  const doc = poseAt(t, [
    { f: 0, p: { x: 1180, y: g - 140 * 0.95, scale: 0.95, yaw: -0.45, look: -0.5, armL: { a: 10, b: -6 }, armR: { a: 150, b: 10 } } },
    { f: 10, p: { armR: { a: 168, b: 6 } } },
    { f: 20, p: { armR: { a: 146, b: 10 } } },
    { f: 30, p: { armR: { a: 168, b: 6 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 540, kf(t, [[0, 0.95], [len, 1.1]]))}>
      <VillageBg id="b9" t={t + 60} sunX={1560} />
      <GoldFloor t={t} />
      <Clinic x={1000} t={t} open={clamp(t / 8)} />
      <Hero look={DOCTOR} pose={{ ...doc, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={1} />
      <Hero look={LOOKS.mom} pose={{ ...mum, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
      <Hero look={VILLAGE_GIRL} pose={{ ...girl, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
      <Sparkle x={1010} y={420} t={t - 8} s={1.2} />
    </g>
  );
};

// ---------- B10: insert, the doctor's hand holds out a blister pack, mum's hand takes it ----------
export const B10: React.FC<ShotProps> = ({ t, len }) => {
  const take = easeOut(clamp((t - 6) / 8));
  const lift = easeOut(clamp((t - 14) / 12));
  const packX = 900 + lift * 260;
  const packY = 540 - lift * 40;
  const mx = 1700 - take * 690 + lift * 260;
  const my = 600 - take * 40 - lift * 40;
  const dx = 800 - lift * 260;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(-960 -540)`}>
      <rect x={-300} y={-300} width={2520} height={1500} fill="#4A3A34" />
      <Bokeh seed={11} n={10} x0={0} y0={40} w={1920} h={520} t={t} o={0.55} />
      <rect x={-300} y={740} width={2520} height={500} fill="#8A5E3E" />
      <rect x={-300} y={740} width={2520} height={14} fill="#B8845A" />
      <Glow x={960} y={560} r={700} o={0.6} />
      <LookArm look={DOCTOR} x={dx} y={560} fx={-260} fy={760} rot={-84} s={4.4} width={104} />
      <Blister id="b10bl" x={packX} y={packY} s={1.7} rot={-6 + lift * 8} shine={clamp((t - 10) / 14)} />
      <LookArm look={LOOKS.mom} x={mx} y={my} fx={2200} fy={820} rot={84} s={4.6} />
      <Sparkle x={960} y={420} t={t - 12} s={1.2} />
      <Foreground blur={12}><rect x={-100} y={1030} width={2200} height={200} fill="#150E0C" /></Foreground>
    </g>
  );
};

// ---------- B11: medium, the girl blows out her 5 candles; mum and Pip clap ----------
export const B11: React.FC<ShotProps> = ({ t, len }) => {
  const blow = t > 12 ? t - 12 : -1;
  const clap = (ph: number) => ({ armL: { a: 62 + Math.sin(t / 2.2 + ph) * 10, b: 70 }, armR: { a: 62 + Math.sin(t / 2.2 + ph) * 10, b: 70 } });
  const girl = poseAt(t, [
    { f: 0, p: { x: 960, y: 604, scale: 0.86, yaw: 0, look: 0, tilt: -3, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } } },
    { f: 10, p: { tilt: 4, squash: 0.04 } },
    { f: 24, p: { tilt: 0, squash: -0.04 } },
  ]);
  const face = faceAt(t, [[0, 'happy'], [10, 'oops'], [26, 'happy']]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.1], [len, 1.3]]))}>
      <rect x={-400} y={-300} width={2720} height={1400} fill="#4A3330" />
      <rect x={-400} y={820} width={2720} height={400} fill="#3A2622" />
      <path d="M 200 120 Q 960 260 1720 120" stroke="#2A1C18" strokeWidth={6} fill="none" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
        const px = 200 + i * 190;
        const py = 120 + Math.sin((i / 8) * Math.PI) * 106 + 30;
        return <circle key={i} cx={px} cy={py} r={13} fill={['#FFD36A', '#F08FA6', '#7FD4FF'][i % 3]} opacity={0.85} />;
      })}
      <Bokeh seed={12} n={10} x0={100} y0={80} w={1700} h={420} t={t} o={0.5} />
      <Hero look={LOOKS.mom} pose={{ ...poseAt(t, [{ f: 0, p: { x: 590, y: 596, scale: 0.98, yaw: 0.45, look: 0.5, ...clap(0) } }]), ...clap(0), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={VILLAGE_GIRL} pose={{ ...girl, ...face }} rimId="rimL" shadow={0} />
      <Hero look={LOOKS.pipHood} pose={{ ...poseAt(t, [{ f: 0, p: { x: 1330, y: 590, scale: 0.98, yaw: -0.45, look: -0.5 } }]), ...clap(1.5), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <FamilyTable x={960} y={662} w={1100} />
      <Glow x={960} y={540} r={380} o={0.7} />
      <Cake x={960} y={654} s={0.6} t={t} blow={blow} />
      <LightVeil id="b11v" lights={[[960, 520, 640]]} o={0.34} />
      <Haze y={700} h={200} o={0.15} />
      <Dust t={t} seed={21} x0={500} y0={300} w={900} h={500} n={16} o={0.5} />
      {blow > 8 ? <Sparkle x={780} y={400} t={blow - 8} s={1.2} /> : null}
      {blow > 14 ? <Sparkle x={1150} y={420} t={blow - 14} s={1.1} /> : null}
    </g>
  );
};
