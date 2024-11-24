import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import type { RudderAnalytics } from "@rudderstack/analytics-js";

import { debug } from "./debug";

import type { Event } from "./types";

/**
 * The fully initialized tracker instance.
 */
export const trackerAtom = atom<RudderAnalytics | null>(null);

/**
 * Initiate tracking with the given tracker.
 */
export const initAtom = atom(
  null,
  (_get, set, { tracker }: { tracker: RudderAnalytics | null }) => {
    set(trackerAtom, tracker);
  },
);

/**
 * Array of events emitted by the application.
 */
export const eventsAtom = atom<Event[]>([]);

/**
 * Emit a new event from the application.
 */
export const emitEventAtom = atom(null, (_get, set, event: Event) => {
  set(eventsAtom, (events) => [...events, event]);
});

/**
 * Order in which buffered events should be emitted to the tracker.
 */
const EVENT_RANK_ORDER: Event["type"][] = [
  "identify",
  "page",
  "track",
  "group",
  "alias",
  "reset",
];

/**
 * Effect run each time the events array changes.
 */
export const eventsEffect = atomEffect((get, set) => {
  const events = get(eventsAtom);
  const tracker = get(trackerAtom);

  // We do not have a tracker yet, do nothing.
  if (!tracker) return;

  // The buffer is empty, do nothing.
  if (0 === events.length) return;

  /**
   * Sort events by rank.
   * This ensures that identify, page and track events are sent in that order if they
   * all appear in the buffer at the same time.
   */
  const sortedEvents = [...events].sort(
    (a, b) =>
      EVENT_RANK_ORDER.indexOf(a.type) - EVENT_RANK_ORDER.indexOf(b.type),
  );

  // Loop each event in the buffer, and send to tracker.
  for (const event of sortedEvents) {
    // @ts-expect-error
    tracker[event.type](...event.args);

    debug("Emitted event", event);
  }

  /**
   * Clear the event buffer.
   * @todo Test if this could potentially drop events added during effect execution? I suspect
   * it should not as this effect is synchronous?
   */
  set(eventsAtom, []);
});
