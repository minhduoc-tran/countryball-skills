import React from 'react';
import { Pose, FONT, UI, clamp, easeOut, backOut, rnd, mixHex, Glow } from '../../engine';

// Chapter B, local props: a soft dusk backdrop for close-ups, the park + bench of the waiting gag (a sun and moon that
// race across the sky), a long white beard, a paper crown and a pill counter. Head pieces are drawn in the rig's local
// coordinates (hip at 0,0; head centre at 0,-176, radius 62) and scaled by the pose, so they ride along with Pip.

/** A calm dusk gradient with soft bokeh for the close-ups (no set needed). Fills the whole 1920 x 1080 frame and beyond. */
export const Backdrop: React.FC<{ id: string; t: number; top?: string; bottom?: string }> = ({ id, t, top = '#2A2250', bottom = '#7A4A5A' }) => (
  <g>
    <defs>
      <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect x={-600} y={-500} width={3200} height={2200} fill={`url(#${id}bg)`} />
    {Array.from({ length: 12 }).map((_, i) => (
      <circle key={i} cx={100 + rnd(3, i) * 1720 + Math.sin(t / 40 + i) * 14} cy={80 + rnd(5, i) * 700} r={30 + rnd(7, i) * 70} fill="#FFD9A0" opacity={0.07 + rnd(9, i) * 0.06} />
    ))}
  </g>
);

