/**
 * Small pixel icons, same idea as character.ts: one letter per pixel.
 *  - hudIcons: 12 x 12, single colour (X = filled). Drawn as inline SVG that takes
 *    its colour from the text (see components/PixelIcon.tsx).
 *  - sourceIcons: 16 x 16, multi-colour, used by the intro fragments. Exported
 *    to public/sprites/sources.png by `npm run sprites`.
 */
export const hudIcons = {
  resume: [
    "..XXXXXXX...",
    "..X.....XX..",
    "..X.....X.X.",
    "..X.....XXXX",
    "..X........X",
    "..X.XXXX...X",
    "..X........X",
    "..X.XXXX...X",
    "..X........X",
    "..X.XXX....X",
    "..X........X",
    "..XXXXXXXXXX",
  ],
  github: [
    "............",
    "............",
    "...X...XX...",
    "..X....X.X..",
    ".X....X...X.",
    "X.....X....X",
    "X....X.....X",
    ".X...X....X.",
    "..X.X....X..",
    "...XX...X...",
    "............",
    "............",
  ],
  linkedin: [
    "............",
    "....XXXX....",
    "....X..X....",
    ".XXXXXXXXXX.",
    ".X........X.",
    ".X........X.",
    ".XXXX..XXXX.",
    ".X..XXXX..X.",
    ".X........X.",
    ".X........X.",
    ".XXXXXXXXXX.",
    "............",
  ],
  contact: [
    "............",
    "............",
    ".XXXXXXXXXX.",
    ".XX......XX.",
    ".X.X....X.X.",
    ".X..X..X..X.",
    ".X...XX...X.",
    ".X........X.",
    ".X........X.",
    ".XXXXXXXXXX.",
    "............",
    "............",
  ],
  terminal: [
    "............",
    ".XXXXXXXXXX.",
    ".X........X.",
    ".X.X......X.",
    ".X..X.....X.",
    ".X...X....X.",
    ".X..X.....X.",
    ".X.X..XXX.X.",
    ".X........X.",
    ".XXXXXXXXXX.",
    "............",
    "............",
  ],
} as const;

export const sourceIcons = {
  palette: {
    a: "#4aa3ff", // browser bar
    w: "#f0f0f0", // paper
    g: "#9aa0b0", // text lines
    d: "#3a3f4d", // outline
    r: "#ff6b6b", // receipt accent
    G: "#2fb968", // sheet header
    l: "#9fd6b6", // sheet grid
  },
  icons: {
    webpage: [
      "................",
      ".dddddddddddddd.",
      ".daaaaaaaaaaaad.",
      ".dawawaaaaaaaad.",
      ".daaaaaaaaaaaad.",
      ".dwwwwwwwwwwwwd.",
      ".dwggggggwwwwwd.",
      ".dwwwwwwwwwwwwd.",
      ".dwggwwggggggwd.",
      ".dwwwwwwwwwwwwd.",
      ".dwgggggwwwwwwd.",
      ".dwwwwwwwwwwwwd.",
      ".dwggggggggwwwd.",
      ".dwwwwwwwwwwwwd.",
      ".dddddddddddddd.",
      "................",
    ],
    receipt: [
      "................",
      "..dddddddddddd..",
      "..dwwwwwwwwwwd..",
      "..dwrrrrwwwwwd..",
      "..dwwwwwwwwwwd..",
      "..dwggggggwwwd..",
      "..dwwwwwwwwwwd..",
      "..dwgggwwgwwwd..",
      "..dwwwwwwwwwwd..",
      "..dwggggggwgwd..",
      "..dwwwwwwwwwwd..",
      "..dwrrrrrwwwwd..",
      "..dwwwwwwwwwwd..",
      "..dwdwwdwwdwwd..",
      "...d.dd.dd.dd...",
      "................",
    ],
    spreadsheet: [
      "................",
      ".dddddddddddddd.",
      ".dGGGGGGGGGGGGd.",
      ".dGGGGGGGGGGGGd.",
      ".dlllllllllllld.",
      ".dwwwwlwwwwlwwd.",
      ".dwwwwlwwwwlwwd.",
      ".dlllllllllllld.",
      ".dwwwwlwwwwlwwd.",
      ".dwwwwlwwwwlwwd.",
      ".dlllllllllllld.",
      ".dwwwwlwwwwlwwd.",
      ".dwwwwlwwwwlwwd.",
      ".dlllllllllllld.",
      ".dddddddddddddd.",
      "................",
    ],
  },
} as const;
