import React from 'react';
import { FONT, clamp, backOut, Glow, LOOKS, Look } from '../../engine';

// Chapter A, the power's props: the matte black card (gold chip, thin gold infinity), the handheld card terminal
// (idle / reading / green "THANH TOÁN THÀNH CÔNG"), a bánh mì cart, a milk-tea cup and the spot-lit insert backdrop.
// Every prop is a pure function of its inputs (shot clock t); unique svg ids come from `id`.

export const GOLD = '#D9B55E';
export const GOLD_DK = '#9C7A32';
export const OK_GREEN = '#26B866';

/** Two street vendors, drawn from the shared rig with their own colours (no cast member is reused). */
export const VENDOR_A: Look = { ...LOOKS.mom, jacket: '#4C8A8A', jacketShade: '#3C7070', hair: '#2A1C18' };
export const VENDOR_B: Look = { ...LOOKS.mo, jacket: '#C9533E', jacketShade: '#A64232', hair: '#2A1C18', extra: undefined };

/** A thin gold infinity sign (lemniscate stroke), about 210 wide, centred on (0,0). */
export const InfinityMark: React.FC<{ stroke?: string; w?: number }> = ({ stroke = GOLD, w = 6 }) => (
  <path
    d="M 0 0 C 30 -46 105 -46 105 0 C 105 46 30 46 0 0 C -30 -46 -105 -46 -105 0 C -105 46 -30 46 0 0 Z"
    fill="none" stroke={stroke} strokeWidth={w} strokeLinejoin="round"
  />
);

/**
 * The card, 520 x 328 at s = 1, centred on (x, y). `yaw` (degrees) turns it about its vertical axis (the back shows
 * past 90), `rot` tilts it in the plane, `shine` 0..1 drives a sheen band across the face.
 */
