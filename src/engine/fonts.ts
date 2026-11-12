import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { loadFont as loadBricolage } from '@remotion/google-fonts/BricolageGrotesque';
import { loadFont as loadMono } from '@remotion/google-fonts/SpaceMono';
import { loadFont as loadHand } from '@remotion/google-fonts/Itim';
import { STUDIO } from '../studio.config';

// Three faces: a heavy display face for the title card, a mono for on-screen readouts (timers, labels, chips),
// and a handwriting face for chalk and notes. Mono and hand are Space Mono and Itim (both carry Vietnamese). The Google faces load at render time (they need a connection);
// a local title face from studio.config.ts loads from public/ and works offline.

loadBricolage('normal', { weights: ['600', '700', '800'], subsets: ['latin', 'latin-ext', 'vietnamese'] });
loadMono('normal', { weights: ['400'], subsets: ['latin', 'latin-ext', 'vietnamese'] });
loadHand('normal', { weights: ['400'], subsets: ['latin', 'latin-ext', 'vietnamese'] });
if (STUDIO.titleFont) loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'Bricolage Grotesque',
  ui: 'Space Mono',
  hand: 'Itim',
};
