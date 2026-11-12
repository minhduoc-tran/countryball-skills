import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, walkPose, Glow, Dust, Sparkle, Kitchen, KitchenIsland, KITCHEN, islandTop, stand,
  Tabletop, BEDROOM, LOOKS, toWorld, joints, ShotProps, rnd, settle, Foreground,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { StickyNote } from './cha-note-and-chip-props';
import { ScreenFrame, SlideApp } from './cha-screen-ui-props';
import { DawnBedroom } from '../last-one/shots-cha-morning-bedroom';
import { PipDesk, PIP, LID_SPOTS, LID_CENTER } from './cha-pip-desk-scene';
import { MessyDeskTop, OpenWardrobe, Shirt, DishTower, SudsBasin, Tear } from './cha-chore-props';

// Chapter A, "còn 5 ngày" (31:30-44:40): Pip strides to the desk full of resolve, the desk is a landslide, so he tidies
// it, then the wardrobe, then washes Mum's tower of dishes (she nearly cries), and the slide is still blank.

const NOTES3 = LID_SPOTS.slice(0, 3);

// ---------- A19: wide, morning light: Pip strides in from the left and pumps a fist at the messy desk ----------
export const A19: React.FC<ShotProps> = ({ t, len }) => {
  const x = Math.min(470, 120 + t * 13);
  const walking = t < 27;
  const walk = walkPose(x, t * 0.5, 985, 1.0, { look: 0.4, expr: 'cool' } as never);
  const stand0 = poseAt(t - 27, [
    { f: 0, p: { ...walk, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 }, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 }, tilt: 0, yaw: 0.5, facing: 1 } },
    { f: 7, p: { armR: { a: 156, b: 22 }, tilt: -3 }, ease: easeOut },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 780], [len, 840]]), 580, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <PipDesk t={t + 20} id="ca19" day hidePip notes={NOTES3} mess={0.55} clock="09:30" />
      <Hero look={PIP} pose={{ ...(walking ? walk : stand0), ...faceAt(t, [[0, 'cool'], [30, 'smug']]) }} rimId="rimR" shadow={0.6} />
      <Sparkle x={560} y={640} t={t - 34} s={1.2} />
    </g>
  );
};

// ---------- A20: medium, he drops into the chair, cracks his knuckles, the laptop opens: this time for real ----------
export const A20: React.FC<ShotProps> = ({ t, len }) => {
  const lid = clamp((t - 8) / 10);
  const pose = poseAt(t, [{ f: 0, p: { y: 650, yaw: 0.25, squash: 0 } }, { f: 8, p: { y: 726, squash: 0.12 }, ease: easeOut }, { f: 13, p: { y: 718, squash: 0 } }]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 955]]), kf(t, [[0, 600], [len, 590]]), kf(t, [[0, 1.5], [len, 1.7]]))}>
      <PipDesk t={t + 50} id="ca20" day pose={pose} lid={lid} glow={lid} notes={NOTES3} mess={0.55} clock="09:30"
        face={faceAt(t, [[0, 'neutral'], [12, 'smug']])} />
      {t > 10 ? <Sparkle x={LID_CENTER.x - 90} y={LID_CENTER.y - 100} t={t - 10} s={1.1} /> : null}
    </g>
  );
};

// ---------- A21: top-down: the desk is a landslide of noodle cups, socks, mugs and balled paper ----------
export const A21: React.FC<ShotProps> = ({ t, len }) => {
  const hx = kf(t, [[0, 960], [14, 880], [len, 820]], easeOut);
  const hy = kf(t, [[0, 60], [14, 360], [len, 420]], easeOut);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 540], [len, 560]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Tabletop edge={1300} />
      <MessyDeskTop t={t} />
      <InsertArm x={hx + Math.sin(t / 4) * 6} y={hy} fx={hx + 120} fy={-260} rot={-10} point />
    </g>
  );
};

// ---------- A22: tidy: the desk clears in a sweep, a whip pan to the wardrobe, shirts fly out and stack ----------
const SHIRTS = ['#D9534F', '#E9C46A', '#4A8C86', '#8A6AC9', '#F2A65A', '#5C7CFA'];
const { P } = BEDROOM;
export const A22: React.FC<ShotProps> = ({ t }) => {
  if (t < 25) {
    const mess = clamp(1 - t / 20) * 0.9;
    const sway = Math.sin(t * 0.9) * 10;
    const pan = kf(t, [[0, 960], [19, 960], [25, 1500]]);
    return (
      <g transform={camT(pan, 590, kf(t, [[0, 1.2], [25, 1.3]]))} filter={t >= 21 ? 'url(#blur10)' : undefined}>
        <PipDesk t={t + 10} id="ca22" day notes={NOTES3} mess={mess} clock="10:05" pose={{ tilt: sway, headTilt: -sway / 2 }} face={faceAt(t, [[0, 'happy']])} />
        <Sparkle x={1000} y={650} t={t - 8} s={1.1} />
      </g>
    );
  }
  const u = t - 25;
  const w2 = stand(BEDROOM, 0.7, 0.3, 0.6);
  const swing = Math.sin(u * 0.5);
  const pose = poseAt(0, [{ f: 0, p: { ...w2, yaw: -0.6, armL: { a: 80 + swing * 30, b: 40 }, armR: { a: 20, b: -10 }, tilt: swing * 3 } }]);
  const top = P(0.6, 1, 0.36);
  return (
    <g transform={camT(kf(u, [[0, 1190], [30, 1210]]), 650, kf(u, [[0, 1.5], [30, 1.6]]))} filter={u < 2 ? 'url(#blur6)' : undefined}>
      <DawnBedroom t={t + 40} id="ca22b" clock="10:05" />
      <OpenWardrobe open={clamp(u / 4)} />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      {SHIRTS.map((c, i) => {
        const t0 = 3 + i * 4;
        const k = clamp((u - t0) / 9);
        if (u < t0) return null;
        const a = P(0.87, 0.4, 0.27);
        const b = P(0.6, 1 - 0.04 * i, 0.36);
        return <Shirt key={i} x={a.x + (b.x - a.x) * k} y={a.y + (b.y - a.y) * k - Math.sin(k * Math.PI) * 130} w={70} rot={(1 - k) * (i % 2 ? 70 : -70)} c={c} />;
      })}
      <Sparkle x={top.x} y={top.y - 100} t={u - 24} s={1} />
    </g>
  );
};

