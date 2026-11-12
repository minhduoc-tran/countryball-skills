import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, ShotProps, Rooftop, Foreground, FocusRings, Tabletop, Glow } from '../../engine';
import { PAL } from './kit-palette';
import { CountPill } from './chd-bed-sound-props';
import { ROOF, roofPose, SpeechBubble, WordBlocks, LoopTalk, AlbumPhoto } from './chd-mo-memory-props';

// CHAPTER D, beat "6 lonely", first half (212.09-225.33 s): "Và rồi, đến điều khó nhất. Bạn kể cho Mo nghe về vòng
// lặp. Lần thứ nhất, Mo cười. Lần thứ mười, Mo tin. Lần thứ năm mươi, bạn biết trước Mo sẽ nói gì, từng chữ. Bạn có
// những kỷ niệm với Mo, mà Mo không hề có."
// On the rooftop at dusk. D16 wide: Pip and Mo at the parapet, Pip hesitating. D17 two-shot: Pip tells him (a bubble
// with the loop icon and 06:00). D18 LẦN #1: close-up, Mo laughing. D19 LẦN #10: over Pip's shoulder, Mo stunned,
// reaching out: he believes. D20 LẦN #50: the two-shot again, both bubbles fill with the SAME words in sync.
// D21 the photo album (memory look): Mo fades out of every photo, Pip's memories stay.

const ROOF_T = { sunX: 1240, sunY: 600 };
const roof = (t: number) => <Rooftop t={t} sunX={ROOF_T.sunX} sunY={ROOF_T.sunY} />;
const ROWS = [[90, 56, 100], [76, 120], [60, 96, 70]];

// ---------- D16: wide on the rooftop at dusk: Pip and Mo at the parapet; Pip looks down, working up to it ----------
export const D16: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: roofPose('pip', { look: 0.2, headTilt: 8, armR: { a: 16, b: -10 } }) },
    { f: 30, p: { headTilt: 6, look: 0.3 } },
    { f: len, p: { headTilt: 0, look: 0.6, armR: { a: 24, b: 20 } } },
  ]);
  const mo = roofPose('mo', { look: -0.7, armL: { a: 12, b: -8 }, armR: { a: 30, b: 40 } });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 955]]), kf(t, [[0, 530], [len, 522]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      {roof(t + 1300)}
      <Hero look={LOOKS.pipHood} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.8} />
      <Hero look={LOOKS.mo} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.8} />
      <Foreground blur={10}>
        <path d="M -100 1180 L -100 900 Q 200 860 420 960 L 520 1180 Z" fill="#0A0812" />
      </Foreground>
    </g>
  );
};

// ---------- D17: two-shot: Pip talks with his hands; his bubble shows the loop icon and 06:00 ----------
export const D17: React.FC<ShotProps> = ({ t, len }) => {
  const pip = roofPose('pip', { armR: { a: 50 + 18 * Math.sin(t / 5), b: 70 }, headTilt: 2 * Math.sin(t / 6) });
  const mo = poseAt(t, [
    { f: 0, p: roofPose('mo', { look: -0.7, armR: { a: 30, b: 40 } }) },
    { f: 30, p: { headTilt: -6 } },
    { f: len, p: { headTilt: -4 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 945]]), 482, kf(t, [[0, 1.85], [len, 1.95]]))}>
      {roof(t + 1360)}
      <Hero look={LOOKS.pipHood} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]) }} rimId="rimR" shadow={0.8} />
      <Hero look={LOOKS.mo} pose={{ ...mo, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimR" shadow={0.8} />
      <SpeechBubble x={900} y={290} w={300} h={140} t={t - 3} tx={830} ty={420}>
        <LoopTalk t={t} />
      </SpeechBubble>
    </g>
  );
};

// ---------- D18: LẦN #1: close-up, Mo throws his head back laughing ----------
export const D18: React.FC<ShotProps> = ({ t, len }) => {
  const shakeL = Math.sin(t * 0.9);
  const mo = roofPose('mo', { headTilt: -14 + 6 * shakeL, tilt: -4 + 2 * shakeL, squash: 0.02 * Math.abs(shakeL), armR: { a: 40, b: 70 }, look: -0.4 });
  const cx = kf(t, [[0, 1080], [len, 1092]]);
  return (
    <g>
      <g transform={camT(cx, 500, kf(t, [[0, 3.2], [len, 3.45]]))}>
        <g filter="url(#blur6)">{roof(t + 1420)}</g>
        <Hero look={LOOKS.mo} pose={{ ...mo, expr: 'happy', blink: 1 }} rimId="rimR" shadow={0} />
        {/* laugh marks bouncing beside his head */}
        {[0, 1, 2].map((k) => (
          <path key={k} d={`M ${1190 + k * 6} ${430 + k * 26} l ${22 + 6 * Math.abs(shakeL)} ${-8 + k * 8}`} stroke={PAL.paper} strokeWidth={5} strokeLinecap="round" opacity={0.9} />
        ))}
        <Foreground blur={16}>
          <circle cx={800} cy={500} r={70} fill="#0A0812" />
          <path d="M 700 1100 L 720 600 Q 800 560 880 600 L 900 1100 Z" fill="#0A0812" />
        </Foreground>
      </g>
      <CountPill t={t + 10} label="LẦN #1" />
    </g>
  );
};

