import { useBlockingStatus } from './utils/api'
import { BlockingStatus } from './components/BlockingStatus'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './components/ErrorFallBack'
import { RefreshList } from './components/RefreshList'
import { DNSQuery } from './components/DNSQuery'
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

      <RefreshList />
      <DNSQuery />
    </>
  )
}

export default App
