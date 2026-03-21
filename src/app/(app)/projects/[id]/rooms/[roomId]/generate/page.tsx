'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Sparkles, Loader2, X } from 'lucide-react'
import { STYLES } from '@/lib/utils'

type Step = 'upload' | 'style' | 'generating' | 'done'

export default function GeneratePage() {
  const params = useParams()
  const projectId = params.id as string
  const roomId = params.roomId as string

  const [step, setStep] = useState<Step>('upload')
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null)
  const [roomPhotoFile, setRoomPhotoFile] = useState<File | null>(null)
  const [moodboard, setMoodboard] = useState<string | null>(null)
  const [moodboardFile, setMoodboardFile] = useState<File | null>(null)
  const [style, setStyle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const moodInputRef = useRef<HTMLInputElement>(null)

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setRoomPhotoFile(file)
    const reader = new FileReader()
    reader.onload = () => setRoomPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  function handleMoodUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setMoodboardFile(file)
    const reader = new FileReader()
    reader.onload = () => setMoodboard(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleGenerate() {
    if (!roomPhotoFile) return setError('Veuillez uploader une photo de la pièce')
    if (!style) return setError('Veuillez choisir un style')

    setStep('generating')
    setError('')

    try {
      const formData = new FormData()
      formData.append('roomPhoto', roomPhotoFile)
      if (moodboardFile) formData.append('moodboard', moodboardFile)
      formData.append('style', style)
      formData.append('prompt', prompt)
      formData.append('roomId', roomId)

      const res = await fetch('/api/generate', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur de génération')

      setResult(data.imageUrl)
      setStep('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
      setStep('style')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href={`/projects/${projectId}/rooms/${roomId}`}
        className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> Retour à la pièce
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-white">Nouvelle génération</h1>
        <p className="mt-1 text-sm text-neutral-400">Uploadez une photo, choisissez un style, et laissez l&apos;IA transformer votre espace.</p>
      </div>

      {/* Step 1: Upload */}
      {(step === 'upload' || step === 'style') && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">Photo de la pièce *</label>
            {roomPhoto ? (
              <div className="relative">
                <img src={roomPhoto} alt="Room" className="w-full rounded-xl border border-white/10 object-cover" style={{ maxHeight: '300px' }} />
                <button
                  onClick={() => { setRoomPhoto(null); setRoomPhotoFile(null) }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 transition hover:border-[#d4a574]/30"
              >
                <Upload className="mb-2 h-8 w-8 text-neutral-500" />
                <span className="text-sm text-neutral-400">Cliquez pour uploader</span>
                <span className="mt-1 text-xs text-neutral-600">JPG, PNG — max 10MB</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">Moodboard (optionnel)</label>
            {moodboard ? (
              <div className="relative">
                <img src={moodboard} alt="Moodboard" className="h-32 rounded-lg border border-white/10 object-cover" />
                <button
                  onClick={() => { setMoodboard(null); setMoodboardFile(null) }}
                  className="absolute -right-1 -top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => moodInputRef.current?.click()}
                className="flex items-center gap-2 rounded-lg border border-dashed border-white/10 px-4 py-3 text-sm text-neutral-400 transition hover:border-[#d4a574]/30"
              >
                <Upload className="h-4 w-4" /> Ajouter un moodboard
              </button>
            )}
            <input ref={moodInputRef} type="file" accept="image/*" onChange={handleMoodUpload} className="hidden" />
          </div>

          {roomPhoto && step === 'upload' && (
            <button
              onClick={() => setStep('style')}
              className="w-full rounded-lg bg-[#d4a574] py-2.5 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
            >
              Continuer — Choisir le style
            </button>
          )}
        </div>
      )}

      {/* Step 2: Style selection */}
      {step === 'style' && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">Style de design *</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded-lg border px-3 py-2.5 text-sm transition ${
                    style === s
                      ? 'border-[#d4a574] bg-[#d4a574]/10 text-[#d4a574]'
                      : 'border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Instructions supplémentaires</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Ajouter des plantes vertes, garder les meubles existants..."
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#d4a574]/50 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={!style}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#d4a574] py-3 text-sm font-medium text-black transition hover:bg-[#e8c9a0] disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Générer (1 crédit)
          </button>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-20">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-[#d4a574]" />
          <p className="text-sm text-neutral-400">Génération en cours...</p>
          <p className="mt-1 text-xs text-neutral-600">Cela peut prendre 15-30 secondes</p>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 'done' && result && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-[#d4a574]/20">
            <img src={result} alt="Result" className="w-full" />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setStep('style'); setResult(null) }}
              className="flex-1 rounded-lg border border-white/10 py-2.5 text-sm text-neutral-300 transition hover:bg-white/[0.04]"
            >
              Régénérer
            </button>
            <Link
              href={`/projects/${projectId}/rooms/${roomId}`}
              className="flex-1 rounded-lg bg-[#d4a574] py-2.5 text-center text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
            >
              Voir la pièce
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
