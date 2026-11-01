import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { checkpoints, getCheckpoint } from "@/content/projects";
import { renderMarkdown } from "@/content/markdown";

export function generateStaticParams() {
  return checkpoints.map((c) => ({ id: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/experience/[id]">): Promise<Metadata> {
  const { id } = await params;
  const item = getCheckpoint(id);
  if (!item) return {};
  const title = `${item.title} | Udayverse`;
  const description = item.bullets[0];
  return { title, description, openGraph: { title, description } };
}

export default async function ExperiencePage({ params }: PageProps<"/experience/[id]">) {
  const { id } = await params;
  const item = getCheckpoint(id);
  if (!item) notFound();
  const { title, dates, bullets, details, slug } = item;
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
      <p className="mt-6 font-pixel text-xs text-green">EXPERIENCE</p>
      <h1 className="mt-2 font-pixel text-lg leading-relaxed text-orange sm:text-xl">{title}</h1>
      <p className="text-foreground/80">{dates}</p>
      <ul className="mt-4 list-none space-y-2">
        {bullets.map((b) => (
          <li key={b} className="text-foreground/80 before:mr-2 before:text-green before:content-['>']">
            {b}
          </li>
        ))}
      </ul>
      {details && <div dangerouslySetInnerHTML={{ __html: renderMarkdown(details) }} />}
    </main>
  );
}
