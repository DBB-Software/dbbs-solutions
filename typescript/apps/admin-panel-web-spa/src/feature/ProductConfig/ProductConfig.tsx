import React, { FC, useEffect, useMemo, useState, useCallback } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import { useNavigate, useParams } from '@tanstack/react-router'
import { skipToken } from '@reduxjs/toolkit/query'
import { debounce } from '@dbbs/mui-components'
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useGetTypeListQuery,
  useUpdateProductMutation
} from '../../data-access'
import { ProductConfigForm } from '../../ui'
import { displayValidationErrors } from '../../utils'
import { Product, ListPayload } from '../../types'

const defaultValues: Product = {
  id: -1
}

export const ProductEditPage: FC = () => {
  const navigate = useNavigate({ from: '/product/create' })

  const [updateProduct, { isLoading: isUpdateLoading }] = useUpdateProductMutation()
  const [createProduct, { isLoading: isCreateProductLoading }] = useCreateProductMutation()

  const { productId } = useParams({ strict: false })

  const { data: defaultProduct } = useGetProductByIdQuery(productId || skipToken)

  const typeDefault = useMemo(
    () => ({
      ...defaultProduct,
      type: {
        name: defaultProduct?.type?.name
      }
    }),
    [defaultProduct]
  )

  const [typeSearchTerm, setTypeSearchTerm] = useState<string>('')

  const baseOptionsQuery: ListPayload = {
    limit: 10,
    offset: 0,
    filterField: 'name',
    filterOperator: 'contains'
  }

  const {
    data: typeData,
    isLoading: isTypeLoading,
    isFetching: isTypeFetching
  } = useGetTypeListQuery({ ...baseOptionsQuery, filterValue: typeSearchTerm })

  const handleTypeSearchTermChange = useCallback((searchText: string) => {
    debounce(() => {
      setTypeSearchTerm(searchText)
    }, 300)
  }, [])

  const typeSearchOptions =
    typeData?.results.map(({ id, name }) => ({
      id,
      name
    })) || []

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset
  } = useForm<FieldValues>({
    defaultValues
  })

  useEffect(() => {
    if (typeDefault) {
      reset(typeDefault)
    }
  }, [typeDefault, reset])

  const onSubmit = (item: FieldValues) => {
    const { type, ...validProduct } = item

    if (!productId) {
      createProduct({
        ...validProduct,
        typeId: item.type?.id ? Number(item.type?.id) : undefined
      })
        .unwrap()
        .then(({ id }) => {
          navigate({ to: `/product/${id}/edit` })
        })
        .catch(displayValidationErrors)
    } else {
      updateProduct({
        id: productId,
        item: {
          ...validProduct,
          typeId: item.type?.id ? Number(item.type?.id) : undefined
        }
      })
        .unwrap()
        .catch(displayValidationErrors)
    }
  }

  return (
    <ProductConfigForm
      isUpdateLoading={isUpdateLoading || isCreateProductLoading}
      control={control}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      onTypeSearch={handleTypeSearchTermChange}
      typeSearchLoading={isTypeLoading || isTypeFetching}
      typeOptions={typeSearchOptions}
    />
  )
}
