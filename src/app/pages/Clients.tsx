import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { fetchClubs, addClub, type Club } from "../../lib/clubsService";
import { AddClientModal } from "../components/AddClientModal";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, ArrowRight, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export function Clients() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  const loadClubs = async () => {
    try {
      const data = await fetchClubs();
      setClubs(data);
    } catch (err) {
      console.error("Erro ao carregar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClubs(); }, []);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleAddClient = async (clientData: any) => {
    try {
      await addClub({
        name: clientData.name,
        plan: clientData.plan,
        monthly_value: clientData.monthlyValue ?? 0,
        active_users: 0,
        active_upsells: 0,
        status: "active",
        responsible: clientData.responsible ?? "",
      });
      await loadClubs();
      setShowAddClientModal(false);
    } catch (err) {
      console.error("Erro ao cadastrar cliente:", err);
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Clientes</h1>
            <p className="text-gray-400">Gerenciar todos os clubes cadastrados na plataforma</p>
          </div>
          <Button
            onClick={() => setShowAddClientModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar Novo Cliente
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar por nome do clube..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#0f1c2e]/50 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Carregando clientes...</div>
          ) : filteredClubs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Nenhum cliente encontrado.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Nome do Clube</TableHead>
                  <TableHead className="text-gray-400">Plano Atual</TableHead>
                  <TableHead className="text-gray-400">Valor Mensal</TableHead>
                  <TableHead className="text-gray-400">Usuários Ativos</TableHead>
                  <TableHead className="text-gray-400">Upsells Ativos</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Data de Criação</TableHead>
                  <TableHead className="text-right text-gray-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClubs.map((club) => (
                  <TableRow key={club.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell className="font-medium text-white">{club.name}</TableCell>
                    <TableCell>
                      <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">{club.plan}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-300 font-semibold">
                      R$ {club.monthly_value.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-300">{club.active_users}</TableCell>
                    <TableCell className="text-gray-300">{club.active_upsells}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(club.status)}>{getStatusLabel(club.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(club.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => navigate(`/clients/${club.id}`)}
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                      >
                        Ver detalhes
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AddClientModal
        open={showAddClientModal}
        onClose={() => setShowAddClientModal(false)}
        onAdd={handleAddClient}
      />
    </MainLayout>
  );
}
