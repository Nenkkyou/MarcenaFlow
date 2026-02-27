import { useState } from 'react'
import {
  MapPin,
  User,
  Building2,
  Briefcase,
  Users,
  X,
  ChevronRight,
  Calendar,
  Camera,
  Video,
  Clock,
  FileText,
  Image,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  RefreshCw,
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'
import type { Project } from '../types'

const statusLabels: Record<string, { label: string; emoji: string; color: string }> = {
  ativa: { label: 'Ativa', emoji: '🟢', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' },
  concluida: { label: 'Concluída', emoji: '✅', color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600' },
  pausada: { label: 'Pausada', emoji: '⏸️', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
}

const statusOptions: { value: Project['status']; label: string }[] = [
  { value: 'ativa', label: '🟢 Ativa' },
  { value: 'pausada', label: '⏸️ Pausada' },
  { value: 'concluida', label: '✅ Concluída' },
]

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const emptyForm = { name: '', client: '', address: '', status: 'ativa' as Project['status'], teamIds: [] as string[], startDate: '', expectedEndDate: '', description: '' }

export default function Projects() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests, projects, teams, addProject, updateProject, deleteProject, updateProjectStatus } = useApp()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = projects.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.address.toLowerCase().includes(q)
    }
    return true
  })

  const openCreate = () => {
    setEditingProject(null)
    setFormData(emptyForm)
    setShowForm(true)
  }

  const openEdit = (p: Project) => {
    setEditingProject(p)
    setFormData({ name: p.name, client: p.client, address: p.address, status: p.status, teamIds: [...p.teamIds], startDate: p.startDate, expectedEndDate: p.expectedEndDate, description: p.description })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.client || !formData.startDate || !formData.expectedEndDate) return
    if (editingProject) {
      updateProject(editingProject.id, formData)
      setSelectedProject(prev => prev?.id === editingProject.id ? { ...prev, ...formData } as Project : prev)
    } else {
      addProject(formData as Omit<Project, 'id' | 'updates'>)
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    deleteProject(id)
    setSelectedProject(null)
    setConfirmDelete(null)
  }

  return (
    <>
      <Header title="Obras" subtitle="Visualize o andamento de cada projeto" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        {/* Page header with action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{projects.length} obra{projects.length !== 1 ? 's' : ''}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Cadastradas no sistema</p>
            </div>
          </div>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Nova Obra</span>
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por nome, cliente ou endereço..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
            <option value="all">Todos os status</option>
            <option value="ativa">🟢 Ativa</option>
            <option value="pausada">⏸️ Pausada</option>
            <option value="concluida">✅ Concluída</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(project => {
            const projectRequests = requests.filter(r => r.projectId === project.id)
            const pending = projectRequests.filter(r => r.status !== 'finalizado').length
            const done = projectRequests.filter(r => r.status === 'finalizado').length
            const config = statusLabels[project.status]
            const pct = projectRequests.length > 0 ? Math.round((done / projectRequests.length) * 100) : 0

            return (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="card-hover p-4 sm:p-6 text-left w-full transition-all duration-200 hover:ring-2 hover:ring-blue-500/30 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-navy-800 dark:bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-white dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                      </div>
                      <span className={`badge border mt-1 ${config.color}`}>{config.emoji} {config.label}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-300">{project.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                    <span className="truncate text-gray-600 dark:text-gray-300">{project.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Progresso</span>
                    <span className="font-bold text-gray-900 dark:text-white">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>📋 {pending} pendente{pending !== 1 ? 's' : ''}</span>
                    <span>✅ {done} finalizada{done !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {(() => {
                  const projectTeams = teams.filter(t => project.teamIds.includes(t.id))
                  if (projectTeams.length === 0) return null
                  return (
                    <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        Equipes alocadas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {projectTeams.map(team => (
                          <span key={team.id} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border" style={{ backgroundColor: `${team.color}10`, borderColor: `${team.color}30`, color: team.color }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: team.color }} />
                            {team.name}
                            <span className="text-[10px] opacity-60">({team.members})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Building2 className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhuma obra encontrada</p>
          </div>
        )}
      </main>

      {/* ─── Create / Edit Modal ─── */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-dark-border" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-5 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingProject ? 'Editar Obra' : 'Nova Obra'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="label-text">Nome da Obra <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Ex: Residencial Jardins" />
                </div>
                <div>
                  <label className="label-text">Cliente <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.client} onChange={e => setFormData(p => ({ ...p, client: e.target.value }))} className="input-field" placeholder="Nome do cliente" />
                </div>
                <div>
                  <label className="label-text">Endereço</label>
                  <input type="text" value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} className="input-field" placeholder="Rua, número, bairro" />
                </div>
                <div>
                  <label className="label-text">Descrição</label>
                  <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows={3} placeholder="Detalhes sobre a obra..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Data Início <span className="text-red-500">*</span></label>
                    <input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="label-text">Previsão Término <span className="text-red-500">*</span></label>
                    <input type="date" value={formData.expectedEndDate} onChange={e => setFormData(p => ({ ...p, expectedEndDate: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label-text">Status</label>
                  <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as Project['status'] }))} className="select-field">
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Equipes Vinculadas</label>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                    {teams.map(t => (
                      <label key={t.id} className="flex items-center gap-2 p-1.5 cursor-pointer hover:bg-white dark:hover:bg-dark-card rounded-lg transition-colors">
                        <input type="checkbox" checked={formData.teamIds.includes(t.id)} onChange={e => { setFormData(p => ({ ...p, teamIds: e.target.checked ? [...p.teamIds, t.id] : p.teamIds.filter(id => id !== t.id) })) }} className="w-4 h-4 rounded text-blue-500 border-gray-300 focus:ring-blue-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                          {t.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                  <button type="button" onClick={handleSave} disabled={!formData.name || !formData.client || !formData.startDate || !formData.expectedEndDate} className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">{editingProject ? 'Salvar' : 'Criar Obra'}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Delete Confirmation ─── */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-dark-border" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Excluir Obra?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Esta ação não pode ser desfeita. Todos os dados da obra serão removidos.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Project Detail Drawer */}
      {selectedProject && (() => {
        const project = projects.find(p => p.id === selectedProject.id) || selectedProject
        return (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[540px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-800 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{project.name}</h2>
                    <span className={`badge border text-[11px] ${statusLabels[project.status].color}`}>
                      {statusLabels[project.status].emoji} {statusLabels[project.status].label}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { openEdit(project); setSelectedProject(null) }} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>
                <select
                  value={project.status}
                  onChange={e => { updateProjectStatus(project.id, e.target.value as Project['status']); setSelectedProject({ ...project, status: e.target.value as Project['status'] }) }}
                  className="px-3 py-2 text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border-0 focus:ring-2 focus:ring-amber-500/40 cursor-pointer"
                >
                  <option value="" disabled>⚡ Mudar Status</option>
                  {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <button onClick={() => { setConfirmDelete(project.id); setSelectedProject(null) }} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300"><span className="font-medium">Cliente:</span> {project.client}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300"><span className="font-medium">Endereço:</span> {project.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Período:</span> {formatDate(project.startDate)} — {formatDate(project.expectedEndDate)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Descrição da Obra</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{project.description}</p>
              </div>

              {/* Teams */}
              {(() => {
                const projectTeams = teams.filter(t => project.teamIds.includes(t.id))
                if (projectTeams.length === 0) return null
                return (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Equipes na Obra ({projectTeams.length})</p>
                    <div className="space-y-2">
                      {projectTeams.map(team => (
                        <div key={team.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${team.color}15` }}>
                            <Users className="w-5 h-5" style={{ color: team.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{team.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{team.specialty} · {team.members} membros</p>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: `${team.color}15`, color: team.color }}>{team.leader}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Progress */}
              {(() => {
                const projectRequests = requests.filter(r => r.projectId === project.id)
                const done = projectRequests.filter(r => r.status === 'finalizado').length
                const pct = projectRequests.length > 0 ? Math.round((done / projectRequests.length) * 100) : 0
                return (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Progresso Geral</p>
                      <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{pct}%</span>
                    </div>
                    <div className="h-3 bg-white dark:bg-dark-bg rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{done} de {projectRequests.length} solicitações finalizadas</p>
                  </div>
                )
              })()}

              {/* Updates */}
              {project.updates.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Atualizações da Obra ({project.updates.length})</p>
                  <div className="space-y-4">
                    {project.updates.map((update) => (
                      <div key={update.id} className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{update.title}</h4>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">{formatDate(update.date)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{update.description}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3">
                          <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center text-[9px] font-bold text-gray-500">{update.author.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                          {update.author}
                        </div>
                        {update.media && update.media.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {update.media.map((m, idx) => (
                              <button key={idx} onClick={() => m.type === 'photo' && setLightboxImg(m.url)} className="relative group rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-border aspect-video">
                                {m.type === 'photo' ? (
                                  <img src={m.url} alt={m.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center"><Video className="w-8 h-8 text-gray-400" /></div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  {m.type === 'photo' && <Image className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </div>
                                {m.caption && (
                                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2"><p className="text-[10px] text-white truncate">{m.caption}</p></div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
        )
      })()}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <button onClick={() => setLightboxImg(null)} className="absolute top-4 right-4 p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
          <img src={lightboxImg} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </>
  )
}
