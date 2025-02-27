import * as yup from 'yup'
import createHttpError from 'http-errors'

export async function validateWithYupSchema(schema: yup.Schema, data: unknown): Promise<object> {
  try {
    return await schema.validate(data, { stripUnknown: true })
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new createHttpError.BadRequest(`Validation failed: ${error.errors.join(', ')}`)
    }
    throw error
  }
}
