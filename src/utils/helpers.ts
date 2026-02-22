import type { Status, Priority } from '../types'

export const statusConfig: Record<Status, { label: string; emoji: string; color: string; bg: string; dot: string; description: string }> = {
  pendente: {
    label: 'Pendente',
    emoji: '🟡',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
    dot: 'bg-amber-500',
    description: 'Aguardando análise',
  },
  em_analise: {
    label: 'Em Análise',
    emoji: '🔵',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    dot: 'bg-blue-500',
    description: 'Sendo avaliado',
  },
  em_producao: {
    label: 'Em Produção',
    emoji: '🟣',
    color: 'text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20',
    dot: 'bg-violet-500',
    description: 'Sendo fabricado',
  },
  finalizado: {
    label: 'Finalizado',
    emoji: '🟢',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    dot: 'bg-emerald-500',
    description: 'Concluído',
  },
}

export const priorityConfig: Record<Priority, { label: string; emoji: string; color: string; bg: string }> = {
  baixa: {
    label: 'Baixa',
    emoji: '🔹',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-500/10',
  },
  media: {
    label: 'Média',
    emoji: '🔸',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
  },
  alta: {
    label: 'Alta',
    emoji: '🔶',
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
  },
  urgente: {
    label: 'Urgente',
    emoji: '🔴',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10',
  },
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `${days} dias atrás`
  return formatDate(dateString)
}

export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date()
}
