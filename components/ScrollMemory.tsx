"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const KEY = "udayverse:home-y";
let firstMount = true;

// Remembers the home page's scroll position and puts the visitor back there on
// browser Back (or reload). The pinned pipeline adds scroll length after the
// first paint, so the browser's own restoration would be clamped too short.
export default function ScrollMemory() {
  useEffect(() => {
    let raf = 0;
    const save = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        try {
          sessionStorage.setItem(KEY, String(Math.round(window.scrollY)));
        } catch {}
      });
    };

    const w = window as unknown as { __udayBack?: boolean };
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const initialRestore = firstMount && (nav?.type === "reload" || nav?.type === "back_forward");
    const restore = (w.__udayBack || initialRestore) && !window.location.hash;
    firstMount = false;
    w.__udayBack = false;

    if (restore) {
      let y = 0;
      try {
        y = Number(sessionStorage.getItem(KEY)) || 0;
      } catch {}
      if (y > 0) {
        // Wait a couple of frames so Pipeline has created its pin, then jump.
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            window.scrollTo(0, y);
            save();
          }),
        );
      }
    }

    window.addEventListener("scroll", save, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", save);
    };
  }, []);
  return null;
}
