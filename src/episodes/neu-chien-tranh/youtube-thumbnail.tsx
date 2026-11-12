import React from 'react';
import { KitDefs, SetDefs, Hero, HEAD, basePose, LOOKS, Glow, Street, FONT, joints, toWorld } from '../../engine';
import { HookText } from '../../channel/channel-branding';

// The YouTube thumbnail for "Sẽ ra sao nếu chiến tranh ập đến?": the VN street at dusk washed red, thin smoke columns
// far on the horizon (no combat), Pip big on the right, shocked, holding a phone flashing a red emergency alert;
// ONE hook phrase.   npx remotion still src/index.ts IfWarThumbnail out/neu-chien-tranh/thumbnail-1920.png

const INK = '#14121C';

const AlertPhone: React.FC<{ x: number; y: number; w: number; rot: number }> = ({ x, y, w, rot }) => {
  const h = w * 2.05;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} style={{ filter: 'drop-shadow(0 0 40px rgba(255,60,50,0.8))' }}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill="#16151C" stroke="#3A3846" strokeWidth={6} />
      <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={w * 0.1} fill="#C8141F" />
      <path d={`M 0 ${-h * 0.3} L ${w * 0.24} ${-h * 0.12} L ${-w * 0.24} ${-h * 0.12} Z`} fill="#FFD23F" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <rect x={-w * 0.02} y={-h * 0.26} width={w * 0.04} height={h * 0.08} rx={w * 0.02} fill={INK} />
      <text x={0} y={h * 0.04} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.12} fill="#FFF4E0">CẢNH BÁO</text>
      <text x={0} y={h * 0.04 + w * 0.15} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={w * 0.12} fill="#FFF4E0">KHẨN CẤP</text>
    </g>
  );
};

/** A thin dark smoke column rising from the far horizon. */
const Smoke: React.FC<{ x: number; base: number; h: number; s: number }> = ({ x, base, h, s }) => (
  <g opacity={0.75}>
    {Array.from({ length: 9 }).map((_, i) => (
      <circle key={i} cx={x + Math.sin(i * 1.3) * 18 * s + i * i * 1.6 * s} cy={base - (i * h) / 9} r={(14 + i * 7) * s} fill="#1E141B" opacity={0.95 - i * 0.06} />
    ))}
  </g>
);

export const IfWarThumbnail: React.FC = () => {
  const sc = 2.6;
  const pip = { ...basePose, x: 1500, y: 580 - HEAD.y * sc, scale: sc, yaw: -0.3, look: -0.2, armL: { a: 20, b: 8 }, armR: { a: 40, b: 105 }, expr: 'shock' as const };
  const hand = toWorld(pip, joints(pip).armR.end);
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080}>
      <KitDefs />
      <SetDefs />
      <Street t={40} id="thumbwar" />
      <rect x={0} y={0} width={1920} height={1080} fill="#7A0E18" opacity={0.42} style={{ mixBlendMode: 'multiply' }} />
      <Smoke x={930} base={500} h={200} s={1.5} />
      <Smoke x={1120} base={500} h={170} s={1.2} />
      <Glow x={1500} y={480} r={600} o={0.35} />
      <Hero look={LOOKS.pipHood} pose={pip} rimId="rimR" shadow={0} />
      <AlertPhone x={hand.x + 10} y={hand.y - 150} w={190} rot={-8} />
      <HookText lines={['CHIẾN TRANH', 'ẬP ĐẾN']} y={300} size={176} />
    </svg>
  );
};
