export const dynamic = "force-dynamic"
export const maxDuration = 60

import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { deductCredits } from '@/lib/credits'
import { NextResponse } from 'next/server'
import { buildStructuredPrompt } from '@/lib/generation/prompt-builder'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'
const OPENAI_API_URL = 'https://api.openai.com/v1/images/edits'

// --- Provider: OpenAI (gpt-image-1) ---
async function generateWithOpenAI(
  photoBuffer: Buffer, photoMimeType: string,
  moodboardBuffer: Buffer | null, moodboardMimeType: string | null,
  referenceBuffers: { buffer: Buffer; mimeType: string }[],
  structuredPrompt: string,
): Promise<{ imageB64: string; mimeType: string }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_SKIP: no API key configured')

  const formData = new FormData()
  formData.append('model', 'gpt-image-1')
  formData.append('prompt', structuredPrompt)
  formData.append('size', '1024x1024')
  formData.append('quality', 'low')

  const photoBlob = new Blob([photoBuffer], { type: photoMimeType || 'image/jpeg' })
  formData.append('image', photoBlob, 'room.jpg')

  if (moodboardBuffer) {
    const moodBlob = new Blob([moodboardBuffer], { type: moodboardMimeType || 'image/jpeg' })
    formData.append('image', moodBlob, 'moodboard.jpg')
  }

  for (let i = 0; i < referenceBuffers.length && i < 4; i++) {
    const ref = referenceBuffers[i]
    const refBlob = new Blob([ref.buffer], { type: ref.mimeType || 'image/jpeg' })
    formData.append('image', refBlob, `ref_${i}.jpg`)
  }

  console.log('[generate] Calling OpenAI gpt-image-1...')
  const res = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: formData,
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '{}')
    console.error('[generate] OpenAI error:', res.status, errBody)
    throw new Error(`OPENAI_ERR: ${res.status} ${errBody.substring(0, 200)}`)
  }

  const data = await res.json()
  const b64 = data?.data?.[0]?.b64_json
  if (!b64) throw new Error('OPENAI_ERR: no image in response')
  return { imageB64: b64, mimeType: 'image/png' }
}

// --- Provider: Gemini (gemini-2.5-flash-image) ---
async function generateWithGemini(
  photoBuffer: Buffer, photoMimeType: string,
  moodboardBuffer: Buffer | null, moodboardMimeType: string | null,
  referenceBuffers: { buffer: Buffer; mimeType: string }[],
  structuredPrompt: string,
): Promise<{ imageB64: string; mimeType: string }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_SKIP: no API key configured')

  const parts: Array<Record<string, unknown>> = [
    { text: structuredPrompt },
    { inline_data: { mime_type: photoMimeType || 'image/jpeg', data: photoBuffer.toString('base64') } },
  ]

  if (moodboardBuffer) {
    parts.push({ text: 'This is the moodboard / inspiration image.' })
    parts.push({ inline_data: { mime_type: moodboardMimeType || 'image/jpeg', data: moodboardBuffer.toString('base64') } })
  }

  for (const ref of referenceBuffers) {
    parts.push({ text: 'This is a style reference image.' })
    parts.push({ inline_data: { mime_type: ref.mimeType || 'image/jpeg', data: ref.buffer.toString('base64') } })
  }

  console.log('[generate] Calling Gemini...')
  const geminiRes = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { responseModalities: ['TEXT', 'IMAGE'], temperature: 0.8 },
    }),
  })

  if (!geminiRes.ok) {
    const errText = await geminiRes.text().catch(() => '{}')
    console.error('[generate] Gemini error:', geminiRes.status, errText)
    if (errText.includes('quota') || errText.includes('RESOURCE_EXHAUSTED')) {
      throw new Error(`GEMINI_QUOTA: ${geminiRes.status}`)
    }
    throw new Error(`GEMINI_ERR: ${geminiRes.status} ${errText.substring(0, 200)}`)
  }

  const geminiData = await geminiRes.json()
  let imageB64: string | null = null
  let imageMimeType = 'image/png'

  for (const candidate of geminiData.candidates || []) {
    for (const part of candidate.content?.parts || []) {
      if (part.inline_data?.data) {
        imageB64 = part.inline_data.data
        imageMimeType = part.inline_data.mime_type || 'image/png'
        break
      }
    }
    if (imageB64) break
  }

  if (!imageB64) throw new Error('GEMINI_ERR: no image found in response')
  return { imageB64, mimeType: imageMimeType }
}

