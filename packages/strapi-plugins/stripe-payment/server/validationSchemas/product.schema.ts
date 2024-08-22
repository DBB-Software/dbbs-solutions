import * as yup from 'yup'

export const createProductSchema = yup.object().shape({
  name: yup.string().required().min(3).max(50)
})

export const getProductByIdSchema = yup.object().shape({
  id: yup.number().required()
})

export const updateProductSchema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required().min(3).max(50)
})

export const deleteProductSchema = yup.object().shape({
  id: yup.number().required()
})
