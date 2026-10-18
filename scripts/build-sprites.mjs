// Builds PNG sprite sheets from the pixel grids in art/.   Run: npm run sprites
//
// Sheet layout (every stage): 4 columns x 3 rows of 32x40 frames
//   row 0 = walk, row 1 = idle (stand, bounce, stand, blink), row 2 = celebrate
//   (stages 1-3 repeat idle in row 2 so the CSS is the same for every stage).
//
// Stages 2 (half-res), 3 and the laptop are drawn by hand in art/character.ts.
// Stage 1 (glitch blob) is derived from stage 3 below; tweak toBlob() to change it.
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { hudIcons, sourceIcons, heroIcons } from "../art/icons.ts";
import { props, propPalette } from "../art/props.ts";
import { PALETTE, HEAD, HEAD_TOP, TORSO, TORSO_TOP, LAPTOP, LAPTOP_TOP, LAPTOP_TUCK, LAPTOP_TUCK_TOP, HEAD8, HEAD8_TOP, TORSO8, TORSO8_TOP } from "../art/character.ts";

let W = 32;
const H = 40;
const OUT = new URL("../public/sprites/", import.meta.url);
const PREVIEW = new URL("../art/preview/", import.meta.url);
mkdirSync(OUT, { recursive: true });
mkdirSync(PREVIEW, { recursive: true });

// ---------- tiny PNG encoder (RGBA, no dependencies) ----------
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

// ---------- grid helpers ----------
const blank = () => Array.from({ length: H }, () => Array(W).fill("."));
const stamp = (cv, rows, top, dy = 0, map = (c) => c) => {
  rows.forEach(([col, str], i) => {
    for (let k = 0; k < str.length; k++) {
      if (str[k] === ".") continue;
      const y = top + i + dy;
      const x = col + k;
      if (y >= 0 && y < H && x >= 0 && x < W) cv[y][x] = map(str[k]);
    }
  });
};
const put = (cv, x, y, c) => {
  if (x >= 0 && x < W && y >= 0 && y < H) cv[y][x] = c;
};

// ---------- stage 3: compose a frame from the hand-drawn parts ----------
function leg(cv, xLeft, dx) {
  for (let r = 33; r <= 37; r++) {
    const off = Math.round((dx * (r - 33)) / 4);
    for (let k = 0; k < 4; k++) put(cv, xLeft + off + k, r, k === 3 ? "p" : "P");
  }
  for (let k = 0; k < 6; k++) {
    put(cv, xLeft + dx + k, 38, k === 0 ? "k" : "K");
    put(cv, xLeft + dx + k, 39, "K");
  }
}
function sleeve(cv, x, y0, y1, w, shadowOnly) {
  for (let r = y0; r <= y1; r++)
    for (let k = 0; k < w; k++) put(cv, x + k, r, shadowOnly || k === w - 1 ? "u" : "U");
}
function frame3({ legs = [0, 0], bob = 0, blink = false, nearArm = 0, farArm = 0, farRaised = false, wave = null, laptop = false, tuck = false }) {
  const cv = blank();
  leg(cv, 13, legs[0]);
  leg(cv, 17, legs[1]);
  if (farRaised) {
    // celebration: far arm punches the air behind the head, near arm keeps hold of the laptop
    sleeve(cv, 28, 17 + bob, 27 + bob, 3, true);
    for (let r = 13; r <= 16; r++) for (let k = 0; k < 4; k++) put(cv, 28 + k, r + bob, k === 3 ? "s" : "S");
  } else if (wave !== null) {
    // wave (canvas is 40 wide): arm leaves the shoulder sideways, elbow up, forearm leans out and back (wave = -2..2)
    for (let r = 26; r <= 28; r++) for (let k = 27; k <= 34; k++) put(cv, k, r + bob, r === 28 ? "u" : "U");
    sleeve(cv, 32, 17 + bob, 25, 3, true);
    for (let r = 6; r <= 16; r++) {
      const t = Math.round((wave * (16 - r)) / 10);
      for (let k = 0; k < 3; k++) put(cv, 32 + t + k, r + bob, k === 2 ? "u" : "U");
    }
    const c = 33 + wave; // hand centre: open palm, 3 fingers + thumb, well above head height
    for (let r = 3; r <= 5; r++) for (let k = -2; k <= 2; k++) put(cv, c + k, r + bob, k === 2 ? "s" : "S");
    put(cv, c + 3, 5 + bob, "S");
    for (const k of [-2, 0, 2]) { put(cv, c + k, 1 + bob, "S"); put(cv, c + k, 2 + bob, "S"); }
  } else {
    // far arm sits behind the torso and peeks out when swung forward
    sleeve(cv, 24 + farArm, 26 + bob, 31 + bob, 4, true);
    for (let k = 0; k < 3; k++) {
      put(cv, 25 + farArm + k, 32 + bob, "s");
      put(cv, 25 + farArm + k, 33 + bob, "s");
    }
  }
  stamp(cv, TORSO, TORSO_TOP, bob);
  stamp(cv, HEAD, HEAD_TOP, bob, (c) => (blink && (c === "E" || c === "W") ? "s" : c));
  if (laptop) {
    if (tuck) stamp(cv, LAPTOP_TUCK, LAPTOP_TUCK_TOP, bob);
    else stamp(cv, LAPTOP, LAPTOP_TOP, bob);
    sleeve(cv, 8, 26 + bob, 30 + bob, 4, false); // near arm clamps it against the hip
    for (let k = 0; k < 3; k++) put(cv, 8 + k, 31 + bob, k === 2 ? "s" : "S");
    for (let k = 0; k < 2; k++) put(cv, 8 + k, 32 + bob, "s");
  } else {
    sleeve(cv, 8 + nearArm, 26 + bob, 31 + bob, 4, false);
    for (let k = 0; k < 3; k++) put(cv, 8 + nearArm + k, 32 + bob, k === 2 ? "s" : "S");
    for (let k = 0; k < 2; k++) put(cv, 8 + nearArm + k, 33 + bob, "s");
  }
  return cv;
}

