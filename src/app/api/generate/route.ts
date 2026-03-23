export const dynamic = "force-dynamic"
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { deductCredits } from '@/lib/credits'
import { NextResponse } from 'next/server'
import { buildStructuredPrompt } from '@/lib/generation/prompt-builder'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent'

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: 'Gemini API key not configured' }, { status: 500 })
  }

  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check credits
  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { credits: true } })
  if (!dbUser || dbUser.credits < 1) {
    return NextResponse.json({ error: 'Crédits insuffisants' }, { status: 402 })
  }

  const formData = await req.formData()
  const roomPhoto = formData.get('roomPhoto') as File | null
  const moodboard = formData.get('moodboard') as File | null
  const style = formData.get('style') as string
  const prompt = formData.get('prompt') as string
  const roomId = formData.get('roomId') as string
  const transformationType = (formData.get('transformationType') as string) || 'FAITHFUL'
  const intensity = (formData.get('intensity') as string) || 'MEDIUM'

  // Collecter les images de référence supplémentaires
  const referenceFiles: File[] = []
  for (let i = 0; i < 4; i++) {
    const ref = formData.get(`reference_${i}`) as File | null
    if (ref) referenceFiles.push(ref)
  }

  if (!roomPhoto || !style || !roomId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify room belongs to user
  const room = await prisma.room.findFirst({
    where: { id: roomId, project: { userId: user.id } },
  })
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

  // Create generation record with new fields
  const generation = await prisma.generation.create({
    data: {
      style,
      prompt: prompt || null,
      status: 'PROCESSING',
      transformationType: transformationType as 'FAITHFUL' | 'CREATIVE',
      intensity: intensity as 'LOW' | 'MEDIUM' | 'HIGH',
      roomId,
      userId: user.id,
    },
  })

  const startTime = Date.now()

  try {
    // Upload room photo to Supabase Storage
    const photoBuffer = Buffer.from(await roomPhoto.arrayBuffer())
    const photoPath = `rooms/${roomId}/${generation.id}/photo.jpg`
    await supabase.storage.from('roomvision').upload(photoPath, photoBuffer, {
      contentType: roomPhoto.type,
      upsert: true,
    })
    const { data: photoUrlData } = supabase.storage.from('roomvision').getPublicUrl(photoPath)

    // Update room photo if not set
    if (!room.photoUrl) {
      await prisma.room.update({ where: { id: roomId }, data: { photoUrl: photoUrlData.publicUrl } })
    }

    // Upload moodboard if provided
    let moodboardUrl: string | null = null
    let moodboardB64: string | null = null
    if (moodboard) {
      const moodBuffer = Buffer.from(await moodboard.arrayBuffer())
      moodboardB64 = moodBuffer.toString('base64')
      const moodPath = `rooms/${roomId}/${generation.id}/moodboard.jpg`
      await supabase.storage.from('roomvision').upload(moodPath, moodBuffer, {
        contentType: moodboard.type,
        upsert: true,
      })
      const { data: moodUrlData } = supabase.storage.from('roomvision').getPublicUrl(moodPath)
      moodboardUrl = moodUrlData.publicUrl
    }

    // Build structured prompt using the prompt builder
    const structuredPrompt = buildStructuredPrompt({
      roomImageUrl: photoUrlData.publicUrl,
      referenceImageUrls: [],
      userPrompt: prompt,
      style,
      transformationType: transformationType as 'FAITHFUL' | 'CREATIVE',
      intensity: intensity as 'LOW' | 'MEDIUM' | 'HIGH',
      numVariants: 1,
      roomType: room.roomType || undefined,
    })

    // Build Gemini API request parts
    const parts: Array<Record<string, unknown>> = [
      { text: structuredPrompt },
      {
        inline_data: {
          mime_type: roomPhoto.type || 'image/jpeg',
          data: photoBuffer.toString('base64'),
        },
      },
    ]

    // Add moodboard as additional image if provided
    if (moodboardB64 && moodboard) {
      parts.push({
        text: 'This is the moodboard/inspiration image. Extract and faithfully reproduce the aesthetic, materials, colors, lighting, and atmosphere from this reference.',
      })
      parts.push({
        inline_data: {
          mime_type: moodboard.type || 'image/jpeg',
          data: moodboardB64,
        },
      })
    }

    // Add reference images
    for (const refFile of referenceFiles) {
      const refBuffer = Buffer.from(await refFile.arrayBuffer())
      parts.push({
        text: 'This is a style reference image. Extract the design language, materials, and atmosphere.',
      })
      parts.push({
        inline_data: {
          mime_type: refFile.type || 'image/jpeg',
          data: refBuffer.toString('base64'),
        },
      })
    }

    // Call Gemini API
    const geminiRes = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
          temperature: 0.8,
        },
      }),
    })

    if (!geminiRes.ok) {
      const errorData = await geminiRes.json().catch(() => ({}))
      console.error('Gemini API error:', geminiRes.status, errorData)
      throw new Error(`Gemini API returned ${geminiRes.status}`)
    }

    const geminiData = await geminiRes.json()

    // Extract generated image from response
    let imageB64: string | null = null
    let imageMimeType = 'image/png'

    const candidates = geminiData.candidates || []
    for (const candidate of candidates) {
      const content = candidate.content || {}
      const responseParts = content.parts || []
      for (const part of responseParts) {
        if (part.inline_data?.data) {
          imageB64 = part.inline_data.data
          imageMimeType = part.inline_data.mime_type || 'image/png'
          break
        }
      }
      if (imageB64) break
    }

    if (!imageB64) {
      throw new Error('No image returned from Gemini')
    }

    // Upload generated image to Supabase Storage
    const resultBuffer = Buffer.from(imageB64, 'base64')
    const ext = imageMimeType.includes('png') ? 'png' : 'jpg'
    const resultPath = `rooms/${roomId}/${generation.id}/result.${ext}`
    await supabase.storage.from('roomvision').upload(resultPath, resultBuffer, {
      contentType: imageMimeType,
      upsert: true,
    })
    const { data: resultUrlData } = supabase.storage.from('roomvision').getPublicUrl(resultPath)
    const generatedImageUrl = resultUrlData.publicUrl

    const processingTimeMs = Date.now() - startTime

    // Create variant and update generation
    await prisma.generationVariant.create({
      data: { imageUrl: generatedImageUrl, generationId: generation.id },
    })

    await prisma.generation.update({
      where: { id: generation.id },
      data: {
        status: 'COMPLETED',
        moodboardUrl,
        providerUsed: 'gemini',
        processingTimeMs,
      },
    })

    // Deduct credits
    await deductCredits(user.id, 1, `Generation ${generation.id}`)

    return NextResponse.json({ imageUrl: generatedImageUrl, generationId: generation.id })
  } catch (err) {
    console.error('Generation error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Unknown error'
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: 'FAILED', errorMessage },
    })
    return NextResponse.json({ error: 'La génération a échoué. Veuillez réessayer.' }, { status: 500 })
  }
}
