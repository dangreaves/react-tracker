import { atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { differenceInSeconds } from "date-fns";

import { debug } from "./debug";
import { generateNonSecureUniqueId } from "./utils";

import type { Tracker, Event, DebugEvent, InitConfig } from "./types";

/**
 * A fully initialized Segment compatible tracker.
 */
export const trackerAtom = atom<Tracker | null>(null);

/**
 * Initiate tracking with the given tracker.
 */
export const initAtom = atom(null, (_get, set, { tracker }: InitConfig) => {
  set(trackerAtom, tracker as Tracker);
});

/**
 * Array of events.
 */
export const eventsAtom = atom<Event[]>([]);

/**
 * Array of events not yet emitted.
 */
export const pendingEventsAtom = atom((get) =>
  get(eventsAtom).filter((event) => true !== event.isEmitted),
);

/**
 * Append an event to the events array.
 */
export const appendEventAtom = atom(
  null,
  (_get, set, event: Omit<Event, "id" | "receivedAt">) => {
    set(eventsAtom, (events) => [
      ...events.slice(-49), // Only keep 50 events.
      { ...event, id: generateNonSecureUniqueId(), receivedAt: new Date() },
    ]);
  },
);

/**
 * Clear the events array.
 */
export const clearEventsAtom = atom(null, (_get, set) => {
  set(eventsAtom, []);
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

  // Loop each pending event and emit to tracker.
  for (const event of pendingEvents) {
    // @ts-expect-error
    tracker[event.type](...event.args);
    debug("Emitted event", event);
  }

  // Resolve a list of emitted event IDs.
  const emittedEventIds = pendingEvents.map((event) => event.id);

  // Set isEmitted for each of the events we just emitted.
  set(eventsAtom, (events) =>
    events.map((event) => {
      if (emittedEventIds.includes(event.id)) {
        return { ...event, isEmitted: true };
      }

      return event;
    }),
  );
});

/**
 * Compute a hash for the given event.
 */
function computeEventHash(event: Event) {
  const { type, args } = event;
  return JSON.stringify({ type, args });
}

/**
 * Return events with information useful for debugging.
 *
 * @todo Improve isDuplicate efficiency.
 */
export const debugEventsAtom = atom((get) => {
  const events = get(eventsAtom);

  const hashedEvents = events.map((event) => ({
    ...event,
    hash: computeEventHash(event),
  }));

  return hashedEvents.map(({ hash, ...event }, index): DebugEvent => {
    // Get events which were received less than 3 seconds before this one.
    const recentEvents = hashedEvents
      .slice(0, index) // Only filter on events before this one.
      .filter(
        ({ receivedAt }) =>
          3 > differenceInSeconds(event.receivedAt, receivedAt),
      );

    // Check if any recent events have the same hash as this one.
    const duplicateEvents = recentEvents.filter(
      (recentEvent) => recentEvent.hash === hash,
    );

    // Return debug event.
    return {
      ...event,
      ...(0 < duplicateEvents.length ? { isDuplicate: true } : {}),
    };
  });
});

/**
 * Current state of the tracker for debugging.
 */
export const trackerStateAtom = atom((get) => {
  const tracker = get(trackerAtom);
  const events = get(debugEventsAtom);

  return {
    events,
    isConnected: !!tracker,
  };
});