const WALK = [
  { legs: [-3, 3], nearArm: -3, farArm: 3, bob: 0 },
  { legs: [0, 0], nearArm: 0, farArm: 0, bob: -1 },
  { legs: [3, -3], nearArm: 3, farArm: -3, bob: 0 },
  { legs: [0, 0], nearArm: 0, farArm: 0, bob: -1 },
];
const IDLE = [{ bob: 0 }, { bob: -1 }, { bob: 0 }, { bob: 0, blink: true }];
const CELEBRATE = [
  { bob: -1, farRaised: true, legs: [-1, 1] },
  { bob: -2, farRaised: true, legs: [-2, 2] },
  { bob: -2, farRaised: true, legs: [-2, 2] },
  { bob: -1, farRaised: true, legs: [-1, 1] },
];
const WAVE = [-3, 0, 3, 0].map((wave, i) => ({ wave, bob: i === 1 || i === 3 ? -1 : 0 }));
const withHold = (list) => list.map((p) => ({ ...p, nearArm: 0, laptop: true, tuck: true }));

// ---------- stage 2: hand-drawn at half resolution, then doubled ----------
function frame2({ legs = [0, 0], bob = 0, blink = false, nearArm = 0, farArm = 0 }) {
  const h = Array.from({ length: H / 2 }, () => Array(W / 2).fill("."));
  const p2 = (x, y, c) => { if (x >= 0 && x < W / 2 && y >= 0 && y < H / 2) h[y][x] = c; };
  const leg2 = (xLeft, dx) => {
    for (let r = 16; r <= 18; r++) for (let k = 0; k < 2; k++) p2(xLeft + dx + k, r, "P");
    for (let k = 0; k < 3; k++) p2(xLeft + dx + k, 19, "K");
  };
  leg2(6, legs[0]);
  leg2(9, legs[1]);
  for (let r = 13; r <= 15; r++) for (let k = 0; k < 2; k++) p2(13 + farArm + k, r + bob, "u");
  p2(13 + farArm, 16 + bob, "S");
  TORSO8.forEach(([col, str], i) => [...str].forEach((c, k) => p2(col + k, TORSO8_TOP + i + bob, c)));
  HEAD8.forEach(([col, str], i) => [...str].forEach((c, k) => p2(col + k, HEAD8_TOP + i + bob, blink && c === "E" ? "S" : c)));
  for (let r = 13; r <= 15; r++) for (let k = 0; k < 2; k++) p2(2 + nearArm + k, r + bob, "u");
  p2(2 + nearArm, 16 + bob, "S");
  p2(3 + nearArm, 16 + bob, "S");
  const cv = blank();
  for (let y = 0; y < H / 2; y++) for (let x = 0; x < W / 2; x++) if (h[y][x] !== ".") for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) cv[2 * y + dy][2 * x + dx] = h[y][x];
  return cv;
}
const WALK8 = [
  { legs: [-1, 1], nearArm: -1, farArm: 1, bob: 0 },
  { legs: [0, 0], nearArm: 0, farArm: 0, bob: -1 },
  { legs: [1, -1], nearArm: 1, farArm: -1, bob: 0 },
  { legs: [0, 0], nearArm: 0, farArm: 0, bob: -1 },
];
const IDLE8 = [{ bob: 0 }, { bob: -1 }, { bob: 0 }, { bob: 0, blink: true }];

