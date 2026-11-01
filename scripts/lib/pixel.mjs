// Shared helpers for the pixel-art build scripts: PNG encoding and drawing letter grids.
import { deflateSync } from "node:zlib";

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
export function png(width, height, rgba) {
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
export const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

export function composite(items, width, height, bg = "#0a0a0f") {
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
export function renderGrid(rows, palette, scale = 1, outlineColor = null) {
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
