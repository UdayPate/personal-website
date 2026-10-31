// Everything about Uday (name, links, education, About text, tooltips), loaded
// from content/profile.md by content/loader.ts. Server-only.
import { content } from "./loader";

export type { Education, Profile } from "./types";

export const profile = content.profile;
