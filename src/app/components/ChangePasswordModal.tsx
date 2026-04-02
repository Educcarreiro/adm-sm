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

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  onChangePassword: (newPassword: string) => void;
}

export function ChangePasswordModal({
  open,
  onClose,
  userName,
  onChangePassword,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    onChangePassword(password);
    setPassword("");
    setConfirmPassword("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f1c2e] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">Alterar Senha</DialogTitle>
          <DialogDescription className="text-gray-400">
            Alterar senha para {userName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="password" className="text-gray-300">
              Nova Senha
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-gray-300">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-[#0a1929]/80 border-white/10 text-white mt-2"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded p-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/10 hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Atualizar Senha
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
