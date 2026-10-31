// Shapes of the content in content/projects/*.md and content/experience/*.md.
// content/loader.ts validates every file against these at build time.

export type ProjectLinks = {
  github?: string;
  demo?: string;
  screenshots?: string;
};

export type Project = {
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

export type Checkpoint = {
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
