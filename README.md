# Sentinel Command HQ // Multi-Camera Surveillance Intelligence

**Sentinel Command HQ** is the operator-facing console for a multi-camera surveillance intelligence system built for the Sentinel Edge platform. Inspired by tactical mission control interfaces (NASA / radar station / ship bridge), it processes real-time facial recognition, spatial tracking, biometric verification, and predictive trajectory routing.

![Sentinel Command HQ](https://raw.githubusercontent.com/keviv777/sentinel-command-hq/main/public/manifest.json)

---

## 🚀 Tactical Workstation Stations

1. **Live Camera Grid (`Step 2`)**: Multi-feed spatial camera viewports (`CAM_01` to `CAM_06`) with bounding box overlays, Track IDs (`TRK-8942`), confidence scores, match state badges (`VERIFIED`), and predicted next camera footers.
2. **Alerts & Review (`Step 3`)**: Human verification queue comparing live captured frames vs enrolled DB profiles, featuring RAG automated intelligence advisories, similarity gauges (`98%`), and batch confirmation (`CONFIRM HIGH CONFIDENCE >90%`).
3. **GIS Station Map (`Step 4`)**: React-Leaflet GIS spatial map using CartoDB Dark & Positron tiles, custom signal amber (`#FF6B35`) node markers with radar pulse rings, and Markov trajectory vector arrows.
4. **Camera Health (`Step 5`)**: Hardware node telemetry monitoring latency, FPS, bitrate, and GPU CUDA load meters with interactive `PING NODE` live RTT updates.
5. **Identity Enrollment (`Step 6`)**: Target photo dropzone, metadata form, category tag selection (`POI`, `VIP`, `STAFF`, `RESTRICTED`), and direct `ENROLL TARGET INTO FAISS VECTOR INDEX` button with 512D ResNet feature vector extraction animation.
6. **Journey Timeline (`Step 7`)**: Chronological spatial-temporal trajectory tracking displaying subject movement across cameras with Markov next camera prediction (`CAM_05 // PARKING B2`, ETA `30s`, 92% probability).
7. **Responsive & PWA Readiness (`Step 8`)**: Full mobile/tablet reflow (~375px to 1280px+), collapsible navigation drawer, touch targets, and Progressive Web App (PWA) manifest & service worker offline capabilities.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) + Custom CSS Variables & Radar Keyframes
- **Icons**: Lucide React
- **GIS Mapping**: Leaflet + React-Leaflet + CartoDB Tiles
- **PWA**: Web App Manifest (`manifest.json`) + Service Worker (`sw.js`)

---

## ⚙️ Quick Start

```bash
# Clone the repository
git clone https://github.com/keviv777/sentinel-command-hq.git

# Navigate into directory
cd sentinel-command-hq

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
