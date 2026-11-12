import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, clamp, easeOut, backOut, camT, LOOKS, Glow, Sparkle, Street, streetStand, walkPose, joints, toWorld, DrawOn, ShotProps,
} from '../../engine';
import { DawnAlley } from '../tien-vo-han/che-dawn-alley-backdrop';
import { KID_A } from '../tien-vo-han/che-world-icons-and-people';
import { Apron, ArtRoom, Easel, ThoughtBubble, BubbleText, DreamIcon, DreamKind, PopBurst, INK } from './chc-family-props';

// Chapter C, "3 fun: family", part 2 (102.37-110.92 s): C4 Mo drops his night-shift apron, C5 he walks into art class,
// C6 Pip wonders, C7 the dream bubble fills, C8 the money bubble pops and vanishes.

const MO = LOOKS.mo;
const PIP = LOOKS.pipHood;

// ---------- C4: medium, night street: Mo pulls his apron off over his head and lets it fall; he straightens, relieved ----------
export const C4: React.FC<ShotProps> = ({ t, len }) => {
  const M = streetStand(1.0, 4.6);
  const s = M.scale;
  const pose = poseAt(t, [
    { f: 0, p: { x: M.x, y: M.y, scale: s, yaw: 0.3, facing: 1, headTilt: 5, armL: { a: 10, b: 8 }, armR: { a: 10, b: 8 } } },
    { f: 10, p: { armL: { a: 150, b: 20 }, armR: { a: 150, b: 20 }, headTilt: 0 }, ease: easeOut },
    { f: 26, p: { armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 }, headTilt: -4 } },
  ]);
  const lift = easeOut(clamp((t - 8) / 12));
  const fall = clamp((t - 20) / 22);
  const ground = M.y + 140 * s;
  const ax = M.x + 4 * s - lift * 170 * s - fall * 50 * s;
  const ay = M.y - 112 * s - lift * 90 * s + fall * fall * (ground - (M.y - 112 * s - 90 * s) - 100 * s);
  const rot = fall * 80 + lift * -20;
  return (
    <g transform={camT(M.x + 30, M.y - 10, kf(t, [[0, 3.0], [len, 3.3]]))}>
      <Street t={t + 30} id="c5st" night />
      <Hero look={MO} pose={{ ...pose, ...faceAt(t, [[0, 'tired'], [26, 'happy']]) }} rimId="rimBlue" shadow={0} />
      <Apron x={ax} y={ay} s={0.78 * s} rot={rot} />
      <Sparkle x={M.x + 130 * s} y={M.y - 250 * s} t={t - 32} s={1.0} />
    </g>
  );
};

// ---------- C5: art class: Mo steps in, brush up at an easel; the canvas gets a sun ----------
export const C5: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 330], [18, 740], [len, 770]]);
  const walking = t < 18;
  const base = walkPose(x, t * 0.62, 790, 1.15, { yaw: 0.6, facing: 1 });
  const stand: Pose = { ...basePose, x, y: 790 - 140 * 1.15, scale: 1.15, yaw: 0.5, facing: 1, look: 0.4, armL: { a: 10, b: 0 }, armR: { a: 105, b: 10 } };
  const pose: Pose = walking ? { ...base, armR: { a: 40, b: 30 } } : stand;
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 520, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <ArtRoom t={t + 40} id="c6art" />
      <Easel x={1080} y={800} s={1.45}>
        <DrawOn d="M -40 20 Q 0 -30 40 20" t={t - 14} dur={8} color="#E0533F" width={9} />
        <circle cx={0} cy={-18} r={26} fill="#F2C14E" opacity={clamp((t - 18) / 6)} />
        <path d="M -70 30 Q -20 0 70 30" stroke="#3E8C86" strokeWidth={9} fill="none" strokeLinecap="round" opacity={clamp((t - 16) / 6)} />
      </Easel>
      <Easel x={1560} y={810} s={1.3}><path d="M -50 30 L 0 -40 L 50 30 Z" fill="#5A7FD0" /></Easel>
      <Hero look={KID_A} pose={{ ...basePose, x: 1420, y: 640, scale: 0.95, yaw: -0.5, facing: -1, armR: { a: 100 + 8 * Math.sin(t / 4), b: 10 }, ...faceAt(t, [[0, 'happy']]) }} rimId="rimL" shadow={0} />
      <Hero look={MO} pose={{ ...pose, ...faceAt(t, [[0, 'happy']]) }} rimId="rimR" shadow={0} />
      {!walking ? <path d={`M ${hand.x} ${hand.y} l 30 -34`} stroke="#B98557" strokeWidth={8} strokeLinecap="round" /> : null}
      {!walking ? <circle cx={hand.x + 33} cy={hand.y - 38} r={7} fill="#E0533F" /> : null}
    </g>
  );
};

