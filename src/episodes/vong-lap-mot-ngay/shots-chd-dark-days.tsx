import React from 'react';
import { Hero, Pose, poseAt, faceAt, kf, clamp, lerp, easeOut, camT, LOOKS, ShotProps, Glow, Foreground, Dust, Sparkle, basePose } from '../../engine';
import { MorningBedroom, BedDuvet, bedSit, MB } from './kit-morning-bedroom';
import { TearCalendar } from './kit-bedroom-parts';
import { ResetClock } from './kit-loop-clock';
import { RewindWave } from './kit-rewind-fx';
import { PAL } from './kit-palette';
import { SoundIcon, ThoughtBubble, lyingPose, LyingPip } from './chd-bed-sound-props';

// CHAPTER D, beat "5 dark days" (180.02-193.01 s): "Có những ngày, bạn chẳng làm gì cả. Bạn nằm trên giường từ sáng
// tới đêm, nghe chuông báo thức, nghe mẹ gọi, nghe Mo gõ cửa. Bạn mong rằng sáng mai, mọi thứ sẽ khác. Nhưng sáng
// mai, vẫn là thứ Tư." + "Thế là bạn bắt đầu thử."
// D1 wide: Pip in bed, duvet to the chin, late morning. D2 time-lapse: the light crosses the room, the clock races to
// night. D3 close-up in profile on the pillow: alarm / mum / door knock pass as sound badges. D4 night: eyes closing,
// a wish of a different day (THỨ NĂM) in a thought bubble. D5 THE RESET (ResetClock + RewindWave). D6 the calendar
// THỨ TƯ + the ringing clock. D7 Pip sits up, determined.

