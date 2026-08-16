import React from 'react'
import type { StationId } from '../components/layout/Sidebar'
import { STATIONS } from '../components/layout/Sidebar'
import { CameraGrid } from '../components/camera/CameraGrid'
import { AlertsPanel } from '../components/alerts/AlertsPanel'
import { GISMap } from '../components/gis/GISMap'
import { CameraHealthPanel } from '../components/health/CameraHealthPanel'
import { IdentityEnrollmentPanel } from '../components/enrollment/IdentityEnrollmentPanel'
import { JourneyTimelinePanel } from '../components/timeline/JourneyTimelinePanel'

interface DashboardPageProps {
  activeStation: StationId
  onNavigateStation: (id: StationId) => void
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeStation,
}) => {
  const currentStation = STATIONS.find((s) => s.id === activeStation) || STATIONS[0]

  return (
    <div className="h-full flex flex-col space-y-4 max-w-7xl mx-auto">
      {/* Active Station Header */}
      <div className="p-3.5 rounded border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between font-telemetry select-none shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--accent)]">
            <currentStation.icon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold font-sans tracking-wide text-[var(--text)] uppercase">
              {currentStation.label}
            </h1>
            <p className="text-[11px] text-[var(--text-muted)]">
              {currentStation.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold font-mono text-[10px] flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPERATIONAL // ONLINE</span>
          </span>
        </div>
      </div>

      {/* Main Station Content Stage */}
      <div className="flex-1 flex flex-col">
        {activeStation === 'live-feeds' && <CameraGrid />}
        {activeStation === 'alerts' && <AlertsPanel />}
        {activeStation === 'gis-map' && <GISMap />}
        {activeStation === 'camera-health' && <CameraHealthPanel />}
        {activeStation === 'enrollment' && <IdentityEnrollmentPanel />}
        {activeStation === 'timeline' && <JourneyTimelinePanel />}

        {activeStation !== 'live-feeds' &&
          activeStation !== 'alerts' &&
          activeStation !== 'gis-map' &&
          activeStation !== 'camera-health' &&
          activeStation !== 'enrollment' &&
          activeStation !== 'timeline' && (
            <div className="flex-1 rounded border border-[var(--border)] bg-[var(--surface)] p-8 flex flex-col items-center justify-center text-center space-y-3">
              <currentStation.icon className="w-10 h-10 text-[var(--text-muted)] opacity-50" />
              <div className="max-w-sm space-y-1">
                <h2 className="text-base font-bold font-sans text-[var(--text)] uppercase">
                  {currentStation.label}
                </h2>
                <p className="text-xs font-telemetry text-[var(--text-muted)]">
                  Station interface ready. Awaiting build sequence step activation.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}
