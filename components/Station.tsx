import type { PipelineItem } from "@/content/site";
import { totalStages } from "@/content/site";
import { getCheckpoint, getProject } from "@/content/projects";
import ProjectCard from "./ProjectCard";
import CheckpointCard from "./CheckpointCard";

export default function Station({ item }: { item: PipelineItem }) {
  const project = item.kind === "stage" ? getProject(item.slug) : undefined;
  const checkpoint = item.kind === "checkpoint" ? getCheckpoint(item.slug) : undefined;
  const eyebrow =
    item.kind === "stage" ? `STAGE ${item.stage}/${totalStages} · ${item.label.toUpperCase()}` : undefined;
  // What the live HUD shows while this station is on screen.
  const hudLabel = item.kind === "stage" ? eyebrow : "CHECKPOINT";

  return (
    <section
      id={item.slug}
      data-station={hudLabel}
      className="mx-auto w-full max-w-3xl scroll-mt-28 border-l-8 border-orange/60 py-8 pl-4 pr-4 sm:pl-8 pipe:flex pipe:h-full pipe:w-screen pipe:shrink-0 pipe:items-center pipe:justify-center pipe:mx-0 pipe:max-w-none pipe:border-l-0 pipe:px-[6vw] pipe:pb-24 pipe:pt-4"
    >
      {project && <ProjectCard project={project} eyebrow={eyebrow} compact />}
      {checkpoint && <CheckpointCard checkpoint={checkpoint} compact />}
    </section>
  );
}
