import React from 'react';
import { rnd, clamp, SCH, FONT, mixHex } from '../../engine';

// Chapter C props, part 2: the cold. Breath clouds, a frosting window pane, a thermometer, Earth losing heat to
// space, and a phone showing the time. All pure functions of the shot clock `t`.

/** Breath: a puff every `every` frames drifting out and fading. x, y = the mouth; dir = 1 right, -1 left. */
export const BreathPuff: React.FC<{ x: number; y: number; t: number; dir?: number; s?: number; every?: number }> = ({ x, y, t, dir = 1, s = 1, every = 36 }) => (
  <g transform={`translate(${x} ${y}) scale(${dir * s} ${s})`} filter="url(#blur3)">
    {[0, 1].map((cyc) => {
      const k = (((t + cyc * every * 0.5) % every) + every) % every;
      const p = k / every;
      const live = p < 0.85 ? 1 : 0;
      return Array.from({ length: 5 }).map((_, i) => {
        const q = clamp(p * 1.15 - i * 0.05);
        return (
          <circle key={`${cyc}${i}`} cx={30 + q * (150 + i * 26)} cy={-q * (60 + i * 10) + Math.sin(q * 5 + i) * 6} r={(14 + q * 54) * (0.7 + i * 0.12)} fill="#F2F8FF" opacity={live * Math.max(0, 0.95 - q * 0.9)} />
        );
      });
    })}
  </g>
);

/** A window pane with frost creeping in from the edges: crystals branch inward as `p` goes 0..1. x0 y0 x1 y1 = the pane. */
export const FrostPane: React.FC<{ x0: number; y0: number; x1: number; y1: number; p: number; seed?: number; id: string }> = ({ x0, y0, x1, y1, p, seed = 5, id }) => {
  const w = x1 - x0;
  const h = y1 - y0;
  const seeds: React.ReactNode[] = [];
  const branch = (sx: number, sy: number, ang: number, len: number, depth: number, k: number, key: string) => {
    const ex = sx + Math.cos(ang) * len * p;
    const ey = sy + Math.sin(ang) * len * p;
    seeds.push(<path key={key} d={`M ${sx} ${sy} L ${ex} ${ey}`} stroke="#EAF6FF" strokeWidth={Math.max(1.2, 3 - depth * 0.9)} strokeLinecap="round" opacity={0.8} />);
    if (depth < 2) {
      for (let j = 1; j <= 2; j++) {
        const f = j / 3 + 0.1;
        const bx = sx + Math.cos(ang) * len * p * f;
        const by = sy + Math.sin(ang) * len * p * f;
        branch(bx, by, ang + 0.8, len * 0.38, depth + 1, k + j, `${key}a${j}`);
        branch(bx, by, ang - 0.8, len * 0.38, depth + 1, k + j + 9, `${key}b${j}`);
      }
    }
  };
  for (let i = 0; i < 6; i++) {
    const r = rnd(seed, i);
    branch(x0 + r * w, y1, -Math.PI / 2 + (rnd(seed + 1, i) - 0.5) * 0.7, h * (0.35 + rnd(seed + 2, i) * 0.3), 0, i, `b${i}`);
  }
  for (let i = 0; i < 3; i++) {
    branch(x0 + rnd(seed + 3, i) * w, y0, Math.PI / 2 + (rnd(seed + 8, i) - 0.5) * 0.7, h * 0.22, 0, i + 20, `t${i}`);
    branch(x0, y0 + h * (0.3 + rnd(seed + 6, i) * 0.6), (rnd(seed + 7, i) - 0.5) * 0.6, w * 0.22, 0, i + 40, `l${i}`);
    branch(x1, y0 + h * (0.3 + rnd(seed + 9, i) * 0.6), Math.PI + (rnd(seed + 10, i) - 0.5) * 0.6, w * 0.22, 0, i + 50, `r${i}`);
  }
  return (
    <g>
      <defs>
        <clipPath id={`${id}fc`}><rect x={x0} y={y0} width={w} height={h} /></clipPath>
        <radialGradient id={`${id}fg`} cx="0.5" cy="0.5" r="0.7">
          <stop offset="0.35" stopColor="#CFE6FF" stopOpacity={0} />
          <stop offset="1" stopColor="#EAF6FF" stopOpacity={0.75} />
        </radialGradient>
      </defs>
      <g clipPath={`url(#${id}fc)`}>
        <rect x={x0} y={y0} width={w} height={h} fill={`url(#${id}fg)`} opacity={clamp(p * 1.3)} />
        {seeds}
      </g>
    </g>
  );
};

