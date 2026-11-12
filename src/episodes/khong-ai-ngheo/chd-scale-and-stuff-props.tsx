import React from 'react';
import { FONT, clamp, easeOut } from '../../engine';

// Chapter D, the balance: a scale (pivot, beam, two hanging pans), a huge pile of stuff ("tiêu thật nhiều") and a
// modest set ("ai cũng đủ": a bowl of rice, a roof, books). Pans are drawn through render callbacks that receive
// the pan's centre, so whatever sits on them follows the beam.

const INK = '#1D2033';
const ARM = 360;
const DROP = 250;

export type PanFn = (c: { x: number; y: number }) => React.ReactNode;

/** The scale. `ang` in degrees: negative = the left side goes down. Pivot at (x, y); pans hang DROP below the beam ends. */
export const ScaleRig: React.FC<{ x: number; y: number; ang: number; t: number; left?: PanFn; right?: PanFn; capL?: string; capR?: string; capO?: number }> = ({
  x, y, ang, t, left, right, capL, capR, capO = 1,
}) => {
  const a = (ang * Math.PI) / 180;
  const eL = { x: x - ARM * Math.cos(a), y: y - ARM * Math.sin(a) };
  const eR = { x: x + ARM * Math.cos(a), y: y + ARM * Math.sin(a) };
  const sw = Math.sin(t / 8) * 2;
  const pan = (e: { x: number; y: number }, fn: PanFn | undefined, cap: string | undefined, key: string) => {
    const c = { x: e.x + sw, y: e.y + DROP };
    return (
      <g key={key}>
        <path d={`M ${e.x} ${e.y} L ${c.x - 160} ${c.y} M ${e.x} ${e.y} L ${c.x + 160} ${c.y}`} stroke="#E9D9A8" strokeWidth={4} />
        <path d={`M ${c.x - 190} ${c.y} Q ${c.x} ${c.y + 90} ${c.x + 190} ${c.y} Z`} fill="#D9B25A" stroke={INK} strokeWidth={5} />
        <ellipse cx={c.x} cy={c.y} rx={190} ry={13} fill="#F0D283" stroke={INK} strokeWidth={4} />
        {fn ? fn({ x: c.x, y: c.y }) : null}
        {cap ? (
          <g opacity={capO} transform={`translate(${c.x} ${c.y + 150})`}>
            <rect x={-200} y={-38} width={400} height={66} rx={33} fill="#0B1226" opacity={0.65} />
            <text x={0} y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={cap.length > 12 ? 34 : 40} fill="#F6EFE3" letterSpacing={2}>{cap}</text>
          </g>
        ) : null}
      </g>
    );
  };
  return (
    <g>
      <ellipse cx={x} cy={y + 650} rx={260} ry={22} fill="#000" opacity={0.35} />
      <path d={`M ${x - 150} ${y + 650} L ${x - 60} ${y + 600} H ${x + 60} L ${x + 150} ${y + 650} Z`} fill="#6B4630" stroke={INK} strokeWidth={5} />
      <rect x={x - 22} y={y} width={44} height={610} rx={10} fill="#8B5A3C" stroke={INK} strokeWidth={5} />
      <g transform={`rotate(${ang} ${x} ${y})`}>
        <rect x={x - ARM - 18} y={y - 16} width={ARM * 2 + 36} height={32} rx={16} fill="#D9B25A" stroke={INK} strokeWidth={5} />
      </g>
      {pan(eL, left, capL, 'L')}
      {pan(eR, right, capR, 'R')}
      <circle cx={x} cy={y} r={30} fill="#F0D283" stroke={INK} strokeWidth={5} />
      <circle cx={x} cy={y} r={10} fill={INK} />
    </g>
  );
};

/** A falling-in animation helper: 0 before `at`, then eased to 1 over `dur` frames. */
const fall = (t: number, at: number, dur = 9) => easeOut(clamp((t - at) / dur));

const Item: React.FC<{ kind: number; w: number }> = ({ kind, w }) => {
  const h = w * 0.8;
  switch (kind % 5) {
    case 0:
      return (
        <g>
          <rect x={-w / 2} y={-h} width={w} height={h} rx={6} fill="#B9803F" stroke={INK} strokeWidth={4} />
          <path d={`M ${-w / 2} ${-h * 0.5} H ${w / 2} M ${-w / 4} ${-h} V 0 M ${w / 4} ${-h} V 0`} stroke="#7A5020" strokeWidth={3} />
        </g>
      );
    case 1:
      return (
        <g>
          <rect x={-w / 2} y={-h} width={w} height={h} rx={6} fill="#E0527A" stroke={INK} strokeWidth={4} />
          <path d={`M 0 ${-h} V 0 M ${-w / 2} ${-h / 2} H ${w / 2}`} stroke="#FFE27A" strokeWidth={9} />
          <path d={`M 0 ${-h} q -22 -26 -32 -6 M 0 ${-h} q 22 -26 32 -6`} stroke="#FFE27A" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      );
    case 2:
      return (
        <g>
          <rect x={-w / 2} y={-h} width={w} height={h * 0.8} rx={8} fill="#2B2F3A" stroke={INK} strokeWidth={4} />
          <rect x={-w / 2 + 8} y={-h + 8} width={w - 16} height={h * 0.8 - 16} rx={4} fill="#5CC8E8" />
          <rect x={-w / 4} y={-h * 0.2} width={w / 2} height={h * 0.2} fill="#2B2F3A" />
        </g>
      );
    case 3:
      return (
        <g>
          <path d={`M ${-w / 2} 0 V ${-h * 0.35} Q ${-w / 2} ${-h * 0.5} ${-w * 0.3} ${-h * 0.5} L ${-w * 0.18} ${-h * 0.9} H ${w * 0.18} L ${w * 0.3} ${-h * 0.5} Q ${w / 2} ${-h * 0.5} ${w / 2} ${-h * 0.35} V 0 Z`} fill="#E9B12E" stroke={INK} strokeWidth={4} />
          <circle cx={-w * 0.28} cy={0} r={w * 0.11} fill="#23222B" stroke={INK} strokeWidth={3} />
          <circle cx={w * 0.28} cy={0} r={w * 0.11} fill="#23222B" stroke={INK} strokeWidth={3} />
        </g>
      );
    default:
      return (
        <g>
          <path d={`M ${-w * 0.42} 0 Q ${-w * 0.55} ${-h * 0.7} ${-w * 0.2} ${-h * 0.9} L ${-w * 0.12} ${-h} H ${w * 0.12} L ${w * 0.2} ${-h * 0.9} Q ${w * 0.55} ${-h * 0.7} ${w * 0.42} 0 Z`} fill="#6FB38A" stroke={INK} strokeWidth={4} />
          <text x={0} y={-h * 0.35} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={w * 0.4} fill="#1D4A2A">đ</text>
        </g>
      );
  }
};

