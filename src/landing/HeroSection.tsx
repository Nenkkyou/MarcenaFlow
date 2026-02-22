import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-[128px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
            Novo: Painel de controle em tempo real
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.05]"
        >
          <span className="text-gray-900 dark:text-white">Gestão de</span>
          <br />
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
            Marcenaria
          </span>
          <br />
          <span className="text-gray-900 dark:text-white">Inteligente</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-8 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
        >
          Controle obras, equipes e solicitações em um único lugar.
          <br className="hidden sm:block" />
          O sistema operacional completo para sua marcenaria crescer.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/app"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-gray-200 dark:border-dark-border rounded-2xl hover:bg-white dark:hover:bg-dark-card hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5">
            <div className="w-8 h-8 bg-gray-100 dark:bg-dark-hover rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
              <Play className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors ml-0.5" />
            </div>
            Ver Demonstração
          </button>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          {/* Glow behind */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60" />

          {/* Mock dashboard */}
          <div className="relative bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="max-w-sm mx-auto h-7 bg-white dark:bg-dark-bg rounded-lg border border-gray-200 dark:border-dark-border flex items-center px-3">
                  <span className="text-xs text-gray-400">app.marcenaflow.com</span>
                </div>
              </div>
            </div>

            {/* Dashboard content mock */}
            <div className="p-6 sm:p-8">
              <div className="flex gap-6">
                {/* Sidebar mock */}
                <div className="hidden sm:block w-48 shrink-0 space-y-3">
                  <div className="h-8 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg w-full" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-3/4" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-5/6" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-2/3" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-4/5" />
                </div>

                {/* Main content */}
                <div className="flex-1 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { color: 'bg-blue-500', w: 'w-2/3' },
                      { color: 'bg-emerald-500', w: 'w-1/2' },
                      { color: 'bg-amber-500', w: 'w-3/4' },
                      { color: 'bg-violet-500', w: 'w-1/3' },
                    ].map((card, i) => (
                      <div key={i} className="p-4 bg-gray-50 dark:bg-dark-hover rounded-xl">
                        <div className={`h-2 ${card.color} rounded-full ${card.w} mb-3`} />
                        <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-1/2 mb-1" />
                        <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded w-3/4" />
                      </div>
                    ))}
                  </div>

                  {/* Chart area */}
                  <div className="h-32 lg:h-44 bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-dark-hover dark:to-blue-500/5 rounded-xl border border-gray-100 dark:border-dark-border flex items-end justify-around pb-4 px-4">
                    {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 1.2 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[6%] bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-md"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-20 pb-10"
        >
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-6">
            Confiado por mais de 200+ marcenarias no Brasil
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40 dark:opacity-30">
            {['MóveisArt', 'WoodMaster', 'DesignMarca', 'CasaFina', 'ArteMad'].map((name) => (
              <span key={name} className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
