import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 ml-72">
        <Outlet />
      </div>
    </div>
  )
}
