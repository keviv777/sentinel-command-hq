import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Polyline } from 'react-leaflet'
import L from 'leaflet'
import { MOCK_CAMERA_FEEDS } from '../../mock/sentinelData'
import type { CameraFeed } from '../../types/sentinel'
import { useTheme } from '../../hooks/useTheme'
import {
  Radio,
  Target,
  ArrowRight,
  Compass
} from 'lucide-react'

// Custom SVG Leaflet Marker Icon Generator using Accent Color System (#FF6B35)
const createTacticalMarkerIcon = (feed: CameraFeed) => {
  const isVerified = feed.primary_event?.state === 'VERIFIED'
  const isScanning = feed.primary_event?.state === 'SCANNING'

  const color = isVerified
    ? '#FF6B35' // Signal Amber
    : isScanning
    ? '#F59E0B' // Amber 500
    : '#8E939D' // Muted

  const pulseHtml = isVerified
    ? `<div class="absolute -inset-2 rounded-full border border-[#FF6B35]/50 animate-ping pointer-events-none"></div>`
    : ''

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0A0B0D] border-2 border-[${color}] shadow-[0_0_12px_${color}66] cursor-pointer group">
      ${pulseHtml}
      <div class="w-3 h-3 rounded-full bg-[${color}]"></div>
      <div class="absolute -bottom-6 font-mono text-[9px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded border border-white/20 whitespace-nowrap shadow-sm">
        ${feed.id}
      </div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'custom-tactical-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20],
  })
}

