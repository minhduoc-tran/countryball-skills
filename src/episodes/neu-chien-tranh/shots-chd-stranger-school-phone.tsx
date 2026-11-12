import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, backOut, camT, LOOKS, LightVeil, Dust, Glow, Foreground, Classroom, Kid, KIDS, CLS,
  joints, toWorld, LEG_LEN, FONT, C, ShotProps,
} from '../../engine';
import { InsertArm } from '../last-one/insert-arm-and-icons';
import { BigPhone } from '../last-one/che-night-props';
import { SpareRoom, Mattresses, Bubble, Squiggle, CLASSMATE_A, CLASSMATE_B, FLOOR } from './chd-spare-room-props';
import { GreyCat } from './chd-children-props';

// Chapter D (200.2-207.5 s), "year one: stranger" (2/2), look y1: D11 the new classroom (faces turning, one waves),
// D12 "một giọng nói khác" (speech bubbles whose squiggles are not his), D13 night in the spare room, Pip opens his
// phone, D14 the chat with Mo: Pip's messages, "Đã gửi", never "Đã xem".

const PIP = LOOKS.pipHood;

// ---------- D11: "Một ngôi trường mới. Những người bạn mới.": over his shoulder, the class turns to look; one waves ----------
const ROWS = [{ w: 0.36, us: [0.3, 0.55] }, { w: 0.54, us: [0.12, 0.36] }];
const SEATS = ROWS.flatMap((row, ri) => row.us.map((u, ui) => {
  const seat = CLS.P(u + 0.07, 1, row.w + 0.1);
  const k = CLS.s(row.w + 0.1) / CLS.s(0.55);
  return { x: seat.x, y: seat.y - 70 * k, s: 0.55 * k, look: KIDS[(ri * 2 + ui) % KIDS.length] };
}));
const TURN_AT = [6, 11, 15, 21];

export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const w = SEATS[3];
  const wave = clamp((t - 36) / 6);
  const sw = Math.sin(t / 3) * 16;
  return (
    <g transform={camT(kf(t, [[0, 640], [len, 680]]), 540, kf(t, [[0, 1.5], [len, 1.66]]))}>
      <Classroom t={t + 40} empty board={<g />} id="d11cls" />
      {SEATS.map((k, i) => (
        <Kid key={i} x={k.x} y={k.y} s={k.s} look={k.look} turn={t >= TURN_AT[i] ? 1 : 0} t={t} />
      ))}
      {wave > 0 ? (
        <g transform={`translate(${w.x} ${w.y}) scale(${w.s})`}>
          <path d={`M 52 -76 Q ${70 + sw * 0.3} -150 ${92 + sw} ${-236 * wave}`} stroke={w.look.top} strokeWidth={26} fill="none" strokeLinecap="round" />
          <circle cx={92 + sw} cy={-236 * wave - 6} r={19} fill={C.skin} />
        </g>
      ) : null}
      <Dust t={t} seed={81} x0={400} y0={250} w={900} h={450} n={20} o={0.5} />
      <Foreground blur={6}>
        <g fill="#0C0A14" stroke="#FFB15A" strokeWidth={5} strokeOpacity={0.35}>
          <circle cx={230} cy={680} r={145} />
          <path d="M 10 1200 L 30 890 Q 230 830 440 900 L 480 1200 Z" />
          <path d="M 160 820 Q 150 900 170 950 M 300 820 Q 310 900 290 950" stroke="#F2B33D" strokeWidth={14} strokeLinecap="round" fill="none" strokeOpacity={0.9} />
        </g>
      </Foreground>
    </g>
  );
};

