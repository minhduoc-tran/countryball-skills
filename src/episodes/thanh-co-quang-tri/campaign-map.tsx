import React from 'react';
import { FONT } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';

// A simplified north-up field map. Lines indicate general directions and locations, not a tactical reconstruction.
const locations = [
  [840, 327, 'Đông Hà'], [964, 479, 'Thị xã Quảng Trị'], [1111, 667, 'Mỹ Chánh'], [1300, 811, 'Huế'],
] as const;
const paths: Record<string, {d: string; color: string; x: number; y: number; flag: string}[]> = {
  spring: [
    {d: 'M740 186 Q782 234 835 323 T962 469', color: '#e27b62', x: 760, y: 242, flag: 'VNM'},
    {d: 'M390 365 Q570 339 736 355', color: '#e27b62', x: 489, y: 349, flag: 'VNM'},
  ],
  retreat: [{d: 'M989 501Q1069 557 1105 647', color: '#f4c269', x: 1051, y: 573, flag: 'RVN'}],
  counter: [
    {d: 'M1061 661Q1024 553 969 500', color: '#f4c269', x: 1041, y: 595, flag: 'RVN'},
    {d: 'M1259 625Q1215 491 1125 447L1021 453', color: '#f4c269', x: 1220, y: 532, flag: 'RVN'},
  ],
  july: [{d: 'M1217 573Q1230 404 1114 392L1007 423', color: '#f4c269', x: 1190, y: 441, flag: 'RVN'}],
  withdraw: [{d: 'M954 478Q913 436 854 434L773 424', color: '#e27b62', x: 850, y: 434, flag: 'VNM'}],
};
const label = {fontFamily: FONT.title, fontWeight: 700, paintOrder: 'stroke', stroke: '#202623', strokeWidth: 6} as const;

export const CampaignMap: React.FC<{ stage: string; p: number; angle: number }> = ({ stage, p, angle }) => {
  const zoom = 1 + (angle === 1 ? .27 : angle === 2 ? .12 : 0) + p * .035;
  return (
    <g>
      <defs>
        <pattern id="qtGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0H0V60" fill="none" stroke="#d5d3a9" strokeOpacity=".10" />
        </pattern>
      </defs>
      <rect width={1920} height={1080} fill="#102734" />
      <g transform={`translate(960 535) scale(${zoom}) translate(-960 -535)`}>
        <path d="M0 0H858Q954 113 1078 226T1298 436Q1354 521 1478 665T1732 877Q1771 944 1900 1080H0Z" fill="#46554a" stroke="#83a1a3" strokeWidth={7} />
        <path d="M0 0H491L508 153 395 263 503 341 429 501 555 631 459 757 567 906 535 1080H0Z" fill="#353e35" />
        <path d="M489 87l169 30 105 81-91 91-110-4-60 92-117-27-9-97Z M562 532l80-119 111 45-20 157 79 103-95 99-136-69Z M832 754l101-111 111 75 13 101-126 114-140-8Z" fill="#505c47" opacity=".76" />
        <rect x={-800} y={-600} width={3500} height={2280} fill="url(#qtGrid)" />
        <path d="M296 463Q535 487 744 402T1017 353Q1064 357 1185 321" fill="none" stroke="#72a6b0" strokeWidth={13} />
        <path d="M743 666Q857 581 1007 632T1392 568" fill="none" stroke="#558694" strokeWidth={8} />
        <path d="M672 169 812 298 964 479 1111 667 1300 811 1498 1008M415 298 635 303 840 327" fill="none" stroke="#d5c5a0" strokeOpacity=".72" strokeWidth={5} strokeDasharray="10 9" />
        <text x={514} y={452} fill="#b2d6d8" fontFamily={FONT.ui} fontSize={26}>SÔNG THẠCH HÃN</text>
        <text x={560} y={283} fill="#c5ba9d" fontFamily={FONT.ui} fontSize={22}>ĐƯỜNG 9</text>
        <text x={1260} y={741} fill="#c5ba9d" fontFamily={FONT.ui} fontSize={22}>QL 1</text>
        <text x={1288} y={382} fill="#a2b5c1" fontFamily={FONT.title} fontSize={28} letterSpacing={3}>BIỂN ĐÔNG</text>
        {locations.map(([x, y, name], i) => (
          <g key={name}>
            {i === 1 && <circle cx={x} cy={y} r={33 + 9 * Math.sin(p * 6.28)} fill="#f7c681" opacity={.2} />}
            <circle cx={x} cy={y} r={i === 1 ? 12 : 7} fill={i === 1 ? '#ffd788' : '#e0dbbd'} stroke="#282e2b" strokeWidth={4} />
            <text x={x + 22} y={y + (i === 1 ? 23 : -10)} fill="#f1e7cd" fontSize={i === 1 ? 36 : 30} {...label}>{name}</text>
          </g>
        ))}
        {(paths[stage] ?? []).map(({d, color, x, y, flag}, i) => (
          <g key={i} opacity={.75 + p * .25}>
            <path d={d} fill="none" stroke="#182029" strokeWidth={17} strokeLinecap="round" />
            <path d={d} fill="none" stroke={color} strokeWidth={9} strokeDasharray="15 13" strokeDashoffset={-p * 60} />
            <Ball id={`qtMap${i}`} x={x} y={y} r={45} flag={flag} eyes="normal" hat={flag === 'VNM' ? <MuCoi /> : undefined} />
          </g>
        ))}
      </g>
      <g transform="translate(1605 204)">
        <path d="M0 0 15 36 0 27-15 36Z" fill="#e4dcc7" />
        <text x={0} y={-14} fill="#e4dcc7" textAnchor="middle" fontFamily={FONT.ui} fontSize={23}>BẮC</text>
      </g>
      <text x={1640} y={954} fill="#a8b6b3" textAnchor="end" fontFamily={FONT.ui} fontSize={23}>SƠ ĐỒ KHÁI LƯỢC</text>
    </g>
  );
};
