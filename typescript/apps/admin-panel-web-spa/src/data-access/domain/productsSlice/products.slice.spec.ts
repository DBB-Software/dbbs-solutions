import fetchMock from 'jest-fetch-mock'
import {
  testApiSuccessResponse,
  testApiErrorResponse,
  testApiUpdateSuccessResponse,
  testApiUpdateErrorResponse,
  setupStore
} from '../../../testUtils'
import { productSlice, selectDomainGetProductList } from './products.slice'
import { rootReducer } from '../../../store/reducer'
import { mockProduct, mockProductListResponse, mockUpdateProductPayload } from './mocks'

const baseURL = process.env.WEB_APP_API_URL || ''

describe('product.slice', () => {
  beforeAll(() => {
    fetchMock.enableMocks()
  })

  afterEach(() => {
    fetchMock.resetMocks()
  })

  describe('endpoints', () => {
    describe('createProduct', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })
        await store.dispatch(productSlice.endpoints.createProduct.initiate(mockProduct))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('POST')
        expect(url).toContain(`${baseURL}/products`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.createProduct.initiate(mockProduct))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockProduct)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.createProduct.initiate(mockProduct))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('updateProduct', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(productSlice.endpoints.updateProduct.initiate(mockUpdateProductPayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('PATCH')
        expect(url).toContain(`${baseURL}/products/${mockUpdateProductPayload.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.updateProduct.initiate(mockUpdateProductPayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockProduct)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.updateProduct.initiate(mockUpdateProductPayload))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('deleteProduct', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(productSlice.endpoints.deleteProduct.initiate(mockProduct.id.toString()))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('DELETE')
        expect(url).toContain(`${baseURL}/products/${mockProduct.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.deleteProduct.initiate(mockProduct.id.toString()))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateSuccessResponse(action, mockProduct)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.deleteProduct.initiate(mockProduct.id.toString()))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiUpdateErrorResponse(action, errorMessage)
      })
    })

    describe('getProductList', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProductListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        await store.dispatch(productSlice.endpoints.getProductList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('GET')
        expect(url).toContain(`${baseURL}/products?limit=10`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProductListResponse))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(productSlice.endpoints.getProductList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiSuccessResponse(action, mockProductListResponse)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))

        const { store } = setupStore({ overrideReducer: rootReducer })

        const query = { limit: 10, offset: 0 }
        const action = await store.dispatch(productSlice.endpoints.getProductList.initiate(query))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiErrorResponse(action, errorMessage)
      })
    })

    describe('getProductById', () => {
      it('should make correct API call', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })

        await store.dispatch(productSlice.endpoints.getProductById.initiate(mockProduct.id.toString()))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        const { method, url } = fetchMock.mock.calls[0][0] as Request

        expect(method).toEqual('GET')
        expect(url).toContain(`${baseURL}/products/${mockProduct.id}`)
      })

      it('successful response', async () => {
        fetchMock.mockResponse(JSON.stringify(mockProduct))
        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.getProductById.initiate(mockProduct.id.toString()))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiSuccessResponse(action, mockProduct)
      })

      it('unsuccessful response', async () => {
        const errorMessage = 'Error.'
        fetchMock.mockReject(new Error(errorMessage))

        const { store } = setupStore({ overrideReducer: rootReducer })

        const action = await store.dispatch(productSlice.endpoints.getProductById.initiate(mockProduct.id.toString()))

        expect(fetchMock).toHaveBeenCalledTimes(1)
        testApiErrorResponse(action, errorMessage)
      })
    })
  })

  describe('selectors', () => {
    it('should select product list state from store', async () => {
      fetchMock.mockResponse(JSON.stringify(mockProductListResponse))
      const { store } = setupStore({ overrideReducer: rootReducer })

      await store.dispatch(productSlice.endpoints.getProductList.initiate({ limit: 10, offset: 0 }))

      const { data: productListState } = selectDomainGetProductList({ limit: 10, offset: 0 })(store.getState())
      expect(productListState).toEqual(mockProductListResponse)
    })
  })
})
