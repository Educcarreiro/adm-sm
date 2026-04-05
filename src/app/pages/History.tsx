import { useState, useEffect, useCallback } from "react";
import { MainLayout } from "../components/MainLayout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Search, Trash2, LogIn, LogOut, MousePointerClick, Navigation, Zap } from "lucide-react";
import { getHistory, clearHistory, type HistoryEntry, type HistoryEntryType } from "../../lib/historyService";

const TYPE_CONFIG: Record<HistoryEntryType, { label: string; color: string; Icon: React.ElementType }> = {
  login:    { label: "Login",     color: "rgba(34,197,94,0.15)",  Icon: LogIn },
  logout:   { label: "Logout",    color: "rgba(239,68,68,0.12)",  Icon: LogOut },
  search:   { label: "Busca",     color: "rgba(6,182,212,0.12)",  Icon: Search },
  navigate: { label: "Navegação", color: "rgba(168,85,247,0.12)", Icon: Navigation },
  action:   { label: "Ação",      color: "rgba(251,191,36,0.12)", Icon: Zap },
};

const TYPE_TEXT: Record<HistoryEntryType, string> = {
  login:    "#4ade80",
  logout:   "#f87171",
  search:   "#22d3ee",
  navigate: "#c084fc",
  action:   "#fbbf24",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const ALL_TYPES: HistoryEntryType[] = ["login", "logout", "search", "navigate", "action"];

export function History() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<HistoryEntryType | "all">("all");

  const load = useCallback(() => {
    setEntries(getHistory());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = entries.filter((e) => {
    const matchType = typeFilter === "all" || e.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      e.description.toLowerCase().includes(q) ||
      (e.user ?? "").toLowerCase().includes(q);
    return matchType && matchSearch;
  });

  function handleClear() {
    clearHistory();
    setEntries([]);
  }

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Histórico de Atividades</h1>
            <p className="text-sm" style={{ color: "#475569" }}>
              Registro completo de logins, buscas, navegações e ações na plataforma
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleClear}
            className="flex items-center gap-2 text-sm"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#f87171",
            }}
          >
            <Trash2 className="w-4 h-4" />
            Limpar histórico
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#334155" }} />
            <Input
              placeholder="Buscar no histórico..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#e2e8f0",
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setTypeFilter("all")}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: typeFilter === "all" ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.03)",
                border: typeFilter === "all" ? "1px solid rgba(34,211,238,0.2)" : "1px solid rgba(255,255,255,0.06)",
                color: typeFilter === "all" ? "#22d3ee" : "#475569",
              }}
            >
              Todos
            </button>
            {ALL_TYPES.map((t) => {
              const cfg = TYPE_CONFIG[t];
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: active ? cfg.color : "rgba(255,255,255,0.03)",
                    border: active ? `1px solid ${TYPE_TEXT[t]}33` : "1px solid rgba(255,255,255,0.06)",
                    color: active ? TYPE_TEXT[t] : "#475569",
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {ALL_TYPES.map((t) => {
            const count = entries.filter((e) => e.type === t).length;
            const cfg = TYPE_CONFIG[t];
            const Icon = cfg.Icon;
            return (
              <div
                key={t}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: cfg.color }}
                >
                  <Icon className="w-4 h-4" style={{ color: TYPE_TEXT[t] }} />
                </div>
                <div>
                  <p className="text-lg font-bold text-white leading-none">{count}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#334155" }}>{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {/* Table header */}
          <div
            className="grid text-xs font-semibold px-5 py-3"
            style={{
              gridTemplateColumns: "140px 90px 1fr 160px 120px",
              color: "#334155",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>Data / Hora</span>
            <span>Tipo</span>
            <span>Descrição</span>
            <span>Usuário</span>
            <span></span>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <MousePointerClick className="w-10 h-10 mb-3" style={{ color: "#1e293b" }} />
              <p className="text-sm" style={{ color: "#334155" }}>
                {entries.length === 0
                  ? "Nenhuma atividade registrada ainda."
                  : "Nenhum resultado para o filtro atual."}
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((entry, idx) => {
                const cfg = TYPE_CONFIG[entry.type];
                const Icon = cfg.Icon;
                return (
                  <div
                    key={entry.id}
                    className="grid items-center px-5 py-3.5 transition-colors"
                    style={{
                      gridTemplateColumns: "140px 90px 1fr 160px 120px",
                      borderBottom: idx < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.015)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    {/* Timestamp */}
                    <span className="text-xs font-mono" style={{ color: "#475569" }}>
                      {formatDate(entry.timestamp)}
                    </span>

                    {/* Type badge */}
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{ background: cfg.color, color: TYPE_TEXT[entry.type] }}
                      >
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Description */}
                    <span className="text-sm truncate pr-4" style={{ color: "#94a3b8" }}>
                      {entry.description}
                    </span>

                    {/* User */}
                    <span className="text-sm truncate" style={{ color: "#475569" }}>
                      {entry.user ?? "—"}
                    </span>

                    {/* Meta */}
                    <span className="text-xs" style={{ color: "#1e293b" }}>
                      {entry.meta?.page ?? ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {filtered.length > 0 && (
          <p className="text-xs mt-3 text-right" style={{ color: "#1e293b" }}>
            {filtered.length} de {entries.length} registros
          </p>
        )}
      </div>
    </MainLayout>
  );
}
