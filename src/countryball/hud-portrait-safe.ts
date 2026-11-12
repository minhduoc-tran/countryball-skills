import { useVideoConfig } from 'remotion';

// TikTok SAFE ZONE + default HUD positions for the 1080x1920 portrait frame (BienGioiTayNam and later vertical episodes).
// TikTok draws over the video: the status / "Following | For You" bar at the top, the caption + music ticker + account name at the
// bottom, and the like / comment / share / profile buttons on the right. Keep every text, number and face out of those strips.
//
//   y 0..160          TOP bar           no text (map / sky only)
//   y 1500..1920      BOTTOM caption     no text (map / ground only)
//   x 960..1080, y 700..1500  RIGHT buttons  no text, no faces
//   safe text box     x 48..1032 (48..948 between y 700 and 1500), y 176..1484
//
// HUD pieces (DateChip, ClockChip, NightChip, Counter, MiniMap, LowerThird, SourceLine) switch to PORTRAIT_HUD positions by themselves when
// the composition is taller than wide (useVideoConfig), or when given `portrait` explicitly; 16:9 compositions are unchanged.
// PhotoCard never moves by itself (x/y are required): use PORTRAIT_SLOTS.photo and pass captionSize / creditSize for phones.

export const PORTRAIT_SAFE = {
  W: 1080, H: 1920,
  /** status / tabs bar: keep y >= top */
  top: 160,
  /** caption + music bar starts here: keep text above */
  bottom: 1500,
  /** action-button column: no text in x >= right.x0 while right.y0 <= y <= right.y1 */
  right: { x0: 960, y0: 700, y1: 1500 },
  /** side margins of the text box */
  left: 48, rightEdge: 1032,
  /** widest text line that never meets the button column (x 48..948) */
  maxTextW: 900,
} as const;

/** Default HUD anchors in portrait (screen px). */
export const PORTRAIT_HUD = {
  /** DateChip / ClockChip: top-left of the chip */
  date: { x: 48, y: 176 },
  /** NightChip: under the date chip */
  night: { x: 48, y: 290 },
  /** Counter: RIGHT edge + top, on the second row so it never meets a long date chip */
  counter: { right: 1032, y: 290, width: 500 },
  /** MiniMap: top-left of the map box, right column under the counter row (clear of the button column, which starts at y 700) */
  mini: { x: 720, y: 404 },
  /** LowerThird: left + BOTTOM of the bar, max width */
  lowerThird: { x: 48, bottom: 1440, maxW: 900 },
  /** SourceLine: left + baseline, font size */
  source: { x: 48, y: 1484, size: 24 },
} as const;

/** Ready slots for big pictures in portrait (centre x/y + picture w/h; the white print adds ~16 px around and ~92 px under). */
export const PORTRAIT_SLOTS = {
  /** one photo in the upper-middle of the frame (map visible below) */
  photo: { x: 510, y: 760, w: 840, h: 560 },
  /** a tall photo (portrait archive picture) */
  photoTall: { x: 520, y: 820, w: 720, h: 900 },
  /** caption sizes that read on a phone */
  captionSize: 40, creditSize: 24,
  /** where a speaking ball sits: lower-left, above the caption bar (its shadow may run into the bar, the face must not) */
  ball: { x: 300, y: 1250 },
} as const;

/** true when the HUD should use the portrait layout: explicit override, else the composition is taller than wide. */
export const usePortraitHud = (portrait?: boolean): boolean => {
  const { width, height } = useVideoConfig();
  return portrait ?? height > width;
};
