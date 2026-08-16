import React from 'react'
import {
  LayoutGrid,
  ShieldAlert,
  MapPin,
  Activity,
  UserPlus,
  History,
  Sliders,
  ChevronRight,
  UserCheck,
  Cpu
} from 'lucide-react'

export type StationId =
  | 'live-feeds'
  | 'alerts'
  | 'gis-map'
  | 'camera-health'
  | 'enrollment'
  | 'timeline'

export interface NavigationItem {
  id: StationId
  label: string
  subtitle: string
  icon: React.ElementType
  badge?: string
  badgeColor?: string
  stepNumber: number
}

export const STATIONS: NavigationItem[] = [
  {
    id: 'live-feeds',
    label: 'Live Camera Grid',
    subtitle: 'Multi-feed spatial stream',
    icon: LayoutGrid,
    badge: '6 ACTIVE',
    badgeColor: 'text-[var(--accent)] bg-[var(--accent)]/10 border-[var(--accent)]/30',
    stepNumber: 2,
  },
  {
    id: 'alerts',
    label: 'Alerts & Review',
    subtitle: 'Human verification queue',
    icon: ShieldAlert,
    badge: '3 PENDING',
    badgeColor: 'text-[var(--accent-danger)] bg-[var(--accent-danger)]/10 border-[var(--accent-danger)]/30',
    stepNumber: 3,
  },
  {
    id: 'gis-map',
    label: 'GIS Station Map',
    subtitle: 'Spatial camera routing',
    icon: MapPin,
    badge: 'GIS READY',
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
    stepNumber: 4,
  },
  {
    id: 'camera-health',
    label: 'Camera Health',
    subtitle: 'Hardware node telemetry',
    icon: Activity,
    badge: '98.2%',
    badgeColor: 'text-[var(--text-muted)] bg-[var(--bg)] border-[var(--border)]',
    stepNumber: 5,
  },
  {
    id: 'enrollment',
    label: 'Identity Enrollment',
    subtitle: 'Target biometrics database',
    icon: UserPlus,
    stepNumber: 6,
  },
  {
    id: 'timeline',
    label: 'Journey Timeline',
    subtitle: 'Subject trajectory tracking',
    icon: History,
    stepNumber: 7,
  },
]

interface SidebarProps {
  activeStation: StationId
  onSelectStation: (id: StationId) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeStation,
  onSelectStation,
}) => {
  return (
    <aside className="w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 select-none">
      {/* Operator Session Info */}
      <div className="p-3 border-b border-[var(--border)] bg-[var(--bg)]/50">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-[var(--accent)]" />
          </div>
          <div className="flex flex-col font-telemetry text-xs overflow-hidden">
            <span className="font-semibold text-[var(--text)] truncate">OP: COMMANDER_ALPHA</span>
            <span className="text-[10px] text-[var(--text-muted)] truncate">SECTOR 04 // CLEARANCE L5</span>
          </div>
        </div>
      </div>

      {/* Navigation Title */}
      <div className="px-4 py-2 text-[10px] font-telemetry uppercase tracking-widest text-[var(--text-muted)] flex items-center justify-between border-b border-[var(--border)]/50">
        <span>TACTICAL STATIONS</span>
        <Sliders className="w-3 h-3" />
      </div>

      {/* Stations List */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {STATIONS.map((station) => {
          const Icon = station.icon
          const isActive = activeStation === station.id

          return (
            <button
              key={station.id}
              onClick={() => onSelectStation(station.id)}
              className={`w-full text-left p-2.5 rounded transition-all cursor-pointer flex items-center justify-between group relative border ${
                isActive
                  ? 'bg-[var(--bg)] border-[var(--accent)] text-[var(--text)] shadow-sm'
                  : 'bg-transparent border-transparent hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              {/* Left active line accent */}
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-1 bg-[var(--accent)] rounded-r" />
              )}

              <div className="flex items-center space-x-3 min-w-0 pl-1">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[var(--accent)]' : 'group-hover:text-[var(--text)]'
                  }`}
                />
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-medium font-sans truncate ${isActive ? 'text-[var(--text)] font-semibold' : ''}`}>
                    {station.label}
                  </span>
                  <span className="text-[10px] font-telemetry text-[var(--text-muted)] truncate">
                    {station.subtitle}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {station.badge && (
                  <span
                    className={`text-[9px] font-telemetry font-semibold px-1.5 py-0.5 rounded border ${
                      station.badgeColor || 'text-[var(--text-muted)] border-[var(--border)]'
                    }`}
                  >
                    {station.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-3.5 h-3.5 transition-transform ${
                    isActive ? 'text-[var(--accent)] translate-x-0.5' : 'text-transparent group-hover:text-[var(--text-muted)]'
                  }`}
                />
              </div>
            </button>
          )
        })}
      </nav>

      {/* System Telemetry Footer */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--bg)]/70 font-telemetry text-[11px] text-[var(--text-muted)] space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase">
          <span className="flex items-center space-x-1">
            <Cpu className="w-3 h-3 text-[var(--accent)]" />
            <span>NODE TELEMETRY</span>
          </span>
          <span className="text-[var(--accent)] font-mono">NOMINAL</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono pt-1 border-t border-[var(--border)]/40">
          <div>LATENCY: <strong className="text-[var(--text)]">12ms</strong></div>
          <div>MEM: <strong className="text-[var(--text)]">4.2GB</strong></div>
          <div>GPU INFER: <strong className="text-[var(--text)]">98%</strong></div>
          <div>FAISS: <strong className="text-[var(--text)]">READY</strong></div>
        </div>
      </div>
    </aside>
  )
}
