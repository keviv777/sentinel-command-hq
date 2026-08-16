import React, { useState } from 'react'
import type { CameraFeed } from '../../types/sentinel'
import {
  Eye,
  Maximize2,
  Scan,
  Radio,
  ArrowRight,
  Target
} from 'lucide-react'

interface CameraFeedCardProps {
  feed: CameraFeed
  onEnlarge?: (feed: CameraFeed) => void
  showScanLine?: boolean
}

export const CameraFeedCard: React.FC<CameraFeedCardProps> = ({
  feed,
  onEnlarge,
  showScanLine = true,
}) => {
  const [scanActive, setScanActive] = useState(showScanLine)
  const [showOverlays, setShowOverlays] = useState(true)

  const primaryEvent = feed.primary_event

  // Helper for match state styling
  const getMatchBadgeStyle = (state?: string) => {
    switch (state) {
      case 'VERIFIED':
        return 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
      case 'SCANNING':
        return 'bg-amber-500/20 text-amber-500 border-amber-500/40 animate-pulse font-semibold'
      case 'NO_MATCH':
        return 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] font-normal'
      case 'WARNING':
        return 'bg-[var(--accent-danger)] text-white font-bold border-[var(--accent-danger)]'
      default:
        return 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)]'
    }
  }

  return (
    <div className="rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col overflow-hidden shadow-xs hover:border-[var(--accent)]/50 transition-colors group">
      {/* Feed Header - Displays Camera ID, Name, Location, and Status cleanly without viewport overlap */}
      <div className="px-3 py-2 border-b border-[var(--border)] bg-[var(--bg)] flex items-center justify-between font-telemetry select-none gap-2">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xs text-[var(--text)] truncate">{feed.name}</span>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-sans truncate">
              {feed.location}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-[10px] text-[var(--text-muted)] shrink-0">
          <span className="hidden sm:inline font-mono text-[10px]">{feed.resolution}</span>
          <span className="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-semibold uppercase text-[9px]">
            {feed.status}
          </span>
        </div>
      </div>

      {/* Main Video Screen Area */}
      <div className="relative aspect-video bg-black/90 flex items-center justify-center overflow-hidden group/canvas">
        {/* Synthetic Tactical Surveillance Feed Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f242d_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Mock background subject image preview */}
        {primaryEvent?.face_crop && (
          <div className="absolute inset-0 opacity-25 mix-blend-luminosity filter contrast-125">
            <img
              src={primaryEvent.face_crop}
              alt="Surveillance Feed"
              className="w-full h-full object-cover scale-110 filter blur-[1px]"
            />
          </div>
        )}

        {/* Crosshair Center Reticle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-12 h-12 border border-[var(--accent)]/50 rounded-full flex items-center justify-center">
            <div className="w-1 h-1 bg-[var(--accent)] rounded-full" />
          </div>
        </div>

        {/* Tactical Canvas HUD Watermark Badge - Compact fixed top-left indicator */}
        <div className="absolute top-2 left-2 font-telemetry text-[9px] text-white/90 bg-black/80 px-2 py-0.5 rounded border border-white/20 flex items-center space-x-1.5 pointer-events-none z-20 backdrop-blur-xs shadow-xs">
          <Radio className="w-3 h-3 text-[var(--accent)] animate-pulse shrink-0" />
          <span className="font-mono font-bold text-[var(--accent)]">REC // {feed.last_activity}</span>
        </div>

        {/* Signature Scanning Line Animation */}
        {scanActive && (
          <div className="absolute inset-x-0 h-1 bg-[var(--accent)]/80 shadow-[0_0_8px_var(--accent)] animate-radar-line pointer-events-none z-10" />
        )}

        {/* Detected Subject Bounding Box Overlays */}
        {showOverlays &&
          feed.bounding_boxes.map((box) => {
            // Smart vertical positioning for label tag to prevent canvas clipping
            const isNearTop = box.y < 25

            return (
              <div
                key={box.id}
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
                className={`absolute border-2 transition-all duration-300 pointer-events-auto z-20 ${
                  box.state === 'VERIFIED'
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-[0_0_12px_rgba(255,107,53,0.3)]'
                    : box.state === 'SCANNING'
                    ? 'border-amber-500 bg-amber-500/10 animate-pulse'
                    : 'border-white/50 bg-white/5'
                }`}
              >
                {/* Tactical Crosshair Bracket Corners */}
                <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-current text-[var(--accent)]" />
                <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-current text-[var(--accent)]" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-current text-[var(--accent)]" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-current text-[var(--accent)]" />

                {/* Bounding Box Label Tag - Self-contained badge without viewport collision */}
                <div
                  className={`absolute font-telemetry text-[9px] bg-black/95 text-white px-2 py-0.5 rounded border border-white/20 whitespace-nowrap flex items-center space-x-1.5 shadow-md z-30 ${
                    isNearTop ? 'top-1 left-1' : '-top-7 left-0'
                  }`}
                >
                  <Target className="w-3 h-3 text-[var(--accent)] shrink-0" />
                  <span className="font-bold font-mono text-[var(--accent)]">{box.track_id}</span>
                  {box.label && (
                    <span className="text-gray-200 font-sans border-l border-white/20 pl-1.5 truncate max-w-[100px]">
                      {box.label}
                    </span>
                  )}
                  <span className="text-emerald-400 font-mono font-bold">
                    {Math.round(box.confidence * 100)}%
                  </span>
                </div>
              </div>
            )
          })}

        {/* Hover Quick Overlay Actions */}
        <div className="absolute bottom-2 right-2 flex items-center space-x-1 z-30 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setScanActive(!scanActive)}
            title="Toggle Scan Line"
            className={`p-1.5 rounded text-xs font-telemetry cursor-pointer border backdrop-blur-xs transition-colors ${
              scanActive
                ? 'bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/40'
                : 'bg-black/60 text-white/70 border-white/10 hover:text-white'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            title="Toggle Overlays"
            className={`p-1.5 rounded text-xs font-telemetry cursor-pointer border backdrop-blur-xs transition-colors ${
              showOverlays
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-black/60 text-white/70 border-white/10 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {onEnlarge && (
            <button
              onClick={() => onEnlarge(feed)}
              title="Enlarge Feed"
              className="p-1.5 rounded text-xs font-telemetry bg-black/60 text-white/80 border border-white/10 hover:text-white hover:bg-black/80 cursor-pointer backdrop-blur-xs transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Feed Telemetry Footer & Unified Event Readout */}
      {primaryEvent && (
        <div className="p-2.5 bg-[var(--surface)] border-t border-[var(--border)] font-telemetry text-xs space-y-2 select-none">
          {/* Target Track & Match State Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <span className="font-mono text-[11px] font-bold text-[var(--text)]">
                {primaryEvent.track_id}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] truncate font-sans font-medium">
                {primaryEvent.identity}
              </span>
            </div>

            <span
              className={`text-[9px] px-2 py-0.5 rounded border uppercase tracking-wider ${getMatchBadgeStyle(
                primaryEvent.state
              )}`}
            >
              {primaryEvent.state}
            </span>
          </div>

          {/* Unified Event Predicted Next Camera Routing */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1.5 border-t border-[var(--border)]/50 text-[var(--text-muted)]">
            <div className="flex items-center space-x-1.5">
              <ArrowRight className="w-3 h-3 text-[var(--accent)] shrink-0" />
              <span className="truncate">
                NEXT: <strong className="text-[var(--text)] font-mono">{primaryEvent.next_camera}</strong>
              </span>
            </div>
            <div className="flex items-center justify-end space-x-2 font-mono text-[var(--text)]">
              <span>ETA: <strong>{primaryEvent.eta}</strong></span>
              <span className="text-[var(--accent)]">({Math.round(primaryEvent.transition_probability * 100)}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
