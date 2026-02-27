import { useState } from 'react'
import { PlusCircle, ClipboardList, X, Calendar, Paperclip, Building2, Users, Trash2, AlertTriangle, CheckCircle2, Eye, Loader2 } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import RequestList from '../components/RequestList'
import { useApp } from '../context/AppContext'
import { statusConfig, priorityConfig, formatDate, isOverdue } from '../utils/helpers'
import type { Request, Status } from '../types'

export default function Requests() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests, projects, teams, updateRequestStatus, deleteRequest } = useApp()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const selectedRequest = selectedId ? requests.find(r => r.id === selectedId) || null : null

  const handleDelete = (id: string) => { deleteRequest(id); setConfirmDelete(null); setSelectedId(null) }

  const statusFlow: { from: Status; to: Status; label: string; icon: typeof Eye; color: string; bg: string }[] = [
    { from: 'pendente', to: 'em_analise', label: 'Iniciar Análise', icon: Eye, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20' },
    { from: 'em_analise', to: 'em_producao', label: 'Enviar p/ Produção', icon: Loader2, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20' },
    { from: 'em_producao', to: 'finalizado', label: 'Finalizar', icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20' },
  ]

  return (
    <>
      <Header title="Solicitações" subtitle="Todos os pedidos das obras em um só lugar" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {requests.length} solicitaç{requests.length !== 1 ? 'ões' : 'ão'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Registradas no sistema</p>
            </div>
          </div>
          <Link to="/app/nova-solicitacao" className="btn-primary flex-shrink-0">
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Nova Solicitação</span>
          </Link>
        </div>

        <RequestList requests={requests} projects={projects} teams={teams} onSelectRequest={r => setSelectedId(r.id)} />
      </main>

      {/* ─── Detail Drawer ─── */}
      {selectedRequest && (() => {
        const project = projects.find(p => p.id === selectedRequest.projectId)
        const team = teams.find(t => t.id === selectedRequest.teamId)
        const status = statusConfig[selectedRequest.status]
        const priority = priorityConfig[selectedRequest.priority]
        const overdue = isOverdue(selectedRequest.deadline) && selectedRequest.status !== 'finalizado'
        const nextAction = statusFlow.find(s => s.from === selectedRequest.status)

        return (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{selectedRequest.type}</h2>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">#{selectedRequest.id.toUpperCase()}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-5">
                {/* Status + Priority */}
                <div className="flex items-center gap-2">
                  <span className={`badge border ${status.bg} ${status.color}`}><span className={`w-2 h-2 rounded-full ${status.dot} mr-2`} />{status.label}</span>
                  <span className={`badge ${priority.bg} ${priority.color}`}>{selectedRequest.priority === 'urgente' && <AlertTriangle className="w-3 h-3 mr-1" />}{priority.label}</span>
                </div>

                {/* Status action */}
                {nextAction && (
                  <button onClick={() => updateRequestStatus(selectedRequest.id, nextAction.to)} className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-colors ${nextAction.bg} ${nextAction.color}`}>
                    <nextAction.icon className="w-4 h-4" /> {nextAction.label}
                  </button>
                )}

                {/* Description */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Descrição</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedRequest.description}</p>
                </div>

                {/* Obra + Equipe */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                    <div className="flex items-center gap-2 mb-1"><Building2 className="w-4 h-4 text-blue-500" /></div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Obra</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{project?.name || '—'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                    <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-purple-500" /></div>
                    <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Equipe</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{team?.name || '—'}</p>
                  </div>
                </div>

                {/* Deadline */}
                <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                  <div className={`flex items-center gap-2 ${overdue ? 'text-red-500' : 'text-gray-600 dark:text-gray-300'}`}>
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-semibold">{formatDate(selectedRequest.deadline)}</span>
                    {overdue && <span className="text-[10px] bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold">ATRASADO</span>}
                  </div>
                </div>

                {/* Attachments */}
                {selectedRequest.attachments.length > 0 && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> Anexos ({selectedRequest.attachments.length})</p>
                    <div className="space-y-1.5">
                      {selectedRequest.attachments.map((a, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg border border-gray-100 dark:border-dark-border">
                          <Paperclip className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{a.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="flex gap-4 text-[11px] text-gray-400 dark:text-gray-500 pt-1">
                  <span>Criado: {formatDate(selectedRequest.createdAt)}</span>
                  <span>Atualizado: {formatDate(selectedRequest.updatedAt)}</span>
                </div>

                {/* Delete */}
                <div className="pt-3 border-t border-gray-100 dark:border-dark-border">
                  <button onClick={() => setConfirmDelete(selectedRequest.id)} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /> Excluir Solicitação</button>
                </div>
              </div>
            </div>
          </>
        )
      })()}

      {/* ─── Delete Confirmation ─── */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-dark-border" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Excluir Solicitação?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
