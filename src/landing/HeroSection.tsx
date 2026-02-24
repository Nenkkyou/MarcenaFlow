import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles, BarChart3, ClipboardList, Users, CheckCircle } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-10">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-blue-500/20 rounded-full blur-[80px] sm:blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-violet-500/20 rounded-full blur-[80px] sm:blur-[128px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[128px]" />

        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 rounded-full mb-6 sm:mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
          <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400">
            Novo: Painel em tempo real
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[2.5rem] leading-[1.1] sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight sm:leading-[1.05]"
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
          className="mt-5 sm:mt-8 text-base sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2"
        >
          Controle obras, equipes e solicitações em um único lugar.
          <span className="hidden sm:inline"><br />O sistema operacional completo para sua marcenaria crescer.</span>
          <span className="sm:hidden"> O sistema completo para sua marcenaria.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0"
        >
          <Link
            to="/login"
            className="group w-full sm:w-auto relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl hover:from-blue-600 hover:to-blue-700 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Começar Gratuitamente
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 text-base font-semibold text-gray-700 dark:text-gray-300 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-gray-200 dark:border-dark-border rounded-2xl hover:bg-white dark:hover:bg-dark-card hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]">
            <div className="w-8 h-8 bg-gray-100 dark:bg-dark-hover rounded-full flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
              <Play className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 group-hover:text-blue-500 transition-colors ml-0.5" />
            </div>
            Ver Demonstração
          </button>
        </motion.div>

        {/* Feature pills — mobile only, replaces the heavy mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 sm:hidden flex flex-wrap justify-center gap-2.5 px-2"
        >
          {[
            { icon: ClipboardList, label: 'Solicitações' },
            { icon: BarChart3, label: 'Dashboard' },
            { icon: Users, label: 'Equipes' },
            { icon: CheckCircle, label: 'Progresso' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-gray-200 dark:border-dark-border rounded-xl shadow-sm">
              <item.icon className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Dashboard preview — desktop/tablet only */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 relative mx-auto max-w-5xl hidden sm:block"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-60" />

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

            <div className="p-8">
              <div className="flex gap-6">
                <div className="hidden md:block w-48 shrink-0 space-y-3">
                  <div className="h-8 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg w-full" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-3/4" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-5/6" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-2/3" />
                  <div className="h-6 bg-gray-100 dark:bg-dark-hover rounded-lg w-4/5" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-4 gap-3">
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

                  <div className="h-44 bg-gradient-to-br from-gray-50 to-blue-50/50 dark:from-dark-hover dark:to-blue-500/5 rounded-xl border border-gray-100 dark:border-dark-border flex items-end justify-around pb-4 px-4">
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
          transition={{ duration: 1, delay: 1.3 }}
          className="mt-10 sm:mt-20 pb-6 sm:pb-10"
        >
          <p className="text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-500 mb-4 sm:mb-6">
            Confiado por mais de 200+ marcenarias no Brasil
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-3 opacity-40 dark:opacity-30">
            {['MóveisArt', 'WoodMaster', 'DesignMarca', 'CasaFina', 'ArteMad'].map((name) => (
              <span key={name} className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