// ---------- derivations ----------
const rng = (seed) => {
  let s = seed >>> 0 || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
};
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

/** Stage 1: hair stays as a solid black silhouette; the rest is a coarse, dithered, glitchy 1-bit blob. */
function toBlob(cv0, seed) {
  const rand = rng(seed);
  // Only the quiff stays solid: the lower hair band (rows 8+) dissolves into the dithered head.
  const cv = cv0.map((row, y) => row.map((c) => (y >= 8 && (c === "H" || c === "h") ? "T" : c)));
  const out = blank();
  const isHair = (c) => c === "H" || c === "h";
  const tone = { T: 0.42, L: 0.4, S: 0.5, s: 0.42, B: 0.32, G: 0.7, E: 0.2, U: 0.42, u: 0.34, W: 0.9, P: 0.28, p: 0.22, K: 0.2, k: 0.25, Q: 0.6, q: 0.5, D: 0.3, Y: 0.8 };
  for (let by = 0; by < H / 4; by++)
    for (let bx = 0; bx < W / 4; bx++) {
      const block = [];
      for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) block.push(cv[4 * by + y][4 * bx + x]);
      const body = block.filter((c) => c !== "." && !isHair(c));
      if (body.length < 6) continue;
      // head area is darker so hair and head read as one swept mass, not a cap on a pale face
      const avg = (body.reduce((a, c) => a + (tone[c] ?? 0.5), 0) / body.length) * (by < 6 ? 0.55 : 1);
      for (let y = 0; y < 4; y++)
        for (let x = 0; x < 4; x++) {
          const edge = x === 0 || y === 0 || x === 3 || y === 3;
          if (edge && rand() < 0.18) continue; // ragged edges
          out[4 * by + y][4 * bx + x] = avg + 0.08 > BAYER[y][x] / 16 ? "1" : "0";
        }
    }
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isHair(cv[y][x])) out[y][x] = cv[y][x] === "h" ? "1" : "0"; // black hair, white highlight strands
  // glitch: shift a few rows sideways, flip a few pixels
  for (let n = 0; n < 4; n++) {
    const y = 4 + Math.floor(rand() * (H - 8));
    const dx = (rand() < 0.5 ? -1 : 1) * (2 + Math.floor(rand() * 3));
    const row = out[y].slice();
    for (let x = 0; x < W; x++) out[y][x] = row[(x - dx + W) % W] ?? ".";
  }
  for (let n = 0; n < 8; n++) {
    const x = Math.floor(rand() * W);
    const y = Math.floor(rand() * H);
    if (out[y][x] === "1") out[y][x] = "0";
    else if (out[y][x] === "0") out[y][x] = "1";
  }
  return out;
}

function outline(cv, ch) {
  const out = cv.map((r) => r.slice());
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (cv[y][x] !== ".") continue;
      const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (cv[y + dy]?.[x + dx] ?? ".") !== ".");
      if (near) out[y][x] = ch;
    }
  return out;
}

// ---------- build the four stages ----------
const base = { walk: WALK.map(frame3), idle: IDLE.map(frame3), celebrate: CELEBRATE.map(frame3) };
const holding = {
  walk: withHold(WALK).map(frame3),
  idle: withHold(IDLE).map(frame3),
  celebrate: CELEBRATE.map((p) => frame3({ ...p, laptop: true, tuck: true })),
};

const STAGES = [
  { name: "stage-1", frames: (a) => base[a].map((f, i) => toBlob(f, 7 + i * 13 + (a === "idle" ? 100 : 0))), palette: { "0": "#000000", "1": "#f4f4f4" }, outline: "#f4f4f4" },
  { name: "stage-2", frames: (a) => (a === "walk" ? WALK8 : IDLE8).map(frame2), palette: PALETTE, outline: "#6c7396" },
  { name: "stage-3", frames: (a) => base[a], palette: PALETTE, outline: "#6c7396" },
  { name: "stage-4", frames: (a) => holding[a], palette: PALETTE, outline: "#8f98bd" },
];

