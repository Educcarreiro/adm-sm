import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (client: {
    name: string;
    plan: string;
    monthlyValue: number;
    responsible: string;
    email: string;
    maxUsers: number;
    planDuration: number;
    status: "active" | "inactive";
  }) => void;
}

export function AddClientModal({ open, onClose, onAdd }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    plan: "Starter",
    monthlyValue: "",
    responsible: "",
    email: "",
    maxUsers: "",
    planDuration: "12",
    status: "active" as "active" | "inactive",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      plan: formData.plan,
      monthlyValue: Number(formData.monthlyValue),
      responsible: formData.responsible,
      email: formData.email,
      maxUsers: Number(formData.maxUsers),
      planDuration: Number(formData.planDuration),
      status: formData.status,
    });
    setFormData({
      name: "",
      plan: "Starter",
      monthlyValue: "",
      responsible: "",
      email: "",
      maxUsers: "",
      planDuration: "12",
      status: "active",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1c2e] border-white/10 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Cadastrar Novo Cliente</DialogTitle>
          <DialogDescription className="text-gray-400">
            Preencha as informações do novo clube
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Nome do Clube
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
                placeholder="Ex: Corinthians"
                required
              />
            </div>

            <div>
              <Label htmlFor="plan" className="text-gray-300">
                Plano
              </Label>
              <Select
                value={formData.plan}
                onValueChange={(value) => setFormData({ ...formData, plan: value })}
              >
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="Starter">Starter</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Duração do Plano</Label>
              <Select value={formData.planDuration} onValueChange={(value) => setFormData({ ...formData, planDuration: value })}>
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="1">1 mês</SelectItem>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                  <SelectItem value="24">24 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="monthlyValue" className="text-gray-300">Valor Mensal (R$)</Label>
              <Input id="monthlyValue" type="number" value={formData.monthlyValue}
                onChange={(e) => setFormData({ ...formData, monthlyValue: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white mt-2" placeholder="2500" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="maxUsers" className="text-gray-300">Usuários Permitidos</Label>
              <Input id="maxUsers" type="number" value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white mt-2" placeholder="5" required />
            </div>
            <div>
              <Label htmlFor="status" className="text-gray-300">Status da Conta</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1c2e] border-white/10">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="responsible" className="text-gray-300">Responsável do Clube</Label>
              <Input id="responsible" value={formData.responsible}
                onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white mt-2" placeholder="João Silva" required />
            </div>
            <div>
              <Label htmlFor="email" className="text-gray-300">Email do Responsável</Label>
              <Input id="email" type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white mt-2" placeholder="joao@clube.com" required />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 border border-white/15 text-white hover:bg-white/15"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Criar Cliente
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
