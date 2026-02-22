import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ClipboardPlus, Settings, Truck, CheckCircle2 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: ClipboardPlus,
    title: 'Cadastre a Solicitação',
    description: 'A obra precisa de algo? Registre em segundos com formulário simples e intuitivo.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: '02',
    icon: Settings,
    title: 'Equipe Recebe e Produz',
    description: 'A equipe designada é notificada automaticamente e inicia a produção.',
    color: 'from-violet-500 to-violet-600',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Acompanhe a Entrega',
    description: 'Rastreie cada etapa em tempo real — da fábrica até a obra.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Obra Finalizada',
    description: 'Tudo entregue, registrado e documentado. Pronto para a próxima.',
    color: 'from-emerald-500 to-emerald-600',
  },
]

export default function HowItWorksSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="py-32 bg-gray-50/50 dark:bg-dark-surface/50 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 rounded-full mb-6">
            <Settings className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Simples e eficiente</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Como funciona?
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Em 4 passos simples, sua marcenaria sai do caos e entra na era digital.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={sectionRef} className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 -translate-y-1/2">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-0.5 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 origin-left mx-20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + index * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative group"
              >
                <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-8 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full">
                  {/* Step number */}
                  <div className="relative mx-auto mb-6">
                    <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-dark-card border-2 border-gray-200 dark:border-dark-border rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-xs font-bold text-gray-900 dark:text-white">{step.number}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
