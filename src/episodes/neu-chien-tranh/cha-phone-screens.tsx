import React from 'react';
import { FONT, clamp, backOut, rnd } from '../../engine';

// Chapter A props, part 2: the phone and its screens. One frame (PhoneFrame, centred at x y, `w` wide, 2.05 w tall) and
// the screens that go in it: the emergency alert, the network-busy screen, the call log with five missed calls to mum,
// the rumour feed, and the round app icons that pop out of a pocket. Pure functions of the shot clock.

const INK = '#121019';

/** Dark glossy phone body; children are drawn in the screen's local space (origin = phone centre). */
export const PhoneFrame: React.FC<{ x: number; y: number; w?: number; rot?: number; buzz?: number; screen?: string; children?: React.ReactNode; id: string }> = ({ x, y, w = 560, rot = 0, buzz = 0, screen = '#0B0A10', children, id }) => {
  const h = w * 2.05;
  return (
    <g transform={`translate(${x + buzz} ${y}) rotate(${rot})`}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={-w / 2 + 22} y={-h / 2 + 22} width={w - 44} height={h - 44} rx={w * 0.1} />
        </clipPath>
      </defs>
      <rect x={-w / 2 + 20} y={-h / 2 + 24} width={w} height={h} rx={w * 0.14} fill="#000" opacity={0.4} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill="#16151C" stroke="#3A3846" strokeWidth={w * 0.014} />
      <rect x={-w / 2 + 22} y={-h / 2 + 22} width={w - 44} height={h - 44} rx={w * 0.1} fill={screen} />
      <g clipPath={`url(#${id}clip)`}>{children}</g>
      <rect x={-w * 0.1} y={-h / 2 + w * 0.05} width={w * 0.2} height={w * 0.045} rx={w * 0.022} fill="#000" />
    </g>
  );
};

/** The emergency alert: red screen, yellow warning triangle, "CẢNH BÁO KHẨN CẤP", flashing. */
export const AlertPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; t: number; id: string }> = ({ x, y, w = 560, rot = 0, t, id }) => {
  const h = w * 2.05;
  const flash = t % 16 < 9 ? 1 : 0.6;
  return (
    <PhoneFrame id={id} x={x} y={y} w={w} rot={rot} buzz={Math.sin(t * 9.1) * 6 * (w / 560)} screen="#B3101E">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#B3101E" opacity={flash} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#FF4A3A" opacity={0.25 * flash} />
      <g transform={`translate(0 ${-h * 0.18})`}>
        <path d={`M 0 ${-w * 0.2} L ${w * 0.22} ${w * 0.16} L ${-w * 0.22} ${w * 0.16} Z`} fill="#FFD23F" stroke={INK} strokeWidth={w * 0.018} strokeLinejoin="round" />
        <rect x={-w * 0.018} y={-w * 0.1} width={w * 0.036} height={w * 0.15} rx={w * 0.018} fill={INK} />
        <circle cx={0} cy={w * 0.1} r={w * 0.024} fill={INK} />
      </g>
      <text x={0} y={h * 0.1} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.1} fill="#FFF4E0" letterSpacing={2}>CẢNH BÁO</text>
      <text x={0} y={h * 0.1 + w * 0.14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.1} fill="#FFF4E0" letterSpacing={2}>KHẨN CẤP</text>
      <rect x={-w * 0.34} y={h * 0.28} width={w * 0.68} height={w * 0.1} rx={w * 0.05} fill="#FFF4E0" opacity={0.9} />
      <rect x={-w * 0.3} y={h * 0.28 + w * 0.13} width={w * 0.6} height={w * 0.04} rx={w * 0.02} fill="#FFF4E0" opacity={0.5} />
    </PhoneFrame>
  );
};

