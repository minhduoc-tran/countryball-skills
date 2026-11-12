import React from 'react';
import { clamp, kf, easeOut, rnd, Glow, Kid, KIDS, FONT } from '../../engine';

// Chapter B props (3/5): the rebuilt school (facade with a paint wipe, a library wall, a new pitch) and the cinema
// (doors that swing open on screen light, a hall full of classmates). All pure functions of t.

// ---------- the school facade: `wipe` (0..1) paints the old grey building new from the left ----------
const Facade: React.FC<{ fresh: boolean; t: number }> = ({ fresh, t }) => {
  const wall = fresh ? '#F6DFA0' : '#8E8A8F';
  const shade = fresh ? '#E0C078' : '#6E6A70';
  const roof = fresh ? '#D8603E' : '#5A5560';
  const frame = fresh ? '#FFFFFF' : '#4A4650';
  const glass = fresh ? '#9ADCF2' : '#3A4452';
  return (
    <g>
      <rect x={300} y={330} width={1320} height={560} fill={wall} />
      <rect x={300} y={330} width={1320} height={26} fill={shade} />
      <path d={`M 250 340 L 420 220 L 1500 220 L 1670 340 Z`} fill={roof} />
      <rect x={880} y={420} width={160} height={90} rx={8} fill={fresh ? '#2F8F6A' : '#4A4650'} />
      <text x={960} y={485} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} fill={fresh ? '#FFF6D8' : '#6A6670'} letterSpacing={2}>TRƯỜNG</text>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const x = 350 + (i % 3) * 140 + (i >= 3 ? 840 : 0);
        return [0, 1].map((r) => (
          <g key={`${i}${r}`}>
            <rect x={x} y={430 + r * 200} width={100} height={130} fill={frame} />
            <rect x={x + 8} y={438 + r * 200} width={84} height={114} fill={glass} />
            <path d={`M ${x + 50} ${438 + r * 200} V ${552 + r * 200} M ${x + 8} ${495 + r * 200} H ${x + 92}`} stroke={frame} strokeWidth={5} />
            {fresh ? <path d={`M ${x + 14} ${446 + r * 200} L ${x + 40} ${446 + r * 200} L ${x + 14} ${480 + r * 200} Z`} fill="#fff" opacity={0.5} /> : null}
          </g>
        ));
      })}
      <rect x={870} y={650} width={180} height={240} rx={10} fill={fresh ? '#C8522E' : '#4A4650'} stroke={frame} strokeWidth={8} />
      <path d="M 960 650 V 890" stroke={frame} strokeWidth={5} />
      {!fresh ? (
        <g stroke="#3A363E" strokeWidth={5} fill="none" strokeLinecap="round">
          <path d="M 500 600 l 40 -60 l -20 -40 l 50 -50 M 1300 780 l -50 -80 l 30 -40 M 700 820 l 30 -40 l -20 -30" />
          <path d="M 320 330 l 80 60 M 1560 350 l -60 90" />
        </g>
      ) : (
        <g>
          {Array.from({ length: 14 }).map((_, i) => (
            <path key={i} d={`M ${340 + i * 94} 335 L ${387 + i * 94} 335 L ${363 + i * 94} 385 Z`} fill={['#FF6A5A', '#FFD04D', '#58C77A', '#5FB4FF'][i % 4]} transform={`rotate(${Math.sin(t / 6 + i) * 4} ${363 + i * 94} 335)`} />
          ))}
        </g>
      )}
    </g>
  );
};

export const SchoolFacade: React.FC<{ t: number; wipe: number; id: string }> = ({ t, wipe, id }) => {
  const wx = 200 + wipe * 1540;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6FB4E8" /><stop offset="1" stopColor="#FFE2B0" /></linearGradient>
        <clipPath id={`${id}new`}><rect x={-100} y={0} width={wx + 100} height={1080} /></clipPath>
      </defs>
      <rect x={-400} y={-400} width={2720} height={1480} fill={`url(#${id}sky)`} />
      <rect x={-400} y={880} width={2720} height={400} fill="#6DAF58" />
      <rect x={-400} y={880} width={2720} height={16} fill="#8CCB6A" />
      <Facade fresh={false} t={t} />
      <g clipPath={`url(#${id}new)`}><Facade fresh t={t} /></g>
      {wipe > 0 && wipe < 1 ? (
        <g>
          <rect x={wx - 8} y={220} width={16} height={680} fill="#FFFFFF" opacity={0.7} />
          <Glow x={wx} y={560} r={260} o={0.5} />
        </g>
      ) : null}
      {/* flagpole with bunting */}
      <rect x={1740} y={280} width={10} height={620} fill="#E9E4D6" />
    </g>
  );
};

