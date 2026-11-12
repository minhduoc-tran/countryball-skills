import React from 'react';
import { Glow, rnd, clamp, backOut } from '../../engine';

// Chapter D props for the "in the world" shots: the dusty pitch at dusk, the drinks stall, the night window with
// curtains, a wall camera, the guard silhouette and a SIM card. All pure functions of the shot clock `t`.

// ---------- the pitch: dusk sky, far flats, chain-link fence, goal, dusty ground ----------
export const Pitch: React.FC<{ t: number; id: string; dim?: number }> = ({ t, id, dim = 0 }) => {
  const blocks = Array.from({ length: 16 }).map((_, i) => ({ x: -100 + i * 150 + rnd(3, i) * 40, w: 90 + rnd(4, i) * 70, h: 60 + rnd(5, i) * 120 }));
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2B2250" />
          <stop offset="0.55" stopColor="#8B4E6C" />
          <stop offset="1" stopColor="#F0A068" />
        </linearGradient>
        <linearGradient id={`${id}gnd`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7C5E48" />
          <stop offset="1" stopColor="#5A4434" />
        </linearGradient>
        <pattern id={`${id}mesh`} width={26} height={26} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M 0 0 L 26 0 M 0 0 L 0 26" stroke="#1B1426" strokeWidth={2} />
        </pattern>
      </defs>
      <rect x={-400} y={-300} width={2720} height={940} fill={`url(#${id}sky)`} />
      <circle cx={1440} cy={600} r={78} fill="#FFD9A0" />
      <Glow x={1440} y={590} r={640} o={0.7} />
      {/* far flats */}
      <g fill="#2A2140">
        {blocks.map((b, i) => (
          <g key={i}>
            <rect x={b.x} y={600 - b.h} width={b.w} height={b.h + 20} />
            {[0, 1, 2].map((k) => (rnd(7, i * 3 + k) > 0.55 ? <rect key={k} x={b.x + 14 + k * 26} y={600 - b.h + 18 + (k % 2) * 30} width={12} height={16} fill="#FFC27A" opacity={0.85} /> : null))}
          </g>
        ))}
      </g>
      <rect x={-400} y={600} width={2720} height={700} fill={`url(#${id}gnd)`} />
      {/* worn patches and chalk */}
      {[[420, 800, 280], [1180, 760, 340], [1600, 900, 240], [760, 940, 300]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.16} fill="#9A7A5C" opacity={0.35} />
      ))}
      <path d="M -100 1010 Q 960 920 2000 1010" stroke="#E8DCC4" strokeWidth={5} fill="none" opacity={0.28} />
      {/* fence: posts, mesh, top rail */}
      <rect x={-300} y={560} width={2520} height={96} fill={`url(#${id}mesh)`} opacity={0.5} />
      <rect x={-300} y={554} width={2520} height={8} fill="#2A2234" />
      {Array.from({ length: 19 }).map((_, i) => (
        <rect key={i} x={-120 + i * 140} y={548} width={9} height={118} fill="#2A2234" />
      ))}
      <rect x={-300} y={656} width={2520} height={8} fill="#2A2234" opacity={0.7} />
      {/* goal: white posts, net */}
      <g>
        <rect x={190} y={470} width={380} height={250} fill="#EDE6D8" opacity={0.08} />
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d={`M ${190 + i * 42} 470 L ${190 + i * 42} 720`} stroke="#EDE6D8" strokeWidth={1.6} opacity={0.35} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M 190 ${470 + i * 50} L 570 ${470 + i * 50}`} stroke="#EDE6D8" strokeWidth={1.6} opacity={0.35} />
        ))}
        <path d="M 190 720 L 190 470 L 570 470 L 570 720" stroke="#F4EEE2" strokeWidth={13} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={380} cy={724} rx={230} ry={12} fill="#000" opacity={0.25} />
      </g>
      {/* drifting dust */}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = ((rnd(2, i) * 2100 + t * (0.5 + rnd(6, i))) % 2100) - 100;
        const y = 640 + rnd(8, i) * 360 + Math.sin(t / 20 + i) * 8;
        return <circle key={i} cx={x} cy={y} r={2 + rnd(9, i) * 3} fill="#FFD8A8" opacity={0.28} />;
      })}
      {dim > 0 ? <rect x={-400} y={-300} width={2720} height={1700} fill="#120C22" opacity={dim} /> : null}
    </g>
  );
};

/** A football: x, y its centre, r radius, `rot` degrees. White with dark patches. */
export const Football: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 24, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill="#F4F0E6" stroke="#1B1426" strokeWidth={3} />
    <path d={`M 0 ${-r * 0.4} L ${r * 0.38} ${-r * 0.12} L ${r * 0.24} ${r * 0.32} L ${-r * 0.24} ${r * 0.32} L ${-r * 0.38} ${-r * 0.12} Z`} fill="#2A2234" />
    <path d={`M ${r * 0.38} ${-r * 0.12} L ${r * 0.9} ${-r * 0.3} M ${-r * 0.38} ${-r * 0.12} L ${-r * 0.9} ${-r * 0.3} M 0 ${-r * 0.4} L 0 ${-r}`} stroke="#2A2234" strokeWidth={2.4} />
    <circle r={r} fill="none" stroke="#FFC890" strokeWidth={2} opacity={0.4} strokeDasharray={`${r * 1.2} ${r * 8}`} strokeDashoffset={-r * 0.3} />
  </g>
);

/** A puff of dust at a kick: expands and fades over ~14 frames after `t0`. */
export const DustPuff: React.FC<{ x: number; y: number; t: number; t0: number }> = ({ x, y, t, t0 }) => {
  const k = clamp((t - t0) / 16);
  if (k <= 0 || k >= 1) return null;
  return (
    <g opacity={0.6 * (1 - k)} fill="#D8B48A">
      {[-1, 0, 1].map((d) => (
        <circle key={d} cx={x + d * 34 * (0.4 + k)} cy={y - 10 - k * 26 + Math.abs(d) * 6} r={14 + k * 30} />
      ))}
    </g>
  );
};

// ---------- the drinks stall: a cart with an awning, a jar of tea and a row of iced glasses ----------
export const Glass: React.FC<{ x: number; y: number; s?: number; fill?: number }> = ({ x, y, s = 1, fill = 0.8 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -24 -96 L 24 -96 L 19 0 L -19 0 Z" fill="#CFE7EA" opacity={0.3} stroke="#E8F6F6" strokeWidth={2.4} />
    <path d={`M ${-24 + 5 * (1 - fill)} ${-96 * fill} L ${24 - 5 * (1 - fill)} ${-96 * fill} L 19 0 L -19 0 Z`} fill="#C9792E" opacity={0.92} />
    {[[-8, -64], [8, -46], [-6, -30]].map(([cx, cy], i) => (
      <rect key={i} x={cx - 8} y={cy - 8} width={16} height={16} rx={4} fill="#F4FBFB" opacity={0.7} transform={`rotate(${i * 20} ${cx} ${cy})`} />
    ))}
    <path d="M 8 -100 L 18 -130" stroke="#E8574A" strokeWidth={4} strokeLinecap="round" />
    <path d="M -17 -92 L -15 -10" stroke="#fff" strokeWidth={3} opacity={0.5} />
  </g>
);

export const DrinkStall: React.FC<{ t: number; x0?: number; x1?: number; top?: number }> = ({ t, x0 = 520, x1 = 1480, top = 690 }) => {
  const w = x1 - x0;
  const glasses = [0.12, 0.2, 0.28, 0.36, 0.44].map((k) => x0 + w * k);
  return (
    <g>
      {/* awning on two poles */}
      <rect x={x0 + 20} y={top - 360} width={9} height={360} fill="#4A3A34" />
      <rect x={x1 - 29} y={top - 360} width={9} height={360} fill="#4A3A34" />
      <g>
        {Array.from({ length: 12 }).map((_, i) => (
          <path key={i} d={`M ${x0 - 20 + (i * (w + 40)) / 12} ${top - 400} l ${(w + 40) / 12} 0 l 14 52 l ${-(w + 40) / 12 - 14} 0 Z`} fill={i % 2 ? '#F2E6CF' : '#C9483E'} />
        ))}
        <path d={`M ${x0 - 20} ${top - 348} H ${x1 + 20}`} stroke="#6A2A28" strokeWidth={4} opacity={0.5} />
      </g>
      {/* string bulbs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const bx = x0 + 30 + (i * (w - 60)) / 7;
        const by = top - 330 + Math.sin((i / 7) * Math.PI) * 26;
        const fl = 0.85 + 0.15 * Math.sin(t / 7 + i * 2);
        return (
          <g key={i}>
            <Glow x={bx} y={by + 14} r={70} o={0.5 * fl} />
            <circle cx={bx} cy={by + 14} r={8} fill="#FFE4A8" />
          </g>
        );
      })}
      {/* counter */}
      <rect x={x0} y={top} width={w} height={210} fill="#6B3E30" />
      <rect x={x0 + 14} y={top + 38} width={w - 28} height={150} rx={8} fill="#2F7D78" />
      <text x={x0 + 150} y={top + 128} textAnchor="middle" fontFamily="Itim, sans-serif" fontSize={56} fill="#F6EFE3">TRÀ ĐÁ</text>
      <text x={x1 - 160} y={top + 128} textAnchor="middle" fontFamily="Itim, sans-serif" fontSize={56} fill="#F6EFE3">NƯỚC MÍA</text>
      <rect x={x0 - 14} y={top - 14} width={w + 28} height={30} rx={8} fill="#B9855A" />
      <rect x={x0 - 14} y={top - 14} width={w + 28} height={8} rx={4} fill="#E2B68A" opacity={0.8} />
      {/* jar of tea, glasses, a plate of lemons */}
      <g transform={`translate(${x0 + w * 0.78} ${top - 14})`}>
        <path d="M -52 -150 L 52 -150 L 60 0 L -60 0 Z" fill="#CFE7EA" opacity={0.28} stroke="#E8F6F6" strokeWidth={3} />
        <path d="M -54 -110 L 54 -110 L 60 0 L -60 0 Z" fill="#B8681E" opacity={0.9} />
        <rect x={-58} y={-168} width={116} height={22} rx={8} fill="#8A5A3A" />
        <circle cx={-14} cy={-66} r={18} fill="#F2D24A" /><circle cx={20} cy={-36} r={16} fill="#F2D24A" />
      </g>
      {glasses.map((gx, i) => (
        <Glass key={i} x={gx} y={top - 14} s={1.1} fill={0.55 + 0.1 * (i % 3)} />
      ))}
      <ellipse cx={x0 + w * 0.5} cy={top - 12} rx={60} ry={8} fill="#000" opacity={0.2} />
      <ellipse cx={(x0 + x1) / 2} cy={top + 214} rx={w * 0.52} ry={14} fill="#000" opacity={0.3} />
    </g>
  );
};

// ---------- the night window with curtains (D5) ----------
export const NightWindow: React.FC<{ t: number; x0: number; y0: number; x1: number; y1: number }> = ({ t, x0, y0, x1, y1 }) => {
  const bike = ((t * 9) % 1500) - 200;
  return (
    <g>
      <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill="#0B1230" />
      <clipPath id="nwclip"><rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} /></clipPath>
      <g clipPath="url(#nwclip)">
        <rect x={x0} y={y0} width={x1 - x0} height={(y1 - y0) * 0.55} fill="#18214A" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i}>
            <rect x={x0 + i * 110 - 20} y={y0 + 150 + rnd(11, i) * 120} width={100} height={400} fill="#111736" />
            {[0, 1, 2].map((k) => (rnd(12, i * 3 + k) > 0.5 ? <rect key={k} x={x0 + i * 110 + 4 + k * 28} y={y0 + 190 + rnd(11, i) * 120 + k * 40} width={14} height={18} fill="#FFC27A" opacity={0.75} /> : null))}
          </g>
        ))}
        <rect x={x0} y={y1 - 130} width={x1 - x0} height={140} fill="#0A0F26" />
        {/* a street lamp, its pool of light, a lone figure walking and a bike's headlight */}
        <rect x={x0 + 90} y={y1 - 330} width={7} height={210} fill="#050816" />
        <circle cx={x0 + 93} cy={y1 - 335} r={9} fill="#FFE2A0" />
        <Glow x={x0 + 93} y={y1 - 335} r={170} o={0.7} />
        <ellipse cx={x0 + 93} cy={y1 - 100} rx={140} ry={26} fill="#FFD28A" opacity={0.2} />
        <g transform={`translate(${x0 + 360 + Math.sin(t / 40) * 10} ${y1 - 96})`}>
          <ellipse cy={4} rx={26} ry={6} fill="#000" opacity={0.4} />
          <rect x={-10} y={-92} width={20} height={70} rx={8} fill="#04060F" /><circle cy={-104} r={13} fill="#04060F" />
          <rect x={-10} y={-26} width={8} height={26} fill="#04060F" /><rect x={2} y={-26} width={8} height={26} fill="#04060F" />
        </g>
        <g transform={`translate(${x0 + bike} ${y1 - 70})`}>
          <Glow x={44} y={-10} r={120} kind="cool" o={0.8} />
          <circle cx={44} cy={-10} r={9} fill="#F4F8FF" />
          <rect x={-34} y={-30} width={66} height={22} rx={10} fill="#04060F" />
        </g>
      </g>
      {/* frame and sill */}
      <rect x={x0 - 14} y={y0 - 14} width={x1 - x0 + 28} height={14} fill="#2A2236" />
      <rect x={x0 - 14} y={y1} width={x1 - x0 + 28} height={22} fill="#3A2F46" />
      <rect x={(x0 + x1) / 2 - 5} y={y0} width={10} height={y1 - y0} fill="#2A2236" />
    </g>
  );
};

// ---------- a wall camera (CCTV): pops on with an overshoot, red light blinking, a faint view cone ----------
export const WallCamera: React.FC<{ x: number; y: number; t: number; t0: number; flip?: boolean; s?: number; ang?: number }> = ({ x, y, t, t0, flip = false, s = 1, ang = 28 }) => {
  const k = t - t0;
  if (k < 0) return null;
  const pop = backOut(clamp(k / 7));
  const sweep = Math.sin(t / 18 + x) * 7;
  const blink = Math.floor(t / 8) % 2 ? 1 : 0.25;
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s * pop} ${s * pop})`}>
      <g opacity={0.2 * clamp(k / 10)} transform={`rotate(${ang + sweep})`}>
        <path d="M 40 8 L 340 -90 L 340 130 Z" fill="#E8F4FF" />
      </g>
      <rect x={-40} y={-30} width={24} height={60} rx={4} fill="#3A3A46" />
      <path d="M -20 0 L 8 0" stroke="#4A4A58" strokeWidth={12} strokeLinecap="round" />
      <g transform={`rotate(${ang * 0.5 + sweep})`}>
        <rect x={0} y={-20} width={86} height={40} rx={10} fill="#D9DCE4" stroke="#1B1D26" strokeWidth={3} />
        <rect x={0} y={-20} width={86} height={11} rx={5} fill="#F4F6FA" opacity={0.8} />
        <rect x={74} y={-16} width={18} height={32} rx={6} fill="#1B1D26" />
        <circle cx={86} cy={0} r={8} fill="#2A4A7A" /><circle cx={84} cy={-3} r={2.6} fill="#CFE6FF" />
        <circle cx={14} cy={0} r={5} fill="#FF3B30" opacity={blink} />
      </g>
    </g>
  );
};

