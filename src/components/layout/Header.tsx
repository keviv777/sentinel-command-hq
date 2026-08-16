import React, { useState, useEffect } from 'react'
import { Sun, Moon, Radio, Shield, Activity, Wifi, Terminal } from 'lucide-react'
import type { Theme } from '../../hooks/useTheme'

interface HeaderProps {
  theme: Theme
  toggleTheme: () => void
  activeStationLabel: string
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, activeStationLabel }) => {
  const [time, setTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const utcString = time.toISOString().substring(11, 19) + ' UTC'
  const localString = time.toLocaleTimeString('en-US', { hour12: false })

  return (
    <header className="h-14 border-b border-[var(--border)] bg-[var(--surface)] px-4 flex items-center justify-between shrink-0 select-none">
      {/* Brand & System Identifier */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center w-8 h-8 rounded bg-black/10 dark:bg-white/10 border border-[var(--border)]">
          <Shield className="w-4 h-4 text-[var(--accent)]" />
          {/* Subtle radar spin ring behind icon */}
          <div className="absolute inset-0 rounded border border-[var(--accent)]/30 animate-radar-spin pointer-events-none" />
        </div>

        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-wider text-sm font-sans uppercase">
              SENTINEL <span className="text-[var(--accent)]">COMMAND HQ</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-telemetry bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 font-semibold tracking-wide">
              v1.0.4-EDGE
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-[var(--text-muted)] font-telemetry">
            <span>STATION // <strong className="text-[var(--text)] font-medium uppercase">{activeStationLabel}</strong></span>
          </div>
        </div>
      </div>

      {/* Center Tactical Telemetry Readouts */}
      <div className="hidden lg:flex items-center space-x-6 font-telemetry text-xs">
        {/* Radar Sweep Active Status */}
        <div className="flex items-center space-x-2 px-2.5 py-1 rounded bg-[var(--bg)] border border-[var(--border)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
          </span>
          <span className="text-[11px] tracking-wider text-[var(--text)] font-semibold uppercase">
            DEFCON 4 // OPERATIONAL
          </span>
        </div>

        {/* System Feeds Summary */}
        <div className="flex items-center space-x-4 text-[var(--text-muted)] border-l border-r border-[var(--border)] px-4 py-1">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>CAM_NODES: <strong className="text-[var(--text)] font-mono">6/6 ONLINE</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>FPS: <strong className="text-[var(--text)] font-mono">30.0</strong></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-500" />
            <span>WS: <strong className="text-[var(--text)] font-mono">MOCK ACTIVE</strong></span>
          </div>
        </div>

        {/* Realtime Clocks */}
        <div className="flex items-center space-x-3 text-[var(--text)]">
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-[var(--text-muted)] leading-none uppercase">ZULU TIME</span>
            <span className="font-mono text-xs font-semibold text-[var(--accent)]">{utcString}</span>
          </div>
          <div className="h-6 w-[1px] bg-[var(--border)]" />
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[var(--text-muted)] leading-none uppercase">LOCAL</span>
            <span className="font-mono text-xs font-semibold">{localString}</span>
          </div>
        </div>
      </div>

      {/* Right Actions & Theme Switcher */}
      <div className="flex items-center space-x-3">
        {/* Terminal / Status Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[11px] font-telemetry px-2 py-1 rounded bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]">
          <Terminal className="w-3.5 h-3.5" />
          <span>NODE-01</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="flex items-center space-x-2 px-3 py-2 rounded border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-hover)] text-[var(--text)] font-telemetry text-xs transition-colors cursor-pointer min-h-[38px] active:scale-95"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-mono text-[11px] uppercase tracking-wider hidden sm:inline">LIGHT MODE</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-mono text-[11px] uppercase tracking-wider hidden sm:inline">DARK MODE</span>
            </>
          )}
        </button>
      </div>
    </header>
  )
}
