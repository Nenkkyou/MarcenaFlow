import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Carlos Mendes',
    role: 'Dono — Mendes Marcenaria',
    avatar: 'CM',
    color: 'from-blue-500 to-blue-600',
    quote: 'Antes do MarcenaFlow, a gente perdia solicitação em papel, WhatsApp e e-mail. Agora tudo está num lugar só. Economizamos 4 horas por dia.',
    rating: 5,
  },
  {
    name: 'Ana Paula Silva',
    role: 'Gerente de Produção — ArteMad',
    avatar: 'AP',
    color: 'from-violet-500 to-violet-600',
    quote: 'Minha equipe adorou. O sistema é tão simples que até o pessoal da fábrica que não mexe com computador consegue usar.',
    rating: 5,
  },
  {
    name: 'Roberto Almeida',
    role: 'Sócio — RA Móveis Planejados',
    avatar: 'RA',
    color: 'from-emerald-500 to-emerald-600',
    quote: 'O painel de obras é incrível. Vejo o progresso de cada projeto em tempo real, sem precisar ligar pra ninguém. Recomendo demais!',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="testimonials" className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-border to-transparent" />

      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-500/[0.04] dark:bg-violet-500/[0.02] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/50 dark:border-amber-500/20 rounded-full mb-5 sm:mb-6">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
            <span className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400">+200 marcenarias satisfeitas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Quem usa,
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent"> recomenda</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-2 sm:px-0">
            Veja o que nossos clientes dizem sobre a transformação na gestão da marcenaria.
          </p>
        </motion.div>

        {/* Testimonial cards */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.1 + index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-gray-100 dark:text-dark-border group-hover:text-blue-100 dark:group-hover:text-blue-500/20 transition-colors duration-300" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 relative">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-dark-border">
                <div className={`w-12 h-12 bg-gradient-to-br ${t.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <span className="text-sm font-bold text-white">{t.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
