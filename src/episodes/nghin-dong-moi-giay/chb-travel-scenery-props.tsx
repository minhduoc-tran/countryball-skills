import React from 'react';
import { FONT, SCH, clamp, easeOut, rnd, Glow } from '../../engine';

// Chapter B, local props for the weekend trip: an airliner window over the clouds, a beach at dusk (sea, sand, hills, a low
// sun, palms; no landmarks, no brands), a hotel room with a sea-view window and a big bed, and a boarding pass.
// Pure functions of the shot clock t.

/** A beach at dusk filling 0..1920 x 0..1080: sky, a low sun over the sea, hills, waves, sand and foam, palm silhouettes. */
export const BeachDusk: React.FC<{ id: string; t: number; palms?: boolean }> = ({ id, t, palms = true }) => {
  const H = 560; // horizon
  const wave = (i: number) => {
    const y = H + 30 + i * 46 + i * i * 4;
    const ph = t * (0.05 + i * 0.01) + i * 2;
    return `M -50 ${y} ` + Array.from({ length: 21 }).map((_, k) => `Q ${k * 100 + 25 + Math.sin(ph) * 10} ${y - 8 - i} ${k * 100 + 50} ${y}`).join(' ');
  };
  const foam = 830 + Math.sin(t * 0.06) * 12;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2C2562" /><stop offset="0.45" stopColor="#B4527A" /><stop offset="0.8" stopColor="#F59A62" /><stop offset="1" stopColor="#FFC878" />
        </linearGradient>
        <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F08A6A" /><stop offset="0.35" stopColor="#7A4A7E" /><stop offset="1" stopColor="#2A2C5E" />
        </linearGradient>
        <linearGradient id={`${id}sand`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C89A78" /><stop offset="1" stopColor="#6E4A3E" />
        </linearGradient>
      </defs>
      <rect x={-100} y={-100} width={2120} height={H + 100} fill={`url(#${id}sky)`} />
      <Glow x={1180} y={H - 20} r={620} o={0.85} />
      <circle cx={1180} cy={H - 10} r={92} fill="#FFE9A8" />
      {/* far hills on both sides of the bay */}
      <path d={`M -50 ${H} L -50 ${H - 90} Q 140 ${H - 190} 330 ${H - 120} Q 480 ${H - 80} 640 ${H - 30} L 700 ${H} Z`} fill="#5A3A6E" />
      <path d={`M 1500 ${H} Q 1640 ${H - 150} 1800 ${H - 110} Q 1900 ${H - 90} 2000 ${H - 130} L 2000 ${H} Z`} fill="#4A3262" />
      <path d={`M 480 ${H} Q 760 ${H - 36} 1000 ${H}`} fill="#7A4A78" opacity={0.7} />
      <rect x={-100} y={H} width={2120} height={420} fill={`url(#${id}sea)`} />
      {/* the sun's path on the water */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={1180 - (50 + i * 16)} y={H + 14 + i * 28} width={(50 + i * 16) * 2} height={5} rx={2.5} fill="#FFE9A8" opacity={0.65 - i * 0.05 + Math.sin(t / 5 + i * 2) * 0.12} />
      ))}
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={wave(i)} stroke="#FFD2B0" strokeWidth={2 + i * 0.6} fill="none" opacity={0.28} />)}
      <path d={`M -50 ${foam} Q 300 ${foam - 26} 700 ${foam} T 1500 ${foam} T 2100 ${foam} L 2100 1200 L -50 1200 Z`} fill={`url(#${id}sand)`} />
      <path d={`M -50 ${foam} Q 300 ${foam - 26} 700 ${foam} T 1500 ${foam} T 2100 ${foam}`} stroke="#FFF3E0" strokeWidth={8} fill="none" opacity={0.8} />
      {palms ? (
        <g fill="#1A1230">
          <path d="M 1740 1100 Q 1770 800 1720 560" stroke="#1A1230" strokeWidth={22} fill="none" strokeLinecap="round" />
          {[-150, -90, -30, 30, 90, 150].map((a, i) => (
            <path key={i} d={`M 1720 560 q ${Math.sin((a * Math.PI) / 180) * 130} ${-70 - Math.abs(a) * 0.2 + Math.sin(t / 14 + i) * 5} ${Math.sin((a * Math.PI) / 180) * 220} ${40 + Math.abs(a) * 0.5}`} stroke="#1A1230" strokeWidth={18} fill="none" strokeLinecap="round" />
          ))}
        </g>
      ) : null}
      {Array.from({ length: 3 }).map((_, i) => {
        const x = (300 + i * 120 + t * 2.2) % 2100 - 100;
        return <path key={i} d={`M ${x} ${220 + i * 40} q 14 -14 28 0 q 14 -14 28 0`} stroke="#2A1A3A" strokeWidth={4} fill="none" strokeLinecap="round" transform={`translate(0 ${Math.sin(t / 6 + i) * 4})`} />;
      })}
    </g>
  );
};

