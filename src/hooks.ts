import { useAtom, useSetAtom } from "jotai";

import { trackerAtom, emitEventAtom, eventBufferEffect } from "./atoms";

import type { IdentifyEvent, PageEvent } from "./types";

export function useTracker() {
  useAtom(eventBufferEffect);
}

export function useSetTracker() {
  return useSetAtom(trackerAtom);
}

export function useEmitEvent() {
  return useSetAtom(emitEventAtom);
}

export function useIdentify() {
  const emitEvent = useEmitEvent();

  return (
    userId: IdentifyEvent["userId"],
    traits?: IdentifyEvent["traits"],
  ) => {
    emitEvent({
      type: "identify",
      userId,
      traits,
    });
  };
}

export function useTrackPage() {
  const emitEvent = useEmitEvent();

  return (
    name: PageEvent["name"],
    properties?: Pick<PageEvent, "category"> & PageEvent["properties"],
  ) => {
    const { category, ...rest } = properties ?? {};

    emitEvent({
      type: "page",
      name,
      category,
      properties: rest,
    });
  };
}
