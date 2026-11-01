"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";
import Light, { lightFor } from "./Light";
import { chooseTrack } from "./trackNav";
import { trackStore } from "./trackStore";

// Sprite sheet poses (public/sprites/lever.png): 0 overshoot-left, 1 left, 2 centre (from the right),
// 3 centre, 4 centre (from the left), 5 right, 6 overshoot-right. Left = Education, centre = Experience, right = Projects.
const POSE: Record<TrackId, number> = { education: 1, experience: 3, projects: 5 };
const RAIL_Y: Record<TrackId, number> = { education: 8, experience: 40, projects: 72 }; // rail centre lines in the rails sprite
const RS = 4; // rails sprite scale (CSS --rs)
const SNAP_MS = 80; // time per lever frame

/** Frames of a snap from one pose to another: start, overshoot past the target, target. */
function snapFrames(from: number, to: number): number[] {
  const over = to === 1 ? 0 : to === 5 ? 6 : from < 3 ? 4 : 2;
  return [from, over, to];
}

const SCROLL_KEYS = new Set(["PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End", " ", "Spacebar"]);

// The junction: a riveted control box with three buttons (each with a signal light) and a lever,
// above the belt that splits into three rails. Choosing a track plays a ~1 second sequence:
// the lever snaps (with a puff of dust), the lights change, the switch carriage slides to the rail,
// then the character leans toward it, hops and rolls away; then the page scrolls to the track.
// Any scrolling by the visitor skips the rest. Phones show only the box with stacked buttons;
// without JS or with reduced motion the box shows plain links and the lever rests in the middle.
export default function JunctionStage({ counts }: { counts: Record<TrackId, number> }) {
  const selected = useSyncExternalStore(trackStore.subscribe, () => trackStore.get().selected, () => null);
  const [leverOverride, setLeverOverride] = useState<number | null>(null);
  const [puff, setPuff] = useState(0);
  const [rolling, setRolling] = useState(false);
  const charRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finish = useRef<(() => void) | null>(null);

  useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    finish.current?.();
  }, []);

  const leverFrame = leverOverride ?? (selected ? POSE[selected] : 3);
  const railOf = selected ?? "experience"; // the carriage rests on the middle rail until a track is chosen
  const announce = selected ? `${trackMeta.find((t) => t.id === selected)!.heading} track selected` : "";

  const choose = (id: TrackId) => {
    const art = window.matchMedia("(min-width: 1024px)").matches && window.matchMedia("(prefers-reduced-motion: no-preference)").matches;
    if (!art) {
      chooseTrack(id, { delay: 250 });
      return;
    }
    // A scroll / key press by the visitor jumps to the final state and cancels the automatic scroll.
    let cancelNow: () => void = () => {};
    const cancel = new Promise<void>((res) => (cancelNow = res));
    const stop = () => {
      window.removeEventListener("wheel", onUser);
      window.removeEventListener("touchmove", onUser);
      window.removeEventListener("keydown", onKey);
    };
    const onUser = () => {
      cancelNow();
      done();
    };
    const onKey = (e: KeyboardEvent) => SCROLL_KEYS.has(e.key) && onUser();
    window.addEventListener("wheel", onUser, { passive: true });
    window.addEventListener("touchmove", onUser, { passive: true });
    window.addEventListener("keydown", onKey);

    timers.current.forEach(clearTimeout);
    timers.current = [];
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    const frames = snapFrames(selected ? POSE[selected] : 3, POSE[id]);

    // character: glance toward the rail (lean), hop, roll along the split rail and off
    const el = charRef.current;
    const dy = (RAIL_Y[id] - 40) * RS;
    const rot = id === "education" ? -7 : id === "projects" ? 7 : 0;
    const anim = el?.animate(
      [
        { transform: "none", opacity: 1, offset: 0 },
        { transform: `rotate(${rot}deg)`, opacity: 1, offset: 0.2 },
        { transform: `translateY(-30px) rotate(${rot}deg)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${50 * RS}px, 0)`, opacity: 1, offset: 0.62 },
        { transform: `translate(${82 * RS}px, ${dy}px)`, opacity: 1, offset: 0.85 },
        { transform: `translate(${150 * RS}px, ${dy}px)`, opacity: 0, offset: 1 },
      ],
      { duration: 700, delay: 250, easing: "linear", fill: "both" },
    );
    setRolling(true);
    if (frames[0] !== frames[2]) {
      setLeverOverride(frames[0]);
      at(SNAP_MS, () => { setLeverOverride(frames[1]); setPuff((p) => p + 1); });
      at(SNAP_MS * 2, () => setLeverOverride(frames[2]));
      at(SNAP_MS * 3, () => setLeverOverride(null));
    }
    function done() {
      stop();
      timers.current.forEach(clearTimeout);
      setLeverOverride(null);
      anim?.finish();
      setRolling(false);
      finish.current = null;
    }
    finish.current = done;
    at(1000, done);
    chooseTrack(id, { delay: 1000, cancel });
  };

  const buttons = trackMeta.map((t) => {
    const on = selected === t.id;
    return (
      <li key={t.id}>
        <button
          type="button"
          aria-pressed={on}
          onClick={() => choose(t.id)}
          className="group flex min-h-14 w-full items-center justify-between gap-3 border-2 border-cyan px-3 py-2 text-left font-pixel text-xs text-cyan hover:bg-cyan hover:text-background aria-pressed:border-white aria-pressed:text-green aria-pressed:shadow-[inset_0_0_0_3px_var(--green)] aria-pressed:hover:bg-green aria-pressed:hover:text-background"
        >
          <span className="flex items-center gap-3">
            <Light state={lightFor(t.id, selected)} scale={2} />
            {t.label}
          </span>
          <span className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100">
            {counts[t.id]} STATIONS
          </span>
        </button>
      </li>
    );
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="panel-frame bg-[#1b1d27] p-3 sm:p-4">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
          <div>
            <p className="font-pixel text-xs text-green">JUNCTION</p>
            <h2 className="mt-2 font-pixel text-sm leading-relaxed text-orange sm:text-base">CHOOSE YOUR TRACK</h2>
            <ul className="only-select mt-4 space-y-3">{buttons}</ul>
            <ul className="only-static mt-4 space-y-3">
              {trackMeta.map((t) => (
                <li key={t.id}>
                  <a
                    href={`#${t.id}`}
                    className="flex min-h-14 w-full items-center justify-between gap-3 border-2 border-cyan px-3 py-2 font-pixel text-xs text-cyan hover:bg-cyan hover:text-background"
                  >
                    <span className="flex items-center gap-3">
                      <Light state="yellow" scale={2} />
                      {t.label}
                    </span>
                    <span className="text-foreground/70">{counts[t.id]} STATIONS</span>
                  </a>
                </li>
              ))}
            </ul>
            <p role="status" aria-live="polite" className="sr-only">
              {announce}
            </p>
          </div>
          <div aria-hidden className="relative hidden h-[120px] w-[120px] lg:block">
            <div className="lever" style={{ ["--f" as string]: leverFrame }} />
            {puff > 0 && <div key={puff} className="dust" />}
          </div>
        </div>
      </div>

      <div aria-hidden className="rails relative mx-auto mt-4 hidden lg:block">
        <div className="belt-stub" />
        <div className="carriage" style={{ ["--ry" as string]: RAIL_Y[railOf] }} />
        <div className="only-select">
          <div ref={charRef} className="char absolute left-[24px] bottom-[180px]" data-stage="1" data-anim={rolling ? "walk" : "idle"} data-moving={rolling ? "1" : "0"} style={{ opacity: selected && !rolling ? 0 : 1 }}>
            <div className="sprite" />
          </div>
        </div>
      </div>
    </div>
  );
}
