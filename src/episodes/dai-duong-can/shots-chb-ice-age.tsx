import React from 'react';
import { Schematic, SCH, FONT, kf, camT, clamp, easeOut, backOut, rnd, Glow, ShotProps } from '../../engine';
import { PAL } from './kit-palette';
import { Mini } from './chb-people-props';
import { SundaMap, MapPill } from './chb-vietnam-and-sunda-maps';
import { FactStamp } from './kit-hud';

// Chapter B, 20.000 years ago (B6-B11, 77.66-90.56 s, look `past`): the film clapper ("Nghe như phim"), the ice age, sea level
// -120 m on a coast section, ancient people walking, the Sundaland map with the path to Borneo, "Đó là thật".

// ---------- B6: a film clapper snaps shut on a dark cinema ground ----------
export const B6: React.FC<ShotProps> = ({ t, len }) => {
  const arm = kf(t, [[0, -34], [18, -34], [21, 0], [23, -3], [25, 0]], easeOut);
  const snap = t >= 21 && t < 24 ? 1 : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <rect x={-200} y={-200} width={2320} height={1480} fill="#14101C" />
      <circle cx={960} cy={540} r={760} fill="#2A2238" opacity={0.7} />
      {[0, 1].map((r) => (
        <g key={r}>
          <rect x={-200} y={r ? 960 : 20} width={2320} height={100} fill="#0A0810" />
          {Array.from({ length: 24 }).map((_, i) => <rect key={i} x={-120 + i * 100 - ((t * 3) % 100)} y={r ? 984 : 44} width={46} height={52} rx={8} fill="#2A2238" />)}
        </g>
      ))}
      <g transform="translate(960 560) rotate(-4)">
        <rect x={-300} y={-110} width={600} height={330} rx={14} fill="#1E1B26" stroke="#F6EFE3" strokeWidth={8} />
        {[0, 1, 2].map((i) => <path key={i} d={`M -300 ${10 + i * 70} L 300 ${10 + i * 70}`} stroke="#F6EFE3" strokeWidth={4} opacity={0.5} />)}
        <text x={0} y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={900} fontSize={130} fill="#F6EFE3" letterSpacing={6}>PHIM</text>
        <g transform={`rotate(${arm} -300 -110)`}>
          <rect x={-300} y={-196} width={600} height={86} rx={10} fill="#F6EFE3" stroke="#F6EFE3" strokeWidth={4} />
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${-300 + i * 100} -110 L ${-250 + i * 100} -196 L ${-200 + i * 100} -196 L ${-250 + i * 100} -110 Z`} fill="#14101C" />)}
        </g>
        <rect x={-300} y={-110} width={600} height={30} fill="#14101C" stroke="#F6EFE3" strokeWidth={6} />
        {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${-300 + i * 100} -80 L ${-250 + i * 100} -110 L ${-200 + i * 100} -110 L ${-250 + i * 100} -80 Z`} fill="#F6EFE3" />)}
      </g>
      {snap ? <rect x={-200} y={-200} width={2320} height={1480} fill="#FFFFFF" opacity={0.22} /> : null}
    </g>
  );
};

