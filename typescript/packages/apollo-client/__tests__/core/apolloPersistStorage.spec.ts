import { MMKV } from 'react-native-mmkv'
import { ApolloPersistStorage, defaultApolloPersistStorage } from '../../src'

const testCases = [
  {
    description: 'should set an item in storage',
    action: (storage: ApolloPersistStorage) => storage.setItem('key', 'value'),
    expectedCall: (mockStorage: MMKV) => expect(mockStorage.set).toHaveBeenCalledWith('key', 'value')
  },
  {
    description: 'should return an item from storage',
    setup: (mockStorage: MMKV) => (mockStorage.getString as jest.Mock).mockReturnValue('stored_value'),
    action: (storage: ApolloPersistStorage) => {
      const result = storage.getItem('key')
      expect(result).toBe('stored_value')
    },
    expectedCall: (mockStorage: MMKV) => expect(mockStorage.getString).toHaveBeenCalledWith('key')
  },
  {
    description: 'should return null if item does not exist in storage',
    setup: (mockStorage: MMKV) => (mockStorage.getString as jest.Mock).mockReturnValue(null),
    action: (storage: ApolloPersistStorage) => {
      const result = storage.getItem('non_existent_key')
      expect(result).toBeNull()
    },
    expectedCall: (mockStorage: MMKV) => expect(mockStorage.getString).toHaveBeenCalledWith('non_existent_key')
  },
  {
    description: 'should remove an item from storage',
    action: (storage: ApolloPersistStorage) => storage.removeItem('key'),
    expectedCall: (mockStorage: MMKV) => expect(mockStorage.delete).toHaveBeenCalledWith('key')
  }
]

describe('ApolloPersistStorage', () => {
  let mockMMKV: MMKV
  let apolloPersistStorage: ApolloPersistStorage

  beforeEach(() => {
    mockMMKV = new MMKV()
    apolloPersistStorage = new ApolloPersistStorage(mockMMKV)
  })

  test.each(testCases)('$description', ({ setup, action, expectedCall }) => {
    if (setup) setup(mockMMKV)
    action(apolloPersistStorage)
    expectedCall(mockMMKV)
  })
})

describe('defaultApolloPersistStorage', () => {
  it('should be initialized correctly', () => {
    expect(defaultApolloPersistStorage).toBeInstanceOf(ApolloPersistStorage)
  })
})
