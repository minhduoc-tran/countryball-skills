import React from 'react';
import { Ball, Eyes } from '../../countryball/countryball';
import { NonLa, PilotHelmet } from '../../countryball/ball-accessories';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { breathe, mixMotion } from '../../countryball/ball-motion';
import { Glow } from '../../countryball/fx-glow';
import { Candle, Stars, ramp } from './chh-common';

// Hữu Tiệp lake at dusk: calm water with the B-52 wreck, a USA ball (pilot helmet) on the left shore and a VNM ball
// (nón lá) on the right, both looking at the lake. `dark` 0..1 deepens the night; `candles` = how many are lit.
// Used by the "visitors at the lake" shots and by the closing question card.

export const LakeScene: React.FC<{ id: string; t: number; dark?: number; candles?: number; eyes?: Eyes; tear?: boolean }> = ({ id, t, dark = 0.3, candles = 0, eyes = 'normal', tear }) => {
  const ts = t / 30, mix = (a: number, b: number) => Math.round(a + (b - a) * dark);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={`rgb(${mix(48, 10)},${mix(58, 16)},${mix(100, 34)})`} />
          <stop offset="1" stopColor={`rgb(${mix(220, 40)},${mix(140, 34)},${mix(110, 56)})`} />
        </linearGradient>
        <radialGradient id={`${id}-lake`}><stop offset="0" stopColor={`rgb(${mix(110, 26)},${mix(150, 40)},${mix(170, 62)})`} /><stop offset="1" stopColor={`rgb(${mix(60, 14)},${mix(96, 26)},${mix(120, 44)})`} /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill={`url(#${id}-sky)`} />
      {dark > 0.2 && <g opacity={dark}><Stars ts={ts} /></g>}
      <path d="M0,640 Q500,590 960,630 T1920,620 L1920,1080 L0,1080 Z" fill={`rgb(${mix(60, 18)},${mix(74, 26)},${mix(70, 30)})`} />
      <ellipse cx={960} cy={760} rx={640} ry={190} fill={`url(#${id}-lake)`} stroke="#0A0F18" strokeWidth={5} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={960} cy={770} rx={80 + ((ts * 40 + i * 40) % 120)} ry={22 + ((ts * 12 + i * 12) % 36)} fill="none" stroke="#DDEBF5" strokeWidth={3} opacity={0.5 - 0.4 * (((ts * 40 + i * 40) % 120) / 120)} />)}
      <g transform="translate(0,6)"><AircraftTop id={`${id}-w`} kind="b52" x={960} y={760} size={190} heading={24} shadow={false} opacity={0.92} /></g>
      <ellipse cx={960} cy={805} rx={170} ry={34} fill={`rgb(${mix(70, 18)},${mix(108, 30)},${mix(134, 50)})`} opacity={0.8} />
      <Ball id={`${id}u`} x={250} y={820} r={104} flag="USA" eyes={eyes} look={0.7} tear={tear} hat={<PilotHelmet />} motion={breathe(t, 70, 0.025)} t={t} />
      <Ball id={`${id}v`} x={1670} y={820} r={104} flag="VNM" eyes={eyes} look={-0.7} tear={tear} hat={<NonLa />} motion={breathe(t, 76, 0.025, 12)} t={t} />
      {Array.from({ length: 7 }, (_, i) => {
        const lit = ramp(ts, 0.1 + i * 0.22, 0.5 + i * 0.22) * (i < candles ? 1 : 0);
        return <Candle key={i} x={620 + i * 113} y={965 + (i % 2) * 18} ts={ts} s={0.8} lit={lit} seed={i} />;
      })}
    </g>
  );
};
