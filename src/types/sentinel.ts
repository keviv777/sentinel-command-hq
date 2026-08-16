export type MatchState = 'VERIFIED' | 'SCANNING' | 'NO_MATCH' | 'WARNING'

export interface BoundingBox {
  id: string
  x: number // percentage 0-100
  y: number // percentage 0-100
  width: number // percentage 0-100
  height: number // percentage 0-100
  track_id: string
  label?: string
  confidence: number // 0-1
  state: MatchState
}

export interface UnifiedEvent {
  track_id: string
  identity: string
  candidate_id?: string
  match_score: number // 0.0 - 1.0
  current_camera: string
  timestamp: string
  face_crop: string
  next_camera: string
  eta: string
  transition_probability: number // 0.0 - 1.0
  state: MatchState
  notes?: string
}

export interface CameraFeed {
  id: string
  name: string
  location: string
  coordinates: [number, number] // [lat, lng]
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE'
  resolution: string
  fps: number
  latency: number // in ms
  bitrate?: string
  gpu_load?: number // percentage 0-100
  uptime?: string
  stream_url?: string
  background_image?: string
  bounding_boxes: BoundingBox[]
  primary_event?: UnifiedEvent
  last_activity: string
}
