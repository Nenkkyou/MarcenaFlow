export interface ProjectUpdate {
  id: string
  date: string
  title: string
  description: string
  author: string
  /** URLs for photos/videos attached to this update */
  media?: { type: 'photo' | 'video'; url: string; caption?: string }[]
}

export interface Project {
  id: string
  name: string
  client: string
  address: string
  status: 'ativa' | 'concluida' | 'pausada'
  /** IDs of teams assigned to this project */
  teamIds: string[]
  /** Start date */
  startDate: string
  /** Expected end date */
  expectedEndDate: string
  /** Short description */
  description: string
  /** Progress updates with photos/videos */
  updates: ProjectUpdate[]
}
