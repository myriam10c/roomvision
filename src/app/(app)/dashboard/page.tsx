export const dynamic = 'force-dynamic'
import { prisma } from '@/lib/prisma'
import { createSupabaseServer } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, FolderOpen, Sparkles, CreditCard, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      projects: {
        include: { rooms: true },
        orderBy: { updatedAt: 'desc' },
        take: 6,
      },
      generations: {
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 4,
        include: { variants: true, room: true },
      },
      _count: {
        select: {
          projects: true,
          generations: true,
          favorites: true,
        },
      },
    },
  })

  if (!dbUser) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        avatarUrl: user.user_metadata?.avatar_url || null,
      },
    })
    redirect('/dashboard')
  }

  const stats = [
    { label: 'Projets', value: dbUser._count.projects, icon: FolderOpen },
    { label: 'Générations', value: dbUser._count.generations, icon: Sparkles },
    { label: 'Crédits restants', value: dbUser.credits, icon: CreditCard },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Bonjour, {dbUser.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="mt-1 text-sm text-neutral-400">
            Voici un aperçu de votre activité
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#d4a574] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
        >
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d4a574]/10">
                <stat.icon className="h-5 w-5 text-[#d4a574]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-neutral-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Projects */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Projets récents</h2>
          <Link
            href="/projects"
            className="flex items-center gap-1 text-sm text-[#d4a574] hover:text-[#e8c9a0]"
          >
            Voir tous <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {dbUser.projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16">
            <FolderOpen className="mb-3 h-10 w-10 text-neutral-600" />
            <p className="text-sm text-neutral-400">Aucun projet pour l&apos;instant</p>
            <Link
              href="/projects/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#d4a574] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
            >
              <Plus className="h-4 w-4" />
              Créer un projet
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dbUser.projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-[#d4a574]/30 hover:bg-white/[0.04]"
              >
                {project.coverUrl ? (
                  <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                    <img
                      src={project.coverUrl}
                      alt={project.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-white/[0.04]">
                    <FolderOpen className="h-8 w-8 text-neutral-600" />
                  </div>
                )}
                <h3 className="font-medium text-white group-hover:text-[#d4a574]">
                  {project.name}
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  {project.rooms.length} pièce{project.rooms.length !== 1 ? 's' : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent Generations */}
      {dbUser.generations.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Dernières générations</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {dbUser.generations.map((gen) => (
              <Link
                key={gen.id}
                href={`/projects/${gen.room.projectId}/rooms/${gen.roomId}`}
                className="group overflow-hidden rounded-lg border border-white/[0.06]"
              >
                {gen.variants[0] ? (
                  <img
                    src={gen.variants[0].imageUrl}
                    alt={gen.prompt || 'Generation'}
                    className="aspect-square w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-white/[0.04]">
                    <Sparkles className="h-6 w-6 text-neutral-600" />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
