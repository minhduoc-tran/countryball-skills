import React from 'react';
import { Hero, LOOKS, Pose, basePose, walkPose, faceAt, poseAt, kf, clamp, easeOut, easeIn, easeInOut, camT, Foreground, Sparkle, Cat, Street, streetStand, proj, px, ST, joints, toWorld, FONT, ShotProps, backOut } from '../../engine';
import { NEIGHBOUR, GRANNY, Granny } from './kit-cast-figures';
import { MemoryGlow, FlipClock } from './kit-loop-clock';
import { FlowerPot } from './kit-props';
import { WetRoad, RainVeil, HandUmbrella } from './kit-street-rain';
import { Pill } from './che-common-props';
import { NameTag, Ghost } from './che-street-name-tags-and-ghosts';
import { Balcony, BALCONY_LEDGE, Awning } from './che-loop-repeats-from-cha';

// Chapter E, "7 ten years" part 2 (249.65-258.92 s): he knows the street by heart, then calls its seconds.
//   E7 the street, a name tag over every neighbour   E8 cyan "future selves" ahead of them, a minute on each
//   E9 chapter A's balcony: 3-2-1, the cat leaps on his snap   E10 chapter A's sidewalk: the pot smashes, Pip unbothered
//   E11 the 16:00 rain starts on his snap, his umbrella opens
const PIP = LOOKS.pipHood;
const HEADY = -176; // the rig's head centre above the hip at scale 1
const head = (p: { x: number; y: number; scale: number }) => ({ x: p.x, y: p.y + (HEADY - 70) * p.scale });

type Person = { look: typeof PIP; X: number; Z: number; tag: string; yaw: number; side?: boolean; granny?: boolean };
const PEOPLE: Person[] = [
  { look: LOOKS.mo, X: 0.9, Z: 6.0, tag: 'MO', yaw: -0.3 },
  { look: NEIGHBOUR, X: 5.4, Z: 6.6, tag: 'BÁC HÙNG', yaw: -0.5, side: true },
  { look: GRANNY, X: -1.6, Z: 7.6, tag: 'BÀ HẠNH', yaw: 0.4, granny: true },
  { look: LOOKS.mom, X: -5.6, Z: 8.6, tag: 'MẸ', yaw: 0.3, side: true },
  { look: LOOKS.sis, X: 2.9, Z: 10, tag: 'BÉ NA', yaw: -0.2 },
  { look: LOOKS.suit, X: -0.4, Z: 12.5, tag: 'CHÚ TÂM', yaw: -0.4 },
];
const personPose = (p: Person, t: number, i: number): Pose => {
  const s = streetStand(p.X, p.Z, { sidewalk: p.side, k: p.look === LOOKS.sis ? 1.15 : 1.6 });
  return { ...basePose, ...s, yaw: p.yaw, facing: p.yaw < 0 ? -1 : 1, look: p.yaw, headTilt: Math.sin(t / 11 + i) * 3, ...faceAt(t, [[0, i % 2 ? 'happy' : 'neutral']]) };
};

// ---------- E7 "biết tên từng người trong khu phố,": the street, a name pops over every neighbour ----------
export const E7: React.FC<ShotProps> = ({ t, len }) => {
  const pip = { ...basePose, ...streetStand(-3.5, 3.5), yaw: 0.45, facing: 1 as const, look: 0.5, ...faceAt(t, [[0, 'smug']]) };
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 970]]), 640, kf(t, [[0, 1.36], [len, 1.42]]))}>
      <Street t={t + 400} id="e7s" light="green" />
      {PEOPLE.map((p, i) => (p.granny ? <Granny key={i} pose={personPose(p, t, i)} rimId="rimL" /> : <Hero key={i} look={p.look} pose={personPose(p, t, i)} rimId="rimL" />))}
      {PEOPLE.map((p, i) => {
        const h = head(personPose(p, t, i));
        return <NameTag key={`n${i}`} x={h.x} y={h.y - 10} text={p.tag} t={t} at={2 + i * 5} size={24} />;
      })}
      <Hero look={PIP} pose={pip} rimId="rimR" />
      <MemoryGlow x={pip.x} y={pip.y + HEADY * pip.scale} r={62 * pip.scale * 1.5} t={t} id="e7g" o={0.8} />
    </g>
  );
};

