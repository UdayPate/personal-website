import { site, totalStages } from "@/content/site";
import HudName from "./HudName";

const btn =
  "border-2 border-cyan px-2 py-1 font-pixel text-[10px] text-cyan hover:bg-cyan hover:text-background focus-visible:outline-2 focus-visible:outline-orange";

export default function Hud() {
  return (
    <header className="sticky top-0 z-50 border-b-4 border-orange bg-background/95 px-3 py-2">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-2">
        <HudName name={site.name} />
        <span className="font-pixel text-[10px] text-foreground/70">
          {totalStages} STAGES
        </span>
        <div
          className="flex min-w-[8rem] flex-1 items-center gap-2"
          role="progressbar"
          aria-label="Data quality"
          aria-valuenow={100}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span className="font-pixel text-[10px] text-foreground/70">DATA QUALITY</span>
          <div className="h-3 flex-1 border-2 border-green">
            <div className="h-full w-full bg-green" />
          </div>
          <span className="font-pixel text-[10px] text-green">100%</span>
        </div>
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
