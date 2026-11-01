"use client";

import { useSyncExternalStore } from "react";
import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";
import Light from "./Light";
import { trackStore } from "./trackStore";

// The last panel of every track: a pixel signpost with arrow boards for the other tracks and FINISH
// (which goes to the merge and LOAD COMPLETE). Each board has a signal light: yellow = not visited yet,
// green (white ring + check) = visited. FINISH turns green once every station has been reached.
export default function Signpost({ track, totalStations }: { track: TrackId; totalStations: number }) {
  const me = trackMeta.find((t) => t.id === track)!;
  const visitedTracks = useSyncExternalStore(trackStore.subscribe, () => trackStore.get().tracksVisited.join(","), () => "").split(",");
  const visitedCount = useSyncExternalStore(trackStore.subscribe, () => trackStore.get().visited.length, () => 0);
  const all = visitedCount >= totalStations;
  return (
    <section
      id={`${track}-end`}
      data-panel
      data-station={`${me.label} · TRACK END`}
      data-station-short="TRACK END"
      data-track={track}
      className="mx-auto w-full max-w-3xl scroll-mt-28 border-l-8 border-orange/60 py-8 pl-4 pr-4 sm:pl-8 pipe:relative pipe:flex pipe:h-full pipe:w-screen pipe:shrink-0 pipe:items-center pipe:justify-center pipe:mx-0 pipe:max-w-none pipe:border-l-0 pipe:px-[6vw] pipe:pb-[5.5rem] pipe:pt-0"
    >
      <aside className="border-4 border-orange bg-background p-4 shadow-[6px_6px_0_0_var(--orange)] sm:p-5 pipe:w-full pipe:max-w-2xl">
        <p className="font-pixel text-xs text-green">END OF {me.label} TRACK</p>
        <h3 className="mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base">Where to next?</h3>
        <div className="mt-4 flex items-start">
          <div aria-hidden className="post hidden sm:block" />
          <ul className="flex flex-col gap-3 sm:pt-3">
            {trackMeta
              .filter((t) => t.id !== track)
              .map((t) => {
                const visited = visitedTracks.includes(t.id);
                return (
                  <li key={t.id}>
                    <a href={`#${t.id}`} data-track-link={t.id} className="board board-cyan">
                      <Light state={visited ? "green" : "yellow"} scale={2} />
                      {t.label}
                      {visited && <span className="sr-only">(visited)</span>}
                    </a>
                  </li>
                );
              })}
            <li>
              <a href="#merge" data-finish className="board board-green">
                <Light state={all ? "green" : "yellow"} scale={2} />
                FINISH
                {all && <span className="sr-only">(all stations visited)</span>}
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  );
}
