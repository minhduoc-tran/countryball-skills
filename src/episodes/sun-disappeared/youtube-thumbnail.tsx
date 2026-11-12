import React from 'react';
import { Rooftop, Hero, HEAD, basePose, LOOKS, FONT, Glow, KitDefs, SetDefs } from '../../engine';
import { HookText } from '../../channel/channel-branding';

// The YouTube thumbnail for "What If the Sun Disappeared?" (English channel, Pencil Man): the Sun fading out over the
// rooftop as stars come through a daytime sky, Pip big on the right staring up in shock, the hook in huge type.
//   npx remotion still src/index.ts SunDisappearedThumbnail out/sun-disappeared/thumbnail-1920.png

export const SunDisappearedThumbnail: React.FC = () => {
  const sc = 3.0;
  const pose = { ...basePose, x: 1500, y: 500 - HEAD.y * sc, scale: sc, yaw: -0.25, look: -0.6, headTilt: -8, armL: { a: 16, b: 8 }, armR: { a: 16, b: 8 }, expr: 'shock' as const };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <g transform="translate(-520 -120) scale(1.25)">
        <Rooftop t={40} sunX={820} sunY={520} sunGone={0.55} />
      </g>
      {/* a dashed ring where the Sun is going out */}
      <circle cx={505} cy={530} r={240} fill="none" stroke="#FFE2A8" strokeWidth={10} strokeDasharray="34 26" opacity={0.85} />
      <rect x={0} y={0} width={1920} height={1080} fill="#07040C" opacity={0.15} />
      <Glow x={pose.x} y={430} r={520} o={0.25} />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimBlue" shadow={0} />
      <HookText lines={["8 MINUTES", "LEFT"]} size={200} />
    </svg>
  );
};
