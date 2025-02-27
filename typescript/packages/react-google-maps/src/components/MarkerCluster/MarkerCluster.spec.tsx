import { useMap } from '@vis.gl/react-google-maps'
import { render, waitFor } from '../../testUtils/testUtils'
import MarkerCluster, { MarkerData } from './MarkerCluster'

jest.mock('@vis.gl/react-google-maps', () => ({
  useMap: jest.fn(),
  AdvancedMarker: jest.fn(({ children, ...props }) => (
    <div data-testid={props['data-testid']} {...props}>
      {children}
    </div>
  )),
  Pin: jest.fn((props) => <div data-testid={props['data-testid']} />)
}))

const addMarkersMock = jest.fn()
const clearMarkersMock = jest.fn()

jest.mock('@googlemaps/markerclusterer', () => ({
  MarkerClusterer: jest.fn().mockImplementation(() => ({
    addMarkers: addMarkersMock,
    clearMarkers: clearMarkersMock
  }))
}))

const mockUseMap = useMap as jest.Mock

const mockMarkers: MarkerData[] = [
  {
    id: '1',
    position: { lat: 40.7128, lng: -74.006 },
    backgroundColor: 'red',
    glyphColor: 'white',
    borderColor: 'black',
    isClickable: true,
    onClick: jest.fn()
  },
  {
    id: '2',
    position: { lat: 34.0522, lng: -118.2437 },
    backgroundColor: 'blue',
    glyphColor: 'yellow',
    borderColor: 'green',
    isClickable: false,
    onClick: jest.fn()
  }
]

describe('<MarkerCluster />', () => {
  beforeEach(() => {
    mockUseMap.mockReturnValue({})
    jest.clearAllMocks()
  })

  it('calls clearMarkers and addMarkers when markers prop changes', async () => {
    const { rerender } = render(<MarkerCluster markers={mockMarkers} />)

    await waitFor(() => {
      expect(clearMarkersMock).toHaveBeenCalledTimes(1)
      expect(addMarkersMock).toHaveBeenCalledTimes(1)
      expect(addMarkersMock).toHaveBeenCalledWith(expect.any(Array))
    })

    const updatedMarkers: MarkerData[] = [
      {
        id: '3',
        position: { lat: 51.5074, lng: -0.1278 },
        backgroundColor: 'purple',
        glyphColor: 'orange',
        borderColor: 'gray',
        isClickable: true,
        onClick: jest.fn()
      }
    ]

    rerender(<MarkerCluster markers={updatedMarkers} />)

    await waitFor(() => {
      expect(clearMarkersMock).toHaveBeenCalledTimes(2)
      expect(addMarkersMock).toHaveBeenCalledTimes(2)
    })
  })
})
