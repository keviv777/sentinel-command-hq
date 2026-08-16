import React, { useState } from 'react'
import type { SubjectJourney } from '../../mock/timelineData'
import { MOCK_SUBJECT_JOURNEYS } from '../../mock/timelineData'
import {
  History,
  Radio,
  Shield,
  Navigation,
  Compass,
  AlertTriangle,
  Sparkles
} from 'lucide-react'

export const JourneyTimelinePanel: React.FC = () => {
  const [journeys] = useState<SubjectJourney[]>(MOCK_SUBJECT_JOURNEYS)
  const [selectedTrackId, setSelectedTrackId] = useState<string>(MOCK_SUBJECT_JOURNEYS[0].track_id)

  const activeJourney =
    journeys.find((j) => j.track_id === selectedTrackId) || journeys[0]

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'POI':
        return 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
      case 'VIP':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-bold'
      case 'STAFF':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-semibold'
      case 'RESTRICTED':
        return 'bg-[var(--accent-danger)] text-white font-bold border-[var(--accent-danger)] animate-pulse'
      default:
        return 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)]'
    }
  }

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Subject Selector Header Bar */}
      <div className="p-3.5 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-3 font-telemetry select-none shadow-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1 pr-2 border-r border-[var(--border)] text-[var(--text-muted)] text-xs">
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SELECT TARGET:</span>
          </div>

          {journeys.map((j) => {
            const isActive = j.track_id === selectedTrackId

            return (
              <button
                key={j.track_id}
                onClick={() => setSelectedTrackId(j.track_id)}
                className={`px-3 py-1.5 rounded text-xs transition-colors cursor-pointer border flex items-center space-x-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-[var(--accent)] text-black font-bold border-[var(--accent)] shadow-xs'
                    : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
                }`}
              >
                <span>{j.subject_name}</span>
                <span className="font-mono text-[10px] opacity-80">[{j.track_id}]</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)]">
          <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>MARKOV PREDICTIVE ENGINE: <strong className="text-emerald-400 font-mono">ACTIVE</strong></span>
        </div>
      </div>

      {/* Main Timeline Workspace Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1 overflow-y-auto">
        {/* Left Column: Target Profile & Detection Stats (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 font-telemetry select-none">
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-bold text-xs text-[var(--text)] uppercase">TARGET PROFILE SUMMARY</h3>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded border ${getCategoryBadge(activeJourney.category)}`}>
                {activeJourney.category}
              </span>
            </div>

            {/* Photo & Identity */}
            <div className="flex items-center space-x-3.5">
              <div className="relative w-16 h-16 rounded border-2 border-[var(--accent)] overflow-hidden bg-black shrink-0">
                <img
                  src={activeJourney.enrolled_photo}
                  alt={activeJourney.subject_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="font-sans font-bold text-base text-[var(--text)] truncate">
                  {activeJourney.subject_name}
                </h2>
                <span className="font-mono text-xs text-[var(--accent)] font-bold">
                  {activeJourney.candidate_id} // {activeJourney.track_id}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] truncate">
                  FAISS INDEXED // 512D VECTOR
                </span>
              </div>
            </div>

            {/* Spatial-Temporal Summary Stats */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[var(--border)]">
              <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)]">
                <span className="text-[9px] text-[var(--text-muted)] block uppercase">FIRST DETECTED</span>
                <strong className="text-[var(--text)] font-mono text-[11px]">{activeJourney.first_seen}</strong>
              </div>
              <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)]">
                <span className="text-[9px] text-[var(--text-muted)] block uppercase">LAST SEEN</span>
                <strong className="text-[var(--accent)] font-mono text-[11px]">{activeJourney.last_seen}</strong>
              </div>
              <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)]">
                <span className="text-[9px] text-[var(--text-muted)] block uppercase">TOTAL NODES</span>
                <strong className="text-[var(--text)] font-mono text-[11px]">{activeJourney.total_detections} CAMERAS</strong>
              </div>
              <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)]">
                <span className="text-[9px] text-[var(--text-muted)] block uppercase">CURRENT NODE</span>
                <strong className="text-[var(--text)] font-mono text-[11px]">
                  {activeJourney.timeline[activeJourney.timeline.length - 1]?.camera_id}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Spatial-Temporal Journey Timeline & Prediction Card (8 cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Timeline Nodes */}
          <div className="p-5 rounded border border-[var(--border)] bg-[var(--surface)] space-y-6 shadow-xs select-none">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-telemetry">
              <div className="flex items-center space-x-2">
                <Navigation className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="font-bold text-sm text-[var(--text)] uppercase">
                  SPATIAL-TEMPORAL TRAJECTORY SEQUENCE
                </h2>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">CHRONOLOGICAL RECONSTRUCTION</span>
            </div>

            {/* Vertical Timeline Tree */}
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border)]">
              {activeJourney.timeline.map((step) => {
                const matchPct = Math.round(step.match_score * 100)

                return (
                  <div key={step.id} className="relative flex items-start space-x-4 group">
                    {/* Node Circle */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-[var(--surface)] z-10 ${
                        step.is_current
                          ? 'border-[var(--accent)] text-[var(--accent)] shadow-[0_0_8px_var(--accent)]'
                          : 'border-[var(--border)] text-[var(--text-muted)]'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          step.is_current ? 'bg-[var(--accent)] animate-ping' : 'bg-[var(--text-muted)]'
                        }`}
                      />
                    </div>

                    {/* Step Card Content */}
                    <div className="flex-1 p-3.5 rounded border border-[var(--border)] bg-[var(--bg)] font-telemetry text-xs space-y-2.5 hover:border-[var(--accent)]/50 transition-colors shadow-xs">
                      {/* Step Header */}
                      <div className="flex items-center justify-between border-b border-[var(--border)]/60 pb-2">
                        <div className="flex items-center space-x-2">
                          <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
                          <span className="font-bold text-[var(--text)] font-mono text-xs">
                            {step.camera_name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {step.is_current && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--accent)] text-black font-bold uppercase">
                              CURRENT POSITION
                            </span>
                          )}
                          <span className="text-[11px] font-mono text-[var(--text-muted)]">
                            {step.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Step Body */}
                      <div className="flex items-start space-x-3">
                        <img
                          src={step.face_crop}
                          alt="Face Crop"
                          className="w-12 h-12 rounded object-cover border border-[var(--border)] shrink-0"
                        />
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[var(--text-muted)] font-sans">{step.location}</span>
                            <span className="text-[var(--accent)] font-mono font-bold">{matchPct}% MATCH</span>
                          </div>
                          <p className="text-[11px] font-sans text-[var(--text)] leading-relaxed">
                            {step.status_note}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Predictive Next Camera Destination Terminal Card */}
          <div className="p-4 rounded border-2 border-[var(--accent)] bg-[var(--surface)] space-y-3 font-telemetry shadow-lg select-none">
            <div className="flex items-center justify-between border-b border-[var(--accent)]/40 pb-2.5">
              <div className="flex items-center space-x-2 text-[var(--accent)]">
                <Sparkles className="w-4 h-4 animate-spin" />
                <h3 className="font-bold text-xs uppercase tracking-wide">
                  MARKOV PATH PREDICTION // NEXT CAMERA DESTINATION
                </h3>
              </div>
              <span className="text-[10px] bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded border border-[var(--accent)]/40 font-mono font-bold">
                PROBABILITY: {Math.round(activeJourney.prediction.transition_probability * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-1">
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">PREDICTED NEXT NODE</span>
                <h2 className="text-lg font-bold font-sans text-[var(--text)] tracking-tight">
                  {activeJourney.prediction.next_camera_name}
                </h2>
                <p className="text-xs text-[var(--text-muted)] font-sans">
                  {activeJourney.prediction.location}
                </p>
              </div>

              <div className="md:col-span-4 p-3 rounded bg-[var(--bg)] border border-[var(--accent)]/40 text-center flex flex-col items-center justify-center">
                <span className="text-[10px] text-[var(--text-muted)] uppercase block">SPATIAL ETA</span>
                <span className="text-xl font-bold font-mono text-[var(--accent)]">{activeJourney.prediction.eta}</span>
                <span className="text-[9px] text-emerald-400 font-mono">COUNTDOWN ACTIVE</span>
              </div>
            </div>

            <div className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)] text-xs flex items-center space-x-2 text-[var(--text-muted)]">
              <AlertTriangle className="w-4 h-4 text-[var(--accent)] shrink-0" />
              <span>OPERATOR ADVISORY: {activeJourney.prediction.recommended_action}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
