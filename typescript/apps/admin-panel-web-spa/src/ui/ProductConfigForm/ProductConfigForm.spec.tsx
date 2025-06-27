import React from 'react'
import { render } from '@testing-library/react'
import { FieldValues, useForm } from 'react-hook-form'
import { ProductConfigForm, ProductConfigFormProps } from './ProductConfigForm'
import { Product } from '../../types'

const FormWithControl = () => {
  const { control } = useForm<FieldValues, Product>({
    defaultValues: {}
  })
  const defaultProps: ProductConfigFormProps = {
    isUpdateLoading: false,
    handleSubmit: jest.fn(),
    errors: {},
    control,
    onTypeSearch: jest.fn(),
    typeSearchLoading: false,
    typeOptions: []
  }

  return <ProductConfigForm {...defaultProps} />
}

describe('<ProductConfigForm />', () => {
  it('renders correctly', () => {
    const { asFragment } = render(<FormWithControl />)
    expect(asFragment()).toMatchSnapshot()
  })
})
