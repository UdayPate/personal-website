// A pixel signal light (public/sprites/lights.png: red, yellow, green). Green always carries a
// white ring and a white check, so the state is not carried by colour alone.
export type LightState = "red" | "yellow" | "green";
const INDEX: Record<LightState, number> = { red: 0, yellow: 1, green: 2 };

/** Selected track = green, other tracks = red once a track is chosen, yellow (waiting) before that. */
export const lightFor = (track: string, selected: string | null): LightState => (selected === null ? "yellow" : selected === track ? "green" : "red");

export default function Light({ state, scale = 2 }: { state: LightState; scale?: number }) {
  return <span aria-hidden className="light" data-light={state} style={{ ["--l" as string]: INDEX[state], ["--s" as string]: scale }} />;
}
