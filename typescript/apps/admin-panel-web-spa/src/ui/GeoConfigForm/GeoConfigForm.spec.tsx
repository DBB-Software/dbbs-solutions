import React from 'react'
import { render } from '@testing-library/react'
import { FieldValues, useForm } from 'react-hook-form'
import { GeoConfigForm, GeoConfigFormProps } from './GeoConfigForm'
import { Geo } from '../../types'

const mockOnSubmit = jest.fn()

const FormWithControl = () => {
  const { control } = useForm<FieldValues, Geo>({
    defaultValues: {}
  })
  const defaultProps: GeoConfigFormProps = {
    geoTypes: ['Type1', 'Type2'],
    isUpdateLoading: false,
    handleSubmit: jest.fn(),
    errors: {},
    onSubmit: mockOnSubmit,
    control,
    onParentSearch: jest.fn(),
    parentSearchLoading: false,
    parentOptions: [],
    streamTypeOptions: [],
    detectMethods: [],
    statuses: [],
    timezones: [],
    scheduleFormats: []
  }

  return <GeoConfigForm {...defaultProps} />
}

describe('<GeoConfigForm />', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<FormWithControl />)
    expect(asFragment()).toMatchSnapshot()
  })
})
