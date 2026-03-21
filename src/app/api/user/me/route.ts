export const dynamic = "force-dynamic"
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, avatarUrl: true, plan: true, credits: true },
  })

  if (!dbUser) return NextResponse.json({ error: 'Not found' }, { status: 404 })
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
