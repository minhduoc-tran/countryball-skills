import React from 'react';
import { SCH, FONT, clamp, easeOut, easeInOut, backOut, rnd } from '../../engine';

// Chapter D props, part 2: Newton's third law and the invincible body. Schematic pieces in 1920 x 1080 screen units,
// pure functions of the shot clock t.
//
//   <NewtonCradle t x y s? />                   five steel balls; the end balls swing in turn
//   <BigArrow x0 y0 x1 y1 t color? label? />    thick arrow that grows from its tail, with a label at its middle
//   <FistIcon x y s? rot? />                    cream fist (side view) with dark cuff
//   <BrickWall x y w h />                       a wall seen side-on (bricks)
//   <XRayHand x y s t crack? />                 stylised X-ray: palm + 5 finger bone chains on a blue ghost hand; crack 0..1 splits a knuckle bone
//   <ShieldOutline x y w h t o? />              glowing capsule outline with a rolling highlight (invincible body)

const INK = '#16101A';

export const NewtonCradle: React.FC<{ t: number; x: number; y: number; s?: number }> = ({ t, x, y, s = 1 }) => {
  const period = 44;
  const ph = (t % period) / period; // 0..1
  const swing = Math.sin(ph * Math.PI * 2);
  const leftA = swing > 0 ? -38 * swing : 0; // left ball swings out on the first half
  const rightA = swing < 0 ? 38 * -swing : 0; // right ball swings on the second
  const R = 40;
  const L = 330;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -300 0 L 300 0`} stroke={SCH.line} strokeWidth={12} strokeLinecap="round" />
      <path d="M -300 0 L -300 460 M 300 0 L 300 460" stroke={SCH.line} strokeWidth={12} strokeLinecap="round" />
      <path d="M -340 460 L -260 460 M 260 460 L 340 460" stroke={SCH.line} strokeWidth={12} strokeLinecap="round" />
      {[-2, -1, 0, 1, 2].map((i) => {
        const a = i === -2 ? leftA : i === 2 ? rightA : 0;
        const bx = i * R * 2;
        return (
          <g key={i} transform={`translate(${bx} 0) rotate(${a})`}>
            <line x1={0} y1={0} x2={0} y2={L} stroke={SCH.dim} strokeWidth={4} />
            <circle cx={0} cy={L + R} r={R} fill="#C8D2E4" stroke={INK} strokeWidth={5} />
            <path d={`M ${-R * 0.5} ${L + R * 0.4} q ${R * 0.2} ${-R * 0.35} ${R * 0.6} ${-R * 0.25}`} stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.8} />
          </g>
        );
      })}
    </g>
  );
};

export const BigArrow: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; color?: string; label?: string; width?: number }> = ({ x0, y0, x1, y1, t, color = SCH.live, label, width = 46 }) => {
  const p = easeOut(clamp(t / 9));
  if (p <= 0) return null;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.hypot(dx, dy) * p;
  const a = (Math.atan2(dy, dx) * 180) / Math.PI;
  const head = Math.min(len, 90);
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${a})`} style={{ filter: `drop-shadow(0 0 14px ${color}88)` }}>
      <polygon points={`0,${-width / 2} ${len - head},${-width / 2} ${len - head},${-width} ${len},0 ${len - head},${width} ${len - head},${width / 2} 0,${width / 2}`} fill={color} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      {label && p > 0.9 ? (
        <text x={(len - head) / 2} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={INK} transform={`rotate(${Math.abs(a) > 90 ? 180 : 0} ${(len - head) / 2} 0)`}>{label}</text>
      ) : null}
    </g>
  );
};

export const FistIcon: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-210} y={-52} width={150} height={104} rx={14} fill="#2E2B3D" stroke={INK} strokeWidth={7} />
    <rect x={-80} y={-84} width={190} height={168} rx={44} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
    <path d="M 20 -60 v 44 M 20 -4 v 44 M -30 -70 h 50" stroke={INK} strokeWidth={5} opacity={0.45} strokeLinecap="round" />
    <rect x={-6} y={-96} width={90} height={40} rx={20} fill="#F6EFE3" stroke={INK} strokeWidth={7} />
  </g>
);

