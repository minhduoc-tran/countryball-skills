import React from 'react';
import {
  Hero, Pose, poseAt, faceAt, kf, clamp, easeOut, easeInOut, backOut, camT, LOOKS, Schematic, SCH, Glow, Dust, LightVeil, Foreground, Bokeh,
  Tabletop, WallCalendar, ShotProps,
} from '../../engine';
import { BigStat, Cap } from '../khong-ai-ngheo/cha-number-card-props';
import { LookArm } from '../khong-ai-ngheo/chb-cards-and-marks';
import { Candle } from '../last-one/che-night-props';
import { FlatDusk } from './chd-economy-props';
import { SourceTag, ChildIcon } from './chd-card-props';
import { SpareRoom, Mattresses, Bag, FLOOR } from './chd-spare-room-props';
import { Swing, RuledPage, PencilLetters, Pencil, tipAt, GreyCat } from './chd-children-props';

// Chapter D (217.2-230.6 s), "year one: children", look y1, the emotional peak. D19 an empty swing at dusk; D20-D21 the
// UNICEF card (six children, one lights up: > 1/6 live in conflict areas); D22 sis, a year of crossed-off months and her
// schoolbag on a hook; D23 she opens her exercise book by candlelight; D24 macro: her careful letters a, ă, â..., the cat.

const SIS = LOOKS.sis;

// ---------- D19: "Người chịu thiệt nhiều nhất là trẻ em.": an empty swing at dusk, a ball left in the dust ----------
export const D19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 980]]), kf(t, [[0, 700], [len, 640]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
    <FlatDusk id="d19" groundY={860} />
    <Bokeh seed={12} n={9} x0={0} y0={200} w={1900} h={400} t={t} o={0.12} />
    <circle cx={1290} cy={826} r={32} fill="#E5533F" stroke="#7A2218" strokeWidth={4} />
    <path d="M 1262 820 Q 1290 800 1318 820" stroke="#FFF3DC" strokeWidth={5} fill="none" opacity={0.7} />
    <ellipse cx={1296} cy={862} rx={40} ry={8} fill="#000" opacity={0.3} />
    <Swing x={940} y={860} t={t} amp={11} />
    <LightVeil id="d19veil" lights={[[940, 560, 760]]} o={0.3} />
    <Dust t={t} seed={101} x0={500} y0={300} w={900} h={500} n={18} o={0.4} />
    <Foreground blur={16}><path d="M -300 1200 L -300 900 Q 100 840 420 930 L 460 1200 Z" fill="#120C18" /></Foreground>
  </g>
);

// ---------- D20 / D21: the UNICEF card: six children; one lights up: > 1/6 TRẺ EM ----------
const ICON_X = (i: number) => 330 + i * 252;
export const D20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
    <Schematic t={t + 200} id="d20sch" />
    <Cap x={960} y={380} t={t - 4} text="CỨ 6 TRẺ EM TRÊN THẾ GIỚI" size={54} color={SCH.line} />
    {Array.from({ length: 6 }).map((_, i) => {
      const k = backOut(clamp((t - 4 - i * 4) / 7));
      return <ChildIcon key={i} x={ICON_X(i)} y={720} s={2.3 * k} bunch={i % 2 === 1} o={clamp(k * 2)} />;
    })}
    <SourceTag x={96} y={976} t={t - 6} text="UNICEF" />
  </g>
);
export const D21: React.FC<ShotProps> = ({ t, len }) => {
  const hi = backOut(clamp((t - 8) / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <Schematic t={t + 230} id="d21sch" />
      <BigStat x={960} y={330} t={t - 10} text="> 1/6 TRẺ EM" size={170} />
      <Cap x={960} y={450} t={t - 30} text="SỐNG Ở VÙNG CÓ XUNG ĐỘT" size={46} color={SCH.line} />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          {i === 5 ? <Glow x={ICON_X(i)} y={720} r={260 * hi} o={0.5} /> : null}
          <ChildIcon x={ICON_X(i)} y={720 - (i === 5 ? 18 * hi : 0)} s={i === 5 ? 2.3 + 0.5 * hi : 2.3} bunch={i % 2 === 1} on={i === 5 && hi > 0} glow={i === 5} o={i === 5 ? 1 : 1 - 0.55 * hi} />
        </g>
      ))}
      <SourceTag x={96} y={976} t={t + 40} text="UNICEF" />
    </g>
  );
};

