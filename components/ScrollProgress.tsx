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
    const pipeline = document.getElementById("pipeline");
    const stations = Array.from(document.querySelectorAll<HTMLElement>("[data-station]"));

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

      let stage = "INTRO";
      if (active) stage = active.dataset.station ?? stage;
      else if (pipeline && pipeline.getBoundingClientRect().bottom < cy) stage = "STAGE 5/5 · LOAD COMPLETE";

      hudStore.set({ stage, quality });
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return null;
}
