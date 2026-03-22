export const dynamic = "force-dynamic"
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { deductCredits } from '@/lib/credits'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
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

  if (!roomPhoto || !style || !roomId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify room belongs to user
  const room = await prisma.room.findFirst({
    where: { id: roomId, project: { userId: user.id } },
  })
  if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 })

  // Create generation record
  const generation = await prisma.generation.create({
    data: {
      style,
      prompt: prompt || null,
      status: 'PROCESSING',
      roomId,
      userId: user.id,
    },
  })

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
    if (moodboard) {
      const moodBuffer = Buffer.from(await moodboard.arrayBuffer())
      const moodPath = `rooms/${roomId}/${generation.id}/moodboard.jpg`
      await supabase.storage.from('roomvision').upload(moodPath, moodBuffer, {
        contentType: moodboard.type,
        upsert: true,
      })
      const { data: moodUrlData } = supabase.storage.from('roomvision').getPublicUrl(moodPath)
      moodboardUrl = moodUrlData.publicUrl
    }

    // Build the prompt for OpenAI
    const systemPrompt = `You are an expert interior designer. Transform the given room photo into a ${style} style design. ${prompt ? `Additional instructions: ${prompt}` : ''} ${moodboardUrl ? 'Use the moodboard as inspiration for colors and materials.' : ''} Keep the same room layout and dimensions. Make it photorealistic.`

    // Call OpenAI GPT Image-1 (gpt-image-1 or dall-e-3 as fallback)
    const openaiRes = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: (() => {
        const fd = new FormData()
        fd.append('image', new Blob([photoBuffer], { type: roomPhoto.type }), 'room.jpg')
        fd.append('prompt', systemPrompt)
        fd.append('model', 'gpt-image-1')
        fd.append('n', '1')
        fd.append('size', '1024x1024')
        return fd
      })(),
    })

    if (!openaiRes.ok) {
      // Fallback to DALL-E 3 generation (without image edit)
      const fallbackRes = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: `Interior design render of a room in ${style} style. ${prompt || ''} Photorealistic, high quality, professional interior design photography.`,
          n: 1,
          size: '1024x1024',
          quality: 'hd',
        }),
      })

      if (!fallbackRes.ok) {
        throw new Error('Image generation failed')
      }

      const fallbackData = await fallbackRes.json()
      const generatedImageUrl = fallbackData.data[0]?.url || fallbackData.data[0]?.b64_json

      if (!generatedImageUrl) throw new Error('No image returned')

      // Download and store the generated image
      const imgRes = await fetch(generatedImageUrl)
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
      const resultPath = `rooms/${roomId}/${generation.id}/result.jpg`
      await supabase.storage.from('roomvision').upload(resultPath, imgBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })
      const { data: resultUrlData } = supabase.storage.from('roomvision').getPublicUrl(resultPath)

      // Create variant and update generation
      await prisma.generationVariant.create({
        data: { imageUrl: resultUrlData.publicUrl, generationId: generation.id },
      })

      await prisma.generation.update({
        where: { id: generation.id },
        data: { status: 'COMPLETED', moodboardUrl },
      })

      // Deduct credits
      await deductCredits(user.id, 1, `Generation ${generation.id}`)

      return NextResponse.json({ imageUrl: resultUrlData.publicUrl, generationId: generation.id })
    }

    const openaiData = await openaiRes.json()
    let generatedImageUrl = openaiData.data?.[0]?.url

    // Handle b64_json response
    if (!generatedImageUrl && openaiData.data?.[0]?.b64_json) {
      const b64Buffer = Buffer.from(openaiData.data[0].b64_json, 'base64')
      const resultPath = `rooms/${roomId}/${generation.id}/result.jpg`
      await supabase.storage.from('roomvision').upload(resultPath, b64Buffer, {
        contentType: 'image/png',
        upsert: true,
      })
      const { data: resultUrlData } = supabase.storage.from('roomvision').getPublicUrl(resultPath)
      generatedImageUrl = resultUrlData.publicUrl
    } else if (generatedImageUrl) {
      // Download and store
      const imgRes = await fetch(generatedImageUrl)
      const imgBuffer = Buffer.from(await imgRes.arrayBuffer())
      const resultPath = `rooms/${roomId}/${generation.id}/result.jpg`
      await supabase.storage.from('roomvision').upload(resultPath, imgBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      })
      const { data: resultUrlData } = supabase.storage.from('roomvision').getPublicUrl(resultPath)
      generatedImageUrl = resultUrlData.publicUrl
    }

    if (!generatedImageUrl) throw new Error('No image returned')

    // Create variant
    await prisma.generationVariant.create({
      data: { imageUrl: generatedImageUrl, generationId: generation.id },
    })

    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: 'COMPLETED', moodboardUrl },
    })

    // Deduct credits
    await deductCredits(user.id, 1, `Generation ${generation.id}`)

    return NextResponse.json({ imageUrl: generatedImageUrl, generationId: generation.id })
  } catch (err) {
    console.error('Generation error:', err)
    await prisma.generation.update({
      where: { id: generation.id },
      data: { status: 'FAILED' },
    })
    return NextResponse.json({ error: 'La génération a échoué. Veuillez réessayer.' }, { status: 500 })
  }
}
