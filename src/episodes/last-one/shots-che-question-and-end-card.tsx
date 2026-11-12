import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, camT, backOut, LOOKS, Glow, FONT, ShotProps,
} from '../../engine';
import { NightRoof, BigRedButton, Motes, WindStreaks } from './che-night-props';
import { RoofCat, parapetSit } from './shots-che-ending-night-city';

// Chapter E, the last words: "Vậy, bạn sẽ nói chuyện với ai?" (E31: he turns to the cat, the cat blinks) and the end
// card (E32, E33): the roof at night, the button glowing small at the side, the two closing questions, a fade to black.

const PIP = LOOKS.pipHood;
const PARAPET = 790;

// ---------- E31: close-up: Pip turns from the dark city to the cat beside him; the cat blinks ----------
export const E31: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.3;
  const head = { x: 700, y: 470 };
  const turn = easeOut(clamp((t - 12) / 20));
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y + 176 * sc, scale: sc, yaw: 0.05 + 0.8 * turn, facing: 1, headTilt: 3 * turn,
    look: 0.2 + 0.7 * turn, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, sway: 4,
    ...faceAt(t, [[0, 'worried'], [32, 'neutral']]),
  };
  const catBlink = t >= 52 && t < 57;
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform="translate(-300 -200) scale(1.4)">
          <NightRoof t={t + 400} low={0} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#05030C" opacity={0.25} />
      <RoofCat x={1400} y={930} s={2.6} mood={catBlink ? 'sleep' : 'alert'} f={t} />
      <Hero look={PIP} pose={{ ...pose, blink: pose.blink }} rimId="rimBlue" shadow={0} />
      <Glow x={1400} y={780} r={420} kind="cool" o={0.12} />
    </g>
  );
};

/** The end card's text, on the screen (not the world): line 1 pops at `t1`, line 2 at `t2` (null: not yet), BẤM pulses at `pulseAt`. */
const EndText: React.FC<{ t: number; t1: number; t2: number | null; pulseAt?: number }> = ({ t, t1, t2, pulseAt = 0 }) => {
  const p1 = backOut(clamp((t - t1) / 9));
  const p2 = t2 === null ? 0 : backOut(clamp((t - t2) / 9));
  const pulse = pulseAt && t >= pulseAt && t < pulseAt + 12 ? 1 + 0.14 * Math.sin(((t - pulseAt) / 12) * Math.PI) : 1;
  const words = 'BẠN CÓ BẤM NÚT KHÔNG?'.split(' ');
  return (
    <g>
      <g transform={`translate(960 150) scale(${p1})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={68} letterSpacing={3} fill="#F6EFE3" stroke="#120B24" strokeWidth={10} paintOrder="stroke">
          VIỆC ĐẦU TIÊN BẠN SẼ LÀM LÀ GÌ?
        </text>
      </g>
      {p2 > 0 ? (
        <g transform={`translate(960 262) scale(${p2})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={84} fill="#FF8A3D" stroke="#120B24" strokeWidth={12} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 22px rgba(255,138,61,0.5))' }}>
            {words.map((w, i) => (
              <tspan key={i} fill={w === 'BẤM' ? '#FFE27A' : undefined} style={w === 'BẤM' ? { fontSize: 84 * pulse } : undefined}>
                {(i ? ' ' : '') + w}
              </tspan>
            ))}
          </text>
        </g>
      ) : null}
    </g>
  );
};

/** The end card's world: the night roof, Pip and the cat on the parapet at the left, the button glowing on the deck at the right. */
const EndWorld: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <NightRoof t={t + 500} low={0} />
    <RoofCat x={560} y={PARAPET + 2} s={0.85} mood={t % 90 > 84 ? 'peek' : 'sleep'} f={t} />
    <Hero look={PIP} pose={{ ...parapetSit(690, 0.95), look: -0.4, ...faceAt(t, [[0, 'tired']]) }} rimId="rimBlue" shadow={0} />
    <BigRedButton x={1480} y={900} s={0.62} glow={0.95} t={t} id="endb" />
    <Motes t={t} cx={1480} cy={780} r={260} n={26} seed={8} />
    <WindStreaks t={t} n={5} o={0.12} />
  </g>
);

// ---------- E32: end card, wide: the first question over the night roof ----------
export const E32: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <EndWorld t={t} />
    </g>
    <EndText t={t} t1={4} t2={null} />
  </g>
);

// ---------- E33: end card, closer: the second question, the button pulsing, then a soft fade to black ----------
export const E33: React.FC<ShotProps> = ({ t, len }) => {
  const fade = easeOut(clamp((t - (len - 44)) / 40));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1100], [len, 1180]]), kf(t, [[0, 580], [len, 600]]), kf(t, [[0, 1.2], [len, 1.36]]))}>
        <EndWorld t={t + 132} />
      </g>
      <EndText t={t + 132} t1={4} t2={136} pulseAt={132 + 41} />
      <rect x={-10} y={-10} width={1940} height={1100} fill="#000" opacity={fade} />
    </g>
  );
};
