import React, { useState } from 'react'
import type { CameraFeed } from '../../types/sentinel'
import { MOCK_CAMERA_FEEDS } from '../../mock/sentinelData'
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  Cpu,
  RefreshCw,
  Sliders,
  Radio,
  Server
} from 'lucide-react'

type HealthFilter = 'ALL' | 'ONLINE' | 'DEGRADED' | 'OFFLINE'

export const CameraHealthPanel: React.FC = () => {
  const [feeds, setFeeds] = useState<CameraFeed[]>(MOCK_CAMERA_FEEDS)
  const [filter, setFilter] = useState<HealthFilter>('ALL')
  const [pingingId, setPingingId] = useState<string | null>(null)

  const onlineCount = feeds.filter((f) => f.status === 'ONLINE').length
  const degradedCount = feeds.filter((f) => f.status === 'DEGRADED').length
  const offlineCount = feeds.filter((f) => f.status === 'OFFLINE').length

  const avgLatency = Math.round(
    feeds.reduce((acc, curr) => acc + curr.latency, 0) / feeds.length
  )

  const filteredFeeds = feeds.filter((f) => {
    if (filter === 'ALL') return true
    return f.status === filter
  })

  // Simulated live ping refresh action
  const handlePingNode = (id: string) => {
    setPingingId(id)
    setTimeout(() => {
      setFeeds((prev) =>
        prev.map((f) => {
          if (f.id === id) {
            // slight variance for realistic simulation
            const delta = Math.floor(Math.random() * 5) - 2
            const newLatency = Math.max(5, f.latency + delta)
            return { ...f, latency: newLatency }
          }
          return f
        })
      )
      setPingingId(null)
    }, 600)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ONLINE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>ONLINE</span>
          </span>
        )
      case 'DEGRADED':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30 flex items-center space-x-1 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>DEGRADED</span>
          </span>
        )
      case 'OFFLINE':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--accent-danger)]/10 text-[var(--accent-danger)] border border-[var(--accent-danger)]/30 flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>OFFLINE</span>
          </span>
        )
      default:
        return null
    }
  }

  const getLatencyBadgeClass = (latency: number) => {
    if (latency < 30) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
    if (latency < 100) return 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    return 'text-[var(--accent-danger)] bg-[var(--accent-danger)]/10 border-[var(--accent-danger)]/30'
  }

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* System Telemetry Overview Dashboard Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 font-telemetry select-none">
        <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-[var(--text-muted)] uppercase">ACTIVE CAMERA NODES</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[var(--text)] font-mono">{feeds.length}</span>
            <span className="text-xs text-emerald-500 font-mono font-bold">{onlineCount} ONLINE</span>
          </div>
        </div>

        <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-[var(--text-muted)] uppercase">AVG LATENCY</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[var(--accent)] font-mono">{avgLatency}ms</span>
            <span className="text-[10px] text-emerald-500 font-mono">NOMINAL</span>
          </div>
        </div>

        <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs">
          <span className="text-[10px] text-[var(--text-muted)] uppercase">SYSTEM STATUS</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-sm font-bold text-amber-500 font-mono">1 DEGRADED</span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">CAM_05</span>
          </div>
        </div>

        <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs hidden sm:flex">
          <span className="text-[10px] text-[var(--text-muted)] uppercase">THROUGHPUT</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-[var(--text)] font-mono">26.0 Mbps</span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">H.265</span>
          </div>
        </div>

        <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between shadow-xs hidden lg:flex">
          <span className="text-[10px] text-[var(--text-muted)] uppercase">FAISS GPU INFER</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-xl font-bold text-emerald-400 font-mono">99.2%</span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">CUDA 0</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex items-center justify-between font-telemetry select-none shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <div className="flex items-center space-x-1 pr-2 border-r border-[var(--border)] text-[var(--text-muted)] text-xs">
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HEALTH FILTER:</span>
          </div>

          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border ${
              filter === 'ALL'
                ? 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            ALL NODES ({feeds.length})
          </button>

          <button
            onClick={() => setFilter('ONLINE')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border flex items-center space-x-1 ${
              filter === 'ONLINE'
                ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <span>ONLINE ({onlineCount})</span>
          </button>

          <button
            onClick={() => setFilter('DEGRADED')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border flex items-center space-x-1 ${
              filter === 'DEGRADED'
                ? 'bg-amber-500 text-black font-bold border-amber-500'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <span>DEGRADED ({degradedCount})</span>
          </button>

          <button
            onClick={() => setFilter('OFFLINE')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border ${
              filter === 'OFFLINE'
                ? 'bg-[var(--accent-danger)] text-white font-bold border-[var(--accent-danger)]'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            OFFLINE ({offlineCount})
          </button>
        </div>

        <div className="text-xs text-[var(--text-muted)] hidden sm:block">
          POLLING INTERVAL: <strong className="text-[var(--text)] font-mono">1000ms</strong>
        </div>
      </div>

      {/* Scannable Node Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 overflow-y-auto">
        {filteredFeeds.map((feed) => {
          const isPinging = pingingId === feed.id

          return (
            <div
              key={feed.id}
              className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col justify-between space-y-4 shadow-xs hover:border-[var(--accent)]/50 transition-colors select-none"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[var(--border)]">
                <div className="flex flex-col min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-[var(--accent)] shrink-0" />
                    <h3 className="font-bold font-mono text-sm text-[var(--text)] truncate">
                      {feed.id}
                    </h3>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-sans truncate mt-0.5">
                    {feed.location}
                  </span>
                </div>

                <div className="shrink-0">{getStatusBadge(feed.status)}</div>
              </div>

              {/* Node Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 font-telemetry text-xs">
                {/* Latency metric */}
                <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] flex flex-col">
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center space-x-1">
                    <Wifi className="w-3 h-3 text-[var(--accent)]" />
                    <span>LATENCY</span>
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span
                      className={`text-sm font-bold font-mono px-1.5 py-0.5 rounded border ${getLatencyBadgeClass(
                        feed.latency
                      )}`}
                    >
                      {feed.latency}ms
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)]">RTT</span>
                  </div>
                </div>

                {/* FPS & Resolution metric */}
                <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] flex flex-col">
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center space-x-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    <span>FRAMERATE</span>
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-sm font-bold text-[var(--text)] font-mono">
                      {feed.fps} FPS
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)]">STREAM</span>
                  </div>
                </div>

                {/* Bitrate metric */}
                <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] flex flex-col">
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center space-x-1">
                    <Server className="w-3 h-3 text-blue-400" />
                    <span>BITRATE</span>
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xs font-bold text-[var(--text)] font-mono">
                      {feed.bitrate || '4.0 Mbps'}
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)]">H.265</span>
                  </div>
                </div>

                {/* GPU Inference Load metric */}
                <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] flex flex-col">
                  <span className="text-[10px] text-[var(--text-muted)] flex items-center space-x-1">
                    <Cpu className="w-3 h-3 text-[var(--accent)]" />
                    <span>GPU INFER LOAD</span>
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-xs font-bold text-[var(--text)] font-mono">
                      {feed.gpu_load || 30}%
                    </span>
                    <span className="text-[9px] text-[var(--text-muted)]">CUDA</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between font-telemetry text-xs">
                <span className="text-[10px] text-[var(--text-muted)]">
                  UPTIME: <strong className="text-[var(--text)] font-mono">{feed.uptime || '99.9%'}</strong>
                </span>

                <button
                  onClick={() => handlePingNode(feed.id)}
                  disabled={isPinging}
                  className="px-2.5 py-1 rounded bg-[var(--bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text)] text-[11px] transition-colors cursor-pointer flex items-center space-x-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 text-[var(--accent)] ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'PINGING...' : 'PING NODE'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
