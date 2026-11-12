import React from 'react';
import {
  Hero, Pose, basePose, poseAt, kf, clamp, easeOut, camT, LOOKS, rnd, FONT,
  Study, Desk, Glow, LightVeil, Dust, Bokeh, Foreground, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { Candle, Smoke, Cake, PhoneOnBooks, RecPill, Motes } from './chd-local-props';

// Chapter D, the diary and the birthday. D10-D12: he films a video diary every night by candlelight, for someone who
// will never watch it (medium, the phone's screen, the dark room wide). D13-D15: the birthday: the expired cake gets
// its candle (macro), he sings alone (slow push-in), nobody claps: he blows it out and the room goes black.
// From "không ai vỗ tay" there are no hits on purpose: silence is the point.

const PIP = LOOKS.pipHood;
const flap = (t: number, every = 3) => (Math.floor(t / every) % 2 === 0 ? ('worried' as const) : ('neutral' as const));

// ---------- D10: medium, Pip at the study desk by candle, talking to a phone propped on a stack of books ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 960, y: 712, yaw: 0.12, look: 0.1, armL: { a: 12, b: -6 }, armR: { a: 12, b: -6 } } },
    { f: 14, p: { armR: { a: 80, b: 36 }, headTilt: 3 } },
    { f: 30, p: { armR: { a: 30, b: 50 }, headTilt: -2 } },
    { f: 46, p: { armR: { a: 90, b: 28 }, headTilt: 3 } },
  ]);
  return (
    <g transform={camT(kf(t, [[0, 950], [len, 970]]), 600, kf(t, [[0, 1.6], [len, 1.76]]))}>
      <Study t={t + 90} id="d10" night veil={0.5} />
      <Hero look={PIP} pose={{ ...pose, expr: flap(t, 3), blink: 0 }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} laptop={false} lamp={false} />
      <Candle x={720} y={698} t={t} s={1.6} h={36} seed={1} />
      <Glow x={720} y={650} r={420} o={0.45} />
      <PhoneOnBooks x={1070} y={694} t={t} s={0.55} />
      <RecPill x={1010} y={500} f={t} sec={12 + t / 30} s={0.95} />
      <Dust t={t + 60} seed={31} x0={600} y0={440} w={500} h={300} n={16} o={0.4} />
    </g>
  );
};

