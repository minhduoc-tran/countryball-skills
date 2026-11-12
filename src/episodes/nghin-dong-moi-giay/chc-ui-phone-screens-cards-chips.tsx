import React from 'react';
import { FONT, SCH, Schematic, SchLabel, clamp, easeOut, backOut, kf, UI } from '../../engine';

// Chapter C UI: phone screens (drawn on the 600 x 1250 screen of last-one's PhoneShell, origin top-left), the numbered
// schematic chapter card, a call bubble and the glitched red ping chip. Generic bank UI: green tick, "NGÂN HÀNG".

export const SW = 600;
export const SH = 1250;
const INK = '#14161E';
const CARD = '#212636';
const SOFT = '#9FB4D8';
const GREEN = '#2FBF71';
const TINTS = ['#E9A0A0', '#8FB4D9', '#E9C46A', '#9BC9A0', '#B9A0D9', '#F2B38A'];

/** 28800000 -> "28.800.000" (Vietnamese thousands dots). */
export const fmtVN = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const Bar: React.FC<{ title: string; sub?: string }> = ({ title, sub }) => (
  <g>
    <rect x={0} y={0} width={SW} height={150} fill="#0F5E3E" />
    <circle cx={64} cy={86} r={26} fill={GREEN} />
    <path d="M 52 87 l 9 10 l 18 -22" stroke="#E9FFF2" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <text x={108} y={84} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#E9FFF2" letterSpacing={2}>{title}</text>
    {sub ? <text x={108} y={122} fontFamily={FONT.ui} fontSize={24} fill="#9FE0BC">{sub}</text> : null}
  </g>
);

