import React from 'react';
import { FONT } from '../engine/fonts';
import { appear, useT } from './hud-anim';
import { PORTRAIT_HUD, PORTRAIT_SAFE, usePortraitHud } from './hud-portrait-safe';

// Smaller HUD pieces: night counter chip, lower-third caption bar, source line. All take [from, to] seconds
// (optional) for a slide-in / slide-out, and an optional `t` (else the current frame).
// Portrait frames (taller than wide, or `portrait`): TikTok-safe PORTRAIT_HUD positions, the lower third grows from its BOTTOM edge at
// y 1440 (above the caption bar), never wider than 900 px (clear of the button column) and shrinks its type to fit; bigger source line.

interface Timing { from?: number; to?: number; t?: number; /** force the portrait (true) or 16:9 (false) layout */ portrait?: boolean }
const chip = { fill: '#15181F', fillOpacity: 0.88 };

/** "ĐÊM 1/12" under the date chip. `since` (s) makes it pop when the night number changes. */
export const NightChip: React.FC<Timing & { label: string; since?: number }> = ({ label, from, to, t, since, portrait }) => {
  const T = useT(t);
  const pos = usePortraitHud(portrait) ? PORTRAIT_HUD.night : { x: 56, y: 142 };
  const ap = appear(T, from, to);
  if (!ap.visible) return null;
  const pop = since !== undefined ? 1 + 0.18 * Math.max(0, 1 - (T - since) / 0.4) * (T >= since ? 1 : 0) : 1;
  const W = 120 + label.length * 19;
  return (
    <g transform={`translate(${pos.x - (1 - ap.enter) * 260},${pos.y}) translate(${W / 2},32) scale(${pop}) translate(${-W / 2},-32)`} opacity={ap.a}>
      <rect width={W} height={64} rx={32} stroke="#8EA8E8" strokeWidth={3.5} {...chip} />
      <path d="M44,14 A18,18 0 1 0 50,48 A14,14 0 0 1 44,14 Z" transform="translate(-4,2)" fill="#C9D6FF" />
      <text x={76} y={44} fontSize={32} fontFamily={FONT.title} fontWeight={800} fill="#E4EBFF" letterSpacing={1}>{label}</text>
    </g>
  );
};

/** Lower-third caption bar (place name + optional second line such as "Theo phía Mỹ: ..."). */
export const LowerThird: React.FC<Timing & { title: string; sub?: string; accent?: string; y?: number }> = ({ title, sub, from, to, t, accent = '#C9343A', y, portrait }) => {
  const T = useT(t);
  const P = usePortraitHud(portrait);
  const ap = appear(T, from, to, 0.6);
  if (!ap.visible) return null;
  if (P) return <PortraitLowerThird title={title} sub={sub} accent={accent} y={y} enter={ap.enter} a={ap.a} />;
  const W = Math.min(1440, Math.max(420, 90 + Math.max(title.length * 31, (sub ?? '').length * 17.5)));
  const H = sub ? 128 : 84;
  return (
    <g transform={`translate(${56 - (1 - ap.enter) * (W + 80)},${y ?? 872})`} opacity={ap.a}>
      <rect width={W} height={H} rx={16} {...chip} />
      <rect width={12} height={H} rx={6} fill={accent} />
      <text x={38} y={sub ? 56 : 58} fontSize={46} fontFamily={FONT.title} fontWeight={800} fill="#F4F4F4">{title}</text>
      {sub && <text x={38} y={104} fontSize={29} fontFamily={FONT.title} fontWeight={600} fill="#E2B95A">{sub}</text>}
    </g>
  );
};

/** Small source line, bottom-left ("Nguồn: ..."); portrait: just above TikTok's caption bar, 24 px (long credits shrink to 900 px). */
export const SourceLine: React.FC<Timing & { text: string }> = ({ text, from, to, t, portrait }) => {
  const T = useT(t);
  const P = usePortraitHud(portrait);
  const ap = appear(T, from, to, 0.5);
  if (!ap.visible) return null;
  const S = PORTRAIT_HUD.source, fs = P ? Math.min(S.size, PORTRAIT_SAFE.maxTextW / Math.max(1, text.length * 0.6)) : 21;
  return (
    <text x={P ? S.x : 56} y={P ? S.y : 1046} fontSize={fs} fontFamily={FONT.ui} fill="#CBD5DF" stroke="#0A121C" strokeWidth={5} paintOrder="stroke" opacity={0.9 * ap.a}>{text}</text>
  );
};

/** Portrait lower third: anchored by its BOTTOM edge (PORTRAIT_HUD.lowerThird.bottom, or `y` = bottom), max 900 px wide (clear of TikTok's
 *  button column), big type (title 56 / sub 34) that shrinks to fit the width. */
const PortraitLowerThird: React.FC<{ title: string; sub?: string; accent: string; y?: number; enter: number; a: number }> = ({ title, sub, accent, y, enter, a }) => {
  const L = PORTRAIT_HUD.lowerThird, inner = L.maxW - 60;
  const ts = Math.min(56, inner / Math.max(1, title.length * 0.6)), ss = Math.min(34, inner / Math.max(1, (sub ?? '').length * 0.56));
  const W = Math.min(L.maxW, Math.max(420, 70 + Math.max(title.length * ts * 0.6, (sub ?? '').length * ss * 0.56)));
  const H = sub ? ts + ss + 58 : ts + 40;
  return (
    <g transform={`translate(${L.x - (1 - enter) * (W + 80)},${(y ?? L.bottom) - H})`} opacity={a}>
      <rect width={W} height={H} rx={18} {...chip} />
      <rect width={12} height={H} rx={6} fill={accent} />
      <text x={36} y={20 + ts * 0.86} fontSize={ts} fontFamily={FONT.title} fontWeight={800} fill="#F4F4F4">{title}</text>
      {sub && <text x={36} y={20 + ts + 14 + ss * 0.86} fontSize={ss} fontFamily={FONT.title} fontWeight={600} fill="#E2B95A">{sub}</text>}
    </g>
  );
};
