import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { fetchClubById, updateClub, deleteClub, type Club } from "../../lib/clubsService";
import {
  fetchClientLogins,
  addClientLogin,
  removeClientLogin,
  type ClientLogin,
} from "../../lib/clientLoginsService";
import { sendClientLoginEmail } from "../../lib/emailService";
import { mockUpsells, clubUpsells } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
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
  Users as UsersIcon,
  DollarSign,
  Trash2,
  UserPlus,
  Mail,
  User,
  KeyRound,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Switch } from "../components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { AddClientLoginModal } from "../components/AddClientLoginModal";

export function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUpsellIds, setActiveUpsellIds] = useState<string[]>(
    clubUpsells[id || ""] || []
  );

  const [logins, setLogins] = useState<ClientLogin[]>([]);
  const [loginsLoading, setLoginsLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Club>>({});
  const [saving, setSaving] = useState(false);

  const [showDeleteClub, setShowDeleteClub] = useState(false);
  const [showAddLogin, setShowAddLogin] = useState(false);
  const [loginToDelete, setLoginToDelete] = useState<ClientLogin | null>(null);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchClubById(id).then((data) => {
      setClub(data);
      setLoading(false);
    });
    fetchClientLogins(id).then((data) => {
      setLogins(data);
      setLoginsLoading(false);
    }).catch(() => setLoginsLoading(false));
  }, [id]);

  const handleStartEdit = () => {
    if (!club) return;
    setEditData({
      name: club.name,
      plan: club.plan,
      monthly_value: club.monthly_value,
      responsible: club.responsible,
      status: club.status,
      active_users: club.active_users,
    });
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!id || !club) return;
    setSaving(true);
    try {
      const updated = await updateClub(id, editData);
      setClub(updated);
      setEditing(false);
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClub = async () => {
    if (!id) return;
    await deleteClub(id);
    navigate("/clients");
  };

  const handleAddLogin = async (loginData: { name: string; email: string; password: string }) => {
    if (!id || !club) return;
    const created = await addClientLogin({ club_id: id, ...loginData });
    setLogins((prev) => [...prev, created]);
    sendClientLoginEmail({ ...loginData, clubName: club.name }).catch((err) =>
      console.error("Erro ao enviar email:", err)
    );
  };

  const handleDeleteLogin = async () => {
    if (!loginToDelete) return;
    await removeClientLogin(loginToDelete.id);
    setLogins((prev) => prev.filter((l) => l.id !== loginToDelete.id));
    setLoginToDelete(null);
  };

  const handleToggleUpsell = (upsellId: string) => {
    setActiveUpsellIds((prev) =>
      prev.includes(upsellId)
        ? prev.filter((id) => id !== upsellId)
        : [...prev, upsellId]
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8"><p className="text-gray-400">Carregando...</p></div>
      </MainLayout>
    );
  }

  if (!club) {
    return (
      <MainLayout>
        <div className="p-8"><p className="text-gray-400">Cliente não encontrado</p></div>
      </MainLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "trial": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "inactive": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "trial": return "Trial";
      case "inactive": return "Inativo";
      default: return status;
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Back + Actions */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={() => navigate("/clients")} variant="ghost" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Clientes
          </Button>
          <div className="flex gap-2">
            {editing ? (
              <>
                <Button onClick={() => setEditing(false)} variant="outline"
                  className="border-white/10 text-gray-400 hover:bg-white/5" disabled={saving}>
                  <X className="w-4 h-4 mr-2" />Cancelar
                </Button>
                <Button onClick={handleSaveEdit} className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={saving}>
                  <Check className="w-4 h-4 mr-2" />{saving ? "Salvando..." : "Salvar"}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleStartEdit} variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10">
                  <Pencil className="w-4 h-4 mr-2" />Editar
                </Button>
                <Button onClick={() => setShowDeleteClub(true)} variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" />Apagar Cliente
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Header */}
        <div className="mb-8">
          {editing ? (
            <div className="max-w-sm">
              <Label className="text-gray-400 text-sm">Nome do Clube</Label>
              <Input
                value={editData.name ?? ""}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white text-2xl font-bold mt-1"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-2 capitalize">{club.name}</h1>
              <div className="flex items-center gap-3">
                <p className="text-gray-400">Detalhes do cliente e gestão de módulos</p>
                <Badge className={getStatusColor(club.status)}>{getStatusLabel(club.status)}</Badge>
              </div>
            </>
          )}
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Plano */}
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Plano Atual</p>
            </div>
            {editing ? (
              <Select value={editData.plan ?? club.plan} onValueChange={(v) => setEditData({ ...editData, plan: v })}>
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-2xl font-bold text-white">{club.plan}</p>
            )}
          </div>

          {/* Valor Mensal */}
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <p className="text-sm text-gray-400">Valor Mensal</p>
            </div>
            {editing ? (
              <Input
                type="number"
                value={editData.monthly_value ?? club.monthly_value}
                onChange={(e) => setEditData({ ...editData, monthly_value: Number(e.target.value) })}
                className="bg-[#0a1929]/80 border-white/10 text-white mt-1"
              />
            ) : (
              <p className="text-2xl font-bold text-white">R$ {club.monthly_value.toLocaleString()}</p>
            )}
          </div>

          {/* Status */}
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <UsersIcon className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Status</p>
            </div>
            {editing ? (
              <Select value={editData.status ?? club.status} onValueChange={(v: any) => setEditData({ ...editData, status: v })}>
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <p className="text-2xl font-bold text-white">{getStatusLabel(club.status)}</p>
            )}
          </div>

          {/* Data de Cadastro */}
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Data de Cadastro</p>
            </div>
            <p className="text-xl font-bold text-white">
              {new Date(club.created_at).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>

        {/* Responsável (só aparece no modo edição) */}
        {editing && (
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Informações Adicionais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Responsável</Label>
                <Input
                  value={editData.responsible ?? club.responsible}
                  onChange={(e) => setEditData({ ...editData, responsible: e.target.value })}
                  className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
                  placeholder="Nome do responsável"
                />
              </div>
              <div>
                <Label className="text-gray-400">Usuários Ativos</Label>
                <Input
                  type="number"
                  value={editData.active_users ?? club.active_users}
                  onChange={(e) => setEditData({ ...editData, active_users: Number(e.target.value) })}
                  className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Logins da Plataforma de IA */}
        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Logins da Plataforma de IA
              </h2>
              <p className="text-gray-400 text-sm mt-1">Acessos vinculados a este cliente</p>
            </div>
            <Button onClick={() => setShowAddLogin(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
              <UserPlus className="w-4 h-4 mr-2" />Cadastrar Login
            </Button>
          </div>

          {loginsLoading ? (
            <p className="text-gray-400 text-sm">Carregando logins...</p>
          ) : logins.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <KeyRound className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Nenhum login cadastrado para este cliente.</p>
              <p className="text-sm mt-1">Clique em "Cadastrar Login" para criar o primeiro acesso.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logins.map((login) => (
                <div key={login.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium capitalize">{login.name}</p>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                        <Mail className="w-3.5 h-3.5" />{login.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">Ativo</Badge>
                    <Button onClick={() => setLoginToDelete(login)} variant="ghost" size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upsells */}
        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Gestão de Módulos (Upsells)</h2>
          <p className="text-gray-400 mb-6">Ative ou desative módulos para este cliente com um clique</p>
          <div className="space-y-4">
            {mockUpsells.map((upsell) => {
              const isActive = activeUpsellIds.includes(upsell.id);
              return (
                <div key={upsell.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isActive ? "bg-cyan-500/5 border-cyan-500/20" : "bg-white/5 border-white/10"
                  }`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{upsell.name}</h3>
                      <Badge className={isActive
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-gray-500/10 text-gray-400 border-gray-500/20"}>
                        {isActive ? "Ativo" : "Desativado"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{upsell.description}</p>
                    <p className="text-sm text-gray-500">€{upsell.price}/mês • {upsell.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch checked={isActive} onCheckedChange={() => handleToggleUpsell(upsell.id)}
                      className="data-[state=checked]:bg-cyan-500" />
                    <Button onClick={() => handleToggleUpsell(upsell.id)}
                      variant={isActive ? "outline" : "default"}
                      className={isActive
                        ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                        : "bg-cyan-500 hover:bg-cyan-600 text-white"}>
                      {isActive ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AddClientLoginModal open={showAddLogin} clubName={club.name}
        onClose={() => setShowAddLogin(false)} onAdd={handleAddLogin} />

      {/* Confirmar apagar cliente */}
      <AlertDialog open={showDeleteClub} onOpenChange={setShowDeleteClub}>
        <AlertDialogContent className="bg-[#0f1c2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar cliente?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja apagar <span className="text-white font-semibold capitalize">{club.name}</span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/5 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClub} className="bg-red-500 hover:bg-red-600 text-white">
              Sim, apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmar apagar login */}
      <AlertDialog open={!!loginToDelete} onOpenChange={(open) => !open && setLoginToDelete(null)}>
        <AlertDialogContent className="bg-[#0f1c2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover acesso?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Deseja remover o login de <span className="text-white font-semibold">{loginToDelete?.name}</span> ({loginToDelete?.email})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/5 text-white">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLogin} className="bg-red-500 hover:bg-red-600 text-white">
              Sim, remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