// ---------- a big guard: dark suit, white shirt, tie, shades, earpiece, arms crossed (a silhouette, nobody known) ----------
export const Guard: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const br = Math.sin(t / 14) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={190} ry={22} fill="#000" opacity={0.45} />
      <rect x={-72} y={-250} width={58} height={252} rx={14} fill="#14141C" />
      <rect x={14} y={-250} width={58} height={252} rx={14} fill="#14141C" />
      <rect x={-84} y={-8} width={76} height={20} rx={8} fill="#08080C" /><rect x={8} y={-8} width={76} height={20} rx={8} fill="#08080C" />
      <g transform={`translate(0 ${br})`}>
        <path d="M -170 -270 Q -176 -470 -90 -500 L 90 -500 Q 176 -470 170 -270 Z" fill="#1A1A24" />
        <path d="M 170 -270 Q 176 -470 90 -500 L 120 -500 Q 200 -460 196 -270 Z" fill="#FFB070" opacity={0.28} />
        <path d="M -34 -500 L 0 -420 L 34 -500 Z" fill="#E9E6E0" />
        <path d="M -9 -440 L 9 -440 L 15 -340 L 0 -318 L -15 -340 Z" fill="#8E2430" />
        {/* crossed arms */}
        <path d="M -176 -330 Q -80 -310 140 -380 L 160 -338 Q -40 -270 -176 -290 Z" fill="#22222E" stroke="#0A0A10" strokeWidth={4} />
        <path d="M 176 -330 Q 80 -300 -140 -370 L -160 -330 Q 40 -262 176 -290 Z" fill="#1E1E2A" stroke="#0A0A10" strokeWidth={4} />
        <rect x={-30} y={-540} width={60} height={50} fill="#9A6A4A" />
        <ellipse cx={0} cy={-590} rx={64} ry={72} fill="#B07A58" />
        <path d="M -66 -600 Q -60 -668 0 -668 Q 60 -668 66 -600 Q 40 -632 0 -632 Q -40 -632 -66 -600 Z" fill="#0E0E14" />
        <rect x={-58} y={-610} width={116} height={26} rx={12} fill="#05050A" />
        <rect x={-58} y={-610} width={116} height={7} rx={3} fill="#5A6A8A" opacity={0.5} />
        <path d="M 62 -590 Q 96 -560 78 -500" stroke="#0A0A10" strokeWidth={3} fill="none" />
        <circle cx={63} cy={-586} r={6} fill="#0A0A10" />
        <path d="M -22 -548 Q 0 -536 22 -548" stroke="#3A2218" strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- a SIM card: gold chip, cut corner; x, y centre ----------