// ---------- B7: the ice age: glaciers on the horizon, icebergs, snow ----------
export const B7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <defs>
      <linearGradient id="b7sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8EB6D8" /><stop offset="1" stopColor="#E8F0F6" /></linearGradient>
      <linearGradient id="b7sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5C86A8" /><stop offset="1" stopColor="#2E5578" /></linearGradient>
      <linearGradient id="b7ice" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#B9D6EA" /></linearGradient>
    </defs>
    <rect x={-100} y={-100} width={2120} height={600} fill="url(#b7sky)" />
    <Glow x={1500} y={170} r={420} o={0.4} />
    <rect x={-100} y={500} width={2120} height={700} fill="url(#b7sea)" />
    {/* the ice sheet: a wall of ice on the horizon with a crevassed face */}
    <path d="M -100 520 L -100 300 L 120 250 L 260 180 L 460 220 L 640 150 L 860 230 L 1080 190 L 1260 300 L 1500 280 L 1700 340 L 2020 330 L 2020 520 Z" fill="url(#b7ice)" stroke="#6E92B0" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -100 420 L 2020 440 L 2020 520 L -100 520 Z" fill="#9CC4E0" opacity={0.7} />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${i * 130 + rnd(3, i) * 60} 360 l ${rnd(4, i) * 20 - 10} ${60 + rnd(5, i) * 80}`} stroke="#6E92B0" strokeWidth={5} opacity={0.6} strokeLinecap="round" />)}
    {[[420, 640, 1], [980, 700, 1.5], [1500, 660, 1.2], [1800, 780, 1.9], [160, 790, 1.7]].map(([x, y, s], i) => {
      const bob = Math.sin(t / 22 + i * 2) * 5;
      return (
        <g key={i} transform={`translate(${x} ${y + bob}) scale(${s})`}>
          <ellipse cx={0} cy={20} rx={120} ry={12} fill="#1D3B58" opacity={0.5} />
          <path d="M -110 18 L -70 -50 L -30 -20 L 20 -100 L 70 -30 L 120 18 Z" fill="url(#b7ice)" stroke="#6E92B0" strokeWidth={4} strokeLinejoin="round" />
          <path d="M 20 -100 L 70 -30 L 120 18 L 30 18 Z" fill="#9CC4E0" opacity={0.7} />
        </g>
      );
    })}
    {Array.from({ length: 50 }).map((_, i) => {
      const x = (rnd(11, i) * 2200 + t * (1.5 + rnd(12, i) * 2) + Math.sin(t / 15 + i) * 20) % 2100;
      const y = ((rnd(13, i) * 1300 + t * (4 + rnd(14, i) * 5)) % 1300) - 100;
      return <circle key={i} cx={x - 80} cy={y} r={3 + rnd(15, i) * 4} fill="#FFFFFF" opacity={0.85} />;
    })}
    <MapPill x={960} y={920} t={t - 6} text="THỜI KỲ BĂNG HÀ" color="#E8F7FF" size={62} />
  </g>
);

