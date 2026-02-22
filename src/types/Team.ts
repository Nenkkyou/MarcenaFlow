export interface Team {
  id: string
  name: string
  color: string
  members: number
  /** ID of the project this team is currently assigned to (optional) */
  projectId?: string
}
