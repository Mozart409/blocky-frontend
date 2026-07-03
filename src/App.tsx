import { BlockingStatus } from './components/BlockingStatus'
import { RefreshList } from './components/RefreshList'
import { CacheFlush } from './components/CacheFlush'
import { DNSQuery } from './components/DNSQuery'
import { StatsDashboard } from './components/StatsDashboard'
import { ThemeToggle } from './components/ThemeToggle'
import { FallbackProps, ErrorBoundary } from 'react-error-boundary'
import '@total-typescript/ts-reset'

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error'
  return (
    <>
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{errorMessage}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    </>
  )
}

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <main className="">
          <BlockingStatus />
          <ThemeToggle />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DNSQuery />
              </div>
              <div>
                <div className="prose prose-lg prose-slate dark:prose-invert">
                  <h2>Actions</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <RefreshList />
                  <CacheFlush />
                </div>
              </div>
            </div>
            <StatsDashboard />
          </div>
        </main>
      </ErrorBoundary>
    </>
  )
}

export default App
