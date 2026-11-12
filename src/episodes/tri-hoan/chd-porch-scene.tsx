import React from 'react';
import { Hero, Pose, faceAt } from '../../engine';
import { GRANDMA } from '../khong-ai-ngheo/cast-looks';
import { PIP } from './chd-desk-props';
import { Porch, Bench, Guitar, Notes, benchPose, SIT_SEAT_Y } from './chd-country-props';

// Chapter D props (4/4): the ending's porch scene shared by D33, D35, D36 and the end card: grandma and Pip side by side on
// the bench, the dusted guitar on Pip's lap, notes floating. Camera and extra overlays belong to the calling shot.

export const PIP_X = 850;
export const GM_X = 1215;

export const PorchScene: React.FC<{ t: number; id: string; dusk?: number; mode?: 'teach' | 'clap' | 'watch'; notes?: number; strum?: number; pipLook?: number; grandma?: boolean }> = ({
  t, id, dusk = 0, mode = 'teach', notes = 5, strum = 1, pipLook = 0.6, grandma = true,
}) => {
  const wob = Math.sin(t * 0.9);
  const guitarAt = { x: PIP_X + 62, y: 800 - 68 * 1.4 - 36 - 30 };
  const pip: Pose = benchPose(PIP_X, {
    yaw: 0.6, look: pipLook, headTilt: 4 + wob * 2, armR: { a: 36 + 14 * wob * strum, b: 44 }, armL: { a: -62, b: -6 },
    ...faceAt(t, [[0, 'happy']]),
  });
  const gm: Pose = benchPose(GM_X, { yaw: -0.6, facing: -1, look: -0.6, headTilt: -3 + Math.sin(t / 9) * 2, ...faceAt(t, [[0, 'happy']]) });
  if (mode === 'teach') gm.armL = { a: 74, b: 6 };
  if (mode === 'clap') {
    const c = Math.abs(Math.sin(t * 0.55));
    gm.armL = { a: 52, b: 40 + 30 * c };
    gm.armR = { a: -40 - 10 * c, b: -30 };
  }
  return (
    <g>
      <Porch id={id} t={t} dusk={dusk} />
      <Bench x0={620} x1={1400} y={SIT_SEAT_Y} />
      {grandma ? <Hero look={GRANDMA} pose={gm} rimId="rimR" shadow={0} /> : null}
      <Hero look={PIP} pose={pip} rimId="rimR" shadow={0} />
      <Guitar x={guitarAt.x} y={guitarAt.y} rot={76} s={0.6} t={t} strum={strum} shine={0.5} />
      {notes > 0 ? <Notes x={guitarAt.x + 120} y={guitarAt.y - 50} t={t} n={notes} s={1} /> : null}
    </g>
  );
};
