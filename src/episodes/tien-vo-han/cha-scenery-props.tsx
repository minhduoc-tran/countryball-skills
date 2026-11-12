import React from 'react';
import { FONT, clamp, easeOut, backOut, rnd, Glow } from '../../engine';

// Chapter A, scenery and paper: a small tropical island in a blue sea, the "ĐÃ BÁN" sign, the morning gate with a
// mailbox, a plain envelope, the handwritten note, a drink-stall counter. Pure functions of the shot clock t.

/** A daytime tropical sea with a small green island, filling 0..1920 x 1080. `sold` 0..1 plants the ĐÃ BÁN sign. */
export const IslandScene: React.FC<{ id: string; t: number; sold?: number }> = ({ id, t, sold = 0 }) => {
  const H = 470;
  const wave = (i: number) => {
    const y = H + 40 + i * 70 + i * i * 7;
    const ph = t * (0.07 + i * 0.012) + i * 2;
    return `M -60 ${y} ` + Array.from({ length: 22 }).map((_, k) => `Q ${k * 100 + 25 + Math.sin(ph) * 14} ${y - 9 - i * 1.5} ${k * 100 + 50} ${y}`).join(' ');
  };
  const palm = (x: number, y: number, s: number, lean: number, ph: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M 0 0 Q ${lean * 0.4} -70 ${lean} -150`} stroke="#6B4A2A" strokeWidth={13} fill="none" strokeLinecap="round" />
      {[-70, -35, 0, 35, 70, 105, -105].map((a, i) => (
        <path key={i} d={`M ${lean} -150 q ${Math.sin(((a + Math.sin(t / 20 + ph + i) * 4) * Math.PI) / 180) * 70} ${-30 - Math.abs(a) * 0.12} ${Math.sin((a * Math.PI) / 180) * 110} ${10 + Math.abs(a) * 0.3}`} stroke="#2F8A4A" strokeWidth={14} fill="none" strokeLinecap="round" />
      ))}
      <circle cx={lean - 6} cy={-146} r={8} fill="#5A3A20" /><circle cx={lean + 8} cy={-142} r={8} fill="#5A3A20" />
    </g>
  );
  const sp = easeOut(clamp(sold));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4DA8E6" /><stop offset="1" stopColor="#BFE6F6" /></linearGradient>
        <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#35B9D2" /><stop offset="1" stopColor="#0E6E9C" /></linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={H + 300} fill={`url(#${id}sky)`} />
      <circle cx={1500} cy={150} r={70} fill="#FFF4C2" /><Glow x={1500} y={150} r={420} o={0.5} />
      {[[300, 150, 1], [900, 90, 0.7], [1250, 220, 0.8]].map(([cx, cy, k], i) => (
        <g key={i} transform={`translate(${cx + Math.sin(t / 90 + i) * 30} ${cy}) scale(${k})`} fill="#fff" opacity={0.9}>
          <ellipse cx={0} cy={0} rx={120} ry={30} /><ellipse cx={-50} cy={-22} rx={60} ry={30} /><ellipse cx={30} cy={-30} rx={70} ry={34} />
        </g>
      ))}
      <rect x={-300} y={H} width={2520} height={900} fill={`url(#${id}sea)`} />
      {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={wave(i)} stroke="#E8FBFF" strokeWidth={3 + i * 0.6} fill="none" opacity={0.35 + i * 0.07} />)}
      <g transform={`translate(0 ${Math.sin(t / 24) * 3})`}>
        <ellipse cx={960} cy={668} rx={420} ry={34} fill="#0A5C80" opacity={0.5} />
        <path d="M 540 650 Q 620 540 760 510 Q 860 440 960 450 Q 1100 440 1190 520 Q 1310 550 1380 650 Q 960 700 540 650 Z" fill="#3E9E4A" stroke="#1F6A33" strokeWidth={4} />
        <path d="M 640 600 Q 760 560 840 540 Q 940 500 1040 520 Q 1180 540 1280 590" stroke="#63C163" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />
        <path d="M 520 654 Q 960 722 1400 654 Q 1380 690 960 706 Q 540 690 520 654 Z" fill="#F2D89A" stroke="#B89A58" strokeWidth={3} />
        {palm(780, 560, 1.0, -30, 1)}{palm(1090, 520, 1.2, 36, 2)}{palm(960, 480, 0.9, 8, 3)}
        <path d="M 1180 640 q 20 -24 44 -2" stroke="#fff" strokeWidth={3} fill="none" opacity={0.5} />
      </g>
      {/* the sold sign, planted on the sand with a bounce */}
      {sold > 0 ? (
        <g transform={`translate(1140 690) scale(${backOut(clamp(sp)) * 1.0}) rotate(${(1 - sp) * -20})`}>
          <rect x={-5} y={-170} width={10} height={170} fill="#6B4A2A" />
          <rect x={-130} y={-260} width={260} height={110} rx={10} fill="#D9433A" stroke="#7A1C16" strokeWidth={5} />
          <text x={0} y={-182} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#FFF3DC" letterSpacing={3}>ĐÃ BÁN</text>
        </g>
      ) : null}
      {Array.from({ length: 3 }).map((_, i) => (
        <path key={i} d="M -14 0 q 14 -14 28 0 q 14 -14 28 0" transform={`translate(${(300 + i * 260 + t * (1.4 + i * 0.4)) % 2100 - 100} ${220 + i * 50}) `} stroke="#2A2E48" strokeWidth={4} fill="none" />
      ))}
    </g>
  );
};

