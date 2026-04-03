import { ReactNode, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard, Users, Ticket, Package,
  UserCog, FileText, LogOut, DollarSign,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import logoSrc from "../../assets/soccer_mind_sem_background.png";

interface MainLayoutProps {
  children: ReactNode;
}

const EXPANDED_WIDTH = 260;
const COLLAPSED_WIDTH = 78;

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/clients", icon: Users, label: "Clientes" },
    { path: "/service-desk", icon: Ticket, label: "Service Desk" },
    { path: "/upsells", icon: Package, label: "Upsells" },
    { path: "/pricing", icon: DollarSign, label: "Preços" },
    { path: "/contracts", icon: FileText, label: "Contratos" },
    { path: "/users", icon: UserCog, label: "Usuários" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg, #060d18 0%, #0a1929 50%, #080f1e 100%)" }}
    >
      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 relative"
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          background: "rgba(8, 15, 30, 0.85)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          transition: "width 250ms cubic-bezier(0.4,0,0.2,1), min-width 250ms cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}
      >
        {/* Logo + Collapse button */}
        <div
          className="flex items-center justify-between flex-shrink-0"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            padding: collapsed ? "16px 0" : "16px 16px",
            transition: "padding 250ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center justify-center overflow-hidden"
            style={{
              flex: collapsed ? "none" : "1",
              width: collapsed ? "100%" : "auto",
              transition: "all 250ms cubic-bezier(0.4,0,0.2,1)",
            }}
          >
            {collapsed ? (
              <img
                src={logoSrc}
                alt="Soccer Mind"
                style={{ height: "32px", width: "32px", objectFit: "contain" }}
              />
            ) : (
              <img
                src={logoSrc}
                alt="Soccer Mind"
                style={{ height: "52px", width: "auto" }}
              />
            )}
          </div>

          {/* Collapse toggle */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="flex-shrink-0 flex items-center justify-center rounded-lg transition-all duration-150 ml-2"
              style={{
                width: "28px",
                height: "28px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#334155",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "#334155";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="flex justify-center mt-1 flex-shrink-0">
            <button
              onClick={() => setCollapsed(false)}
              className="flex items-center justify-center rounded-lg transition-all duration-150"
              style={{
                width: "32px",
                height: "32px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#334155",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "#334155";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
              }}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Menu */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto overflow-x-hidden mt-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="relative group/item">
                <button
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center rounded-lg transition-all duration-150"
                  style={{
                    gap: collapsed ? "0" : "10px",
                    padding: collapsed ? "10px 0" : "9px 12px",
                    justifyContent: collapsed ? "center" : "flex-start",
                    background: isActive ? "rgba(34,211,238,0.08)" : "transparent",
                    border: isActive ? "1px solid rgba(34,211,238,0.12)" : "1px solid transparent",
                    color: isActive ? "#22d3ee" : "#475569",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#475569"; }}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium truncate whitespace-nowrap">{item.label}</span>
                  )}
                </button>

                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-150 z-50"
                    style={{
                      background: "rgba(8,15,30,0.95)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#94a3b8",
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User */}
        <div
          className="flex-shrink-0 p-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 mb-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.15)",
                }}
              >
                <span className="text-sm font-semibold" style={{ color: "#22d3ee" }}>
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs truncate" style={{ color: "#475569" }}>{user?.role}</p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="flex justify-center mb-1 py-1">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(34,211,238,0.08)",
                  border: "1px solid rgba(34,211,238,0.15)",
                }}
              >
                <span className="text-sm font-semibold" style={{ color: "#22d3ee" }}>
                  {user?.name.charAt(0)}
                </span>
              </div>
            </div>
          )}

          <div className="relative group/logout">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-lg transition-all text-sm"
              style={{
                padding: collapsed ? "8px 0" : "8px 12px",
                color: "#475569",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "#475569";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>Sair</span>}
            </button>

            {collapsed && (
              <div
                className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none opacity-0 group-hover/logout:opacity-100 transition-opacity duration-150 z-50"
                style={{
                  background: "rgba(8,15,30,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#94a3b8",
                }}
              >
                Sair
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto" style={{ minWidth: 0 }}>
        {children}
      </main>

      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute top-20 left-10 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>
    </div>
  );
}
