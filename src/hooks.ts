import { useAtom, useSetAtom } from "jotai";

import { trackerAtom, appendEventAtom, eventBufferEffect } from "./atoms";

import type { IdentifyEvent, PageEvent } from "./types";

export function useTracker() {
  useAtom(eventBufferEffect);
}

export function useSetTracker() {
  return useSetAtom(trackerAtom);
}

export function useAppendEvent() {
  return useSetAtom(appendEventAtom);
}

export function useIdentify() {
  const appendEvent = useAppendEvent();

  return (
    userId: IdentifyEvent["userId"],
    traits?: IdentifyEvent["traits"],
  ) => {
    appendEvent({
      type: "identify",
      userId,
      traits,
    });
  };
}

export function useTrackPage() {
  const appendEvent = useAppendEvent();

  return (
    name: PageEvent["name"],
    properties?: Pick<PageEvent, "category"> & PageEvent["properties"],
  ) => {
    const { category, ...rest } = properties ?? {};

    appendEvent({
      type: "page",
      name,
      category,
      properties: rest,
    });
  };
}
