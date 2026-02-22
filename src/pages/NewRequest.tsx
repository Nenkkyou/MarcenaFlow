import Header from '../components/Header'
import RequestForm from '../components/RequestForm'

export default function NewRequest() {
  return (
    <>
      <Header title="Nova Solicitação" subtitle="Crie uma nova solicitação para a equipe" />

      <main className="p-8">
        <RequestForm />
      </main>
    </>
  )
}
