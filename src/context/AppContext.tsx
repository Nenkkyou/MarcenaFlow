import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Request, Project, Team, TeamMember, Vehicle, VehicleStatus, VehicleMaintenanceRecord, SupplyOrder, SupplyOrderStatus, LogisticsEvent, LogisticsEventStatus } from '../types'
import { mockRequests } from '../mock/mockRequests'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import { mockVehicles } from '../mock/mockVehicles'
import { mockSupplyOrders } from '../mock/mockSupplyOrders'
import { mockLogisticsEvents } from '../mock/mockLogistics'

/* ------------------------------------------------------------------ */
/*  Helper                                                            */
/* ------------------------------------------------------------------ */
let _uid = Date.now()
const uid = (prefix: string) => `${prefix}-${++_uid}`
const now = () => new Date().toISOString()

/* ------------------------------------------------------------------ */
/*  Context type                                                      */
/* ------------------------------------------------------------------ */
interface AppContextType {
  /* Requests */
  requests: Request[]
  addRequest: (data: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRequest: (id: string, data: Partial<Omit<Request, 'id' | 'createdAt'>>) => void
  deleteRequest: (id: string) => void
  updateRequestStatus: (id: string, status: Request['status']) => void

  /* Projects */
  projects: Project[]
  addProject: (data: Omit<Project, 'id' | 'updates'>) => void
  updateProject: (id: string, data: Partial<Omit<Project, 'id'>>) => void
  deleteProject: (id: string) => void
  updateProjectStatus: (id: string, status: Project['status']) => void

  /* Teams */
  teams: Team[]
  addTeam: (data: Omit<Team, 'id' | 'memberList' | 'members'> & { memberList?: TeamMember[] }) => void
  updateTeam: (id: string, data: Partial<Omit<Team, 'id'>>) => void
  deleteTeam: (id: string) => void
  addTeamMember: (teamId: string, member: Omit<TeamMember, 'id'>) => void
  removeTeamMember: (teamId: string, memberId: string) => void

  /* Vehicles */
  vehicles: Vehicle[]
  addVehicle: (data: Omit<Vehicle, 'id' | 'maintenanceHistory'>) => void
  updateVehicle: (id: string, data: Partial<Omit<Vehicle, 'id'>>) => void
  deleteVehicle: (id: string) => void
  updateVehicleStatus: (id: string, status: VehicleStatus) => void
  addMaintenanceRecord: (vehicleId: string, record: Omit<VehicleMaintenanceRecord, 'id'>) => void

  /* Supply Orders */
  supplyOrders: SupplyOrder[]
  addSupplyOrder: (data: Omit<SupplyOrder, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateSupplyOrder: (id: string, data: Partial<Omit<SupplyOrder, 'id'>>) => void
  deleteSupplyOrder: (id: string) => void
  updateSupplyOrderStatus: (id: string, status: SupplyOrderStatus) => void

  /* Logistics */
  logisticsEvents: LogisticsEvent[]
  addLogisticsEvent: (data: Omit<LogisticsEvent, 'id' | 'createdAt'>) => void
  updateLogisticsEvent: (id: string, data: Partial<Omit<LogisticsEvent, 'id'>>) => void
  deleteLogisticsEvent: (id: string) => void
  updateLogisticsEventStatus: (id: string, status: LogisticsEventStatus) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */
export function AppProvider({ children }: { children: ReactNode }) {
  /* ── Requests ── */
  const [requests, setRequests] = useState<Request[]>(mockRequests)

  const addRequest = (data: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => {
    const n = now()
    setRequests(prev => [{ ...data, id: uid('req'), createdAt: n, updatedAt: n }, ...prev])
  }
  const updateRequest = (id: string, data: Partial<Omit<Request, 'id' | 'createdAt'>>) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, ...data, updatedAt: now() } : r))
  const deleteRequest = (id: string) => setRequests(prev => prev.filter(r => r.id !== id))
  const updateRequestStatus = (id: string, status: Request['status']) =>
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status, updatedAt: now() } : r))

  /* ── Projects ── */
  const [projects, setProjects] = useState<Project[]>(mockProjects)

  const addProject = (data: Omit<Project, 'id' | 'updates'>) =>
    setProjects(prev => [{ ...data, id: uid('proj'), updates: [] }, ...prev])
  const updateProject = (id: string, data: Partial<Omit<Project, 'id'>>) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  const deleteProject = (id: string) => setProjects(prev => prev.filter(p => p.id !== id))
  const updateProjectStatus = (id: string, status: Project['status']) =>
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status } : p))

  /* ── Teams ── */
  const [teams, setTeams] = useState<Team[]>(mockTeams)

  const addTeam = (data: Omit<Team, 'id' | 'memberList' | 'members'> & { memberList?: TeamMember[] }) => {
    const ml = data.memberList || []
    setTeams(prev => [{ ...data, id: uid('team'), memberList: ml, members: ml.length }, ...prev])
  }
  const updateTeam = (id: string, data: Partial<Omit<Team, 'id'>>) =>
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  const deleteTeam = (id: string) => setTeams(prev => prev.filter(t => t.id !== id))
  const addTeamMember = (teamId: string, member: Omit<TeamMember, 'id'>) =>
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t
      const newMember: TeamMember = { ...member, id: uid('mem') }
      return { ...t, memberList: [...t.memberList, newMember], members: t.members + 1 }
    }))
  const removeTeamMember = (teamId: string, memberId: string) =>
    setTeams(prev => prev.map(t => {
      if (t.id !== teamId) return t
      return { ...t, memberList: t.memberList.filter(m => m.id !== memberId), members: t.members - 1 }
    }))

  /* ── Vehicles ── */
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)

  const addVehicle = (data: Omit<Vehicle, 'id' | 'maintenanceHistory'>) =>
    setVehicles(prev => [{ ...data, id: uid('veh'), maintenanceHistory: [] }, ...prev])
  const updateVehicle = (id: string, data: Partial<Omit<Vehicle, 'id'>>) =>
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...data } : v))
  const deleteVehicle = (id: string) => setVehicles(prev => prev.filter(v => v.id !== id))
  const updateVehicleStatus = (id: string, status: VehicleStatus) =>
    setVehicles(prev => prev.map(v => v.id === id ? { ...v, status } : v))
  const addMaintenanceRecord = (vehicleId: string, record: Omit<VehicleMaintenanceRecord, 'id'>) =>
    setVehicles(prev => prev.map(v => {
      if (v.id !== vehicleId) return v
      return { ...v, maintenanceHistory: [{ ...record, id: uid('mnt') }, ...v.maintenanceHistory] }
    }))

  /* ── Supply Orders ── */
  const [supplyOrders, setSupplyOrders] = useState<SupplyOrder[]>(mockSupplyOrders)

  const addSupplyOrder = (data: Omit<SupplyOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const n = now()
    setSupplyOrders(prev => [{ ...data, id: uid('sup'), createdAt: n, updatedAt: n }, ...prev])
  }
  const updateSupplyOrder = (id: string, data: Partial<Omit<SupplyOrder, 'id'>>) =>
    setSupplyOrders(prev => prev.map(o => o.id === id ? { ...o, ...data, updatedAt: now() } : o))
  const deleteSupplyOrder = (id: string) => setSupplyOrders(prev => prev.filter(o => o.id !== id))
  const updateSupplyOrderStatus = (id: string, status: SupplyOrderStatus) =>
    setSupplyOrders(prev => prev.map(o => o.id === id ? { ...o, status, updatedAt: now() } : o))

  /* ── Logistics ── */
  const [logisticsEvents, setLogisticsEvents] = useState<LogisticsEvent[]>(mockLogisticsEvents)

  const addLogisticsEvent = (data: Omit<LogisticsEvent, 'id' | 'createdAt'>) =>
    setLogisticsEvents(prev => [{ ...data, id: uid('log'), createdAt: now() }, ...prev])
  const updateLogisticsEvent = (id: string, data: Partial<Omit<LogisticsEvent, 'id'>>) =>
    setLogisticsEvents(prev => prev.map(e => e.id === id ? { ...e, ...data } : e))
  const deleteLogisticsEvent = (id: string) => setLogisticsEvents(prev => prev.filter(e => e.id !== id))
  const updateLogisticsEventStatus = (id: string, status: LogisticsEventStatus) =>
    setLogisticsEvents(prev => prev.map(e => e.id === id ? { ...e, status } : e))

  return (
    <AppContext.Provider value={{
      requests, addRequest, updateRequest, deleteRequest, updateRequestStatus,
      projects, addProject, updateProject, deleteProject, updateProjectStatus,
      teams, addTeam, updateTeam, deleteTeam, addTeamMember, removeTeamMember,
      vehicles, addVehicle, updateVehicle, deleteVehicle, updateVehicleStatus, addMaintenanceRecord,
      supplyOrders, addSupplyOrder, updateSupplyOrder, deleteSupplyOrder, updateSupplyOrderStatus,
      logisticsEvents, addLogisticsEvent, updateLogisticsEvent, deleteLogisticsEvent, updateLogisticsEventStatus,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}
