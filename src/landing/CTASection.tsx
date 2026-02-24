import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Rocket } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-16 sm:py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Background card */}
          <div className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 rounded-2xl sm:rounded-3xl p-6 sm:p-16 lg:p-20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '32px 32px',
              }}
            />

            <div className="relative text-center max-w-3xl mx-auto">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-5 sm:mb-8 shadow-2xl shadow-blue-500/30"
              >
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </motion.div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Pronto para transformar
                <br />
                sua marcenaria?
              </h2>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-blue-100/70 max-w-xl mx-auto">
                Junte-se a mais de 200 marcenarias que já revolucionaram sua gestão.
                Comece grátis, sem compromisso.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/login"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-8 sm:py-4 text-base font-semibold text-navy-900 bg-white rounded-2xl hover:bg-gray-100 shadow-2xl shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  Começar Agora — É Grátis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-sm text-blue-200/50">
                  14 dias grátis • Sem cartão de crédito
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