export const SimCard: React.FC<{ x: number; y: number; s?: number; rot?: number; label?: string }> = ({ x, y, s = 1, rot = 0, label }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-8} y={10} width={150} height={190} rx={14} fill="#000" opacity={0.3} transform="translate(-60 -100)" />
    <path d="M -70 -90 L 30 -90 L 70 -50 L 70 90 L -70 90 Z" fill="#2A4D86" stroke="#0E1B38" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -70 -90 L 30 -90 L 70 -50" stroke="#6C93D6" strokeWidth={4} fill="none" opacity={0.7} />
    <rect x={-34} y={-34} width={68} height={62} rx={8} fill="#E3B84A" stroke="#8A6A1E" strokeWidth={3} />
    <path d="M -34 -13 H 34 M -34 8 H 34 M -8 -34 V 28 M 12 -34 V 28" stroke="#8A6A1E" strokeWidth={2.4} />
    {label ? <text x={0} y={72} textAnchor="middle" fontFamily="Space Mono, monospace" fontWeight={700} fontSize={18} fill="#DCE8FF">{label}</text> : null}
  </g>
);


/** A phone showing a generic bank app: green header, a big tick, "NGÂN HÀNG". x, y centre, w width. */
export const BankPhone: React.FC<{ x: number; y: number; w?: number; rot?: number }> = ({ x, y, w = 62, rot = 0 }) => {
  const h = w * 2.05;
  const k = w / 62;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.16} fill="#16151C" stroke="#4A4660" strokeWidth={3 * k} />
      <rect x={-w / 2 + 4 * k} y={-h / 2 + 6 * k} width={w - 8 * k} height={h - 12 * k} rx={w * 0.12} fill="#EAF7EF" />
      <rect x={-w / 2 + 4 * k} y={-h / 2 + 6 * k} width={w - 8 * k} height={26 * k} rx={w * 0.1} fill="#2FBF71" />
      <text x={0} y={-h / 2 + 24 * k} textAnchor="middle" fontFamily="Space Mono, monospace" fontWeight={700} fontSize={8 * k} fill="#fff">NGÂN HÀNG</text>
      <circle cx={0} cy={4 * k} r={17 * k} fill="#2FBF71" />
      <path d={`M ${-8 * k} ${4 * k} l ${6 * k} ${7 * k} l ${11 * k} ${-14 * k}`} stroke="#fff" strokeWidth={4.5 * k} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={-18 * k} y={34 * k} width={36 * k} height={5 * k} rx={2.5 * k} fill="#9ACFB0" />
    </g>
  );
};
