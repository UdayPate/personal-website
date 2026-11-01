// Moving between tracks: select a track, wait for its pipeline to build, then scroll to its start.
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TrackId } from "@/content/types";
import { PIPE_QUERY } from "./pipeQuery";
import { trackRegistry, trackStore } from "./trackStore";

const hudHeight = () => document.querySelector<HTMLElement>("[data-hud]")?.offsetHeight ?? 56;
const frames = (n: number) => new Promise<void>((res) => {
  const step = (i: number) => (i <= 0 ? res() : requestAnimationFrame(() => step(i - 1)));
  step(n);
});

/** Wait (a few frames at most) until the pipeline of `track` has built its scroll trigger, when the pinned layout is in use. */
async function ready(track: TrackId) {
  await frames(2);
  if (!window.matchMedia(PIPE_QUERY).matches) return;
  for (let i = 0; i < 40 && !ScrollTrigger.getById(track); i++) await frames(1);
  ScrollTrigger.refresh();
}

/** Page scroll position where `track` starts. */
export function trackStartY(track: TrackId): number {
  const st = ScrollTrigger.getById(track);
  if (st && window.matchMedia(PIPE_QUERY).matches) return st.start;
  const sec = document.querySelector<HTMLElement>(`[data-track-section="${track}"]`);
  return sec ? sec.getBoundingClientRect().top + window.scrollY - hudHeight() : 0;
}

export function setHash(hash: string) {
  try {
    history.replaceState(history.state, "", hash ? `#${hash}` : window.location.pathname + window.location.search);
  } catch {}
}

/**
 * Pick a track and go to its start. `delay` lets the junction animation play first.
 * `instant` jumps instead of scrolling smoothly (used when switching from far down a track).
 */
export async function chooseTrack(track: TrackId, opts: { delay?: number; instant?: boolean; scroll?: boolean; cancel?: Promise<unknown> } = {}) {
  const { delay = 0, instant = false, scroll = true, cancel } = opts;
  trackStore.select(track);
  setHash(track);
  if (!scroll) return;
  if (delay) {
    // `cancel` resolves when the visitor scrolls on their own: then we do not scroll for them.
    const cancelled = await Promise.race([new Promise<false>((r) => setTimeout(() => r(false), delay)), cancel ? cancel.then(() => true) : new Promise<false>(() => {})]);
    if (cancelled) return;
  }
  await ready(track);
  const y = Math.max(0, Math.round(trackStartY(track)));
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches; // no smooth scrolling for reduced motion
  window.scrollTo({ top: y, behavior: instant || calm ? "auto" : "smooth" });
  if (instant) hopCharacter(track);
}

/** Go to one station (any track): select its track first if needed. */
export async function goToStation(slug: string, track: TrackId) {
  const wasVisible = trackStore.get().visible === track;
  trackStore.select(track);
  setHash(slug);
  if (!wasVisible) await ready(track);
  else await frames(1);
  const reg = trackRegistry[track];
  if (reg) reg.goTo(slug);
  else document.getElementById(slug)?.scrollIntoView({ block: "center" });
}

/** The short "hop" of the character when switching track mid-way (CSS class, see globals.css). */
export function hopCharacter(track: TrackId) {
  const ch = document.querySelector<HTMLElement>(`[data-pipeline="${track}"] .char`);
  if (!ch) return;
  ch.classList.remove("char-hop");
  void ch.offsetWidth;
  ch.classList.add("char-hop");
  ch.addEventListener("animationend", () => ch.classList.remove("char-hop"), { once: true });
}
