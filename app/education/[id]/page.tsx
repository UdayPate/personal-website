import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { education, getEducation } from "@/content/education";
import { renderMarkdown } from "@/content/markdown";
import { KIND_LABEL, Trophy } from "@/components/EducationCard";

const linkBtn =
  "inline-flex min-h-11 items-center border-2 border-orange px-3 font-pixel text-xs text-orange hover:bg-orange hover:text-background";

export function generateStaticParams() {
  return education.map((e) => ({ id: e.slug }));
}

export async function generateMetadata({ params }: PageProps<"/education/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = getEducation(id);
  if (!item) return {};
  const title = `${item.title} | Udayverse`;
  const description = `${item.title}, ${item.institution}${item.dates ? ` (${item.dates})` : ""}`;
  return { title, description, openGraph: { title, description } };
}

export default async function EducationPage({ params }: PageProps<"/education/[id]">) {
  const { id } = await params;
  const item = getEducation(id);
  if (!item) notFound();
  const { slug, kind, title, institution, dates, courses, certificate, status, award, project, role, teamSize, tech, links, details } = item;
  return (
    <main id="content" className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <Link href={`/#${slug}`} className="inline-flex min-h-11 items-center font-pixel text-xs text-cyan underline">
          &lt; BACK TO STATION
        </Link>
        <Link href="/projects" className="inline-flex min-h-11 items-center font-pixel text-xs text-cyan underline">
          ALL PROJECTS
        </Link>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="border-2 border-green px-2 py-0.5 font-pixel text-xs text-green">{KIND_LABEL[kind]}</span>
        {status === "in-progress" && <span className="border-2 border-orange px-2 py-0.5 font-pixel text-xs text-orange">IN PROGRESS</span>}
      </div>
      <h1 className="mt-3 font-pixel text-lg leading-relaxed text-orange sm:text-xl">{title}</h1>
      <p className="text-foreground">{institution}</p>
      {dates && <p className="text-foreground/80">{dates}</p>}
      {award && (
        <p className="mt-4 inline-flex items-center gap-2 border-2 border-orange px-2 py-1 font-pixel text-xs text-orange">
          <Trophy />
          {award.toUpperCase()}
        </p>
      )}
      {project && (
        <p className="mt-4 text-foreground">
          Project: <span className="text-cyan">{project}</span>
        </p>
      )}
      {role && <p className="text-foreground/80">Role: {role}</p>}
      {teamSize && <p className="text-foreground/80">Team size: {teamSize}</p>}
      {details && <div dangerouslySetInnerHTML={{ __html: renderMarkdown(details) }} />}

      {courses && (
        <>
          <h2 className="mt-8 font-pixel text-xs text-green">COURSES</h2>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Courses">
            {courses.map((c) => (
              <li key={c} className="border-2 border-cyan px-2 text-lg text-cyan">
                {c}
              </li>
            ))}
          </ul>
        </>
      )}
      {tech && (
        <>
          <h2 className="mt-8 font-pixel text-xs text-green">TECH</h2>
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tech stack">
            {tech.map((t) => (
              <li key={t} className="border-2 border-green px-2 text-lg text-green">
                {t}
              </li>
            ))}
          </ul>
        </>
      )}
      {(certificate || links?.github || links?.demo || links?.screenshots) && (
        <div className="mt-8 flex flex-wrap gap-2">
          {certificate && (
            <a className={linkBtn} href={certificate} target="_blank" rel="noopener noreferrer" aria-label={`View certificate: ${title} (opens in a new tab)`}>
              VIEW CERTIFICATE
            </a>
          )}
          {links?.github && (
            <a className={linkBtn} href={links.github} target="_blank" rel="noopener noreferrer">
              GITHUB
            </a>
          )}
          {links?.demo && (
            <a className={linkBtn} href={links.demo} target="_blank" rel="noopener noreferrer">
              DEMO
            </a>
          )}
          {links?.screenshots && (
            <a className={linkBtn} href={links.screenshots} target="_blank" rel="noopener noreferrer">
              SCREENSHOTS
            </a>
          )}
        </div>
      )}
    </main>
  );
}
