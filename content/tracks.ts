// The three tracks of the branching pipeline, each an ordered list of stations.
// Server-only (built by content/loader.ts).
import { content } from "./loader";

export type { TrackId, TrackStation } from "./types";

export const tracks = content.tracks;
export const totalStations = tracks.projects.length + tracks.experience.length + tracks.education.length;
