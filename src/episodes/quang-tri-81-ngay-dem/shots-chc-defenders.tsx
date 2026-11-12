import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { breathe } from '../../countryball/ball-motion';
import { LowerThird } from '../../countryball/hud-chips';
import { citadelScreen, localToScreen } from '../../countryball/citadel-geometry';
import { FrontArrow, SIDE_COLORS, UnitBox } from '../../countryball/ground-front-arrows';
import { Cap, PlanScene, Tag, cameraOnLocal, driftKeys, easeOut, prog } from './chc-common';
import { WallOutline } from './chc-plan-bits';
import { UnitCard } from './chc-unit-card';

// Chapter C, part 3 (4:01-4:18, beat "11 defenders"): who held the town. C14 few at first, C15 E48/F320B ("Theo phía Việt Nam"),
// C16 E27 Triệu Hải + local battalions, C17 E95/F325 cross the river, C18 many more units one after another.

const cam0 = (a = 0.62, b = 0.7) => driftKeys(cameraOnLocal(-130, 10, a), cameraOnLocal(-130, 10, b), 5);
/** Small QĐND balls inside the walls (frame positions in the citadel frame). */
const Defenders: React.FC<{ cam: Parameters<typeof citadelScreen>[0]; t: number; n: number; r?: number; at?: number }> = ({ cam, t, n, r = 26, at = 0 }) => {
  const spots: [number, number][] = [[-90, -50], [60, 70], [110, -80], [-40, 100], [150, 20], [-140, 60]];
  return (
    <g>
      {spots.slice(0, n).map(([u, v], i) => {
        const [x, y] = citadelScreen(cam, u, v), k = easeOut((t - at - i * 6) / 7);
        return k > 0.01 ? <Ball key={i} id={`def${at}-${i}`} x={x} y={y - (1 - k) * 30} r={r} flag="VNM" eyes="determined" hat={<MuCoi camo />} motion={breathe(t, 54, 0.04, i * 9)} shadow={false} /> : null;
      })}
    </g>
  );
};
const SRC = <LowerThird title="Theo phía Việt Nam" from={0} accent="#E0483C" />;

/** C14 "Lực lượng giữ thị xã và thành cổ lúc đầu không lớn." */
export const C14: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c14" keys={driftKeys(cameraOnLocal(-10, 0, 0.9), cameraOnLocal(-10, 0, 1.0), 3.2)} date="1972"
    over={(cam) => (
      <g>
        <WallOutline cam={cam} u={1} style="brick" width={20} />
        <Defenders cam={cam} t={t} n={3} r={34} at={10} />
        <Tag t={t} at={6} x={960} y={150} text="LÚC ĐẦU: KHÔNG LỚN" size={62} fill="#B03029" />
      </g>
    )} />
);

/** C15 "Theo phía Việt Nam, đó là trung đoàn 48 của sư đoàn 320B," */
export const C15: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c15" keys={cam0(0.62, 0.7)} date="1972"
    over={(cam) => {
      const [x, y] = citadelScreen(cam, -20, -135);
      return (
        <g>
          <WallOutline cam={cam} u={1} style="brick" width={18} />
          <Defenders cam={cam} t={t} n={3} r={24} />
          <g transform={`translate(0,${(1 - easeOut(prog(t, 46, 60))) * -40})`} opacity={easeOut(prog(t, 46, 60))}><UnitBox x={x} y={y} kind="inf" color={SIDE_COLORS.vnm} label="E48" size={54} /></g>
          <UnitCard t={t} at={46} y={250} name="E48" sub="trung đoàn 48 · sư đoàn 320B" hot />
          {SRC}
        </g>
      );
    }} />
);

