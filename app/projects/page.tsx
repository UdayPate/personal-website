import type { Metadata } from "next";
import Link from "next/link";
import { checkpoints, projects } from "@/content/projects";
import { site } from "@/content/site";
import ProjectCard from "@/components/ProjectCard";
import CheckpointCard from "@/components/CheckpointCard";

export const metadata: Metadata = {
  title: "Projects | Udayverse",
  description: `All projects and experience from ${site.name}: data engineering, analytics, ML and software.`,
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <Link href="/" className="font-pixel text-[10px] text-cyan underline">
        &lt; BACK TO PIPELINE
      </Link>
      <h1 className="mt-6 font-pixel text-xl text-orange">PROJECTS</h1>
      <p className="mt-2 text-foreground/70">Everything in one plain list.</p>

      <h2 className="mt-10 font-pixel text-sm text-green">PROJECTS</h2>
      <div className="mt-4 space-y-8">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>

      <h2 className="mt-12 font-pixel text-sm text-green">EXPERIENCE</h2>
      <div className="mt-4 space-y-8">
        {checkpoints.map((c) => (
          <CheckpointCard key={c.slug} checkpoint={c} />
        ))}
      </div>
    </main>
  );
}
