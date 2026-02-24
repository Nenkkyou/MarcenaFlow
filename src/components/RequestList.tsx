import { useState } from 'react'
import { Filter, Search, Inbox } from 'lucide-react'
import type { Request, Status, Priority } from '../types'
import RequestCard from './RequestCard'
import { statusConfig, priorityConfig } from '../utils/helpers'

interface RequestListProps {
  requests: Request[]
}

export default function RequestList({ requests }: RequestListProps) {
  const [statusFilter, setStatusFilter] = useState<Status | 'todos'>('todos')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'todos'>('todos')

  const filtered = requests.filter(r => {
    if (statusFilter !== 'todos' && r.status !== statusFilter) return false
    if (priorityFilter !== 'todos' && r.priority !== priorityFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">Filtrar Solicitações</span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status filter */}
          <div className="flex-1 min-w-[140px] sm:min-w-[180px]">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | 'todos')}
              className="select-field"
            >
              <option value="todos">📋 Todos os status</option>
              {(Object.keys(statusConfig) as Status[]).map(s => (
                <option key={s} value={s}>{statusConfig[s].emoji} {statusConfig[s].label}</option>
              ))}
            </select>
          </div>

          {/* Priority filter */}
          <div className="flex-1 min-w-[140px] sm:min-w-[180px]">
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Prioridade
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'todos')}
              className="select-field"
            >
              <option value="todos">⚡ Todas as prioridades</option>
              {(Object.keys(priorityConfig) as Priority[]).map(p => (
                <option key={p} value={p}>{priorityConfig[p].emoji} {priorityConfig[p].label}</option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-dark-surface rounded-xl w-full sm:w-auto">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="card p-8 sm:p-16 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-dark-surface rounded-2xl mx-auto flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-base font-bold text-gray-900 dark:text-white">Nenhuma solicitação encontrada</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm mx-auto">
            Tente ajustar os filtros acima ou crie uma nova solicitação.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filtered.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  )
}
