"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { trackStore } from "./trackStore";
import { trackIdsSet } from "./trackIds";
import { PIPE_QUERY } from "./pipeQuery";

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
    // a track hash (#projects ...) is written by the junction with replaceState and does not stop the restore
    const hash = window.location.hash.slice(1);
    const restore = (w.__udayBack || initialRestore) && (!hash || trackIdsSet.has(hash));
    firstMount = false;
    w.__udayBack = false;

    if (restore) {
      let y = 0;
      try {
        y = Number(sessionStorage.getItem(KEY)) || 0;
      } catch {}
      if (y > 0) {
        // Wait until the remembered track's pipeline has created its pin (a few frames), then jump.
        trackStore.hydrate();
        let tries = 0;
        const attempt = () => {
          const ready = !window.matchMedia(PIPE_QUERY).matches || ScrollTrigger.getById(trackStore.get().visible);
          if (!ready && tries++ < 60) return requestAnimationFrame(attempt);
          ScrollTrigger.refresh();
          window.scrollTo(0, y);
          save();
        };
        requestAnimationFrame(() => requestAnimationFrame(attempt));
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
