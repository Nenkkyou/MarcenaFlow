import { ArrowRight, Clock, AlertTriangle, TrendingUp, Zap } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import DashboardCards from '../components/DashboardCards'
import RequestCard from '../components/RequestCard'
import { useApp } from '../context/AppContext'
import { mockProjects } from '../mock/mockProjects'
import { statusConfig } from '../utils/helpers'
import type { Status } from '../types'

export default function Dashboard() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests } = useApp()

  const recentRequests = [...requests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4)

  const urgentRequests = requests.filter(
    r => r.priority === 'urgente' && r.status !== 'finalizado'
  )

  // Status distribution for mini chart
  const statusCounts: Record<Status, number> = {
    pendente: requests.filter(r => r.status === 'pendente').length,
    em_analise: requests.filter(r => r.status === 'em_analise').length,
    em_producao: requests.filter(r => r.status === 'em_producao').length,
    finalizado: requests.filter(r => r.status === 'finalizado').length,
  }

  const total = requests.length

  return (
    <>
      <Header title="Painel Geral" subtitle="Acompanhe tudo em um só lugar" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Welcome banner */}
        <div className="card bg-gradient-to-r from-navy-800 to-navy-700 dark:from-dark-card dark:to-dark-surface border-0 p-4 sm:p-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white">Bom dia, Eduardo! 👋</h2>
            <p className="text-sm text-blue-200 dark:text-gray-400 mt-1">
              Você tem <span className="font-bold text-white">{urgentRequests.length} solicitações urgentes</span> e{' '}
              <span className="font-bold text-white">{statusCounts.pendente} pendentes</span> para hoje.
            </p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
            <Zap className="w-24 h-24 text-white" />
          </div>
        </div>

        {/* KPI Cards */}
        <div>
          <h2 className="section-title mb-4">Resumo Rápido</h2>
          <DashboardCards requests={requests} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Requests */}
          <div className="xl:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="section-title">Últimas Solicitações</h2>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Os pedidos mais recentes</p>
              </div>
              <Link
                to="/solicitacoes"
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
              >
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {recentRequests.map(req => (
                <RequestCard key={req.id} request={req} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status distribution */}
            <div className="card p-4 sm:p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Status das Solicitações</h3>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Como estão os pedidos</p>
                </div>
              </div>

              <div className="space-y-4">
                {(Object.keys(statusCounts) as Status[]).map(status => {
                  const count = statusCounts[status]
                  const percentage = total > 0 ? (count / total) * 100 : 0
                  const config = statusConfig[status]

                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-3 h-3 rounded-full ${config.dot}`} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{config.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{count}</span>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500">
                            ({Math.round(percentage)}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config.dot} transition-all duration-700 ease-out`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Urgent alerts */}
            {urgentRequests.length > 0 && (
              <div className="card p-4 sm:p-6 border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 bg-red-50 dark:bg-red-500/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">Atenção!</h3>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Pedidos que precisam de ação</p>
                  </div>
                  <span className="badge bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20">
                    {urgentRequests.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {urgentRequests.map(req => {
                    const project = mockProjects.find(p => p.id === req.projectId)
                    return (
                      <div key={req.id} className="flex items-center gap-3 p-3.5 bg-red-50/50 dark:bg-red-500/5 rounded-xl">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{req.type}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{project?.name}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Active Projects */}
            <div className="card p-4 sm:p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 bg-violet-50 dark:bg-violet-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-violet-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Obras em Andamento</h3>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Projetos com pedidos ativos</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {mockProjects.filter(p => p.status === 'ativa').map(project => {
                  const projectRequests = requests.filter(r => r.projectId === project.id)
                  const pending = projectRequests.filter(r => r.status !== 'finalizado').length
                  const done = projectRequests.filter(r => r.status === 'finalizado').length
                  const pct = projectRequests.length > 0 ? Math.round((done / projectRequests.length) * 100) : 0

                  return (
                    <div key={project.id} className="p-3.5 bg-gray-50 dark:bg-dark-surface rounded-xl">
                      <div className="flex items-center gap-3 mb-2.5">
                        <div className="w-9 h-9 bg-navy-800 dark:bg-navy-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {project.name.split(' ').pop()?.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{project.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {pending} pendente{pending !== 1 ? 's' : ''} · {pct}% concluído
                          </p>
                        </div>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
