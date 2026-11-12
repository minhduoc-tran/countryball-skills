import React from 'react';
import { Hero, poseAt, faceAt, kf, clamp, lerp, easeOut, easeInOut, camT, shake, LOOKS, ShotProps, Street, Glow, Foreground, Motorbike, propScale, proj, joints, toWorld, basePose, reachAngle } from '../../engine';
import { WetRoad, HandUmbrella, XR } from './kit-street-rain';
import { Granny } from './kit-cast-figures';
import { FlipClock } from './kit-loop-clock';
import { AlarmInsert } from './kit-alarm-insert';
import { RewindWave } from './kit-rewind-fx';
import { CountPill } from './chd-bed-sound-props';
import { grannyAt, pipStreet, pipRun, GoodHeart, RainScene } from './chd-rain-granny-props';

// CHAPTER D, beat "6 saving" (193.07-212.09 s): "Bốn giờ chiều, khi trời đổ mưa, có một bà cụ trượt chân ở ngã tư.
// Ngày đầu, bạn chỉ đứng nhìn. Ngày thứ năm, bạn đỡ được bà. Ngày thứ mười, bạn còn kịp che ô cho bà. Nhưng sáng hôm
// sau, bà lại sắp ngã, và bạn lại phải chạy ra. Mỗi việc tốt bạn làm, chỉ sống được đúng một ngày."
// D8 the crossroads wide: the flip clock hits 16:00 and the rain comes down. D9 the granny slips on the zebra.
// D10 NGÀY #1: Pip frozen on the sidewalk. D11 day 5: he catches her. D12 day 10: and the umbrella. D13 THE RESET:
// the 06:00 alarm again. D14 she's wobbling on the zebra again, Pip sprints out. D15 the good deed's heart dissolves
// at midnight.

const PIP = LOOKS.pipHood;
const SLIP = proj(XR.SLIP.X, 0, XR.SLIP.Z);

// ---------- D8: wide on the crossroads: 15:59 flips to 16:00 and the rain starts on the dot ----------
export const D8: React.FC<ShotProps> = ({ t, len }) => {
  const rain = easeOut(clamp((t - 8) / 22));
  const ps = pipStreet(-4.5, 6.0);
  const g = grannyAt(-3.0 + t * 0.012, 0, 0, t * 0.25);
  const cam = camT(kf(t, [[0, 860], [len, 850]]), 585, kf(t, [[0, 1.55], [len, 1.65]]));
  return (
    <RainScene t={t} id="d8r" cam={cam} amount={rain}
      set={<><Street t={t + 900} id="d8s" light="red" /><WetRoad t={t} id="d8w" amount={rain} /></>}
      people={<>
        <Granny pose={g} rimId="rimR" shadow={0.6} />
        <Hero look={PIP} pose={{ ...basePose, ...ps, yaw: 0.45, look: 0.6, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 }, headTilt: -3 + 3 * rain }} rimId="rimR" shadow={0.6} />
      </>}
      over={<FlipClock x={960} y={170} s={0.55} from="15:59" time="16:00" t={t} flipAt={2} />}
    />
  );
};

// ---------- D9: closer on the zebra: the granny shuffles across, her foot goes, she falls on the wet road ----------
export const D9: React.FC<ShotProps> = ({ t, len }) => {
  const slip = easeInOut(clamp((t - 16) / 12));
  const down = clamp((t - 28) / 8);
  const g = grannyAt(lerp(-0.7, 0, clamp(t / 18)), slip, down, t < 18 ? t * 0.3 : undefined);
  const sh = shake(t, 34, 8, 3);
  const cam = camT(SLIP.x - 10 + sh.x, SLIP.y - 30 + sh.y, kf(t, [[0, 5.0], [len, 5.3]]));
  return (
    <RainScene t={t} id="d9r" cam={cam}
      set={<><Street t={t + 960} id="d9s" light="red" /><WetRoad t={t} id="d9w" /></>}
      people={<>
        <Granny pose={g} rimId="rimR" shadow={0.7} />
        {t > 34 && t < 50 ? <ellipse cx={SLIP.x + 4} cy={SLIP.y + 2} rx={(t - 34) * 2.2} ry={(t - 34) * 0.5} fill="none" stroke="#D8E4F4" strokeWidth={1.5} opacity={1 - (t - 34) / 16} /> : null}
      </>}
    />
  );
};

