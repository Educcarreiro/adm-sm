import { useState, useEffect } from "react";
import { MainLayout } from "../components/MainLayout";
import {
  fetchInternalUsers,
  addInternalUser,
  removeInternalUser,
  updateUserPassword,
  type InternalUser,
} from "../../lib/usersService";
import { sendWelcomeEmail } from "../../lib/emailService";
import { AddUserModal } from "../components/AddUserModal";
import { ChangePasswordModal } from "../components/ChangePasswordModal";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Mail, User, Shield, Plus, Key, XCircle } from "lucide-react";

export function Users() {
  const [users, setUsers] = useState<InternalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<InternalUser | null>(null);

  const loadUsers = async () => {
    try {
      const data = await fetchInternalUsers();
      setUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Administrador": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "PMO": return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Desenvolvedor Sênior": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const getRolePermissions = (role: string): string[] => {
    switch (role) {
      case "Administrador": return ["all"];
      case "PMO": return ["view_clients", "manage_tickets", "manage_upsells", "view_analytics"];
      case "Desenvolvedor Sênior": return ["view_clients", "manage_tickets", "view_analytics"];
      case "Suporte": return ["view_clients", "manage_tickets"];
      default: return ["view_clients"];
    }
  };

  const handleAddUser = async (userData: any) => {
    try {
      await addInternalUser({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        permissions: getRolePermissions(userData.role),
        password: userData.password,
      });
      await sendWelcomeEmail({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        password: userData.password,
      });
      await loadUsers();
      setShowAddUserModal(false);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
    }
  };

  const handleRemoveUser = async (user: InternalUser) => {
    if (!confirm(`Deseja realmente remover ${user.name}?`)) return;
    try {
      await removeInternalUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
    }
  };

  const handleChangePassword = async (newPassword: string) => {
    if (!selectedUser) return;
    try {
      await updateUserPassword(selectedUser.id, newPassword);
      setShowPasswordModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Erro ao atualizar senha:", err);
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Usuários Internos</h1>
            <p className="text-gray-400">Gerenciar equipe Soccer Mind</p>
          </div>
          <Button
            onClick={() => setShowAddUserModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar usuário interno
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <User className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Total de Usuários</p>
            </div>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <p className="text-sm text-gray-400">Cargos Diferentes</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {new Set(users.map((u) => u.role)).size}
            </p>
          </div>
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-gray-400">Admins</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {users.filter((u) => u.role === "Administrador").length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 py-12">Carregando usuários...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-cyan-400">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">{user.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                    <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-500 mb-3">Permissões:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((permission) => (
                      <Badge key={permission} className="bg-white/5 text-gray-400 border-white/10">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/10">
                  <Button
                    onClick={() => { setSelectedUser(user); setShowPasswordModal(true); }}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 hover:bg-white/5 text-gray-400"
                  >
                    <Key className="w-4 h-4 mr-2" />
                    Senha
                  </Button>
                  <Button
                    onClick={() => handleRemoveUser(user)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500/20 hover:bg-red-500/10 text-red-400"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddUserModal
        open={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onAdd={handleAddUser}
      />
      <ChangePasswordModal
        open={showPasswordModal}
        onClose={() => { setShowPasswordModal(false); setSelectedUser(null); }}
        userName={selectedUser?.name || ""}
        onChangePassword={handleChangePassword}
      />
    </MainLayout>
  );
}