function render(frames, palette, outlineColor, scale = 1) {
  const cols = frames[0].length;
  const rows = frames.length;
  const w = cols * W * scale;
  const h = rows * H * scale;
  const buf = Buffer.alloc(w * h * 4);
  frames.forEach((row, ry) =>
    row.forEach((cv0, cx) => {
      const cv = outline(cv0, "O");
      for (let y = 0; y < H; y++)
        for (let x = 0; x < W; x++) {
          const c = cv[y][x];
          if (c === ".") continue;
          const [r, g, b] = hex(c === "O" ? outlineColor : palette[c]);
          for (let sy = 0; sy < scale; sy++)
            for (let sx = 0; sx < scale; sx++) {
              const o = ((ry * H + y) * scale + sy) * w * 4 + ((cx * W + x) * scale + sx) * 4;
              buf[o] = r; buf[o + 1] = g; buf[o + 2] = b; buf[o + 3] = 255;
            }
        }
    }),
  );
  return { w, h, buf };
}

const sheets = STAGES.map((s) => {
  const walk = s.frames("walk");
  const idle = s.frames("idle");
  const cel = s.name === "stage-4" ? s.frames("celebrate") : idle;
  const { w, h, buf } = render([walk, idle, cel], s.palette, s.outline);
  writeFileSync(new URL(`${s.name}.png`, OUT), png(w, h, buf));
  return { s, walk, idle, cel };
});

// ---------- preview images (dark page background, scaled up) ----------
function composite(items, width, height, bg = "#0a0a0f") {
  const buf = Buffer.alloc(width * height * 4);
  const [br, bgc, bb] = hex(bg);
  for (let i = 0; i < width * height; i++) { buf[i * 4] = br; buf[i * 4 + 1] = bgc; buf[i * 4 + 2] = bb; buf[i * 4 + 3] = 255; }
  for (const { img, x0, y0 } of items)
    for (let y = 0; y < img.h; y++)
      for (let x = 0; x < img.w; x++) {
        const o = (y * img.w + x) * 4;
        if (!img.buf[o + 3]) continue;
        const d = ((y0 + y) * width + x0 + x) * 4;
        buf[d] = img.buf[o]; buf[d + 1] = img.buf[o + 1]; buf[d + 2] = img.buf[o + 2];
      }
  return png(width, height, buf);
}
{ // four stages side by side (idle frame, 6x) + a walk strip underneath (2x)
  const items = [];
  const gap = 28;
  const pitch = W * 8 + gap;
  sheets.forEach(({ s, idle, walk }, i) => {
    items.push({ img: render([[idle[0]]], s.palette, s.outline, 6), x0: gap + i * pitch + 32, y0: gap });
    items.push({ img: render([walk], s.palette, s.outline, 2), x0: gap + i * pitch, y0: gap * 2 + H * 6 });
  });
  const width = gap + 4 * pitch;
  const height = gap * 3 + H * 6 + H * 2;
  writeFileSync(new URL("preview-stages.png", PREVIEW), composite(items, width, height));
}
{ // full sheets 2x2
  const items = [];
  sheets.forEach(({ s, walk, idle, cel }, i) => {
    items.push({ img: render([walk, idle, cel], s.palette, s.outline, 3), x0: 20 + (i % 2) * (4 * W * 3 + 20), y0: 20 + Math.floor(i / 2) * (3 * H * 3 + 20) });
  });
  writeFileSync(new URL("preview-sheets.png", PREVIEW), composite(items, 20 + 2 * (4 * W * 3 + 20), 20 + 2 * (3 * H * 3 + 20)));
}

