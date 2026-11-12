import React from 'react';

// Chapter E: a tiny stick-style villager, feet at (x, y), about 62 units tall at s = 1. Used for the communities, the
// generations and the city of promises. `armL`/`armR` are angles in degrees from straight down (positive swings the
// arm up and outward), `bob` lifts the body, `old` gives white hair and a stoop, `hat` a conical straw hat.

const LINE = '#2A1E24';

export const Tiny: React.FC<{
  x: number; y: number; s?: number; shirt?: string; skin?: string; hair?: string; armL?: number; armR?: number; bob?: number;
  hat?: boolean; old?: boolean; kid?: boolean; flip?: boolean; thread?: string;
}> = ({ x, y, s = 1, shirt = '#E07A5F', skin = '#EBC8A4', hair = '#2A1C18', armL = 8, armR = 8, bob = 0, hat = false, old = false, kid = false, flip = false, thread }) => {
  const k = kid ? 0.72 : 1;
  const arm = (side: 1 | -1, a: number) => {
    const rad = (a * Math.PI) / 180;
    const sx = side * 9;
    const ex = sx + side * Math.sin(rad) * 24;
    const ey = -40 + Math.cos(rad) * 24;
    return <path d={`M ${sx} -40 L ${ex} ${ey}`} stroke={LINE} strokeWidth={9} strokeLinecap="round" /> ;
  };
  const armFill = (side: 1 | -1, a: number) => {
    const rad = (a * Math.PI) / 180;
    const sx = side * 9;
    const ex = sx + side * Math.sin(rad) * 24;
    const ey = -40 + Math.cos(rad) * 24;
    return (
      <g>
        <path d={`M ${sx} -40 L ${ex} ${ey}`} stroke={shirt} strokeWidth={5.5} strokeLinecap="round" />
        <circle cx={ex} cy={ey} r={4.6} fill={skin} stroke={LINE} strokeWidth={1.8} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y - bob}) scale(${(flip ? -s : s) * k} ${s * k})`}>
      <ellipse cx={0} cy={bob} rx={15} ry={4} fill="#000" opacity={0.25} />
      <path d="M -6 -22 L -6 0 M 6 -22 L 6 0" stroke={LINE} strokeWidth={8} strokeLinecap="round" />
      <path d="M -6 -22 L -6 0 M 6 -22 L 6 0" stroke="#3A3550" strokeWidth={4.5} strokeLinecap="round" />
      {arm(-1, armL)}{arm(1, armR)}
      <g transform={old ? 'rotate(8 0 -22)' : undefined}>
        <path d="M -12 -22 Q -13 -52 0 -52 Q 13 -52 12 -22 Z" fill={shirt} stroke={LINE} strokeWidth={2.6} strokeLinejoin="round" />
        {armFill(-1, armL)}{armFill(1, armR)}
        <circle cx={0} cy={-63} r={11} fill={skin} stroke={LINE} strokeWidth={2.6} />
        {hat ? (
          <g><path d="M -22 -68 L 0 -92 L 22 -68 Z" fill="#E9CF86" stroke={LINE} strokeWidth={2.4} strokeLinejoin="round" /><path d="M -22 -68 Q 0 -63 22 -68" stroke="#B89A4A" strokeWidth={2} fill="none" /></g>
        ) : (
          <path d="M -11 -64 Q -12 -77 0 -76 Q 12 -77 11 -64 Q 4 -70 -11 -64 Z" fill={old ? '#EDEDF2' : hair} stroke={LINE} strokeWidth={2} strokeLinejoin="round" />
        )}
        <circle cx={-3.6} cy={-63} r={1.4} fill={LINE} />
        <circle cx={3.6} cy={-63} r={1.4} fill={LINE} />
        <path d="M -3 -58.5 Q 0 -56 3 -58.5" stroke={LINE} strokeWidth={1.3} fill="none" />
      </g>
      {thread ? <circle cx={0} cy={-100} r={3} fill={thread} /> : null}
    </g>
  );
};

/** Deterministic palette for crowds. */
export const SHIRTS = ['#E07A5F', '#3D8BA8', '#E9B93A', '#7FB069', '#B07CC6', '#E8846B', '#4A6FA8', '#D96C8C'];
export const SKINS = ['#EBC8A4', '#D9A97E', '#F2D3B3', '#C98F68'];
