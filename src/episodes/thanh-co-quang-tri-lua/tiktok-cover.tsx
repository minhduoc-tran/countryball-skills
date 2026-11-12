import React from 'react';
import { KitDefs, SetDefs } from '../../engine';
import { GateArt } from './field-art';
import { cream, gold, monoStyle, titleStyle } from './art-kit';

export const QuangTriLuaCover:React.FC=()=>(
  <svg width="1080" height="1920" viewBox="0 0 1080 1920">
    <KitDefs/><SetDefs/>
    <g transform="translate(540 1090) scale(1.15) translate(-540 -1090)">
      <GateArt stage="dig" angle={0} t={30} u={.28} beat={30}/>
    </g>
    <defs>
      <linearGradient id="qlCover" x1="0" x2="0" y1="0" y2="1">
        <stop stopColor="#1b1622"/><stop offset=".57" stopColor="#1b1622" stopOpacity="0"/><stop offset="1" stopColor="#1b1622"/>
      </linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#qlCover)"/>
    <path d="M238 340h604" stroke={gold} strokeWidth="5"/>
    <text x="540" y="426" textAnchor="middle" fontSize="41" fill={cream} letterSpacing="3" {...monoStyle}>THÀNH CỔ QUẢNG TRỊ</text>
    <text x="540" y="598" textAnchor="middle" fontSize="149" fill={gold} stroke="#291f2b" strokeWidth="11" paintOrder="stroke" {...titleStyle}>BÁM TRỤ</text>
    <text x="540" y="1500" textAnchor="middle" fontSize="67" fill={cream} {...titleStyle}>81 NGÀY ĐÊM</text>
    <text x="540" y="1580" textAnchor="middle" fontSize="29" fill={cream} letterSpacing="5" {...monoStyle}>28/06 — 16/09/1972</text>
  </svg>
);
