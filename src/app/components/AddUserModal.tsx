import { useState, useEffect } from "react";
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
import { Eye, EyeOff, Plus, X, Tags } from "lucide-react";
import {
  fetchRoleCategories,
  addRoleCategory,
  removeRoleCategory,
  type RoleCategory,
} from "../../lib/roleCategoriesService";

const DEFAULT_ROLES = ["Administrador", "PMO", "Desenvolvedor Sênior", "Suporte"];

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
  const [formData, setFormData] = useState({ name: "", email: "", role: "Suporte", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [extraRoles, setExtraRoles] = useState<RoleCategory[]>([]);
  const [newRole, setNewRole] = useState("");
  const [showRoleManager, setShowRoleManager] = useState(false);

  useEffect(() => {
    if (open) fetchRoleCategories().then(setExtraRoles).catch(() => {});
  }, [open]);

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case "Administrador": return ["all"];
      case "PMO": return ["view_clients", "manage_tickets", "manage_upsells", "view_analytics"];
      case "Desenvolvedor Sênior": return ["view_clients", "manage_tickets", "view_analytics"];
      case "Suporte": return ["view_clients", "manage_tickets"];
      default: return ["view_clients"];
    }
  };

  const handleAddRole = async () => {
    const name = newRole.trim();
    if (!name) return;
    const created = await addRoleCategory(name);
    setExtraRoles((prev) => [...prev, created]);
    setNewRole("");
  };

  const handleRemoveRole = async (id: string, name: string) => {
    await removeRoleCategory(id);
    setExtraRoles((prev) => prev.filter((r) => r.id !== id));
    if (formData.role === name) setFormData({ ...formData, role: "Suporte" });
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
    setShowRoleManager(false);
    onClose();
  };

  const allRoles = [...DEFAULT_ROLES, ...extraRoles.map((r) => r.name)];

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
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2" placeholder="João Silva" required />
          </div>

          <div>
            <Label className="text-gray-300">Email</Label>
            <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2" placeholder="joao@soccermind.com" required />
          </div>

          {/* Cargo + gerenciar categorias */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-300">Cargo</Label>
              <button type="button" onClick={() => setShowRoleManager(!showRoleManager)}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                <Tags className="w-3 h-3" />
                {showRoleManager ? "Fechar" : "Gerenciar cargos"}
              </button>
            </div>
            <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
              <SelectTrigger className="bg-[#0a1929]/80 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1c2e] border-white/10">
                {allRoles.map((role) => (
                  <SelectItem key={role} value={role} className="text-white focus:bg-white/10 focus:text-white">{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Gerenciador inline */}
            {showRoleManager && (
              <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-lg space-y-3">
                <p className="text-xs text-gray-500">Cargos customizados</p>
                <div className="flex gap-2">
                  <Input value={newRole} onChange={(e) => setNewRole(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddRole())}
                    placeholder="Ex: Analista de Dados"
                    className="bg-[#0a1929]/80 border-white/10 text-white text-sm h-8" />
                  <Button type="button" onClick={handleAddRole} disabled={!newRole.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white h-8 w-8 p-0 flex-shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
                {extraRoles.length === 0 ? (
                  <p className="text-xs text-gray-600">Nenhum cargo customizado ainda.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {extraRoles.map((role) => (
                      <div key={role.id} className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded px-2 py-1">
                        <span className="text-white text-xs">{role.name}</span>
                        <button type="button" onClick={() => handleRemoveRole(role.id, role.name)}
                          className="text-gray-500 hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <Label className="text-gray-300">Senha Inicial</Label>
            <div className="relative mt-2">
              <Input type={showPassword ? "text" : "password"} value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white pr-10" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={onClose} className="flex-1 bg-white/10 border border-white/15 text-white hover:bg-white/15">
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
