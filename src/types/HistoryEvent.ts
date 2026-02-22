export type HistoryEventType =
  | 'solicitacao_criada'
  | 'solicitacao_status'
  | 'solicitacao_prioridade'
  | 'ordem_compra_criada'
  | 'ordem_compra_status'
  | 'equipe_alocada'
  | 'equipe_removida'
  | 'obra_status'
  | 'anexo_adicionado'
  | 'comentario'
  | 'entrega_material'

export interface HistoryEvent {
  id: string
  /** Type of event */
  type: HistoryEventType
  /** Which project this event relates to */
  projectId: string
  /** Human-readable title */
  title: string
  /** Human-readable description */
  description: string
  /** Who triggered the event */
  actor: string
  /** Optional: team involved */
  teamId?: string
  /** Optional: related entity ID (request, supply order, etc.) */
  relatedId?: string
  /** Timestamp */
  createdAt: string
}
