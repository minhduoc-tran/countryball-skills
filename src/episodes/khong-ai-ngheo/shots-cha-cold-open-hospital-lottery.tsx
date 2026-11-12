import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, walkPose, joints, toWorld, LOOKS, Street, streetStand, Glow, Dust, Foreground, Sparkle, ShotProps, Pose, LEG_LEN,
} from '../../engine';
import { GRANDMA, DOCTOR, WORKER } from './cast-looks';
import { HospitalLobby, KeyRing, MedBag, SleeveHand, LotteryTray } from './cha-hospital-and-lottery-props';
import { GoldFloor } from './cha-village-and-school-props';

// Chapter A, cold open 2/3 and 3/3 (4.51-11.46 s): the hospital (BEFORE: a man hands his motorbike keys through the fee
// window; AFTER: a doctor hands him medicine, the window shuttered) and the evening alley (BEFORE: grandma sells
// lottery tickets at dusk; AFTER: she folds the tray and walks home early, smiling).

const GROUND = 905;
const hip = (sc: number) => GROUND - LEG_LEN * sc;

const Clerk: React.FC<{ t: number }> = ({ t }) => {
  const pose = poseAt(t, [
    { f: 0, p: { x: 1470, y: 764, scale: 0.95, yaw: -0.2, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 20, p: { armL: { a: 70, b: 6 } }, ease: easeOut },
  ]);
  return <Hero look={LOOKS.suit} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0} />;
};

// ---------- A4: wide, the fee window; a man steps up and hands his motorbike keys through the slot ----------
export const A4: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 960], [14, 1170]], easeOut);
  const base = walkPose(x, t * 0.6, GROUND, 1.0, { yaw: 0.6, look: 0.4, expr: 'worried' });
  const pose: Pose = t < 14 ? base : poseAt(t - 14, [
    { f: 0, p: { ...base, legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 }, armR: { a: 20, b: 0 }, armL: { a: 10, b: -8 } } },
    { f: 8, p: { armR: { a: 96, b: 4 } }, ease: easeOut },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1220]]), 620, kf(t, [[0, 1.0], [len, 1.22]]))}>
      <HospitalLobby t={t} id="a4h" behind={<Clerk t={t} />} />
      <Hero look={WORKER} pose={{ ...pose, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.6} />
      <KeyRing x={hand.x + 8} y={hand.y + 6} s={0.42} rot={0} t={t} />
      <Foreground blur={10}><rect x={-200} y={1000} width={900} height={200} fill="#2A3E3A" /></Foreground>
    </g>
  );
};

// ---------- A5: macro, the keys slide across the counter to the clerk's open hand; the fee slip waits ----------
export const A5: React.FC<ShotProps> = ({ t, len }) => {
  const kx = kf(t, [[0, 760], [26, 1190]], easeOut);
  const ky = kf(t, [[0, 470], [26, 600]], easeOut);
  return (
    <g>
      <g filter="url(#blur16)"><g transform={camT(1300, 600, 1.45)}><HospitalLobby t={t} id="a5h" /></g></g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A1614" opacity={0.3} />
      <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
        <path d="M -200 800 H 2200 V 1300 H -200 Z" fill="#7E5C3A" />
        <path d="M -200 800 H 2200" stroke="#C9A672" strokeWidth={10} />
        <g transform="translate(980 930) rotate(-6)">
          <rect x={-170} y={-70} width={340} height={140} rx={8} fill="#F6F1E4" stroke="#8E8A7E" strokeWidth={4} />
          <rect x={-140} y={-46} width={150} height={14} rx={4} fill="#1F4466" />
          {[0, 1, 2].map((i) => <rect key={i} x={-140} y={-18 + i * 24} width={i === 2 ? 200 : 280} height={9} rx={4} fill="#B5B0A2" />)}
        </g>
        <SleeveHand x={kx - 56} y={ky - 30} fx={kx - 900} fy={ky - 360} sleeve="#E07A2E" rot={-24} s={5} width={104} />
        <KeyRing x={kx} y={ky + 8} s={2.3} rot={8} t={t} />
        <SleeveHand x={1330 + kf(t, [[0, 120], [20, 0]], easeOut)} y={640} fx={2200} fy={900} sleeve="#2B2F3A" skin="#D9C6AE" rot={190} s={4.6} width={104} />
        <Sparkle x={kx + 60} y={ky - 40} t={t - 8} s={1.1} />
      </g>
    </g>
  );
};

