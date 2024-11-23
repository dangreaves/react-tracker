import type { IdentifyTraits } from "@rudderstack/analytics-js";

export type IdentifyEvent = {
  type: "identify";
  userId: string;
  traits?: IdentifyTraits;
};

export type Event = IdentifyEvent;
