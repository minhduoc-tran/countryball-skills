import React from 'react';
import { SCH, clamp, easeOut, backOut } from '../../engine';

// Chapter B props (1/5): the child-health beat. Line icons on the schematic (lungs, droplet, mosquito) and the real
// things of the new world (blister pack of medicine, birthday cake with 5 candles, an empty chair). All pure functions of
// the frame counters they get; dignity first: no suffering shown, only objects and absences.

const LIVE = SCH.live;
const LINE = SCH.line;
const glow = { filter: `drop-shadow(0 0 14px ${SCH.glow}99)` } as const;

/** Pops an icon in about (x, y) with an overshoot; visible from its first frame (a cut never lands on empty). */
export const IconPop: React.FC<{ x: number; y: number; s?: number; t: number; rot?: number; children: React.ReactNode }> = ({ x, y, s = 1, t, rot = 0, children }) => {
  const k = 0.55 + 0.45 * backOut(clamp((t + 2) / 8));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * k})`} stroke={LINE} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" style={glow}>
      {children}
    </g>
  );
};

/** Two lungs and the windpipe, about 220 x 230, centred; they breathe (and the orange fill pulses). */
export const LungsIcon: React.FC<{ t: number }> = ({ t }) => {
  const b = 1 + Math.sin(t / 4) * 0.035;
  const lobe = 'M -14 -46 C -72 -38 -100 24 -92 82 C -90 108 -52 110 -34 92 C -20 76 -14 30 -14 -46 Z';
  return (
    <g>
      <g transform={`scale(${b})`}>
        <path d={lobe} fill={`${LIVE}33`} stroke={LIVE} />
        <path d={lobe} fill={`${LIVE}33`} stroke={LIVE} transform="scale(-1 1)" />
        <path d="M -62 6 Q -50 36 -42 70 M 62 6 Q 50 36 42 70 M -70 40 L -48 48 M 70 40 L 48 48" strokeWidth={3.5} opacity={0.6} />
      </g>
      <path d="M 0 -104 V -34 M 0 -34 Q -6 -12 -34 8 M 0 -34 Q 6 -12 34 8" />
    </g>
  );
};

/** A water droplet with a highlight and two small drops dripping below. */
export const DropIcon: React.FC<{ t: number }> = ({ t }) => {
  const d = (((t * 0.045) % 1) + 1) % 1;
  return (
    <g>
      <path d="M 0 -96 Q 62 -8 56 30 A 56 56 0 0 1 -56 30 Q -62 -8 0 -96 Z" fill={`${LIVE}33`} stroke={LIVE} />
      <path d="M -28 34 Q -26 54 -10 62" strokeWidth={6} opacity={0.85} />
      {[0, 1].map((i) => {
        const p = (d + i * 0.5) % 1;
        return <path key={i} d="M 0 -14 Q 9 0 8 6 A 8 8 0 0 1 -8 6 Q -9 0 0 -14 Z" fill={LINE} stroke="none" opacity={0.8 * (1 - p)} transform={`translate(${i ? 74 : -78} ${70 + p * 56}) scale(0.8)`} />;
      })}
    </g>
  );
};

/** A mosquito from the side: wings that flap, six legs, the long proboscis pointing down-left. */
export const MosquitoIcon: React.FC<{ t: number }> = ({ t }) => {
  const fl = Math.sin(t * 1.5);
  return (
    <g>
      <g transform={`rotate(${fl * 8} -4 -16)`}>
        <ellipse cx={-46} cy={-46} rx={52} ry={14} fill={`${LINE}22`} transform="rotate(-14 -46 -46)" />
      </g>
      <g transform={`rotate(${fl * 11} 6 -16)`}>
        <ellipse cx={42} cy={-62} rx={58} ry={15} fill={`${LINE}22`} transform="rotate(-40 42 -62)" />
      </g>
      <ellipse cx={46} cy={14} rx={50} ry={17} fill={`${LIVE}33`} stroke={LIVE} transform="rotate(-18 46 14)" />
      <path d="M 52 8 L 78 -2 M 40 14 L 66 10" strokeWidth={3} opacity={0.6} />
      <circle cx={-6} cy={-6} r={21} fill={`${LIVE}33`} stroke={LIVE} />
      <circle cx={-34} cy={4} r={14} fill={`${LIVE}33`} stroke={LIVE} />
      <path d="M -44 12 L -100 62" stroke={LIVE} strokeWidth={6} />
      <path d="M 4 4 L 0 40 L -10 64 M -4 8 L -22 34 L -34 50 M 10 6 L 24 40 L 18 66" strokeWidth={3.5} />
    </g>
  );
};

/** The card's label under an icon: a short Vietnamese word in the mono face (pops with the icon). */
export const IconWord: React.FC<{ x: number; y: number; t: number; text: string; size?: number }> = ({ x, y, t, text, size = 70 }) => {
  const k = easeOut(clamp((t + 1) / 6));
  return (
    <text x={x} y={y + (1 - k) * 14} textAnchor="middle" fontFamily="'Space Mono', monospace" fontWeight={700} fontSize={size} fill={LINE} letterSpacing={3} opacity={k}>
      {text}
    </text>
  );
};

// ---------- the real things ----------
/** A blister pack of medicine (foil back with 2 x 4 capsules), about 260 x 170, centred. `popped` capsules are empty. */
export const Blister: React.FC<{ x: number; y: number; s?: number; rot?: number; popped?: number; shine?: number; id?: string }> = ({ x, y, s = 1, rot = 0, popped = 0, shine = 0, id = 'blk' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-132} y={-86} width={264} height={176} rx={16} fill="#000" opacity={0.28} transform="translate(8 12)" />
    <rect x={-130} y={-86} width={260} height={172} rx={16} fill="#C7CED8" stroke="#6C7584" strokeWidth={4} />
    <rect x={-130} y={-86} width={260} height={18} rx={9} fill="#FFFFFF" opacity={0.35} />
    {Array.from({ length: 8 }).map((_, i) => {
      const cx = -90 + (i % 4) * 60;
      const cy = -34 + Math.floor(i / 4) * 66;
      const gone = i < popped;
      return (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <ellipse cx={0} cy={0} rx={24} ry={28} fill={gone ? '#9AA3B1' : '#E8F2F4'} stroke="#6C7584" strokeWidth={3} />
          {gone ? null : <path d="M -10 -4 h 20" stroke="#E86A4A" strokeWidth={11} strokeLinecap="round" />}
          {gone ? null : <path d="M -10 -4 h 10" stroke="#F4F0E8" strokeWidth={11} strokeLinecap="round" />}
          <ellipse cx={-8} cy={-14} rx={5} ry={9} fill="#fff" opacity={0.7} />
        </g>
      );
    })}
    {shine > 0 ? (
      <g>
        <clipPath id={`${id}clip`}><rect x={-130} y={-86} width={260} height={172} rx={16} /></clipPath>
        <path clipPath={`url(#${id}clip)`} d={`M ${-170 + shine * 340} -86 l 26 0 l -40 172 l -26 0 Z`} fill="#fff" opacity={0.4} />
      </g>
    ) : null}
  </g>
);

