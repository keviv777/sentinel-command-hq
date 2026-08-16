import React, { useState } from 'react'
import { Header } from './Header'
import { Sidebar, STATIONS } from './Sidebar'
import type { StationId } from './Sidebar'
import { useTheme } from '../../hooks/useTheme'
import { Menu, X } from 'lucide-react'

interface AppLayoutProps {
  activeStation: StationId
  onSelectStation: (id: StationId) => void
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  activeStation,
  onSelectStation,
  children,
}) => {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const activeStationObj = STATIONS.find((s) => s.id === activeStation) || STATIONS[0]

  return (
    <div className="h-screen w-screen flex flex-col bg-[var(--bg)] text-[var(--text)] overflow-hidden font-sans">
      {/* Top Tactical Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        activeStationLabel={activeStationObj.label}
      />

      {/* Main Control Room Stage */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:flex">
          <Sidebar
            activeStation={activeStation}
            onSelectStation={(id) => {
              onSelectStation(id)
              setMobileMenuOpen(false)
            }}
          />
        </div>

        {/* Mobile Navigation Backdrop & Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/75 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 bg-[var(--surface)] h-full flex flex-col shadow-2xl">
              <div className="p-3 border-b border-[var(--border)] flex items-center justify-between">
                <span className="font-telemetry text-xs font-bold text-[var(--accent)] uppercase tracking-wider">
                  SENTINEL COMMAND STATIONS
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
                  aria-label="Close Navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <Sidebar
                activeStation={activeStation}
                onSelectStation={(id) => {
                  onSelectStation(id)
                  setMobileMenuOpen(false)
                }}
              />
            </div>
          </div>
        )}

        {/* Center Main Workstation Viewport */}
        <main className="flex-1 flex flex-col overflow-hidden relative bg-[var(--bg)]">
          {/* Mobile Top Bar with Drawer Trigger */}
          <div className="md:hidden h-11 border-b border-[var(--border)] bg-[var(--surface)] px-3 flex items-center justify-between font-telemetry text-xs shrink-0 select-none">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center space-x-2 text-[var(--text)] font-semibold p-1 rounded hover:bg-[var(--surface-hover)] cursor-pointer min-h-[36px]"
            >
              <Menu className="w-4 h-4 text-[var(--accent)]" />
              <span className="truncate max-w-[200px]">STATION: {activeStationObj.label.toUpperCase()}</span>
            </button>
            <span className="text-[10px] text-[var(--accent)] font-mono px-2 py-0.5 rounded bg-[var(--accent)]/10 border border-[var(--accent)]/30 font-bold">
              DEFCON 4
            </span>
          </div>

          {/* Active Workstation Stage */}
          <div className="flex-1 overflow-auto p-3 sm:p-4">
            {children}
          </div>

          {/* Mobile Bottom Touch Station Bar */}
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--surface)] px-2 py-1.5 flex items-center justify-around font-telemetry shrink-0 select-none z-30">
            {STATIONS.map((s) => {
              const Icon = s.icon
              const isActive = activeStation === s.id

              return (
                <button
                  key={s.id}
                  onClick={() => onSelectStation(s.id)}
                  className={`p-2 rounded flex flex-col items-center justify-center transition-colors cursor-pointer min-w-[42px] min-h-[42px] ${
                    isActive
                      ? 'text-[var(--accent)] bg-[var(--bg)] font-bold border border-[var(--accent)]/40'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                  title={s.label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
