import React from 'react';
import { CAMBODIA_BALL_FLAGS } from './ball-flags-cambodia';

// Flags drawn in the unit box (-1..1, clipped to the ball by Ball). USA is built from 13 real stripes and a canton
// of staggered star dots (9 rows x 3-4 dots would vanish at 40 px, so 4 rows of dots is the readable compromise).

type FlagFn = () => React.ReactNode;
const band = (y0: number, y1: number, fill: string) => <rect x={-1.2} y={y0} width={2.4} height={y1 - y0} fill={fill} />;
const vband = (x0: number, x1: number, fill: string) => <rect x={x0} y={-1.2} width={x1 - x0} height={2.4} fill={fill} />;

// Five-point star polygon centred on (cx, cy) with outer radius r.
export const star = (cx: number, cy: number, r: number) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.382 : r;
    return `${(cx + rr * Math.cos(a)).toFixed(3)},${(cy + rr * Math.sin(a)).toFixed(3)}`;
  }).join(' ');

const usaFlag: FlagFn = () => {
  const h = 2.4 / 13, cantonH = h * 7;
  const dots: React.ReactNode[] = [];
  for (let row = 0; row < 5; row++)
    for (let c = 0; c < (row % 2 ? 3 : 4); c++) {
      const x = -0.88 + (row % 2 ? 0.15 : 0) + c * 0.3, y = -0.9 + row * 0.2;
      if (Math.hypot(x, y) < 0.95) dots.push(<polygon key={`${row}-${c}`} points={star(x, y, 0.09)} fill="#FFFFFF" />);
    }
  return (
    <>
      {band(-1.2, 1.2, '#F4F5F8')}
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-1.2} y={-1.2 + i * 2 * h} width={2.4} height={h} fill="#B22234" />)}
      <rect x={-1.2} y={-1.2} width={1.32} height={cantonH} fill="#3C3B6E" />
      {dots}
    </>
  );
};

export const PRG_COLORS = { red: '#D6261F', blue: '#2F78C9', star: '#FFD21F' } as const;
const prgFlag: FlagFn = () => (<>{band(-1.2, 0, PRG_COLORS.red)}{band(0, 1.2, PRG_COLORS.blue)}<polygon points={star(0, 0, 0.56)} fill={PRG_COLORS.star} /></>);

export const FLAGS: Record<string, FlagFn> = {
  VNM: () => (<>{band(-1.2, 1.2, '#DA251D')}<polygon points={star(0, 0.06, 0.62)} fill="#FFCD00" /></>),
  CHN: () => (
    <>
      {band(-1.2, 1.2, '#DE2910')}
      <g fill="#FFDE00">
        <polygon points={star(-0.49, -0.49, 0.22)} />
        {[[-0.16, -0.79], [0.03, -0.66], [0.04, -0.44], [-0.12, -0.30]].map(([x, y]) => {
          const angle = Math.atan2(-0.49 - y, -0.49 - x) * 180 / Math.PI + 90;
          return <polygon key={x} points={star(x, y, 0.075)} transform={`rotate(${angle} ${x} ${y})`} />;
        })}
      </g>
    </>
  ),
  RVN: () => (
    <>
      {band(-1.2, 1.2, '#F5CE4B')}
      {[-0.30, -0.08, 0.14].map((y) => <React.Fragment key={y}>{band(y, y + 0.11, '#C62528')}</React.Fragment>)}
    </>
  ),
  USA: usaFlag,
  /** Mặt trận Dân tộc Giải phóng miền Nam Việt Nam (MTDTGP / NLF) and the Chính phủ Cách mạng lâm thời (PRG): red over blue, yellow star across the split.
   *  This is the flag raised on the Dinh Độc Lập roof on 30.4.1975. Also available as 'MTDTGP'. */
  PRG: prgFlag,
  FRA: () => (<>{vband(-1.2, -0.34, '#0055A4')}{vband(-0.34, 0.34, '#F4F5F8')}{vband(0.34, 1.2, '#EF4135')}</>),
  THA: () => (<>{band(-1.2, -0.62, '#A51931')}{band(-0.62, -0.32, '#F4F5F8')}{band(-0.32, 0.32, '#2D2A4A')}
    {band(0.32, 0.62, '#F4F5F8')}{band(0.62, 1.2, '#A51931')}</>),
  LAO: () => (<>{band(-1.2, -0.5, '#CE1126')}{band(-0.5, 0.5, '#002868')}{band(0.5, 1.2, '#CE1126')}
    <circle cx={0} cy={0} r={0.4} fill="#FFFFFF" /></>),
  KHM: () => (<>{band(-1.2, -0.5, '#032EA1')}{band(-0.5, 0.5, '#E00025')}{band(0.5, 1.2, '#032EA1')}
    <path transform="translate(0,0.3) scale(0.78)" d="M-0.62,0.36 L-0.62,0.18 L-0.46,0.18 L-0.4,-0.05 L-0.3,0.18 L-0.14,0.18 L-0.07,-0.2 L0,-0.34 L0.07,-0.2
      L0.14,0.18 L0.3,0.18 L0.4,-0.05 L0.46,0.18 L0.62,0.18 L0.62,0.36 Z" fill="#FFFFFF" stroke="#1B1B1B" strokeWidth={0.02} /></>),
  MTDTGP: prgFlag,
  /** Cambodia 1975-93 (ball-flags-cambodia.tsx): DK = Kampuchea Dân chủ (Khmer Rouge, 1975-79), PRK = CHND Campuchia (1979-89),
   *  SOC = Nhà nước Campuchia (1989-93). KHM above = Vương quốc Campuchia (today). */
  ...CAMBODIA_BALL_FLAGS,
  PHL: () => (<>{band(-1.2, 0, '#0038A8')}{band(0, 1.2, '#CE1126')}
    <polygon points="-1.2,-1.2 0.05,0 -1.2,1.2" fill="#FFFFFF" />
    <circle cx={-0.62} cy={0} r={0.13} fill="#FCD116" />
    {Array.from({ length: 8 }, (_, i) => {
      const a = (i * Math.PI) / 4;
      return <line key={i} x1={-0.62 + 0.18 * Math.cos(a)} y1={0.18 * Math.sin(a)} x2={-0.62 + 0.27 * Math.cos(a)}
        y2={0.27 * Math.sin(a)} stroke="#FCD116" strokeWidth={0.05} strokeLinecap="round" />;
    })}</>),
};
