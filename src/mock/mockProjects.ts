import type { Project } from '../types'

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Obra Alphaville',
    client: 'Ricardo Mendes',
    address: 'Av. Alphaville, 1200 — Barueri, SP',
    status: 'ativa',
    teamIds: ['team-001', 'team-002'],
  },
  {
    id: 'proj-002',
    name: 'Obra Centro',
    client: 'Fernanda Costa',
    address: 'Rua XV de Novembro, 340 — Centro, Curitiba, PR',
    status: 'ativa',
    teamIds: ['team-003', 'team-005'],
  },
  {
    id: 'proj-003',
    name: 'Obra Casa Praia',
    client: 'Carlos Alberto',
    address: 'Rua das Dunas, 88 — Guarujá, SP',
    status: 'ativa',
    teamIds: ['team-004'],
  },
]
