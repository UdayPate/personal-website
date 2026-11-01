// The Education track: stations from content/education/*.md, sorted by their
// "order" number. Server-only (loaded by content/loader.ts).
import { content } from "./loader";

export type { EducationItem, EducationKind } from "./types";

export const education = content.education;

/** Degrees (kind: degree), derived from the education files. */
export const degrees = education.filter((e) => e.kind === "degree");

export function getEducation(slug: string) {
  return education.find((e) => e.slug === slug);
}
