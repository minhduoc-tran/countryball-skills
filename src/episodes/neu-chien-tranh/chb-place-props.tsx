import React from 'react';
import { FONT, backOut, clamp, easeOut, easeIn, rnd, Glow } from '../../engine';

// Chapter B local props for "week one": a school gate that closes and gets padlocked, a factory front whose roller
// gate comes down under a "TẠM NGỪNG" sign, a dry tap, a water bottle and glass, a bowl of rice seen from above.
// Everything is a pure function of the shot clock or of a 0..1 progress passed in.
//   <SchoolGate t close id />   1920 x 1080 backdrop, `close` 0..1 slides the two leaves shut, the padlock after
//   <FactoryFront t run close id />   backdrop: `run` 0..1 smoke, `close` 0..1 roller gate down, sign swings in at close 1
//   <Faucet x y s t />   <WaterBottle x y s rot fill />   <GlassCup x y s fill />   <BowlTop x y r fill />

const INK = '#12101C';

export const SchoolGate: React.FC<{ t: number; close: number; id: string }> = ({ t, close, id }) => {
  const p = easeOut(clamp(close));
  const lock = clamp((close - 0.92) / 0.08);
  const swing = lock < 1 ? Math.sin(t * 0.6) * 5 * (1 - lock) : 0;
  const leaf = (x0: number, dir: 1 | -1) => {
    const w = 400 * p;
    const x1 = x0 + dir * w;
    const bars = Math.max(1, Math.round(w / 36));
    return (
      <g>
        {w > 6 ? <rect x={Math.min(x0, x1)} y={560} width={w} height={14} fill="#2A2A38" stroke={INK} strokeWidth={3} /> : null}
        {w > 6 ? <rect x={Math.min(x0, x1)} y={800} width={w} height={14} fill="#2A2A38" stroke={INK} strokeWidth={3} /> : null}
        {Array.from({ length: bars + 1 }).map((_, i) => {
          const bx = x0 + dir * (w * (i / bars));
          return <path key={i} d={`M ${bx} 540 L ${bx} 830`} stroke="#3A3A4C" strokeWidth={9} strokeLinecap="round" />;
        })}
      </g>
    );
  };
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5A6A8C" /><stop offset="1" stopColor="#C4A99A" /></linearGradient>
        <linearGradient id={`${id}gr`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A6470" /><stop offset="1" stopColor="#3A3646" /></linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1500} fill={`url(#${id}sky)`} />
      {/* the school behind the gate: two floors, a doorway, windows, a roof, a signboard (no flag) */}
      <rect x={380} y={250} width={1160} height={400} fill="#D8C7A6" stroke={INK} strokeWidth={6} />
      <polygon points="350,250 960,150 1570,250" fill="#8A4A44" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={760} y={190} width={400} height={64} rx={8} fill="#2E5A8C" stroke={INK} strokeWidth={5} />
      <text x={960} y={238} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={42} fill="#F6EFE3" letterSpacing={6}>TRƯỜNG</text>
      {[0, 1].map((r) => [0, 1, 2, 3, 4, 5].map((c) => c !== 2 && c !== 3 || r === 0 ? (
        <rect key={`${r}${c}`} x={430 + c * 185} y={300 + r * 160} width={110} height={100} rx={6} fill="#26324E" stroke={INK} strokeWidth={4} />
      ) : null))}
      <rect x={880} y={470} width={160} height={180} rx={10} fill="#4A3030" stroke={INK} strokeWidth={5} />
      <rect x={380} y={650} width={1160} height={14} fill="#A8998A" />
      <rect x={-300} y={664} width={2520} height={600} fill={`url(#${id}gr)`} />
      <ellipse cx={960} cy={810} rx={520} ry={30} fill="#000" opacity={0.2} />
      {/* brick pillars */}
      {[480, 1440].map((px) => (
        <g key={px}>
          <rect x={px - 55} y={470} width={110} height={400} fill="#9A5A48" stroke={INK} strokeWidth={5} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((r) => <path key={r} d={`M ${px - 55} ${500 + r * 48} H ${px + 55}`} stroke="#6E3E32" strokeWidth={3} />)}
          <rect x={px - 66} y={452} width={132} height={26} fill="#B8A090" stroke={INK} strokeWidth={4} />
        </g>
      ))}
      {leaf(535, 1)}
      {leaf(1385, -1)}
      {/* chain and padlock where the leaves meet */}
      {lock > 0 ? (
        <g transform={`translate(960 690) rotate(${swing})`} opacity={lock}>
          <path d="M -90 -40 Q 0 20 90 -40" stroke="#8C90A0" strokeWidth={9} fill="none" strokeLinecap="round" strokeDasharray="22 8" />
          <path d="M -26 10 V -22 A 26 26 0 0 1 26 -22 V 10" stroke="#B8BCC8" strokeWidth={10} fill="none" />
          <rect x={-46} y={8} width={92} height={78} rx={14} fill="#D9A441" stroke={INK} strokeWidth={5} />
          <circle cx={0} cy={44} r={9} fill={INK} />
          <rect x={-4} y={48} width={8} height={20} rx={3} fill={INK} />
          <path d="M -36 18 Q -36 14 -28 14" stroke="#FFF1B8" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      ) : null}
      {lock > 0 && lock < 1 ? <Glow x={960} y={730} r={160 * lock} o={0.4} /> : null}
    </g>
  );
};

