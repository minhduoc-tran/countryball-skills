import React from 'react';
import { KitDefs, SetDefs, Hero, HEAD, basePose, LOOKS, Glow, Street, Motorbike, TrafficLight } from '../../engine';
import { HookText } from '../../channel/channel-branding';

// The YouTube thumbnail for "Sẽ ra sao nếu xã hội không có pháp luật?": the VN street at dusk, a red light nobody
// obeys, motorbikes tipped over in a jam, Pip big on the right, shocked; ONE hook phrase.
//   npx remotion still src/index.ts NoLawThumbnail out/khong-phap-luat/thumbnail-1920.png

const BIKES: [number, number, number, number, string][] = [
  [820, 900, 1.05, -38, '#B8483E'], [1030, 860, 0.9, 24, '#3E7FB8'], [680, 820, 0.8, 12, '#3E9C6A'], [940, 780, 0.7, -16, '#C9A23E'],
];

export const NoLawThumbnail: React.FC = () => {
  const sc = 2.6;
  const pip = { ...basePose, x: 1540, y: 560 - HEAD.y * sc, scale: sc, yaw: -0.3, look: -0.45, armL: { a: 30, b: 40 }, armR: { a: 120, b: 30 }, expr: 'shock' as const };
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <Street t={40} id="thumblaw" />
      <rect x={0} y={0} width={1920} height={1080} fill="#2A0A14" opacity={0.3} />
      <TrafficLight x={1180} y={760} s={1.25} state="red" />
      {BIKES.map(([x, y, s, lean, color], i) => <Motorbike key={i} x={x} y={y} s={s} lean={lean} color={color} facing={i % 2 ? -1 : 1} />)}
      <Glow x={1540} y={480} r={600} o={0.32} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0} />
      <HookText lines={['LUẬT', 'RỪNG']} y={300} size={230} />
    </svg>
  );
};
