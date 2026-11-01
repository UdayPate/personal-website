import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";

// The branch point after the short intake belt. Placeholder art: a control box with
// three signal lights. In static mode (no JS / reduced motion) the three entries are
// plain links to each track's section.
export default function Junction({ counts }: { counts: Record<TrackId, number> }) {
  return (
    <section id="junction" data-station="JUNCTION" data-station-short="JUNCTION" className="mx-auto w-full max-w-3xl scroll-mt-28 px-4 py-10">
      <div className="border-4 border-orange bg-background p-4 shadow-[6px_6px_0_0_var(--orange)] sm:p-6">
        <p className="font-pixel text-xs text-green">JUNCTION</p>
        <h2 className="mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base">CHOOSE YOUR TRACK</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {trackMeta.map((t) => (
            <li key={t.id}>
              <a
                href={`#${t.id}`}
                className="flex min-h-14 w-full items-center justify-between gap-3 border-2 border-cyan px-3 py-2 font-pixel text-xs text-cyan hover:bg-cyan hover:text-background"
              >
                <span>{t.label}</span>
                <span className="text-foreground/70">{counts[t.id]} STATIONS</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
