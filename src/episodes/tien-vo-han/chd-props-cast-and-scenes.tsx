import React from 'react';
import { LOOKS, Look, Pose, joints, toWorld, HEAD, Glow, Cone, FONT, UI, clamp } from '../../engine';

// Chapter D local cast and scenes: grandma, the farmer, the surgeon and the baker are recoloured looks on the one rig
// plus a hat / cap / mask drawn over the head; a dawn rice paddy, an operating room, a clay oven, the xôi cart, and
// an arm-and-hand for inserts. All pure functions of the shot clock.

export const GRAN: Look = { ...LOOKS.mom, hair: '#D5D3DC', jacket: '#6C7F8E', jacketShade: '#566878', accent: '#E8E2D2' };
export const FARMER: Look = { ...LOOKS.mo, extra: undefined, jacket: '#6B5A3E', jacketShade: '#54462F', limb: '#4A3F2E', hair: '#2A2018', accent: '#C9B07A' };
export const SURGEON: Look = { ...LOOKS.mo, extra: 'bob', jacket: '#3C8F8C', jacketShade: '#2D716F', limb: '#3C8F8C', hair: '#3C8F8C', accent: '#CFEDEA' };
export const BAKER: Look = { ...LOOKS.mom, jacket: '#EDE6D6', jacketShade: '#CFC7B4', limb: '#7A6A8C', accent: '#C9A06A', hair: '#3A2A24' };
export const NEIGHBOUR: Look = { ...LOOKS.mo, extra: 'bob', hair: '#2E2A3A', jacket: '#4A6A8A', jacketShade: '#3A566F' };

/** The head's centre and radius in world units for a pose, to hang a hat on. */
export const headAt = (pose: Pose) => {
  const h = toWorld(pose, joints(pose).head);
  return { x: h.x + pose.yaw * 8 * pose.scale, y: h.y, r: HEAD.r * pose.scale, tilt: pose.tilt + pose.headTilt };
};

/** A conical straw hat (nón lá) sitting on the head. */
export const ConicalHat: React.FC<{ pose: Pose }> = ({ pose }) => {
  const h = headAt(pose);
  const r = h.r;
  return (
    <g transform={`rotate(${h.tilt} ${h.x} ${h.y})`}>
      <path d={`M ${h.x} ${h.y - r * 1.75} Q ${h.x - r * 1.0} ${h.y - r * 0.9} ${h.x - r * 1.75} ${h.y - r * 0.5} Q ${h.x} ${h.y - r * 0.15} ${h.x + r * 1.75} ${h.y - r * 0.5} Q ${h.x + r * 1.0} ${h.y - r * 0.9} ${h.x} ${h.y - r * 1.75} Z`} fill="#D9BE7A" stroke="#7A6230" strokeWidth={4 * pose.scale} strokeLinejoin="round" />
      <path d={`M ${h.x} ${h.y - r * 1.75} L ${h.x + r * 1.75} ${h.y - r * 0.5} Q ${h.x} ${h.y - r * 0.15} ${h.x + r * 0.2} ${h.y - r * 0.3} Z`} fill="#BFA25E" opacity={0.55} />
      {[-1.1, -0.55, 0.1, 0.7].map((k, i) => <path key={i} d={`M ${h.x + k * r * 0.2} ${h.y - r * 1.55 + i * r * 0.22} Q ${h.x + k * r * 1.2} ${h.y - r * 0.9 + i * r * 0.12} ${h.x + k * r * 1.5} ${h.y - r * 0.45}`} stroke="#9C8444" strokeWidth={2.5 * pose.scale} fill="none" opacity={0.6} />)}
      <path d={`M ${h.x - r * 0.75} ${h.y - r * 0.3} L ${h.x - r * 0.7} ${h.y + r * 0.7} M ${h.x + r * 0.75} ${h.y - r * 0.3} L ${h.x + r * 0.7} ${h.y + r * 0.7}`} stroke="#B8453A" strokeWidth={3 * pose.scale} />
    </g>
  );
};

