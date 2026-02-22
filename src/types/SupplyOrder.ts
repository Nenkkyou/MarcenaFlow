export type SupplyOrderStatus = 'pendente' | 'em_analise' | 'aprovado' | 'comprado' | 'recusado'
export type SupplyCategory = 'ferramenta' | 'insumo' | 'epi' | 'material' | 'outros'

export interface SupplyOrder {
  id: string
  /** Which project/obra this order is for */
  projectId: string
  /** Which team requested it */
  teamId: string
  /** Who created the order (person name) */
  requestedBy: string
  /** Origin: production floor or job site */
  origin: 'producao' | 'obra'
  /** Category of supply */
  category: SupplyCategory
  /** Item name */
  item: string
  /** Quantity requested */
  quantity: number
  /** Unit (un, cx, pct, m, kg, etc.) */
  unit: string
  /** Why it's needed */
  reason: string
  /** Urgency */
  priority: 'baixa' | 'media' | 'alta' | 'urgente'
  /** Current status */
  status: SupplyOrderStatus
  /** Estimated cost (optional, may be filled by mediator) */
  estimatedCost?: number
  /** Mediator notes */
  mediatorNotes?: string
  createdAt: string
  updatedAt: string
}
