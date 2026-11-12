import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { FONT } from '../engine/fonts';
import { appear, clamp01, easeInOutCubic, useT } from './hud-anim';

// PhotoCard: an archive photo as a slightly tilted white-bordered print lying on the map. Slides in and settles
// (small overshoot), Ken Burns slow zoom/pan inside the print as a function of t, Vietnamese caption on the white
// strip under the picture and a small credit line under the print. Optional sepia. Pure function of t.

export interface KenBurns { z0?: number; z1?: number; /** pan as a fraction of the picture size, start -> end */ px0?: number; py0?: number; px1?: number; py1?: number }
export interface PhotoCardProps {
  /** path inside public/ ("dien-bien-phu-tren-khong/img/x.jpg", resolved with staticFile) or an http/data URL */
  src: string;
  caption: string;
  credit?: string;
  /** centre of the whole print on screen */
  x: number; y: number;
  /** picture size (the white border adds ~16 px around and ~90 px under) */
  w?: number; h?: number;
  /** tilt in degrees */
  rot?: number;
  from: number; to?: number; t?: number;
  /** 0..1 sepia amount */
  sepia?: number;
  kb?: KenBurns;
  fromSide?: 'left' | 'right' | 'bottom';
  id?: string;
  /** caption px (default: fits the strip, max 36); portrait: PORTRAIT_SLOTS.captionSize (40) reads on a phone */
  captionSize?: number;
  /** credit px (default 18); portrait: PORTRAIT_SLOTS.creditSize (24) */
  creditSize?: number;
}

const BORDER = 16, STRIP = 92;
const resolve = (s: string) => (/^(https?:|data:|blob:)/.test(s) ? s : staticFile(s));

// An SVG <image> does not hold the render like Remotion's <Img>: without this the frame can be captured before the
// photo has loaded and the print comes out blank. Hold the frame until the file is loaded and decoded.
const useImageReady = (url: string) => {
  const [handle] = useState(() => delayRender(`photo ${url}`));
  useEffect(() => {
    const img = new Image();
    const done = () => continueRender(handle);
    img.onload = () => { img.decode().then(done, done); };
    img.onerror = done;
    img.src = url;
  }, [url, handle]);
};

export const PhotoCard: React.FC<PhotoCardProps> = ({
  src, caption, credit = 'Ảnh: USAF / Public domain', x, y, w = 560, h = 380, rot = -3.5, from, to, t, sepia = 0,
  kb = {}, fromSide = 'right', id = 'photo', captionSize, creditSize = 18,
}) => {
  useImageReady(resolve(src));
  const T = useT(t);
  const ap = appear(T, from, to, 0.75, 0.5);
  if (!ap.visible) return null;
  const { z0 = 1.04, z1 = 1.17, px0 = 0.02, py0 = 0.015, px1 = -0.025, py1 = -0.015 } = kb;
  const dur = Math.max(1, (to ?? from + 14) - from);
  const u = easeInOutCubic(clamp01((T - from) / dur));
  const z = z0 + (z1 - z0) * u, panX = (px0 + (px1 - px0) * u) * w, panY = (py0 + (py1 - py0) * u) * h;
  const slide = (1 - ap.enter) + ap.leave;                    // 1 = fully off, 0 = settled (negative = overshoot)
  const dir = fromSide === 'left' ? [-1, 0] : fromSide === 'bottom' ? [0, 1] : [1, 0];
  const PW = w + 2 * BORDER, PH = h + BORDER + STRIP;
  const dx = dir[0] * slide * 1500, dy = dir[1] * slide * 900;
  const angle = rot + slide * (dir[0] >= 0 ? 12 : -12);
  const a = clamp01(sepia);
  // sepia = blend of identity and the classic sepia matrix
  const m = (i: number, s: number) => (1 - a) * i + a * s;
  const matrix = [m(1, 0.393), m(0, 0.769), m(0, 0.189), 0, 0, m(0, 0.349), m(1, 0.686), m(0, 0.168), 0, 0, m(0, 0.272), m(0, 0.534), m(1, 0.131), 0, 0, 0, 0, 0, 1, 0].join(' ');
  const fs = captionSize ?? Math.min(36, (PW - 50) / Math.max(1, caption.length * 0.5));
  return (
    <g transform={`translate(${x + dx},${y + dy}) rotate(${angle})`} opacity={ap.a}>
      <defs>
        <clipPath id={`${id}-pic`}><rect x={-w / 2} y={-PH / 2 + BORDER} width={w} height={h} /></clipPath>
        <filter id={`${id}-tone`}><feColorMatrix type="matrix" values={matrix} /></filter>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation={14} /></filter>
      </defs>
      <rect x={-PW / 2 + 10} y={-PH / 2 + 22} width={PW} height={PH} rx={4} fill="#000" opacity={0.45} filter={`url(#${id}-shadow)`} />
      <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} rx={4} fill="#F6F2E7" stroke="#CFC8B6" strokeWidth={2} />
      <g clipPath={`url(#${id}-pic)`}>
        <g transform={`translate(${panX},${-PH / 2 + BORDER + h / 2 + panY}) scale(${z})`}>
          <image href={resolve(src)} x={-w / 2} y={-h / 2} width={w} height={h} preserveAspectRatio="xMidYMid slice" filter={a > 0 ? `url(#${id}-tone)` : undefined} />
        </g>
      </g>
      <rect x={-w / 2} y={-PH / 2 + BORDER} width={w} height={h} fill="none" stroke="#1B1A17" strokeOpacity={0.35} strokeWidth={2} />
      <text x={0} y={PH / 2 - STRIP / 2 + fs * 0.35} textAnchor="middle" fontFamily={FONT.hand} fontSize={fs} fill="#2A2622">{caption}</text>
      {credit && <text x={0} y={PH / 2 + 12 + creditSize} textAnchor="middle" fontFamily={FONT.ui} fontSize={creditSize} fill="#DCE4EC" stroke="#0A121C" strokeWidth={5} paintOrder="stroke">{credit}</text>}
    </g>
  );
};
