import { site } from "@/content/site";
import HudLive from "./HudLive";
import HudName from "./HudName";

const btn =
  "border-2 border-cyan px-2 py-1 font-pixel text-[10px] text-cyan hover:bg-cyan hover:text-background focus-visible:outline-2 focus-visible:outline-orange";

export default function Hud() {
  return (
    <header data-hud className="sticky top-0 z-50 border-b-4 border-orange bg-background/95 px-3 py-2">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2">
        <HudName name={site.name} />
        <HudLive />
        <nav aria-label="Quick links" className="flex flex-wrap gap-2">
          <a className={btn} href={site.resume} target="_blank" rel="noopener noreferrer">
            RESUME
          </a>
          <a className={btn} href={site.links.github} target="_blank" rel="noopener noreferrer">
            GITHUB
          </a>
          <a className={btn} href={site.links.linkedin} target="_blank" rel="noopener noreferrer">
            LINKEDIN
          </a>
          <a className={btn} href="#contact">
            CONTACT
          </a>
          <button
            type="button"
            disabled
            title="Terminal arrives in a later phase"
            className="border-2 border-foreground/30 px-2 py-1 font-pixel text-[10px] text-foreground/30"
          >
            &gt;_
          </button>
        </nav>
      </div>
    </header>
  );
}
