import type { TrackId } from "@/content/types";
import JunctionStage from "./JunctionStage";

// The branch point after the short intake belt (see JunctionStage for the controls and the art).
export default function Junction({ counts }: { counts: Record<TrackId, number> }) {
  return (
    <section id="junction" data-station="JUNCTION" data-station-short="JUNCTION" className="scroll-mt-28">
      <JunctionStage counts={counts} />
    </section>
  );
}
