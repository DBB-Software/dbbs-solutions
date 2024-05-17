import { SetMetadata, CustomDecorator } from '@nestjs/common'

/**
 * Key used to mark routes as public.
 * @constant
 * @type {string}
 */
export const IS_PUBLIC_KEY: string = 'isPublic'

/**
 * Decorator to mark a route as public, by passing authentication guards.
 * @function
 * @returns {CustomDecorator} The custom decorator that sets the metadata for public routes.
 */
export const Public = (): CustomDecorator => SetMetadata(IS_PUBLIC_KEY, true)
