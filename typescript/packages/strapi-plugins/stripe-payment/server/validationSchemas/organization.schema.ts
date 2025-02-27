import * as yup from 'yup'

export const createOrganizationSchema = yup.object().shape({
  name: yup.string().required().min(3).max(50),
  email: yup.string().email().required(),
  quantity: yup.number().required().min(1)
})

export const createOrganizationByAdminSchema = yup.object().shape({
  name: yup.string().required().min(3).max(50),
  email: yup.string().email().required(),
  ownerId: yup.number().required(),
  quantity: yup.number().required().min(1)
})

export const updateOrganizationSchema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required().min(3).max(50),
  quantity: yup.number().required().min(1)
})

export const getOrganizationByIdSchema = yup.object().shape({
  id: yup.number().required()
})

export const getDefaultPaymentMethodSchema = yup.object().shape({
  id: yup.number().required()
})

export const deleteOrganizationSchema = yup.object().shape({
  id: yup.number().required()
})

export const updateOwnerSchema = yup.object().shape({
  id: yup.number().required(),
  ownerId: yup.number().required()
})

export const updateDefaultPaymentMethodSchema = yup.object().shape({
  id: yup.number().required()
})

export const addUserSchema = yup.object().shape({
  organizationId: yup.number().required(),
  recipientEmail: yup.string().email().required()
})

export const removeUserSchema = yup.object().shape({
  organizationId: yup.number().required(),
  userId: yup.number().required()
})

export const acceptInviteSchema = yup.object().shape({
  organizationId: yup.number().required(),
  token: yup.string().required()
})
