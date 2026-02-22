import { Users as UsersIcon, UserCircle, HardHat } from 'lucide-react'
import Header from '../components/Header'
import { mockTeams } from '../mock/mockTeams'
import { useApp } from '../context/AppContext'

export default function Teams() {
  const { requests } = useApp()

  return (
    <>
      <Header title="Equipes" subtitle="Veja a carga de trabalho de cada equipe" />

      <main className="p-8">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
            <HardHat className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">{mockTeams.length} equipe{mockTeams.length !== 1 ? 's' : ''}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Cadastradas no sistema</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {mockTeams.map(team => {
            const teamRequests = requests.filter(r => r.teamId === team.id)
            const pending = teamRequests.filter(r => r.status !== 'finalizado').length
            const inProgress = teamRequests.filter(r => r.status === 'em_producao').length

            return (
              <div key={team.id} className="card-hover p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${team.color}15` }}
                  >
                    <UsersIcon className="w-6 h-6" style={{ color: team.color }} />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">{team.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">👷 {team.members} membros</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="text-center p-3 bg-gray-50 dark:bg-dark-surface rounded-xl">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{teamRequests.length}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Total</p>
                  </div>
                  <div className="text-center p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl">
                    <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{pending}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Pendentes</p>
                  </div>
                  <div className="text-center p-3 bg-violet-50 dark:bg-violet-500/10 rounded-xl">
                    <p className="text-lg font-bold text-violet-600 dark:text-violet-400">{inProgress}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Produção</p>
                  </div>
                </div>

                {/* Member avatars */}
                <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Membros</p>
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(team.members, 5) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card flex items-center justify-center"
                        style={{
                          backgroundColor: `${team.color}${20 + i * 15}`,
                        }}
                      >
                        <UserCircle className="w-4 h-4" style={{ color: team.color }} />
                      </div>
                    ))}
                    {team.members > 5 && (
                      <div className="w-8 h-8 rounded-full border-2 border-white dark:border-dark-card bg-gray-100 dark:bg-dark-surface flex items-center justify-center">
                        <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">+{team.members - 5}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </>
  )
}
