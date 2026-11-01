// Things about the site and the game (not about Uday: that lives in content/profile.md,
// content/projects and content/experience).

export const totalStages = 5;

/** Names of the five stages, in order. Which project sits at each stage is set by `pipelineStage` in content/projects/*.md. */
export const stageLabels = ["Extract", "Transform", "Load", "Serve", "Query"] as const;

/** The three hero icons: art/icons.ts order and fragment colour. Their tooltip text is in content/profile.md. */
export const heroIcons = [
  { id: "grad", color: "#4aa3ff" },
  { id: "laptop", color: "#7fe9ff" },
  { id: "cricket", color: "#e8c27a" },
] as const;

/** The three tracks as shown at the junction (left to right) and in the HUD. */
export const trackMeta = [
  { id: "education", label: "EDUCATION", heading: "Education" },
  { id: "experience", label: "EXPERIENCE", heading: "Experience" },
  { id: "projects", label: "PROJECTS", heading: "Projects" },
] as const;
