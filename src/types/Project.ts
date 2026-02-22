export interface Project {
  id: string
  name: string
  client: string
  address: string
  status: 'ativa' | 'concluida' | 'pausada'
}
