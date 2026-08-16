import React from 'react'
import type { PendingAlert } from '../../mock/alertsData'
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Radio,
  FileText,
  UserCheck,
  AlertTriangle,
  ArrowRight
} from 'lucide-react'

interface AlertReviewCardProps {
  alert: PendingAlert
  onConfirm: (id: string) => void
  onDismiss: (id: string) => void
}

export const AlertReviewCard: React.FC<AlertReviewCardProps> = ({
  alert,
  onConfirm,
  onDismiss,
}) => {
  const { event } = alert
  const matchPct = Math.round(event.match_score * 100)

  const getSeverityStyle = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-[var(--accent-danger)] text-white font-bold border-[var(--accent-danger)] animate-pulse'
      case 'HIGH':
        return 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/40 font-semibold'
      default:
        return 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)]'
    }
  }

  return (
    <div className="rounded border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col space-y-4 shadow-xs hover:border-[var(--accent)]/40 transition-colors select-none">
      {/* Alert Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--border)] font-telemetry">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--accent)]">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-[var(--text)]">{alert.id}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${getSeverityStyle(
              alert.severity
            )}`}
          >
            {alert.severity}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs text-[var(--text-muted)]">
          <div className="flex items-center space-x-1 font-mono">
            <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span>{event.current_camera}</span>
          </div>
          <div className="flex items-center space-x-1 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{event.timestamp.substring(11, 19)} UTC</span>
          </div>
        </div>
      </div>

      {/* Main Body: Facial Comparison & Match Score Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Facial Biometric Comparison Frame (5 cols) */}
        <div className="md:col-span-5 p-3 rounded border border-[var(--border)] bg-[var(--bg)] flex items-center justify-around gap-2">
          {/* Captured Live Crop */}
          <div className="flex flex-col items-center space-y-1 text-center">
            <div className="relative w-20 h-20 rounded border-2 border-[var(--accent)] overflow-hidden bg-black shadow-xs">
              <img
                src={event.face_crop}
                alt="Captured Live Crop"
                className="w-full h-full object-cover filter contrast-110"
              />
              <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-telemetry text-[var(--accent)] font-bold py-0.5">
                LIVE CAPTURE
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">{event.track_id}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-[var(--text-muted)] font-telemetry text-xs">
            <span className="text-[10px] text-[var(--accent)] font-mono font-bold">FAISS</span>
            <ArrowRight className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-[9px] font-mono">VECTOR</span>
          </div>

          {/* Enrolled Reference Photo */}
          <div className="flex flex-col items-center space-y-1 text-center">
            <div className="relative w-20 h-20 rounded border-2 border-emerald-500/80 overflow-hidden bg-black shadow-xs">
              <img
                src={alert.enrolled_photo}
                alt="Enrolled Reference"
                className="w-full h-full object-cover filter contrast-110"
              />
              <span className="absolute bottom-0 inset-x-0 bg-emerald-950/90 text-[8px] font-telemetry text-emerald-400 font-bold py-0.5">
                ENROLLED DB
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              {event.candidate_id || 'REF_DB'}
            </span>
          </div>
        </div>

        {/* Target Details & Match Score Gauge (7 cols) */}
        <div className="md:col-span-7 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-telemetry text-[var(--text-muted)] block uppercase">
                TARGET IDENTIFICATION
              </span>
              <h3 className="text-base font-bold font-sans text-[var(--text)] tracking-tight">
                {event.identity}
              </h3>
            </div>

            {/* Score Badge & Progress Gauge */}
            <div className="flex flex-col items-end">
              <div className="flex items-baseline space-x-1">
                <span className="text-[10px] font-telemetry text-[var(--text-muted)] uppercase">
                  SIMILARITY SCORE:
                </span>
                <span className="text-lg font-bold font-mono text-[var(--accent)]">{matchPct}%</span>
              </div>
              <div className="w-32 h-2 rounded-full bg-[var(--bg)] border border-[var(--border)] overflow-hidden">
                <div
                  style={{ width: `${matchPct}%` }}
                  className="h-full bg-[var(--accent)] transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {/* Spatial Trajectory Readout */}
          <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] font-telemetry text-[11px] grid grid-cols-2 gap-2 text-[var(--text-muted)]">
            <div>
              <span>CURRENT: </span>
              <strong className="text-[var(--text)] font-mono">{event.current_camera}</strong>
            </div>
            <div>
              <span>PREDICTED: </span>
              <strong className="text-[var(--accent)] font-mono">
                {event.next_camera} (ETA {event.eta})
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Intelligence Assessment Advisory Field */}
      <div className="p-3 rounded border border-[var(--border)] bg-[var(--bg)] font-telemetry text-xs space-y-1">
        <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[var(--accent)] uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span>AUTOMATED INTELLIGENCE ADVISORY</span>
        </div>
        <p className="text-[11px] text-[var(--text)] leading-relaxed font-sans font-normal">
          {alert.advisory_text}
        </p>
      </div>

      {/* Operator Action Buttons & Status Footer */}
      <div className="pt-2 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 font-telemetry">
        {alert.status === 'PENDING' ? (
          <>
            <span className="text-[11px] text-[var(--text-muted)] flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>AWAITING OPERATOR VERIFICATION</span>
            </span>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => onDismiss(alert.id)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded text-xs font-semibold border border-[var(--border)] bg-[var(--bg)] hover:bg-[var(--surface-hover)] text-[var(--text)] transition-colors cursor-pointer flex items-center justify-center space-x-1.5 min-h-[42px] active:scale-95"
              >
                <XCircle className="w-4 h-4 text-[var(--text-muted)]" />
                <span>DISMISS ALERT</span>
              </button>

              <button
                onClick={() => onConfirm(alert.id)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded text-xs font-bold border border-[var(--accent)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs min-h-[42px] active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-black" />
                <span>CONFIRM MATCH</span>
              </button>
            </div>
          </>
        ) : (
          <div className="w-full p-2.5 rounded bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <UserCheck className="w-4 h-4 text-[var(--accent)]" />
              <span className="font-semibold text-[var(--text)] uppercase">
                {alert.status === 'CONFIRMED' ? 'VERIFIED MATCH LOGGED' : 'DISMISSED BY OPERATOR'}
              </span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-mono">
              OP: COMMANDER_ALPHA // {alert.confirmed_at || 'LOGGED'}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
