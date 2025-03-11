/**
 * Types for RudderStack ecommerce events.
 * @see https://www.rudderstack.com/docs/event-spec/ecommerce-events-spec
 */

/**
 * RudderStack "track" method but with specific types for known events.
 */
export type TrackFunction = <T extends string>(
  event: T,
  properties: T extends "Product Added"
    ? ProductAddedEvent & Record<string, any>
    : Record<string, any>,
) => void;

const track: TrackFunction;

track();

export type Event = ProductAddedEvent & UnknownEvent;

const foo: Event = { event: "foo" };

if ("Product Added" === foo.event) {
  //
} else {
  foo.properties;
}

interface UnknownEvent {
  event: Exclude<string, "Product Added">;
  properties: Record<string, any>;
}

/**
 * This event is triggered when a visitor/customer adds a product to their shopping cart.
 * @see https://www.rudderstack.com/docs/event-spec/ecommerce-events-spec/ordering/#product-added
 */
export interface ProductAddedEvent {
  event: "Product Added";
  properties: {
    /** Cart ID */
    cart_id?: string;
    /** ID of the product being viewed */
    product_id?: string;
    /** SKU of the product being viewed */
    sku?: string;
    /** Category of the product being viewed */
    category?: string;
    /** Name of the product being viewed */
    name?: string;
    /** Name of the brand associated with the product */
    brand?: string;
    /** Variant associated with the product */
    variant?: string;
    /** Price of the product being viewed */
    price?: number;
    /** Quantity of the product */
    quantity?: number;
    /** Coupon code associated with the product */
    coupon?: string;
    /** Position of the product in the product list */
    position?: number;
    /** URL of the product page */
    url?: string;
    /** Image URL of the product */
    image_url?: string;
  };
}
