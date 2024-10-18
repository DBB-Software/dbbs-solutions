import { mocked } from 'jest-mock'
import { getApps, getApp, initializeApp as firebaseInitializeApp } from 'firebase-admin/app'
import { initializeApp, type AppOptions, type App } from '../../src/admin'

const mockInitializeApp = mocked(firebaseInitializeApp)
const mockGetApps = mocked(getApps)
const mockGetApp = mocked(getApp)

jest.mock('firebase-admin/app')

const mockFirebaseOptions: AppOptions = {
  projectId: 'project-id'
}
const mockProjectName = 'test-project'
const mockFirebaseApp: App = {
  options: mockFirebaseOptions,
  name: mockProjectName
}

describe('initialize firebase app', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it('should create new firebase app', () => {
    initializeApp(mockFirebaseOptions, mockProjectName)

    expect(mockGetApps).toHaveBeenCalledTimes(1)
    expect(mockInitializeApp).toHaveBeenCalledTimes(1)
    expect(mockInitializeApp).toHaveBeenCalledWith(mockFirebaseOptions, mockProjectName)
    expect(mockGetApp).not.toHaveBeenCalled()
  })

  it('should return app if it was already initialized', () => {
    mockGetApps.mockReturnValueOnce([mockFirebaseApp])

    initializeApp(mockFirebaseOptions, mockProjectName)

    expect(mockGetApps).toHaveBeenCalledTimes(1)
    expect(mockGetApp).toHaveBeenCalledTimes(1)
    expect(mockGetApp).toHaveBeenCalledWith(mockProjectName)
    expect(mockInitializeApp).not.toHaveBeenCalled()
  })
})