/** A surgeon's cap and a face mask. */
export const SurgeonGear: React.FC<{ pose: Pose }> = ({ pose }) => {
  const h = headAt(pose);
  const r = h.r;
  const fx = pose.yaw * r * 0.3;
  return (
    <g transform={`rotate(${h.tilt} ${h.x} ${h.y})`}>
      <path d={`M ${h.x - r * 1.04} ${h.y - r * 0.12} Q ${h.x - r * 1.0} ${h.y - r * 1.3} ${h.x} ${h.y - r * 1.2} Q ${h.x + r * 1.0} ${h.y - r * 1.3} ${h.x + r * 1.04} ${h.y - r * 0.12} Q ${h.x} ${h.y - r * 0.5} ${h.x - r * 1.04} ${h.y - r * 0.12} Z`} fill="#3C8F8C" stroke="#1F5A58" strokeWidth={3.5 * pose.scale} />
      <path d={`M ${h.x - r * 0.62 + fx} ${h.y + r * 0.2} Q ${h.x + fx} ${h.y + r * 0.12} ${h.x + r * 0.62 + fx} ${h.y + r * 0.2} L ${h.x + r * 0.5 + fx} ${h.y + r * 0.8} Q ${h.x + fx} ${h.y + r * 0.98} ${h.x - r * 0.5 + fx} ${h.y + r * 0.8} Z`} fill="#CFEDEA" stroke="#5A8A88" strokeWidth={3 * pose.scale} />
      <path d={`M ${h.x - r * 0.4 + fx} ${h.y + r * 0.42} H ${h.x + r * 0.4 + fx} M ${h.x - r * 0.36 + fx} ${h.y + r * 0.62} H ${h.x + r * 0.36 + fx}`} stroke="#9CC4C2" strokeWidth={2.5 * pose.scale} />
    </g>
  );
};

/** A white headscarf knotted at the front, for the baker. */
export const Headscarf: React.FC<{ pose: Pose }> = ({ pose }) => {
  const h = headAt(pose);
  const r = h.r;
  return (
    <g transform={`rotate(${h.tilt} ${h.x} ${h.y})`}>
      <path d={`M ${h.x - r * 1.05} ${h.y - r * 0.05} Q ${h.x - r * 1.0} ${h.y - r * 1.35} ${h.x} ${h.y - r * 1.25} Q ${h.x + r * 1.0} ${h.y - r * 1.35} ${h.x + r * 1.05} ${h.y - r * 0.05} Q ${h.x} ${h.y - r * 0.55} ${h.x - r * 1.05} ${h.y - r * 0.05} Z`} fill="#F1ECDD" stroke="#9A927C" strokeWidth={3.5 * pose.scale} />
      <path d={`M ${h.x - r * 0.1} ${h.y - r * 0.5} l ${-r * 0.3} ${-r * 0.3} l ${r * 0.1} ${r * 0.35} M ${h.x - r * 0.1} ${h.y - r * 0.5} l ${r * 0.25} ${-r * 0.32} l ${-r * 0.05} ${r * 0.34}`} fill="#E3DCC8" stroke="#9A927C" strokeWidth={2.5 * pose.scale} />
    </g>
  );
};

/** Small round spectacles over grandma's eyes. */
export const Spectacles: React.FC<{ pose: Pose }> = ({ pose }) => {
  const h = headAt(pose);
  const r = h.r;
  const fx = pose.yaw * r * 0.34;
  return (
    <g transform={`rotate(${h.tilt} ${h.x} ${h.y})`} stroke="#4A3A32" strokeWidth={3 * pose.scale} fill="#fff" fillOpacity={0.12}>
      <circle cx={h.x - r * 0.3 + fx} cy={h.y + r * 0.02} r={r * 0.22} />
      <circle cx={h.x + r * 0.3 + fx} cy={h.y + r * 0.02} r={r * 0.22} />
      <path d={`M ${h.x - r * 0.08 + fx} ${h.y} H ${h.x + r * 0.08 + fx}`} fill="none" />
    </g>
  );
};

