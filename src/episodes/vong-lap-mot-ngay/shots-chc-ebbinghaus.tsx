import React from 'react';
import { kf, clamp, easeOut, easeInOut, camT, faceAt, poseAt, toWorld, joints, ShotProps, Glow, Hero, LOOKS, Look, Pose, basePose, Schematic, SchLabel, SCH, FONT, Dust } from '../../engine';
import { HeadOverlay } from './kit-cast-figures';
import { FactStamp } from '../dai-duong-can/kit-hud';
import { PAL } from './kit-palette';
import { OldPhoto, ScholarBits, SyllableCard, ChartAxes, chartXY, curveD, ebb, spacedR, SPACED, CurveDraw, Pop, SchGround, PipHeadIcon } from './chc-forgetting-props';

// Chapter C, beat "4 forgetting" part 2 (128.06-138.87 s): C7 an 1885 photograph of a German psychologist testing
// himself on nonsense syllables, C8 his forgetting curve (~2/3 gone after a day), C9 spaced reviews, each curve flatter,
// the gaps wider (tracking), C10 the whole review chart wide + "ĐÓ LÀ THẬT".

const SCHOLAR: Look = { ...LOOKS.suit, jacket: '#2E2A26', jacketShade: '#24201C', accent: '#3A3430', limb: '#2E2A26', hair: '#8E8A90', skin: '#E6D2B8', skinShade: '#CDB89C', hand: '#E6D2B8' };
const SYL = ['DAX', 'BOK', 'YAT', 'GUF'];

// ---------- C7: an old sepia photograph: the bearded scientist at his desk, flipping syllable cards, pocket watch ----------
export const C7: React.FC<ShotProps> = ({ t, len }) => {
  const flip = Math.floor(t / 18);
  const lift = (t % 18) / 18;
  const pose: Pose = poseAt(t, [
    { f: 0, p: { ...basePose, x: 930, y: 760, scale: 1.55, yaw: 0.45, facing: 1, look: 0.7, headTilt: -4, armR: { a: 118, b: -38 }, armL: { a: 30, b: 40 } } },
    { f: 40, p: { headTilt: 2 } },
    { f: len, p: { headTilt: -2 } },
  ]);
  const hand = toWorld(pose, joints(pose).armR.end);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.07]]))}>
      <OldPhoto t={t} id="c7p">
        {/* the study: panelled wall, bookcase, a window with a pale sky, the desk */}
        <rect x={330} y={130} width={1260} height={800} fill="#6E6258" />
        <rect x={330} y={640} width={1260} height={290} fill="#4A3E36" />
        <rect x={1240} y={190} width={260} height={300} fill="#C9C2B4" stroke="#2E2620" strokeWidth={12} />
        <path d="M 1370 190 V 490 M 1240 340 H 1500" stroke="#2E2620" strokeWidth={8} />
        <rect x={390} y={170} width={300} height={470} fill="#3A2E26" />
        {[0, 1, 2, 3].map((r) => Array.from({ length: 9 }).map((_, k) => <rect key={`${r}${k}`} x={404 + k * 31} y={186 + r * 116 + (k % 3) * 8} width={24} height={92 - (k % 3) * 8} fill={['#7A5A44', '#5A4A3A', '#8A7A62'][k % 3]} />))}
        <Hero look={SCHOLAR} pose={{ ...pose, ...faceAt(t, [[0, 'neutral']]) }} rimId="rimL" shadow={0} />
        <HeadOverlay pose={pose} rimId="rimL"><ScholarBits yaw={pose.yaw} /></HeadOverlay>
        <SyllableCard x={hand.x + 30} y={hand.y - 30 - lift * 10} text={SYL[flip % 4]} rot={-8 + lift * 4} s={0.95} />
        {/* the desk front, a stack of cards, the pocket watch, the oil lamp */}
        <rect x={420} y={740} width={1100} height={36} fill="#5A4636" />
        <rect x={440} y={776} width={1060} height={160} fill="#3E3028" />
        {[0, 1, 2, 3].map((k) => <SyllableCard key={k} x={760 + k * 4} y={720 - k * 8} text={k === 3 ? SYL[(flip + 1) % 4] : ''} s={0.8} />)}
        <g transform="translate(1180 714)">
          <circle r={44} fill="#C9A44A" stroke="#2E2620" strokeWidth={6} />
          <circle r={34} fill="#F1E7CF" />
          <path d={`M 0 0 L ${Math.sin(t / 6) * 26} ${-Math.cos(t / 6) * 26}`} stroke="#2E2620" strokeWidth={5} strokeLinecap="round" />
          <path d="M 0 0 L 0 -18" stroke="#2E2620" strokeWidth={6} />
          <rect x={-8} y={-58} width={16} height={14} rx={4} fill="#C9A44A" />
        </g>
        <g transform="translate(560 740)">
          <ellipse cx={0} cy={-10} rx={42} ry={14} fill="#6A5236" />
          <path d="M -26 -14 Q -40 -90 0 -120 Q 40 -90 26 -14 Z" fill="#E8DCC0" opacity={0.75} stroke="#2E2620" strokeWidth={4} />
          <path d="M 0 -50 q -8 -14 0 -30 q 8 16 0 30" fill="#FFE2A0" />
        </g>
        <Glow x={560} y={660} r={300} o={0.5 + 0.05 * Math.sin(t / 3)} />
        <Dust t={t} seed={71} x0={420} y0={200} w={900} h={500} n={16} o={0.4} />
      </OldPhoto>
      {/* the caption tag pinned on the corner */}
      <g transform="translate(1440 930) rotate(4)">
        <rect x={-170} y={-46} width={340} height={92} rx={8} fill="#F4EEDF" stroke="#3A2E22" strokeWidth={4} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={46} fill="#3A2E22" letterSpacing={3}>ĐỨC · 1885</text>
        <circle cx={0} cy={-46} r={10} fill="#B8483E" />
      </g>
    </g>
  );
};

