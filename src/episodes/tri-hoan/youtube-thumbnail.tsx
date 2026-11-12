import React from 'react';
import { KitDefs, SetDefs, Hero, HEAD, basePose, LOOKS, Glow, Bedroom, FONT } from '../../engine';
import { HookText } from '../../channel/channel-branding';

// The YouTube thumbnail for "Sẽ ra sao nếu bạn trì hoãn mọi thứ?": Pip's bedroom at night, a huge red 23:59 clock,
// yellow "MAI LÀM" sticky notes everywhere, Pip big on the right in panic; ONE hook phrase.
//   npx remotion still src/index.ts ProcrastinateThumbnail out/tri-hoan/thumbnail-1920.png

const NOTES: [number, number, number, number][] = [[820, 420, -8, 1], [1010, 300, 6, 0.9], [760, 640, 10, 0.95], [1180, 560, -5, 0.85], [960, 820, -12, 1], [1250, 220, 9, 0.8]];

const Sticky: React.FC<{ x: number; y: number; rot: number; s: number }> = ({ x, y, rot, s }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-95} y={-80} width={190} height={160} rx={6} fill="#FFE45C" stroke="#14121C" strokeWidth={5} />
    <rect x={-95} y={-80} width={190} height={26} fill="#F2C93A" />
    <text x={0} y={24} textAnchor="middle" fontFamily={FONT.hand} fontSize={50} fill="#2A2238">MAI LÀM</text>
  </g>
);

const BigClock: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) rotate(-4)`} style={{ filter: 'drop-shadow(0 0 30px rgba(255,60,50,0.7))' }}>
    <rect x={-250} y={-95} width={500} height={190} rx={24} fill="#16141C" stroke="#3A3846" strokeWidth={8} />
    <text x={0} y={52} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={150} fill="#FF3B30">23:59</text>
  </g>
);

export const ProcrastinateThumbnail: React.FC = () => {
  const sc = 2.6;
  const pip = { ...basePose, x: 1560, y: 560 - HEAD.y * sc, scale: sc, yaw: -0.3, look: -0.4, armL: { a: 150, b: 30 }, armR: { a: 150, b: 30 }, expr: 'shock' as const };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <Bedroom t={40} id="thumbth" clock="23:59" lamp={1} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0814" opacity={0.35} />
      {NOTES.map(([x, y, r, s], i) => <Sticky key={i} x={x} y={y} rot={r} s={s} />)}
      <BigClock x={980} y={960} />
      <Glow x={1560} y={480} r={600} o={0.3} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0} />
      <HookText lines={['MAI', 'LÀM?']} y={300} size={230} />
    </svg>
  );
};
