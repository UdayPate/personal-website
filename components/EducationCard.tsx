import Link from "next/link";
import type { EducationItem } from "@/content/types";
import IconTip from "./IconTip";

export const KIND_LABEL = { degree: "DEGREE", certificate: "CERTIFICATE", award: "AWARD", course: "COURSE" } as const;
const MAX_COURSES = 4;
/** "CSE 101: Introduction to ..." -> "CSE 101" (the whole text if there is no colon) */
const courseCode = (c: string) => (c.includes(":") ? c.slice(0, c.indexOf(":")).trim() : c);

// Placeholder pixel trophy (8x8). The real award badge art arrives in a later step.
const TROPHY = ["XXXXXXXX", "XXXXXXXX", ".XXXXXX.", "..XXXX..", "...XX...", "...XX...", "..XXXX..", ".XXXXXX."];
export function Trophy({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 8 8" shapeRendering="crispEdges" fill="currentColor" className={className}>
      {TROPHY.flatMap((row, y) => [...row].map((c, x) => (c === "X" ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} /> : null)))}
    </svg>
  );
}

const btn =
  "inline-flex min-h-11 items-center border-2 border-orange px-3 font-pixel text-xs text-orange hover:bg-orange hover:text-background lg:min-h-9 lg:pointer-coarse:min-h-11";

// `compact` is used inside the horizontal desktop pipeline (see ProjectCard).
export default function EducationCard({
  item,
  eyebrow,
  compact = false,
  headingLevel = 3,
}: {
  item: EducationItem;
  eyebrow?: string;
  compact?: boolean;
  headingLevel?: 2 | 3;
}) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const { slug, kind, title, institution, dates, summary, courses, certificate, status, award, project, role, teamSize, tech, links } = item;
  const shown = courses?.slice(0, MAX_COURSES) ?? [];
  const more = (courses?.length ?? 0) - shown.length;
  // Award cards lead with the project; the event name appears once, under the title, with the date.
  const lead = kind === "award" && project ? project : title;
  const sub = kind === "award" && project ? [title, dates].filter(Boolean).join(" · ") : null;
  const roleLine = [role, teamSize ? `team of ${teamSize}` : null].filter(Boolean).join(" · ");
  return (
    <article
      className={`border-4 border-green bg-background p-4 shadow-[6px_6px_0_0_var(--green)] sm:p-6 ${
        compact ? "pipe:w-full pipe:max-w-4xl pipe:p-5" : ""
      }`}
    >
      {eyebrow && <p className="font-pixel text-xs text-green">{eyebrow}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="border-2 border-green px-2 py-0.5 font-pixel text-xs text-green">{KIND_LABEL[kind]}</span>
        {status === "in-progress" && (
          <span className="border-2 border-orange px-2 py-0.5 font-pixel text-xs text-orange">IN PROGRESS</span>
        )}
      </div>
      <Heading
        className={`mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base ${compact ? "pipe:text-sm" : ""}`}
      >
        {lead}
      </Heading>
      {sub ? (
        <p className={`text-foreground ${compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}`}>{sub}</p>
      ) : (
        <>
          <p className={`text-foreground ${compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}`}>{institution}</p>
          {dates && <p className="text-foreground/80">{dates}</p>}
        </>
      )}
      {award && (
        <p className="mt-3 inline-flex items-center gap-2 border-2 border-orange px-2 py-1 font-pixel text-xs text-orange">
          <Trophy />
          {award.toUpperCase()}
        </p>
      )}
      {summary && <p className={`mt-3 text-foreground ${compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}`}>{summary}</p>}
      {roleLine && <p className={`mt-1 text-foreground/80 ${compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}`}>{roleLine}</p>}
      {tech && tech.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tech stack">
          {tech.map((t) => (
            <li key={t} className="border-2 border-green px-2 text-lg text-green">
              {t}
            </li>
          ))}
        </ul>
      )}
      {shown.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Courses">
          {shown.map((c) => (
            <li key={c}>
              {/* the code is the tag; the full name is the tooltip (hover, focus, tap) and the accessible name */}
              <IconTip text={c} align="left">
                <span className="block border-2 border-cyan px-2 text-lg text-cyan">{courseCode(c)}</span>
              </IconTip>
            </li>
          ))}
          {more > 0 && (
            <li className="border-2 border-foreground/50 px-2 text-lg text-foreground/80">+{more} more</li>
          )}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {certificate && (
          <a
            href={certificate}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View certificate: ${lead} (opens in a new tab)`}
            className={btn}
          >
            VIEW CERTIFICATE
          </a>
        )}
        {links?.github && (
          <a href={links.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub: ${lead} (opens in a new tab)`} className={btn}>
            GITHUB
          </a>
        )}
        {links?.demo && (
          <a href={links.demo} target="_blank" rel="noopener noreferrer" aria-label={`Demo: ${lead} (opens in a new tab)`} className={btn}>
            DEMO
          </a>
        )}
        <Link href={`/education/${slug}`} aria-label={`View details: ${lead}`} className={btn}>
          VIEW DETAILS
        </Link>
      </div>
    </article>
  );
}