// ---------- B8: coast section: the sea sinks 120 m and the shelf walks out into view ----------
const TERR: [number, number][] = [[-100, -150], [200, -70], [300, 0], [500, 18], [800, 48], [1100, 90], [1270, 124], [1380, 135], [1440, 172], [1560, 208], [2020, 208]];
const YD = (d: number) => 400 + d * 3.2;
const terrY = (x: number) => {
  for (let i = 0; i < TERR.length - 1; i++) {
    const [x0, d0] = TERR[i];
    const [x1, d1] = TERR[i + 1];
    if (x <= x1) return YD(d0 + ((d1 - d0) * (x - x0)) / (x1 - x0));
  }
  return YD(208);
};
export const B8: React.FC<ShotProps> = ({ t, len }) => {
  const lvl = kf(t, [[0, 0], [12, 0], [64, 120]]);
  const yw = YD(lvl);
  const terrain = 'M ' + TERR.map(([x, d]) => `${x} ${YD(d)}`).join(' L ') + ' L 2020 1100 L -100 1100 Z';
  const walkers = clamp((lvl - 70) / 30);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Schematic t={t} id="b8" />
      <rect x={-100} y={yw} width={2120} height={1200} fill={PAL.seaTop} opacity={0.85} />
      <path d={`M -100 ${yw} ` + Array.from({ length: 45 }).map((_, i) => `L ${-100 + i * 48} ${yw + Math.sin(i * 0.9 + t * 0.14) * 3}`).join(' ')} stroke="#E8F7FC" strokeWidth={5} fill="none" />
      <path d={terrain} fill="#B79B68" stroke="#F0DDB0" strokeWidth={6} strokeLinejoin="round" />
      <path d={terrain} fill="none" stroke="#6B5A3A" strokeWidth={3} opacity={0.5} transform="translate(0 22)" />
      <path d="M 300 400 L 1900 400" stroke={SCH.dim} strokeWidth={3} strokeDasharray="12 12" opacity={0.8} />
      <text x={1840} y={384} textAnchor="end" fontFamily={FONT.ui} fontSize={30} fill={SCH.dim} letterSpacing={2}>MỰC NƯỚC BÂY GIỜ</text>
      <Mini x={170} y={YD(-62) + 6} s={1.1} t={t} c="#E04B3A" />
      {walkers > 0 ? [0, 1, 2, 3, 4].map((i) => {
        const x = 520 + i * 150 + (t * 1.1) % 60;
        return <Mini key={i} x={x} y={terrY(x) + 4} s={0.62} t={t} ph={i * 1.4} c={['#E04B3A', '#F2B632', '#3E9C6B', '#6B7FD6', '#E87EA1'][i]} />;
      }) : null}
      <path d={`M 1700 ${400 + 14} L 1700 ${yw - 10} M 1676 ${yw - 36} L 1700 ${yw - 8} L 1724 ${yw - 36}`} stroke="#FFE27A" strokeWidth={9} fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={clamp((lvl - 4) / 6)} />
      <g transform={`translate(960 210) scale(${0.9 + 0.1 * backOut(clamp(t / 10))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={190} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>{`−${Math.round(lvl)} M`}</text>
      </g>
    </g>
  );
};

// ---------- B9: ancient people walk across the exposed plain (parallax grass + palms) ----------
export const B9: React.FC<ShotProps> = ({ t, len }) => {
  const off = t * 9;
  const people = [
    { x: 420, y: 880, s: 1.45, tool: 'spear' as const, skin: 3, c: '#8A6A4A' },
    { x: 660, y: 990, s: 1.7, tool: 'none' as const, skin: 2, c: '#A3774A' },
    { x: 900, y: 880, s: 1.3, tool: 'spear' as const, skin: 1, c: '#7A5A3A' },
    { x: 1180, y: 960, s: 1.6, tool: 'bucket' as const, skin: 3, c: '#9C7A52' },
    { x: 1420, y: 850, s: 1.2, tool: 'none' as const, skin: 0, c: '#8A6A4A' },
  ];
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1040]]), 640, 1.12)}>
      <defs>
        <linearGradient id="b9sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8FC9EA" /><stop offset="1" stopColor="#F4EBC6" /></linearGradient>
        <linearGradient id="b9gnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#B9B25E" /><stop offset="1" stopColor="#6E7E3A" /></linearGradient>
      </defs>
      <rect x={-300} y={-100} width={2520} height={560} fill="url(#b9sky)" />
      <Glow x={1400} y={170} r={480} o={0.55} />
      <circle cx={1400} cy={170} r={62} fill="#FFFBE0" />
      <path d="M -300 470 L -300 400 Q 100 330 400 390 Q 700 330 1000 400 Q 1400 320 1800 390 L 2220 400 L 2220 470 Z" fill="#7CA088" opacity={0.8} />
      <rect x={-300} y={460} width={2520} height={760} fill="url(#b9gnd)" />
      {Array.from({ length: 7 }).map((_, i) => {
        const x = ((((i * 380 - off * 0.35) % 2700) + 2700) % 2700) - 300;
        return (
          <g key={i} transform={`translate(${x} ${520 + (i % 3) * 14})`}>
            <path d="M 0 0 Q 6 -80 -4 -150" stroke="#5B4126" strokeWidth={10} fill="none" strokeLinecap="round" />
            {[-60, -20, 24, 64].map((a, k) => <path key={k} d={`M -4 -150 Q ${a} ${-190 + Math.abs(a) * 0.3} ${a * 1.6} ${-130 + Math.abs(a) * 0.5}`} stroke="#2F7A44" strokeWidth={14} fill="none" strokeLinecap="round" />)}
          </g>
        );
      })}
      {Array.from({ length: 70 }).map((_, i) => {
        const f = Math.pow(rnd(21, i), 1.2);
        const x = (((rnd(22, i) * 2600 - off * (0.5 + f)) % 2600) + 2600) % 2600 - 300;
        const y = 500 + f * 600;
        return <path key={i} d={`M ${x} ${y} l -4 ${-10 - f * 20} M ${x} ${y} l 3 ${-12 - f * 22} M ${x} ${y} l 8 ${-8 - f * 16}`} stroke="#4A5E24" strokeWidth={2 + f * 3} strokeLinecap="round" opacity={0.8} />;
      })}
      {people.map((p, i) => <Mini key={i} {...p} x={p.x + Math.sin(i) * 6} t={t} ph={i * 1.7} />)}
    </g>
  );
};

// ---------- B10: the Sundaland map: the shelf turns to land and a dotted path runs from Việt Nam to Borneo ----------
export const B10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1060]]), 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <SundaMap id="b10" t={t} shelf={clamp((t - 4) / 26)} walk={easeOut(clamp((t - 26) / 40))} />
  </g>
);

// ---------- B11: "Đó là thật": the finished map with the green stamp ----------
export const B11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1060, 580, kf(t, [[0, 1.12], [len, 1.2]]))}>
    <SundaMap id="b11" t={t + 80} shelf={1} walk={1} />
    <FactStamp t={t} at={4} x={1060} y={900} />
  </g>
);
