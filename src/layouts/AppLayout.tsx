import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [sidebarOpen])

  const mainMargin = sidebarCollapsed ? 'lg:ml-[4.5rem]' : 'lg:ml-72'

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
      />
      <div className={`flex-1 ml-0 ${mainMargin} transition-all duration-300`}>
        <Outlet context={{ onOpenSidebar: () => setSidebarOpen(true) }} />
      </div>
    </div>
  )
}
