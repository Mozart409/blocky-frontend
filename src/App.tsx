import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { BlockingStatus } from "./components/BlockingStatus";
import { DNSQuery } from "./components/DNSQuery";
import { FlushCache } from "./components/FlushCache";
import { RefreshList } from "./components/RefreshList";
import { Spacer } from "./components/Spacer";
import { ThemeToggle } from "./components/ThemeToggle";
import "@total-typescript/ts-reset";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <>
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button type="button" onClick={resetErrorBoundary}>
          Try again
        </button>
      </div>
    </>
  );
}

function App() {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <main className="">
          <BlockingStatus />
          <ThemeToggle />
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <RefreshList />
                  <FlushCache />
                </div>
                <Spacer />
                <DNSQuery />
              </div>
            </div>
          </div>
        </main>
      </ErrorBoundary>
    </>
  );
}

export default App;
