import { PlusCircle, ClipboardList } from 'lucide-react'
import { Link, useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import RequestList from '../components/RequestList'
import { useApp } from '../context/AppContext'

export default function Requests() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { requests } = useApp()

  return (
    <>
      <Header title="Solicitações" subtitle="Todos os pedidos das obras em um só lugar" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {requests.length} solicitaç{requests.length !== 1 ? 'ões' : 'ão'}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Registradas no sistema</p>
            </div>
          </div>
          <Link to="/app/nova-solicitacao" className="btn-primary flex-shrink-0">
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Nova Solicitação</span>
          </Link>
        </div>

        <RequestList requests={requests} />
      </main>
    </>
  )
}