// ---------- E8 "và biết họ sẽ làm gì vào từng phút.": their next minutes walk ahead of them as cyan ghosts ----------
export const E8: React.FC<ShotProps> = ({ t, len }) => {
  const z = 5.2;
  const at = (X: number) => streetStand(X, z);
  const nX = kf(t, [[0, -3.4], [len, -1.6]], (x) => x);
  const n0 = at(nX);
  const nb = walkPose(n0.x, t * 0.6, n0.y + 140 * n0.scale, n0.scale, { ...faceAt(t, [[0, 'happy']]) }, 1);
  const ghosts = [-0.9, 0.9, 2.7].map((X, k) => {
    const s = at(X);
    const arm = k === 1 ? { armR: { a: 150, b: 10 } } : k === 2 ? { armL: { a: 40, b: 60 }, headTilt: 10 } : {};
    return { pose: { ...basePose, ...s, yaw: 0.6, facing: 1 as const, look: 0.6, ...arm }, time: `07:${15 + k}` };
  });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 930]]), 690, kf(t, [[0, 1.62], [len, 1.7]]))}>
      <Street t={t + 460} id="e8s" light="green" />
      {ghosts.map((g, k) => (g.pose.x > nb.x + 40 ? <Ghost key={k} look={NEIGHBOUR} pose={g.pose} o={0.5 - k * 0.08} /> : null))}
      <Hero look={NEIGHBOUR} pose={nb} rimId="rimL" />
      <Pill x={nb.x} y={nb.y - 260 * nb.scale} text="07:14" t={t} at={2} size={20} />
      {ghosts.map((g, k) => (g.pose.x > nb.x + 40 ? <Pill key={`p${k}`} x={g.pose.x} y={g.pose.y - 260 * g.pose.scale} text={g.time} t={t} at={8 + k * 8} size={20} col="#A8F3F5" /> : null))}
    </g>
  );
};

