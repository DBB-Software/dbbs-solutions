<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

# DBB wrapper for Sentry SDK for Next.js

## Links

- [Official SDK Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [TypeDoc](http://getsentry.github.io/sentry-javascript/)

## Compatibility

Currently, the minimum Next.js supported version is `11.2.0`.

## General

This package is a wrapper around `@sentry/nextjs`, with added
functionality related to Next.js.

To use this SDK, initialize it in the Next.js configuration, in the `sentry.client.config.ts|js` file, and in the
[Next.js Instrumentation Hook](https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation)
(`instrumentation.ts|js`).

Remember to add the environment variable to your .env file.

```env
 NEXT_PUBLIC_SENTRY_DSN=
```

```javascript
// next.config.js

const { withSentryConfig } = require('@dbbs/web-features/src/sentry/nextjs/withSentryConfig.js');

const nextConfig = {
  experimental: {
    // The instrumentation hook is required for Sentry to work on the serverside
    instrumentationHook: true,
  },
};

// Wrap the Next.js configuration with Sentry
module.exports = withSentryConfig(nextConfig);
```

```javascript
// sentry.client.config.js or .ts

import { init } from '@dbbs/web-features/src/sentry/nextjs'

init()

```

```javascript
// instrumentation.ts

import { registerSentry } from '@dbbs/web-features/src/sentry/nextjs'

export function register() {
  registerSentry()
}
```

To set context information or send manual events, use the exported functions of `@dbbs/web-features/src/sentry/nextjs`.

```javascript
import * as Sentry from '@dbbs/web-features/src/sentry/nextjs';

// Set user information, as well as tags and further extras
Sentry.setExtra('battery', 0.7);
Sentry.setTag('user_mode', 'admin');
Sentry.setUser({ id: '4711' });

// Add a breadcrumb for future events
Sentry.addBreadcrumb({
  message: 'My Breadcrumb',
  // ...
});

// Capture exceptions, messages or manual events
Sentry.captureMessage('Hello, world!');
Sentry.captureException(new Error('Good bye'));
Sentry.captureEvent({
  message: 'Manual',
  stacktrace: [
    // ...
  ],
});
```
