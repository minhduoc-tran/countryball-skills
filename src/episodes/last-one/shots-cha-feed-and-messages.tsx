import React from 'react';
import {
  Hero, Pose, basePose, kf, clamp, easeOut, backOut, camT, LOOKS, HEAD, Glow, Kitchen, FONT, ShotProps,
} from '../../engine';
import { InsertArm } from './insert-arm-and-icons';
import { PhoneShell, FeedContent, EmptyFeedContent, ZeroCounters, FEED_H } from './cha-feed-screen-ui';

// Chapter A, the feed: Pip opens a social feed (A25), the newest post is from 03:00 (A26), then nothing, a spinner
// and "Không có bài viết mới" (A27), zero new posts and zero comments (A28), and his face lit blue by the screen
// with the third zero, messages, hanging beside it (A29).

const PIP = LOOKS.pipHood;
const Backdrop: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <g filter="url(#blur16)">
      <g transform="translate(-300 -260) scale(1.5)">
        <Kitchen t={t + 300} id={id} />
      </g>
    </g>
    <rect x={-200} y={-200} width={2320} height={1480} fill="#07060E" opacity={0.55} />
  </g>
);

// ---------- A25: the phone in his hand, the feed opening and scrolling fast ----------
export const A25: React.FC<ShotProps> = ({ t, len }) => {
  const scroll = easeOut(clamp(t / 30)) * 420 + (t > 30 ? (t - 30) * 4 : 0);
  const open = backOut(clamp(t / 8));
  const s = 0.8 * (0.9 + 0.1 * open);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Backdrop t={t} id="fd25" />
      <PhoneShell id="fd25p" x={960} y={575} s={s} rot={-3}>
        <FeedContent scroll={scroll} t={t} />
      </PhoneShell>
      <InsertArm x={1370} y={960} fx={1800} fy={1500} rot={-24} s={5.4} width={124} />
    </g>
  );
};

// ---------- A26: the top post, huge: its timestamp 03:00 ringed ----------
export const A26: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 1.5], [len, 2.1]]);
  // local feed point (300, L) sits at the screen centre
  const L = kf(t, [[0, 330], [len, 190]]);
  const cy = 540 - sc * (L - FEED_H / 2);
  return (
    <g>
      <Backdrop t={t} id="fd26" />
      <PhoneShell id="fd26p" x={960} y={cy} s={sc}>
        <FeedContent scroll={0} ring={easeOut(clamp((t - 22) / 10))} t={t} />
      </PhoneShell>
    </g>
  );
};

// ---------- A27: the feed stops: the spinner turns, "Không có bài viết mới" ----------
export const A27: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 1.2], [len, 1.4]]);
  const cy = 540 - sc * (330 - FEED_H / 2);
  return (
    <g>
      <Backdrop t={t} id="fd27" />
      <PhoneShell id="fd27p" x={960} y={cy} s={sc} rot={2}>
        <EmptyFeedContent t={t} />
      </PhoneShell>
    </g>
  );
};

// ---------- A28: zero new posts, zero comments, popping on at their words ----------
export const A28: React.FC<ShotProps> = ({ t, len }) => {
  const sc = kf(t, [[0, 1.2], [len, 1.38]]);
  const cy = 540 - sc * (480 - FEED_H / 2);
  return (
    <g>
      <Backdrop t={t} id="fd28" />
      <PhoneShell id="fd28p" x={960} y={cy} s={sc} rot={-2}>
        <ZeroCounters t={t} at={[2, 31]} n={2} />
      </PhoneShell>
    </g>
  );
};

// ---------- A29: close-up, Pip lit blue by the screen below frame; the last zero floats beside him ----------
export const A29: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 3.8 * (1 + 0.05 * clamp(t / len));
  const head = { x: 900, y: 600 };
  const flick = 0.55 + 0.1 * Math.sin(t / 2.5) + (t % 17 < 2 ? 0.12 : 0);
  const pose: Pose = {
    ...basePose, x: head.x, y: head.y - HEAD.y * sc, scale: sc, yaw: 0.15, look: kf(t, [[0, -0.2], [14, -0.5], [len, -0.4]]),
    armL: { a: 14, b: -6 }, armR: { a: 14, b: -6 }, headTilt: kf(t, [[0, -2], [len, 3]]), expr: 'worried',
  };
  const pop = backOut(clamp((t - 5) / 8));
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#06050C" />
      <g filter="url(#blur16)" opacity={0.5}>
        <g transform="translate(-620 -420) scale(1.8)">
          <Kitchen t={t + 330} id="fd29" veil={0.7} />
        </g>
      </g>
      <Hero look={PIP} pose={pose} rimId="rimBlue" shadow={0} />
      <Glow x={900} y={1000} r={1000} kind="cool" o={flick} />
      <Glow x={880} y={780} r={420} kind="cool" o={flick * 0.45} />
      <g transform={`translate(1500 330) scale(${pop})`} opacity={pop}>
        <rect x={-190} y={-52} width={380} height={104} rx={52} fill="#12141E" opacity={0.9} stroke="#4A8BE0" strokeWidth={4} />
        <text x={-130} y={30} fontFamily={FONT.ui} fontSize={76} fontWeight={700} fill="#FFE27A">0</text>
        <text x={-60} y={20} fontFamily={FONT.ui} fontSize={32} fill="#CFE6FF" letterSpacing={3}>TIN NHẮN</text>
      </g>
    </g>
  );
};
