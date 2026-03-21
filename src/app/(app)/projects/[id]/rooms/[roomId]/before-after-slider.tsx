'use client'

import { useState, useRef, useCallback } from 'react'

export function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const [position, setPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width))
    setPosition((x / rect.width) * 100)
  }, [])

  const handleMouseDown = () => { dragging.current = true }
  const handleMouseUp = () => { dragging.current = false }
  const handleMouseMove = (e: React.MouseEvent) => { if (dragging.current) updatePosition(e.clientX) }
  const handleTouchMove = (e: React.TouchEvent) => { updatePosition(e.touches[0].clientX) }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video cursor-col-resize select-none overflow-hidden rounded-xl"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* After (full) */}
      <img src={after} alt="After" className="absolute inset-0 h-full w-full object-cover" />

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={before} alt="Before" className="h-full w-full object-cover" style={{ width: `${containerRef.current?.offsetWidth || 9999}px`, maxWidth: 'none' }} />
      </div>

      {/* Slider line */}
      <div className="absolute top-0 bottom-0" style={{ left: `${position}%`, transform: 'translateX(-50%)' }}>
        <div className="h-full w-0.5 bg-white/80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black/50 backdrop-blur-sm">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 3L2 8L5 13M11 3L14 8L11 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute left-3 top-3 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
        Avant
      </div>
      <div className="absolute right-3 top-3 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
        Après
      </div>
    </div>
  )
}
