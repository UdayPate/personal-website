// Reads content/projects/*.md and content/experience/*.md at build time and
// checks every field. Any problem stops the build with a message that names the
// file. (This runs on the server only: it uses the file system.)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { stageLabels, totalStages } from "./site";
import type { Checkpoint, Education, PipelineItem, Profile, Project, ProjectLinks } from "./types";

const CONTENT = path.join(process.cwd(), "content");
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LINK_KEYS = ["github", "demo", "screenshots"] as const;
const PROJECT_KEYS = ["title", "dates", "problem", "pipelineStage", "projectsOnly", "summary", "tech", "highlight", "links"];
const CHECKPOINT_KEYS = ["title", "dates", "afterStage", "bullets"];
const PROFILE_KEYS = ["name", "firstName", "pitch", "subtitle", "email", "linkedin", "github", "resume", "education", "pageTitle", "metaDescription", "tooltips"];
const EDUCATION_KEYS = ["degree", "school", "dates"];
const TOOLTIP_KEYS = ["grad", "laptop", "cricket"] as const;
const PROFILE_FILE = "content/profile.md";

type Loaded<T> = { file: string; item: T };
const errors: string[] = [];
// stage -> files that declare it (recorded even if the file has other errors, so one typo does not also report a "missing stage")
const claimed = new Map<number, string[]>();
const fail = (file: string, msg: string) => errors.push(`${file}: ${msg}`);

function parseFile(file: string, text: string): { data: Record<string, unknown>; body: string } | undefined {
  const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/.exec(text.replace(/^\uFEFF/, ""));
  if (!m) {
    fail(file, "must start with a --- frontmatter block (--- ... ---) followed by the Markdown body");
    return undefined;
  }
  let data: unknown;
  try {
    data = parseYaml(m[1]);
  } catch (e) {
    fail(file, `frontmatter is not valid YAML: ${(e as Error).message.split("\n")[0]}`);
    return undefined;
  }
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    fail(file, "frontmatter must be a list of `key: value` lines");
    return undefined;
  }
  return { data: data as Record<string, unknown>, body: (m[2] ?? "").trim() };
}

function readEntries(dir: string): { file: string; slug: string; data: Record<string, unknown>; body: string }[] {
  const full = path.join(CONTENT, dir);
  let names: string[] = [];
  try {
    names = readdirSync(full).filter((n) => n.endsWith(".md")).sort();
  } catch {
    errors.push(`content/${dir}/: folder not found`);
  }
  return names.flatMap((name) => {
    const file = `content/${dir}/${name}`;
    const parsed = parseFile(file, readFileSync(path.join(full, name), "utf8"));
    return parsed ? [{ file, slug: name.slice(0, -3), ...parsed }] : [];
  });
}

// --- field checkers: each returns the value, or undefined after recording an error ---
const describe = (v: unknown) => (Array.isArray(v) ? "a list" : v === null ? "empty" : typeof v === "object" ? "an object" : `${typeof v} ${JSON.stringify(v)}`);

function str(file: string, data: Record<string, unknown>, key: string, required: boolean): string | undefined {
  const v = data[key];
  if (v === undefined) {
    if (required) fail(file, `missing required field "${key}"`);
    return undefined;
  }
  if (typeof v !== "string" || !v.trim()) {
    fail(file, `"${key}" must be a non-empty text value (got ${describe(v)})`);
    return undefined;
  }
  return v;
}
function strList(file: string, data: Record<string, unknown>, key: string): string[] | undefined {
  const v = data[key];
  if (v === undefined) {
    fail(file, `missing required field "${key}"`);
    return undefined;
  }
  if (!Array.isArray(v) || v.length === 0 || v.some((x) => typeof x !== "string" || !x.trim())) {
    fail(file, `"${key}" must be a list with at least one non-empty text item (got ${describe(v)})`);
    return undefined;
  }
  return v as string[];
}
function stageNumber(file: string, data: Record<string, unknown>, key: string, min: number, max: number, required: boolean): number | undefined {
  const v = data[key];
  if (v === undefined) {
    if (required) fail(file, `missing required field "${key}"`);
    return undefined;
  }
  if (typeof v !== "number" || !Number.isInteger(v) || v < min || v > max) {
    fail(file, `"${key}" must be a whole number from ${min} to ${max} (got ${describe(v)})`);
    return undefined;
  }
  return v;
}
function unknownKeys(file: string, data: Record<string, unknown>, allowed: string[]) {
  for (const k of Object.keys(data)) if (!allowed.includes(k)) fail(file, `unknown field "${k}" (allowed: ${allowed.join(", ")})`);
}
function checkSlug(file: string, slug: string) {
  if (!SLUG.test(slug)) fail(file, `file name must be lowercase letters, digits and dashes, like "my-project.md"`);
}

