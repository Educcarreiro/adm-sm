import { useState, useEffect } from "react";
import { MainLayout } from "../components/MainLayout";
import { fetchContracts, addContract, deleteContract, type Contract } from "../../lib/contractsService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { FileText, Plus, DollarSign, Calendar, MapPin, Mail, Phone, Package, TrendingUp, Trash2 } from "lucide-react";

const allUpsells = [
  "Fit Tático", "Ranking de Jogadores", "Player vs Player",
  "Health Analytics", "Relatório Executivo", "Análises",
];

const emptyForm = {
  club_name: "", plan: "", monthly_value: 0,
  start_date: "", end_date: "", location: "",
  email: "", phone: "", upsells: [] as string[], status: "active" as Contract["status"],
};

export function Contracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const loadContracts = async () => {
    try {
      const data = await fetchContracts();
      setContracts(data);
    } catch (err) {
      console.error("Erro ao carregar contratos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadContracts(); }, []);

  const handleAdd = async () => {
    if (!form.club_name || !form.plan || !form.monthly_value || !form.start_date || !form.end_date) return;
    setSaving(true);
    try {
      await addContract(form);
      await loadContracts();
      setForm({ ...emptyForm });
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Erro ao adicionar contrato:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remover contrato de ${name}?`)) return;
    try {
      await deleteContract(id);
      setContracts((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Erro ao remover contrato:", err);
    }
  };

  const toggleUpsell = (upsell: string) => {
    setForm((prev) => ({
      ...prev,
      upsells: prev.upsells.includes(upsell)
        ? prev.upsells.filter((u) => u !== upsell)
        : [...prev.upsells, upsell],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "expired": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active": return "Ativo";
      case "pending": return "Pendente";
      case "expired": return "Expirado";
      default: return status;
    }
  };

  const activeContracts = contracts.filter((c) => c.status === "active");
  const totalMRR = activeContracts.reduce((sum, c) => sum + c.monthly_value, 0);
  const totalUpsells = contracts.reduce((sum, c) => sum + c.upsells.length, 0);

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gestão de Contratos</h1>
            <p className="text-gray-400">Controle todos os contratos fechados e seus upsells</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Contrato
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#0f1c2e] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-white">Adicionar Novo Contrato</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Preencha as informações do novo contrato fechado
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nome do Clube *</Label>
                    <Input value={form.club_name} onChange={(e) => setForm({ ...form, club_name: e.target.value })}
                      className="bg-[#0a1628]/50 border-white/10 text-white" placeholder="Ex: Santos FC" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Plano *</Label>
                    <Input value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}
                      className="bg-[#0a1628]/50 border-white/10 text-white" placeholder="Ex: Premium Elite" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Valor Mensal (R$) *</Label>
                    <Input type="number" value={form.monthly_value}
                      onChange={(e) => setForm({ ...form, monthly_value: Number(e.target.value) })}
                      className="bg-[#0a1628]/50 border-white/10 text-white" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Data Início *</Label>
                    <Input type="date" value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      className="bg-[#0a1628]/50 border-white/10 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Data Fim *</Label>
                    <Input type="date" value={form.end_date}
                      onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      className="bg-[#0a1628]/50 border-white/10 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Localização</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="bg-[#0a1628]/50 border-white/10 text-white" placeholder="Ex: São Paulo, SP" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Email de Contato</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-[#0a1628]/50 border-white/10 text-white" placeholder="contato@clube.com.br" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Telefone</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="bg-[#0a1628]/50 border-white/10 text-white" placeholder="+55 11 0000-0000" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Upsells Contratados</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {allUpsells.map((upsell) => (
                      <button key={upsell} type="button" onClick={() => toggleUpsell(upsell)}
                        className={`p-3 rounded-lg border text-sm transition-all ${
                          form.upsells.includes(upsell)
                            ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                            : "bg-[#0a1628]/50 border-white/10 text-gray-400 hover:border-cyan-500/30"
                        }`}>
                        {upsell}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}
                    className="flex-1 border-white/10 text-gray-300 hover:bg-white/5">
                    Cancelar
                  </Button>
                  <Button onClick={handleAdd} disabled={saving}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">
                    {saving ? "Salvando..." : "Adicionar Contrato"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Total de Contratos</p>
            </div>
            <p className="text-3xl font-bold text-white">{contracts.length}</p>
          </div>
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <p className="text-sm text-gray-400">Contratos Ativos</p>
            </div>
            <p className="text-3xl font-bold text-white">{activeContracts.length}</p>
          </div>
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-gray-400">MRR Total</p>
            </div>
            <p className="text-3xl font-bold text-white">R$ {totalMRR.toLocaleString()}</p>
          </div>
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-yellow-400" />
              <p className="text-sm text-gray-400">Upsells Ativos</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalUpsells}</p>
          </div>
        </div>

        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Carregando contratos...</div>
          ) : contracts.length === 0 ? (
            <div className="p-12 text-center text-gray-400">Nenhum contrato cadastrado ainda.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">Clube</TableHead>
                  <TableHead className="text-gray-400">Plano</TableHead>
                  <TableHead className="text-gray-400">Valor Mensal</TableHead>
                  <TableHead className="text-gray-400">Período</TableHead>
                  <TableHead className="text-gray-400">Localização</TableHead>
                  <TableHead className="text-gray-400">Upsells</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-right text-gray-400">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id} className="border-white/10 hover:bg-white/5 transition-colors">
                    <TableCell>
                      <div>
                        <p className="text-white font-medium">{contract.club_name}</p>
                        <div className="flex flex-col gap-1 mt-1">
                          {contract.email && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Mail className="w-3 h-3" />{contract.email}
                            </div>
                          )}
                          {contract.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Phone className="w-3 h-3" />{contract.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">{contract.plan}</TableCell>
                    <TableCell className="text-green-400 font-semibold">
                      R$ {contract.monthly_value.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-gray-300 text-sm">
                        <Calendar className="w-3 h-3" />
                        {new Date(contract.start_date).toLocaleDateString("pt-BR")} —{" "}
                        {new Date(contract.end_date).toLocaleDateString("pt-BR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      {contract.location && (
                        <div className="flex items-center gap-1 text-gray-300 text-sm">
                          <MapPin className="w-3 h-3" />{contract.location}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {contract.upsells.map((u) => (
                          <Badge key={u} className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-xs">{u}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(contract.status)}>{getStatusLabel(contract.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => handleDelete(contract.id, contract.club_name)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