// ---------- D22: "Em gái bạn đã một năm không được đến trường.": twelve months crossed out, her bag on a hook ----------
export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const sis: Pose = { ...poseAt(t, [{ f: 0, p: { x: 790, y: FLOOR - 76 * 0.8, scale: 0.8, yaw: 0.75, facing: 1, legL: { a: 84, b: -84 }, legR: { a: 88, b: -80 }, armL: { a: 20, b: 30 }, armR: { a: 28, b: 46 }, headTilt: -6, look: 0.7 } }, { f: len, p: { headTilt: -10 } }]), ...faceAt(t, [[0, 'neutral'], [46, 'tired']]) };
  const hook = { x: 1040, y: 330 };
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 860]]), 520, kf(t, [[0, 1.28], [len, 1.4]]))}>
      <SpareRoom t={t + 90} id="d22" night={0.8} />
      {Array.from({ length: 12 }).map((_, m) => {
        const t0 = 6 + m * 4.4;
        const crossed = Math.min(30, Math.floor(30 * clamp((t - t0) / 4.4)));
        return <WallCalendar key={m} x={330 + (m % 4) * 140} y={90 + Math.floor(m / 4) * 178} w={120} crossed={crossed} rot={((m * 7) % 5) - 2} />;
      })}
      <circle cx={hook.x} cy={hook.y} r={9} fill="#C9A46A" />
      <g transform={`rotate(${Math.sin(t / 11) * 1.6} ${hook.x} ${hook.y})`}>
        <Bag x={hook.x} y={hook.y + 218} s={1.15} color="#F28C6A" star />
      </g>
      <Mattresses x0={260} x1={840} />
      <Hero look={SIS} pose={sis} rimId="rimR" shadow={0} />
      <LightVeil id="d22veil" lights={[[1190, 600, 600], [560, 330, 440]]} o={0.5} />
      <Dust t={t} seed={102} x0={800} y0={300} w={500} h={450} n={16} o={0.4} />
    </g>
  );
};

// ---------- D23: "Em vẫn mở vở ra,": from above, by candlelight, her hand opens the cover of the exercise book ----------
export const D23: React.FC<ShotProps> = ({ t, len }) => {
  const th = Math.PI * easeInOut(clamp((t - 6) / 16));
  const sx = Math.cos(th);
  const edge = 800 + 640 * sx;
  const away = easeOut(clamp((t - 26) / 10));
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 900]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Tabletop edge={1320} />
      <RuledPage x0={800} y0={90} w={640} h={900} />
      <path d="M 790 90 V 990" stroke="#000" strokeWidth={8} opacity={0.35} />
      {sx < 0 ? <rect x={800 + 640 * sx} y={90} width={-640 * sx} height={900} fill="#3E8C86" /> : null}
      <g transform={`translate(800 0) scale(${sx} 1) translate(-800 0)`}>
        <rect x={800} y={90} width={640} height={900} rx={10} fill={sx >= 0 ? '#3E8C86' : '#2F6E69'} stroke="#1E4A46" strokeWidth={6} />
        <rect x={800} y={90} width={60} height={900} fill="#2F6E69" />
        <rect x={940} y={250} width={380} height={190} rx={12} fill="#F6EFE3" opacity={sx >= 0 ? 1 : 0} />
        <path d="M 1130 280 l 18 40 l 44 4 l -33 29 l 10 43 l -39 -23 l -39 23 l 10 -43 l -33 -29 l 44 -4 Z" fill="#F2C230" opacity={sx >= 0 ? 1 : 0} transform="scale(0.8) translate(280 40)" />
      </g>
      <Pencil x={330} y={900} len={420} ang={-14} />
      <g transform={`translate(${away * 260} ${away * 340})`}>
        <LookArm look={SIS} x={edge} y={880} fx={edge + 380} fy={1330} rot={-8} s={4.6} width={118} />
      </g>
      <Candle x={250} y={250} s={1.7} t={t} seed={2} glow={1} />
      <g filter="url(#blur6)"><path d={`M 2000 830 Q ${1880 + Math.sin(t / 14) * 30} 800 ${1790 + Math.sin(t / 14) * 40} 700`} stroke="#8F95A6" strokeWidth={46} fill="none" strokeLinecap="round" /></g>
      <LightVeil id="d23veil" lights={[[420, 360, 760], [1100, 520, 520]]} o={0.46} />
      <Dust t={t} seed={103} x0={300} y0={200} w={800} h={600} n={18} o={0.5} />
    </g>
  );
};

