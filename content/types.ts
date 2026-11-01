// Shapes of the content in content/projects/*.md and content/experience/*.md.
// content/loader.ts validates every file against these at build time.

export type ProjectLinks = {
  github?: string;
  demo?: string;
  screenshots?: string;
};

export type Track = "projects" | "experience" | "education";

export type Project = {
  track: "projects";
  /** Taken from the file name (content/projects/<slug>.md). */
  slug: string;
  title: string;
  dates?: string;
  problem?: string;
  /** 2-3 short bullets, facts taken only from the details. */
  summary: string[];
  /** The Markdown body of the file: the full description shown on the project page. */
  details: string;
  tech: string[];
  highlight?: string;
  links?: ProjectLinks;
  /** 1-5: which pipeline station shows this project. Exactly one project per stage. */
  pipelineStage?: number;
  /** Shown on /projects only, not in the pipeline. */
  projectsOnly?: boolean;
};

export type TrackId = "projects" | "experience" | "education";

/** One station on a track, in order. */
export type TrackStation = {
  track: TrackId;
  /** The slug of the project / experience / education file. */
  slug: string;
  /** 1-based position on its track. */
  position: number;
  /** How many stations the track has. */
  total: number;
  /** Projects track only: Extract, Transform, ... */
  stageLabel?: string;
};

export type Checkpoint = {
  track: "experience";
  /** Position on the Experience track (1 = first). Unique; sorted by this, never by date. */
  order: number;
  /** Taken from the file name (content/experience/<slug>.md). */
  slug: string;
  title: string;
  dates: string;
  bullets: string[];
  /** The checkpoint sits on the belt right after this stage (1-4). */
  afterStage: number;
  /** The Markdown body of the file (optional; not shown on the site yet). */
  details: string;
};

export type PipelineItem = {
  kind: "stage" | "checkpoint";
  /** 1-5 for stages; undefined for checkpoints */
  stage?: number;
  label: string;
  /** slug of the project or checkpoint file */
  slug: string;
};

export type EducationKind = "degree" | "certificate" | "award" | "course";

/** One station on the Education track (content/education/<slug>.md). */
export type EducationItem = {
  track: "education";
  /** Taken from the file name. */
  slug: string;
  kind: EducationKind;
  /** Position on the track (1 = first). Unique; stations are sorted by this, never by date. */
  order: number;
  title: string;
  /** School, issuer or event organizer. */
  institution: string;
  /** Free text ("2025", "expected Dec 2027"). Only an in-progress item may omit it. */
  dates?: string;
  courses?: string[];
  /** File in public/ (png, jpg, webp, svg or pdf), e.g. "/certificates/codepath.pdf". */
  certificate?: string;
  status?: "in-progress";
  /** Required for kind "award", e.g. "5th place". */
  award?: string;
  project?: string;
  role?: string;
  teamSize?: number;
  tech?: string[];
  links?: ProjectLinks;
  /** The Markdown body (optional details). */
  details: string;
};

/** Everything about Uday, from content/profile.md. */
export type Profile = {
  name: string;
  /** Used in screen-reader labels, e.g. "Pixel-art portrait of Uday". */
  firstName: string;
  pitch: string;
  subtitle: string;
  email: string;
  linkedin: string;
  github: string;
  /** Path under public/, e.g. "/resume.pdf". */
  resume: string;
  /** The browser tab title and search-result description of the home page. */
  pageTitle: string;
  metaDescription: string;
  /** Hero icon tooltips ({projectCount} and {experienceCount} already filled in). */
  tooltips: { grad: string; laptop: string; cricket: string };
  /** The Markdown body of profile.md: the About text. */
  about: string;
};
