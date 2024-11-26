import type { RudderAnalytics } from "@rudderstack/analytics-js";

/**
 * Supported Segment-compatible trackers.
 */
export type Tracker = RudderAnalytics;

/**
 * An event to be emitted to the tracker.
 */
export interface Event {
  id: string;
  status: "pending" | "emitted";
  type: "identify" | "page" | "track" | "group" | "alias" | "reset";
  args: unknown[];
}
