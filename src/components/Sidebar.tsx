import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Building2,
  Users,
  Hammer,
  ChevronRight,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Package,
  History,
} from 'lucide-react'

const navigation = [
  { name: 'Painel Geral', description: 'Visão completa', to: '/app', icon: LayoutDashboard },
  { name: 'Solicitações', description: 'Todas as solicitações', to: '/app/solicitacoes', icon: ClipboardList },
  { name: 'Nova Solicitação', description: 'Criar pedido', to: '/app/nova-solicitacao', icon: PlusCircle },
  { name: 'Obras', description: 'Projetos ativos', to: '/app/obras', icon: Building2 },
  { name: 'Equipes', description: 'Grupos de trabalho', to: '/app/equipes', icon: Users },
  { name: 'Almoxarifado', description: 'Ordens de compra', to: '/app/almoxarifado', icon: Package },
  { name: 'Histórico', description: 'Linha do tempo', to: '/app/historico', icon: History },
]

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

export default function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const sidebarWidth = collapsed ? 'w-[4.5rem]' : 'w-72'

  return (
    <>
      {/* Mobile backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${sidebarWidth} bg-navy-800 dark:bg-dark-card flex flex-col border-r border-transparent dark:border-dark-border transition-all duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:z-30`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 border-b border-white/10">
          <div className={`flex items-center gap-3.5 ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Hammer className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div>
                <span className="text-white font-bold text-lg tracking-tight">MarcenaFlow</span>
                <p className="text-gray-500 text-xs mt-0.5">Gestão Operacional</p>
              </div>
            )}
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors active:scale-95"
            aria-label="Fechar menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-5 space-y-1.5 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-500">
              Menu Principal
            </p>
          )}

          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/app'}
              onClick={() => {
                // Close sidebar on mobile when a link is tapped
                if (window.innerWidth < 1024) onClose()
              }}
              className={({ isActive }) =>
                `flex items-center gap-3.5 ${collapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 shadow-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
              title={collapsed ? item.name : undefined}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full" />
                  )}
                  <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${
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
                  {!collapsed && (
                    <>
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
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle — desktop only */}
        <div className="hidden lg:block px-3 py-2 border-t border-white/10">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-xl transition-all duration-200"
            title={collapsed ? 'Expandir menu' : 'Minimizar menu'}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <>
                <PanelLeftClose className="w-5 h-5" />
                <span className="text-xs font-medium">Minimizar</span>
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 py-4 sm:py-5 border-t border-white/10">
          <div className={`flex items-center gap-3.5 ${collapsed ? 'justify-center' : 'px-2'}`}>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
              <span className="text-white text-sm font-bold">DU</span>
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Eduardo Silva</p>
                <p className="text-xs text-gray-500 truncate">Gerente de Operações</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
