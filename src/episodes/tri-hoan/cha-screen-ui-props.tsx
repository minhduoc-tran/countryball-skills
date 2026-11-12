import React from 'react';
import { FONT, clamp } from '../../engine';
import { StickyNote } from './cha-note-and-chip-props';

// Chapter A screens: a laptop seen head-on (bezel + desktop), a generic slide app with "HỆ MẶT TRỜI.pptx" and a
// generic video site. No brand logos. The desktop content area is 1600 x 900 at (160, 90).

/** A laptop screen filling the frame: dark bezel, then `children` drawn in the 1600 x 900 content area (origin top left). */
export const ScreenFrame: React.FC<{ children: React.ReactNode; glow?: string; notes?: number }> = ({ children, glow = '#9FC0FF', notes = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2720} height={1880} fill="#14121C" />
    <rect x={110} y={44} width={1700} height={992} rx={34} fill="#0C0B12" stroke="#2C2A38" strokeWidth={6} />
    <g transform="translate(160 90)">{children}</g>
    <rect x={160} y={90} width={1600} height={900} fill={glow} opacity={0.05} style={{ mixBlendMode: 'screen' }} />
    <path d="M 190 100 L 560 100 L 330 990 L 190 990 Z" fill="#FFFFFF" opacity={0.035} />
    {/* the notes stuck round the bezel */}
    {notes > 0 ? <StickyNote x={1750} y={170} w={96} rot={9} /> : null}
    {notes > 1 ? <StickyNote x={1760} y={330} w={86} rot={-7} /> : null}
    {notes > 2 ? <StickyNote x={140} y={900} w={92} rot={-10} /> : null}
  </g>
);

const Caret: React.FC<{ x: number; y: number; h: number; t: number }> = ({ x, y, h, t }) => (
  <rect x={x} y={y} width={5} height={h} fill="#1B1B24" opacity={Math.floor(t / 12) % 2 ? 0.05 : 1} />
);

/** The slide app: title bar with the file name, a thumbnail rail, one white slide. `text` is typed into the title box. */
export const SlideApp: React.FC<{ t: number; text?: string; thumbs?: number; fly?: boolean }> = ({ t, text = '', thumbs = 1, fly = false }) => {
  const fx = 800 + Math.sin(t / 9) * 260 + Math.sin(t / 4.3) * 60;
  const fy = 420 + Math.sin(t / 7 + 1) * 150 + Math.cos(t / 3.1) * 30;
  return (
    <g>
      <rect width={1600} height={900} fill="#E9EAF0" />
      <rect width={1600} height={54} fill="#D3D5E0" />
      {['#FF5F57', '#FEBC2E', '#28C840'].map((c, i) => <circle key={c} cx={34 + i * 34} cy={27} r={9} fill={c} />)}
      <text x={800} y={37} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#3A3C4E">HỆ MẶT TRỜI.pptx</text>
      <rect y={54} width={1600} height={62} fill="#F6F6FA" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={30 + i * 84} y={70} width={56} height={32} rx={8} fill="#C9CCDC" />)}
      <rect x={560} y={70} width={170} height={32} rx={8} fill="#5C7CFA" />
      <rect y={116} width={240} height={784} fill="#DDDFEA" />
      {Array.from({ length: Math.max(1, thumbs) }).map((_, i) => (
        <g key={i}>
          <rect x={22} y={140 + i * 140} width={196} height={110} rx={8} fill="#FFFFFF" stroke={i === 0 ? '#5C7CFA' : '#B9BCCE'} strokeWidth={i === 0 ? 5 : 2} />
          {i === 0 && text ? <rect x={46} y={176} width={Math.min(148, 10 + text.length * 8)} height={9} rx={4} fill="#9AA0B8" /> : null}
        </g>
      ))}
      <rect x={290} y={160} width={1230} height={692} fill="#000" opacity={0.12} />
      <rect x={278} y={146} width={1230} height={692} fill="#FFFFFF" />
      {text ? (
        <g>
          <text x={340} y={330} fontFamily={FONT.hand} fontSize={96} fill="#1B1B24">
            {text}
            <tspan opacity={Math.floor(t / 12) % 2 ? 0.05 : 1} fill="#5C7CFA">|</tspan>
          </text>
        </g>
      ) : (
        <Caret x={346} y={256} h={96} t={t} />
      )}
      <rect y={868} width={1600} height={32} fill="#CFD1DE" />
      <text x={24} y={891} fontFamily={FONT.ui} fontSize={20} fill="#5A5C70">{`Slide 1 / ${Math.max(1, thumbs)}`}</text>
      {fly ? (
        <g transform={`translate(${fx + 290} ${fy + 120})`}>
          <ellipse cx={0} cy={0} rx={9} ry={6} fill="#1B1B24" />
          <ellipse cx={-4} cy={-8} rx={9} ry={4.5} fill="#8A8EA6" opacity={0.7} transform={`rotate(${Math.sin(t * 2) * 20})`} />
          <ellipse cx={5} cy={-8} rx={9} ry={4.5} fill="#8A8EA6" opacity={0.7} transform={`rotate(${-Math.sin(t * 2) * 20})`} />
        </g>
      ) : null}
    </g>
  );
};

