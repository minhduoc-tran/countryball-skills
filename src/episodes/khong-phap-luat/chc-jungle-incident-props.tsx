import React from 'react';
import { Glow, rnd, clamp, easeOut, backOut } from '../../engine';

// Chapter C props, "week one: jungle": goods stack, market stall, the snatching hand and the tickets it scatters,
// the empty police booth, a front door with bolt / padlock / bar, a torch beam. Pure functions of the clock.

const INK = '#1A1420';

/** A stack of crates / boxes with produce on top, base centre (x, y). About 150 wide x 200 tall at s 1. */
export const GoodsStack: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={86} ry={10} fill="#000" opacity={0.3} />
    <rect x={-72} y={-68} width={144} height={68} rx={4} fill="#B8864E" stroke={INK} strokeWidth={4} />
    <path d="M -72 -45 H 72 M -24 -68 V 0 M 24 -68 V 0" stroke="#7A5630" strokeWidth={4} />
    <rect x={-60} y={-130} width={120} height={62} rx={4} fill="#D9A441" stroke={INK} strokeWidth={4} />
    <path d="M -60 -108 H 60" stroke="#A8761F" strokeWidth={4} />
    <rect x={-44} y={-188} width={88} height={58} rx={4} fill="#C9764E" stroke={INK} strokeWidth={4} />
    <path d="M -44 -166 H 44" stroke="#8C4A2C" strokeWidth={4} />
    {[-30, -6, 20].map((cx, i) => <circle key={i} cx={cx} cy={-196 + (i % 2) * 4} r={13} fill={['#E56B3A', '#D8483C', '#E9A83A'][i]} stroke={INK} strokeWidth={3} />)}
  </g>
);

