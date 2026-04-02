import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { AddClientModal } from "../components/AddClientModal";
import { AddUserModal } from "../components/AddUserModal";
import { addClub } from "../../lib/clubsService";
import { addInternalUser } from "../../lib/usersService";
import { supabase } from "../../lib/supabase";
import {
  Users, Ticket, Package, TrendingUp, UserPlus,
  Plus, Eye, Settings, Clock,
} from "lucide-react";
import { Button } from "../components/ui/button";

interface DashboardStats {
  activeClubs: number;
  openTickets: number;
  activeUpsells: number;
  mrr: number;
  newClientsThisMonth: number;
}

interface RecentTicket {
  id: string;
  title: string;
  club_name: string;
  type: string;
  created_at: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    activeClubs: 0,
    openTickets: 0,
    activeUpsells: 0,
    mrr: 0,
    newClientsThisMonth: 0,
  });
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const [
          { count: activeClubs },
          { count: openTickets },
          { data: clubsData },
          { data: contractsData },
          { count: newClients },
          { data: tickets },
        ] = await Promise.all([
          supabase.from("clubs").select("*", { count: "exact", head: true }).eq("status", "active"),
          supabase.from("tickets").select("*", { count: "exact", head: true }).eq("status", "open"),
          supabase.from("clubs").select("active_upsells"),
          supabase.from("contracts").select("monthly_value").eq("status", "active"),
          supabase.from("clubs").select("*", { count: "exact", head: true }).gte("created_at", startOfMonth.toISOString()),
          supabase.from("tickets").select("id, title, club_name, type, created_at").order("created_at", { ascending: false }).limit(5),
        ]);

        const totalUpsells = (clubsData ?? []).reduce((sum, c) => sum + (c.active_upsells ?? 0), 0);
        const mrr = (contractsData ?? []).reduce((sum, c) => sum + (c.monthly_value ?? 0), 0);

        setStats({
          activeClubs: activeClubs ?? 0,
          openTickets: openTickets ?? 0,
          activeUpsells: totalUpsells,
          mrr,
          newClientsThisMonth: newClients ?? 0,
        });

        setRecentTickets(tickets ?? []);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const getActivityColor = (type: string) => {
    switch (type) {
      case "upsell": return "text-green-400";
      case "bug": return "text-red-400";
      case "feature": return "text-purple-400";
      case "support": return "text-orange-400";
      default: return "text-cyan-400";
    }
  };

  const getActivityMessage = (ticket: RecentTicket) => {
    switch (ticket.type) {
      case "upsell": return `${ticket.club_name} solicitou novo módulo: ${ticket.title}`;
      case "bug": return `${ticket.club_name} reportou um bug: ${ticket.title}`;
      case "feature": return `${ticket.club_name} sugeriu uma feature: ${ticket.title}`;
      default: return `${ticket.club_name} abriu chamado de suporte: ${ticket.title}`;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
    return `${Math.floor(hours / 24)} dias atrás`;
  };

  const handleAddClient = async (clientData: any) => {
    try {
      await addClub({
        name: clientData.name,
        plan: clientData.plan,
        monthly_value: clientData.monthlyValue ?? 0,
        active_users: 0,
        active_upsells: 0,
        status: "active",
        responsible: clientData.responsible ?? "",
      });
      setShowAddClientModal(false);
      setStats((prev) => ({ ...prev, activeClubs: prev.activeClubs + 1, newClientsThisMonth: prev.newClientsThisMonth + 1 }));
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
    }
  };

  const handleAddUser = async (userData: any) => {
    try {
      await addInternalUser({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        permissions: userData.permissions,
        password: userData.password,
      });
      setShowAddUserModal(false);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
    }
  };

  const metrics = [
    { title: "Total de Clubes Ativos", value: loading ? "—" : String(stats.activeClubs), icon: Users, color: "cyan", path: "/clients" },
    { title: "Chamados Abertos", value: loading ? "—" : String(stats.openTickets), icon: Ticket, color: "orange", path: "/service-desk" },
    { title: "Upsells Ativos", value: loading ? "—" : String(stats.activeUpsells), icon: Package, color: "green", path: "/upsells" },
    { title: "Receita Mensal (Contratos)", value: loading ? "—" : `R$ ${stats.mrr.toLocaleString("pt-BR")}`, icon: TrendingUp, color: "purple", path: "/contracts" },
    { title: "Novos Clientes no Mês", value: loading ? "—" : String(stats.newClientsThisMonth), icon: UserPlus, color: "blue", path: "/clients" },
  ];

  const quickActions = [
    { label: "Cadastrar Novo Cliente", icon: Plus, onClick: () => setShowAddClientModal(true), color: "cyan" },
    { label: "Adicionar Usuário Interno", icon: UserPlus, onClick: () => setShowAddUserModal(true), color: "purple" },
    { label: "Ver Chamados Abertos", icon: Eye, onClick: () => navigate("/service-desk"), color: "orange" },
    { label: "Gerenciar Upsells", icon: Settings, onClick: () => navigate("/upsells"), color: "green" },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Visão geral do sistema Soccer Mind</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(metric.path)}
                className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-${metric.color}-500/10 border border-${metric.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${metric.color}-400`} />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                <p className="text-sm text-gray-400">{metric.title}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  onClick={action.onClick}
                  className={`h-auto py-4 bg-${action.color}-500/10 hover:bg-${action.color}-500/20 border border-${action.color}-500/20 hover:border-${action.color}-500/30 text-${action.color}-400 hover:text-${action.color}-300 transition-all`}
                  variant="outline"
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <Clock className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-white">Chamados Recentes</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500 text-sm">Carregando...</p>
            ) : recentTickets.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhum chamado ainda.</p>
            ) : (
              recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/service-desk/${ticket.id}`)}
                  className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className={`text-sm ${getActivityColor(ticket.type)}`}>
                      {getActivityMessage(ticket)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(ticket.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddClientModal
        open={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onAdd={handleAddClient}
      />
      <AddUserModal
        open={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAdd={handleAddUser}
      />
    </MainLayout>
  );
}
