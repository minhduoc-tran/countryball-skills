import React from 'react';
import { clamp, easeOut, backOut, FONT } from '../../engine';

// Chapter A: the generic bank app (no brand: "NGÂN HÀNG", a green tick) as phone screens, each 600 x 1250 in its own
// units (origin top-left), meant to sit inside last-one's <PhoneShell>. Every screen is a pure function of its clock t.

export const BW = 600;
export const BH = 1250;
const INK = '#0E1A22';
const CARD = '#1B2C36';
const GREEN = '#2FBF71';
const MINT = '#7CF0A8';
const CREAM = '#F6EFE3';
const SOFT = '#9FC6B8';

/** 1234000 -> "1.234.000" (Vietnamese thousands dots). */
export const fmtVnd = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const Tick: React.FC<{ x: number; y: number; r: number; p?: number }> = ({ x, y, r, p = 1 }) => (
  <g>
    <circle cx={x} cy={y} r={r * p} fill={GREEN} />
    <path d={`M ${x - r * 0.45} ${y + r * 0.02} l ${r * 0.32} ${r * 0.36} l ${r * 0.62} ${-r * 0.7}`} stroke="#EFFFF6" strokeWidth={r * 0.2} fill="none" strokeLinecap="round" strokeLinejoin="round"
      pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p * 1.4 - 0.3)} />
  </g>
);

/** One notification card at (0, y): bank name, "now", and the amount line. */
const NotifCard: React.FC<{ y: number; amount: string; sub: string; o?: number }> = ({ y, amount, sub, o = 1 }) => (
  <g transform={`translate(0 ${y})`} opacity={o}>
    <rect x={24} y={0} width={BW - 48} height={150} rx={30} fill={CARD} stroke="#2E4552" strokeWidth={3} />
    <Tick x={84} y={58} r={30} />
    <text x={136} y={50} fontFamily={FONT.ui} fontSize={26} fill={SOFT} letterSpacing={2}>NGÂN HÀNG</text>
    <text x={BW - 52} y={50} textAnchor="end" fontFamily={FONT.ui} fontSize={22} fill={SOFT}>bây giờ</text>
    <text x={136} y={112} fontFamily={FONT.ui} fontSize={46} fontWeight={700} fill={MINT}>{amount}</text>
    <text x={BW - 52} y={130} textAnchor="end" fontFamily={FONT.ui} fontSize={20} fill={SOFT}>{sub}</text>
  </g>
);

/** Lock screen: the time, then notification cards stacking in at the frames `at` (each pushes the older ones down). */
export const LockNotifs: React.FC<{ t: number; at: number[]; time?: string; amount?: string; balance?: number }> = ({ t, at, time = '06:00', amount = '+1.000 đ', balance = 0 }) => (
  <g>
    <rect width={BW} height={BH} fill={INK} />
    <defs><linearGradient id="bank-lock-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1E4450" /><stop offset="1" stopColor={INK} /></linearGradient></defs>
    <rect width={BW} height={BH} fill="url(#bank-lock-fade)" opacity={0.75} />
    <text x={BW / 2} y={210} textAnchor="middle" fontFamily={FONT.ui} fontSize={150} fontWeight={700} fill={CREAM}>{time}</text>
    <text x={BW / 2} y={268} textAnchor="middle" fontFamily={FONT.hand} fontSize={36} fill={SOFT}>Sáng nay</text>
    {at.map((a, i) => {
      const p = backOut(clamp((t - a) / 8));
      const push = at.reduce((s, b, j) => (j > i ? s + easeOut(clamp((t - b) / 8)) : s), 0);
      return t < a ? null : <NotifCard key={i} y={330 + push * 172 - (1 - p) * 240} amount={amount} sub={`Số dư ${fmtVnd(balance + 1000 * (i + 1))} đ`} o={clamp((t - a) / 3)} />;
    })}
  </g>
);

