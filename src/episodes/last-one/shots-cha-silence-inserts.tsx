import React from 'react';
import { kf, camT, rnd, Street, DuskSky, Skyline, Glow, Dust, LightVeil, ShotProps } from '../../engine';

// Chapter A, "no motorbike, no ward loudspeaker, not even a dog barking": three quick inserts, each drawn for one
// line. A14: the street through a window with its parked bikes dead still; A15: a pair of horn loudspeakers on a
// concrete pole, silent; A16: an empty dog bowl and a slack leash on a gate.

// ---------- A14: the street from the bedroom window: the bikes don't move, only a sheer curtain breathes ----------
export const A14: React.FC<ShotProps> = ({ t, len }) => {
  const sway = Math.sin(t / 11) * 14 + Math.sin(t / 5.3) * 4;
  const win = { x0: 380, y0: 110, x1: 1540, y1: 880 };
  const wall = `M -200 -200 H 2120 V 1300 H -200 Z M ${win.x0} ${win.y0} V ${win.y1} H ${win.x1} V ${win.y0} Z`;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
      <g transform="translate(960 470) scale(1.18) translate(-960 -470)">
        <Street t={t + 30} id="st14" />
      </g>
      {/* the wall round the window, a lit sill, two mullions */}
      <path d={wall} fill="#1C1824" fillRule="evenodd" />
      <path d={`M ${win.x0} ${win.y0} V ${win.y1} H ${win.x1} V ${win.y0}`} fill="none" stroke="#2C2634" strokeWidth={26} />
      <path d={`M ${(win.x0 + win.x1) / 2} ${win.y0} V ${win.y1} M ${win.x0} ${win.y0 + 300} H ${win.x1}`} stroke="#241E2C" strokeWidth={14} />
      <rect x={win.x0 - 40} y={win.y1} width={win.x1 - win.x0 + 80} height={34} fill="#5E4A44" />
      <rect x={win.x0 - 40} y={win.y1} width={win.x1 - win.x0 + 80} height={6} fill="#FFB46A" opacity={0.6} />
      {/* a sheer curtain on the right, moving in the only breeze in town */}
      <path d={`M ${win.x1 + 20} ${win.y0 - 20} L ${win.x1 - 220 + sway} ${win.y0} Q ${win.x1 - 270 + sway * 1.6} 500 ${win.x1 - 200 + sway} ${win.y1} L ${win.x1 + 20} ${win.y1} Z`} fill="#E9DCC8" opacity={0.28} />
      <path d={`M ${win.x1 - 220 + sway} ${win.y0} Q ${win.x1 - 270 + sway * 1.6} 500 ${win.x1 - 200 + sway} ${win.y1}`} stroke="#FFE7B8" strokeWidth={4} fill="none" opacity={0.5} />
      <Glow x={win.x1 - 300} y={win.y0 + 100} r={420} o={0.25} />
    </g>
  );
};