/** The morning gate: pale wall, a green iron gate, a brick post carrying the mailbox (box centre MAIL), vines, sun. */
export const MAIL = { x: 1330, y: 500 };
export const GateScene: React.FC<{ id: string; t: number; flag?: number; door?: number }> = ({ id, t, flag = 0, door = 0 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#EBD3A8" /><stop offset="1" stopColor="#C9A877" /></linearGradient>
      <linearGradient id={`${id}sun`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE9B0" stopOpacity={0.6} /><stop offset="1" stopColor="#FFE9B0" stopOpacity={0} /></linearGradient>
    </defs>
    <rect x={-300} y={-200} width={2520} height={1100} fill={`url(#${id}wall)`} />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={rnd(5, i) * 1900} y={rnd(6, i) * 760} width={70 + rnd(7, i) * 90} height={14} rx={7} fill="#B8956A" opacity={0.25} />)}
    <rect x={-300} y={800} width={2520} height={400} fill="#8E7A6A" />
    <rect x={-300} y={800} width={2520} height={16} fill="#6A5A4E" />
    {/* the gate */}
    <rect x={150} y={290} width={900} height={512} fill="#14352A" opacity={0.25} />
    {Array.from({ length: 19 }).map((_, i) => (
      <g key={i}><rect x={170 + i * 46} y={310} width={12} height={490} fill="#2C6A4C" stroke="#14352A" strokeWidth={2} /><path d={`M ${176 + i * 46} 300 l -9 14 h 18 Z`} fill="#2C6A4C" stroke="#14352A" strokeWidth={2} /></g>
    ))}
    <rect x={150} y={420} width={900} height={14} fill="#2C6A4C" stroke="#14352A" strokeWidth={2} />
    <rect x={150} y={700} width={900} height={14} fill="#2C6A4C" stroke="#14352A" strokeWidth={2} />
    <rect x={1060} y={250} width={30} height={560} fill="#7A3B2A" />
    {/* brick post with mailbox */}
    <rect x={1190} y={190} width={300} height={612} fill="#A8543A" stroke="#6A3020" strokeWidth={4} />
    {Array.from({ length: 12 }).map((_, r) => <path key={r} d={`M 1190 ${230 + r * 50} H 1490`} stroke="#6A3020" strokeWidth={2} opacity={0.5} />)}
    <rect x={1170} y={160} width={340} height={36} fill="#8A4630" stroke="#6A3020" strokeWidth={4} />
    <g transform={`translate(${MAIL.x} ${MAIL.y})`}>
      <ellipse cx={0} cy={86} rx={110} ry={10} fill="#000" opacity={0.25} />
      <rect x={-96} y={-62} width={192} height={130} rx={14} fill="#D9433A" stroke="#7A1C16" strokeWidth={5} />
      <rect x={-96} y={-62} width={192} height={26} rx={12} fill="#EE6A5E" />
      <rect x={-60} y={-12} width={120} height={14} rx={7} fill="#3A0E0A" />
      <rect x={-70} y={24} width={140} height={28} rx={4} fill="#F6EFE3" opacity={0.9} />
      <text x={0} y={46} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={19} fill="#7A1C16" letterSpacing={3}>HỘP THƯ</text>
      {door > 0.05 ? (
        <g>
          <rect x={-86} y={-52} width={172} height={110} rx={8} fill="#2A0F0C" />
          <path d={`M -96 68 h 192 l -12 ${110 * door} h -168 Z`} fill="#B8352D" stroke="#7A1C16" strokeWidth={4} />
        </g>
      ) : null}
      <g transform={`translate(96 -30) rotate(${-90 * flag})`}><rect x={-6} y={-80} width={12} height={80} fill="#F2C94C" stroke="#7A5A10" strokeWidth={3} /><rect x={-6} y={-80} width={44} height={26} fill="#F2C94C" stroke="#7A5A10" strokeWidth={3} /></g>
    </g>
    {/* vines + sun leak */}
    {Array.from({ length: 9 }).map((_, i) => (
      <g key={i} transform={`translate(${60 + i * 220} ${-10}) rotate(${Math.sin(t / 40 + i) * 1.5})`}>
        <path d={`M 0 0 Q ${20 + rnd(1, i) * 30} 90 ${-10} ${130 + rnd(2, i) * 90}`} stroke="#2F6A3A" strokeWidth={6} fill="none" />
        {[0.35, 0.6, 0.85].map((u, k) => <circle key={k} cx={rnd(3, i + k) * 30} cy={u * (130 + rnd(2, i) * 90)} r={16 + k * 3} fill={['#E8508C', '#F07AAA', '#D43A7C'][k]} opacity={0.9} />)}
      </g>
    ))}
    <polygon points="1500,-100 1900,-100 1000,1000 560,1000" fill={`url(#${id}sun)`} style={{ mixBlendMode: 'screen' }} opacity={0.5 + 0.1 * Math.sin(t / 30)} />
  </g>
);

