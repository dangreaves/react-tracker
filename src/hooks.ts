import { useMemo } from "react";
import { useSetAtom, useAtomValue } from "jotai";

import type { Tracker } from "./types";

import {
  loadAdapterAtom,
  clearEventsAtom,
  appendEventAtom,
  trackerStateAtom,
} from "./atoms";

export function useTracker() {
  const loadAdapter = useSetAtom(loadAdapterAtom);
  const appendEvent = useSetAtom(appendEventAtom);

  return useMemo(
    () => ({
      loadAdapter,
      identify: ((...args) =>
        appendEvent({
          type: "identify",
          args,
        })) as Tracker["identify"],
      page: ((...args) =>
        appendEvent({ type: "page", args })) as Tracker["page"],
      track: ((...args) =>
        appendEvent({ type: "track", args })) as Tracker["track"],
      group: ((...args) =>
        appendEvent({ type: "group", args })) as Tracker["group"],
      alias: ((...args) =>
        appendEvent({ type: "alias", args })) as Tracker["alias"],
      reset: ((...args) =>
        appendEvent({ type: "reset", args })) as Tracker["reset"],
    }),
    [loadAdapter, appendEvent],
  );
}

export function useTrackerState() {
  const clearEvents = useSetAtom(clearEventsAtom);
  const trackerState = useAtomValue(trackerStateAtom);

  return {
    ...trackerState,
    clearEvents,
  };
}
