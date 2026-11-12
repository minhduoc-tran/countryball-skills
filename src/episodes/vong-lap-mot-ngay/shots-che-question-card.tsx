import React from 'react';
import { Hero, LOOKS, Pose, basePose, faceAt, kf, clamp, easeOut, backOut, camT, Sparkle, ShotProps } from '../../engine';
import { MorningBedroom, roomStand, MB } from './kit-morning-bedroom';
import { LoopIcon } from './kit-loop-clock';
import { TearCalendar } from './kit-bedroom-parts';
import { Pill } from './che-common-props';
import { NewSky, CardTitle } from './che-thursday-props';
import { ChoiceCard, LangIcon, TicketIcon, SlowIcon } from './che-question-card-props';

// Chapter E, "8 question" (285.23-297.97 s): the end card in Pip's room on THỨ NĂM (calendar NĂM, a new sky in the
// window). Pip stands at the LEFT; the question at the top, three choices in a row at the middle, the comment line
// below them; the bottom-right stays clear for YouTube's end-screen elements. E27 holds through the 3 s tail.
//   E24 "Còn bạn, nếu phải sống lại một ngày mãi mãi," Pip turns to us; a thought bubble: a loop round THỨ TƯ
//   E25 "bạn sẽ dùng nó để làm gì?" the question   E26 the three choices pop on their words   E27 comment line, wave, hold
const OFF25 = 73; // frames since E24 began (287.65 - 285.23)
const OFF26 = 133; // 289.67
const OFF27 = 264; // 294.02
const PIP = LOOKS.pipHood;
const W = MB.WINDOW;

/** Pip's THỨ NĂM room with Pip at the left. toCam 0 = looking at the window, 1 = at us; wave raises his arm. */
const CardWorld: React.FC<{ T: number; id: string; toCam: number; wave?: number; dim?: number }> = ({ T, id, toCam, wave = 0, dim = 0.3 }) => {
  const st = roomStand(0.13, 0.78);
  const w = Math.sin(T / 4);
  const pip: Pose = {
    ...basePose, ...st, yaw: 0.6 * (1 - toCam) + 0.15 * toCam, facing: 1, look: 0.7 * (1 - toCam),
    headTilt: 3 + Math.sin(T / 12) * 2,
    armR: { a: 12 + 140 * wave + w * 14 * wave, b: -6 + 24 * wave }, armL: { a: 12, b: -4 },
    ...faceAt(T, [[0, 'happy']]),
  };
  return (
    <g>
      <MorningBedroom id={id} t={T + 1200} day="THỨ NĂM" />
      <NewSky id={`${id}ns`} t={T} x0={W.x0} y0={W.y0} w={W.x1 - W.x0} h={W.y1 - W.y0} />
      <g fill="#2A2028">
        <rect x={(W.x0 + W.x1) / 2 - 5} y={W.y0} width={10} height={W.y1 - W.y0} />
        <rect x={W.x0} y={W.y0 + 72} width={W.x1 - W.x0} height={7} />
      </g>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#1A1028" opacity={dim} />
      <Hero look={PIP} pose={pip} rimId="rimR" />
    </g>
  );
};

/** The three choices, popping at their words on the clock T (0 = "Học"). */
const Cards: React.FC<{ T: number }> = ({ T }) => (
  <g>
    <ChoiceCard x={620} y={560} t={T} at={2} lines={['HỌC 1', 'THỨ TIẾNG']}><LangIcon /></ChoiceCard>
    <ChoiceCard x={1000} y={560} t={T} at={34} lines={['TRÚNG SỐ', 'CHO VUI']}><TicketIcon /></ChoiceCard>
    <ChoiceCard x={1380} y={560} t={T} at={67} lines={['SỐNG', 'THẬT CHẬM']}><SlowIcon t={T} /></ChoiceCard>
  </g>
);

const QUESTION: [string, string] = ['BẠN SẼ DÙNG NÓ', 'ĐỂ LÀM GÌ?'];

// ---------- E24: Pip turns to us; a thought bubble: the loop arrow spinning round a THỨ TƯ page ----------
export const E24: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t - 14) / 12));
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 540, kf(t, [[0, 1.12], [len, 1.0]]))}>
      <CardWorld T={t} id="e24w" toCam={easeOut(clamp((t - 2) / 12))} dim={0.15} />
      {t >= 14 ? (
        <g transform={`translate(860 330) scale(${k})`}>
          <circle cx={-250} cy={200} r={22} fill="#FFF6E4" stroke="#14121A" strokeWidth={5} />
          <circle cx={-200} cy={150} r={34} fill="#FFF6E4" stroke="#14121A" strokeWidth={5} />
          <circle r={190} fill="#FFF6E4" stroke="#14121A" strokeWidth={8} />
          <TearCalendar x={0} y={-90} w={120} day="THỨ TƯ" />
          <LoopIcon x={0} y={0} r={140} t={t} spin={-6} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- E25: the bubble pops away, the question lands ----------
export const E25: React.FC<ShotProps> = ({ t, len }) => {
  const gone = clamp(t / 7);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.02]]))}>
      <CardWorld T={t + OFF25} id="e25w" toCam={1} />
      {gone < 1 ? <circle cx={860} cy={330} r={190 * (1 - gone)} fill="#FFF6E4" opacity={1 - gone} stroke="#14121A" strokeWidth={8} /> : null}
      <CardTitle t={t} at={6} lines={QUESTION} />
      <Sparkle x={1500} y={130} t={t - 18} s={1.2} />
    </g>
  );
};

// ---------- E26: HỌC 1 THỨ TIẾNG / TRÚNG SỐ CHO VUI / SỐNG THẬT CHẬM pop on their words ----------
export const E26: React.FC<ShotProps> = ({ t }) => (
  <g transform="translate(960 540) scale(1.02) translate(-960 -540)">
    <CardWorld T={t + OFF26} id="e26w" toCam={1} />
    <CardTitle t={t + 60} at={6} lines={QUESTION} />
    <Cards T={t} />
  </g>
);

// ---------- E27: "Viết ở phần bình luận nhé": the comment line + a typing bubble; Pip waves; holds to the end ----------
export const E27: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t - 18) / 9));
  const push = 1.02 + 0.04 * easeOut(clamp(t / Math.max(1, len)));
  return (
    <g transform={`translate(960 540) scale(${push}) translate(-960 -540)`}>
      <CardWorld T={t + OFF27} id="e27w" toCam={1} wave={easeOut(clamp((t - 4) / 10))} />
      <CardTitle t={t + 200} at={6} lines={QUESTION} />
      <Cards T={t + 131} />
      <Pill x={900} y={830} text="Viết ở phần bình luận nhé" t={t} at={2} size={42} />
      <g transform={`translate(1660 330) scale(${k})`} opacity={t < 18 ? 0 : 1}>
        <path d="M -90 -50 Q -90 -74 -66 -74 L 66 -74 Q 90 -74 90 -50 L 90 26 Q 90 50 66 50 L -20 50 L -60 84 L -52 50 L -66 50 Q -90 50 -90 26 Z" fill="#FFF6E4" stroke="#14121A" strokeWidth={6} strokeLinejoin="round" />
        {[-36, 0, 36].map((dx, i) => <circle key={i} cx={dx} cy={-12 - 12 * Math.max(0, Math.sin(t / 4 - i * 0.9))} r={11} fill="#14121A" />)}
      </g>
      <Sparkle x={1700} y={180} t={(t % 70) - 4} s={1.0} />
      <Sparkle x={250} y={260} t={((t + 30) % 80) - 4} s={0.9} />
    </g>
  );
};
