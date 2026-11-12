import React from 'react';
import { ShotProps } from '../../engine';
import { Drift } from '../dien-bien-phu-tren-khong/cha-map-scene';
import { TitleBackdrop, TitleText } from './cha-title-art';

// Chapter A title card (22.1-26.4 s): "81 NGÀY ĐÊM" / "THÀNH CỔ QUẢNG TRỊ" over the burning dusk citadel. The hook.
export const A10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Drift t={t} len={len} z0={1} z1={1.05} cy={640}>
      <TitleBackdrop t={t} />
      <TitleText t={t} />
    </Drift>
  </g>
);
