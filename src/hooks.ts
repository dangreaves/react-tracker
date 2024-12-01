import { useMemo } from "react";
import { useAtom, useSetAtom, useAtomValue } from "jotai";

import type { Tracker } from "./types";

import {
  initAtom,
  clearEventsAtom,
  appendEventAtom,
  emitEventsEffect,
  trackerStateAtom,
} from "./atoms";

export function useTracker() {
  useAtom(emitEventsEffect);

  const init = useSetAtom(initAtom);
  const appendEvent = useSetAtom(appendEventAtom);

  return useMemo(
    () => ({
      init,
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
    [init, appendEvent],
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
