import React from 'react';
import { clamp, easeOut, FONT, Glow } from '../../engine';

// A generic social feed on a phone screen (no brand: round avatars, post cards, a reaction row), drawn for chapter A:
// the latest post is from 03:00, then the feed stops. Dark UI so the screen is the light of the room.
// The screen is FEED_W x FEED_H in its own units, origin at its top-left; <PhoneShell> frames it and clips it.

export const FEED_W = 600;
export const FEED_H = 1250;
const INK = '#14161E';
const CARD = '#212636';
const BAR = '#3E4660';
const SOFT = '#9FB4D8';
const TINTS = ['#E9A0A0', '#8FB4D9', '#E9C46A', '#9BC9A0', '#B9A0D9', '#F2B38A'];

/** A round avatar: a tinted disc, a head and shoulders in cream. */
const Avatar: React.FC<{ x: number; y: number; r: number; k: number }> = ({ x, y, r, k }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={TINTS[k % TINTS.length]} />
    <circle cx={x} cy={y - r * 0.18} r={r * 0.3} fill="#F6EFE3" />
    <path d={`M ${x - r * 0.55} ${y + r * 0.78} Q ${x} ${y + r * 0.05} ${x + r * 0.55} ${y + r * 0.78} Z`} fill="#F6EFE3" />
  </g>
);

