import React from 'react';
import { Schematic, SCH, UI, FONT, clamp, easeOut, backOut, kf } from '../../engine';
import { fmtVN } from '../khong-ai-ngheo/chb-cards-and-marks';
import { PAL, mix } from './kit-palette';

// Overlays for the ocean episode (draw inside the camera group's parent or in screen space; pure functions of t).
//   <OceanMeter x y p t? />       gauge pill 520 x 104, top-left at (x, y): "ĐẠI DƯƠNG" + level bar + "NN%". p 1 -> 0 (blue -> red).
//   <FactStamp t at x? y? />      the "ĐÓ LÀ THẬT" stamp: thumps on at frame `at` of the shot clock (default centre 960, 800),
//                                 stays on. Use whenever the narrator says "Đó là thật" (put `at` on the word's cue).
//   <BigNum t len id text|to dec? unit? caption? statik? />  blueprint number card for strings NumCard can't show
//                                 ("10.935", "65.000", "> 2 km"): `to` counts up in VN format, `text` is shown as is.

export const OceanMeter: React.FC<{ x: number; y: number; p: number; t?: number }> = ({ x, y, p, t = 0 }) => {
  const q = clamp(p);
  const col = q > 0.45 ? PAL.seaTop : mix(UI.bad, PAL.seaTop, q / 0.45);
  const W = 290;
  const fillW = Math.max(0, W * q);
  const wob = (i: number) => Math.sin(i * 0.8 + t * 0.2) * 3;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={520} height={104} rx={52} fill={UI.pill} opacity={0.78} />
      <text x={36} y={42} fontFamily={FONT.ui} fontWeight={700} fontSize={24} fill={UI.text} letterSpacing={3}>ĐẠI DƯƠNG</text>
      <rect x={36} y={58} width={W} height={26} rx={13} fill="#FFFFFF" opacity={0.14} />
      <clipPath id={`om${x}${y}`}><rect x={36} y={58} width={W} height={26} rx={13} /></clipPath>
      <g clipPath={`url(#om${x}${y})`}>
        <path d={`M 36 90 L 36 ${66 + wob(0)} ` + Array.from({ length: 8 }).map((_, i) => `L ${36 + fillW * (i / 7)} ${66 + wob(i)}`).join(' ') + ` L ${36 + fillW} 90 Z`} fill={col} />
        <rect x={36} y={58} width={fillW} height={7} fill="#FFFFFF" opacity={0.22} />
      </g>
      <text x={500} y={74} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={52} fill={q > 0.45 ? UI.text : mix(UI.bad, UI.text, q / 0.45)}>{`${Math.round(q * 100)}%`}</text>
    </g>
  );
};

export const FactStamp: React.FC<{ t: number; at: number; x?: number; y?: number }> = ({ t, at, x = 960, y = 800 }) => {
  const f = t - at;
  if (f < 0) return null;
  const s = kf(f, [[0, 2.7], [4, 0.9], [8, 1.04], [12, 1]], easeOut);
  const shake = f < 10 ? Math.sin(f * 3.1) * (10 - f) * 0.9 : 0;
  const ring = clamp(f / 14);
  return (
    <g transform={`translate(${x + shake} ${y + shake * 0.6}) rotate(-5)`}>
      {ring < 1 ? <rect x={-330 - ring * 80} y={-85 - ring * 40} width={660 + ring * 160} height={170 + ring * 80} rx={30} fill="none" stroke="#2FBF71" strokeWidth={8 * (1 - ring)} opacity={1 - ring} /> : null}
      <g transform={`scale(${s})`} opacity={clamp(f / 2)}>
        <rect x={-330} y={-85} width={660} height={170} rx={26} fill="#F6EFE3" stroke="#2FBF71" strokeWidth={10} style={{ filter: 'drop-shadow(0 8px 0 rgba(0,0,0,0.35))' }} />
        <rect x={-312} y={-67} width={624} height={134} rx={16} fill="none" stroke="#2FBF71" strokeWidth={3} opacity={0.7} />
        <circle cx={-232} cy={0} r={52} fill="#2FBF71" />
        <path d="M -258 2 L -240 22 L -202 -20" stroke="#E9FFF2" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <text x={62} y={28} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={66} fill="#1E7A48" letterSpacing={2}>ĐÓ LÀ THẬT</text>
      </g>
    </g>
  );
};

export const BigNum: React.FC<{ t: number; len: number; id: string; text?: string; to?: number; dec?: number; unit?: string; caption?: string; statik?: boolean; size?: number; children?: React.ReactNode }> = ({ t, len, id, text, to = 0, dec = 0, unit, caption, statik = false, size = 300, children }) => {
  const shown = text ?? (statik ? fmtVN(to, dec) : fmtVN(to * easeOut(clamp(t / 34)), dec));
  const pop = 0.9 + 0.1 * backOut(clamp((t + 2) / 8));
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id={id} />
      {children}
      <g transform={`translate(960 ${unit ? 520 : 600}) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={size} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{shown}</text>
      </g>
      {unit ? <text x={960} y={650} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={118} fill={SCH.line} letterSpacing={6} opacity={easeOut(clamp((t - 4) / 7))}>{unit}</text> : null}
      {caption ? <text x={960} y={unit ? 740 : 720} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim} letterSpacing={2} opacity={easeOut(clamp((t - 10) / 8))}>{caption}</text> : null}
    </g>
  );
};
