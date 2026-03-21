export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* ─── NAVBAR ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#b8895a] flex items-center justify-center">
              <svg className="w-4 h-4 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Room<span className="text-[#d4a574]">Vision</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#workflow" className="hover:text-white transition-colors">Comment ça marche</a>
            <a href="#benefits" className="hover:text-white transition-colors">Avantages</a>
            <a href="#pricing" className="hover:text-white transition-colors">Tarifs</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#pricing" className="hidden sm:inline-flex text-sm text-white/70 hover:text-white transition-colors">
              Connexion
            </a>
            <a
              href="#pricing"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-[#d4a574] text-[#0a0a0a] hover:bg-[#e8c9a0] transition-all duration-200"
            >
              Essai gratuit
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Background radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{background: 'radial-gradient(circle, rgba(212,165,116,0.08) 0%, transparent 70%)'}} />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 text-[#d4a574] text-xs font-medium tracking-wide uppercase mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4a574] animate-pulse" />
            Propulsé par l&apos;IA générative
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Transformez vos espaces
            <br />
            <span className="gradient-text">avec l&apos;IA</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-white/50 leading-relaxed mb-10">
            De la photo au rendu réaliste en quelques secondes.
            <br className="hidden sm:block" />
            Uploadez une pièce, ajoutez un moodboard — l&apos;IA fait le reste.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl bg-[#d4a574] text-[#0a0a0a] hover:bg-[#e8c9a0] transition-all duration-300 shadow-lg shadow-[#d4a574]/20 hover:shadow-[#d4a574]/30 hover:scale-[1.02] text-center"
            >
              Commencer gratuitement
            </a>
            <a
              href="#workflow"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all duration-300 text-center"
            >
              Voir la démo
            </a>
          </div>

          {/* Hero visual placeholder */}
          <div className="mt-16 sm:mt-20 relative">
            <div className="glow-amber rounded-2xl overflow-hidden border border-white/5">
              <div className="aspect-[16/9] bg-gradient-to-br from-[#111] via-[#151515] to-[#111] rounded-2xl flex items-center justify-center relative">
                <div className="absolute inset-4 sm:inset-8 rounded-xl border border-white/5 bg-[#0d0d0d] overflow-hidden">
                  <div className="h-10 border-b border-white/5 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <div className="ml-4 h-5 w-48 bg-white/5 rounded-md" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-4 sm:p-8">
                    <div className="relative aspect-[4/3] bg-[#1a1a1a] rounded-lg flex flex-col items-center justify-center border border-white/5">
                      <svg className="w-8 h-8 sm:w-12 sm:h-12 text-white/10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[10px] sm:text-xs text-white/20 font-medium">PHOTO ORIGINALE</span>
                    </div>
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#d4a574]/20 bg-gradient-to-br from-[#1a1510] to-[#14110d]">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-[#d4a574]/30 flex items-center justify-center mb-2">
                          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-[#d4a574]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                          </svg>
                        </div>
                        <span className="text-[10px] sm:text-xs text-[#d4a574]/60 font-medium">RENDU IA</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/30">
            <div className="flex -space-x-2">
              {[0,1,2,3,4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-[#0a0a0a]"
                  style={{ background: `hsl(${30 + i * 8}, 50%, ${35 + i * 5}%)` }}
                />
              ))}
            </div>
            <span>+2 400 designers et architectes nous font confiance</span>
          </div>
        </div>
      </section>

      {/* ─── LOGOS BAR ─── */}
      <section className="border-y border-white/5 py-8">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs text-white/20 uppercase tracking-widest mb-6">
            Ils utilisent RoomVision
          </p>
          <div className="flex items-center justify-center gap-10 sm:gap-16 opacity-20">
            {["Studio A", "Maison&Co", "ArchLab", "InteriorPro", "DesignHQ"].map(
              (name) => (
                <span key={name} className="text-sm sm:text-base font-medium tracking-wide whitespace-nowrap">
                  {name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ─── WORKFLOW ─── */}
      <section id="workflow" className="py-24 sm:py-32 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#d4a574] text-sm font-medium uppercase tracking-widest mb-4">
              Comment ça marche
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Trois étapes. Résultats époustouflants.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: "01",
                title: "Uploadez votre photo",
                description:
                  "Prenez une photo de la pièce à transformer. Salon, chambre, bureau — tout espace fonctionne.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                ),
              },
              {
                step: "02",
                title: "Décrivez votre vision",
                description:
                  "Ajoutez un moodboard, des références ou décrivez le style souhaité. L&apos;IA comprend votre intention.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                ),
              },
              {
                step: "03",
                title: "Recevez vos rendus",
                description:
                  "En quelques secondes, l&apos;IA génère des visualisations photoréalistes de votre espace transformé.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                  />
                ),
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-[#d4a574]/10 transition-all duration-500"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#d4a574]/10 flex items-center justify-center group-hover:bg-[#d4a574]/15 transition-colors duration-300">
                    <svg
                      className="w-5 h-5 text-[#d4a574]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      {item.icon}
                    </svg>
                  </div>
                  <span className="text-xs font-mono text-white/20 tracking-wider">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section id="benefits" className="py-24 sm:py-32 border-t border-white/5 relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl pointer-events-none" style={{background: 'radial-gradient(circle, rgba(212,165,116,0.05) 0%, transparent 70%)'}} />

        <div className="relative max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#d4a574] text-sm font-medium uppercase tracking-widest mb-4">
              Pourquoi RoomVision
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              L&apos;avantage compétitif des professionnels
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "10x plus rapide",
                description:
                  "Ce qui prenait des heures en 3D se fait maintenant en secondes. Proposez plus de variantes, plus vite.",
                metric: "< 30s",
                metricLabel: "par rendu",
              },
              {
                title: "Photoréalisme IA",
                description:
                  "Des rendus d&apos;une qualité suffisante pour convaincre vos clients. Textures, lumière, ombres — tout y est.",
                metric: "4K",
                metricLabel: "résolution",
              },
              {
                title: "Impressionnez vos clients",
                description:
                  "Montrez le résultat final avant même de commencer les travaux. Augmentez votre taux de conversion.",
                metric: "+68%",
                metricLabel: "conversion",
              },
              {
                title: "Multi-styles",
                description:
                  "Scandinave, industriel, bohème, classique... Explorez tous les styles en un clic pour chaque espace.",
                metric: "50+",
                metricLabel: "styles",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-[#d4a574]/10 transition-all duration-500 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                  <div className="text-right">
                    <p className="text-2xl font-bold gradient-text">
                      {benefit.metric}
                    </p>
                    <p className="text-xs text-white/30">{benefit.metricLabel}</p>
                  </div>
                </div>
                <p className="text-sm text-white/40 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 sm:py-32 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[#d4a574] text-sm font-medium uppercase tracking-widest mb-4">
              Tarifs
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              Choisissez votre plan
            </h2>
            <p className="text-white/40 text-lg">
              Commencez gratuitement, évoluez selon vos besoins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Starter",
                price: "0",
                period: "gratuit",
                description: "Pour découvrir RoomVision",
                features: [
                  "5 rendus / mois",
                  "Résolution standard",
                  "3 styles disponibles",
                  "Support communauté",
                ],
                cta: "Commencer gratuitement",
                popular: false,
              },
              {
                name: "Pro",
                price: "29",
                period: "/ mois",
                description: "Pour les professionnels",
                features: [
                  "100 rendus / mois",
                  "Résolution 4K",
                  "Tous les styles",
                  "Moodboard illimité",
                  "Export haute qualité",
                  "Support prioritaire",
                ],
                cta: "Essai gratuit 14 jours",
                popular: true,
              },
              {
                name: "Studio",
                price: "79",
                period: "/ mois",
                description: "Pour les agences et studios",
                features: [
                  "Rendus illimités",
                  "Résolution 4K+",
                  "Tous les styles",
                  "API & intégrations",
                  "Branding personnalisé",
                  "Manager de compte dédié",
                  "Facturation entreprise",
                ],
                cta: "Contacter l&apos;équipe",
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border transition-all duration-500 ${
                  plan.popular
                    ? "border-[#d4a574]/30 bg-[#d4a574]/[0.03] glow-amber scale-[1.02]"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#d4a574] text-[#0a0a0a] text-xs font-bold uppercase tracking-wider">
                    Populaire
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm text-white/30 mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-bold">{plan.price}€</span>
                  <span className="text-sm text-white/30">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-3 text-sm text-white/50"
                    >
                      <svg
                        className={`w-4 h-4 flex-shrink-0 ${
                          plan.popular ? "text-[#d4a574]" : "text-white/20"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-[#d4a574] text-[#0a0a0a] hover:bg-[#e8c9a0] shadow-lg shadow-[#d4a574]/20"
                      : "border border-white/10 text-white/70 hover:text-white hover:border-white/20"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 sm:py-32 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#d4a574]/[0.02] to-transparent pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
            Prêt à transformer vos espaces ?
          </h2>
          <p className="text-lg text-white/40 mb-10 max-w-xl mx-auto">
            Rejoignez des milliers de professionnels du design qui utilisent
            RoomVision pour impressionner leurs clients.
          </p>
          <a
            href="#pricing"
            className="inline-flex px-10 py-4 text-base font-semibold rounded-xl bg-[#d4a574] text-[#0a0a0a] hover:bg-[#e8c9a0] transition-all duration-300 shadow-lg shadow-[#d4a574]/20 hover:shadow-[#d4a574]/30 hover:scale-[1.02]"
          >
            Démarrer mon essai gratuit
          </a>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#d4a574] to-[#b8895a] flex items-center justify-center">
                <svg className="w-3 h-3 text-[#0a0a0a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">
                Room<span className="text-[#d4a574]">Vision</span>
              </span>
            </div>
            <div className="flex items-center gap-8 text-xs text-white/30">
              <a href="#" className="hover:text-white/60 transition-colors">Mentions légales</a>
              <a href="#" className="hover:text-white/60 transition-colors">Confidentialité</a>
              <a href="#" className="hover:text-white/60 transition-colors">Contact</a>
            </div>
            <p className="text-xs text-white/20">
              © 2026 RoomVision. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
