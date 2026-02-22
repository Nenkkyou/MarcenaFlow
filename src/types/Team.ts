export interface TeamMember {
  id: string
  name: string
  role: string
  phone: string
  avatar?: string
}

export interface Team {
  id: string
  name: string
  color: string
  members: number
  /** ID of the project this team is currently assigned to (optional) */
  projectId?: string
  /** Leader of the team */
  leader: string
  /** Detailed member list */
  memberList: TeamMember[]
  /** Specialty of the team */
  specialty: string
}
