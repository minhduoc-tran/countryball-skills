import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, FONT, SodaCan, walkPose, joints, toWorld, Foreground, ShotProps,
} from '../../engine';
import { SweatDrops } from './chb-notes-and-icons';
import { DeskScene, SEAT, ScreenFrame, SlideEditor } from './chb-desk-laptop-and-chat';
import { Squiggle, Printer, SchoolGate, MessyPages, PandaEyes, PopMark } from './chb-night-props';

// Chapter B, the all-nighter (shots B23-B27, look night; B25 also alert): 3:00 awake among energy cans, "Sao Thỗ" with
// a red squiggle, 5:00 the printer is out of ink, 7:00 running to class with panda eyes, holding the messy printout.

const PIP = LOOKS.pipHood;

// ---------- B23: wide: wide awake at 3:00 among a growing row of cans ----------
export const B23: React.FC<ShotProps> = ({ t, len }) => {
  const type = Math.sin(t * 0.9) * 6;
  const pose = poseAt(t, [{ f: 0, p: { ...SEAT, armR: { a: 70, b: -14 }, headTilt: 3 } }]);
  const cans = [940, 986, 1032];
  return (
    <g transform={camT(kf(t, [[0, 1150], [len, 1200]]), 580, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <DeskScene
        t={t}
        id="b23"
        clock={t < 28 ? '01:10' : '03:00'}
        clutter={false}
        pose={{ ...pose, armR: { a: 70 + type, b: -14 }, look: Math.sin(t / 9) * 0.5, ...faceAt(t, [[0, 'shock']]) }}
        over={
          <g>
            {cans.map((cx, i) => (t >= 4 + i * 9 ? <g key={i} transform={`translate(${cx} 750) scale(${1.15 * backOut(clamp((t - 4 - i * 9) / 6))})`}><SodaCan x={0} y={0} s={1} rot={i * 4 - 4} color={['#2F8FD4', '#58B368', '#D94452'][i]} /></g> : null))}
            <PopMark x={1190} y={440} t={t - 28} text="3:00" color="#FFE27A" size={96} />
          </g>
        }
      />
    </g>
  );
};

// ---------- B24: insert: the slide title typed with a typo: "Sao Thỗ" gets a red squiggle ----------
export const B24: React.FC<ShotProps> = ({ t, len }) => {
  const word = 'Sao Thỗ';
  const n = Math.min(word.length, Math.floor(t / 2.6));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), kf(t, [[0, 430], [len, 480]]), kf(t, [[0, 1.05], [len, 1.3]]))}>
      <ScreenFrame id="b24">
        <SlideEditor t={t}>
          <text x={400} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#1F2A55">{word.slice(0, n)}{t % 14 < 9 && n < word.length ? '|' : ''}</text>
          <Squiggle x={236} y={282} w={328} t={t - 30} />
        </SlideEditor>
      </ScreenFrame>
      <Foreground blur={16}>
        <ellipse cx={1900} cy={1060} rx={380} ry={320} fill="#1A1826" />
      </Foreground>
    </g>
  );
};

// ---------- B25: panic (alert look): the printer coughs out blank pages at 5:00 ----------
export const B25: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [
    { f: 0, p: { ...SEAT, armR: { a: 40, b: -10 }, headTilt: 2 } },
    { f: 24, p: { armR: { a: 130, b: -20 }, armL: { a: 120, b: -20 }, headTilt: -6, tilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1430], [len, 1450]]), 650, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <DeskScene t={t} id="b25" clock="05:00" clutter={false} lidOpen={0.6} glow={0.5} pose={{ ...pose, ...faceAt(t, [[0, 'worried'], [24, 'shock']]) }} over={
        <g>
          <Printer x={1740} y={900} s={0.9} t={t} pages={3} />
          <SweatDrops x={1190} y={520} t={t - 20} />
          <PopMark x={1540} y={430} t={t - 30} text="!" size={150} />
        </g>
      } />
    </g>
  );
};

// ---------- B26: sunrise at the school gate: Pip runs in with panda eyes ----------
export const B26: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 240], [len, 1480]], (v) => v);
  const pose = walkPose(x, t * 0.8, 940, 1.3, { yaw: 0.8, tilt: 8, armL: { a: 60, b: -50 }, armR: { a: -60, b: -60 }, look: 0.3 });
  const p2 = { ...pose, ...faceAt(t, [[0, 'tired']]) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1050]]), 560, 1.0)}>
      <SchoolGate t={t} id="b26" />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={x - 150 - i * 55} cy={950 - (t + i * 6) % 8} rx={30 - i * 6} ry={9} fill="#E8D0B0" opacity={0.45 - i * 0.12} />)}
      <Hero look={PIP} pose={p2} rimId="rimR" shadow={0.8} />
      <PandaEyes pose={p2} />
      <g transform="translate(1690 120)">
        <rect x={-120} y={-46} width={240} height={92} rx={46} fill="#0B0816" opacity={0.78} />
        <text y={28} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={68} fill="#F6EFE3">07:00</text>
      </g>
    </g>
  );
};

// ---------- B27: close: he holds the messy printout at arm's length and looks away ----------
export const B27: React.FC<ShotProps> = ({ t, len }) => {
  const away = easeOut(clamp((t - 50) / 14));
  const pose = poseAt(t, [
    { f: 0, p: { x: 800, y: 840, scale: 1.3, yaw: 0.5, look: 0.2, headTilt: -3, armR: { a: 96, b: -14 }, armL: { a: 14, b: -8 }, tilt: 2 } },
    { f: 52, p: { headTilt: -4 } },
    { f: 64, p: { headTilt: -12, tilt: -3, armR: { a: 100, b: -10 } } },
  ]);
  const p2 = { ...pose, ...faceAt(t, [[0, 'tired'], [58, 'oops']]), look: -1 * away + 0.2 * (1 - away), blink: away > 0.9 ? 1 : 0 };
  const hand = toWorld(p2, joints(p2).armR.end);
  return (
    <g transform={camT(1000, 650, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <g filter="url(#blur6)"><SchoolGate t={t} id="b27" /></g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#1A1228" opacity={0.28} />
      <Hero look={PIP} pose={p2} rimId="rimR" shadow={0.6} />
      <PandaEyes pose={p2} />
      <MessyPages x={hand.x + 70} y={hand.y - 40} s={0.9} rot={14 + Math.sin(t / 8) * 2 + away * 10} droop={away} />
      <SweatDrops x={880} y={560} t={t - 20} />
    </g>
  );
};
