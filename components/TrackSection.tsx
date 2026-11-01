import type { ReactNode } from "react";
import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";
import Pipeline from "./Pipeline";

// One track: a heading (visible in the stacked layouts) plus its pipeline.
export default function TrackSection({ track, children }: { track: TrackId; children: ReactNode }) {
  const meta = trackMeta.find((t) => t.id === track)!;
  return (
    <section id={track} data-track-section={track} aria-labelledby={`${track}-heading`} className="scroll-mt-28">
      <h2 id={`${track}-heading`} className="track-heading px-4 pt-10 font-pixel text-base text-orange pipe:sr-only">
        {meta.label}
      </h2>
      <Pipeline track={track} label={meta.heading}>
        {children}
      </Pipeline>
    </section>
  );
}
