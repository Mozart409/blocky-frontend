import { BlockingStatus } from './components/BlockingStatus'

import { RefreshList } from './components/RefreshList'
import { DNSQuery } from './components/DNSQuery'
import { Spacer } from './components/Spacer'
import { ThemeToggle } from './components/ThemeToggle'

function App() {
  return (
    <>
      <main className="">
        <BlockingStatus />
        <ThemeToggle />
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="max-w-3xl mx-auto">
              <RefreshList />
              <Spacer />
              <DNSQuery />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default App
