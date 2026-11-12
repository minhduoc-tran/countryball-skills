import React from 'react';
import { ShotProps } from '../../engine';
import { Ball } from '../../countryball/countryball';
import { breathe, mixMotion, talk } from '../../countryball/ball-motion';
import { M1Helmet, NavyCap } from '../../countryball/ball-accessories-military';
import { Candle } from '../../countryball/ground-memorial-props';
import { HeliSide } from '../../countryball/ground-helicopters';
import { TransistorRadio } from '../../countryball/radio-props';
import { hash } from '../../countryball/fx-math';
import { Cap, INK, NameCard, Photo, Stage, Tag, USA_BLUE, easeOut, prog } from './chd-common';
import { Note, Snowflake } from './chd-icons';

// Chapter D, part 3 (4:22-4:42, beats "6c rockets" + "7 frequent wind"): D10-D12 the two US Marines (quiet: dim, name cards, candles, NO hits),
// D13 the evacuation order (Ford print), D14 "Gió Lốc" title, D15 AFRS radio, D16 "White Christmas" (snow + notes, no lyrics).

/** D10 "Trong trận pháo kích ấy, hai người lính thủy quân lục chiến Mỹ thiệt mạng," a quiet aerial print of the DAO compound, dimmed. */
export const D10: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d10" tone="night" />
    <Photo k="dao" t={t} id="d10p" x={960} y={420} w={900} rot={-1} from={0.05} fromSide="bottom" kb={{ z0: 1.0, z1: 1.1, px0: 0.01, py0: 0.01, px1: -0.015, py1: -0.01 }} sepia={0.15} />
    <Tag t={t} at={44} x={960} y={992} text="HAI LÍNH THỦY QUÂN LỤC CHIẾN MỸ" fill="#2F3E58" size={46} />
  </g>
);

/** D11 "Charles McMahon và Darwin Judge." two plain name cards, a candle under each. */
export const D11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d11" tone="night" />
    <NameCard t={t} at={0} x={520} y={420} name="CHARLES McMAHON" sub="Thủy quân lục chiến Mỹ" w={760} accent={USA_BLUE} />
    <NameCard t={t} at={32} x={1400} y={420} name="DARWIN JUDGE" sub="Thủy quân lục chiến Mỹ" w={760} accent={USA_BLUE} />
    <Candle x={520} y={880} s={230} t={t} seed={1} /><Candle x={1400} y={880} s={230} t={t + 9} seed={2} />
    <Cap t={t} at={10} x={520} y={1000} text="29.04.1975" size={40} color="#CFD8E4" font="ui" /><Cap t={t} at={42} x={1400} y={1000} text="29.04.1975" size={40} color="#CFD8E4" font="ui" />
  </g>
);

/** D12 "Họ là những quân nhân Mỹ cuối cùng hy sinh trong chiến tranh Việt Nam." two candles, a sad US ball, two plain lines. */
export const D12: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d12" tone="night" dim={0.2} />
    <Cap t={t} at={4} x={960} y={250} text="NHỮNG QUÂN NHÂN MỸ CUỐI CÙNG" size={70} />
    <Cap t={t} at={48} x={960} y={350} text="HY SINH TRONG CHIẾN TRANH VIỆT NAM" size={58} color="#E2B95A" />
    <Candle x={880} y={800} s={230} t={t} seed={3} /><Candle x={1050} y={800} s={230} t={t + 11} seed={4} />
    <Ball id="d12b" x={540} y={760} r={112} flag="USA" eyes="sad" hat={<M1Helmet />} tilt={-5} motion={breathe(t, 90, 0.02)} t={t} />
  </g>
);

