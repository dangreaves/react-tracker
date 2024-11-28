import type { AnalyticsBrowser } from "@segment/analytics-next";
import type { RudderAnalytics } from "@rudderstack/analytics-js";

/**
 * Supported Segment-compatible trackers.
 */
export type AnyTracker = RudderAnalytics | AnalyticsBrowser;

/**
 * Tracker type used internally.
 *
 * We use RudderAnalytics here because the types are cleaner, but in reality
 * an AnalyticsBrowser from Segment would work just fine, as it has the
 * same API for the track methods.
 */
export type Tracker = RudderAnalytics;

/**
 * Configuration object provided when initiating the tracker.
 */
export interface InitConfig {
  /**
   * Any supported tracker.
   */
  tracker: AnyTracker | null;
}

/**
 * An event to be emitted to the tracker.
 */
export interface Event {
  id: string;
  status: "pending" | "emitted";
  type: "identify" | "page" | "track" | "group" | "alias" | "reset";
  args: unknown[];
}
