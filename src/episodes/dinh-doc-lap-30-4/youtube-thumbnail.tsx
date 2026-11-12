import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HookText } from '../../channel/channel-branding';
import { Ball } from '../../countryball/countryball';
import { TankCrewHelmet } from '../../countryball/ball-accessories-military';
import { GateCrash } from '../../countryball/palace-gate-crash';

// Thumbnail: tank 390 bursting through the main gate of Dinh Độc Lập (impact moment, bent leaves, dust, flying bits)
// in noon light, the palace behind, a determined Vietnam ball in a tank-crew helmet on the right, one phrase.
export const DinhDocLap304Thumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: '#F3C77A' }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <GateCrash id="dd-th-gate" x={800} y={1010} s={2.0} crash={0.40} variant="main" t={30} />
      <defs>
        <radialGradient id="dd-th-glow" cx="0.45" cy="0.68" r="0.4"><stop offset="0" stopColor="#FFF2B0" stopOpacity={0.75} /><stop offset="1" stopColor="#FF9A2E" stopOpacity={0} /></radialGradient>
        <radialGradient id="dd-th-vig" cx="0.5" cy="0.55" r="0.75"><stop offset="0.55" stopColor="#3A1A08" stopOpacity={0} /><stop offset="1" stopColor="#3A1A08" stopOpacity={0.5} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#FF9A2E" opacity={0.18} />
      <rect width={1920} height={1080} fill="url(#dd-th-glow)" />
      <rect width={1920} height={1080} fill="url(#dd-th-vig)" />
      <Ball id="dd-th-vn" x={1640} y={810} r={260} flag="VNM" eyes="determined" look={-0.7} tilt={-5} hat={<TankCrewHelmet />} />
      <HookText lines={['HÚC ĐỔ', 'CỔNG DINH']} x={70} y={190} size={150} />
    </svg>
  </AbsoluteFill>
);