/** A plain cream envelope, no writing; centre (x, y), 300 x 190 at s = 1. `open` 0..1 lifts the flap. */
export const Envelope: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => {
  const fl = clamp(open);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-146} y={-86} width={300} height={190} rx={8} fill="#000" opacity={0.28} />
      <rect x={-150} y={-95} width={300} height={190} rx={8} fill="#EFE3C8" stroke="#A8946A" strokeWidth={4} />
      {fl > 0.02 ? <path d="M -150 -95 L 0 -90 L 150 -95 L 150 -95 Z" fill="#D9C8A6" /> : null}
      <path d="M -150 95 L -30 -10 M 150 95 L 30 -10" stroke="#C9B58A" strokeWidth={3} fill="none" />
      <g transform={`translate(0 -95) scale(1 ${1 - 2 * fl})`}>
        <path d="M -150 0 L 0 105 L 150 0 Z" fill={fl > 0.5 ? '#D9C8A6' : '#E6D7B8'} stroke="#A8946A" strokeWidth={4} strokeLinejoin="round" />
      </g>
    </g>
  );
};

/** The note: cream paper with fold creases, "KHÔNG GIỚI HẠN" in handwriting, each word wiping on (p1..p3 0..1). */
export const Note: React.FC<{ id: string; x: number; y: number; s?: number; rot?: number; words?: [number, number, number] }> = ({ id, x, y, s = 1, rot = 0, words = [1, 1, 1] }) => {
  const W = ['KHÔNG', 'GIỚI', 'HẠN'];
  const xs = [-172, 48, 220];
  const widths = [250, 180, 170];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-306} y={-146} width={620} height={300} rx={8} fill="#000" opacity={0.28} />
      <rect x={-320} y={-160} width={640} height={300} rx={8} fill="#F6EFD8" stroke="#B8A67A" strokeWidth={3} />
      <path d="M -320 -10 H 320 M 0 -160 V 140" stroke="#DCCFA8" strokeWidth={3} />
      <defs>
        {W.map((_, i) => <clipPath key={i} id={`${id}w${i}`}><rect x={xs[i] - widths[i] / 2} y={-120} width={widths[i] * clamp(words[i])} height={200} /></clipPath>)}
      </defs>
      {W.map((w, i) => (
        <g key={w} clipPath={`url(#${id}w${i})`}>
          <text x={xs[i]} y={20} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={70} fill="#2A2640" transform={`rotate(${i === 1 ? -2 : 1} ${xs[i]} 0)`}>{w}</text>
        </g>
      ))}
      {words[2] >= 1 ? <path d="M -300 56 Q -80 76 160 52 T 300 62" stroke="#D9433A" strokeWidth={6} fill="none" strokeLinecap="round" /> : null}
    </g>
  );
};

