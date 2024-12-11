import type { Event } from "../types";

import { Adapter } from "./Adapter";

/**
 * Integrate the Klaviyo "Active on Site" JavaScript SDK.
 *
 * @see https://developers.klaviyo.com/en/v1-2/docs/introduction-to-the-klaviyo-object
 * @see https://developers.klaviyo.com/en/v1-2/docs/guide-to-integrating-a-platform-without-a-pre-built-klaviyo-integration
 */
export class KlaviyoAdapter extends Adapter {
  /**
   * Company ID associated with the Klaviyo script.
   */
  companyId: string;

  /**
   * Load the Klaviyo plugin.
   */
  constructor({ companyId }: { companyId: string }) {
    super({ name: "Klaviyo", handle: "klaviyo" });

    this.companyId = companyId;

    this._appendScript();
    this._pollForScriptReady();
  }

  /**
   * Append Klaviyo tracking script to the head.
   */
  private _appendScript() {
    // Resolve the URL for the Klaviyo script.
    const src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${this.companyId}`;

    // Check if the script is already appended.
    if (!!document.querySelector(`script[src="${src}"]`)) return;

    // Append script to head.
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  /**
   * Poll the window every 1 second until the Klaviyo SDK is ready.
   */
  private _pollForScriptReady() {
    const intervalId = setInterval(() => {
      console.log("checking if klaviyo is ready");
      if (
        "undefined" !== typeof window &&
        "undefined" !== typeof window["klaviyo"]
      ) {
        this.connect();
        clearInterval(intervalId);
      }
    }, 1000);
  }

  /**
   * Emit the given event to Klaviyo.
   */
  async onEvent(event: Event) {
    // Resolve Klaviyo (this should always be set at this point)
    const klaviyo = window["klaviyo"];
    if (!klaviyo) return;

    // Send event to Klaviyo.
    console.log("klaviyo event", event);
  }
}

declare global {
  interface Window {
    klaviyo?: any;
  }
}
