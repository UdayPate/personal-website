import Link from "next/link";
import { pipeline, site } from "@/content/site";
import Station from "@/components/Station";
import Pipeline from "@/components/Pipeline";
import IntroArt from "@/components/IntroArt";
import ScrollProgress from "@/components/ScrollProgress";
import ScrollMemory from "@/components/ScrollMemory";
import AboutSprite from "@/components/AboutSprite";
import PixelIcon from "@/components/PixelIcon";

const contactLinks = [
  { label: "EMAIL", icon: "contact", href: `mailto:${site.links.email}`, aria: `Email ${site.links.email}`, external: false },
  { label: "LINKEDIN", icon: "linkedin", href: site.links.linkedin, aria: "LinkedIn profile (opens in a new tab)", external: true },
  { label: "GITHUB", icon: "github", href: site.links.github, aria: "GitHub profile (opens in a new tab)", external: true },
  { label: "RESUME", icon: "resume", href: site.resume, aria: "Resume (PDF, opens in a new tab)", external: true },
] as const;

export default function Home() {
  return (
    <main className="w-full flex-1 pb-16">
      <ScrollProgress />
      <section className="px-4 py-8 text-center sm:py-12 pipe:flex pipe:min-h-[calc(100svh-var(--hud-h))] pipe:flex-col pipe:justify-center pipe:py-6">
        <h1 className="font-pixel text-2xl leading-relaxed text-orange sm:text-4xl pipe:text-5xl">
          {site.name.toUpperCase()}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-2xl text-foreground pipe:max-w-2xl pipe:text-3xl">{site.pitch}</p>
        <p className="mt-4 font-pixel text-xs leading-relaxed text-cyan sm:text-xs pipe:text-sm">
          {site.subtitle}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 pipe:mt-10">
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

      <section id="about" className="mx-auto max-w-5xl scroll-mt-28 px-4 py-10">
        <div className="grid items-center gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div>
            <p className="font-pixel text-xs text-green">LOAD COMPLETE</p>
            <h2 className="mt-2 font-pixel text-base text-orange">ABOUT</h2>
            <p className="mt-4 text-foreground/90">{site.about}</p>
          </div>
          <div className="mx-auto w-full max-w-sm border-4 border-green bg-background p-4 shadow-[6px_6px_0_0_var(--green)]">
            <p className="font-pixel text-xs text-green">READY FOR QUERIES</p>
            <div className="mt-4 flex justify-center">
              <AboutSprite />
            </div>
            <div aria-hidden className="belt !static !h-4 !border-t-4" />
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-5xl scroll-mt-28 px-4 py-6 pb-10">
        <div className="grid items-center gap-6 border-t-4 border-orange/60 pt-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <div>
            <h2 className="font-pixel text-base text-orange">CONTACT</h2>
            <p className="mt-4 text-foreground/90">
              The quickest way to reach me is email: <span className="text-cyan">{site.links.email}</span>
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-3">
            {contactLinks.map((c) => (
              <li key={c.label} className="flex">
                <a
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 border-2 border-cyan px-3 py-2 font-pixel text-xs text-cyan shadow-[3px_3px_0_0_var(--cyan)] hover:bg-cyan hover:text-background"
                  href={c.href}
                  aria-label={c.aria}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <PixelIcon name={c.icon} className="h-5 w-5" />
                  {c.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
