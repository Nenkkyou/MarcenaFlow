import { useState } from 'react'
import {
  ArrowRight,
  Clock,
  AlertTriangle,
  Zap,
  ClipboardList,
  Hammer,
  CheckCircle2,
  Building2,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  Eye,
} from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import { statusConfig, priorityConfig, formatDate, isOverdue } from '../utils/helpers'
import type { Status, Request } from '../types'

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests } = useApp()

  const [alertExpanded, setAlertExpanded] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const urgentRequests = requests.filter(
    r => r.priority === 'urgente' && r.status !== 'finalizado'
  )
  const pendingRequests = requests.filter(r => r.status === 'pendente')

  const statusCounts: Record<Status, number> = {
    pendente: pendingRequests.length,
    em_analise: requests.filter(r => r.status === 'em_analise').length,
    em_producao: requests.filter(r => r.status === 'em_producao').length,
    finalizado: requests.filter(r => r.status === 'finalizado').length,
  }

  const total = requests.length

  return (
    <>
      <Header title="Painel Geral" subtitle="Acompanhe tudo em um só lugar" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8 space-y-5 sm:space-y-6">

        {/* ============================================================ */}
        {/*  Welcome banner — clickable to expand urgent/pending detail   */}
        {/* ============================================================ */}
        <div className="card bg-gradient-to-br from-navy-800 to-navy-700 dark:from-dark-card dark:to-dark-surface border-0 overflow-hidden relative">
          <button
            onClick={() => setAlertExpanded(!alertExpanded)}
            className="w-full text-left p-4 sm:p-6 cursor-pointer"
          >
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Bom dia, Eduardo! 👋</h2>
                <p className="text-sm text-blue-200 dark:text-gray-400 mt-1">
                  Você tem{' '}
                  <span className="font-bold text-white underline decoration-red-400 decoration-2 underline-offset-2">
                    {urgentRequests.length} solicitações urgentes
                  </span>{' '}
                  e{' '}
                  <span className="font-bold text-white underline decoration-amber-400 decoration-2 underline-offset-2">
                    {statusCounts.pendente} pendentes
                  </span>{' '}
                  para hoje.
                </p>
                <p className="text-xs text-blue-300/60 dark:text-gray-500 mt-2 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {alertExpanded ? 'Clique para recolher' : 'Clique para ver detalhes'}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {alertExpanded
                  ? <ChevronUp className="w-5 h-5 text-blue-200" />
                  : <ChevronDown className="w-5 h-5 text-blue-200" />
                }
              </div>
            </div>
          </button>

          {/* Expanded detail panel */}
          {alertExpanded && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4 border-t border-white/10">
              {/* Urgent section */}
              {urgentRequests.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-red-300 mt-4 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Urgentes ({urgentRequests.length})
                  </p>
                  <div className="space-y-2">
                    {urgentRequests.map(req => {
                      const project = mockProjects.find(p => p.id === req.projectId)
                      const team = mockTeams.find(t => t.id === req.teamId)
                      const overdue = isOverdue(req.deadline) && req.status !== 'finalizado'
                      return (
                        <button
                          key={req.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedRequest(req) }}
                          className="w-full text-left flex items-start gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0 mt-1.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{req.type}</p>
                            <p className="text-xs text-red-200/70 mt-0.5">{req.description}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-blue-200/60">
                              {project && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{project.name}</span>}
                              {team && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{team.name}</span>}
                              <span className={`flex items-center gap-1 ${overdue ? 'text-red-300 font-bold' : ''}`}>
                                <Calendar className="w-3 h-3" />{formatDate(req.deadline)}{overdue && ' · ATRASADO'}
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-red-300 flex-shrink-0 mt-1" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Pending section */}
              {pendingRequests.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mt-2 mb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Pendentes ({pendingRequests.length})
                  </p>
                  <div className="space-y-2">
                    {pendingRequests.map(req => {
                      const project = mockProjects.find(p => p.id === req.projectId)
                      return (
                        <button
                          key={req.id}
                          onClick={(e) => { e.stopPropagation(); setSelectedRequest(req) }}
                          className="w-full text-left flex items-center gap-3 p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/20 rounded-xl transition-colors cursor-pointer"
                        >
                          <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{req.type}</p>
                            <p className="text-xs text-amber-200/60">{project?.name} · {formatDate(req.deadline)}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-amber-300 flex-shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="absolute right-6 top-6 opacity-[0.06] pointer-events-none">
            <Zap className="w-16 h-16 sm:w-28 sm:h-28 text-white" />
          </div>
        </div>

        {/* ============================================================ */}
        {/*  KPI row — clean, minimal                                     */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link to="/app/solicitacoes" className="card p-4 hover:ring-2 hover:ring-blue-500/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{total}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Solicitações</p>
              </div>
            </div>
          </Link>

          <Link to="/app/solicitacoes" className="card p-4 hover:ring-2 hover:ring-amber-500/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.pendente + statusCounts.em_analise}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Aguardando</p>
              </div>
            </div>
          </Link>

          <Link to="/app/solicitacoes" className="card p-4 hover:ring-2 hover:ring-violet-500/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                <Hammer className="w-5 h-5 text-violet-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.em_producao}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Produção</p>
              </div>
            </div>
          </Link>

          <Link to="/app/solicitacoes" className="card p-4 hover:ring-2 hover:ring-emerald-500/30 transition-all group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.finalizado}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Finalizados</p>
              </div>
            </div>
          </Link>
        </div>

        {/* ============================================================ */}
        {/*  Status bars — compact horizontal                             */}
        {/* ============================================================ */}
        {total > 0 && (
          <div className="card p-4 sm:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Distribuição dos pedidos</p>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              {(Object.keys(statusCounts) as Status[]).map(s => {
                const pct = (statusCounts[s] / total) * 100
                if (pct === 0) return null
                return (
                  <div
                    key={s}
                    className={`${statusConfig[s].dot} transition-all duration-700 first:rounded-l-full last:rounded-r-full`}
                    style={{ width: `${pct}%` }}
                    title={`${statusConfig[s].label}: ${statusCounts[s]}`}
                  />
                )
              })}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
              {(Object.keys(statusCounts) as Status[]).map(s => (
                <div key={s} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className={`w-2 h-2 rounded-full ${statusConfig[s].dot}`} />
                  <span>{statusConfig[s].label}</span>
                  <span className="font-bold text-gray-700 dark:text-gray-300">{statusCounts[s]}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  Main grid: Recent requests + Active projects                 */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 sm:gap-6">
          {/* Últimas Solicitações — spans 3 cols */}
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Últimas Solicitações</h2>
              <Link
                to="/app/solicitacoes"
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 min-h-[44px]"
              >
                Ver todas
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentRequests.map(req => {
                const project = mockProjects.find(p => p.id === req.projectId)
                const team = mockTeams.find(t => t.id === req.teamId)
                const stCfg = statusConfig[req.status]
                const prCfg = priorityConfig[req.priority]
                const overdue = isOverdue(req.deadline) && req.status !== 'finalizado'

                return (
                  <button
                    key={req.id}
                    onClick={() => setSelectedRequest(req)}
                    className="w-full text-left card-hover p-4 hover:ring-2 hover:ring-blue-500/30 active:scale-[0.99] transition-all"
                  >
                    {/* Top row */}
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-full rounded-full flex-shrink-0 mt-1 ${
                        req.priority === 'urgente' ? 'bg-red-500' :
                        req.priority === 'alta' ? 'bg-orange-500' :
                        req.priority === 'media' ? 'bg-blue-400' : 'bg-gray-300'
                      }`} style={{ minHeight: '32px' }} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{req.type}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{req.description}</p>
                          </div>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 border ${stCfg.bg} ${stCfg.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />
                            {stCfg.label}
                          </span>
                        </div>
                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-gray-400 dark:text-gray-500">
                          {project && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{project.name}</span>}
                          {team && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{team.name}</span>}
                          <span className={`flex items-center gap-1 ${overdue ? 'text-red-500 font-bold' : ''}`}>
                            <Calendar className="w-3 h-3" />{formatDate(req.deadline)}{overdue && ' · ATRASADO'}
                          </span>
                          <span className={`${prCfg.color} font-medium`}>
                            {req.priority === 'urgente' && '🔴 '}{prCfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Obras em Andamento — spans 2 cols */}
          <div className="xl:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Obras em Andamento</h2>
              <Link
                to="/app/obras"
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 min-h-[44px]"
              >
                Ver obras
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {mockProjects.filter(p => p.status === 'ativa').map(project => {
                const projectRequests = requests.filter(r => r.projectId === project.id)
                const pending = projectRequests.filter(r => r.status !== 'finalizado').length
                const done = projectRequests.filter(r => r.status === 'finalizado').length
                const pct = projectRequests.length > 0 ? Math.round((done / projectRequests.length) * 100) : 0

                return (
                  <Link key={project.id} to="/app/obras" className="block card-hover p-4 hover:ring-2 hover:ring-blue-500/30 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-navy-800 to-navy-600 dark:from-navy-700 dark:to-navy-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{project.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{project.client}</p>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                      {done} finalizado{done !== 1 ? 's' : ''} · {pending} pendente{pending !== 1 ? 's' : ''}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================ */}
      {/*  Request detail drawer — shown when any request is clicked    */}
      {/* ============================================================ */}
      {selectedRequest && (() => {
        const req = selectedRequest
        const project = mockProjects.find(p => p.id === req.projectId)
        const team = mockTeams.find(t => t.id === req.teamId)
        const stCfg = statusConfig[req.status]
        const prCfg = priorityConfig[req.priority]
        const overdue = isOverdue(req.deadline) && req.status !== 'finalizado'

        return (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stCfg.bg}`}>
                      <ClipboardList className={`w-5 h-5 ${stCfg.color}`} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">{req.type}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{req.id.toUpperCase()}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedRequest(null)} className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* Status + Priority */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border ${stCfg.bg} ${stCfg.color}`}>
                    <span className={`w-2 h-2 rounded-full ${stCfg.dot}`} />
                    {stCfg.label}
                  </span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg ${prCfg.bg} ${prCfg.color}`}>
                    {req.priority === 'urgente' && <AlertTriangle className="w-3 h-3" />}
                    {prCfg.label}
                  </span>
                  {overdue && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                      ATRASADO
                    </span>
                  )}
                </div>

                {/* Description */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">Descrição</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{req.description}</p>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Building2 className="w-3 h-3" /> Obra</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{project?.name || '—'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Users className="w-3 h-3" /> Equipe</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{team?.name || '—'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Prazo</p>
                    <p className={`text-sm font-bold ${overdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{formatDate(req.deadline)}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Criado</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDate(req.createdAt)}</p>
                  </div>
                </div>

                {/* Attachments */}
                {req.attachments && req.attachments.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Anexos ({req.attachments.length})</p>
                    <div className="space-y-1.5">
                      {req.attachments.map((at, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg text-sm text-gray-700 dark:text-gray-300">
                          <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded font-mono">{at.type}</span>
                          <span className="truncate">{at.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created date */}
                <div className="p-3 bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/20 rounded-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 dark:text-blue-500 mb-1">Registrado em</p>
                  <p className="text-sm font-bold text-blue-800 dark:text-blue-400">{formatDate(req.createdAt)}</p>
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </>
  )
}
