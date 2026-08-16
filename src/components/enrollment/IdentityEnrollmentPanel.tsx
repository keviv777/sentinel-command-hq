import React, { useState } from 'react'
import {
  UploadCloud,
  UserPlus,
  CheckCircle2,
  Shield,
  Cpu,
  Trash2,
  Sparkles,
  Search,
  Check
} from 'lucide-react'

export type WatchlistCategory = 'POI' | 'VIP' | 'STAFF' | 'RESTRICTED'

export interface EnrolledCandidate {
  id: string
  name: string
  candidateId: string
  category: WatchlistCategory
  notes: string
  photoUrl: string
  enrolledAt: string
  vectorHash: string
}

const SAMPLE_ENROLLED: EnrolledCandidate[] = [
  {
    id: 'enr-01',
    name: 'Marcus Vance',
    candidateId: 'CAND-091',
    category: 'POI',
    notes: 'Watchlist Alpha - High priority subject at North Gate.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    enrolledAt: '2026-08-16 20:14:02 UTC',
    vectorHash: '0x9f4a...81c2',
  },
  {
    id: 'enr-02',
    name: 'Elena Rostova',
    candidateId: 'CAND-014',
    category: 'VIP',
    notes: 'Level 5 VIP clearance - Main Lobby access permitted.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    enrolledAt: '2026-08-16 18:30:45 UTC',
    vectorHash: '0x3b1c...99a4',
  },
  {
    id: 'enr-03',
    name: 'David Kim',
    candidateId: 'CAND-204',
    category: 'STAFF',
    notes: 'Logistics Contractor - Parking Structure B2 supervisor.',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    enrolledAt: '2026-08-15 14:20:10 UTC',
    vectorHash: '0x7e2d...44f0',
  },
]

