import { 
  // fix encoding
  Upload,
  Palette,
  Sparkles,
  Camera,
  Clock,
  Users,
  Repeat,
  Check,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c9956b] flex items-center justify-center">
              <Camera className="w-4 h-4 text-[#0a0a0a]" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Room<span className="text-[#d4a574]">Vision</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <a href="#fonctionnalites" className="hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#comment-ca-marche" className="hover:text-white transition-colors">
              Comment ça marche
            </a>
            <a href="#tarifs" className="hover:text-white transition-colors">
              Tarifs
            </a>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2">
              Se connecter
            </button>
            <button className="text-sm bg-gradient-to-r from-[#d4a574] to-[#c9956b] text-[#0a0a0a] font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
              Essai gratuit
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Ambient glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#d4a574]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-[#d4a574]/3 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 text-[#d4a574] text-xs font-medium mb-8 tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Propulsé par l&apos;intelligence artificielle
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            Transformez vos espaces
            <br />
            <span className="bg-gradient-to-r from-[#d4a574] via-[#e8c9a0] to-[#c9956b] bg-clip-text text-transparent">
              avec l&apos;IA
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            De la photo au rendu réaliste en quelques secondes. L&apos;outil des
            designers d&apos;intérieur qui veulent impressionner leurs clients.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="group flex items-center gap-2 bg-gradient-to-r from-[#d4a574] to-[#c9956b] text-[#0a0a0a] font-semibold px-8 py-3.5 rounded-full text-base hover:opacity-90 transition-all hover:shadow-[0_0_40px_rgba(212,165,116,0.3)]">
              Essai gratuit — 14 jours
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="flex items-center gap-2 text-white/60 hover:text-white px-6 py-3.5 rounded-full border border-white/10 hover:border-white/20 transition-all text-base">
              Voir une démo
            </button>
          </div>

          {/* Mock Preview */}
          <div className="relative max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-white/10 bg-[#111] overflow-hidden shadow-2xl shadow-black/50">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="w-3 h-3 rounded-full bg-white/10" />
                <div className="flex-1 mx-8">
                  <div className="h-5 bg-white/5 rounded-md max-w-xs mx-auto" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6">
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center border border-white/5">
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <span className="text-xs text-white/30">Photo originale</span>
                  </div>
                </div>
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#d4a574]/10 to-[#d4a574]/[0.02] flex items-center justify-center border border-[#d4a574]/10">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-[#d4a574]/40 mx-auto mb-2" />
                    <span className="text-xs text-[#d4a574]/50">Rendu IA</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 bg-[#d4a574]/10 blur-2xl rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-white/5 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { value: "+2 000", label: "rendus générés", icon: Zap },
            { value: "98%", label: "de satisfaction client", icon: Star },
            { value: "30s", label: "par génération", icon: Clock },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-2">
              <stat.icon className="w-5 h-5 text-[#d4a574]/60 mb-1" />
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it Works */}
      <section id="comment-ca-marche" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#d4a574] text-sm font-medium tracking-widest uppercase mb-3">
              Comment ça marche
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Trois étapes. C&apos;est tout.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Upload,
                title: "Uploadez la photo",
                description:
                  "Prenez en photo ou importez l'image de la pièce que vous souhaitez transformer. Tout format accepté.",
              },
              {
                step: "02",
                icon: Palette,
                title: "Ajoutez vos références",
                description:
                  "Partagez votre moodboard, vos inspirations et le style désiré. L'IA comprend votre vision créative.",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Générez les rendus",
                description:
                  "L'IA génère des visualisations ultra-réalistes de votre projet. Itérez jusqu'à la perfection.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative p-8 rounded-2xl border border-white/5 bg-[#111]/50 hover:border-[#d4a574]/20 transition-all duration-500 hover:bg-[#111]"
              >
                <div className="absolute top-6 right-6 text-6xl font-bold text-white/[0.03] select-none">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#d4a574]/10 flex items-center justify-center mb-5 group-hover:bg-[#d4a574]/15 transition-colors">
                  <item.icon className="w-5 h-5 text-[#d4a574]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="fonctionnalites" className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#d4a574] text-sm font-medium tracking-widest uppercase mb-3">
              Pourquoi RoomVision
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Vos projets méritent le meilleur
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: Camera,
                title: "Projections ultra-réalistes",
                description:
                  "Des rendus photoréalistes que vos clients ne distingueront pas de vraies photos. Qualité studio, en quelques secondes.",
              },
              {
                icon: Clock,
                title: "Gain de temps ×10",
                description:
                  "Ce qui prenait des heures de modélisation 3D se fait maintenant en 30 secondes. Concentrez-vous sur la créativité.",
              },
              {
                icon: Users,
                title: "Impressionnez vos clients",
                description:
                  "Présentez des visualisations époustouflantes dès le premier rendez-vous. Augmentez votre taux de conversion.",
              },
              {
                icon: Repeat,
                title: "Itérations illimitées",
                description:
                  "Changez de style, de couleurs, de mobilier en un clic. Explorez toutes les possibilités sans contrainte.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="group flex gap-5 p-6 rounded-2xl border border-white/5 hover:border-[#d4a574]/15 transition-all duration-500 bg-[#0a0a0a] hover:bg-[#111]/80"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#d4a574]/10 flex items-center justify-center group-hover:bg-[#d4a574]/15 transition-colors">
                  <benefit.icon className="w-5 h-5 text-[#d4a574]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1.5">{benefit.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#d4a574] text-[#d4a574]" />
            ))}
          </div>
          <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed text-white/80 mb-6 max-w-3xl mx-auto">
            &ldquo;RoomVision a révolutionné ma façon de présenter les projets à mes
            clients. Les rendus sont bluffants et je gagne un temps fou.&rdquo;
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4a574] to-[#c9956b] flex items-center justify-center text-[#0a0a0a] text-sm font-bold">
              SL
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">Sophie Laurent</div>
              <div className="text-xs text-white/40">Architecte d&apos;intérieur, Paris</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="tarifs" className="py-24 px-6 bg-[#0d0d0d]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#d4a574] text-sm font-medium tracking-widest uppercase mb-3">
              Tarifs
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Choisissez votre plan
            </h2>
            <p className="text-white/40 text-base">
              14 jours d&apos;essai gratuit sur tous les plans. Sans engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "29",
                description: "Pour les designers indépendants",
                renders: "50 rendus / mois",
                features: [
                  "Résolution HD",
                  "5 styles prédéfinis",
                  "Export PNG & JPG",
                  "Support email",
                ],
                popular: false,
              },
              {
                name: "Pro",
                price: "79",
                description: "Pour les studios de design",
                renders: "200 rendus / mois",
                features: [
                  "Résolution 4K",
                  "Styles illimités",
                  "Export tous formats",
                  "Support prioritaire",
                  "API access",
                  "Moodboard intégré",
                ],
                popular: true,
              },
              {
                name: "Studio",
                price: "199",
                description: "Pour les agences & entreprises",
                renders: "Rendus illimités",
                features: [
                  "Résolution 8K",
                  "Styles personnalisés",
                  "White label",
                  "Support dédié 24/7",
                  "API illimitée",
                  "Collaboration équipe",
                  "Analytics avancés",
                ],
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-500 ${
                  plan.popular
                    ? "border-[#d4a574]/30 bg-[#111] shadow-[0_0_60px_-15px_rgba(212,165,116,0.15)]"
                    : "border-white/5 bg-[#0a0a0a] hover:border-white/10"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-[#d4a574] to-[#c9956b] text-[#0a0a0a] text-xs font-semibold rounded-full">
                    Le plus populaire
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/40">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}€</span>
                    <span className="text-white/40 text-sm">/mois</span>
                  </div>
                  <p className="text-sm text-[#d4a574]/70 mt-1.5">{plan.renders}</p>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-white/60">
                      <Check className="w-4 h-4 text-[#d4a574] flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-full text-sm font-semibold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#d4a574] to-[#c9956b] text-[#0a0a0a] hover:opacity-90 hover:shadow-[0_0_30px_rgba(212,165,116,0.2)]"
                      : "border border-white/10 text-white hover:border-[#d4a574]/30 hover:text-[#d4a574]"
                  }`}
                >
                  Commencer l&apos;essai gratuit
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#0a0a0a] to-[#0a0a0a]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#d4a574]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4a574]/20 bg-[#d4a574]/5 text-[#d4a574] text-xs font-medium mb-6">
            <Shield className="w-3.5 h-3.5" />
            14 jours gratuits — Sans carte bancaire
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Prêt à transformer
            <br />
            <span className="bg-gradient-to-r from-[#d4a574] to-[#c9956b] bg-clip-text text-transparent">
              votre workflow ?
            </span>
          </h2>
          <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">
            Rejoignez les designers qui ont déjà adopté RoomVision pour impressionner
            leurs clients.
          </p>
          <button className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#d4a574] to-[#c9956b] text-[#0a0a0a] font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 transition-all hover:shadow-[0_0_50px_rgba(212,165,116,0.3)]">
            Démarrer gratuitement
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 bg-[#0a0a0a]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#d4a574] to-[#c9956b] flex items-center justify-center">
                  <Camera className="w-3.5 h-3.5 text-[#0a0a0a]" />
                </div>
                <span className="text-base font-semibold">
                  Room<span className="text-[#d4a574]">Vision</span>
                </span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed">
                L&apos;IA au service du design d&apos;intérieur.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white/70">Produit</h4>
              <ul className="space-y-2.5 text-sm text-white/30">
                <li><a href="#" className="hover:text-white/60 transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Exemples</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white/70">Entreprise</h4>
              <ul className="space-y-2.5 text-sm text-white/30">
                <li><a href="#" className="hover:text-white/60 transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 text-white/70">Légal</h4>
              <ul className="space-y-2.5 text-sm text-white/30">
                <li><a href="#" className="hover:text-white/60 transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">CGU</a></li>
                <li><a href="#" className="hover:text-white/60 transition-colors">Mentions légales</a></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
            <p className="text.xs text-white/20">
              © 2026 RoomVision. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-white/20 hover:text-[#d4a574] transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/20 hover:text-[#d4a574] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/20 hover:text-[#d4a574] transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="text-white/20 hover:text-[#d4a574] transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
