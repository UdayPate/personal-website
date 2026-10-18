/**
 * Small pixel icons, same idea as character.ts: one letter per pixel.
 *  - hudIcons: 12 x 12, single colour (X = filled). Drawn as inline SVG that takes
 *    its colour from the text (see components/PixelIcon.tsx).
 *  - sourceIcons: the first intro icons (webpage, receipt, spreadsheet). No longer
 *    used on the site (replaced by heroIcons below); kept as a drawing reference.
 *  - heroIcons: the three personal intro icons, exported to public/sprites/hero.png.
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
    "...XX..XX...",
    "..XX....XX..",
    ".XX......XX.",
    "XX........XX",
    "XX........XX",
    ".XX......XX.",
    "..XX....XX..",
    "...XX..XX...",
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

/**
 * Personal hero icons (replace the old webpage / receipt / spreadsheet sources).
 * 16x16 (`engineer*` is the glowing laptop with a lightbulb). `engineerOff` and `engineerOn` differ only in the lightbulb (flicker).
 */
export const heroIcons = {
  palette: {
    b: "#5b97ff", // cap top face (light)
    n: "#1f4fb5", // cap board edge
    N: "#143a85", // skull cap
    d: "#1a2140", // cap band
    y: "#f2b632", // gold
    Y: "#b9831c", // gold shadow
    Q: "#59617f", // laptop base edge
    c: "#7fe9ff", // laptop glow
    C: "#e8ffff", // laptop glow bright
    f: "#2b2f3a", // laptop frame
    q: "#8f98bd", // laptop base
    o: "#4a4f63", // bulb (off)
    z: "#ffe45c", // bulb (on)
    Z: "#fff6b0", // bulb highlight (on)
    t: "#3a3f55", // desk
    w: "#e8c27a", // bat wood
    W: "#b98c4a", // bat shadow
    g: "#d6453d", // grip / ball
    G: "#9c2f29", // grip shadow
    h: "#f0f0f0", // ball seam
  },
  gradCap: [
    "................",
    "................",
    "................",
    ".......yy.......",
    ".bbbbbbyyyyyyyyy",
    ".nnnnnnnnnnnnnny",
    ".nnnnnnnnnnnnnny",
    "....NNNNNNNN...y",
    "....NNNNNNNN...y",
    "....NNNNNNNN...y",
    "....NNNNNNNN..yy",
    "..............yy",
    "..............YY",
    "................",
    "................",
    "................",
  ],
  engineerOff: [
    "......ooo.......",
    ".....ooooo......",
    ".....ooooo......",
    "......ooo.......",
    "......qqq.......",
    ".......f........",
    "..ffffffffff....",
    "..fcccccccCf....",
    "...fcCCcccccf...",
    "...fcCccccccc...",
    "....fccccccccf..",
    "....ffffffffff..",
    "..qqqqqqqqqqqqq.",
    ".qqfqfqfqfqfqqq.",
    "QQQQQQQQQQQQQQQQ",
    "................",
  ],
  engineerOn: [
    "...z..zzz..z....",
    ".....zzZzz......",
    "..z..zzZzz..z...",
    "......zzz.......",
    "......qqq.......",
    ".......f........",
    "..ffffffffff....",
    "..fcccccccCf....",
    "...fcCCcccccf...",
    "...fcCccccccc...",
    "....fccccccccf..",
    "....ffffffffff..",
    "..qqqqqqqqqqqqq.",
    ".qqfqfqfqfqfqqq.",
    "QQQQQQQQQQQQQQQQ",
    "................",
  ],
  cricket: [
    "................",
    "............GG..",
    "...........ggG..",
    "..........ggG...",
    ".........gGg....",
    "........wwwW....",
    ".......wwwwW....",
    "......wwwwwW....",
    ".....wwwwwW.....",
    "....wwwwwW..ggg.",
    "...wwwwwW..ggggg",
    "..wwwwwW...gghgg",
    "..wwwwW....gghgg",
    ".wwwwW......ggg.",
    ".WWWW...........",
    "................",
  ],
} as const;
