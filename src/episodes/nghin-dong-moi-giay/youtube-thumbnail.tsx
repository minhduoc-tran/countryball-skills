import React from 'react';
import { Street, Hero, HEAD, basePose, LOOKS, FONT, Glow, KitDefs, SetDefs, rnd } from '../../engine';
import { Banknote, HeldPhone } from './cha-street-props';
import { HookText } from '../../channel/channel-branding';

// The YouTube thumbnail for "Sẽ ra sao nếu bạn kiếm được 1.000 đồng mỗi giây?": Pip big on the right, shocked and
// grinning at his phone while banknotes rain over the dusk street; the hook in huge type on the left and a red chip
// with the punch number. Rendered as a still:
//   npx remotion still src/index.ts ThousandPerSecondThumbnail out/nghin-dong-moi-giay/thumbnail-1920.png

const PIP = LOOKS.pipHood;

export const ThousandPerSecondThumbnail: React.FC = () => {
  const sc = 3.0;
  const pose = { ...basePose, x: 1480, y: 470 - HEAD.y * sc, scale: sc, yaw: -0.2, look: -0.3, armL: { a: 16, b: 8 }, armR: { a: 40, b: 90 }, expr: 'shock' as const };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <Street t={40} id="thumbm" />
      <defs>
        <linearGradient id="thumbmShade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0B0814" stopOpacity={0.88} />
          <stop offset="0.6" stopColor="#0B0814" stopOpacity={0.35} />
          <stop offset="1" stopColor="#0B0814" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1500} height={1080} fill="url(#thumbmShade)" />
      {/* banknotes raining behind and around him */}
      {Array.from({ length: 22 }).map((_, i) => (
        <Banknote key={i} x={700 + rnd(i, 1) * 1250} y={-40 + rnd(i, 2) * 980} s={0.9 + rnd(i, 3) * 0.9} rot={-40 + rnd(i, 4) * 80} label="1.000" />
      ))}
      <Glow x={pose.x} y={430} r={560} o={0.4} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <HeldPhone x={1330} y={760} s={2.2} rot={-12} glow={1} />
      <HookText lines={["BỊ ĐIỀU TRA", "VÌ QUÁ GIÀU"]} size={164} />
    </svg>
  );
};
