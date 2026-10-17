export type Stage = {
  id: string;
  label: string;
  character: string;
};

export type PipelineItem = {
  kind: "stage" | "checkpoint";
  /** 1-5 for stages; undefined for checkpoints */
  stage?: number;
  label: string;
  /** slug of the entry in content/projects.ts */
  slug: string;
};

export const site = {
  name: "Uday Patel",
  pitch:
    "Engineer by training, product thinker by habit. I build systems that people actually use.",
  subtitle: "Data · AI · Software · Product | MS @ SJSU",
  about:
    "I'm a master's student in Applied Data Intelligence at San José State University (graduating Dec 2027), with a BS in Computer Science from UC Santa Cruz. I work across data, AI, software, and product: dbt pipelines and warehouses, LLM agents grounded in real statistics, and mobile and web apps where I led the product design. Most recently I was a GTM Data Analyst Intern at Everlaw, where my benchmarking dashboard moved to staging for company-wide rollout.",
  links: {
    github: "https://github.com/UdayPate",
    linkedin: "https://www.linkedin.com/in/upatelda/",
    email: "pateluday0308@gmail.com",
  },
  resume: "/resume.pdf",
} as const;

export const totalStages = 5;

/** Order of the pipeline, top to bottom. */
export const pipeline: PipelineItem[] = [
  { kind: "stage", stage: 1, label: "Extract", slug: "aislesave" },
  { kind: "checkpoint", label: "Checkpoint", slug: "groovyweb" },
  { kind: "stage", stage: 2, label: "Transform", slug: "airbnb-pipeline" },
  { kind: "stage", stage: 3, label: "Load", slug: "apple-platform" },
  { kind: "checkpoint", label: "Checkpoint", slug: "everlaw" },
  { kind: "stage", stage: 4, label: "Serve", slug: "data-lens" },
  { kind: "stage", stage: 5, label: "Query", slug: "cricket-intelligence" },
];
