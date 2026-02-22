import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Package,
  Search,
  Filter,
  ShoppingCart,
  Wrench,
  HardHat,
  Boxes,
  MoreHorizontal,
  MapPin,
  User,
  Clock,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react'
import Header from '../components/Header'
import { mockSupplyOrders } from '../mock/mockSupplyOrders'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import type { SupplyOrderStatus, SupplyCategory } from '../types'

const statusConfig: Record<SupplyOrderStatus, { label: string; emoji: string; color: string; bg: string; dot: string }> = {
  pendente: {
    label: 'Pendente',
    emoji: '🟡',
    color: 'text-amber-700 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20',
    dot: 'bg-amber-500',
  },
  em_analise: {
    label: 'Em Análise',
    emoji: '🔵',
    color: 'text-blue-700 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20',
    dot: 'bg-blue-500',
  },
  aprovado: {
    label: 'Aprovado',
    emoji: '✅',
    color: 'text-emerald-700 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  comprado: {
    label: 'Comprado',
    emoji: '🛒',
    color: 'text-violet-700 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20',
    dot: 'bg-violet-500',
  },
  recusado: {
    label: 'Recusado',
    emoji: '❌',
    color: 'text-red-700 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20',
    dot: 'bg-red-500',
  },
}

const categoryConfig: Record<SupplyCategory, { label: string; icon: typeof Wrench; color: string }> = {
  ferramenta: { label: 'Ferramenta', icon: Wrench, color: 'text-blue-500' },
  insumo: { label: 'Insumo', icon: Boxes, color: 'text-amber-500' },
  epi: { label: 'EPI', icon: HardHat, color: 'text-emerald-500' },
  material: { label: 'Material', icon: Package, color: 'text-violet-500' },
  outros: { label: 'Outros', icon: MoreHorizontal, color: 'text-gray-500' },
}

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  baixa: { label: 'Baixa', color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-100 dark:bg-gray-500/10' },
  media: { label: 'Média', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  alta: { label: 'Alta', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10' },
  urgente: { label: 'Urgente', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' },
}

type FilterTab = 'todos' | SupplyOrderStatus

export default function Almoxarifado() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const [activeTab, setActiveTab] = useState<FilterTab>('todos')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const orders = mockSupplyOrders

  const filteredOrders = orders
    .filter(o => activeTab === 'todos' || o.status === activeTab)
    .filter(o => {
      if (!searchQuery) return true
      const q = searchQuery.toLowerCase()
      const project = mockProjects.find(p => p.id === o.projectId)
      const team = mockTeams.find(t => t.id === o.teamId)
      return (
        o.item.toLowerCase().includes(q) ||
        o.requestedBy.toLowerCase().includes(q) ||
        project?.name.toLowerCase().includes(q) ||
        team?.name.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Stats
  const pendingCount = orders.filter(o => o.status === 'pendente').length
  const analysingCount = orders.filter(o => o.status === 'em_analise').length
  const approvedCount = orders.filter(o => o.status === 'aprovado').length
  const purchasedCount = orders.filter(o => o.status === 'comprado').length

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'todos', label: 'Todos', count: orders.length },
    { key: 'pendente', label: 'Pendentes', count: pendingCount },
    { key: 'em_analise', label: 'Em Análise', count: analysingCount },
    { key: 'aprovado', label: 'Aprovados', count: approvedCount },
    { key: 'comprado', label: 'Comprados', count: purchasedCount },
    { key: 'recusado', label: 'Recusados', count: orders.filter(o => o.status === 'recusado').length },
  ]

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <Header title="Almoxarifado" subtitle="Ordens de compra de insumos e ferramentas" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pendentes</p>
              </div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{analysingCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Em Análise</p>
              </div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Aprovados</p>
              </div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{purchasedCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Comprados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por item, pessoa, equipe ou obra..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl text-sm
                         text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filtros:</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-hover border border-gray-200 dark:border-dark-border'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-xs font-bold ${
                activeTab === tab.key
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="space-y-3">
          {filteredOrders.length === 0 && (
            <div className="card p-12 text-center">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhuma ordem encontrada</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tente ajustar os filtros ou busca.</p>
            </div>
          )}

          {filteredOrders.map(order => {
            const project = mockProjects.find(p => p.id === order.projectId)
            const team = mockTeams.find(t => t.id === order.teamId)
            const sConfig = statusConfig[order.status]
            const catConfig = categoryConfig[order.category]
            const priConfig = priorityConfig[order.priority]
            const CatIcon = catConfig.icon
            const isExpanded = expandedOrder === order.id

            return (
              <div
                key={order.id}
                className="card overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Main row */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start sm:items-center gap-3 sm:gap-4"
                >
                  {/* Category icon */}
                  <div className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${
                    order.status === 'recusado' ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-dark-surface'
                  }`}>
                    {order.status === 'recusado' ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CatIcon className={`w-5 h-5 ${catConfig.color}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start sm:items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
                          {order.item}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <User className="w-3 h-3" />
                            {order.requestedBy}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {order.origin === 'producao' ? 'Produção' : 'Obra'}
                          </span>
                          {team && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {team.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className={`badge border text-[11px] sm:text-xs ${sConfig.bg} ${sConfig.color}`}>
                          {sConfig.emoji} {sConfig.label}
                        </span>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${priConfig.bg} ${priConfig.color}`}>
                          {priConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 mt-1 sm:mt-0 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-gray-100 dark:border-dark-border">
                    <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Obra</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{project?.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Equipe</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{team?.name || '—'}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Categoria</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{catConfig.label}</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Quantidade</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{order.quantity} {order.unit}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Motivo</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{order.reason}</p>
                        </div>
                        {order.estimatedCost !== undefined && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Custo Estimado</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {order.estimatedCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </p>
                          </div>
                        )}
                        {order.mediatorNotes && (
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">Observação do Mediador</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-dark-surface p-2.5 rounded-lg border border-gray-100 dark:border-dark-border">
                              {order.mediatorNotes}
                            </p>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-[11px] text-gray-400 dark:text-gray-500 pt-1">
                          <span>Criado: {formatDate(order.createdAt)}</span>
                          <span>Atualizado: {formatDate(order.updatedAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons (for mediators) */}
                    {(order.status === 'pendente' || order.status === 'em_analise') && (
                      <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                        {order.status === 'pendente' && (
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors active:scale-[0.98]">
                            <Eye className="w-4 h-4" />
                            Iniciar Análise
                          </button>
                        )}
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors active:scale-[0.98]">
                          <CheckCircle2 className="w-4 h-4" />
                          Aprovar Compra
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors active:scale-[0.98]">
                          <XCircle className="w-4 h-4" />
                          Recusar
                        </button>
                      </div>
                    )}

                    {order.status === 'aprovado' && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-dark-border">
                        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-violet-500 rounded-xl hover:bg-violet-600 shadow-md shadow-violet-500/25 transition-all active:scale-[0.98]">
                          <ShoppingCart className="w-4 h-4" />
                          Marcar como Comprado
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Warning note */}
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Fluxo de aprovação</p>
            <p className="text-xs text-amber-700/70 dark:text-amber-400/60 mt-0.5">
              Todas as ordens de compra passam por análise dos mediadores antes da compra ser realizada. Ordens urgentes são priorizadas automaticamente.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
