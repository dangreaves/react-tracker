/**
 * An event emitted by the application.
 */
export interface Event {
  type: "identify" | "page" | "track" | "group" | "alias" | "reset";
  args: unknown[];
}
