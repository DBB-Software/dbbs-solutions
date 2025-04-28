import React from 'react'
import { render } from '@testing-library/react'
import { FieldValues, useForm } from 'react-hook-form'
import { GeoConfigForm, GeoConfigFormProps } from './GeoConfigForm'
import { Geo } from '../../types'

const FormWithControl = () => {
  const { control } = useForm<FieldValues, Geo>({
    defaultValues: {}
  })
  const defaultProps: GeoConfigFormProps = {
    isUpdateLoading: false,
    handleSubmit: jest.fn(),
    errors: {},
    control,
    onParentSearch: jest.fn(),
    parentSearchLoading: false,
    parentOptions: [],
    onMeetingTypeSearch: jest.fn(),
    meetingTypeSearchLoading: false,
    meetingTypeOptions: []
  }

  return <GeoConfigForm {...defaultProps} />
}

describe('<GeoConfigForm />', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<FormWithControl />)
    expect(asFragment()).toMatchSnapshot()
  })
})
