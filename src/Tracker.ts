import { z, type AnyZodObject } from "zod";

export class Tracker<Destinations extends AnyDestination[]> {
  protected destinations: Destinations;

  constructor(destinations: Destinations) {
    this.destinations = destinations;
  }

  track<
    DestinationName extends Destinations[number]["name"],
    Event extends ExtractDestination<
      Destinations,
      DestinationName
    >["trackSchemas"][number]["event"],
    Properties extends z.infer<
      ExtractTrackSchema<
        ExtractDestination<Destinations, DestinationName>["trackSchemas"],
        Event
      >["schema"]
    >,
  >(destinationName: DestinationName, event: Event, properties: Properties) {
    properties["foo"];
  }
}

interface Destination<
  Name extends string,
  TrackSchemas extends AnyTrackSchema[],
> {
  name: Name;
  trackSchemas: TrackSchemas;
}

type AnyDestination = Destination<string, AnyTrackSchema[]>;

type ExtractDestination<
  Destinations extends AnyDestination[],
  Name extends Destinations[number]["name"],
> = Extract<Destinations[number], { name: Name }>;

function createDestination<
  Name extends string,
  TrackSchemas extends AnyTrackSchema[],
>(args: {
  name: Name;
  trackSchemas: TrackSchemas;
}): Destination<Name, TrackSchemas> {
  return {
    name: args.name,
    trackSchemas: args.trackSchemas,
  };
}

interface TrackSchema<Event extends string, Schema extends AnyZodObject> {
  event: Event;
  schema: Schema;
}

type AnyTrackSchema = TrackSchema<string, AnyZodObject>;

type ExtractTrackSchema<
  TrackSchemas extends AnyTrackSchema[],
  Event extends TrackSchemas[number]["event"],
> = Extract<TrackSchemas[number], { event: Event }>;

function createTrackSchema<
  Event extends string,
  Schema extends AnyZodObject,
>(args: { event: Event; schema: Schema }): TrackSchema<Event, Schema> {
  return {
    event: args.event,
    schema: args.schema,
  };
}

const gaAddToCartSchema = createTrackSchema({
  event: "add_to_cart",
  schema: z.object({
    foo: z.string(),
  }),
});

const gaRemoveFromCartSchema = createTrackSchema({
  event: "remove_from_cart",
  schema: z.object({
    bar: z.string(),
  }),
});

const ga = createDestination({
  name: "ga",
  trackSchemas: [gaAddToCartSchema, gaRemoveFromCartSchema],
});

const klaviyoAddToWishlistSchema = createTrackSchema({
  event: "add_to_wishlist",
  schema: z.object({
    wishlist_id: z.string(),
  }),
});

const klaviyo = createDestination({
  name: "klaviyo",
  trackSchemas: [klaviyoAddToWishlistSchema],
});

const tracker = new Tracker([ga, klaviyo]);

tracker.track("ga", "add_to_cart", { foo: "hello" });

tracker.track("ga", "add_to_cart", {
  category1: "hello",
  category2: "hello",
});
