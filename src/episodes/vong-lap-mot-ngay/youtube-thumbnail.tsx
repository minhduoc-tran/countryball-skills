import React from 'react';
import { KitDefs, SetDefs, Hero, HEAD, basePose, LOOKS, Glow } from '../../engine';
import { HookText } from '../../channel/channel-branding';
import { TearCalendar } from './kit-bedroom-parts';
import { FlipClock, LoopIcon } from './kit-loop-clock';
import { MemoryGlow } from './kit-rewind-fx';

// The YouTube thumbnail for "Sẽ ra sao nếu chỉ mình bạn nhớ ngày hôm qua?": a wall of identical THỨ TƯ calendar pages
// (the loop), a giant cyan rewind ring with the 06:00 flip clock, Pip big on the right, shocked, his head glowing cyan
// (the only memory that stays), and ONE hook phrase on the left.
//   npx remotion still src/index.ts TimeLoopThumbnail out/vong-lap-mot-ngay/thumbnail-1920.png

/** Rows of THỨ TƯ pages, slightly tilted, fading into the dark at the edges. */
const CalendarWall: React.FC = () => (
  <g opacity={0.5}>
    {Array.from({ length: 6 }).flatMap((_, r) => Array.from({ length: 11 }).map((__, c) => (
      <TearCalendar key={`${r}-${c}`} x={c * 190 + (r % 2) * 95 - 40} y={r * 210 - 60} w={150} rot={((r * 7 + c * 3) % 9) - 4} />
    )))}
  </g>
);

export const TimeLoopThumbnail: React.FC = () => {
  const sc = 3.1;
  const pose = {
    ...basePose, x: 1450, y: 500 - HEAD.y * sc, scale: sc, yaw: -0.2, look: -0.3,
    armL: { a: 150, b: 40 }, armR: { a: 150, b: 40 }, expr: 'shock' as const,
  };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <defs>
        <radialGradient id="tlBg" cx="0.72" cy="0.38" r="0.9">
          <stop offset="0" stopColor="#1E5A70" />
          <stop offset="0.45" stopColor="#141A33" />
          <stop offset="1" stopColor="#07081A" />
        </radialGradient>
        <radialGradient id="tlVig" cx="0.6" cy="0.45" r="0.75">
          <stop offset="0.55" stopColor="#07081A" stopOpacity={0} />
          <stop offset="1" stopColor="#07081A" stopOpacity={0.85} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#tlBg)" />
      <CalendarWall />
      <rect x={0} y={0} width={1920} height={1080} fill="url(#tlVig)" />
      {/* the loop: a giant rewind ring behind Pip */}
      <LoopIcon x={1450} y={430} r={430} spin={0} />
      <Glow x={1450} y={420} r={600} o={0.35} kind="cool" />
      <MemoryGlow x={1450} y={300} r={330} t={20} id="tlMg" />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" shadow={0} />
      <FlipClock x={540} y={860} s={0.95} time="06:00" t={30} cyan={0.35} />
      <HookText lines={['KHÔNG AI', 'NHỚ BẠN']} y={300} size={200} />
    </svg>
  );
};
