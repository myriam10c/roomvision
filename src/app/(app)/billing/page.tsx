'use client'

import { useEffect, useState } from 'react'
import { Check, CreditCard, Zap, Crown, Sparkles } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    plan: 'STARTER',
    price: '29€',
    credits: 30,
    icon: Zap,
    features: ['30 générations/mois', 'Résolution HD', 'Support email', '5 projets max'],
  },
  {
    name: 'Pro',
    plan: 'PRO',
    price: '79€',
    credits: 100,
    icon: Crown,
    popular: true,
    features: ['100 générations/mois', 'Résolution 4K', 'Support prioritaire', 'Projets illimités', 'Styles premium'],
  },
  {
    name: 'Studio',
    plan: 'STUDIO',
    price: '199€',
    credits: 500,
    icon: Sparkles,
    features: ['500 générations/mois', 'Résolution 4K', 'Support dédié', 'Projets illimités', 'Styles premium', 'API access'],
  },
]

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('FREE')
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/user/me')
      .then((r) => r.json())
      .then((data) => {
        setCurrentPlan(data.plan || 'FREE')
        setCredits(data.credits || 0)
      })
      .catch(() => {})
  }, [])

  async function handleSubscribe(plan: string) {
    setLoading(plan)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(null)
    }
  }

  async function handleManage() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Abonnement</h1>
        <p className="mt-1 text-sm text-neutral-400">Gérez votre plan et vos crédits</p>
      </div>

      {/* Current plan */}
      <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#d4a574]/10">
            <CreditCard className="h-6 w-6 text-[#d4a574]" />
          </div>
          <div>
            <p className="font-medium text-white">Plan {currentPlan}</p>
            <p className="text-sm text-neutral-400">{credits} crédits restants</p>
          </div>
        </div>
        {currentPlan !== 'FREE' && (
          <button
            onClick={handleManage}
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:bg-white/[0.04]"
          >
            Gérer l&apos;abonnement
          </button>
        )}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.plan}
            className={`relative rounded-xl border p-6 ${
              p.popular
                ? 'border-[#d4a574]/40 bg-[#d4a574]/5'
                : 'border-white/[0.06] bg-white/[0.02]'
            }`}
          >
            {p.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d4a574] px-3 py-0.5 text-xs font-medium text-black">
                Populaire
              </div>
            )}
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${p.popular ? 'bg-[#d4a574]/20' : 'bg-white/[0.06]'}`}>
                <p.icon className={`h-5 w-5 ${p.popular ? 'text-[#d4a574]' : 'text-neutral-400'}`} />
              </div>
              <div>
                <h3 className="font-semibold text-white">{p.name}</h3>
                <p className="text-2xl font-bold text-white">{p.price}<span className="text-sm font-normal text-neutral-400">/mois</span></p>
              </div>
            </div>

            <ul className="mb-6 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-neutral-300">
                  <Check className="h-3.5 w-3.5 text-[#d4a574]" />
                  {f}
                </li>
              ))}
            </ul>

            {currentPlan === p.plan ? (
              <div className="rounded-lg border border-[#d4a574]/30 py-2.5 text-center text-sm font-medium text-[#d4a574]">
                Plan actuel
              </div>
            ) : (
              <button
                onClick={() => handleSubscribe(p.plan)}
                disabled={loading === p.plan}
                className={`w-full rounded-lg py-2.5 text-sm font-medium transition ${
                  p.popular
                    ? 'bg-[#d4a574] text-black hover:bg-[#e8c9a0]'
                    : 'bg-white/[0.06] text-white hover:bg-white/10'
                } disabled:opacity-50`}
              >
                {loading === p.plan ? 'Redirection...' : 'Choisir ce plan'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