const PIP = LOOKS.pipHood;
const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m) % 60).padStart(2, '0')}`;
/** Head centre of a pose in world space (upright, ignoring tilt). */
const headOf = (p: Pose) => ({ x: p.x, y: p.y - 176 * p.scale });

// ---------- D1: wide, Pip on his back in bed, duvet up to the chin, staring at the ceiling; late-morning sun ----------
export const D1: React.FC<ShotProps> = ({ t, len }) => {
  const pose = { ...lyingPose(0.12, Math.sin(t / 14) * 1.5), look: -0.1 };
  const blink = t > 34 && t < 44 ? 1 : 0.35;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), kf(t, [[0, 560], [len, 570]]), kf(t, [[0, 1.08], [len, 1.2]]))}>
      <MorningBedroom t={t + 200} id="d1b" dawn={0.85} clock="10:47" duvet={false} />
      <LyingPip pose={{ ...pose, expr: 'tired', blink }} id="d1clip" />
      <BedDuvet from={0.095} />
      <Foreground blur={10}>
        <path d="M -120 1180 L -120 860 Q 120 830 300 900 L 420 1180 Z" fill="#0A0812" />
      </Foreground>
    </g>
  );
};

// ---------- D2: time-lapse from morning to night: the sun patch slides across the wall, the clock races ----------
export const D2: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / (len - 6));
  const mins = lerp(6 * 60 + 30, 23 * 60 + 40, p);
  const dawn = 1 - p;
  const step = Math.floor(t / 14);
  const pose = { ...lyingPose(0.12, 0), headTilt: step % 2 ? -14 : 14, yaw: step % 2 ? -0.15 : 0.15 };
  return (
    <g transform={camT(900, 560, 1.8)}>
      <MorningBedroom t={t * 6} id="d2b" dawn={dawn} clock={hhmm(mins)} duvet={false} />
      <LyingPip pose={{ ...pose, expr: 'tired', blink: 0.4 }} id="d2clip" />
      <BedDuvet from={0.095} />
      <Glow x={MB.CLOCK.x} y={MB.CLOCK.y - 22} r={120} kind="red" o={0.3 + 0.3 * p} />
      <Dust t={t * 4} seed={7} x0={600} y0={380} w={800} h={360} n={14} o={0.4 * (1 - p)} />
    </g>
  );
};

// ---------- D3: close-up in profile, Pip on the pillow, eyes open and dull; the day's sounds pass by as badges ----------
export const D3: React.FC<ShotProps> = ({ t, len }) => {
  const sc = 1.75;
  const pose: Pose = {
    ...basePose,
    x: 1080, y: 640 + Math.sin(t / 15) * 3, scale: sc, facing: 1, yaw: 0.25, spin: -90, headTilt: 40,
    armL: { a: 10, b: -6 }, armR: { a: 10, b: -6 }, legL: { a: 4, b: 0 }, legR: { a: -4, b: 0 }, look: 0.3,
  };
  // he squeezes his eyes shut at each sound, then stares again
  const shut = [6, 40, 66].some((k) => t >= k && t < k + 7);
  const z = kf(t, [[0, 1], [len, 1.06]]);
  return (
    <g>
      <g filter="url(#blur16)">
        <g transform={camT(860, 520, 2.6)}>
          <MorningBedroom t={t + 300} id="d3b" dawn={0.7} duvet={false} />
        </g>
      </g>
      <rect x={0} y={0} width={1920} height={1080} fill="#0A0812" opacity={0.35} />
      <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
        {/* the pillow, then Pip, then the duvet up over his shoulder */}
        <path d="M 560 640 Q 550 540 720 520 Q 960 505 1040 560 Q 1090 620 1020 670 Q 800 700 610 680 Q 560 670 560 640 Z" fill="#DCD4C4" stroke="#14121C" strokeWidth={5} />
        <path d="M 600 545 Q 780 515 1000 540" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.35} />
        <Hero look={PIP} pose={{ ...pose, expr: 'tired', blink: shut ? 1 : 0.45 }} rimId="rimR" shadow={0} />
        <path d="M 930 1140 L 930 560 Q 960 420 1110 400 Q 1400 362 1700 420 Q 1900 452 2040 470 L 2040 1140 Z" fill="#4E5E92" stroke="#14121C" strokeWidth={6} />
        <path d="M 940 540 Q 970 430 1110 414 Q 1400 374 1700 434" stroke="#7A8AC0" strokeWidth={8} fill="none" opacity={0.6} />
        <path d="M 1040 720 Q 1300 680 1600 760 M 1200 880 Q 1450 820 1800 900" stroke="#2E3A66" strokeWidth={6} fill="none" opacity={0.6} />
        <Glow x={1500} y={260} r={500} o={0.35} />
      </g>
      <SoundIcon x={1360} y={300} t={t - 2} kind="alarm" life={32} />
      <SoundIcon x={560} y={270} t={t - 33} kind="mum" life={30} />
      <SoundIcon x={1400} y={330} t={t - 60} kind="door" life={len - 60} />
    </g>
  );
};

// ---------- D4: night (dawn 0), Pip's eyes close; a thought bubble wishes for a different day: THỨ NĂM ----------
export const D4: React.FC<ShotProps> = ({ t, len }) => {
  const pose = { ...lyingPose(0.12, Math.sin(t / 16) * 1.2), headTilt: 8 };
  const h = headOf(pose);
  const face = faceAt(t, [[0, 'worried'], [26, 'neutral']]);
  const blink = t > 44 ? clamp((t - 44) / 14) : face.blink ? 1 : 0.2;
  return (
    <g transform={camT(kf(t, [[0, h.x + 150], [len, h.x + 170]]), h.y - 30, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <MorningBedroom t={t + 500} id="d4b" dawn={0} clock="23:58" duvet={false} />
      <LyingPip pose={{ ...pose, ...face, blink }} id="d4clip" rimId="rimBlue" />
      <BedDuvet from={0.095} />
      <ThoughtBubble x={h.x + 300} y={h.y - 150} t={t - 8} s={0.4} tx={h.x + 70} ty={h.y - 40}>
        <g transform={`rotate(${Math.sin(t / 9) * 3})`}>
          <TearCalendar x={0} y={-110} w={170} day="THỨ NĂM" />
        </g>
        <circle cx={150} cy={-90} r={34} fill="#FFC85A" opacity={0.9} />
      </ThoughtBubble>
    </g>
  );
};

// ---------- D5: THE RESET: 23:59 flips to 00:00, spins back in cyan, slams 06:00, "THỨ TƯ" ----------
export const D5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g filter="url(#blur10)">
      <g transform={camT(940, 540, 1.3)}>
        <MorningBedroom t={t + 600} id="d5b" dawn={t > 28 ? 1 : 0} clock={t > 28 ? '06:00' : '23:59'} ring={t > 28 ? 1 : 0} />
      </g>
    </g>
    <rect x={0} y={0} width={1920} height={1080} fill="#06081A" opacity={0.55} />
    <ResetClock t={t} t0={-3} x={960} y={440} s={1.3} />
    <RewindWave t={t} t0={27} id="d5rw" cy={440} />
  </g>
);

// ---------- D6: the tear-off calendar still says THỨ TƯ; the clock below rings 06:00 again ----------
export const D6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(940, kf(t, [[0, 540], [len, 520]]), kf(t, [[0, 2.45], [len, 2.65]]))}>
    <MorningBedroom t={t + 700} id="d6b" dawn={1} ring={1} />
  </g>
);

// ---------- D7: Pip sits up in bed, slumped, then straightens: a determined fist (the near arm) ----------
export const D7: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.2);
  const pose = poseAt(t, [
    { f: 0, p: { x: b.x, y: b.y, scale: b.scale, yaw: 0.35, look: 0.2, tilt: 14, headTilt: 12, armL: { a: 8, b: -6 }, armR: { a: 10, b: -6 } } },
    { f: 10, p: { tilt: 14, headTilt: 12 } },
    { f: 18, p: { tilt: -3, headTilt: -4, look: 0.5, armR: { a: 34, b: 128 } }, ease: easeOut },
    { f: 24, p: { tilt: 0, headTilt: 0, armR: { a: 28, b: 122 } } },
    { f: len, p: { armR: { a: 30, b: 124 } } },
  ]);
  const face = faceAt(t, [[0, 'tired'], [16, 'cool']]);
  return (
    <g transform={camT(kf(t, [[0, b.x + 70], [len, b.x + 60]]), b.y - 80, kf(t, [[0, 2.2], [len, 2.45]]))}>
      <MorningBedroom t={t + 800} id="d7b" dawn={1} duvet={false} />
      <Hero look={PIP} pose={{ ...pose, ...face, glint: t > 18 ? clamp((t - 18) / 6) * clamp((40 - t) / 8) : 0 }} rimId="rimR" shadow={0} />
      <BedDuvet knees={1} />
      <Sparkle x={b.x + 95 * b.scale} y={b.y - 110 * b.scale} t={t - 18} s={0.45} />
    </g>
  );
};
