"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { hudStore } from "./hudStore";
import { trackStore } from "./trackStore";

// Live stage label + DATA QUALITY bar.
//  - the label follows the station on screen (home page only; other pages show "ALL TRACKS")
//  - DATA QUALITY = distinct stations visited across all three tracks / all stations, remembered
//    for the visit (see trackStore), so other pages show the same value
export default function HudLive({ totalStations }: { totalStations: number }) {
  const pathname = usePathname();
  const live = useSyncExternalStore(hudStore.subscribe, hudStore.get, hudStore.get);
  const visited = useSyncExternalStore(trackStore.subscribe, () => trackStore.get().visited.length, () => 0);
  useEffect(() => trackStore.hydrate(), []);

  const quality = Math.min(100, Math.round((visited / totalStations) * 100));
  const { stage, short } = pathname === "/" ? live : { stage: "ALL TRACKS", short: "ALL TRACKS" };

  return (
    <>
      {/* Phones: name on the left, stage on the right, bar on its own row. */}
      <span className="ml-auto whitespace-nowrap font-pixel text-xs text-foreground/70 lg:order-5 lg:ml-0 lg:mr-6 lg:min-w-[19rem]">
        <span className="sm:hidden">{short}</span>
        <span className="hidden sm:inline">{stage}</span>
      </span>
      <div className="flex basis-full items-center gap-2 lg:order-6 lg:min-w-[16rem] lg:flex-1 lg:basis-auto">
        <span aria-hidden className="font-pixel text-xs text-foreground/70">
          DATA QUALITY
        </span>
        <div
          role="progressbar"
          aria-label="Data quality"
          aria-valuenow={quality}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${quality}% (${visited} of ${totalStations} stations visited), ${stage}`}
          className="h-3 min-w-[4rem] flex-1 border-2 border-green"
        >
          <div className="h-full bg-green" style={{ width: `${quality}%` }} />
        </div>
        <span aria-hidden className="w-12 text-right font-pixel text-xs text-green">
          {quality}%
        </span>
      </div>
    </>
  );
}
