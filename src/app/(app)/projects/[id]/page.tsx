export const dynamic = "force-dynamic"
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, DoorOpen } from 'lucide-react'
import { DeleteProjectButton } from './delete-button'
import { AddRoomForm } from './add-room-form'

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id },
    include: {
      rooms: {
        include: {
          generations: {
            where: { status: 'COMPLETED' },
            include: { variants: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: { select: { generations: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!project) notFound()

  return (
    <div className="space-y-6">
      <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Mes projets
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{project.name}</h1>
          {project.description && (
            <p className="mt-1 text-sm text-neutral-400">{project.description}</p>
          )}
        </div>
        <DeleteProjectButton projectId={project.id} />
      </div>

      {/* Add room */}
      <AddRoomForm projectId={project.id} />

      {/* Rooms grid */}
      {project.rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16">
          <DoorOpen className="mb-3 h-10 w-10 text-neutral-600" />
          <p className="text-sm text-neutral-400">Aucune pièce ajoutée</p>
          <p className="mt-1 text-xs text-neutral-500">Utilisez le formulaire ci-dessus pour ajouter votre première pièce.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {project.rooms.map((room) => {
            const lastGen = room.generations[0]
            const thumbnail = lastGen?.variants?.[0]?.imageUrl

            return (
              <Link
                key={room.id}
                href={`/projects/${project.id}/rooms/${room.id}`}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:border-[#d4a574]/30 hover:bg-white/[0.04]"
              >
                {thumbnail ? (
                  <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                    <img src={thumbnail} alt={room.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                ) : room.photoUrl ? (
                  <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                    <img src={room.photoUrl} alt={room.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                ) : (
                  <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-white/[0.04]">
                    <DoorOpen className="h-8 w-8 text-neutral-600" />
                  </div>
                )}
                <h3 className="font-medium text-white group-hover:text-[#d4a574]">{room.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-xs text-neutral-500">
                  {room.roomType && <span className="rounded bg-white/[0.06] px-2 py-0.5">{room.roomType}</span>}
                  <span>{room._count.generations} génération{room._count.generations !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
