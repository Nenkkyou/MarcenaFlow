import { useState } from 'react'
import {
  Users as UsersIcon,
  UserCircle,
  HardHat,
  Building2,
  Phone,
  X,
  ChevronRight,
  MapPin,
  Star,
  Wrench,
  PlusCircle,
  Edit3,
  Trash2,
  Search,
  UserPlus,
  UserMinus,
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'
import type { Team } from '../types'

const colorOptions = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#3b82f6']
const emptyTeamForm = { name: '', color: '#6366f1', leader: '', specialty: '', projectId: '' }
const emptyMemberForm = { name: '', role: '', phone: '' }

export default function Teams() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests, projects, teams, addTeam, updateTeam, deleteTeam, addTeamMember, removeTeamMember } = useApp()
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [formData, setFormData] = useState(emptyTeamForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [memberForm, setMemberForm] = useState(emptyMemberForm)
  const [confirmRemoveMember, setConfirmRemoveMember] = useState<string | null>(null)

  const filtered = teams.filter(t => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return t.name.toLowerCase().includes(q) || t.leader.toLowerCase().includes(q) || t.specialty.toLowerCase().includes(q)
  })

  const openCreate = () => { setEditingTeam(null); setFormData(emptyTeamForm); setShowForm(true) }
  const openEdit = (t: Team) => {
    setEditingTeam(t)
    setFormData({ name: t.name, color: t.color, leader: t.leader, specialty: t.specialty, projectId: t.projectId || '' })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.leader) return
    if (editingTeam) {
      updateTeam(editingTeam.id, { name: formData.name, color: formData.color, leader: formData.leader, specialty: formData.specialty, projectId: formData.projectId || undefined })
    } else {
      addTeam({ name: formData.name, color: formData.color, leader: formData.leader, specialty: formData.specialty, projectId: formData.projectId || undefined } as Omit<Team, 'id' | 'memberList' | 'members'>)
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => { deleteTeam(id); setSelectedTeam(null); setConfirmDelete(null) }

  const handleAddMember = () => {
    if (!selectedTeam || !memberForm.name || !memberForm.role) return
    addTeamMember(selectedTeam.id, { name: memberForm.name, role: memberForm.role, phone: memberForm.phone })
    setMemberForm(emptyMemberForm)
    setShowAddMember(false)
  }

  const handleRemoveMember = (memberId: string) => {
    if (!selectedTeam) return
    removeTeamMember(selectedTeam.id, memberId)
    setConfirmRemoveMember(null)
  }

  // Keep drawer in sync with state
  const team = selectedTeam ? teams.find(t => t.id === selectedTeam.id) || null : null

  return (
    <>
      <Header title="Equipes" subtitle="Veja a carga de trabalho de cada equipe" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
              <HardHat className="w-5 h-5 text-violet-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{teams.length} equipe{teams.length !== 1 ? 's' : ''}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Cadastradas no sistema</p>
            </div>
          </div>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Nova Equipe</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por nome, líder ou especialidade..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(t => {
            const teamRequests = requests.filter(r => r.teamId === t.id)
            const pending = teamRequests.filter(r => r.status !== 'finalizado').length
            const inProgress = teamRequests.filter(r => r.status === 'em_producao').length

            return (
              <button key={t.id} onClick={() => setSelectedTeam(t)} className="card-hover p-4 sm:p-6 text-left w-full transition-all duration-200 hover:ring-2 hover:ring-blue-500/30 active:scale-[0.98] cursor-pointer">
                <div className="flex items-start gap-4 mb-3 sm:mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}15` }}>
                    <UsersIcon className="w-6 h-6" style={{ color: t.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t.name}</h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">👷 {t.members} membros</p>
                    {(() => {
                      const project = projects.find(p => p.id === t.projectId)
                      if (!project) return null
                      return (
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-500" />
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">{project.name}</span>
                        </div>
                      )
                    })()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-5">
                  <div className="text-center p-2 sm:p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{teamRequests.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{pending}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pendentes</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
                    <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{inProgress}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Produção</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Membros</p>
                  <div className="flex -space-x-2">
                    {t.memberList.slice(0, 5).map((m, i) => (
                      <div key={m.id} className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: t.color, opacity: 1 - i * 0.12 }} title={m.name}>
                        {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    ))}
                    {t.members > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">+{t.members - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <UsersIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhuma equipe encontrada</p>
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingTeam ? 'Editar Equipe' : 'Nova Equipe'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="label-text">Nome da Equipe <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="Ex: Equipe Alpha" />
                </div>
                <div>
                  <label className="label-text">Líder <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.leader} onChange={e => setFormData(p => ({ ...p, leader: e.target.value }))} className="input-field" placeholder="Nome do líder" />
                </div>
                <div>
                  <label className="label-text">Especialidade</label>
                  <input type="text" value={formData.specialty} onChange={e => setFormData(p => ({ ...p, specialty: e.target.value }))} className="input-field" placeholder="Ex: Instalação, Montagem..." />
                </div>
                <div>
                  <label className="label-text">Obra Vinculada</label>
                  <select value={formData.projectId} onChange={e => setFormData(p => ({ ...p, projectId: e.target.value }))} className="select-field">
                    <option value="">Sem alocação</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Cor da Equipe</label>
                  <div className="flex gap-2 flex-wrap">
                    {colorOptions.map(c => (
                      <button key={c} onClick={() => setFormData(p => ({ ...p, color: c }))} className={`w-8 h-8 rounded-lg transition-all ${formData.color === c ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-dark-card scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                  <button onClick={handleSave} disabled={!formData.name || !formData.leader} className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">{editingTeam ? 'Salvar' : 'Criar Equipe'}</button>
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Excluir Equipe?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Todos os dados da equipe e seus membros serão removidos.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Team Detail Drawer */}
      {team && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedTeam(null)} />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${team.color}15` }}>
                    <UsersIcon className="w-5 h-5" style={{ color: team.color }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{team.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{team.specialty}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTeam(null)} className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { openEdit(team); setSelectedTeam(null) }} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>
                <button onClick={() => setShowAddMember(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors">
                  <UserPlus className="w-3.5 h-3.5" /> Adicionar Membro
                </button>
                <button onClick={() => { setConfirmDelete(team.id); setSelectedTeam(null) }} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>

              {/* Add member inline form */}
              {showAddMember && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 space-y-3">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"><UserPlus className="w-3.5 h-3.5" /> Novo Membro</p>
                  <input type="text" value={memberForm.name} onChange={e => setMemberForm(p => ({ ...p, name: e.target.value }))} className="input-field !py-2 text-sm" placeholder="Nome completo *" />
                  <input type="text" value={memberForm.role} onChange={e => setMemberForm(p => ({ ...p, role: e.target.value }))} className="input-field !py-2 text-sm" placeholder="Função (ex: Marceneiro) *" />
                  <input type="text" value={memberForm.phone} onChange={e => setMemberForm(p => ({ ...p, phone: e.target.value }))} className="input-field !py-2 text-sm" placeholder="Telefone" />
                  <div className="flex gap-2">
                    <button onClick={() => { setShowAddMember(false); setMemberForm(emptyMemberForm) }} className="btn-secondary flex-1 justify-center !py-2 text-xs">Cancelar</button>
                    <button onClick={handleAddMember} disabled={!memberForm.name || !memberForm.role} className="btn-primary flex-1 justify-center !py-2 text-xs disabled:opacity-40">Adicionar</button>
                  </div>
                </div>
              )}

              {/* Allocation info */}
              {(() => {
                const project = projects.find(p => p.id === team.projectId)
                if (!project) return (
                  <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Equipe sem alocação no momento</p>
                  </div>
                )
                return (
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500 mb-2 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Alocação Atual</p>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{project.name}</h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span className="truncate">{project.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <UserCircle className="w-3.5 h-3.5 text-gray-400" />
                      <span>Cliente: {project.client}</span>
                    </div>
                  </div>
                )
              })()}

              {/* Leader */}
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-100 dark:border-amber-500/20">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Líder da Equipe</p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{team.leader}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5"><Wrench className="w-3 h-3" /> Especialidade: {team.specialty}</p>
              </div>

              {/* Members list */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5"><UsersIcon className="w-3.5 h-3.5" /> Membros da Equipe ({team.memberList.length})</p>
                <div className="space-y-2">
                  {team.memberList.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: team.color }}>
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {member.name}
                          {member.name === team.leader && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded font-bold">LÍDER</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
                      </div>
                      <a href={`tel:${member.phone}`} className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center" title={member.phone} onClick={e => e.stopPropagation()}>
                        <Phone className="w-4 h-4" />
                      </a>
                      {confirmRemoveMember === member.id ? (
                        <div className="flex gap-1">
                          <button onClick={() => setConfirmRemoveMember(null)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg text-xs">✗</button>
                          <button onClick={() => handleRemoveMember(member.id)} className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg text-xs font-bold">Sim</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmRemoveMember(member.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0" title="Remover membro">
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              {(() => {
                const teamRequests = requests.filter(r => r.teamId === team.id)
                const pending = teamRequests.filter(r => r.status !== 'finalizado').length
                const done = teamRequests.filter(r => r.status === 'finalizado').length
                return (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">Carga de Trabalho</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{teamRequests.length}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
                      </div>
                      <div className="text-center p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                        <p className="text-xl font-bold text-amber-600 dark:text-amber-400">{pending}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Pendentes</p>
                      </div>
                      <div className="text-center p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl">
                        <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{done}</p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Finalizadas</p>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        </>
      )}
    </>
  )
}