// --- Main POST handler ---
export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Check credits (model is User, not Profile)
    const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { credits: true } })
    if (!dbUser || dbUser.credits < 1) {
      return NextResponse.json({ error: 'Credits insuffisants' }, { status: 403 })
    }

    // Parse form data
    const formData = await req.formData()
    const roomId = formData.get('roomId') as string
    const style = formData.get('style') as string || 'modern'
    const colorPalette = formData.get('colorPalette') as string || ''
    const instructions = formData.get('instructions') as string || ''
    const photo = formData.get('photo') as File | null
    const moodboard = formData.get('moodboard') as File | null

    if (!roomId) return NextResponse.json({ error: 'roomId is required' }, { status: 400 })

    // Verify room belongs to user
    const room = await prisma.room.findFirst({
      where: { id: roomId, project: { userId: user.id } },
      include: { project: true },
    })
    if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

    // Create generation record (match schema: status enum, userId required, prompt field)
    const generation = await prisma.generation.create({
      data: {
        roomId,
        userId: user.id,
        style,
        prompt: instructions || null,
        status: 'PROCESSING',
      },
    })

    // Upload original photo to Supabase Storage
    let photoBuffer: Buffer
    let photoMimeType: string

    if (photo) {
      const arrayBuf = await photo.arrayBuffer()
      photoBuffer = Buffer.from(arrayBuf)
      photoMimeType = photo.type || 'image/jpeg'

      const photoPath = `${user.id}/${roomId}/original_${Date.now()}.jpg`
      await supabase.storage.from('roomvision').upload(photoPath, photoBuffer, {
        contentType: photoMimeType, upsert: true,
      })

      // Update room with photo path if not set
      if (!room.photoUrl) {
        await prisma.room.update({ where: { id: roomId }, data: { photoUrl: photoPath } })
      }
    } else if (room.photoUrl) {
      const { data: existingPhoto } = await supabase.storage.from('roomvision').download(room.photoUrl)
      if (!existingPhoto) return NextResponse.json({ error: 'Could not load room photo' }, { status: 400 })
      photoBuffer = Buffer.from(await existingPhoto.arrayBuffer())
      photoMimeType = 'image/jpeg'
    } else {
      await prisma.generation.update({ where: { id: generation.id }, data: { status: 'FAILED' } })
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 })
    }

    // Moodboard (optional)
    let moodboardBuffer: Buffer | null = null
    let moodboardMimeType: string | null = null
    if (moodboard) {
      moodboardBuffer = Buffer.from(await moodboard.arrayBuffer())
      moodboardMimeType = moodboard.type || 'image/jpeg'
    }

    // Reference images
    const referenceBuffers: { buffer: Buffer; mimeType: string }[] = []
    for (let i = 0; i < 5; i++) {
      const ref = formData.get(`reference_${i}`) as File | null
      if (ref) {
        referenceBuffers.push({
          buffer: Buffer.from(await ref.arrayBuffer()),
          mimeType: ref.type || 'image/jpeg',
        })
      }
    }

    // Build prompt
    const structuredPrompt = buildStructuredPrompt({
      style,
      roomType: room.roomType || 'room',
      colorPalette: colorPalette || undefined,
      instructions: instructions || undefined,
    })

    console.log('[generate] Starting generation for room', roomId, 'style:', style)

    // --- Try providers in order: OpenAI -> Gemini ---
    let imageB64: string | null = null
    let imageMimeType = 'image/png'
    let providerUsed = ''
    let lastError: Error | null = null

    const providers = [
      { name: 'openai', fn: generateWithOpenAI },
      { name: 'gemini', fn: generateWithGemini },
    ]

    for (const provider of providers) {
      try {
        console.log(`[generate] Trying provider: ${provider.name}`)
        const result = await provider.fn(
          photoBuffer, photoMimeType,
          moodboardBuffer, moodboardMimeType,
          referenceBuffers,
          structuredPrompt,
        )
        imageB64 = result.imageB64
        imageMimeType = result.mimeType
        providerUsed = provider.name
        console.log(`[generate] Success with ${provider.name}`)
        break
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        console.warn(`[generate] ${provider.name} failed: ${msg}`)
        lastError = err instanceof Error ? err : new Error(msg)
        continue
      }
    }

    if (!imageB64) {
      await prisma.generation.update({ where: { id: generation.id }, data: { status: 'FAILED', errorMessage: lastError?.message || 'All providers failed' } })
      return NextResponse.json({ error: 'La generation a echoue.', detail: lastError?.message }, { status: 502 })
    }

    // Upload generated image to Supabase
    const resultBuffer = Buffer.from(imageB64, 'base64')
    const ext = imageMimeType.includes('png') ? 'png' : 'jpg'
    const resultPath = `${user.id}/${roomId}/gen_${generation.id}.${ext}`

    const { error: uploadError } = await supabase.storage.from('roomvision')
      .upload(resultPath, resultBuffer, { contentType: imageMimeType, upsert: true })

    if (uploadError) {
      console.error('[generate] Upload error:', uploadError)
      await prisma.generation.update({ where: { id: generation.id }, data: { status: 'FAILED' } })
      return NextResponse.json({ error: 'Failed to upload generated image' }, { status: 500 })
    }

    // Create variant record (model is GenerationVariant, not Variant)
    const variant = await prisma.generationVariant.create({
      data: {
        generationId: generation.id,
        imageUrl: resultPath,
      },
    })

    // Update generation status
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: 'COMPLETED', providerUsed },
    })

    // Deduct credits
    await deductCredits(user.id, 1)

    // Public URL
    const { data: { publicUrl } } = supabase.storage.from('roomvision').getPublicUrl(resultPath)

    return NextResponse.json({
      success: true,
      generation: {
        id: generation.id,
        status: 'COMPLETED',
        provider: providerUsed,
        variant: { id: variant.id, imageUrl: publicUrl },
      },
    })

  } catch (error: unknown) {
    console.error('[generate] Unexpected error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Internal server error', detail: message }, { status: 500 })
  }
}
