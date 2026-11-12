import React from 'react';
import { FONT, KitDefs, SetDefs } from '../../engine';
import { Battlefield } from './battle-art';

export const ThanhCoQuangTriCover: React.FC = () => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <KitDefs />
    <SetDefs />
    <defs>
      <linearGradient id="qtCoverShade" x1="0" x2="0" y1="0" y2="1">
        <stop stopColor="#14131d" />
        <stop offset=".46" stopColor="#14131d" stopOpacity={0} />
        <stop offset=".65" stopColor="#14131d" stopOpacity={0} />
        <stop offset="1" stopColor="#14131d" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="#14131d" />
    <svg x={0} y={388} width={1080} height={1110} viewBox="400 230 1160 795" preserveAspectRatio="xMidYMid slice">
      <Battlefield t={16} p={.46} stage="hold" angle={2} />
    </svg>
    <rect width={1080} height={1920} fill="url(#qtCoverShade)" />
    <g textAnchor="middle" fontFamily={FONT.title} fontWeight={800}>
      <text x={540} y={429} fontSize={89} fill="#fff2df">THÀNH CỔ</text>
      <text x={540} y={548} fontSize={132} fill="#fff2df">QUẢNG TRỊ</text>
      <text x={540} y={1495} fontSize={86} fill="#ffcb77" stroke="#17131c" strokeWidth={12} paintOrder="stroke">81 NGÀY ĐÊM</text>
      <text x={540} y={1575} fontSize={30} fill="#e8ccb1" letterSpacing={6} fontFamily={FONT.ui}>28/06 — 16/09/1972</text>
    </g>
  </svg>
);
