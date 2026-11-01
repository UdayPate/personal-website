import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";

const link =
  "inline-flex min-h-11 items-center gap-2 border-2 border-cyan px-3 font-pixel text-xs text-cyan hover:bg-cyan hover:text-background lg:min-h-9 lg:pointer-coarse:min-h-11";

// The last panel of every track: points to the other tracks, or on to LOAD COMPLETE.
export default function Signpost({ track }: { track: TrackId }) {
  const me = trackMeta.find((t) => t.id === track)!;
  return (
    <section
      id={`${track}-end`}
      data-panel
      data-station={`${me.label} · TRACK END`}
      data-station-short="TRACK END"
      data-track={track}
      className="mx-auto w-full max-w-3xl scroll-mt-28 border-l-8 border-orange/60 py-8 pl-4 pr-4 sm:pl-8 pipe:relative pipe:flex pipe:h-full pipe:w-screen pipe:shrink-0 pipe:items-center pipe:justify-center pipe:mx-0 pipe:max-w-none pipe:border-l-0 pipe:px-[6vw] pipe:pb-[5.5rem] pipe:pt-0"
    >
      <aside className="border-4 border-orange bg-background p-4 shadow-[6px_6px_0_0_var(--orange)] sm:p-6 pipe:w-full pipe:max-w-2xl pipe:p-5">
        <p className="font-pixel text-xs text-green">END OF {me.label} TRACK</p>
        <h3 className="mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base">Where to next?</h3>
        <ul className="mt-4 flex flex-wrap gap-3">
          {trackMeta
            .filter((t) => t.id !== track)
            .map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`} data-track-link={t.id} className={link}>
                  {t.label}
                </a>
              </li>
            ))}
          <li>
            <a href="#merge" data-finish className="inline-flex min-h-11 items-center border-2 border-green px-3 font-pixel text-xs text-green hover:bg-green hover:text-background lg:min-h-9 lg:pointer-coarse:min-h-11">
              FINISH
            </a>
          </li>
        </ul>
      </aside>
    </section>
  );
}
