import React, { useState } from 'react'
import type { PendingAlert } from '../../mock/alertsData'
import { MOCK_PENDING_ALERTS } from '../../mock/alertsData'
import { AlertReviewCard } from './AlertReviewCard'
import {
  ShieldAlert,
  CheckCircle2,
  Filter,
  RefreshCw,
  FileCheck,
  Zap
} from 'lucide-react'

type AlertFilterMode = 'PENDING' | 'CONFIRMED' | 'DISMISSED' | 'ALL'

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<PendingAlert[]>(MOCK_PENDING_ALERTS)
  const [filterMode, setFilterMode] = useState<AlertFilterMode>('PENDING')

  const pendingAlerts = alerts.filter((a) => a.status === 'PENDING')
  const confirmedAlerts = alerts.filter((a) => a.status === 'CONFIRMED')
  const dismissedAlerts = alerts.filter((a) => a.status === 'DISMISSED')

  const displayedAlerts = alerts.filter((a) => {
    if (filterMode === 'ALL') return true
    return a.status === filterMode
  })

  // Action handlers
  const handleConfirm = (id: string) => {
    const timestamp = new Date().toISOString().substring(11, 19) + ' UTC'
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'CONFIRMED', confirmed_at: timestamp, operator_id: 'COMMANDER_ALPHA' }
          : a
      )
    )
  }

  const handleDismiss = (id: string) => {
    const timestamp = new Date().toISOString().substring(11, 19) + ' UTC'
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: 'DISMISSED', confirmed_at: timestamp, operator_id: 'COMMANDER_ALPHA' }
          : a
      )
    )
  }

  const handleConfirmHighConfidence = () => {
    const timestamp = new Date().toISOString().substring(11, 19) + ' UTC'
    setAlerts((prev) =>
      prev.map((a) =>
        a.status === 'PENDING' && a.event.match_score >= 0.9
          ? { ...a, status: 'CONFIRMED', confirmed_at: timestamp, operator_id: 'COMMANDER_ALPHA' }
          : a
      )
    )
  }

  const handleResetQueue = () => {
    setAlerts(MOCK_PENDING_ALERTS)
  }

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Station Control & Telemetry Bar */}
      <div className="p-3.5 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-3 font-telemetry select-none shadow-xs">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1 pr-2 border-r border-[var(--border)] text-[var(--text-muted)] text-xs">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">QUEUE:</span>
          </div>

          <button
            onClick={() => setFilterMode('PENDING')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border flex items-center space-x-1.5 ${
              filterMode === 'PENDING'
                ? 'bg-[var(--accent-danger)] text-white font-bold border-[var(--accent-danger)]'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>PENDING REVIEW ({pendingAlerts.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('CONFIRMED')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border flex items-center space-x-1.5 ${
              filterMode === 'CONFIRMED'
                ? 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>CONFIRMED LOG ({confirmedAlerts.length})</span>
          </button>

          <button
            onClick={() => setFilterMode('DISMISSED')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border ${
              filterMode === 'DISMISSED'
                ? 'bg-white text-black font-bold border-white'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            DISMISSED ({dismissedAlerts.length})
          </button>

          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border ${
              filterMode === 'ALL'
                ? 'bg-emerald-500 text-black font-bold border-emerald-500'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            ALL AUDIT TRAIL ({alerts.length})
          </button>
        </div>

        {/* Batch Operations */}
        <div className="flex items-center space-x-2 text-xs">
          {pendingAlerts.length > 0 && (
            <button
              onClick={handleConfirmHighConfidence}
              className="px-3 py-1 rounded text-xs font-bold bg-[var(--accent)] text-black border border-[var(--accent)] hover:bg-[var(--accent-hover)] transition-colors cursor-pointer flex items-center space-x-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-black" />
              <span>CONFIRM HIGH CONFIDENCE (&gt;90%)</span>
            </button>
          )}

          <button
            onClick={handleResetQueue}
            title="Reset Mock Queue"
            className="p-1.5 rounded border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alerts Review List */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        {displayedAlerts.length > 0 ? (
          displayedAlerts.map((alert) => (
            <AlertReviewCard
              key={alert.id}
              alert={alert}
              onConfirm={handleConfirm}
              onDismiss={handleDismiss}
            />
          ))
        ) : (
          <div className="p-12 rounded border border-[var(--border)] bg-[var(--surface)] text-center flex flex-col items-center justify-center space-y-3">
            <FileCheck className="w-10 h-10 text-emerald-500 opacity-80" />
            <div className="max-w-md space-y-1">
              <h3 className="font-bold text-sm font-sans uppercase text-[var(--text)]">
                NO ALERTS IN THIS QUEUE
              </h3>
              <p className="text-xs font-telemetry text-[var(--text-muted)]">
                All surveillance intelligence detections have been verified by operator consensus.
              </p>
            </div>
            <button
              onClick={handleResetQueue}
              className="px-3 py-1.5 rounded text-xs font-telemetry bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              RESET MOCK ALERTS QUEUE
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