/** A market stall seen front-on: awning, counter, goods piles. Counter top at y, centre x. 360 wide. */
export const StallFront: React.FC<{ x: number; y: number; s?: number; stack?: number; shake?: number }> = ({ x, y, s = 1, stack = 1, shake = 0 }) => (
  <g transform={`translate(${x + shake} ${y}) scale(${s})`}>
    <rect x={-170} y={-300} width={12} height={300} fill="#7A5A3A" stroke={INK} strokeWidth={3} />
    <rect x={158} y={-300} width={12} height={300} fill="#7A5A3A" stroke={INK} strokeWidth={3} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${-190 + i * 63} -300 L ${-127 + i * 63} -300 L ${-127 + i * 63} -250 Q ${-158 + i * 63} -232 ${-190 + i * 63} -250 Z`} fill={i % 2 ? '#F2E6D0' : '#D8483C'} stroke={INK} strokeWidth={3} />)}
    <rect x={-190} y={-318} width={380} height={22} rx={6} fill="#B8382C" stroke={INK} strokeWidth={4} />
    <rect x={-175} y={0} width={350} height={150} rx={4} fill="#8A6A44" stroke={INK} strokeWidth={4} />
    <path d="M -175 40 H 175" stroke="#00000030" strokeWidth={4} />
    <rect x={-185} y={-12} width={370} height={22} rx={4} fill="#A88458" stroke={INK} strokeWidth={4} />
    {[-130, -92, 60, 98, 134].map((cx, i) => <circle key={i} cx={cx} cy={-26} r={16} fill={['#E56B3A', '#7BC96F', '#E9A83A', '#D8483C', '#7BC96F'][i]} stroke={INK} strokeWidth={3} />)}
    {stack > 0 ? <GoodsStack x={-10} y={-8} s={0.9 * stack} /> : null}
  </g>
);

/** The scatter of lottery tickets after a snatch: `k` frames since the grab. Flutters down from (x, y). */
export const FlyingTickets: React.FC<{ x: number; y: number; k: number; n?: number; s?: number }> = ({ x, y, k, n = 9, s = 1 }) => {
  if (k < 0) return null;
  const cols = ['#E8D49A', '#F2A9A0', '#A9D6C2', '#BFC8F0'];
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const vx = (rnd(7, i) - 0.3) * 20 + 10;
        const vy = -10 - rnd(8, i) * 8;
        const px = x + (vx * k * 0.5 + Math.sin(k / 5 + i) * 26) * s;
        const py = y + (vy * k * 0.5 + k * k * 0.32 * (0.5 + rnd(9, i) * 0.6)) * s;
        const rot = k * (6 + rnd(10, i) * 10) * (i % 2 ? 1 : -1);
        return (
          <g key={i} transform={`translate(${px} ${py}) rotate(${rot}) scale(${s})`} opacity={clamp(1.6 - k / 70)}>
            <rect x={-20} y={-17} width={40} height={34} rx={4} fill={cols[i % 4]} stroke={INK} strokeWidth={3} />
            <path d="M -12 -6 H 12 M -12 3 H 7 M -12 11 H 10" stroke={INK} strokeWidth={2.5} opacity={0.55} strokeLinecap="round" />
          </g>
        );
      })}
    </g>
  );
};

/** A hand coming in from the right to grab at (gx, gy): `k` 0..1 reach, then it pulls away (`pull` 0..1). Plus a swoosh streak. */
export const SnatchHand: React.FC<{ gx: number; gy: number; reach: number; pull: number; sleeve?: string; s?: number; held?: React.ReactNode }> = ({ gx, gy, reach, pull, sleeve = '#4A4A58', s = 1, held }) => {
  const a = easeOut(clamp(reach));
  const p = easeOut(clamp(pull));
  const hx = gx + (1 - a) * 520 * s + p * 700 * s;
  const hy = gy - (1 - a) * 90 * s - p * 140 * s;
  const ex = hx + 640 * s;
  const ey = hy - 160 * s;
  return (
    <g>
      {p > 0.02 && p < 0.95 ? [0, 1, 2].map((i) => (
        <path key={i} d={`M ${hx + 40 * s} ${hy - 30 * s + i * 34 * s} q 120 ${-30 + i * 10} 260 ${-50 - i * 20}`} stroke="#FFFFFF" strokeWidth={7 - i * 2} strokeLinecap="round" fill="none" opacity={0.7 * (1 - p)} />
      )) : null}
      <path d={`M ${hx} ${hy} Q ${(hx + ex) / 2} ${hy - 20 * s} ${ex} ${ey}`} stroke={INK} strokeWidth={128 * s} fill="none" strokeLinecap="round" />
      <path d={`M ${hx} ${hy} Q ${(hx + ex) / 2} ${hy - 20 * s} ${ex} ${ey}`} stroke={sleeve} strokeWidth={112 * s} fill="none" strokeLinecap="round" />
      {held ? <g transform={`translate(${hx} ${hy})`}>{held}</g> : null}
      <g transform={`translate(${hx} ${hy}) rotate(90) scale(${3.6 * s})`}>
        <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill="#F2C9A0" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill="#F2C9A0" stroke={INK} strokeWidth={2.2} />
        {a >= 0.98 && p < 0.1 ? <path d="M -9 18 Q 0 24 9 18" stroke={INK} strokeWidth={2} fill="none" /> : null}
      </g>
    </g>
  );
};

/** An empty police booth: a small blue kiosk, light bar dark, door ajar, an empty stool, a paper blowing. Foot centre (x, y). */
export const PoliceBooth: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={150} ry={16} fill="#000" opacity={0.35} />
    <rect x={-120} y={-250} width={240} height={250} rx={6} fill="#3E6A9A" stroke={INK} strokeWidth={5} />
    <rect x={-120} y={-250} width={60} height={250} fill="#00000025" />
    <polygon points="-140,-250 140,-250 120,-290 -120,-290" fill="#E8E0D0" stroke={INK} strokeWidth={5} />
    <rect x={-60} y={-318} width={120} height={30} rx={8} fill="#5A5A66" stroke={INK} strokeWidth={4} />
    <rect x={-52} y={-312} width={48} height={18} rx={5} fill="#3A2A38" /><rect x={4} y={-312} width={48} height={18} rx={5} fill="#2A3048" />
    <rect x={-88} y={-206} width={120} height={104} rx={4} fill="#1C1A28" stroke={INK} strokeWidth={4} />
    <path d="M -88 -154 H 32 M -28 -206 V -102" stroke="#3A3850" strokeWidth={3} />
    <path d="M 50 -206 L 104 -190 L 104 -2 L 50 -2 Z" fill="#2C4C74" stroke={INK} strokeWidth={4} />
    <rect x={-100} y={-72} width={14} height={72} fill="#7A7A86" /><rect x={-34} y={-72} width={14} height={72} fill="#7A7A86" />
    <rect x={-110} y={-86} width={100} height={16} rx={4} fill="#9A7A52" stroke={INK} strokeWidth={3} />
    {[0, 1].map((i) => {
      const k = ((t * 3 + i * 40) % 120) / 120;
      return <rect key={i} x={170 + k * 70 - i * 120} y={-30 - Math.sin(k * 9) * 26 - i * 14} width={34} height={44} rx={2} transform={`rotate(${k * 260} ${190 + k * 70} ${-20})`} fill="#F2EAD8" stroke={INK} strokeWidth={2.5} opacity={0.9} />;
    })}
  </g>
);

/** A house front door, floor at y, centre x: `shut` 0..1 swings it closed, `bolt` slides the bolt, `lock` snaps the padlock on, `bar` slides a plank across. */
export const LockedDoor: React.FC<{ x: number; y: number; s?: number; shut: number; bolt?: number; lock?: number; bar?: number; lit?: number }> = ({ x, y, s = 1, shut, bolt = 0, lock = 0, bar = 0, lit = 1 }) => {
  const sh = easeOut(clamp(shut));
  const dw = 260 * (1 - 0.82 * (1 - sh)) ;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-190} y={-470} width={380} height={470} fill="#D9C7A8" stroke={INK} strokeWidth={5} />
      <rect x={-135} y={-420} width={270} height={420} fill={lit > 0 ? '#FFC878' : '#2A2430'} stroke={INK} strokeWidth={6} />
      <Glow x={0} y={-200} r={360} o={0.5 * lit * (1 - sh)} />
      <g>
        <rect x={-135} y={-420} width={dw} height={420} fill="#7A4A3A" stroke={INK} strokeWidth={6} />
        <rect x={-135 + dw * 0.12} y={-380} width={dw * 0.76} height={150} rx={4} fill="#8E5A46" stroke="#00000040" strokeWidth={3} />
        <rect x={-135 + dw * 0.12} y={-200} width={dw * 0.76} height={150} rx={4} fill="#8E5A46" stroke="#00000040" strokeWidth={3} />
        <circle cx={-135 + dw - 26} cy={-210} r={11} fill="#E9C46A" stroke={INK} strokeWidth={3} />
      </g>
      {sh > 0.92 ? (
        <g>
          <rect x={-135 + 160 + 70 * (1 - clamp(bolt))} y={-236} width={90} height={14} rx={7} fill="#9A9AA6" stroke={INK} strokeWidth={3} />
          <rect x={-6} y={-246} width={22} height={34} rx={4} fill="#6A6A76" stroke={INK} strokeWidth={3} />
          {lock > 0 ? (
            <g transform={`translate(${96} ${-190 + (1 - backOut(clamp(lock))) * -50})`}>
              <path d="M -14 0 V -24 A 14 14 0 0 1 14 -24 V 0" stroke="#C9C9D4" strokeWidth={8} fill="none" />
              <rect x={-24} y={-2} width={48} height={40} rx={7} fill="#E9C46A" stroke={INK} strokeWidth={4} />
              <circle cx={0} cy={16} r={5} fill={INK} />
            </g>
          ) : null}
          {bar > 0 ? <g><rect x={-200 + (1 - easeOut(clamp(bar))) * -330} y={-350} width={400} height={34} rx={4} fill="#A87A4A" stroke={INK} strokeWidth={5} /><rect x={-200 + (1 - easeOut(clamp(bar))) * -330} y={-100} width={400} height={34} rx={4} fill="#A87A4A" stroke={INK} strokeWidth={5} /></g> : null}
        </g>
      ) : null}
    </g>
  );
};

/** A torch beam from (x, y) toward angle `ang` (degrees, 0 = right, positive down), length `len`. */
export const TorchBeam: React.FC<{ x: number; y: number; ang: number; len?: number; o?: number; id: string }> = ({ x, y, ang, len = 700, o = 0.75, id }) => {
  const w = len * 0.2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`} style={{ mixBlendMode: 'screen' }} opacity={o}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF2C4" stopOpacity={0.95} /><stop offset="1" stopColor="#FFE9A8" stopOpacity={0} /></linearGradient>
      </defs>
      <polygon points={`0,-6 ${len},${-w} ${len},${w} 0,6`} fill={`url(#${id})`} />
      <circle cx={0} cy={0} r={9} fill="#FFF8DC" />
    </g>
  );
};
