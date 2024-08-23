<p align="center">
  <a href="https://sentry.io/?utm_source=github&utm_medium=logo" target="_blank">
    <img src="https://sentry-brand.storage.googleapis.com/sentry-wordmark-dark-280x84.png" alt="Sentry" width="280" height="84">
  </a>
</p>

# DBB wrapper for Sentry SDK for ReactJS

## Links

- [Official SDK Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [TypeDoc](http://getsentry.github.io/sentry-javascript/)

## General

This package is a wrapper around `@sentry/react`, with added functionality related to React.

To use this SDK, call `Sentry.init(options)` before you mount your React component.

Remember to add the environment variable to your .env file.

```env
 WEB_APP_SENTRY_DSN=
```

```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { init } from '@dbbs/web-features/src/sentry/react'

init()

// ...

const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />);

// also works with hydrateRoot
// const domNode = document.getElementById('root');
// const root = hydrateRoot(domNode, reactNode);
// root.render(<App />);
```

### ErrorBoundary

`@dbbs/web-features/src/sentry/react` exports an ErrorBoundary component that will automatically send Javascript errors from inside a
component tree to Sentry, and set a fallback UI.

> app.js

```javascript
import React from 'react';
import { ErrorBoundary } from '@dbbs/web-features/src/sentry/react'

function FallbackComponent() {
  return <div>An error has occured</div>;
}

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary fallback={FallbackComponent} showDialog>
        <OtherComponents />
      </ErrorBoundary>
    );
  }
}

export default App;
```
