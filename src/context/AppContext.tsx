import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Request } from '../types'
import { mockRequests } from '../mock/mockRequests'

interface AppContextType {
  requests: Request[]
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateRequestStatus: (id: string, status: Request['status']) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>(mockRequests)

  const addRequest = (data: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString()
    const newRequest: Request = {
      ...data,
      id: `req-${String(requests.length + 1).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
    }
    setRequests(prev => [newRequest, ...prev])
  }

  const updateRequestStatus = (id: string, status: Request['status']) => {
    setRequests(prev =>
      prev.map(r =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
      )
    )
  }

  return (
    <AppContext.Provider value={{ requests, addRequest, updateRequestStatus }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
