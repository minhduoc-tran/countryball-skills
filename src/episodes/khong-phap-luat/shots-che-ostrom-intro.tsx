import React from 'react';
import { kf, clamp, easeOut, backOut, camT, Glow, FONT, Sparkle, Dust, ShotProps } from '../../engine';
import { SketchPaper, OstromPortrait, NameLabel, NobelMedal } from './che-ostrom-portrait-and-medal';
import { Tiny, SHIRTS, SKINS } from './che-tiny-people';

// Chapter E, "6 month one: ostrom" opening (220.5-225.7 s), look "memory": E1 the portrait sketch with her name,
// E2 the Nobel medal and the year rolling to 2009, E3 the sketched proof: villagers around one shared pot, a tick.

/** A taped paper card with the sketch inside (clipped to the card). */
const Card: React.FC<{ id: string; x: number; y: number; w: number; h: number; rot?: number; children: React.ReactNode }> = ({ id, x, y, w, h, rot = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2 + 14} y={-h / 2 + 18} width={w} height={h} rx={10} fill="#000" opacity={0.22} />
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#FBF3DE" stroke="#4A3326" strokeWidth={6} />
    <clipPath id={`${id}cl`}><rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} rx={4} /></clipPath>
    <g clipPath={`url(#${id}cl)`}>{children}</g>
    <rect x={-70} y={-h / 2 - 22} width={140} height={44} fill="#E9D79A" opacity={0.85} transform="rotate(-4)" />
  </g>
);

// ---------- E1: the portrait sketch, her name label popping on at the right ----------
export const E1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 990]]), 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <SketchPaper id="e1" />
    <Card id="e1c" x={620} y={520} w={720} h={860} rot={-1.5}>
      <rect x={-400} y={-450} width={800} height={900} fill="#EFDDB4" />
      <g transform="translate(0 -110)"><OstromPortrait t={t} x={0} y={0} s={1.55} /></g>
    </Card>
    <NameLabel x={1400} y={520} t={t} t0={8} k={1.45} />
    <Glow x={620} y={320} r={560} o={0.3} />
    <Dust t={t} seed={3} x0={100} y0={100} w={1700} h={850} n={22} o={0.35} />
    <Sparkle x={1000} y={200} t={t - 20} s={1.3} />
  </g>
);

// ---------- E2: the medal swings on its ribbon; NOBEL and the year rolling up to 2009 ----------
export const E2: React.FC<ShotProps> = ({ t, len }) => {
  const year = 2000 + Math.round(9 * easeOut(clamp((t - 4) / 16)));
  const pop = backOut(clamp(t / 8));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <SketchPaper id="e2" dark />
      <Glow x={600} y={640} r={640} o={0.55} />
      <NobelMedal x={640} y={-30} t={t} s={1.75} swing={9} />
      <g transform={`translate(1290 540) scale(${pop})`}>
        <text y={-262} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} letterSpacing={8} fill="#FFF3D6" stroke="#2A1830" strokeWidth={10} paintOrder="stroke">KINH TẾ</text>
        <text y={-30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} letterSpacing={4} fill="#FFF3D6" stroke="#2A1830" strokeWidth={16} paintOrder="stroke">NOBEL</text>
        <text y={190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={230} letterSpacing={4} fill="#FFE27A" stroke="#2A1830" strokeWidth={18} paintOrder="stroke">{year}</text>
      </g>
      <Sparkle x={760} y={560} t={t - 16} s={1.6} />
      <Sparkle x={1500} y={260} t={t - 22} s={1.2} />
    </g>
  );
};

// ---------- E3: the sketched proof: six villagers round one pot, the rule scroll above, a tick drawing on ----------
export const E3: React.FC<ShotProps> = ({ t, len }) => {
  const tick = clamp((t - 14) / 12);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <SketchPaper id="e3" />
      <g opacity={0.95}><OstromPortrait t={t} x={330} y={640} s={0.9} /></g>
      <Card id="e3c" x={1130} y={520} w={980} h={820} rot={1}>
        <rect x={-500} y={-420} width={1000} height={840} fill="#EFDDB4" />
        {/* the pot, the scroll with its three lines */}
        <g transform="translate(0 70)">
          {[0, 1].map((layer) => (
            <g key={layer}>
              {layer === 1 ? (
                <g>
                  <ellipse cx={0} cy={60} rx={120} ry={26} fill="#000" opacity={0.2} />
                  <path d="M -100 -20 Q -96 70 0 76 Q 96 70 100 -20 Z" fill="#B8603E" stroke="#2A1E24" strokeWidth={6} />
                  <ellipse cx={0} cy={-20} rx={100} ry={22} fill="#7FD0F0" stroke="#2A1E24" strokeWidth={6} />
                  <ellipse cx={-30 + Math.sin(t / 6) * 6} cy={-20} rx={22} ry={7} fill="#fff" opacity={0.6} />
                </g>
              ) : null}
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2 - Math.PI / 2 + 0.52;
                if ((Math.sin(a) < 0 ? 0 : 1) !== layer) return null;
                const reach = 0.5 + 0.5 * Math.sin(t / 6 + i * 1.7);
                return (
                  <Tiny key={i} x={Math.cos(a) * 340} y={Math.sin(a) * 150 + 110} s={2.7} shirt={SHIRTS[i]} skin={SKINS[i % 4]} hat={i % 2 === 0} armL={40 + 50 * reach} armR={40 + 50 * (1 - reach)} bob={Math.max(0, Math.sin(t / 5 + i)) * 4} />
                );
              })}
            </g>
          ))}
        </g>
        <g transform="translate(0 -250)">
          <rect x={-200} y={-70} width={400} height={140} rx={16} fill="#FFF8E6" stroke="#2A1E24" strokeWidth={6} />
          {[-34, 0, 34].map((y, i) => <path key={i} d={`M -150 ${y} H ${-150 + 300 * clamp((t - 2 - i * 4) / 6)}`} stroke="#6B4128" strokeWidth={8} strokeLinecap="round" />)}
        </g>
      </Card>
      <g transform="translate(1560 250)">
        <circle r={84} fill="#2E9E5B" stroke="#14532D" strokeWidth={8} opacity={clamp(tick * 3)} />
        <path d="M -40 4 L -10 36 L 44 -30" stroke="#fff" strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="160" strokeDashoffset={160 * (1 - tick)} />
      </g>
      <Sparkle x={1560} y={160} t={t - 22} s={1.4} />
    </g>
  );
};
