import { render } from '@testing-library/react-native'
import { CustomIcon } from '../../src'
import { IconManagerType } from '../../src/utils'

describe('CustomIcon', () => {
  const testData = [
    {
      name: 'main',
      size: 30,
      expectedTestId: 'custom-icon',
      expectedSize: 30
    },
    { name: 'invalid-icon', expectedTestId: 'paper-icon' },
    { name: 'main', expectedTestId: 'custom-icon', expectedSize: 25 }
  ]

  test.each(testData)('renders the correct icon for %s:', ({ name, size, expectedTestId, expectedSize }) => {
    const { getByTestId } = render(<CustomIcon name={name as keyof IconManagerType} size={size} />)
    const icon = getByTestId(expectedTestId)

    expect(icon).toBeDefined()
    if (icon.props.testID === 'custom-icon' && expectedSize) {
      expect(icon.props.width).toBe(expectedSize)
      expect(icon.props.height).toBe(expectedSize)
    }
  })
})
