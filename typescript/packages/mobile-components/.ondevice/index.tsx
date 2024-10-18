import { MMKV } from 'react-native-mmkv'
import { view } from './storybook.requires'

const storage = new MMKV({ id: 'mobile-components-storybook-storage' })

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: (key) => {
      const value = storage.getString(key)
      return Promise.resolve(value || null)
    },
    setItem: (key, value) => {
      storage.set(key, value)
      return Promise.resolve()
    }
  }
})

export default StorybookUIRoot