export const BrickWall: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => {
  const bh = 60;
  const bw = 130;
  const rows = Math.ceil(h / bh);
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#8E4F3A" stroke={INK} strokeWidth={8} />
      {Array.from({ length: rows }).map((_, r) => (
        <g key={r}>
          <line x1={x} y1={y + r * bh} x2={x + w} y2={y + r * bh} stroke="#5A2E22" strokeWidth={5} />
          {Array.from({ length: Math.ceil(w / bw) + 1 }).map((_, c) => {
            const bx = x + c * bw + (r % 2 ? bw / 2 : 0);
            return bx > x && bx < x + w ? <line key={c} x1={bx} y1={y + r * bh} x2={bx} y2={Math.min(y + h, y + (r + 1) * bh)} stroke="#5A2E22" strokeWidth={5} /> : null;
          })}
        </g>
      ))}
    </g>
  );
};

/** Stylised hand X-ray, fingers up, about 560 tall at s 1 (centre x, y). Bones are round-ended bars; `crack` splits one knuckle bone with a white flash. */
export const XRayHand: React.FC<{ x: number; y: number; s?: number; t: number; crack?: number }> = ({ x, y, s = 1, t, crack = 0 }) => {
  const fingers = [
    { bx: -150, by: -40, len: [96, 70, 56], ang: -16 },
    { bx: -55, by: -70, len: [112, 80, 62], ang: -5 },
    { bx: 40, by: -76, len: [120, 86, 66], ang: 3 },
    { bx: 135, by: -52, len: [104, 74, 58], ang: 13 },
  ];
  const bone = (x1: number, y1: number, x2: number, y2: number, w: number, key: string, bad = false) => (
    <g key={key}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CDEBFF" strokeWidth={w} strokeLinecap="round" opacity={bad ? 0.35 : 0.95} />
      <circle cx={x1} cy={y1} r={w * 0.85} fill="#E8F6FF" opacity={0.95} />
    </g>
  );
  const jx = crack > 0 && crack < 1 ? (rnd(4, Math.floor(t)) - 0.5) * 8 : 0;
  return (
    <g transform={`translate(${x + jx} ${y}) scale(${s})`}>
      {/* the ghost hand */}
      <path d="M -200 330 Q -230 100 -190 -40 Q -170 -140 -120 -150 L 160 -180 Q 230 -120 210 -20 Q 200 120 190 330 Z" fill="#2A6FA8" opacity={0.45} stroke="#7FD4FF" strokeWidth={5} />
      <path d="M -190 -20 Q -250 -60 -300 -170 Q -300 -230 -250 -200 Q -210 -140 -170 -90" fill="#2A6FA8" opacity={0.45} stroke="#7FD4FF" strokeWidth={5} />
      {/* wrist bones and the palm bones */}
      {[-55, 0, 55].map((w, i) => bone(w, 300, w * 0.6, 200, 26, `w${i}`))}
      {fingers.map((f, i) => {
        const a = (f.ang * Math.PI) / 180;
        const meta = [f.bx * 0.45, 190];
        const j1 = { x: f.bx, y: f.by };
        const out: React.ReactNode[] = [bone(meta[0], meta[1], j1.x, j1.y, 22, `m${i}`)];
        let px = j1.x;
        let py = j1.y;
        f.len.forEach((L, k) => {
          const nx = px + Math.sin(a) * L;
          const ny = py - Math.cos(a) * L;
          // finger index 2 (middle), first segment is the one that cracks
          const broken = i === 1 && k === 0 && crack > 0;
          if (broken) {
            const mx = (px + nx) / 2;
            const my = (py + ny) / 2;
            const gap = 14 * crack;
            out.push(bone(px, py, mx - gap * 0.4, my + gap * 0.6, 20, `f${i}${k}a`));
            out.push(bone(mx + gap * 0.4, my - gap * 0.6, nx + gap, ny, 20, `f${i}${k}b`));
          } else out.push(bone(px, py, nx, ny, 20 - k * 2, `f${i}${k}`));
          px = nx;
          py = ny;
        });
        return <g key={i}>{out}</g>;
      })}
      {bone(-190, -20, -255, -120, 22, 't1')}
      {bone(-255, -120, -280, -190, 18, 't2')}
      {crack > 0 ? (
        <g>
          <path d="M -80 -90 L -48 -108 L -66 -126 L -30 -142 L -48 -160" stroke="#FF5A4A" strokeWidth={9} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={clamp(crack * 3)} />
          <circle cx={-55} cy={-120} r={30 + 200 * (1 - Math.abs(crack - 0.15) * 3)} fill="#FFFFFF" opacity={crack < 0.3 ? 0.8 * (1 - crack / 0.3) : 0} />
        </g>
      ) : null}
    </g>
  );
};

