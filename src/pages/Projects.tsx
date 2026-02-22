import { MapPin, User, Building2, Briefcase, Users } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import { useApp } from '../context/AppContext'

const statusLabels: Record<string, { label: string; emoji: string; color: string }> = {
  ativa: { label: 'Ativa', emoji: '🟢', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' },
  concluida: { label: 'Concluída', emoji: '✅', color: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-700/40 dark:text-gray-300 dark:border-gray-600' },
  pausada: { label: 'Pausada', emoji: '⏸️', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
}

export default function Projects() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests } = useApp()

  return (
    <>
      <Header title="Obras" subtitle="Visualize o andamento de cada projeto" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{mockProjects.length} obra{mockProjects.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Cadastradas no sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockProjects.map(project => {
            const projectRequests = requests.filter(r => r.projectId === project.id)
            const pending = projectRequests.filter(r => r.status !== 'finalizado').length
            const done = projectRequests.filter(r => r.status === 'finalizado').length
            const config = statusLabels[project.status]
            const pct = projectRequests.length > 0 ? Math.round((done / projectRequests.length) * 100) : 0

            return (
              <div key={project.id} className="card-hover p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-navy-800 dark:bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                      <span className={`badge border mt-1 ${config.color}`}>{config.emoji} {config.label}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-gray-600 dark:text-gray-300">{project.client}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span className="truncate text-gray-600 dark:text-gray-300">{project.address}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Progresso</span>
                    <span className="font-bold text-gray-900 dark:text-white">{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-dark-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-400 dark:text-gray-500">
                    <span>📋 {pending} pendente{pending !== 1 ? 's' : ''}</span>
                    <span>✅ {done} finalizada{done !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Teams assigned to this project */}
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
                            style={{
                              backgroundColor: `${team.color}10`,
                              borderColor: `${team.color}30`,
                              color: team.color,
                            }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: team.color }}
                            />
                            {team.name}
                            <span className="text-[10px] opacity-60">({team.members})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })()}
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
