import React from 'react';
import {
  Hero, Pose, basePose, faceAt, kf, clamp, easeOut, backOut, settle, camT, LOOKS, Glow, Dust, Bedroom, BEDROOM, stand, Phone, Sparkle, Foreground, rnd, joints, toWorld, ShotProps,
} from '../../engine';
import { StickyNote, Guitar } from './chc-note-and-object-props';

// Chapter C, "5 one year" (128.78-135.3 s), look "y1": C14 Pip on his phone, a year gone; C15 the guitar he bought to teach himself,
// standing; C16 pull back: it sits in the corner of the room; C17 macro: the dust, a finger swipes a clean streak; C18 MAI TẬP slaps on.

const PIP = LOOKS.pipHood;
const GUITAR_AT = () => BEDROOM.P(0.935, 1, 0.05);

/** A plain corner of the room with a window's light on the wall and a dusty floor, for the guitar close-ups. */
const Corner: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3E3654" /><stop offset="1" stopColor="#4C4260" /></linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1200} fill={`url(#${id}wall)`} />
    <rect x={-400} y={800} width={2720} height={500} fill="#2E2228" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-400 + i * 220} 820 L ${-700 + i * 330} 1200`} stroke="#241A20" strokeWidth={4} />)}
    <rect x={-400} y={770} width={2720} height={34} fill="#231C29" />
    {/* a window's light on the wall: a slanted panel with bars */}
    <g opacity={0.5} style={{ mixBlendMode: 'screen' }}>
      <polygon points="260,120 700,60 760,720 300,780" fill="#FFB46A" opacity={0.35} />
      <path d="M 480 90 L 530 750 M 270 450 L 740 400" stroke="#3E3654" strokeWidth={14} />
    </g>
    <Glow x={480} y={420} r={820} o={0.4} />
    <Dust t={t} seed={11} x0={200} y0={100} w={1000} h={760} n={30} o={0.6} />
  </g>
);

// ---------- C14: medium: a year on, Pip scrolls his phone in the room; the wall calendar flutters; the guitar waits at the edge ----------
export const C14: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.55, 0.3);
  const pose: Pose = {
    ...basePose, x: s.x, y: s.y, scale: s.scale, yaw: 0.45, facing: 1, look: -0.3, headTilt: 6, armL: { a: 12, b: 6 },
    armR: { a: 34, b: 84 + 3 * Math.sin(t / 4) }, ...faceAt(t, [[0, 'neutral'], [24, 'tired']]),
  };
  const g = GUITAR_AT();
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1180]]), 600, kf(t, [[0, 1.45], [len, 1.65]]))}>
      <Bedroom t={t + 120} id="c14bd" lamp={1} crossed={0} />
      <Guitar id="c14g" x={g.x} y={g.y} s={0.3} rot={4} dust={0.5} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <Phone x={hand.x + 6} y={hand.y - 44} w={60} rot={-8} on={0} f={t} />
    </g>
  );
};

// ---------- C15: close: the guitar, standing: a sparkle of newness fades into the first grey ----------
export const C15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 990]]), kf(t, [[0, 520], [len, 480]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Corner t={t + 60} id="c15cn" />
    <Guitar id="c15g" x={960} y={900} s={1.05} rot={4} dust={easeOut(clamp(t / len)) * 0.35} shine={1 - clamp(t / 20)} />
    <Sparkle x={860} y={640} t={t - 2} s={1.4} />
    <Sparkle x={1040} y={420} t={t - 8} s={1.0} />
  </g>
);

// ---------- C16: pull back: the guitar is a small thing in the corner of the room, grey with dust ----------
export const C16: React.FC<ShotProps> = ({ t, len }) => {
  const g = GUITAR_AT();
  return (
    <g transform={camT(kf(t, [[0, 1340], [len, 1260]]), kf(t, [[0, 640], [len, 600]]), kf(t, [[0, 2.3], [len, 1.5]]))}>
      <Bedroom t={t + 150} id="c16bd" lamp={1} crossed={0} />
      <Guitar id="c16g" x={g.x} y={g.y} s={0.3} rot={4} dust={0.9} />
      <Dust t={t} seed={5} x0={1150} y0={400} w={420} h={340} n={20} o={0.7} />
      <Foreground blur={10}>
        <path d="M 560 760 Q 700 700 820 780 L 840 900 L 540 900 Z" fill="#14101C" opacity={0.85} />
      </Foreground>
    </g>
  );
};

// ---------- C17: macro: the dust layer on the guitar's body; a finger drags a clean streak through it ----------
export const C17: React.FC<ShotProps> = ({ t, len }) => {
  const sw = easeOut(clamp((t - 6) / 12));
  // the streak in guitar space runs from x +112 to -112 at about y -160; the guitar sits at (960, 1060) at scale 2.2
  const tipX = 960 + (112 - 224 * sw) * 2.2;
  const tipY = 1060 + (-160 - 16 * sw) * 2.2;
  const out = clamp((t - 20) / 6);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 600, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Corner t={t + 90} id="c17cn" />
      <Guitar id="c17g" x={960} y={1060} s={2.2} rot={0} dust={1} swipe={sw} />
      <g opacity={1 - out} transform={`translate(${out * 160} ${-out * 20})`}>
        <path d={`M 2200 ${tipY - 330} L ${tipX + 30} ${tipY}`} stroke="#2E2B3D" strokeWidth={112} strokeLinecap="round" />
        <circle cx={tipX} cy={tipY} r={64} fill="#F6EFE3" />
        <ellipse cx={tipX - 26} cy={tipY - 52} rx={20} ry={34} fill="#F6EFE3" transform={`rotate(-20 ${tipX - 26} ${tipY - 52})`} />
      </g>
      {Array.from({ length: 16 }).map((_, i) => {
        const k = clamp((t - 8 - i * 0.4) / 16);
        return <circle key={i} cx={tipX + (rnd(2, i) - 0.3) * 160 * k} cy={tipY - 20 - k * (40 + rnd(3, i) * 100)} r={3 + rnd(4, i) * 5} fill="#D6D0C4" opacity={(1 - k) * 0.8 * (sw > 0 ? 1 : 0)} />;
      })}
    </g>
  );
};

// ---------- C18: insert: the MAI TẬP note slaps onto the guitar and sticks, the dust jumping off ----------
export const C18: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 16) / 5));
  const sc = 2.4 - 1.0 * k;
  const puff = clamp((t - 20) / 10);
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.08], [len, 1.18]]))}>
      <Corner t={t + 130} id="c18cn" />
      <Guitar id="c18g" x={960} y={1060} s={2.2} rot={0} dust={1} />
      <StickyNote x={1000} y={720 + settle(t - 21, 10, 1.6, 5)} lines={['MAI', 'TẬP']} s={t < 16 ? 0 : sc * 1.1} rot={-7 + (1 - k) * 18} />
      {Array.from({ length: 14 }).map((_, i) => {
        const a = (i / 14) * Math.PI * 2;
        return <circle key={i} cx={1000 + Math.cos(a) * (120 + puff * 130)} cy={720 + Math.sin(a) * (120 + puff * 110)} r={5 + rnd(6, i) * 6} fill="#D6D0C4" opacity={(1 - puff) * (t > 20 ? 0.8 : 0)} />;
      })}
    </g>
  );
};
