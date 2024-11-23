import { atom } from "jotai";
import { atomEffect } from "jotai-effect";

import type { RudderAnalytics } from "@rudderstack/analytics-js";

import { debug } from "./debug";

import type { Event } from "./types";

export const trackerAtom = atom<RudderAnalytics | null>(null);

export const eventBufferAtom = atom<Event[]>([]);

export const appendEventAtom = atom(null, (_get, set, event: Event) => {
  set(eventBufferAtom, (eventBuffer) => [...eventBuffer, event]);
});

export const eventBufferEffect = atomEffect((get, set) => {
  const tracker = get(trackerAtom);
  const eventBuffer = get(eventBufferAtom);

  // We do not have a tracker yet, do nothing.
  if (!tracker) return;

  // The buffer is empty, do nothing.
  if (0 === eventBuffer.length) return;

  // Loop each event in the buffer, and send to tracker.
  for (const event of eventBuffer) {
    if ("identify" === event.type) {
      tracker.identify(event.userId, event.traits);
    }

    if ("page" === event.type) {
      if (event.category) {
        tracker.page(event.category, event.name, event.properties);
      } else {
        tracker.page(event.name, event.properties);
      }
    }

    debug("Emitted event", event);
  }

  /**
   * Clear the event buffer.
   * @todo Test if this could potentially drop events added during effect execution? I suspect
   * it should not as this effect is synchronous?
   */
  set(eventBufferAtom, []);
});
