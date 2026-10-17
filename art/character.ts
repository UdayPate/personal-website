/**
 * Pixel-art source for the Udayverse character: one text grid per body part,
 * one character per pixel. Edit a letter, run `npm run sprites`, done.
 *
 * Canvas: 32 x 40 pixels per frame. Three-quarter view, facing right.
 * Rows below are `[startColumn, "pixels"]`; `.` is transparent.
 *
 *   H hair   h hair highlight   E eye (blinks to skin shadow)
 *   S skin   s skin shadow      T stubble   B beard   L lips
 *   G glasses frame
 *   U sweatshirt   u sweatshirt shadow   W chest mark
 *   P pants  p pants shadow     K shoe   k shoe highlight
 *   Q laptop silver  q laptop edge  D laptop body  Y laptop sticker
 *   O outline (added automatically, colour differs per stage)
 */
export const PALETTE: Record<string, string> = {
  H: "#1e1a18",
  h: "#3a302a",
  E: "#1e1a18",
  S: "#a8724f",
  s: "#8a5a3c",
  T: "#6b4a36",
  B: "#2a211c",
  L: "#8c4a42",
  G: "#c9c4b8",
  U: "#1f4fb5",
  u: "#173c8a",
  W: "#f0f0f0",
  P: "#2a2f45",
  p: "#1f2335",
  K: "#151515",
  k: "#2e2e36",
  Q: "#aeb6c8",
  q: "#6f788c",
  D: "#2b2f3a",
  Y: "#ff8c00",
};

export type Rows = [number, string][];

/**
 * Head, 22 rows, top at canvas row 2. The quiff peaks up and to the right;
 * the `h` highlight bands run diagonally along the sweep. Cheeks and jaw are
 * stubble (`T`) with skin showing through; dark beard (`B`) is only the
 * mustache, chin and jawline edge.
 */
export const HEAD: Rows = [
  [22, "HhH"],
  [19, "HHhhHHHhH"],
  [16, "HHHhhHhHHHHH"],
  [14, "HHhhhHHHHhHHHHH"],
  [12, "HHHhhhHHHHhhHHHHH"],
  [10, "HHHhhHHHhHHHhhhHHH"],
  [10, "HHHHhhHHHHHhhHHHH"],
  [10, "HHHHHHHHHHHHHHHH"],
  [10, "HHHHSSSSSSSSSSSSs"], // hairline: short sides, forehead open
  [11, "HSSSHHHHSSSHHHSs"], // brows
  [11, "sSSSGGGGSSSGGGSs"], // glasses: top of lenses
  [11, "sGGGSWESGGGWESGs"], // eyes, upper row: white highlight + dark pupil
  [11, "sGGGSSESGGGSESGs"], // eyes, lower row (pupil is 2 tall)
  [11, "sSSSGGGGSSSGGGSs"], // glasses: bottom of lenses
  [11, "BTSSSSSSSSSSSSSsS"],
  [11, "BTTSSSSSSSSSSSSSs"], // nose tip at the right edge
  [11, "BTTSTSSSBBBBBBBB"], // mustache
  [11, "BTTSTTSTTSLLSBB"], // lips under the mustache
  [12, "BTTSTTBBBBBBBB"], // chin
  [13, "BTTTBBBBBBBB"],
  [14, "BBBBBBBBBB"], // jawline edge
  [15, "sssssss"], // neck
];
export const HEAD_TOP = 2;

/** Sweatshirt, 9 rows, top at canvas row 24. */
export const TORSO: Rows = [
  [9, "uUUUUuuuuuuuuuUUUu"], // crewneck collar
  [8, "uUUUUUUUUUUUUUUUUUUu"],
  [8, "UUUUUUUUUUUUUUUUUUuu"],
  [8, "UUUUUUUUUUUWWUUUUUuu"], // tiny white chest mark
  [8, "UUUUUUUUUUUWUUUUUUuu"],
  [8, "UUUUUUUUUUUUUUUUUUuu"],
  [8, "UUUUUUUUUUUUUUUUUUuu"],
  [9, "uuuuuuuuuuuuuuuuuu"], // ribbed hem
  [9, "uUuUuUuUuUuUuUuUuU"],
];
export const TORSO_TOP = 24;

/**
 * Closed laptop in stage 4: a wide, thin, flat slab (16 x 4) pressed against the
 * hip by the near arm, one end sticking out behind the back. Small orange
 * sticker on the lid. Placed from canvas row 31.
 */
export const LAPTOP: Rows = [
  [3, "qQQQQQQQQQQQQQQq"],
  [3, "qDDDDDDDDDDYYDDq"],
  [3, "qDDDDDDDDDDDDDDq"],
  [3, "qqqqqqqqqqqqqqqq"],
];
export const LAPTOP_TOP = 31;

/**
 * Stage 2 (8-bit) is drawn at HALF resolution: every pixel here becomes 2x2 on
 * the 32x40 canvas. Canvas is 16 x 20. Glasses are two small frames with a dark
 * pupil each and a one-pixel bridge.
 */
export const HEAD8: Rows = [
  [10, "HhH"],
  [8, "HhhHHH"],
  [5, "HHhhHHHHH"],
  [5, "HHHHHHHH"],
  [6, "HSSSSSSSS"], // hairline, short sides
  [6, "SSHHSHHSs"], // brows
  [6, "SSGGGGGSs"], // glasses: two small frames joined by a 1-pixel bridge
  [6, "SSGESGESs"], // glasses: dark pupil inside each frame
  [5, "BTSTSBBBBB"], // stubble + mustache
  [6, "BTTBLLBBB"], // closed mouth: short lip line framed by beard
  [7, "BBBBBB"], // chin
];
export const HEAD8_TOP = 1;
export const TORSO8: Rows = [
  [4, "UUUUUUUUUU"],
  [3, "UUUUUUUWUUUU"], // chest mark
  [3, "UUUUUUUUUUUU"],
  [4, "UUUUUUUUUU"],
];
export const TORSO8_TOP = 12;
