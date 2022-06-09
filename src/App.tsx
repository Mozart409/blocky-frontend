import { useBlockingStatus } from './utils/api'
import { BlockingStatus } from './components/BlockingStatus'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/ErrorFallBack'
function App() {
  return (
    <>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <BlockingStatus />
      </ErrorBoundary>

      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </>
  )
}

export default App
