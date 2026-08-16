import type { UnifiedEvent } from '../types/sentinel'

export interface PendingAlert {
  id: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  event: UnifiedEvent
  enrolled_photo: string
  advisory_text: string
  status: 'PENDING' | 'CONFIRMED' | 'DISMISSED'
  confirmed_at?: string
  operator_id?: string
  action_notes?: string
}

export const MOCK_PENDING_ALERTS: PendingAlert[] = [
  {
    id: 'ALT-9041',
    severity: 'CRITICAL',
    status: 'PENDING',
    event: {
      track_id: 'TRK-7721',
      identity: 'Elena Rostova',
      candidate_id: 'CAND-014',
      match_score: 0.98,
      current_camera: 'CAM_03 // MAIN LOBBY',
      timestamp: '2026-08-16T23:35:10Z',
      face_crop: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      next_camera: 'CAM_05 // PARKING B2',
      eta: '30s',
      transition_probability: 0.92,
      state: 'VERIFIED',
    },
    enrolled_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    advisory_text:
      'AUTOMATED ADVISORY: Target Elena Rostova (CAND-014) detected with 98% vector similarity against Watchlist Alpha. Subject entered Sector 3 Main Lobby at 23:35:10 UTC. Spatial Markov model predicts 92% likelihood of movement toward Elevator Bank B -> Parking Structure B2 (ETA 30s). Action required: Confirm identity to authorize security lock override.',
  },
  {
    id: 'ALT-9042',
    severity: 'HIGH',
    status: 'PENDING',
    event: {
      track_id: 'TRK-8942',
      identity: 'Marcus Vance',
      candidate_id: 'CAND-091',
      match_score: 0.94,
      current_camera: 'CAM_01 // NORTH GATE',
      timestamp: '2026-08-16T23:34:02Z',
      face_crop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      next_camera: 'CAM_03 // MAIN LOBBY',
      eta: '45s',
      transition_probability: 0.88,
      state: 'VERIFIED',
    },
    enrolled_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    advisory_text:
      'AUTOMATED ADVISORY: Target Marcus Vance (CAND-091) registered 94% embedding match at North Gate Entrance Checkpoint. Secondary biometric verification confirms facial feature alignment. Subject currently moving on foot toward Sector 3 lobby concourse.',
  },
  {
    id: 'ALT-9043',
    severity: 'MEDIUM',
    status: 'PENDING',
    event: {
      track_id: 'TRK-1092',
      identity: 'David Kim',
      candidate_id: 'CAND-204',
      match_score: 0.81,
      current_camera: 'CAM_05 // PARKING B2',
      timestamp: '2026-08-16T23:32:40Z',
      face_crop: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
      next_camera: 'CAM_01 // NORTH GATE',
      eta: '120s',
      transition_probability: 0.79,
      state: 'SCANNING',
    },
    enrolled_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    advisory_text:
      'AUTOMATED ADVISORY: Candidate David Kim (CAND-204) evaluated at 81% match score. Lighting conditions sub-optimal in Parking Structure B2. Human operator review recommended before taking dispatch action.',
  },
]
