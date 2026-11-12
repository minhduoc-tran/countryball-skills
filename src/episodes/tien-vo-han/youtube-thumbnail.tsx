import React from 'react';
import { KitDefs, SetDefs } from '../../engine';
import { HookText } from '../../channel/channel-branding';
import { MoneyStormArt } from './youtube-thumbnail-money-storm-art';

// The YouTube thumbnail for "Sẽ ra sao nếu bạn có tiền vô hạn?": the money storm (Pip shocked, waist-deep in cash,
// black ∞ card held high) and ONE hook phrase.
//   npx remotion still src/index.ts InfiniteMoneyThumbnail out/tien-vo-han/thumbnail-1920.png

export const InfiniteMoneyThumbnail: React.FC = () => (
  <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
    <KitDefs />
    <SetDefs />
    <MoneyStormArt label="₫" />
    <HookText lines={['LẠM PHÁT', 'PHI MÃ']} size={200} />
  </svg>
);
