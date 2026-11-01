import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Station not found | Udayverse" };

// Shown for any address that is not a page (project, experience, education, /projects, /).
export default function NotFound() {
  return (
    <main id="content" className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="font-pixel text-xs text-green">ERROR 404</p>
      <h1 className="mt-3 font-pixel text-xl leading-relaxed text-orange sm:text-3xl">STATION NOT FOUND</h1>
      <p className="mt-4 text-foreground/90">This page is not on any track. The glitchy fragment below got lost, too.</p>
      <div aria-hidden className="char mt-8" data-stage="1" data-anim="idle" style={{ ["--s" as string]: 3 }}>
        <div className="sprite" />
      </div>
      <div aria-hidden className="belt-strip mt-1 w-full max-w-md" />
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/#junction"
          className="inline-flex min-h-11 items-center border-4 border-green px-4 font-pixel text-xs text-green hover:bg-green hover:text-background"
        >
          BACK TO THE JUNCTION
        </Link>
        <Link
          href="/projects"
          className="inline-flex min-h-11 items-center border-4 border-cyan px-4 font-pixel text-xs text-cyan hover:bg-cyan hover:text-background"
        >
          ALL PROJECTS
        </Link>
      </div>
    </main>
  );
}
