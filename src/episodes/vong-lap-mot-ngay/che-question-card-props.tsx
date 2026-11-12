import React from 'react';
import { clamp, backOut, FONT } from '../../engine';
import { PAL } from './kit-palette';

// Chapter E end-card props. Pure functions of t. x, y = CENTRE.
//   <ChoiceCard x y t at lines>{icon}</ChoiceCard>  a cream card (330 x 330) popping in at `at`: an icon in the top
//       half (drawn in card-local coords around (0, -50)), a two-line label below.
//   Icons (card-local, ~150 across): <LangIcon /> (a book with あ and A), <TicketIcon /> (two lottery balls + a ticket),
//   <SlowIcon /> (a steaming cup of tea and a heart).

export const ChoiceCard: React.FC<{ x: number; y: number; t: number; at: number; lines: [string, string]; children?: React.ReactNode }> = ({ x, y, t, at, lines, children }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 9));
  const bob = Math.sin((t - at) / 14) * 4;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${k})`}>
      <rect x={-157} y={-153} width={330} height={330} rx={34} fill="#000" opacity={0.35} />
      <rect x={-165} y={-165} width={330} height={330} rx={34} fill="#FFF6E4" stroke="#14121A" strokeWidth={7} />
      <g transform="translate(0 -52)">{children}</g>
      {lines.map((ln, i) => (
        <text key={i} y={66 + i * 44} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#1D2033">{ln}</text>
      ))}
    </g>
  );
};

export const LangIcon: React.FC = () => (
  <g>
    <path d="M -80 -50 L 0 -36 L 80 -50 L 80 50 L 0 64 L -80 50 Z" fill="#3E6A8A" stroke="#14121A" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -70 -42 L -2 -30 L -2 54 L -70 42 Z" fill={PAL.paper} />
    <path d="M 70 -42 L 2 -30 L 2 54 L 70 42 Z" fill={PAL.paperShade} />
    <text x={-36} y={22} textAnchor="middle" fontFamily="sans-serif" fontWeight={700} fontSize={50} fill="#C8382E">あ</text>
    <text x={36} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#1D2033">A</text>
  </g>
);

export const TicketIcon: React.FC = () => (
  <g>
    <g transform="rotate(-10)">
      <rect x={-90} y={-30} width={180} height={90} rx={10} fill={PAL.paper} stroke="#14121A" strokeWidth={5} />
      <rect x={-90} y={-30} width={180} height={24} rx={8} fill="#C8382E" />
      {[-56, -18, 20, 58].map((dx) => <circle key={dx} cx={dx} cy={26} r={15} fill="none" stroke="#C8382E" strokeWidth={4} />)}
    </g>
    <circle cx={-56} cy={-56} r={30} fill="#F2B33D" stroke="#14121A" strokeWidth={5} />
    <text x={-56} y={-44} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#1D2033">7</text>
    <circle cx={10} cy={-64} r={30} fill="#E8553E" stroke="#14121A" strokeWidth={5} />
    <text x={10} y={-52} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#FFFFFF">45</text>
  </g>
);

export const SlowIcon: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <path d="M -70 -10 L 50 -10 L 40 60 Q 38 74 24 74 L -44 74 Q -58 74 -60 60 Z" fill="#E9E2D2" stroke="#14121A" strokeWidth={5} strokeLinejoin="round" />
    <path d="M 48 6 Q 84 6 80 30 Q 76 52 44 50" stroke="#14121A" strokeWidth={8} fill="none" />
    <ellipse cx={-10} cy={-10} rx={60} ry={10} fill="#8A5A34" stroke="#14121A" strokeWidth={4} />
    {[-30, 0, 30].map((dx, k) => <path key={dx} d={`M ${dx - 10} -26 q 14 -14 0 -28 q -14 -14 0 -28`} stroke="#B8B0A6" strokeWidth={5} fill="none" strokeLinecap="round" opacity={0.5 + 0.4 * Math.sin(t / 6 + k)} />)}
    <path d="M 60 -78 C 60 -96 86 -100 90 -80 C 94 -100 120 -96 120 -78 C 120 -60 96 -48 90 -38 C 84 -48 60 -60 60 -78 Z" fill="#E8553E" stroke="#14121A" strokeWidth={4} transform={`scale(${1 + 0.06 * Math.sin(t / 5)})`} />
  </g>
);
