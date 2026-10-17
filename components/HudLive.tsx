"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { totalStages } from "@/content/site";
import { hudStore } from "./hudStore";

// Live stage label + DATA QUALITY bar. Only the home page scrolls through the
// pipeline, so other pages show the finished (static) values.
export default function HudLive() {
  const pathname = usePathname();
  const live = useSyncExternalStore(hudStore.subscribe, hudStore.get, hudStore.get);
  const { stage, quality } =
    pathname === "/" ? live : { stage: `${totalStages} STAGES`, quality: 100 };

  return (
    <>
      <span className="whitespace-nowrap font-pixel text-[10px] text-foreground/70 lg:min-w-[15rem]">
        {stage}
      </span>
      <div
        className="flex min-w-[16rem] flex-1 items-center gap-2"
        role="progressbar"
        aria-label="Data quality"
        aria-valuenow={quality}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="font-pixel text-[10px] text-foreground/70">DATA QUALITY</span>
        <div className="h-3 min-w-[4rem] flex-1 border-2 border-green">
          <div className="h-full bg-green" style={{ width: `${quality}%` }} />
        </div>
        <span className="w-10 text-right font-pixel text-[10px] text-green">{quality}%</span>
      </div>
    </>
  );
}