export const IdentityEnrollmentPanel: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [fullName, setFullName] = useState('')
  const [candidateId, setCandidateId] = useState('CAND-' + Math.floor(100 + Math.random() * 900))
  const [category, setCategory] = useState<WatchlistCategory>('POI')
  const [notes, setNotes] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lastEnrolled, setLastEnrolled] = useState<EnrolledCandidate | null>(null)
  const [enrolledList, setEnrolledList] = useState<EnrolledCandidate[]>(SAMPLE_ENROLLED)
  const [searchQuery, setSearchQuery] = useState('')

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file)
        setImagePreview(url)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const url = URL.createObjectURL(file)
      setImagePreview(url)
    }
  }

  // Load sample image helper - Populates all fields cleanly
  const handleUseSampleTarget = (
    url: string,
    name: string,
    id: string,
    cat: WatchlistCategory,
    desc: string
  ) => {
    setImagePreview(url)
    setFullName(name)
    setCandidateId(id)
    setCategory(cat)
    setNotes(desc)
  }

  // Direct click handler for Enroll Button to guarantee instant execution
  const handleEnrollClick = () => {
    if (isSubmitting) return

    const targetName = fullName.trim() || 'Target Subject ' + candidateId
    setIsSubmitting(true)

    setTimeout(() => {
      const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      const vectorHash = '0x' + Math.random().toString(16).substring(2, 10) + '...' + Math.random().toString(16).substring(2, 6)

      // Default fallback avatar if no image provided
      const finalPhotoUrl =
        imagePreview ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'

      const newCandidate: EnrolledCandidate = {
        id: 'enr-' + Date.now(),
        name: targetName,
        candidateId: candidateId || 'CAND-' + Math.floor(100 + Math.random() * 900),
        category: category,
        notes: notes.trim() || 'Enrolled via Command HQ Operator Portal.',
        photoUrl: finalPhotoUrl,
        enrolledAt: timestamp,
        vectorHash: vectorHash,
      }

      setEnrolledList((prev) => [newCandidate, ...prev])
      setLastEnrolled(newCandidate)
      setIsSubmitting(false)

      // Reset form fields
      setFullName('')
      setImagePreview(null)
      setNotes('')
      setCandidateId('CAND-' + Math.floor(100 + Math.random() * 900))
    }, 600)
  }

  // Handle form submission wrapper
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleEnrollClick()
  }

  const getCategoryBadgeClass = (cat: WatchlistCategory, isSelected: boolean) => {
    if (!isSelected) {
      return 'bg-[var(--bg)] text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--text)] font-medium'
    }

    switch (cat) {
      case 'POI':
        return 'bg-[var(--accent)] text-black font-bold border-[var(--accent)] shadow-sm'
      case 'VIP':
        return 'bg-emerald-500 text-black font-bold border-emerald-500 shadow-sm'
      case 'STAFF':
        return 'bg-blue-500 text-white font-bold border-blue-500 shadow-sm'
      case 'RESTRICTED':
        return 'bg-[var(--accent-danger)] text-white font-bold border-[var(--accent-danger)] shadow-sm'
    }
  }

  const filteredDirectory = enrolledList.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.candidateId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col space-y-6 max-w-7xl mx-auto h-full">
      {/* Top Banner Status */}
      {lastEnrolled && (
        <div className="p-3.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-telemetry text-xs flex items-center justify-between shadow-xs select-none">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="text-white uppercase font-sans">ENROLLED SUCCESSFULLY INTO FAISS INDEX</strong>
              <p className="text-[11px] text-emerald-300 font-mono">
                {lastEnrolled.name} ({lastEnrolled.candidateId}) added to watchlist directory // Vector Hash: {lastEnrolled.vectorHash}
              </p>
            </div>
          </div>
          <button
            onClick={() => setLastEnrolled(null)}
            className="text-[10px] text-emerald-300 hover:text-white underline font-mono cursor-pointer"
          >
            DISMISS
          </button>
        </div>
      )}

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Dropzone & Image Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] flex flex-col space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5 font-telemetry select-none">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="font-bold text-sm text-[var(--text)] uppercase">TARGET FACIAL BIOMETRICS</h2>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">512D RESNET</span>
            </div>

            {/* Drag & Drop Canvas */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded border-2 border-dashed p-6 text-center flex flex-col items-center justify-center transition-all min-h-[260px] select-none ${
                isDragging
                  ? 'border-[var(--accent)] bg-[var(--accent)]/10 scale-[1.01]'
                  : imagePreview
                  ? 'border-[var(--border)] bg-black/60'
                  : 'border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]/60'
              }`}
            >
              {imagePreview ? (
                <div className="relative w-full h-56 rounded overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={imagePreview}
                    alt="Target Facial Preview"
                    className="w-full h-full object-contain filter contrast-105"
                  />

                  {/* Tactical Crosshair Alignment Frame */}
                  <div className="absolute inset-4 border border-[var(--accent)]/40 rounded flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 border border-[var(--accent)] rounded-full animate-ping opacity-60" />
                    <div className="absolute top-1 left-2 font-telemetry text-[9px] text-[var(--accent)] font-mono font-bold bg-black/80 px-1.5 py-0.5 rounded border border-[var(--accent)]/40">
                      FACE_DETECTED // 99.4%
                    </div>
                  </div>

                  {/* Clear Image Button */}
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded bg-black/80 text-white hover:text-[var(--accent-danger)] border border-white/20 transition-colors cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-3 w-full h-full justify-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold font-sans text-[var(--text)]">
                      DRAG & DROP TARGET PHOTO HERE
                    </p>
                    <p className="text-[11px] font-telemetry text-[var(--text-muted)]">
                      or click to browse local filesystem (.jpg, .png, .webp)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Quick Sample Selector */}
            <div className="pt-2 border-t border-[var(--border)] space-y-2 select-none">
              <span className="text-[10px] font-telemetry text-[var(--text-muted)] block uppercase">
                QUICK SAMPLE DEMO TARGETS:
              </span>
              <div className="grid grid-cols-2 gap-2 font-telemetry text-xs">
                <button
                  type="button"
                  onClick={() =>
                    handleUseSampleTarget(
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                      'Elena Rostova',
                      'CAND-014',
                      'VIP',
                      'Level 5 VIP clearance - Main Lobby access permitted.'
                    )
                  }
                  className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] text-[11px] font-mono transition-colors cursor-pointer text-left truncate flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[var(--accent)] shrink-0" />
                  <span className="truncate">+ Sample: Elena (VIP)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleUseSampleTarget(
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
                      'Marcus Vance',
                      'CAND-091',
                      'POI',
                      'Watchlist Alpha - High priority subject at North Gate.'
                    )
                  }
                  className="p-2 rounded bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] text-[11px] font-mono transition-colors cursor-pointer text-left truncate flex items-center space-x-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[var(--accent)] shrink-0" />
                  <span className="truncate">+ Sample: Marcus (POI)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Form & Actions (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <form
            onSubmit={handleSubmit}
            className="p-5 rounded border border-[var(--border)] bg-[var(--surface)] space-y-4 shadow-xs select-none"
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 font-telemetry">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="font-bold text-sm text-[var(--text)] uppercase">TARGET METADATA FORM</h2>
              </div>
              <span className="text-[10px] text-[var(--accent)] font-mono font-bold">FAISS ENROLLMENT</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-telemetry text-xs">
              {/* Full Name Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase block">
                  TARGET FULL NAME / ALIAS *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-sans text-xs focus:border-[var(--accent)] focus:outline-none transition-colors"
                />
              </div>

              {/* Candidate ID Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase block">
                  CANDIDATE REFERENCE ID *
                </label>
                <input
                  type="text"
                  required
                  value={candidateId}
                  onChange={(e) => setCandidateId(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--accent)] font-mono text-xs font-bold focus:border-[var(--accent)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Watchlist Category Dropdown Selector - Fully Interactive */}
            <div className="space-y-1.5 font-telemetry text-xs">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase block">
                  WATCHLIST CATEGORY TAG *
                </label>
                <span className="text-[10px] font-mono text-[var(--accent)]">
                  ACTIVE: {category}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['POI', 'VIP', 'STAFF', 'RESTRICTED'] as WatchlistCategory[]).map((cat) => {
                  const isSelected = category === cat

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`py-2.5 px-2 rounded text-xs font-bold border transition-all cursor-pointer flex items-center justify-center space-x-1.5 min-h-[42px] active:scale-95 ${getCategoryBadgeClass(
                        cat,
                        isSelected
                      )}`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      <span>
                        {cat === 'POI' && 'POI (AMBER)'}
                        {cat === 'VIP' && 'VIP (GREEN)'}
                        {cat === 'STAFF' && 'STAFF (BLUE)'}
                        {cat === 'RESTRICTED' && 'RESTRICTED'}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Operational Notes */}
            <div className="space-y-1 font-telemetry text-xs">
              <label className="text-[10px] font-semibold text-[var(--text-muted)] uppercase block">
                OPERATIONAL NOTES & INTELLIGENCE DESCRIPTION
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter watchlist priority, security clearances, or known spatial corridors..."
                className="w-full px-3 py-2 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] font-sans text-xs focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleEnrollClick}
              disabled={isSubmitting}
              className="w-full py-3 rounded font-telemetry font-bold text-xs bg-[var(--accent)] text-black border border-[var(--accent)] hover:bg-[var(--accent-hover)] transition-all cursor-pointer shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {isSubmitting ? (
                <>
                  <Cpu className="w-4 h-4 text-black animate-spin" />
                  <span>EXTRACTING 512D VECTOR & ENROLLING...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>ENROLL TARGET INTO FAISS VECTOR INDEX</span>
                </>
              )}
            </button>
          </form>

          {/* Enrolled Watchlist Directory */}
          <div className="p-4 rounded border border-[var(--border)] bg-[var(--surface)] space-y-3 font-telemetry select-none shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[var(--accent)]" />
                <h3 className="font-bold text-xs text-[var(--text)] uppercase">
                  ACTIVE WATCHLIST INDEX ({enrolledList.length})
                </h3>
              </div>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2 top-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter directory..."
                  className="w-full pl-7 pr-2 py-1 rounded bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] text-[11px] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredDirectory.map((candidate) => (
                <div
                  key={candidate.id}
                  className="p-2.5 rounded bg-[var(--bg)] border border-[var(--border)] flex items-center justify-between text-xs hover:border-[var(--accent)]/40 transition-colors"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={candidate.photoUrl}
                      alt={candidate.name}
                      className="w-9 h-9 rounded object-cover border border-[var(--border)] shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center space-x-2">
                        <strong className="font-sans text-[var(--text)] font-bold text-xs truncate">
                          {candidate.name}
                        </strong>
                        <span className="font-mono text-[10px] text-[var(--accent)] font-semibold">
                          {candidate.candidateId}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                        {candidate.enrolledAt}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold uppercase shrink-0 ${
                      candidate.category === 'POI'
                        ? 'bg-[var(--accent)] text-black border-[var(--accent)]'
                        : candidate.category === 'VIP'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : candidate.category === 'STAFF'
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                        : 'bg-[var(--accent-danger)] text-white border-[var(--accent-danger)]'
                    }`}
                  >
                    {candidate.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
