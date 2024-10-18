import { mocked } from 'jest-mock'
import { getApps, getApp, initializeApp as firebaseInitializeApp } from 'firebase/app'
import { initializeApp, type FirebaseOptions, type FirebaseApp } from '../../src/app'

const mockInitializeApp = mocked(firebaseInitializeApp)
const mockGetApps = mocked(getApps)
const mockGetApp = mocked(getApp)

jest.mock('firebase/app')

const mockFirebaseOptions: FirebaseOptions = {
  apiKey: 'api-key',
  projectId: 'project-id',
  appId: 'app-id'
}
const mockProjectName = 'test-project'
const mockFirebaseApp: FirebaseApp = {
  options: mockFirebaseOptions,
  name: mockProjectName,
  automaticDataCollectionEnabled: false
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