// ---------- A15: two horn loudspeakers on a concrete pole against the dusk, cables sagging, nothing coming out ----------
const Horn: React.FC<{ x: number; y: number; dir: 1 | -1 }> = ({ x, y, dir }) => (
  <g transform={`translate(${x} ${y}) scale(${dir} 1)`}>
    <rect x={-18} y={-34} width={64} height={68} rx={10} fill="#5C5A66" />
    <path d="M 40 -30 L 250 -92 L 250 92 L 40 30 Z" fill="#D6CFC0" />
    <path d="M 40 30 L 250 92 L 250 40 L 40 14 Z" fill="#A89F90" />
    <path d="M 44 -30 L 250 -92" stroke="#FFB46A" strokeWidth={4} opacity={0.8} />
    <ellipse cx={250} cy={0} rx={30} ry={92} fill="#C2BAAA" />
    <ellipse cx={254} cy={0} rx={22} ry={80} fill="#2A2630" />
    <ellipse cx={258} cy={-18} rx={8} ry={44} fill="#4A4654" />
  </g>
);
export const A15: React.FC<ShotProps> = ({ t, len }) => {
  const cab = (k: number, y0: number, dir: number) => {
    const sag = 70 + k * 16 + Math.sin(t / 14 + k) * 3;
    const x1 = dir > 0 ? 2100 : -180;
    return <path key={`${k}${dir}`} d={`M 960 ${y0} Q ${(960 + x1) / 2} ${y0 + sag} ${x1} ${y0 - 40 + k * 14}`} stroke="#14121A" strokeWidth={5 - k} fill="none" />;
  };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 975]]), kf(t, [[0, 640], [len, 560]]), kf(t, [[0, 1.0], [len, 1.12]]))}>
      <DuskSky id="sk15" x0={-300} y0={-300} w={2520} h={1700} horizonY={760} />
      <Glow x={1300} y={760} r={620} o={0.5} />
      <Skyline y={800} seed={9} color="#5A3A62" h={200} />
      {/* rooftops below the pole: flat roofs, water tanks, an aerial, all dark against the glow */}
      <rect x={-300} y={830} width={2520} height={600} fill="#2C2036" />
      <path d="M -300 830 H 2220" stroke="#FFB46A" strokeWidth={3} opacity={0.5} />
      {[[120, 900, 300, 120], [520, 940, 240, 90], [1180, 910, 360, 130], [1620, 950, 280, 90]].map(([x, y, w, h], i) => (
        <g key={i}>
          <rect x={x} y={y} width={w} height={h * 3} fill={i % 2 ? '#241A2E' : '#30223A'} />
          <rect x={x} y={y} width={w} height={6} fill="#FFB46A" opacity={0.35} />
          {i % 2 === 0 ? <g><rect x={x + w * 0.2} y={y - 54} width={60} height={54} rx={10} fill="#3A2C46" /><path d={`M ${x + w * 0.7} ${y} V ${y - 80} M ${x + w * 0.62} ${y - 60} H ${x + w * 0.78}`} stroke="#3A2C46" strokeWidth={5} /></g> : null}
        </g>
      ))}
      {/* the pole: a tapering concrete post with a cross arm, a junction box and cables down it */}
      <path d="M 920 1200 L 936 120 L 992 120 L 1010 1200 Z" fill="#8A8892" />
      <path d="M 978 120 L 992 120 L 1010 1200 L 990 1200 Z" fill="#6A6874" />
      <path d="M 922 1200 L 936 120" stroke="#FFB46A" strokeWidth={4} opacity={0.6} />
      {[360, 560, 760, 960].map((y) => <path key={y} d={`M ${934 - (y - 120) * 0.0 } ${y} L ${994} ${y}`} stroke="#6E6C78" strokeWidth={3} opacity={0.6} />)}
      <rect x={720} y={228} width={520} height={26} rx={6} fill="#3A3844" />
      <path d="M 720 228 H 1240" stroke="#FFB46A" strokeWidth={3} opacity={0.6} />
      <Horn x={760} y={236} dir={-1} />
      <Horn x={1200} y={236} dir={1} />
      <rect x={1010} y={520} width={110} height={150} rx={8} fill="#4A4852" />
      <rect x={1016} y={528} width={98} height={12} fill="#6E6C78" />
      <circle cx={1066} cy={620} r={8} fill="#E4544A" opacity={0.6 + 0.4 * Math.sin(t / 10)} />
      {[0, 1, 2].map((k) => cab(k, 200 + k * 6, 1))}
      {[0, 1, 2].map((k) => cab(k, 200 + k * 6, -1))}
      <path d="M 936 270 Q 880 420 930 700 L 940 1200" stroke="#14121A" strokeWidth={5} fill="none" />
      <Dust t={t} seed={71} x0={300} y0={100} w={1400} h={800} n={26} o={0.4} />
    </g>
  );
};

