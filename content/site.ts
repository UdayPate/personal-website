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

/** Names of the five stages, in order. Which project sits at each stage is set by `pipelineStage` in content/projects/*.md. */
export const stageLabels = ["Extract", "Transform", "Load", "Serve", "Query"] as const;

/** The three personal icons in the hero (art/icons.ts `heroIcons`). `text` is both the tooltip and the aria-label. */
export const heroIcons = [
  { id: "grad", text: "BS Computer Science @ UC Santa Cruz → MS @ SJSU (Dec 2027)", color: "#4aa3ff" },
  { id: "laptop", text: "Engineer by training, product thinker by habit: 6 projects, 2 internships", color: "#7fe9ff" },
  { id: "cricket", text: "Off the clock: cricket. It even made it into a project.", color: "#e8c27a" },
] as const;
