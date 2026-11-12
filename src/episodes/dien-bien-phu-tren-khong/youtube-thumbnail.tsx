import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HookText } from '../../channel/channel-branding';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { Flames } from '../../countryball/fx-bomb-carpet';
import { SamLaunch, FlakBurst } from '../../countryball/fx-sam-and-flak';
import { Searchlights } from '../../countryball/fx-tracers-and-lights';

// Thumbnail: Hà Nội at night from above, searchlights crossing, a B-52 on fire falling, a SAM trail rising, the
// Vietnam ball in a pith helmet looking up, and the one phrase people search for: ĐIỆN BIÊN PHỦ TRÊN KHÔNG.
const CAM = { lon: 105.86, lat: 21.02, zoom: 420 };

export const SkyDienBienPhuThumbnail: React.FC = () => (
  <AbsoluteFill style={{ background: '#0B1522' }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <GeoMap camera={CAM} night={0.9} provinces rivers={['Hong', 'Duong']} id="thumb">
        <City {...CITIES.hanoi} lights={1} showLabel={false} size={60} />
      </GeoMap>
      <rect width={1920} height={1080} fill="#060B14" opacity={0.25} />
      <Searchlights t={0} length={1300} sources={[
        { x: 300, y: 1120, base: -62, swing: 0, period: 200, phase: 0 },
        { x: 820, y: 1120, base: -80, swing: 0, period: 200, phase: 0 },
        { x: 1500, y: 1120, base: -112, swing: 0, period: 200, phase: 0 },
      ]} />
      <SamLaunch id="th-sam" t={60} t0={0} from={[1120, 1100]} to={[880, 600]} dur={40} bend={0.18} size={90} />
      <FlakBurst id="th-flak1" t={14} t0={0} x={760} y={250} r={70} />
      <FlakBurst id="th-flak2" t={12} t0={0} x={1300} y={330} r={55} />
      {/* the hit B-52: a black smoke trail back along its path, fire on the left wing, nose dipping */}
      {Array.from({ length: 16 }, (_, i) => {
        const d = 90 + i * 48, a = (Math.PI / 180) * 32;
        return <circle key={i} cx={830 - d * Math.cos(a) + Math.sin(i * 1.7) * 14} cy={560 - d * Math.sin(a) + Math.cos(i * 2.3) * 12}
          r={34 + i * 5} fill={i < 3 ? '#3A2A22' : '#1E1E24'} opacity={0.85 - i * 0.045} />;
      })}
      <AircraftTop id="th-b52" kind="b52" x={830} y={560} size={540} heading={32} roll={0.85} />
      <Flames t={7} x={735} y={610} s={95} n={6} dir={212} />
      <Flames t={13} x={800} y={500} s={60} n={4} seed={3} dir={212} />
      <Ball id="th-vn" x={1560} y={780} r={250} flag="VNM" eyes="determined" look={-0.8} tilt={-6} hat={<MuCoi />} />
      <HookText lines={['ĐIỆN BIÊN PHỦ', 'TRÊN KHÔNG']} x={70} y={190} size={128} />
    </svg>
  </AbsoluteFill>
);
