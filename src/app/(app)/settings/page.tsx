'use client'

import { useEffect, useState } from 'react'
import { User, Save, LogOut } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'

export default function SettingsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('FREE')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => r.json())
      .then((data) => {
        setName(data.name || '')
        setEmail(data.email || '')
        setPlan(data.plan || 'FREE')
      })
      .catch(() => {})
  }, [])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/user/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Paramètres</h1>
        <p className="mt-1 text-sm text-neutral-400">Gérez votre profil et votre compte</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d4a574]/10">
            <User className="h-5 w-5 text-[#d4a574]" />
          </div>
          <div>
            <h2 className="font-medium text-white">Profil</h2>
            <p className="text-xs text-neutral-500">Plan {plan}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white outline-none transition focus:border-[#d4a574]/50"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-neutral-500 outline-none"
            />
            <p className="mt-1 text-xs text-neutral-600">L&apos;email ne peut pas être modifié</p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d4a574] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#e8c9a0] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Sauvegarde...' : saved ? 'Sauvegardé !' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-500/10 bg-red-500/[0.02] p-6">
        <h2 className="mb-2 font-medium text-white">Zone de danger</h2>
        <p className="mb-4 text-sm text-neutral-400">Se déconnecter de votre compte.</p>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
