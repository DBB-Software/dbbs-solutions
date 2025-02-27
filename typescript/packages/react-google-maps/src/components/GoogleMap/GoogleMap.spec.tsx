import { render, waitFor } from '../../testUtils/testUtils'
import GoogleMap from './GoogleMap'

class MockGoogleMapInstance {
  setCenter: jest.Mock

  setZoom: jest.Mock

  setOptions: jest.Mock

  constructor(options: google.maps.MapOptions) {
    this.setCenter = jest.fn()
    this.setZoom = jest.fn()
    this.setOptions = jest.fn()

    this.setCenter(options.center)
    this.setZoom(options.zoom ?? 10)
  }
}

const MockGoogleMap = jest
  .fn()
  .mockImplementation((options: google.maps.MapOptions) => new MockGoogleMapInstance(options))

const mockImportLibrary = jest.fn(async (library: string) =>
  library === 'core' ? { event: { addListener: jest.fn() } } : { Map: MockGoogleMap }
)

beforeAll(() => {
  global.google = {
    maps: {
      importLibrary: mockImportLibrary,
      Map: MockGoogleMap,
      event: {
        addListener: jest.fn().mockImplementation(() => ({ remove: jest.fn(), clearInstanceListeners: jest.fn() })),
        clearInstanceListeners: jest.fn()
      }
    }
  } as unknown as typeof google
})

afterEach(() => {
  jest.clearAllMocks()
})

describe.skip('<GoogleMap />', () => {
  const defaultProps = {
    apiKey: 'test-api-key',
    defaultCenter: { lat: -33.8688, lng: 151.2093 },
    defaultZoom: 10,
    onLoad: jest.fn(),
    onError: jest.fn()
  }

  it('renders and initializes the map correctly', async () => {
    render(<GoogleMap {...defaultProps} />)

    await waitFor(() => {
      expect(mockImportLibrary).toHaveBeenCalledWith('maps')
      expect(mockImportLibrary).toHaveBeenCalledWith('core')
    })

    expect(MockGoogleMap).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        center: defaultProps.defaultCenter,
        zoom: defaultProps.defaultZoom
      })
    )

    expect(defaultProps.onLoad).toHaveBeenCalledTimes(1)
  })

  it('handles errors during API loading', async () => {
    const error = new Error('API loading failed')
    mockImportLibrary.mockRejectedValueOnce(error)

    render(<GoogleMap {...defaultProps} />)

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledTimes(1)
    })
    expect(defaultProps.onError).toHaveBeenCalledWith(error)
  })

  it('applies additional libraries correctly', async () => {
    render(<GoogleMap {...defaultProps} libraries={['places', 'geometry']} />)

    await waitFor(() => {
      expect(mockImportLibrary).toHaveBeenCalledWith('places')
      expect(mockImportLibrary).toHaveBeenCalledWith('geometry')
    })
  })

  it('renders children inside the Map component', async () => {
    const childText = 'Test Child'
    const { getByText } = render(
      <GoogleMap {...defaultProps}>
        <div>{childText}</div>
      </GoogleMap>
    )

    await waitFor(() => {
      expect(getByText(childText)).toBeVisible()
    })
  })

  it('does not call onLoad if the API fails to load', async () => {
    const error = new Error('API loading failed')
    mockImportLibrary.mockRejectedValueOnce(error)

    render(<GoogleMap {...defaultProps} />)

    await waitFor(() => {
      expect(defaultProps.onLoad).not.toHaveBeenCalled()
    })
  })
})
