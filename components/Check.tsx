// A small pixel checkmark (8x8), used for visited tracks.
const ROWS = ["........", ".......X", "......XX", "X....XX.", "XX..XX..", ".XXXX...", "..XX....", "........"];
export default function Check({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 8 8" shapeRendering="crispEdges" fill="currentColor" className={className}>
      {ROWS.flatMap((row, y) => [...row].map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)))}
    </svg>
  );
}
