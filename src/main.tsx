import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import { RudderAnalytics } from "@rudderstack/analytics-js";

import { useTracker, TrackerHelper } from "./index";

const rudderAnalytics = new RudderAnalytics();

function Tracker() {
  const tracker = useTracker();

  useEffect(() => {
    rudderAnalytics.load(
      "2pTOhWPvU6QdWwcE1v9QM8vAQqQ",
      "https://bareddanxhuwkw.dataplane.rudderstack.com",
    );

    rudderAnalytics.ready(() => {
      tracker.init({ tracker: rudderAnalytics });
    });
  }, [tracker]);

  return null;
}

function Component() {
  const tracker = useTracker();

  return (
    <>
      <h1>Actions</h1>
      <div style={{ display: "flex", gap: "15px" }}>
        <button onClick={() => tracker.identify("123456")}>Identify</button>
        <button onClick={() => tracker.page("Homepage")}>Page: Homepage</button>
        <button onClick={() => tracker.page("Product", "Black T-Shirt")}>
          Page: Product
        </button>
        <button
          onClick={() =>
            tracker.track("Product Clicked", {
              product_id: "622c6f5d5cf86a4c77358033",
              sku: "8472-998-0112",
              category: "Games",
            })
          }
        >
          Track: Product Clicked
        </button>
      </div>
      <Tracker />
      <TrackerHelper />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Component />
  </StrictMode>,
);
