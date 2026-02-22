export type LogisticsEventType = 'carga' | 'descarga' | 'devolucao' | 'ferramentas_ida' | 'ferramentas_volta' | 'manutencao_equipamento'

export type LogisticsEventStatus = 'agendado' | 'em_andamento' | 'concluido' | 'cancelado'

export interface LogisticsEvent {
  id: string
  type: LogisticsEventType
  status: LogisticsEventStatus
  projectId: string
  teamId?: string
  vehicleId?: string
  /** Scheduled date/time */
  scheduledDate: string
  /** Short title */
  title: string
  /** Detailed description */
  description: string
  /** List of items being transported */
  items: string[]
  /** Who created this event */
  createdBy: string
  createdAt: string
}
