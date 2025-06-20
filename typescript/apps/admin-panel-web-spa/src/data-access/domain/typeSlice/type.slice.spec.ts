import fetchMock from 'jest-fetch-mock'
import {
  testApiSuccessResponse,
  testApiErrorResponse,
  testApiUpdateSuccessResponse,
  testApiUpdateErrorResponse,
  setupStore
} from '../../../testUtils'
import { typeSlice, selectDomainGetTypeList } from './type.slice'
import { rootReducer } from '../../../store/reducer'
import { mockType, mockTypeListResponse, mockUpdateTypePayload } from './mocks'

const baseURL = process.env.WEB_APP_API_URL || ''

describe('type.slice', () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })
  describe('endpoints', () => {
    describe('createType', () => {
      it('should make correct API call', async () => {
        const { store } = setupStore({ overrideReducer: rootReducer })
        await store.dispatch(typeSlice.endpoints.createType.initiate(mockType))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('POST')
        expect(url).toContain(`${baseURL}/types`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(typeSlice.endpoints.createType.initiate(mockType))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockType)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(typeSlice.endpoints.createType.initiate(mockType))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('updateType', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(typeSlice.endpoints.updateType.initiate(mockUpdateTypePayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('PATCH')
        expect(url).toContain(`${baseURL}/types/${mockUpdateTypePayload.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(typeSlice.endpoints.updateType.initiate(mockUpdateTypePayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockType)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(typeSlice.endpoints.updateType.initiate(mockUpdateTypePayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('deleteType', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(typeSlice.endpoints.deleteType.initiate(mockType.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('DELETE')
        expect(url).toContain(`${baseURL}/types/${mockType.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(typeSlice.endpoints.deleteType.initiate(mockType.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockType)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(typeSlice.endpoints.deleteType.initiate(mockType.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('getTypeList', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockTypeListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        await store.dispatch(typeSlice.endpoints.getTypeList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('GET')
        expect(url).toContain(`${baseURL}/types?limit=10&offset=0`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockTypeListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(typeSlice.endpoints.getTypeList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiSuccessResponse(action, mockTypeListResponse)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))

        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(typeSlice.endpoints.getTypeList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiErrorResponse(action, errorMessage)
      })
    })
  })

  describe('selectors', () => {
    it('should select meeting type list state from store', async () => {
      fetchMock.mockResponse(JSON.stringify(mockTypeListResponse))
      const { store } = setupStore({ overrideReducer: rootReducer })

      await store.dispatch(typeSlice.endpoints.getTypeList.initiate({ limit: 10, offset: 0 }))

      const { data: typeListState } = selectDomainGetTypeList({ limit: 10, offset: 0 })(store.getState())
      expect(typeListState).toEqual(mockTypeListResponse)
    })
  })
})
