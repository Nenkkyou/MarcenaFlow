export type Priority = 'baixa' | 'media' | 'alta' | 'urgente'
export type Status = 'pendente' | 'em_analise' | 'em_producao' | 'finalizado'

export interface Attachment {
  id: string
  name: string
  size: string
  type: string
}

export interface Request {
  id: string
  projectId: string
  teamId: string
  type: string
  description: string
  priority: Priority
  deadline: string
  status: Status
  attachments: Attachment[]
  createdAt: string
  updatedAt: string
}
