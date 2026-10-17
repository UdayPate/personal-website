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

  return (
    <section id={item.slug} className="scroll-mt-28 border-l-8 border-orange/60 py-8 pl-4 sm:pl-8">
      {project && <ProjectCard project={project} eyebrow={eyebrow} />}
      {checkpoint && <CheckpointCard checkpoint={checkpoint} />}
    </section>
  );
}