/** A birthday cake with 5 candles. `blow` = frames since the blow began (-1 = not yet): flames lean one by one and go out. */
export const Cake: React.FC<{ x: number; y: number; s?: number; t: number; blow?: number }> = ({ x, y, s = 1, t, blow = -1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={250} ry={26} fill="#000" opacity={0.3} />
    <ellipse cx={0} cy={0} rx={236} ry={24} fill="#E9E4DA" stroke="#9A9486" strokeWidth={4} />
    <path d="M -180 -10 V -120 Q 0 -150 180 -120 V -10 Q 0 18 -180 -10 Z" fill="#F4E3C6" stroke="#B89C70" strokeWidth={4} />
    <path d="M -180 -120 Q 0 -150 180 -120 V -96 Q 150 -64 120 -96 Q 90 -62 60 -96 Q 30 -60 0 -96 Q -30 -62 -60 -96 Q -90 -60 -120 -96 Q -150 -62 -180 -96 Z" fill="#F08FA6" stroke="#C0607A" strokeWidth={4} />
    <path d="M -150 -50 H 150" stroke="#E8C98E" strokeWidth={8} strokeDasharray="2 26" strokeLinecap="round" />
    {[0, 1, 2, 3, 4].map((i) => {
      const cx = -112 + i * 56;
      const cy = -126 + Math.abs(i - 2) * 6;
      const k = blow < 0 ? 0 : clamp((blow - i * 2) / 5);
      const alive = k < 1;
      const fl = 1 + Math.sin(t / 2.2 + i * 1.9) * 0.1;
      return (
        <g key={i} transform={`translate(${cx} ${cy})`}>
          <rect x={-8} y={-62} width={16} height={62} rx={4} fill={['#6FB3E0', '#F2C14E', '#F08FA6', '#7ED08A', '#B58AC9'][i]} stroke="#4A4A5A" strokeWidth={3} />
          <path d="M -8 -40 L 8 -48 M -8 -22 L 8 -30" stroke="#fff" strokeWidth={4} opacity={0.6} />
          {alive ? (
            <g transform={`translate(0 -66) rotate(${k * 38 + Math.sin(t / 3 + i) * 3}) scale(${fl * (1 - k * 0.5)} ${fl * (1 - k * 0.3)})`}>
              <ellipse cx={0} cy={-6} rx={11} ry={20} fill="#FFB43A" />
              <ellipse cx={0} cy={0} rx={6} ry={12} fill="#FFF3B0" />
            </g>
          ) : (
            <path d={`M 0 -68 q ${8 + Math.sin(t / 3) * 3} -18 -2 -34 q -10 -16 4 -32`} stroke="#E8E4DC" strokeWidth={4} fill="none" strokeLinecap="round" opacity={clamp(1 - (blow - i * 2 - 5) / 22)} />
          )}
        </g>
      );
    })}
  </g>
);

/** An empty wooden chair in side view with a party hat on the seat and a limp balloon tied to the back, ~200 x 300. */
export const EmptyChair: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={110} ry={14} fill="#000" opacity={0.35} />
    <path d="M -76 -140 V 0 M 76 -140 V 0 M -66 -150 L -76 -330" stroke="#3E2A1E" strokeWidth={16} strokeLinecap="round" />
    <path d="M -66 -150 L -76 -330" stroke="#7A5239" strokeWidth={14} strokeLinecap="round" />
    <path d="M -62 -318 L -70 -250 M -62 -300 L 14 -296" stroke="#5E3F2B" strokeWidth={9} strokeLinecap="round" />
    <rect x={-96} y={-160} width={188} height={26} rx={9} fill="#9A6A48" stroke="#3E2A1E" strokeWidth={4} />
    <path d="M -80 -134 V -10 M 78 -134 V -10" stroke="#7A5239" strokeWidth={14} strokeLinecap="round" />
    {/* a party hat waiting on the seat */}
    <path d="M -10 -160 L 24 -160 L 7 -222 Z" fill="#F2C14E" stroke="#9A7A22" strokeWidth={3} />
    <circle cx={7} cy={-224} r={7} fill="#F08FA6" />
    {/* a balloon on a string, bobbing, tied to the chair back */}
    <path d={`M -70 -300 Q ${-40 + Math.sin(t / 14) * 10} -400 ${-30 + Math.sin(t / 12) * 14} -480`} stroke="#D8D2C6" strokeWidth={3} fill="none" />
    <g transform={`translate(${-30 + Math.sin(t / 12) * 14} -520) rotate(${Math.sin(t / 14) * 5})`}>
      <ellipse cx={0} cy={0} rx={38} ry={46} fill="#E2574C" stroke="#A8362E" strokeWidth={3} />
      <ellipse cx={-12} cy={-16} rx={8} ry={14} fill="#fff" opacity={0.45} />
      <path d="M -6 46 L 6 46 L 0 56 Z" fill="#A8362E" />
    </g>
  </g>
);