// ---------- the library wall: `n` books have popped onto the shelves by now ----------
export const LibraryWall: React.FC<{ t: number; n?: number }> = ({ t, n = 99 }) => {
  const cols = ['#D94452', '#3E8CC8', '#E9B84A', '#58B368', '#8E6AD8', '#E8864A', '#F6F1E3'];
  const items: React.ReactNode[] = [];
  let count = 0;
  for (let r = 0; r < 4; r++) {
    let x = 160;
    for (let i = 0; i < 30 && x < 1760; i++) {
      const w = 34 + rnd(r + 1, i) * 26;
      const h = 130 + rnd(r + 9, i) * 70;
      const appear = count * 1.1;
      const k = clamp((n - appear) / 5);
      if (k > 0) {
        items.push(
          <g key={`${r}-${i}`} transform={`translate(${x} ${200 + r * 220 + 200}) scale(${easeOut(k)})`}>
            <rect x={0} y={-h} width={w} height={h} fill={cols[Math.floor(rnd(r + 3, i) * 7)]} stroke="#2A1A14" strokeWidth={3} />
            <rect x={4} y={-h + 18} width={w - 8} height={6} fill="#F6F1E3" opacity={0.7} />
          </g>,
        );
      }
      x += w + 4;
      count++;
    }
  }
  return (
    <g>
      <rect x={-300} y={-300} width={2600} height={1700} fill="#4A3426" />
      {[0, 1, 2, 3].map((r) => <rect key={r} x={110} y={r * 220 + 396} width={1700} height={22} fill="#8A5A36" stroke="#3A2416" strokeWidth={3} />)}
      {[110, 1790].map((x) => <rect key={x} x={x} y={150} width={22} height={1000} fill="#8A5A36" />)}
      {items}
      <Glow x={960} y={250} r={700} o={0.3} />
      <path d={`M 1500 150 L 1560 -40 L 1620 150 Z`} fill="#FFE7A0" opacity={0.0} />
    </g>
  );
};

