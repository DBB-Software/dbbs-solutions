import { FC, useEffect, useRef, useCallback } from 'react'
import { MarkerClusterer as GoogleMarkerClusterer, Marker as GoogleMarker } from '@googlemaps/markerclusterer'
import { useMap, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import { MARKER_CLUSTER_TEST_IDS } from './testIds'

export type MarkerData = {
  id: string
  position: { lat: number; lng: number }
  backgroundColor?: string
  glyphColor?: string
  borderColor?: string
  isClickable?: boolean
  onClick?: (position: { lat: number; lng: number }) => void
}

export type MarkerClusterProps = {
  markers: MarkerData[]
  defaultPinBackground?: string
  defaultPinGlyphColor?: string
  defaultPinBorderColor?: string
}

const MarkerCluster: FC<MarkerClusterProps> = ({
  markers,
  defaultPinBackground,
  defaultPinBorderColor,
  defaultPinGlyphColor
}) => {
  const map = useMap()

  const clustererRef = useRef<GoogleMarkerClusterer | null>(null)
  const markerRefs = useRef<Record<string, GoogleMarker>>({})

  useEffect(() => {
    if (map && !clustererRef.current) {
      clustererRef.current = new GoogleMarkerClusterer({ map })
    }
  }, [map])

  useEffect(() => {
    const clusterer = clustererRef.current
    if (!clusterer) return

    const currentMarkers = Object.values(markerRefs.current)
    clusterer.clearMarkers()
    clusterer.addMarkers(currentMarkers)
  }, [markers])

  const handleMarkerRef = useCallback((marker: GoogleMarker | null, id: string) => {
    if (marker) {
      markerRefs.current[id] = marker
    } else {
      delete markerRefs.current[id]
    }
  }, [])

  return (
    <>
      {markers.map(({ id, position, backgroundColor, glyphColor, borderColor, isClickable = true, onClick }) => (
        <AdvancedMarker
          key={id}
          position={position}
          clickable={isClickable}
          data-testid={MARKER_CLUSTER_TEST_IDS.getAdvancedMarkerTestId(id)}
          onClick={() => onClick?.(position)}
          ref={(marker) => handleMarkerRef(marker, id)}
        >
          <Pin
            data-testid={MARKER_CLUSTER_TEST_IDS.getPinTestId(id)}
            background={defaultPinBackground ?? backgroundColor}
            glyphColor={defaultPinGlyphColor ?? glyphColor}
            borderColor={defaultPinBorderColor ?? borderColor}
          />
        </AdvancedMarker>
      ))}
    </>
  )
}

export default MarkerCluster