// ---------- D10: NGÀY #1: Pip on the sidewalk, frozen, wide-eyed; the granny down on the zebra behind him ----------
export const D10: React.FC<ShotProps> = ({ t, len }) => {
  const ps = pipStreet(-4.5, 6.0);
  const pose = poseAt(t, [
    { f: 0, p: { ...ps, yaw: 0.55, look: 0.8, tilt: -2, armL: { a: 14, b: -14 }, armR: { a: 22, b: -24 } } },
    { f: 10, p: { tilt: -5, armR: { a: 30, b: -34 } }, ease: easeOut },
    { f: len, p: { tilt: -5, armR: { a: 30, b: -36 } } },
  ]);
  const g = grannyAt(0, 1, 1);
  const cam = camT(kf(t, [[0, 760], [len, 750]]), 610, kf(t, [[0, 2.9], [len, 3.15]]));
  return (
    <RainScene t={t} id="d10r" cam={cam}
      set={<><Street t={t + 1020} id="d10s" light="red" /><WetRoad t={t} id="d10w" /></>}
      people={<>
        <Granny pose={{ ...g, armL: { a: 60 + 10 * Math.sin(t / 4), b: -20 } }} rimId="rimR" shadow={0.7} />
        <Hero look={PIP} pose={{ ...pose, expr: 'shock', blink: t > 40 && t < 44 ? 1 : 0 }} rimId="rimR" shadow={0.6} />
      </>}
      over={<CountPill t={t + 10} label="NGÀY #1" />}
    />
  );
};

// ---------- D11: day 5: Pip lunges in from the left and catches her as she tips back ----------
export const D11: React.FC<ShotProps> = ({ t, len }) => {
  const slip = easeInOut(clamp((t - 6) / 16)) * 0.55 - 0.2 * easeOut(clamp((t - 34) / 14));
  const g = grannyAt(0, slip);
  const ps = pipStreet(lerp(-2.7, -1.45, easeOut(clamp(t / 26))), XR.SLIP.Z - 0.2);
  const base = poseAt(t, [
    { f: 0, p: { ...ps, yaw: 0.6, look: 0.6, tilt: 22, legL: { a: 40, b: -30 }, legR: { a: -30, b: -10 } } },
    { f: 26, p: { ...ps, tilt: 12, legL: { a: 30, b: -40 }, legR: { a: -24, b: -6 } }, ease: easeOut },
    { f: 32, p: { tilt: 8 } },
    { f: len, p: { tilt: 4 } },
  ]);
  // both arms reach for her upper back
  const back = toWorld(g, joints(g).armL.root);
  const reach = reachAngle(base, back);
  const pose = { ...base, armR: { a: reach - 8, b: 22 }, armL: { a: -(reach - 30), b: -14 } };
  const face = faceAt(t, [[0, 'worried'], [32, 'happy']]);
  const cam = camT(kf(t, [[0, SLIP.x - 30], [len, SLIP.x - 22]]), SLIP.y - 40, kf(t, [[0, 4.6], [len, 4.9]]));
  return (
    <RainScene t={t} id="d11r" cam={cam}
      set={<><Street t={t + 1080} id="d11s" light="red" /><WetRoad t={t} id="d11w" /></>}
      people={<>
        <Granny pose={{ ...g, ...(t > 36 ? { expr: 'happy' as const } : {}) }} rimId="rimR" shadow={0.7} />
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0.6} />
      </>}
    />
  );
};

