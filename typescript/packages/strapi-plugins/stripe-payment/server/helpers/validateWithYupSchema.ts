import * as yup from 'yup'
import { errors } from '@strapi/utils'

export async function validateWithYupSchema(schema: yup.Schema, data: unknown): Promise<void> {
  try {
    await schema.validate(data)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new errors.ValidationError(error.errors.join(', '))
    }
    throw error
  }
}
