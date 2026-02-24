import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  ClipboardList,
  BarChart3,
  Users,
  Building2,
  Bell,
  Shield,
  Zap,
  Clock,
  TrendingUp,
} from 'lucide-react'

const features = [
  {
    icon: ClipboardList,
    title: 'Solicitações Organizadas',
    description: 'Cada pedido de material, corte ou serviço rastreado do início ao fim. Nada se perde.',
    color: 'from-blue-500 to-blue-600',
    shadowColor: 'shadow-blue-500/20',
  },
  {
    icon: Building2,
    title: 'Controle de Obras',
    description: 'Acompanhe cada projeto ativo com progresso em tempo real, prazos e status detalhado.',
    color: 'from-violet-500 to-violet-600',
    shadowColor: 'shadow-violet-500/20',
  },
  {
    icon: Users,
    title: 'Gestão de Equipes',
    description: 'Distribua tarefas, acompanhe a carga de trabalho e veja quem está disponível.',
    color: 'from-emerald-500 to-emerald-600',
    shadowColor: 'shadow-emerald-500/20',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Inteligente',
    description: 'Visão geral completa da operação em um único painel com métricas que importam.',
    color: 'from-amber-500 to-orange-500',
    shadowColor: 'shadow-amber-500/20',
  },
  {
    icon: Bell,
    title: 'Alertas em Tempo Real',
    description: 'Notificações automáticas para prazos, atrasos e mudanças de status.',
    color: 'from-rose-500 to-pink-600',
    shadowColor: 'shadow-rose-500/20',
  },
  {
    icon: Shield,
    title: 'Segurança Total',
    description: 'Dados criptografados, backups automáticos e controle de acesso por nível.',
    color: 'from-cyan-500 to-teal-500',
    shadowColor: 'shadow-cyan-500/20',
  },
]

const highlights = [
  { icon: Zap, value: '10x', label: 'Mais rápido que planilhas' },
  { icon: Clock, value: '3h/dia', label: 'Economizadas em média' },
  { icon: TrendingUp, value: '47%', label: 'Aumento de produtividade' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function FeaturesSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const statsRef = useRef(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-50px' })

  return (
    <section id="features" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-blue-500/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200/50 dark:border-violet-500/20 rounded-full mb-5 sm:mb-6">
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-500" />
            <span className="text-xs sm:text-sm font-medium text-violet-700 dark:text-violet-400">Tudo que você precisa</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Funcionalidades que
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              transformam seu negócio
            </span>
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2 sm:px-0">
            Cada recurso foi pensado para simplificar a rotina da sua marcenaria
            e eliminar o caos de planilhas e papéis.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          ref={sectionRef}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 sm:p-8 hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] rounded-2xl transition-opacity duration-500`} />

              <div className={`relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${feature.color} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg ${feature.shadowColor} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="relative text-lg font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="relative text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats highlight */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mt-8 sm:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {highlights.map((stat) => (
            <div
              key={stat.label}
              className="relative group text-center p-5 sm:p-8 bg-gradient-to-br from-gray-50 to-white dark:from-dark-card dark:to-dark-surface rounded-2xl border border-gray-100 dark:border-dark-border hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent mb-2">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
