// Aircraft kinds shared by the top-down and side sprites. Sprites are drawn 100 units long, facing +x (east),
// centred on the fuselage middle; `size` props are the on-screen LENGTH in px. AIRCRAFT_LENGTH_M gives real lengths
// so a map can scale kinds against each other (size = metres * pxPerMetre).

export type AircraftKind = 'b52' | 'f111' | 'f4' | 'kc135' | 'eb66' | 'mig21';
export type B52Variant = 'D' | 'G';

export const AIRCRAFT_LENGTH_M: Record<AircraftKind, number> = { b52: 48.5, f111: 22.4, f4: 19.2, kc135: 41.0, eb66: 22.9, mig21: 15.8 };
export const AIRCRAFT_NAME: Record<AircraftKind, string> = { b52: 'B-52', f111: 'F-111', f4: 'F-4 Phantom', kc135: 'KC-135', eb66: 'EB-66', mig21: 'MiG-21' };

export const INK = '#151515';
export const mirror = (pts: [number, number][]) => pts.map(([x, y]) => [x, -y] as [number, number]);
export const pts = (p: [number, number][]) => p.map((q) => q.join(',')).join(' ');
