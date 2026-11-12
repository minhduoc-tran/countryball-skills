import React from 'react';
import {
  Hero, poseAt, faceAt, kf, clamp, easeOut, camT, Classroom, SchoolDesk, Glow, Dust, Sparkle, AlarmClock, ShotProps, backOut,
} from '../../engine';
import { TEACHER, SideChip, StickyNote } from './cha-note-and-chip-props';
import { SolarSlide } from './cha-solar-slide-props';
import { ScreenFrame, SlideApp, VideoApp, VideoArt } from './cha-screen-ui-props';
import { PipDesk, NoteSlapArm, PIP, LID_SPOTS, LID_CENTER, DeskFrame } from './cha-pip-desk-scene';

// Chapter A, "còn 7 ngày" (16:40-31:30): the teacher assigns the solar-system talk, "7 days, plenty", Pip opens the
// laptop, one video becomes two and then a handmade-soap video two hours later; "Mai làm" and a second note.

const slideBoard = (t: number) => <g transform="translate(428 198) scale(0.62)"><SolarSlide t={t} /></g>;
const PIP_DESK_X = 1380;
// seated at the school desk in profile, facing the board: thighs forward under the desk, shins down
const SEATED = { x: PIP_DESK_X - 40, y: 838, scale: 0.95, yaw: -0.85, facing: -1 as const, legL: { a: 78, b: -82 }, legR: { a: 78, b: -82 } };

// ---------- A10: wide, the classroom: the teacher at the board points at the slide, Pip at his desk ----------
export const A10: React.FC<ShotProps> = ({ t, len }) => {
  const teacher = poseAt(t, [
    { f: 0, p: { x: 1040, y: 745, scale: 0.82, yaw: -0.7, armR: { a: 12, b: -8 }, armL: { a: 12, b: -8 } } },
    { f: 8, p: { armL: { a: 104, b: -18 }, handL: 'point' }, ease: easeOut },
  ]);
  const pip = poseAt(t, [{ f: 0, p: { ...SEATED, look: -0.5 } }]);
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 960]]), 600, kf(t, [[0, 1.12], [len, 1.22]]))}>
      <Classroom t={t + 60} id="ca10" board={slideBoard(t)} />
      <Hero look={TEACHER} pose={{ ...teacher, ...faceAt(t, [[0, 'neutral'], [12, 'happy']]) }} rimId="rimL" shadow={0.5} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={PIP_DESK_X} />
      <Glow x={740} y={360} r={420} o={0.25} />
      <Dust t={t} seed={12} x0={420} y0={200} w={700} h={520} n={20} o={0.5} />
    </g>
  );
};

// ---------- A11: the slide itself, full frame: the Sun and eight planets drifting in their orbits ----------
export const A11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), kf(t, [[0, 540], [len, 530]]), kf(t, [[0, 1.0], [len, 1.06]]))}>
    <rect x={-300} y={-300} width={2520} height={1680} fill="#241E34" />
    <g transform="translate(210 40) scale(1.5)"><SolarSlide t={t + 20} /></g>
    <rect x={160} y={898} width={1600} height={8} fill="#000" opacity={0.25} />
    <Glow x={960} y={540} r={900} o={0.12} />
  </g>
);

// ---------- A12: close-up, Pip leans back at his desk, hands behind his head: seven days, plenty ----------
export const A12: React.FC<ShotProps> = ({ t, len }) => {
  const pip = poseAt(t, [
    { f: 0, p: { ...SEATED, tilt: 0, look: -0.4, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } } },
    { f: 10, p: { tilt: 8, headTilt: 4, armL: { a: 104, b: 96 } }, ease: easeOut },
    { f: 30, p: { tilt: 11, headTilt: 6 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 1360], [len, 1345]]), kf(t, [[0, 640], [len, 650]]), kf(t, [[0, 2.5], [len, 2.8]]))}>
      <Classroom t={t + 90} id="ca12" board={slideBoard(t)} />
      <Hero look={PIP} pose={{ ...pip, ...faceAt(t, [[0, 'neutral'], [9, 'smug']]) }} rimId="rimL" shadow={0} />
      <SchoolDesk x={PIP_DESK_X} />
      <Sparkle x={1330} y={590} t={t - 14} s={1.3} />
    </g>
  );
};

// ---------- A13: afternoon at home: Pip opens the laptop, the light floods his face ----------
export const A13: React.FC<ShotProps> = ({ t, len }) => {
  const lid = clamp((t - 6) / 12);
  const pose = poseAt(t, [{ f: 0, p: { tilt: 4, yaw: 0.25 } }, { f: 14, p: { tilt: 0, headTilt: -2 } }]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 955]]), kf(t, [[0, 590], [len, 600]]), kf(t, [[0, 1.4], [len, 1.62]]))}>
      <PipDesk t={t + 40} id="ca13" day pose={pose} lid={lid} glow={lid} clock="16:40"
        face={faceAt(t, [[0, 'cool'], [18, 'happy']])} />
      {lid > 0.5 ? <Sparkle x={LID_CENTER.x + 70} y={LID_CENTER.y - 90} t={t - 12} s={1} /> : null}
    </g>
  );
};