/** An airliner window looking out over clouds at dusk: cabin wall, bezel, a sliding shade, drifting clouds and a wing tip. Window centre (cx, cy). */
export const PlaneWindow: React.FC<{ id: string; t: number; cx: number; cy: number }> = ({ id, t, cx, cy }) => {
  const W = 400;
  const Hh = 540;
  const shade = 1 - easeOut(clamp(t / 14)); // the shade slides up
  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}><rect x={cx - W / 2} y={cy - Hh / 2} width={W} height={Hh} rx={190} /></clipPath>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E5CB0" /><stop offset="0.6" stopColor="#F29AA0" /><stop offset="1" stopColor="#FFCB8A" />
        </linearGradient>
      </defs>
      <rect x={cx - 900} y={cy - 700} width={1800} height={1400} fill="#B9B2A6" />
      <rect x={cx - 900} y={cy - 700} width={1800} height={1400} fill="#000" opacity={0.18} />
      <rect x={cx - W / 2 - 34} y={cy - Hh / 2 - 34} width={W + 68} height={Hh + 68} rx={224} fill="#E9E4D8" stroke="#6E685C" strokeWidth={6} />
      <g clipPath={`url(#${id}clip)`}>
        <rect x={cx - W / 2} y={cy - Hh / 2} width={W} height={Hh} fill={`url(#${id}sky)`} />
        <circle cx={cx + 80} cy={cy + 130} r={60} fill="#FFE9A8" />
        <Glow x={cx + 80} y={cy + 130} r={260} o={0.7} />
        {Array.from({ length: 7 }).map((_, i) => {
          const sp = 3 + rnd(2, i) * 3;
          const x = cx + W / 2 + 160 - ((t * sp + rnd(1, i) * 900) % 900);
          const y = cy - 100 + rnd(3, i) * 330;
          const r = 60 + rnd(4, i) * 60;
          return (
            <g key={i} fill="#FFF3EA" opacity={0.92}>
              <ellipse cx={x} cy={y} rx={r * 1.5} ry={r * 0.5} /><ellipse cx={x - r * 0.6} cy={y - r * 0.3} rx={r * 0.8} ry={r * 0.5} /><ellipse cx={x + r * 0.5} cy={y - r * 0.2} rx={r * 0.7} ry={r * 0.45} />
            </g>
          );
        })}
        <path d={`M ${cx - 300} ${cy + 300} L ${cx + 120} ${cy + 190} L ${cx + 300} ${cy + 200} L ${cx + 300} ${cy + 400} L ${cx - 300} ${cy + 400} Z`} fill="#C9CCD6" transform={`translate(0 ${Math.sin(t / 7) * 3})`} />
        <path d={`M ${cx - 300} ${cy + 300} L ${cx + 120} ${cy + 190}`} stroke="#fff" strokeWidth={5} opacity={0.7} />
        <rect x={cx - W / 2} y={cy - Hh / 2} width={W} height={shade * Hh * 0.9} fill="#EDE8DE" />
        <rect x={cx - W / 2} y={cy - Hh / 2 + shade * Hh * 0.9 - 14} width={W} height={14} fill="#C9C3B6" />
      </g>
      <rect x={cx - W / 2} y={cy - Hh / 2} width={W} height={Hh} rx={190} fill="none" stroke="#6E685C" strokeWidth={8} />
    </g>
  );
};

