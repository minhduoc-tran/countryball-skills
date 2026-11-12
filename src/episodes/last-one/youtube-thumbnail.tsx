import React from 'react';
import { Street, Hero, HEAD, basePose, LOOKS, FONT, Glow, KitDefs, SetDefs } from '../../engine';
import { HookText } from '../../channel/channel-branding';

// The YouTube thumbnail for "Sẽ ra sao nếu thế giới chỉ còn mình bạn?": Pip big and alone in the middle of the empty
// dusk street, the question in huge type, a red chip with the hook (8 billion people -> 1). Rendered as a still:
//   npx remotion still src/index.ts LastOneThumbnail out/last-one/thumbnail.png

const PIP = LOOKS.pipHood;

export const LastOneThumbnail: React.FC = () => {
  // big and waist-up on the right so the face reads at phone size (hip below frame; the head about y 450)
  const sc = 3.1;
  const pose = { ...basePose, x: 1470, y: 450 - HEAD.y * sc, scale: sc, yaw: -0.18, look: -0.35, armL: { a: 16, b: 8 }, armR: { a: 16, b: 8 }, expr: 'worried' as const };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <Street t={40} id="thumb" light="red" />
      {/* a dark band behind the type on the left so it reads at phone size */}
      <defs>
        <linearGradient id="thumbShade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#0B0814" stopOpacity={0.85} />
          <stop offset="0.62" stopColor="#0B0814" stopOpacity={0.35} />
          <stop offset="1" stopColor="#0B0814" stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={1500} height={1080} fill="url(#thumbShade)" />
      <Glow x={pose.x} y={pose.y - 300} r={520} o={0.35} />
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0.6} />
      {/* the hook chip */}
      <HookText lines={["8 TỶ NGƯỜI", "BIẾN MẤT"]} size={180} />
    </svg>
  );
};