/** Balance screen: "SỐ DƯ" and the number climbing by `step` every `every` frames from `start`, a row per tick below. */
export const BalanceScreen: React.FC<{ t: number; start?: number; every?: number; step?: number }> = ({ t, start = 0, every = 8, step = 1000 }) => {
  const n = Math.floor(t / every);
  const k = (t % every) / every;
  const val = start + step * n;
  const pop = 1 + 0.06 * Math.max(0, 1 - k * 4);
  const rows = Array.from({ length: 6 }).map((_, i) => n - i).filter((v) => v > 0);
  return (
    <g>
      <rect width={BW} height={BH} fill={INK} />
      <rect width={BW} height={150} fill="#12303A" />
      <Tick x={56} y={80} r={24} />
      <text x={96} y={90} fontFamily={FONT.ui} fontSize={28} fill={CREAM} letterSpacing={3}>NGÂN HÀNG</text>
      <text x={BW / 2} y={290} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={SOFT} letterSpacing={4}>SỐ DƯ</text>
      <g transform={`translate(${BW / 2} 400) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={val > 99999999 ? 62 : 80} fontWeight={700} fill={MINT} style={{ filter: 'drop-shadow(0 0 14px rgba(47,191,113,0.8))' }}>{fmtVnd(val)} đ</text>
      </g>
      {rows.map((v, i) => (
        <g key={v} transform={`translate(0 ${520 + i * 100})`} opacity={(1 - i * 0.15) * clamp(i === 0 ? k * 5 : 1)}>
          <rect x={30} y={0} width={BW - 60} height={80} rx={20} fill={CARD} />
          <circle cx={76} cy={40} r={20} fill={GREEN} />
          <text x={116} y={52} fontFamily={FONT.ui} fontSize={34} fill={MINT}>+{fmtVnd(step)} đ</text>
          <text x={BW - 56} y={50} textAnchor="end" fontFamily={FONT.ui} fontSize={22} fill={SOFT}>bây giờ</text>
        </g>
      ))}
    </g>
  );
};

/** The bank's check: three lines tick off, then a big stamp "HỢP LỆ" slams on at frame 26. */
export const CheckScreen: React.FC<{ t: number }> = ({ t }) => {
  const rows = ['Nguồn tiền', 'Giao dịch', 'Số dư'];
  const st = clamp((t - 30) / 5);
  const slam = 1 + 0.9 * (1 - easeOut(st));
  return (
    <g>
      <rect width={BW} height={BH} fill={INK} />
      <rect width={BW} height={150} fill="#12303A" />
      <Tick x={56} y={80} r={24} />
      <text x={96} y={90} fontFamily={FONT.ui} fontSize={28} fill={CREAM} letterSpacing={3}>NGÂN HÀNG</text>
      <text x={BW / 2} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fontWeight={700} fill={CREAM} letterSpacing={2}>KẾT QUẢ KIỂM TRA</text>
      {rows.map((r, i) => (
        <g key={r} transform={`translate(0 ${350 + i * 120})`}>
          <rect x={40} y={0} width={BW - 80} height={92} rx={22} fill={CARD} />
          <text x={80} y={58} fontFamily={FONT.ui} fontSize={32} fill={CREAM}>{r}</text>
          <Tick x={BW - 100} y={46} r={26} p={clamp((t - 6 - i * 6) / 5)} />
        </g>
      ))}
      <g transform={`translate(${BW / 2} 900) rotate(-8) scale(${slam})`} opacity={st}>
        <rect x={-240} y={-70} width={480} height={140} rx={24} fill="none" stroke={MINT} strokeWidth={12} />
        <text y={24} textAnchor="middle" fontFamily={FONT.ui} fontSize={66} fontWeight={700} fill={MINT} letterSpacing={2}>HỢP LỆ ✓</text>
      </g>
    </g>
  );
};

/** Transfer: the amount to MO, the confirm button pressed at frame 22, "THÀNH CÔNG" after. */
export const TransferScreen: React.FC<{ t: number }> = ({ t }) => {
  const press = clamp((t - 22) / 3);
  const done = backOut(clamp((t - 28) / 7));
  return (
    <g>
      <rect width={BW} height={BH} fill={INK} />
      <rect width={BW} height={150} fill="#12303A" />
      <text x={BW / 2} y={92} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={CREAM} letterSpacing={3}>CHUYỂN KHOẢN</text>
      <circle cx={BW / 2} cy={310} r={74} fill="#8A9A3E" />
      <circle cx={BW / 2} cy={296} r={26} fill={CREAM} />
      <path d={`M ${BW / 2 - 44} 366 Q ${BW / 2} 300 ${BW / 2 + 44} 366 Z`} fill={CREAM} />
      <text x={BW / 2} y={440} textAnchor="middle" fontFamily={FONT.hand} fontSize={52} fill={CREAM}>Mo</text>
      <text x={BW / 2} y={600} textAnchor="middle" fontFamily={FONT.ui} fontSize={78} fontWeight={700} fill={MINT}>500.000 đ</text>
      <rect x={60} y={820} width={BW - 120} height={120} rx={60} fill={GREEN} opacity={done > 0 ? 0.35 : 1} transform={`translate(0 ${press * 6})`} />
      <text x={BW / 2} y={896 + press * 6} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fontWeight={700} fill="#06210F" letterSpacing={3} opacity={done > 0 ? 0.35 : 1}>XÁC NHẬN</text>
      {done > 0 ? (
        <g transform={`translate(${BW / 2} 1060) scale(${done})`}>
          <Tick x={-190} y={0} r={36} />
          <text x={-130} y={16} fontFamily={FONT.ui} fontSize={42} fontWeight={700} fill={MINT}>THÀNH CÔNG</text>
        </g>
      ) : null}
    </g>
  );
};

/** Mo's side: a big notification "+500.000 đ" with a tick, pulsing. */
export const ReceivedScreen: React.FC<{ t: number }> = ({ t }) => {
  const p = backOut(clamp(t / 8));
  return (
    <g>
      <rect width={BW} height={BH} fill={INK} />
      <rect width={BW} height={BH * 0.5} fill="#16303A" opacity={0.55} />
      <g transform={`translate(${BW / 2} 560) scale(${p})`}>
        <Tick x={0} y={-170} r={74} />
        <text y={-20} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SOFT} letterSpacing={3}>BẠN NHẬN ĐƯỢC</text>
        <text y={90} textAnchor="middle" fontFamily={FONT.ui} fontSize={84} fontWeight={700} fill={MINT} style={{ filter: 'drop-shadow(0 0 14px rgba(47,191,113,0.8))' }}>+500.000 đ</text>
        <text y={170} textAnchor="middle" fontFamily={FONT.hand} fontSize={42} fill={CREAM}>từ Pip</text>
      </g>
    </g>
  );
};

/** Home screen with the bank app icon and a red badge showing `count` (it grows with the number). */
export const BadgeScreen: React.FC<{ t: number; count: number }> = ({ t, count }) => {
  const txt = fmtVnd(count);
  const w = 60 + txt.length * 44;
  const shake = 1 + 0.08 * Math.sin(t * 2.3);
  return (
    <g>
      <rect width={BW} height={BH} fill="#1D2B46" />
      <rect y={BH * 0.55} width={BW} height={BH * 0.45} fill="#16203A" opacity={0.6} />
      <g transform={`translate(${BW / 2} 560) scale(2.3)`}>
        <rect x={-60} y={-60} width={120} height={120} rx={30} fill="#12303A" stroke={GREEN} strokeWidth={4} />
        <Tick x={0} y={0} r={36} />
        <g transform={`translate(52 -56) scale(${shake / 2.3})`}>
          <rect x={-w / 2 - 30} y={-52} width={w + 60} height={104} rx={52} fill="#E4403A" stroke="#FFF" strokeWidth={5} />
          <text y={22} textAnchor="middle" fontFamily={FONT.ui} fontSize={66} fontWeight={700} fill="#FFF">{txt}</text>
        </g>
      </g>
      <text x={BW / 2} y={780} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill={SOFT} letterSpacing={3}>NGÂN HÀNG</text>
    </g>
  );
};

/** Settings: the bank's "Thông báo" row with a toggle; at frame `off` the knob slides across and the green goes grey. */
export const ToggleScreen: React.FC<{ t: number; off?: number }> = ({ t, off = 16 }) => {
  const k = easeOut(clamp((t - off) / 6));
  const onc = k < 0.5 ? GREEN : '#56626C';
  return (
    <g>
      <rect width={BW} height={BH} fill={INK} />
      <rect width={BW} height={150} fill="#12303A" />
      <text x={BW / 2} y={92} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={CREAM} letterSpacing={3}>CÀI ĐẶT</text>
      <rect x={30} y={260} width={BW - 60} height={180} rx={30} fill={CARD} />
      <path d="M 90 336 q -26 6 -26 40 l -10 18 h 80 l -10 -18 q 0 -34 -26 -40 Z M 78 410 q 12 14 24 0" fill={k < 0.5 ? MINT : SOFT} opacity={0.9} />
      <text x={160} y={366} fontFamily={FONT.hand} fontSize={44} fill={CREAM}>Thông báo</text>
      <text x={160} y={410} fontFamily={FONT.ui} fontSize={24} fill={SOFT}>{k < 0.5 ? 'BẬT' : 'TẮT'}</text>
      <g transform="translate(486 350)">
        <rect x={-70} y={-38} width={140} height={76} rx={38} fill={onc} />
        <circle cx={-32 + 64 * (1 - k)} cy={0} r={30} fill="#F6EFE3" />
      </g>
      <rect x={30} y={470} width={BW - 60} height={120} rx={30} fill={CARD} opacity={0.6} />
      <rect x={30} y={620} width={BW - 60} height={120} rx={30} fill={CARD} opacity={0.6} />
    </g>
  );
};
