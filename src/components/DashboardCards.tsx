import { ClipboardList, Clock, Hammer, CheckCircle2, TrendingUp } from 'lucide-react'
import type { Request } from '../types'

interface DashboardCardsProps {
  requests: Request[]
}

export default function DashboardCards({ requests }: DashboardCardsProps) {
  const total = requests.length
  const pendentes = requests.filter(r => r.status === 'pendente' || r.status === 'em_analise').length
  const emProducao = requests.filter(r => r.status === 'em_producao').length
  const finalizados = requests.filter(r => r.status === 'finalizado').length

  const cards = [
    {
      title: 'Total de Solicitações',
      subtitle: 'Pedidos registrados',
      value: total,
      icon: ClipboardList,
      bgIcon: 'bg-blue-50 dark:bg-blue-500/10',
      textColor: 'text-blue-600 dark:text-blue-400',
      change: '+3 esta semana',
      borderAccent: 'border-l-blue-500',
    },
    {
      title: 'Aguardando',
      subtitle: 'Pendentes ou em análise',
      value: pendentes,
      icon: Clock,
      bgIcon: 'bg-amber-50 dark:bg-amber-500/10',
      textColor: 'text-amber-600 dark:text-amber-400',
      change: '2 urgentes',
      borderAccent: 'border-l-amber-500',
    },
    {
      title: 'Em Produção',
      subtitle: 'Sendo fabricados',
      value: emProducao,
      icon: Hammer,
      bgIcon: 'bg-violet-50 dark:bg-violet-500/10',
      textColor: 'text-violet-600 dark:text-violet-400',
      change: 'Dentro do prazo',
      borderAccent: 'border-l-violet-500',
    },
    {
      title: 'Finalizados',
      subtitle: 'Concluídos com sucesso',
      value: finalizados,
      icon: CheckCircle2,
      bgIcon: 'bg-emerald-50 dark:bg-emerald-500/10',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      change: total > 0 ? `${Math.round((finalizados / total) * 100)}% do total` : '0%',
      borderAccent: 'border-l-emerald-500',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`card p-6 border-l-4 ${card.borderAccent} hover:shadow-md transition-all duration-200 cursor-default`}
        >
          {/* Icon + Title row */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`${card.bgIcon} p-2.5 rounded-xl`}>
              <card.icon className={`w-5 h-5 ${card.textColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{card.title}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{card.subtitle}</p>
            </div>
          </div>

          {/* Big number */}
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{card.value}</p>

          {/* Change */}
          <div className="mt-3 flex items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-dark-border">
            <TrendingUp className={`w-3.5 h-3.5 ${card.textColor}`} />
            <span className={`text-xs font-semibold ${card.textColor}`}>{card.change}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
