import React from 'react';
import { Hero, Look, Pose, kf, clamp, easeOut, backOut, rnd, camT, LOOKS, ShotProps, Schematic, SCH, CountUp, DrawOn, Street, streetStand, walkPose, faceAt, basePose, Foreground, FONT } from '../../engine';
import { PersonIcon } from '../last-one/insert-arm-and-icons';
import { FactStamp } from '../dai-duong-can/kit-hud';
import { MemoryGlow } from './kit-rewind-fx';
import { NEIGHBOUR } from './kit-cast';

// CHAPTER D, beat "6 lonely", second half (225.33-237.54 s): "Một nghiên cứu tổng hợp một trăm bốn mươi tám công
// trình, với hơn ba trăm nghìn người, cho thấy người có các mối quan hệ bền chặt có khả năng sống sót cao hơn năm
// mươi phần trăm. Đó là thật. Con người cần được nhớ đến."
// D22 papers pile up, "148" counts up: NGHIÊN CỨU. D23 "> 300.000 NGƯỜI": a crowd of icons, then links join them
// into pairs and groups (the strong bonds light up). D24 "+50%" KHẢ NĂNG SỐNG SÓT, a heartbeat line, FactStamp on
// "Đó là thật". D25 Pip stands still in the street while a crowd walks past him; a faint memory glow on his head.

// ---------- D22: a pile of studies drops in, the counter runs to 148 ----------
const Doc: React.FC<{ x: number; y: number; rot: number; o?: number }> = ({ x, y, rot, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={o}>
    <rect x={-120} y={-34} width={240} height={68} rx={6} fill="#E9E2D2" stroke={SCH.line} strokeWidth={3} />
    <rect x={-120} y={-34} width={240} height={14} rx={4} fill={SCH.live} opacity={0.8} />
    {[0, 1].map((k) => <rect key={k} x={-100} y={-8 + k * 16} width={150 - k * 50} height={6} rx={3} fill="#8A93A6" />)}
  </g>
);

export const D22: React.FC<ShotProps> = ({ t, len }) => {
  const n = 12;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
      <Schematic t={t} id="d22s" />
      {Array.from({ length: n }).map((_, k) => {
        const at = k * 4;
        const p = easeOut(clamp((t - at) / 7));
        if (p <= 0) return null;
        const y = 860 - k * 46;
        return <Doc key={k} x={560 + (rnd(81, k) - 0.5) * 40} y={y - (1 - p) * 300} rot={(rnd(82, k) - 0.5) * 10} o={p} />;
      })}
      <CountUp x={1270} y={560} t={t - 2} to={148} dur={44} size={260} />
      <text x={1270} y={680} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={76} fill={SCH.line} letterSpacing={4} opacity={easeOut(clamp((t - 10) / 8))}>NGHIÊN CỨU</text>
    </g>
  );
};

// ---------- D23: "> 300.000 NGƯỜI": a crowd of icons; on "mối quan hệ bền chặt" links join them into groups ----------
const COLS = 14;
const ROWS = 5;
const icon = (k: number) => ({ x: 310 + (k % COLS) * 100, y: 470 + Math.floor(k / COLS) * 108 });
// pairs of neighbours that bond (right or down neighbour), seeded so it's stable
const LINKS: [number, number][] = Array.from({ length: COLS * ROWS })
  .map((_, k): [number, number] | null => {
    const r = rnd(91, k);
    if (r < 0.32 && k % COLS < COLS - 1) return [k, k + 1];
    if (r < 0.5 && k + COLS < COLS * ROWS) return [k, k + COLS];
    return null;
  })
  .filter((v): v is [number, number] => v !== null);
const LINKED = new Set(LINKS.flat());