/**
 * A phone showing the generic bank app, centre (x, y), 300 wide x 610 tall at s = 1. `check` 0..1 is the verifying
 * progress (spinner then a green tick row), `bal` 0..1 brings in "SỐ DƯ: ∞".
 */
export const BankPhone: React.FC<{ x: number; y: number; s?: number; rot?: number; check?: number; bal?: number; t?: number }> = ({ x, y, s = 1, rot = 0, check = 0, bal = 0, t = 0 }) => {
  const done = check >= 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-142} y={-290} width={300} height={610} rx={48} fill="#000" opacity={0.35} />
      <rect x={-150} y={-305} width={300} height={610} rx={48} fill="#16151C" stroke="#3A3846" strokeWidth={5} />
      <rect x={-134} y={-289} width={268} height={578} rx={36} fill="#F2F5F4" />
      <rect x={-134} y={-289} width={268} height={86} rx={36} fill="#1E8F5A" />
      <rect x={-134} y={-240} width={268} height={37} fill="#1E8F5A" />
      <text x={0} y={-228} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill="#EFFFF5" letterSpacing={3}>NGÂN HÀNG</text>
      <rect x={-110} y={-170} width={220} height={92} rx={14} fill="#fff" stroke="#CFDAD4" strokeWidth={3} />
      {done ? (
        <g>
          <circle cx={-76} cy={-124} r={22} fill={'#2FBF71'} />
          <path d="M -87 -123 l 8 9 l 16 -18" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x={-44} y={-132} fontFamily={FONT.ui} fontWeight={700} fontSize={15} fill="#1E5A3A">KIỂM TRA:</text>
          <text x={-44} y={-110} fontFamily={FONT.ui} fontWeight={700} fontSize={19} fill="#1E8F5A">HỢP LỆ ✓</text>
        </g>
      ) : (
        <g>
          <circle cx={-72} cy={-124} r={20} fill="none" stroke="#CFDAD4" strokeWidth={6} />
          <path d="M -72 -144 A 20 20 0 0 1 -52 -124" stroke="#1E8F5A" strokeWidth={6} fill="none" strokeLinecap="round" transform={`rotate(${t * 18} -72 -124)`} />
          <text x={-40} y={-118} fontFamily={FONT.ui} fontWeight={700} fontSize={16} fill="#4A5A52">ĐANG KIỂM TRA{'.'.repeat(1 + (Math.floor(t / 6) % 3))}</text>
        </g>
      )}
      {check > 0 && !done ? <rect x={-110} y={-86} width={220 * clamp(check)} height={6} rx={3} fill="#1E8F5A" /> : null}
      <rect x={-110} y={-52} width={220} height={150} rx={14} fill="#1B1A24" opacity={bal > 0 ? 1 : 0.12} />
      {bal > 0 ? (
        <g transform={`translate(0 24) scale(${backOut(clamp(bal * 1.6))})`}>
          <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#9FB0A8" letterSpacing={3}>SỐ DƯ</text>
          <text x={0} y={46} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={104} fill="#F2C94C">∞</text>
        </g>
      ) : null}
      <rect x={-110} y={118} width={220} height={26} rx={13} fill="#DDE6E2" /><rect x={-110} y={158} width={150} height={26} rx={13} fill="#DDE6E2" />
      <rect x={-34} y={256} width={68} height={7} rx={3.5} fill="#9AA6A0" />
    </g>
  );
};

