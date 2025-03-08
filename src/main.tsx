import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";

import {
  useTracker,
  TrackerHelper,
  RudderStackAdapter,
  KlaviyoAdapter,
} from "./index";

function Tracker() {
  const tracker = useTracker();

  useEffect(() => {
    tracker.loadAdapter(
      new RudderStackAdapter({
        writeKey: "2pTOhWPvU6QdWwcE1v9QM8vAQqQ",
        dataPlaneUrl: "https://bareddanxhuwkw.dataplane.rudderstack.com",
      }),
    );

    tracker.loadAdapter(new KlaviyoAdapter({ companyId: "JnNaYr" }));
  }, [tracker]);

  return null;
}

function Component() {
  const tracker = useTracker();

  return (
    <>
      <h1>Actions</h1>
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={() =>
            tracker.identify("123456", {
              firstName: "Bobby",
              lastName: "Tables",
              email: "foo@example.com",
            })
          }
        >
          Identify
        </button>
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
      <TrackerHelper enabled />
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Component />
  </StrictMode>,
);
