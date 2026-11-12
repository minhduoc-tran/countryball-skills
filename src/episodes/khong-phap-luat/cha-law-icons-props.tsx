import React from 'react';
import { rnd, clamp, easeOut, Glow, Bokeh, FONT } from '../../engine';

// Chapter A local props for the "no law" insert shots (drawn flat, 1920 x 1080 world): a law book, road signs, an empty
// police booth, a closed courthouse, a contract, a backdrop, and DustSweep (a thing crumbling into dust left to right).

const INK = '#14101C';

/** A dusk-violet backdrop with a warm pool of light and slow bokeh: the ground the icon inserts sit on. */
export const IconBackdrop: React.FC<{ t: number; night?: boolean; id: string }> = ({ t, night = false, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={night ? '#0E1230' : '#2A1C44'} />
        <stop offset="1" stopColor={night ? '#1C2450' : '#5A3A5E'} />
      </linearGradient>
    </defs>
    <rect x={-200} y={-200} width={2320} height={1480} fill={`url(#${id}bg)`} />
    <Bokeh seed={4} n={9} x0={0} y0={80} w={1920} h={600} t={t} o={night ? 0.25 : 0.4} />
    <Glow x={960} y={520} r={760} kind={night ? 'cool' : 'warm'} o={night ? 0.35 : 0.45} />
  </g>
);

/**
 * A thing crumbling to dust from its left edge to its right: `p` 0..1, `box` the thing's bounds. Children are clipped
 * to the part not yet gone; specks leave the edge and drift up and away, glowing in `color`.
 */
export const DustSweep: React.FC<{ id: string; p: number; box: { x0: number; x1: number; y0: number; y1: number }; color?: string; children: React.ReactNode; n?: number; rise?: number }> = ({
  id, p, box, color = '#F6E6C0', children, n = 70, rise = 260,
}) => {
  const w = box.x1 - box.x0;
  const h = box.y1 - box.y0;
  const edge = box.x0 + w * clamp(p / 0.75) * 1.02;
  return (
    <g>
      <clipPath id={`${id}clip`}><rect x={edge} y={box.y0 - 400} width={w + 800} height={h + 800} /></clipPath>
      <g clipPath={`url(#${id}clip)`}>{children}</g>
      {Array.from({ length: n }).map((_, i) => {
        const fx = rnd(id.length + 3, i);
        const e = fx * 0.75;
        const age = clamp((p - e) / 0.3);
        if (age <= 0 || age >= 1) return null;
        const x = box.x0 + w * fx + age * (40 + 120 * rnd(5, i)) + Math.sin(age * 9 + i) * 14;
        const y = box.y0 + h * rnd(7, i) - age * rise * (0.4 + rnd(9, i));
        const r = 3.5 + 7 * rnd(11, i);
        return <rect key={i} x={x - r} y={y - r} width={r * 2} height={r * 2} rx={r * 0.4} fill={color} opacity={0.95 * (1 - age)} transform={`rotate(${age * 160 * (i % 2 ? 1 : -1)} ${x} ${y})`} />;
      })}
    </g>
  );
};

/** A law book standing open-faced to the camera: leather cover, gold band, "LUẬT" and a ribbon. 520 wide at s = 1. */
export const LawBook: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={300} ry={26} fill="#000" opacity={0.4} />
    <rect x={-260} y={-420} width={520} height={420} rx={14} fill="#7A2E3A" stroke={INK} strokeWidth={6} />
    <rect x={-260} y={-420} width={46} height={420} rx={10} fill="#5A1E2A" />
    <rect x={-190} y={-370} width={410} height={320} rx={8} fill="none" stroke="#E9C46A" strokeWidth={6} />
    <rect x={-170} y={-350} width={370} height={280} rx={5} fill="none" stroke="#E9C46A" strokeWidth={2.5} opacity={0.7} />
    <text x={15} y={-195} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={116} fill="#E9C46A" stroke="#4A1620" strokeWidth={3} paintOrder="stroke" letterSpacing={6}>LUẬT</text>
    <g transform="translate(15 -118)" stroke="#E9C46A" strokeWidth={5} fill="none" strokeLinecap="round">
      <path d="M 0 -26 L 0 20 M -34 -10 L 34 -10 M -34 -10 L -46 14 L -22 14 Z M 34 -10 L 22 14 L 46 14 Z M -18 24 L 18 24" />
    </g>
    <path d="M 140 0 L 140 56 L 160 42 L 180 56 L 180 0 Z" fill="#E9C46A" stroke={INK} strokeWidth={3} />
    <path d="M -246 -410 L -246 -10" stroke="#FFFFFF" strokeWidth={4} opacity={0.18} />
    <rect x={-250} y={-30} width={500} height={26} fill="#F2E8D0" stroke={INK} strokeWidth={3} />
  </g>
);

