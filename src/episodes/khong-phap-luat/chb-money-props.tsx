import React from 'react';
import { clamp, easeOut, easeIn, backOut, rnd, Glow, FONT, UI } from '../../engine';

// Chapter B props (3/4): day one, money. The company gate, the bank front with its grille, a phone showing a balance,
// the scam pop-ups and red flags, the contract paper that dissolves, an anonymous hooded scammer. Pure functions of the clock.

const INK = '#12101C';

/** The company gate: a wall, a sliding iron gate with a chain, a sign plate and a dim lamp. 1500 wide, ground at y 900. */
export const CompanyGate: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-400} y={0} width={2700} height={900} fill="#5C5668" />
    <rect x={-400} y={0} width={2700} height={900} fill="#2A2438" opacity={0.3} />
    <rect x={-400} y={880} width={2700} height={500} fill="#3A3442" />
    <rect x={160} y={140} width={1180} height={110} rx={10} fill="#26303F" stroke={INK} strokeWidth={6} />
    <text x={750} y={218} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={72} fill="#D8E6F8" letterSpacing={6}>CÔNG TY</text>
    {/* two pillars and the gate between them */}
    {[120, 1340].map((x) => <rect key={x} x={x} y={260} width={60} height={640} fill="#7A7488" stroke={INK} strokeWidth={5} />)}
    <rect x={180} y={300} width={1160} height={560} fill="#1C1A26" />
    {Array.from({ length: 21 }).map((_, i) => <rect key={i} x={196 + i * 55} y={320} width={14} height={540} fill="#3A3E4C" stroke={INK} strokeWidth={2} />)}
    <rect x={180} y={420} width={1160} height={18} fill="#4A4F5E" stroke={INK} strokeWidth={3} />
    <rect x={180} y={760} width={1160} height={18} fill="#4A4F5E" stroke={INK} strokeWidth={3} />
    <path d="M 700 540 Q 750 620 800 540" stroke="#9A9AAE" strokeWidth={10} fill="none" strokeDasharray="22 6" />
    <rect x={720} y={560} width={60} height={70} rx={10} fill="#D8B24A" stroke={INK} strokeWidth={4} />
    {/* a wall lamp, flickering */}
    <g transform="translate(1440 330)">
      <rect x={-6} y={-30} width={12} height={50} fill="#4A4F5E" />
      <ellipse cx={0} cy={26} rx={20} ry={14} fill={Math.sin(t / 4) > 0.85 ? '#7A6A4A' : '#FFD890'} />
      <Glow x={0} y={30} r={240} o={0.35} />
    </g>
    <ellipse cx={750} cy={904} rx={760} ry={24} fill="#000" opacity={0.28} />
  </g>
);

/** The bank's front (generic, no logo): steps, four columns, a pediment with a coin, glass doors; `grille` 0..1 rolls a grille down. */
export const BankFront: React.FC<{ grille: number; lock?: number }> = ({ grille, lock = 0 }) => {
  const g = easeIn(clamp(grille));
  const l = backOut(clamp(lock));
  return (
    <g>
      <rect x={-400} y={0} width={2700} height={900} fill="#6E6676" />
      <rect x={-400} y={0} width={2700} height={900} fill="#2A2438" opacity={0.3} />
      <path d="M 220 250 L 880 90 L 1540 250 Z" fill="#B8B0A0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={880} cy={196} r={44} fill="#E9C46A" stroke={INK} strokeWidth={5} />
      <text x={880} y={214} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={52} fill="#7A5A1E">$</text>
      <rect x={200} y={250} width={1360} height={70} fill="#9C9486" stroke={INK} strokeWidth={5} />
      <text x={880} y={302} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={46} fill="#2A2438" letterSpacing={10}>NGÂN HÀNG</text>
      {[300, 590, 1170, 1460].map((x) => (
        <g key={x}>
          <rect x={x - 38} y={320} width={76} height={500} fill="#D8D0BE" stroke={INK} strokeWidth={5} />
          <rect x={x - 38} y={320} width={22} height={500} fill="#000" opacity={0.1} />
        </g>
      ))}
      <rect x={640} y={340} width={480} height={480} fill="#1C2433" stroke={INK} strokeWidth={6} />
      <rect x={652} y={352} width={225} height={456} fill="#3A5270" opacity={0.7} />
      <rect x={883} y={352} width={225} height={456} fill="#3A5270" opacity={0.7} />
      <path d="M 665 380 L 740 352 M 665 520 L 820 352" stroke="#FFFFFF" strokeWidth={6} opacity={0.15} />
      {/* the grille rolls down over the doors */}
      <g>
        <rect x={632} y={332} width={496} height={490 * g} fill="#8E93A2" opacity={g > 0 ? 1 : 0} />
        {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={632} y={332 + i * 26} width={496} height={Math.max(0, Math.min(8, 490 * g - i * 26))} fill="#585C6C" />)}
        <rect x={622} y={332 + 490 * g - 6} width={516} height={24} fill="#6E7282" stroke={INK} strokeWidth={4} opacity={g > 0 ? 1 : 0} />
      </g>
      {l > 0 ? (
        <g transform={`translate(880 ${820 - 40 * (1 - l)}) scale(${l})`} opacity={clamp(lock * 3)}>
          <path d="M -34 -34 V -64 Q -34 -96 0 -96 Q 34 -96 34 -64 V -34" stroke="#C9CDD6" strokeWidth={12} fill="none" />
          <rect x={-46} y={-40} width={92} height={74} rx={12} fill="#D8B24A" stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={-4} r={9} fill={INK} />
        </g>
      ) : null}
      <rect x={140} y={820} width={1480} height={34} fill="#A89F90" stroke={INK} strokeWidth={4} />
      <rect x={100} y={854} width={1560} height={34} fill="#968E80" stroke={INK} strokeWidth={4} />
      <rect x={-400} y={888} width={2700} height={500} fill="#3A3442" />
      <Glow x={1700} y={300} r={500} o={0.18} kind="cool" />
    </g>
  );
};