/** 16:9 cartoon thumbnails for the video site, drawn in a 320 x 180 box. 0 cat, 1 skate, 2 noodles, 3 planet, 4 soap. */
export const VideoArt: React.FC<{ idx: number; t: number }> = ({ idx, t }) => {
  const k = ((idx % 5) + 5) % 5;
  return (
    <g>
      {k === 0 ? (
        <g>
          <rect width={320} height={180} fill="#F2A65A" />
          <rect y={130} width={320} height={50} fill="#C9783A" />
          <circle cx={90 + ((t * 3) % 180)} cy={150} r={16} fill="#D9534F" />
          <ellipse cx={200} cy={110} rx={52} ry={44} fill="#9AA0AE" />
          <path d="M 158 80 L 156 40 L 184 66 Z M 242 80 L 244 40 L 216 66 Z" fill="#9AA0AE" />
          <circle cx={184} cy={104} r={7} fill="#1B1B24" />
          <circle cx={216} cy={104} r={7} fill="#1B1B24" />
          <path d="M 194 122 L 200 128 L 206 122" stroke="#1B1B24" strokeWidth={3} fill="none" />
        </g>
      ) : null}
      {k === 1 ? (
        <g>
          <rect width={320} height={180} fill="#7FC4F2" />
          <path d="M 0 150 L 130 150 L 230 100 L 230 180 L 0 180 Z" fill="#8A8EA6" />
          <g transform={`translate(190 ${70 - Math.abs(Math.sin(t / 8)) * 20}) rotate(${t * 9})`}>
            <rect x={-30} y={14} width={60} height={8} rx={4} fill="#D9534F" />
            <circle cx={0} cy={-12} r={11} fill="#F6EFE3" />
            <path d="M 0 -2 L 0 14" stroke="#1B1B24" strokeWidth={5} />
          </g>
        </g>
      ) : null}
      {k === 2 ? (
        <g>
          <rect width={320} height={180} fill="#8A2E2E" />
          <path d="M 80 100 L 240 100 Q 236 160 160 164 Q 84 160 80 100 Z" fill="#F6EFE3" />
          <path d="M 96 100 Q 130 70 160 100 Q 190 70 224 100" stroke="#F2C14E" strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d={`M 130 70 q ${Math.sin(t / 5) * 8} -20 0 -34 M 170 66 q ${Math.cos(t / 6) * 8} -20 0 -34`} stroke="#F6EFE3" strokeWidth={4} fill="none" opacity={0.6} strokeLinecap="round" />
        </g>
      ) : null}
      {k === 3 ? (
        <g>
          <rect width={320} height={180} fill="#1C2250" />
          {[[40, 30], [260, 50], [90, 140], [290, 150], [180, 20]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.5} fill="#F6EFE3" />)}
          <circle cx={160} cy={96} r={44} fill="#E9A15A" />
          <ellipse cx={160} cy={100} rx={84} ry={16} fill="none" stroke="#F6EFE3" strokeWidth={5} transform="rotate(-18 160 100)" />
        </g>
      ) : null}
      {k === 4 ? (
        <g>
          <rect width={320} height={180} fill="#F7D9C8" />
          <rect y={126} width={320} height={54} fill="#D9B79E" />
          <rect x={70} y={74} width={150} height={56} rx={6} fill="#F29AB0" />
          <rect x={70} y={74} width={150} height={12} rx={6} fill="#F8B9C8" />
          {[0, 1, 2].map((i) => <rect key={i} x={238 + (i % 2) * 24} y={116 - i * 20} width={22} height={18} rx={3} fill={['#9FD8C2', '#C3B1E8', '#F29AB0'][i]} />)}
          <g transform={`translate(${96 + ((t * 2) % 90)} ${26 + (Math.abs(Math.sin(t / 6)) * 30)})`}>
            <rect x={-4} y={0} width={8} height={50} fill="#DDE3EA" />
            <rect x={-6} y={-22} width={12} height={26} rx={4} fill="#5A4A6A" />
          </g>
        </g>
      ) : null}
    </g>
  );
};

/** The video site: a url bar, a player (`art`, progress `p` 0..1) and suggested videos on the right. */
export const VideoApp: React.FC<{ t: number; art: number; p?: number; side?: number[]; playing?: boolean }> = ({ t, art, p = 0.1, side = [1, 2, 3], playing = false }) => (
  <g>
    <rect width={1600} height={900} fill="#17161F" />
    <rect width={1600} height={64} fill="#24222E" />
    <rect x={200} y={14} width={900} height={36} rx={18} fill="#14131A" />
    <text x={226} y={40} fontFamily={FONT.ui} fontSize={20} fill="#8A8CA0">videos.example/xem</text>
    <g transform="translate(40 100)">
      <rect width={1000} height={563} rx={14} fill="#000" />
      <g transform="scale(3.125)"><VideoArt idx={art} t={t} /></g>
      {playing ? null : <circle cx={500} cy={282} r={56} fill="#000" opacity={0.45} />}
      {playing ? null : <path d="M 484 254 L 484 310 L 534 282 Z" fill="#fff" />}
      <rect y={539} width={1000} height={9} fill="#3A384A" />
      <rect y={539} width={1000 * clamp(p)} height={9} fill="#FF5A4A" />
      <circle cx={1000 * clamp(p)} cy={543} r={11} fill="#FF5A4A" />
    </g>
    {side.map((a, i) => (
      <g key={i} transform={`translate(1090 ${100 + i * 236})`}>
        <clipPath id={`vs${i}`}><rect width={352} height={198} rx={10} /></clipPath>
        <g clipPath={`url(#vs${i})`}><g transform="scale(1.1)"><VideoArt idx={a} t={t + i * 9} /></g></g>
        <rect y={208} width={300} height={12} rx={6} fill="#3A384A" />
      </g>
    ))}
  </g>
);
