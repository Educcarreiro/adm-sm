import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { fetchClubById, deleteClub, type Club } from "../../lib/clubsService";
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
        <div className="p-8">
          <p className="text-gray-400">Carregando...</p>
        </div>
      </MainLayout>
    );
  }

  if (!club) {
    return (
      <MainLayout>
        <div className="p-8">
          <p className="text-gray-400">Cliente não encontrado</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8">
        {/* Back + Delete */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/clients")}
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Clientes
          </Button>
          <Button
            onClick={() => setShowDeleteClub(true)}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Apagar Cliente
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{club.name}</h1>
          <p className="text-gray-400">Detalhes do cliente e gestão de módulos</p>
        </div>

        {/* Client Info */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Plano Atual</p>
            </div>
            <p className="text-2xl font-bold text-white">{club.plan}</p>
          </div>

          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <p className="text-sm text-gray-400">Valor Mensal</p>
            </div>
            <p className="text-2xl font-bold text-white">R$ {club.monthly_value.toLocaleString()}</p>
          </div>

          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <UsersIcon className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Usuários Ativos</p>
            </div>
            <p className="text-2xl font-bold text-white">{club.active_users}</p>
          </div>

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

        {/* Logins da Plataforma de IA */}
        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-cyan-400" />
                Logins da Plataforma de IA
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                Acessos vinculados a este cliente para a plataforma de IA
              </p>
            </div>
            <Button
              onClick={() => setShowAddLogin(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Cadastrar Login
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
                <div
                  key={login.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{login.name}</p>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mt-0.5">
                        <Mail className="w-3.5 h-3.5" />
                        {login.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      Ativo
                    </Badge>
                    <Button
                      onClick={() => setLoginToDelete(login)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upsells Management */}
        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Gestão de Módulos (Upsells)</h2>
          <p className="text-gray-400 mb-6">
            Ative ou desative módulos para este cliente com um clique
          </p>

          <div className="space-y-4">
            {mockUpsells.map((upsell) => {
              const isActive = activeUpsellIds.includes(upsell.id);
              return (
                <div
                  key={upsell.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                    isActive
                      ? "bg-cyan-500/5 border-cyan-500/20"
                      : "bg-white/5 border-white/10"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white">{upsell.name}</h3>
                      <Badge
                        className={
                          isActive
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                        }
                      >
                        {isActive ? "Ativo" : "Desativado"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{upsell.description}</p>
                    <p className="text-sm text-gray-500">
                      €{upsell.price}/mês • {upsell.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Switch
                      checked={isActive}
                      onCheckedChange={() => handleToggleUpsell(upsell.id)}
                      className="data-[state=checked]:bg-cyan-500"
                    />
                    <Button
                      onClick={() => handleToggleUpsell(upsell.id)}
                      variant={isActive ? "outline" : "default"}
                      className={
                        isActive
                          ? "border-red-500/20 text-red-400 hover:bg-red-500/10"
                          : "bg-cyan-500 hover:bg-cyan-600 text-white"
                      }
                    >
                      {isActive ? "Desativar" : "Ativar"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Cadastrar Login */}
      <AddClientLoginModal
        open={showAddLogin}
        clubName={club.name}
        onClose={() => setShowAddLogin(false)}
        onAdd={handleAddLogin}
      />

      {/* Confirmação: Apagar Cliente */}
      <AlertDialog open={showDeleteClub} onOpenChange={setShowDeleteClub}>
        <AlertDialogContent className="bg-[#0f1c2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Apagar cliente?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja apagar <span className="text-white font-semibold">{club.name}</span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/5 text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClub}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Sim, apagar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmação: Apagar Login */}
      <AlertDialog open={!!loginToDelete} onOpenChange={(open) => !open && setLoginToDelete(null)}>
        <AlertDialogContent className="bg-[#0f1c2e] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover acesso?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Deseja remover o login de <span className="text-white font-semibold">{loginToDelete?.name}</span> ({loginToDelete?.email})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/5 text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLogin}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Sim, remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