export const GISMap: React.FC = () => {
  const { theme } = useTheme()
  const [feeds] = useState<CameraFeed[]>(MOCK_CAMERA_FEEDS)
  const [showTrajectories, setShowTrajectories] = useState(true)
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null)

  const mapCenter: [number, number] = [37.7742, -122.4190]

  // CartoDB Tile Layer URLs matching dark / light modes
  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  const tileAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

  // Extract predicted trajectories between current_camera and next_camera using shared mock dataset
  const predictedTrajectories = feeds
    .filter((feed) => {
      const event = feed.primary_event
      return event && (event.state === 'VERIFIED' || event.state === 'SCANNING') && event.next_camera
    })
    .map((feed) => {
      const event = feed.primary_event!
      const targetCamId = event.next_camera.split(' ')[0] // e.g. "CAM_03"
      const currentCam = feed
      const nextCam = feeds.find(
        (f) => f.id === targetCamId || f.name.startsWith(targetCamId)
      )

      if (currentCam && nextCam && currentCam.id !== nextCam.id) {
        return {
          id: `traj-${event.track_id}`,
          fromCam: currentCam,
          toCam: nextCam,
          event,
          positions: [currentCam.coordinates, nextCam.coordinates] as [number, number][],
        }
      }
      return null
    })
    .filter(Boolean)

  return (
    <div className="h-full flex flex-col space-y-4 max-w-7xl mx-auto">
      {/* Map Control Header Bar */}
      <div className="p-3.5 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col md:flex-row md:items-center justify-between gap-3 font-telemetry select-none shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--accent)]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-sans text-[var(--text)] uppercase">
              GIS SPATIAL CAMERA NETWORK
            </h2>
            <p className="text-[11px] text-[var(--text-muted)]">
              Real-time Node Coordinates & Predictive Subject Path Trajectories
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setShowTrajectories(!showTrajectories)}
            className={`px-3 py-1.5 rounded border text-xs font-bold transition-colors cursor-pointer flex items-center space-x-1.5 ${
              showTrajectories
                ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                : 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)]'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>TRAJECTORY PATHS ({predictedTrajectories.length})</span>
          </button>

          <div className="px-3 py-1.5 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] text-xs flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>6/6 NODES GIS ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="flex-1 rounded border border-[var(--border)] bg-[var(--surface)] overflow-hidden relative min-h-[500px] shadow-md">
        <MapContainer
          center={mapCenter}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full z-10 bg-[var(--bg)]"
          style={{ height: '100%', width: '100%', minHeight: '520px' }}
        >
          <TileLayer attribution={tileAttribution} url={tileUrl} />

          {/* Render Predicted Path Polyline Vectors */}
          {showTrajectories &&
            predictedTrajectories.map((traj) => {
              if (!traj) return null
              const isVerified = traj.event.state === 'VERIFIED'
              const color = isVerified ? '#FF6B35' : '#F59E0B'

              return (
                <Polyline
                  key={traj.id}
                  positions={traj.positions}
                  pathOptions={{
                    color: color,
                    weight: 3,
                    opacity: 0.85,
                    dashArray: '8, 8',
                    className: 'animate-trajectory-dash',
                  }}
                >
                  <Tooltip sticky direction="top" opacity={0.95}>
                    <div className="font-telemetry text-xs space-y-1 p-1">
                      <div className="flex items-center space-x-1.5 text-[var(--accent)] font-bold">
                        <span>PREDICTED TRAJECTORY</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                        <span>{traj.event.track_id}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text)] font-sans">
                        Target: <strong>{traj.event.identity}</strong>
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] font-mono">
                        ROUTE: {traj.fromCam.id} ➔ {traj.toCam.id} | ETA: <strong>{traj.event.eta}</strong> ({Math.round(traj.event.transition_probability * 100)}%)
                      </div>
                    </div>
                  </Tooltip>
                </Polyline>
              )
            })}

          {/* Render Camera Markers */}
          {feeds.map((feed) => (
            <Marker
              key={feed.id}
              position={feed.coordinates}
              icon={createTacticalMarkerIcon(feed)}
              eventHandlers={{
                click: () => setSelectedCameraId(feed.id),
              }}
            >
              {/* Marker Hover Tooltip */}
              <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
                <div className="font-telemetry text-xs space-y-0.5 p-0.5">
                  <div className="font-bold text-[var(--accent)]">{feed.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)] font-sans">{feed.location}</div>
                  {feed.primary_event && (
                    <div className="text-[10px] text-[var(--text)] font-mono border-t border-[var(--border)] pt-1 mt-1">
                      TRACK: <strong>{feed.primary_event.track_id}</strong> ({feed.primary_event.identity})
                    </div>
                  )}
                </div>
              </Tooltip>

              {/* Marker Click Popup Card */}
              <Popup>
                <div className="p-2.5 font-telemetry text-xs space-y-2 max-w-xs">
                  <div className="flex items-center justify-between border-b border-[var(--border)] pb-1.5">
                    <span className="font-bold text-[var(--accent)] text-xs">{feed.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                      {feed.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] font-sans">{feed.location}</p>

                  {feed.primary_event && (
                    <div className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-[var(--accent)]">{feed.primary_event.track_id}</span>
                        <span className="font-mono text-emerald-400">
                          {Math.round(feed.primary_event.match_score * 100)}% MATCH
                        </span>
                      </div>
                      <div className="text-xs font-bold text-[var(--text)] font-sans">
                        {feed.primary_event.identity}
                      </div>

                      {/* Face Thumbnail */}
                      <div className="w-full h-20 rounded overflow-hidden bg-black relative border border-[var(--border)]">
                        <img
                          src={feed.primary_event.face_crop}
                          alt="Subject Crop"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-1 right-1 font-mono text-[9px] bg-black/80 text-white px-1.5 rounded">
                          {feed.primary_event.state}
                        </div>
                      </div>

                      <div className="text-[10px] text-[var(--text-muted)] font-mono pt-1">
                        PREDICTED NEXT: <strong className="text-[var(--accent)]">{feed.primary_event.next_camera}</strong> (ETA {feed.primary_event.eta})
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Map Tactical Telemetry Overlay Badge */}
        <div className="absolute bottom-4 left-4 z-20 p-3 rounded border border-[var(--border)] bg-[var(--surface)]/90 backdrop-blur-md font-telemetry text-xs space-y-1.5 shadow-lg max-w-xs select-none">
          <div className="flex items-center justify-between text-[10px] font-bold text-[var(--accent)] uppercase border-b border-[var(--border)] pb-1">
            <span className="flex items-center space-x-1">
              <Compass className="w-3.5 h-3.5" />
              <span>GIS SPATIAL TELEMETRY</span>
            </span>
            <span>LIVE</span>
          </div>

          <div className="space-y-1 text-[11px] text-[var(--text-muted)]">
            <div className="flex justify-between">
              <span>TILE LAYER:</span>
              <strong className="text-[var(--text)] font-mono">{theme === 'dark' ? 'CartoDB Dark' : 'CartoDB Light'}</strong>
            </div>
            <div className="flex justify-between">
              <span>ACTIVE PATHS:</span>
              <strong className="text-[var(--accent)] font-mono">{predictedTrajectories.length} TRAJECTORIES</strong>
            </div>
            <div className="flex justify-between">
              <span>SELECTED NODE:</span>
              <strong className="text-[var(--text)] font-mono">{selectedCameraId || 'ALL NODES'}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
