import { getCheckpoint, getProject } from "@/content/projects";
import { getEducation } from "@/content/education";
import { totalStages, trackMeta } from "@/content/site";
import type { TrackStation } from "@/content/types";
import ProjectCard from "./ProjectCard";
import CheckpointCard from "./CheckpointCard";
import EducationCard from "./EducationCard";

/** Character art stage (1 blob, 2 8-bit, 3 16-bit, 4 final) for a station: spread across the track, final at the last one. */
export function artStageFor(position: number, total: number) {
  return total <= 1 ? 4 : 1 + Math.round(((position - 1) * 3) / (total - 1));
}

export default function Station({ station }: { station: TrackStation }) {
  const { track, slug, position, total, stageLabel } = station;
  const trackLabel = trackMeta.find((t) => t.id === track)!.label;
  const last = position === total;
  // Labels the live HUD shows while this station is on screen (long, and short for phones).
  const hudFull = track === "projects" ? `${trackLabel} ${position}/${total} · ${stageLabel!.toUpperCase()}` : `${trackLabel} ${position}/${total}`;
  const hudShort = `${trackLabel} ${position}/${total}`;
  const eyebrow = track === "projects" ? `STAGE ${position}/${totalStages} · ${stageLabel!.toUpperCase()}` : undefined;
  // placeholder props by position along the track (hopper, gears, database, dashboard, terminal)
  const propIndex = total <= 1 ? 0 : Math.round(((position - 1) * 4) / (total - 1));

  return (
    <section
      id={slug}
      data-panel
      data-station={hudFull}
      data-station-short={hudShort}
      data-track={track}
      data-slug={slug}
      data-art-stage={artStageFor(position, total)}
      className="mx-auto w-full max-w-3xl scroll-mt-28 border-l-8 border-orange/60 py-8 pl-4 pr-4 sm:pl-8 pipe:relative pipe:flex pipe:h-full pipe:w-screen pipe:shrink-0 pipe:items-center pipe:justify-center pipe:mx-0 pipe:max-w-none pipe:border-l-0 pipe:px-[6vw] pipe:pb-[5.5rem] pipe:pt-0"
    >
      {track === "projects" && <ProjectCard project={getProject(slug)!} eyebrow={eyebrow} compact headingLevel={3} />}
      {track === "experience" && <CheckpointCard checkpoint={getCheckpoint(slug)!} compact headingLevel={3} />}
      {track === "education" && <EducationCard item={getEducation(slug)!} compact headingLevel={3} />}
      {/* Decorative machine on the belt (public/sprites/props.png). Right of where the character stops, so it never overlaps it or the card. */}
      <div aria-hidden className="station-prop absolute bottom-16 left-[76%] hidden pipe:block" style={{ ["--i" as string]: propIndex }} />
      {last && (
        // The laptop the character picks up at the last station of every track (see Pipeline.tsx).
        <div aria-hidden data-laptop className="laptop-prop absolute bottom-16 left-[57%] hidden pipe:block" />
      )}
      {track === "experience" && (
        // Checkpoint marker on the belt: Pipeline.tsx raises and lights the flag as the character passes.
        <div aria-hidden className="absolute bottom-16 left-[68%] hidden pipe:block">
          <div className="h-24 w-1 bg-foreground/60" />
          <div data-flag-cloth className="absolute left-1 top-0 h-6 w-10 bg-green" />
        </div>
      )}
    </section>
  );
}
