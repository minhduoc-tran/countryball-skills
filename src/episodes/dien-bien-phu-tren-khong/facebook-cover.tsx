import React from 'react';
import { AbsoluteFill } from 'remotion';
import { HookText } from '../../channel/channel-branding';
import { Ball } from '../../countryball/countryball';
import { MuCoi } from '../../countryball/ball-accessories';
import { GeoMap } from '../../countryball/map-geo-map';
import { CITIES, City } from '../../countryball/map-labels';
import { FONT } from '../../engine/fonts';
import { AircraftTop } from '../../countryball/aircraft-top-view';
import { Flames } from '../../countryball/fx-bomb-carpet';
import { SamLaunch, FlakBurst } from '../../countryball/fx-sam-and-flak';
import { Searchlights } from '../../countryball/fx-tracers-and-lights';

// Facebook feed cover, 4:5 (1080x1350): the YouTube thumbnail recomposed tall. Night Hà Nội map (the 1920x1080
// map scaled 1.25 to fill the height), searchlights, the burning B-52 in the middle, the Vietnam ball below.
const CAM = { lon: 105.86, lat: 21.02, zoom: 420 };

export const SkyDienBienPhuFacebookCover: React.FC = () => (
  <AbsoluteFill style={{ background: '#0B1522' }}>
    <svg width={1080} height={1350} viewBox="0 0 1080 1350">
      <g transform="translate(-660 0) scale(1.25)">
        <GeoMap camera={CAM} night={0.9} provinces rivers={['Hong', 'Duong']} id="fbc">
          <City {...CITIES.hanoi} lights={1} showLabel={false} size={60} />
        </GeoMap>
      </g>
      <rect width={1080} height={1350} fill="#060B14" opacity={0.25} />
      <Searchlights t={0} length={1500} sources={[
        { x: 60, y: 1400, base: -66, swing: 0, period: 200, phase: 0 },
        { x: 520, y: 1400, base: -84, swing: 0, period: 200, phase: 0 },
        { x: 1040, y: 1400, base: -108, swing: 0, period: 200, phase: 0 },
      ]} />
      <SamLaunch id="fb-sam" t={60} t0={0} from={[700, 1400]} to={[520, 760]} dur={40} bend={0.18} size={84} />
      <FlakBurst id="fb-flak1" t={14} t0={0} x={880} y={470} r={62} />
      <FlakBurst id="fb-flak2" t={12} t0={0} x={170} y={1010} r={48} />
      {/* the hit B-52: smoke trail back up-left along its path, fire on the wing, nose dipping */}
      {Array.from({ length: 14 }, (_, i) => {
        const d = 90 + i * 46, a = (Math.PI / 180) * 32;
        return <circle key={i} cx={520 - d * Math.cos(a) + Math.sin(i * 1.7) * 12} cy={680 - d * Math.sin(a) + Math.cos(i * 2.3) * 10}
          r={30 + i * 5} fill={i < 3 ? '#3A2A22' : '#1E1E24'} opacity={0.85 - i * 0.05} />;
      })}
      <AircraftTop id="fb-b52" kind="b52" x={520} y={680} size={500} heading={32} roll={0.85} />
      <Flames t={7} x={430} y={726} s={86} n={6} dir={212} />
      <Flames t={13} x={494} y={624} s={56} n={4} seed={3} dir={212} />
      <Ball id="fb-vn" x={830} y={1125} r={200} flag="VNM" eyes="determined" look={-0.8} tilt={-6} hat={<MuCoi />} />
      <g transform="translate(48 1236)">
        <rect width={520} height={70} rx={35} fill="#15181F" fillOpacity={0.88} stroke="#E2B95A" strokeWidth={4} />
        <text x={260} y={47} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#F2F2F2">12 NGÀY ĐÊM · 12.1972</text>
      </g>
      <HookText lines={['ĐIỆN BIÊN PHỦ', 'TRÊN KHÔNG']} x={64} y={170} size={112} />
    </svg>
  </AbsoluteFill>
);
