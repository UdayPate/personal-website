// Builds the PNGs for the branching-pipeline art (junction, rails, signpost, track props).
// Run with the rest of the art:  npm run sprites     Review image: art/preview/review.png
import { mkdirSync, writeFileSync } from "node:fs";
import { composite, png, renderGrid } from "./lib/pixel.mjs";
import { trackPalette, lights, panel, lever, dust, rails, merge, carriage, post, boards, RAILS_W, RAILS_H, RAIL_Y, GUIDE_X } from "../art/junction.ts";
import { educationProps, officeProps } from "../art/themes.ts";

const OUT = new URL("../public/sprites/", import.meta.url);
const PREVIEW = new URL("../art/preview/", import.meta.url);
mkdirSync(OUT, { recursive: true });
mkdirSync(PREVIEW, { recursive: true });

// every grid must be rectangular
const check = (name, g) => g.forEach((r, i) => { if (r.length !== g[0].length) throw new Error(`${name}: row ${i} is ${r.length} wide, expected ${g[0].length}`); });
const all = { panel, rails, merge, carriage, post, boards_cyan: boards.cyan, boards_green: boards.green };
for (const [k, v] of Object.entries(all)) check(k, v);
Object.entries(lights).forEach(([k, v]) => check("light " + k, v));
lever.forEach((g, i) => check("lever " + i, g));
dust.forEach((g, i) => check("dust " + i, g));
Object.entries(educationProps).forEach(([k, v]) => { check("edu " + k, v); if (v.length !== 16 || v[0].length !== 16) throw new Error(`edu ${k} must be 16x16`); });
Object.entries(officeProps).forEach(([k, v]) => { check("office " + k, v); if (v.length !== 16 || v[0].length !== 16) throw new Error(`office ${k} must be 16x16`); });

const img = (g, scale = 1) => renderGrid(g, trackPalette, scale);
/** Put several equally sized grids side by side in one sheet. */
function sheet(grids) {
  const imgs = grids.map((g) => img(g));
  const w = imgs.reduce((a, i) => a + i.w, 0), h = imgs[0].h;
  const buf = Buffer.alloc(w * h * 4);
  let x0 = 0;
  for (const i of imgs) {
    for (let y = 0; y < i.h; y++) i.buf.copy(buf, (y * w + x0) * 4, y * i.w * 4, (y + 1) * i.w * 4);
    x0 += i.w;
  }
  return png(w, h, buf);
}
const write = (name, grids) => writeFileSync(new URL(name, OUT), sheet(Array.isArray(grids[0]) ? grids : [grids]));

// ---------- sheets used by the site ----------
write("lights.png", [lights.red, lights.yellow, lights.green]); // 3 x 8x8
write("panel.png", panel); // 24x24, border-image slice 8
write("lever.png", lever); // 7 x 24x24
write("dust.png", dust); // 4 x 12x12
write("rails.png", rails); // 192x80
write("merge.png", merge);
write("carriage.png", carriage); // 14x12
write("post.png", post); // 16x72
write("board-cyan.png", boards.cyan); // 36x16, slice 0 10 0 6
write("board-green.png", boards.green);
write("props-edu.png", [educationProps.diploma, educationProps.certificate, educationProps.trophy, educationProps.loading, educationProps.done]);
write("props-office.png", [officeProps.desk, officeProps.cabinet, officeProps.whiteboard]);

// ---------- review image ----------
/** Stretch a bordered frame (8px border) to w x h, like CSS border-image does. */
function nineSlice(frame, w, h, fill = "k") {
  const N = frame.length, B = 8;
  const out = [];
  for (let y = 0; y < h; y++) {
    let row = "";
    for (let x = 0; x < w; x++) {
      const sx = x < B ? x : x >= w - B ? N - (w - x) : B + ((x - B) % (N - 2 * B));
      const sy = y < B ? y : y >= h - B ? N - (h - y) : B + ((y - B) % (N - 2 * B));
      const c = frame[sy][sx];
      row += c === "." ? fill : c;
    }
    out.push(row);
  }
  return out;
}
/** Draw `src` onto `dst` (both letter grids) at (x0, y0). */
function blit(dst, src, x0, y0) {
  src.forEach((r, y) => [...r].forEach((c, x) => { if (c !== "." && dst[y0 + y]) dst[y0 + y] = dst[y0 + y].slice(0, x0 + x) + c + dst[y0 + y].slice(x0 + x + 1); }));
}
const items = [];
const place = (grid, x0, y0, scale) => items.push({ img: img(grid, scale), x0, y0 });

