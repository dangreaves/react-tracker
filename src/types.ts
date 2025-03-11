import type { RudderAnalytics } from "@rudderstack/analytics-js";

import type { TrackFunction } from "./types/rudderstack";

/**
 * Tracker type used internally.
 *
 * We use RudderAnalytics here because the types are cleaner, but in reality
 * an AnalyticsBrowser from Segment would work just fine, as it has the
 * same API for the track methods.
 */
export type Tracker = Omit<RudderAnalytics, "track"> & {
  track: TrackFunction;
};

/**
 * An event to be emitted to the tracker.
 * @todo Rename this to emission, call or invocation? It's not really an event, it's a call to the rudderstack SDK like .track(), .page() etc. Inside track() is where you send a RudderStackEvent.
 */
export interface Event {
  id: string;
  type: "identify" | "page" | "track" | "group" | "alias" | "reset";
  args: unknown[];
  receivedAt: Date;
}

/**
 * Event decorated with information useful for debugging.
 */
export interface DebugEvent extends Event {
  isDuplicate?: boolean;
}
