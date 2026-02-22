import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Check, Crown, Sparkles, Building2 } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    description: 'Para marcenarias começando a se organizar',
    price: '97',
    icon: Sparkles,
    color: 'from-gray-600 to-gray-700',
    borderColor: 'border-gray-200 dark:border-dark-border',
    popular: false,
    features: [
      'Até 3 obras ativas',
      '1 equipe',
      '50 solicitações/mês',
      'Dashboard básico',
      'Suporte por email',
    ],
  },
  {
    name: 'Profissional',
    description: 'O mais popular para marcenarias em crescimento',
    price: '197',
    icon: Crown,
    color: 'from-blue-500 to-violet-600',
    borderColor: 'border-blue-300 dark:border-blue-500/40',
    popular: true,
    features: [
      'Obras ilimitadas',
      'Equipes ilimitadas',
      'Solicitações ilimitadas',
      'Dashboard completo com gráficos',
      'Alertas em tempo real',
      'Relatórios avançados',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Para grandes operações e múltiplas unidades',
    price: '397',
    icon: Building2,
    color: 'from-violet-600 to-purple-700',
    borderColor: 'border-gray-200 dark:border-dark-border',
    popular: false,
    features: [
      'Tudo do Profissional',
      'Múltiplas unidades',
      'API de integração',
      'SSO / Login corporativo',
      'Gerente de conta dedicado',
      'SLA de 99.9%',
      'Treinamento personalizado',
    ],
  },
]

export default function PricingSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="pricing" className="py-32 bg-gray-50/50 dark:bg-dark-surface/50 relative overflow-hidden">
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200/50 dark:border-blue-500/20 rounded-full mb-6">
            <Crown className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Preços transparentes</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Planos que cabem
            <br />
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">
              no seu bolso
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comece grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.1 + index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative bg-white dark:bg-dark-card rounded-2xl border-2 ${plan.borderColor} p-8 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular ? 'md:-mt-4 md:mb-0 shadow-xl' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/25">
                    MAIS POPULAR
                  </div>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-8">
                <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center shadow-lg mb-4`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">R$</span>
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/mês</span>
                </div>
              </div>

              {/* CTA */}
              <Link
                to="/app"
                className={`block w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 mb-8 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:from-blue-600 hover:to-blue-700'
                    : 'bg-gray-100 dark:bg-dark-hover text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-surface'
                }`}
              >
                Começar Teste Grátis
              </Link>

              {/* Features list */}
              <ul className="space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      plan.popular
                        ? 'bg-blue-50 dark:bg-blue-500/10'
                        : 'bg-gray-100 dark:bg-dark-hover'
                    }`}>
                      <Check className={`w-3 h-3 ${
                        plan.popular ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                      }`} />
                    </div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
