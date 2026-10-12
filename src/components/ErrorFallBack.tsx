import type { FC } from 'react'
import type { FallbackProps } from 'react-error-boundary'

export const ErrorFallback: FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{errorMessage}</pre>
      <button type="button" onClick={resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}
