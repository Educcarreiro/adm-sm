import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { fetchTickets, subscribeToTickets, type Ticket } from "../../lib/ticketsService";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export function ServiceDesk() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const loadTickets = async () => {
    try {
      const data = await fetchTickets();
      setTickets(data);
    } catch (err) {
      console.error("Erro ao carregar tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const channel = subscribeToTickets(loadTickets);
    return () => { channel.unsubscribe(); };
  }, []);

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.club_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesType = typeFilter === "all" || ticket.type === typeFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "support": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "bug": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "feature": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "upsell": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "support": return "Suporte";
      case "bug": return "Bug";
      case "feature": return "Feature";
      case "upsell": return "Upsell";
      default: return type;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "high": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "low": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent": return "Urgente";
      case "high": return "Alta";
      case "medium": return "Média";
      case "low": return "Baixa";
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "in_progress": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "resolved": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "closed": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Aberto";
      case "in_progress": return "Em Progresso";
      case "resolved": return "Resolvido";
      case "closed": return "Fechado";
      default: return status;
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Service Desk</h1>
          <p className="text-gray-400">Gerenciar todos os chamados da plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar chamados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#0f1c2e]/50 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-[#0f1c2e]/50 border-white/10 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1c2e] border-white/10">
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
              <SelectItem value="closed">Fechado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-[#0f1c2e]/50 border-white/10 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1c2e] border-white/10">
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="support">Suporte</SelectItem>
              <SelectItem value="bug">Bug</SelectItem>
              <SelectItem value="feature">Feature</SelectItem>
              <SelectItem value="upsell">Upsell</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="bg-[#0f1c2e]/50 border-white/10 text-white">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1c2e] border-white/10">
              <SelectItem value="all">Todas as Prioridades</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Carregando chamados...</div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Nenhum chamado encontrado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Cliente</TableHead>
                  <TableHead className="text-gray-400">Título</TableHead>
                  <TableHead className="text-gray-400">Tipo</TableHead>
                  <TableHead className="text-gray-400">Prioridade</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Responsável</TableHead>
                  <TableHead className="text-gray-400">Data</TableHead>
                  <TableHead className="text-right text-gray-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className="border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => navigate(`/service-desk/${ticket.id}`)}
                  >
                    <TableCell className="font-medium text-white">{ticket.id}</TableCell>
                    <TableCell className="text-gray-300">{ticket.club_name}</TableCell>
                    <TableCell className="text-gray-300">{ticket.title}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(ticket.type)}>{getTypeLabel(ticket.type)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{ticket.responsible ?? "—"}</TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                        onClick={(e) => { e.stopPropagation(); navigate(`/service-desk/${ticket.id}`); }}
                      >
                        Abrir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
