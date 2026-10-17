import Link from "next/link";
import { pipeline, site } from "@/content/site";
import Station from "@/components/Station";
import Pipeline from "@/components/Pipeline";
import IntroArt from "@/components/IntroArt";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollMemory from "@/components/ScrollMemory";

export default function Home() {
  return (
    <main className="w-full flex-1 pb-16">
      <ScrollProgress />
      <section className="px-4 py-12 text-center sm:py-16 pipe:flex pipe:min-h-[calc(100svh-var(--hud-h))] pipe:flex-col pipe:justify-center pipe:py-6">
        <h1 className="font-pixel text-2xl leading-relaxed text-orange sm:text-4xl">
          {site.name.toUpperCase()}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-2xl text-foreground">{site.pitch}</p>
        <p className="mt-4 font-pixel text-xs leading-relaxed text-cyan sm:text-xs">
          {site.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="#aislesave"
            className="inline-flex min-h-11 items-center border-4 border-green px-4 font-pixel text-xs text-green hover:bg-green hover:text-background"
          >
            START PIPELINE
          </a>
          <Link
            href="/projects"
            className="inline-flex min-h-11 items-center border-4 border-cyan px-4 font-pixel text-xs text-cyan hover:bg-cyan hover:text-background"
          >
            ALL PROJECTS
          </Link>
        </div>
        <IntroArt />
      </section>

      <Pipeline>
        {pipeline.map((item) => (
          <Station key={item.slug} item={item} />
        ))}
      </Pipeline>
      <ScrollMemory />

      <section id="about" className="mx-auto max-w-3xl scroll-mt-28 px-4 py-10">
        <p className="font-pixel text-xs text-green">LOAD COMPLETE</p>
        <h2 className="mt-2 font-pixel text-base text-orange">ABOUT</h2>
        <p className="mt-4 text-foreground/90">{site.about}</p>
      </section>

      <section id="contact" className="mx-auto max-w-3xl scroll-mt-28 px-4 py-6">
        <h2 className="font-pixel text-base text-orange">CONTACT</h2>
        <ul className="mt-4 space-y-2">
          <li>
            Email:{" "}
            <a className="inline-block py-1 text-cyan underline" href={`mailto:${site.links.email}`}>
              {site.links.email}
            </a>
          </li>
          <li>
            LinkedIn:{" "}
            <a className="inline-block py-1 text-cyan underline" href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
              upatelda
            </a>
          </li>
          <li>
            GitHub:{" "}
            <a className="inline-block py-1 text-cyan underline" href={site.links.github} target="_blank" rel="noopener noreferrer">
              UdayPate
            </a>
          </li>
          <li>
            <a className="inline-block py-1 text-cyan underline" href={site.resume} target="_blank" rel="noopener noreferrer">
              Resume (PDF)
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