/** The head's local frame: put head decorations inside, after the Hero, with the same pose. */
const HeadFrame: React.FC<{ pose: Pose; children: React.ReactNode }> = ({ pose, children }) => (
  <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.tilt}) rotate(${pose.headTilt} 0 -118) translate(${pose.yaw * 6} 0)`}>{children}</g>
);

/** A white beard that grows: `len` 0..1 (stubble to the belt), with a moustache once it is long enough. */
export const Beard: React.FC<{ pose: Pose; len: number; t?: number }> = ({ pose, len, t = 0 }) => {
  if (len <= 0.02) return null;
  const L = 14 + len * 190;
  const sway = Math.sin(t / 9) * 4 * len;
  const tipX = sway;
  const d = `M -58 -158 C -64 ${-104 + L * 0.3} -30 ${-112 + L * 0.8} ${tipX} ${-110 + L} C 30 ${-112 + L * 0.8} 64 ${-104 + L * 0.3} 58 -158 C 40 -130 -40 -130 -58 -158 Z`;
  return (
    <HeadFrame pose={pose}>
      <g transform={`translate(${pose.yaw * 26} 0)`}>
        <path d={d} fill="#F4F2EE" stroke="#A9A7BA" strokeWidth={3.5} strokeLinejoin="round" />
        <path d={`M -26 -120 Q -30 ${-110 + L * 0.5} -14 ${-110 + L * 0.8} M 0 -118 L ${tipX * 0.6} ${-112 + L * 0.9} M 26 -120 Q 30 ${-110 + L * 0.5} 14 ${-110 + L * 0.8}`} stroke="#C9C7D8" strokeWidth={3} fill="none" strokeLinecap="round" />
        {len > 0.25 ? (
          <g fill="#F4F2EE" stroke="#A9A7BA" strokeWidth={3}>
            <path d="M -2 -156 Q -20 -170 -40 -156 Q -24 -146 -2 -150 Z" />
            <path d="M 2 -156 Q 20 -170 40 -156 Q 24 -146 2 -150 Z" />
          </g>
        ) : null}
      </g>
    </HeadFrame>
  );
};

/** A paper crown (a gold zigzag band with red and blue dots) on top of the head; `drop` 0..1 settles it from above. */
export const PaperCrown: React.FC<{ pose: Pose; drop?: number }> = ({ pose, drop = 1 }) => {
  const k = easeOut(clamp(drop));
  return (
    <HeadFrame pose={pose}>
      <g transform={`translate(${pose.yaw * -10} ${-(1 - k) * 120 - 6}) rotate(${(1 - k) * 18} 0 -236)`}>
        <path d="M -46 -224 L -52 -286 L -26 -258 L 0 -296 L 26 -258 L 52 -286 L 46 -224 Z" fill="#F5C542" stroke="#8A5A10" strokeWidth={4} strokeLinejoin="round" />
        <path d="M -46 -224 L 46 -224" stroke="#8A5A10" strokeWidth={5} />
        <circle cx={-52} cy={-286} r={6} fill="#D94452" />
        <circle cx={0} cy={-296} r={7} fill="#4A8FD9" />
        <circle cx={52} cy={-286} r={6} fill="#D94452" />
        <circle cx={0} cy={-241} r={7} fill="#D94452" />
      </g>
    </HeadFrame>
  );
};

/** A mono pill (top centre) with a running time: "31 NĂM 8 THÁNG". */
export const TimePill: React.FC<{ x: number; y: number; text: string; w?: number; pop?: number; size?: number }> = ({ x, y, text, w = 760, pop = 1, size = 64 }) => (
  <g transform={`translate(${x} ${y}) scale(${0.85 + 0.15 * backOut(clamp(pop))})`}>
    <rect x={-w / 2} y={-52} width={w} height={104} rx={52} fill={UI.pill} opacity={0.78} />
    <rect x={-w / 2} y={-52} width={w} height={104} rx={52} fill="none" stroke={UI.text} strokeWidth={3} opacity={0.8} />
    <text y={size * 0.34} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={UI.live} letterSpacing={3}>{text}</text>
  </g>
);

/**
 * A park at the end of the day and the day again, again: the sun and the moon race along an arc (`period` frames per
 * day), the sky goes blue to deep blue, then trees and grass. Ground line at y 800.
 */
export const ParkRace: React.FC<{ id: string; t: number; period?: number }> = ({ id, t, period = 22 }) => {
  const a = (t / period) * Math.PI * 2 + 0.9;
  const sunH = Math.sin(a);
  const day = clamp(sunH * 1.6 + 0.5);
  const sky = mixHex('#14183E', '#9ED8F2', day);
  const sky2 = mixHex('#2A2A5C', '#F6D2A0', clamp(day * 1.1 - 0.1));
  const sx = 960 + Math.cos(a) * 760;
  const sy = 700 - sunH * 520;
  const mx = 960 - Math.cos(a) * 760;
  const my = 700 + sunH * 520;
  const leaf = (i: number) => {
    const p = ((t * (0.7 + rnd(2, i) * 0.6) + rnd(4, i) * 400) % 400) / 400;
    return { x: 200 + rnd(6, i) * 1500 + Math.sin(p * 18 + i) * 60, y: -60 + p * 940, r: p * 700 };
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky} />
          <stop offset="1" stopColor={sky2} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2720} height={1250} fill={`url(#${id}sky)`} />
      {sunH < 0.25 ? Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={rnd(1, i) * 1920} cy={rnd(2, i) * 520} r={2.5 + rnd(3, i) * 2} fill="#FFF6D0" opacity={clamp(0.25 - sunH) * 2.4} />) : null}
      {sy < 800 ? <g><Glow x={sx} y={sy} r={300} o={0.7 * clamp(sunH * 3 + 0.4)} /><circle cx={sx} cy={sy} r={70} fill="#FFE49A" /></g> : null}
      {my < 800 ? <g opacity={clamp(-sunH * 3)}><circle cx={mx} cy={my} r={50} fill="#EDEFF8" /><circle cx={mx + 16} cy={my - 8} r={44} fill={sky} opacity={0.0} /></g> : null}
      {/* far tree line and hills */}
      <path d="M -50 800 L -50 640 Q 120 540 300 650 Q 460 560 640 660 Q 820 580 1000 650 Q 1200 560 1380 660 Q 1560 570 1760 650 Q 1860 600 1980 640 L 1980 800 Z" fill={mixHex('#16301F', '#3C7A48', day * 0.8)} />
      <rect x={-100} y={780} width={2200} height={400} fill={mixHex('#0E2214', '#4B8F52', day * 0.85)} />
      <path d="M 560 1080 Q 800 880 1200 790 L 1320 790 Q 980 900 1000 1080 Z" fill={mixHex('#2A2420', '#B8A27A', day * 0.8)} opacity={0.7} />
      {Array.from({ length: 9 }).map((_, i) => {
        const l = leaf(i);
        return <ellipse key={i} cx={l.x} cy={l.y} rx={11} ry={6} fill={['#D9822B', '#C4482B', '#E8B84A'][i % 3]} transform={`rotate(${l.r} ${l.x} ${l.y})`} opacity={0.8} />;
      })}
    </g>
  );
};

/** A park bench in profile, facing right: x the middle, y the ground; the seat top is at y - 125 * s. */
export const Bench: React.FC<{ x: number; y: number; s?: number; dusty?: number }> = ({ x, y, s = 1, dusty = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={250} ry={16} fill="#000" opacity={0.4} />
    <path d="M -170 0 L -178 -110 M 170 0 L 178 -110" stroke="#2A2A36" strokeWidth={14} strokeLinecap="round" />
    <rect x={-226} y={-128} width={452} height={22} rx={6} fill="#9A6A44" stroke="#4A2E1A" strokeWidth={3} />
    <rect x={-226} y={-106} width={452} height={8} rx={3} fill="#5A3A24" />
    <rect x={-236} y={-262} width={26} height={150} rx={8} fill="#8A5A3A" stroke="#4A2E1A" strokeWidth={3} />
    <rect x={-236} y={-224} width={26} height={12} fill="#5A3A24" />
    <rect x={-236} y={-178} width={26} height={12} fill="#5A3A24" />
    {dusty > 0 ? <path d="M -226 -128 q 40 -30 70 -6 q 40 -22 70 -4" stroke="#DCD6C8" strokeWidth={3} fill="none" opacity={dusty} /> : null}
  </g>
);
