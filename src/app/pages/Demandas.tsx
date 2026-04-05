import { useState, useEffect, useRef } from "react";
import { MainLayout } from "../components/MainLayout";
import {
  fetchDemandas,
  createDemanda,
  updateDemandaStatus,
  deleteDemanda,
  fetchMessages,
  sendMessage,
  type Demanda,
  type DemandaMessage,
} from "../../lib/demandasService";
import { fetchInternalUsers, type InternalUser } from "../../lib/usersService";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  MessageSquare,
  Circle,
  User,
  Trash2,
} from "lucide-react";

const PRIORITY_CONFIG = {
  urgent: { label: "Urgente", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: AlertTriangle },
  high:   { label: "Alta",    color: "bg-orange-500/10 text-orange-400 border-orange-500/20", icon: AlertCircle },
  normal: { label: "Normal",  color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: Circle },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export function Demandas() {
  const { user } = useAuth();
  const isAdmin = user?.role === "Administrador";

  const [demandas, setDemandas] = useState<Demanda[]>([]);
  const [selected, setSelected] = useState<Demanda | null>(null);
  const [messages, setMessages] = useState<DemandaMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [newForm, setNewForm] = useState({
    title: "",
    priority: "normal" as Demanda["priority"],
    assigned_to: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDemandas().then(setDemandas).catch(console.error);
    fetchInternalUsers().then(setUsers).catch(console.error);

    const channel = supabase
      .channel("demandas-list")
      .on("postgres_changes", { event: "*", schema: "public", table: "demandas" }, () => {
        fetchDemandas().then(setDemandas).catch(console.error);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetchMessages(selected.id).then(setMessages).catch(console.error);

    const channel = supabase
      .channel(`messages-${selected.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "demanda_messages", filter: `demanda_id=eq.${selected.id}` },
        (payload) => {
          const msg = payload.new as DemandaMessage;
          setMessages((prev) => prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selected?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !selected || !user) return;
    setSending(true);
    try {
      const created = await sendMessage({ demanda_id: selected.id, author: user.name, content: input.trim() });
      setMessages((prev) => [...prev, created]);
      setInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleCreate = async () => {
    if (!newForm.title.trim() || !user) return;
    try {
      const created = await createDemanda({
        title: newForm.title.trim(),
        priority: newForm.priority,
        status: "open",
        created_by: user.name,
        assigned_to: newForm.assigned_to || null,
      });
      setDemandas((prev) => [created, ...prev]);
      setSelected(created);
      setNewForm({ title: "", priority: "normal", assigned_to: "" });
      setShowNew(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async () => {
    if (!selected) return;
    await updateDemandaStatus(selected.id, "resolved");
    const updated = { ...selected, status: "resolved" as const };
    setSelected(updated);
    setDemandas((prev) => prev.map((d) => d.id === updated.id ? updated : d));
  };

  const handleDelete = async () => {
    if (!selected || !confirm(`Apagar a demanda "${selected.title}"? Esta ação não pode ser desfeita.`)) return;
    await deleteDemanda(selected.id);
    setDemandas((prev) => prev.filter((d) => d.id !== selected.id));
    setSelected(null);
  };

  const openDemandas = demandas.filter((d) => d.status === "open");
  const resolvedDemandas = demandas.filter((d) => d.status === "resolved");

  return (
    <MainLayout>
      <div className="flex h-screen overflow-hidden">

        {/* ── Left panel ── */}
        <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/10"
          style={{ background: "rgba(6,12,26,0.6)" }}>

          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h1 className="text-white font-bold text-lg">Demandas</h1>
              <p className="text-gray-500 text-xs mt-0.5">{openDemandas.length} abertas</p>
            </div>
            {isAdmin && (
              <Button onClick={() => setShowNew(true)} size="sm"
                className="bg-cyan-500 hover:bg-cyan-600 text-white h-8 w-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {openDemandas.length > 0 && (
              <>
                <p className="text-xs text-gray-600 px-2 py-1 uppercase tracking-wider">Abertas</p>
                {openDemandas.map((d) => (
                  <DemandaItem key={d.id} demanda={d} selected={selected?.id === d.id} onClick={() => setSelected(d)} />
                ))}
              </>
            )}
            {resolvedDemandas.length > 0 && (
              <>
                <p className="text-xs text-gray-600 px-2 py-1 mt-3 uppercase tracking-wider">Resolvidas</p>
                {resolvedDemandas.map((d) => (
                  <DemandaItem key={d.id} demanda={d} selected={selected?.id === d.id} onClick={() => setSelected(d)} />
                ))}
              </>
            )}
            {demandas.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Nenhuma demanda ainda.</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right panel: chat ── */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">

            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between"
              style={{ background: "rgba(6,12,26,0.4)" }}>
              <div>
                <h2 className="text-white font-semibold">{selected.title}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge className={PRIORITY_CONFIG[selected.priority].color + " text-xs"}>
                    {PRIORITY_CONFIG[selected.priority].label}
                  </Badge>
                  {selected.assigned_to && (
                    <div className="flex items-center gap-1 text-xs text-cyan-400">
                      <User className="w-3 h-3" />
                      {selected.assigned_to}
                    </div>
                  )}
                  <span className="text-gray-500 text-xs">criado por {selected.created_by}</span>
                  <span className="text-gray-600 text-xs">· {timeAgo(selected.created_at)}</span>
                </div>
              </div>
              {isAdmin && selected.status === "open" && (
                <Button onClick={handleResolve} variant="outline" size="sm"
                  className="border-green-500/30 text-green-400 hover:bg-green-500/10 text-xs flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />Resolver
                </Button>
              )}
              {selected.status === "resolved" && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" />Resolvida
                  </Badge>
                  {isAdmin && (
                    <Button onClick={handleDelete} variant="ghost" size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-1.5" />Apagar
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-16 text-gray-600">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p>Nenhuma mensagem ainda. Seja o primeiro a comentar!</p>
                </div>
              )}
              {messages.map((msg, i) => {
                const isMe = msg.author === user?.name;
                const showAuthor = i === 0 || messages[i - 1].author !== msg.author;
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                      {showAuthor && (
                        <span className="text-xs text-gray-500 mb-1">
                          {msg.author} · {timeAgo(msg.created_at)}
                        </span>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? "bg-cyan-500 text-white rounded-tr-sm"
                          : "border border-white/10 text-gray-200 rounded-tl-sm"
                      }`} style={isMe ? {} : { background: "rgba(255,255,255,0.05)" }}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {selected.status === "open" ? (
              <div className="px-6 py-4 border-t border-white/10" style={{ background: "rgba(6,12,26,0.4)" }}>
                <div className="flex gap-3 items-center">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                    placeholder="Digite uma mensagem..."
                    className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-cyan-500/50"
                    disabled={sending}
                  />
                  <Button onClick={handleSend} disabled={!input.trim() || sending}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white h-10 w-10 p-0 flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="px-6 py-3 border-t border-white/10 text-center text-gray-600 text-sm"
                style={{ background: "rgba(6,12,26,0.4)" }}>
                Esta demanda foi resolvida e não aceita mais mensagens.
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 flex-col gap-3">
            <MessageSquare className="w-12 h-12 opacity-20" />
            <p>Selecione uma demanda para ver o chat</p>
            {isAdmin && (
              <Button onClick={() => setShowNew(true)} variant="outline"
                className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 mt-2">
                <Plus className="w-4 h-4 mr-2" />Nova Demanda
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal: Nova Demanda */}
      <Dialog open={showNew} onOpenChange={setShowNew}>
        <DialogContent className="bg-[#0f1c2e] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Demanda</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-gray-300">Título</Label>
              <Input
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
                placeholder="Descreva a demanda brevemente"
                autoFocus
              />
            </div>

            <div>
              <Label className="text-gray-300">Prioridade</Label>
              <Select value={newForm.priority} onValueChange={(v: any) => setNewForm({ ...newForm, priority: v })}>
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="urgent" className="text-white focus:bg-white/10 focus:text-white">🔴 Urgente</SelectItem>
                  <SelectItem value="high" className="text-white focus:bg-white/10 focus:text-white">🟠 Alta</SelectItem>
                  <SelectItem value="normal" className="text-white focus:bg-white/10 focus:text-white">🔵 Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-gray-300">Atribuir a</Label>
              <Select value={newForm.assigned_to} onValueChange={(v) => setNewForm({ ...newForm, assigned_to: v })}>
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-2">
                  <SelectValue placeholder="Selecionar colaborador..." />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="none" className="text-white focus:bg-white/10 focus:text-white">Sem atribuição</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.name} className="text-white focus:bg-white/10 focus:text-white">
                      {u.name} — {u.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowNew(false)}
                className="flex-1 bg-white/10 border border-white/15 text-white hover:bg-white/15">Cancelar</Button>
              <Button onClick={handleCreate} disabled={!newForm.title.trim()}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">Criar Demanda</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}

function DemandaItem({ demanda, selected, onClick }: { demanda: Demanda; selected: boolean; onClick: () => void }) {
  const cfg = PRIORITY_CONFIG[demanda.priority];
  const Icon = cfg.icon;
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-3 rounded-xl transition-all border ${
      selected
        ? "bg-cyan-500/10 border-cyan-500/20"
        : "border-transparent hover:bg-white/5 hover:border-white/5"
    } ${demanda.status === "resolved" ? "opacity-50" : ""}`}>
      <div className="flex items-start gap-2">
        <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
          demanda.priority === "urgent" ? "text-red-400" :
          demanda.priority === "high" ? "text-orange-400" : "text-blue-400"
        }`} />
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${selected ? "text-cyan-300" : "text-gray-300"}`}>
            {demanda.title}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {demanda.assigned_to && demanda.assigned_to !== "none" && (
              <span className="text-xs text-cyan-500 truncate">@{demanda.assigned_to}</span>
            )}
            <span className="text-xs text-gray-600">{timeAgo(demanda.created_at)}</span>
          </div>
        </div>
      </div>
    </button>
  );
}
