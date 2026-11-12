import React from 'react';
import { LookDef, HudChip } from '../../engine';

// The episode's power looks, used as "look": "<name>" on edit entries (tools/merge-chapters.py imports `looks`).
// "alone", on every "Chỉ còn mình bạn": the picture drains cooler and a chip reads the world's population: you.
const alone: LookDef = {
  grade: (lv) => `saturate(${1 - 0.22 * lv}) hue-rotate(${-10 * lv}deg) brightness(${1 - 0.03 * lv})`,
  Overlay: ({ f }) => <HudChip f={f} label="DÂN SỐ: 1" icon="dot" />,
};
// "memory", for remembered or imagined moments (the sister, mum's voice): warm, faded, soft.
const memory: LookDef = {
  grade: (lv) => `sepia(${0.55 * lv}) saturate(${1 - 0.25 * lv}) brightness(${1 + 0.05 * lv}) contrast(${1 - 0.08 * lv})`,
};

export const looks = { alone, memory };
