'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, FolderOpen, Search } from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string | null
  coverUrl: string | null
  createdAt: string
  _count: { rooms: number }
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { setProjects(data.projects || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-white">Mes projets</h1>
        <Link
          href="/projects/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d4a574] px-4 py-2.5 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
        >
          <Plus className="h-4 w-4" />
          Nouveau projet
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <input
          type="text"
          placeholder="Rechercher un projet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-[#d4a574]/50"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
              <div className="mb-3 aspect-video rounded-lg bg-white/[0.06]" />
              <div className="h-4 w-2/3 rounded bg-white/[0.06]" />
              <div className="mt-2 h-3 w-1/3 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-16">
          <FolderOpen className="mb-3 h-10 w-10 text-neutral-600" />
          <p className="text-sm text-neutral-400">
            {search ? 'Aucun projet trouvé' : 'Aucun projet pour l\'instant'}
          </p>
          {!search && (
            <Link
              href="/projects/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#d4a574] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#e8c9a0]"
            >
              <Plus className="h-4 w-4" />
              Créer un projet
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-[#d4a574]/30 hover:bg-white/[0.04]"
            >
              {project.coverUrl ? (
                <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                  <img src={project.coverUrl} alt={project.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                </div>
              ) : (
                <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-white/[0.04]">
                  <FolderOpen className="h-8 w-8 text-neutral-600" />
                </div>
              )}
              <h3 className="font-medium text-white group-hover:text-[#d4a574]">{project.name}</h3>
              <p className="mt-1 text-xs text-neutral-500">
                {project._count.rooms} pièce{project._count.rooms !== 1 ? 's' : ''}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
