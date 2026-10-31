// Reads content/projects/*.md and content/experience/*.md at build time and
// checks every field. Any problem stops the build with a message that names the
// file. (This runs on the server only: it uses the file system.)
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import { stageLabels, totalStages } from "./site";
import type { Checkpoint, PipelineItem, Project, ProjectLinks } from "./types";

const CONTENT = path.join(process.cwd(), "content");
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const LINK_KEYS = ["github", "demo", "screenshots"] as const;
const PROJECT_KEYS = ["title", "dates", "problem", "pipelineStage", "projectsOnly", "summary", "tech", "highlight", "links"];
const CHECKPOINT_KEYS = ["title", "dates", "afterStage", "bullets"];

type Loaded<T> = { file: string; item: T };
const errors: string[] = [];
// stage -> files that declare it (recorded even if the file has other errors, so one typo does not also report a "missing stage")
const claimed = new Map<number, string[]>();
const fail = (file: string, msg: string) => errors.push(`${file}: ${msg}`);

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
    const text = readFileSync(path.join(full, name), "utf8").replace(/^﻿/, "");
    const m = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/.exec(text);
    if (!m) {
      fail(file, "must start with a --- frontmatter block (--- ... ---) followed by the Markdown body");
      return [];
    }
    let data: unknown;
    try {
      data = parseYaml(m[1]);
    } catch (e) {
      fail(file, `frontmatter is not valid YAML: ${(e as Error).message.split("\n")[0]}`);
      return [];
    }
    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      fail(file, "frontmatter must be a list of `key: value` lines");
      return [];
    }
    return [{ file, slug: name.slice(0, -3), data: data as Record<string, unknown>, body: (m[2] ?? "").trim() }];
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
  return { projects, checkpoints, pipeline };
}

export const content = build();
