import { useTrackerState } from "./hooks";

import "./TrackerDebugger.css";

export function TrackerDebugger() {
  const { events, isConnected } = useTrackerState();

  return (
    <div className="tracker-debugger">
      <div className="tracker-debugger__header">
        <span>Tracker Debugger</span>
        <span>{isConnected ? "✅ Connected" : "❌ Disconnected"}</span>
      </div>
      <div className="tracker-debugger__section">
        {0 === events.length && <p>⏳ No events emitted yet.</p>}
        {0 < events.length && (
          <ol>
            {events.map((event) => (
              <li key={event.id}>
                <span>
                  {event.isEmitted ? "✅ " : "⏳ "}
                  {event.type}
                </span>
                {!!event.args[0] && <span>{`${event.args[0]}`}</span>}
                {event.isDuplicate && <span>⚠️ Duplicate</span>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
