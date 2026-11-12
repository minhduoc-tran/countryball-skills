import React from 'react';
import { Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, camT, LOOKS, Glow, Kitchen, KitchenIsland, KITCHEN, stand, islandTop, joints, toWorld, ShotProps } from '../../engine';
import { MorningBedroom, BedDuvet, MB, bedSit } from './kit-morning-bedroom';
import { AlarmInsert } from './kit-alarm-insert';
import { MemoryGlow } from './kit-rewind-fx';
import { WallTv } from './cha-screens-and-bubbles';
import { Spoon } from './cha-places-props';

// Chapter A, the cold open (0:00-14.1 s): 06:00, the alarm rings, Pip's hand slaps it (the loop's recurring alarm
// framing), mum calls from the kitchen, the TV forecast says "16:00 MƯA LỚN", Pip freezes with his spoon: déjà vu,
// and yesterday's identical frame slides over today's (memory look).
const PIP = LOOKS.pipHood;
/** World point -> screen point for a camT(cx, cy, z) camera (for screen-space overlays like MemoryGlow). */
export const toScreen = (cx: number, cy: number, z: number, p: { x: number; y: number }) => ({ x: 960 + (p.x - cx) * z, y: 540 + (p.y - cy) * z });

/** Pip asleep: head on the pillow, the duvet up to his chin (draw the room with duvet={false} first). */
export const SleepingPip: React.FC<{ t: number; stir?: number }> = ({ t, stir = 0 }) => {
  const b = bedSit(0.13);
  const pose: Pose = poseAt(t, [{ f: 0, p: { x: b.x, y: b.y + 34 * b.scale * 1.6, scale: b.scale, yaw: 0.25, headTilt: -24 + Math.sin(t / 20) * 2, tilt: 0, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, look: 0.2 } }]);
  return (
    <g>
      <Hero look={PIP} pose={{ ...pose, expr: 'tired', blink: stir > 0.5 ? 0.4 : 1, headTilt: pose.headTilt + stir * 10 }} rimId="rimR" shadow={0} />
      <BedDuvet from={0.095} />
    </g>
  );
};

// ---------- A1: wide, Pip's room at 06:00, peach dawn in the window, the clock ringing, Pip asleep ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 920]]), kf(t, [[0, 545], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <MorningBedroom t={t} id="ca1" dawn={1} ring={t > 22 ? 1 : 0} duvet={false} />
    <SleepingPip t={t} stir={clamp((t - 40) / 10)} />
  </g>
);

// ---------- A2: insert, the alarm clock big; Pip's hand comes from the bed side and slaps the snooze bar ----------
export const A2: React.FC<ShotProps> = ({ t }) => (
  <AlarmInsert id="ca2" t={t + 66} clock="06:00" ring={t < 19 ? 1 : 0} hand={kf(t, [[0, 0], [7, 0.02], [17, 0.88], [19, 1], [52, 1], [64, 0.7]], (x) => x)} dawn={1} />
);

// Kitchen marks shared by A3, A5, A6, A10
export const MUM_AT = stand(KITCHEN, 0.3, 0.4);
export const PIP_AT = stand(KITCHEN, 0.62, 0.4);
export const TV = { x: 1250, y: 470, w: 230 };
/** The kitchen with the TV forecast on the wall over the counter. */
export const KitchenWithTv: React.FC<{ t: number; id: string; type?: number }> = ({ t, id, type = 7 }) => (
  <g>
    <Kitchen t={t} id={id} veil={0.44} />
    <WallTv x={TV.x} y={TV.y} w={TV.w} t={t} id={`${id}tv`} type={type} />
    <Glow x={TV.x} y={TV.y} r={200} kind="cool" o={0.45} />
  </g>
);

/** Mum at the hob: optionally calling up the stairs (off left), sound arcs from her mouth. */
const Mum: React.FC<{ t: number; calling?: number }> = ({ t, calling = 0 }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...MUM_AT, yaw: -0.45, look: -0.6, headTilt: -2, armL: { a: 30, b: 40 }, armR: { a: 20, b: 30 } } },
    { f: 6, p: { headTilt: -12 * calling, armL: { a: 30 + 30 * calling, b: 40 + 50 * calling } }, ease: easeOut },
    { f: 60, p: { headTilt: -8 * calling } },
  ]);
  return <Hero look={LOOKS.mom} pose={{ ...pose, ...faceAt(t, [[0, calling ? 'happy' : 'neutral']]) }} rimId="rimR" shadow={0} />;
};
const CallArcs: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const p = ((t / 14 + k / 3) % 1);
      return <path key={k} d={`M ${x - 30 - 90 * p} ${y - 40 - 30 * p} q -26 30 0 64`} stroke="#FFE7B8" strokeWidth={7} fill="none" strokeLinecap="round" opacity={(1 - p) * 0.9 * clamp(t / 4)} />;
    })}
  </g>
);

// ---------- A3: wide, the kitchen: mum at the hob calls up the stairs; the TV forecast glows on the wall ----------
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const head = { x: MUM_AT.x - 20, y: MUM_AT.y - 176 * MUM_AT.scale };
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 960]]), kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 0.98], [len, 1.1]]))}>
      <KitchenWithTv t={t + 20} id="ca3" type={0} />
      <Mum t={t} calling={1} />
      <KitchenIsland u={[0.2, 0.8]} />
      <CallArcs x={head.x} y={head.y} t={t - 4} />
    </g>
  );
};

