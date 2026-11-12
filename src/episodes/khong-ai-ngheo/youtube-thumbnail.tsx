import React from 'react';
import { KitDefs, SetDefs, Hero, HEAD, LEG_LEN, basePose, LOOKS, Glow, Look } from '../../engine';
import { HookText } from '../../channel/channel-branding';
import { DawnAlley } from '../tien-vo-han/che-dawn-alley-backdrop';
import { GRANDMA, VILLAGE_GIRL, DOCTOR, WORKER } from './cast-looks';

// The YouTube thumbnail for "Sẽ ra sao nếu thế giới này không còn ai nghèo?": the dawn alley, a row of people (the
// lottery grandma, the village girl, the doctor, the worker, mum, Mo) standing on the glowing golden floor; Pip big
// on the right, stunned; ONE hook phrase.
//   npx remotion still src/index.ts NoPovertyThumbnail out/khong-ai-ngheo/thumbnail-1920.png

const ROW: [Look, number, number][] = [[GRANDMA, 300, 0.56], [VILLAGE_GIRL, 430, 0.41], [DOCTOR, 555, 0.58], [LOOKS.mom, 685, 0.56], [WORKER, 815, 0.58], [LOOKS.mo, 945, 0.57], [LOOKS.sis, 1065, 0.4]];
const FLOOR = 1000;

export const NoPovertyThumbnail: React.FC = () => {
  const sc = 2.6;
  const pip = { ...basePose, x: 1530, y: 560 - HEAD.y * sc, scale: sc, yaw: -0.25, look: -0.35, armL: { a: 20, b: 10 }, armR: { a: 40, b: 70 }, expr: 'shock' as const };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <DawnAlley t={40} id="thumbnp" />
      <rect x={0} y={0} width={1920} height={1080} fill="#1A0E1E" opacity={0.25} />
      <Glow x={700} y={FLOOR} r={760} o={0.5} />
      <rect x={120} y={FLOOR - 6} width={1120} height={12} rx={6} fill="#FFD66B" style={{ filter: 'drop-shadow(0 0 22px rgba(255,200,90,0.95))' }} />
      {ROW.map(([look, x, s], i) => (
        <Hero key={i} look={look} pose={{ ...basePose, x, y: FLOOR - LEG_LEN * s * 1.6, scale: s * 1.6, yaw: 0.1 * (i % 2 ? 1 : -1), armL: { a: 14, b: 6 }, armR: { a: 14, b: 6 }, expr: 'happy' }} rimId="rimR" shadow={0} />
      ))}
      <Glow x={1530} y={420} r={560} o={0.3} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0} />
      <HookText lines={['0 NGƯỜI', 'NGHÈO']} y={300} size={200} />
    </svg>
  );
};
