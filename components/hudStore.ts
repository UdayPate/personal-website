// A tiny shared store so the scroll logic (writes) and the HUD (reads) can talk
// without a state library. React reads it with useSyncExternalStore.
export type HudState = {
  /** Long label, e.g. "PROJECTS 2/5 · TRANSFORM" */
  stage: string;
  /** Short label for phones, e.g. "PROJECTS 2/5" */
  short: string;
  quality: number;
};

let state: HudState = { stage: "INTRO", short: "INTRO", quality: 0 };
const listeners = new Set<() => void>();

export const hudStore = {
  get: () => state,
  set(next: HudState) {
    if (next.stage === state.stage && next.short === state.short && next.quality === state.quality) return;
    state = next;
    listeners.forEach((fn) => fn());
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
};