// ---------- D24: "tự viết chữ, để khỏi quên.": macro, her careful pencil letters a ă â b c d / e ê g h i, the cat beside ----------
const L1 = ['a', 'ă', 'â', 'b', 'c', 'd'];
const L2 = ['e', 'ê', 'g', 'h', 'i'];
export const D24: React.FC<ShotProps> = ({ t }) => {
  const len = 82; // this shot's own length (the chapter preview stretches the last shot)
  const x0 = 330;
  const dx = 230;
  const start = 6;
  const step = 9.5;
  const tipX = tipAt(t, x0, dx, start, step, L2.length) + 14;
  const done = t > start + step * L2.length;
  const lift = done ? easeOut(clamp((t - start - step * L2.length) / 8)) * 14 : 0;
  const tip = { x: tipX + Math.sin(t * 1.3) * (done ? 0 : 2), y: 740 - lift };
  const hand = { x: tip.x + 0.47 * 230, y: tip.y + 0.88 * 230 };
  const eyes = t < 40 ? 'open' : t < 64 ? 'half' : 'closed';
  return (
    <g transform={`translate(960 540) rotate(-2.5) scale(${kf(t, [[0, 1.0], [len, 1.1]])}) translate(${-kf(t, [[0, 960], [len, 880]])} ${-kf(t, [[0, 540], [len, 580]])})`}>
      <rect x={-500} y={-500} width={3000} height={900} fill="#1A1320" />
      <rect x={-500} y={300} width={3000} height={1300} fill="#5A3F37" />
      <rect x={-500} y={300} width={3000} height={5} fill="#FFC98A" opacity={0.45} />
      <Glow x={1450} y={240} r={420} o={0.25} />
      <g filter="url(#blur3)"><GreyCat x={1430} y={306} s={2.1} t={t} eyes={eyes} /></g>
      <Candle x={330} y={306} s={2.1} t={t} seed={3} glow={1} />
      <RuledPage x0={100} y0={330} w={1760} h={900} gap={200} first={210} />
      <PencilLetters t={t} id="d24a" text={L1} x0={x0} y={540} dx={dx} start={-200} step={1} />
      <PencilLetters t={t} id="d24b" text={L2} x0={x0} y={740} dx={dx} start={start} step={step} />
      <Pencil x={tip.x} y={tip.y} len={340} ang={62} />
      <LookArm look={SIS} x={hand.x} y={hand.y} fx={hand.x + 300} fy={hand.y + 700} rot={20} s={4.2} width={118} fist />
      <LightVeil id="d24veil" lights={[[330, 330, 760], [tip.x, 700, 420]]} o={0.4} />
      <Glow x={330} y={250} r={620} o={0.4} />
      <Dust t={t} seed={104} x0={300} y0={300} w={1200} h={600} n={20} o={0.4} />
    </g>
  );
};