// ---------- A23: the kitchen: a tower of dishes, Pip scrubbing a plate at the suds, proud ----------
export const A23: React.FC<ShotProps> = ({ t, len }) => {
  const k = stand(KITCHEN, 0.6, 0.4);
  const tower = islandTop(0.36, 0.5);
  const basin = islandTop(0.62, 0.55);
  const scrub = Math.sin(t * 0.8);
  const pose = poseAt(t, [{ f: 0, p: { ...k, yaw: -0.4, look: -0.3, tilt: 2, armL: { a: 52 + scrub * 8, b: 50 }, armR: { a: 20, b: -10 } } }]);
  const hand = toWorld(pose, joints(pose).armL.end);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 960]]), kf(t, [[0, 640], [len, 650]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Kitchen t={t + 30} id="ca23" />
      <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland u={[0.2, 0.8]} stools={false} />
      <g transform={`translate(${hand.x} ${hand.y})`}>
        <circle r={34} fill="#F4F1EA" stroke="#CFC8BC" strokeWidth={4} /><circle r={22} fill="#E6E0D4" />
        {[[-12, -8, 9], [8, -12, 7], [10, 8, 10]].map(([bx, by, r], i) => <circle key={i} cx={bx} cy={by} r={r} fill="#fff" stroke="#BFD6FF" strokeWidth={2} />)}
      </g>
      <DishTower x={tower.x} y={tower.y + 4} t={t} n={10} s={0.78} />
      <SudsBasin x={basin.x} y={basin.y + 4} t={t} s={0.62} />
      <Glow x={basin.x} y={basin.y - 120} r={260} o={0.25} />
    </g>
  );
};

// ---------- A24: close-up on Mum: hands clasped at her chest, tears welling, a heart floating up ----------
export const A24: React.FC<ShotProps> = ({ t, len }) => {
  const k = stand(KITCHEN, 0.42, 0.4);
  const pose = poseAt(t, [{ f: 0, p: { ...k, yaw: 0.25, look: 0.2, tilt: 0, armL: { a: 14, b: 190 }, armR: { a: 14, b: 190 } } }, { f: 14, p: { headTilt: 5 } }]);
  const eye = (sg: number) => toWorld(pose, { x: pose.yaw * 30 + sg * 21 * (1 - 0.28 * Math.abs(pose.yaw)), y: -164 });
  const hc = toWorld(pose, { x: 40, y: -250 });
  return (
    <g transform={camT(kf(t, [[0, k.x + 10], [len, k.x + 4]]), kf(t, [[0, k.y - 150], [len, k.y - 160]]), kf(t, [[0, 2.6], [len, 2.9]]))}>
      <Kitchen t={t + 80} id="ca24" />
      <Hero look={LOOKS.mom} pose={{ ...pose, ...faceAt(t, [[0, 'neutral'], [8, 'happy']]) }} rimId="rimR" shadow={0} />
      <KitchenIsland u={[0.2, 0.8]} stools={false} />
      {[-1, 1].map((sg) => <Tear key={sg} x={eye(sg).x} y={eye(sg).y + 10} t={t - 6 - (sg > 0 ? 5 : 0)} s={pose.scale} />)}
      <g transform={`translate(${hc.x} ${hc.y - clamp((t - 10) / 24) * 90})`} opacity={clamp((t - 10) / 4) * (1 - clamp((t - 28) / 8))}>
        <path d="M 0 14 C -26 -8 -14 -30 0 -16 C 14 -30 26 -8 0 14 Z" fill="#FF6A7A" />
      </g>
      <Glow x={k.x} y={k.y - 200} r={280} o={0.3} />
    </g>
  );
};

// ---------- A25: the slide is still white; a caret blinks, a fly circles; the camera creeps in ----------
export const A25: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(kf(t, [[0, 960], [72, 940]]), kf(t, [[0, 540], [72, 510]]), kf(t, [[0, 1.0], [72, 1.16]]))}>
    <ScreenFrame notes={3}>
      <SlideApp t={t} thumbs={1} fly />
    </ScreenFrame>
  </g>
);
