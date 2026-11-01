"use client";

import { useRef, useSyncExternalStore } from "react";
import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";
import { trackStore } from "./trackStore";
import { chooseTrack } from "./trackNav";

// The real junction controls (select mode). Three buttons with signal dots; the chosen
// one turns green, then the character rolls onto that track. Placeholder art.
export default function JunctionButtons({ counts }: { counts: Record<TrackId, number> }) {
  const selected = useSyncExternalStore(trackStore.subscribe, () => trackStore.get().selected, () => null);
  const rollRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLUListElement>(null);

  // Tell screen readers which track is selected (also when the default is picked automatically).
  const announce = selected ? `${trackMeta.find((t) => t.id === selected)!.heading} track selected` : "";

  const onChoose = (id: TrackId, button: HTMLElement) => {
    // the placeholder character rolls from the intake side toward the chosen branch, then enters the track
    const roll = rollRef.current;
    const row = rowRef.current;
    if (roll && row && window.getComputedStyle(roll).display !== "none") {
      const b = button.getBoundingClientRect();
      const r = roll.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (r.left + r.width / 2);
      roll.animate(
        [
          { transform: "translateX(0)", opacity: 1 },
          { transform: `translateX(${dx}px)`, opacity: 1, offset: 0.7 },
          { transform: `translateX(${dx}px)`, opacity: 0 },
        ],
        { duration: 700, easing: "ease-in-out" },
      );
    }
    chooseTrack(id, { delay: 450 });
  };

  return (
    <div className="only-select">
      <div ref={rollRef} aria-hidden className="char pointer-events-none mt-3 hidden h-[80px] w-16 sm:block" data-stage="1" data-anim="idle">
        <div className="sprite" />
      </div>
      <ul ref={rowRef} className="mt-4 grid gap-3 sm:grid-cols-3">
        {trackMeta.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              aria-pressed={selected === t.id}
              aria-label={`${t.heading} track, ${counts[t.id]} stations`}
              onClick={(e) => onChoose(t.id, e.currentTarget)}
              className="group flex min-h-14 w-full items-center justify-between gap-3 border-2 border-cyan px-3 py-2 text-left font-pixel text-xs text-cyan hover:bg-cyan hover:text-background aria-pressed:border-green aria-pressed:text-green aria-pressed:hover:bg-green aria-pressed:hover:text-background"
            >
              <span className="flex items-center gap-3">
                <span aria-hidden className="signal-dot" data-on={selected === t.id} />
                {t.label}
              </span>
              <span aria-hidden className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
                {counts[t.id]} STATIONS
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p role="status" aria-live="polite" className="sr-only">
        {announce}
      </p>
    </div>
  );
}
