import Link from "next/link";
import type { Project } from "@/content/projects";

// `compact` is used inside the horizontal desktop pipeline: smaller type and a
// two-column body so the whole card fits in one screen without scrolling.
export default function ProjectCard({
  project,
  eyebrow,
  compact = false,
  headingLevel = 3,
}: {
  project: Project;
  eyebrow?: string;
  compact?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const { slug, title, dates, problem, summary, tech, highlight } = project;
  return (
    <article
      className={`border-4 border-cyan bg-background p-4 shadow-[6px_6px_0_0_var(--cyan)] sm:p-6 ${
        compact ? "pipe:w-full pipe:max-w-5xl pipe:p-5" : ""
      }`}
    >
      {eyebrow && <p className="font-pixel text-xs text-green">{eyebrow}</p>}
      <Heading
        className={`mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base ${
          compact ? "pipe:text-sm" : ""
        }`}
      >
        {title}
      </Heading>
      {dates && <p className="text-foreground/80">{dates}</p>}
      <div className={compact ? "pipe:mt-2 pipe:grid pipe:grid-cols-[3fr_2fr] pipe:gap-x-8" : ""}>
        <div className={compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}>
          {problem && <p className="mt-3 text-foreground">{problem}</p>}
          <ul className="mt-3 list-none space-y-1">
            {summary.map((b) => (
              <li key={b} className="text-foreground/80 before:mr-2 before:text-green before:content-['>']">
                {b}
              </li>
            ))}
          </ul>
        </div>
        <div className={compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}>
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
            className="mt-5 inline-flex min-h-11 items-center border-2 border-orange px-3 font-pixel text-xs lg:min-h-9 lg:pointer-coarse:min-h-11 text-orange hover:bg-orange hover:text-background"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </article>
  );
}
