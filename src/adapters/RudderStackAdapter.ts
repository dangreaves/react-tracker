import { RudderAnalytics, LoadOptions } from "@rudderstack/analytics-js";

import type { Event } from "../types";

import { Adapter } from "./Adapter";

const rudderAnalytics = new RudderAnalytics();

/**
 * Integrate the RudderStack JavaScript SDK.
 *
 * @see https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk
 */
export class RudderStackAdapter extends Adapter {
  /**
   * Load the RudderStack plugin.
   */
  constructor({
    writeKey,
    loadOptions,
    dataPlaneUrl,
  }: {
    writeKey: string;
    dataPlaneUrl: string;
    loadOptions?: Partial<LoadOptions>;
  }) {
    super({ name: "RudderStack", handle: `rudderstack-${writeKey}` });

    rudderAnalytics.ready(() => this.connect());

    rudderAnalytics.load(writeKey, dataPlaneUrl, loadOptions);
  }

  /**
   * Emit the given event to RudderStack.
   */
  async onEvent(event: Event) {
    // @ts-expect-error
    rudderAnalytics[event.type](...event.args);
  }
}
