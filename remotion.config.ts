import { Config } from '@remotion/cli/config';

// JPEG frames, not PNG: a 5-minute episode in PNG needs 20-40 GB of temp frames and fills the disk; JPEG 95 is
// about 4 GB and looks the same after H.264.
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
Config.setEntryPoint('src/index.ts');
// A long render once died on a 30 s frame timeout after a browser tab crashed; give slow frames room.
Config.setDelayRenderTimeoutInMilliseconds(120000);