// ---------- cursor used on the screens ----------
const Cursor: React.FC<{ x: number; y: number; click?: number }> = ({ x, y, click = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    {click > 0 && click < 1 ? <circle r={10 + 50 * click} fill="none" stroke="#9FC0FF" strokeWidth={5} opacity={1 - click} /> : null}
    <path d="M 0 0 L 0 46 L 12 36 L 22 58 L 32 53 L 22 32 L 38 31 Z" fill="#fff" stroke="#1B1B24" strokeWidth={3} strokeLinejoin="round" />
  </g>
);

// ---------- A14: the slide waits; a video window pops over it and starts to play ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t - 8) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <ScreenFrame>
        <SlideApp t={t} thumbs={1} />
        <g transform={`translate(800 450) scale(${Math.max(0.01, pop)}) translate(-800 -450)`} opacity={clamp((t - 7) / 3)}>
          <VideoApp t={t} art={0} p={0.04 + (t / len) * 0.2} side={[1, 2, 4]} playing={t > 14} />
        </g>
      </ScreenFrame>
      <Cursor x={kf(t, [[0, 1100], [8, 480]], easeOut) + 160} y={kf(t, [[0, 700], [8, 380]], easeOut) + 90} click={clamp((t - 6) / 8)} />
    </g>
  );
};

// ---------- A15: the rabbit hole: video cards nested inside each other, the camera falling in ----------
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const prog = (t / len) * 2.6;
  const cards = [-1, 0, 1, 2, 3].map((k) => ({ k, s: Math.pow(3.2, k - prog % 1) , idx: k + Math.floor(prog) }));
  return (
    <g>
      <rect x={-300} y={-300} width={2520} height={1680} fill="#14121C" />
      <g transform={`translate(960 540) rotate(${prog * 7})`}>
        {cards.sort((a, b) => b.s - a.s).map((c) => (
          <g key={c.k} transform={`scale(${c.s})`} opacity={clamp(1.6 - c.s * 0.08) * clamp(c.s * 4)}>
            <rect x={-520} y={-296} width={1040} height={592} rx={22} fill="#24222E" />
            <g transform="translate(-500 -281) scale(3.125)"><clipPath id={`rh${c.k + 1}`}><rect width={320} height={180} rx={6} /></clipPath><g clipPath={`url(#rh${c.k + 1})`}><VideoArt idx={c.idx} t={t} /></g></g>
            <circle r={44} fill="#000" opacity={0.45} /><path d="M -14 -26 L -14 26 L 30 0 Z" fill="#fff" />
          </g>
        ))}
      </g>
      <Cursor x={1020} y={620} click={((t % 14) / 14)} />
      <circle cx={960} cy={540} r={900} fill="none" stroke="#14121C" strokeWidth={500} opacity={0.5} />
    </g>
  );
};

// ---------- A16: two hours later: day turns to night in the window, the clock jumps, Pip hasn't moved ----------
export const A16: React.FC<ShotProps> = ({ t, len, f }) => {
  const x = clamp((t - 10) / 8);
  const jump = t >= 16;
  const pose = poseAt(t, [{ f: 0, p: { tilt: 6, yaw: 0.25, look: 0.3 } }]);
  const flick = 0.75 + 0.25 * Math.sin(t / 2.3);
  const face = faceAt(t, [[0, 'neutral'], [16, 'tired']]);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 940], [len, 950]]), kf(t, [[0, 600], [len, 600]]), kf(t, [[0, 1.35], [len, 1.5]]))}>
        <PipDesk t={t + 70} id="ca16d" day pose={pose} glow={flick} clock="17:12" face={face} />
        <g opacity={x}><PipDesk t={t + 70} id="ca16n" pose={pose} glow={flick} clock="19:12" lamp={0.8} face={face} /></g>
      </g>
      <g transform="translate(330 840) scale(1.15)" opacity={clamp((t - 2) / 4)}>
        <rect x={-150} y={-150} width={300} height={170} rx={18} fill="#0B0816" opacity={0.5} />
        <AlarmClock x={0} y={0} s={1} text={jump ? '19:12' : '17:12'} on={1} />
      </g>
      <SideChip label="2 GIỜ SAU" f={f} y={160} />
    </g>
  );
};

// ---------- A17: the video, close: a pink block of soap sliced into cubes, the cat long forgotten ----------
export const A17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 720]]), kf(t, [[0, 470], [len, 480]]), kf(t, [[0, 1.55], [len, 1.8]]))}>
    <ScreenFrame>
      <VideoApp t={t * 1.4} art={4} p={0.55 + (t / len) * 0.05} side={[0, 2, 3]} playing />
    </ScreenFrame>
    {[0, 1, 2, 3, 4].map((i) => {
      const k = (t * 0.5 + i * 11) % 40;
      return <circle key={i} cx={420 + i * 120 + Math.sin(t / 9 + i) * 20} cy={620 - k * 14} r={10 + (i % 3) * 5} fill="none" stroke="#fff" strokeWidth={3} opacity={0.5 * (1 - k / 40)} />;
    })}
  </g>
);

// ---------- A18: he sighs and sticks the second note: "Mai làm" lands on frame 19 ----------
export const A18: React.FC<ShotProps> = ({ t, len, f }) => {
  const slap = 19;
  const face = faceAt(t, [[0, 'tired'], [8, 'oops'], [slap + 2, 'smug']]);
  const pose = poseAt(t, [{ f: 0, p: { tilt: 2, yaw: 0.25, headTilt: 3 } }, { f: slap - 4, p: { tilt: 6, headTilt: 4 }, ease: easeOut }, { f: slap + 8, p: { tilt: 1, headTilt: -3 } }]);
  const notes = [LID_SPOTS[0], ...(t >= slap ? [{ ...LID_SPOTS[1], pop: clamp((t - slap) / 5) }] : [])];
  return (
    <g>
      <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 610], [len, 600]]), kf(t, [[0, 1.65], [len, 1.8]]))}>
        <PipDesk t={t + 30} id="ca18" pose={pose} face={face} clock="19:12" lamp={0.8} notes={notes}
          front={<NoteSlapArm t={t} slapAt={slap} pose={pose} target={LID_SPOTS[1]} />} />
        <DeskFrame o={0.3} />
      </g>
    </g>
  );
};
