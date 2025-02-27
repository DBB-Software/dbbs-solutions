import React from 'react'
import { CustomAutocomplete, Option } from './CustomAutocomplete'
import { renderWithForm } from '../../testUtils/customRender'

describe('<CustomAutocomplete />', () => {
  const options: Option[] = [
    { id: '1', label: 'Option 1' },
    { id: '2', label: 'Option 2' }
  ]

  it('should render correctly', () => {
    const { asFragment } = renderWithForm(<CustomAutocomplete name="test" label="Test Label" options={options} />)
    expect(asFragment()).toMatchSnapshot()
  })
})
