import fetchMock from 'jest-fetch-mock'
import {
  testApiSuccessResponse,
  testApiErrorResponse,
  testApiUpdateSuccessResponse,
  testApiUpdateErrorResponse,
  setupStore
} from '../../../testUtils'
import { meetingTypeSlice, selectDomainGetMeetingTypeList } from './meetingType.slice'
import { rootReducer } from '../../../store/reducer'
import { mockMeetingType, mockMeetingTypeListResponse, mockUpdateMeetingTypePayload } from './mocks'

const baseURL = process.env.WEB_APP_API_URL || ''

describe('meetingType.slice', () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })
  describe('endpoints', () => {
    describe('createMeetingType', () => {
      it('should make correct API call', async () => {
        const { store } = setupStore({ overrideReducer: rootReducer })
        await store.dispatch(meetingTypeSlice.endpoints.createMeetingType.initiate(mockMeetingType))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('POST')
        expect(url).toContain(`${baseURL}/meeting-types`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockMeetingType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(meetingTypeSlice.endpoints.createMeetingType.initiate(mockMeetingType))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockMeetingType)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(meetingTypeSlice.endpoints.createMeetingType.initiate(mockMeetingType))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('updateMeetingType', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockMeetingType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(meetingTypeSlice.endpoints.updateMeetingType.initiate(mockUpdateMeetingTypePayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('PATCH')
        expect(url).toContain(`${baseURL}/meeting-types/${mockUpdateMeetingTypePayload.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockMeetingType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(
          meetingTypeSlice.endpoints.updateMeetingType.initiate(mockUpdateMeetingTypePayload)
        )

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockMeetingType)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(
          meetingTypeSlice.endpoints.updateMeetingType.initiate(mockUpdateMeetingTypePayload)
        )

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('deleteMeetingType', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockMeetingType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(meetingTypeSlice.endpoints.deleteMeetingType.initiate(mockMeetingType.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('DELETE')
        expect(url).toContain(`${baseURL}/meeting-types/${mockMeetingType.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockMeetingType))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(meetingTypeSlice.endpoints.deleteMeetingType.initiate(mockMeetingType.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockMeetingType)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(meetingTypeSlice.endpoints.deleteMeetingType.initiate(mockMeetingType.id))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('getMeetingTypeList', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockMeetingTypeListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        await store.dispatch(meetingTypeSlice.endpoints.getMeetingTypeList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('GET')
        expect(url).toContain(`${baseURL}/meeting-types?limit=10&offset=0`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockMeetingTypeListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(meetingTypeSlice.endpoints.getMeetingTypeList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiSuccessResponse(action, mockMeetingTypeListResponse)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))

        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(meetingTypeSlice.endpoints.getMeetingTypeList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiErrorResponse(action, errorMessage)
      })
    })
  })

  describe('selectors', () => {
    it('should select meeting type list state from store', async () => {
      fetchMock.mockResponse(JSON.stringify(mockMeetingTypeListResponse))
      const { store } = setupStore({ overrideReducer: rootReducer })

      await store.dispatch(meetingTypeSlice.endpoints.getMeetingTypeList.initiate({ limit: 10, offset: 0 }))

      const { data: meetingTypeListState } = selectDomainGetMeetingTypeList({ limit: 10, offset: 0 })(store.getState())
      expect(meetingTypeListState).toEqual(mockMeetingTypeListResponse)
    })
  })
})
