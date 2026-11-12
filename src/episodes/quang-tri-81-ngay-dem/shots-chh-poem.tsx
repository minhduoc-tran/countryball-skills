import React from 'react';
import { ShotProps } from '../../engine';
import { PhotoCard } from '../../countryball/photo-card';
import { Glow } from '../../countryball/fx-glow';
import { flicker, hash } from '../../countryball/fx-math';
import { IMG, NameCard, Txt } from './chb-common';
import { Letter, Note } from './chh-icons';
import { LanternField, RiverScene } from './chh-river-night';
import { HandLine, SoftT, easeOut, prog } from './chh-text-and-plan';

// Chapter H part 4 (10:48-11:09, beats "34 poem" + "34b songs"): the flower wharf photo, Lê Bá Dương, the four lines written one by
// one over the night river, the poem turning into songs and into a message for a whole generation.

const POEM = ['Đò lên Thạch Hãn ơi, chèo nhẹ.', 'Đáy sông còn đó, bạn tôi nằm.', 'Có tuổi hai mươi thành sóng nước.', 'Vỗ yên bờ bãi mãi ngàn năm.'];
const LINE_Y = [190, 320, 450, 580];

const Night: React.FC<{ t: number; id: string; pan: number; moonX?: number; n?: number; seed?: number; H?: number; veil?: number; children?: React.ReactNode }> = ({ t, id, pan, moonX = 1720, n = 90, seed = 4, H = 640, veil = 0, children }) => (
  <g>
    <RiverScene id={id} t={t} tone={0.92} H={H} pan={pan} moonX={moonX} bridges={false}>
      <LanternField id={id} t={t} n={n} H={H} t0={-60} span={1} speed={0.3} seed={seed} dMin={0.05} />
    </RiverScene>
    {veil > 0 && <rect width={1920} height={1080} fill="#050B15" opacity={veil} />}
    {children}
  </g>
);

/** H15 "Ở bến thả hoa bên sông, có khắc bốn câu thơ của một cựu binh" the flower wharf photo. */
export const H15: React.FC<ShotProps> = ({ t }) => (
  <Night t={t} id="h15" pan={t * 0.2} veil={0.3} seed={6}>
    <PhotoCard id="h15p" src={`${IMG}thach-han-flower-wharf-2018.jpg`} caption="Bến thả hoa bên sông Thạch Hãn, 2018" credit="Ảnh: Phương Huy / CC BY-SA 4.0" x={610} y={505} w={600} h={760} rot={-2}
      from={0.05} t={t / 30} kb={{ z0: 1.0, z1: 1.14, px0: 0.01, py0: 0.03, px1: -0.01, py1: -0.03 }} fromSide="left" />
    <SoftT t={t} x={1370} y={430} text="BẾN THẢ HOA" size={96} at={20} ls={3} glow="#FFB347" />
    <SoftT t={t} x={1370} y={510} text="bốn câu thơ khắc bên sông" size={52} at={34} font="hand" weight={700} color="#FFE9B8" />
  </Night>
);

/** H16 "cựu binh Thành cổ, ông Lê Bá Dương." Plain name card (no portrait). */
export const H16: React.FC<ShotProps> = ({ t }) => (
  <Night t={t} id="h16" pan={t * 0.25 + 90} veil={0.25} moonX={1250} seed={7}>
    <NameCard x={960} y={520} w={1200} rank="CỰU BINH THÀNH CỔ" name="Lê Bá Dương" sub="tác giả bốn câu thơ" s={t / 30} at={0.1} />
  </Night>
);

const PoemShot: React.FC<{ t: number; id: string; upTo: number; a: number; b: number; pan: number; moonX: number; seed: number; sign?: number }> = ({ t, id, upTo, a, b, pan, moonX, seed, sign }) => (
  <Night t={t} id={id} pan={pan} moonX={moonX} seed={seed}>
    <g transform={`translate(0,${-4 * Math.min(1, t / 60)})`}>
      {POEM.slice(0, upTo).map((l, i) => (
        <HandLine key={i} id={`${id}-l${i}`} t={t} x={960} y={LINE_Y[i]} text={l} a={i === upTo - 1 ? a : -10} b={i === upTo - 1 ? b : -9} dim={i === upTo - 1 ? 1 : 0.62} />
      ))}
      {sign !== undefined && <SoftT t={t} x={1440} y={682} text="— Lê Bá Dương" size={52} at={sign} font="hand" weight={700} color="#FFD27A" />}
    </g>
  </Night>
);