/** A drink-stall back wall and counter (dusk street side), counter top line at y 720; fills 0..1920 x 0..1080. */
export const DrinkStall: React.FC<{ id: string; t: number; behind?: React.ReactNode }> = ({ id, t, behind }) => (
  <g>
    <defs>
      <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3A2A58" /><stop offset="0.6" stopColor="#6A3A5A" /><stop offset="1" stopColor="#2A2038" /></linearGradient>
    </defs>
    <rect x={-300} y={-200} width={2520} height={1500} fill={`url(#${id}bg)`} />
    {/* awning */}
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${i * 150 - 60} 60 h 150 v 120 q -75 36 -150 0 Z`} fill={i % 2 ? '#F6EFE3' : '#3E8C86'} stroke="#1A1230" strokeWidth={3} />)}
    {/* menu board (generic) */}
    <rect x={1260} y={250} width={420} height={250} rx={12} fill="#1E1A2C" stroke="#7A6A9A" strokeWidth={5} />
    <text x={1470} y={320} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFD9A0" letterSpacing={4}>TRÀ SỮA</text>
    {[0, 1, 2].map((i) => <rect key={i} x={1300} y={356 + i * 40} width={200 - i * 30} height={12} rx={6} fill="#8A7AAA" opacity={0.7} />)}
    <g transform="translate(1590 410)"><circle r={34} fill="#C9966A" /><circle r={34} fill="none" stroke="#fff" strokeWidth={4} opacity={0.5} /></g>
    {/* shelves with cups + dispenser */}
    <rect x={220} y={330} width={620} height={14} fill="#6A5A7A" />
    {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${250 + i * 50} 330 l 5 -64 h 34 l 5 64 Z`} fill="#E7F2F4" opacity={0.7} />)}
    <rect x={900} y={300} width={190} height={310} rx={16} fill="#B8C4CC" stroke="#5A6A74" strokeWidth={4} />
    <rect x={920} y={324} width={150} height={120} rx={10} fill="#C9966A" opacity={0.85} />
    <circle cx={995} cy={500} r={14} fill="#4A5A64" />
    {/* string lights */}
    <path d="M -20 230 Q 480 330 960 240 T 1940 250" stroke="#2A2038" strokeWidth={4} fill="none" />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = 60 + i * 140;
      return <g key={i}><circle cx={x} cy={262 + Math.sin(i * 0.9) * 22} r={11} fill="#FFD9A0" /><Glow x={x} y={262 + Math.sin(i * 0.9) * 22} r={70} o={0.35 + 0.1 * Math.sin(t / 8 + i)} /></g>;
    })}
    {behind}
    {/* counter */}
    <rect x={-300} y={720} width={2520} height={500} fill="#4A3A34" />
    <rect x={-300} y={706} width={2520} height={34} fill="#8A6A52" /><rect x={-300} y={706} width={2520} height={8} fill="#B08A68" />
    <rect x={120} y={780} width={1680} height={260} rx={6} fill="#3A2E2A" opacity={0.7} />
  </g>
);