// ---------- D12: "Một giọng nói khác.": two classmates talk; the squiggles of their speech aren't his ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const pip: Pose = { ...poseAt(t, [{ f: 0, p: { x: 760, y: 900 - LEG_LEN * 1.1, scale: 1.1, yaw: 0.35, facing: 1, armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, headTilt: 2, look: 0.5 } }, { f: 18, p: { headTilt: -8 } }, { f: len, p: { headTilt: -12 } }]), ...faceAt(t, [[0, 'neutral'], [12, 'worried']]) };
  const a: Pose = { ...poseAt(t, [{ f: 0, p: { x: 1260, y: 900 - LEG_LEN * 0.95, scale: 0.95, yaw: -0.5, facing: -1, armL: { a: 14, b: -6 }, armR: { a: 12, b: -6 }, headTilt: -2, look: -0.4 } }, { f: 10, p: { armL: { a: 50, b: 20 }, headTilt: 3 } }]), ...faceAt(t, [[0, 'happy']]) };
  const b: Pose = { ...poseAt(t, [{ f: 0, p: { x: 1560, y: 900 - LEG_LEN * 0.8, scale: 0.8, yaw: -0.6, facing: -1, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 }, headTilt: 3, look: -0.4 } }, { f: 16, p: { headTilt: -3 } }]), ...faceAt(t, [[0, 'happy']]) };
  const popA = backOut(clamp((t - 2) / 6));
  const popB = backOut(clamp((t - 10) / 6));
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), 580, kf(t, [[0, 1.18], [len, 1.28]]))}>
      <g filter="url(#blur10)"><g transform="translate(-230 -90) scale(1.35)"><Classroom t={t + 80} empty board={<g />} id="d12cls" /></g></g>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0814" opacity={0.28} />
      <Hero look={CLASSMATE_B} pose={b} rimId="rimL" shadow={1} />
      <Hero look={CLASSMATE_A} pose={a} rimId="rimL" shadow={1} />
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={1} />
      <Bubble x={954} y={300} w={340} h={170} tail={-1} pop={popA}>
        <Squiggle x={34} y={64} w={270} amp={15} waves={5} p={(t - 4) / 14} color="#D9534F" zig />
        {[70, 120, 170, 220, 270].map((x, i) => <path key={x} d={`M ${x} ${28 - (i % 2) * 6} l 10 -10`} stroke="#D9534F" strokeWidth={6} strokeLinecap="round" opacity={clamp((t - 8 - i) / 3)} />)}
        <Squiggle x={34} y={124} w={170} amp={11} waves={3} p={(t - 12) / 12} color="#D9534F" />
      </Bubble>
      <Bubble x={1308} y={370} w={280} h={160} tail={-1} pop={popB}>
        <Squiggle x={30} y={62} w={220} amp={13} waves={4} p={(t - 12) / 14} color="#3E8C86" />
        <Squiggle x={30} y={118} w={150} amp={10} waves={3} p={(t - 20) / 10} color="#3E8C86" zig />
      </Bubble>
      <g transform={`translate(760 ${430 - Math.sin(t / 5) * 4}) scale(${backOut(clamp((t - 18) / 7))})`}>
        <text textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={130} fill="#F6EFE3" stroke="#14121C" strokeWidth={9} paintOrder="stroke">?</text>
      </g>
      <Dust t={t} seed={82} x0={600} y0={300} w={1100} h={500} n={16} o={0.4} />
    </g>
  );
};

// ---------- D13: "Mỗi tối, bạn mở điện thoại,": dark spare room, the others asleep, his face lit by the screen ----------
export const D13: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.2;
  const pose: Pose = { ...poseAt(t, [{ f: 0, p: { x: 1040, y: FLOOR - 76 * sc, scale: sc, yaw: 0.85, facing: 1, legL: { a: 84, b: -84 }, legR: { a: 88, b: -80 }, armL: { a: 20, b: 30 }, armR: { a: 40, b: 40 }, headTilt: 10, look: 0.6 } }, { f: 20, p: { armR: { a: 66, b: 62 } } }, { f: len, p: { headTilt: 13 } }]), ...faceAt(t, [[0, 'tired']]), blink: t % 70 > 64 ? 0.9 : 0 };
  const hand = toWorld(pose, joints(pose).armR.end);
  const head = toWorld(pose, joints(pose).head);
  const lit = clamp((t - 14) / 10);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 640, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <SpareRoom t={t + 60} id="d13" night={1} />
      <Mattresses x0={150} x1={820} bump />
      <GreyCat x={230} y={FLOOR - 62} s={0.5} t={t} eyes="closed" flip />
      <Mattresses x0={900} x1={1260} />
      <rect x={-400} y={-400} width={2720} height={1880} fill="#04050C" opacity={0.66} />
      <Glow x={hand.x - 40} y={hand.y - 30} r={520 * lit} kind="cool" o={0.85} />
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      <Glow x={head.x + 30} y={head.y + 10} r={300 * lit} kind="cool" o={0.4} />
      <g transform={`translate(${hand.x} ${hand.y}) rotate(-14)`} opacity={lit}>
        <rect x={-34} y={-62} width={68} height={124} rx={12} fill="#1A1922" stroke="#6F8FC8" strokeWidth={3} />
        <rect x={-34} y={-62} width={9} height={124} rx={4} fill="#9FC0FF" opacity={0.7} />
      </g>
      <Dust t={t} seed={83} x0={900} y0={420} w={500} h={400} n={14} o={0.35} />
    </g>
  );
};

