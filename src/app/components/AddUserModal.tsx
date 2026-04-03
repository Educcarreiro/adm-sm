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
import { Eye, EyeOff } from "lucide-react";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (user: {
    name: string;
    email: string;
    role: string;
    permissions: string[];
    password: string;
  }) => void;
}

export function AddUserModal({ open, onClose, onAdd }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Suporte",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case "Administrador": return ["all"];
      case "PMO": return ["view_clients", "manage_tickets", "manage_upsells", "view_analytics"];
      case "Desenvolvedor Sênior": return ["view_clients", "manage_tickets", "view_analytics"];
      case "Suporte": return ["view_clients", "manage_tickets"];
      default: return ["view_clients"];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      permissions: getRolePermissions(formData.role),
      password: formData.password,
    });
    setFormData({ name: "", email: "", role: "Suporte", password: "" });
    setShowPassword(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1c2e] border-white/10 text-white max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Adicionar Usuário Interno</DialogTitle>
          <DialogDescription className="text-gray-400">
            Adicionar novo membro da equipe Soccer Mind
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label className="text-gray-300">Nome Completo</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
              placeholder="João Silva"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
              placeholder="joao@soccermind.com"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Cargo</Label>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1c2e] border-white/10">
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="PMO">PMO</SelectItem>
                <SelectItem value="Desenvolvedor Sênior">Desenvolvedor Sênior</SelectItem>
                <SelectItem value="Suporte">Suporte</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Senha Inicial</Label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-white/10 hover:bg-white/5">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white">
              Criar Usuário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
