import React from 'react';
import { Street, Glow, Dust, rnd, clamp, easeInOut, FONT, backOut, LOOKS } from '../../engine';

// CHAPTER F local pieces for the morning after: the dawn street with a wet shine, birds, the side-view high-five
// hands, and the end card's question text (screen space, bottom-right third kept clear for YouTube end-screen).
//   <DawnStreet t id low? blur? />       the VN street at dawn, warm wash, puddle glints (the street's own camera is fixed)
//   <Birds t n? seed? y0? />             small birds crossing the sky
//   <HighFiveHands t id gap0? touchAt? />  two open hands in profile, palms meeting very softly at `touchAt`
//   <QuestionCard t line1At line2At />   "BẠN SẼ ĐẤM THỨ GÌ ĐẦU TIÊN?" + "Viết ở phần bình luận"

export const DawnStreet: React.FC<{ t: number; id: string; low?: number; blur?: number; shine?: number }> = ({ t, id, low = 0, blur = 0, shine = 1 }) => (
  <g>
    <g filter={blur ? `url(#blur${blur})` : undefined}>
      <Street t={t} id={id} market={0.25} veil={0.2} low={low} />
      <rect x={-400} y={-300} width={2720} height={1700} fill="#FFB890" opacity={0.16} style={{ mixBlendMode: 'screen' }} />
      {/* the wet road throwing the low sun back: soft gold streaks and twinkles under the sun's column */}
      {Array.from({ length: 26 }).map((_, i) => {
        const y = 610 + low + rnd(2, i) * 330;
        const x = 960 + (rnd(3, i) - 0.5) * (240 + (y - 600) * 1.5);
        const tw = 0.45 + 0.55 * Math.sin(t * 0.12 + i * 2.1) ** 2;
        return <ellipse key={i} cx={x} cy={y} rx={20 + (y - 600) * 0.16 + rnd(4, i) * 30} ry={2 + (y - 600) * 0.012} fill="#FFE7B0" opacity={0.55 * tw * shine} style={{ mixBlendMode: 'screen' }} />;
      })}
    </g>
    <Glow x={960} y={470 + low} r={680} o={0.2} />
    <Dust t={t} seed={7} x0={300} y0={200} w={1300} h={700} n={26} o={0.45} />
  </g>
);

export const Birds: React.FC<{ t: number; n?: number; seed?: number; y0?: number; speed?: number }> = ({ t, n = 6, seed = 5, y0 = 180, speed = 2.2 }) => (
  <g stroke="#1A1630" strokeWidth={5} strokeLinecap="round" fill="none">
    {Array.from({ length: n }).map((_, i) => {
      const x = ((rnd(seed, i) * 2200 + t * speed * (0.8 + rnd(seed + 1, i) * 0.6)) % 2300) - 200;
      const y = y0 + rnd(seed + 2, i) * 220 + Math.sin(t * 0.07 + i) * 18;
      const fl = Math.sin(t * 0.5 + i * 1.7) * 14;
      const s = 0.8 + rnd(seed + 3, i) * 0.9;
      return <path key={i} d={`M ${x - 22 * s} ${y - fl * s} Q ${x - 8 * s} ${y - 6 * s} ${x} ${y} Q ${x + 8 * s} ${y - 6 * s} ${x + 22 * s} ${y - fl * s}`} />;
    })}
  </g>
);

const LINE = '#121019';
const PIP = LOOKS.pipHood;
const SIS = LOOKS.sis;

/** One hand in profile pointing up, its palm on the x = 0 edge and the body toward -x; sleeve rising off the bottom. */
const SideHand: React.FC<{ look: typeof PIP; lean?: number }> = ({ look, lean = 0 }) => (
  <g>
    <path d={`M ${-150 - lean} 760 L -120 40 L -10 40 L ${30 - lean} 760 Z`} fill={look.limb} stroke={LINE} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-132} y={-8} width={130} height={70} rx={20} fill={look.accent} stroke={LINE} strokeWidth={7} />
    <rect x={-112} y={-176} width={108} height={190} rx={34} fill={look.hand} stroke={LINE} strokeWidth={8} />
    <rect x={-102} y={-330} width={96} height={190} rx={44} fill={look.hand} stroke={LINE} strokeWidth={8} />
    <path d="M -100 -250 H -8 M -100 -200 H -8" stroke={LINE} strokeWidth={4} opacity={0.35} strokeLinecap="round" />
    <path d="M -96 -300 Q -60 -318 -20 -300" stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={0.5} strokeLinecap="round" />
    <ellipse cx={-130} cy={-78} rx={26} ry={62} transform="rotate(26 -130 -78)" fill={look.hand} stroke={LINE} strokeWidth={8} />
  </g>
);

/** Two hands from either side (Pip's big, hers small and teal-sleeved), meeting palm to palm at `touchAt`, no impact. */
export const HighFiveHands: React.FC<{ t: number; gap0?: number; touchAt?: number; cy?: number }> = ({ t, gap0 = 380, touchAt = 20, cy = 640 }) => {
  const p = easeInOut(clamp(t / touchAt));
  // he closes the last bit slowly: a soft approach with a tiny hover before contact
  const gap = gap0 * (1 - p) * (1 - p * 0.0);
  const touched = t >= touchAt;
  const k = clamp((t - touchAt) / 22);
  return (
    <g>
      <g transform={`translate(${960 - gap} ${cy + 40}) scale(1.35)`}><SideHand look={PIP} lean={260} /></g>
      <g transform={`translate(${960 + gap} ${cy + 70}) scale(-1.1 1.1)`}><SideHand look={SIS} lean={300} /></g>
      {touched ? (
        <g opacity={1 - k}>
          <circle cx={960} cy={cy - 120} r={30 + 120 * k} fill="none" stroke="#FFF3C4" strokeWidth={6 * (1 - k)} />
          <circle cx={960} cy={cy - 120} r={14 + 60 * k} fill="none" stroke="#FFFFFF" strokeWidth={4 * (1 - k)} />
        </g>
      ) : null}
    </g>
  );
};

/** End card text on the screen. Line 1 (two rows) pops at `line1At`, line 2 at `line2At`. Everything stays above y 700. */
export const QuestionCard: React.FC<{ t: number; line1At: number; line2At: number }> = ({ t, line1At, line2At }) => {
  const p1 = backOut(clamp((t - line1At) / 9));
  const p2 = backOut(clamp((t - line2At) / 9));
  const st = { fontFamily: FONT.title, fontWeight: 800, paintOrder: 'stroke' as const, stroke: '#1A1230', strokeLinejoin: 'round' as const };
  return (
    <g>
      <rect x={0} y={0} width={1920} height={690} fill="#1A1230" opacity={0.28 * Math.min(1, p1)} />
      {p1 > 0 ? (
        <g transform={`translate(960 232) scale(${p1})`} textAnchor="middle">
          <text y={0} fontSize={132} fill="#F6EFE3" strokeWidth={16} {...{ style: st }}>BẠN SẼ <tspan fill="#FFD84A">ĐẤM</tspan> THỨ GÌ</text>
          <text y={150} fontSize={150} fill="#FFD84A" strokeWidth={18} {...{ style: st }}>ĐẦU TIÊN?</text>
        </g>
      ) : null}
      {p2 > 0 ? (
        <g transform={`translate(960 500) scale(${p2})`} textAnchor="middle">
          <text fontFamily={FONT.hand} fontSize={86} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke" strokeLinejoin="round">Viết ở phần bình luận</text>
        </g>
      ) : null}
    </g>
  );
};
