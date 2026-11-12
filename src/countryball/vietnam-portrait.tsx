import React from 'react';
import { KitDefs, SetDefs, Dust } from '../engine';
import { Rooftop } from '../engine/sets/rooftop';
import { Ball, NonLa } from './countryball';

const Portrait: React.FC<{ paired?: boolean }> = ({ paired = false }) => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
    <KitDefs />
    <SetDefs />
    <defs>
      <radialGradient id="vietnamPortraitVignette" r="68%">
        <stop offset="32%" stopColor="#10091D" stopOpacity={0} />
        <stop offset="100%" stopColor="#10091D" stopOpacity={0.78} />
      </radialGradient>
    </defs>
    <g filter="url(#blur6)">
      <Rooftop t={38} sunX={paired ? 960 : 1360} sunY={600} />
    </g>
    <rect width={1920} height={1080} fill="url(#vietnamPortraitVignette)" />
    <Dust t={38} seed={41} x0={440} y0={180} w={1100} h={670} n={24} o={0.42} />
    <g fill="#0C0711" opacity={0.78} filter="url(#blur16)">
      {paired ? (
        <>
          <ellipse cx={620} cy={903} rx={245} ry={29} />
          <ellipse cx={1300} cy={903} rx={245} ry={29} />
        </>
      ) : <ellipse cx={958} cy={903} rx={265} ry={31} />}
    </g>
    <g filter="url(#rimR)">
      <Ball id="vietnam-portrait" x={paired ? 620 : 960} y={paired ? 635 : 607} r={paired ? 266 : 294} flag="VNM" look={0.7} hat={<NonLa />} shadow={false} />
    </g>
    {paired && (
      <g filter="url(#rimL)">
        <Ball id="china-portrait" x={1300} y={635} r={266} flag="CHN" look={-0.7} shadow={false} />
      </g>
    )}
  </svg>
);

export const VietnamPortrait: React.FC = () => <Portrait />;
export const VietnamChinaPortrait: React.FC = () => <Portrait paired />;
