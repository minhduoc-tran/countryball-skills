import React from 'react';
import { FONT, clamp, easeOut, backOut } from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';

// Chapter D, "the news": a TV set and its generic news screen (no logos): a studio, an anchor drawn as a flat figure,
// a red "TIN NÓNG" tag with a lower-third banner that types itself, and a small row of person icons where some are
// flagged. The screen is drawn in a 1000 x 560 box; <TvSet> scales and frames it.

const INK = '#1D2033';
const BANNER_1 = 'CHÂU ÂU:';
const BANNER_2 = 'HÀNG TRIỆU NGƯỜI CÓ NGUY CƠ NGHÈO';

/** The picture on the screen. `on` 0..1 (a white line opens into the picture), `type` = characters of banner typed so far. */
export const NewsScreen: React.FC<{ t: number; on?: number; type?: number; id: string }> = ({ t, on = 1, type = 0, id }) => {
  const open = easeOut(clamp(on));
  const n1 = Math.min(BANNER_1.length, Math.floor(type));
  const n2 = Math.max(0, Math.min(BANNER_2.length, Math.floor(type - BANNER_1.length)));
  const nod = Math.sin(t / 7) * 2;
  return (
    <g>
      <defs>
        <clipPath id={`${id}scr`}><rect x={0} y={280 - 280 * open - (open < 1 ? 3 : 0)} width={1000} height={560 * open + (open < 1 ? 6 : 0)} /></clipPath>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1C3A74" />
          <stop offset="100%" stopColor="#0E1E44" />
        </linearGradient>
      </defs>
      <rect width={1000} height={560} fill="#0A0A10" />
      <g clipPath={`url(#${id}scr)`}>
        <rect width={1000} height={560} fill={`url(#${id}bg)`} />
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={60 + i * 190} y={40} width={4} height={300} fill="#3A66B8" opacity={0.35} />)}
        {/* the anchor: a flat figure at a desk */}
        <g transform={`translate(330 ${nod * 0.3})`}>
          <path d="M -130 360 Q -126 250 0 244 Q 126 250 130 360 Z" fill="#E8EDF8" stroke={INK} strokeWidth={5} />
          <path d="M -22 246 L 0 300 L 22 246 Z" fill="#D9473A" />
          <rect x={-18} y={214} width={36} height={36} fill="#E9D3B8" stroke={INK} strokeWidth={4} />
          <circle cx={0} cy={168} r={58} fill="#F1DCC2" stroke={INK} strokeWidth={5} />
          <path d="M -62 170 Q -66 100 0 100 Q 66 100 62 170 Q 56 130 0 128 Q -56 130 -62 170 Z" fill="#2A1C18" stroke={INK} strokeWidth={4} />
          <circle cx={-20} cy={172} r={6} fill={INK} />
          <circle cx={20} cy={172} r={6} fill={INK} />
          <path d="M -14 194 Q 0 204 14 194" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>
        <rect x={120} y={352} width={440} height={30} fill="#8B6A4A" stroke={INK} strokeWidth={4} />
        {/* the inset: person icons, some flagged red */}
        <g transform="translate(700 70)">
          <rect width={260} height={190} rx={16} fill="#0B1226" opacity={0.85} stroke="#5B79B8" strokeWidth={3} />
          {Array.from({ length: 10 }).map((_, i) => (
            <g key={i} opacity={clamp((t - 18 - i * 1.5) / 4)}>
              <PersonIcon x={42 + (i % 5) * 44} y={70 + Math.floor(i / 5) * 62} s={0.72} on={i % 5 < 2 || i === 8} />
            </g>
          ))}
          <text x={130} y={176} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#9FB4E0" letterSpacing={2}>NGUY CƠ NGHÈO</text>
        </g>
        {/* the lower third */}
        <rect x={0} y={402} width={1000} height={158} fill="#0B1226" opacity={0.92} />
        <rect x={0} y={402} width={190} height={46} fill="#D9302E" />
        <text x={95} y={437} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#fff" letterSpacing={2}>TIN NÓNG</text>
        <text x={34} y={494} fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill="#FFE27A" letterSpacing={2}>{BANNER_1.slice(0, n1)}</text>
        <text x={34} y={542} fontFamily={FONT.ui} fontWeight={700} fontSize={38} fill="#F6EFE3" letterSpacing={1}>{BANNER_2.slice(0, n2)}{type > 0 && type < 42 && Math.floor(t / 4) % 2 ? '▌' : ''}</text>
        <rect x={0} y={0} width={1000} height={560} fill={`url(#${id}bg)`} opacity={0.0} />
        <text x={968} y={40} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={26} fill="#fff" opacity={0.85}>20:00</text>
      </g>
      {open < 1 ? <rect x={0} y={280 - 3} width={1000} height={6} fill="#fff" opacity={1 - open} /> : null}
      {/* scanlines and a flicker */}
      {Array.from({ length: 28 }).map((_, i) => <rect key={i} x={0} y={i * 20 + (t % 20)} width={1000} height={2} fill="#000" opacity={0.08} />)}
      <rect width={1000} height={560} fill="#fff" opacity={0.03 + 0.03 * Math.sin(t * 1.3)} />
    </g>
  );
};

/** A flat-screen TV on a short cabinet; (x, y) = bottom middle of the cabinet, `w` the screen width. */
export const TvSet: React.FC<{ x: number; y: number; w: number; t: number; on?: number; type?: number; id: string; off?: boolean }> = ({ x, y, w, t, on = 1, type = 0, id, off = false }) => {
  const k = w / 1000;
  const h = 560 * k;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={0} rx={w * 0.62} ry={14} fill="#000" opacity={0.35} />
      <rect x={-w * 0.55} y={-h * 0.32} width={w * 1.1} height={h * 0.32} rx={8} fill="#5A3E2C" stroke={INK} strokeWidth={5} />
      <rect x={-w * 0.04} y={-h * 0.32 - h * 0.12} width={w * 0.08} height={h * 0.14} fill="#2B2B35" />
      <rect x={-w / 2 - 16} y={-h * 1.44 - 12} width={w + 32} height={h + 32} rx={14} fill="#1A1A22" stroke={INK} strokeWidth={5} />
      <g transform={`translate(${-w / 2} ${-h * 1.44 + 4}) scale(${k})`}>
        {off ? <rect width={1000} height={560} fill="#0C0C12" /> : <NewsScreen t={t} on={on} type={type} id={id} />}
      </g>
      <circle cx={w / 2 - 6} cy={-h * 0.44 + 0} r={5} fill={off ? '#D9302E' : '#4CD07D'} opacity={0.9} />
    </g>
  );
};

/** A big "?" that pops over a head, bobbing. `t` frames since it should appear. */
export const QuestionMark: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  t < 0 ? null : (
    <g transform={`translate(${x} ${y - Math.sin(t / 5) * 6}) scale(${backOut(clamp(t / 7)) * s})`}>
      <circle r={52} fill="#fff" stroke={INK} strokeWidth={5} />
      <text y={30} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={86} fill="#2F7FD0">?</text>
    </g>
  )
);
