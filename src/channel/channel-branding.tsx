import React from 'react';
import { Hero, HEAD, basePose, Pose, LOOKS, FONT, KitDefs, SetDefs, Rooftop, Glow, joints, toWorld, LEG_LEN } from '../engine';

// Channel branding for "Bút Chì Man", drawn like a frame from the episodes (the What If look): Pip, the hooded
// stick figure, on the dusk rooftop, rim-lit by the sun, with a pencil, the channel's prop.
//   ChannelAvatar   800x800, everything important inside the centre circle (YouTube crops avatars to a circle)
//   ChannelBanner   2560x1440, name and hero inside the 1546x423 centre safe area (all that phones show)
//   ChannelBadge    small round avatar + "BÚT CHÌ MAN" pill for the corner of video thumbnails
// Render: npx remotion still src/index.ts ChannelAvatar out/channel/avatar-800.png (and ChannelBanner)

const PIP = LOOKS.pipHood;
const ORANGE = '#FF8A3D';

/** A pencil, centred on (x, y), `len` long, rotated `rot` degrees (0 = point to the right). */
export const Pencil: React.FC<{ x: number; y: number; len?: number; rot?: number }> = ({ x, y, len = 300, rot = 0 }) => {
  const w = len * 0.085;
  const h = len / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke="#121019" strokeWidth={len * 0.012} strokeLinejoin="round">
      <rect x={-h} y={-w} width={len * 0.1} height={w * 2} rx={w * 0.5} fill="#F07C8C" />
      <rect x={-h + len * 0.09} y={-w} width={len * 0.07} height={w * 2} fill="#B9B6C4" />
      <rect x={-h + len * 0.16} y={-w} width={len * 0.6} height={w * 2} fill="#F2B705" />
      <rect x={-h + len * 0.16} y={-w * 0.3} width={len * 0.6} height={w * 0.6} fill="#D99B00" stroke="none" />
      <path d={`M ${-h + len * 0.76} ${-w} L ${h} 0 L ${-h + len * 0.76} ${w} Z`} fill="#EBC99A" />
      <path d={`M ${h - len * 0.07} ${-w * 0.3} L ${h} 0 L ${h - len * 0.07} ${w * 0.3} Z`} fill="#2B2B35" />
    </g>
  );
};

/** Pip holding a pencil in the near hand; the pencil is attached to the hand through the rig's joints. */
const PipWithPencil: React.FC<{ pose: Pose; pencil: number; pencilRot: number }> = ({ pose, pencil, pencilRot }) => {
  const hand = toWorld(pose, joints(pose).armR.end);
  const r = (pencilRot * Math.PI) / 180;
  return (
    <g>
      <Hero look={PIP} pose={pose} rimId="rimR" shadow={0} />
      <g filter="url(#rimR)">
        <Pencil x={hand.x + Math.cos(r) * pencil * 0.25} y={hand.y + Math.sin(r) * pencil * 0.25} len={pencil} rot={pencilRot} />
      </g>
    </g>
  );
};