// ---------- source icons (intro) + laptop prop (Serve station) ----------
function renderGrid(rows, palette, scale = 1, outlineColor = null) {
  const grid = rows.map((r) => [...r]);
  const pad = outlineColor ? 1 : 0;
  const h = grid.length + pad * 2;
  const w = grid[0].length + pad * 2;
  const cv = Array.from({ length: h }, () => Array(w).fill("."));
  grid.forEach((row, y) => row.forEach((c, x) => (cv[y + pad][x + pad] = c)));
  if (outlineColor)
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        if (cv[y][x] !== ".") continue;
        const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (grid[y - pad + dy]?.[x - pad + dx] ?? ".") !== ".");
        if (near) cv[y][x] = "#";
      }
  const buf = Buffer.alloc(w * scale * h * scale * 4);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const c = cv[y][x];
      if (c === ".") continue;
      const [r, g, b] = hex(c === "#" ? outlineColor : palette[c]);
      for (let sy = 0; sy < scale; sy++)
        for (let sx = 0; sx < scale; sx++) {
          const o = ((y * scale + sy) * w * scale + x * scale + sx) * 4;
          buf[o] = r; buf[o + 1] = g; buf[o + 2] = b; buf[o + 3] = 255;
        }
    }
  return { w: w * scale, h: h * scale, buf };
}
{
  const icons = Object.values(sourceIcons.icons);
  const imgs = icons.map((rows) => renderGrid(rows, sourceIcons.palette));
  const w = imgs.reduce((a, i) => a + i.w, 0);
  const buf = Buffer.alloc(w * 16 * 4);
  let x0 = 0;
  for (const img of imgs) {
    for (let y = 0; y < img.h; y++) img.buf.copy(buf, (y * w + x0) * 4, y * img.w * 4, (y + 1) * img.w * 4);
    x0 += img.w;
  }

  const laptop = renderGrid(LAPTOP.map(([, str]) => str), PALETTE, 1, "#8f98bd");
  writeFileSync(new URL("laptop.png", OUT), png(laptop.w, laptop.h, laptop.buf));

  // icon preview: 3 source icons at 6x, 5 HUD icons at 6x in cyan
  const items = [];
  imgs.forEach((_, i) => items.push({ img: renderGrid(icons[i], sourceIcons.palette, 6), x0: 20 + i * 120, y0: 20 }));
  Object.values(hudIcons).forEach((rows, i) =>
    items.push({ img: renderGrid(rows.map((r) => r.replace(/X/g, "c").replace(/\./g, ".")), { c: "#00bfff" }, 6), x0: 20 + i * 90, y0: 140 }),
  );
  items.push({ img: renderGrid(LAPTOP.map(([, str]) => str), PALETTE, 6, "#8f98bd"), x0: 20 + 4 * 90 + 120, y0: 20 });
  writeFileSync(new URL("preview-icons.png", PREVIEW), composite(items, 560, 240));
}
{ // wave sheet (About section): 40x40 frames, row 0 = wave, row 1 = idle with the tucked laptop
  const oldW = W;
  W = 40;
  const wave = WAVE.map((p) => frame3({ ...p, nearArm: 0, laptop: true, tuck: true }));
  const idle = IDLE.map((p) => frame3({ ...p, nearArm: 0, laptop: true, tuck: true }));
  const { w, h, buf } = render([wave, idle], PALETTE, "#8f98bd");
  W = oldW;
  writeFileSync(new URL("wave.png", OUT), png(w, h, buf));
  // station props: 5 across, 16x16 each (hopper, gears, database, dashboard, terminal)
  const pr = Object.values(props).map((rows) => renderGrid(rows, propPalette));
  const pb = Buffer.alloc(16 * pr.length * 16 * 4);
  pr.forEach((img, i) => { for (let y = 0; y < 16; y++) img.buf.copy(pb, (y * 16 * pr.length + i * 16) * 4, y * 16 * 4, (y + 1) * 16 * 4); });
  writeFileSync(new URL("props.png", OUT), png(16 * pr.length, 16, pb));
  // hero icons: 4 across, 16x16 each (grad cap, laptop bulb off, laptop bulb on, cricket)
  const hl = [heroIcons.gradCap, heroIcons.engineerOff, heroIcons.engineerOn, heroIcons.cricket].map((rows) => renderGrid(rows, heroIcons.palette));
  const hb = Buffer.alloc(16 * hl.length * 16 * 4);
  hl.forEach((img, i) => { for (let y = 0; y < 16; y++) img.buf.copy(hb, (y * 16 * hl.length + i * 16) * 4, y * 16 * 4, (y + 1) * 16 * 4); });
  writeFileSync(new URL("hero.png", OUT), png(16 * hl.length, 16, hb));
}
{ // review image: 4 wave frames (laptop under arm), 5 station props, 3 hero icons (+ bulb on/off)
  const items = [];
  const pad = 20;
  W = 40;
  const waveFrames = WAVE.map((p) => frame3({ ...p, nearArm: 0, laptop: true, tuck: true }));
  waveFrames.forEach((f, i) => items.push({ img: render([[f]], PALETTE, "#8f98bd", 5), x0: pad + i * (W * 5 + 12) - (i === 0 ? 0 : 0), y0: pad }));
  const waveW = W;
  W = 32;
  const row2 = pad + H * 5 + 24;
  Object.values(props).forEach((rows, i) => items.push({ img: renderGrid(rows, propPalette, 8), x0: pad + i * 144, y0: row2 }));
  const row3 = row2 + 16 * 8 + 24;
  const hi = heroIcons;
  let hx = pad;
  [hi.gradCap, hi.engineerOff, hi.engineerOn, hi.cricket].forEach((rows) => {
    items.push({ img: renderGrid(rows, hi.palette, 8), x0: hx, y0: row3 });
    hx += rows[0].length * 8 + 24;
  });
  writeFileSync(new URL("review.png", PREVIEW), composite(items, Math.max(pad * 2 + 5 * 144, pad * 2 + 4 * (waveW * 5 + 12)), row3 + 16 * 8 + pad));
}
console.log("sprites written to public/sprites and art/preview");
