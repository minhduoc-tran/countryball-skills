import React from 'react';
import { FONT, UI, clamp, easeOut, backOut, rnd, LOOKS } from '../../engine';
import { PAL } from './kit-palette';
import { LoopIcon } from './kit-loop-clock';
import { Wallet50k } from './kit-props';

// Chapter A props (1/2): screens, bubbles and the rules card's tiles. Pure functions of t. x, y = CENTRE unless said.
//   <WeatherScreen t id type? />  the TV weather forecast in a 1000 x 560 box (top-left 0,0): a rain cloud over the
//       city, "16:00" and a red "MƯA LỚN" banner that types itself (`type` = letters shown, 0..7).
//   <WallTv x y w t id type? />   a flat TV on a wall bracket showing WeatherScreen; x y = screen centre, w wide.
//   <JokeBubble x y t s? tail? />  Mo's joke: the SAME bubble every loop, a doodle (a stick man slipping on a banana
//       peel, stars), no words. Pops in from t = 0. tail 1 = tail to the lower right, -1 lower left.
//   <AngryBubble x y t s? />  Pip telling the boss everything: a jagged red bubble of grawlix, lightning, shaking.
//   <RuleTile x y t icon label spinT? />  one card of the rules: icon 'room' | 'wallet' | 'body' | 'people', a mono
//       label; pops in at t 0, from spinT the cyan loop arrow spins on it and the icon ghosts backwards.

export const WeatherScreen: React.FC<{ t: number; id: string; type?: number }> = ({ t, id, type = 7 }) => {
  const word = 'MƯA LỚN';
  const shown = word.slice(0, Math.max(0, Math.min(word.length, Math.floor(type))));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}wx`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24406E" />
          <stop offset="1" stopColor="#4A6A92" />
        </linearGradient>
        <clipPath id={`${id}wc`}><rect width={1000} height={560} /></clipPath>
      </defs>
      <g clipPath={`url(#${id}wc)`}>
        <rect width={1000} height={560} fill={`url(#${id}wx)`} />
        {/* the city skyline along the bottom */}
        {Array.from({ length: 14 }).map((_, i) => {
          const h = 70 + rnd(31, i) * 110;
          return <rect key={i} x={i * 74 - 10} y={560 - h} width={70} height={h} fill="#1A2A48" />;
        })}
        {/* the rain cloud icon, rain falling from it */}
        <g transform={`translate(300 230) translate(0 ${Math.sin(t / 10) * 6})`}>
          {Array.from({ length: 9 }).map((_, i) => {
            const y = ((t * 9 + i * 37) % 150) + 40;
            return <path key={i} d={`M ${-120 + i * 30} ${y} l -12 34`} stroke="#9FD3F0" strokeWidth={9} strokeLinecap="round" opacity={0.9} />;
          })}
          <path d="M -170 40 Q -200 -10 -150 -40 Q -140 -110 -60 -100 Q -20 -160 60 -120 Q 140 -130 150 -50 Q 210 -40 190 30 Q 180 50 150 50 L -140 50 Q -165 50 -170 40 Z" fill="#E8EEF6" stroke="#14203A" strokeWidth={8} />
          <path d="M 40 50 L 10 110 L 44 108 L 18 170" stroke="#FFD04D" strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={(Math.floor(t / 6) % 4) ? 1 : 0.3} />
        </g>
        {/* the time and the banner */}
        <text x={760} y={210} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill="#F6EFE3">16:00</text>
        <rect x={0} y={380} width={1000} height={110} fill="#C8382E" />
        <rect x={0} y={380} width={1000} height={8} fill="#FFFFFF" opacity={0.3} />
        <text x={500} y={466} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={92} fill="#FFFFFF" letterSpacing={6}>{shown}</text>
        {/* scanline sheen */}
        {Array.from({ length: 28 }).map((_, k) => <rect key={k} x={0} y={k * 20} width={1000} height={3} fill="#000" opacity={0.08} />)}
      </g>
    </g>
  );
};

export const WallTv: React.FC<{ x: number; y: number; w: number; t: number; id: string; type?: number }> = ({ x, y, w, t, id, type = 7 }) => {
  const k = w / 1000;
  const h = 560 * k;
  return (
    <g>
      <rect x={x - 30 * k} y={y - 20 * k} width={60 * k} height={40 * k} fill="#1A1A22" />
      <rect x={x - w / 2 - 20 * k} y={y - h / 2 - 20 * k} width={w + 40 * k} height={h + 40 * k} rx={14 * k} fill="#14141C" stroke="#08080C" strokeWidth={4} />
      <g transform={`translate(${x - w / 2} ${y - h / 2}) scale(${k})`}>
        <WeatherScreen t={t} id={id} type={type} />
      </g>
      <circle cx={x + w / 2 + 6 * k} cy={y + h / 2 + 8 * k} r={4} fill="#4CD07D" />
      <rect x={x - w / 2 - 20 * k} y={y - h / 2 - 20 * k} width={w + 40 * k} height={10 * k} rx={5} fill="#FFFFFF" opacity={0.06} />
    </g>
  );
};

/** The joke doodle (always the same): a stick man slipping on a banana peel, stars round his head. ~260 x 180. */
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