/** H17 "Đò lên Thạch Hãn ơi, chèo nhẹ." */
export const H17: React.FC<ShotProps> = ({ t }) => <PoemShot t={t} id="h17" upTo={1} a={4} b={42} pan={t * 0.2} moonX={1770} seed={4} />;
/** H18 "Đáy sông còn đó, bạn tôi nằm." */
export const H18: React.FC<ShotProps> = ({ t }) => <PoemShot t={t} id="h18" upTo={2} a={4} b={42} pan={t * 0.2 + 60} moonX={1750} seed={5} />;
/** H19 "Có tuổi hai mươi thành sóng nước." */
export const H19: React.FC<ShotProps> = ({ t }) => <PoemShot t={t} id="h19" upTo={3} a={3} b={32} pan={t * 0.2 + 120} moonX={1730} seed={6} />;
/** H20 "Vỗ yên bờ bãi mãi ngàn năm." + signature */
export const H20: React.FC<ShotProps> = ({ t }) => <PoemShot t={t} id="h20" upTo={4} a={3} b={38} pan={t * 0.2 + 180} moonX={1710} seed={7} sign={46} />;

/** H21 "Bài thơ ấy sau này được phổ nhạc thành nhiều ca khúc." Notes drift over the water along a staff. */
export const H21: React.FC<ShotProps> = ({ t }) => (
  <Night t={t} id="h21" pan={t * 0.2} seed={9} n={110}>
    {[0, 1, 2, 3, 4].map((i) => {
      const d = Array.from({ length: 41 }, (_, j) => `${j ? 'L' : 'M'}${j * 50 - 40},${300 + i * 26 + Math.sin(j * 0.45 + t / 22 + i * 0.2) * 22}`).join('');
      return <path key={i} d={d} fill="none" stroke="#FFD27A" strokeWidth={3} opacity={0.5 * prog(t, 0, 20)} />;
    })}
    {Array.from({ length: 9 }, (_, i) => {
      const x = ((i * 250 + t * 3.2) % 2300) - 200, y = 300 + 52 + Math.sin(x / 90 + i) * 40 + (i % 3) * 22 - 30, k = Math.min(1, x / 150, (2100 - x) / 150);
      return k > 0 ? <g key={i} opacity={k}><Glow x={x} y={y} r={80} color="#FFB347" o={0.4} /><Note x={x} y={y} s={0.95} pair={i % 2 === 0} rot={Math.sin(t / 20 + i) * 8} /></g> : null;
    })}
    <SoftT t={t} x={960} y={880} text="được phổ nhạc thành nhiều ca khúc" size={72} at={14} font="hand" weight={700} color="#FFE9B8" glow="#FFB347" />
  </Night>
);

/** H22 "nó đã trở thành lời nhắn chung của cả một thế hệ." A glowing letter floats on the river among the lanterns. */
export const H22: React.FC<ShotProps> = ({ t }) => {
  const x = 700 + t * 3.2, y = 760 + Math.sin(t / 24) * 8, f = flicker(t * 0.5, 1);
  return (
    <Night t={t} id="h22" pan={t * 0.2} seed={12} n={140}>
      <Glow x={x} y={y} r={380 * f} color="#FFC070" o={0.55} />
      <ellipse cx={x} cy={y + 90} rx={150} ry={22} fill="#FFB347" opacity={0.18} style={{ mixBlendMode: 'screen' }} />
      <Letter x={x} y={y} s={1.2} rot={Math.sin(t / 30) * 4 - 3} />
      {Array.from({ length: 14 }, (_, i) => {
        const a = prog(t, 30 + i * 4, 60 + i * 4), ang = i * 0.9 + t / 60, r = 160 + 90 * hash(i, 3);
        return a > 0 ? <circle key={i} cx={x + Math.cos(ang) * r} cy={y - 60 - Math.abs(Math.sin(ang)) * r * 0.9 - a * 40} r={3 + 3 * hash(i, 4)} fill="#FFE29A" opacity={a * (1 - prog(t, 90, 118)) * 0.9} /> : null;
      })}
      <SoftT t={t} x={960} y={190} text="LỜI NHẮN CHUNG" size={96} at={34} ls={3} glow="#FFB347" />
      <SoftT t={t} x={960} y={275} text="của cả một thế hệ" size={64} at={62} font="hand" weight={700} color="#FFE9B8" />
    </Night>
  );
};
