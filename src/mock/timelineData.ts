export interface TimelineStep {
  id: string
  timestamp: string
  camera_id: string
  camera_name: string
  location: string
  match_score: number
  face_crop: string
  status_note: string
  is_current?: boolean
}

export interface SubjectJourney {
  track_id: string
  subject_name: string
  candidate_id: string
  category: 'POI' | 'VIP' | 'STAFF' | 'RESTRICTED'
  enrolled_photo: string
  first_seen: string
  last_seen: string
  total_detections: number
  timeline: TimelineStep[]
  prediction: {
    next_camera_id: string
    next_camera_name: string
    location: string
    eta: string
    transition_probability: number
    recommended_action: string
  }
}

export const MOCK_SUBJECT_JOURNEYS: SubjectJourney[] = [
  {
    track_id: 'TRK-7721',
    subject_name: 'Elena Rostova',
    candidate_id: 'CAND-014',
    category: 'VIP',
    enrolled_photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    first_seen: '23:22:15 UTC',
    last_seen: '23:30:02 UTC (LIVE)',
    total_detections: 3,
    timeline: [
      {
        id: 'step-1',
        timestamp: '23:22:15 UTC',
        camera_id: 'CAM_01',
        camera_name: 'CAM_01 // NORTH GATE',
        location: 'Sector 1 - Main Entrance Checkpoint',
        match_score: 0.96,
        face_crop: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status_note: 'Initial facial detection at North Gate turnstile. Watchlist match flagged.',
      },
      {
        id: 'step-2',
        timestamp: '23:26:40 UTC',
        camera_id: 'CAM_02',
        camera_name: 'CAM_02 // EAST PERIMETER',
        location: 'Sector 2 - Outer Fence Line',
        match_score: 0.94,
        face_crop: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status_note: 'Subject traversed East Walkway towards main lobby concourse.',
      },
      {
        id: 'step-3',
        timestamp: '23:30:02 UTC',
        camera_id: 'CAM_03',
        camera_name: 'CAM_03 // MAIN LOBBY',
        location: 'Sector 3 - Concourse & Elevators',
        match_score: 0.98,
        face_crop: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        status_note: 'High-confidence detection at Elevator Bank B. Current active position.',
        is_current: true,
      },
    ],
    prediction: {
      next_camera_id: 'CAM_05',
      next_camera_name: 'CAM_05 // PARKING B2',
      location: 'Sub-Level 2 - Ramp Entrance',
      eta: '30s',
      transition_probability: 0.92,
      recommended_action: 'Monitor Parking B2 exit gate & dispatch security node 04.',
    },
  },
  {
    track_id: 'TRK-8942',
    subject_name: 'Marcus Vance',
    candidate_id: 'CAND-091',
    category: 'POI',
    enrolled_photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    first_seen: '23:15:30 UTC',
    last_seen: '23:28:12 UTC',
    total_detections: 2,
    timeline: [
      {
        id: 'mv-step-1',
        timestamp: '23:15:30 UTC',
        camera_id: 'CAM_06',
        camera_name: 'CAM_06 // LOADING DOCK',
        location: 'Sector 6 - Logistics Bay 04',
        match_score: 0.91,
        face_crop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status_note: 'Subject entered via Logistics Bay service corridor.',
      },
      {
        id: 'mv-step-2',
        timestamp: '23:28:12 UTC',
        camera_id: 'CAM_01',
        camera_name: 'CAM_01 // NORTH GATE',
        location: 'Sector 1 - Main Entrance Checkpoint',
        match_score: 0.94,
        face_crop: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        status_note: 'Secondary verification confirmed match against Watchlist Alpha.',
        is_current: true,
      },
    ],
    prediction: {
      next_camera_id: 'CAM_03',
      next_camera_name: 'CAM_03 // MAIN LOBBY',
      location: 'Sector 3 - Concourse & Elevators',
      eta: '45s',
      transition_probability: 0.88,
      recommended_action: 'Alert lobby security station & verify credentials upon entry.',
    },
  },
  {
    track_id: 'TRK-5540',
    subject_name: 'Sophia Chen',
    candidate_id: 'CAND-088',
    category: 'STAFF',
    enrolled_photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    first_seen: '23:10:00 UTC',
    last_seen: '23:30:50 UTC',
    total_detections: 2,
    timeline: [
      {
        id: 'sc-step-1',
        timestamp: '23:10:00 UTC',
        camera_id: 'CAM_05',
        camera_name: 'CAM_05 // PARKING B2',
        location: 'Sub-Level 2 - Ramp Entrance',
        match_score: 0.95,
        face_crop: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        status_note: 'Staff badge badge scan at Sub-Level 2 elevator bank.',
      },
      {
        id: 'sc-step-2',
        timestamp: '23:30:50 UTC',
        camera_id: 'CAM_06',
        camera_name: 'CAM_06 // LOADING DOCK',
        location: 'Sector 6 - Logistics Bay 04',
        match_score: 0.96,
        face_crop: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        status_note: 'Logistics Supervisor confirmed at Loading Dock 04.',
        is_current: true,
      },
    ],
    prediction: {
      next_camera_id: 'CAM_04',
      next_camera_name: 'CAM_04 // NORTH CORRIDOR',
      location: 'Sector 4 - Secondary Corridor Access',
      eta: '15s',
      transition_probability: 0.95,
      recommended_action: 'Routine staff movement - monitor corridor entry.',
    },
  },
]
