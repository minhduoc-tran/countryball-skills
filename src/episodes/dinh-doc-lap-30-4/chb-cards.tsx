import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { FONT } from '../../engine/fonts';
import { clamp, easeOut, hash } from '../../countryball/fx-math';
import { Txt, ramp } from './chb-common';

// Chapter B cards: faceless silhouette + name card (real people without a free photo), cropped archive-map card with credit,
// calendar page, rain cloud, label chip. Pure functions of `s` (seconds) / `t` (frames).

export const Silhouette: React.FC<{ x: number; y: number; s?: number; color?: string; rim?: string }> = ({ x, y, s = 1, color = '#1B2735', rim = '#E2B95A' }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-120,0 Q-118,-86 -52,-104 L-24,-118 L24,-118 L52,-104 Q118,-86 120,0 Z" fill={color} stroke={rim} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-22} y={-150} width={44} height={40} rx={14} fill={color} stroke={rim} strokeWidth={5} />
    <ellipse cx={0} cy={-190} rx={52} ry={62} fill={color} stroke={rim} strokeWidth={5} />
  </g>
);

/** Dark panel, faceless silhouette left, rank line + big name + sub line; slides in from the right at second `at`. */
export const NameCard: React.FC<{ id: string; x: number; y: number; w?: number; rank: string; name: string; sub?: string; s: number; at: number }> = ({ id, x, y, w = 1280, rank, name, sub, s, at }) => {
  const k = easeOut(ramp(s, at, at + 0.45));
  if (s < at) return null;
  return (
    <g transform={`translate(${x + (1 - k) * 900},${y})`} opacity={clamp(k * 1.6)}>
      <rect x={-w / 2 + 8} y={-182} width={w} height={364} rx={26} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-190} width={w} height={364} rx={26} fill="#15202D" stroke="#E2B95A" strokeWidth={5} />
      <clipPath id={`${id}-nc`}><rect x={-w / 2 + 20} y={-170} width={290} height={324} rx={16} /></clipPath>
      <rect x={-w / 2 + 20} y={-170} width={290} height={324} rx={16} fill="#2A3C50" />
      <g clipPath={`url(#${id}-nc)`}><Silhouette x={-w / 2 + 165} y={152} s={1.12} color="#101A26" /></g>
      <Txt x={-w / 2 + 350} y={-60} text={rank} size={50} color="#E2B95A" anchor="start" stroke="none" />
      <Txt x={-w / 2 + 350} y={40} text={name} size={76} anchor="start" stroke="none" />
      {sub && <Txt x={-w / 2 + 350} y={118} text={sub} size={38} color="#B9C6D6" anchor="start" stroke="none" weight={600} />}
    </g>
  );
};

