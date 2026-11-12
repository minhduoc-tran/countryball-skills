import React from 'react';
import { Hero, faceAt, kf, clamp, easeOut, camT, poseAt, Glow, Dust, Bedroom, AlarmClock, ShotProps, FONT } from '../../engine';
import { StickyNote, SideChip } from './cha-note-and-chip-props';
import { SlideApp, ScreenFrame } from './cha-screen-ui-props';
import { PipDesk, NoteSlapArm, PIP, LID_SPOTS, LID_CENTER, DeskFrame } from './cha-pip-desk-scene';

// Chapter A, the cold open (0:00-11:30): 23:59, the deadline at midnight, one line written; a week ago Pip sticks the
// first "MAI LÀM" note on the laptop with a confident smile; the calendar pages fly, the note stays. Looks: alert on
// A1-A2, night on A3.

// ---------- A1: macro, the bedside clock reads 23:59, red numerals pulsing, the room soft behind ----------
export const A1: React.FC<ShotProps> = ({ t, len }) => {
  const beat = (t % 12) / 12;
  const pulse = 1 + 0.025 * Math.exp(-beat * 5);
  const text = Math.floor(t / 10) % 2 ? '23 59' : '23:59';
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <g filter="url(#blur16)">
        <g transform="translate(-520 -520) scale(1.9)">
          <Bedroom t={t + 20} id="ca1" clock="23:59" lamp={0.5} crossed={0} />
        </g>
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#0A0814" opacity={0.4} />
      {[0, 1, 2].map((k) => {
        const p = ((t / 22 + k / 3) % 1);
        return <circle key={k} cx={960} cy={560} r={300 + 520 * p} fill="none" stroke="#FF5A3A" strokeWidth={10 * (1 - p)} opacity={0.5 * (1 - p)} />;
      })}
      <g transform={`translate(960 760) scale(${pulse})`}>
        <g transform="scale(3.4)">
          <AlarmClock x={0} y={0} s={1} text={text} on={1} />
        </g>
      </g>
    </g>
  );
};

// ---------- A2: wide, Pip hunched at his desk at 23:59, laptop light on his face, the camera creeping in ----------
export const A2: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'worried'], [30, 'shock']]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 950]]), kf(t, [[0, 540], [len, 580]]), kf(t, [[0, 1.0], [len, 1.3]]))}>
      <PipDesk t={t + 60} id="ca2" clock="23:59" lamp={0.7} face={face}
        pose={{ tilt: 8 + Math.sin(t / 5) * 1.5, headTilt: Math.sin(t / 9) * 3, look: 0.4, yaw: 0.35 }}
        notes={[LID_SPOTS[0]]} />
      <DeskFrame />
    </g>
  );
};

// ---------- A3: the slide: one line typed, "Hệ mặt trời là...", the caret blinking, the deadline pressing in ----------
export const A3: React.FC<ShotProps> = ({ t, len }) => {
  const full = 'Hệ mặt trời là...';
  const chars = Math.min(full.length, 6 + Math.floor(t * 0.6));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 930]]), kf(t, [[0, 540], [len, 480]]), kf(t, [[0, 1.0], [len, 1.2]]))}>
      <ScreenFrame>
        <SlideApp t={t} text={full.slice(0, chars)} thumbs={6} />
      </ScreenFrame>
    </g>
  );
};

// ---------- A4: a week ago (flashback): morning light, Pip leans back with his hands behind his head ----------
export const A4: React.FC<ShotProps> = ({ t, len, f }) => {
  const pose = poseAt(t, [
    { f: 0, p: { tilt: 0, yaw: 0.3, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: 0 } },
    { f: 12, p: { tilt: -7, headTilt: -3, armR: { a: 104, b: 96 } }, ease: easeOut },
  ]);
  const face = faceAt(t, [[0, 'neutral'], [8, 'smug']]);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 940], [len, 960]]), kf(t, [[0, 600], [len, 580]]), kf(t, [[0, 1.3], [len, 1.5]]))}>
        <PipDesk t={t} id="ca4" day pose={pose} face={face} clock="08:15" />
        <rect x={0} y={0} width={1920} height={1080} fill="#FFD9A0" opacity={0.08} style={{ mixBlendMode: 'soft-light' }} />
      </g>
      <SideChip label="1 TUẦN TRƯỚC" f={f} />
    </g>
  );
};

