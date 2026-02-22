import { Calendar, Paperclip, AlertTriangle, Building2, Users } from 'lucide-react'
import type { Request } from '../types'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import { statusConfig, priorityConfig, formatDate, isOverdue } from '../utils/helpers'

interface RequestCardProps {
  request: Request
}

export default function RequestCard({ request }: RequestCardProps) {
  const project = mockProjects.find(p => p.id === request.projectId)
  const team = mockTeams.find(t => t.id === request.teamId)
  const status = statusConfig[request.status]
  const priority = priorityConfig[request.priority]
  const overdue = isOverdue(request.deadline) && request.status !== 'finalizado'

  return (
    <div className="card-hover p-0 overflow-hidden group">
      {/* Color top strip based on priority */}
      <div className={`h-1 ${
        request.priority === 'urgente' ? 'bg-red-500' :
        request.priority === 'alta' ? 'bg-orange-500' :
        request.priority === 'media' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
      }`} />

      <div className="p-5 space-y-4">
        {/* Header: Type + Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
              {request.type}
            </h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 font-mono">
              #{request.id.toUpperCase()}
            </p>
          </div>
          <span className={`badge border ${status.bg} ${status.color} flex-shrink-0`}>
            <span className={`w-2 h-2 rounded-full ${status.dot} mr-2`} />
            {status.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {request.description}
        </p>

        {/* Info Grid — very clear for non-tech users */}
        <div className="grid grid-cols-2 gap-3">
          {/* Obra */}
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
            <Building2 className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Obra</p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{project?.name}</p>
            </div>
          </div>

          {/* Equipe */}
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
            <Users className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Equipe</p>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">{team?.name}</p>
            </div>
          </div>
        </div>

        {/* Footer: Deadline + Priority + Attachments */}
        <div className="flex items-center justify-between flex-wrap gap-y-2 pt-3 border-t border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-3">
            {/* Deadline */}
            <div className={`flex items-center gap-1.5 ${overdue ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
              <Calendar className="w-4 h-4" />
              <span className={`text-xs font-semibold ${overdue ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
                {formatDate(request.deadline)}
              </span>
              {overdue && (
                <span className="text-[10px] bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded font-bold">
                  ATRASADO
                </span>
              )}
            </div>

            {/* Attachments */}
            {request.attachments.length > 0 && (
              <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
                <Paperclip className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{request.attachments.length}</span>
              </div>
            )}
          </div>

          {/* Priority */}
          <span className={`badge ${priority.bg} ${priority.color}`}>
            {request.priority === 'urgente' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {priority.label}
          </span>
        </div>
      </div>
    </div>
  )
}