// ---------- E9 "Bạn biết chính xác giây nào con mèo nhảy,": chapter A's balcony framing; Pip counts 3-2-1, the cat leaps on his snap ----------
export const E9: React.FC<ShotProps> = ({ t, len }) => {
  const B = BALCONY_LEDGE;
  const leap = clamp((t - 42) / 14);
  const cx = 860 + 700 * leap;
  const cy = B.y - 380 * leap - 160 * Math.sin(leap * Math.PI);
  const pose = poseAt(t, [
    { f: 0, p: { x: 470, y: 1050, scale: 1.9, yaw: 0.55, facing: 1, look: 0.7, headTilt: -8, armR: { a: 40, b: 20 }, armL: { a: 12, b: -6 }, ...faceAt(0, [[0, 'smug']]) } },
    { f: 6, p: { armR: { a: 150, b: 6 }, handR: 'point' }, ease: easeOut },
    { f: 38, p: { armR: { a: 156, b: -4 } } },
    { f: 42, p: { armR: { a: 140, b: 30 } }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const n = t < 14 ? '3' : t < 26 ? '2' : t < 38 ? '1' : '';
  const nAt = t < 14 ? 4 : t < 26 ? 14 : 26;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 420], [len, 400]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Balcony t={t + 50} id="e9b" />
      <FlowerPot x={1060} y={B.y} s={1.15} t={t} fall={0} ledge={false} ground={1400} />
      <g transform={`translate(${cx} ${cy}) rotate(${-24 * Math.sin(leap * Math.PI)}) scale(${leap > 0 ? 1.05 : 1} ${leap > 0 ? 0.9 : 1})`}>
        <Cat x={0} y={0} mood={t > 30 ? 'alert' : 'peek'} f={t + 50} />
      </g>
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      {n ? (
        <g transform={`translate(${hand.x + 110} ${hand.y - 30}) scale(${backOut(clamp((t - nAt) / 6))})`}>
          <circle r={56} fill="#14121F" opacity={0.85} stroke="#A8F3F5" strokeWidth={5} />
          <text y={28} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFE27A">{n}</text>
        </g>
      ) : null}
      {t >= 40 ? <Sparkle x={hand.x} y={hand.y} t={t - 40} s={1.2} /> : null}
    </g>
  );
};

// ---------- E10 "giây nào chậu hoa rơi,": chapter A's sidewalk framing; Pip steps back without looking, the pot smashes ----------
export const E10: React.FC<ShotProps> = ({ t, len }) => {
  const p = streetStand(-5.7, 4.3, { sidewalk: true });
  const land = proj(-4.75, ST.kerb, 3.95);
  const pose = poseAt(t, [
    { f: 0, p: { ...p, x: p.x + 24, yaw: 0.3, facing: 1, look: 0.4, headTilt: -4, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 } } },
    { f: 4, p: { x: p.x - 16, tilt: -3 }, ease: easeOut },
    { f: 14, p: { tilt: 0, headTilt: -2 } },
    { f: len, p: { headTilt: -4 } },
  ]);
  const fall = kf(t, [[0, 0.3], [18, 0.8], [26, 1]], (x) => x);
  const cam = { x: (p.x + land.x) / 2 + 20, y: land.y - 150, z: 2.45 };
  return (
    <g transform={camT(cam.x, cam.y, kf(t, [[0, cam.z], [len, cam.z * 1.04]]))}>
      <Street t={t + 700} id="e10st" veil={0.3} light="red" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'smug']]) }} rimId="rimR" shadow={1} />
      <FlowerPot x={land.x} y={cam.y - 700} s={px(3.95) / 260} t={t} fall={fall} ledge={false} ground={land.y} />
      <g transform={`translate(${cam.x} ${cam.y}) scale(${1 / cam.z}) translate(-960 -540)`}><Awning t={t} /></g>
    </g>
  );
};

// ---------- E11 "và giây nào cơn mưa bắt đầu.": 15:59 -> 16:00 on his snap, the rain falls, his umbrella opens ----------
export const E11: React.FC<ShotProps> = ({ t, len }) => {
  const rain = easeOut(clamp((t - 27) / 12));
  const s = streetStand(-3.2, 3.0);
  const pose = poseAt(t, [
    { f: 0, p: { ...s, yaw: 0.35, facing: 1, look: 0.2, headTilt: -6, armR: { a: 30, b: 14 }, armL: { a: 14, b: -6 }, ...faceAt(0, [[0, 'smug']]) } },
    { f: 16, p: { armR: { a: 70, b: 40 } } },
    { f: 24, p: { armR: { a: 150, b: 10 }, handR: 'point' }, ease: easeOut },
    { f: 28, p: { armR: { a: 156, b: 0 } } },
    { f: 36, p: { armR: { a: 168, b: 2 }, handR: 'open', headTilt: -10 }, ease: easeInOut },
  ]);
  const face = faceAt(t, [[0, 'smug'], [30, 'happy']]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const open = easeOut(clamp((t - 34) / 10));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 800], [len, 780]]), 640, kf(t, [[0, 1.3], [len, 1.38]]))}>
        <Street t={t + 520} id="e11s" light="red" />
        <WetRoad t={t} id="e11w" amount={rain} />
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" />
        {t >= 30 ? <HandUmbrella x={hand.x} y={hand.y} s={pose.scale * 1.1} t={t} open={open} rot={10} /> : null}
        {t >= 24 && t < 40 ? <Sparkle x={hand.x} y={hand.y - 20} t={t - 26} s={1.2} /> : null}
      </g>
      <RainVeil t={t} id="e11r" amount={rain} />
      <FlipClock x={1580} y={150} s={0.5} time="16:00" from="15:59" flipAt={26} t={t} />
    </g>
  );
};
