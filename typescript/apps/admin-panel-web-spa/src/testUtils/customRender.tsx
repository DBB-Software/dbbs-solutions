import React, { FC, ReactElement, ReactNode } from 'react'
import { render, type RenderResult } from '@testing-library/react'
import { FormProvider, useForm } from 'react-hook-form'

export const renderWithForm = (element: ReactElement): RenderResult => {
  const Wrapper: FC<{ children: ReactNode }> = ({ children }) => {
    const methods = useForm()
    return <FormProvider {...methods}>{children}</FormProvider>
  }
  return render(element, { wrapper: Wrapper })
}

export * from '@testing-library/react'