// ---------- a rising wisp of steam ----------
export const Steam: React.FC<{ x: number; y: number; t: number; s?: number; n?: number; o?: number }> = ({ x, y, t, s = 1, n = 4, o = 0.55 }) => (
  <g opacity={o} fill="none" stroke="#F4F1EA" strokeWidth={10 * s} strokeLinecap="round">
    {Array.from({ length: n }).map((_, i) => {
      const ph = ((t * 0.9 + i * (60 / n)) % 60) / 60;
      const yy = y - ph * 170 * s;
      const sway = Math.sin(ph * 6 + i * 2) * 14 * s;
      return <path key={i} opacity={Math.sin(ph * Math.PI)} d={`M ${x + (i - n / 2) * 18 * s + sway} ${yy} q ${10 * s} ${-18 * s} 0 ${-36 * s}`} />;
    })}
  </g>
);

// ---------- dawn paddy: the farmer's field ----------
export const RiceField: React.FC<{ t: number; id: string }> = ({ t, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6E6A9A" /><stop offset="0.55" stopColor="#F0A87A" /><stop offset="1" stopColor="#FFD9A0" />
      </linearGradient>
      <linearGradient id={`${id}wat`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F4C28A" /><stop offset="1" stopColor="#3E5A52" />
      </linearGradient>
    </defs>
    <rect x={-300} y={-300} width={2520} height={900} fill={`url(#${id}sky)`} />
    <circle cx={1280} cy={520} r={120} fill="#FFE9B8" />
    <Glow x={1280} y={520} r={700} o={0.8} />
    <path d="M -300 560 Q 100 400 520 520 Q 760 430 980 540 Q 1300 440 1700 550 Q 1950 470 2300 560 V 640 H -300 Z" fill="#6A6A86" opacity={0.7} />
    <path d="M -300 600 Q 300 500 800 590 Q 1300 520 1800 600 Q 2100 560 2300 610 V 680 H -300 Z" fill="#4E5E6A" />
    <rect x={-300} y={600} width={2520} height={900} fill={`url(#${id}wat)`} />
    {Array.from({ length: 7 }).map((_, r) => {
      const y = 640 + r * r * 8 + r * 44;
      const sc = 0.35 + r * 0.22;
      return Array.from({ length: 22 }).map((__, c) => {
        const x = -200 + c * (110 * sc * 1.1) + (r % 2) * 40 * sc;
        const sw = Math.sin(t / 22 + c + r) * 2.5 * sc;
        return (
          <g key={`${r}-${c}`} transform={`translate(${x} ${y}) scale(${sc})`}>
            <path d={`M -8 0 Q ${-6 + sw} -22 ${-10 + sw} -40 M 0 0 Q ${sw} -26 ${sw} -48 M 8 0 Q ${6 + sw} -22 ${10 + sw} -40`} stroke="#5E9A3E" strokeWidth={5} fill="none" strokeLinecap="round" />
            <ellipse cx={0} cy={12} rx={22} ry={5} fill="#FFE2AE" opacity={0.28} />
          </g>
        );
      });
    })}
    <rect x={-300} y={560} width={2520} height={110} fill="#FFE9C8" opacity={0.18 + 0.05 * Math.sin(t / 30)} />
  </g>
);

// ---------- operating room: a lamp, a monitor with a heartbeat, the table ----------
export const OperatingLamp: React.FC<{ x: number; t: number; id: string }> = ({ x, t, id }) => (
  <g>
    <path d={`M ${x} -60 V 130`} stroke="#5A6470" strokeWidth={10} />
    <ellipse cx={x} cy={150} rx={190} ry={44} fill="#C9D2DA" stroke="#6A7480" strokeWidth={5} />
    {[-120, -60, 0, 60, 120].map((dx) => <circle key={dx} cx={x + dx} cy={156} r={13} fill="#FFFBEA" />)}
    <path d={`M ${x - 180} 170 L ${x - 520} 880 L ${x + 520} 880 L ${x + 180} 170 Z`} fill={`url(#${id}cone)`} opacity={0.5 + 0.03 * Math.sin(t / 9)} />
    <defs>
      <linearGradient id={`${id}cone`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF6DA" stopOpacity="0.9" /><stop offset="1" stopColor="#FFF6DA" stopOpacity="0.05" /></linearGradient>
    </defs>
    <Cone d={`M ${x - 150} 180 L ${x - 380} 800 L ${x + 380} 800 L ${x + 150} 180 Z`} o={0.25} />
  </g>
);

/** A heart-monitor screen with a scrolling green trace, x y its centre. */
export const HeartMonitor: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const u = i * 6 + t * 3;
    const m = u % 120;
    const v = m < 8 ? -4 : m < 14 ? -46 : m < 20 ? 24 : m < 26 ? -8 : 0;
    pts.push(`${i * 6 - 120},${v}`);
  }
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-150} y={-110} width={300} height={220} rx={16} fill="#1A222A" stroke="#4A5560" strokeWidth={6} />
      <rect x={-132} y={-92} width={264} height={150} rx={8} fill="#07140E" />
      <polyline points={pts.join(' ')} fill="none" stroke="#4DF08E" strokeWidth={4} strokeLinejoin="round" transform="translate(0 -16)" style={{ filter: 'drop-shadow(0 0 6px #4DF08E)' }} />
      <circle cx={-110} cy={84} r={9} fill={Math.floor(t / 14) % 2 ? '#4DF08E' : '#1C4A30'} />
      <rect x={-84} y={78} width={100} height={12} rx={6} fill="#2E3A44" />
    </g>
  );
};

