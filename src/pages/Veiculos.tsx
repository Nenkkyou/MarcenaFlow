import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Car,
  Truck,
  Search,
  Filter,
  ChevronDown,
  X,
  Fuel,
  Wrench,
  Calendar,
  MapPin,
  Users,
  Building2,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingCart,
} from 'lucide-react'
import Header from '../components/Header'
import { mockVehicles } from '../mock/mockVehicles'
import { mockTeams } from '../mock/mockTeams'
import { mockProjects } from '../mock/mockProjects'
import type { Vehicle, VehicleStatus } from '../types'

/* ------------------------------------------------------------------ */
/*  Configs                                                           */
/* ------------------------------------------------------------------ */

const statusConfig: Record<VehicleStatus, { label: string; color: string; bg: string; dot: string }> = {
  disponivel: { label: 'Disponível', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dot: 'bg-emerald-500' },
  em_uso:     { label: 'Em Uso',     color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-500/10',    dot: 'bg-blue-500'    },
  manutencao: { label: 'Manutenção', color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/10',  dot: 'bg-amber-500'  },
}

const typeLabels: Record<string, string> = {
  van: 'Van',
  caminhao: 'Caminhão',
  utilitario: 'Utilitário',
  carro: 'Carro',
}

const maintenanceTypeLabels: Record<string, { label: string; icon: typeof Fuel }> = {
  abastecimento: { label: 'Abastecimento', icon: Fuel },
  manutencao:    { label: 'Manutenção',    icon: Wrench },
  revisao:       { label: 'Revisão',       icon: CheckCircle2 },
  troca_oleo:    { label: 'Troca de Óleo', icon: Wrench },
  pneu:          { label: 'Pneu',          icon: Car },
  outro:         { label: 'Outro',         icon: Wrench },
}

function formatDate(d: string) {
  return new Date(d + (d.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function daysUntil(d: string) {
  const target = new Date(d + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function Veiculos() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

  const filtered = useMemo(() => {
    let vehicles = [...mockVehicles]
    if (statusFilter !== 'all') vehicles = vehicles.filter(v => v.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      vehicles = vehicles.filter(v =>
        v.plate.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.brand.toLowerCase().includes(q)
      )
    }
    return vehicles
  }, [search, statusFilter])

  // Stats
  const inUse = mockVehicles.filter(v => v.status === 'em_uso').length
  const available = mockVehicles.filter(v => v.status === 'disponivel').length
  const inMaintenance = mockVehicles.filter(v => v.status === 'manutencao').length
  const nearMaintenance = mockVehicles.filter(v => daysUntil(v.nextMaintenanceDate) <= 7).length

  return (
    <>
      <Header title="Veículos" subtitle="Frota e controle de locomoção" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{inUse}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Em uso</p>
              </div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{available}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Disponíveis</p>
              </div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                <Wrench className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{inMaintenance}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Manutenção</p>
              </div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${nearMaintenance > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-dark-surface'}`}>
                <AlertTriangle className={`w-5 h-5 ${nearMaintenance > 0 ? 'text-red-500' : 'text-gray-400'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{nearMaintenance}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Revisão próxima</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por placa, modelo ou marca..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            <option value="all">Todos os status</option>
            <option value="em_uso">Em Uso</option>
            <option value="disponivel">Disponível</option>
            <option value="manutencao">Manutenção</option>
          </select>
        </div>

        {/* Vehicles grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(vehicle => {
            const team = mockTeams.find(t => t.id === vehicle.teamId)
            const project = team ? mockProjects.find(p => p.id === team.projectId) : null
            const cfg = statusConfig[vehicle.status]
            const maintDays = daysUntil(vehicle.nextMaintenanceDate)
            const fuelDays = daysUntil(vehicle.nextFuelDate)

            return (
              <button
                key={vehicle.id}
                onClick={() => setSelectedVehicle(vehicle)}
                className="card-hover p-5 text-left w-full cursor-pointer hover:ring-2 hover:ring-blue-500/30 active:scale-[0.98] transition-all"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                    {vehicle.type === 'caminhao' ? (
                      <Truck className={`w-6 h-6 ${cfg.color}`} />
                    ) : (
                      <Car className={`w-6 h-6 ${cfg.color}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.model}</h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.brand} · {vehicle.year} · {vehicle.color}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-gray-100 dark:bg-dark-surface rounded text-gray-700 dark:text-gray-300">{vehicle.plate}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team + Project */}
                {team && (
                  <div className="mb-3 p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{team.name}</span>
                      {project && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">·</span>
                          <Building2 className="w-3 h-3 text-blue-500" />
                          <span className="text-blue-600 dark:text-blue-400 truncate">{project.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-dark-surface rounded-lg">
                    <Gauge className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">{vehicle.odometer.toLocaleString()} km</span>
                  </div>
                  <div className={`flex items-center gap-1.5 p-2 rounded-lg ${fuelDays <= 2 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-dark-surface'}`}>
                    <Fuel className={`w-3.5 h-3.5 ${fuelDays <= 2 ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className={`${fuelDays <= 2 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                      {fuelDays <= 0 ? 'Hoje' : `${fuelDays}d`}
                    </span>
                  </div>
                </div>

                {/* Maintenance alert */}
                {maintDays <= 7 && (
                  <div className={`mt-3 flex items-center gap-2 p-2 rounded-lg text-xs font-medium ${maintDays <= 0 ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    {maintDays <= 0 ? 'Manutenção atrasada!' : `Manutenção em ${maintDays} dia${maintDays !== 1 ? 's' : ''}`}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Car className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum veículo encontrado</p>
          </div>
        )}
      </main>

      {/* Vehicle Detail Drawer */}
      {selectedVehicle && (() => {
        const team = mockTeams.find(t => t.id === selectedVehicle.teamId)
        const project = team ? mockProjects.find(p => p.id === team.projectId) : null
        const cfg = statusConfig[selectedVehicle.status]
        const totalCost = selectedVehicle.maintenanceHistory.reduce((s, m) => s + m.cost, 0)

        return (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedVehicle(null)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                      {selectedVehicle.type === 'caminhao' ? <Truck className={`w-5 h-5 ${cfg.color}`} /> : <Car className={`w-5 h-5 ${cfg.color}`} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{selectedVehicle.model}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{selectedVehicle.plate} · {typeLabels[selectedVehicle.type]}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedVehicle(null)} className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Vehicle info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl text-center">
                    <Gauge className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{selectedVehicle.odometer.toLocaleString()} km</p>
                    <p className="text-[11px] text-gray-500">Hodômetro</p>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl text-center">
                    <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(totalCost)}</p>
                    <p className="text-[11px] text-gray-500">Custo total</p>
                  </div>
                </div>

                {/* Status */}
                <div className={`p-4 rounded-xl border ${cfg.bg} border-gray-100 dark:border-dark-border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                    <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  {team ? (
                    <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span><span className="font-medium">Equipe:</span> {team.name} ({team.leader})</span>
                      </div>
                      {project && (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span><span className="font-medium">Obra:</span> {project.name}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Não alocado a nenhuma equipe</p>
                  )}
                </div>

                {/* Upcoming dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(() => {
                    const d = daysUntil(selectedVehicle.nextFuelDate)
                    return (
                      <div className={`p-3 rounded-xl border ${d <= 2 ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 'bg-gray-50 dark:bg-dark-surface border-gray-100 dark:border-dark-border'}`}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Fuel className="w-3 h-3" /> Próx. Abastecimento</p>
                        <p className={`text-sm font-bold ${d <= 2 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{formatDate(selectedVehicle.nextFuelDate)}</p>
                        <p className="text-[11px] text-gray-500">{d <= 0 ? 'Abastecer hoje!' : `Em ${d} dia${d !== 1 ? 's' : ''}`}</p>
                      </div>
                    )
                  })()}
                  {(() => {
                    const d = daysUntil(selectedVehicle.nextMaintenanceDate)
                    return (
                      <div className={`p-3 rounded-xl border ${d <= 7 ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 'bg-gray-50 dark:bg-dark-surface border-gray-100 dark:border-dark-border'}`}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Wrench className="w-3 h-3" /> Próx. Manutenção</p>
                        <p className={`text-sm font-bold ${d <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>{formatDate(selectedVehicle.nextMaintenanceDate)}</p>
                        <p className="text-[11px] text-gray-500">{d <= 0 ? 'Atrasada!' : `Em ${d} dia${d !== 1 ? 's' : ''}`}</p>
                      </div>
                    )
                  })()}
                </div>

                {/* Maintenance history */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Histórico de Manutenção ({selectedVehicle.maintenanceHistory.length})
                  </p>
                  <div className="space-y-2">
                    {selectedVehicle.maintenanceHistory.map(record => {
                      const mCfg = maintenanceTypeLabels[record.type] || maintenanceTypeLabels.outro
                      const MIcon = mCfg.icon
                      return (
                        <div key={record.id} className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center flex-shrink-0">
                              <MIcon className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{mCfg.label}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{record.description}</p>
                                </div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">{formatCurrency(record.cost)}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                                <span>{formatDate(record.date)}</span>
                                <span>{record.odometer.toLocaleString()} km</span>
                                {record.supplyOrderId && (
                                  <span className="inline-flex items-center gap-1 text-blue-500">
                                    <ShoppingCart className="w-3 h-3" /> Almoxarifado
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Note */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800 dark:text-blue-400">Manutenção e abastecimento</p>
                    <p className="text-xs text-blue-700/70 dark:text-blue-400/60 mt-0.5">
                      Quando um veículo precisa de manutenção ou abastecimento, uma ordem é automaticamente encaminhada ao Almoxarifado para análise e aprovação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      })()}
    </>
  )
}
