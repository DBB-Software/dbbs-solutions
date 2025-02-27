import fetchMock from 'jest-fetch-mock'
import {
  testApiSuccessResponse,
  testApiErrorResponse,
  testApiUpdateSuccessResponse,
  testApiUpdateErrorResponse,
  setupStore
} from '../../../testUtils'
import { geoSlice, selectDomainGetGeoList } from './geos.slice'
import { rootReducer } from '../../../store/reducer'
import { mockGeo, mockGeoListResponse, mockUpdateGeoPayload } from './mocks'

const baseURL = process.env.WEB_APP_API_URL || ''

describe('geo.slice', () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('endpoints', () => {
    describe('createGeo', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })
        await store.dispatch(geoSlice.endpoints.createGeo.initiate(mockGeo))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('POST')
        expect(url).toContain(`${baseURL}/geos`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.createGeo.initiate(mockGeo))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockGeo)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.createGeo.initiate(mockGeo))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('updateGeo', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(geoSlice.endpoints.updateGeo.initiate(mockUpdateGeoPayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('PATCH')
        expect(url).toContain(`${baseURL}/geos/${mockUpdateGeoPayload.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.updateGeo.initiate(mockUpdateGeoPayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockGeo)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.updateGeo.initiate(mockUpdateGeoPayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('deleteGeo', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(geoSlice.endpoints.deleteGeo.initiate(mockGeo.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('DELETE')
        expect(url).toContain(`${baseURL}/geos/${mockGeo.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.deleteGeo.initiate(mockGeo.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockGeo)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.deleteGeo.initiate(mockGeo.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('getGeoList', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeoListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        await store.dispatch(geoSlice.endpoints.getGeoList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('GET')
        expect(url).toContain(`${baseURL}/geos?limit=10`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeoListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(geoSlice.endpoints.getGeoList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiSuccessResponse(action, mockGeoListResponse)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))

        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(geoSlice.endpoints.getGeoList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiErrorResponse(action, errorMessage)
      })
    })

    describe('getGeoById', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(geoSlice.endpoints.getGeoById.initiate(mockGeo.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('GET')
        expect(url).toContain(`${baseURL}/geos/${mockGeo.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockGeo))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.getGeoById.initiate(mockGeo.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiSuccessResponse(action, mockGeo)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))

        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(geoSlice.endpoints.getGeoById.initiate(mockGeo.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiErrorResponse(action, errorMessage)
      })
    })
  })

  describe('selectors', () => {
    it('should select geo list state from store', async () => {
      fetchMock.mockResponse(JSON.stringify(mockGeoListResponse))
      const { store } = setupStore({ overrideReducer: rootReducer })

      await store.dispatch(geoSlice.endpoints.getGeoList.initiate({ limit: 10, offset: 0 }))

      const { data: geoListState } = selectDomainGetGeoList({ limit: 10, offset: 0 })(store.getState())
      expect(geoListState).toEqual(mockGeoListResponse)
    })
  })
})