/** "MẠNG BẬN": the signal bars drop, a spinner turns, a red bar. */
export const BusyPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; t: number; id: string }> = ({ x, y, w = 560, rot = 0, t, id }) => {
  const h = w * 2.05;
  const bars = [0.25, 0.45, 0.65, 0.85].map((k) => k * w * 0.2);
  const lost = clamp((t - 6) / 8);
  return (
    <PhoneFrame id={id} x={x} y={y} w={w} rot={rot} buzz={t < 6 ? 0 : Math.sin(t * 7) * 3 * (w / 560)} screen="#1B2236">
      <g transform={`translate(${-w * 0.1} ${-h * 0.4})`}>
        {bars.map((bh, i) => (
          <rect key={i} x={i * w * 0.07} y={-bh} width={w * 0.045} height={bh} rx={4} fill={i < 3 * (1 - lost) + 1 ? '#F6EFE3' : '#4A5068'} />
        ))}
      </g>
      <g transform={`translate(0 ${-h * 0.1})`}>
        <circle r={w * 0.2} fill="none" stroke="#3A4560" strokeWidth={w * 0.03} />
        <path d={`M 0 ${-w * 0.2} A ${w * 0.2} ${w * 0.2} 0 0 1 ${w * 0.2} 0`} fill="none" stroke="#FF5A4A" strokeWidth={w * 0.03} strokeLinecap="round" transform={`rotate(${t * 18})`} />
        <path d={`M ${-w * 0.08} ${-w * 0.08} L ${w * 0.08} ${w * 0.08} M ${w * 0.08} ${-w * 0.08} L ${-w * 0.08} ${w * 0.08}`} stroke="#FF5A4A" strokeWidth={w * 0.035} strokeLinecap="round" />
      </g>
      <text x={0} y={h * 0.14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.11} fill="#F6EFE3" letterSpacing={3}>MẠNG BẬN</text>
      <rect x={-w * 0.3} y={h * 0.2} width={w * 0.6} height={w * 0.07} rx={w * 0.035} fill="#FF5A4A" opacity={0.85} />
    </PhoneFrame>
  );
};

/** Call log: `n` rows "Mẹ" in red (missed) popping from t0 every `every` frames; "KHÔNG ĐƯỢC" bar at `failT`. */
export const CallLogPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; t: number; id: string; n?: number; t0?: number; every?: number; failT?: number }> = ({ x, y, w = 560, rot = 0, t, id, n = 5, t0 = 4, every = 7, failT = 40 }) => {
  const h = w * 2.05;
  const rowH = w * 0.2;
  return (
    <PhoneFrame id={id} x={x} y={y} w={w} rot={rot} screen="#F3EFE8">
      <rect x={-w / 2} y={-h / 2} width={w} height={w * 0.28} fill="#E4DED2" />
      <text x={-w * 0.4} y={-h / 2 + w * 0.2} fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.075} fill={INK}>Gần đây</text>
      {Array.from({ length: n }).map((_, i) => {
        const p = backOut(clamp((t - t0 - i * every) / 6));
        const y0 = -h / 2 + w * 0.34 + i * rowH;
        return (
          <g key={i} transform={`translate(0 ${y0}) scale(1 ${p})`} opacity={p > 0 ? 1 : 0}>
            <circle cx={-w * 0.32} cy={rowH * 0.4} r={w * 0.06} fill="#F2C0B8" />
            <circle cx={-w * 0.32} cy={rowH * 0.4 - w * 0.015} r={w * 0.022} fill="#8A3A32" />
            <path d={`M ${-w * 0.36} ${rowH * 0.4 + w * 0.05} Q ${-w * 0.32} ${rowH * 0.4 + w * 0.01} ${-w * 0.28} ${rowH * 0.4 + w * 0.05}`} fill="#8A3A32" />
            <text x={-w * 0.2} y={rowH * 0.36} fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.08} fill="#D2261A">Mẹ</text>
            <text x={-w * 0.2} y={rowH * 0.62} fontFamily={FONT.ui} fontSize={w * 0.048} fill="#D2261A" opacity={0.85}>cuộc gọi nhỡ</text>
            <g transform={`translate(${w * 0.3} ${rowH * 0.4})`}>
              <circle r={w * 0.055} fill="#D2261A" />
              <path d={`M ${-w * 0.025} ${w * 0.025} L ${w * 0.025} ${-w * 0.025} M ${w * 0.025} ${-w * 0.025} L ${w * 0.025} ${-w * 0.005} M ${w * 0.025} ${-w * 0.025} L ${w * 0.005} ${-w * 0.025}`} stroke="#fff" strokeWidth={w * 0.014} strokeLinecap="round" fill="none" />
            </g>
            <path d={`M ${-w * 0.45} ${rowH} H ${w * 0.45}`} stroke="#CFC8BA" strokeWidth={2} />
          </g>
        );
      })}
      {t >= failT ? (
        <g transform={`translate(0 ${h * 0.36}) scale(${backOut(clamp((t - failT) / 6))})`}>
          <rect x={-w * 0.4} y={-w * 0.09} width={w * 0.8} height={w * 0.18} rx={w * 0.09} fill="#D2261A" />
          <text y={w * 0.04} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.075} fill="#fff" letterSpacing={2}>KHÔNG ĐƯỢC</text>
        </g>
      ) : null}
    </PhoneFrame>
  );
};

