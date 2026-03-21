'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { ROOM_TYPES } from '@/lib/utils'

export function AddRoomForm({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [roomType, setRoomType] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    try {
      const res = await fetch(`/api/projects/${projectId}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), roomType: roomType || null }),
      })
      if (res.ok) {
        setName('')
        setRoomType('')
        setOpen(false)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-4 text-sm text-neutral-400 transition hover:border-[#d4a574]/30 hover:text-[#d4a574]"
      >
        <Plus className="h-4 w-4" />
        Ajouter une pièce
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom de la pièce"
          autoFocus
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#d4a574]/50"
        />
        <select
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-[#d4a574]/50"
        >
          <option value="">Type (optionnel)</option>
          {ROOM_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#d4a574] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e8c9a0] disabled:opacity-50"
          >
            {loading ? '...' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-white/[0.06] px-4 py-2 text-sm text-neutral-400 hover:bg-white/10"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  )
}