/** C16 "trung đoàn Triệu Hải, cùng các tiểu đoàn bộ đội địa phương." */
export const C16: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c16" keys={cam0(0.7, 0.76)} date="1972"
    over={(cam) => {
      const a = citadelScreen(cam, -110, -120), b = citadelScreen(cam, 90, -120), c = citadelScreen(cam, -100, 90);
      return (
        <g>
          <WallOutline cam={cam} u={1} style="brick" width={18} />
          <UnitBox x={a[0]} y={a[1]} kind="inf" color={SIDE_COLORS.vnm} label="E48" size={56} />
          {easeOut(prog(t, 2, 14)) > 0.05 && <UnitBox x={b[0]} y={b[1]} kind="inf" color={SIDE_COLORS.vnm} label="E27" size={56} />}
          {easeOut(prog(t, 38, 50)) > 0.05 && [c, [c[0] + 110, c[1] + 40], [c[0] + 220, c[1] + 0]].map((p, i) => <UnitBox key={i} x={p[0]} y={p[1]} kind="inf" color="#B03029" size={40} />)}
          <UnitCard t={t} at={-50} y={250} name="E48" sub="trung đoàn 48 · sư đoàn 320B" />
          <UnitCard t={t} at={0} y={376} name="E27 TRIỆU HẢI" sub="trung đoàn Triệu Hải" hot={t < 36} />
          <UnitCard t={t} at={36} y={502} name="TIỂU ĐOÀN ĐỊA PHƯƠNG" sub="bộ đội địa phương" color="#B03029" hot />
          {SRC}
        </g>
      );
    }} />
);

const Roster: React.FC<{ t: number; newAt?: number; extra?: boolean }> = ({ t, newAt = 9999, extra }) => (
  <g>
    <UnitCard t={t} at={-50} y={190} name="E48" sub="sư đoàn 320B" w={420} />
    <UnitCard t={t} at={-50} y={310} name="E27 TRIỆU HẢI" w={420} />
    <UnitCard t={t} at={-50} y={430} name="ĐỊA PHƯƠNG" sub="bộ đội địa phương" w={420} color="#B03029" />
    <UnitCard t={t} at={newAt} y={550} name="E95" sub="sư đoàn 325" w={420} hot={!extra} />
    {extra && <UnitCard t={t} at={0} y={670} name="VÀ NHIỀU ĐƠN VỊ KHÁC" w={420} />}
  </g>
);

/** C17 "Sau đó, trung đoàn 95 của sư đoàn 325" a red arrow crosses the river into the citadel. */
export const C17: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c17" keys={cam0(0.5, 0.56)} date="1972"
    over={(cam) => {
      const P = (x: number, y: number) => localToScreen(cam, x, y) as [number, number];
      return (
        <g>
          <WallOutline cam={cam} u={1} style="brick" width={16} />
          <FrontArrow id="c17-a" t={t} t0={18} dur={60} points={[P(-1100, -420), P(-760, -200), P(-420, -40), P(-130, 0)]} width={44} color={SIDE_COLORS.vnm} label="E95" />
          <Roster t={t} newAt={22} />
          {SRC}
        </g>
      );
    }} />
);

/** C18 "và nhiều đơn vị khác lần lượt được đưa vào." more unit boxes land one by one. */
export const C18: React.FC<ShotProps> = ({ t }) => (
  <PlanScene t={t} id="c18" keys={cam0(0.5, 0.58)} date="1972"
    over={(cam) => {
      const P = (x: number, y: number) => localToScreen(cam, x, y) as [number, number];
      const spots: [number, number][] = [[-120, -90], [20, -110], [140, -60], [-60, 60], [90, 90], [-170, 40], [190, 30]];
      return (
        <g>
          <WallOutline cam={cam} u={1} style="brick" width={16} />
          <FrontArrow id="c18-a" t={t} t0={4} dur={50} points={[P(-1250, -520), P(-800, -300), P(-430, -120), P(-200, -40)]} width={34} color={SIDE_COLORS.vnm} opacity={0.75} />
          <FrontArrow id="c18-b" t={t} t0={34} dur={50} points={[P(-1250, 200), P(-800, 160), P(-430, 60), P(-200, 20)]} width={34} color={SIDE_COLORS.vnm} opacity={0.75} />
          {spots.map(([u, v], i) => {
            const k = easeOut((t - 8 - i * 10) / 8), [x, y] = citadelScreen(cam, u, v);
            return k > 0.01 ? <g key={i} transform={`translate(0,${(1 - k) * -30})`} opacity={k}><UnitBox x={x} y={y} kind="inf" color={i % 2 ? '#B03029' : SIDE_COLORS.vnm} size={46} /></g> : null;
          })}
          <Roster t={t} newAt={-50} extra />
          <Cap t={t} x={1280} y={170} text="LẦN LƯỢT ĐƯỢC ĐƯA VÀO" size={54} at={14} />
          {SRC}
        </g>
      );
    }} />
);
