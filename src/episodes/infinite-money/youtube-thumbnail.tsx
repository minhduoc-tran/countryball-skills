import React from 'react';
import { KitDefs, SetDefs } from '../../engine';
import { HookText } from '../../channel/channel-branding';
import { MoneyStormArt } from '../tien-vo-han/youtube-thumbnail-money-storm-art';
import { BlackCard } from './cha-card-terminal-props';

// The YouTube thumbnail for "What If You Had Infinite Money?" (English, Pencil Man): the same money storm as the
// Vietnamese episode and ONE hook phrase.
//   npx remotion still src/index.ts InfiniteMoneyEnThumbnail out/infinite-money/thumbnail-1920.png

export const InfiniteMoneyEnThumbnail: React.FC = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
    <KitDefs />
    <SetDefs />
    <MoneyStormArt label="₫" Card={BlackCard} />
    <HookText lines={['IT BREAKS', 'THE ECONOMY']} size={146} />
  </svg>
);
