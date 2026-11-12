import React from 'react';
import {
  Hero, poseAt, faceAt, walkPose, kf, clamp, easeOut, backOut, camT, LOOKS, LEG_LEN, Kitchen, Supermarket, aisleStand,
  Teddy, Ball, ToyRobot, GiftBox, Street, streetStand, Motorbike, proj, propScale, Sparkle, Glow, Foreground, ShotProps,
} from '../../engine';
import { Backdrop } from '../nghin-dong-moi-giay/chb-park-and-face-props';
import { LoanContract, RedBow } from './chb-food-and-family-props';
import { CardTerminal } from './chb-card-terminal-and-confetti';

// Chapter B, the fun part (2/5): the family. The loan contract is stamped paid and the camera whips to Mum hugging Pip,
// the little sister goes wild in the toy store, Mo gets a motorbike with a red bow, then three fast swipes.

const PIP = LOOKS.pipHood;
const MOM = LOOKS.mom;
const SIS = LOOKS.sis;
const MO = LOOKS.mo;

const Heart: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 20 C -40 -6 -24 -34 0 -16 C 24 -34 40 -6 0 20 Z" fill="#FF5A7A" stroke="#B02A48" strokeWidth={2.5} opacity={o} />
);

// ---------- B6: the contract stamped ĐÃ TẤT TOÁN, then a whip pan to Mum hugging Pip in the kitchen ----------
export const B6: React.FC<ShotProps> = ({ t }) => {
  const pan = kf(t, [[30, 960], [40, 2880]]);
  const zoom = kf(t, [[0, 1.12], [28, 1.2], [34, 0.95], [40, 1.0], [55, 1.12]]);
  const sway = Math.sin(t / 7) * 2;
  const hugT = Math.max(0, t - 38);
  const mom = poseAt(hugT, [
    { f: 0, p: { x: 2800, y: 640, scale: 1.55, yaw: 0.75, facing: 1, look: 0.7, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 }, headTilt: 6 } },
    { f: 8, p: { armL: { a: 72, b: -75 }, armR: { a: 78, b: -80 }, headTilt: 12 }, ease: easeOut },
  ]);
  const pip = poseAt(hugT, [
    { f: 0, p: { x: 2975, y: 665, scale: 1.4, yaw: -0.75, facing: -1, look: -0.7, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 }, headTilt: -6 } },
    { f: 8, p: { armL: { a: 68, b: -75 }, armR: { a: 74, b: -80 }, headTilt: -10 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(pan, 560, zoom)}>
      {/* the contract on a wooden table */}
      <rect x={-300} y={-200} width={2500} height={1500} fill="#7A4E30" />
      <path d="M -300 160 H 2200 M -300 420 H 2200 M -300 700 H 2200 M -300 960 H 2200" stroke="#5E3A22" strokeWidth={3} opacity={0.6} />
      <Glow x={900} y={300} r={800} o={0.25} />
      <LoanContract x={960} y={560} s={1.15} rot={-3} k={t - 10} />
      {/* the kitchen, one screen to the right */}
      <clipPath id="b6clip"><rect x={1920} y={-300} width={1920} height={1700} /></clipPath>
      <g clipPath="url(#b6clip)"><g transform="translate(1920 0)"><Kitchen t={t + 60} id="b6k" veil={0.25} /></g></g>
      <Hero look={MOM} pose={{ ...mom, y: mom.y + sway, ...faceAt(hugT, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <Hero look={PIP} pose={{ ...pip, y: pip.y - sway, ...faceAt(hugT, [[0, 'happy'], [10, 'happy']]), blink: hugT % 50 > 46 ? 1 : 0 }} rimId="rimL" shadow={0} />
      {[0, 1, 2].map((i) => {
        const k = Math.max(0, hugT - 8 - i * 4);
        return k > 0 ? <Heart key={i} x={2900 + i * 70 - 60} y={380 - k * 3} s={0.8 + 0.1 * i} o={clamp(1 - k / 30)} /> : null;
      })}
    </g>
  );
};

// ---------- B7: the toy store is hers: Sis runs in, leaps, cheering, toys fly; push in ----------
const B7_AT = aisleStand(0.5, 0.5);
export const B7: React.FC<ShotProps> = ({ t, len }) => {
  const run = clamp(t / 28);
  const sc = B7_AT.scale * 0.8;
  const x = kf(t, [[0, B7_AT.x - 420], [28, B7_AT.x - 40]], easeOut);
  const jump = Math.max(0, Math.sin(clamp((t - 30) / 26) * Math.PI)) * 90;
  const base = poseAt(Math.max(0, t - 28), [
    { f: 0, p: { armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 }, squash: 0.08 } },
    { f: 4, p: { armL: { a: 165, b: -6 }, armR: { a: 165, b: -6 }, squash: -0.08 }, ease: easeOut },
    { f: 26, p: { armL: { a: 150, b: 12 }, armR: { a: 150, b: 12 }, squash: -0.02 } },
    { f: 31, p: { armL: { a: 120, b: 14 }, armR: { a: 120, b: 14 }, squash: 0.1 } },
    { f: 36, p: { armL: { a: 160, b: 10 }, armR: { a: 160, b: 10 }, squash: 0 } },
  ]);
  const pose = t < 28
    ? walkPose(x, t * 0.7, B7_AT.y + LEG_LEN * B7_AT.scale, sc, { yaw: 0.3, look: 0.3, armL: { a: 40, b: 20 }, armR: { a: 40, b: 20 } })
    : { ...base, x, y: B7_AT.y + LEG_LEN * B7_AT.scale - LEG_LEN * sc - jump, scale: sc, yaw: 0.1, facing: 1 as const };
  const toss = (at: number, vx: number) => { const k = Math.max(0, t - at); return { x: x + vx * k, y: B7_AT.y - 140 - 22 * k + 0.5 * k * k, on: k > 0 && k < 44 }; };
  const a = toss(32, -9), b = toss(33, 7), c = toss(34, 13), d = toss(35, -3);
  const zoom = kf(t, [[0, 1.0], [len, 1.9]]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, x + 40]]), kf(t, [[0, 545], [len, 520]]), zoom)}>
      <Supermarket t={t + 150} id="b7" toys cart={false} />
      <Teddy x={B7_AT.x + 150} y={B7_AT.y + 150} h={170} />
      <Hero look={SIS} pose={{ ...pose, ...faceAt(t, [[0, 'happy'], [30, 'happy']]) }} rimId="rimR" shadow={0} />
      {a.on ? <Ball x={a.x} y={a.y} r={26} /> : null}
      {b.on ? <g transform={`rotate(${t * 9} ${b.x} ${b.y})`}><ToyRobot x={b.x} y={b.y + 40} h={80} /></g> : null}
      {c.on ? <g transform={`rotate(${-t * 7} ${c.x} ${c.y})`}><GiftBox x={c.x} y={c.y + 20} w={60} h={50} c1="#E86AA6" c2="#F6D04D" /></g> : null}
      {d.on ? <g transform={`rotate(${t * 6} ${d.x} ${d.y})`}><Teddy x={d.x} y={d.y + 30} h={70} fur="#C98A5A" /></g> : null}
      {t > 34 ? <Sparkle x={x + 70} y={B7_AT.y - 220} t={t - 34} s={0.9} /> : null}
    </g>
  );
};