// ---------- the new pitch: striped grass, white lines, a goal at the back, a ball rolling in ----------
export const Pitch: React.FC<{ t: number; id: string }> = ({ t, id }) => {
  const ball = kf(t, [[0, 0], [30, 1]], easeOut);
  return (
    <g>
      <defs><linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EC8F0" /><stop offset="1" stopColor="#FFE8BE" /></linearGradient></defs>
      <rect x={-400} y={-400} width={2720} height={860} fill={`url(#${id}s)`} />
      <rect x={-400} y={420} width={2720} height={40} fill="#5E9A4E" />
      {Array.from({ length: 9 }).map((_, i) => {
        const y0 = 460 + Math.pow(i / 9, 1.6) * 700;
        const y1 = 460 + Math.pow((i + 1) / 9, 1.6) * 700;
        return <rect key={i} x={-400} y={y0} width={2720} height={y1 - y0 + 1} fill={i % 2 ? '#4FA44A' : '#5CB853'} />;
      })}
      <path d="M 120 1100 L 560 480 L 1360 480 L 1800 1100" fill="none" stroke="#F6F1E3" strokeWidth={8} />
      <ellipse cx={960} cy={880} rx={280} ry={74} fill="none" stroke="#F6F1E3" strokeWidth={7} />
      {/* goal */}
      <g transform="translate(960 480)">
        <rect x={-150} y={-120} width={300} height={120} fill="#fff" opacity={0.18} />
        {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${-150 + i * 43} -120 V 0`} stroke="#F6F1E3" strokeWidth={2} opacity={0.6} />)}
        {Array.from({ length: 5 }).map((_, i) => <path key={`h${i}`} d={`M -150 ${-i * 30} H 150`} stroke="#F6F1E3" strokeWidth={2} opacity={0.6} />)}
        <path d="M -150 0 V -120 H 150 V 0" fill="none" stroke="#fff" strokeWidth={9} strokeLinejoin="round" />
      </g>
      {/* ball */}
      <g transform={`translate(${960 + 220 * (1 - ball)} ${480 + 420 * (1 - ball)}) scale(${0.3 + 0.7 * (1 - ball)})`}>
        <ellipse cx={0} cy={34} rx={34} ry={8} fill="#000" opacity={0.3} />
        <circle r={32} fill="#F6F1E3" stroke="#2A2630" strokeWidth={3} transform={`rotate(${t * 14})`} />
        <path d="M 0 -12 l 12 9 l -5 14 h -14 l -5 -14 Z" fill="#2A2630" transform={`rotate(${t * 14})`} />
      </g>
    </g>
  );
};

// ---------- the cinema doors: they swing open onto the glow of the screen ----------
export const CinemaDoors: React.FC<{ t: number; open: number }> = ({ t, open }) => {
  const o = easeOut(clamp(open));
  return (
    <g>
      <rect x={-400} y={-400} width={2720} height={1600} fill="#1A1424" />
      <rect x={500} y={200} width={920} height={780} fill="#FFF0C8" />
      <Glow x={960} y={600} r={900} o={0.2 + 0.5 * o} />
      <path d={`M 500 980 L 1420 980 L 1920 1200 L 0 1200 Z`} fill="#FFE2A0" opacity={0.2 + 0.5 * o} />
      {/* the doors, hinged at the jambs, shrinking as they swing */}
      <g transform="translate(500 0)"><rect x={0} y={200} width={460 * (1 - 0.8 * o)} height={780} fill="#7A1E2E" stroke="#3A0E18" strokeWidth={6} /><circle cx={440 * (1 - 0.8 * o)} cy={600} r={14} fill="#E9C46A" /></g>
      <g transform="translate(1420 0)"><rect x={-460 * (1 - 0.8 * o)} y={200} width={460 * (1 - 0.8 * o)} height={780} fill="#7A1E2E" stroke="#3A0E18" strokeWidth={6} /><circle cx={-440 * (1 - 0.8 * o)} cy={600} r={14} fill="#E9C46A" /></g>
      <rect x={440} y={100} width={1040} height={100} rx={14} fill="#2A1A3A" stroke="#E9C46A" strokeWidth={6} />
      <text x={960} y={170} textAnchor="middle" fontFamily={FONT.title} fontSize={76} fontWeight={800} fill="#FFE27A" letterSpacing={14}>RẠP PHIM</text>
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={480 + i * 74} cy={112} r={6} fill={(Math.floor(t / 4) + i) % 2 ? '#FFE27A' : '#8A6A20'} />)}
    </g>
  );
};

// ---------- the hall from the back: rows of classmates' heads against the lit screen, laughing ----------
export const CinemaHall: React.FC<{ t: number; laugh: number }> = ({ t, laugh }) => {
  const rows = [
    { y: 560, s: 0.55, n: 11, x0: 250, dx: 142 },
    { y: 700, s: 0.72, n: 9, x0: 230, dx: 182 },
    { y: 890, s: 0.95, n: 7, x0: 180, dx: 240 },
    { y: 1110, s: 1.25, n: 5, x0: 140, dx: 330 },
  ];
  return (
    <g>
      <rect x={-300} y={-300} width={2600} height={1800} fill="#17101F" />
      <rect x={380} y={90} width={1160} height={420} fill="#E9F0FF" />
      <rect x={380} y={90} width={1160} height={420} fill="#7FB4FF" opacity={0.25 + 0.15 * Math.sin(t / 5)} />
      <path d="M 600 400 q 120 -200 240 0 M 1000 380 q 120 -160 240 0" stroke="#FFD04D" strokeWidth={16} fill="none" opacity={0.7} />
      <Glow x={960} y={300} r={1000} o={0.4} />
      <path d="M 960 -200 L 1200 330 L 720 330 Z" fill="#DCEBFF" opacity={0.0} />
      {rows.map((r, ri) => (
        <g key={ri}>
          <rect x={-300} y={r.y + 30 * r.s} width={2600} height={14 * r.s} fill="#2A1A3A" />
          {Array.from({ length: r.n }).map((_, i) => (
            <Kid key={i} x={r.x0 + i * r.dx + (ri % 2) * 70} y={r.y + 120 * r.s + Math.sin(t / 3 + i * 1.7 + ri) * 5 * laugh * r.s}
              s={r.s} look={KIDS[(i + ri * 2) % 5]} turn={0} laugh={laugh} t={t + i * 5 + ri * 9} />
          ))}
        </g>
      ))}
      <rect x={-300} y={-300} width={2600} height={1800} fill="#0A0610" opacity={0.18} />
    </g>
  );
};
