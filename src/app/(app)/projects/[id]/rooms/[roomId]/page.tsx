export const dynamic = "force-dynamic"
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { BeforeAfterSlider } from './before-after-slider'

export default async function RoomDetailPage({ params }: { params: Promise<{ id: string; roomId: string }> }) {
  const { id: projectId, roomId } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const room = await prisma.room.findFirst({
    where: { id: roomId, projectId, project: { userId: user.id } },
    include: {
      project: true,
      generations: {
        orderBy: { createdAt: 'desc' },
        include: { variants: true },
      },
    },
  })

  if (!room) notFound()

  const dbUser = await prisma.user.findUnique({ where: { id: user.id }, select: { credits: true } })
  const completedGens = room.generations.filter((g) => g.status === 'COMPLETED')

  return (
    <div className="space-y-6">
      <Link href={`/projects/${projectId}`} className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {room.project.name}
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{room.name}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-neutral-400">
            {room.roomType && <span className="rounded bg-white/[0.06] px-2 py-0.5 text-xs">{room.roomType}</span>}
            <span>{completedGens.length} génération{completedGens.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <Link
          href={`/projects/${projectId}/rooms/${roomId}/generate`}
          className="inline-flex items-center gap-2 rounded-lg bg-[#d4a574] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
        >
          <Sparkles className="h-4 w-4" />
          Générer ({dbUser?.credits || 0} crédits)
        </Link>
      </div>

      {/* Original photo */}
      {room.photoUrl && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-neutral-300">Photo originale</h2>
          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <img src={room.photoUrl} alt="Original" className="w-full object-cover" style={{ maxHeight: '400px' }} />
          </div>
        </div>
      )}

      {/* Generations */}
      {completedGens.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16">
          <Sparkles className="mb-3 h-10 w-10 text-neutral-600" />
          <p className="text-sm text-neutral-400">Aucune génération pour cette pièce</p>
          <Link
            href={`/projects/${projectId}/rooms/${roomId}/generate`}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#d4a574] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
          >
            <Sparkles className="h-4 w-4" />
            Lancer une génération
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {completedGens.map((gen) => (
            <div key={gen.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  {gen.style && <span className="rounded bg-[#d4a574]/10 px-2 py-0.5 text-xs text-[#d4a574]">{gen.style}</span>}
                  {gen.prompt && <p className="mt-1 text-sm text-neutral-400">{gen.prompt}</p>}
                </div>
                <span className="text-xs text-neutral-500">
                  {new Date(gen.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              {room.photoUrl && gen.variants[0] ? (
                <BeforeAfterSlider before={room.photoUrl} after={gen.variants[0].imageUrl} />
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {gen.variants.map((v) => (
                    <div key={v.id} className="overflow-hidden rounded-lg">
                      <img src={v.imageUrl} alt="Variant" className="w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
