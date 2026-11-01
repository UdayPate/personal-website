"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";
import Check from "./Check";
import Light, { lightFor } from "./Light";
import PixelIcon from "./PixelIcon";
import { chooseTrack, trackStartY } from "./trackNav";
import { trackStore } from "./trackStore";

// HUD control: jump to another track. Shows the three tracks with signal dots
// (green = the track you are on) and a checkmark on tracks you have visited.
// On the home page it moves the character to the start of that track with a short hop;
// on other pages the entries are links to the home page's track.
export default function SwitchTrack() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const selected = useSyncExternalStore(trackStore.subscribe, () => trackStore.get().selected, () => null);
  const visitedTracks = useSyncExternalStore(trackStore.subscribe, () => trackStore.get().tracksVisited.join(","), () => "").split(",");
  const home = pathname === "/";
  const current = selected;

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const pick = (id: TrackId) => {
    setOpen(false);
    const far = window.scrollY > trackStartY(trackStore.get().visible) + 300;
    chooseTrack(id, { instant: far });
  };

  return (
    <div ref={rootRef} className="relative flex flex-1 lg:flex-none">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="switch-track-menu"
        aria-label="Switch track"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 flex-1 items-center justify-center gap-2 border-2 border-green px-2 font-pixel text-xs text-green hover:bg-green hover:text-background lg:min-h-8 lg:pointer-coarse:min-h-11 lg:flex-none lg:px-3"
      >
        <span aria-hidden className="sm:hidden">
          <PixelIcon name="track" />
        </span>
        <span aria-hidden className="hidden sm:inline">
          SWITCH TRACK
        </span>
        <span aria-hidden className="hidden items-center gap-1 sm:flex">
          {trackMeta.map((t) => (
            <Light key={t.id} state={lightFor(t.id, current)} scale={1} />
          ))}
        </span>
      </button>
      {open && (
        <ul
          id="switch-track-menu"
          className="absolute bottom-full right-0 z-[60] mb-3 w-64 max-w-[calc(100vw-1rem)] border-4 border-green bg-background p-2 shadow-[4px_4px_0_0_var(--green)] lg:bottom-auto lg:left-0 lg:right-auto lg:top-full lg:mb-0 lg:mt-3"
        >
          {trackMeta.map((t) => {
            const visited = visitedTracks.includes(t.id);
            const on = selected === t.id;
            const cls =
              "flex min-h-11 w-full items-center gap-3 border-2 border-transparent px-2 text-left font-pixel text-xs text-cyan hover:border-cyan aria-[current=true]:text-green";
            const inner = (
              <>
                <Light state={lightFor(t.id, selected)} scale={2} />
                <span className="flex-1">{t.label}</span>
                {visited && (
                  <>
                    <span aria-hidden className="text-green">
                      <Check />
                    </span>
                    <span className="sr-only">(visited)</span>
                  </>
                )}
              </>
            );
            return (
              <li key={t.id}>
                {home ? (
                  <button type="button" aria-pressed={on} aria-current={on} className={cls} onClick={() => pick(t.id)}>
                    {inner}
                  </button>
                ) : (
                  <Link href={`/#${t.id}`} className={cls} onClick={() => setOpen(false)}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