/** A phone, big, upright, centred on (x, y): a lit screen drawn by `children` in a 400 x 800 box centred on the origin. */
export const BigPhone: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: number; children?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, glow = 0.5, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle r={700} fill="url(#g3cool)" opacity={glow} style={{ mixBlendMode: 'screen' }} />
    <rect x={-230} y={-440} width={460} height={880} rx={64} fill="#16151C" stroke="#3A3846" strokeWidth={8} />
    <rect x={-210} y={-420} width={420} height={840} rx={50} fill="#0F1A2E" />
    <clipPath id={`bigPhoneClip${Math.round(x)}`}><rect x={-210} y={-420} width={420} height={840} rx={50} /></clipPath>
    <g clipPath={`url(#bigPhoneClip${Math.round(x)})`}>{children}</g>
    <rect x={-50} y={-410} width={100} height={22} rx={11} fill="#000" />
  </g>
);

/** A scam pop-up window: a red header bar with a "!" and a bold line. 360 x 200, centred. */
export const ScamPopup: React.FC<{ x: number; y: number; t: number; text: string; rot?: number; s?: number; hot?: boolean }> = ({ x, y, t, text, rot = 0, s = 1, hot = false }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 6));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * k})`}>
      <rect x={-180} y={-100} width={360} height={200} rx={14} fill="#FFF8E6" stroke={INK} strokeWidth={6} style={{ filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.45))' }} />
      <path d="M -180 -86 Q -180 -100 -166 -100 H 166 Q 180 -100 180 -86 V -40 H -180 Z" fill={hot ? '#E8453C' : '#D8302F'} />
      <circle cx={-146} cy={-70} r={16} fill="#FFF8E6" />
      <text x={-146} y={-62} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#D8302F">!</text>
      <rect x={110} y={-84} width={50} height={28} rx={6} fill="#FFF8E6" opacity={0.85} />
      <text x={0} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={text.length > 15 ? 27 : text.length > 12 ? 34 : 44} fill="#B8202A">{text}</text>
      <rect x={-110} y={50} width={220} height={36} rx={18} fill="#F2B84B" stroke={INK} strokeWidth={4} />
    </g>
  );
};

/** A red warning flag on a pole, planted at its foot (x, y); waves with t. */
export const RedFlag: React.FC<{ x: number; y: number; t: number; at: number; s?: number }> = ({ x, y, t, at, s = 1 }) => {
  const k = backOut(clamp((t - at) / 6));
  if (t < at) return null;
  const w = Math.sin(t / 3 + x) * 8;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * k})`}>
      <path d="M 0 0 V -150" stroke="#C9CDD6" strokeWidth={8} strokeLinecap="round" />
      <path d={`M 4 -150 Q ${44 + w} ${-142 + w} 92 ${-120} Q ${44 + w} ${-100 - w} 4 ${-92} Z`} fill="#E8302F" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    </g>
  );
};

