/**
 * Types for GA4 recommended events.
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */

/**
 * RudderStack "track" method but with specific types for known events.
 */
export type GoogleAnalyticsEvent = <T extends string>(
  event: T,
  properties: T extends "add_to_cart"
    ? ProductAddedEvent & Record<string, any>
    : Record<string, any>,
) => void;

export type Event = AddToCartEvent;

/**
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events#add_to_cart
 */
export interface AddToCartEvent {
  event: "add_to_cart";
  currency: string;
}