/** A thermometer: tube at x (centre), y (top), height h. `v` = temperature in deg C (drawn from +30 down to -80). `frost` 0..1. */
export const Thermometer: React.FC<{ x: number; y: number; h: number; v: number; frost?: number; size?: number }> = ({ x, y, h, v, frost = 0, size = 1 }) => {
  const lo = -80;
  const hi = 30;
  const f = clamp((v - lo) / (hi - lo));
  const bulbR = 56 * size;
  const tw = 54 * size;
  const bottom = y + h;
  const levelY = bottom - (h - 20) * f;
  const col = mixHex('#7FC4FF', '#FF5A4A', clamp((v + 10) / 20));
  return (
    <g>
      <rect x={x - tw / 2} y={y} width={tw} height={h + 10} rx={tw / 2} fill="#0E1A30" stroke={SCH.line} strokeWidth={7} />
      <circle cx={x} cy={bottom + bulbR * 0.5} r={bulbR} fill="#0E1A30" stroke={SCH.line} strokeWidth={7} />
      <circle cx={x} cy={bottom + bulbR * 0.5} r={bulbR - 10} fill={col} />
      <rect x={x - tw / 2 + 12} y={levelY} width={tw - 24} height={bottom + 6 - levelY} fill={col} />
      <rect x={x - tw / 2 + 12} y={levelY - 3} width={tw - 24} height={6} rx={3} fill="#fff" opacity={0.5} />
      {[30, 0, -18, -40, -73].map((tv) => {
        const ty = bottom - (h - 20) * clamp((tv - lo) / (hi - lo));
        return (
          <g key={tv}>
            <path d={`M ${x + tw / 2 + 8} ${ty} L ${x + tw / 2 + 36} ${ty}`} stroke={tv === 0 ? SCH.line : SCH.dim} strokeWidth={tv === 0 ? 5 : 3.5} />
            <text x={x + tw / 2 + 48} y={ty + 9} fontFamily={FONT.ui} fontSize={24} fill={SCH.dim}>{tv}</text>
          </g>
        );
      })}
      {frost > 0 ? (
        <g opacity={clamp(frost * 1.2)}>
          {Array.from({ length: 60 }).map((_, i) => {
            const fy = bottom - rnd(3, i) * (h + 10) * frost;
            const dx = (rnd(4, i) - 0.5) * tw * 0.9;
            return <path key={i} d={`M ${x + dx} ${fy} l ${(rnd(5, i) - 0.5) * 34} ${(rnd(6, i) - 0.5) * 34} m 0 0`} stroke="#EAF6FF" strokeWidth={3} strokeLinecap="round" />;
          })}
          <rect x={x - tw / 2 - 3} y={y} width={tw + 6} height={h + 10} rx={tw / 2} fill="#EAF6FF" opacity={0.28 * frost} />
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={`ic${i}`} d={`M ${x - tw / 2 - 4} ${y + 30 + i * (h / 8)} l -${10 + rnd(8, i) * 18} ${6 + rnd(9, i) * 10}`} stroke="#EAF6FF" strokeWidth={4} strokeLinecap="round" opacity={0.9} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/** Earth as a line icon (blue disc, green land) with wavy heat arrows leaving into space. x, y centre. */
export const EarthLosingHeat: React.FC<{ x: number; y: number; r: number; t: number; o?: number }> = ({ x, y, r, t, o = 1 }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r + 8} fill="#7FC4FF" opacity={0.12} />
    <circle cx={x} cy={y} r={r} fill="#1E4A7A" stroke={SCH.line} strokeWidth={8} />
    <g clipPath={`url(#earthclip${Math.round(r)})`}>
      <defs><clipPath id={`earthclip${Math.round(r)}`}><circle cx={x} cy={y} r={r - 4} /></clipPath></defs>
      <path d={`M ${x - r * 0.7} ${y - r * 0.2} Q ${x - r * 0.4} ${y - r * 0.8} ${x - r * 0.05} ${y - r * 0.4} Q ${x + r * 0.1} ${y - r * 0.1} ${x - r * 0.3} ${y + r * 0.1} Q ${x - r * 0.5} ${y + r * 0.5} ${x - r * 0.7} ${y - r * 0.2} Z`} fill="#4E9A5A" />
      <path d={`M ${x + r * 0.3} ${y - r * 0.1} Q ${x + r * 0.7} ${y - r * 0.4} ${x + r * 0.85} ${y + r * 0.1} Q ${x + r * 0.6} ${y + r * 0.6} ${x + r * 0.35} ${y + r * 0.3} Z`} fill="#4E9A5A" />
      <path d={`M ${x - r} ${y + r * 0.7} Q ${x} ${y + r * 0.4} ${x + r} ${y + r * 0.7} L ${x + r} ${y + r} L ${x - r} ${y + r} Z`} fill="#000" opacity={0.28} />
    </g>
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 + 0.2;
      const phase = ((t * 0.018 + i * 0.37) % 1 + 1) % 1;
      const r0 = r + 26 + phase * 20;
      const r1 = r0 + 130 + (i % 3) * 22;
      const pts = Array.from({ length: 9 }).map((__, k) => {
        const rr = r0 + ((r1 - r0) * k) / 8;
        const wob = Math.sin(k * 1.8 + t * 0.25 + i) * 10;
        const aa = a + (wob / rr);
        return `${(x + Math.cos(aa) * rr).toFixed(1)} ${(y + Math.sin(aa) * rr).toFixed(1)}`;
      });
      const ex = x + Math.cos(a) * r1;
      const ey = y + Math.sin(a) * r1;
      const fade = clamp(1 - phase * 0.3);
      return (
        <g key={i} opacity={fade}>
          <path d={`M ${pts.join(' L ')}`} stroke={SCH.live} strokeWidth={7} fill="none" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${SCH.glow})` }} />
          <path d={`M ${ex} ${ey} l ${Math.cos(a + 2.6) * 26} ${Math.sin(a + 2.6) * 26} M ${ex} ${ey} l ${Math.cos(a - 2.6) * 26} ${Math.sin(a - 2.6) * 26}`} stroke={SCH.live} strokeWidth={7} strokeLinecap="round" />
        </g>
      );
    })}
  </g>
);

/** A phone, big and front-on, screen showing the time on a dark starry wallpaper. x, y = centre; w = width. */
export const PhoneClock: React.FC<{ x: number; y: number; w?: number; rot?: number; t: number; time?: string; ampm?: string }> = ({ x, y, w = 420, rot = 0, t, time = '12:30', ampm = 'PM' }) => {
  const s = w / 420;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-210} y={-430} width={420} height={860} rx={64} fill="#0A0B12" stroke="#3A3E58" strokeWidth={6} />
      <rect x={-190} y={-410} width={380} height={820} rx={50} fill="#080C22" />
      {Array.from({ length: 36 }).map((_, i) => (
        <circle key={i} cx={-180 + rnd(11, i) * 360} cy={-400 + rnd(12, i) * 800} r={1 + rnd(13, i) * 2} fill="#DDE6FF" opacity={0.25 + 0.5 * Math.abs(Math.sin(t / (9 + rnd(14, i) * 8) + i))} />
      ))}
      <ellipse cx={20} cy={260} rx={170} ry={60} fill="#3A3A8A" opacity={0.3} />
      <rect x={-34} y={-392} width={68} height={20} rx={10} fill="#000" />
      <text x={-160} y={-352} fontFamily={FONT.ui} fontSize={22} fill="#DDE6FF">{ampm === 'PM' ? '12:30' : time}</text>
      <rect x={118} y={-370} width={34} height={16} rx={4} fill="none" stroke="#DDE6FF" strokeWidth={2.5} />
      <rect x={121} y={-367} width={28} height={10} rx={2} fill="#9BE08A" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={80 + i * 7} y={-366 - i * 3} width={4} height={8 + i * 3} fill="#DDE6FF" />)}
      <text x={0} y={-130} textAnchor="middle" fontFamily={FONT.ui} fontSize={130} fill="#F4F6FF" style={{ filter: 'drop-shadow(0 0 12px #7F9CFF)' }}>{time}</text>
      <text x={0} y={-72} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#FFE2A8" letterSpacing={6}>{ampm}</text>
      <rect x={-60} y={380} width={120} height={7} rx={3.5} fill="#DDE6FF" opacity={0.6} />
    </g>
  );
};
