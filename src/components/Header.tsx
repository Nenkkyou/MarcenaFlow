import { Bell, Search, Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface HeaderProps {
  title: string
  subtitle?: string
  onOpenSidebar?: () => void
}

export default function Header({ title, subtitle, onOpenSidebar }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md border-b border-gray-100 dark:border-dark-border transition-colors duration-200">
      <div className="flex items-center justify-between h-14 sm:h-20 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="lg:hidden p-2 -ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-all active:scale-95"
              aria-label="Abrir menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Buscar solicitações..."
              className="w-72 pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-xl text-sm
                         text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                         focus:bg-white dark:focus:bg-dark-card transition-all duration-150"
            />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2 sm:p-2.5 rounded-xl text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-dark-surface transition-all duration-200"
            title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 sm:p-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300
                             hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white dark:ring-dark-bg animate-pulse" />
          </button>

          {/* Avatar — visible on desktop */}
          <div className="hidden lg:flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-dark-border">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">DU</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Eduardo</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Gerente</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