export const FactoryFront: React.FC<{ t: number; run: number; close: number; id: string }> = ({ t, run, close, id }) => {
  const c = easeIn(clamp(close));
  const sign = backOut(clamp((close - 0.98) * 20)) * (close >= 0.98 ? 1 : 0);
  const swing = sign > 0 ? Math.sin(t * 0.4) * 5 : 0;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6A5A7C" /><stop offset="1" stopColor="#D49A78" /></linearGradient>
        <linearGradient id={`${id}wall`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7A8296" /><stop offset="1" stopColor="#5A6076" /></linearGradient>
      </defs>
      <rect x={-300} y={-300} width={2520} height={1500} fill={`url(#${id}sky)`} />
      {/* chimneys with smoke while it runs */}
      {[560, 700].map((cx, k) => (
        <g key={cx}>
          <rect x={cx - 34} y={80 + k * 40} width={68} height={330 - k * 40} fill="#8A5A50" stroke={INK} strokeWidth={5} />
          <rect x={cx - 34} y={80 + k * 40} width={68} height={22} fill="#C8C0B8" />
          {run > 0.02 ? [0, 1, 2, 3].map((i) => {
            const ph = ((t * 0.9 + i * 22 + k * 11) % 88) / 88;
            return <circle key={i} cx={cx + ph * 70 + Math.sin(i + t / 20) * 8} cy={70 + k * 40 - ph * 180} r={34 + ph * 46} fill="#EFE8F2" opacity={0.55 * run * (1 - ph)} />;
          }) : null}
        </g>
      ))}
      {/* the hall: sawtooth roof, corrugated wall, a row of windows */}
      <polygon points="260,420 260,300 460,360 460,300 660,360 660,300 860,360 860,300 1060,360 1060,300 1260,360 1260,300 1460,360 1460,420" fill="#4A5068" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={260} y={420} width={1200} height={400} fill={`url(#${id}wall)`} stroke={INK} strokeWidth={6} />
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${280 + i * 40} 424 V 816`} stroke="#000" strokeWidth={3} opacity={0.14} />)}
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={300 + i * 100} y={460} width={70} height={46} rx={4} fill="#26324E" stroke={INK} strokeWidth={3} />)}
      {/* roller gate */}
      <rect x={880} y={470} width={470} height={350} fill="#1C1A26" stroke={INK} strokeWidth={6} />
      <rect x={880} y={470} width={470} height={350 * c} fill="#8A8EA0" stroke={INK} strokeWidth={4} />
      {Array.from({ length: 12 }).map((_, i) => (350 * c > i * 30 + 6 ? <path key={i} d={`M 884 ${470 + i * 30} H 1346`} stroke="#5A5E72" strokeWidth={4} /> : null))}
      {c > 0.05 ? <rect x={880} y={470 + 350 * c - 14} width={470} height={14} fill="#4A4E62" stroke={INK} strokeWidth={3} /> : null}
      {/* the sign */}
      {sign > 0 ? (
        <g transform={`translate(1115 520) rotate(${swing}) scale(${sign})`}>
          <path d="M -90 0 L -50 56 M 90 0 L 50 56" stroke="#2A2A38" strokeWidth={5} />
          <rect x={-190} y={52} width={380} height={130} rx={12} fill="#C8202F" stroke="#FFF4E0" strokeWidth={7} />
          <text x={0} y={134} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill="#FFF4E0" letterSpacing={3}>TẠM NGỪNG</text>
        </g>
      ) : null}
      <rect x={-300} y={820} width={2520} height={500} fill="#4A4658" />
      <rect x={-300} y={820} width={2520} height={8} fill="#2A2634" />
    </g>
  );
};

/** A gooseneck tap standing on the counter, dry, with a drip that forms and falls every ~34 frames. x, y: the spout's mouth. */
export const Faucet: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const ph = (t % 34) / 34;
  const grow = ph < 0.5 ? 0.3 + ph * 1.2 : 0;
  const fall = ph >= 0.5 ? easeIn((ph - 0.5) / 0.5) : 0;
  const d = 'M -150 270 L -150 -30 Q -150 -112 -76 -112 L -22 -112 Q 0 -112 0 -90 L 0 -22';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={-146} cy={282} rx={74} ry={12} fill="#000" opacity={0.4} />
      <rect x={-196} y={248} width={92} height={34} rx={10} fill="#8C92A4" stroke={INK} strokeWidth={4} />
      <path d={d} fill="none" stroke={INK} strokeWidth={54} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#B9BDC8" strokeWidth={42} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -158 250 L -158 -26 Q -158 -104 -80 -104 L -26 -104" fill="none" stroke="#EEF1F6" strokeWidth={10} strokeLinecap="round" opacity={0.75} />
      <rect x={-26} y={-30} width={52} height={26} rx={8} fill="#8C92A4" stroke={INK} strokeWidth={4} />
      {ph < 0.5 ? (
        <path d={`M 0 0 Q ${14 * grow} ${30 * grow} 0 ${46 * grow} Q ${-14 * grow} ${30 * grow} 0 0 Z`} fill="#9AD8FF" />
      ) : (
        <ellipse cx={0} cy={40 + fall * 300} rx={9} ry={14} fill="#9AD8FF" opacity={1 - fall * 0.5} />
      )}
    </g>
  );
};

/** A plastic water bottle (blue cap, label), standing with its base at (x, y); `rot` tips it about the base, `fill` 0..1 how full. */
export const WaterBottle: React.FC<{ x: number; y: number; s?: number; rot?: number; fill?: number }> = ({ x, y, s = 1, rot = 0, fill = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -46 0 Q -50 -10 -48 -120 Q -48 -170 -22 -196 L -22 -226 H 22 L 22 -196 Q 48 -170 48 -120 Q 50 -10 46 0 Z" fill="#CFEFFF" opacity={0.55} stroke="#E8F7FF" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -43 -2 Q -47 -10 -45 -110 L 45 -110 Q 47 -10 43 -2 Z" fill="#5AB8FF" opacity={0.6 * clamp(fill * 1.2)} transform={`translate(0 ${(1 - fill) * -60}) scale(1 ${0.5 + 0.5 * fill})`} />
    <rect x={-48} y={-132} width={96} height={52} fill="#2E7CC8" opacity={0.9} />
    <path d="M -48 -112 q 24 -12 48 0 t 48 0" stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.7} />
    <rect x={-24} y={-250} width={48} height={26} rx={6} fill="#2E7CC8" stroke={INK} strokeWidth={4} />
    <path d="M -34 -150 Q -38 -60 -34 -8" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.45} strokeLinecap="round" />
  </g>
);

export const GlassCup: React.FC<{ x: number; y: number; s?: number; fill?: number }> = ({ x, y, s = 1, fill = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 -110 L -32 0 H 32 L 40 -110 Z" fill="#CFEFFF" opacity={0.3} stroke="#E8F7FF" strokeWidth={4} strokeLinejoin="round" />
    <path d={`M ${-34 + 6 * (1 - fill)} ${-100 * fill} L -31 -2 H 31 L ${34 - 6 * (1 - fill)} ${-100 * fill} Z`} fill="#5AB8FF" opacity={fill > 0 ? 0.75 : 0} />
    <path d="M -30 -100 L -26 -10" stroke="#FFFFFF" strokeWidth={5} opacity={0.5} strokeLinecap="round" />
  </g>
);

/** A bowl seen from above: ceramic ring, a mound of rice filling `fill` 0..1 of the bowl (grain flecks), steam is the shot's job. */
export const BowlTop: React.FC<{ x: number; y: number; r?: number; fill?: number; seed?: number }> = ({ x, y, r = 150, fill = 1, seed = 1 }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={10} cy={14} rx={r * 1.02} ry={r * 0.98} fill="#000" opacity={0.35} />
    <circle r={r} fill="#E8E2D6" stroke={INK} strokeWidth={5} />
    <circle r={r * 0.84} fill="#B9AE9C" />
    <circle r={r * 0.78} fill="#4A3A34" />
    {fill > 0.02 ? (
      <g>
        <circle r={r * 0.74 * Math.sqrt(clamp(fill))} fill="#FFFDF6" />
        <circle cx={-r * 0.1} cy={-r * 0.1} r={r * 0.5 * Math.sqrt(clamp(fill))} fill="#FFFFFF" opacity={0.8} />
        {Array.from({ length: 22 }).map((_, i) => {
          const a = rnd(seed, i) * 6.28;
          const d = Math.sqrt(rnd(seed + 3, i)) * r * 0.68 * Math.sqrt(clamp(fill));
          return <ellipse key={i} cx={Math.cos(a) * d} cy={Math.sin(a) * d} rx={5} ry={2.6} fill="#E6DCC4" transform={`rotate(${rnd(seed + 6, i) * 180} ${Math.cos(a) * d} ${Math.sin(a) * d})`} />;
        })}
      </g>
    ) : null}
    <path d={`M ${-r * 0.9} ${-r * 0.3} A ${r} ${r} 0 0 1 ${-r * 0.3} ${-r * 0.9}`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
  </g>
);
