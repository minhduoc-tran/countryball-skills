import React from 'react';
import { FONT, Glow, backOut, clamp } from '../../engine';

// Chapter B local props: a generic phone (no brand) seen from the front, with a status bar (signal bars, battery), four
// app icons (money, map, school, family chat) and an e-wallet screen that fails. All pure functions of the shot clock.
//   <PhoneFrame x y s rot id glow> screen content in local coords: x -132..132, y -285..285 (clipped to the screen)
//   <SignalBars x y level cross s />   <BatteryIcon x y pct t s />   <AppIcon kind x y s pop />   <WalletScreen t err />
// The phone is 300 x 615 at s 1.

const INK = '#12101C';

export const PhoneFrame: React.FC<{ x: number; y: number; s?: number; rot?: number; id: string; glow?: 'warm' | 'cool' | 'red'; glowO?: number; children?: React.ReactNode }> = ({
  x, y, s = 1, rot = 0, id, glow, glowO = 0.5, children,
}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <clipPath id={`${id}scr`}><rect x={-132} y={-285} width={264} height={570} rx={30} /></clipPath>
    </defs>
    {glow ? <Glow x={0} y={0} r={520} kind={glow} o={glowO} /> : null}
    <rect x={-132} y={-282} width={300} height={615} rx={46} fill="#000" opacity={0.4} />
    <rect x={-150} y={-307} width={300} height={615} rx={46} fill="#1A1922" stroke="#3E3C4C" strokeWidth={7} />
    <rect x={-141} y={-298} width={282} height={597} rx={38} fill="#08070D" />
    <g clipPath={`url(#${id}scr)`}>{children}</g>
    <rect x={-32} y={-292} width={64} height={12} rx={6} fill="#08070D" />
    <path d="M -110 -300 Q 0 -312 110 -300" stroke="#FFC98A" strokeWidth={3} fill="none" opacity={0.4} />
  </g>
);

/** Signal bars: `level` 0..4 bars lit; with `cross` a red slash and an X (no network). */
export const SignalBars: React.FC<{ x: number; y: number; level: number; cross?: number; s?: number }> = ({ x, y, level, cross = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={i * 13} y={-8 - i * 8} width={9} height={8 + i * 8} rx={2} fill={i < level ? '#F6EFE3' : '#4A4A5C'} />
    ))}
    {cross > 0 ? (
      <g opacity={cross}>
        <path d="M -6 6 L 52 -38" stroke="#FF4A3A" strokeWidth={7} strokeLinecap="round" />
      </g>
    ) : null}
  </g>
);

/** A battery: outline, fill to `pct`; red and blinking when low. */
export const BatteryIcon: React.FC<{ x: number; y: number; pct: number; t: number; s?: number; showText?: boolean }> = ({ x, y, pct, t, s = 1, showText = true }) => {
  const low = pct <= 15;
  const col = low ? '#FF4A3A' : '#8FE0A0';
  const blink = low ? (Math.floor(t / 5) % 2 ? 1 : 0.45) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={blink}>
      <rect x={0} y={-18} width={56} height={26} rx={7} fill="none" stroke="#F6EFE3" strokeWidth={4} />
      <rect x={58} y={-11} width={6} height={12} rx={2} fill="#F6EFE3" />
      <rect x={5} y={-13} width={Math.max(4, 46 * (pct / 100))} height={16} rx={3} fill={col} />
      {showText ? <text x={-10} y={5} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill={col}>{Math.round(pct)}%</text> : null}
    </g>
  );
};

export type AppKind = 'money' | 'map' | 'school' | 'chat';
const APP_COL: Record<AppKind, string> = { money: '#3FA66B', map: '#4A86C8', school: '#E9B949', chat: '#3E9C96' };

