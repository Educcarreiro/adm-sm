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

const cardStyle = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "24px",
};

export function Dashboard() {
  const navigate = useNavigate();
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    activeClubs: 0, openTickets: 0, activeUpsells: 0, mrr: 0, newClientsThisMonth: 0,
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
      case "upsell": return "#22d3ee";
      case "bug": return "#f87171";
      case "feature": return "#818cf8";
      default: return "#94a3b8";
    }
  };

  const getActivityMessage = (ticket: RecentTicket) => {
    switch (ticket.type) {
      case "upsell": return `${ticket.club_name} solicitou novo módulo: ${ticket.title}`;
      case "bug": return `${ticket.club_name} reportou um bug: ${ticket.title}`;
      case "feature": return `${ticket.club_name} sugeriu uma feature: ${ticket.title}`;
      default: return `${ticket.club_name} abriu chamado: ${ticket.title}`;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  const handleAddClient = async (clientData: any) => {
    try {
      await addClub({
        name: clientData.name, plan: clientData.plan,
        monthly_value: clientData.monthlyValue ?? 0,
        active_users: 0, active_upsells: 0,
        status: "active", responsible: clientData.responsible ?? "",
      });
      setShowAddClientModal(false);
      setStats(p => ({ ...p, activeClubs: p.activeClubs + 1, newClientsThisMonth: p.newClientsThisMonth + 1 }));
    } catch (err) { console.error(err); }
  };

  const handleAddUser = async (userData: any) => {
    try {
      await addInternalUser({
        name: userData.name, email: userData.email,
        role: userData.role, permissions: userData.permissions,
        password: userData.password,
      });
      setShowAddUserModal(false);
    } catch (err) { console.error(err); }
  };

  const metrics = [
    { title: "Clubes Ativos", value: loading ? "—" : String(stats.activeClubs), icon: Users, path: "/clients" },
    { title: "Chamados Abertos", value: loading ? "—" : String(stats.openTickets), icon: Ticket, path: "/service-desk" },
    { title: "Upsells Ativos", value: loading ? "—" : String(stats.activeUpsells), icon: Package, path: "/upsells" },
    { title: "Receita Mensal", value: loading ? "—" : `R$ ${stats.mrr.toLocaleString("pt-BR")}`, icon: TrendingUp, path: "/contracts" },
    { title: "Novos no Mês", value: loading ? "—" : String(stats.newClientsThisMonth), icon: UserPlus, path: "/clients" },
  ];

  const quickActions = [
    { label: "Cadastrar Novo Cliente", icon: Plus, onClick: () => setShowAddClientModal(true), primary: true },
    { label: "Adicionar Usuário", icon: UserPlus, onClick: () => setShowAddUserModal(true), primary: false },
    { label: "Ver Chamados", icon: Eye, onClick: () => navigate("/service-desk"), primary: false },
    { label: "Gerenciar Upsells", icon: Settings, onClick: () => navigate("/upsells"), primary: false },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">

        <div className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Dashboard</h1>
          <p className="text-sm" style={{ color: "#475569" }}>Visão geral do sistema Soccer Mind</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(metric.path)}
                className="cursor-pointer transition-all duration-200 group"
                style={{
                  ...cardStyle,
                  cursor: "pointer",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.05)"; }}
              >
                <div className="mb-4">
                  <Icon className="w-5 h-5 transition-colors duration-200" style={{ color: "#334155" }} />
                </div>
                <p className="text-2xl font-semibold tracking-tight text-white mb-1">{metric.value}</p>
                <p className="text-xs" style={{ color: "#475569" }}>{metric.title}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <p className="text-xs font-medium uppercase tracking-widest mb-4" style={{ color: "#334155" }}>Ações Rápidas</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150"
                  style={action.primary ? {
                    background: "linear-gradient(135deg, rgba(8,145,178,0.15) 0%, rgba(34,211,238,0.1) 100%)",
                    border: "1px solid rgba(34,211,238,0.15)",
                    color: "#22d3ee",
                  } : {
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    color: "#475569",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = action.primary ? "#67e8f9" : "#94a3b8";
                    (e.currentTarget as HTMLElement).style.borderColor = action.primary ? "rgba(34,211,238,0.3)" : "rgba(255,255,255,0.1)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = action.primary ? "#22d3ee" : "#475569";
                    (e.currentTarget as HTMLElement).style.borderColor = action.primary ? "rgba(34,211,238,0.15)" : "rgba(255,255,255,0.05)";
                  }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Tickets */}
        <div style={cardStyle}>
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4" style={{ color: "#334155" }} />
            <p className="text-sm font-medium text-white">Chamados Recentes</p>
          </div>
          <div className="space-y-2">
            {loading ? (
              <p className="text-sm" style={{ color: "#334155" }}>Carregando...</p>
            ) : recentTickets.length === 0 ? (
              <p className="text-sm" style={{ color: "#334155" }}>Nenhum chamado ainda.</p>
            ) : (
              recentTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate(`/service-desk/${ticket.id}`)}
                  className="flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
                  style={{ background: "transparent" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: getActivityColor(ticket.type) }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate" style={{ color: "#94a3b8" }}>{getActivityMessage(ticket)}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#334155" }}>{formatTimeAgo(ticket.created_at)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AddClientModal open={showAddClientModal} onClose={() => setShowAddClientModal(false)} onAdd={handleAddClient} />
      <AddUserModal open={showAddUserModal} onClose={() => setShowAddUserModal(false)} onAdd={handleAddUser} />
    </MainLayout>
  );
}