/** Rounded label chip centred on (x, y). */
export const Chip: React.FC<{ x: number; y: number; text: string; size?: number; fill?: string; color?: string; stroke?: string }> = ({ x, y, text, size = 44, fill = '#15202D', color = '#F4F4F4', stroke = '#E2B95A' }) => {
  const w = text.length * size * 0.56 + size * 1.2;
  return (
    <g>
      <rect x={x - w / 2} y={y - size * 0.95} width={w} height={size * 1.6} rx={size * 0.5} fill={fill} stroke={stroke} strokeWidth={4} opacity={0.94} />
      <text x={x} y={y + size * 0.2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};

// An SVG <image> can be captured before it has loaded: hold the frame until the file is decoded (same trick as PhotoCard).
const useImageReady = (url: string) => {
  const [handle] = useState(() => delayRender(`doc ${url}`));
  useEffect(() => {
    const img = new Image();
    const done = () => continueRender(handle);
    img.onload = () => { img.decode().then(done, done); };
    img.onerror = done;
    img.src = url;
  }, [url, handle]);
};

/** Archive document / map card: the `crop` = [x, y, w, h] (image px) of `src` fills a w x h picture with a slow zoom, caption strip and credit line.
 *  Crops keep out the English legends (the CMH maps carry their own date range in the legend). Lands from the right at second `at`. */
export const DocCard: React.FC<{ id: string; src: string; imgW: number; imgH: number; crop: [number, number, number, number]; x: number; y: number; w: number; h: number; rot?: number; caption: string; credit: string; s: number; at: number; z1?: number }> = ({
  id, src, imgW, imgH, crop, x, y, w, h, rot = -2.5, caption, credit, s, at, z1 = 1.12,
}) => {
  const url = staticFile(src);
  useImageReady(url);
  const k = easeOut(ramp(s, at, at + 0.55));
  if (s < at) return null;
  const sc = w / crop[2], PW = w + 32, PH = h + 16 + 92, zz = 1 + (z1 - 1) * ramp(s, at, at + 4);
  return (
    <g transform={`translate(${x + (1 - k) * 1300},${y}) rotate(${rot + (1 - k) * 10})`} opacity={clamp(k * 2)}>
      <rect x={-PW / 2 + 10} y={-PH / 2 + 20} width={PW} height={PH} rx={4} fill="#000" opacity={0.4} />
      <rect x={-PW / 2} y={-PH / 2} width={PW} height={PH} rx={4} fill="#F6F2E7" stroke="#CFC8B6" strokeWidth={2} />
      <clipPath id={`${id}-dc`}><rect x={-w / 2} y={-PH / 2 + 16} width={w} height={h} /></clipPath>
      <g clipPath={`url(#${id}-dc)`}>
        <g transform={`translate(0,${-PH / 2 + 16 + h / 2}) scale(${zz})`}>
          <image href={url} x={(-crop[0] - crop[2] / 2) * sc} y={(-crop[1] - crop[3] / 2) * sc} width={imgW * sc} height={imgH * sc} preserveAspectRatio="none" />
        </g>
      </g>
      <rect x={-w / 2} y={-PH / 2 + 16} width={w} height={h} fill="none" stroke="#1B1A17" strokeOpacity={0.35} strokeWidth={2} />
      <text x={0} y={PH / 2 - 34} textAnchor="middle" fontFamily={FONT.hand} fontSize={Math.min(34, (PW - 40) / Math.max(1, caption.length * 0.5))} fill="#2A2622">{caption}</text>
      <text x={0} y={PH / 2 + 30} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#DCE4EC" stroke="#0A121C" strokeWidth={5} paintOrder="stroke">{credit}</text>
    </g>
  );
};

/** Calendar page: red header (month), big day number; `flip` 0..1 tilts the page as it turns. */
export const CalendarPage: React.FC<{ x: number; y: number; w?: number; month: string; day: string; flip?: number; tone?: string }> = ({ x, y, w = 420, month, day, flip = 0, tone = '#C9343A' }) => {
  const h = w * 1.05, sy = 1 - 0.18 * Math.sin(clamp(flip) * Math.PI);
  return (
    <g transform={`translate(${x},${y}) scale(1,${sy})`}>
      <rect x={-w / 2 + 12} y={-h / 2 + 18} width={w} height={h} rx={22} fill="#000" opacity={0.35} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={22} fill="#F6F2E7" stroke="#151515" strokeWidth={7} />
      <path d={`M${-w / 2},${-h / 2 + h * 0.26} L${-w / 2},${-h / 2 + 22} Q${-w / 2},${-h / 2} ${-w / 2 + 22},${-h / 2} L${w / 2 - 22},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 22} L${w / 2},${-h / 2 + h * 0.26} Z`} fill={tone} stroke="#151515" strokeWidth={7} />
      {[-0.3, 0.3].map((q) => <circle key={q} cx={w * q} cy={-h / 2} r={14} fill="#2A2622" />)}
      <Txt x={0} y={-h / 2 + h * 0.19} text={month} size={w * 0.115} stroke="none" color="#FFF" />
      <Txt x={0} y={h * 0.27} text={day} size={w * 0.5} stroke="none" color="#1F1B16" />
    </g>
  );
};

/** Rain cloud with falling drops (frames t). */
export const RainCloud: React.FC<{ x: number; y: number; s?: number; t: number; drops?: number }> = ({ x, y, s = 1, t, drops = 22 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: drops }, (_, i) => {
      const px = -150 + 300 * hash(i, 1), len = 26 + 20 * hash(i, 2), py = 70 + ((t * (7 + 5 * hash(i, 3)) + hash(i, 4) * 300) % 300);
      return <line key={i} x1={px} y1={py} x2={px - 7} y2={py + len} stroke="#9FC4E8" strokeWidth={6} strokeLinecap="round" opacity={0.9 * (1 - (py - 70) / 300)} />;
    })}
    <path d="M-190,40 Q-250,40 -250,-14 Q-250,-66 -196,-70 Q-186,-150 -100,-150 Q-48,-210 20,-170 Q110,-190 150,-120 Q236,-118 240,-40 Q244,40 170,40 Z" fill="#7A8CA0" stroke="#151515" strokeWidth={8} strokeLinejoin="round" />
    <path d="M-170,10 Q-210,10 -214,-26 M0,-130 Q70,-150 110,-100" fill="none" stroke="#A9B8C8" strokeWidth={7} strokeLinecap="round" />
  </g>
);