/** A huge pile (pyramid of 10 things) on a pan centred at (x, y); things fall in one after another from t0. */
export const StuffPile: React.FC<{ x: number; y: number; t: number; t0?: number; out?: number }> = ({ x, y, t, t0 = 0, out = 0 }) => {
  const rows = [4, 3, 2, 1];
  let n = 0;
  return (
    <g opacity={1 - out} transform={`translate(${x} ${y - 6}) scale(${1 - out * 0.4})`}>
      {rows.map((cnt, r) =>
        Array.from({ length: cnt }).map((_, c) => {
          const i = n++;
          const q = fall(t, t0 + i * 2.2, 8);
          const px = (c - (cnt - 1) / 2) * 112;
          const py = -r * 112;
          return q > 0 ? (
            <g key={`${r}-${c}`} transform={`translate(${px} ${py - (1 - q) * 800}) scale(${1 + (1 - q) * 0.1})`}>
              <Item kind={i + 2 * r} w={128 + (i % 3) * 10} />
            </g>
          ) : null;
        }),
      )}
    </g>
  );
};

/** "Ai cũng đủ": a bowl of rice, a little house with a roof, a stack of books; each drops in at its own time. */
export const EnoughSet: React.FC<{ x: number; y: number; t: number; t0?: number }> = ({ x, y, t, t0 = 0 }) => {
  const pop = (at: number) => {
    const q = clamp((t - at) / 10);
    return { o: clamp(q * 3), dy: -(1 - easeOut(q)) * 420, k: 1 + (q > 0 && q < 1 ? Math.sin(q * 3.1416) * 0.06 : 0) };
  };
  const b = pop(t0);
  const h = pop(t0 + 4);
  const k = pop(t0 + 8);
  return (
    <g transform={`translate(${x} ${y - 6})`}>
      <g transform={`translate(-112 ${b.dy})`} opacity={b.o}>
        <path d="M -52 -50 Q -50 0 0 4 Q 50 0 52 -50 Z" fill="#F2EEE6" stroke={INK} strokeWidth={4} />
        <path d="M -48 -30 H 48" stroke="#3E8C86" strokeWidth={6} />
        <ellipse cx={0} cy={-52} rx={52} ry={12} fill="#F8F5EE" stroke={INK} strokeWidth={4} />
        <path d="M -40 -54 Q 0 -96 40 -54 Z" fill="#FFFFFF" stroke="#D9D2C2" strokeWidth={3} />
        <path d="M 20 -70 L 78 -112 M 34 -66 L 90 -104" stroke="#C99A5E" strokeWidth={5} strokeLinecap="round" />
      </g>
      <g transform={`translate(0 ${h.dy}) scale(${h.k})`} opacity={h.o}>
        <rect x={-60} y={-100} width={120} height={100} fill="#F0D8A8" stroke={INK} strokeWidth={4} />
        <path d="M -82 -98 L 0 -166 L 82 -98 Z" fill="#C9553E" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-18} y={-62} width={36} height={62} fill="#7A5A3C" stroke={INK} strokeWidth={3} />
        <rect x={32} y={-82} width={20} height={24} fill="#9FD3E8" stroke={INK} strokeWidth={3} />
      </g>
      <g transform={`translate(116 ${k.dy})`} opacity={k.o}>
        {[['#3E7FC8', 0, 98], ['#E9B12E', -20, 86], ['#D9473A', -40, 92]].map(([c, dy, w], i) => (
          <g key={i}>
            <rect x={-Number(w) / 2 + (i % 2) * 4} y={Number(dy) - 28} width={Number(w)} height={26} rx={3} fill={String(c)} stroke={INK} strokeWidth={4} transform={`translate(0 ${i * -2 + 0})`} />
            <path d={`M ${-Number(w) / 2 + 10} ${Number(dy) - 15} H ${Number(w) / 2 - 8}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={3} />
          </g>
        ))}
      </g>
    </g>
  );
};

