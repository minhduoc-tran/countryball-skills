import React from 'react';
import { LOOKS, SCH } from '../../engine';

// Pieces the last-one shots share: Pip's arm entering an insert from off frame (the dark hoodie sleeve and the light
// mitten, scaled up hard, as the copy-paste inserts draw it), and the schematic's line icons (a person, a cigarette).

const PIP = LOOKS.pipHood;

/** A sleeve from (fx, fy) off frame to the mitten at (x, y); `rot` turns the mitten, `point` folds the fingers. */
export const InsertArm: React.FC<{ x: number; y: number; fx: number; fy: number; rot?: number; s?: number; width?: number; point?: boolean; fist?: boolean }> = ({
  x, y, fx, fy, rot = 0, s = 4.8, width = 112, point = false, fist = false,
}) => {
  const d = `M ${x + (fx - x) * 0.08} ${y + (fy - y) * 0.08} Q ${x + (fx - x) * 0.45 + 40} ${y + (fy - y) * 0.45} ${fx} ${fy}`;
  return (
    <g filter="url(#rimR)">
      <path d={d} stroke={PIP.line} strokeWidth={width + 18} fill="none" strokeLinecap="round" />
      <path d={d} stroke={PIP.limb} strokeWidth={width} fill="none" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
        {point ? <rect x={-4} y={10} width={8} height={24} rx={4} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.4} /> : null}
        {fist ? (
          <ellipse cx={0} cy={6} rx={14} ry={13} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.6} />
        ) : (
          <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={PIP.hand} stroke={PIP.line} strokeWidth={2.6} strokeLinejoin="round" />
        )}
        <ellipse cx={-10} cy={6} rx={4.5} ry={7} fill={PIP.hand} stroke={PIP.line} strokeWidth={2.4} />
      </g>
    </g>
  );
};

/** A person as a schematic line icon, centred on its middle; `on` lights it orange, `o` fades it. */
export const PersonIcon: React.FC<{ x: number; y: number; s?: number; on?: boolean; o?: number; glow?: boolean }> = ({ x, y, s = 1, on = false, o = 1, glow = false }) => {
  const c = on ? SCH.live : SCH.dim;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} stroke={c} strokeWidth={4 / Math.max(0.6, s * 0.7)} fill="none" strokeLinejoin="round"
      style={glow ? { filter: `drop-shadow(0 0 10px ${SCH.glow})` } : undefined}>
      <circle cx={0} cy={-20} r={11} fill={on ? `${SCH.live}33` : 'none'} />
      <path d="M -19 26 Q -20 -4 0 -4 Q 20 -4 19 26 Z" fill={on ? `${SCH.live}33` : 'none'} />
    </g>
  );
};

/** A cigarette from the side, about 150 long, the lit end on the right with a curl of smoke. */
export const CigaretteIcon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-75} y={-11} width={44} height={22} rx={4} fill="#C98A4A" stroke={SCH.line} strokeWidth={3} />
    <rect x={-31} y={-11} width={96} height={22} rx={3} fill="#E9E2D2" stroke={SCH.line} strokeWidth={3} />
    <rect x={62} y={-11} width={12} height={22} rx={4} fill={SCH.live} style={{ filter: `drop-shadow(0 0 8px ${SCH.glow})` }} />
    <path d={`M 72 -16 q ${-8 + Math.sin(t / 4) * 5} -16 0 -30 q ${10 + Math.sin(t / 5) * 4} -12 2 -28`} stroke={SCH.dim} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.7} />
  </g>
);