/** D13 "Trưa hôm đó, Mỹ phát lệnh di tản bằng trực thăng." the 28.04 White House print, noon sun, a Huey. */
export const D13: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(prog(t, 10, 30));
  return (
    <g>
      <Stage id="d13" tone="navy" />
      <Photo k="ford" t={t} id="d13p" x={600} y={480} w={880} rot={-2} from={0.05} fromSide="left" kb={{ z0: 1.0, z1: 1.1, px0: 0.015, py0: 0, px1: -0.01, py1: 0 }} />
      <g transform={`translate(1440,290) scale(${0.6 + 0.4 * k})`} opacity={k}>
        {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-124} x2={0} y2={-168 - 8 * Math.sin(t / 6 + i)} stroke="#FFD43B" strokeWidth={9} strokeLinecap="round" transform={`rotate(${i * 30 + t * 0.6})`} />)}
        <circle r={98} fill="#FFD43B" stroke={INK} strokeWidth={7} />
      </g>
      <Cap t={t} at={8} x={1440} y={500} text="TRƯA 29.04.1975" size={56} />
      <HeliSide x={1440 + Math.sin(t / 18) * 30} y={690 + Math.sin(t / 11) * 8} size={330} kind="uh1" t={t} />
      <Tag t={t} at={34} x={1380} y={920} text="LỆNH DI TẢN BẰNG TRỰC THĂNG" fill="#2F5E9A" size={38} />
    </g>
  );
};

/** D14 "Chiến dịch có tên Gió Lốc." title card with wind streaks. */
export const D14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d14" tone="navy" />
    <g fill="none" stroke="#8EC1FF" strokeLinecap="round" opacity={0.55}>
      {Array.from({ length: 9 }, (_, i) => {
        const y = 140 + i * 105 + hash(i, 3) * 40, x0 = ((t * (14 + 5 * hash(i, 1)) + hash(i, 2) * 2400) % 2800) - 500;
        return <path key={i} d={`M${x0},${y} h${220 + 160 * hash(i, 4)} q60,0 60,-34 q0,-30 -34,-30`} strokeWidth={6 + 3 * hash(i, 5)} />;
      })}
    </g>
    <Cap t={t} at={2} x={960} y={520} text="CHIẾN DỊCH GIÓ LỐC" size={128} color="#FFFFFF" />
    <Cap t={t} at={14} x={960} y={640} text="Frequent Wind" size={58} color="#8EC1FF" font="ui" />
  </g>
);

/** D15 "Trên đài phát thanh của quân đội Mỹ, tín hiệu được phát đi" a transistor set with sound arcs, a worried US ball listening. */
export const D15: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d15" tone="dusk" dim={0.35} />
    <TransistorRadio x={640} y={900} s={3} t={t} waves={easeOut(prog(t, 4, 30))} />
    <Ball id="d15b" x={1400} y={780} r={118} flag="USA" eyes="worried" hat={<NavyCap />} look={-0.5} motion={mixMotion(breathe(t, 80, 0.03), talk(t, false))} t={t} />
    <Tag t={t} at={6} x={1200} y={290} text="ĐÀI PHÁT THANH CỦA QUÂN ĐỘI MỸ" fill="#2F5E9A" size={44} />
    <Tag t={t} at={28} x={1200} y={410} text="AFRS · TÍN HIỆU" fill="#1B3350" size={42} />
  </g>
);

/** D16 "là một bài hát quen thuộc về một mùa Giáng sinh trắng." snow and music notes (no lyrics). */
export const D16: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Stage id="d16" tone="night" />
    {Array.from({ length: 46 }, (_, i) => {
      const sp = 1.4 + 2.2 * hash(i, 1), y = ((t * sp + hash(i, 2) * 1200) % 1180) - 70, x = hash(i, 3) * 1920 + Math.sin(t / 20 + i) * 26;
      return <Snowflake key={i} x={x} y={y} r={9 + 16 * hash(i, 4)} rot={t * 2 * (hash(i, 5) - 0.5) + i * 20} o={0.55 + 0.4 * hash(i, 6)} />;
    })}
    <TransistorRadio x={300} y={1000} s={1.7} t={t} waves={1} />
    {Array.from({ length: 5 }, (_, i) => {
      const a = (t - 4 - i * 14) / 70;
      return a > 0 && a < 1 ? <Note key={i} x={380 + a * 560 + Math.sin(a * 9 + i) * 40} y={800 - a * 420} s={80 + 20 * (i % 2)} rot={-12 + 24 * (i % 2)} o={Math.min(1, a * 5) * (1 - a * 0.6)} /> : null;
    })}
    <Cap t={t} at={4} x={1150} y={470} text="WHITE CHRISTMAS" size={120} color="#F4FAFF" />
    <Cap t={t} at={24} x={1150} y={580} text="một mùa Giáng sinh trắng" size={58} color="#FFE9B0" font="hand" />
  </g>
);
