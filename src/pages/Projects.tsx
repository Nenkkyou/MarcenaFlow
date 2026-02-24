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
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import { useApp } from '../context/AppContext'
import type { Project } from '../types'

const statusLabels: Record<string, { label: string; emoji: string; color: string }> = {
  ativa: { label: 'Ativa', emoji: '🟢', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' },
  concluida: { label: 'Concluída', emoji: '✅', color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600' },
  pausada: { label: 'Pausada', emoji: '⏸️', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function Projects() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests } = useApp()
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  return (
    <>
      <Header title="Obras" subtitle="Visualize o andamento de cada projeto" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{mockProjects.length} obra{mockProjects.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Cadastradas no sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {mockProjects.map(project => {
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
                  const projectTeams = mockTeams.filter(t => project.teamIds.includes(t.id))
                  if (projectTeams.length === 0) return null
                  return (
                    <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        Equipes alocadas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {projectTeams.map(team => (
                          <span
                            key={team.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border"
                            style={{ backgroundColor: `${team.color}10`, borderColor: `${team.color}30`, color: team.color }}
                          >
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
      </main>

      {/* Project Detail Drawer */}
      {selectedProject && (
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
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedProject.name}</h2>
                    <span className={`badge border text-[11px] ${statusLabels[selectedProject.status].color}`}>
                      {statusLabels[selectedProject.status].emoji} {statusLabels[selectedProject.status].label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300"><span className="font-medium">Cliente:</span> {selectedProject.client}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300"><span className="font-medium">Endereço:</span> {selectedProject.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Período:</span> {formatDate(selectedProject.startDate)} — {formatDate(selectedProject.expectedEndDate)}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Descrição da Obra
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Teams */}
              {(() => {
                const projectTeams = mockTeams.filter(t => selectedProject.teamIds.includes(t.id))
                if (projectTeams.length === 0) return null
                return (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      Equipes na Obra ({projectTeams.length})
                    </p>
                    <div className="space-y-2">
                      {projectTeams.map(team => (
                        <div key={team.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${team.color}15` }}
                          >
                            <Users className="w-5 h-5" style={{ color: team.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{team.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{team.specialty} · {team.members} membros</p>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ backgroundColor: `${team.color}15`, color: team.color }}>
                            {team.leader}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* Progress */}
              {(() => {
                const projectRequests = requests.filter(r => r.projectId === selectedProject.id)
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {done} de {projectRequests.length} solicitações finalizadas
                    </p>
                  </div>
                )
              })()}

              {/* Updates / Timeline */}
              {selectedProject.updates.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Atualizações da Obra ({selectedProject.updates.length})
                  </p>
                  <div className="space-y-4">
                    {selectedProject.updates.map((update) => (
                      <div key={update.id} className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{update.title}</h4>
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 tabular-nums flex-shrink-0">{formatDate(update.date)}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">{update.description}</p>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-3">
                          <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-dark-border flex items-center justify-center text-[9px] font-bold text-gray-500">
                            {update.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                          {update.author}
                        </div>
                        {/* Media gallery */}
                        {update.media && update.media.length > 0 && (
                          <div className="grid grid-cols-2 gap-2">
                            {update.media.map((m, idx) => (
                              <button
                                key={idx}
                                onClick={() => m.type === 'photo' && setLightboxImg(m.url)}
                                className="relative group rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-border aspect-video"
                              >
                                {m.type === 'photo' ? (
                                  <img src={m.url} alt={m.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <Video className="w-8 h-8 text-gray-400" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  {m.type === 'photo' && <Image className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />}
                                </div>
                                {m.caption && (
                                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                                    <p className="text-[10px] text-white truncate">{m.caption}</p>
                                  </div>
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
      )}

      {/* Lightbox */}
      {lightboxImg && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxImg(null)}>
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 p-2.5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img src={lightboxImg} alt="" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </>
  )
}
