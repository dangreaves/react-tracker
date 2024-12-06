import { clsx } from "clsx";
import { useAtom } from "jotai";
import { format } from "date-fns";
import Draggable from "react-draggable";
import { useRef, useEffect, useState, useMemo } from "react";

import { useTrackerState } from "./hooks";
import { helperEnabledAtom } from "./atoms";

import type { DebugEvent } from "./types";

import "./TrackerHelper.css";

export function TrackerHelper({
  enabled,
  onClose,
}: { enabled?: boolean; onClose?: () => void } = {}) {
  const [helperEnabled, setHelperEnabled] = useAtom(helperEnabledAtom);

  /**
   * Enable the helper when ?enableTrackerHelper appended to URL.
   * Unless the helper is being manually managed using the enabled prop.
   */
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.has("enableTrackerHelper")) setHelperEnabled(true);
  }, [enabled, setHelperEnabled]);

  function _onClose() {
    if (onClose) onClose();
    setHelperEnabled(false);
  }

  const _enabled = "undefined" !== typeof enabled ? enabled : helperEnabled;

  return _enabled ? <TrackerHelperInner onClose={_onClose} /> : null;
}

export function TrackerHelperInner({ onClose }: { onClose: () => void }) {
  const { events, isConnected, clearEvents } = useTrackerState();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contentNode = ref.current;
    if (!contentNode) return;
    contentNode.scrollTo({ top: contentNode.scrollHeight });
  }, [events]);

  return (
    <Draggable handle=".tracker-helper__drag-handle">
      <div className="tracker-helper">
        <div className="tracker-helper__header">
          <DragHandle />
          <span className="tracker-helper__title">Tracker helper</span>
          <CloseButton onClose={onClose} />
        </div>
        <div className="tracker-helper__content" ref={ref}>
          <div className="tracker-helper__connection">
            <span className="tracker-helper__title">RudderStack</span>
            {isConnected ? (
              <div className="tracker-helper__badge tracker-helper__badge--success">
                Connected
              </div>
            ) : (
              <div className="tracker-helper__badge">Disconnected</div>
            )}
          </div>
          <div className="tracker-helper__summary">
            <div>
              <span className="tracker-helper__title">Events received</span>
              <div className="tracker-helper__badge tracker-helper__badge--no-dot">
                {events.length}
              </div>
            </div>
            {0 < events.length && (
              <button onClick={() => clearEvents()}>Clear events</button>
            )}
          </div>
          {0 < events.length && (
            <div className="tracker-helper__events">
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
    <div className="tracker-helper__event">
      <button
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        className={clsx(
          "tracker-helper__event-button",
          event.isEmitted && "tracker-helper__event-button--emitted",
        )}
      >
        <span className="tracker-helper__muted">{event.type}</span>
        {`${event.args[0]}`}
        <span className="tracker-helper__muted">
          {format(event.receivedAt, "HH:mm:ss")}
        </span>
        {event.isDuplicate && (
          <span className="tracker-helper__warning">
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
    <div className="tracker-helper__event-json">
      <pre>{eventJson}</pre>
    </div>
  );
}

function DragHandle() {
  return (
    <svg
      viewBox="1 1 18 18"
      fill="currentColor"
      className="tracker-helper__drag-handle"
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

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button className="tracker-helper__close-btn" onClick={() => onClose()}>
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.97 15.03a.75.75 0 1 0 1.06-1.06l-3.97-3.97 3.97-3.97a.75.75 0 0 0-1.06-1.06l-3.97 3.97-3.97-3.97a.75.75 0 0 0-1.06 1.06l3.97 3.97-3.97 3.97a.75.75 0 1 0 1.06 1.06l3.97-3.97 3.97 3.97Z"></path>
      </svg>
    </button>
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
