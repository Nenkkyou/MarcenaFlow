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
} from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import { mockTeams } from '../mock/mockTeams'
import { mockProjects } from '../mock/mockProjects'
import { useApp } from '../context/AppContext'
import type { Team } from '../types'

export default function Teams() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests } = useApp()
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  return (
    <>
      <Header title="Equipes" subtitle="Veja a carga de trabalho de cada equipe" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-5 sm:mb-8">
          <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
            <HardHat className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{mockTeams.length} equipe{mockTeams.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Cadastradas no sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {mockTeams.map(team => {
            const teamRequests = requests.filter(r => r.teamId === team.id)
            const pending = teamRequests.filter(r => r.status !== 'finalizado').length
            const inProgress = teamRequests.filter(r => r.status === 'em_producao').length

            return (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team)}
                className="card-hover p-4 sm:p-6 text-left w-full transition-all duration-200 hover:ring-2 hover:ring-blue-500/30 active:scale-[0.98] cursor-pointer"
              >
                <div className="flex items-start gap-4 mb-3 sm:mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${team.color}15` }}
                  >
                    <UsersIcon className="w-6 h-6" style={{ color: team.color }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                      <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">👷 {team.members} membros</p>
                    {(() => {
                      const project = mockProjects.find(p => p.id === team.projectId)
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

                {/* Member avatars */}
                <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Membros</p>
                  <div className="flex -space-x-2">
                    {team.memberList.slice(0, 5).map((m, i) => (
                      <div
                        key={m.id}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card flex items-center justify-center text-[10px] font-bold text-white"
                        style={{ backgroundColor: team.color, opacity: 1 - i * 0.12 }}
                        title={m.name}
                      >
                        {m.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                    ))}
                    {team.members > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">+{team.members - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </main>

      {/* Team Detail Modal/Drawer */}
      {selectedTeam && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedTeam(null)}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${selectedTeam.color}15` }}
                  >
                    <UsersIcon className="w-5 h-5" style={{ color: selectedTeam.color }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedTeam.name}</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{selectedTeam.specialty}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Allocation info */}
              {(() => {
                const project = mockProjects.find(p => p.id === selectedTeam.projectId)
                if (!project) return (
                  <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Equipe sem alocação no momento</p>
                  </div>
                )
                return (
                  <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-500 mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      Alocação Atual
                    </p>
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
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  Líder da Equipe
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{selectedTeam.leader}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
                  <Wrench className="w-3 h-3" />
                  Especialidade: {selectedTeam.specialty}
                </p>
              </div>

              {/* Members list */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                  <UsersIcon className="w-3.5 h-3.5" />
                  Membros da Equipe ({selectedTeam.memberList.length})
                </p>
                <div className="space-y-2">
                  {selectedTeam.memberList.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ backgroundColor: selectedTeam.color }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {member.name}
                          {member.name === selectedTeam.leader && (
                            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded font-bold">LÍDER</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
                      </div>
                      <a
                        href={`tel:${member.phone}`}
                        className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        title={member.phone}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats */}
              {(() => {
                const teamRequests = requests.filter(r => r.teamId === selectedTeam.id)
                const pending = teamRequests.filter(r => r.status !== 'finalizado').length
                const done = teamRequests.filter(r => r.status === 'finalizado').length
                const inProd = teamRequests.filter(r => r.status === 'em_producao').length
                return (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
                      Carga de Trabalho
                    </p>
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
