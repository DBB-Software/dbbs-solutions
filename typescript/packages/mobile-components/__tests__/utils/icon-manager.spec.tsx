import { ExistedSvg, IconManager } from '../../src'

describe('IconManager', () => {
  test('contains SVG components for each key in ExistedSvg', () => {
    Object.entries(IconManager).forEach(([name, Component]) => {
      expect(name in ExistedSvg).toBe(true)
      expect(Component).toBeDefined()
    })
  })

  test('each SVG component is of type FC<IconProps>', () => {
    Object.values(IconManager).forEach((Component) => {
      expect(typeof Component).toBe('function')
      expect(Component.length).toBe(1)
    })
  })
})
