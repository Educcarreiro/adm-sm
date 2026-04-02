import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import {
  fetchTicketById,
  fetchTicketMessages,
  sendTicketMessage,
  updateTicketStatus,
  subscribeToTicketMessages,
  type Ticket,
  type TicketMessage,
} from "../../lib/ticketsService";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  CheckCircle,
  MessageSquare,
  Package,
  Clock,
} from "lucide-react";

export function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [response, setResponse] = useState("");
  const [sending, setSending] = useState(false);

  const loadData = async () => {
    if (!id) return;
    try {
      const [t, m] = await Promise.all([fetchTicketById(id), fetchTicketMessages(id)]);
      setTicket(t);
      setMessages(m);
    } catch (err) {
      console.error("Erro ao carregar chamado:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const channel = subscribeToTicketMessages(id, () => {
      fetchTicketMessages(id).then(setMessages);
    });
    return () => { channel.unsubscribe(); };
  }, [id]);

  const handleSendResponse = async () => {
    if (!response.trim() || !id || !user) return;
    setSending(true);
    try {
      await sendTicketMessage(id, user.name, response.trim());
      setResponse("");
    } catch (err) {
      console.error("Erro ao enviar resposta:", err);
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: Ticket["status"]) => {
    if (!id) return;
    try {
      await updateTicketStatus(id, newStatus);
      setTicket((prev) => prev ? { ...prev, status: newStatus } : prev);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "support": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "bug": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "feature": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "upsell": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8 text-center text-gray-400">Carregando chamado...</div>
      </MainLayout>
    );
  }

  if (!ticket) {
    return (
      <MainLayout>
        <div className="p-8">
          <p className="text-gray-400">Chamado não encontrado.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8">
        <Button
          onClick={() => navigate("/service-desk")}
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Service Desk
        </Button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold text-white">{ticket.title}</h1>
              <Badge className={getTypeColor(ticket.type)}>
                {ticket.type === "upsell" ? "Solicitar Módulo" : ticket.type}
              </Badge>
              <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
            </div>
            <p className="text-gray-400">{ticket.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Descrição */}
            <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Descrição</h2>
              <p className="text-gray-300 leading-relaxed">{ticket.description}</p>
            </div>

            {/* Conversa */}
            <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Conversa</h2>
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-sm">Nenhuma mensagem ainda.</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.author_role === "admin" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.author_role === "admin"
                          ? "bg-cyan-500/20 border border-cyan-500/30"
                          : "bg-purple-500/20 border border-purple-500/30"
                      }`}>
                        <User className={`w-4 h-4 ${msg.author_role === "admin" ? "text-cyan-400" : "text-purple-400"}`} />
                      </div>
                      <div className={`flex-1 ${msg.author_role === "admin" ? "items-end" : "items-start"} flex flex-col`}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white text-sm">{msg.author_name}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(msg.created_at).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <div className={`rounded-xl px-4 py-2 text-sm ${
                          msg.author_role === "admin"
                            ? "bg-cyan-500/10 text-cyan-100"
                            : "bg-white/5 text-gray-300"
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Digite sua resposta aqui..."
                className="min-h-[120px] bg-[#0a1929]/80 border-white/10 text-white placeholder:text-gray-500 mb-4"
              />
              <Button
                onClick={handleSendResponse}
                disabled={sending || !response.trim()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {sending ? "Enviando..." : "Enviar Resposta"}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Detalhes */}
            <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Detalhes</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500">Cliente</p>
                  </div>
                  <p className="text-white font-medium">{ticket.club_name}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500">Responsável</p>
                  </div>
                  <p className="text-white font-medium">{ticket.responsible ?? "—"}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500">Criado em</p>
                  </div>
                  <p className="text-white font-medium">
                    {new Date(ticket.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-500">Atualizado em</p>
                  </div>
                  <p className="text-white font-medium">
                    {new Date(ticket.updated_at).toLocaleString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
              <Select value={ticket.status} onValueChange={(v) => handleStatusChange(v as Ticket["status"])}>
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mb-4">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="resolved">Resolvido</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-3">
                <Button
                  onClick={() => handleStatusChange("resolved")}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Resolver Chamado
                </Button>

                {ticket.type === "upsell" && (
                  <Button
                    onClick={() => navigate(`/clients/${ticket.club_id}`)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Liberar Módulo
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
