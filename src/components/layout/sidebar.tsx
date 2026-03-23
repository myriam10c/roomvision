'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, FolderOpen, Settings, CreditCard, LogOut, BookOpen } from 'lucide-react'
import { createSupabaseBrowser } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projets', icon: FolderOpen },
  { href: '/recipes', label: 'Recettes', icon: BookOpen },
  { href: '/billing', label: 'Abonnement', icon: CreditCard },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [credits, setCredits] = useState(0)
  const [plan, setPlan] = useState('FREE')

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => r.json())
      .then((data) => {
        setCredits(data.credits || 0)
        setPlan(data.plan || 'FREE')
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-64 border-r border-white/5 bg-[#0a0a0a] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#b8895a] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
          <span className="text-lg font-bold">Room<span className="text-[#d4a574]">Vision</span></span>
        </Link>
      </div>

      {/* Credits */}
      <div className="px-4 py-4">
        <div className="px-3 py-3 rounded-xl bg-[#d4a574]/5 border border-[#d4a574]/10">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[#d4a574] font-medium uppercase tracking-wider">Crédits</span>
            <span className="text-xs text-white/30">{plan}</span>
          </div>
          <p className="text-2xl font-bold text-white">{credits}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white/5 text-white'
                  : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              )}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/30 hover:text-white/60 hover:bg-white/[0.03] transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