// ---------- A5: the promise: Pip's hand slaps the first note on the lid on "Mai làm" (frame 17) and he grins ----------
export const A5: React.FC<ShotProps> = ({ t, len, f }) => {
  const slap = 17;
  const face = faceAt(t, [[0, 'smug'], [slap + 2, 'happy']]);
  const pose = poseAt(t, [
    { f: 0, p: { tilt: -2, yaw: 0.25, headTilt: -2 } },
    { f: slap - 4, p: { tilt: 5, headTilt: 3 }, ease: easeOut },
    { f: slap + 8, p: { tilt: 1, headTilt: -3 } },
  ]);
  const placed = t >= slap ? [{ ...LID_SPOTS[0], pop: clamp((t - slap) / 5) }] : [];
  return (
    <g>
      <g transform={camT(kf(t, [[0, 975], [len, 965]]), kf(t, [[0, 610], [len, 600]]), kf(t, [[0, 1.65], [len, 1.8]]))}>
        <PipDesk t={t + 30} id="ca5" day pose={pose} face={face} clock="08:15" notes={placed} front={<NoteSlapArm t={t} slapAt={slap} pose={pose} />} />
        <rect x={0} y={0} width={1920} height={1080} fill="#FFD9A0" opacity={0.08} style={{ mixBlendMode: 'soft-light' }} />
        {t >= slap && t < slap + 8 ? <circle cx={LID_CENTER.x} cy={LID_CENTER.y} r={40 + (t - slap) * 14} fill="none" stroke="#FFF1B8" strokeWidth={6} opacity={1 - (t - slap) / 8} /> : null}
      </g>
      <SideChip label="1 TUẦN TRƯỚC" f={f} />
    </g>
  );
};

// ---------- A6: "that tomorrow never came": the calendar's pages flip away, the note on the lid curls and stays ----------
const PageNo: React.FC<{ n: number; red?: boolean }> = ({ n, red }) => (
  <g>
    <rect width={520} height={560} fill="#F2ECDD" />
    <rect width={520} height={96} fill="#D9534F" />
    {[70, 150, 230, 310, 390, 450].map((x) => <rect key={x} x={x - 10} y={-18} width={14} height={50} rx={7} fill="#2A2630" />)}
    <text x={260} y={66} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FFE7E0" letterSpacing={6}>THÁNG 11</text>
    <text x={260} y={400} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={330} fill="#2C2838">{n}</text>
    {red ? <ellipse cx={260} cy={310} rx={200} ry={150} fill="none" stroke="#D93A3A" strokeWidth={14} transform="rotate(-6 260 310)" /> : null}
  </g>
);

export const A6: React.FC<ShotProps> = ({ t, len }) => {
  const step = 8;
  const first = 4;
  const flips = Math.max(0, Math.floor((t - first) / step));
  const shown = Math.min(7, flips);
  const lt = (t - first) % step;
  const flipping = flips < 7 && t >= first;
  const p = flipping ? clamp(lt / (step - 2)) : 0;
  const curl = clamp((t - 6) / 40);
  const day = (flips + (p > 0.5 ? 1 : 0)) % 2 === 0;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 985]]), kf(t, [[0, 540], [len, 560]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-300} y={-300} width={2520} height={1680} fill={day ? '#3A2E46' : '#1E1C34'} />
      <Glow x={640} y={480} r={760} kind={day ? 'warm' : 'cool'} o={0.4} />
      {/* the calendar: the next page waits underneath, the current one tips up and away */}
      <g transform="translate(230 90) scale(1.22)">
        <rect x={14} y={18} width={520} height={560} fill="#000" opacity={0.35} />
        <PageNo n={13 + shown + 1} red={shown + 1 >= 7} />
        {flipping ? (
          <g transform={`translate(0 ${-p * 30}) translate(260 0) scale(1 ${Math.max(0.02, 1 - p)}) translate(-260 0)`}>
            <PageNo n={13 + shown} />
          </g>
        ) : (
          <PageNo n={13 + shown} red={shown >= 7} />
        )}
      </g>
      {/* the laptop lid, bottom right, with the note that is still there */}
      <g transform="translate(1180 560)">
        <path d="M 0 40 L 640 40 L 620 540 L 20 540 Z" fill="#000" opacity={0.35} />
        <path d="M 0 0 L 640 0 L 620 520 L 20 520 Z" fill="#3A3C4C" />
        <path d="M 0 0 L 640 0" stroke="#BFD6FF" strokeWidth={6} opacity={0.8} />
        <StickyNote x={320} y={250} w={290} rot={-6} curl={curl} />
      </g>
      <Dust t={t} seed={44} x0={300} y0={200} w={1300} h={700} n={26} o={0.5} />
    </g>
  );
};
