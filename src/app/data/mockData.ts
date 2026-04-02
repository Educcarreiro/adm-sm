// Mock data para a plataforma
export interface Club {
  id: string;
  name: string;
  plan: string;
  monthlyValue: number;
  activeUsers: number;
  activeUpsells: number;
  status: "active" | "inactive" | "trial";
  createdAt: string;
  responsible: string;
}

export interface Upsell {
  id: "1" | "2" | "3" | "4" | "5" | "6";
  name: string;
  description: string;
  price: number;
  activeClients: number;
  category: string;
}

export interface Ticket {
  id: string;
  clubId: string;
  clubName: string;
  type: "support" | "bug" | "feature" | "upsell";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  responsible: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface InternalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  avatar?: string;
}

export const mockClubs: Club[] = [
  {
    id: "1",
    name: "Corinthians",
    plan: "Premium",
    monthlyValue: 4000,
    activeUsers: 6,
    activeUpsells: 4,
    status: "active",
    createdAt: "2024-01-15",
    responsible: "Johnny Silva",
  },
  {
    id: "2",
    name: "Flamengo",
    plan: "Enterprise",
    monthlyValue: 5500,
    activeUsers: 9,
    activeUpsells: 5,
    status: "active",
    createdAt: "2024-02-20",
    responsible: "Eduarda Carreiro",
  },
  {
    id: "3",
    name: "Palmeiras",
    plan: "Enterprise",
    monthlyValue: 5500,
    activeUsers: 8,
    activeUpsells: 4,
    status: "active",
    createdAt: "2024-01-10",
    responsible: "Johnny Silva",
  },
  {
    id: "4",
    name: "São Paulo FC",
    plan: "Premium",
    monthlyValue: 4000,
    activeUsers: 5,
    activeUpsells: 3,
    status: "active",
    createdAt: "2024-03-01",
    responsible: "Guilherme Santana",
  },
  {
    id: "5",
    name: "Santos FC",
    plan: "Basic",
    monthlyValue: 2500,
    activeUsers: 3,
    activeUpsells: 1,
    status: "trial",
    createdAt: "2024-03-15",
    responsible: "Eduarda Carreiro",
  },
];

export const mockUpsells: Upsell[] = [
  {
    id: "1",
    name: "Fit Tático",
    description: "Montar esquema tático estratégico.",
    price: 599,
    activeClients: 12,
    category: "Tactics",
  },
  {
    id: "2",
    name: "Ranking de Jogadores",
    description: "Análise completa e comparativa do elenco monitorado.",
    price: 499,
    activeClients: 15,
    category: "Analytics",
  },
  {
    id: "3",
    name: "Player vs Player",
    description: "Análise comparativa estratégica para decisões baseadas em dados.",
    price: 399,
    activeClients: 10,
    category: "Analytics",
  },
  {
    id: "4",
    name: "Health Analytics",
    description: "Análise estratégica do impacto de lesões na performance e longevidade do atleta.",
    price: 699,
    activeClients: 8,
    category: "Medical",
  },
  {
    id: "5",
    name: "Relatório Executivo",
    description: "Geração de relatórios inteligentes com IA sobre o clube ou jogadores.",
    price: 299,
    activeClients: 18,
    category: "Reports",
  },
  {
    id: "6",
    name: "Análises",
    description: "Hub de monitoramento estratégico de análises e comparações.",
    price: 799,
    activeClients: 14,
    category: "Analytics",
  },
];

export const mockTickets: Ticket[] = [
  {
    id: "T-001",
    clubId: "1",
    clubName: "FC Barcelona",
    type: "upsell",
    priority: "high",
    status: "open",
    responsible: "Carlos Silva",
    title: "Solicitar Scouting Intelligence",
    description: "Gostaríamos de ativar o módulo de Scouting Intelligence",
    createdAt: "2024-03-01T10:00:00",
    updatedAt: "2024-03-01T10:00:00",
  },
  {
    id: "T-002",
    clubId: "2",
    clubName: "Manchester United",
    type: "bug",
    priority: "urgent",
    status: "in_progress",
    responsible: "Ana Costa",
    title: "Erro ao exportar relatórios",
    description: "Os relatórios não estão sendo exportados corretamente",
    createdAt: "2024-03-02T14:30:00",
    updatedAt: "2024-03-03T09:15:00",
  },
  {
    id: "T-003",
    clubId: "3",
    clubName: "Paris Saint-Germain",
    type: "feature",
    priority: "medium",
    status: "open",
    responsible: "João Santos",
    title: "Nova funcionalidade de análise",
    description: "Sugestão de adicionar análise de set pieces",
    createdAt: "2024-03-03T11:00:00",
    updatedAt: "2024-03-03T11:00:00",
  },
  {
    id: "T-004",
    clubId: "4",
    clubName: "Bayern Munich",
    type: "support",
    priority: "low",
    status: "resolved",
    responsible: "Carlos Silva",
    title: "Dúvida sobre permissões",
    description: "Como configurar permissões para novos usuários?",
    createdAt: "2024-02-28T16:00:00",
    updatedAt: "2024-03-01T10:30:00",
  },
];

export const mockInternalUsers: InternalUser[] = [
  {
    id: "1",
    name: "Johnny Silva",
    email: "johnny@soccermind.com.br",
    role: "Administrador",
    permissions: ["all"],
  },
  {
    id: "2",
    name: "Eduarda Carreiro",
    email: "eduarda@soccermind.com.br",
    role: "Administrador",
    permissions: ["all"],
  },
  {
    id: "3",
    name: "Guilherme Santana",
    email: "guilherme@soccermind.com.br",
    role: "PMO",
    permissions: ["view_clients", "manage_tickets", "manage_upsells", "view_analytics"],
  },
  {
    id: "4",
    name: "Lais Cardoso",
    email: "lais@soccermind.com.br",
    role: "Desenvolvedor Sênior",
    permissions: ["view_clients", "manage_tickets", "view_analytics"],
  },
];

export const clubUpsells: Record<string, string[]> = {
  "1": ["1", "2", "3", "5"], // Corinthians
  "2": ["1", "2", "3", "4", "5"], // Flamengo
  "3": ["1", "2", "5", "6"], // Palmeiras
  "4": ["2", "3", "5"], // São Paulo FC
  "5": ["5"], // Santos FC
};