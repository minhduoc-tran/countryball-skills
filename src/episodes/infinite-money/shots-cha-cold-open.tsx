import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, rnd, camT, LOOKS, joints, toWorld, LEG_LEN, Street, streetStand, proj,
  propScale, Rooftop, TitleCard, Foreground, Sparkle, Glow, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BlackCard, SpotBackdrop, Terminal, BanhMiCart, VENDOR_A, VENDOR_B } from './cha-card-terminal-props';
import { IslandScene } from './cha-scenery-props';

// Chapter A, cold open A1-A10 (0.00-12.4 s): the black card (macro), three demos (bánh mì street, a whole island, each
// "Quẹt thẻ. Thanh toán thành công."), then the title over the rooftop. Pure functions of the shot clock t.

const PIP = LOOKS.pipHood;

// ---------- A1: macro, the matte black card turning slowly under a spotlight ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.18]]))}>
    <SpotBackdrop id="a1bg" t={t} cx={960} cy={520} r={820} />
    <BlackCard id="a1c" x={960} y={560} s={1.35} rot={-8} yaw={kf(t, [[0, -62], [len, 28]])} shine={clamp(t / len)} glow={1} />
    <Sparkle x={1290} y={380} t={t - 14} s={1.2} />
    <Foreground blur={16}><ellipse cx={120} cy={1000} rx={330} ry={150} fill="#050408" /></Foreground>
  </g>
);

// ---------- A2: the thin gold infinity close up, a glint runs across it ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1250], [len, 1130]]), kf(t, [[0, 700], [len, 650]]), kf(t, [[0, 2.5], [len, 2.9]]))}>
    <SpotBackdrop id="a2bg" t={t + 30} cx={1180} cy={620} r={700} />
    <BlackCard id="a2c" x={960} y={540} s={1.35} rot={-8} yaw={0} shine={clamp((t - 4) / 24)} glow={1} />
    <Sparkle x={1260} y={640} t={t - 12} s={1.6} />
  </g>
);

// ---------- A3: wide street, a row of bánh mì carts each emptied in turn as Pip sweeps the card along it ----------
const CART_Z: { X: number; Z: number; hue: number; at: number }[] = [
  { X: 5.4, Z: 14, hue: 0, at: 24 }, { X: -5.4, Z: 12, hue: 1, at: 18 }, { X: 5.4, Z: 10, hue: 2, at: 14 },
  { X: -5.4, Z: 8.2, hue: 0, at: 8 }, { X: 5.4, Z: 6.4, hue: 1, at: 2 },
];
const Row: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {CART_Z.map((c) => {
      const g = proj(c.X, 0, c.Z);
      const e = clamp((t - c.at * 1.6) / 22);
      const vend = streetStand(c.X + (c.X > 0 ? -1.3 : 1.3), c.Z + 0.1, { k: 1.55 });
      const cheer = e > 0.9 ? 1 : 0;
      const vp: Partial<Pose> = {
        x: vend.x, y: vend.y, scale: vend.scale, yaw: c.X > 0 ? -0.5 : 0.5,
        armL: { a: cheer ? 150 + Math.sin(t / 2 + c.Z) * 12 : 12, b: cheer ? 10 : -8 }, armR: { a: cheer ? 150 + Math.cos(t / 2 + c.Z) * 12 : 12, b: cheer ? 10 : -8 },
        squash: cheer ? 0.04 * Math.sin(t / 2 + c.Z) : 0,
      };
      return (
        <g key={`${c.X}${c.Z}`}>
          <BanhMiCart x={g.x} y={g.y} s={propScale(c.Z) * 0.9} hue={c.hue} t={t * 0.2} emptied={e} />
          <Hero look={c.hue === 1 ? VENDOR_B : VENDOR_A} pose={poseAt(0, [{ f: 0, p: vp }])} rimId="rimL" shadow={0} />
        </g>
      );
    })}
  </g>
);
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const s = streetStand(0.1, 4.3, { k: 1.6 });
  const pose = poseAt(t, [
    { f: 0, p: { x: s.x, y: s.y, scale: s.scale, yaw: 0.35, look: 0.6, armL: { a: 10, b: -8 }, armR: { a: 60, b: 20 } } },
    { f: 14, p: { armR: { a: 118, b: 8 }, yaw: 0.2 }, ease: easeOut },
    { f: 40, p: { armR: { a: 128, b: 6 }, yaw: 0.45 } },
    { f: 60, p: { armR: { a: 140, b: 6 }, yaw: 0.35 } },
  ]);
  const hand = toWorld({ ...pose } as Pose, joints(pose as Pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 600, kf(t, [[0, 1.2], [len, 1.42]]))}>
      <Street t={t + 90} id="a3st" market={0} />
      <Row t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) } as Pose} rimId="rimR" shadow={0} />
      <BlackCard id="a3c" x={hand.x + 10} y={hand.y - 30} s={0.12} rot={-18} yaw={0} shine={((t % 40) / 40)} />
    </g>
  );
};

