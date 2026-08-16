import React, { useState, useEffect } from 'react'
import type { CameraFeed } from '../../types/sentinel'
import { MOCK_CAMERA_FEEDS } from '../../mock/sentinelData'
import { CameraFeedCard } from './CameraFeedCard'
import {
  LayoutGrid,
  Filter,
  Radio,
  X,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react'

type FilterMode = 'ALL' | 'VERIFIED' | 'SCANNING' | 'NO_MATCH'

export const CameraGrid: React.FC = () => {
  const [feeds] = useState<CameraFeed[]>(MOCK_CAMERA_FEEDS)
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL')
  const [selectedFeed, setSelectedFeed] = useState<CameraFeed | null>(null)
  const [gridColumns, setGridColumns] = useState<'3' | '2'>('3')

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedFeed(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Filter feeds based on selected mode
  const filteredFeeds = feeds.filter((feed) => {
    if (filterMode === 'ALL') return true
    return feed.primary_event?.state === filterMode
  })

  const verifiedCount = feeds.filter((f) => f.primary_event?.state === 'VERIFIED').length
  const scanningCount = feeds.filter((f) => f.primary_event?.state === 'SCANNING').length
  const noMatchCount = feeds.filter((f) => f.primary_event?.state === 'NO_MATCH').length

  return (
    <div className="flex flex-col space-y-4 h-full">
      {/* Grid Controls & Telemetry Header Bar */}
      <div className="p-3 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-3 font-telemetry select-none">
        {/* Left Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center space-x-1 pr-2 border-r border-[var(--border)] text-[var(--text-muted)] text-xs">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">FILTER:</span>
          </div>

          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border ${
              filterMode === 'ALL'
                ? 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            ALL FEEDS ({feeds.length})
          </button>

          <button
            onClick={() => setFilterMode('VERIFIED')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border flex items-center space-x-1.5 ${
              filterMode === 'VERIFIED'
                ? 'bg-[var(--accent)] text-black font-bold border-[var(--accent)]'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>VERIFIED ({verifiedCount})</span>
          </button>

          <button
            onClick={() => setFilterMode('SCANNING')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border flex items-center space-x-1.5 ${
              filterMode === 'SCANNING'
                ? 'bg-amber-500 text-black font-bold border-amber-500'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>SCANNING ({scanningCount})</span>
          </button>

          <button
            onClick={() => setFilterMode('NO_MATCH')}
            className={`px-3 py-1 rounded text-xs transition-colors cursor-pointer border ${
              filterMode === 'NO_MATCH'
                ? 'bg-white text-black font-bold border-white'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            UNMATCHED ({noMatchCount})
          </button>
        </div>

        {/* Right Layout & Stats */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="hidden lg:flex items-center space-x-3 text-[var(--text-muted)] text-[11px]">
            <span>NODES: <strong className="text-[var(--text)] font-mono">6 ONLINE</strong></span>
            <span>ACTIVE TRACKS: <strong className="text-[var(--accent)] font-mono">6</strong></span>
          </div>

          <div className="flex items-center space-x-1 border-l border-[var(--border)] pl-3">
            <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline mr-1">GRID:</span>
            <button
              onClick={() => setGridColumns('3')}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                gridColumns === '3'
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)] font-bold'
                  : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)]'
              }`}
              title="3 Columns"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridColumns('2')}
              className={`p-1.5 rounded border transition-colors cursor-pointer ${
                gridColumns === '2'
                  ? 'bg-[var(--accent)] text-black border-[var(--accent)] font-bold'
                  : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)]'
              }`}
              title="2 Columns"
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Camera Feed Cards Responsive Grid */}
      <div
        className={`grid gap-4 ${
          gridColumns === '3'
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        {filteredFeeds.map((feed) => (
          <CameraFeedCard
            key={feed.id}
            feed={feed}
            onEnlarge={(f) => setSelectedFeed(f)}
          />
        ))}
      </div>

      {/* Fullscreen Feed Inspection Modal */}
      {selectedFeed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs select-none"
          onClick={() => setSelectedFeed(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded border border-[var(--border)] bg-[var(--surface)] p-4 flex flex-col space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Navigation & Return Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] font-telemetry gap-2">
              <button
                onClick={() => setSelectedFeed(null)}
                className="px-3 py-1.5 rounded bg-[var(--accent)] text-black font-bold text-xs flex items-center space-x-1.5 hover:bg-[var(--accent-hover)] transition-colors cursor-pointer shadow-xs shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-black" />
                <span>RETURN TO CAMERA GRID [ESC]</span>
              </button>

              <div className="flex items-center space-x-2 truncate min-w-0">
                <Radio className="w-4 h-4 text-[var(--accent)] animate-pulse shrink-0" />
                <h3 className="font-bold text-sm text-[var(--text)] truncate">{selectedFeed.name}</h3>
                <span className="text-xs text-[var(--text-muted)] font-mono hidden sm:inline truncate">[{selectedFeed.location}]</span>
              </div>

              <button
                onClick={() => setSelectedFeed(null)}
                className="px-2.5 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1 shrink-0"
              >
                <span>CLOSE</span>
                <X className="w-4 h-4 text-[var(--accent)]" />
              </button>
            </div>

            {/* Modal Large Feed View */}
            <div className="w-full">
              <CameraFeedCard feed={selectedFeed} showScanLine={true} />
            </div>

            {/* Modal Unified Event Details Panel */}
            {selectedFeed.primary_event && (
              <div className="p-3 rounded border border-[var(--border)] bg-[var(--bg)] font-telemetry text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[var(--accent)] border-b border-[var(--border)] pb-1.5 uppercase">
                  <span>UNIFIED EVENT TELEMETRY // {selectedFeed.primary_event.track_id}</span>
                  <span className="font-mono text-[var(--text)]">MATCH SCORE: {Math.round(selectedFeed.primary_event.match_score * 100)}%</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">SUBJECT IDENTITY</span>
                    <strong className="text-[var(--text)] font-sans text-sm">{selectedFeed.primary_event.identity}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">CURRENT CAMERA NODE</span>
                    <strong className="text-[var(--text)] font-mono">{selectedFeed.primary_event.current_camera}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">PREDICTED ROUTING</span>
                    <strong className="text-[var(--accent)] font-mono flex items-center space-x-1">
                      <span>{selectedFeed.primary_event.next_camera}</span>
                      <ArrowRight className="w-3 h-3 inline" />
                      <span>ETA {selectedFeed.primary_event.eta}</span>
                    </strong>
                  </div>
                </div>

                {selectedFeed.primary_event.notes && (
                  <p className="text-[11px] text-[var(--text-muted)] border-t border-[var(--border)]/50 pt-1.5 italic">
                    "{selectedFeed.primary_event.notes}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

