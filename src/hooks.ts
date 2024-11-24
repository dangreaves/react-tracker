import { useAtom, useSetAtom } from "jotai";
import type { RudderAnalytics } from "@rudderstack/analytics-js";

import { initAtom, eventsEffect, emitEventAtom } from "./atoms";

export function useTracker() {
  useAtom(eventsEffect);

  const emitEvent = useSetAtom(emitEventAtom);

  return {
    init: useSetAtom(initAtom),
    identify: ((...args) =>
      emitEvent({ type: "identify", args })) as RudderAnalytics["identify"],
    page: ((...args) =>
      emitEvent({ type: "page", args })) as RudderAnalytics["page"],
    track: ((...args) =>
      emitEvent({ type: "track", args })) as RudderAnalytics["track"],
    group: ((...args) =>
      emitEvent({ type: "group", args })) as RudderAnalytics["group"],
    alias: ((...args) =>
      emitEvent({ type: "alias", args })) as RudderAnalytics["alias"],
    reset: ((...args) =>
      emitEvent({ type: "reset", args })) as RudderAnalytics["reset"],
  };
}
