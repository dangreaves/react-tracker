import type { RudderAnalytics } from "@rudderstack/analytics-js";

/**
 * Tracker type used internally.
 *
 * We use RudderAnalytics here because the types are cleaner, but in reality
 * an AnalyticsBrowser from Segment would work just fine, as it has the
 * same API for the track methods.
 */
export type Tracker = RudderAnalytics;

/**
 * An event to be emitted to the tracker.
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
