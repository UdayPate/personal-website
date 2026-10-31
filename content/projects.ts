// The project and experience content, loaded from the Markdown files in
// content/projects/ and content/experience/ (see content/loader.ts). Server-only.
import { content } from "./loader";

export type { Checkpoint, PipelineItem, Project, ProjectLinks } from "./types";

export const { projects, checkpoints, pipeline } = content;

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
export function getCheckpoint(slug: string) {
  return checkpoints.find((c) => c.slug === slug);
}