// ---------- tap macro (A4, A8): Pip's mitten brings the card to the terminal's pad; it reads; contact on frame 12 ----------
export const TapMacro: React.FC<{ t: number; len: number; id: string; bg: React.ReactNode; fromLeft?: boolean; tx?: number; rot?: number }> = ({ t, len, id, bg, fromLeft = false, tx = 1000, rot = 0 }) => {
  const dir = fromLeft ? -1 : 1;
  const dip = t >= 12 && t < 17 ? Math.sin(((t - 12) / 5) * Math.PI) * 14 : 0;
  const lift = t >= 17 ? easeOut(clamp((t - 17) / 8)) * 90 : 0;
  const cx = kf(t, [[0, tx + dir * 560], [11, tx + dir * 20], [len, tx + dir * 10]]);
  const cy = kf(t, [[0, 120], [11, 560], [len, 560]]) + dip - lift;
  const screen = t >= 12 ? 'read' : 'idle';
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      {bg}
      <Terminal x={tx} y={1060} s={2.9} rot={rot} screen={screen} t={t} />
      <BlackCard id={id} x={cx} y={cy} s={0.64} rot={dir * -14} yaw={0} />
      <InsertArm x={cx + dir * 150} y={cy - 24} fx={cx + dir * 900} fy={cy - 560} rot={dir * -20} s={4.6} width={112} />
    </g>
  );
};
const StreetBlur: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <g filter="url(#blur16)"><g transform={camT(1000, 640, 1.5)}><Street t={t} id={id} /></g></g>
    <rect x={-100} y={-100} width={2120} height={1280} fill="#0A0814" opacity={0.35} />
  </g>
);
export const A4: React.FC<ShotProps> = (p) => <TapMacro {...p} id="a4c" bg={<StreetBlur t={p.t + 20} id="a4st" />} />;

// ---------- green macro (A5, A20): the terminal flashes "PAYMENT APPROVED", sparks fly ----------
export const GreenMacro: React.FC<{ t: number; len: number; bg: React.ReactNode; children?: React.ReactNode }> = ({ t, len, bg, children }) => (
  <g transform={camT(960, kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
    {bg}
    <Terminal x={960} y={1080} s={3.1} screen="ok" okT={t} rot={Math.sin(t / 2) * Math.max(0, 1 - t / 14) * 3} />
    {children}
    <Sparkle x={620} y={330} t={t - 2} s={1.4} />
    <Sparkle x={1330} y={290} t={t - 5} s={1.2} />
    {Array.from({ length: 14 }).map((_, i) => {
      const a = rnd(3, i) * Math.PI * 2;
      const d = easeOut(clamp(t / 18)) * (240 + rnd(4, i) * 280);
      return <rect key={i} x={960 + Math.cos(a) * d} y={400 + Math.sin(a) * d * 0.8} width={14} height={26} rx={3} fill={['#5BE08A', '#F2C94C', '#F6EFE3'][i % 3]} opacity={1 - clamp((t - 6) / 14)} transform={`rotate(${i * 40 + t * 12} ${960 + Math.cos(a) * d} ${400 + Math.sin(a) * d})`} />;
    })}
  </g>
);
export const A5: React.FC<ShotProps> = (p) => <GreenMacro {...p} bg={<StreetBlur t={p.t + 50} id="a5st" />} />;

// ---------- A6: the vendors cheer beside their carts, Pip holds the card up between them ----------
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const bob = (k: number) => Math.abs(Math.sin(t / 2.2 + k)) * 0.06;
  const arms = (k: number): Partial<Pose> => ({ armL: { a: 150 + Math.sin(t / 2 + k) * 14, b: 10 }, armR: { a: 150 + Math.cos(t / 2 + k) * 14, b: 10 }, squash: -bob(k) });
  const base = (x: number, sc: number, yaw: number, k: number): Pose => ({ ...poseAt(0, [{ f: 0, p: { x, y: 800 - LEG_LEN * sc, scale: sc, yaw, ...arms(k) } }]) });
  const pip = poseAt(t, [
    { f: 0, p: { x: 960, y: 800 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.3, armL: { a: 10, b: -8 }, armR: { a: 120, b: 10 } } },
    { f: 10, p: { armR: { a: 158, b: 8 } }, ease: easeOut },
  ]);
  const hand = toWorld(pip, joints(pip).armR.end);
  return (
    <g transform={camT(960, 590, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <StreetBlur t={t + 70} id="a6st" />
      <rect x={-100} y={780} width={2120} height={400} fill="#2B2432" />
      <BanhMiCart x={640} y={830} s={1.25} hue={0} emptied={1} />
      <BanhMiCart x={1290} y={830} s={1.25} hue={1} emptied={1} />
      <Hero look={VENDOR_A} pose={{ ...base(380, 1.0, 0.25, 0), ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={VENDOR_B} pose={{ ...base(1560, 1.0, -0.25, 2), ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0} />
      <BlackCard id="a6c" x={hand.x + 8} y={hand.y - 44} s={0.22} rot={-14} shine={clamp(t / 18)} />
    </g>
  );
};

// ---------- A7: wide, a small green island across the water; Pip on the sand, back to us, points the card at it ----------
const SandStrip: React.FC = () => (
  <g>
    <path d="M -100 930 Q 500 880 1100 940 L 2100 960 L 2100 1200 L -100 1200 Z" fill="#E8CC8C" stroke="#B89A58" strokeWidth={4} />
    <path d="M -100 930 Q 500 880 1100 940" stroke="#fff" strokeWidth={8} fill="none" opacity={0.55} />
  </g>
);
export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 470, y: 960 - LEG_LEN * 0.9, scale: 0.9, yaw: 0.6, look: 0.8, armL: { a: 8, b: -8 }, armR: { a: 40, b: 10 } } },
    { f: 12, p: { armR: { a: 112, b: 4 }, yaw: 0.7 }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 590, kf(t, [[0, 1.0], [len, 1.16]]))}>
      <IslandScene id="a7is" t={t} />
      <SandStrip />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.5} />
      <BlackCard id="a7c" x={hand.x + 14} y={hand.y - 20} s={0.2} rot={-20} shine={clamp((t - 8) / 20)} />
    </g>
  );
};