/** One post card, 400 tall: avatar, name bar, a timestamp, a picture, two text lines and a reaction row. */
export const PostCard: React.FC<{ y: number; k: number; time: string; big?: boolean }> = ({ y, k, time, big = false }) => (
  <g transform={`translate(0 ${y})`}>
    <rect x={20} y={0} width={FEED_W - 40} height={400} rx={22} fill={CARD} />
    <Avatar x={74} y={52} r={30} k={k} />
    <rect x={118} y={28} width={140 + (k % 3) * 24} height={16} rx={8} fill={BAR} />
    <text x={118} y={78} fontFamily={FONT.ui} fontSize={big ? 28 : 24} fontWeight={big ? 700 : 400} fill={big ? '#FFE7A0' : SOFT}>
      {time}
    </text>
    <rect x={40} y={104} width={FEED_W - 80} height={170} rx={14} fill={TINTS[(k + 2) % TINTS.length]} opacity={0.85} />
    <circle cx={150 + (k % 4) * 70} cy={156} r={26} fill="#FFF3D0" opacity={0.9} />
    <path d={`M 40 274 L 40 232 Q 150 170 260 230 Q 360 190 ${FEED_W - 40} 236 L ${FEED_W - 40} 274 Z`} fill="#000" opacity={0.22} />
    <rect x={40} y={296} width={FEED_W - 120} height={14} rx={7} fill={BAR} />
    <rect x={40} y={322} width={(FEED_W - 120) * 0.6} height={14} rx={7} fill={BAR} />
    {/* reactions: a heart, a speech bubble, an arrow */}
    <path d="M 60 372 q -16 -14 -2 -24 q 8 -6 14 4 q 6 -10 14 -4 q 14 10 -2 24 l -12 10 Z" fill="#E9566A" />
    <path d="M 150 352 h 34 q 8 0 8 8 v 12 q 0 8 -8 8 h -20 l -10 10 v -10 h -4 q -8 0 -8 -8 v -12 q 0 -8 8 -8 Z" fill="none" stroke={SOFT} strokeWidth={4} />
    <path d="M 250 372 l 34 -14 l -10 28 l -8 -10 Z" fill="none" stroke={SOFT} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

const Header: React.FC<{ time?: string }> = ({ time = '07:12' }) => (
  <g>
    <rect x={0} y={0} width={FEED_W} height={110} fill="#191C28" />
    <text x={36} y={46} fontFamily={FONT.ui} fontSize={24} fill={SOFT}>{time}</text>
    <circle cx={46} cy={82} r={16} fill="#6A9BE8" />
    <path d="M 38 82 l 6 6 l 12 -14" stroke="#14161E" strokeWidth={4} fill="none" strokeLinecap="round" />
    <text x={76} y={90} fontFamily={FONT.hand} fontSize={34} fill="#F6EFE3">bảng tin</text>
    {[0, 1, 2].map((i) => <circle key={i} cx={FEED_W - 120 + i * 40} cy={80} r={11} fill={BAR} />)}
  </g>
);

/** The feed with its cards scrolled by `scroll` px: the top card is the 03:00 post, older ones follow. */
export const FeedContent: React.FC<{ scroll?: number; ring?: number; t: number }> = ({ scroll = 0, ring = 0, t }) => {
  const times = ['03:00', '02:47', '02:12', '01:38', '00:55'];
  return (
    <g>
      <rect width={FEED_W} height={FEED_H} fill={INK} />
      <g transform={`translate(0 ${-scroll})`}>
        {times.map((tm, i) => <PostCard key={tm} y={130 + i * 420} k={i} time={tm} big={i === 0} />)}
      </g>
      <Header />
      {ring > 0 ? (
        <rect x={104} y={46 + 130 - scroll} width={120} height={50} rx={12} fill="none" stroke="#FFE27A" strokeWidth={5} opacity={ring * (0.7 + 0.3 * Math.sin(t / 3))} />
      ) : null}
    </g>
  );
};

/** The feed after the 03:00 post: a pull-to-refresh spinner turning and "Không có bài viết mới"; the old cards dim away below. */
export const EmptyFeedContent: React.FC<{ t: number }> = ({ t }) => {
  const a = (t * 14) % 360;
  const show = easeOut(clamp(t / 8));
  return (
    <g>
      <rect width={FEED_W} height={FEED_H} fill={INK} />
      <g opacity={0.35} transform="translate(0 560)">
        <PostCard y={0} k={0} time="03:00" />
      </g>
      <rect x={0} y={560} width={FEED_W} height={700} fill="url(#cha-feed-fade)" />
      <Header />
      <g transform={`translate(${FEED_W / 2} 330)`} opacity={show}>
        <circle r={52} fill="none" stroke={BAR} strokeWidth={9} />
        <path d="M 0 -52 A 52 52 0 0 1 52 0" stroke="#CFE6FF" strokeWidth={9} fill="none" strokeLinecap="round" transform={`rotate(${a})`} />
      </g>
      <text x={FEED_W / 2} y={470} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill="#F6EFE3" opacity={clamp((t - 10) / 8)}>
        Không có bài viết mới
      </text>
    </g>
  );
};

/** Three notification counters, all zero: popping on one by one at `at` frames. */
export const ZeroCounters: React.FC<{ t: number; at?: number[]; n?: number }> = ({ t, at = [0, 30], n = 2 }) => {
  const rows = [
    { label: 'BÀI MỚI', icon: 'bell' },
    { label: 'BÌNH LUẬN', icon: 'chat' },
    { label: 'TIN NHẮN', icon: 'mail' },
  ].slice(0, n);
  return (
    <g>
      <rect width={FEED_W} height={FEED_H} fill={INK} />
      <Header />
      {rows.map((r, i) => {
        const p = easeOut(clamp((t - at[i]) / 8));
        return (
          <g key={r.label} transform={`translate(300 ${300 + i * 260}) scale(${0.85 + 0.15 * p}) translate(-300 -100)`} opacity={p}>
            <rect x={30} y={0} width={FEED_W - 60} height={200} rx={26} fill={CARD} />
            <circle cx={110} cy={100} r={44} fill={BAR} />
            {r.icon === 'bell' ? <path d="M 110 72 q -22 4 -22 30 l -8 14 h 60 l -8 -14 q 0 -26 -22 -30 Z M 100 124 q 10 12 20 0" fill="#F6EFE3" /> : null}
            {r.icon === 'chat' ? <path d="M 84 78 h 52 q 10 0 10 10 v 22 q 0 10 -10 10 h -28 l -16 14 v -14 h -8 q -10 0 -10 -10 v -22 q 0 -10 10 -10 Z" fill="#F6EFE3" /> : null}
            {r.icon === 'mail' ? <path d="M 78 80 h 64 v 40 h -64 Z M 78 80 l 32 24 l 32 -24" fill="none" stroke="#F6EFE3" strokeWidth={6} strokeLinejoin="round" /> : null}
            <text x={176} y={92} fontFamily={FONT.ui} fontSize={30} fill={SOFT} letterSpacing={2}>{r.label}</text>
            <text x={FEED_W - 90} y={122} textAnchor="end" fontFamily={FONT.ui} fontSize={110} fontWeight={700} fill="#FFE27A">0</text>
          </g>
        );
      })}
    </g>
  );
};

/** The phone around a screen: bezel, a glow in the room's colour, the screen clipped to a rounded rect. `s` scales it about its centre. */
export const PhoneShell: React.FC<{ id: string; x: number; y: number; s?: number; rot?: number; glow?: number; children: React.ReactNode }> = ({ id, x, y, s = 1, rot = 0, glow = 1, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <clipPath id={`${id}clip`}>
        <rect x={-FEED_W / 2} y={-FEED_H / 2} width={FEED_W} height={FEED_H} rx={44} />
      </clipPath>
      <linearGradient id="cha-feed-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={INK} stopOpacity={0} />
        <stop offset="40%" stopColor={INK} stopOpacity={0.85} />
        <stop offset="100%" stopColor={INK} stopOpacity={1} />
      </linearGradient>
    </defs>
    <rect x={-FEED_W / 2 + 14} y={-FEED_H / 2 + 22} width={FEED_W + 36} height={FEED_H + 36} rx={74} fill="#000" opacity={0.4} />
    {glow > 0 ? <Glow x={0} y={0} r={900} kind="cool" o={0.5 * glow} /> : null}
    <rect x={-FEED_W / 2 - 18} y={-FEED_H / 2 - 18} width={FEED_W + 36} height={FEED_H + 36} rx={62} fill="#16151C" stroke="#3A3846" strokeWidth={6} />
    <g clipPath={`url(#${id}clip)`}>
      <g transform={`translate(${-FEED_W / 2} ${-FEED_H / 2})`}>{children}</g>
    </g>
    <rect x={-60} y={-FEED_H / 2 + 8} width={120} height={20} rx={10} fill="#000" />
  </g>
);
