import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { differenceInSeconds } from "date-fns";

import { generateNonSecureUniqueId } from "./utils";

import type { Event, DebugEvent } from "./types";

import type { Adapter } from "./adapters/Adapter";

/**
 * Array of adapters.
 */
export const adaptersAtom = atom<Adapter[]>([]);

/**
 * Array of connected adapter handles.
 * This is only used to force a state update when an adapter connects.
 */
export const connectedAdaptersAtom = atom<string[]>([]);

/**
 * Array of events.
 */
export const eventsAtom = atom<Event[]>([]);

/**
 * Append an event to the events atom and send to adapters.
 */
export const appendEventAtom = atom(
  null,
  (get, set, payload: Omit<Event, "id" | "receivedAt">) => {
    // Construct an event object.
    const event: Event = {
      ...payload,
      id: generateNonSecureUniqueId(),
      receivedAt: new Date(),
    };

    // Append to the main events atom.
    set(eventsAtom, (events) => [
      ...events.slice(-49), // Only keep 50 events.
      { ...event, id: generateNonSecureUniqueId(), receivedAt: new Date() },
    ]);

    // Send to each adapter.
    for (const adapter of get(adaptersAtom)) {
      adapter.appendEvent(event);
    }
  },
);

/**
 * Clear the events array.
 */
export const clearEventsAtom = atom(null, (_get, set) => {
  set(eventsAtom, []);
});

/**
 * Load a new adapter.
 */
export const loadAdapterAtom = atom(null, (get, set, adapter: Adapter) => {
  set(adaptersAtom, (adapters) => {
    // Check if the adapter is already loaded.
    if (!!adapters.find(({ handle }) => handle === adapter.handle)) {
      return adapters;
    }

    // Load the adapter with buffered events.
    adapter.load({
      bufferedEvents: get(eventsAtom),
      onConnected: () =>
        set(connectedAdaptersAtom, (connectedAdapters) => [
          ...connectedAdapters,
          adapter.handle,
        ]),
    });

    // Append adapter to array.
    return [...adapters, adapter];
  });
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
 * Should the tracker helper be rendered?
 */
export const helperEnabledAtom = atomWithStorage(
  "react-tracker-helper-enabled",
  false,
  undefined,
  { getOnInit: true },
);

/**
 * Current state of the tracker for debugging.
 */
export const trackerStateAtom = atom((get) => {
  // Force a state update when an adapter connects.
  get(connectedAdaptersAtom);

  const adapters = get(adaptersAtom);
  const events = get(debugEventsAtom);

  return {
    events,
    adapters: adapters.map((adapter) => ({
      name: adapter.name,
      isConnected: adapter.isConnected,
    })),
  };
});
