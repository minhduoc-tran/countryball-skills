import React from 'react';
import { rnd, clamp, easeOut, backOut, FONT, UI } from '../../engine';
import { PAL } from './kit-palette';

// Chapter A props for the beach / first-second shots (all pure functions of the shot clock t).
//   <SeaCover id t y />           water drawn IN FRONT of a floating character: wavy top at world y, foam line, to y 1200.
//   <SplashRings x y t />         rings + droplets from a body dropping into water at t = 0.
//   <PlaceTag label f />          small pill "ĐÀ NẴNG" with a pin, top-left in screen space.
//   <SpeakerMute x y t at />      speaker with sound arcs; at frame `at` the arcs die and a red slash draws on.
//   <NoSign x y t r? />           red "no" circle (ring + slash) drawing on from t = 0, with a slow down arrow inside.

export const SeaCover: React.FC<{ id: string; t: number; y: number; o?: number }> = ({ id, t, y, o = 0.9 }) => {
  let d = `M -300 ${y}`;
  for (let x = -300; x <= 2300; x += 50) d += ` L ${x} ${y + Math.sin(x * 0.014 + t * 0.16) * 6 + Math.sin(x * 0.037 - t * 0.1) * 3}`;
  const crest = d;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sc`} gradientUnits="userSpaceOnUse" x1="0" y1={y - 10} x2="0" y2={y + 380}>
          <stop offset="0" stopColor="#4BB4DC" /><stop offset="0.35" stopColor={PAL.seaTop} /><stop offset="1" stopColor={PAL.seaDeep} />
        </linearGradient>
      </defs>
      <path d={`${d} L 2300 1300 L -300 1300 Z`} fill={`url(#${id}sc)`} opacity={o} />
      <path d={crest} stroke="#FFFFFF" strokeWidth={7} fill="none" opacity={0.85 * o} strokeLinecap="round" />
      <path d={crest} transform="translate(0 16)" stroke="#CFEFFA" strokeWidth={3} fill="none" opacity={0.5 * o} />
    </g>
  );
};

export const SplashRings: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => {
  if (t < 0 || t > 30) return null;
  return (
    <g>
      {[0, 6, 12].map((dl, i) => {
        const p = clamp((t - dl) / 20);
        return p > 0 && p < 1 ? <ellipse key={i} cx={x} cy={y} rx={30 + p * 200} ry={6 + p * 34} fill="none" stroke="#FFFFFF" strokeWidth={6 * (1 - p)} opacity={1 - p} /> : null;
      })}
      {Array.from({ length: 14 }).map((_, i) => {
        const vx = (rnd(7, i) - 0.5) * 16;
        const vy = -10 - rnd(8, i) * 12;
        return <circle key={i} cx={x + vx * t} cy={y + vy * t + 0.9 * t * t} r={5 + rnd(9, i) * 5} fill="#E8F7FC" opacity={clamp(1 - t / 26)} />;
      })}
    </g>
  );
};

export const PlaceTag: React.FC<{ label: string; f: number }> = ({ label, f }) => {
  const s = backOut(clamp((f + 2) / 8));
  return (
    <g transform={`translate(70 70) scale(${s})`}>
      <rect width={label.length * 24 + 96} height={72} rx={36} fill={UI.pill} opacity={0.7} />
      <path d="M 38 18 a 14 14 0 0 1 14 14 c 0 12 -14 24 -14 24 c 0 0 -14 -12 -14 -24 a 14 14 0 0 1 14 -14 Z" fill="#FF5A48" />
      <circle cx={38} cy={32} r={5} fill="#FFFFFF" />
      <text x={74} y={48} fontFamily={FONT.ui} fontWeight={700} fontSize={32} fill={UI.text} letterSpacing={3}>{label}</text>
    </g>
  );
};

export const SpeakerMute: React.FC<{ x: number; y: number; t: number; at: number }> = ({ x, y, t, at }) => {
  const muted = t >= at;
  const pop = backOut(clamp((t + 2) / 8));
  const slash = easeOut(clamp((t - at) / 7));
  return (
    <g transform={`translate(${x} ${y}) scale(${pop * 1.7})`}>
      <circle r={96} fill={UI.pill} opacity={0.62} />
      <path d="M -62 -22 L -34 -22 L 4 -56 L 4 56 L -34 22 L -62 22 Z" fill={UI.text} stroke="#1A1230" strokeWidth={4} strokeLinejoin="round" />
      {!muted ? [0, 1, 2].map((i) => {
        const p = ((t * 0.045 + i / 3) % 1);
        return <path key={i} d={`M ${18 + p * 52} ${-16 - p * 30} Q ${34 + p * 52} 0 ${18 + p * 52} ${16 + p * 30}`} stroke={UI.text} strokeWidth={7} fill="none" strokeLinecap="round" opacity={Math.sin(p * Math.PI)} />;
      }) : null}
      {slash > 0 ? <path d={`M -80 -80 L ${-80 + 160 * slash} ${-80 + 160 * slash}`} stroke={UI.bad} strokeWidth={13} strokeLinecap="round" /> : null}
    </g>
  );
};

export const NoSign: React.FC<{ x: number; y: number; t: number; r?: number }> = ({ x, y, t, r = 190 }) => {
  const ring = easeOut(clamp(t / 9));
  const slash = easeOut(clamp((t - 7) / 7));
  const drop = ((t * 0.02) % 1) * 36;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r - 14} fill={UI.pill} opacity={0.5 * ring} />
      {/* the slow trickle: a thin arrow creeping down */}
      <g opacity={ring}>
        <path d={`M 0 ${-80 + drop} L 0 ${50 + drop}`} stroke={UI.text} strokeWidth={14} strokeLinecap="round" />
        <path d={`M -34 ${18 + drop} L 0 ${58 + drop} L 34 ${18 + drop}`} stroke={UI.text} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M -110 -112 L 110 -112" stroke={PAL.seaTop} strokeWidth={10} strokeLinecap="round" />
      </g>
      <circle r={r} fill="none" stroke={UI.bad} strokeWidth={26} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} transform="rotate(-90)" />
      {slash > 0 ? <path d={`M ${-r * 0.71} ${-r * 0.71} L ${-r * 0.71 + r * 1.42 * slash} ${-r * 0.71 + r * 1.42 * slash}`} stroke={UI.bad} strokeWidth={26} strokeLinecap="round" /> : null}
    </g>
  );
};
