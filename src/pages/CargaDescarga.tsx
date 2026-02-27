import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Truck,
  PackageOpen,
  Package,
  ArrowUpRight,
  ArrowDownLeft,
  Wrench,
  Search,
  Calendar,
  Clock,
  Users,
  Car,
  Building2,
  X,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  XCircle,
  ChevronRight,
  PlusCircle,
  Trash2,
  Edit3,
  Play,
} from 'lucide-react'
import Header from '../components/Header'
import { useApp } from '../context/AppContext'
import type { LogisticsEvent, LogisticsEventType, LogisticsEventStatus } from '../types'

const typeConfig: Record<LogisticsEventType, { label: string; icon: typeof Truck; color: string; bg: string }> = {
  carga:                  { label: 'Carga',             icon: ArrowUpRight,  color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-500/10'    },
  descarga:               { label: 'Descarga',          icon: ArrowDownLeft, color: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-500/10'},
  devolucao:              { label: 'Devolução',         icon: PackageOpen,   color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/10'  },
  ferramentas_ida:        { label: 'Ferramentas (Ida)', icon: Package,       color: 'text-teal-600 dark:text-teal-400',    bg: 'bg-teal-50 dark:bg-teal-500/10'    },
  ferramentas_volta:      { label: 'Ferramentas (Volta)',icon: Package,      color: 'text-cyan-600 dark:text-cyan-400',    bg: 'bg-cyan-50 dark:bg-cyan-500/10'    },
  manutencao_equipamento: { label: 'Manut. Equipamento',icon: Wrench,        color: 'text-orange-600 dark:text-orange-400',bg: 'bg-orange-50 dark:bg-orange-500/10'},
}

const statusConfig: Record<LogisticsEventStatus, { label: string; icon: typeof CheckCircle2; color: string; bg: string; dot: string }> = {
  agendado:     { label: 'Agendado',     icon: Calendar,     color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-500/10',    dot: 'bg-blue-500'    },
  em_andamento: { label: 'Em Andamento', icon: Loader2,      color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/10',  dot: 'bg-amber-500'  },
  concluido:    { label: 'Concluído',    icon: CheckCircle2, color: 'text-emerald-600 dark:text-emerald-400',bg: 'bg-emerald-50 dark:bg-emerald-500/10',dot: 'bg-emerald-500'},
  cancelado:    { label: 'Cancelado',    icon: XCircle,      color: 'text-red-600 dark:text-red-400',      bg: 'bg-red-50 dark:bg-red-500/10',      dot: 'bg-red-500'    },
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }) }
function formatDateTime(d: string) { return new Date(d).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) }
function isToday(d: string) { return new Date(d).toDateString() === new Date().toDateString() }
function isPast(d: string) { return new Date(d) < new Date() }

const emptyForm = { type: 'carga' as LogisticsEventType, projectId: '', teamId: '', vehicleId: '', scheduledDate: '', title: '', description: '', items: '' as string, createdBy: '' }

export default function CargaDescarga() {
  const { onOpenSidebar } = useOutletContext<{ onOpenSidebar: () => void }>()
  const { projects, teams, vehicles, logisticsEvents, addLogisticsEvent, updateLogisticsEvent, deleteLogisticsEvent, updateLogisticsEventStatus } = useApp()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<LogisticsEvent | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const selectedEvent = selectedEventId ? logisticsEvents.find(e => e.id === selectedEventId) || null : null

  const filtered = useMemo(() => {
    let events = [...logisticsEvents].sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    if (typeFilter !== 'all') events = events.filter(e => e.type === typeFilter)
    if (statusFilter !== 'all') events = events.filter(e => e.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      events = events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.items.some(i => i.toLowerCase().includes(q)))
    }
    return events
  }, [search, typeFilter, statusFilter, logisticsEvents])

  const scheduled = logisticsEvents.filter(e => e.status === 'agendado').length
  const inProgress = logisticsEvents.filter(e => e.status === 'em_andamento').length
  const completed = logisticsEvents.filter(e => e.status === 'concluido').length
  const todayCount = logisticsEvents.filter(e => isToday(e.scheduledDate)).length

  const grouped = useMemo(() => {
    const map = new Map<string, LogisticsEvent[]>()
    filtered.forEach(e => { const key = new Date(e.scheduledDate).toDateString(); if (!map.has(key)) map.set(key, []); map.get(key)!.push(e) })
    return Array.from(map.entries()).map(([dateStr, events]) => ({ dateStr, date: new Date(dateStr), events }))
  }, [filtered])

  const openCreate = () => { setEditingEvent(null); setFormData(emptyForm); setShowForm(true) }
  const openEdit = (ev: LogisticsEvent) => { setEditingEvent(ev); setFormData({ type: ev.type, projectId: ev.projectId, teamId: ev.teamId || '', vehicleId: ev.vehicleId || '', scheduledDate: ev.scheduledDate.slice(0, 16), title: ev.title, description: ev.description, items: ev.items.join(', '), createdBy: ev.createdBy }); setShowForm(true) }

  const handleSave = () => {
    if (!formData.title || !formData.scheduledDate || !formData.createdBy) return
    const itemsArr = formData.items.split(',').map(s => s.trim()).filter(Boolean)
    if (editingEvent) {
      updateLogisticsEvent(editingEvent.id, { ...formData, items: itemsArr, teamId: formData.teamId || undefined, vehicleId: formData.vehicleId || undefined })
    } else {
      addLogisticsEvent({ ...formData, items: itemsArr, status: 'agendado', teamId: formData.teamId || undefined, vehicleId: formData.vehicleId || undefined })
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => { deleteLogisticsEvent(id); setConfirmDelete(null); if (selectedEventId === id) setSelectedEventId(null) }

  return (
    <>
      <Header title="Carga e Descarga" subtitle="Logística e agendamentos de obras" onOpenSidebar={onOpenSidebar} />

      <main className="p-4 sm:p-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="card p-4 sm:p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center"><Calendar className="w-5 h-5 text-blue-500" /></div><div><p className="text-2xl font-bold text-gray-900 dark:text-white">{scheduled}</p><p className="text-xs text-gray-500 dark:text-gray-400">Agendados</p></div></div></div>
          <div className="card p-4 sm:p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center"><Loader2 className="w-5 h-5 text-amber-500" /></div><div><p className="text-2xl font-bold text-gray-900 dark:text-white">{inProgress}</p><p className="text-xs text-gray-500 dark:text-gray-400">Em andamento</p></div></div></div>
          <div className="card p-4 sm:p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-emerald-500" /></div><div><p className="text-2xl font-bold text-gray-900 dark:text-white">{completed}</p><p className="text-xs text-gray-500 dark:text-gray-400">Concluídos</p></div></div></div>
          <div className="card p-4 sm:p-5"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${todayCount > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-dark-surface'}`}><Clock className={`w-5 h-5 ${todayCount > 0 ? 'text-red-500' : 'text-gray-400'}`} /></div><div><p className="text-2xl font-bold text-gray-900 dark:text-white">{todayCount}</p><p className="text-xs text-gray-500 dark:text-gray-400">Hoje</p></div></div></div>
        </div>

        {/* Filters + Create */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Buscar evento, item ou descrição..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
            <option value="all">Todos os tipos</option>
            <option value="carga">Carga</option><option value="descarga">Descarga</option><option value="devolucao">Devolução</option>
            <option value="ferramentas_ida">Ferramentas (Ida)</option><option value="ferramentas_volta">Ferramentas (Volta)</option>
            <option value="manutencao_equipamento">Manut. Equipamento</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
            <option value="all">Todos os status</option><option value="agendado">Agendado</option><option value="em_andamento">Em Andamento</option><option value="concluido">Concluído</option><option value="cancelado">Cancelado</option>
          </select>
          <button onClick={openCreate} className="btn-primary flex-shrink-0">
            <PlusCircle className="w-5 h-5" /><span className="hidden sm:inline">Novo Agendamento</span>
          </button>
        </div>

        {/* Events timeline */}
        <div className="space-y-6">
          {grouped.map(({ dateStr, date, events }) => {
            const today = isToday(dateStr)
            const past = !today && isPast(dateStr)
            return (
              <div key={dateStr}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`px-3 py-1 rounded-lg text-xs font-bold ${today ? 'bg-red-500 text-white' : past ? 'bg-gray-200 dark:bg-dark-surface text-gray-500 dark:text-gray-400' : 'bg-blue-500 text-white'}`}>
                    {today ? 'HOJE' : date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase().replace('.', '')}
                  </div>
                  <p className={`text-sm font-medium ${past && !today ? 'text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-dark-border" />
                </div>

                <div className="space-y-3 ml-2 sm:ml-4">
                  {events.map(event => {
                    const tCfg = typeConfig[event.type]
                    const sCfg = statusConfig[event.status]
                    const TIcon = tCfg.icon
                    const SIcon = sCfg.icon
                    const project = projects.find(p => p.id === event.projectId)
                    const team = event.teamId ? teams.find(t => t.id === event.teamId) : null
                    const vehicle = event.vehicleId ? vehicles.find(v => v.id === event.vehicleId) : null
                    const time = new Date(event.scheduledDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

                    return (
                      <button key={event.id} onClick={() => setSelectedEventId(event.id)} className="w-full text-left card-hover p-4 hover:ring-2 hover:ring-blue-500/30 active:scale-[0.99] transition-all">
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center flex-shrink-0">
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">{time}</span>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tCfg.bg}`}><TIcon className={`w-5 h-5 ${tCfg.color}`} /></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">{event.title}</h4>
                              <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md flex-shrink-0 ${sCfg.bg} ${sCfg.color}`}><SIcon className="w-3 h-3" />{sCfg.label}</span>
                            </div>
                            <span className={`inline-flex items-center gap-1 text-[11px] font-medium mb-2 px-1.5 py-0.5 rounded ${tCfg.bg} ${tCfg.color}`}><TIcon className="w-3 h-3" />{tCfg.label}</span>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">{event.description}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
                              {project && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {project.name}</span>}
                              {team && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {team.name}</span>}
                              {vehicle && <span className="flex items-center gap-1"><Car className="w-3 h-3" /> {vehicle.plate}</span>}
                              <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {event.items.length} ite{event.items.length !== 1 ? 'ns' : 'm'}</span>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16"><Truck className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" /><p className="text-gray-500 dark:text-gray-400 font-medium">Nenhum evento encontrado</p></div>
        )}
      </main>

      {/* ─── Detail Drawer ─── */}
      {selectedEvent && (() => {
        const tCfg = typeConfig[selectedEvent.type]
        const sCfg = statusConfig[selectedEvent.status]
        const TIcon = tCfg.icon
        const SIcon = sCfg.icon
        const project = projects.find(p => p.id === selectedEvent.projectId)
        const team = selectedEvent.teamId ? teams.find(t => t.id === selectedEvent.teamId) : null
        const vehicle = selectedEvent.vehicleId ? vehicles.find(v => v.id === selectedEvent.vehicleId) : null

        return (
          <>
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEventId(null)} />
            <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-dark-card shadow-2xl overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-4 sm:px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tCfg.bg}`}><TIcon className={`w-5 h-5 ${tCfg.color}`} /></div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{selectedEvent.title}</h2>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-medium mt-0.5 ${tCfg.color}`}><TIcon className="w-3 h-3" />{tCfg.label}</span>
                    </div>
                  </div>
                  <button onClick={() => setSelectedEventId(null)} className="p-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-6">
                {/* Status */}
                <div className={`flex items-center gap-2.5 p-4 rounded-xl ${sCfg.bg}`}><SIcon className={`w-5 h-5 ${sCfg.color}`} /><span className={`text-sm font-semibold ${sCfg.color}`}>{sCfg.label}</span></div>

                {/* Actions — status change */}
                {selectedEvent.status === 'agendado' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateLogisticsEventStatus(selectedEvent.id, 'em_andamento')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-colors"><Play className="w-4 h-4" /> Iniciar</button>
                    <button onClick={() => updateLogisticsEventStatus(selectedEvent.id, 'cancelado')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><XCircle className="w-4 h-4" /> Cancelar</button>
                  </div>
                )}
                {selectedEvent.status === 'em_andamento' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateLogisticsEventStatus(selectedEvent.id, 'concluido')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-500 rounded-xl hover:bg-emerald-600 shadow-md shadow-emerald-500/25 transition-all"><CheckCircle2 className="w-4 h-4" /> Concluir</button>
                    <button onClick={() => updateLogisticsEventStatus(selectedEvent.id, 'cancelado')} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><XCircle className="w-4 h-4" /> Cancelar</button>
                  </div>
                )}

                {/* Date & Time */}
                <div className="p-4 bg-gray-50 dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Agendamento</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{formatDateTime(selectedEvent.scheduledDate)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Criado por {selectedEvent.createdBy} em {formatDate(selectedEvent.createdAt)}</p>
                </div>

                {/* Description */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Descrição</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                </div>

                {/* Linked entities */}
                <div className="space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Vínculos</p>
                  {project && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/20">
                      <div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-blue-500" /><span className="font-semibold text-blue-800 dark:text-blue-400">{project.name}</span></div>
                      <p className="text-xs text-blue-700/70 dark:text-blue-400/60 ml-6">{project.client} — {project.address}</p>
                    </div>
                  )}
                  {team && (
                    <div className="p-3 bg-purple-50 dark:bg-purple-500/5 rounded-xl border border-purple-100 dark:border-purple-500/20">
                      <div className="flex items-center gap-2 text-sm"><Users className="w-4 h-4 text-purple-500" /><span className="font-semibold text-purple-800 dark:text-purple-400">{team.name}</span></div>
                      <p className="text-xs text-purple-700/70 dark:text-purple-400/60 ml-6">{team.leader} · {team.members} membros</p>
                    </div>
                  )}
                  {vehicle && (
                    <div className="p-3 bg-teal-50 dark:bg-teal-500/5 rounded-xl border border-teal-100 dark:border-teal-500/20">
                      <div className="flex items-center gap-2 text-sm"><Car className="w-4 h-4 text-teal-500" /><span className="font-semibold text-teal-800 dark:text-teal-400">{vehicle.model}</span><span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-teal-100 dark:bg-teal-500/20 rounded text-teal-700 dark:text-teal-300">{vehicle.plate}</span></div>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5"><Package className="w-3.5 h-3.5" /> Itens ({selectedEvent.items.length})</p>
                  <div className="space-y-1.5">
                    {selectedEvent.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg border border-gray-100 dark:border-dark-border">
                        <div className="w-6 h-6 rounded-md bg-white dark:bg-dark-card flex items-center justify-center text-[11px] font-bold text-gray-400">{i + 1}</div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit / Delete row */}
                <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-dark-border">
                  <button onClick={() => { openEdit(selectedEvent); setSelectedEventId(null) }} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"><Edit3 className="w-4 h-4" /> Editar</button>
                  <button onClick={() => setConfirmDelete(selectedEvent.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"><Trash2 className="w-4 h-4" /> Excluir</button>
                </div>

                {/* Tip */}
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-purple-800 dark:text-purple-400">Sobre logística</p>
                    <p className="text-xs text-purple-700/70 dark:text-purple-400/60 mt-0.5">Todos os agendamentos de carga, descarga e manutenção de equipamentos são sincronizados com o Almoxarifado e a agenda da equipe.</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      })()}

      {/* ─── Create / Edit Modal ─── */}
      {showForm && (
        <>
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-dark-border" onClick={e => e.stopPropagation()}>
              <div className="sticky top-0 z-10 bg-white/90 dark:bg-dark-card/90 backdrop-blur-md border-b border-gray-100 dark:border-dark-border px-5 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingEvent ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
                <button onClick={() => setShowForm(false)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-xl transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="label-text">Título <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Ex: Carga de madeira para obra X" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Tipo</label>
                    <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as LogisticsEventType }))} className="select-field">
                      {Object.entries(typeConfig).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Data / Hora <span className="text-red-500">*</span></label>
                    <input type="datetime-local" value={formData.scheduledDate} onChange={e => setFormData(p => ({ ...p, scheduledDate: e.target.value }))} className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="label-text">Descrição</label>
                  <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="input-field resize-none" rows={3} placeholder="Detalhes do agendamento..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Obra</label>
                    <select value={formData.projectId} onChange={e => setFormData(p => ({ ...p, projectId: e.target.value }))} className="select-field">
                      <option value="">Selecionar...</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Equipe</label>
                    <select value={formData.teamId} onChange={e => setFormData(p => ({ ...p, teamId: e.target.value }))} className="select-field">
                      <option value="">Nenhuma</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text">Veículo</label>
                    <select value={formData.vehicleId} onChange={e => setFormData(p => ({ ...p, vehicleId: e.target.value }))} className="select-field">
                      <option value="">Nenhum</option>
                      {vehicles.map(v => <option key={v.id} value={v.id}>{v.plate} — {v.model}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-text">Criado por <span className="text-red-500">*</span></label>
                    <input type="text" value={formData.createdBy} onChange={e => setFormData(p => ({ ...p, createdBy: e.target.value }))} className="input-field" placeholder="Seu nome" />
                  </div>
                </div>
                <div>
                  <label className="label-text">Itens (separados por vírgula)</label>
                  <input type="text" value={formData.items} onChange={e => setFormData(p => ({ ...p, items: e.target.value }))} className="input-field" placeholder="Ex: Chapa MDF 15mm, Parafusos, Cola PVA" />
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                  <button onClick={handleSave} disabled={!formData.title || !formData.scheduledDate || !formData.createdBy} className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed">{editingEvent ? 'Salvar' : 'Criar Agendamento'}</button>
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Excluir Agendamento?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">Esta ação não pode ser desfeita.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button onClick={() => handleDelete(confirmDelete)} className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 transition-colors">Excluir</button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