export const AngryBubble: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  if (t < 0) return null;
  const pop = backOut(clamp(t / 6));
  const sh = Math.sin(t * 2.3) * 5;
  const n = 18;
  const pts = Array.from({ length: n }).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = i % 2 ? 1 : 1.22 + 0.06 * Math.sin(t / 2 + i);
    return `${(Math.cos(a) * 250 * r).toFixed(1)},${(Math.sin(a) * 150 * r).toFixed(1)}`;
  });
  const glyphs = ['#', '@', '!', '%', '&', '!'];
  return (
    <g transform={`translate(${x + sh} ${y}) scale(${s * pop})`}>
      <path d="M -120 120 L -230 230 L -40 140 Z" fill="#E8553E" stroke={PAL.ink} strokeWidth={7} strokeLinejoin="round" />
      <polygon points={pts.join(' ')} fill="#E8553E" stroke={PAL.ink} strokeWidth={7} strokeLinejoin="round" />
      {glyphs.map((g, i) => (
        <text key={i} x={-190 + i * 76} y={40 + Math.sin(t / 2 + i) * 8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFF3DC" stroke={PAL.ink} strokeWidth={6} paintOrder="stroke" transform={`rotate(${(i % 2 ? 8 : -8)} ${-190 + i * 76} 20)`}>
          {g}
        </text>
      ))}
      <path d="M 170 -150 L 130 -80 L 170 -84 L 130 -10" stroke="#FFD04D" strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
};

/** A line-icon person (head + body), feet at (x, y), ~50 tall at s 1, in any colour (cyan while rewinding). */
export const MiniPerson: React.FC<{ x: number; y: number; s?: number; color?: string; o?: number }> = ({ x, y, s = 1, color = '#F6EFE3', o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx={0} cy={-40} r={8} fill={color} />
    <path d="M -12 -28 L 12 -28 L 9 -8 L -9 -8 Z M -6 -8 L -7 0 M 6 -8 L 7 0" fill={color} />
  </g>
);

/** The rules card's icons, drawn ~220 wide about (0, 0). */
const TileIcon: React.FC<{ icon: 'room' | 'wallet' | 'body' | 'people'; cyan: number }> = ({ icon, cyan }) => {
  const ink = cyan > 0.5 ? PAL.cyanSoft : '#F6EFE3';
  if (icon === 'room') {
    return (
      <g stroke={ink} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round">
        <path d="M -110 -40 L 0 -110 L 110 -40 L 110 90 L -110 90 Z" />
        <path d="M -76 90 L -76 30 L 76 30 L 76 90 M -76 50 L 76 50" />
        <rect x={-66} y={6} width={50} height={24} rx={8} />
        <rect x={30} y={-56} width={44} height={44} />
      </g>
    );
  }
  if (icon === 'wallet') return <g transform="translate(-80 44) scale(0.5)"><Wallet50k x={0} y={0} s={1} /></g>;
  if (icon === 'body') {
    const L = LOOKS.pipHood;
    return (
      <g stroke={ink} strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx={0} cy={-76} r={34} fill={L.skin} stroke={ink} />
        <path d="M -40 -30 L 40 -30 L 32 40 L -32 40 Z" fill={L.jacket} />
        <path d="M -40 -26 L -72 30 M 40 -26 L 72 30 M -20 40 L -26 110 M 20 40 L 26 110" />
      </g>
    );
  }
  return (
    <g>
      {Array.from({ length: 15 }).map((_, i) => {
        const r = Math.floor(i / 5);
        const c = i % 5;
        return <MiniPerson key={i} x={-104 + c * 52 + (r % 2) * 18} y={-50 + r * 58} s={0.8} color={ink} />;
      })}
    </g>
  );
};

export const RuleTile: React.FC<{ x: number; y: number; t: number; icon: 'room' | 'wallet' | 'body' | 'people'; label: string; spinT?: number }> = ({ x, y, t, icon, label, spinT = 999 }) => {
  if (t < 0) return null;
  const pop = backOut(clamp(t / 7));
  const sp = t - spinT;
  const cyan = sp >= 0 ? clamp(sp / 4) : 0;
  // while it rewinds: the icon shudders backwards with a cyan echo
  const back = sp >= 0 && sp < 14 ? -Math.sin(sp * 1.4) * 12 * (1 - sp / 14) : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${pop})`}>
      <rect x={-190} y={-210} width={380} height={420} rx={34} fill={UI.pill} opacity={0.82} />
      <rect x={-190} y={-210} width={380} height={420} rx={34} fill="none" stroke={cyan > 0 ? PAL.cyan : '#F6EFE3'} strokeWidth={cyan > 0 ? 6 : 3} opacity={cyan > 0 ? 0.9 : 0.35} />
      {cyan > 0 ? <g transform={`translate(${back * 2.2} 0)`} opacity={0.35 * cyan}><TileIcon icon={icon} cyan={1} /></g> : null}
      <g transform={`translate(${back} -40)`}>
        <TileIcon icon={icon} cyan={cyan} />
      </g>
      <text x={0} y={160} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={label.length > 8 ? 44 : 50} fill={UI.text} letterSpacing={2}>{label}</text>
      {cyan > 0 ? <LoopIcon x={150} y={-170} r={30} t={sp} spin={-14} /> : null}
    </g>
  );
};

/** Two-frame grow-in helper used by a few overlays. */
export const popIn = (t: number, d = 7) => easeOut(clamp(t / d));