/**
 * A hotel room at night's edge: wall, a big sea-view window (the beach through it), curtains, a bedside lamp, a picture, a rug and a
 * big bed with its front toward us. The pillow end is on the left. Draw the sleeper after this, then <BedDuvet> on top.
 */
export const BED = { x0: 130, x1: 1010, top: 700, front: 860 }; // the mattress's top surface line and its front edge
export const HotelRoom: React.FC<{ id: string; t: number; lamp?: number }> = ({ id, t, lamp = 1 }) => (
  <g>
    <defs>
      <clipPath id={`${id}win`}><rect x={1160} y={170} width={620} height={470} rx={6} /></clipPath>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5A4A5E" /><stop offset="1" stopColor="#3E3450" /></linearGradient>
    </defs>
    <rect x={-100} y={-100} width={2120} height={900} fill={`url(#${id}wall)`} />
    <rect x={-100} y={760} width={2120} height={400} fill="#3A2A2A" />
    <rect x={-100} y={750} width={2120} height={16} fill="#2A1E22" />
    <ellipse cx={600} cy={960} rx={640} ry={80} fill="#6A3A4A" opacity={0.8} />
    {/* the window onto the sea */}
    <rect x={1140} y={150} width={660} height={510} fill="#1A1626" />
    <g clipPath={`url(#${id}win)`}><g transform="translate(1160 170) scale(0.33)"><BeachDusk id={`${id}b`} t={t} palms={false} /></g></g>
    <rect x={1470} y={170} width={8} height={470} fill="#1A1626" /><rect x={1160} y={400} width={620} height={8} fill="#1A1626" />
    <path d="M 1100 120 Q 1150 400 1120 780 L 1250 780 Q 1230 400 1250 120 Z" fill="#8A5A6A" /><path d="M 1860 120 Q 1800 400 1840 780 L 1710 780 Q 1730 400 1700 120 Z" fill="#8A5A6A" />
    <Glow x={1470} y={420} r={520} o={0.35} />
    {/* picture and lamp */}
    <rect x={420} y={150} width={260} height={170} rx={6} fill="#C9B88A" stroke="#2A1E22" strokeWidth={8} />
    <path d="M 440 300 L 520 210 L 580 270 L 620 230 L 660 300 Z" fill="#6A8A9A" />
    <rect x={1040} y={640} width={50} height={120} fill="#4A3A3A" />
    <path d="M 1020 640 L 1110 640 L 1090 580 L 1040 580 Z" fill="#FFE2A8" opacity={0.5 + 0.5 * lamp} />
    <Glow x={1065} y={610} r={260} o={0.55 * lamp} />
    {/* the bed: base, headboard, mattress, sheet front, pillow */}
    <rect x={BED.x0 - 30} y={BED.front - 10} width={BED.x1 - BED.x0 + 60} height={80} rx={10} fill="#4A3030" />
    <rect x={BED.x0 - 70} y={430} width={90} height={440} rx={14} fill="#6A4430" stroke="#2A1A14" strokeWidth={5} />
    <rect x={BED.x0 + 10} y={BED.top} width={BED.x1 - BED.x0} height={BED.front - BED.top} rx={16} fill="#F2EEE8" stroke="#B5ADA0" strokeWidth={4} />
    <rect x={BED.x0 + 10} y={BED.top} width={BED.x1 - BED.x0} height={30} rx={14} fill="#FFFFFF" opacity={0.6} />
    <rect x={BED.x0 + 20} y={BED.top - 70} width={230} height={90} rx={40} fill="#FFFFFF" stroke="#C7BFB2" strokeWidth={4} />
  </g>
);

