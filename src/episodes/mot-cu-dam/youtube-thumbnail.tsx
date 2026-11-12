import React from 'react';
import { KitDefs, SetDefs, Street, camT } from '../../engine';
import { HookText } from '../../channel/channel-branding';
import { SpeedLines, ImpactFlash, Debris } from './punch-fx-kit';
import { PunchPip, punchFist } from './punch-pip-and-fist';
import { RogueRobot } from './rogue-robot';

// The YouTube thumbnail for "Sẽ ra sao nếu bạn chỉ cần một cú đấm?": one frozen frame a few frames after the hit:
// Pip big in mid-leap, his fist landing on the giant robot's chest, plates already cracking off, speed lines; ONE hook phrase.
//   npx remotion still src/index.ts OnePunchThumbnail out/mot-cu-dam/thumbnail-1920.png

const HIT = 40;
const T = HIT + 1;

export const OnePunchThumbnail: React.FC = () => {
  const pip = { x: 980, ground: 1240, scale: 1.45, side: 1 as const, aim: 100, lunge: 60, lean: 10 };
  const fist = punchFist(T, HIT, pip);
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <g transform={camT(960, 540, 1)}>
        <Street t={40} id="thumbopm" night />
        <RogueRobot t={T} x={1560} y={1120} scale={1.0} burst={0} walk={0} id="thumbopmr" />
        <SpeedLines t={T} cx={fist.x} cy={fist.y} o={0.8} rIn={240} />
                <PunchPip t={T} hitT={HIT} {...pip} rimId="rimR" />
        <Debris t={T + 4} hitT={HIT} x={fist.x + 60} y={fist.y} n={34} power={1.4} dir={-40} cone={220} colors={['#C4622D', '#6B7280', '#8E3F1C', '#3E4450']} />
                <ImpactFlash t={HIT + 2} hitT={HIT} x={fist.x + 40} y={fist.y} r={360} />
      </g>
      <HookText lines={['1 CÚ ĐẤM']} y={300} size={210} />
    </svg>
  );
};
