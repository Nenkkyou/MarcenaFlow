export type VehicleStatus = 'disponivel' | 'em_uso' | 'manutencao'

export interface VehicleMaintenanceRecord {
  id: string
  date: string
  type: 'abastecimento' | 'manutencao' | 'revisao' | 'troca_oleo' | 'pneu' | 'outro'
  description: string
  cost: number
  odometer: number
  /** Related supply order ID if sent to almoxarifado */
  supplyOrderId?: string
}

export interface Vehicle {
  id: string
  plate: string
  model: string
  brand: string
  year: number
  color: string
  type: 'van' | 'caminhao' | 'utilitario' | 'carro'
  status: VehicleStatus
  /** Team currently using this vehicle */
  teamId?: string
  /** Current odometer reading in km */
  odometer: number
  /** Next maintenance date */
  nextMaintenanceDate: string
  /** Next fuel fill estimate date */
  nextFuelDate: string
  /** Maintenance history */
  maintenanceHistory: VehicleMaintenanceRecord[]
}
