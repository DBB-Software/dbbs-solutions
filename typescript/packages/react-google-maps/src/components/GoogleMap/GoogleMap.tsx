import { FC, ReactNode } from 'react'
import { APIProvider, APIProviderProps, Map, MapProps, MapCameraChangedEvent } from '@vis.gl/react-google-maps'

export type GoogleMapProps = Pick<
  APIProviderProps,
  'apiKey' | 'region' | 'language' | 'onLoad' | 'onError' | 'channel' | 'libraries'
> &
  Pick<
    MapProps,
    | 'defaultCenter'
    | 'defaultZoom'
    | 'defaultHeading'
    | 'defaultTilt'
    | 'defaultBounds'
    | 'mapId'
    | 'className'
    | 'colorScheme'
    | 'renderingType'
    | 'reuseMaps'
  > & {
    onCameraChanged?: (center: google.maps.LatLngLiteral, zoom: number) => void
    children?: ReactNode
  }

const GoogleMap: FC<GoogleMapProps> = ({
  apiKey,
  onLoad,
  onError,
  region,
  language,
  channel,
  libraries,
  defaultCenter,
  defaultBounds,
  colorScheme,
  defaultZoom,
  renderingType,
  defaultHeading,
  defaultTilt,
  reuseMaps,
  mapId,
  onCameraChanged,
  children
}) => {
  if (!apiKey) {
    throw new Error('GoogleMap requires an `apiKey` prop.')
  }

  if (!defaultCenter) {
    throw new Error('GoogleMap requires a `defaultCenter` prop.')
  }

  return (
    <APIProvider
      apiKey={apiKey}
      onLoad={onLoad}
      onError={onError}
      region={region}
      language={language}
      channel={channel}
      libraries={libraries}
    >
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        defaultHeading={defaultHeading}
        defaultTilt={defaultTilt}
        defaultBounds={defaultBounds}
        mapId={mapId}
        onCameraChanged={(event: MapCameraChangedEvent) => {
          const { center, zoom } = event.detail
          onCameraChanged?.({ lat: center.lat, lng: center.lng }, zoom)
        }}
        colorScheme={colorScheme}
        renderingType={renderingType}
        reuseMaps={reuseMaps}
      >
        {children}
      </Map>
    </APIProvider>
  )
}

export default GoogleMap