export const BlackCard: React.FC<{ id: string; x: number; y: number; s?: number; rot?: number; yaw?: number; shine?: number; glow?: number }> = ({
  id, x, y, s = 1, rot = 0, yaw = 0, shine = -1, glow = 0,
}) => {
  const cx = Math.cos((yaw * Math.PI) / 180);
  const back = cx < 0;
  const sx = Math.abs(cx) < 0.04 ? 0.04 : cx;
  const W = 520;
  const H = 328;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}body`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A2832" /><stop offset="0.5" stopColor="#17161C" /><stop offset="1" stopColor="#0E0D12" />
        </linearGradient>
        <linearGradient id={`${id}chip`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F0D486" /><stop offset="1" stopColor={GOLD_DK} />
        </linearGradient>
        <linearGradient id={`${id}sheen`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity={0} /><stop offset="0.5" stopColor="#fff" stopOpacity={0.3} /><stop offset="1" stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <clipPath id={`${id}clip`}><rect x={-W / 2} y={-H / 2} width={W} height={H} rx={28} /></clipPath>
      </defs>
      {glow > 0 ? <ellipse cx={0} cy={0} rx={W * 0.8} ry={H * 0.8} fill={GOLD} opacity={0.14 * glow} style={{ filter: 'blur(40px)' }} /> : null}
      <g transform={`scale(${sx} 1)`}>
        <rect x={-W / 2 + 10} y={-H / 2 + 18} width={W} height={H} rx={28} fill="#000" opacity={0.4} />
        <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={28} fill={`url(#${id}body)`} stroke="#3C3A46" strokeWidth={4} />
        <rect x={-W / 2 + 8} y={-H / 2 + 8} width={W - 16} height={H - 16} rx={22} fill="none" stroke="#2A2832" strokeWidth={2} />
        {back ? (
          <g>
            <rect x={-W / 2} y={-H / 2 + 50} width={W} height={64} fill="#050507" />
            <rect x={-W / 2 + 40} y={26} width={300} height={50} rx={6} fill="#2A2832" />
            <text x={-W / 2 + 56} y={62} fontFamily={FONT.ui} fontSize={26} fill={GOLD} letterSpacing={6}>• • • •</text>
          </g>
        ) : (
          <g>
            <rect x={-W / 2 + 46} y={-62} width={92} height={70} rx={12} fill={`url(#${id}chip)`} stroke={GOLD_DK} strokeWidth={3} />
            <path d={`M ${-W / 2 + 46} -27 h 92 M ${-W / 2 + 92} -62 v 70 M ${-W / 2 + 46} -44 h 30 M ${-W / 2 + 46} -10 h 30 M ${-W / 2 + 108} -44 h 30 M ${-W / 2 + 108} -10 h 30`} stroke={GOLD_DK} strokeWidth={2.5} fill="none" />
            <text x={-W / 2 + 46} y={-H / 2 + 66} fontFamily={FONT.ui} fontSize={22} fill={GOLD} letterSpacing={8} opacity={0.85}>NGÂN HÀNG</text>
            <g transform="translate(112 76) scale(0.95)"><InfinityMark /></g>
            <path d="M 150 -60 q 14 14 0 30 M 172 -72 q 22 26 0 54" stroke={GOLD} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} transform="translate(60 -10)" />
          </g>
        )}
        {shine >= 0 ? (
          <g clipPath={`url(#${id}clip)`}>
            <rect x={-W + shine * (W * 2.2)} y={-H} width={150} height={H * 2} fill={`url(#${id}sheen)`} transform={`skewX(-20)`} />
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** A dark insert backdrop with a warm spotlight pool (macro shots); fills 0..1920 x 0..1080. */
export const SpotBackdrop: React.FC<{ id: string; t: number; cx?: number; cy?: number; r?: number; tint?: string }> = ({ id, t, cx = 960, cy = 560, r = 760, tint = '#FFD9A0' }) => (
  <g>
    <defs>
      <radialGradient id={`${id}pool`} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={tint} stopOpacity={0.55} /><stop offset="0.5" stopColor={tint} stopOpacity={0.14} /><stop offset="1" stopColor={tint} stopOpacity={0} />
      </radialGradient>
      <linearGradient id={`${id}floor`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#15131C" /><stop offset="1" stopColor="#07060A" /></linearGradient>
    </defs>
    <rect x={-400} y={-300} width={2720} height={1700} fill={`url(#${id}floor)`} />
    <path d={`M ${cx - 90} -300 L ${cx + 90} -300 L ${cx + r * 0.7} ${cy + 260} L ${cx - r * 0.7} ${cy + 260} Z`} fill={tint} opacity={0.07 + 0.01 * Math.sin(t / 9)} />
    <ellipse cx={cx} cy={cy + 40} rx={r} ry={r * 0.5} fill={`url(#${id}pool)`} />
  </g>
);

/**
 * The handheld card terminal, bottom centre at (x, y), 160 wide x 300 tall at s = 1. screen: 'idle' | 'read' | 'ok'.
 * `okT` = frames since the green screen came on (it pops, the glow pulses).
 */
export const Terminal: React.FC<{ x: number; y: number; s?: number; rot?: number; screen?: 'idle' | 'read' | 'ok'; okT?: number; t?: number }> = ({
  x, y, s = 1, rot = 0, screen = 'idle', okT = 0, t = 0,
}) => {
  const pop = screen === 'ok' ? backOut(clamp(okT / 6)) : 1;
  const bg = screen === 'ok' ? OK_GREEN : screen === 'read' ? '#B8862E' : '#12313A';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={4} cy={6} rx={96} ry={14} fill="#000" opacity={0.35} />
      <rect x={-82} y={-304} width={164} height={304} rx={26} fill="#2C2B35" stroke="#0F0E14" strokeWidth={4} />
      <rect x={-82} y={-304} width={30} height={304} rx={20} fill="#3A3946" opacity={0.5} />
      <rect x={-66} y={-286} width={132} height={96} rx={10} fill="#0B0A10" />
      <g transform={`translate(0 ${-238}) scale(${pop})`}>
        <rect x={-60} y={-44} width={120} height={88} rx={7} fill={bg} />
        {screen === 'ok' ? (
          <g>
            <circle cx={0} cy={-18} r={15} fill="#EFFFF5" />
            <path d="M -8 -17 l 6 7 l 12 -14" stroke={OK_GREEN} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={13.5} fill="#F2FFF7">THANH TOÁN</text>
            <text x={0} y={32} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={13.5} fill="#F2FFF7">THÀNH CÔNG</text>
          </g>
        ) : (
          <g>
            <text x={0} y={-4} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={16} fill={screen === 'read' ? '#2A1B05' : '#7FE3F0'}>{screen === 'read' ? 'ĐANG ĐỌC' : 'SẴN SÀNG'}</text>
            <text x={0} y={24} textAnchor="middle" fontFamily={FONT.ui} fontSize={14} fill={screen === 'read' ? '#2A1B05' : '#4FA9B8'}>{screen === 'read' ? '. . .' : 'CHẠM THẺ'}</text>
          </g>
        )}
      </g>
      {/* contactless pad */}
      <rect x={-56} y={-178} width={112} height={44} rx={8} fill="#1B1A22" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${-14 + i * 12} -166 q 8 10 0 20`} stroke={screen === 'read' ? '#FFD27A' : '#6B7A8E'} strokeWidth={3.5} fill="none" strokeLinecap="round" opacity={screen === 'read' ? 0.5 + 0.5 * Math.abs(Math.sin(t / 3 + i)) : 0.8} />
      ))}
      {/* keypad */}
      {Array.from({ length: 12 }).map((_, i) => {
        const c = i % 3;
        const r = Math.floor(i / 3);
        const fill = r === 3 ? ['#D9534F', '#E9C46A', '#3DBE72'][c] : '#4A4958';
        return <rect key={i} x={-52 + c * 38} y={-120 + r * 30} width={30} height={22} rx={6} fill={fill} />;
      })}
      {screen === 'ok' ? <Glow x={0} y={-238} r={230 + 20 * Math.sin(okT / 4)} kind="cool" o={0.32 * clamp(okT / 4)} /> : null}
    </g>
  );
};

/** A bánh mì baguette lying on its side, about 150 x 38, centred on (0, 0). */
export const Baguette: React.FC<{ rot?: number }> = ({ rot = 0 }) => (
  <g transform={`rotate(${rot})`}>
    <path d="M -76 0 Q -78 -18 -52 -19 L 52 -19 Q 78 -18 76 0 Q 78 18 52 19 L -52 19 Q -78 18 -76 0 Z" fill="#E0A458" stroke="#8A5A26" strokeWidth={2.5} />
    <path d="M -50 -17 Q -40 -4 -30 -17 M -14 -18 Q -4 -4 6 -18 M 24 -18 Q 34 -4 44 -18" stroke="#B87A38" strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M -66 -8 Q 0 -14 66 -8" stroke="#F4C98A" strokeWidth={3} fill="none" opacity={0.7} strokeLinecap="round" />
  </g>
);

/** A bánh mì push cart on wheels, ground point (x, y), about 180 wide x 230 tall (umbrella included) at s = 1. */
export const BanhMiCart: React.FC<{ x: number; y: number; s?: number; hue?: number; t?: number; emptied?: number }> = ({ x, y, s = 1, hue = 0, t = 0, emptied = 0 }) => {
  const stripe = [['#E9C46A', '#F6EFE3'], ['#E4604A', '#F6EFE3'], ['#3E8C86', '#F6EFE3']][hue % 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={104} ry={9} fill="#000" opacity={0.3} />
      <rect x={-6} y={-232} width={7} height={140} fill="#5A4A3A" />
      <path d="M -108 -176 Q 0 -240 108 -176 Z" fill={stripe[0]} stroke="#1A1230" strokeWidth={3} />
      <path d="M -108 -176 Q -72 -186 -36 -176 Q 0 -186 36 -176 Q 72 -186 108 -176" stroke={stripe[1]} strokeWidth={7} fill="none" />
      {/* glass case */}
      <rect x={-84} y={-132} width={168} height={74} rx={6} fill="#CFE6EA" opacity={0.28} stroke="#6E8E96" strokeWidth={3} />
      {emptied < 1 ? Array.from({ length: 5 }).map((_, i) => (
        <g key={i} transform={`translate(${-48 + (i % 3) * 48} ${-110 + Math.floor(i / 3) * 26 + 8})`} opacity={1 - clamp(emptied * 2 - i * 0.2)}><g transform="scale(0.55)"><Baguette rot={i % 2 ? 4 : -4} /></g></g>
      )) : null}
      <rect x={-92} y={-62} width={184} height={46} rx={6} fill="#8A5A34" stroke="#3E2A18" strokeWidth={3} />
      <rect x={-92} y={-62} width={184} height={8} rx={4} fill="#A87040" />
      <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={25} fill="#F6EFE3" letterSpacing={3}>BÁNH MÌ</text>
      <path d="M -78 -16 L -84 -2 M 78 -16 L 84 -2" stroke="#3E2A18" strokeWidth={6} />
      {[-62, 62].map((wx) => (
        <g key={wx} transform={`translate(${wx} -14) rotate(${t * 2})`}>
          <circle r={14} fill="#1A1620" stroke="#8E8A98" strokeWidth={3} /><path d="M -12 0 H 12 M 0 -12 V 12" stroke="#8E8A98" strokeWidth={2.5} />
        </g>
      ))}
      <path d="M 92 -54 L 128 -112 M 98 -50 L 134 -108" stroke="#5A4A3A" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
};

/** A generic milk-tea cup (dome lid, straw, tapioca pearls), bottom centre (x, y), 130 wide x 250 tall at s = 1. */
export const MilkTea: React.FC<{ id: string; x: number; y: number; s?: number; rot?: number; level?: number; t?: number }> = ({ id, x, y, s = 1, rot = 0, level = 1, t = 0 }) => {
  const top = -200 + (1 - level) * 90;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <defs>
        <linearGradient id={`${id}tea`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#E4BE94" /><stop offset="0.6" stopColor="#C9966A" /><stop offset="1" stopColor="#A8744C" /></linearGradient>
        <clipPath id={`${id}cup`}><path d="M -60 -190 L 60 -190 L 46 0 L -46 0 Z" /></clipPath>
      </defs>
      <ellipse cx={0} cy={4} rx={66} ry={10} fill="#000" opacity={0.35} />
      <path d="M -60 -190 L 60 -190 L 46 0 L -46 0 Z" fill="#E7F2F4" opacity={0.3} stroke="#BFD6DA" strokeWidth={3} />
      <g clipPath={`url(#${id}cup)`}>
        <rect x={-70} y={top} width={140} height={200} fill={`url(#${id}tea)`} />
        <path d={`M -70 ${top} Q -35 ${top - 6 + Math.sin(t / 5) * 3} 0 ${top} Q 35 ${top + 6 - Math.sin(t / 5) * 3} 70 ${top}`} stroke="#F2D8B8" strokeWidth={5} fill="none" />
        {Array.from({ length: 14 }).map((_, i) => (
          <circle key={i} cx={-38 + (i % 5) * 19 + (Math.floor(i / 5) % 2) * 8} cy={-14 - Math.floor(i / 5) * 17} r={9} fill="#2A1A14" />
        ))}
        <rect x={-62} y={-130} width={30} height={120} fill="#fff" opacity={0.14} />
      </g>
      <rect x={-52} y={-150} width={104} height={40} fill="#F59AA8" opacity={0.9} />
      <path d="M -26 -140 q 14 -6 26 6 q 14 -12 26 -2" stroke="#FFF" strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M -66 -190 Q 0 -250 66 -190 Z" fill="#E7F2F4" opacity={0.55} stroke="#BFD6DA" strokeWidth={3} />
      <rect x={-6} y={-300} width={12} height={160} rx={4} fill="#F28C6A" transform="rotate(8 0 -190)" />
    </g>
  );
};

