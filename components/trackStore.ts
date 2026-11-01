// Shared state for the branching pipeline: which track is shown, and which
// stations the visitor has reached. A tiny store (like hudStore) that React reads
// with useSyncExternalStore. Visit state is remembered for the browser tab with
// sessionStorage; every storage call is wrapped, because storage can be blocked.
import { trackMeta } from "@/content/site";
import type { TrackId } from "@/content/types";

export type TrackState = {
  /** The track the visitor picked (or the default after scrolling past the junction). null = not chosen yet. */
  selected: TrackId | null;
  /** The track that is shown: the selected one, or Projects by default. */
  visible: TrackId;
  /** Slugs of the stations reached so far, across all tracks. */
  visited: string[];
  /** Tracks the visitor has been on (they get a checkmark). */
  tracksVisited: TrackId[];
  /** True once the remembered state has been read from sessionStorage. */
  hydrated: boolean;
};

const KEY = "udayverse:tracks";
export const DEFAULT_TRACK: TrackId = "projects";
export const trackIds = trackMeta.map((t) => t.id) as TrackId[];

const initial: TrackState = { selected: null, visible: DEFAULT_TRACK, visited: [], tracksVisited: [], hydrated: false };
let state = initial;
const listeners = new Set<() => void>();

const set = (next: TrackState) => {
  state = next;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ selected: next.selected, visited: next.visited, tracksVisited: next.tracksVisited }));
  } catch {}
  listeners.forEach((fn) => fn());
};

export const trackStore = {
  get: () => state,
  getServer: () => initial,
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  /** Read the remembered state (once, on the client). */
  hydrate() {
    if (state.hydrated) return;
    let saved: Partial<TrackState> = {};
    try {
      saved = JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
    } catch {}
    const selected = trackIds.includes(saved.selected as TrackId) ? (saved.selected as TrackId) : null;
    state = {
      selected,
      visible: selected ?? DEFAULT_TRACK,
      visited: Array.isArray(saved.visited) ? saved.visited.filter((s) => typeof s === "string") : [],
      tracksVisited: Array.isArray(saved.tracksVisited) ? saved.tracksVisited.filter((t) => trackIds.includes(t)) : [],
      hydrated: true,
    };
    listeners.forEach((fn) => fn());
  },
  select(track: TrackId) {
    if (state.selected === track && state.visible === track) return;
    set({ ...state, selected: track, visible: track, tracksVisited: state.tracksVisited.includes(track) ? state.tracksVisited : [...state.tracksVisited, track] });
  },
  visit(slug: string, track: TrackId) {
    if (state.visited.includes(slug)) return;
    set({ ...state, visited: [...state.visited, slug], tracksVisited: state.tracksVisited.includes(track) ? state.tracksVisited : [...state.tracksVisited, track] });
  },
};

/** Each mounted pipeline registers how to jump to one of its stations. */
export const trackRegistry: Partial<Record<TrackId, { goTo: (slug: string) => void }>> = {};
