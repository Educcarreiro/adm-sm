import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { LanguageSelector } from "../components/LanguageSelector";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import logoSrc from "../../assets/soccer_mind_sem_background.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError(t("login.error"));
      }
    } catch {
      setError(t("login.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: "linear-gradient(135deg, #060d18 0%, #0a1929 40%, #0d1f3c 70%, #080f1e 100%)" }}>

      {/* Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-20" style={{ background: "radial-gradient(circle, #0ea5e9 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 -right-48 w-[500px] h-[500px] rounded-full opacity-15" style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute -bottom-32 left-1/3 w-[400px] h-[400px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 70%)", filter: "blur(60px)" }} />
      </div>

      {/* Header */}
      <header className="w-full px-8 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div style={{ filter: "drop-shadow(0 0 12px rgba(34,211,238,0.4))" }}>
            <img src={logoSrc} alt="Soccer Mind" className="h-14 w-auto" />
          </div>
        </div>
        <LanguageSelector />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-1" style={{ color: "#e2e8f0" }}>
              Soccer Mind Control
            </h1>
            <p className="text-sm font-medium" style={{ color: "#22d3ee" }}>
              Menos achismo. Mais decisão consciente.
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "rgba(15, 28, 46, 0.6)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Bem-vindo</h2>
              <p className="text-sm text-gray-400">Acesse sua conta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      paddingLeft: "44px",
                      background: "rgba(10,20,40,0.6)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                      height: "48px",
                    }}
                    className="w-full placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Senha</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#475569" }} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      paddingLeft: "44px",
                      paddingRight: "44px",
                      background: "rgba(10,20,40,0.6)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      color: "#e2e8f0",
                      height: "48px",
                    }}
                    className="w-full placeholder:text-slate-600 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#475569" }}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    className="border-white/20"
                  />
                  <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: "#64748b" }}>
                    Lembrar-me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium transition-colors" style={{ color: "#22d3ee" }}>
                  Esqueceu a senha?
                </a>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full font-semibold text-white transition-all duration-200 mt-2"
                style={{
                  height: "52px",
                  borderRadius: "12px",
                  background: isLoading
                    ? "rgba(34,211,238,0.5)"
                    : "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)",
                  boxShadow: "0 0 24px rgba(34,211,238,0.25), 0 4px 16px rgba(0,0,0,0.3)",
                  border: "none",
                  fontSize: "15px",
                  letterSpacing: "0.02em",
                }}
              >
                {isLoading ? "Entrando..." : "Entrar no Painel"}
              </Button>
            </form>

            <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-xs text-center" style={{ color: "#334155" }}>
                Sistema interno Soccer Mind • Uso exclusivo da equipe
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