/** The duvet drawn over a sleeper's legs: from x0 to the foot of the bed, breathing with t. */
export const BedDuvet: React.FC<{ x0: number; t: number }> = ({ x0, t }) => {
  const b = Math.sin(t / 12) * 3;
  return (
    <g>
      <path d={`M ${x0} ${BED.top - 36 + b} Q ${x0 + 200} ${BED.top - 64 + b} ${BED.x1 - 40} ${BED.top - 30} L ${BED.x1 - 20} ${BED.front - 40} L ${x0 - 10} ${BED.front - 40} Z`} fill="#EAF1FA" stroke="#A9B6C9" strokeWidth={5} strokeLinejoin="round" />
      <path d={`M ${x0 + 40} ${BED.top - 20 + b} Q ${x0 + 220} ${BED.top - 50 + b} ${BED.x1 - 80} ${BED.top - 16}`} stroke="#fff" strokeWidth={8} fill="none" opacity={0.7} strokeLinecap="round" />
      <path d={`M ${x0 + 120} ${BED.top + 20} L ${x0 + 100} ${BED.front - 50} M ${x0 + 320} ${BED.top + 10} L ${x0 + 310} ${BED.front - 50}`} stroke="#B9C6D8" strokeWidth={4} opacity={0.7} />
    </g>
  );
};

/** A boarding pass about 1000 x 400 (centre at 0, 0): header band, plane icon, seat and gate, the price, a barcode on the stub. */
export const Ticket: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-500} y={-200} width={1000} height={400} rx={30} fill="#F6F1E6" stroke="#B5AB95" strokeWidth={5} />
    <path d="M -500 -170 Q -500 -200 -470 -200 L 470 -200 Q 500 -200 500 -170 L 500 -110 L -500 -110 Z" fill="#2F6AB8" />
    <text x={-460} y={-135} fontFamily={FONT.ui} fontWeight={700} fontSize={44} fill="#FFFFFF" letterSpacing={6}>VÉ MÁY BAY</text>
    <g transform={`translate(${380 + Math.sin(t / 8) * 6} -150) rotate(-18)`} fill="#fff">
      <path d="M -50 0 L 40 -8 Q 62 -6 64 0 Q 62 6 40 8 L -50 14 L -62 30 L -72 30 L -64 10 L -92 10 L -100 22 L -108 22 L -104 4 L -104 -4 L -108 -22 L -100 -22 L -92 -10 L -64 -10 L -72 -30 L -62 -30 Z" />
    </g>
    <text x={-460} y={-40} fontFamily={FONT.ui} fontSize={30} fill="#7A7468" letterSpacing={3}>GHẾ</text>
    <text x={-460} y={10} fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#2A2A30">12A</text>
    <text x={-250} y={-40} fontFamily={FONT.ui} fontSize={30} fill="#7A7468" letterSpacing={3}>CỔNG</text>
    <text x={-250} y={10} fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill="#2A2A30">07</text>
    <path d="M -460 70 Q -300 30 -120 70" stroke="#B5AB95" strokeWidth={4} strokeDasharray="12 10" fill="none" />
    <text x={-460} y={160} fontFamily={FONT.ui} fontWeight={700} fontSize={78} fill={SCH.live}>2.000.000 đ</text>
    <path d="M 270 -110 L 270 200" stroke="#B5AB95" strokeWidth={4} strokeDasharray="10 10" />
    {Array.from({ length: 22 }).map((_, i) => <rect key={i} x={300 + i * 8.5} y={-70} width={2 + rnd(3, i) * 4} height={190} fill="#2A2A30" />)}
  </g>
);
