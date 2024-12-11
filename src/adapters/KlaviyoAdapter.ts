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
    // Resolve Klaviyo (this should always be set at this point).
    const klaviyo = window["klaviyo"];
    if (!klaviyo) return;

    // Send Klaviyo identify event.
    if ("identify" === event.type) {
      const payload = this._klaviyoIdentifyPayload(event);
      if (payload) klaviyo.identify(payload);
    }
  }

  /**
   * Resolve a Klaviyo identify payload.
   *
   * @see https://developers.klaviyo.com/en/v1-2/docs/identify-api-reference
   */
  private _klaviyoIdentifyPayload(event: Event) {
    const traits = event.args[1] as any;
    if (!traits || "object" !== typeof traits) return;

    const payload = {
      ...(traits["email"] ? { $email: traits["email"] } : {}),
      ...(traits["firstName"] ? { $first_name: traits["firstName"] } : {}),
      ...(traits["lastName"] ? { $last_name: traits["lastName"] } : {}),
    };

    if (!objectIsPopulated(payload)) return;

    return payload;
  }
}

declare global {
  interface Window {
    klaviyo?: any;
  }
}

/**
 * Return true if the given object has at least one truthy value.
 */
function objectIsPopulated(obj: any) {
  for (let key in obj) {
    if (!!obj[key]) return true;
  }

  return false;
}
