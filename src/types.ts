/**
 * An event to be emitted to the tracker.
 */
export interface Event {
  id: string;
  status: "pending" | "emitted";
  type: "identify" | "page" | "track" | "group" | "alias" | "reset";
  args: unknown[];
}