// ---------- D19: LẦN #10: over Pip's shoulder: Mo stunned, then serious; he reaches out: he believes it ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => {
  const mo = poseAt(t, [
    { f: 0, p: roofPose('mo', { look: -0.8, tilt: 4, armL: { a: 10, b: -8 } }) },
    { f: 22, p: { tilt: 0, armL: { a: 10, b: -8 } } },
    { f: 34, p: { tilt: -3, armL: { a: 62, b: 18 } }, ease: easeOut },
    { f: len, p: { armL: { a: 66, b: 16 } } },
  ]);
  const face = faceAt(t, [[0, 'shock'], [24, 'worried']]);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1060], [len, 1070]]), 520, kf(t, [[0, 2.5], [len, 2.7]]))}>
        <g filter="url(#blur3)">{roof(t + 1480)}</g>
        <Hero look={LOOKS.mo} pose={{ ...mo, ...face }} rimId="rimR" shadow={0} />
        <g transform="translate(1110 328) scale(0.45) translate(-1110 -328)">
          <FocusRings x={1110} y={328} t={t - 2} r0={80} />
        </g>
      </g>
      {/* Pip from behind: the big dark blurred shoulder and hood in the foreground */}
      <Foreground blur={16}>
        <circle cx={300} cy={560} r={260} fill="#0C0A14" />
        <path d="M -200 1180 L -120 820 Q 120 700 420 760 Q 640 820 700 1180 Z" fill="#0C0A14" />
        <path d="M 520 420 Q 560 560 520 700" stroke="#FFB46A" strokeWidth={14} fill="none" opacity={0.35} />
      </Foreground>
      <CountPill t={t + 10} label="LẦN #10" />
    </g>
  );
};

// ---------- D20: LẦN #50: the same two-shot: Mo talks, and Pip mouths along; both bubbles fill word for word ----------
export const D20: React.FC<ShotProps> = ({ t, len }) => {
  const bob = Math.sin(t / 3) * 2;
  const pip = roofPose('pip', { look: 0.4, headTilt: -3, armR: { a: 14, b: -6 }, y: ROOF.feet - 140 + bob * 0.5 });
  const mo = roofPose('mo', { look: -0.6, armR: { a: 56 + 14 * Math.sin(t / 4), b: 70 }, y: ROOF.feet - 140 + bob });
  const sync = backOut(clamp((t - 62) / 8));
  return (
    <g>
      <g transform={camT(950, 470, kf(t, [[0, 1.85], [len, 1.92]]))}>
        {roof(t + 1540)}
        <Hero look={LOOKS.pipHood} pose={{ ...pip, expr: 'tired', blink: 0.25 }} rimId="rimR" shadow={0.8} />
        <Hero look={LOOKS.mo} pose={{ ...mo, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0.8} />
        <SpeechBubble x={745} y={348} w={310} h={150} t={t - 2} tx={790} ty={438}>
          <WordBlocks t={t - 8} rows={ROWS} step={7} color="#2E6E8A" />
        </SpeechBubble>
        <SpeechBubble x={1155} y={348} w={310} h={150} t={t - 2} tx={1110} ty={438}>
          <WordBlocks t={t - 8} rows={ROWS} step={7} color="#2E6E8A" />
        </SpeechBubble>
        <g transform={`translate(950 348) scale(${sync * 0.75})`}>
          <circle r={40} fill={PAL.cyan} stroke="#14121C" strokeWidth={5} />
          <path d="M -18 -8 L 18 -8 M -18 8 L 18 8" stroke="#14121C" strokeWidth={7} strokeLinecap="round" />
        </g>
      </g>
      <CountPill t={t + 10} label="LẦN #50" />
    </g>
  );
};

// ---------- D21: top-down on the photo album (memory look): Mo fades out of every photo; Pip's memories stay ----------
export const D21: React.FC<ShotProps> = ({ t, len }) => {
  const fade = (k: number) => easeOut(clamp((t - 44 - k * 4) / 16));
  const z = kf(t, [[0, 1], [len, 1.08]]);
  return (
    <g transform={`translate(960 540) scale(${z}) rotate(${kf(t, [[0, -2], [len, -1]])}) translate(-960 -540)`}>
      <Tabletop edge={1500} wood="#5A4038" grain="#4C3630" lip="#6A4C42" />
      <Glow x={1300} y={160} r={900} o={0.45} />
      {/* the album: cover, two pages, the spine */}
      <rect x={210} y={150} width={1500} height={800} rx={22} fill="#5A2E36" stroke="#14121C" strokeWidth={6} />
      <rect x={240} y={175} width={715} height={750} rx={8} fill="#EDE3CC" />
      <rect x={965} y={175} width={715} height={750} rx={8} fill="#F3EAD6" />
      <rect x={940} y={175} width={40} height={750} fill="#000" opacity={0.18} />
      <AlbumPhoto x={590} y={355} w={330} h={230} rot={-4} mo={fade(0)} t={t} id="d21a" kind={0} />
      <AlbumPhoto x={615} y={715} w={330} h={230} rot={3} mo={fade(1)} t={t} id="d21b" kind={1} />
      <AlbumPhoto x={1320} y={365} w={330} h={230} rot={4} mo={fade(2)} t={t} id="d21c" kind={2} />
      <AlbumPhoto x={1300} y={720} w={330} h={230} rot={-3} mo={fade(3)} t={t} id="d21d" kind={3} />
    </g>
  );
};