// ---------- D14: "chờ một tin nhắn của Mo.": the chat, Pip's messages going out, "Đã gửi", and never "Đã xem" ----------
const Msg: React.FC<{ y: number; w: number; text: string; t: number; at: number }> = ({ y, w, text, t, at }) => {
  const k = backOut(clamp((t - at) / 6));
  if (t < at) return null;
  return (
    <g transform={`translate(${86} ${y}) scale(${k})`}>
      <rect x={-w} y={-12} width={w} height={26} rx={13} fill="#3C78D8" />
      <text x={-w / 2} y={7} textAnchor="middle" fontFamily={FONT.ui} fontSize={12} fill="#FFFFFF">{text}</text>
    </g>
  );
};
export const D14: React.FC<ShotProps> = ({ t, len }) => {
  const dim = kf(t, [[0, 1], [32, 1], [len, 0.55]]);
  return (
    <g transform={`translate(960 540) rotate(${kf(t, [[0, -3], [len, -1]])}) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#05060C" />
      <Glow x={960} y={560} r={900} kind="cool" o={0.28} />
      <InsertArm x={760} y={930} fx={420} fy={1340} rot={-10} s={4.2} width={116} />
      <BigPhone x={960} y={560} w={440} lit={1} id="d14ph">
        <g opacity={dim}>
          <rect x={-100} y={-102} width={200} height={205} fill="#0E1424" />
          <rect x={-100} y={-102} width={200} height={32} fill="#182038" />
          <path d="M -88 -86 l -7 7 l 7 7" stroke="#9FC0FF" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={-62} cy={-86} r={10} fill="#C98E68" />
          <path d="M -72 -88 q 4 -12 10 -10 q 6 -4 12 8" stroke="#2A1C18" strokeWidth={5} fill="none" />
          <text x={-44} y={-81} fontFamily={FONT.ui} fontWeight={700} fontSize={14} fill="#F6EFE3">Mo</text>
          <circle cx={-4} cy={-87} r={3.5} fill="#5A5F72" />
          <Msg y={-44} w={72} text="Mo ơi?" t={t} at={4} />
          <Msg y={-12} w={116} text="Cậu ổn không?" t={t} at={12} />
          <Msg y={20} w={104} text="Cậu ở đâu?" t={t} at={20} />
          <text x={86} y={44} textAnchor="end" fontFamily={FONT.ui} fontSize={9} fill="#7E8DA6" opacity={clamp((t - 27) / 5)}>Đã gửi</text>
          <rect x={-90} y={72} width={180} height={22} rx={11} fill="#182038" />
          <rect x={-78} y={77} width={2.5} height={12} fill="#9FC0FF" opacity={Math.floor(t / 10) % 2 ? 0.9 : 0.1} />
        </g>
      </BigPhone>
      <LightVeil id="d14veil" lights={[[960, 560, 760]]} o={0.3} />
      <Dust t={t} seed={84} x0={500} y0={200} w={900} h={700} n={16} o={0.3} />
    </g>
  );
};