export const D23: React.FC<ShotProps> = ({ t, len }) => {
  const linkT = t - 68;
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="d23s" />
      <g transform={`translate(960 250) scale(${0.9 + 0.1 * backOut(clamp(t / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={128} fill={SCH.live} style={{ filter: `drop-shadow(0 0 18px ${SCH.glow}88)` }}>{'> 300.000'}</text>
        <text y={96} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={64} fill={SCH.line} letterSpacing={6}>NGƯỜI</text>
      </g>
      {LINKS.map(([a, b], i) => {
        const A = icon(a);
        const B = icon(b);
        return <DrawOn key={i} d={`M ${A.x} ${A.y + 2} L ${B.x} ${B.y + 2}`} t={linkT - (i % 9) * 2} dur={8} color={SCH.glow} width={6} />;
      })}
      {Array.from({ length: COLS * ROWS }).map((_, k) => {
        const p = { ...icon(k) };
        const pop = backOut(clamp((t - (k % COLS) * 1.2 - Math.floor(k / COLS) * 2) / 6));
        const on = LINKED.has(k) && linkT > 8;
        return <PersonIcon key={k} x={p.x} y={p.y} s={1.25 * pop} on={on} glow={on} o={clamp(pop * 2)} />;
      })}
    </g>
  );
};

// ---------- D24: "+50%" KHẢ NĂNG SỐNG SÓT, a heartbeat line runs under it; the FactStamp thumps on "Đó là thật" ----------
export const D24: React.FC<ShotProps> = ({ t, len }) => {
  const ecg = 'M 160 760 L 640 760 L 690 760 L 720 700 L 750 820 L 790 620 L 830 860 L 860 760 L 1100 760 L 1150 760 L 1180 700 L 1210 820 L 1250 620 L 1290 860 L 1320 760 L 1760 760';
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
      <Schematic t={t} id="d24s" />
      <g opacity={0.55}><DrawOn d={ecg} t={t} dur={50} color={SCH.glow} width={6} /></g>
      <g transform={`translate(960 430) scale(${0.85 + 0.15 * backOut(clamp((t + 2) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={290} fill={SCH.live} style={{ filter: `drop-shadow(0 0 22px ${SCH.glow}88)` }}>+50%</text>
      </g>
      <text x={960} y={570} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={74} fill={SCH.line} letterSpacing={4} opacity={easeOut(clamp((t - 6) / 8))}>KHẢ NĂNG SỐNG SÓT</text>
      <FactStamp t={t} at={77} x={960} y={880} />
    </g>
  );
};

// ---------- D25: Pip stands still in the street at dusk; people walk past him both ways, nobody turns ----------
const tint = (base: Look, jacket: string, shade: string): Look => ({ ...base, jacket, jacketShade: shade, accent: shade });
const WALKERS: { look: Look; X0: number; Z: number; v: number; dir: 1 | -1; ph: number }[] = [
  { look: LOOKS.suit, X0: -3.6, Z: 10.5, v: 0.05, dir: 1, ph: 0 },
  { look: LOOKS.mom, X0: 3.2, Z: 11.5, v: 0.045, dir: -1, ph: 1.3 },
  { look: NEIGHBOUR, X0: -2.4, Z: 13, v: 0.04, dir: 1, ph: 2.1 },
  { look: tint(LOOKS.pip, '#3E6A8A', '#2E5070'), X0: 3.9, Z: 12.2, v: 0.05, dir: -1, ph: 0.6 },
  { look: tint(LOOKS.mom, '#2F6E69', '#245A56'), X0: -4.2, Z: 15, v: 0.04, dir: 1, ph: 2.8 },
  { look: tint(LOOKS.suit, '#6A4E3A', '#56402E'), X0: 4.0, Z: 14, v: 0.045, dir: -1, ph: 1.9 },
];
// near-camera passers-by: dark silhouettes (blurred foreground), timed to cross Pip at about t 20 and t 62
const SIL: Look = { ...LOOKS.suit, skin: '#120E18', skinShade: '#0E0B14', hand: '#120E18', jacket: '#0E0B14', jacketShade: '#0A0810', accent: '#0A0810', limb: '#0E0B14', line: '#08060C', shoe: '#08060C', face: '#08060C', hair: '#08060C' };
const NEAR: { look: Look; X0: number; v: number; dir: 1 | -1; ph: number }[] = [
  { look: SIL, X0: -1.2, v: 0.07, dir: 1, ph: 0.4 },
  { look: SIL, X0: 4.5, v: 0.07, dir: -1, ph: 2.2 },
];

const walker = (look: Look, X: number, Z: number, ph: number, dir: 1 | -1, key: string) => {
  const s = streetStand(X, Z);
  const pose: Pose = walkPose(s.x, ph, s.y + 140 * s.scale, s.scale, { yaw: 0.8 * dir, expr: 'neutral' }, dir);
  return <Hero key={key} look={look} pose={pose} rimId={dir > 0 ? 'rimL' : 'rimR'} shadow={0.6} />;
};

export const D25: React.FC<ShotProps> = ({ t, len }) => {
  const ps = streetStand(0.2, 7.2);
  const pip: Pose = { ...basePose, ...ps, yaw: 0.1, look: 0.1, headTilt: -4 + Math.sin(t / 20), armL: { a: 6, b: -4 }, armR: { a: 6, b: -4 } };
  const zoom = kf(t, [[0, 2.3], [len, 2.65]]);
  const cx = 965;
  const cy = 540;
  const head = { x: ps.x, y: ps.y - 176 * ps.scale };
  const sx = (head.x - cx) * zoom + 960;
  const sy = (head.y - cy) * zoom + 540;
  return (
    <g>
      <g transform={camT(cx, cy, zoom)}>
        <Street t={t + 1600} id="d25s" veil={0.4} />
        {WALKERS.filter((w) => w.Z > 7.2).sort((a, b) => b.Z - a.Z).map((w, i) => walker(w.look, w.X0 + w.dir * w.v * t, w.Z, w.ph + t * 0.55, w.dir, `w${i}`))}
        <Hero look={LOOKS.pipHood} pose={{ ...pip, ...faceAt(t, [[0, 'worried']]), blink: t > 50 && t < 54 ? 1 : 0.15 }} rimId="rimR" shadow={0.7} />
        <Foreground blur={10}>
          {NEAR.map((w, i) => walker(w.look, w.X0 + w.dir * w.v * t, 5.2, w.ph + t * 0.6, w.dir, `n${i}`))}
        </Foreground>
      </g>
      <MemoryGlow x={sx} y={sy} r={62 * ps.scale * zoom * 1.5} t={t} id="d25mg" o={0.55} />
    </g>
  );
};