// ---------- B8: Mo on the street, a brand-new scooter rolls into frame and a red bow pops on the handlebars ----------
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const Z = 4.6;
  const bike = proj(1.5, 0, Z);
  const bs = propScale(Z) * 1.25;
  const mo = streetStand(-0.7, Z);
  const popK = t < 3 ? 0 : backOut(clamp((t - 3) / 8));
  const jump = Math.max(0, Math.sin(clamp((t - 36) / 22) * Math.PI)) * 60;
  const pose = poseAt(t, [
    { f: 0, p: { x: mo.x, y: mo.y, scale: mo.scale, yaw: 0.5, look: 0.5, armL: { a: 16, b: 8 }, armR: { a: 16, b: 8 } } },
    { f: 12, p: { armL: { a: 20, b: 80 }, armR: { a: 20, b: 80 }, headTilt: -4 } },
    { f: 36, p: { armL: { a: 150, b: 14 }, armR: { a: 150, b: 14 }, squash: -0.06 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 640, kf(t, [[0, 1.6], [len, 2.0]]))}>
      <Street t={t + 100} id="b8" market={0.4} />
      <rect x={-400} y={-400} width={2720} height={1880} fill="#FFD9A0" opacity={0.2} style={{ mixBlendMode: 'screen' }} />
      <Hero look={MO} pose={{ ...pose, y: pose.y - jump, ...faceAt(t, [[0, 'shock'], [14, 'happy']]) }} rimId="rimR" shadow={0} />
      <g transform={`translate(${bike.x} ${bike.y}) scale(${popK})`}>
        <Motorbike x={0} y={0} s={bs} facing={-1} color="#2FA595" keys t={t} />
        <RedBow x={-66 * bs} y={-128 * bs} s={bs * 0.32} pop={t - 38} />
      </g>
      {t > 38 ? <Sparkle x={bike.x - 60 * bs} y={bike.y - 190 * bs} t={t - 38} s={1} /> : null}
    </g>
  );
};

