import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import { nanoid } from "nanoid";

import type { RudderAnalytics } from "@rudderstack/analytics-js";

import { debug } from "./debug";

import type { Event } from "./types";

/**
 * A fully initialized Segment compatible tracker.
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
 * Array of events.
 */
export const eventsAtom = atom<Event[]>([]);

/**
 * Array of events in pending status.
 */
export const pendingEventsAtom = atom((get) =>
  get(eventsAtom).filter((event) => "pending" === event.status),
);

/**
 * Append an event to the events array.
 */
export const appendEventAtom = atom(
  null,
  (_get, set, event: Omit<Event, "id" | "status">) => {
    set(eventsAtom, (events) => [
      ...events,
      { ...event, id: nanoid(), status: "pending" },
    ]);
  },
);

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
 * Emit pending events to the tracker.
 */
export const emitEventsEffect = atomEffect((get, set) => {
  // Resolve the tracker.
  const tracker = get(trackerAtom);

  // Create a copy of pending events (so we can sort them).
  const pendingEvents = [...get(pendingEventsAtom)];

  // We do not have a tracker yet, do nothing.
  if (!tracker) return;

  // There are no pending events, do nothing.
  if (0 === pendingEvents.length) return;

  /**
   * Sort pending events by rank.
   * This ensures that identify, page and track events are sent in that order if they
   * all appear in the buffer at the same time.
   */
  pendingEvents.sort(
    (a, b) =>
      EVENT_RANK_ORDER.indexOf(a.type) - EVENT_RANK_ORDER.indexOf(b.type),
  );

  // Loop each pending and emit to tracker.
  for (const event of pendingEvents) {
    // @ts-expect-error
    tracker[event.type](...event.args);
    debug("Emitted event", event);
  }

  // Resolve a list of emitted event IDs.
  const emittedEventIds = pendingEvents.map((event) => event.id);

  // Update status for each of the events we just emitted.
  set(eventsAtom, (events) =>
    events.map((event) => {
      if (emittedEventIds.includes(event.id)) {
        return { ...event, status: "emitted" };
      }

      return event;
    }),
  );
});

/**
 * Current state of the tracker for debugging.
 */
export const trackerStateAtom = atom((get) => {
  const events = get(eventsAtom);
  const tracker = get(trackerAtom);

  return {
    events,
    isConnected: !!tracker,
  };
});
