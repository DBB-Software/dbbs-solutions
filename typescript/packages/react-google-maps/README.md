## Name: react-google-maps

The package provides reusable React components for Google Maps integration, including a GoogleMap component for rendering maps and a MarkerCluster component for clustering map markers. It simplifies the process of integrating Google Maps into your application with customizable configurations for markers, map options, and event handling.

## Usage

Install `@dbbs/react-google-maps` into your application using Yarn.

```bash
yarn add @dbbs/react-google-maps
```

## Examples

GoogleMap Component

The GoogleMap component is used to render a Google Map with various customizable options such as the center, zoom level, and event handlers.

```tsx
import { GoogleMap } from '@dbbs/react-google-maps';

export default function App() {
  return (
    <GoogleMap
      apiKey="your-google-maps-api-key" // Required API key for Google Maps
      defaultCenter={{ lat: -33.8688, lng: 151.2093 }} // Initial center of the map
      defaultZoom={10} // Initial zoom level
      onCameraChanged={(center, zoom) =>
        console.log('Camera changed:', center, zoom)
      } // Event handler for camera changes
      libraries={['places', 'geometry']} // Load additional Google Maps libraries
    />
  );
}
```

MarkerCluster Component

The MarkerCluster component is used to cluster map markers for better visualization when there are multiple markers on the map.

```tsx
import React from 'react';
import GoogleMap from './GoogleMap'; // Assuming GoogleMap is in the same folder
import { MarkerCluster } from '@dbbs/react-google-maps';

const markers = [
  {
    id: '1',
    position: { lat: -33.8688, lng: 151.2093 },
    backgroundColor: '#FF0000',
    glyphColor: '#FFFFFF',
    borderColor: '#000000',
    onClick: (position) => console.log('Marker clicked at:', position),
  },
  {
    id: '2',
    position: { lat: -33.8688, lng: 151.2293 },
  },
];

export default function App() {
  return (
    <GoogleMap
      apiKey="YOUR_GOOGLE_MAPS_API_KEY"
      defaultCenter={{ lat: -33.8688, lng: 151.2093 }}
      defaultZoom={12}
      onCameraChanged={(center, zoom) => {
        console.log('Camera changed:', center, zoom);
      }}
    >
      <MarkerCluster markers={markers} />
    </GoogleMap>
  );
}
```
## Features

- GoogleMap: A fully customizable map component supporting various Google Maps options and event handling.
- MarkerCluster: Simplifies marker clustering for better visualization of multiple map markers.

## Feature Keywords

- google-maps-integration
- marker-clustering
- map-customization

## Language and framework

- React
- TypeScript

## Type

- Package

## Tech Category

- Front-end

## Domain Category

- Common

## License

The DBBS Pre-Built Solutions is open-source software licensed under the [MIT License](LICENSE).

## Authors and owners

- Rostyslav Zahorulko

## Links

[Google Maps React Documentation](https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1)

## Relations

- typescript/apps/web-spa
- typescript/apps/web-ssr

## External dependencies

- react
- @googlemaps/markerclusterer
- @vis.gl/react-google-maps