// ---------- A6: the new world: the fee window is shuttered, a doctor hands the man a bag of medicine ----------
export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const dPose = poseAt(t, [
    { f: 0, p: { x: 880, y: hip(1.05), scale: 1.05, yaw: 0.5, armL: { a: 10, b: -8 }, armR: { a: 40, b: 4 } } },
    { f: 8, p: { armR: { a: 98, b: 2 } }, ease: easeOut },
  ]);
  const mPose = poseAt(t, [
    { f: 0, p: { x: 1150, y: hip(1.05), scale: 1.05, yaw: -0.5, armL: { a: 30, b: 4 }, armR: { a: 12, b: -8 } } },
    { f: 8, p: { armL: { a: 98, b: 2 } }, ease: easeOut },
    { f: 20, p: { armL: { a: 70, b: 40 }, headTilt: -3 } },
  ]);
  const dh = toWorld(dPose, joints(dPose).armR.end);
  const mh = toWorld(mPose, joints(mPose).armL.end);
  const k = easeOut(clamp((t - 7) / 8));
  const bx = dh.x + (mh.x - dh.x) * k;
  const by = dh.y + (mh.y - dh.y) * k;
  const mk = toWorld(mPose, joints(mPose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), 650, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <HospitalLobby t={t} id="a6h" shutter={1} struck={clamp((t - 2) / 8)} />
      <GoldFloor x0={-100} x1={2000} y={GROUND + 8} t={t} id="a6fl" th={24} />
      <Hero look={DOCTOR} pose={{ ...dPose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.5} />
      <Hero look={WORKER} pose={{ ...mPose, ...faceAt(t, [[0, 'neutral'], [12, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <KeyRing x={mk.x} y={mk.y + 6} s={0.3} rot={Math.sin(t / 6) * 6} t={t} />
      <MedBag x={bx + 4} y={by - 6} s={0.42} rot={-6} />
      <Sparkle x={bx} y={by - 70} t={t - 14} s={1.1} />
      <Glow x={1000} y={640} r={520} o={0.22} />
    </g>
  );
};

// ---------- A7: wide-medium, dusk at the mouth of the alley; grandma stands with her tray of lottery tickets ----------
export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const g = streetStand(-5.6, 4.2, { k: 1.55, sidewalk: true });
  const pose = poseAt(0, [{ f: 0, p: { x: g.x, y: g.y + Math.sin(t / 12) * 1.2, scale: g.scale, yaw: 0.5, armL: { a: 14, b: 20 }, armR: { a: 14, b: 20 }, headTilt: 3 * Math.sin(t / 16) } }]);
  const w = streetStand(-5.3, 8.0, { k: 1.6, sidewalk: true });
  const wk = walkPose(w.x + 300 - t * 4.2, t * 0.6, w.y + LEG_LEN * w.scale, w.scale, { expr: 'tired' }, -1);
  return (
    <g transform={camT(g.x + 150, g.y - 110, kf(t, [[0, 2.0], [len, 2.25]]))}>
      <Street t={t + 40} id="a7st" market={0} />
      <Hero look={WORKER} pose={wk} rimId="rimL" shadow={0.4} />
      <Hero look={GRANDMA} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [26, 'neutral']]) }} rimId="rimL" shadow={0.6} />
      <LotteryTray x={g.x + 44 * g.scale} y={g.y - 34 * g.scale} w={190 * g.scale} t={t} neck={{ x: g.x + 6 * g.scale, y: g.y - 118 * g.scale }} />
    </g>
  );
};

// ---------- A8: medium, she folds the tray, turns and walks home early, smiling, on the golden floor ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.15;
  const gy = 900;
  const fold = easeOut(clamp((t - 4) / 20));
  const walk = clamp((t - 22) / 8);
  const x = 700 + Math.max(0, t - 22) * 8.5;
  const ph = Math.max(0, t - 22) * 0.6;
  const stand: Partial<Pose> = { yaw: 0.5, armL: { a: 20, b: 30 }, armR: { a: 30 - 20 * fold, b: 30 } };
  const pose: Pose = t < 22 ? { ...walkPose(x, 0, gy, sc, stand), legL: { a: 5, b: 0 }, legR: { a: -5, b: 0 } } : walkPose(x, ph, gy, sc, { ...stand, expr: 'happy' });
  const f = faceAt(t, [[0, 'tired'], [20, 'happy']]);
  const cx = kf(t, [[0, 760], [len, 1000]]);
  return (
    <g transform={camT(cx, 640, 1.2)}>
      <g filter="url(#blur6)" transform="translate(-60 0)"><Street t={t + 80} id="a8st" market={0} low={0} /></g>
      <rect x={-400} y={-300} width={2720} height={1700} fill="#FFB36B" opacity={0.1 + 0.1 * walk} style={{ mixBlendMode: 'screen' }} />
      <GoldFloor x0={cx - 1400} x1={cx + 1400} y={gy + 8} t={t} id="a8fl" th={24} />
      <Hero look={GRANDMA} pose={{ ...pose, ...f }} rimId="rimL" shadow={0.5} />
      <LotteryTray x={x + 36 * sc * (1 - fold) + 24 * sc * fold} y={pose.y - 34 * sc * (1 - fold) - 20 * sc * fold} w={190 * sc} fold={fold} t={t} neck={fold < 0.5 ? { x: x + 6 * sc, y: pose.y - 118 * sc } : undefined} />
      <Sparkle x={x + 110} y={pose.y - 250} t={t - 26} s={1.2} />
      <Dust t={t} seed={4} x0={cx - 600} y0={300} w={1200} h={500} n={22} o={0.5} />
    </g>
  );
};
