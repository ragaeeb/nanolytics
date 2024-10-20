[![wakatime](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/4c65c519-f727-4fbf-a317-703ef2fdc9c5.svg)](https://wakatime.com/badge/user/a0b906ce-b8e7-4463-8bce-383238df6d4b/project/4c65c519-f727-4fbf-a317-703ef2fdc9c5)
[![Node.js CI](https://github.com/ragaeeb/nanolytics/actions/workflows/build.yml/badge.svg)](https://github.com/ragaeeb/nanolytics/actions/workflows/build.yml)
![GitHub License](https://img.shields.io/github/license/ragaeeb/nanolytics)
![GitHub Release](https://img.shields.io/github/v/release/ragaeeb/nanolytics)
![GitHub stars](https://img.shields.io/github/stars/ragaeeb/nanolytics?style=social)

[![codecov](https://codecov.io/gh/ragaeeb/nanolytics/graph/badge.svg?token=INVJON8919)](https://codecov.io/gh/ragaeeb/nanolytics)
[![Size](https://deno.bundlejs.com/badge?q=nanolytics@1.0.0)](https://bundlejs.com/?q=nanolytics%401.0.0)
![typescript](https://badgen.net/badge/icon/typescript?icon=typescript&label&color=blue) ![npm](https://img.shields.io/npm/v/nanolytics) ![npm](https://img.shields.io/npm/dm/nanolytics) ![GitHub issues](https://img.shields.io/github/issues/ragaeeb/nanolytics)
[![0 dependencies!](https://0dependencies.dev/0dependencies.svg)](https://0dependencies.dev)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=coverage)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=bugs)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ragaeeb_nanolytics&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=ragaeeb_nanolytics)

# nanolytics

Nanolytics is a minimalistic, 0-dependency lightweight client-side analytics tracking library. It allows you to capture events, store them locally, and submit them to a server after a predefined threshold. The library focuses on simplicity and efficiency, allowing developers to easily integrate event tracking into their applications with minimal overhead.

## Features

-   🟢 Tiny and minimal: Lightweight library focused on keeping things simple.
-   ⏳ Event batching: Stores events in localStorage and submits them periodically or based on event count.
-   🔌 Flexible submission: Client provides custom event submission logic through a callback.
-   🧩 Easy integration: Simple API to start tracking events immediately.

## Installation

To install nanolytics, use npm or yarn:

```bash
npm install nanolytics
# or
yarn add nanolytics
# or
pnpm i nanolytics
```

## Requirements

Node.js >= `20.0.0`

## Usage

### 1. Initialize the library

To start using Nanolytics, you need to initialize the library with your custom submission logic. This is done via the `init()` function, where you provide a callback that will handle the submission of analytics data to your server.

```javascript
import { init, record } from 'nanolytics';

// Example submission function that sends data to your API
const submitAnalytics = async (userInfo, events) => {
    const response = await post('analytics', { state: userInfo, data: events });
    return response; // Ensure the response is properly handled on the client side, a 200 OK will cause the library to flush its store
};

// Initialize the library with your submit function
init(submitAnalytics, { maxEventsLimitUntilSubmit: 150 });
```

By default the library will automatically trigger a submission after `100` events are queued up if you do not explicitly set the `maxEventsLimitUntilSubmit` value.

The `submitAnalytics` function will be called when it’s time to flush stored events to the server. It receives two arguments:

-   `userInfo`: Your custom user information (retrieved using getUserInfo() in the library).
-   `events`: An array of event objects to be submitted.

### 2. Record events

Use the `record()` function to capture user interactions or any event you want to track.

```javascript
// Record a simple event
record('ButtonClicked');

// Record an event with context
record('FormatByRule', 'ruleName', { from: 'Freewrite' });
```

Each event consists of a name, a timestamp, and optional context data. These events are stored in localStorage until they are submitted to your server based on the configured threshold.

### 3. Event submission and storage

-   Events are stored in localStorage under the key events.
-   Once the number of stored events exceeds the threshold (100 by default), they will be submitted automatically.
-   The events will also be submitted when the user closes the page or switches browser tabs (tracked by visibility changes).

### Customizing the submission logic

You can implement your own submission logic using any API interaction library, such as axios, fetch, or another HTTP client.

Here’s an example using `axios`:

```javascript
import axios from 'axios';

const submitAnalytics = async (userInfo, events) => {
    try {
        const response = await axios.put('/analytics-endpoint', { state: userInfo, data: events });
        return response.data;
    } catch (error) {
        console.error('Analytics submission failed:', error);
    }
};

init(submitAnalytics);
```

### Example Integration

You can use Nanolytics to track user actions throughout your application. For example:

```javascript
// Track when a user starts a new session
record('StartSession');

// Track when a user interacts with a button
const handleButtonClick = () => {
    record('ButtonClicked', 'HomePage');
};

// Track form submission with additional context
record('FormSubmitted', 'SignUpForm', { referrer: 'Homepage' });
```

### Commit Events

You can use the commit() function to store and save events to localStorage when the user leaves the page or closes the window.

```javascript
window.onbeforeunload = () => {
    commit(); // Commit and store events before the user navigates away
};
```

## API Reference

### init(submitFn: SubmitAnalyticsCallback, options: InitOptions)

Initializes the Nanolytics library and sets up event listeners.

-   `submitFn`: A function to handle the submission of analytics data.
-   `options`: Configuration options for initialization.
-   `options.maxEventsLimitUntilSubmit`: The maximum number of events before triggering a submission (default: 100).

### record(event: string, context?: string, moreContext?: Record<string, any>)

Records a new event with a timestamp.

-   `event`: The name of the event to be tracked (e.g., 'ButtonClick').
-   `context`: (Optional) A string representing additional context for the event (e.g., a screen or component name).
-   `moreContext`: (Optional) A key-value map for additional context data.

### commit()

Commits all current session events to localStorage and ends the session by recording an `EndSession` event.

### clearEvents()

Clears all current session events in memory.

### getSavedEvents()

Retrieves all events saved in localStorage.

### deleteSavedEvents()

Deletes all events stored in localStorage.

### getEvents()

Retrieves the current session's events from memory.

### getUserInfo()

Retrieves user information such as language, platform, and user agent.

## Contributing

If you'd like to contribute to the SDK, feel free to fork the repository and submit a pull request. Contributions are welcome!

## License

This SDK is licensed under the MIT License.
