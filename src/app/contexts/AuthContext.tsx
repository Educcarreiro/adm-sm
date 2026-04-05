import { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import { addHistoryEntry } from "../../lib/historyService";

interface User {
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("internal_users")
      .select("name, email, role, password")
      .eq("email", email)
      .single();

    if (error || !data) return false;
    if (data.password !== password) return false;

    setUser({ email: data.email, name: data.name, role: data.role });
    addHistoryEntry({ type: "login", description: `Login realizado`, user: data.name });
    return true;
  };

  const logout = () => {
    if (user) addHistoryEntry({ type: "logout", description: `Logout`, user: user.name });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
