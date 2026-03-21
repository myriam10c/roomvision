'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
    router.push('/projects')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleDelete} className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30">
          Confirmer
        </button>
        <button onClick={() => setConfirming(false)} className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-xs text-neutral-400 hover:bg-white/10">
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="rounded-lg border border-white/10 p-2 text-neutral-400 transition hover:border-red-500/30 hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
