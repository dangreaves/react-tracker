import { useAtom, useSetAtom, useAtomValue } from "jotai";
import type { RudderAnalytics } from "@rudderstack/analytics-js";

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
      })) as RudderAnalytics["identify"],
    page: ((...args) =>
      appendEvent({ type: "page", args })) as RudderAnalytics["page"],
    track: ((...args) =>
      appendEvent({ type: "track", args })) as RudderAnalytics["track"],
    group: ((...args) =>
      appendEvent({ type: "group", args })) as RudderAnalytics["group"],
    alias: ((...args) =>
      appendEvent({ type: "alias", args })) as RudderAnalytics["alias"],
    reset: ((...args) =>
      appendEvent({ type: "reset", args })) as RudderAnalytics["reset"],
  };
}

export function useTrackerState() {
  return useAtomValue(trackerStateAtom);
}
