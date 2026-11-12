import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { hop } from '../../countryball/ball-motion';
import { MuCoi } from '../../countryball/ball-accessories';
import { M1Helmet } from '../../countryball/ball-accessories-military';
import { lerp } from '../../countryball/fx-math';
import { Cap, Tag, easeOut, prog } from './chg-common';
import { RoadScene } from './chg-icons';

// Chapter G, part 8 (9:27-9:33, beat "11c healing"): the long road of healing. A VNM ball and a RVN ball walk side by side toward the sunrise: the same
// country, one road. G30 close (the two balls on the road), G31 they walk away toward the rising sun. Sound: none (the lead's music carries it).

/** G30 "Từ đó đến nay, những người con của cùng một đất nước" the two balls side by side on the road, dawn still low. */
export const G30: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RoadScene id="g30" t={t} dawn={lerp(0.25, 0.4, prog(t, 0, 85))} />
    <Ball id="g30a" x={790} y={850} r={118} flag="VNM" eyes="normal" hat={<MuCoi />} tilt={3} motion={hop(t, 24, 9)} t={t} />
    <Ball id="g30b" x={1090} y={850} r={118} flag="RVN" eyes="normal" hat={<M1Helmet />} tilt={-3} motion={hop(t, 24, 9, 12)} t={t} />
    <Tag t={t} at={0} x={960} y={130} text="TỪ ĐÓ ĐẾN NAY" fill="#2F3E58" size={54} />
    <Cap t={t} at={27} x={960} y={250} text="NHỮNG NGƯỜI CON CỦA" size={64} />
    <Cap t={t} at={42} x={960} y={345} text="CÙNG MỘT ĐẤT NƯỚC" size={64} color="#FFE08A" />
  </g>
);

/** G31 "vẫn đang đi trên một con đường dài, con đường hàn gắn." they walk away up the road while the sun rises. */
export const G31: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 0, 117)), y = lerp(850, 640, k), r = lerp(118, 46, k), dx = lerp(150, 52, k), mt = 1 - 0.3 * k;
  return (
    <g>
      <RoadScene id="g31" t={t} dawn={lerp(0.4, 1, prog(t, 0, 117))} />
      <Ball id="g31a" x={960 - dx} y={y} r={r} flag="VNM" eyes="normal" hat={<MuCoi />} tilt={2} motion={hop(t, 24, 9 * mt)} t={t} />
      <Ball id="g31b" x={960 + dx} y={y} r={r} flag="RVN" eyes="normal" hat={<M1Helmet />} tilt={-2} motion={hop(t, 24, 9 * mt, 12)} t={t} />
      <Cap t={t} at={0} x={960} y={160} text="MỘT CON ĐƯỜNG DÀI" size={78} />
      <Cap t={t} at={53} x={960} y={270} text="CON ĐƯỜNG HÀN GẮN" size={92} color="#FFE08A" />
    </g>
  );
};
