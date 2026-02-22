import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  History,
  Search,
  Filter,
  ClipboardList,
  ShoppingCart,
  Users,
  Building2,
  Paperclip,
  MessageSquare,
  Truck,
  ArrowUpDown,
  ChevronDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import Header from '../components/Header'
import { mockHistoryEvents } from '../mock/mockHistoryEvents'
import { mockProjects } from '../mock/mockProjects'
import type { HistoryEventType } from '../types'

/* ------------------------------------------------------------------ */
/*  Configs                                                           */
/* ------------------------------------------------------------------ */

const eventConfig: Record<HistoryEventType, { label: string; icon: typeof History; color: string; bg: string; ring: string }> = {
  solicitacao_criada:    { label: 'Solicitação criada',     icon: ClipboardList, color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-500/10',   ring: 'ring-blue-200 dark:ring-blue-500/30'   },
  solicitacao_status:    { label: 'Status de solicitação',  icon: ArrowUpDown,   color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', ring: 'ring-indigo-200 dark:ring-indigo-500/30' },
  solicitacao_prioridade:{ label: 'Prioridade alterada',    icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-500/10',  ring: 'ring-amber-200 dark:ring-amber-500/30'  },
  ordem_compra_criada:   { label: 'Ordem de compra',        icon: ShoppingCart,  color: 'text-emerald-500',bg: 'bg-emerald-50 dark:bg-emerald-500/10', ring: 'ring-emerald-200 dark:ring-emerald-500/30' },
  ordem_compra_status:   { label: 'Status de ordem',        icon: TrendingUp,    color: 'text-cyan-500',   bg: 'bg-cyan-50 dark:bg-cyan-500/10',    ring: 'ring-cyan-200 dark:ring-cyan-500/30'    },
  equipe_alocada:        { label: 'Equipe alocada',         icon: Users,         color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-500/10', ring: 'ring-violet-200 dark:ring-violet-500/30' },
  equipe_removida:       { label: 'Equipe removida',        icon: XCircle,       color: 'text-rose-500',   bg: 'bg-rose-50 dark:bg-rose-500/10',    ring: 'ring-rose-200 dark:ring-rose-500/30'    },
  obra_status:           { label: 'Status da obra',         icon: Building2,     color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', ring: 'ring-orange-200 dark:ring-orange-500/30' },
  anexo_adicionado:      { label: 'Anexo adicionado',       icon: Paperclip,     color: 'text-pink-500',   bg: 'bg-pink-50 dark:bg-pink-500/10',    ring: 'ring-pink-200 dark:ring-pink-500/30'    },
  comentario:            { label: 'Comentário',             icon: MessageSquare, color: 'text-gray-500',   bg: 'bg-gray-50 dark:bg-gray-500/10',    ring: 'ring-gray-200 dark:ring-gray-500/30'    },
  entrega_material:      { label: 'Entrega de material',    icon: Truck,         color: 'text-teal-500',   bg: 'bg-teal-50 dark:bg-teal-500/10',    ring: 'ring-teal-200 dark:ring-teal-500/30'    },
}

const allEventTypes: { value: HistoryEventType; label: string }[] = [
  { value: 'solicitacao_criada', label: 'Solicitação criada' },
  { value: 'solicitacao_status', label: 'Status de solicitação' },
  { value: 'solicitacao_prioridade', label: 'Prioridade alterada' },
  { value: 'ordem_compra_criada', label: 'Ordem de compra' },
  { value: 'ordem_compra_status', label: 'Status de ordem' },
  { value: 'equipe_alocada', label: 'Equipe alocada' },
  { value: 'equipe_removida', label: 'Equipe removida' },
  { value: 'obra_status', label: 'Status da obra' },
  { value: 'anexo_adicionado', label: 'Anexo adicionado' },
  { value: 'comentario', label: 'Comentário' },
  { value: 'entrega_material', label: 'Entrega de material' },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function dateKey(dateStr: string) {
  return dateStr.slice(0, 10) // YYYY-MM-DD
}

function relativeDay(key: string) {
  const today = new Date()
  const target = new Date(key + 'T00:00:00')
  const diff = Math.floor((today.getTime() - target.getTime()) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  return null
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Historico() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()

  const [search, setSearch] = useState('')
  const [projectFilter, setProjectFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter & sort
  const filtered = useMemo(() => {
    let events = [...mockHistoryEvents]

    if (projectFilter !== 'all') {
      events = events.filter((e) => e.projectId === projectFilter)
    }
    if (typeFilter !== 'all') {
      events = events.filter((e) => e.type === typeFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.actor.toLowerCase().includes(q)
      )
    }

    // Sort descending (newest first)
    events.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return events
  }, [search, projectFilter, typeFilter])

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const ev of filtered) {
      const key = dateKey(ev.createdAt)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(ev)
    }
    return [...map.entries()]
  }, [filtered])

  // Stats
  const todayCount = filtered.filter((e) => dateKey(e.createdAt) === dateKey(new Date().toISOString())).length
  const projectsInvolved = new Set(filtered.map((e) => e.projectId)).size

  return (
    <>
      <Header title="Histórico" subtitle="Linha do tempo das atividades" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        {/* Page header + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 dark:bg-orange-500/10 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {filtered.length} evento{filtered.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Registrados no sistema</p>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 sm:ml-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{todayCount} hoje</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-500/10 rounded-lg">
              <Building2 className="w-3.5 h-3.5 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">{projectsInvolved} obra{projectsInvolved !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar no histórico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-all active:scale-95 flex-shrink-0 ${
              showFilters || projectFilter !== 'all' || typeFilter !== 'all'
                ? 'border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-hover'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filtros</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expandable filters */}
        {showFilters && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8 p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Obra</label>
              <select
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="all">Todas as obras</option>
                {mockProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5">Tipo de evento</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="all">Todos os tipos</option>
                {allEventTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {(projectFilter !== 'all' || typeFilter !== 'all') && (
              <div className="flex items-end">
                <button
                  onClick={() => { setProjectFilter('all'); setTypeFilter('all') }}
                  className="px-3 py-2 text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {grouped.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-dark-surface rounded-2xl flex items-center justify-center">
              <History className="w-8 h-8 text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum evento encontrado</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          <div className="space-y-8 sm:space-y-10">
            {grouped.map(([key, events]) => {
              const relative = relativeDay(key)
              return (
                <div key={key}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-dark-surface rounded-lg">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 capitalize">
                        {relative ? `${relative} · ` : ''}{formatDate(events[0].createdAt)}
                      </span>
                    </div>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tabular-nums">
                      {events.length} evento{events.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Events timeline */}
                  <div className="relative ml-4 sm:ml-6">
                    {/* Vertical line */}
                    <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200 dark:bg-dark-border" />

                    <div className="space-y-1">
                      {events.map((ev, idx) => {
                        const cfg = eventConfig[ev.type]
                        const Icon = cfg.icon
                        const project = mockProjects.find((p) => p.id === ev.projectId)
                        const isLast = idx === events.length - 1

                        return (
                          <div key={ev.id} className="relative flex gap-3 sm:gap-4 group">
                            {/* Timeline dot */}
                            <div className="relative z-10 flex-shrink-0">
                              <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full ${cfg.bg} ring-2 ${cfg.ring} ring-offset-2 ring-offset-white dark:ring-offset-dark-bg flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${cfg.color}`} />
                              </div>
                            </div>

                            {/* Content card */}
                            <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-4 sm:pb-5'}`}>
                              <div className="bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl p-3 sm:p-4 hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 transition-all duration-200 group-hover:border-gray-200 dark:group-hover:border-dark-hover">
                                {/* Top row: title + time */}
                                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 mb-1.5">
                                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex-1 leading-tight">
                                    {ev.title}
                                  </h3>
                                  <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">
                                    {formatTime(ev.createdAt)}
                                  </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2.5">
                                  {ev.description}
                                </p>

                                {/* Footer: actor + project badge */}
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                                    <span className="w-5 h-5 rounded-full bg-gray-100 dark:bg-dark-surface flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
                                      {ev.actor.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </span>
                                    {ev.actor}
                                  </span>
                                  {project && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-gray-400">
                                      <Building2 className="w-3 h-3" />
                                      {project.name}
                                    </span>
                                  )}
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-md ${cfg.bg} ${cfg.color}`}>
                                    {cfg.label}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Bottom summary */}
        {grouped.length > 0 && (
          <div className="mt-8 sm:mt-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-surface rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Mostrando {filtered.length} de {mockHistoryEvents.length} eventos
              </span>
            </div>
          </div>
        )}
      </main>
    </>
  )
}
