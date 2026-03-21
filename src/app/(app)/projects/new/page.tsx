'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProjectPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return setError('Le nom est requis')

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      router.push(`/projects/${data.project.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Retour aux projets
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">Nouveau projet</h1>
        <p className="mt-1 text-sm text-neutral-400">Créez un projet pour organiser vos pièces et générations.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Nom du projet *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Appartement Paris 11e"
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#d4a574]/50"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-neutral-300">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description optionnelle..."
            rows={3}
            className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#d4a574]/50 resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#d4a574] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#e8c9a0] disabled:opacity-50"
        >
          {loading ? 'Création...' : 'Créer le projet'}
        </button>
      </form>
    </div>
  )
}