function loadProjects(): Loaded<Project>[] {
  return readEntries("projects").flatMap(({ file, slug, data, body }) => {
    const before = errors.length;
    checkSlug(file, slug);
    unknownKeys(file, data, PROJECT_KEYS);
    const title = str(file, data, "title", true);
    const dates = str(file, data, "dates", false);
    const problem = str(file, data, "problem", false);
    const highlight = str(file, data, "highlight", false);
    const summary = strList(file, data, "summary");
    const tech = strList(file, data, "tech");
    const pipelineStage = stageNumber(file, data, "pipelineStage", 1, totalStages, false);
    if (pipelineStage) claimed.set(pipelineStage, [...(claimed.get(pipelineStage) ?? []), file]);
    let projectsOnly: boolean | undefined;
    if (data.projectsOnly !== undefined) {
      if (data.projectsOnly !== true) fail(file, `"projectsOnly" must be true (or leave it out) (got ${describe(data.projectsOnly)})`);
      else projectsOnly = true;
    }
    if (data.pipelineStage === undefined && !projectsOnly) fail(file, `needs either "pipelineStage: 1-${totalStages}" or "projectsOnly: true"`);
    if (data.pipelineStage !== undefined && data.projectsOnly !== undefined) fail(file, `"pipelineStage" and "projectsOnly" cannot both be set`);
    let links: ProjectLinks | undefined;
    if (data.links !== undefined) {
      const l = data.links as Record<string, unknown>;
      if (l === null || typeof l !== "object" || Array.isArray(l)) fail(file, `"links" must be a group like "github: https://..." (got ${describe(l)})`);
      else {
        links = {};
        for (const k of Object.keys(l)) {
          if (!(LINK_KEYS as readonly string[]).includes(k)) fail(file, `unknown link "${k}" (allowed: ${LINK_KEYS.join(", ")})`);
          else if (typeof l[k] !== "string" || !/^https?:\/\/\S+$/.test(l[k] as string)) fail(file, `link "${k}" must be a full web address starting with http:// or https:// (got ${describe(l[k])})`);
          else links[k as keyof ProjectLinks] = l[k] as string;
        }
      }
    }
    if (!body) fail(file, "the Markdown body (the full details, below the frontmatter) is empty");
    if (errors.length > before) return [];
    return [{ file, item: { slug, title: title!, dates, problem, summary: summary!, details: body, tech: tech!, highlight, links, pipelineStage, projectsOnly } }];
  });
}