const Tick: React.FC<{ x: number; y: number; t: number; at: number; r?: number }> = ({ x, y, t, at, r = 40 }) => {
  const k = backOut(clamp((t - at) / 6));
  const on = t >= at;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={on ? GREEN : 'none'} stroke={on ? GREEN : '#55607C'} strokeWidth={6} opacity={on ? 1 : 0.8} />
      {on ? <path d="M -16 2 l 12 14 l 24 -30" stroke="#F2FFF7" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${k})`} /> : null}
    </g>
  );
};

/** "TIỀN ĐIỆN / TIỀN NHÀ / HỌC PHÍ" ticking on at the three frames in `at`. */
export const ListScreen: React.FC<{ t: number; at: [number, number, number] }> = ({ t, at }) => (
  <g>
    <rect width={SW} height={SH} fill={INK} />
    <Bar title="NGÂN HÀNG" sub="THANH TOÁN HÓA ĐƠN" />
    {['TIỀN ĐIỆN', 'TIỀN NHÀ', 'HỌC PHÍ'].map((label, i) => {
      const y = 210 + i * 250;
      const k = easeOut(clamp((t - at[i] + 4) / 8));
      return (
        <g key={label} transform={`translate(0 ${y})`}>
          <rect x={26} y={0} width={SW - 52} height={200} rx={26} fill={t >= at[i] ? '#183A2C' : CARD} />
          <text x={56} y={118} fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#F6EFE3" letterSpacing={1}>{label}</text>
          <Tick x={SW - 100} y={100} t={t} at={at[i]} r={46} />
          <rect x={56} y={146} width={(SW - 240) * k} height={8} rx={4} fill={GREEN} opacity={0.8} />
        </g>
      );
    })}
  </g>
);

/** A transfer: to "HỌC SINH VÙNG CAO", 100.000.000 đ, the button turning to a tick at `confirm`. */
export const TransferScreen: React.FC<{ t: number; confirm: number }> = ({ t, confirm }) => {
  const done = t >= confirm;
  const k = backOut(clamp((t - confirm) / 7));
  return (
    <g>
      <rect width={SW} height={SH} fill={INK} />
      <Bar title="NGÂN HÀNG" sub="CHUYỂN TIỀN" />
      <text x={50} y={260} fontFamily={FONT.ui} fontSize={26} fill={SOFT}>NGƯỜI NHẬN</text>
      <rect x={30} y={284} width={SW - 60} height={120} rx={22} fill={CARD} />
      <circle cx={90} cy={344} r={34} fill={TINTS[0]} />
      <text x={146} y={354} fontFamily={FONT.ui} fontWeight={700} fontSize={31} fill="#F6EFE3">HỌC SINH VÙNG CAO</text>
      <text x={50} y={500} fontFamily={FONT.ui} fontSize={26} fill={SOFT}>SỐ TIỀN</text>
      <text x={SW / 2} y={610} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#FFE7A0">100.000.000 đ</text>
      <rect x={50} y={650} width={SW - 100} height={4} fill="#3E4660" />
      <g transform={`translate(${SW / 2} 900)`}>
        <rect x={-210} y={-70} width={420} height={140} rx={70} fill={done ? GREEN : '#2B7BD6'} />
        {done ? <path d="M -46 4 l 28 32 l 62 -76" stroke="#F2FFF7" strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`scale(${k})`} />
          : <text y={16} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill="#fff">XÁC NHẬN</text>}
      </g>
    </g>
  );
};

/** The balance counting up from 0 to `to` between frames `a` and `b`. */
export const BalanceScreen: React.FC<{ t: number; a: number; b: number; to: number }> = ({ t, a, b, to }) => {
  const v = to * easeOut(clamp((t - a) / (b - a)));
  return (
    <g>
      <rect width={SW} height={SH} fill={INK} />
      <Bar title="NGÂN HÀNG" sub="SỐ DƯ" />
      <text x={SW / 2} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={SOFT}>TĂNG TRONG ĐÊM</text>
      <text x={SW / 2} y={460} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={v > 9999999 ? 54 : 60} fill="#7CF0A8">{`+${fmtVN(v)} đ`}</text>
      <rect x={50} y={540} width={SW - 100} height={16} rx={8} fill="#2A3148" />
      <rect x={50} y={540} width={(SW - 100) * clamp(v / to)} height={16} rx={8} fill={GREEN} />
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} opacity={clamp((v / to) * 6 - i)}>
          <rect x={30} y={620 + i * 100} width={SW - 60} height={78} rx={16} fill={CARD} />
          <text x={56} y={670 + i * 100} fontFamily={FONT.ui} fontSize={28} fill={SOFT}>{`0${i + 1}:00`}</text>
          <text x={SW - 56} y={670 + i * 100} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={28} fill="#7CF0A8">+3.600.000 đ</text>
        </g>
      ))}
    </g>
  );
};

const Avatar: React.FC<{ x: number; y: number; r: number; k: number }> = ({ x, y, r, k }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={TINTS[k % TINTS.length]} />
    <circle cx={x} cy={y - r * 0.18} r={r * 0.3} fill="#F6EFE3" />
    <path d={`M ${x - r * 0.55} ${y + r * 0.78} Q ${x} ${y + r * 0.05} ${x + r * 0.55} ${y + r * 0.78} Z`} fill="#F6EFE3" />
  </g>
);

/** Friend requests flooding in: rows drop in from the top one after another, a badge counts up. */
export const RequestsScreen: React.FC<{ t: number }> = ({ t }) => {
  const rows = 9;
  return (
    <g>
      <rect width={SW} height={SH} fill={INK} />
      <rect width={SW} height={140} fill="#1E2A4A" />
      <text x={34} y={90} fontFamily={FONT.ui} fontWeight={700} fontSize={34} fill="#F6EFE3">LỜI MỜI KẾT BẠN</text>
      <g transform={`translate(520 70) scale(${1 + 0.1 * Math.sin(t * 0.5)})`}>
        <circle r={36} fill="#E2453C" />
        <text y={12} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#fff">{t > 40 ? '99+' : Math.min(99, Math.floor(t * 2.4))}</text>
      </g>
      {Array.from({ length: rows }).map((_, i) => {
        const start = i * 5;
        const k = easeOut(clamp((t - start) / 7));
        const y = 160 + i * 124;
        return (
          <g key={i} opacity={k} transform={`translate(${(1 - k) * 80} ${y})`}>
            <rect x={20} y={0} width={SW - 40} height={108} rx={20} fill={CARD} />
            <Avatar x={80} y={54} r={34} k={i + 2} />
            <rect x={132} y={26} width={120 + (i % 3) * 30} height={16} rx={8} fill="#3E4660" />
            <rect x={132} y={56} width={90} height={12} rx={6} fill="#2E3650" />
            <rect x={SW - 190} y={26} width={150} height={58} rx={29} fill="#2B7BD6" />
            <text x={SW - 115} y={64} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#fff">KẾT BẠN</text>
          </g>
        );
      })}
    </g>
  );
};

/** An incoming call: a generic icon (bank or tax paper), a name, "ĐANG GỌI...", green and red buttons. */
export const CallScreen: React.FC<{ t: number; who: string; icon: 'bank' | 'tax' }> = ({ t, who, icon }) => {
  const pulse = 1 + 0.05 * Math.sin(t * 0.9);
  return (
    <g>
      <rect width={SW} height={SH} fill="#10162A" />
      {[0, 1, 2].map((k) => { const p = ((t * 0.03 + k / 3) % 1); return <circle key={k} cx={SW / 2} cy={420} r={150 + p * 170} fill="none" stroke="#CFE6FF" strokeWidth={5} opacity={0.4 * (1 - p)} />; })}
      <g transform={`translate(${SW / 2} 420) scale(${pulse})`}>
        <circle r={150} fill={icon === 'bank' ? '#0F5E3E' : '#6A2B3A'} />
        {icon === 'bank' ? (
          <g fill="#E9FFF2"><path d="M -80 -20 L 0 -80 L 80 -20 Z" /><rect x={-70} y={-6} width={22} height={70} /><rect x={-11} y={-6} width={22} height={70} /><rect x={48} y={-6} width={22} height={70} /><rect x={-86} y={70} width={172} height={18} /></g>
        ) : (
          <g><rect x={-62} y={-84} width={124} height={168} rx={10} fill="#F6EFE3" /><path d="M -40 -50 H 40 M -40 -20 H 40 M -40 10 H 14" stroke="#6A2B3A" strokeWidth={8} strokeLinecap="round" /><circle cx={34} cy={52} r={22} fill="#D6333E" /><path d="M 24 62 L 44 42" stroke="#fff" strokeWidth={6} strokeLinecap="round" /></g>
        )}
      </g>
      <text x={SW / 2} y={680} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={who.length > 10 ? 48 : 60} fill="#F6EFE3">{who}</text>
      <text x={SW / 2} y={750} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#CFE6FF" letterSpacing={4}>{`ĐANG GỌI${'.'.repeat(1 + (Math.floor(t / 6) % 3))}`}</text>
      <circle cx={150} cy={1030} r={72} fill="#D6333E" />
      <rect x={112} y={1020} width={76} height={22} rx={11} fill="#fff" />
      <circle cx={450} cy={1030} r={72} fill={GREEN} transform={`translate(0 ${-Math.abs(Math.sin(t * 0.6)) * 14})`} />
      <path d="M 424 1052 Q 420 1000 448 996 L 462 1026 L 450 1034 Q 458 1046 470 1052 L 482 1042 L 502 1058 Q 490 1074 470 1072 Q 440 1064 424 1052 Z" fill="#fff" transform={`translate(0 ${-Math.abs(Math.sin(t * 0.6)) * 14}) translate(-4 -6)`} />
    </g>
  );
};

/** A call bubble: green phone icon and a name, popping in at frame `at` and bobbing. x, y the bubble's centre. */
export const CallBubble: React.FC<{ x: number; y: number; t: number; at: number; name: string; s?: number }> = ({ x, y, t, at, name, s = 1 }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 6));
  const bob = Math.sin(t * 0.25 + at) * 6;
  const ring = Math.sin((t - at) * 1.4) * 6;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s * k}) rotate(${ring * 0.25})`}>
      <rect x={-190} y={-54} width={380} height={108} rx={54} fill="#0B0816" opacity={0.85} stroke="#5BE08A" strokeWidth={4} />
      <circle cx={-130} cy={0} r={38} fill={GREEN} />
      <path d="M -145 14 Q -150 -14 -128 -20 L -118 0 L -128 6 Q -124 14 -114 20 L -106 12 L -94 24 Q -104 34 -118 32 Q -136 26 -145 14 Z" fill="#fff" />
      <text x={-70} y={14} fontFamily={FONT.ui} fontWeight={700} fontSize={name.length > 8 ? 36 : 42} fill="#F6EFE3" letterSpacing={1}>{name}</text>
    </g>
  );
};

