import React from 'react';
import { FONT } from '../../engine/fonts';
import { fmtVi } from '../../countryball/hud-counter';
import { Candle, GOLD, INK, Txt, fade, ramp } from './chg-common';

// The quiet card for Hà Nội's civilian dead: near-black plain background, two candles, one number, no sound hits.
// `cs` = card clock in seconds; G14 passes the shot clock, G15 continues it (+3.62 s) so the number never restarts.

export const CivilCard: React.FC<{ cs: number }> = ({ cs }) => {
  const n = Math.round(1624 * ramp(cs, 1.15, 2.5));
  const zoom = 1 + 0.035 * (cs / 8);
  return (
    <g>
      <rect width={1920} height={1080} fill="#080B11" />
      <defs>
        <radialGradient id="g14-warm" cx="50%" cy="52%" r="60%"><stop offset="0" stopColor="#3A2A1C" stopOpacity={0.55} /><stop offset="1" stopColor="#080B11" stopOpacity={0} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#g14-warm)" />
      <g transform={`translate(960,540) scale(${zoom}) translate(-960,-540)`}>
        <Candle x={300} y={800} s={cs} scale={1.5} seed={0} />
        <Candle x={1620} y={800} s={cs} scale={1.5} seed={3} />
        <text x={960} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={46} fill={GOLD} opacity={fade(cs, 0.2, 0.6)}>Theo số liệu của Hà Nội</text>
        <text x={960} y={590} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={250} fill="#F4F4F4" opacity={fade(cs, 0.9, 0.5)}>{fmtVi(n)}</text>
        <text x={960} y={700} textAnchor="middle" fontFamily={FONT.title} fontWeight={600} fontSize={58} fill="#E8EEF4" opacity={fade(cs, 2.4, 0.6)}>người dân thủ đô thiệt mạng</text>
        <text x={960} y={780} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#9DB4CC" opacity={fade(cs, 4.4, 0.6)}>18 - 29.12.1972</text>
        <text x={960} y={880} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={62} fill="#F4D9A8" opacity={fade(cs, 6.1, 0.8)}>Phần lớn là dân thường</text>
      </g>
      <Txt x={960} y={1040} size={22} fill="#6B7A8C" o={0.9} mono sw={4} weight={400}>Nguồn: số liệu của Hà Nội; Wikipedia, Operation Linebacker II</Txt>
      <rect width={1920} height={1080} fill={INK} opacity={0.12 * (1 - fade(cs, 0, 0.5))} />
    </g>
  );
};
