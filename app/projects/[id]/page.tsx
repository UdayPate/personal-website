import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";

const linkBtn =
  "border-2 border-orange px-3 py-1 font-pixel text-[10px] text-orange hover:bg-orange hover:text-background";

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[id]">): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  if (!project) return {};
  return {
    title: `${project.title} | Udayverse`,
    description: project.problem ?? project.summary[0],
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[id]">) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();
  const { title, dates, problem, details, tech, highlight, links } = project;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Link href="/projects" className="font-pixel text-[10px] text-cyan underline">
        &lt; ALL PROJECTS
      </Link>
      <h1 className="mt-6 font-pixel text-lg leading-relaxed text-orange sm:text-xl">{title}</h1>
      {dates && <p className="text-foreground/60">{dates}</p>}
      {problem && <p className="mt-4 text-foreground">{problem}</p>}
      <p className="mt-4 text-foreground/80">{details}</p>

      <h2 className="mt-8 font-pixel text-xs text-green">TECH</h2>
      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tech stack">
        {tech.map((t) => (
          <li key={t} className="border-2 border-green px-2 text-lg text-green">
            {t}
          </li>
        ))}
      </ul>

      {highlight && (
        <>
          <h2 className="mt-8 font-pixel text-xs text-green">HIGHLIGHT</h2>
          <p className="mt-3 border-l-4 border-orange pl-3 text-cyan">{highlight}</p>
        </>
      )}

      {links && (links.github || links.demo || links.screenshots) && (
        <div className="mt-8 flex flex-wrap gap-2">
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
    </main>
  );
}
