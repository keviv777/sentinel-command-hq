import { useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import type { StationId } from './components/layout/Sidebar'
import { DashboardPage } from './pages/DashboardPage'

function App() {
  const [activeStation, setActiveStation] = useState<StationId>('live-feeds')

  return (
    <AppLayout
      activeStation={activeStation}
      onSelectStation={(id) => setActiveStation(id)}
    >
      <DashboardPage
        activeStation={activeStation}
        onNavigateStation={(id) => setActiveStation(id)}
      />
    </AppLayout>
  )
}

export default App