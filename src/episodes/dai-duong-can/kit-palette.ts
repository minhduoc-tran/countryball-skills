// Shared ocean-episode palette + colour mixer. Daylight / hot-sun by default.
// API: PAL.{seaTop,seaDeep,wet,dry,salt,crack,abyssTop,abyssDeep,ink}; mix(hexA, hexB, k) -> hex (k 0..1); fmtM(m) -> "−3.700 m".

export const PAL = {
  seaTop: '#2E86C1',
  seaDeep: '#1B4F72',
  wet: '#9C8A6A',
  dry: '#E9D3A3',
  salt: '#F4F1EA',
  crack: '#A9B7C4',
  abyssTop: '#5B4B3A',
  abyssDeep: '#2B2420',
  ink: '#14121A',
};

const hex = (c: string): [number, number, number] => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];

/** Linear mix of two #RRGGBB colours; k = 0 gives a, 1 gives b. */
export const mix = (a: string, b: string, k: number): string => {
  const kk = Math.min(1, Math.max(0, k));
  const A = hex(a);
  const B = hex(b);
  const h = (i: number) => Math.round(A[i] + (B[i] - A[i]) * kk).toString(16).padStart(2, '0');
  return `#${h(0)}${h(1)}${h(2)}`;
};

/** A depth in metres as Vietnamese text: fmtM(-3700) = "−3.700 m", fmtM(0) = "0 m". */
export const fmtM = (m: number): string => {
  const s = Math.abs(Math.round(m)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${m < 0 ? '−' : ''}${s} m`;
};
