"use client";

import { useEffect } from "react";
import { trackIdsSet } from "./trackIds";
import { chooseTrack, goToStation, setHash, trackStartY } from "./trackNav";
import { DEFAULT_TRACK, trackStore } from "./trackStore";
import type { TrackId } from "@/content/types";

let firstMount = true;

// Wires the page together (renders nothing):
//  - mirrors the visible track onto #tracks[data-active], which the CSS uses to show one track at a time
//  - deep links: /#projects, /#experience, /#education (and /#station slugs)
//  - links to a track or station inside the page (signposts, junction links, skip link)
//  - scrolling past the junction without choosing selects Projects
export default function TrackController() {
  useEffect(() => {
    const tracksEl = document.getElementById("tracks")!;
    const sync = () => {
      tracksEl.dataset.active = trackStore.get().visible;
    };
    const unsub = trackStore.subscribe(sync);
    trackStore.hydrate();
    sync();

    const hashTarget = () => decodeURIComponent(window.location.hash.slice(1));
    const stationTrack = (slug: string) => document.querySelector<HTMLElement>(`[data-slug="${CSS.escape(slug)}"]`)?.dataset.track as TrackId | undefined;

    // Deep links on load. (Browser Back/reload without a hash is handled by ScrollMemory.)
    // On browser Back/reload the URL may carry the track we wrote with replaceState; ScrollMemory then
    // restores the exact scroll position, so a track hash must not scroll to the track start.
    const h = hashTarget();
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const restoring = ((window as unknown as { __udayBack?: boolean }).__udayBack || (firstMount && (nav?.type === "reload" || nav?.type === "back_forward"))) && (!h || trackIdsSet.has(h));
    firstMount = false;
    if (!restoring) {
      if (h && trackIdsSet.has(h)) chooseTrack(h as TrackId, { instant: true });
      else if (h && stationTrack(h)) goToStation(h, stationTrack(h)!);
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      const id = a?.getAttribute("href")?.slice(1);
      if (!a || !id || e.defaultPrevented) return;
      // static layout (reduced motion): plain anchors do the job
      if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
      if (trackIdsSet.has(id)) {
        e.preventDefault();
        // far down the current track: jump (with a short hop) instead of a long smooth scroll
        const fromFar = window.scrollY > trackStartY(trackStore.get().visible) + 300;
        chooseTrack(id as TrackId, { instant: fromFar });
      } else if (id === "merge") {
        e.preventDefault();
        const top = document.getElementById("merge")!.getBoundingClientRect().top + window.scrollY - (document.querySelector<HTMLElement>("[data-hud]")?.offsetHeight ?? 56);
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        const t = stationTrack(id);
        if (t && t !== trackStore.get().visible) {
          e.preventDefault();
          goToStation(id, t);
        }
      }
    };
    document.addEventListener("click", onClick);

    // The visitor edits the #hash in the address bar (a same-page navigation).
    const onHashChange = () => {
      const id = hashTarget();
      if (id && trackIdsSet.has(id)) chooseTrack(id as TrackId, { instant: window.scrollY > trackStartY(trackStore.get().visible) + 300 });
      else if (id && stationTrack(id)) goToStation(id, stationTrack(id)!);
    };
    window.addEventListener("hashchange", onHashChange);

    // Scrolling past the junction without choosing picks the default track.
    let raf = 0;
    const onScroll = () => {
      if (raf || trackStore.get().selected) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const j = document.getElementById("junction");
        const hudH = document.querySelector<HTMLElement>("[data-hud]")?.offsetHeight ?? 56;
        if (j && !trackStore.get().selected && j.getBoundingClientRect().bottom < hudH + 10) {
          trackStore.select(DEFAULT_TRACK);
          setHash(DEFAULT_TRACK);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      unsub();
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
