import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, LEG_LEN, Glow, Dust, Kitchen, KitchenIsland, KITCHEN, stand,
  Tabletop, LightVeil, Sparkle, Tag, Foreground, ShotProps, FONT,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { PhoneShell } from '../last-one/cha-feed-screen-ui';
import { WashingMachine } from './chc-props-appliance-car-coin';
import { VillageSchool, KidsRow } from './chc-props-village-school';
import { ListScreen, TransferScreen, ClockFace, Confetti } from './chc-ui-phone-screens-cards-chips';

// Chapter C, the fun part: Mum's washing machine, the bills paid, the donation, the winter coats.

const MOM = LOOKS.mom;
const SIS = LOOKS.sis;
const KW = 0.66; // kitchen "floor" depth where the family stands in front of the island

/** Hip point for a character of relative height `k` standing at (u, w) on the kitchen floor; `sc` shrinks them (the little sister). */
const kStand = (u: number, w: number, sc = 1) => {
  const s = stand(KITCHEN, u, w);
  const feet = s.y + LEG_LEN * s.scale;
  const scale = s.scale * sc;
  return { x: s.x, y: feet - LEG_LEN * scale, scale };
};
/** The washing machine's floor spot and scale at kitchen floor point (u, w). */
const machineAt = (u: number, w: number) => {
  const p = KITCHEN.P(u, 1, w);
  return { x: p.x, y: p.y, s: stand(KITCHEN, u, w).scale * 0.74 * 1.3 };
};

