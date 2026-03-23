'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Upload, Sparkles, Loader2, X, Layers, Wand2, SlidersHorizontal } from 'lucide-react'
import { STYLES } from '@/lib/utils'

type Step = 'upload' | 'style' | 'generating' | 'done'
type TransformationType = 'FAITHFUL' | 'CREATIVE'
type Intensity = 'LOW' | 'MEDIUM' | 'HIGH'

export default function GeneratePage() {
  const params = useParams()
  const projectId = params.id as string
  const roomId = params.roomId as string

  const [step, setStep] = useState<Step>('upload')
  const [roomPhoto, setRoomPhoto] = useState<string | null>(null)
  const [roomPhotoFile, setRoomPhotoFile] = useState<File | null>(null)
  const [moodboard, setMoodboard] = useState<string | null>(null)
  const [moodboardFile, setMoodboardFile] = useState<File | null>(null)
  const [references, setReferences] = useState<{ preview: string; file: File }[]>([])
  const [style, setStyle] = useState('')
  const [prompt, setPrompt] = useState('')
  const [transformationType, setTransformationType] = useState<TransformationType>('FAITHFUL')
  const [intensity, setIntensity] = useState<Intensity>('MEDIUM')
  const [error, setError] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [generationId, setGenerationId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const moodInputRef = useRef<HTMLInputElement>(null)
  const refInputRef = useRef<HTMLInputElement>(null)

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

  function handleRefUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, 4 - references.length)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        setReferences((prev) => [...prev, { preview: reader.result as string, file }])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeRef(index: number) {
    setReferences((prev) => prev.filter((_, i) => i !== index))
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
      references.forEach((ref, i) => formData.append(`reference_${i}`, ref.file))
      formData.append('style', style)
      formData.append('prompt', prompt)
      formData.append('roomId', roomId)
      formData.append('transformationType', transformationType)
      formData.append('intensity', intensity)

      const res = await fetch('/api/generate', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erreur de génération')

      setResult(data.imageUrl)
      setGenerationId(data.generationId)
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
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-[#d4a574]" />
          Nouvelle génération
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Uploadez une photo, choisissez un style, et laissez l&apos;IA transformer votre espace.
        </p>
      </div>

      {/* Step 1: Upload */}
      {(step === 'upload' || step === 'style') && (
        <div className="space-y-5">
          {/* Room photo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">Photo de la pièce *</label>
            {roomPhoto ? (
              <div className="relative">
                <img src={roomPhoto} alt="Room" className="w-full rounded-xl border border-white/10 object-cover" style={{ maxHeight: '300px' }} />
                <button
                  onClick={() => { setRoomPhoto(null); setRoomPhotoFile(null) }}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute left-2 top-2 rounded bg-black/60 px-2 py-0.5 text-xs text-neutral-300">
                  Photo originale
                </div>
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

          {/* Moodboard */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">Moodboard (optionnel)</label>
            {moodboard ? (
              <div className="relative inline-block">
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

          {/* Images de référence */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">
              Images de référence (optionnel)
            </label>
            <div className="flex flex-wrap gap-2">
              {references.map((ref, i) => (
                <div key={i} className="relative">
                  <img src={ref.preview} alt={`Ref ${i + 1}`} className="h-24 w-24 rounded-lg border border-white/10 object-cover" />
                  <button
                    onClick={() => removeRef(i)}
                    className="absolute -right-1 -top-1 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {references.length < 4 && (
                <button
                  onClick={() => refInputRef.current?.click()}
                  className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border border-dashed border-white/10 text-neutral-500 transition hover:border-[#d4a574]/30"
                >
                  <Upload className="h-4 w-4 mb-1" />
                  <span className="text-[10px]">Ajouter</span>
                </button>
              )}
            </div>
            <input ref={refInputRef} type="file" accept="image/*" multiple onChange={handleRefUpload} className="hidden" />
            <p className="mt-1 text-xs text-neutral-600">Photos d&apos;intérieurs qui illustrent le style désiré (max 4)</p>
          </div>

          {roomPhoto && step === 'upload' && (
            <button
              onClick={() => setStep('style')}
              className="w-full rounded-lg bg-[#d4a574] py-2.5 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
            >
              Continuer — Configurer la génération
            </button>
          )}
        </div>
      )}

      {/* Step 2: Style + options */}
      {step === 'style' && (
        <div className="space-y-6">
          {/* Style selection */}
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

          {/* Type de transformation */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">Type de transformation</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTransformationType('FAITHFUL')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  transformationType === 'FAITHFUL'
                    ? 'border-[#d4a574]/50 bg-[#d4a574]/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Layers className={`h-5 w-5 mb-1.5 ${transformationType === 'FAITHFUL' ? 'text-[#d4a574]' : 'text-neutral-500'}`} />
                <p className="text-sm font-medium text-neutral-200">Fidèle</p>
                <p className="text-xs text-neutral-500 mt-0.5">Conserve la structure exacte</p>
              </button>
              <button
                onClick={() => setTransformationType('CREATIVE')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  transformationType === 'CREATIVE'
                    ? 'border-[#d4a574]/50 bg-[#d4a574]/5'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <Sparkles className={`h-5 w-5 mb-1.5 ${transformationType === 'CREATIVE' ? 'text-[#d4a574]' : 'text-neutral-500'}`} />
                <p className="text-sm font-medium text-neutral-200">Créatif</p>
                <p className="text-xs text-neutral-500 mt-0.5">Réinterprétation plus libre</p>
              </button>
            </div>
          </div>

          {/* Intensité */}
          <div>
            <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-neutral-300">
              <SlidersHorizontal className="h-4 w-4" />
              Intensité de transformation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'LOW' as Intensity, label: 'Subtile', desc: 'Changements légers' },
                { value: 'MEDIUM' as Intensity, label: 'Modérée', desc: 'Équilibre idéal' },
                { value: 'HIGH' as Intensity, label: 'Maximale', desc: 'Transformation totale' },
              ]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setIntensity(opt.value)}
                  className={`rounded-lg border px-3 py-3 text-center transition ${
                    intensity === opt.value
                      ? 'border-[#d4a574] bg-[#d4a574]/10 text-[#d4a574]'
                      : 'border-white/10 text-neutral-400 hover:border-white/20'
                  }`}
                >
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">Instructions supplémentaires</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Ambiance chaleureuse avec du bois clair et des tons terre, garder les meubles existants..."
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder-neutral-500 outline-none focus:border-[#d4a574]/50 resize-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleGenerate}
            disabled={!style}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4a574] to-[#c49564] py-3.5 text-sm font-semibold text-black transition hover:from-[#e8c9a0] hover:to-[#d4a574] disabled:opacity-50 shadow-lg shadow-[#d4a574]/10"
          >
            <Wand2 className="h-4 w-4" />
            Générer le rendu (1 crédit)
          </button>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] py-20">
          <div className="relative mb-6">
            <div className="h-16 w-16 rounded-full border-2 border-neutral-800" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-[#d4a574] border-t-transparent animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-[#d4a574]" />
          </div>
          <p className="text-sm font-medium text-neutral-200">Génération en cours...</p>
          <p className="mt-1 text-xs text-neutral-600">L&apos;IA transforme votre espace (15-30s)</p>

          <div className="mt-6 space-y-1.5 text-xs text-neutral-600">
            <p className="text-[#d4a574]">✓ Analyse de la pièce source</p>
            <p className="text-[#d4a574]">✓ Extraction du style des références</p>
            <p className="animate-pulse">⟳ Génération du rendu {transformationType === 'FAITHFUL' ? 'fidèle' : 'créatif'}...</p>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 'done' && result && (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-[#d4a574]/20">
            <img src={result} alt="Result" className="w-full" />
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="px-2 py-0.5 bg-white/[0.04] rounded">{style}</span>
            <span className="px-2 py-0.5 bg-white/[0.04] rounded">
              {transformationType === 'FAITHFUL' ? 'Fidèle' : 'Créatif'}
            </span>
            <span className="px-2 py-0.5 bg-white/[0.04] rounded">
              {intensity === 'LOW' ? 'Subtile' : intensity === 'MEDIUM' ? 'Modérée' : 'Maximale'}
            </span>
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
