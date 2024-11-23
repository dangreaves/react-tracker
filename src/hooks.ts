import { useAtom, useSetAtom } from "jotai";

import { trackerAtom, emitEventAtom, eventBufferEffect } from "./atoms";

import type { IdentifyEvent } from "./types";

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
