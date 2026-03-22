export const dynamic = "force-dynamic"
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, avatarUrl: true, plan: true, credits: true },
  })

  // Auto-create user record if it doesn't exist yet (first login after signup)
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.user_metadata?.full_name || user.email!.split('@')[0],
        avatarUrl: user.user_metadata?.avatar_url || null,
        plan: 'FREE',
        credits: 3,
      },
      select: { id: true, email: true, name: true, avatarUrl: true, plan: true, credits: true },
    })
  }

  return NextResponse.json(dbUser)
}

export async function PATCH(req: Request) {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { ...(name !== undefined && { name }) },
    select: { id: true, email: true, name: true, avatarUrl: true, plan: true, credits: true },
  })

  return NextResponse.json(updated)
}
