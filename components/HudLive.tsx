"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { hudStore } from "./hudStore";

// Live stage label + DATA QUALITY bar. Only the home page scrolls through the
// pipeline, so other pages show the finished (static) values.
export default function HudLive() {
  const pathname = usePathname();
  const live = useSyncExternalStore(hudStore.subscribe, hudStore.get, hudStore.get);
  const { stage, short, quality } =
    pathname === "/" ? live : { stage: "ALL TRACKS", short: "ALL TRACKS", quality: 100 };

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
          aria-valuetext={`${quality}% — ${stage}`}
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
