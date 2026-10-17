import type { Project } from "@/content/projects";

const linkBtn =
  "border-2 border-orange px-3 py-1 font-pixel text-[10px] text-orange hover:bg-orange hover:text-background";

export default function ProjectCard({ project, eyebrow }: { project: Project; eyebrow?: string }) {
  const { title, dates, problem, built, tech, highlight, links } = project;
  return (
    <article className="border-4 border-cyan bg-background p-4 shadow-[6px_6px_0_0_var(--cyan)] sm:p-6">
      {eyebrow && <p className="font-pixel text-[10px] text-green">{eyebrow}</p>}
      <h3 className="mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base">{title}</h3>
      {dates && <p className="text-foreground/60">{dates}</p>}
      {problem && <p className="mt-3 text-foreground">{problem}</p>}
      <p className="mt-3 text-foreground/80">{built}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
        {tech.map((t) => (
          <li key={t} className="border-2 border-green px-2 text-lg text-green">
            {t}
          </li>
        ))}
      </ul>
      {highlight && (
        <p className="mt-4 border-l-4 border-orange pl-3 text-cyan">{highlight}</p>
      )}
      {links && (links.github || links.demo || links.screenshots) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {links.github && (
            <a className={linkBtn} href={links.github} target="_blank" rel="noopener noreferrer">
              GITHUB
            </a>
          )}
          {links.demo && (
            <a className={linkBtn} href={links.demo} target="_blank" rel="noopener noreferrer">
              DEMO
            </a>
          )}
          {links.screenshots && (
            <a className={linkBtn} href={links.screenshots} target="_blank" rel="noopener noreferrer">
              SCREENSHOTS
            </a>
          )}
        </div>
      )}
    </article>
  );
}