// ---------- A4: insert, the TV forecast: a rain cloud over the city, 16:00, the banner types MƯA LỚN ----------
export const A4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g filter="url(#blur16)">
      <g transform={camT(TV.x, TV.y + 20, 3.4)}>
        <KitchenWithTv t={t + 90} id="ca4bg" type={0} />
      </g>
    </g>
    <rect x={0} y={0} width={1920} height={1080} fill="#06070E" opacity={0.35} />
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.06]])}) translate(-960 -540)`}>
      <WallTv x={960} y={530} w={1460} t={t} id="ca4" type={(t - 34) / 2.2} />
    </g>
    <Glow x={960} y={540} r={900} kind="cool" o={0.2} />
  </g>
);

/** Pip at the island holding his spoon; `lift` 0..1 raises it toward his mouth. Returns the hand point too. */
export const pipAtIsland = (t: number, lift: number, frozen: boolean): { pose: Pose; hand: { x: number; y: number } } => {
  const pose = poseAt(t, [{ f: 0, p: { ...PIP_AT, yaw: -0.4, look: frozen ? 0.1 : -0.5, headTilt: frozen ? 2 : 6, tilt: 3, armL: { a: 40 + 50 * lift, b: 50 + 40 * lift }, armR: { a: 14, b: -6 } } }]);
  return { pose, hand: toWorld(pose, joints(pose).armL.end) };
};
const Bowl: React.FC<{ id: string }> = () => {
  const p = islandTop(0.58, 0.5);
  return (
    <g transform={`translate(${p.x} ${p.y})`}>
      <ellipse cx={4} cy={4} rx={56} ry={10} fill="#000" opacity={0.35} />
      <path d="M -50 -26 Q -46 10 0 12 Q 46 10 50 -26 Z" fill="#E9E2D2" stroke="#14121C" strokeWidth={4} />
      <ellipse cx={0} cy={-26} rx={50} ry={11} fill="#F4EEDF" stroke="#14121C" strokeWidth={3} />
      {[0, 1].map((k) => <path key={k} d={`M ${-10 + k * 18} -40 q 8 -20 -2 -40`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.3} />)}
    </g>
  );
};
/** The breakfast medium: kitchen, mum blurred at the hob, Pip with his spoon, the bowl. */
const Breakfast: React.FC<{ t: number; id: string; lift: number; frozen: boolean; face: Pose['expr'] }> = ({ t, id, lift, frozen, face }) => {
  const { pose, hand } = pipAtIsland(t, lift, frozen);
  return (
    <g>
      <KitchenWithTv t={t} id={id} />
      <g filter="url(#blur6)"><Mum t={t} /></g>
      <Hero look={PIP} pose={{ ...pose, expr: face, blink: frozen ? 0 : pose.blink }} rimId="rimR" shadow={0} />
      <KitchenIsland u={[0.2, 0.8]} stools={false} />
      <Bowl id={id} />
      <Spoon x={hand.x} y={hand.y} s={PIP_AT.scale * 0.9} rot={-30} />
    </g>
  );
};

// ---------- A5: medium, Pip at breakfast: the spoon stops halfway, he freezes; snap-in on "Quá quen" ----------
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const snap = 36;
  const z = t < snap ? kf(t, [[0, 1.75], [snap, 1.85]]) : kf(t, [[snap, 1.85], [snap + 4, 2.7], [len, 2.8]], easeOut);
  const cy = t < snap ? 560 : kf(t, [[snap, 560], [snap + 4, PIP_AT.y - 170]], easeOut);
  const lift = kf(t, [[0, 0.2], [12, 0.7]], easeOut);
  return (
    <g transform={camT(kf(t, [[0, PIP_AT.x - 120], [snap, PIP_AT.x - 100], [snap + 4, PIP_AT.x - 20]]), cy, z)}>
      <Breakfast t={t + 40} id="ca5" lift={lift} frozen={t > 14} face={t < 14 ? 'happy' : t < snap ? 'neutral' : 'worried'} />
    </g>
  );
};

// ---------- A6: close-up, déjà vu: yesterday's identical frame (sepia ghost) slides over today's and locks on ----------
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const lock = 46;
  const off = kf(t, [[0, 300], [lock, 0]], easeOut);
  const cam = { x: PIP_AT.x - 160, y: PIP_AT.y - 90, z: 1.45 };
  const z = kf(t, [[0, cam.z], [len, cam.z * 1.05]]);
  const headW = toWorld(pipAtIsland(0, 0.7, true).pose, { x: 0, y: -176 });
  const head = toScreen(cam.x, cam.y, z, headW);
  return (
    <g>
      <g transform={camT(cam.x, cam.y, z)}>
        <Breakfast t={80} id="ca6" lift={0.7} frozen face="worried" />
      </g>
      {/* yesterday: the same frame, sepia and translucent, drifting in from the right until it matches exactly */}
      <g opacity={t < lock ? 0.42 : 0.42 * clamp(1 - (t - lock) / 10)} style={{ filter: 'sepia(0.9) brightness(1.15)' }}>
        <g transform={`translate(${off} ${-off * 0.12})`}>
          <g transform={camT(cam.x, cam.y, z)}>
            <Breakfast t={80} id="ca6g" lift={0.7} frozen face="worried" />
          </g>
        </g>
      </g>
      {t >= lock && t < lock + 3 ? <rect width={1920} height={1080} fill="#F4FEFF" opacity={0.35 * (1 - (t - lock) / 3)} /> : null}
      <MemoryGlow x={head.x} y={head.y} r={62 * PIP_AT.scale * z * 1.6} t={t} id="ca6mg" o={clamp((t - lock) / 8)} />
    </g>
  );
};
