import React from 'react';
import { KitDefs, SetDefs, Hero, HEAD, basePose, LOOKS, Glow } from '../../engine';
import { HookText } from '../../channel/channel-branding';
import { DrySeabed, StrandedShip, FishFlop } from './kit-dry-seabed';

// The YouTube thumbnail for "Sẽ ra sao nếu đại dương không còn nước?": the drained ocean floor (salt-crusted mud, a
// cargo ship lying on its side, fish stranded), Pip huge on the right, shocked, and ONE hook phrase.
//   npx remotion still src/index.ts NoOceanThumbnail out/dai-duong-can/thumbnail-1920.png

const T = 40; // a fixed moment for the kit's t-driven parts

export const NoOceanThumbnail: React.FC = () => {
  const sc = 3.0;
  const pose = {
    ...basePose, x: 1500, y: 560 - HEAD.y * sc, scale: sc, yaw: -0.25, look: -0.4,
    armL: { a: 150, b: 25 }, armR: { a: 160, b: -25 }, expr: 'shock' as const,
  };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <DrySeabed id="thSb" t={T} salt={0.55} haze={0.35} dust={0.2} />
      <StrandedShip x={820} y={880} sc={0.85} rot={-10} t={T} />
      <FishFlop x={430} y={1010} t={T} s={1.3} seed={2} />
      <FishFlop x={1080} y={1040} t={T + 7} s={1.1} seed={5} />
      <Glow x={1500} y={460} r={520} o={0.35} />
      <Hero look={LOOKS.pipHood} pose={pose} rimId="rimR" shadow={0} />
      <HookText lines={['ĐẠI DƯƠNG', 'BIẾN MẤT']} size={170} />
    </svg>
  );
};
