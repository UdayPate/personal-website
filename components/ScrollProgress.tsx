"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { hudStore } from "./hudStore";

// Reads the scroll position every frame and updates the HUD:
//  - DATA QUALITY = how far down the whole page you are (0-100%)
//  - stage label  = whichever [data-station] element sits at the screen center
// "At the screen center" works for both layouts: vertically stacked stations
// (phones, reduced motion) and horizontally scrolling panels (desktop).
export default function ScrollProgress() {
  useEffect(() => {
    const hud = document.querySelector<HTMLElement>("[data-hud]");
    const stations = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));
    let label = { stage: "INTRO", short: "INTRO" };

    const tick = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const quality = max > 0 ? Math.round(Math.min(1, Math.max(0, window.scrollY / max)) * 100) : 100;

      const top = hud?.offsetHeight ?? 0;
      const cx = window.innerWidth / 2;
      const cy = top + (window.innerHeight - top) / 2;
      const active = stations.find((el) => {
        const r = el.getBoundingClientRect();
        return r.left <= cx && cx < r.right && r.top <= cy && cy < r.bottom;
      });

      // Between sections (e.g. on a belt) keep the last label; "INTRO" until the first one is reached.
      if (active) label = { stage: active.dataset.station ?? label.stage, short: active.dataset.stationShort ?? label.short };
      else if (window.scrollY < 8) label = { stage: "INTRO", short: "INTRO" };

      hudStore.set({ ...label, quality });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return null;
}