// ---------- A8: tap macro on the beach (the card comes in from the left) ----------
export const A8: React.FC<ShotProps> = (p) => (
  <TapMacro {...p} id="a8c" fromLeft tx={900} rot={-5} bg={<g filter="url(#blur16)"><IslandScene id="a8is" t={p.t} /></g>} />
);

// ---------- A9: the terminal on a stump flashes green, the ĐÃ BÁN sign hammers into the island, Pip punches the air ----------
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 470, y: 960 - LEG_LEN * 0.9, scale: 0.9, yaw: 0.5, armL: { a: 10, b: -8 }, armR: { a: 40, b: 10 } } },
    { f: 8, p: { armR: { a: 150, b: 8 }, squash: -0.05 }, ease: easeOut },
    { f: 16, p: { squash: 0 } },
    { f: 24, p: { armR: { a: 140, b: 20 }, armL: { a: 40, b: 10 } } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 590, kf(t, [[0, 1.1], [len, 1.0]]))}>
      <IslandScene id="a9is" t={t + 30} sold={clamp((t - 8) / 12)} />
      <SandStrip />
      <g transform="translate(880 960)">
        <ellipse cx={0} cy={4} rx={110} ry={14} fill="#000" opacity={0.3} />
        <rect x={-70} y={-110} width={140} height={110} rx={14} fill="#7A5A3A" stroke="#3E2A18" strokeWidth={4} />
        <ellipse cx={0} cy={-110} rx={70} ry={16} fill="#9A7448" stroke="#3E2A18" strokeWidth={4} />
      </g>
      <Terminal x={880} y={850} s={0.95} screen="ok" okT={t} t={t} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug'], [9, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Sparkle x={1150} y={440} t={t - 14} s={1.2} />
    </g>
  );
};

// ---------- A10: the title over the rooftop at dusk, Pip holds the card up and it catches the last of the sun ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.82;
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 840 - LEG_LEN * sc, scale: sc, yaw: 0.1, look: 0.2, armL: { a: 12, b: 6 }, armR: { a: 70, b: 10 } } },
    { f: 16, p: { armR: { a: 156, b: 6 }, squash: -0.04 }, ease: easeOut },
    { f: 24, p: { squash: 0 } },
    { f: 60, p: { armR: { a: 150, b: 10 }, headTilt: 3 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 545]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Rooftop t={t + 40} sunX={960} sunY={690 - 30 * easeOut(clamp(t / 40))} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={0.6} />
      <Glow x={hand.x + 10} y={hand.y - 60} r={150} o={0.5} />
      <BlackCard id="a10c" x={hand.x + 10} y={hand.y - 66} s={0.24} rot={-10} shine={clamp((t - 10) / 30)} yaw={kf(t, [[0, 0], [len, 24]])} glow={0.4} />
      <TitleCard t={t} lines={['WHAT IF YOU HAD', 'INFINITE MONEY?']} accent="INFINITE" accentT={40} size={112} y={165} />
    </g>
  );
};