/** An app icon, 100 x 100 centred; `pop` 0..1 pops it in. */
export const AppIcon: React.FC<{ kind: AppKind; x: number; y: number; s?: number; pop?: number; o?: number }> = ({ kind, x, y, s = 1, pop = 1, o = 1 }) => {
  if (pop <= 0) return null;
  const k = backOut(clamp(pop));
  const art: Record<AppKind, React.ReactNode> = {
    money: (
      <g>
        <rect x={-34} y={-20} width={68} height={40} rx={6} fill="#F6EFE3" />
        <circle r={12} fill="#3FA66B" />
        <circle cx={-24} cy={0} r={4} fill="#3FA66B" /><circle cx={24} cy={0} r={4} fill="#3FA66B" />
      </g>
    ),
    map: (
      <g>
        <path d="M -34 -18 L -12 -26 L 12 -18 L 34 -26 L 34 22 L 12 30 L -12 22 L -34 30 Z" fill="#F6EFE3" />
        <path d="M -12 -26 L -12 22 M 12 -18 L 12 30" stroke="#A9C6E6" strokeWidth={3} />
        <path d="M 0 -4 Q -16 -22 -2 -34 Q 12 -34 12 -22 Q 12 -14 0 -4 Z" fill="#E8453C" />
        <circle cx={0} cy={-24} r={4} fill="#F6EFE3" />
      </g>
    ),
    school: (
      <g>
        <path d="M -38 -4 L 0 -26 L 38 -4 L 0 18 Z" fill="#F6EFE3" />
        <path d="M -22 8 L -22 24 Q 0 36 22 24 L 22 8 L 0 20 Z" fill="#F6EFE3" opacity={0.9} />
        <path d="M 34 -2 L 34 22" stroke="#F6EFE3" strokeWidth={4} strokeLinecap="round" />
      </g>
    ),
    chat: (
      <g>
        <path d="M -34 -24 H 12 Q 20 -24 20 -16 V 4 Q 20 12 12 12 H -14 L -26 24 V 12 H -34 Z" fill="#F6EFE3" />
        <path d="M 0 -6 H 24 Q 34 -6 34 4 V 20 Q 34 28 28 28 V 38 L 16 28 H 6 Q -2 28 -2 20 Z" fill="#FFD27A" />
      </g>
    ),
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`} opacity={o}>
      <rect x={-50} y={-50} width={100} height={100} rx={24} fill={APP_COL[kind]} stroke={INK} strokeWidth={4} />
      <rect x={-46} y={-46} width={92} height={40} rx={20} fill="#FFFFFF" opacity={0.14} />
      {art[kind]}
    </g>
  );
};

/**
 * A generic e-wallet screen: a header, a balance card, a spinner; at `err` (frames since the error hit, -1 for none)
 * a red "LỖI KẾT NỐI" banner slams in with an RGB glitch.
 */
export const WalletScreen: React.FC<{ t: number; err: number }> = ({ t, err }) => {
  const glitch = err >= 0 && err < 10 ? (Math.floor(err / 2) % 2 ? 9 : -7) : 0;
  const banner = err >= 0 ? backOut(clamp(err / 5)) : 0;
  const spin = t * 14;
  return (
    <g>
      <rect x={-132} y={-285} width={264} height={570} fill="#F4EEE2" />
      <rect x={-132} y={-285} width={264} height={110} fill="#2D8C6A" />
      <text x={-104} y={-200} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#FFFFFF" letterSpacing={2}>VÍ</text>
      <circle cx={100} cy={-210} r={18} fill="#FFFFFF" opacity={0.3} />
      <rect x={-108} y={-150} width={216} height={118} rx={18} fill="#1F6E54" />
      <rect x={-86} y={-122} width={90} height={14} rx={7} fill="#FFFFFF" opacity={0.5} />
      <rect x={-86} y={-92} width={150} height={26} rx={8} fill="#FFFFFF" opacity={err >= 0 ? 0.25 : 0.8} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={-108 + i * 76} y={4} width={64} height={64} rx={16} fill="#CFE5DA" />
          <circle cx={-76 + i * 76} cy={36} r={13} fill="#2D8C6A" opacity={0.6} />
        </g>
      ))}
      <rect x={-108} y={92} width={216} height={22} rx={8} fill="#DCD3C2" />
      <rect x={-108} y={130} width={170} height={22} rx={8} fill="#DCD3C2" />
      {err < 0 ? (
        <g transform="translate(0 220)">
          <circle r={26} fill="none" stroke="#DCD3C2" strokeWidth={8} />
          <path d="M 0 -26 A 26 26 0 0 1 26 0" stroke="#2D8C6A" strokeWidth={8} fill="none" strokeLinecap="round" transform={`rotate(${spin})`} />
        </g>
      ) : (
        <g transform={`translate(${glitch} 130) scale(${banner})`}>
          <rect x={-120} y={-12} width={240} height={150} rx={18} fill="#00E5FF" opacity={0.5} transform="translate(-6 0)" />
          <rect x={-120} y={-12} width={240} height={150} rx={18} fill="#C8202F" />
          <rect x={-120} y={-12} width={240} height={150} rx={18} fill="#FF2D6A" opacity={0.4} transform="translate(6 0)" />
          <circle cx={0} cy={36} r={22} fill="none" stroke="#FFF4E0" strokeWidth={6} />
          <path d="M -9 27 L 9 45 M 9 27 L -9 45" stroke="#FFF4E0" strokeWidth={6} strokeLinecap="round" />
          <text x={0} y={104} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#FFF4E0" letterSpacing={1}>LỖI KẾT NỐI</text>
        </g>
      )}
      {err >= 0 && err < 14 ? <rect x={-132} y={-285 + ((err * 53) % 570)} width={264} height={14} fill="#FFFFFF" opacity={0.35} /> : null}
    </g>
  );
};
