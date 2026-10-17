import { hudIcons } from "@/art/icons";

// Draws one of the 12x12 grids in art/icons.ts as crisp inline SVG. The colour
// comes from the surrounding text (currentColor). Decorative: hidden from screen readers.
export default function PixelIcon({ name, className = "h-6 w-6" }: { name: keyof typeof hudIcons; className?: string }) {
  const rows = hudIcons[name];
  const rects: { x: number; y: number; w: number }[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (row[x] !== "X") {
        x++;
        continue;
      }
      let w = 1;
      while (row[x + w] === "X") w++;
      rects.push({ x, y, w });
      x += w;
    }
  });
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 12 12"
      shapeRendering="crispEdges"
      fill="currentColor"
      className={className}
    >
      {rects.map((r) => (
        <rect key={`${r.x}-${r.y}`} x={r.x} y={r.y} width={r.w} height={1} />
      ))}
    </svg>
  );
}
