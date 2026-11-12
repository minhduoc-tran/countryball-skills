import React from 'react';
import { backOut, clamp, Sun, Glow, LightVeil, Foreground } from '../../engine';
import { PAL } from './kit-palette';

// Chapter E's copies of chapter A's repeated framings, so the loop's recurring pictures match exactly:
//   JokeBubble (+ its doodle) from cha-screens-and-bubbles.tsx, Balcony + BALCONY_LEDGE from cha-places-props.tsx,
//   Awning from shots-cha-day-two.tsx. Copied verbatim (2026-11-10). At merge the lead may swap these for imports of
//   the chapter A originals (same props, same output).
//   <JokeBubble x y t s? tail? />  Mo's joke bubble, popping in from t = 0; tail 1 lower right, -1 lower left.
//   <Balcony t id />  the neighbour's balcony from below; put the cat and FlowerPot on BALCONY_LEDGE (y 470).
//   <Awning t />      the dark blurred shop awning across the top-left corner (screen space).

const JokeDoodle: React.FC<{ t: number }> = ({ t }) => {
  const wob = Math.sin(t / 4) * 3;
  return (
    <g stroke={PAL.ink} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* the banana peel */}
      <path d="M -40 70 Q -60 40 -90 50 M -40 70 Q -20 40 10 52 M -40 70 Q -44 40 -40 24" stroke="#C99A1A" strokeWidth={10} />
      <path d="M -40 70 Q -60 40 -90 50 M -40 70 Q -20 40 10 52" stroke="#FFD04D" strokeWidth={5} />
      {/* the stick man, feet flying up */}
      <g transform={`rotate(${-28 + wob} 30 10)`}>
        <circle cx={70} cy={-40} r={22} fill="#F6EFE3" />
        <path d="M 58 -20 L 20 20 M 40 0 L 80 10 M 40 0 L 0 -14 M 20 20 L -10 -20 M 20 20 L 50 -26" />
      </g>
      {/* motion lines and stars */}
      <path d="M -100 -10 L -70 -10 M -110 14 L -76 14" stroke="#7D705C" strokeWidth={5} />
      {[0, 1, 2].map((i) => {
        const a = t / 6 + (i * Math.PI * 2) / 3;
        return <path key={i} transform={`translate(${86 + Math.cos(a) * 46} ${-70 + Math.sin(a) * 16})`} d="M 0 -12 L 4 -4 L 12 -3 L 6 3 L 8 12 L 0 7 L -8 12 L -6 3 L -12 -3 L -4 -4 Z" fill="#FFD04D" stroke="#C99A1A" strokeWidth={2} />;
      })}
    </g>
  );
};