// control box: panel with three mock buttons (cyan bars; the real ones are HTML), lights and the lever
{
  const W = 150, H = 86;
  const box = nineSlice(panel, W, H);
  // a heading bar stands in for the "CHOOSE YOUR TRACK" text
  const g = box.slice();
  const bar = (x, y, w, h, c) => blit(g, Array.from({ length: h }, () => c.repeat(w)), x, y);
  bar(14, 12, 62, 4, "o");
  const states = ["red", "yellow", "green"]; // one light per button: shows all three colours
  [0, 1, 2].forEach((i) => {
    const y = 24 + i * 18;
    const selected = i === 2; // the green one: a thick white + green border as well as the white-ringed light
    bar(14, y, 74, 14, selected ? "w" : "c");
    bar(selected ? 15 : 15, y + 1, 72, 12, selected ? "g" : "k");
    bar(17, y + 3, 68, 8, "k");
    blit(g, lights[states[i]], 20, y + 3); // 8x8 light
    bar(32, y + 6, 40 + i * 6, 2, selected ? "g" : "c"); // label stand-in
  });
  // the lever is shown twice as big as its sprite (the pose frames themselves stay 24x24)
  const big = lever[3].flatMap((r) => { const d = [...r].map((c) => c + c).join(""); return [d, d]; });
  blit(g, big, 90, 22); // centre position
  place(g, 20, 20, 3);
}
// lever: all three positions + the overshoot frames (3-frame snaps: start -> overshoot -> end)
// pose order: overshoot-L, LEFT, centre (from L), CENTRE, centre (from R), RIGHT, overshoot-R
lever.forEach((g, i) => place(g, 520 + i * 80, 20, 3));
// dust puff frames and the three lights (6x), lever snap strip uses the same sprites
dust.forEach((g, i) => place(g, 520 + i * 60, 110, 4));
Object.values(lights).forEach((g, i) => place(g, 780 + i * 60, 110, 6));
// split rails with the carriage at the three rail positions, then the merge
const RS = 2;
[0, 1, 2].forEach((i) => {
  const g = rails.slice();
  const c = carriage;
  const cy = RAIL_Y[i] - 6;
  const withC = g.slice();
  blit(withC, c, GUIDE_X - 6, Math.max(0, Math.min(RAILS_H - 12, cy)));
  place(withC, 20 + i * (RAILS_W * RS + 24), 292, RS);
});
place(merge, 20, 292 + RAILS_H * RS + 20, RS);
// signpost: post + boards (cyan = another track, green = FINISH); each board carries a light (yellow = not visited, green = visited)
{
  const x0 = 20 + RAILS_W * RS + 60;
  const y0 = 292 + RAILS_H * RS + 20;
  place(post, x0, y0, 3);
  [boards.cyan, boards.cyan, boards.green].forEach((b, i) => {
    const bx = x0 + 36, by = y0 + 10 + i * 60;
    place(b, bx, by, 3);
    place(i === 1 ? lights.green : lights.yellow, bx + 6, by + 12, 3);
  });
}
// Education props (diploma, certificate, trophy, loading, done) and Experience props (desk, cabinet, whiteboard), 6x
const propsY = 292 + RAILS_H * RS + 20 + RAILS_H * RS + 40;
Object.values(educationProps).forEach((g, i) => place(g, 20 + i * 112, propsY, 6));
Object.values(officeProps).forEach((g, i) => place(g, 20 + (5 + i) * 112 + 24, propsY, 6));
// HUD lights: the tiny 1x version and a 2x version, in a SWITCH TRACK-like row
{
  const y = propsY + 16 * 6 + 30;
  Object.values(lights).forEach((g, i) => { place(g, 20 + i * 14, y, 1); place(g, 90 + i * 28, y - 4, 2); });
  place(lights.green, 220, y, 1); place(lights.red, 234, y, 1); place(lights.red, 248, y, 1);
}
const width = 1280, height = propsY + 16 * 6 + 80;
writeFileSync(new URL("review.png", PREVIEW), composite(items, width, height));
console.log("track art written to public/sprites and art/preview/review.png");