/** Glowing capsule outline (an invincible body) centred on (x, y): pulses, with a highlight that rolls round it. */
export const ShieldOutline: React.FC<{ x: number; y: number; w: number; h: number; t: number; o?: number; color?: string }> = ({ x, y, w, h, t, o = 1, color = '#7FD4FF' }) => {
  const pulse = 0.85 + 0.15 * Math.sin(t * 0.35);
  const d = `M ${-w / 2} ${-h / 2 + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${w / 2} ${-h / 2 + w / 2} L ${w / 2} ${h / 2 - w / 2} A ${w / 2} ${w / 2} 0 0 1 ${-w / 2} ${h / 2 - w / 2} Z`;
  const perim = 2 * (h - w) + Math.PI * w;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <path d={d} fill={color} opacity={0.12 * pulse} />
      <path d={d} fill="none" stroke={color} strokeWidth={18} opacity={0.3 * pulse} style={{ filter: 'blur(10px)' }} />
      <path d={d} fill="none" stroke={color} strokeWidth={9} opacity={pulse} strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={11} strokeLinecap="round" pathLength={perim} strokeDasharray={`${perim * 0.12} ${perim * 0.88}`} strokeDashoffset={-((t * 7) % perim)} opacity={0.9} />
      {/* hex facets inside the field */}
      {[-0.28, 0, 0.28].map((k, i) => (
        <path key={i} d={`M ${-w * 0.32} ${h * k} l ${w * 0.16} ${-w * 0.09} l ${w * 0.16} ${w * 0.09} l ${w * 0.16} ${-w * 0.09} l ${w * 0.16} ${w * 0.09}`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.25 + 0.15 * Math.sin(t * 0.3 + i)} />
      ))}
    </g>
  );
};

/** A "Đó là thật." check stamp: pops in at 0 (rotated rounded box with a tick). */
export const TrueStamp: React.FC<{ x: number; y: number; t: number; text?: string; size?: number }> = ({ x, y, t, text = 'ĐÓ LÀ THẬT', size = 78 }) => {
  if (t < 0) return null;
  const s = backOut(clamp(t / 7));
  const w = text.length * size * 0.66 + 140;
  return (
    <g transform={`translate(${x} ${y}) rotate(-5) scale(${s})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.7} rx={22} fill="#0E1A12" stroke="#5BD68A" strokeWidth={8} opacity={0.94} />
      <g transform={`translate(${-w / 2 + 72} ${-size * 0.1})`}>
        <circle r={size * 0.52} fill="#5BD68A" />
        <path d={`M ${-size * 0.24} 2 l ${size * 0.17} ${size * 0.2} l ${size * 0.32} ${-size * 0.4}`} stroke={INK} strokeWidth={size * 0.12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <text x={60} y={size * 0.2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#E8FFF0" letterSpacing={2}>{text}</text>
    </g>
  );
};

export const lerpEase = (t: number, a: number, b: number) => a + (b - a) * easeInOut(clamp(t));
