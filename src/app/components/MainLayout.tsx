import { ReactNode, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import {
  LayoutDashboard, Users, Ticket, Package,
  UserCog, FileText, LogOut, DollarSign,
} from "lucide-react";
import logoSrc from "../../assets/soccer_mind_sem_background.png";

interface MainLayoutProps {
  children: ReactNode;
}

const MIN_WIDTH = 180;
const MAX_WIDTH = 320;
const DEFAULT_WIDTH = 240;

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH);
  const isResizing = useRef(false);

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/clients", icon: Users, label: "Clientes" },
    { path: "/service-desk", icon: Ticket, label: "Service Desk" },
    { path: "/upsells", icon: Package, label: "Upsells" },
    { path: "/pricing", icon: DollarSign, label: "Preços" },
    { path: "/contracts", icon: FileText, label: "Contratos" },
    { path: "/users", icon: UserCog, label: "Usuários" },
  ];

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;

    const startX = e.clientX;
    const startWidth = sidebarWidth;

    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      const delta = e.clientX - startX;
      const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      isResizing.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, [sidebarWidth]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #060d18 0%, #0a1929 50%, #080f1e 100%)" }}>

      {/* Sidebar */}
      <aside
        className="flex flex-col flex-shrink-0 relative"
        style={{
          width: sidebarWidth,
          background: "rgba(8, 15, 30, 0.8)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          transition: isResizing.current ? "none" : undefined,
        }}
      >
        {/* Logo */}
        <div className="p-5 flex flex-col items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <img src={logoSrc} alt="Soccer Mind" style={{ height: "72px", width: "auto" }} />
          <p className="text-xs mt-2 tracking-wide" style={{ color: "#334155" }}>Painel Administrativo</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group"
                style={{
                  background: isActive ? "rgba(34,211,238,0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(34,211,238,0.12)" : "1px solid transparent",
                  color: isActive ? "#22d3ee" : "#475569",
                }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#475569"; }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {sidebarWidth > 160 && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
              <span className="text-sm font-semibold" style={{ color: "#22d3ee" }}>
                {user?.name.charAt(0)}
              </span>
            </div>
            {sidebarWidth > 160 && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs truncate" style={{ color: "#475569" }}>{user?.role}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all text-sm"
            style={{ color: "#475569" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <LogOut className="w-4 h-4" />
            {sidebarWidth > 160 && <span>Sair</span>}
          </button>
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 right-0 h-full w-1 cursor-col-resize z-10 transition-colors"
          style={{ background: "transparent" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(34,211,238,0.2)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>

      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(34,211,238,0.03) 0%, transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.03) 0%, transparent 70%)", filter: "blur(40px)" }} />
      </div>
    </div>
  );
}
