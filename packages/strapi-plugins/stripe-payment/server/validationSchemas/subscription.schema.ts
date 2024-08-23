import * as yup from 'yup'

export const createCheckoutSessionSchema = yup.object().shape({
  organizationName: yup.string().when('organizationId', {
    is: (organizationId: string | undefined) => !organizationId,
    then: () =>
      yup.string().required('organizationName is required when organizationId is not provided').min(3).max(50),
    otherwise: () =>
      yup
        .string()
        .notRequired()
        .test(
          'is-empty',
          'organizationName must be empty when organizationId is provided',
          (value) => value === undefined || value === ''
        )
  }),
  planId: yup.number().required(),
  quantity: yup.number().required().min(1),
  organizationId: yup.number().optional()
})

export const getSubscriptionByIdSchema = yup.object().shape({
  id: yup.number().required()
})

export const pauseSubscriptionSchema = yup.object().shape({
  id: yup.number().required()
})

export const resumeSubscriptionSchema = yup.object().shape({
  id: yup.number().required()
})

export const updateSubscriptionSchema = yup.object().shape({
  id: yup.number().required(),
  quantity: yup.number().optional().min(1),
  planId: yup.number().optional()
})

export const resubscribeSchema = yup.object().shape({
  id: yup.number().required()
})