export type SignKind = 'noPark' | 'speed' | 'noEntry' | 'noLeft' | 'noHorn';
/** A round traffic sign face centred on (0, 0), radius r (drawn at (x, y) with scale s). */
export const RoadSign: React.FC<{ kind: SignKind; x: number; y: number; r?: number; s?: number; rot?: number }> = ({ kind, x, y, r = 60, s = 1, rot = 0 }) => {
  const RED = '#D8323C';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <circle r={r + 5} fill={INK} />
      {kind === 'noEntry' ? <circle r={r} fill={RED} /> : <circle r={r} fill={kind === 'noPark' ? '#2F6FB8' : '#F6F1E3'} />}
      {kind === 'noEntry' ? <rect x={-r * 0.62} y={-r * 0.14} width={r * 1.24} height={r * 0.28} fill="#F6F1E3" /> : null}
      {kind === 'noPark' ? <circle r={r - 10} fill="none" stroke={RED} strokeWidth={r * 0.17} /> : null}
      {kind === 'noPark' ? <path d={`M ${-r * 0.62} ${r * 0.62} L ${r * 0.62} ${-r * 0.62}`} stroke={RED} strokeWidth={r * 0.17} strokeLinecap="round" /> : null}
      {kind === 'speed' ? <circle r={r - 7} fill="none" stroke={RED} strokeWidth={r * 0.2} /> : null}
      {kind === 'speed' ? <text y={r * 0.26} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={r * 0.78} fill={INK}>40</text> : null}
      {kind === 'noLeft' ? <circle r={r - 7} fill="none" stroke={RED} strokeWidth={r * 0.18} /> : null}
      {kind === 'noLeft' ? <path d={`M ${r * 0.3} ${r * 0.45} L ${r * 0.3} ${-r * 0.1} Q ${r * 0.3} ${-r * 0.4} ${-r * 0.1} ${-r * 0.4} L ${-r * 0.35} ${-r * 0.4} M ${-r * 0.2} ${-r * 0.6} L ${-r * 0.45} ${-r * 0.4} L ${-r * 0.2} ${-r * 0.2}`} stroke={INK} strokeWidth={r * 0.14} fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
      {kind === 'noLeft' ? <path d={`M ${-r * 0.58} ${-r * 0.58} L ${r * 0.58} ${r * 0.58}`} stroke={RED} strokeWidth={r * 0.15} strokeLinecap="round" /> : null}
      {kind === 'noHorn' ? <circle r={r - 7} fill="none" stroke={RED} strokeWidth={r * 0.18} /> : null}
      {kind === 'noHorn' ? <path d={`M ${-r * 0.45} ${-r * 0.1} L ${-r * 0.2} ${-r * 0.1} L ${r * 0.18} ${-r * 0.42} L ${r * 0.18} ${r * 0.42} L ${-r * 0.2} ${r * 0.1} L ${-r * 0.45} ${r * 0.1} Z`} fill={INK} /> : null}
      {kind === 'noHorn' ? <path d={`M ${-r * 0.58} ${r * 0.58} L ${r * 0.58} ${-r * 0.58}`} stroke={RED} strokeWidth={r * 0.15} strokeLinecap="round" /> : null}
      <path d={`M ${-r * 0.7} ${-r * 0.5} A ${r * 0.85} ${r * 0.85} 0 0 1 ${-r * 0.1} ${-r * 0.84}`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.35} strokeLinecap="round" />
    </g>
  );
};

