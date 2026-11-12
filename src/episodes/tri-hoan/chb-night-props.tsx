import React from 'react';
import { clamp, easeOut, backOut, rnd, FONT, Glow, Sun, Pose, HEAD } from '../../engine';

const SLIDE_RED = '#E0302F';

// Chapter B props (4/4): the all-nighter. The printer that is out of ink (blank pages), a wavy red spell-check
// underline, a school gate at sunrise to run towards, and the messy printed presentation. Pure functions of t.

/** A wavy red underline from (x, y) of width w (the spell-check squiggle), drawn on from t = 0. */
export const Squiggle: React.FC<{ x: number; y: number; w: number; t: number; amp?: number }> = ({ x, y, w, t, amp = 7 }) => {
  const p = easeOut(clamp(t / 8));
  if (t < 0) return null;
  const n = Math.round(w / 16);
  let d = `M ${x} ${y}`;
  for (let i = 1; i <= n; i++) d += ` Q ${x + (i - 0.5) * 16} ${y + (i % 2 ? -amp : amp)} ${x + i * 16} ${y}`;
  return <path d={d} stroke={SLIDE_RED} strokeWidth={5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
};

/** The printer: a grey body, a paper tray, a red warning light and a cartridge icon; blank pages slide out of the front at `out`
 *  (0..n pages). Origin = bottom centre of the body. */
export const Printer: React.FC<{ x: number; y: number; s?: number; t: number; pages?: number }> = ({ x, y, s = 1, t, pages = 3 }) => {
  const blink = t % 16 < 9 ? 1 : 0.25;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cy={6} rx={270} ry={18} fill="#000" opacity={0.4} />
      {/* the paper tray at the back and the output tray at the front */}
      <rect x={-130} y={-290} width={260} height={90} fill="#E8E4F0" stroke="#5A5870" strokeWidth={5} />
      <path d="M -150 -40 L 150 -40 L 190 10 L -190 10 Z" fill="#8C8AA4" />
      <rect x={-230} y={-210} width={460} height={186} rx={20} fill="#B8B6CC" stroke="#4A4860" strokeWidth={6} />
      <rect x={-230} y={-210} width={460} height={30} rx={18} fill="#D2D0E2" />
      <rect x={-190} y={-100} width={380} height={30} rx={8} fill="#2A2838" />
      {/* the blank pages sliding out, each a little further */}
      {Array.from({ length: pages }).map((_, i) => {
        const k = easeOut(clamp((t - 4 - i * 9) / 12));
        return (
          <g key={i} transform={`translate(${(i - 1) * 26} ${-84 + k * (96 + i * 8)}) rotate(${(i - 1) * 5})`} opacity={clamp(k * 4)}>
            <rect x={-96} y={-4} width={192} height={236 * k + 6} fill="#FAF7EE" stroke="#BDB6A4" strokeWidth={3} />
          </g>
        );
      })}
      {/* the display: a red cartridge with an empty drop */}
      <rect x={120} y={-186} width={88} height={50} rx={8} fill="#1A1824" />
      <path d="M 164 -178 Q 182 -158 164 -146 Q 146 -158 164 -178 Z" fill="none" stroke="#FF4A3F" strokeWidth={5} opacity={blink} />
      <circle cx={-200} cy={-190} r={9} fill="#FF3B30" opacity={blink} />
      <Glow x={-200} y={-190} r={90} kind="red" o={0.5 * blink} />
    </g>
  );
};

/** The school gate at sunrise: a pink-orange sky with a low sun, the school block with a flag, gate pillars, the pavement. */
export const SchoolGate: React.FC<{ t: number; id?: string }> = ({ t, id = 'gate' }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1={0} y1={0} x2={0} y2={1}>
        <stop offset="0" stopColor="#6A5CA8" /><stop offset="0.55" stopColor="#F29A7E" /><stop offset="1" stopColor="#FFD08A" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2720} height={1450} fill={`url(#${id}sky)`} />
    <Sun x={1500} y={640} r={110} t={t} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-40 + i * 190} y={560 - rnd(5, i) * 120} width={150} height={300} fill="#8C6C9A" opacity={0.7} />)}
    {/* school block */}
    <rect x={280} y={380} width={820} height={420} fill="#E8C8A0" stroke="#7A5A48" strokeWidth={6} />
    <rect x={240} y={350} width={900} height={50} fill="#C25A4A" />
    {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={320 + i * 110} y={450} width={64} height={86} fill="#5A6A9A" stroke="#7A5A48" strokeWidth={4} />)}
    <rect x={650} y={640} width={110} height={160} fill="#6A4A3A" />
    <path d="M 690 350 L 690 220" stroke="#5A4A48" strokeWidth={8} /><path d={`M 692 224 q ${34 + Math.sin(t / 5) * 8} 6 66 -4 l 0 40 q -${30 + Math.sin(t / 5) * 8} 8 -66 4 Z`} fill="#E0302F" />
    {/* gate pillars and bars */}
    {[1180, 1560].map((px) => <rect key={px} x={px} y={470} width={70} height={340} fill="#B8A090" stroke="#5A4A44" strokeWidth={5} />)}
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={1250 + i * 34} y={540} width={8} height={270} fill="#3A3040" />)}
    <rect x={1180} y={536} width={450} height={10} fill="#3A3040" />
    <rect x={-400} y={800} width={2720} height={280} fill="#5A4A58" />
    <rect x={-400} y={800} width={2720} height={10} fill="#FFC27A" opacity={0.7} />
    <Glow x={1500} y={700} r={600} kind="warm" o={0.45} />
  </g>
);

