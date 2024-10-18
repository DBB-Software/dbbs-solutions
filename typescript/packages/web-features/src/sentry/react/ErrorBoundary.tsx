import { FC } from 'react'
import * as Sentry from '@sentry/react'

/**
 * ErrorBoundary component that wraps Sentry's ErrorBoundary with the provided props.
 *
 * @param {Sentry.ErrorBoundaryProps} props - Props passed to Sentry's ErrorBoundary component.
 * @returns {JSX.Element} A Sentry ErrorBoundary component with the provided props.
 */
export const ErrorBoundary: FC<Sentry.ErrorBoundaryProps> = (props) => <Sentry.ErrorBoundary {...props} />
