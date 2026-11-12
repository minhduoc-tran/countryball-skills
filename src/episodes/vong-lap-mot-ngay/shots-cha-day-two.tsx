import React from 'react';
import { Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Cat, Street, streetStand, proj, px, ST, joints, toWorld, Foreground, ShotProps } from '../../engine';
import { QuestionMark } from '../khong-ai-ngheo/chd-tv-news-props';
import { MorningBedroom, BedDuvet, bedSit } from './kit-morning-bedroom';
import { FlipClock } from './kit-loop-clock';
import { FlowerPot } from './kit-props';
import { WetRoad, RainVeil, HandUmbrella, XR } from './kit-street-rain';
import { JokeBubble } from './cha-screens-and-bubbles';
import { Balcony, BALCONY_LEDGE } from './cha-places-props';
import { toScreen } from './shots-cha-cold-open';

// Chapter A, day two (33.5-45.0 s): the same 06:00 framing as A1, Pip bolt upright, "am I dreaming?"; Mo tells the
// SAME joke (the same doodle bubble) and Pip mouths it with him; the neighbour's cat tips the same flower pot off the
// balcony; 15:59 flips to 16:00 and the rain starts on the second, Pip's umbrella already opening.
const PIP = LOOKS.pipHood;

// ---------- A15: wide, A1's framing again (day 2): the clock rings, Pip jolts upright, looks round, a "?" ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const pose: Pose = poseAt(t, [
    { f: 0, p: { ...b, yaw: 0.3, look: 0.4, tilt: -10, headTilt: -6, armL: { a: 30, b: -10 }, armR: { a: 30, b: -10 }, squash: -0.08 } },
    { f: 5, p: { tilt: 2, squash: 0.06 }, ease: easeOut },
    { f: 9, p: { squash: 0 } },
    { f: 22, p: { yaw: -0.4, look: -0.8 }, ease: easeOut },
    { f: 40, p: { yaw: 0.45, look: 0.8 }, ease: easeOut },
    { f: len, p: { headTilt: 6 } },
  ]);
  const hd = toWorld(pose, { x: 0, y: -176 });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]), kf(t, [[0, 545], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <MorningBedroom t={t + 30} id="ca15" dawn={1} ring={1} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'shock'], [18, 'worried']]) }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      <QuestionMark x={hd.x + 40} y={hd.y - 90} t={t - 30} s={0.7} />
    </g>
  );
};

/** A shop awning near the lens, top-left, dark and blurred (depth; it also hides the big sign letters). */
const Awning: React.FC<{ t: number }> = ({ t }) => (
  <Foreground blur={10}>
    <path d={`M -60 -60 L 980 -60 L 820 ${200 + Math.sin(t / 20) * 4} Q 400 340 -60 540 Z`} fill="#16121C" />
    <path d={`M 820 ${200 + Math.sin(t / 20) * 4} Q 400 340 -60 540`} stroke="#B8483E" strokeWidth={26} fill="none" opacity={0.8} />
  </Foreground>
);

// Mo and Pip on the left sidewalk, shared by A16
const MO_AT = streetStand(-6.4, 4.7, { sidewalk: true });
const PIP_ST = streetStand(-5.05, 4.6, { sidewalk: true });

// ---------- A16: medium two-shot on the sidewalk: Mo tells THE joke (doodle bubble); Pip mouths it along, word for word ----------
export const A16: React.FC<ShotProps> = ({ t, len }) => {
  const sync = 58;
  const mo = poseAt(t, [
    { f: 0, p: { ...MO_AT, yaw: 0.5, look: 0.6, armL: { a: 20, b: -10 }, armR: { a: 40, b: 60 } } },
    { f: 10, p: { armR: { a: 70, b: 50 }, headTilt: -4 }, ease: easeOut },
    { f: 24, p: { armR: { a: 50, b: 70 }, headTilt: 3 } },
    { f: 40, p: { armR: { a: 76, b: 40 }, headTilt: -5 } },
    { f: len, p: { armR: { a: 60, b: 60 } } },
  ]);
  const pip = poseAt(t, [{ f: 0, p: { ...PIP_ST, yaw: -0.5, look: -0.7, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 } } }, { f: sync, p: { headTilt: -4 }, ease: easeOut }]);
  const cam = { x: (MO_AT.x + PIP_ST.x) / 2 + 90, y: MO_AT.y - 70, z: 1.85 };
  const moH = toWorld(mo, { x: 0, y: -176 });
  const piH = toWorld(pip, { x: 0, y: -176 });
  const ms = toScreen(cam.x, cam.y, cam.z, moH);
  const ps = toScreen(cam.x, cam.y, cam.z, piH);
  return (
    <g>
      <g transform={camT(kf(t, [[0, cam.x - 10], [len, cam.x + 10]]), cam.y, kf(t, [[0, cam.z], [len, cam.z * 1.05]]))}>
        <Street t={t + 600} id="ca16st" veil={0.3} light="red" />
        <Hero look={LOOKS.mo} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={1} />
        <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [sync - 2, t % 8 < 4 ? 'happy' : 'neutral']]) }} rimId="rimL" shadow={1} />
      </g>
      <Awning t={t} />
      <JokeBubble x={ms.x + 40} y={ms.y - 330} t={t - 2} s={1.1} tail={1} />
      <JokeBubble x={ps.x + 300} y={ps.y - 250} t={t - sync} s={0.62} tail={-1} />
    </g>
  );
};

