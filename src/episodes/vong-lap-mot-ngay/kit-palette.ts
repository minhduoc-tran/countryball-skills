// Shared palette for "Sẽ ra sao nếu chỉ mình bạn nhớ ngày hôm qua?" (vong-lap-mot-ngay) + colour helpers.
// API:
//   PAL.dawn / dawnGold   peach + gold morning light through Pip's window (#FFB98A, #FFD9A0)
//   PAL.preDawn           the blue before sunrise (dawn = 0)
//   PAL.rain / rainDark   16:00 rain blue-grey and its shadow
//   PAL.midnight          deep blue of 23:59
//   PAL.cyan / cyanSoft   the RESET motif (rewind cyan) and its halo; PAL.flash = the white of the reset flash
//   PAL.led               the alarm clock's red LED; PAL.paper / ink for notebooks and calendars
//   mix(a, b, k)          linear mix of two #RRGGBB colours (k 0 = a, 1 = b, clamped)
//   fmtVN(n)              3650 -> "3.650" (Vietnamese thousands dots)

export const PAL = {
  dawn: '#FFB98A',
  dawnGold: '#FFD9A0',
  dawnSky: '#F7A58A',
  preDawn: '#2A3566',
  preDawnSky: '#1E2A55',
  day: '#9FD3F0',
  rain: '#5E6E86',
  rainDark: '#3A4558',
  midnight: '#141A33',
  cyan: '#5CE1E6',
  cyanSoft: '#A8F3F5',
  flash: '#F4FEFF',
  led: '#FF5A3A',
  paper: '#F4EEDF',
  paperShade: '#DCD3BE',
  ink: '#1D2033',
  terracotta: '#C2603E',
  leaf: '#4E7350',
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

/** An integer in Vietnamese format: 3650 -> "3.650". */
export const fmtVN = (n: number): string => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
