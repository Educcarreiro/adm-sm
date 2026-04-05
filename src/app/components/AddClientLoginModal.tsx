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
import { Eye, EyeOff } from "lucide-react";

interface AddClientLoginModalProps {
  open: boolean;
  clubName: string;
  onClose: () => void;
  onAdd: (login: { name: string; email: string; password: string }) => Promise<void>;
}

export function AddClientLoginModal({ open, clubName, onClose, onAdd }: AddClientLoginModalProps) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await onAdd({ name: formData.name, email: formData.email, password: formData.password });
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      onClose();
    } catch (err: any) {
      setError(err?.message ?? "Erro ao cadastrar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1c2e] border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Cadastrar Login</DialogTitle>
          <DialogDescription className="text-gray-400">
            Crie um acesso à plataforma de IA para <span className="text-cyan-400 font-semibold">{clubName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label className="text-gray-300">Nome do Responsável</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
              placeholder="João Silva"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Email de Acesso</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
              placeholder="joao@clube.com"
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Senha</Label>
            <div className="relative mt-2">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white pr-10"
                placeholder="Mínimo 6 caracteres"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Confirmar Senha</Label>
            <div className="relative mt-2">
              <Input
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="bg-[#0a1929]/80 border-white/10 text-white pr-10"
                placeholder="Repita a senha"
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}
              className="flex-1 border-white/10 hover:bg-white/5" disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Login"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
