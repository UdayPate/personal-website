import Link from "next/link";
import type { EducationItem } from "@/content/types";

export const KIND_LABEL = { degree: "DEGREE", certificate: "CERTIFICATE", award: "AWARD", course: "COURSE" } as const;
const MAX_COURSES = 4;

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
  const { slug, kind, title, institution, dates, courses, certificate, status, award } = item;
  const shown = courses?.slice(0, MAX_COURSES) ?? [];
  const more = (courses?.length ?? 0) - shown.length;
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
        {title}
      </Heading>
      <p className={`text-foreground ${compact ? "pipe:text-[1.3rem] pipe:leading-[1.15]" : ""}`}>{institution}</p>
      {dates && <p className="text-foreground/80">{dates}</p>}
      {award && (
        <p className="mt-3 inline-flex items-center gap-2 border-2 border-orange px-2 py-1 font-pixel text-xs text-orange">
          <Trophy />
          {award.toUpperCase()}
        </p>
      )}
      {shown.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Courses">
          {shown.map((c) => (
            <li key={c} className={`border-2 border-cyan px-2 text-lg text-cyan ${compact ? "pipe:text-base pipe:leading-[1.15]" : ""}`}>
              {c}
            </li>
          ))}
          {more > 0 && (
            <li className="border-2 border-foreground/50 px-2 text-lg text-foreground/80 pipe:text-base">+{more} more</li>
          )}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {certificate && (
          <a
            href={certificate}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View certificate: ${title} (opens in a new tab)`}
            className={btn}
          >
            VIEW CERTIFICATE
          </a>
        )}
        <Link href={`/education/${slug}`} aria-label={`View details: ${title}`} className={btn}>
          VIEW DETAILS
        </Link>
      </div>
    </article>
  );
}
