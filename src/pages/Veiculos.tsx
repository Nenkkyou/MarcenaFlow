import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Car,
  Truck,
  Search,
  X,
  Fuel,
  Wrench,
  Users,
  Building2,
  Gauge,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  ShoppingCart,
  PlusCircle,
  Edit3,
  Trash2,
} from 'lucide-react'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'
import type { Vehicle, VehicleStatus } from '../types'

const statusConfig: Record<VehicleStatus, { label: string; color: string; bg: string; dot: string }> = {
  disponivel: { label: 'Disponível', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dot: 'bg-emerald-500' },
  em_uso:     { label: 'Em Uso',     color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-500/10',    dot: 'bg-blue-500'    },
  manutencao: { label: 'Manutenção', color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/10',  dot: 'bg-amber-500'  },
}

const statusOptions: { value: VehicleStatus; label: string }[] = [
  { value: 'disponivel', label: '🟢 Disponível' },
  { value: 'em_uso', label: '🔵 Em Uso' },
  { value: 'manutencao', label: '🟡 Manutenção' },
]

const typeLabels: Record<string, string> = { van: 'Van', caminhao: 'Caminhão', utilitario: 'Utilitário', carro: 'Carro' }
const typeOptions = Object.entries(typeLabels).map(([v, l]) => ({ value: v, label: l }))

const maintenanceTypeLabels: Record<string, { label: string; icon: typeof Fuel }> = {
  abastecimento: { label: 'Abastecimento', icon: Fuel },
  manutencao:    { label: 'Manutenção',    icon: Wrench },
  revisao:       { label: 'Revisão',       icon: CheckCircle2 },
  troca_oleo:    { label: 'Troca de Óleo', icon: Wrench },
  pneu:          { label: 'Pneu',          icon: Car },
  outro:         { label: 'Outro',         icon: Wrench },
}
const maintTypeOptions = Object.entries(maintenanceTypeLabels).map(([v, c]) => ({ value: v, label: c.label }))

function formatDate(d: string) { return new Date(d + (d.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) }
function formatCurrency(v: number) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }
function daysUntil(d: string) { const t = new Date(d + 'T00:00:00'); const n = new Date(); n.setHours(0,0,0,0); return Math.ceil((t.getTime()-n.getTime())/86400000) }

const emptyForm = { plate: '', model: '', brand: '', year: new Date().getFullYear(), color: '', type: 'carro' as Vehicle['type'], status: 'disponivel' as VehicleStatus, teamId: '', odometer: 0, nextMaintenanceDate: '', nextFuelDate: '' }
const emptyMaintForm = { date: '', type: 'manutencao', description: '', cost: 0, odometer: 0 }

export default function Veiculos() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { vehicles, teams, projects, addVehicle, updateVehicle, deleteVehicle, updateVehicleStatus, addMaintenanceRecord } = useApp()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showMaintForm, setShowMaintForm] = useState(false)
  const [maintData, setMaintData] = useState(emptyMaintForm)

  const filtered = useMemo(() => {
    let list = [...vehicles]
    if (statusFilter !== 'all') list = list.filter(v => v.status === statusFilter)
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(v => v.plate.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q)) }
    return list
  }, [vehicles, search, statusFilter])

  const inUse = vehicles.filter(v => v.status === 'em_uso').length
  const available = vehicles.filter(v => v.status === 'disponivel').length
  const inMaintenance = vehicles.filter(v => v.status === 'manutencao').length
  const nearMaintenance = vehicles.filter(v => daysUntil(v.nextMaintenanceDate) <= 7).length

  const openCreate = () => { setEditingVehicle(null); setFormData(emptyForm); setShowForm(true) }
  const openEdit = (v: Vehicle) => {
    setEditingVehicle(v)
    setFormData({ plate: v.plate, model: v.model, brand: v.brand, year: v.year, color: v.color, type: v.type, status: v.status, teamId: v.teamId || '', odometer: v.odometer, nextMaintenanceDate: v.nextMaintenanceDate, nextFuelDate: v.nextFuelDate })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.plate || !formData.model || !formData.brand) return
    if (editingVehicle) {
      updateVehicle(editingVehicle.id, { ...formData, teamId: formData.teamId || undefined })
    } else {
      addVehicle({ ...formData, teamId: formData.teamId || undefined } as Omit<Vehicle, 'id' | 'maintenanceHistory'>)
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => { deleteVehicle(id); setSelectedVehicle(null); setConfirmDelete(null) }

  const handleAddMaint = () => {
    if (!selectedVehicle || !maintData.date || !maintData.description) return
    addMaintenanceRecord(selectedVehicle.id, { date: maintData.date, type: maintData.type as 'manutencao' | 'abastecimento' | 'revisao' | 'troca_oleo' | 'pneu' | 'outro', description: maintData.description, cost: maintData.cost, odometer: maintData.odometer })
    setMaintData(emptyMaintForm)
    setShowMaintForm(false)
  }

  const vehicle = selectedVehicle ? vehicles.find(v => v.id === selectedVehicle.id) || null : null

  return (
    <>
      <Header title="Veículos" subtitle="Frota e controle de locomoção" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center"><Car className="w-5 h-5 text-blue-500" /></div>
              <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{inUse}</p><p className="text-xs text-gray-500 dark:text-gray-400">Em uso</p></div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div>
              <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{available}</p><p className="text-xs text-gray-500 dark:text-gray-400">Disponíveis</p></div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center"><Wrench className="w-5 h-5 text-amber-500" /></div>
              <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{inMaintenance}</p><p className="text-xs text-gray-500 dark:text-gray-400">Manutenção</p></div>
            </div>
          </div>
          <div className="card p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${nearMaintenance > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-dark-surface'}`}>
                <AlertTriangle className={`w-5 h-5 ${nearMaintenance > 0 ? 'text-red-500' : 'text-gray-400'}`} />
              </div>
              <div><p className="text-2xl font-bold text-gray-900 dark:text-white">{nearMaintenance}</p><p className="text-xs text-gray-500 dark:text-gray-400">Revisão próxima</p></div>
            </div>
          </div>
        </div>

        {/* Search + filter + create */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar por placa, modelo ou marca..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
            <option value="all">Todos os status</option>
            <option value="em_uso">Em Uso</option>
            <option value="disponivel">Disponível</option>
            <option value="manutencao">Manutenção</option>
          </select>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            <PlusCircle className="w-5 h-5" />
            <span className="hidden sm:inline">Novo Veículo</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map(v => {
            const team = teams.find(t => t.id === v.teamId)
            const project = team ? projects.find(p => p.id === team.projectId) : null
            const cfg = statusConfig[v.status]
            const maintDays = daysUntil(v.nextMaintenanceDate)
            const fuelDays = daysUntil(v.nextFuelDate)

            return (
              <button key={v.id} onClick={() => setSelectedVehicle(v)} className="card-hover p-4 sm:p-5 text-left w-full cursor-pointer hover:ring-2 hover:ring-blue-500/30 active:scale-[0.98] transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                    {v.type === 'caminhao' ? <Truck className={`w-6 h-6 ${cfg.color}`} /> : <Car className={`w-6 h-6 ${cfg.color}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{v.model}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{v.brand} · {v.year} · {v.color}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 bg-gray-100 dark:bg-dark-surface rounded text-gray-700 dark:text-gray-300">{v.plate}</span>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} /> {cfg.label}
                      </span>
                    </div>
                  </div>
                </div>
                {team && (
                  <div className="mb-3 p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700 dark:text-gray-300">{team.name}</span>
                      {project && (<><span className="text-gray-300 dark:text-gray-600">·</span><Building2 className="w-3 h-3 text-blue-500" /><span className="text-blue-600 dark:text-blue-400 truncate">{project.name}</span></>)}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 p-2 bg-gray-50 dark:bg-dark-surface rounded-lg"><Gauge className="w-3.5 h-3.5 text-gray-400" /><span className="text-gray-600 dark:text-gray-400">{v.odometer.toLocaleString()} km</span></div>
                  <div className={`flex items-center gap-1.5 p-2 rounded-lg ${fuelDays <= 2 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-dark-surface'}`}>
                    <Fuel className={`w-3.5 h-3.5 ${fuelDays <= 2 ? 'text-red-500' : 'text-gray-400'}`} />
                    <span className={fuelDays <= 2 ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}>{fuelDays <= 0 ? 'Hoje' : `${fuelDays}d`}</span>
                  </div>
                </div>
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
          <div className="text-center py-16"><Car className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum veículo encontrado</p></div>
        )}
      </main>

      {/* ─── Create / Edit Modal ─── */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-dark-border" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-5 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingVehicle ? 'Editar Veículo' : 'Novo Veículo'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Placa <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.plate} onChange={e => setFormData(p => ({ ...p, plate: e.target.value.toUpperCase() }))} className="input-field font-mono" placeholder="ABC-1234" maxLength={8} />
                  </div>
                  <div>
                    <label className="label-text">Tipo</label>
                    <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as Vehicle['type'] }))} className="select-field">
                      {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Modelo <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.model} onChange={e => setFormData(p => ({ ...p, model: e.target.value }))} className="input-field" placeholder="Ex: Sprinter" />
                  </div>
                  <div>
                    <label className="label-text">Marca <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.brand} onChange={e => setFormData(p => ({ ...p, brand: e.target.value }))} className="input-field" placeholder="Ex: Mercedes" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Ano</label>
                    <input type="number" value={formData.year} onChange={e => setFormData(p => ({ ...p, year: Number(e.target.value) }))} className="input-field" min={2000} max={2030} />
                  </div>
                  <div>
                    <label className="label-text">Cor</label>
                    <input type="text" value={formData.color} onChange={e => setFormData(p => ({ ...p, color: e.target.value }))} className="input-field" placeholder="Branco" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Hodômetro (km)</label>
                    <input type="number" value={formData.odometer} onChange={e => setFormData(p => ({ ...p, odometer: Number(e.target.value) }))} className="input-field" min={0} />
                  </div>
                  <div>
                    <label className="label-text">Status</label>
                    <select value={formData.status} onChange={e => setFormData(p => ({ ...p, status: e.target.value as VehicleStatus }))} className="select-field">
                      {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-text">Equipe Alocada</label>
                  <select value={formData.teamId} onChange={e => setFormData(p => ({ ...p, teamId: e.target.value }))} className="select-field">
                    <option value="">Nenhuma</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Próx. Manutenção</label>
                    <input type="date" value={formData.nextMaintenanceDate} onChange={e => setFormData(p => ({ ...p, nextMaintenanceDate: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="label-text">Próx. Abastecimento</label>
                    <input type="date" value={formData.nextFuelDate} onChange={e => setFormData(p => ({ ...p, nextFuelDate: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                  <button onClick={handleSave} disabled={!formData.plate || !formData.model || !formData.brand} className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">{editingVehicle ? 'Salvar' : 'Adicionar Veículo'}</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ─── Delete Confirmation ─── */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-100 dark:border-dark-border" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 bg-red-50 dark:bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Excluir Veículo?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Todos os dados e histórico do veículo serão removidos.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Vehicle Detail Drawer */}
      {vehicle && (() => {
        const team = teams.find(t => t.id === vehicle.teamId)
        const project = team ? projects.find(p => p.id === team.projectId) : null
        const cfg = statusConfig[vehicle.status]
        const totalCost = vehicle.maintenanceHistory.reduce((s, m) => s + m.cost, 0)

        return (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedVehicle(null)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                      {vehicle.type === 'caminhao' ? <Truck className={`w-5 h-5 ${cfg.color}`} /> : <Car className={`w-5 h-5 ${cfg.color}`} />}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{vehicle.model}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{vehicle.plate} · {typeLabels[vehicle.type]}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedVehicle(null)} className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => { openEdit(vehicle); setSelectedVehicle(null) }} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"><Edit3 className="w-3.5 h-3.5" /> Editar</button>
                  <select value={vehicle.status} onChange={e => { updateVehicleStatus(vehicle.id, e.target.value as VehicleStatus); setSelectedVehicle({ ...vehicle, status: e.target.value as VehicleStatus }) }} className="px-3 py-2 text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg border-0 focus:ring-2 focus:ring-amber-500/40 cursor-pointer">
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <button onClick={() => setShowMaintForm(true)} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors"><Wrench className="w-3.5 h-3.5" /> + Manutenção</button>
                  <button onClick={() => { setConfirmDelete(vehicle.id); setSelectedVehicle(null) }} className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /> Excluir</button>
                </div>

                {/* Add maintenance inline */}
                {showMaintForm && (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 space-y-3">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Registrar Manutenção</p>
                    <select value={maintData.type} onChange={e => setMaintData(p => ({ ...p, type: e.target.value }))} className="select-field !py-2 text-sm">
                      {maintTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <input type="text" value={maintData.description} onChange={e => setMaintData(p => ({ ...p, description: e.target.value }))} className="input-field !py-2 text-sm" placeholder="Descrição *" />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="date" value={maintData.date} onChange={e => setMaintData(p => ({ ...p, date: e.target.value }))} className="input-field !py-2 text-sm" />
                      <input type="number" value={maintData.cost || ''} onChange={e => setMaintData(p => ({ ...p, cost: Number(e.target.value) }))} className="input-field !py-2 text-sm" placeholder="Custo R$" min={0} />
                      <input type="number" value={maintData.odometer || ''} onChange={e => setMaintData(p => ({ ...p, odometer: Number(e.target.value) }))} className="input-field !py-2 text-sm" placeholder="Km" min={0} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setShowMaintForm(false); setMaintData(emptyMaintForm) }} className="btn-secondary flex-1 justify-center !py-2 text-xs">Cancelar</button>
                      <button onClick={handleAddMaint} disabled={!maintData.date || !maintData.description} className="btn-primary flex-1 justify-center !py-2 text-xs disabled:opacity-40">Registrar</button>
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl text-center"><Gauge className="w-5 h-5 text-gray-400 mx-auto mb-1" /><p className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.odometer.toLocaleString()} km</p><p className="text-[11px] text-gray-500">Hodômetro</p></div>
                  <div className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl text-center"><DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" /><p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(totalCost)}</p><p className="text-[11px] text-gray-500">Custo total</p></div>
                </div>

                {/* Status card */}
                <div className={`p-4 rounded-xl border ${cfg.bg} border-gray-100 dark:border-dark-border`}>
                  <div className="flex items-center gap-2 mb-2"><span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} /><span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span></div>
                  {team ? (
                    <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /><span><span className="font-medium">Equipe:</span> {team.name} ({team.leader})</span></div>
                      {project && <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" /><span><span className="font-medium">Obra:</span> {project.name}</span></div>}
                    </div>
                  ) : <p className="text-sm text-gray-500 dark:text-gray-400">Não alocado a nenhuma equipe</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(() => { const d = daysUntil(vehicle.nextFuelDate); return (
                    <div className={`p-3 rounded-xl border ${d <= 2 ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20' : 'bg-gray-50 dark:bg-dark-surface border-gray-100 dark:border-dark-border'}`}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Fuel className="w-3 h-3" /> Próx. Abastecimento</p>
                      <p className={`text-sm font-bold ${d <= 2 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>{formatDate(vehicle.nextFuelDate)}</p>
                      <p className="text-[11px] text-gray-500">{d <= 0 ? 'Abastecer hoje!' : `Em ${d} dia${d !== 1 ? 's' : ''}`}</p>
                    </div>
                  ) })()}
                  {(() => { const d = daysUntil(vehicle.nextMaintenanceDate); return (
                    <div className={`p-3 rounded-xl border ${d <= 7 ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20' : 'bg-gray-50 dark:bg-dark-surface border-gray-100 dark:border-dark-border'}`}>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1 flex items-center gap-1"><Wrench className="w-3 h-3" /> Próx. Manutenção</p>
                      <p className={`text-sm font-bold ${d <= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>{formatDate(vehicle.nextMaintenanceDate)}</p>
                      <p className="text-[11px] text-gray-500">{d <= 0 ? 'Atrasada!' : `Em ${d} dia${d !== 1 ? 's' : ''}`}</p>
                    </div>
                  ) })()}
                </div>

                {/* History */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Histórico ({vehicle.maintenanceHistory.length})</p>
                  <div className="space-y-2">
                    {vehicle.maintenanceHistory.map(record => {
                      const mCfg = maintenanceTypeLabels[record.type] || maintenanceTypeLabels.outro
                      const MIcon = mCfg.icon
                      return (
                        <div key={record.id} className="p-3 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center flex-shrink-0"><MIcon className="w-4 h-4 text-gray-500" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div><p className="text-sm font-semibold text-gray-900 dark:text-white">{mCfg.label}</p><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{record.description}</p></div>
                                <span className="text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">{formatCurrency(record.cost)}</span>
                              </div>
                              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400">
                                <span>{formatDate(record.date)}</span>
                                <span>{record.odometer.toLocaleString()} km</span>
                                {record.supplyOrderId && <span className="inline-flex items-center gap-1 text-blue-500"><ShoppingCart className="w-3 h-3" /> Almoxarifado</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
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
