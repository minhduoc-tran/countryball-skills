import React from 'react';
import { ShotProps } from '../../engine';
import { FONT } from '../../engine/fonts';
import { Candle } from '../../countryball/ground-memorial-props';
import { Glow } from '../../countryball/fx-glow';
import { flicker } from '../../countryball/fx-math';
import { Boat } from './chh-icons';
import { LanternField, RiverScene } from './chh-river-night';
import { SoftT, easeOut, prog } from './chh-text-and-plan';

// Chapter H part 6 (11:20-11:37, beat "36 ending"): fifty years later, the two banks joined by bridges, numbers that differ, one
// certainty (twenty years old for ever), and a small boat gliding very gently on the Thạch Hãn: "chèo thật nhẹ".

/** H27 "Hơn năm mươi năm đã trôi qua. Hai bờ Thạch Hãn giờ được nối với nhau bằng những cây cầu." */
export const H27: React.FC<ShotProps> = ({ t }) => {
  const yr = easeOut(prog(t, 4, 18)) * (1 - prog(t, 44, 58));
  return (
    <g>
      <RiverScene id="h27" t={t} tone={0.55} H={560} pan={t * 0.35} bridges lit={0.25 + 0.75 * prog(t, 48, 100)} moonX={1650}>
        <LanternField id="h27" t={t} n={34} H={560} t0={20} span={60} speed={0.26} seed={21} dMin={0.2} />
      </RiverScene>
      <g opacity={yr}>
        <text x={960} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#FFE9B8" stroke="#0A0F1C" strokeWidth={22} paintOrder="stroke" strokeLinejoin="round" letterSpacing={6}>1972 → 2026</text>
        <SoftT t={t + 20} x={960} y={330} text="hơn 50 năm" size={70} font="hand" weight={700} color="#FFFFFF" />
      </g>
      <SoftT t={t} x={960} y={900} text="hai bờ nối nhau bằng những cây cầu" size={64} at={50} font="hand" weight={700} color="#FFE9B8" glow="#FFB347" />
    </g>
  );
};

const Chip: React.FC<{ x: number; y: number; big: string; sub: string; o: number }> = ({ x, y, big, sub, o }) => (
  <g transform={`translate(${x},${y})`} opacity={o}>
    <rect x={-290} y={-80} width={580} height={170} rx={28} fill="#000" opacity={0.35} transform="translate(8,12)" />
    <rect x={-290} y={-90} width={580} height={170} rx={28} fill="#15202D" fillOpacity={0.92} stroke="#E2B95A" strokeWidth={5} />
    <text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#FFFFFF">{big}</text>
    <text y={58} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#B9C6D6">{sub}</text>
  </g>
);

/** H28 "Những con số có thể khác nhau tùy theo người kể. Nhưng có một điều chắc chắn." */
export const H28: React.FC<ShotProps> = ({ t }) => {
  const away = prog(t, 76, 96), chips = [
    { x: 520, y: 330, big: '~4.000', sub: 'hy sinh · theo nhiều nguồn', dx: -1, ph: 0 },
    { x: 1300, y: 470, big: '5.000+', sub: 'chết và bị thương · TQLC VNCH', dx: 1, ph: 2 },
    { x: 860, y: 700, big: '328.000 tấn', sub: 'bom đạn · theo phía Việt Nam', dx: 0.3, ph: 4 },
  ];
  return (
    <g>
      <RiverScene id="h28" t={t} tone={1} H={560} pan={t * 0.2}>
        <LanternField id="h28" t={t} n={40} H={560} t0={-60} span={1} speed={0.2} seed={24} />
      </RiverScene>
      <rect width={1920} height={1080} fill="#050B15" opacity={0.45} />
      {chips.map((c, i) => (
        <Chip key={i} x={c.x + Math.sin(t / 40 + c.ph) * 34 + c.dx * away * 600} y={c.y + Math.cos(t / 33 + c.ph) * 22} big={c.big} sub={c.sub} o={easeOut(prog(t, 4 + i * 8, 18 + i * 8)) * (1 - away)} />
      ))}
      <SoftT t={t} x={960} y={190} text="mỗi người kể một khác" size={70} at={20} font="hand" weight={700} color="#FFE9B8" out={[70, 84]} />
      <g opacity={prog(t, 80, 100)}>
        <Candle x={960} y={760} s={260} t={t} />
      </g>
      <SoftT t={t} x={960} y={300} text="MỘT ĐIỀU CHẮC CHẮN" size={100} at={86} ls={4} glow="#FFB347" />
    </g>
  );
};

/** H29 "Ở nơi đó, rất nhiều người đã mãi mãi ở tuổi hai mươi." */
export const H29: React.FC<ShotProps> = ({ t }) => {
  const f = flicker(t * 0.3, 5), u = easeOut(prog(t, 60, 82));
  return (
    <g>
      <RiverScene id="h29" t={t} tone={1} H={560} pan={t * 0.25} moonX={1380}>
        <LanternField id="h29" t={t} n={250} H={560} t0={0} span={80} speed={0.3} seed={31} />
      </RiverScene>
      <Glow x={960} y={330} r={560 * f} color="#FFB347" o={0.28 * u} />
      <text x={960} y={470} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={420 * (0.94 + 0.06 * u)} fill="#FFE9B8" stroke="#2A1608" strokeWidth={26} paintOrder="stroke" strokeLinejoin="round" opacity={u * 0.95}
        style={{ filter: 'drop-shadow(0 0 30px rgba(255,180,80,0.7))' }}>20</text>
      <SoftT t={t} x={960} y={560} text="tuổi hai mươi" size={96} at={66} font="hand" weight={700} color="#FFFFFF" />
      <SoftT t={t} x={960} y={96} text="mãi mãi ở" size={72} at={46} font="hand" weight={700} color="#FFE9B8" />
    </g>
  );
};

/** H30 "Vì thế, mỗi khi đi qua dòng sông ấy," a small boat appears far away, gliding. */
export const H30: React.FC<ShotProps> = ({ t }) => (
  <g>
    <RiverScene id="h30" moonX={1720} t={t} tone={0.95} H={540} pan={t * 0.3} bridges lit={1}>
      <LanternField id="h30" t={t} n={80} H={540} t0={-60} span={1} speed={0.2} seed={41} dMax={0.8} />
      <Boat x={260 + t * 3.2} y={720} s={0.62} t={t} />
    </RiverScene>
    <SoftT t={t} x={960} y={170} text="mỗi khi đi qua dòng sông ấy" size={72} at={6} font="hand" weight={700} color="#FFE9B8" glow="#FFB347" />
  </g>
);

/** H31 "xin hãy chèo thật nhẹ." The boat, closer, barely moving the water. */
export const H31: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={`translate(960,620) scale(${1.02 + 0.0007 * t}) translate(-960,-620)`}>
      <RiverScene id="h31" t={t} tone={1} H={500} pan={t * 0.2} bridges lit={1} moonX={1720}>
        <LanternField id="h31" t={t} n={90} H={500} t0={-60} span={1} speed={0.18} seed={43} dMax={0.85} />
        <Boat x={820 + t * 1.6} y={800} s={0.95} t={t} />
      </RiverScene>
    </g>
    <SoftT t={t} x={960} y={200} text="chèo thật nhẹ" size={150} at={9} font="hand" weight={700} color="#FFFFFF" glow="#FFB347" />
  </g>
);
