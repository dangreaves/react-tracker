import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { RudderAnalytics } from "@rudderstack/analytics-js";

import { useTracker, useIdentify, useSetTracker } from "./hooks";

const rudderAnalytics = new RudderAnalytics();

function Tracker() {
  useTracker();

  const identify = useIdentify();
  const setTracker = useSetTracker();

  // Load tracker when session is loaded.
  useEffect(() => {
    // Immediately call the identify method which will buffer an event.
    identify("123456", {
      name: "Bobby Smith",
    });

    // Wait 1 seconds and load the tracker, to test event buffering.
    setTimeout(() => {
      rudderAnalytics.load(
        "2pC2jJwYFOmWr02caQkfRa3Vkvw",
        "https://bareddanxhuwkw.dataplane.rudderstack.com",
      );

      rudderAnalytics.ready(() => {
        setTracker(rudderAnalytics);

        identify("9876", {
          name: "John Doe",
        });
      });
    }, 1000);
  }, [identify, setTracker]);

  return null;
}

function Component() {
  return (
    <>
      <div>Example component.</div>
      <Tracker />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Component />
  </StrictMode>,
);