/** A sign on a grey pole (pole bottom at (x, y)); `h` the pole height. */
export const SignPole: React.FC<{ x: number; y: number; kind: SignKind; h?: number; r?: number }> = ({ x, y, kind, h = 520, r = 78 }) => (
  <g>
    <ellipse cx={x} cy={y + 4} rx={40} ry={9} fill="#000" opacity={0.4} />
    <rect x={x - 9} y={y - h} width={18} height={h} fill="#8E8CA0" stroke={INK} strokeWidth={4} />
    <rect x={x - 3} y={y - h} width={5} height={h} fill="#FFFFFF" opacity={0.25} />
    <RoadSign kind={kind} x={x} y={y - h - r + 20} r={r} />
  </g>
);

/** A traffic police booth: a small kiosk with a glass front, an empty chair, a cap left on the desk. 560 wide at s = 1. */
export const PoliceBooth: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={320} ry={24} fill="#000" opacity={0.4} />
    <rect x={-250} y={-60} width={500} height={60} fill="#B9B2A8" stroke={INK} strokeWidth={5} />
    <rect x={-230} y={-440} width={460} height={380} fill="#E9E2D0" stroke={INK} strokeWidth={5} />
    <rect x={-230} y={-440} width={460} height={64} fill="#4A8C5A" />
    <path d="M -290 -440 L 290 -440 L 250 -520 L -250 -520 Z" fill="#2F6A48" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-190} y={-390} width={380} height={290} rx={6} fill="#3A4A62" stroke={INK} strokeWidth={5} />
    <rect x={-176} y={-376} width={352} height={262} fill="#1E2840" />
    <g transform="translate(-30 -112)">
      <rect x={-6} y={-60} width={12} height={60} fill="#5A4A3A" />
      <rect x={-70} y={-130} width={14} height={110} fill="#5A4A3A" rx={4} />
      <rect x={-70} y={-60} width={90} height={14} fill="#6A5846" rx={4} />
      <rect x={-52} y={-46} width={10} height={46} fill="#5A4A3A" />
      <rect x={4} y={-46} width={10} height={46} fill="#5A4A3A" />
    </g>
    <rect x={40} y={-190} width={130} height={14} rx={3} fill="#6A5846" />
    <path d="M 60 -190 L 60 -206 Q 100 -226 144 -206 L 144 -190 Z" fill="#2F4A8A" stroke={INK} strokeWidth={3} />
    <circle cx={102} cy={-205} r={7} fill="#F2C94C" />
    <path d="M -176 -376 L -60 -230 L -176 -230 Z" fill="#FFFFFF" opacity={0.07} />
    <circle cx={0} cy={-408} r={30} fill="#D8323C" stroke={INK} strokeWidth={4} />
    <path d="M 0 -426 L 6 -412 L 21 -412 L 9 -402 L 14 -388 L 0 -397 L -14 -388 L -9 -402 L -21 -412 L -6 -412 Z" fill="#F2C94C" />
    <g transform={`translate(${((t * 3.2) % 700) - 100} ${-30 + Math.sin(t / 8) * 8}) rotate(${t * 6})`}>
      <path d="M 0 0 Q 10 -14 22 0 Q 10 14 0 0 Z" fill="#B8683A" />
    </g>
  </g>
);

/** A courthouse facade: steps, four columns, a pediment with the scales, shut double doors and the empty gavel block. */
export const Courthouse: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={560} ry={30} fill="#000" opacity={0.4} />
    {[0, 1, 2].map((i) => <rect key={i} x={-520 + i * 30} y={-60 + i * 20 - 20} width={1040 - i * 60} height={26} fill={['#CFC8BC', '#BEB7AB', '#ADA79B'][i]} stroke={INK} strokeWidth={4} transform={`translate(0 ${60 - i * 20})`} />)}
    <rect x={-440} y={-520} width={880} height={430} fill="#DAD3C4" stroke={INK} strokeWidth={5} />
    {[-360, -170, 170, 360].map((cx) => (
      <g key={cx}>
        <rect x={cx - 32} y={-500} width={64} height={398} fill="#F1EBDD" stroke={INK} strokeWidth={4} />
        <rect x={cx - 32} y={-500} width={18} height={398} fill="#FFFFFF" opacity={0.5} />
        <rect x={cx - 46} y={-516} width={92} height={22} fill="#F1EBDD" stroke={INK} strokeWidth={4} />
        <rect x={cx - 46} y={-108} width={92} height={22} fill="#F1EBDD" stroke={INK} strokeWidth={4} />
      </g>
    ))}
    <path d="M -480 -520 L 0 -690 L 480 -520 Z" fill="#E7E0D0" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -380 -534 L 0 -660 L 380 -534" stroke={INK} strokeWidth={3} fill="none" opacity={0.4} />
    <g transform="translate(0 -580)" stroke="#8A6A2A" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 0 -50 L 0 40 M -60 -24 L 60 -24 M -60 -24 L -80 14 L -40 14 Z M 60 -24 L 40 14 L 80 14 Z M -30 44 L 30 44" />
    </g>
    <rect x={-90} y={-350} width={180} height={260} fill="#4A3426" stroke={INK} strokeWidth={5} />
    <path d="M 0 -350 L 0 -90" stroke={INK} strokeWidth={5} />
    <rect x={-80} y={-340} width={72} height={116} fill="none" stroke="#2E1E14" strokeWidth={4} /><rect x={8} y={-340} width={72} height={116} fill="none" stroke="#2E1E14" strokeWidth={4} />
    <rect x={-100} y={-250} width={200} height={20} fill="#6E6C7C" stroke={INK} strokeWidth={4} />
    <rect x={-22} y={-262} width={44} height={44} rx={6} fill="#B9B2A8" stroke={INK} strokeWidth={4} />
  </g>
);

