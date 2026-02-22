import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Building2,
  Users,
  Hammer,
  ChevronRight,
} from 'lucide-react'

const navigation = [
  { name: 'Painel Geral', description: 'Visão completa', to: '/app', icon: LayoutDashboard },
  { name: 'Solicitações', description: 'Todas as solicitações', to: '/app/solicitacoes', icon: ClipboardList },
  { name: 'Nova Solicitação', description: 'Criar pedido', to: '/app/nova-solicitacao', icon: PlusCircle },
  { name: 'Obras', description: 'Projetos ativos', to: '/app/obras', icon: Building2 },
  { name: 'Equipes', description: 'Grupos de trabalho', to: '/app/equipes', icon: Users },
]

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 w-72 bg-navy-800 dark:bg-dark-card flex flex-col border-r border-transparent dark:border-dark-border">
      {/* Logo */}
      <div className="flex items-center gap-3.5 px-6 h-20 border-b border-white/10">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
          <Hammer className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-tight">MarcenaFlow</span>
          <p className="text-gray-500 text-xs mt-0.5">Gestão Operacional</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          Menu Principal
        </p>

        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === '/app'}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-500/15 text-blue-400 shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full" />
                )}
                <div className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-500/20' 
                    : 'bg-white/5 group-hover:bg-white/10'
                }`}>
                  <item.icon
                    className={`w-[18px] h-[18px] transition-colors duration-150 ${
                      isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block leading-tight">{item.name}</span>
                  <span className={`text-[11px] leading-tight ${isActive ? 'text-blue-400/60' : 'text-gray-600'}`}>
                    {item.description}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all duration-150 ${
                  isActive ? 'text-blue-400/50 translate-x-0' : 'text-transparent group-hover:text-gray-600 -translate-x-1 group-hover:translate-x-0'
                }`} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3.5 px-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
            <span className="text-white text-sm font-bold">DU</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Eduardo Silva</p>
            <p className="text-xs text-gray-500 truncate">Gerente de Operações</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