/** The ping chip gone wrong: a red, glitching "+1.000 đ" with sliced offsets, at the ping look's spot (screen coordinates). */
export const GlitchChip: React.FC<{ t: number }> = ({ t }) => {
  const j = Math.floor(t / 2);
  const dx = ((j * 37) % 7) - 3;
  const sl = (j * 53) % 60;
  return (
    <g transform="translate(1610 96)">
      <rect x={-200} y={-44} width={400} height={88} rx={44} fill="#2A0A10" />
      <rect x={-200} y={-44} width={400} height={88} rx={44} fill="none" stroke={UI.bad} strokeWidth={4} opacity={0.9} />
      <g opacity={0.7}>
        <text x={34 + dx * 2} y={15} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#00E0FF" letterSpacing={2}>+1.000 đ</text>
      </g>
      <text x={30 - dx * 2} y={15} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#FF4A3A" letterSpacing={2}>+1.000 đ</text>
      <rect x={-190 + sl * 3} y={-44 + ((j * 11) % 70)} width={140} height={9} fill="#FF4A3A" opacity={0.85} />
      <rect x={-190 + ((j * 29) % 300)} y={-44 + ((j * 17) % 80)} width={90} height={6} fill="#2A0A10" />
      <path d="M -162 -14 L -138 14 M -138 -14 L -162 14" stroke="#FF4A3A" strokeWidth={7} strokeLinecap="round" />
    </g>
  );
};