// ---------- A16: low angle at a gate: a steel dog bowl, empty, and a red leash hanging slack from the latch ----------
export const A16: React.FC<ShotProps> = ({ t, len }) => {
  const sw = Math.sin(t / 12) * 10;
  const bars = Array.from({ length: 16 }).map((_, i) => 180 + i * 108);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 940]]), kf(t, [[0, 600], [len, 640]]), kf(t, [[0, 1.0], [len, 1.18]]))}>
      <DuskSky id="sk16" x0={-300} y0={-300} w={2520} h={1400} horizonY={520} />
      {/* a courtyard behind the bars: dark leaves, a lit step */}
      <g filter="url(#blur6)">
        <rect x={-300} y={400} width={2520} height={500} fill="#2A2234" />
        {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={100 + i * 230 + rnd(3, i) * 50} cy={470 + rnd(4, i) * 60} rx={120} ry={90} fill={i % 2 ? '#2E4A42' : '#264036'} />)}
      </g>
      {/* the pavement */}
      <rect x={-300} y={820} width={2520} height={500} fill="#3A3038" />
      <path d="M -300 820 H 2220" stroke="#FFB46A" strokeWidth={4} opacity={0.5} />
      {[200, 560, 940, 1340, 1720].map((x) => <path key={x} d={`M ${x} 820 L ${x - 160} 1300`} stroke="#2C242C" strokeWidth={4} />)}
      {/* two brick-and-concrete gate posts and the iron gate between */}
      {[[60, 130], [1730, 130]].map(([x, w], i) => (
        <g key={i}>
          <rect x={x} y={120} width={w + 40} height={720} fill="#A89C8A" />
          <rect x={x + w + 10} y={120} width={30} height={720} fill="#7E7466" />
          <rect x={x - 12} y={104} width={w + 64} height={36} fill="#C2B6A2" />
          <rect x={x - 12} y={104} width={w + 64} height={6} fill="#FFB46A" opacity={0.6} />
        </g>
      ))}
      <rect x={230} y={250} width={1500} height={14} fill="#1E1C24" />
      <rect x={230} y={740} width={1500} height={14} fill="#1E1C24" />
      {bars.filter((x) => x > 200 && x < 1720).map((x) => (
        <g key={x}>
          <rect x={x - 6} y={250} width={12} height={500} fill="#201E28" />
          <rect x={x - 6} y={250} width={3} height={500} fill="#FFB46A" opacity={0.35} />
          <path d={`M ${x - 12} 250 L ${x} 220 L ${x + 12} 250 Z`} fill="#201E28" />
        </g>
      ))}
      {/* the latch, and the leash from it: hangs, slack, ends in a coil on the ground with its loop */}
      <rect x={1010} y={470} width={64} height={30} rx={6} fill="#6E6C7C" />
      <path d={`M 1042 500 Q ${1060 + sw} 620 ${1010 + sw * 0.6} 760 Q 980 880 1090 890 Q 1220 900 1180 960 Q 1130 1000 1040 960`} stroke="#14121A" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M 1042 500 Q ${1060 + sw} 620 ${1010 + sw * 0.6} 760 Q 980 880 1090 890 Q 1220 900 1180 960 Q 1130 1000 1040 960`} stroke="#C8483E" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d={`M 1036 506 Q ${1054 + sw} 620 ${1004 + sw * 0.6} 760`} stroke="#FF9A82" strokeWidth={3} fill="none" opacity={0.7} />
      <ellipse cx={1090} cy={980} rx={160} ry={20} fill="#000" opacity={0.25} />
      {/* the empty bowl, steel, big in the foreground */}
      <ellipse cx={560} cy={940} rx={190} ry={22} fill="#000" opacity={0.4} />
      <path d="M 380 880 Q 380 960 470 970 L 650 970 Q 740 960 740 880 Z" fill="#8E8E9C" />
      <path d="M 560 972 Q 700 970 740 880 L 700 880 Q 690 940 560 960 Z" fill="#6A6A7A" />
      <ellipse cx={560} cy={880} rx={180} ry={34} fill="#B8B8C6" />
      <ellipse cx={560} cy={886} rx={150} ry={26} fill="#4A4A58" />
      <path d="M 410 872 Q 560 842 710 872" stroke="#FFB46A" strokeWidth={4} fill="none" opacity={0.7} />
      <ellipse cx={600} cy={894} rx={50} ry={9} fill="#6A6A7A" opacity={0.7} />
      <LightVeil id="v16" lights={[[960, 600, 900]]} o={0.3} />
      <Dust t={t} seed={77} x0={300} y0={300} w={1300} h={600} n={20} o={0.4} />
    </g>
  );
};