// ---------- B9: three fast swipes, three scenes: the toy counter, the bike shop (tilted), a macro of the screen ----------
const SwipeBg: React.FC<{ id: string; t: number; a: string; b: string; children?: React.ReactNode }> = ({ id, t, a, b, children }) => (
  <g>
    <Backdrop id={id} t={t} top={a} bottom={b} />
    <Foreground blur={16}>{children}</Foreground>
  </g>
);
export const B9: React.FC<ShotProps> = ({ t }) => {
  const seg = t < 25 ? 0 : t < 47 ? 1 : 2;
  const k = seg === 0 ? t - 3 : seg === 1 ? t - 25 : t - 47;
  const zoomIn = 1 + k * 0.004;
  return (
    <g>
      {seg === 0 ? (
        <g transform={camT(960, 560, zoomIn)}>
          <SwipeBg id="b9a" t={t} a="#4A2A5A" b="#E8A05A">
            <Teddy x={380} y={820} h={420} />
            <ToyRobot x={1560} y={840} h={380} />
            <Ball x={1300} y={900} r={90} />
          </SwipeBg>
          <rect x={-300} y={950} width={2600} height={400} fill="#5A3A28" />
          <CardTerminal x={960} y={990} s={1.7} k={k} />
        </g>
      ) : null}
      {seg === 1 ? (
        <g transform={`rotate(-9 960 540) ${camT(1100, 560, 1.2 * zoomIn)}`}>
          <SwipeBg id="b9b" t={t} a="#1F3A4A" b="#6AB0A8">
            <Motorbike x={560} y={900} s={2.4} facing={1} color="#B8483E" />
          </SwipeBg>
          <rect x={-300} y={950} width={2600} height={400} fill="#33414A" />
          <CardTerminal x={1250} y={990} s={1.6} k={k} />
        </g>
      ) : null}
      {seg === 2 ? (
        <g transform={camT(960, 330, 2.1 + k * 0.01)}>
          <SwipeBg id="b9c" t={t} a="#2A2A3A" b="#7A6A5A" />
          <rect x={-300} y={1000} width={2600} height={500} fill="#3A3238" />
          <CardTerminal x={960} y={1010} s={1.7} k={k} handScale={3} />
        </g>
      ) : null}
      {k > 9 && k < 14 ? <rect x={0} y={0} width={1920} height={1080} fill="#E9FFF2" opacity={0.12} /> : null}
    </g>
  );
};