type CardIconKind = 'tax' | 'eye' | 'people';
const CardIcon: React.FC<{ kind: CardIconKind; t: number }> = ({ kind, t }) => {
  const body: Record<CardIconKind, React.ReactNode> = {
    tax: (
      <g>
        <circle r={62} />
        <path d="M -30 30 L 30 -30" />
        <circle cx={-26} cy={-26} r={11} />
        <circle cx={26} cy={26} r={11} />
      </g>
    ),
    eye: (
      <g>
        <path d="M -70 0 Q 0 -66 70 0 Q 0 66 -70 0 Z" />
        <circle cx={Math.sin(t / 10) * 8} cy={0} r={22} fill={SCH.live} />
      </g>
    ),
    people: (
      <g>
        <circle cx={-30} cy={-22} r={20} /><path d="M -64 40 Q -64 0 -30 0 Q 4 0 4 40 Z" />
        <circle cx={34} cy={-30} r={18} /><path d="M 4 40 Q 4 -4 34 -6 Q 66 -4 66 40 Z" />
      </g>
    ),
  };
  return (
    <g stroke={SCH.live} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 12px ${SCH.glow})` }}>
      <g transform={`translate(0 ${Math.sin(t / 8) * 4})`}>{body[kind]}</g>
    </g>
  );
};

/** "2 · BỊ ĐỂ Ý": the ring with the big number, the word, the icon, popping on one after another (the last-one chapter card style). */
export const NumCard: React.FC<{ t: number; len: number; n: number; word: string; icon: CardIconKind; id: string; sub?: string }> = ({ t, len, n, word, icon, id, sub = 'CÁI GIÁ' }) => {
  const ring = backOut(clamp((t + 2) / 7));
  const wordIn = backOut(clamp((t - 3) / 7));
  const iconIn = backOut(clamp((t - 7) / 7));
  const underline = easeOut(clamp((t - 8) / 10));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.07]])}) translate(-960 -540)`}>
      <Schematic t={t} id={id} />
      <g transform={`translate(400 520) scale(${ring})`}>
        <circle r={190} fill={`${SCH.live}1A`} stroke={SCH.live} strokeWidth={8} style={{ filter: `drop-shadow(0 0 16px ${SCH.glow}88)` }} />
        <text y={104} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={SCH.live}>{n}</text>
      </g>
      <g transform={`translate(700 585) scale(${wordIn})`}>
        <text fontFamily={FONT.ui} fontWeight={700} fontSize={word.length > 7 ? 118 : 140} fill={SCH.line} letterSpacing={3}>{word}</text>
      </g>
      <path d="M 704 640 L 1560 640" stroke={SCH.live} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - underline} />
      <g transform={`translate(1600 400) scale(${2.1 * iconIn})`}><CardIcon kind={icon} t={t} /></g>
      <SchLabel x={400} y={800} t={t - 6} text={sub} size={34} color={SCH.dim} />
    </g>
  );
};

/** A round clock face with an hour mark ring and one hand at `angle` degrees (0 = 12 o'clock), x y the centre. */
export const ClockFace: React.FC<{ x: number; y: number; r?: number; angle: number; color?: string; fill?: string; hand?: string }> = ({ x, y, r = 200, angle, color = '#F6EFE3', fill = '#1A2238', hand = '#FF8A3D' }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r + 14} fill="#000" opacity={0.35} transform="translate(8 12)" />
    <circle r={r + 12} fill="#C9CFDC" />
    <circle r={r} fill={fill} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-4} y={-r + 10} width={8} height={i % 3 === 0 ? 34 : 18} rx={3} fill={color} transform={`rotate(${i * 30})`} />)}
    <g transform={`rotate(${angle})`}>
      <rect x={-7} y={-r * 0.78} width={14} height={r * 0.78 + 20} rx={7} fill={hand} style={{ filter: `drop-shadow(0 0 8px ${hand})` }} />
    </g>
    <g transform={`rotate(${angle / 12})`}><rect x={-9} y={-r * 0.5} width={18} height={r * 0.5} rx={9} fill={color} /></g>
    <circle r={16} fill={color} />
  </g>
);

/** Falling party confetti over the whole frame (pure function of t). */
export const Confetti: React.FC<{ t: number; from?: number; n?: number }> = ({ t, from = 0, n = 34 }) => {
  const k = t - from;
  if (k < 0) return null;
  const cols = ['#F0C14B', '#E0554D', '#5BA8E8', '#7CF0A8', '#F28C6A', '#F6EFE3'];
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const r1 = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
        const r2 = ((Math.sin(i * 78.233) * 12345.678) % 1 + 1) % 1;
        const x = 100 + r1 * 1720 + Math.sin(k * 0.12 + i) * 30;
        const y = -60 + ((k * (9 + r2 * 8) + r2 * 900) % 1250);
        return <rect key={i} x={x} y={y} width={16} height={9} fill={cols[i % cols.length]} transform={`rotate(${k * 7 + i * 40} ${x} ${y})`} opacity={clamp(k / 6)} />;
      })}
    </g>
  );
};
