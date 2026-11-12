import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, Glow, LOOKS, ShotProps, basePose, toWorld, joints, Sparkle,
} from '../../engine';
import { MorningBedroom, roomStand, bedSit, BedDuvet } from './kit-morning-bedroom';
import { RewindWave } from './kit-rewind-fx';
import { ResetClock } from './kit-loop-clock';
import { MegaTicket, Wallet50k } from './kit-props';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { HeadOverlay } from './kit-cast-figures';
import { PAL } from './kit-palette';
import { DrawScreen, TvFrame, Confetti, PartyHat, NUMS } from './chb-lottery-props';

// Chapter B, the jackpot and the reset (B11-B15, 81.91-93.34 s): the six balls match the ticket one by one and the TV
// flips to "≥ 12 TỶ ĐỒNG"; the party at midnight; the ResetClock 23:59 -> 06:00; at 06:00 the ticket dissolves in his
// hand; the wallet holds one 50.000 note again (and a moth).

const PIP = LOOKS.pipHood;

// ---------- B11: insert on the TV: the balls come out and tick off his ticket one by one, then JACKPOT ----------
const TK = { x: 1430, y: 880, s: 1.2, rot: -7 };
export const B11: React.FC<ShotProps> = ({ t, len }) => {
  const reveal = clamp((t - 2) / 4, 0, 6);
  const jack = t >= 26;
  const shakeK = jack ? Math.sin(t * 1.7) * 6 * Math.exp(-(t - 26) / 14) : 0;
  return (
    <g>
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.05]])}) translate(-960 -540)`}>
        <rect x={-20} y={-20} width={1960} height={1120} fill="#1E1824" />
        <TvFrame x={900} y={430} w={1360} id="b11tv" stand={false}>
          <DrawScreen t={jack ? t - 26 : t + 60} id="b11ds" mode={jack ? 'jackpot' : 'drum'} reveal={reveal} />
        </TvFrame>
        <Glow x={900} y={430} r={900} kind={jack ? 'warm' : 'cool'} o={jack ? 0.55 : 0.3} />
        {/* the ticket in Pip's hand, the matched numbers ringed */}
        <g transform={`translate(${shakeK} ${shakeK * 0.5})`}>
          <g transform={`translate(${TK.x} ${TK.y}) rotate(${TK.rot}) scale(${TK.s})`}>
            <MegaTicket x={0} y={0} id="b11tk" nums={NUMS} />
            {NUMS.map((_, i) => {
              const k = clamp(reveal - i);
              return k > 0 ? <circle key={i} cx={-170 + i * 68} cy={-4} r={34 + 10 * (1 - k)} fill="none" stroke="#2FBF71" strokeWidth={7} opacity={k} /> : null;
            })}
          </g>
          <InsertArm x={TK.x + 262} y={TK.y + 118} fx={2150} fy={1300} rot={128} s={5} width={120} />
        </g>
      </g>
      {jack ? <Confetti t={t - 26} seed={11} n={70} /> : null}
    </g>
  );
};

// ---------- B12: wide, late night in his room: party hat, confetti, Pip bouncing with the ticket held high ----------
export const B12: React.FC<ShotProps> = ({ t, len }) => {
  const st = roomStand(0.56, 0.48);
  const hop = Math.abs(Math.sin(t / 4.5));
  const pose = poseAt(0, [{ f: 0, p: { ...st, y: st.y - hop * 40 * st.scale, yaw: 0.2, squash: hop < 0.2 ? 0.1 : -0.05 * hop, armL: { a: 150 + 10 * Math.sin(t / 3), b: 10 }, armR: { a: 160, b: 6 }, legL: { a: 14 * hop, b: -20 * hop }, legR: { a: -14 * hop, b: 20 * hop } } }]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1000], [len, 1010]]), 590, kf(t, [[0, 1.2], [len, 1.28]]))}>
        <MorningBedroom t={t + 500} id="b12mb" dawn={0} lamp={1} clock="23:47" />
        <Hero look={PIP} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" />
        <HeadOverlay pose={pose}>
          <PartyHat x={18} y={-226} s={0.9} rot={14} />
        </HeadOverlay>
        <MegaTicket x={hand.x + 10} y={hand.y - 30} s={0.22} id="b12tk" rot={-12 + Math.sin(t / 3) * 8} nums={NUMS} />
        <Glow x={hand.x} y={hand.y - 30} r={120} o={0.5} />
      </g>
      <Confetti t={t + 40} seed={21} n={80} />
    </g>
  );
};

// ---------- B13: the reset clock: 23:59 flips to 00:00, spins back in cyan, slams 06:00 THỨ TƯ ----------
const T13 = 20;
export const B13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g filter="url(#blur10)">
      <g transform={camT(1000, 590, 1.3)}>
        <MorningBedroom t={t + 540} id="b13mb" dawn={0} lamp={t < T13 ? 1 : 0} clock={t < T13 ? '23:59' : '00:00'} />
      </g>
    </g>
    <rect x={0} y={0} width={1920} height={1080} fill={PAL.midnight} opacity={0.55} />
    <ResetClock t={t} t0={T13} x={960} y={500} s={1.3} />
    <RewindWave t={t} t0={T13 + 30} id="b13rw" />
  </g>
);

// ---------- B14: 06:00, the same bedroom: Pip sits up holding the ticket and it dissolves into cyan flakes ----------
export const B14: React.FC<ShotProps> = ({ t, len }) => {
  const st = bedSit(0.22);
  const pose = poseAt(t, [
    { f: 0, p: { ...basePose, ...st, yaw: 0.5, look: 0.6, armR: { a: 118, b: -46 }, armL: { a: 10, b: -8 }, headTilt: -4 } },
    { f: 34, p: { armR: { a: 112, b: -52 }, headTilt: -6 } },
    { f: 52, p: { armR: { a: 98, b: -40 }, headTilt: 6, look: 0.8 }, ease: easeOut },
  ]);
  const face = faceAt(t, [[0, 'happy'], [40, 'shock'], [60, 'worried']]);
  const hand = toWorld(pose, joints(pose).armR.end);
  const fade = clamp((t - 35) / 26);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 820], [len, 760]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.9], [len, 2.4]]))}>
        <MorningBedroom t={t + 560} id="b14mb" dawn={1} ring={1} duvet={false} />
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0} />
        <BedDuvet />
        <MegaTicket x={hand.x + 30} y={hand.y - 34} s={0.3} id="b14tk" rot={-8} nums={NUMS} fade={fade} t={t} />
        {fade > 0 && fade < 1 ? <Glow x={hand.x + 30} y={hand.y - 34} r={140} kind="cool" o={0.5 * (1 - fade)} /> : null}
      </g>
      <RewindWave t={t} t0={-5} id="b14rw" />
    </g>
  );
};

// ---------- B15: insert from above on the duvet: the wallet opens on one 50.000 note, a moth flutters out ----------
const Moth: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const k = 0.3 + 0.7 * Math.abs(Math.cos(t * 0.9));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((sd) => <path key={sd} d="M 0 0 Q 30 -40 56 -18 Q 44 12 0 6 Z" transform={`scale(${sd * k} 1)`} fill="#B8AE9C" stroke="#4A4238" strokeWidth={3} />)}
      <ellipse cx={0} cy={4} rx={6} ry={16} fill="#5A5044" />
    </g>
  );
};
export const B15: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp(t / 12));
  const mt = t - 16;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) translate(-960 -540)`}>
      {/* the duvet from above: blue cotton, soft folds, the window's morning light across it */}
      <rect x={-20} y={-20} width={1960} height={1120} fill="#3E4C82" />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M -40 ${120 + i * 160} Q 600 ${60 + i * 170} 1960 ${180 + i * 150}`} stroke="#33406E" strokeWidth={36} fill="none" opacity={0.6} />)}
      <path d="M 1100 -40 L 1960 -40 L 1960 700 L 700 1120 L 300 1120 Z" fill={PAL.dawnGold} opacity={0.16} style={{ mixBlendMode: 'screen' }} />
      <Glow x={1500} y={160} r={700} o={0.45} />
      <g transform={`translate(860 640) scale(${0.5 + 0.5 * open} 1) translate(-860 -640)`}>
        <Wallet50k x={860} y={640} s={2.1} />
      </g>
      {mt > 0 ? <Moth x={700 - mt * 2 + Math.sin(mt / 4) * 40} y={520 - mt * 6 + Math.cos(mt / 3) * 20} t={mt} s={1.4} /> : null}
      {mt > 0 ? [0, 1, 2, 3].map((i) => <circle key={i} cx={640 + i * 34 - mt * 2} cy={540 - mt * (2 + i)} r={6} fill="#D9D0BC" opacity={clamp(1 - mt / 30)} />) : null}
      <InsertArm x={520} y={660} fx={-200} fy={1100} rot={-128} s={5.2} width={124} />
      <Sparkle x={1260} y={260} t={t - 20} s={0.9} />
    </g>
  );
};
