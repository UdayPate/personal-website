// Checks every external link in the content files (and that linked files exist in public/).
// Run:  npm run check-links     (needs internet; not part of the build, because sites can be down or block bots)
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const root = process.cwd();
const files = ["content/profile.md", ...["projects", "experience", "education"].flatMap((d) => readdirSync(path.join(root, "content", d)).filter((n) => n.endsWith(".md")).map((n) => `content/${d}/${n}`))];

const urls = []; // { file, label, url }
const localFiles = []; // { file, label, path }
for (const file of files) {
  const text = readFileSync(path.join(root, file), "utf8");
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  const data = parse(m[1]);
  for (const k of ["linkedin", "github"]) if (data[k]) urls.push({ file, label: k, url: data[k] });
  for (const [k, v] of Object.entries(data.links ?? {})) urls.push({ file, label: `links.${k}`, url: v });
  for (const k of ["resume", "certificate"]) if (data[k]) localFiles.push({ file, label: k, path: data[k] });
}

const seen = new Set();
let problems = 0;
const line = (ok, text) => console.log(`${ok === true ? "OK     " : ok === "warn" ? "CHECK  " : "BROKEN "} ${text}`);

for (const l of localFiles) {
  const ok = existsSync(path.join(root, "public", l.path));
  if (!ok) problems++;
  line(ok, `${l.file}  ${l.label}: ${l.path}${ok ? "" : "  (file not found in public/)"}`);
}
for (const l of urls) {
  const key = l.url;
  if (seen.has(key)) continue;
  seen.add(key);
  try {
    const res = await fetch(l.url, { redirect: "follow", signal: AbortSignal.timeout(20000), headers: { "user-agent": "Mozilla/5.0 (compatible; link-check)", accept: "text/html" } });
    if (res.ok) line(true, `${res.status}  ${l.url}  (${l.file} ${l.label})`);
    else if (l.url.includes("linkedin.com") && [999, 403, 429].includes(res.status)) line("warn", `${res.status}  ${l.url}  (${l.file} ${l.label}) LinkedIn blocks automated checks: open it in a browser to verify`);
    else { problems++; line(false, `${res.status}  ${l.url}  (${l.file} ${l.label})`); }
  } catch (e) {
    problems++;
    line(false, `ERR  ${l.url}  (${l.file} ${l.label}): ${e.cause?.code ?? e.message}`);
  }
}
console.log(problems ? `\n${problems} problem(s) found` : "\nAll links work (or are marked CHECK above).");
process.exitCode = problems ? 1 : 0;
