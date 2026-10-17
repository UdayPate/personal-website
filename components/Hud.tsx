import { site } from "@/content/site";
import HudLive from "./HudLive";
import HudName from "./HudName";
import PixelIcon from "./PixelIcon";
import type { hudIcons } from "@/art/icons";

// Below 1024px the buttons become a fixed bottom bar (thumb reach, 44px targets,
// iPhone safe area respected); from 1024px up everything sits in the top bar.
const btn =
  "flex min-h-11 flex-1 items-center justify-center border-2 border-cyan px-2 font-pixel text-xs text-cyan hover:bg-cyan hover:text-background lg:min-h-8 lg:pointer-coarse:min-h-11 lg:flex-none lg:px-3";

// Phones show a small pixel icon so five buttons fit at 360px; from 640px the
// full word is shown (text comes from CSS, see .hud-label). The aria-label on
// each link carries the full meaning for screen readers.
function Label({ icon, full }: { icon: keyof typeof hudIcons; full: string }) {
  return (
    <>
      <span aria-hidden className="sm:hidden">
        <PixelIcon name={icon} />
      </span>
      <span aria-hidden className="hud-label hidden sm:inline" data-full={full} />
    </>
  );
}

export default function Hud() {
  return (
    <header
      data-hud
      className="sticky top-0 z-50 border-b-4 border-orange bg-background px-[max(0.75rem,env(safe-area-inset-left))] py-2"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-1">
        <HudName name={site.name} />
        <HudLive />
        <nav
          aria-label="Quick links"
          className="fixed inset-x-0 bottom-0 z-50 flex gap-2 border-t-4 border-orange bg-background px-[max(0.5rem,env(safe-area-inset-left))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:static lg:inset-auto lg:border-0 lg:bg-transparent lg:p-0"
        >
          <a
            className={btn}
            href={site.resume}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Resume (CV PDF, opens in a new tab)"
          >
            <Label icon="resume" full="RESUME" />
          </a>
          <a
            className={btn}
            href={site.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
          >
            <Label icon="github" full="GITHUB" />
          </a>
          <a
            className={btn}
            href={site.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile (opens in a new tab)"
          >
            <Label icon="linkedin" full="LINKEDIN" />
          </a>
          <a className={btn} href="#contact" aria-label="Jump to contact details (email)">
            <Label icon="contact" full="CONTACT" />
          </a>
          <button
            type="button"
            disabled
            aria-label="&gt;_ Terminal (coming soon)"
            title="Terminal arrives in a later phase"
            className="flex min-h-11 flex-1 items-center justify-center border-2 border-foreground/50 px-2 font-pixel text-xs text-foreground/60 lg:min-h-8 lg:pointer-coarse:min-h-11 lg:flex-none lg:px-3"
          >
            <span aria-hidden className="sm:hidden">
              <PixelIcon name="terminal" />
            </span>
            <span aria-hidden className="hidden sm:inline">
              &gt;_
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
