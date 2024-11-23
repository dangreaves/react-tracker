import type { IdentifyTraits, ApiObject } from "@rudderstack/analytics-js";

export type IdentifyEvent = {
  type: "identify";
  userId: string;
  traits?: IdentifyTraits;
};

export type PageEvent = {
  type: "page";
  name: string;
  category?: string;
  properties?: ApiObject;
};

export type Event = IdentifyEvent | PageEvent;
