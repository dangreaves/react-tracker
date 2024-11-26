import { useAtom, useSetAtom, useAtomValue } from "jotai";

import type { Tracker } from "./types";

import {
  initAtom,
  appendEventAtom,
  emitEventsEffect,
  trackerStateAtom,
} from "./atoms";

export function useTracker() {
  useAtom(emitEventsEffect);

  const appendEvent = useSetAtom(appendEventAtom);

  return {
    init: useSetAtom(initAtom),
    identify: ((...args) =>
      appendEvent({
        type: "identify",
        args,
      })) as Tracker["identify"],
    page: ((...args) => appendEvent({ type: "page", args })) as Tracker["page"],
    track: ((...args) =>
      appendEvent({ type: "track", args })) as Tracker["track"],
    group: ((...args) =>
      appendEvent({ type: "group", args })) as Tracker["group"],
    alias: ((...args) =>
      appendEvent({ type: "alias", args })) as Tracker["alias"],
    reset: ((...args) =>
      appendEvent({ type: "reset", args })) as Tracker["reset"],
  };
}

export function useTrackerState() {
  return useAtomValue(trackerStateAtom);
}