// ---------- the baker's clay oven ----------
export const ClayOven: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const fl = 1 + 0.08 * Math.sin(t * 0.9) + 0.05 * Math.sin(t * 2.1);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={270} ry={24} fill="#000" opacity={0.5} />
      <rect x={-210} y={-120} width={420} height={120} rx={14} fill="#7A4A3A" stroke="#3E2218" strokeWidth={5} />
      <path d="M -190 -120 Q -200 -400 0 -420 Q 200 -400 190 -120 Z" fill="#A5624A" stroke="#4A281C" strokeWidth={6} />
      <path d="M 40 -380 Q 160 -330 175 -150" stroke="#C98466" strokeWidth={10} fill="none" opacity={0.6} />
      {[-120, -40, 40, 120].map((dx, i) => <path key={i} d={`M ${dx - 24} ${-300 + Math.abs(dx) * 0.3} q 24 10 48 0 M ${dx - 24} ${-230 + Math.abs(dx) * 0.25} q 24 10 48 0`} stroke="#7A4030" strokeWidth={4} fill="none" />)}
      <path d="M -90 -120 V -230 Q -90 -280 0 -280 Q 90 -280 90 -230 V -120 Z" fill="#1A0C08" />
      <path d={`M -70 -120 V -215 Q -70 -255 0 -255 Q 70 -255 70 -215 V -120 Z`} fill="#FF8A3D" opacity={0.9 * fl} />
      <path d={`M -40 -120 V -190 Q -40 -226 0 -226 Q 40 -226 40 -190 V -120 Z`} fill="#FFD27A" opacity={0.95} />
      <rect x={-250} y={-60} width={40} height={60} fill="#5A3A2E" />
      <Glow x={0} y={-190} r={520 * fl} o={0.85} />
    </g>
  );
};

/** A flatbread / bánh mì loaf, x y its centre, about 110 wide. */
export const Loaf: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={56} ry={24} fill="#D9A25A" stroke="#7A5226" strokeWidth={3} />
    <path d="M -28 -12 l 10 20 M -4 -16 l 10 28 M 20 -14 l 10 24" stroke="#F0C27A" strokeWidth={5} strokeLinecap="round" />
  </g>
);