export const JokeBubble: React.FC<{ x: number; y: number; t: number; s?: number; tail?: 1 | -1 }> = ({ x, y, t, s = 1, tail = 1 }) => {
  if (t < 0) return null;
  const pop = backOut(clamp(t / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`}>
      <path d={`M ${tail * 60} 110 L ${tail * 150} 190 L ${tail * 130} 100 Z`} fill="#F6F1E3" stroke={PAL.ink} strokeWidth={6} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={220} ry={130} fill="#F6F1E3" stroke={PAL.ink} strokeWidth={6} />
      <path d={`M ${tail * 62} 104 L ${tail * 130} 100`} stroke="#F6F1E3" strokeWidth={10} />
      <ellipse cx={-30} cy={-80} rx={120} ry={24} fill="#FFFFFF" opacity={0.6} />
      <g transform="translate(0 6) scale(0.95)">
        <JokeDoodle t={t} />
      </g>
    </g>
  );
};

export const BALCONY_LEDGE = { x0: 520, x1: 1500, y: 470 };

export const Balcony: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const B = BALCONY_LEDGE;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7FA8D8" />
          <stop offset="1" stopColor="#FFD9A0" />
        </linearGradient>
      </defs>
      <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}sky)`} />
      <Sun x={1640} y={170} r={70} t={t} rays />
      {/* the shophouse front, seen from below: it leans in toward the top (low angle) */}
      <polygon points="300,1180 1720,1180 1600,-60 420,-60" fill="#C9A15E" />
      <polygon points="1720,1180 1600,-60 1660,-60 1800,1180" fill="#9A7442" />
      {/* the window and door behind the balcony, shutters green */}
      <rect x={700} y={60} width={520} height={400} fill="#2A2028" />
      {[0, 1].map((k) => <rect key={k} x={700 + k * 262} y={60} width={258} height={400} fill="#3F7A5A" stroke="#24402F" strokeWidth={6} />)}
      {Array.from({ length: 12 }).map((_, k) => <path key={k} d={`M 710 ${80 + k * 32} L 1210 ${80 + k * 32}`} stroke="#2E5C42" strokeWidth={5} />)}
      {/* the ledge slab, the railing, a hanging plant */}
      <polygon points={`${B.x0 - 40},${B.y} ${B.x1 + 40},${B.y} ${B.x1 + 70},${B.y + 70} ${B.x0 - 70},${B.y + 70}`} fill="#8A8478" />
      <polygon points={`${B.x0 - 70},${B.y + 70} ${B.x1 + 70},${B.y + 70} ${B.x1 + 60},${B.y + 96} ${B.x0 - 60},${B.y + 96}`} fill="#5E584E" />
      <path d={`M ${B.x0 - 40} ${B.y} L ${B.x1 + 40} ${B.y}`} stroke="#FFE2B0" strokeWidth={4} opacity={0.7} />
      <path d={`M ${B.x0 - 30} ${B.y - 210} L ${B.x0 + 160} ${B.y - 210} M ${B.x1 - 160} ${B.y - 210} L ${B.x1 + 30} ${B.y - 210}`} stroke="#2A2630" strokeWidth={10} />
      {Array.from({ length: 7 }).map((_, k) => <path key={k} d={`M ${B.x0 - 30 + k * 32} ${B.y} L ${B.x0 - 30 + k * 32} ${B.y - 210} M ${B.x1 + 30 - k * 32} ${B.y} L ${B.x1 + 30 - k * 32} ${B.y - 210}`} stroke="#2A2630" strokeWidth={6} />)}
      <g transform={`translate(1380 ${B.y + 96}) rotate(${Math.sin(t / 16) * 4})`}>
        <path d="M 0 0 L 0 60" stroke="#3A3036" strokeWidth={3} />
        <path d="M -30 60 L 30 60 L 22 100 L -22 100 Z" fill="#B8604A" />
        {[-24, -8, 8, 24].map((dx, k) => <path key={k} d={`M ${dx} 96 q ${dx * 0.4} 50 ${dx * 0.2} ${90 + k * 14}`} stroke="#4E7350" strokeWidth={8} fill="none" strokeLinecap="round" />)}
      </g>
      {/* a power cable across the sky, and a second balcony edge lower down */}
      <path d="M -100 120 Q 500 200 2000 90" stroke="#1E1A22" strokeWidth={5} fill="none" />
      <rect x={300} y={1000} width={1420} height={30} fill="#7A7468" />
      <Glow x={1640} y={170} r={600} o={0.45} />
      <LightVeil id={`${id}v`} lights={[[1500, 220, 700], [960, 470, 600]]} o={0.3} />
    </g>
  );
};

export const Awning: React.FC<{ t: number }> = ({ t }) => (
  <Foreground blur={10}>
    <path d={`M -60 -60 L 980 -60 L 820 ${200 + Math.sin(t / 20) * 4} Q 400 340 -60 540 Z`} fill="#16121C" />
    <path d={`M 820 ${200 + Math.sin(t / 20) * 4} Q 400 340 -60 540`} stroke="#B8483E" strokeWidth={26} fill="none" opacity={0.8} />
  </Foreground>
);
