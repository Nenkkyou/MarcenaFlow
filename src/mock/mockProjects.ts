import type { Project } from '../types'

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Obra Alphaville',
    client: 'Ricardo Mendes',
    address: 'Av. Alphaville, 1200 — Barueri, SP',
    status: 'ativa',
    teamIds: ['team-001', 'team-002'],
    startDate: '2026-01-15',
    expectedEndDate: '2026-04-30',
    description: 'Cozinha planejada completa com ilha central, armários superiores e inferiores em MDF branco TX, com portas basculantes e gavetas soft-close. Inclui closet do quarto master e home office.',
    updates: [
      {
        id: 'upd-001',
        date: '2026-02-20',
        title: 'Corte das peças da cozinha iniciado',
        description: 'Equipe A iniciou o corte de todas as 48 peças em MDF para módulos superiores e inferiores. Previsão de conclusão do corte: 3 dias úteis.',
        author: 'João Silva',
        media: [
          { type: 'photo', url: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=800', caption: 'Corte CNC das peças laterais' },
          { type: 'photo', url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800', caption: 'Peças cortadas organizadas' },
        ],
      },
      {
        id: 'upd-002',
        date: '2026-02-18',
        title: 'Montagem do gabinete da pia iniciada',
        description: 'Roberto Lima e equipe B começaram a pré-montagem do gabinete de pia 1,20m. Gavetas internas e porta basculante em execução.',
        author: 'Roberto Lima',
        media: [
          { type: 'photo', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', caption: 'Gabinete em montagem' },
        ],
      },
      {
        id: 'upd-003',
        date: '2026-02-15',
        title: 'Material recebido na obra',
        description: 'Lote de 30 chapas MDF 18mm entregue no local. Material conferido e armazenado.',
        author: 'Eduardo Silva',
        media: [
          { type: 'photo', url: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800', caption: 'Chapas armazenadas no canteiro' },
        ],
      },
    ],
  },
  {
    id: 'proj-002',
    name: 'Obra Centro',
    client: 'Fernanda Costa',
    address: 'Rua XV de Novembro, 340 — Centro, Curitiba, PR',
    status: 'ativa',
    teamIds: ['team-003', 'team-005'],
    startDate: '2026-01-20',
    expectedEndDate: '2026-05-15',
    description: 'Reforma completa de escritório corporativo. Inclui recepção com painel ripado, 4 estações de trabalho sob medida, sala de reunião com mesa de 3m e armário arquivo.',
    updates: [
      {
        id: 'upd-004',
        date: '2026-02-21',
        title: 'Acabamento do painel da recepção',
        description: 'Equipe C finalizou a pintura e verniz do painel ripado da recepção. Painel de 4m x 2,5m em freijó com acabamento natural.',
        author: 'Ana Rodrigues',
        media: [
          { type: 'photo', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', caption: 'Painel ripado finalizado' },
        ],
      },
      {
        id: 'upd-005',
        date: '2026-02-19',
        title: 'Instalação de ferragens nas estações',
        description: 'Equipe E instalou corrediças telescópicas, dobradiças e puxadores em todas as 4 estações de trabalho.',
        author: 'Maria Santos',
        media: [],
      },
    ],
  },
  {
    id: 'proj-003',
    name: 'Obra Casa Praia',
    client: 'Carlos Alberto',
    address: 'Rua das Dunas, 88 — Guarujá, SP',
    status: 'ativa',
    teamIds: ['team-004'],
    startDate: '2026-02-10',
    expectedEndDate: '2026-06-30',
    description: 'Mobiliário completo de casa de praia. 3 quartos com armários, cozinha americana, banheiros e área gourmet com banco baú e estante com nichos.',
    updates: [
      {
        id: 'upd-006',
        date: '2026-02-22',
        title: 'Medição final dos quartos concluída',
        description: 'Pedro e equipe D finalizaram a conferência de medidas dos 3 quartos. Pequenas diferenças encontradas no quarto 2 (parede inclinada 2°).',
        author: 'Pedro Oliveira',
        media: [
          { type: 'photo', url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', caption: 'Quarto master — medição' },
          { type: 'photo', url: 'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?w=800', caption: 'Área gourmet — layout' },
        ],
      },
    ],
  },
]
