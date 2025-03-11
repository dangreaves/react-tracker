import type { Event } from "../types";

import type { ProductAddedEvent } from "../types/rudderstack";

import type { DataLayerPayload, DataLayerAddToCartPayload } from "../types/gtm";

import { Adapter } from "./Adapter";

/**
 * Integrate the Google Tag Manager "dataLayer" API.
 *
 * @see https://support.google.com/tagmanager/answer/14847097?hl=en-GB&ref_topic=15191151&sjid=17746328290405827249-NC
 * @see https://support.google.com/tagmanager/answer/7679219?hl=en-GB&sjid=17746328290405827249-NC
 */
export class GoogleTagManagerAdapter extends Adapter {
  /**
   * Load the plugin.
   */
  constructor() {
    super({ name: "Google Tag Manager", handle: "gtm" });

    this._pollForScriptReady();
  }

  /**
   * Poll the window every 1 second until the "dataLayer" API is ready.
   */
  private _pollForScriptReady() {
    let tries = 0;

    const intervalId = setInterval(() => {
      if (
        "undefined" !== typeof window &&
        "undefined" !== typeof window["dataLayer"]
      ) {
        this.connect();
        clearInterval(intervalId);
        return;
      }

      tries++;

      if (tries > 10) {
        console.error(
          `Could not connect Google Tag Manger after 10 seconds. Giving up.`,
        );

        clearInterval(intervalId);
      }
    }, 1000);
  }

  /**
   * Emit the given event to GTM.
   */
  async onEvent(event: Event) {
    // Resolve dataLayer (this should always be set at this point).
    const dataLayer = window["dataLayer"];
    if (!dataLayer) return;

    // Resolve a payload if possible.
    const payload = this._resolveDataLayerPayload(event);

    // Send payload to dataLayer.
    if (payload) dataLayer.push(payload);
  }

  /**
   * Resolve a "dataLayer" payload from the given tracker event.
   */
  private _resolveDataLayerPayload(event: Event): DataLayerPayload | null {
    if ("track" === event.type) {
      const eventType = event.args[0];
      if ("string" !== typeof eventType) return null;

      const eventPayload = event.args[1];
      if ("object" !== typeof eventPayload) return null;

      if ("Product Added" === eventType) {
        return this._addToCartEvent(eventPayload as ProductAddedEvent);
      }
    }

    return null;
  }

  private _addToCartEvent(event: ProductAddedEvent): DataLayerAddToCartPayload {
    return {
      event: "add_to_cart",
      currency: "",
    };
  }
}

declare global {
  interface Window {
    dataLayer?: {
      push: (payload: DataLayerPayload) => void;
    };
  }
}