/** The avatar artwork in an 800x800 box: the dusk rooftop behind, Pip head-and-shoulders with his pencil. */
export const AvatarArt: React.FC<{ id?: string }> = ({ id = 'av' }) => {
  const sc = 2.25;
  const pose: Pose = {
    ...basePose, x: 400, y: 420 - HEAD.y * sc, scale: sc, yaw: 0.3, look: 0.25,
    armL: { a: 12, b: 4 }, armR: { a: 48, b: 98 }, expr: 'smug',
  };
  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect x={0} y={0} width={800} height={800} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}clip)`}>
        {/* the rooftop world scaled to fill the square, the low sun right behind his head */}
        <g transform="translate(-560 -230) scale(1.25)">
          <Rooftop t={40} sunX={770} sunY={560} low={80} />
        </g>
        <Glow x={400} y={330} r={420} o={0.35} />
        <PipWithPencil pose={pose} pencil={270} pencilRot={-58} />
      </g>
    </g>
  );
};

export const ChannelAvatar: React.FC = () => (
  <svg viewBox="0 0 800 800" width={800} height={800}>
    <KitDefs />
    <SetDefs />
    <AvatarArt />
  </svg>
);

/**
 * The channel banner, 2560x1440. YouTube shows the whole image on TV, a wide strip on desktop and only the centre
 * 1546x423 on phones (x 507-2053, y 508-931), so the name, the tagline and Pip sit inside that band; the dusk
 * rooftop fills the rest. Pip draws a glowing question mark in the sky with a giant pencil.
 */
type BannerText = { top: string; name: string; tagline: string; titleFont: string; uiFont: string; nameSize?: number; nameWeight?: number; topY?: number };

const BannerArt: React.FC<BannerText> = ({ top, name, tagline, titleFont, uiFont, nameSize = 144, nameWeight = 800, topY = 640 }) => {
  // the rooftop is lifted so its deck (world y 820) lands at banner y ~930, the bottom of the phone-safe band
  const sc = 0.8;
  const feet = 928;
  const pose: Pose = {
    ...basePose, x: 800, y: feet - LEG_LEN * sc, scale: sc, yaw: 0.35, look: 0.7,
    armL: { a: 14, b: 6 }, armR: { a: 128, b: 12 }, expr: 'happy',
  };
  // the question mark he is drawing in the sky, to the upper right of his pencil
  const q = 'M 925 600 Q 925 545 980 545 Q 1035 545 1035 593 Q 1035 628 990 646 Q 968 657 968 688';
  return (
    <svg viewBox="0 0 2560 1440" width={2560} height={1440}>
      <KitDefs />
      <SetDefs />
      <g transform="translate(0 -165) scale(1.3334)">
        <Rooftop t={40} sunX={1220} sunY={600} />
      </g>
      <rect x={0} y={0} width={2560} height={1440} fill="#0B0814" opacity={0.18} />
      <Glow x={960} y={640} r={420} o={0.35} />
      <path d={q} stroke="#FFE2A8" strokeWidth={16} fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 18px rgba(255,200,120,0.9))' }} />
      <circle cx={968} cy={722} r={11} fill="#FFE2A8" style={{ filter: 'drop-shadow(0 0 14px rgba(255,200,120,0.9))' }} />
      <PipWithPencil pose={pose} pencil={190} pencilRot={-58} />
      {/* the name, set like the episodes' title card: a small first line, a big orange second line */}
      <text x={1500} y={topY} textAnchor="middle" fontFamily={titleFont} fontWeight={600} fontSize={56} letterSpacing={6} fill="#F6EFE3" stroke="#1A1230" strokeWidth={9} paintOrder="stroke">{top}</text>
      <text x={1500} y={790} textAnchor="middle" fontFamily={titleFont} fontWeight={nameWeight} fontSize={nameSize} fill={ORANGE} stroke="#1A1230" strokeWidth={14} paintOrder="stroke" style={{ filter: 'drop-shadow(0 0 26px rgba(255,138,61,0.6))' }}>{name}</text>
      <text x={1500} y={880} textAnchor="middle" fontFamily={uiFont} fontSize={36} letterSpacing={4} fill="#F6EFE3" stroke="#1A1230" strokeWidth={6} paintOrder="stroke">{tagline}</text>
    </svg>
  );
};

export const ChannelBanner: React.FC = () => (
  <BannerArt top="SẼ RA SAO NẾU...?" name="BÚT CHÌ MAN" tagline="HOẠT HÌNH GIẢ TƯỞNG · KHOA HỌC THẬT" titleFont={FONT.title} uiFont={FONT.ui} />
);

// The English channel (Pencil Man): same art, English lines in the episodes' title face.
export const ChannelBannerEn: React.FC = () => (
  <BannerArt top="WHAT IF...?" name="PENCIL MAN" tagline="ANIMATED WHAT-IFS · REAL SCIENCE" titleFont={FONT.title} uiFont={FONT.ui} nameSize={156} />
);

/** A corner badge for thumbnails (draw inside the thumbnail's 1920x1080 svg): round avatar + channel name. */
export const ChannelBadge: React.FC<{ x?: number; y?: number; s?: number; name?: string }> = ({ x = 1440, y = 40, s = 1, name = 'BÚT CHÌ MAN' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <clipPath id="badgeCircle">
        <circle cx={400} cy={400} r={400} />
      </clipPath>
    </defs>
    <rect x={90} y={22} width={350} height={92} rx={46} fill="#120C1E" opacity={0.82} />
    <text x={290} y={84} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={ORANGE}>{name}</text>
    <g transform="scale(0.17)">
      <circle cx={400} cy={400} r={420} fill="#120C1E" />
      <g clipPath="url(#badgeCircle)">
        <AvatarArt id="badge" />
      </g>
    </g>
  </g>
);

/**
 * The thumbnail hook: ONE short phrase, huge, yellow on a slanted red band, heavy black outline: the only text on a
 * thumbnail (no subtitles, chips or badges). 1-2 lines of the same phrase, left side; the character fills the right.
 */
export const HookText: React.FC<{ lines: string[]; x?: number; y?: number; size?: number }> = ({ lines, x = 70, y = 330, size = 190 }) => {
  const lh = size * 1.36; // room for Vietnamese marks above and below (Ạ, Ì, Ỹ) without touching the other band
  return (
    <g transform={`rotate(-4 ${x} ${y})`}>
      {lines.map((ln, i) => (
        <rect key={`b${i}`} x={x - 30} y={y + i * lh - size * 0.98} width={ln.length * size * 0.62 + 60} height={size * 1.26} rx={18} fill="#E5143A" stroke="#120C1E" strokeWidth={10} />
      ))}
      {lines.map((ln, i) => (
        <text key={`t${i}`} x={x} y={y + i * lh} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#FFE600" stroke="#120C1E" strokeWidth={size * 0.09} paintOrder="stroke">{ln}</text>
      ))}
    </g>
  );
};