/** A contract on a desk: a title, text lines, a signature. `gone` 0..1 dissolves it bottom-up into drifting specks. */
export const ContractPaper: React.FC<{ x: number; y: number; t: number; gone: number; s?: number; rot?: number }> = ({ x, y, t, gone, s = 1, rot = 0 }) => {
  const cut = 500 * (1 - clamp(gone)); // content below this y (paper-local, 0 at the top) has dissolved
  const rows = [0, 1, 2, 3, 4, 5, 6, 7];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-210} y={0} width={420} height={560} rx={10} fill="#F6EFE3" stroke={INK} strokeWidth={6} opacity={1 - 0.65 * clamp(gone)} />
      <rect x={-210} y={0} width={420} height={560} rx={10} fill="none" stroke="#F6EFE3" strokeWidth={5} strokeDasharray="14 12" opacity={clamp(gone * 2)} />
      <text x={0} y={80} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={52} fill="#4A3A2A" opacity={cut > 70 ? 1 : 0} letterSpacing={3}>HỢP ĐỒNG</text>
      {rows.map((i) => {
        const yy = 130 + i * 40;
        return yy < cut ? <path key={i} d={`M -160 ${yy} H ${i === 7 ? 40 : 160}`} stroke="#8E8678" strokeWidth={9} strokeLinecap="round" opacity={clamp((cut - yy) / 60)} /> : null;
      })}
      {cut > 470 ? <path d="M 40 520 q 20 -50 40 -10 t 40 -6 t 50 -4" stroke="#1F3A8A" strokeWidth={6} fill="none" strokeLinecap="round" opacity={clamp((cut - 470) / 30)} /> : null}
      {Array.from({ length: 26 }).map((_, i) => {
        const born = 560 - (i / 26) * 460; // the y this speck came from; it lifts off once the dissolving front passes it
        const ph = clamp((born - cut) / 140);
        if (ph <= 0 || ph >= 1) return null;
        return <rect key={i} x={-170 + rnd(21, i) * 340 + Math.sin(t / 8 + i) * 16 * ph} y={born - 220 * easeOut(ph)} width={10} height={6} rx={2} fill="#F6EFE3" opacity={1 - ph} />;
      })}
    </g>
  );
};

/** A hooded anonymous figure at a laptop, from behind-left: a dark hood, a glint of glasses, lit by the screen. Origin: laptop base centre. */
export const HoodedScammer: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={320} ry={20} fill="#000" opacity={0.4} />
    <path d="M -230 0 Q -250 -240 -120 -330 Q -20 -380 70 -310 Q 150 -230 130 0 Z" fill="#1E1B2A" stroke={INK} strokeWidth={5} />
    <path d="M -150 -300 Q -60 -400 40 -330 Q 100 -280 90 -190 Q 20 -250 -60 -230 Q -140 -220 -150 -300 Z" fill="#14121C" />
    <ellipse cx={-30} cy={-250} rx={64} ry={52} fill="#0A0910" />
    <path d={`M -62 -254 H -12 M 4 -254 H 42`} stroke="#9FE8FF" strokeWidth={9} strokeLinecap="round" opacity={0.85 + 0.15 * Math.sin(t / 4)} />
    <path d="M -50 -222 Q -26 -208 -2 -222" stroke="#9FE8FF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.7} />
    {/* laptop */}
    <path d="M 120 -10 L 560 -10 L 520 -250 L 160 -250 Z" fill="#2A2C3A" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 180 -30 L 500 -30 L 478 -226 L 190 -226 Z" fill="#3A5A9E" opacity={0.9} />
    <rect x={100} y={-12} width={480} height={22} rx={8} fill="#8E93A2" stroke={INK} strokeWidth={4} />
    <Glow x={330} y={-130} r={420} kind="cool" o={0.5} />
    <path d="M -60 -90 Q 40 -60 150 -50" stroke="#1E1B2A" strokeWidth={34} fill="none" strokeLinecap="round" />
  </g>
);

export const BALANCE = '12.480.000';

/** The balance text as separate glyphs so shots can detach them: returns each digit's index-based drift for `p` 0..1. */
export const BalanceDigits: React.FC<{ x: number; y: number; size: number; p: number; t: number; color?: string }> = ({ x, y, size, p, t, color = '#7CF0B0' }) => {
  const chars = BALANCE.split('');
  const adv = size * 0.6;
  const x0 = x - (chars.length * adv) / 2 + adv / 2;
  return (
    <g>
      {chars.map((ch, i) => {
        const q = clamp((p * 1.5 - rnd(31, i) * 0.5) * 1.4);
        const e = easeIn(q);
        const dx = (rnd(32, i) - 0.5) * 900 * e;
        const dy = -(300 + rnd(33, i) * 500) * e;
        return (
          <text key={i} x={x0 + i * adv + dx} y={y + dy + Math.sin(t / 5 + i) * 3 * e} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={color}
            opacity={1 - clamp((q - 0.5) * 2)} transform={`rotate(${(rnd(34, i) - 0.5) * 160 * e} ${x0 + i * adv + dx} ${y + dy})`} style={{ filter: `drop-shadow(0 0 ${size / 6}px ${color}88)` }}>
            {ch}
          </text>
        );
      })}
    </g>
  );
};

export const PillText: React.FC<{ x: number; y: number; text: string; size?: number; color?: string }> = ({ x, y, text, size = 44, color = UI.text }) => (
  <text x={x} y={y} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={color} letterSpacing={3}>{text}</text>
);
