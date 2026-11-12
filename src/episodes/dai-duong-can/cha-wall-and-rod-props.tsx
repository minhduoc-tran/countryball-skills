import React from 'react';
import { rnd, Pose, joints, toWorld } from '../../engine';
import { PAL, mix } from './kit-palette';

// Chapter A props for Mo on the sea wall (bờ kè). Pure functions of t.
//   <SeaWall top? />                    a concrete promenade wall across the frame, its coping at world y `top` (default 800).
//   <FishingRod pose t sway? />         a rod from the hero's right hand (pose.armR end) up and forward, line + hook hanging.
//   <AbyssPov t />                      looking straight down off the wall: strata walls converge to a black depth, pebbles fall, a line dangles.

export const SeaWall: React.FC<{ top?: number }> = ({ top = 800 }) => (
  <g>
    <defs>
      <linearGradient id="caWallFace" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFC6B4" /><stop offset="1" stopColor="#8E8574" /></linearGradient>
    </defs>
    <rect x={-300} y={top + 30} width={2520} height={600} fill="url(#caWallFace)" />
    {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${-200 + i * 240} ${top + 30} L ${-200 + i * 240} 1300`} stroke="#6E6656" strokeWidth={4} opacity={0.55} />)}
    {Array.from({ length: 3 }).map((_, i) => <path key={i} d={`M -300 ${top + 130 + i * 140} L 2300 ${top + 130 + i * 140}`} stroke="#6E6656" strokeWidth={3} opacity={0.3} />)}
    <rect x={-300} y={top} width={2520} height={34} fill="#EDE5D2" stroke="#6E6656" strokeWidth={4} />
    <rect x={-300} y={top} width={2520} height={8} fill="#FFFFFF" opacity={0.55} />
    {[420, 1500].map((x) => (
      <g key={x}>
        <ellipse cx={x} cy={top + 4} rx={44} ry={8} fill="#000" opacity={0.2} />
        <rect x={x - 22} y={top - 62} width={44} height={66} rx={10} fill="#8C8578" stroke="#4B4538" strokeWidth={4} />
        <rect x={x - 26} y={top - 74} width={52} height={20} rx={9} fill="#B7AF9F" stroke="#4B4538" strokeWidth={4} />
      </g>
    ))}
  </g>
);

export const FishingRod: React.FC<{ pose: Pose; t: number; len?: number; bendDeg?: number }> = ({ pose, t, len = 420, bendDeg = 0 }) => {
  const h = toWorld(pose, joints(pose).armR.end);
  const dir = pose.yaw >= 0 ? 1 : -1;
  const ang = (-38 + bendDeg) * (Math.PI / 180);
  const tipX = h.x + dir * Math.cos(ang) * len;
  const tipY = h.y + Math.sin(ang) * len;
  const sway = Math.sin(t / 9) * 10;
  const midX = h.x + dir * Math.cos(ang) * len * 0.55;
  const midY = h.y + Math.sin(ang) * len * 0.55 - 18;
  const lineEnd = { x: tipX + sway * 0.6 + dir * 6, y: tipY + 360 };
  return (
    <g>
      <path d={`M ${h.x - dir * 40} ${h.y + 24} L ${h.x} ${h.y} Q ${midX} ${midY} ${tipX} ${tipY}`} stroke="#3A2A1C" strokeWidth={9} strokeLinecap="round" fill="none" />
      <path d={`M ${tipX} ${tipY} Q ${tipX + sway} ${tipY + 180} ${lineEnd.x} ${lineEnd.y}`} stroke="#F4F1EA" strokeWidth={3} fill="none" opacity={0.9} />
      <path d={`M ${lineEnd.x} ${lineEnd.y} q 0 22 -12 22 q -10 0 -10 -10`} stroke="#C9CED6" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const AbyssPov: React.FC<{ t: number }> = ({ t }) => {
  const VX = 960;
  const VY = 600;
  // strata ledges: nested rounded rectangles shrinking into the dark; the near ones are sunlit, the deep ones black
  const rings = Array.from({ length: 12 }).map((_, k) => {
    const p = Math.pow(k / 12, 1.45);
    return { w: 2400 * (1 - p) + 70, h: 1560 * (1 - p) + 50, k, shade: Math.pow(k / 11, 1.15) };
  });
  return (
    <g>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#050403" />
      {rings.map(({ w, h, k, shade }) => {
        const lit = mix('#C2A47A', '#0C0907', shade);
        const dark = mix('#8A7050', '#080605', shade);
        return (
          <g key={k}>
            <rect x={VX - w / 2} y={VY - h / 2 + k * 6} width={w} height={h} rx={w * 0.16} fill={k % 2 ? dark : lit} />
            <path d={`M ${VX - w * 0.38} ${VY - h / 2 + k * 6 + 3} L ${VX + w * 0.38} ${VY - h / 2 + k * 6 + 3}`} stroke={mix('#F3DDB2', '#1A140F', shade)} strokeWidth={9 - k * 0.6} strokeLinecap="round" opacity={0.85} />
          </g>
        );
      })}
      <ellipse cx={VX} cy={VY + 40} rx={80} ry={52} fill="#000" />
      {/* pebbles falling away: they shrink into the dark and never land */}
      {Array.from({ length: 6 }).map((_, i) => {
        const p = ((t * 0.018 + i / 6) % 1);
        const s = 1 - p;
        const ox = (rnd(5, i) - 0.5) * 520;
        return <ellipse key={i} cx={VX + ox * s} cy={VY - 340 * s + 360 - 40 * s} rx={22 * s + 2} ry={15 * s + 2} fill="#D9C39A" opacity={0.95 * s} />;
      })}
      {/* Mo's fishing line hanging into the shaft */}
      <path d={`M ${VX + 40} -40 Q ${VX + 60 + Math.sin(t / 12) * 18} 280 ${VX + 8} 520`} stroke={PAL.salt} strokeWidth={4} fill="none" />
      <path d={`M ${VX + 8} 520 q 0 20 -12 20 q -9 0 -9 -9`} stroke="#C9CED6" strokeWidth={4} fill="none" strokeLinecap="round" />
    </g>
  );
};