// ---------- the xôi cart: a steamer on two wheels with a cloth-covered pot, a hand-written sign ----------
export const XoiCart: React.FC<{ x: number; y: number; s?: number; t: number; roll?: number; facing?: 1 | -1; sign?: boolean }> = ({ x, y, s = 1, t, roll = 0, facing = 1, sign = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s * facing} ${s})`}>
    <ellipse cx={20} cy={4} rx={190} ry={16} fill="#000" opacity={0.4} />
    {[-90, 100].map((wx) => (
      <g key={wx} transform={`translate(${wx} -64) rotate(${roll})`}>
        <circle r={62} fill="none" stroke="#2A2630" strokeWidth={10} />
        <circle r={58} fill="none" stroke="#8A8C96" strokeWidth={3} />
        {[0, 45, 90, 135].map((a) => <path key={a} d="M 0 -58 V 58" stroke="#8A8C96" strokeWidth={2.5} transform={`rotate(${a})`} />)}
        <circle r={9} fill="#5A5C66" />
      </g>
    ))}
    <rect x={-170} y={-200} width={360} height={94} rx={10} fill="#5E8E9A" stroke="#2E4A52" strokeWidth={5} />
    <rect x={-170} y={-200} width={360} height={14} rx={7} fill="#7FB0BC" />
    <rect x={-120} y={-330} width={190} height={132} rx={8} fill="#C9CFD6" stroke="#6A7480" strokeWidth={5} />
    <rect x={-120} y={-330} width={60} height={132} rx={8} fill="#A8B0BA" />
    <path d="M -132 -334 Q -25 -372 82 -334 L 70 -318 Q -25 -346 -120 -318 Z" fill="#F1ECDD" stroke="#9A927C" strokeWidth={4} />
    <rect x={100} y={-300} width={70} height={100} rx={8} fill="#E8B84A" stroke="#7A5A1E" strokeWidth={4} />
    <path d="M -170 -200 L -250 -150 L -258 -140" stroke="#6A4A32" strokeWidth={12} strokeLinecap="round" fill="none" />
    {sign ? <text x={10} y={-134} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#FFF3D0">XÔI NÓNG</text> : null}
    <g transform={`scale(${facing} 1)`}>
      <Steam x={-25 * facing} y={-338} t={t} s={1.3} n={5} />
    </g>
  </g>
);

// ---------- inserts: an arm from off frame and a mitten, in any cast colours ----------
export const ArmHand: React.FC<{ look: Look; x: number; y: number; fx: number; fy: number; rot?: number; s?: number; width?: number }> = ({ look, x, y, fx, fy, rot = 0, s = 4.6, width = 108 }) => {
  const d = `M ${x + (fx - x) * 0.08} ${y + (fy - y) * 0.08} Q ${x + (fx - x) * 0.45 + 40} ${y + (fy - y) * 0.45} ${fx} ${fy}`;
  return (
    <g>
      <path d={d} stroke={look.line} strokeWidth={width + 18} fill="none" strokeLinecap="round" />
      <path d={d} stroke={look.jacket} strokeWidth={width} fill="none" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={look.hand} stroke={look.line} strokeWidth={2.6} strokeLinejoin="round" />
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={look.hand} stroke={look.line} strokeWidth={2.4} />
      </g>
    </g>
  );
};

/** The mono-face clock chip ("04:00") the baker's shot hangs in the corner. */
export const ClockChip: React.FC<{ x: number; y: number; text: string; t: number }> = ({ x, y, text, t }) => (
  <g transform={`translate(${x} ${y})`} opacity={clamp(t / 6)}>
    <rect x={-150} y={-52} width={300} height={104} rx={52} fill={UI.pill} opacity={0.7} />
    <circle cx={-96} cy={0} r={26} fill="none" stroke={UI.text} strokeWidth={5} />
    <path d="M -96 0 V -16 M -96 0 L -84 8" stroke={UI.live} strokeWidth={5} strokeLinecap="round" />
    <text x={20} y={20} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={56} fill={UI.text} letterSpacing={3}>{text}</text>
  </g>
);