// ---------- D11: insert, the phone's screen: the recording, Pip small in a dark room, REC and the timer running ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 0.78;
  const S = { x0: 330, y0: 160, w: 1260, h: 740 };
  const pose: Pose = poseAt(t, [
    { f: 0, p: { x: 900, y: S.y0 + S.h - 40 - 140 * sc, scale: sc, yaw: 0, look: 0.1, armL: { a: 12, b: -6 }, armR: { a: 70, b: 40 }, headTilt: 2 } },
    { f: 14, p: { armR: { a: 96, b: 30 } } },
    { f: 30, p: { armR: { a: 40, b: 50 } } },
  ]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#0A0A12" />
      <rect x={S.x0 - 44} y={S.y0 - 44} width={S.w + 88} height={S.h + 88} rx={54} fill="#1B1A24" stroke="#3A3846" strokeWidth={6} />
      <defs>
        <clipPath id="d11scr">
          <rect x={S.x0} y={S.y0} width={S.w} height={S.h} rx={18} />
        </clipPath>
      </defs>
      <g clipPath="url(#d11scr)">
        <rect x={S.x0} y={S.y0} width={S.w} height={S.h} fill="#1E2038" />
        <rect x={S.x0} y={S.y0 + S.h * 0.7} width={S.w} height={S.h * 0.3} fill="#2A2232" />
        <Glow x={1280} y={560} r={420} o={0.5} />
        <Candle x={1280} y={S.y0 + S.h - 60} t={t} s={1.6} h={36} seed={1} />
        <Glow x={900} y={520} r={420} o={0.25} />
        <Hero look={PIP} pose={{ ...pose, expr: flap(t, 3), blink: 0 }} rimId="rimR" shadow={0} />
        <rect x={S.x0} y={S.y0} width={S.w} height={S.h} fill="#2A4A3A" opacity={0.1} />
        {/* a little sensor noise */}
        {Array.from({ length: 30 }).map((_, i) => (
          <circle key={i} cx={S.x0 + rnd(7 + Math.floor(t / 2), i) * S.w} cy={S.y0 + rnd(8 + Math.floor(t / 2), i) * S.h} r={1.6} fill="#fff" opacity={0.12} />
        ))}
        {/* the camera app on the screen: focus box on his face, corner brackets, REC and the timer */}
        <rect x={810} y={300} width={180} height={190} rx={10} fill="none" stroke="#FFE27A" strokeWidth={4} opacity={0.8} />
        {[[S.x0 + 30, S.y0 + 30, 1, 1], [S.x0 + S.w - 30, S.y0 + 30, -1, 1], [S.x0 + 30, S.y0 + S.h - 30, 1, -1], [S.x0 + S.w - 30, S.y0 + S.h - 30, -1, -1]].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M ${x} ${Number(y) + sy * 50} L ${x} ${y} L ${Number(x) + sx * 50} ${y}`} stroke="#fff" strokeWidth={5} fill="none" opacity={0.7} />
        ))}
        <circle cx={S.x0 + 84} cy={S.y0 + 84} r={16} fill="#FF3B3B" opacity={Math.floor(t / 15) % 2 === 0 ? 1 : 0.25} />
        <text x={S.x0 + 118} y={S.y0 + 96} fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill="#fff">REC</text>
        <text x={S.x0 + S.w - 80} y={S.y0 + 96} textAnchor="end" fontFamily={FONT.ui} fontSize={44} fill="#fff">{`00:00:${String(12 + Math.floor((t + 8) / 30)).padStart(2, '0')}`}</text>
      </g>
    </g>
  );
};

// ---------- D12: wide, the dark study: one candle, one tiny red light on a phone, Pip small at the desk ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = poseAt(t, [{ f: 0, p: { x: 960, y: 712, yaw: 0.12, look: 0.2, armL: { a: 12, b: -6 }, armR: { a: 30, b: 50 } } }, { f: 20, p: { armR: { a: 50, b: 40 } } }]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.88], [len, 0.98]]))}>
      <Study t={t + 130} id="d12" night veil={0.62} />
      <Hero look={PIP} pose={{ ...pose, expr: flap(t, 4), blink: 0 }} rimId="rimR" shadow={0} />
      <Desk x0={560} x1={1360} y={700} laptop={false} lamp={false} />
      <Candle x={720} y={698} t={t + 5} s={1.4} h={36} seed={3} />
      <Glow x={720} y={650} r={380} o={0.4} />
      <PhoneOnBooks x={1070} y={694} t={t} s={0.5} />
      <Foreground blur={16}>
        <path d="M -300 1100 L -300 760 Q 40 700 340 800 L 360 1100 Z" fill="#07050C" />
      </Foreground>
    </g>
  );
};

// ---------- D13: macro, the cake: a candle goes in, a match lights it; the HẾT HẠN sticker faces us ----------
const CAKE = { x: 960, y: 900, w: 880 };
const CAKE_TOP = CAKE.y - CAKE.w * 0.36;
const CANDLE_X = 1000;
const CANDLE_H = 231;
export const D13: React.FC<ShotProps> = ({ t, len }) => {
  const plugY = CAKE_TOP + 4;
  const handY = kf(t, [[0, -330], [34, plugY - CANDLE_H - 80]], easeOut);
  const held = t < 34;
  const away = kf(t, [[40, 0], [58, 1]]);
  const wick = { x: CANDLE_X, y: plugY - CANDLE_H - 6 };
  const lit = clamp((t - 70) / 8);
  // the match arm: rises from the lower right to touch the wick, then leaves
  const mAt = kf(t, [[44, 1], [62, 0], [72, 0], [88, 1]]);
  const matchHand = { x: wick.x + 150 + 700 * mAt, y: wick.y + 235 + 500 * mAt };
  const matchTipY = matchHand.y - 235;
  const matchTip = { x: matchHand.x - 150, y: matchTipY };
  const flameOn = t >= 56;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2720} height={1880} fill="#0F0D18" />
      <Bokeh seed={4} n={9} x0={0} y0={60} w={1920} h={500} t={t} o={0.16} />
      <Glow x={140} y={260} r={760} kind="cool" o={0.35} />
      <rect x={-400} y={790} width={2720} height={700} fill="#33261F" />
      <rect x={-400} y={790} width={2720} height={5} fill="#FFC98A" opacity={0.35} />
      <path d="M -400 960 L 2320 940" stroke="#241A16" strokeWidth={3} />
      <Cake x={CAKE.x} y={CAKE.y} w={CAKE.w} />
      {/* the candle: carried in the mitten until t 34, then standing in the cake */}
      {held ? (
        <Candle x={CANDLE_X} y={handY + 80 + CANDLE_H} t={t} s={2.2} h={105} flame={0} wick={false} />
      ) : (
        <Candle x={CANDLE_X} y={plugY} t={t} s={2.2} h={105} flame={lit} glow={lit} seed={6} />
      )}
      {held ? <InsertArm x={CANDLE_X} y={handY} fx={CANDLE_X + 90} fy={handY - 760} rot={0} s={4.8} width={112} /> : null}
      {t >= 34 && away < 1 ? <InsertArm x={CANDLE_X} y={plugY - CANDLE_H - 80 - 520 * away} fx={CANDLE_X + 90} fy={plugY - CANDLE_H - 80 - 520 * away - 760} rot={0} s={4.8} width={112} /> : null}
      {/* the match: a stick from the fist up to the wick, its head burning */}
      {mAt < 1 ? (
        <g>
          <path d={`M ${matchHand.x} ${matchHand.y} L ${matchTip.x} ${matchTip.y}`} stroke="#C9A46A" strokeWidth={13} strokeLinecap="round" />
          <circle cx={matchTip.x} cy={matchTip.y} r={11} fill="#8A2A22" />
          {flameOn ? (
            <g>
              <Glow x={matchTip.x} y={matchTip.y - 20} r={260} o={0.55} />
              <path d={`M ${matchTip.x} ${matchTip.y - 4} Q ${matchTip.x - 20} ${matchTip.y - 34} ${matchTip.x + Math.sin(t) * 3} ${matchTip.y - 66} Q ${matchTip.x + 20} ${matchTip.y - 34} ${matchTip.x} ${matchTip.y - 4} Z`} fill="#FF9F3A" />
            </g>
          ) : null}
          <InsertArm x={matchHand.x} y={matchHand.y} fx={matchHand.x + 460} fy={matchHand.y + 560} rot={-30} s={4.8} width={112} fist />
        </g>
      ) : null}
      <Glow x={CANDLE_X} y={wick.y - 40} r={900} o={0.45 * lit} />
      <Motes t={t} seed={12} x0={500} y0={100} w={900} h={600} n={10} />
      <LightVeil id="d13veil" lights={[[CAKE.x, 640, 760]]} o={0.4 - 0.25 * lit} />
    </g>
  );
};

// ---------- D14 / D15 share a frame: Pip behind the cake, the candle lit under his chin, the room blurred and dark ----------
const SingScene: React.FC<{ t: number; id: string; flame: number; lean?: number; dark?: number; children?: React.ReactNode; pose: Pose; expr: Pose['expr']; zoom: number; rim?: string }> = ({
  t, id, flame, lean = 0, dark = 0, children, pose, expr, zoom, rim = 'rimR',
}) => (
  <g transform={camT(960, 560, zoom)}>
    <g filter="url(#blur10)">
      <g transform="translate(-300 -200) scale(1.5)">
        <Study t={t + 40} id={id} night veil={0.5} />
      </g>
    </g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#07040C" opacity={0.4} />
    <Glow x={980} y={640} r={820} o={0.5 * flame} />
    <Hero look={PIP} pose={{ ...pose, expr, blink: 0 }} rimId={rim} shadow={0} />
    <Cake x={990} y={1160} w={700} />
    <Candle x={1000} y={912} t={t} s={2} h={105} flame={flame} glow={flame} lean={lean} seed={7} wick />
    {dark > 0 ? <rect x={-400} y={-400} width={2720} height={1880} fill="#04050C" opacity={dark} /> : null}
    {children}
  </g>
);

const SING_POSE: Pose = { ...basePose, x: 930, y: 460 + 176 * 2.3, scale: 2.3, yaw: 0.05, look: 0.1, armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 } };

// ---------- D14: medium close-up, he sings Happy Birthday to himself: eyes shut, mouth open, happy and not ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => {
  const singing = t < 50;
  const open = Math.floor(t / 4) % 2 === 0;
  const expr = singing ? (open ? 'happy' : 'neutral') : 'tired';
  const pose: Pose = { ...SING_POSE, headTilt: singing ? Math.sin(t / 7) * 5 : -4, tilt: singing ? Math.sin(t / 7) * 2.5 : 0, y: SING_POSE.y - 2 * clamp(t / len) };
  return <SingScene t={t} id="d14" flame={1} pose={pose} expr={expr} zoom={kf(t, [[0, 0.9], [len, 1.0]])} />;
};

// ---------- D15: the same frame, nobody claps: he looks at the flame, breathes in, blows it out; smoke; black ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const out = 30;
  const flame = kf(t, [[0, 1], [24, 1], [28, 0.5], [out, 0]]);
  const lean = t > 25 ? kf(t, [[25, 0], [29, -22]]) : 0;
  const blink = t > 8 && t < 12 ? 1 : 0;
  const blow = t >= 26 && t < 34;
  const expr: Pose['expr'] = blow ? 'shock' : t < 20 ? 'tired' : 'neutral';
  const pose: Pose = { ...SING_POSE, squash: t > 20 && t < 26 ? -0.02 : 0, headTilt: -3 + (blow ? 3 : 0), tilt: blow ? 5 : 0, look: 0.1, y: SING_POSE.y - 2 };
  const dark = kf(t, [[28, 0], [34, 0.55], [46, 0.9], [len, 0.97]]);
  const candleTop = 912 - 105 * 2;
  return (
    <SingScene t={t} id="d15" flame={flame} lean={lean} dark={dark} pose={{ ...pose, blink }} expr={expr} zoom={kf(t, [[0, 1.0], [len, 1.06]])} rim={t > 36 ? 'rimBlue' : 'rimR'}>
      <Smoke x={1000} y={candleTop - 10} k={t - out} s={1.5} />
    </SingScene>
  );
};
