import Link from "next/link";
import type { Project } from "@/content/projects";

export default function ProjectCard({ project, eyebrow }: { project: Project; eyebrow?: string }) {
  const { slug, title, dates, problem, summary, tech, highlight } = project;
  return (
    <article className="border-4 border-cyan bg-background p-4 shadow-[6px_6px_0_0_var(--cyan)] sm:p-6">
      {eyebrow && <p className="font-pixel text-[10px] text-green">{eyebrow}</p>}
      <h3 className="mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base">{title}</h3>
      {dates && <p className="text-foreground/60">{dates}</p>}
      {problem && <p className="mt-3 text-foreground">{problem}</p>}
      <ul className="mt-3 list-none space-y-1">
        {summary.map((b) => (
          <li key={b} className="text-foreground/80 before:mr-2 before:text-green before:content-['>']">
            {b}
          </li>
        ))}
      </ul>
      {highlight && <p className="mt-4 border-l-4 border-orange pl-3 text-cyan">{highlight}</p>}
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
        {tech.map((t) => (
          <li key={t} className="border-2 border-green px-2 text-lg text-green">
            {t}
          </li>
        ))}
      </ul>
      <Link
        href={`/projects/${slug}`}
        aria-label={`View details: ${title}`}
        className="mt-5 inline-block border-2 border-orange px-3 py-1 font-pixel text-[10px] text-orange hover:bg-orange hover:text-background"
      >
        VIEW DETAILS
      </Link>
    </article>
  );
}