/** The rumour feed: stacked posts with blurred text, contradictory ticks and crosses, "?" badges; scrolls up fast. */
export const FeedPhone: React.FC<{ x: number; y: number; w?: number; rot?: number; t: number; id: string; speed?: number }> = ({ x, y, w = 560, rot = 0, t, id, speed = 7 }) => {
  const h = w * 2.05;
  const cardH = w * 0.52;
  const off = (t * speed) % cardH;
  return (
    <PhoneFrame id={id} x={x} y={y} w={w} rot={rot} screen="#E7E9EE">
      {Array.from({ length: 6 }).map((_, i) => {
        const k = i + Math.floor((t * speed) / cardH);
        const cy = -h / 2 + i * cardH - off;
        const seed = k + 3;
        const hue = ['#4A7AC8', '#C8644A', '#4AA882', '#A06AC8', '#C89A3A'][Math.floor(rnd(seed, 1) * 5)];
        const verdict = rnd(seed, 2) > 0.5;
        return (
          <g key={k} transform={`translate(0 ${cy})`}>
            <rect x={-w * 0.45} y={w * 0.02} width={w * 0.9} height={cardH - w * 0.04} rx={w * 0.03} fill="#FFFFFF" />
            <circle cx={-w * 0.34} cy={w * 0.1} r={w * 0.055} fill={hue} />
            <g filter="url(#blur3)">
              <rect x={-w * 0.25} y={w * 0.06} width={w * (0.3 + rnd(seed, 3) * 0.2)} height={w * 0.04} rx={w * 0.02} fill="#6A6E7C" />
              {[0, 1, 2].map((r) => (
                <rect key={r} x={-w * 0.4} y={w * (0.19 + r * 0.07)} width={w * (0.5 + rnd(seed, 5 + r) * 0.3)} height={w * 0.04} rx={w * 0.02} fill="#8A8E9C" />
              ))}
            </g>
            <g transform={`translate(${w * 0.3} ${cardH * 0.7})`}>
              <circle r={w * 0.06} fill={verdict ? '#F2B84B' : '#FF5A4A'} />
              <text y={w * 0.04} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.11} fill="#fff">?</text>
            </g>
          </g>
        );
      })}
      <rect x={-w / 2} y={-h / 2} width={w} height={w * 0.2} fill="#D8DCE6" opacity={0.95} />
      <text x={-w * 0.4} y={-h / 2 + w * 0.14} fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.07} fill={INK}>Bảng tin</text>
    </PhoneFrame>
  );
};

type IconKind = 'call' | 'chat' | 'heart' | 'wallet';
const ICON_COL: Record<IconKind, [string, string]> = { call: ['#3FBF6A', '#2A8C4A'], chat: ['#3A8AE0', '#2A62A8'], heart: ['#E0508A', '#A8346A'], wallet: ['#F2A03A', '#B8741F'] };

/** A round-cornered app icon (call, chat, heart, wallet) centred at x y, `d` wide; popped in by `p` (0..1). */
export const AppIcon: React.FC<{ x: number; y: number; d?: number; kind: IconKind; p?: number; rot?: number }> = ({ x, y, d = 150, kind, p = 1, rot = 0 }) => {
  const [c1, c2] = ICON_COL[kind];
  const k = d / 150;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${p * k})`} opacity={clamp(p * 3)}>
      <rect x={-75 + 6} y={-75 + 10} width={150} height={150} rx={38} fill="#000" opacity={0.3} />
      <rect x={-75} y={-75} width={150} height={150} rx={38} fill={c2} />
      <rect x={-75} y={-75} width={150} height={138} rx={38} fill={c1} />
      {kind === 'call' ? <path d="M -30 -34 Q -40 -10 -4 30 Q 26 56 40 42 L 30 20 L 12 28 Q -8 14 -20 -8 L -10 -24 L -26 -42 Z" fill="#fff" /> : null}
      {kind === 'chat' ? (
        <g fill="#fff">
          <path d="M -44 -36 H 44 Q 56 -36 56 -24 V 14 Q 56 26 44 26 H 4 L -24 50 V 26 H -44 Q -56 26 -56 14 V -24 Q -56 -36 -44 -36 Z" />
          <circle cx={-22} cy={-5} r={6} fill={c1} /><circle cx={0} cy={-5} r={6} fill={c1} /><circle cx={22} cy={-5} r={6} fill={c1} />
        </g>
      ) : null}
      {kind === 'heart' ? <path d="M 0 40 C -60 0 -48 -44 -22 -44 C -8 -44 0 -34 0 -28 C 0 -34 8 -44 22 -44 C 48 -44 60 0 0 40 Z" fill="#fff" /> : null}
      {kind === 'wallet' ? (
        <g>
          <rect x={-46} y={-30} width={92} height={64} rx={12} fill="#fff" />
          <rect x={14} y={-8} width={40} height={26} rx={10} fill={c2} /><circle cx={30} cy={5} r={5} fill="#fff" />
        </g>
      ) : null}
    </g>
  );
};

