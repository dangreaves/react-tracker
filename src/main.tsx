import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { RudderAnalytics } from "@rudderstack/analytics-js";

import { useTracker } from "./hooks";

const rudderAnalytics = new RudderAnalytics();

function Tracker() {
  const tracker = useTracker();

  useEffect(() => {
    rudderAnalytics.load(
      "2pC2jJwYFOmWr02caQkfRa3Vkvw",
      "https://bareddanxhuwkw.dataplane.rudderstack.com",
    );

    rudderAnalytics.ready(() => {
      tracker.init({ tracker: rudderAnalytics });
    });
  }, [tracker]);

  return null;
}

function IdentifyButton() {
  const tracker = useTracker();
  return <button onClick={() => tracker.identify("123456")}>Identify</button>;
}

function PageButton() {
  const tracker = useTracker();
  return <button onClick={() => tracker.page("homepage")}>Page</button>;
}

function Component() {
  return (
    <>
      <IdentifyButton />
      <PageButton />
      <Tracker />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Component />
  </StrictMode>,
);