/** A bare gavel block (a round wooden pad) with a pale ring where the gavel used to sit. */
export const GavelBlock: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={120} ry={20} fill="#000" opacity={0.4} />
    <rect x={-110} y={-30} width={220} height={36} rx={10} fill="#8A5A3A" stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={-30} rx={110} ry={20} fill="#B98C5E" stroke={INK} strokeWidth={5} />
    <ellipse cx={0} cy={-31} rx={60} ry={10} fill="none" stroke="#6A4328" strokeWidth={4} strokeDasharray="10 9" opacity={0.7 + 0.2 * Math.sin(t / 6)} />
  </g>
);

/** A contract sheet (about 560 x 760 at s = 1): title, `fade` 0..1 blanks its lines one by one (top first), then the stamp. */
export const ContractSheet: React.FC<{ x: number; y: number; s?: number; fade: number; rot?: number }> = ({ x, y, s = 1, fade, rot = 0 }) => {
  const lines = 11;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-270} y={-370} width={560} height={760} rx={6} fill="#000" opacity={0.3} />
      <rect x={-280} y={-380} width={560} height={760} rx={6} fill="#F6F1E3" stroke={INK} strokeWidth={5} />
      <rect x={-200} y={-330} width={400} height={30} rx={6} fill="#2F4A8A" opacity={1 - clamp(fade * 8)} />
      {Array.from({ length: lines }).map((_, i) => {
        const o = 1 - clamp((fade * (lines + 2) - i) / 2);
        const wdt = i % 4 === 3 ? 260 : 420;
        return <rect key={i} x={-220} y={-260 + i * 36} width={wdt} height={12} rx={6} fill="#3A3446" opacity={0.75 * o} />;
      })}
      <path d="M -220 270 q 30 -70 60 0 t 70 -10 t 60 20 t 70 -30" stroke="#2F4A8A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={1 - clamp((fade - 0.55) * 4)} />
      <circle cx={170} cy={250} r={54} fill="none" stroke="#C8323C" strokeWidth={8} opacity={0.85 * (1 - clamp((fade - 0.7) * 4))} />
      <path d="M 140 250 L 200 250 M 170 220 L 170 280" stroke="#C8323C" strokeWidth={6} opacity={0.85 * (1 - clamp((fade - 0.7) * 4))} />
    </g>
  );
};

/** A ring-and-specks burst where a sign pops away; k = frames since it popped (negative: not yet). */
export const PopRing: React.FC<{ x: number; y: number; k: number; color?: string }> = ({ x, y, k, color = '#FFE7B3' }) => (k < 0 || k > 10 ? null : (
  <g>
    <circle cx={x} cy={y} r={30 + easeOut(k / 10) * 90} fill="none" stroke={color} strokeWidth={8 * (1 - k / 10)} opacity={0.9 * (1 - k / 10)} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2 + 0.3;
      const d = 40 + easeOut(k / 10) * 110;
      return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={7 * (1 - k / 10)} fill={color} />;
    })}
  </g>
));