// ---------- C1: wide kitchen: Mum beside the brand-new washing machine, bow popping on, she claps ----------
export const C1: React.FC<ShotProps> = ({ t, len }) => {
  const m = machineAt(0.57, KW);
  const mum = kStand(0.37, KW);
  const clap = Math.sin(t * 0.7) * 0.5 + 0.5;
  const pose = poseAt(t, [
    { f: 0, p: { x: mum.x, y: mum.y, scale: mum.scale, yaw: 0.45, look: 0.6, armL: { a: 20, b: 20 }, armR: { a: 24, b: 30 } } },
    { f: 8, p: { armL: { a: 60 + 0, b: 110 }, armR: { a: 60, b: 110 } }, ease: easeOut },
  ]);
  const hop = Math.max(0, Math.sin((t - 8) * 0.4)) * 18 * clamp((t - 8) / 8) * (t < 46 ? 1 : 0.3);
  return (
    <g transform={camT(kf(t, [[0, 920], [len, 960]]), 610, kf(t, [[0, 1.25], [len, 1.5]]))}>
      <Kitchen t={t + 40} id="c1k" />
      <KitchenIsland />
      <WashingMachine x={m.x} y={m.y} s={m.s} t={t} id="c1w" bow={clamp((t - 5) / 8)} />
      <Hero look={MOM} pose={{ ...pose, y: pose.y - hop, armL: { a: 70 + clap * 20, b: 110 }, armR: { a: 70 + clap * 20, b: 110 }, ...faceAt(t, [[0, 'shock'], [8, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Sparkle x={m.x - 60} y={m.y - 300 * m.s / 0.74 * 0.5} t={t - 6} s={1.6} />
      <Sparkle x={m.x + 90} y={m.y - 380 * m.s} t={t - 12} s={1.1} />
      <Dust t={t} seed={4} x0={700} y0={380} w={700} h={400} n={20} o={0.4} />
    </g>
  );
};

// ---------- C2: close: the machine huge, water swirling, "< 3 TIẾNG" pops on, Mum clapping at the edge ----------
export const C2: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 600, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g filter="url(#blur16)"><g transform="translate(-300 -260) scale(1.5)"><Kitchen t={t + 60} id="c2k" /></g></g>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#0A0A12" opacity={0.28} />
      <WashingMachine x={760} y={1010} s={2.5} t={t} id="c2w" bow={1} />
      <Glow x={760} y={600} r={700} o={0.25} />
      <Hero look={MOM} pose={{ x: 1450, y: 760, scale: 2.0, yaw: -0.35, look: -0.6, armL: { a: 80 + Math.sin(t * 0.7) * 12, b: 110 }, armR: { a: 80 - Math.sin(t * 0.7) * 12, b: 110 }, expr: 'happy', blink: 0, facing: 1, tilt: 0, spin: 0, headTilt: 3, legL: { a: 0, b: 0 }, legR: { a: 0, b: 0 }, glasses: 0, squash: 0, handL: 'open', handR: 'open', sway: 0 }} rimId="rimR" shadow={0} />
      <Tag x={1000} y={170} t={t - 4} text="< 3 TIẾNG" w={460} />
      <Sparkle x={620} y={420} t={t - 8} s={1.8} />
    </g>
  );
};

// ---------- C3: insert: the phone on the table, the bills ticking on one by one ----------
export const C3: React.FC<ShotProps> = ({ t, len }) => {
  return (
    <g transform={`translate(960 540) rotate(${-3 + t * 0.05}) scale(${kf(t, [[0, 0.98], [len, 1.06]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#8A6A52" grain="#785A44" lip="#947258" kind="wood" floor="#2C2430" floorLines="#231C28" />
      <LightVeil id="c3veil" lights={[[960, 540, 640]]} o={0.55} />
      <PhoneShell id="c3p" x={900} y={560} s={0.7} rot={2} glow={0.6}>
        <ListScreen t={t} at={[6, 19, 43]} />
      </PhoneShell>
      {[6, 19, 43].map((a, i) => <Sparkle key={a} x={1190 + (i % 2) * 40} y={330 + i * 190} t={t - a} s={1.3} />)}
      <InsertArm x={1250} y={900} fx={1750} fy={1400} rot={-24} s={4.6} width={110} point />
    </g>
  );
};

// ---------- C4: medium: the little sister cheering, Mum behind her, confetti ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const sis = kStand(0.55, 0.84, 0.72);
  const mum = kStand(0.3, 0.6);
  const jump = Math.abs(Math.sin(t * 0.28)) * 40;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 600, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Kitchen t={t + 90} id="c4k" />
      <KitchenIsland />
      <Hero look={MOM} pose={{ ...poseAt(t, [{ f: 0, p: { x: mum.x, y: mum.y, scale: mum.scale, yaw: 0.4, look: 0.5, armL: { a: 70, b: 110 }, armR: { a: 70, b: 110 } } }]), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={SIS} pose={{ ...poseAt(t, [{ f: 0, p: { x: sis.x, y: sis.y - jump, scale: sis.scale, yaw: 0.15, look: 0.2, armL: { a: 160, b: 10 }, armR: { a: 160, b: 10 }, legL: { a: -8, b: 6 }, legR: { a: 8, b: 6 } } }]), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Confetti t={t} from={4} />
      <Sparkle x={sis.x + 70} y={sis.y - 180} t={t - 6} s={1.4} />
    </g>
  );
};

// ---------- C5: insert: the transfer screen, a thumb taps XÁC NHẬN, the button turns to a green tick ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const tap = kf(t, [[0, 0], [10, 1], [13, 1], [20, 0.4], [len, 0.4]]);
  const ax = 960 + (1 - tap) * 140;
  const ay = 640 + (1 - tap) * 300;
  return (
    <g transform={`translate(960 540) rotate(${3 - t * 0.06}) scale(${kf(t, [[0, 0.98], [len, 1.06]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#3E3448" grain="#322A3C" lip="#4A3E56" floor="#18121E" floorLines="#120D18" kind="stone" />
      <LightVeil id="c5veil" lights={[[960, 540, 640]]} o={0.6} />
      <PhoneShell id="c5p" x={900} y={540} s={0.7} rot={-3} glow={0.7}>
        <TransferScreen t={t} confirm={13} />
      </PhoneShell>
      <Sparkle x={1130} y={690} t={t - 13} s={1.6} />
      <InsertArm x={ax} y={ay} fx={ax + 560} fy={ay + 560} rot={-34} s={5} width={116} point />
    </g>
  );
};

// ---------- C6: wide: the mountain village school in the mist, children in thin grey coats, shivering ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
    <VillageSchool t={t} id="c6v" />
    <KidsRow t={t} coat={0} y={930} s={1.25} x0={500} step={150} n={7} />
    <Foreground blur={10}><path d="M -100 1080 L -100 880 Q 60 820 160 1080 Z" fill="#14201C" /><path d="M 1760 1080 L 1800 860 Q 1960 800 2040 1080 Z" fill="#14201C" /></Foreground>
  </g>
);

// ---------- C7: close: the coats turn red, the kids cheer, "100.000.000 đ" pops on ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const coat = clamp((t - 4) / 16);
  const cheer = clamp((t - 18) / 6);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 600, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g filter="url(#blur16)"><VillageSchool t={t + 30} id="c7v" /></g>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#101820" opacity={0.18} />
      <KidsRow t={t} coat={coat} cheer={cheer} y={1010} s={2.5} x0={330} step={290} n={5} />
      <Tag x={960} y={190} t={t - 6} text="100.000.000 đ" w={640} />
      <Sparkle x={560} y={560} t={t - 12} s={1.6} />
      <Sparkle x={1380} y={540} t={t - 16} s={1.6} />
    </g>
  );
};

// ---------- C8: a clock sweeping once round (a day) while the donation bar refills ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / (len - 8)));
  const ang = 360 * p;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <g filter="url(#blur16)"><VillageSchool t={t + 60} id="c8v" /></g>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#0A1018" opacity={0.55} />
      <ClockFace x={640} y={560} r={260} angle={ang} />
      <Glow x={640} y={560} r={520} o={0.2} />
      <g transform="translate(1000 400)">
        <text x={0} y={0} fontFamily={FONT.title} fontWeight={700} fontSize={120} fill="#F6EFE3">HƠN 1 NGÀY</text>
        <rect x={0} y={60} width={760} height={40} rx={20} fill="#2A3148" />
        <rect x={0} y={60} width={760 * p} height={40} rx={20} fill="#5BE08A" />
        <text x={0} y={190} fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#7CF0A8">{`+${Math.round(100000000 * p).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`}</text>
      </g>
      <Sparkle x={1680} y={470} t={t - (len - 10)} s={1.6} />
    </g>
  );
};