const C8C = { x0: 380, y0: 840, w: 1180, h: 540, days: 6 };

// ---------- C8: the forgetting curve: 100% -> ~34% after one day; the lost two thirds marked in red ----------
export const C8: React.FC<ShotProps> = ({ t, len }) => {
  const c = C8C;
  const d1 = chartXY(c, 1, 34);
  const top = chartXY(c, 1, 100);
  const lost = easeOut(clamp((t - 44) / 12));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 900]]), kf(t, [[0, 540], [len, 560]]), kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Schematic t={t} id="c8s" />
      <ChartAxes c={c} t={t} ticks={[0, 1, 2, 3, 4, 5, 6]} />
      {/* the lost share at day 1 */}
      <rect x={d1.x - 40} y={top.y} width={80} height={(d1.y - top.y) * lost} fill="#FF5A48" opacity={0.28} />
      <path d={`M ${d1.x + 56} ${top.y} l 14 0 l 0 ${(d1.y - top.y) * lost} l -14 0`} stroke="#FF6A5A" strokeWidth={6} fill="none" opacity={lost} />
      <CurveDraw d={curveD(c, ebb, 0, 6, 120)} t={t - 8} dur={30} />
      <Pop t={t - 40} x={d1.x} y={d1.y}>
        <circle r={16} fill={SCH.live} style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }} />
      </Pop>
      <Pop t={t - 40} x={d1.x + 120} y={d1.y + 100}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={52} fill={SCH.live}>~1/3</text>
      </Pop>
      <SchLabel x={960} y={200} t={t - 54} text="SAU 1 NGÀY: QUÊN ~2/3" size={70} color="#FF8A7A" />
      <SchLabel x={1600} y={120} t={t - 2} text="1885" size={40} color={SCH.dim} />
    </g>
  );
};

const C9C = { x0: 240, y0: 860, w: 2900, h: 560, days: 14 };
const REVIEWS = SPACED.slice(1);

/** The spaced chart drawn up to day `dTip`, with review tags, gap labels and the faint no-review curve. */
const SpacedChart: React.FC<{ t: number; dTip: number; tags: number }> = ({ t, dTip, tags }) => {
  const c = C9C;
  const tip = chartXY(c, dTip, spacedR(dTip));
  return (
    <g>
      <ChartAxes c={c} t={t + 8} ticks={[0, 1, 3, 7, 14]} />
      <path d={curveD(c, ebb, 0, 14, 160)} stroke={SCH.dim} strokeWidth={5} strokeDasharray="14 12" fill="none" opacity={0.55} />
      <g style={{ filter: `drop-shadow(0 0 12px ${PAL.cyan}aa)` }}>
        <path d={curveD(c, spacedR, 0, Math.max(0.001, dTip), 260)} stroke={PAL.cyan} strokeWidth={9} fill="none" strokeLinejoin="round" />
      </g>
      <PipHeadIcon x={tip.x} y={tip.y - 6} s={1.1} t={t} />
      {REVIEWS.map((r, i) => {
        const at = chartXY(c, r.d, 100);
        const prev = chartXY(c, SPACED[i].d, 0);
        const on = dTip >= r.d;
        const k = on ? easeOut(clamp(tags)) : 0;
        return (
          <g key={i} opacity={on ? 1 : 0}>
            <g transform={`translate(${at.x} ${at.y - 50}) scale(${0.6 + 0.4 * k})`}>
              <rect x={-60} y={-38} width={120} height={64} rx={32} fill={PAL.cyan} opacity={0.9} />
              <text x={0} y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#0E2030">ÔN</text>
            </g>
            {/* the gap since the last review, under the axis */}
            <path d={`M ${prev.x + 10} ${c.y0 + 100} L ${at.x - 10} ${c.y0 + 100}`} stroke={SCH.glow} strokeWidth={5} />
            <path d={`M ${at.x - 26} ${c.y0 + 88} L ${at.x - 10} ${c.y0 + 100} L ${at.x - 26} ${c.y0 + 112}`} stroke={SCH.glow} strokeWidth={5} fill="none" />
            <text x={(prev.x + at.x) / 2} y={c.y0 + 150} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={40} fill={SCH.glow}>{`+${r.d - SPACED[i].d} NGÀY`}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- C9: tracking along the review curve: each ÔN snaps it back to 100%, it sinks slower, the gaps widen ----------
export const C9: React.FC<ShotProps> = ({ t, len }) => {
  const dTip = 14 * easeInOut(clamp((t - 4) / (len - 14)));
  const tip = chartXY(C9C, dTip, spacedR(dTip));
  const cx = clamp(tip.x - 100, 960, 2200);
  return (
    <g transform={camT(cx, 600, 1.05)}>
      <SchGround id="c9g" t={t} x0={-400} x1={3800} />
      <Glow x={tip.x} y={tip.y} r={420} kind="cool" o={0.3} />
      <SpacedChart t={t} dTip={dTip} tags={1} />
    </g>
  );
};

// ---------- C10: wide: the whole review chart, and the stamp lands on "Đó là thật" ----------
export const C10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1700, 560, kf(t, [[0, 0.6], [len, 0.63]]))}>
      <SchGround id="c10g" t={t} x0={-1200} x1={4600} />
      <SpacedChart t={t + 30} dTip={14} tags={1} />
    </g>
    <FactStamp t={t} at={2} x={960} y={850} />
  </g>
);
