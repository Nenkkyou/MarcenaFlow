import { useOutletContext } from 'react-router-dom'
import Header from '../components/Header'
import RequestForm from '../components/RequestForm'

export default function NewRequest() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()

  return (
    <>
      <Header title="Nova Solicitação" subtitle="Crie uma nova solicitação para a equipe" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8">
        <RequestForm />
      </main>
    </>
  )
}