/** The messy printed presentation: a stack of pages with bent corners, a crooked staple, a coffee ring, scribbles, one page
 *  sticking out. Origin = centre; `rot` tilts it. `droop` 0..1 makes the whole thing sag as if held by one corner. */
export const MessyPages: React.FC<{ x: number; y: number; s?: number; rot?: number; droop?: number }> = ({ x, y, s = 1, rot = 0, droop = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g transform={`rotate(${droop * 8})`}>
      <rect x={-120} y={-150} width={250} height={320} fill="#E6DFCB" transform="rotate(-6)" stroke="#B8AF98" strokeWidth={3} />
      <rect x={-130} y={-170} width={250} height={330} fill="#FAF7EE" transform="rotate(3)" stroke="#BDB6A4" strokeWidth={3} />
      <rect x={-124} y={-176} width={250} height={332} fill="#FFFFFF" stroke="#BDB6A4" strokeWidth={3} />
      <path d="M 92 -176 L 126 -176 L 126 -142 Z" fill="#DCD5C2" />
      <text x={0} y={-112} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={30} fill="#1F2A55">HỆ MẶT TRỜI</text>
      <path d="M -88 -76 L 70 -80 M -88 -50 L 90 -52 M -88 -24 L 40 -28 M -88 2 L 80 -2" stroke="#8A84A6" strokeWidth={6} strokeLinecap="round" />
      <path d="M -70 40 Q -30 20 0 50 Q 30 76 60 40" stroke="#D94452" strokeWidth={5} fill="none" strokeLinecap="round" />
      <circle cx={46} cy={96} r={44} fill="none" stroke="#8A5A2E" strokeWidth={9} opacity={0.55} />
      <circle cx={46} cy={96} r={36} fill="#8A5A2E" opacity={0.12} />
      <path d="M -108 -158 l 26 -4 l 3 14" stroke="#7A7A88" strokeWidth={6} fill="none" strokeLinecap="round" transform="rotate(-8 -100 -158)" />
      <g transform="translate(-60 120) rotate(-8)"><rect x={-34} y={-30} width={68} height={62} fill="#F7D94C" /><text y={8} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={18} fill="#5A3A12">MAI LÀM</text></g>
      <rect x={96} y={30} width={60} height={190} fill="#F4EFE0" stroke="#BDB6A4" strokeWidth={3} transform="rotate(14 100 30)" />
    </g>
  </g>
);

/** Floating "zzz" or "!" style popping marks near a head. */
export const PopMark: React.FC<{ x: number; y: number; t: number; text: string; color?: string; size?: number }> = ({ x, y, t, text, color = '#FF5A4A', size = 120 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  return <text x={x} y={y - Math.sin(t / 7) * 4} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={size * k} fill={color} stroke="#1A1230" strokeWidth={size / 14} paintOrder="stroke">{text}</text>;
};

/** Dark "panda" rings round both eyes, drawn over a Hero (use with expr 'tired'); follows the pose's position, yaw and tilt. */
export const PandaEyes: React.FC<{ pose: Pose; o?: number }> = ({ pose, o = 1 }) => {
  const ay = Math.min(1, Math.abs(pose.yaw));
  const k = pose.scale;
  return (
    <g transform={`translate(${pose.x} ${pose.y}) rotate(${pose.tilt}) scale(${k})`} opacity={o}>
      <g transform={`rotate(${pose.headTilt * 0.5} 0 ${HEAD.y + 40}) translate(${pose.yaw * 30} 0) scale(${1 - 0.28 * ay} 1)`}>
        {[-21, 21].map((cx) => (ay > 0.72 && Math.sign(cx) === (pose.yaw > 0 ? -1 : 1) ? null : (
          <ellipse key={cx} cx={cx + pose.look * 7} cy={HEAD.y - 2} rx={19} ry={17} fill="#5B4A8A" fillOpacity={0.3} stroke="#4B3B73" strokeWidth={7} opacity={0.9} />
        )))}
      </g>
    </g>
  );
};
