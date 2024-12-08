# react-tracker

> React hooks for sending events to RudderStack and Segment

[![NPM Version](https://img.shields.io/npm/v/%40dangreaves%2Freact-tracker)](https://npmjs.com/@dangreaves/react-tracker)
![NPM License](https://img.shields.io/npm/l/%40dangreaves%2Freact-tracker)
![NPM Downloads](https://img.shields.io/npm/dm/%40dangreaves%2Freact-tracker)

This package exports a set of React hooks which make loading and emitting events to the [RudderStack](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk), [Segment](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript) or other Segment-compatible JavaScript tracking SDKs easier.

It also exports a `<TrackerHelper />` component which renders a floating debug window, similar to the [Shopify Pixel Helper](https://help.shopify.com/en/manual/promoting-marketing/pixels/custom-pixels/testing#shopify-pixel-helper), showing an expandable list of tracking events as they are emitted.

<img src="./docs/tracker_helper_screenshot.png" width="420" />

## Installation

```sh
npm install @dangreaves/react-tracker
```
