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
  Plus, Eye, Settings, Clock, ArrowUpRight,
} from "lucide-react";

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

  const getTicketAccent = (type: string) => {
    switch (type) {
      case "upsell":  return { color: "#22d3ee", bg: "rgba(34,211,238,0.08)" };
      case "bug":     return { color: "#f87171", bg: "rgba(248,113,113,0.08)" };
      case "feature": return { color: "#818cf8", bg: "rgba(129,140,248,0.08)" };
      default:        return { color: "#64748b", bg: "rgba(100,116,139,0.08)" };
    }
  };

  const getTicketMessage = (ticket: RecentTicket) => {
    switch (ticket.type) {
      case "upsell":  return `${ticket.club_name} solicitou novo módulo: ${ticket.title}`;
      case "bug":     return `${ticket.club_name} reportou bug: ${ticket.title}`;
      case "feature": return `${ticket.club_name} sugeriu feature: ${ticket.title}`;
      default:        return `${ticket.club_name} abriu chamado: ${ticket.title}`;
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}min atrás`;
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
    {
      title: "Clubes Ativos",
      value: loading ? "—" : String(stats.activeClubs),
      icon: Users,
      path: "/clients",
      description: "na plataforma",
    },
    {
      title: "Chamados Abertos",
      value: loading ? "—" : String(stats.openTickets),
      icon: Ticket,
      path: "/service-desk",
      description: "aguardando resposta",
    },
    {
      title: "Upsells Ativos",
      value: loading ? "—" : String(stats.activeUpsells),
      icon: Package,
      path: "/upsells",
      description: "módulos em uso",
    },
    {
      title: "Receita Mensal",
      value: loading ? "—" : `R$ ${stats.mrr.toLocaleString("pt-BR")}`,
      icon: TrendingUp,
      path: "/contracts",
      description: "MRR consolidado",
    },
    {
      title: "Novos no Mês",
      value: loading ? "—" : String(stats.newClientsThisMonth),
      icon: UserPlus,
      path: "/clients",
      description: "clubes adicionados",
    },
  ];

  const quickActions = [
    { label: "Cadastrar Cliente",   icon: Plus,     onClick: () => setShowAddClientModal(true), primary: true },
    { label: "Adicionar Usuário",   icon: UserPlus, onClick: () => setShowAddUserModal(true),   primary: false },
    { label: "Ver Chamados",        icon: Eye,      onClick: () => navigate("/service-desk"),   primary: false },
    { label: "Gerenciar Upsells",   icon: Settings, onClick: () => navigate("/upsells"),        primary: false },
  ];

  return (
    <MainLayout>
      <div className="p-8 max-w-[1400px] mx-auto">

        {/* ── Command Header ── */}
        <div className="mb-12 relative">
          {/* Subtle glow behind the header text */}
          <div
            className="absolute -top-6 -left-4 w-72 h-24 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.04) 0%, transparent 70%)", filter: "blur(20px)" }}
          />

          <div className="flex items-start justify-between relative">
            <div>
              {/* Eyebrow tag */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22d3ee" }} />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "#22d3ee" }}
                >
                  Soccer Mind Intelligence Hub
                </span>
              </div>

              <h1
                className="text-3xl font-bold tracking-tight mb-2"
                style={{ color: "#f1f5f9", letterSpacing: "-0.02em" }}
              >
                Command Center
              </h1>
              <p className="text-sm max-w-lg" style={{ color: "#334155", lineHeight: "1.6" }}>
                Central de inteligência, operação e gestão da plataforma Soccer Mind.
              </p>
            </div>

            {/* Live indicator */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(34,211,238,0.05)", border: "1px solid rgba(34,211,238,0.12)" }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "#22d3ee" }}
              />
              <span className="text-[10px] font-medium" style={{ color: "#22d3ee" }}>Live</span>
            </div>
          </div>
        </div>

        {/* ── Metrics ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-10">
          {metrics.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div
                key={i}
                onClick={() => navigate(metric.path)}
                className="cursor-pointer group relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "16px",
                  padding: "20px",
                  transition: "border-color 200ms, box-shadow 200ms",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.15)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(34,211,238,0.04)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Subtle corner glow on hover */}
                <div
                  className="absolute -top-6 -right-6 w-16 h-16 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }}
                />

                <div className="flex items-center justify-between mb-4">
                  <Icon className="w-4 h-4" style={{ color: "#1e3a4a" }} />
                  <ArrowUpRight
                    className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ color: "#22d3ee" }}
                  />
                </div>

                <p
                  className="text-2xl font-bold tracking-tight mb-1"
                  style={{ color: "#e2e8f0", letterSpacing: "-0.02em" }}
                >
                  {metric.value}
                </p>
                <p className="text-xs font-medium mb-0.5" style={{ color: "#475569" }}>{metric.title}</p>
                <p className="text-[10px]" style={{ color: "#1e3a4a" }}>{metric.description}</p>
              </div>
            );
          })}
        </div>

        {/* ── Quick Actions ── */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: "#1e3a4a" }}>
              Ações Rápidas
            </p>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.04)" }} />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button
                  key={i}
                  onClick={action.onClick}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-150 group/action relative overflow-hidden"
                  style={action.primary ? {
                    background: "linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(34,211,238,0.06) 100%)",
                    border: "1px solid rgba(34,211,238,0.2)",
                    color: "#22d3ee",
                  } : {
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#3d5068",
                  }}
                  onMouseEnter={e => {
                    if (action.primary) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.35)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(34,211,238,0.1)";
                    } else {
                      (e.currentTarget as HTMLElement).style.color = "#7a95b0";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.10)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (action.primary) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(34,211,238,0.2)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    } else {
                      (e.currentTarget as HTMLElement).style.color = "#3d5068";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
                    }
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={action.primary ? {
                      background: "rgba(34,211,238,0.12)",
                      border: "1px solid rgba(34,211,238,0.2)",
                    } : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Recent Tickets ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.015)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          {/* Section header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4" style={{ color: "#1e3a4a" }} />
              <span className="text-sm font-semibold" style={{ color: "#94a3b8" }}>Chamados Recentes</span>
            </div>
            <button
              onClick={() => navigate("/service-desk")}
              className="text-[10px] font-medium uppercase tracking-wider transition-colors duration-150"
              style={{ color: "#1e3a4a" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#22d3ee"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#1e3a4a"; }}
            >
              Ver todos →
            </button>
          </div>

          <div className="p-2">
            {loading ? (
              <p className="text-sm px-4 py-6 text-center" style={{ color: "#1e3a4a" }}>Carregando…</p>
            ) : recentTickets.length === 0 ? (
              <p className="text-sm px-4 py-6 text-center" style={{ color: "#1e3a4a" }}>Nenhum chamado ainda.</p>
            ) : (
              recentTickets.map((ticket) => {
                const accent = getTicketAccent(ticket.type);
                return (
                  <div
                    key={ticket.id}
                    onClick={() => navigate(`/service-desk/${ticket.id}`)}
                    className="flex items-start gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-150 group/row"
                    style={{ background: "transparent" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <div
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: accent.bg, border: `1px solid ${accent.color}20` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate" style={{ color: "#64748b" }}>{getTicketMessage(ticket)}</p>
                      <p className="text-[10px] mt-0.5 font-medium" style={{ color: "#1e3a4a" }}>{formatTimeAgo(ticket.created_at)}</p>
                    </div>
                    <ArrowUpRight
                      className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-150"
                      style={{ color: "#334155" }}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <AddClientModal open={showAddClientModal} onClose={() => setShowAddClientModal(false)} onAdd={handleAddClient} />
      <AddUserModal open={showAddUserModal} onClose={() => setShowAddUserModal(false)} onAdd={handleAddUser} />
    </MainLayout>
  );
}
