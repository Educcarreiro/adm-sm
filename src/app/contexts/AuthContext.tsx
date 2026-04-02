import { createContext, useContext, useState, ReactNode } from "react";

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
    // Credenciais de admin
    if (email === "soccermind@adm.com.br" && password === "Senha123") {
      setUser({
        email: email,
        name: "Administrador",
        role: "Admin",
      });
      return true;
    }
    
    // Credencial Johnny Silva
    if (email === "johnny@soccermind.com.br" && password === "JS2026SM") {
      setUser({
        email: email,
        name: "Johnny Silva",
        role: "Administrador",
      });
      return true;
    }
    
    // Credencial Eduarda Carreiro
    if (email === "eduarda@soccermind.com.br" && password === "Senha2805") {
      setUser({
        email: email,
        name: "Eduarda Carreiro",
        role: "Administrador",
      });
      return true;
    }
    
    // Credencial Lais Cardoso
    if (email === "lais@soccermind.com.br" && password === "Senha123") {
      setUser({
        email: email,
        name: "Lais Cardoso",
        role: "Desenvolvedor Sênior",
      });
      return true;
    }
    
    // Credencial Guilherme Santana
    if (email === "guilherme@soccermind.com.br" && password === "laila2026") {
      setUser({
        email: email,
        name: "Guilherme Santana",
        role: "PMO",
      });
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
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