// ---------- the dawn alley, out of focus, with Pip at the left looking up at where his thoughts will be ----------
const PipThinking: React.FC<{ t: number; id: string; pose: Partial<Pose>; faces: [number, 'neutral' | 'happy' | 'worried' | 'smug'][] }> = ({ t, id, pose, faces }) => (
  <g>
    <DawnAlley t={t + 60} id={id} blur={10} cart />
    <Hero look={PIP} pose={{ ...basePose, x: 600, y: 700, scale: 1.55, yaw: 0.45, facing: 1, look: 0.8, headTilt: -5, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, ...pose, ...faceAt(t, faces) }} rimId="rimR" shadow={0} />
  </g>
);

// ---------- C6: medium: Pip, for the first time, looks up and smiles; the thought is coming ----------
export const C6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 780], [len, 740]]), 520, kf(t, [[0, 1.45], [len, 1.7]]))}>
    <PipThinking t={t} id="c7st" pose={{ x: 800, headTilt: kf(t, [[0, 0], [len, -8]]) }} faces={[[0, 'neutral'], [Math.round(len * 0.5), 'happy']]} />
    <Glow x={900} y={380} r={500} o={0.3} />
    {/* three little dots rising: the bubble's first tail */}
    {[0, 1, 2].map((i) => <circle key={i} cx={930 + i * 46} cy={440 - i * 54} r={10 + i * 5} fill="#FFF8EA" stroke={INK} strokeWidth={4} opacity={backOut(clamp((t - 12 - i * 5) / 8))} />)}
  </g>
);

const DREAMS: { k: DreamKind; x: number; y: number }[] = [
  { k: 'rocket', x: 960, y: 380 }, { k: 'brush', x: 1130, y: 390 }, { k: 'steth', x: 1300, y: 380 },
  { k: 'ball', x: 1010, y: 510 }, { k: 'book', x: 1190, y: 520 }, { k: 'star', x: 1360, y: 510 },
];

// ---------- C7: the bubble "Lớn lên con muốn làm gì?" grows and fills with dreams ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const grow = backOut(clamp((t - 2) / 9));
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 1000]]), 460, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <PipThinking t={t} id="c8st" pose={{ x: 600, headTilt: -8 }} faces={[[0, 'happy']]} />
      <g transform={`translate(700 560) scale(${grow}) translate(-700 -560)`}>
        <ThoughtBubble cx={1180} cy={400} w={840} h={520} tx={700} ty={560}>
          <BubbleText x={1180} y={252} lines={['Lớn lên con']} size={50} />
          <BubbleText x={1180} y={304} lines={['muốn làm gì?']} size={52} />
          {DREAMS.map((d, i) => {
            const p = backOut(clamp((t - 10 - i * 4) / 8));
            return <g key={d.k} transform={`translate(${d.x + 20} ${d.y - 6 + 4 * Math.sin(t / 8 + i)}) scale(${p * 1.05})`}><DreamIcon kind={d.k} /></g>;
          })}
        </ThoughtBubble>
      </g>
      {DREAMS.map((d, i) => <Sparkle key={i} x={d.x + 20} y={d.y - 30} t={t - 14 - i * 4} s={0.7} />)}
    </g>
  );
};

// ---------- C8: the second bubble "Nhà mình có đủ tiền không?" pops and vanishes; the dream bubble glows on ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const popAt = 38; // lands in the breath between "mình" and "có"
  const grow = backOut(clamp((t - 14) / 8));
  const wobble = 1 + 0.03 * Math.sin(t / 2.2);
  const gone = t >= popAt;
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 440, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <PipThinking t={t} id="c9st" pose={{ x: 600, headTilt: -6 }} faces={[[0, 'worried'], [popAt + 4, 'happy']]} />
      <ThoughtBubble cx={1330} cy={300} w={680} h={390} tx={700} ty={560}>
        <BubbleText x={1330} y={218} lines={['Lớn lên con']} size={42} />
        <BubbleText x={1330} y={260} lines={['muốn làm gì?']} size={42} />
        {DREAMS.map((d, i) => <g key={d.k} transform={`translate(${1330 + (d.x - 1180) * 0.72 + 20} ${300 + (d.y - 400) * 0.72 + 52}) scale(${0.72 + 0.05 * Math.sin(t / 6 + i)})`}><DreamIcon kind={d.k} /></g>)}
      </ThoughtBubble>
      {!gone && t >= 12 ? (
        <g transform={`translate(1000 650) scale(${grow * wobble}) translate(-1000 -650)`}>
          <ThoughtBubble cx={1000} cy={650} w={560} h={250} tx={760} ty={600} fill="#D5D8E2" stroke="#6A708A">
            <BubbleText x={1000} y={640} lines={['Nhà mình có']} size={46} color="#4A5068" />
            <BubbleText x={1000} y={690} lines={['đủ tiền không?']} size={46} color="#4A5068" />
          </ThoughtBubble>
        </g>
      ) : null}
      <PopBurst x={1000} y={650} t={t - popAt} />
      <Sparkle x={1000} y={650} t={t - popAt - 2} s={1.2} />
    </g>
  );
};