// ---------- D12: day 10: Pip has her arm AND the umbrella pops open over them both; she smiles up at him ----------
export const D12: React.FC<ShotProps> = ({ t, len }) => {
  const g = grannyAt(0.15, 0.06);
  const ps = pipStreet(-1.25, XR.SLIP.Z - 0.15);
  const pose = poseAt(t, [
    { f: 0, p: { ...ps, yaw: 0.45, look: 0.6, armR: { a: 70, b: 20 }, armL: { a: 20, b: -10 } } },
    { f: 34, p: { armL: { a: 20, b: -10 }, armR: { a: 70, b: 20 } } },
    { f: 42, p: { armL: { a: 150, b: -28 } }, ease: easeOut },
    { f: len, p: { armL: { a: 148, b: -26 } } },
  ]);
  const open = easeOut(clamp((t - 40) / 9));
  const hand = toWorld(pose, joints(pose).armL.end);
  const face = faceAt(t, [[0, 'neutral'], [46, 'happy']]);
  const bike = proj(1.7, 0, 7.4);
  const cam = camT(kf(t, [[0, SLIP.x - 16], [len, SLIP.x - 12]]), SLIP.y - 62, kf(t, [[0, 5.4], [len, 5.75]]));
  return (
    <RainScene t={t} id="d12r" cam={cam}
      set={<><Street t={t + 1140} id="d12s" light="red" /><WetRoad t={t} id="d12w" /></>}
      people={<>
        <Granny pose={{ ...g, yaw: -0.4, look: -0.8, headTilt: -10, armL: { a: 40, b: -30 }, expr: t > 48 ? 'happy' : 'neutral' }} rimId="rimR" shadow={0.7} />
        <Hero look={PIP} pose={{ ...pose, ...face }} rimId="rimR" shadow={0.6} />
        <HandUmbrella x={hand.x} y={hand.y} s={pose.scale * 1.3} t={t} rot={14} open={0.1 + 0.9 * open} color="#D9A441" />
        <Foreground blur={6}>
          <Motorbike x={bike.x - 30} y={bike.y} s={propScale(7.4)} facing={1} color="#B8483E" />
        </Foreground>
      </>}
    />
  );
};

// ---------- D13: THE RESET: the next morning, the same 06:00 alarm insert; the hand slams it fast this time ----------
export const D13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <AlarmInsert id="d13a" t={t + 200} ring={t < 18 ? 1 : 0} hand={clamp((t - 8) / 10)} />
    <RewindWave t={t} t0={0} id="d13rw" />
  </g>
);

// ---------- D14: the crossroads again in the rain: she's teetering on the zebra; Pip sprints in from the foreground ----------
export const D14: React.FC<ShotProps> = ({ t, len }) => {
  const wob = 0.14 + 0.08 * Math.sin(t / 3.5);
  const g = grannyAt(0, wob);
  const run = easeInOut(clamp((t - 26) / (len - 26)));
  const pose = pipRun(lerp(-5.0, -1.9, run), lerp(4.6, 9.2, run), t * 0.8);
  const cam = camT(kf(t, [[0, 820], [len, 860]]), 585, kf(t, [[0, 2.4], [len, 2.6]]));
  return (
    <RainScene t={t} id="d14r" cam={cam}
      set={<><Street t={t + 1200} id="d14s" light="red" /><WetRoad t={t} id="d14w" /></>}
      people={<>
        <Granny pose={{ ...g, armL: { a: 120 + 25 * Math.sin(t / 3), b: -20 }, armR: { a: 110 - 25 * Math.sin(t / 3), b: -10 } }} rimId="rimR" shadow={0.7} />
        {t > 26 ? <Hero look={PIP} pose={pose} rimId="rimR" shadow={0.6} /> : null}
      </>}
    />
  );
};

// ---------- D15: the good deed as a glowing heart; the clock flips to 00:00 and the heart breaks into cyan flakes ----------
export const D15: React.FC<ShotProps> = ({ t, len }) => {
  const d = clamp((t - 74) / 24);
  return (
    <g>
      <defs>
        <radialGradient id="d15bg" cx="50%" cy="40%" r="75%">
          <stop offset="0" stopColor="#24305E" />
          <stop offset="1" stopColor="#070A18" />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#d15bg)" />
      {Array.from({ length: 14 }).map((_, k) => (
        <circle key={k} cx={(k * 173 + t * 0.6) % 1980 - 30} cy={160 + ((k * 97) % 760)} r={18 + (k % 4) * 10} fill={k % 3 ? '#FFC27A' : '#7FA8FF'} opacity={0.08} />
      ))}
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
        <GoodHeart x={960} y={420} s={kf(t, [[0, 0.75], [8, 1.38], [14, 1.25]], easeOut)} t={t} dissolve={d} />
        <FlipClock x={960} y={880} s={0.6} from="23:59" time="00:00" t={t} flipAt={70} />
      </g>
      <RewindWave t={t} t0={74} id="d15rw" cy={420} />
    </g>
  );
};
