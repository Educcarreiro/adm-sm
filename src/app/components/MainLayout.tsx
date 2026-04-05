import { ReactNode, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard, Users, Ticket, Package,
  UserCog, FileText, LogOut, DollarSign,
  ChevronLeft, ChevronRight, MessagesSquare, KeyRound,
} from "lucide-react";
import { addHistoryEntry } from "../../lib/historyService";
import logoSrc from "../../assets/soccer_mind_sem_background.png";
import { ChangePasswordModal } from "./ChangePasswordModal";
import { updateOwnPassword } from "../../lib/usersService";

interface MainLayoutProps {
  children: ReactNode;
}

const EXPANDED = 260;
const COLLAPSED = 78;

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [showOwnPasswordModal, setShowOwnPasswordModal] = useState(false);

  const w = collapsed ? COLLAPSED : EXPANDED;

  const isAdmin = user?.role === "Administrador";

  const PAGE_LABELS: Record<string, string> = {
    "/dashboard": "Dashboard", "/demandas": "Demandas", "/clients": "Clientes",
    "/service-desk": "Service Desk", "/upsells": "Upsells", "/pricing": "Preços",
    "/contracts": "Contratos", "/users": "Usuários",
  };

  useEffect(() => {
    const label = PAGE_LABELS[location.pathname] ?? location.pathname;
    addHistoryEntry({ type: "navigate", description: `Acessou: ${label}`, user: user?.name, meta: { page: location.pathname } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const menuItems = [
    { path: "/dashboard",    icon: LayoutDashboard, label: "Dashboard",    adminOnly: false },
    { path: "/demandas",     icon: MessagesSquare,  label: "Demandas",     adminOnly: false },
    { path: "/clients",      icon: Users,           label: "Clientes",     adminOnly: false },
    { path: "/service-desk", icon: Ticket,          label: "Service Desk", adminOnly: false },
    { path: "/upsells",      icon: Package,         label: "Upsells",      adminOnly: true  },
    { path: "/pricing",      icon: DollarSign,      label: "Preços",       adminOnly: true  },
    { path: "/contracts",    icon: FileText,        label: "Contratos",    adminOnly: true  },
    { path: "/users",        icon: UserCog,         label: "Usuários",     adminOnly: false },
  ].filter((item) => !item.adminOnly || isAdmin);

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(160deg, #060d18 0%, #0a1929 55%, #080f1e 100%)" }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: w,
          minWidth: w,
          background: "rgba(6,12,26,0.92)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          transition: "width 260ms cubic-bezier(0.4,0,0.2,1), min-width 260ms cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Brand block */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: collapsed ? "18px 0 14px" : "22px 18px 18px",
            transition: "padding 260ms cubic-bezier(0.4,0,0.2,1)",
            position: "relative",
          }}
        >
          {collapsed ? (
            /* Collapsed */
            <div className="flex flex-col items-center gap-3">
              <img src={logoSrc} alt="SM" style={{ height: "32px", width: "32px", objectFit: "contain" }} />
              <button
                onClick={() => setCollapsed(false)}
                className="flex items-center justify-center rounded-lg transition-all duration-150"
                style={{
                  width: "28px", height: "28px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.07)",
                  color: "#2d4a5f",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2d4a5f"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            /* Expanded */
            <div>
              {/* Top row: logo + collapse button */}
              <div className="flex items-start justify-between mb-3">
                <img src={logoSrc} alt="Soccer Mind" style={{ height: "44px", width: "auto" }} />
                <button
                  onClick={() => setCollapsed(true)}
                  className="flex items-center justify-center rounded-lg transition-all duration-150"
                  style={{
                    width: "26px", height: "26px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#2d4a5f",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#64748b"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2d4a5f"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Brand text */}
              <div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "#cbd5e1", letterSpacing: "-0.01em", lineHeight: 1.2 }}
                >
                  Soccer Mind
                </p>
                <p
                  className="text-xs"
                  style={{ color: "#334155", marginTop: "3px", letterSpacing: "0.01em" }}
                >
                  Admin Console
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden mt-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <div key={item.path} className="relative group/item">
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center rounded-xl transition-all duration-150"
                  style={{
                    gap: collapsed ? 0 : "10px",
                    padding: collapsed ? "10px 0" : "9px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: active ? "rgba(34,211,238,0.07)" : "transparent",
                    border: active ? "1px solid rgba(34,211,238,0.14)" : "1px solid transparent",
                    color: active ? "#22d3ee" : "#3d5068",
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#7a95b0"; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = "#3d5068"; }}
                >
                  <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate whitespace-nowrap">{item.label}</span>
                  )}
                </button>

                {/* Tooltip */}
                {collapsed && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 z-50"
                    style={{
                      background: "rgba(6,12,26,0.97)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      color: "#94a3b8",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User / logout */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "8px" }}>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.18)", color: "#22d3ee" }}
              >
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                <p className="text-[10px] truncate" style={{ color: "#334155" }}>{user?.role}</p>
              </div>
              <button
                onClick={() => setShowOwnPasswordModal(true)}
                title="Alterar minha senha"
                className="flex-shrink-0 transition-colors"
                style={{ color: "#2d4a5f" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#22d3ee"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2d4a5f"; }}
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {collapsed && (
            <div className="flex flex-col items-center gap-1 mb-1 py-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.18)", color: "#22d3ee" }}
              >
                {user?.name.charAt(0)}
              </div>
              <button
                onClick={() => setShowOwnPasswordModal(true)}
                title="Alterar minha senha"
                className="transition-colors"
                style={{ color: "#2d4a5f" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#22d3ee"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#2d4a5f"; }}
              >
                <KeyRound className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="relative group/logout">
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center justify-center gap-2 rounded-xl transition-all text-sm"
              style={{ padding: collapsed ? "8px 0" : "8px 12px", color: "#3d5068" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#7a95b0"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#3d5068"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <LogOut className="w-[16px] h-[16px] flex-shrink-0" />
              {!collapsed && <span className="text-xs font-medium">Sair</span>}
            </button>
            {collapsed && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover/logout:opacity-100 transition-opacity duration-150 z-50"
                style={{ background: "rgba(6,12,26,0.97)", border: "1px solid rgba(255,255,255,0.09)", color: "#94a3b8", boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
              >
                Sair
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto" style={{ minWidth: 0 }}>
        {children}
      </main>

      <ChangePasswordModal
        open={showOwnPasswordModal}
        onClose={() => setShowOwnPasswordModal(false)}
        userName={user?.name || ""}
        onChangePassword={async (newPassword) => {
          if (user?.email) await updateOwnPassword(user.email, newPassword);
        }}
      />

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.025) 0%, transparent 65%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.025) 0%, transparent 65%)", filter: "blur(80px)" }} />
      </div>
    </div>
  );
}
