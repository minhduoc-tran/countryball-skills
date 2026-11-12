import React from 'react';
import { HowitzerSide } from './ground-artillery';
import { WarshipSide } from './ground-naval-gunfire';
import { TankSide } from './ground-tanks';
import { HeliSide } from './ground-helicopters';
import { RuinedWallSide } from './ground-ruined-wall-side';
import { Label } from './fx-demo-sections-balls';
import { prog } from './fx-math';

// QuangTriKitDemo section 7 (t = local frame): the side-view gallery: howitzer, tanks, helicopters, warship, crumbling wall.

export const SideViewSection: React.FC<{ t: number }> = ({ t }) => {
  const dmg = 0.1 + 0.55 * prog(t, 0, 90);
  return (
    <g>
      <rect y={880} width={1920} height={200} fill="#2B3A22" opacity={0.7} /><rect y={300} width={1920} height={580} fill="#14263A" opacity={0.5} />
      <Label x={60} y={70} text="HÌNH NGANG: pháo, xe tăng, trực thăng, tàu chiến, tường thành sụp dần" size={28} color="#FFD166" anchor="start" />
      <HowitzerSide x={250} y={440} s={300} elev={24} recoil={Math.max(0, 1 - (t % 50) / 8)} />
      <TankSide x={760} y={440} size={380} kind="t54" fire={t % 60 < 4 ? 1 : 0} />
      <TankSide x={1240} y={440} size={380} kind="m48" flip />
      <HeliSide x={1650} y={400} size={420} kind="uh1" t={t} />
      <HeliSide x={420} y={720} size={300} kind="ch53" t={t} />
      <WarshipSide x={880} y={760} size={560} kind="cruiser" t={t} />
      <RuinedWallSide id="rw" x={1550} y={1010} w={640} h={250} damage={dmg} t={t} />
      {[['pháo (giật)', 250], ['T-54', 760], ['M48', 1240], ['UH-1', 1650]].map(([s, x]) => <Label key={s as string} x={x as number} y={520} text={s as string} size={22} />)}
      <Label x={420} y={850} text="CH-53" size={22} /><Label x={880} y={870} text="tàu tuần dương" size={22} /><Label x={1550} y={1062} text={`tường thành: hư hại ${dmg.toFixed(2)}`} size={22} />
    </g>
  );
};
