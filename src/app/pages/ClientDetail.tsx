import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { fetchClubById, type Club } from "../../lib/clubsService";
import { mockUpsells, clubUpsells } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { ArrowLeft, Calendar, Users as UsersIcon, DollarSign } from "lucide-react";
import { Switch } from "../components/ui/switch";

export function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeUpsellIds, setActiveUpsellIds] = useState<string[]>(
    clubUpsells[id || ""] || []
  );

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchClubById(id).then((data) => {
      setClub(data);
      setLoading(false);
    });
  }, [id]);

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

  const handleToggleUpsell = (upsellId: string) => {
    setActiveUpsellIds((prev) =>
      prev.includes(upsellId)
        ? prev.filter((id) => id !== upsellId)
        : [...prev, upsellId]
    );
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate("/clients")}
          variant="ghost"
          className="mb-6 text-gray-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Clientes
        </Button>

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
    </MainLayout>
  );
}