// ---------- A17: low angle up at the neighbour's balcony: the cat butts the flower pot toward the edge, it tips ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => {
  const B = BALCONY_LEDGE;
  const potX = 1060;
  const catX = kf(t, [[0, 820], [24, 900], [34, 930]], easeOut);
  const fall = kf(t, [[0, 0], [30, 0], [len, 0.24]]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 420], [len, 400]]), kf(t, [[0, 1.4], [len, 1.55]]))}>
      <Balcony t={t + 50} id="ca17" />
      <Cat x={catX} y={B.y} mood={t < 20 ? 'peek' : 'alert'} f={t + 50} />
      <FlowerPot x={potX} y={B.y} s={1.15} t={t} fall={fall} ledge={false} ground={1400} />
      <Foreground blur={10}>
        <path d="M -100 1100 L -100 760 Q 120 700 260 760 L 340 1100 Z" fill="#14101A" />
      </Foreground>
    </g>
  );
};

// ---------- A18: the sidewalk by Pip's feet: the pot drops into frame and smashes; Pip had already stepped back ----------
export const A18: React.FC<ShotProps> = ({ t, len }) => {
  const p = streetStand(-5.7, 4.3, { sidewalk: true });
  const land = proj(-4.75, ST.kerb, 3.95);
  const pose = poseAt(t, [
    { f: 0, p: { ...p, x: p.x + 24, yaw: 0.45, look: 0.6, headTilt: 12, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 } } },
    { f: 6, p: { x: p.x - 16, tilt: -5 }, ease: easeOut },
    { f: 32, p: { headTilt: 16, tilt: 0 } },
    { f: len, p: { headTilt: 14 } },
  ]);
  const fall = kf(t, [[0, 0.3], [20, 0.8], [30, 1]], (x) => x);
  const cam = { x: (p.x + land.x) / 2 + 20, y: land.y - 150, z: 2.45 };
  return (
    <g transform={camT(cam.x, cam.y, kf(t, [[0, cam.z], [len, cam.z * 1.04]]))}>
      <Street t={t + 700} id="ca18st" veil={0.3} light="red" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [31, 'worried']]) }} rimId="rimR" shadow={1} />
      <FlowerPot x={land.x} y={cam.y - 700} s={px(3.95) / 260} t={t} fall={fall} ledge={false} ground={land.y} />
      <g transform={`translate(${cam.x} ${cam.y}) scale(${1 / cam.z}) translate(-960 -540)`}><Awning t={t} /></g>
    </g>
  );
};

// ---------- A19: insert, the flip clock against the darkening sky: 15:59 flips to 16:00 on "bốn giờ chiều" ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g filter="url(#blur16)">
      <g transform={camT(960, 420, 1.6)}>
        <Street t={t + 800} id="ca19st" veil={0.3} />
      </g>
    </g>
    <rect x={0} y={0} width={1920} height={1080} fill="#3A4558" opacity={0.25 + 0.25 * clamp(t / len)} style={{ mixBlendMode: 'multiply' }} />
    <rect x={0} y={0} width={1920} height={1080} fill="#0A0E18" opacity={0.3} />
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.05], [len, 1.15]])}) translate(-960 -540)`}>
      <FlipClock x={960} y={540} s={1.25} time="16:00" from="15:59" flipAt={11} t={t} />
    </g>
  </g>
);

// ---------- A20: wide, the crossroads at 16:00: the rain comes down on the second; Pip's umbrella is already opening ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const rain = clamp((t - 10) / 10);
  const p = streetStand(XR.PIP_WATCH.X, XR.PIP_WATCH.Z, { sidewalk: true });
  const pose = poseAt(t, [
    { f: 0, p: { ...p, yaw: 0.35, look: 0.3, headTilt: -10, armL: { a: 10, b: -6 }, armR: { a: 40, b: 70 } } },
    { f: 8, p: { armR: { a: 150, b: 20 } }, ease: easeOut },
    { f: len, p: { headTilt: -4, look: 0.6 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const cam = { x: 680, y: 575, z: kf(t, [[0, 2.7], [len, 2.85]]) };
  const ph = toScreen(cam.x, cam.y, cam.z, toWorld(pose, { x: 0, y: -120 }));
  return (
    <g>
      <g transform={camT(cam.x, cam.y, cam.z)}>
        <Street t={t + 900} id="ca20st" veil={0.34} light="red" />
        <WetRoad t={t} id="ca20wr" amount={rain} />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [16, 'worried']]) }} rimId="rimR" shadow={1} />
        <HandUmbrella x={hand.x} y={hand.y} s={p.scale} t={t} open={clamp((t - 6) / 10)} rot={-6} />
      </g>
      <RainVeil t={t} id="ca20rv" amount={rain} />
      {t >= 26 && t < 29 ? <rect width={1920} height={1080} fill="#E6EEFA" opacity={0.3 * (1 - (t - 26) / 3)} /> : null}
      <Glow x={240} y={300} r={600} kind="cool" o={0.15 * rain} />
      {/* the shop light behind him keeps Pip readable through the rain */}
      <Glow x={ph.x - 60} y={ph.y} r={360} o={0.35 * rain} />
    </g>
  );
};