function loadCheckpoints(): Loaded<Checkpoint>[] {
  return readEntries("experience").flatMap(({ file, slug, data, body }) => {
    const before = errors.length;
    checkSlug(file, slug);
    unknownKeys(file, data, CHECKPOINT_KEYS);
    const title = str(file, data, "title", true);
    const dates = str(file, data, "dates", true);
    const bullets = strList(file, data, "bullets");
    const afterStage = stageNumber(file, data, "afterStage", 1, totalStages - 1, true);
    if (errors.length > before) return [];
    return [{ file, item: { slug, title: title!, dates: dates!, bullets: bullets!, afterStage: afterStage!, details: body } }];
  });
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const webUrl = (v: unknown) => typeof v === "string" && /^https?:\/\/\S+$/.test(v);

function loadProfile(counts: { projectCount: number; experienceCount: number }): Profile | undefined {
  const file = PROFILE_FILE;
  const before = errors.length;
  let parsed;
  try {
    parsed = parseFile(file, readFileSync(path.join(process.cwd(), file), "utf8"));
  } catch {
    errors.push(`${file}: file not found`);
    return undefined;
  }
  if (!parsed) return undefined;
  const { data, body } = parsed;
  unknownKeys(file, data, PROFILE_KEYS);
  const name = str(file, data, "name", true);
  const firstName = str(file, data, "firstName", true);
  const pitch = str(file, data, "pitch", true);
  const subtitle = str(file, data, "subtitle", true);
  const pageTitle = str(file, data, "pageTitle", true);
  const metaDescription = str(file, data, "metaDescription", true);
  const email = str(file, data, "email", true);
  if (email && !EMAIL.test(email)) fail(file, `"email" is not a valid email address (got ${JSON.stringify(email)})`);
  const urls: Record<string, string | undefined> = {};
  for (const k of ["linkedin", "github"]) {
    urls[k] = str(file, data, k, true);
    if (urls[k] && !webUrl(urls[k])) fail(file, `"${k}" must be a full web address starting with http:// or https:// (got ${JSON.stringify(urls[k])})`);
  }
  const resume = str(file, data, "resume", true);
  if (resume && !(resume.startsWith("/") && existsSync(path.join(process.cwd(), "public", resume)))) {
    fail(file, `"resume" must be a path to a file in public/, like "/resume.pdf" (nothing found at public${resume})`);
  }

  let education: Education[] | undefined;
  const ed = data.education;
  if (ed === undefined) fail(file, `missing required field "education"`);
  else if (!Array.isArray(ed) || ed.length === 0) fail(file, `"education" must be a list with at least one entry (got ${describe(ed)})`);
  else {
    education = [];
    ed.forEach((e, i) => {
      const where = `education entry ${i + 1}`;
      if (e === null || typeof e !== "object" || Array.isArray(e)) return fail(file, `${where} must have "degree" and "school" (got ${describe(e)})`);
      const o = e as Record<string, unknown>;
      for (const k of Object.keys(o)) if (!EDUCATION_KEYS.includes(k)) fail(file, `${where}: unknown field "${k}" (allowed: ${EDUCATION_KEYS.join(", ")})`);
      const degree = str(`${file} (${where})`, o, "degree", true);
      const school = str(`${file} (${where})`, o, "school", true);
      const dates = str(`${file} (${where})`, o, "dates", false);
      if (degree && school) education!.push({ degree, school, dates });
    });
  }

  // hero icon tooltips; {projectCount} and {experienceCount} are filled in from the content files
  let tooltips: Profile["tooltips"] | undefined;
  const tt = data.tooltips;
  if (tt === undefined) fail(file, `missing required field "tooltips"`);
  else if (tt === null || typeof tt !== "object" || Array.isArray(tt)) fail(file, `"tooltips" must have grad, laptop and cricket (got ${describe(tt)})`);
  else {
    const o = tt as Record<string, unknown>;
    for (const k of Object.keys(o)) if (!(TOOLTIP_KEYS as readonly string[]).includes(k)) fail(file, `tooltips: unknown field "${k}" (allowed: ${TOOLTIP_KEYS.join(", ")})`);
    const out: Record<string, string> = {};
    for (const k of TOOLTIP_KEYS) {
      const v = str(`${file} (tooltips)`, o, k, true);
      if (v === undefined) continue;
      out[k] = v.replace(/\{(\w+)\}/g, (whole, key: string) => {
        if (key in counts) return String(counts[key as keyof typeof counts]);
        fail(file, `tooltips.${k}: unknown placeholder ${whole} (allowed: {projectCount}, {experienceCount})`);
        return whole;
      });
    }
    if (Object.keys(out).length === TOOLTIP_KEYS.length) tooltips = out as Profile["tooltips"];
  }
  if (!body) fail(file, "the Markdown body (the About text, below the frontmatter) is empty");
  if (errors.length > before) return undefined;
  return {
    name: name!, firstName: firstName!, pitch: pitch!, subtitle: subtitle!, email: email!,
    linkedin: urls.linkedin!, github: urls.github!, resume: resume!, education: education!,
    pageTitle: pageTitle!, metaDescription: metaDescription!, tooltips: tooltips!, about: body,
  };
}

function build() {
  const p = loadProjects();
  const c = loadCheckpoints();

  // slugs are used as page ids and anchors, so they must be unique across both folders
  const seen = new Map<string, string>();
  for (const { file, item } of [...p, ...c]) {
    const other = seen.get(item.slug);
    if (other) fail(file, `same name as ${other}; every project and experience file needs a different file name`);
    else seen.set(item.slug, file);
  }

  // exactly one project per pipeline stage
  for (let s = 1; s <= totalStages; s++) {
    const files = claimed.get(s) ?? [];
    if (files.length === 0) errors.push(`No project has "pipelineStage: ${s}". Every stage from 1 to ${totalStages} needs exactly one project.`);
    if (files.length > 1) errors.push(`Stage ${s} is claimed by more than one project: ${files.join(" and ")}. Each stage needs exactly one project.`);
  }

  const profile = loadProfile({ projectCount: p.length, experienceCount: c.length });

  if (errors.length) {
    throw new Error(`\n\nContent problems (fix these files, then build again):\n${errors.map((e) => `  - ${e}`).join("\n")}\n`);
  }

  // /projects order: pipeline projects by stage, then projects-only ones by file name
  const projects = [...p].sort((a, b) => (a.item.pipelineStage ?? 99) - (b.item.pipelineStage ?? 99) || a.file.localeCompare(b.file)).map((x) => x.item);
  const checkpoints = [...c].sort((a, b) => a.item.afterStage - b.item.afterStage || a.file.localeCompare(b.file)).map((x) => x.item);

  const pipeline: PipelineItem[] = [];
  for (let s = 1; s <= totalStages; s++) {
    pipeline.push({ kind: "stage", stage: s, label: stageLabels[s - 1], slug: projects.find((x) => x.pipelineStage === s)!.slug });
    for (const cp of checkpoints) if (cp.afterStage === s) pipeline.push({ kind: "checkpoint", label: "Checkpoint", slug: cp.slug });
  }
  return { profile: profile!, projects, checkpoints, pipeline };
}

export const content = build();
