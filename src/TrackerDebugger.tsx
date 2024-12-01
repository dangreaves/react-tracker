import { clsx } from "clsx";
import { format } from "date-fns";
import Draggable from "react-draggable";
import { useRef, useEffect, useState, useMemo } from "react";

import { useTrackerState } from "./hooks";
import type { DebugEvent } from "./types";

import "./TrackerDebugger.css";

export function TrackerDebugger() {
  const { events, isConnected } = useTrackerState();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentNode = ref.current;
    if (!contentNode) return;
    contentNode.scrollTo({ top: contentNode.scrollHeight });
  }, [events]);

  return (
    <Draggable handle=".tracker-debugger__drag-handle">
      <div className="tracker-debugger">
        <div className="tracker-debugger__header">
          <DragHandle />
          <span className="tracker-debugger__title">Tracker helper</span>
        </div>
        <div className="tracker-debugger__content" ref={ref}>
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
            <div className="tracker-debugger__events">
              {events.map((event) => (
                <EventRow event={event} key={event.id} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}

function EventRow({ event }: { event: DebugEvent }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tracker-debugger__event">
      <button
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        className={clsx(
          "tracker-debugger__event-button",
          event.isEmitted && "tracker-debugger__event-button--emitted",
        )}
      >
        <span className="tracker-debugger__muted">{event.type}</span>
        {`${event.args[0]}`}
        <span className="tracker-debugger__muted">
          {format(event.receivedAt, "HH:mm:ss")}
        </span>
        {event.isDuplicate && (
          <span className="tracker-debugger__warning">
            <WarningIcon />
            Duplicate
          </span>
        )}
      </button>
      {isOpen && <EventRowJson event={event} />}
    </div>
  );
}

function EventRowJson({ event }: { event: DebugEvent }) {
  const eventJson = useMemo(() => JSON.stringify(event, null, 2), [event]);

  return (
    <div className="tracker-debugger__event-json">
      <pre>{eventJson}</pre>
    </div>
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
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 6a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 .75-.75Z"></path>
      <path d="M11 13a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path>
      <path
        fillRule="evenodd"
        d="M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-1.5 0a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z"
      ></path>
    </svg>
  );
}
