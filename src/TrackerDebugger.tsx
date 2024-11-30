import { clsx } from "clsx";
import { format } from "date-fns";
import Draggable from "react-draggable";

import { useTrackerState } from "./hooks";
import type { DebugEvent } from "./types";

import "./TrackerDebugger.css";

export function TrackerDebugger() {
  const { events, isConnected } = useTrackerState();

  return (
    <Draggable handle=".tracker-debugger__drag-handle">
      <div className="tracker-debugger">
        <div className="tracker-debugger__header">
          <DragHandle />
          <span className="tracker-debugger__title">Tracker helper</span>
        </div>
        <div className="tracker-debugger__content">
          <div className="tracker-debugger__connection">
            <span className="tracker-debugger__title">RudderStack</span>
            {isConnected ? (
              <div className="tracker-debugger__badge tracker-debugger__badge--success">
                Connected
              </div>
            ) : (
              <div className="tracker-debugger__badge">Disconnected</div>
            )}
          </div>
          <div className="tracker-debugger__summary">
            <span className="tracker-debugger__title">Events received</span>
            <div className="tracker-debugger__badge tracker-debugger__badge--no-dot">
              {events.length}
            </div>
          </div>
          {0 < events.length && (
            <ol className="tracker-debugger__events">
              {events.map((event) => (
                <li
                  key={event.id}
                  className={clsx(
                    "tracker-debugger__event",
                    event.isEmitted && "tracker-debugger__event--emitted",
                  )}
                >
                  <span className="tracker-debugger__muted">{event.type}</span>
                  {`${event.args[0]}`}
                  <span className="tracker-debugger__muted">
                    {format(event.receivedAt, "HH:mm:ss")}
                  </span>
                  {event.isDuplicate && <WarningIcon />}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Draggable>
  );
}

function DragHandle() {
  return (
    <svg
      viewBox="1 1 18 18"
      fill="currentColor"
      className="tracker-debugger__drag-handle"
    >
      <path d="M7.5 4.5c-.552 0-1 .448-1 1v.5c0 .552.448 1 1 1h.5c.552 0 1-.448 1-1v-.5c0-.552-.448-1-1-1h-.5Z"></path>
      <path d="M7.5 8.75c-.552 0-1 .448-1 1v.5c0 .552.448 1 1 1h.5c.552 0 1-.448 1-1v-.5c0-.552-.448-1-1-1h-.5Z"></path>
      <path d="M6.5 14c0-.552.448-1 1-1h.5c.552 0 1 .448 1 1v.5c0 .552-.448 1-1 1h-.5c-.552 0-1-.448-1-1v-.5Z"></path>
      <path d="M12 4.5c-.552 0-1 .448-1 1v.5c0 .552.448 1 1 1h.5c.552 0 1-.448 1-1v-.5c0-.552-.448-1-1-1h-.5Z"></path>
      <path d="M11 9.75c0-.552.448-1 1-1h.5c.552 0 1 .448 1 1v.5c0 .552-.448 1-1 1h-.5c-.552 0-1-.448-1-1v-.5Z"></path>
      <path d="M12 13c-.552 0-1 .448-1 1v.5c0 .552.448 1 1 1h.5c.552 0 1-.448 1-1v-.5c0-.552-.448-1-1-1h-.5Z"></path>
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="tracker-debugger__warning-icon"
    >
      <path d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"></path>
      <path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
      <path
        fill-rule="evenodd"
        d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
      ></path>
    </svg>
  );
}
