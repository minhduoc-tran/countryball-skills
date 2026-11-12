import React from 'react';
import { Hero, LOOKS, faceAt, kf, clamp, camT, poseAt, TitleCard, Dial, ShotProps } from '../../engine';
import { DanangBeach } from './kit-danang-beach';
import { NoSign } from './cha-beach-props';

// Chapter A, the premise (9.5-15.7 s): the title over the drained beach, "not gradually" (a crossed-out slow trickle),
// then the instant vanish at "một giây" (a stopwatch hits 1,0 s and the whole sea is gone in two frames).

// ---------- A7: TitleCard over the bare beach, Pip small and stunned at the edge ----------
export const A7: React.FC<ShotProps> = ({ t, len }) => {
  const pose = poseAt(t, [{ f: 0, p: { x: 960, y: 830, scale: 0.7, yaw: -0.5, look: -0.6, tilt: -3 } }, { f: len, p: { tilt: -7, headTilt: -4 } }]);
  return (
    <g>
      <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.0], [len, 1.07]]))}>
        <DanangBeach id="ca7" t={t + 160} drain={1} people={[]} />
        <Hero look={LOOKS.pipHood} pose={{ ...pose, ...faceAt(t, [[0, 'shock']]) }} rimId="rimR" shadow={1} />
      </g>
      <TitleCard t={t} lines={['SẼ RA SAO NẾU ĐẠI DƯƠNG', 'KHÔNG CÒN NƯỚC?']} accent="NƯỚC" accentT={54} size={110} y={150} />
    </g>
  );
};

// ---------- A8: "not gradually": the sea barely sinks and a red NO circle draws over a slow trickle arrow ----------
export const A8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 570, kf(t, [[0, 1.04], [len, 1.1]]))}>
      <DanangBeach id="ca8" t={t} drain={kf(t, [[0, 0], [len, 0.05]])} />
    </g>
    <rect x={0} y={0} width={1920} height={1080} fill="#0B0816" opacity={0.34} />
    <NoSign x={960} y={540} t={t - 3} />
  </g>
);

// ---------- A9: the instant vanish: the stopwatch counts to 1,0 s, then the sea is gone in two frames ----------
export const VANISH_AT = 50;
export const A9: React.FC<ShotProps> = ({ t, len }) => {
  const gone = clamp((t - VANISH_AT) / 2);
  const secs = clamp((t - 20) / (VANISH_AT - 20));
  return (
    <g>
      <g transform={camT(960, 570, kf(t, [[0, 1.05], [VANISH_AT, 1.08], [len, 1.14]]))}>
        <DanangBeach id="ca9" t={t + 40} drain={gone} />
      </g>
      {t >= 12 ? <Dial x={1700} y={150} p={secs} readout={`${(secs).toFixed(1).replace('.', ',')}s`} size={44} r={96} /> : null}
      {t >= VANISH_AT && t < VANISH_AT + 4 ? <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.55 * (1 - (t - VANISH_AT) / 4)} /> : null}
    </g>
  );
};
