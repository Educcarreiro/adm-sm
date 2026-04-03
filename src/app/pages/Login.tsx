import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { LanguageSelector } from "../components/LanguageSelector";
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
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #050b14 0%, #0a1628 50%, #0d1b32 100%)" }}
    >
      {/* Animated orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Main cyan orb top-left */}
        <div
          className="absolute -top-40 -left-40 rounded-full animate-pulse"
          style={{
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)",
            filter: "blur(60px)",
            animationDuration: "4s",
          }}
        />
        {/* Blue/purple orb bottom-right */}
        <div
          className="absolute -bottom-40 -right-40 rounded-full animate-pulse"
          style={{
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(59,130,246,0.06) 50%, transparent 70%)",
            filter: "blur(80px)",
            animationDuration: "6s",
            animationDelay: "2s",
          }}
        />
        {/* Small accent orb center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
          style={{
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)",
            filter: "blur(40px)",
            animationDuration: "8s",
            animationDelay: "1s",
          }}
        />
        {/* Subtle tech grid */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header */}
      <header className="w-full px-8 py-5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3 relative">
          {/* Glow behind logo */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(6,182,212,0.2)",
              filter: "blur(20px)",
              transform: "scale(1.5)",
            }}
          />
          <img
            src={logoSrc}
            alt="Soccer Mind"
            className="h-12 w-auto relative"
            style={{ filter: "drop-shadow(0 0 15px rgba(6,182,212,0.3))" }}
          />
        </div>
        <LanguageSelector />
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">

          {/* Title */}
          <div className="text-center mb-8">
            <h1
              className="text-2xl font-semibold tracking-tight mb-1"
              style={{
                background: "linear-gradient(to right, #ffffff, #a5f3fc, #ffffff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Soccer Mind Control
            </h1>
            <p className="text-sm font-medium" style={{ color: "#22d3ee" }}>
              Menos achismo. Mais decisão consciente.
            </p>
          </div>

          {/* Card wrapper with glow */}
          <div className="group relative">
            {/* External glow */}
            <div
              className="absolute -inset-1 rounded-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"
              style={{
                background: "linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.15) 50%, rgba(99,102,241,0.2) 100%)",
                filter: "blur(20px)",
              }}
            />

            {/* Card */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: "24px",
                padding: "40px",
                position: "relative",
              }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Bem-vindo</h2>
                <p className="text-sm" style={{ color: "#64748b" }}>Acesse sua conta para continuar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Email</label>
                  <div className="relative group/input">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                      style={{ color: "#334155" }}
                    />
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full transition-all duration-200 placeholder:text-slate-700"
                      style={{
                        paddingLeft: "44px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: "12px",
                        color: "#e2e8f0",
                        height: "48px",
                        outline: "none",
                        fontSize: "14px",
                      }}
                      onFocus={e => {
                        e.currentTarget.style.border = "1px solid rgba(6,182,212,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(6,182,212,0.15)";
                      }}
                      onBlur={e => {
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: "#94a3b8" }}>Senha</label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200"
                      style={{ color: "#334155" }}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full transition-all duration-200 placeholder:text-slate-700"
                      style={{
                        paddingLeft: "44px",
                        paddingRight: "44px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.10)",
                        borderRadius: "12px",
                        color: "#e2e8f0",
                        height: "48px",
                        outline: "none",
                        fontSize: "14px",
                      }}
                      onFocus={e => {
                        e.currentTarget.style.border = "1px solid rgba(6,182,212,0.5)";
                        e.currentTarget.style.boxShadow = "0 0 0 2px rgba(6,182,212,0.15)";
                      }}
                      onBlur={e => {
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.10)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                      style={{ color: "#334155" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#334155"; }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: "#06b6d4" }}
                    />
                    <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: "#475569" }}>
                      Lembrar-me
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium transition-colors duration-200"
                    style={{ color: "#06b6d4" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#67e8f9"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#06b6d4"; }}
                  >
                    Esqueceu a senha?
                  </a>
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl p-3 text-sm text-center" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}>
                    {error}
                  </div>
                )}

                {/* Button */}
                <div className="relative group/btn mt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-full font-semibold text-white overflow-hidden transition-all duration-200"
                    style={{
                      height: "52px",
                      borderRadius: "12px",
                      background: isLoading
                        ? "rgba(6,182,212,0.5)"
                        : "linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #3b82f6 100%)",
                      boxShadow: isLoading ? "none" : "0 0 25px rgba(6,182,212,0.4), 0 4px 16px rgba(0,0,0,0.3)",
                      border: "none",
                      fontSize: "15px",
                      letterSpacing: "0.02em",
                      cursor: isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {/* Shimmer effect */}
                    {!isLoading && (
                      <span
                        className="absolute inset-0 translate-x-[-200%] group-hover/btn:translate-x-[200%] transition-transform duration-1000"
                        style={{
                          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                        }}
                      />
                    )}
                    <span className="relative z-10">
                      {isLoading ? "Entrando..." : "Entrar no Painel"}
                    </span>
                  </button>
                </div>
              </form>

              <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-xs text-center" style={{ color: "#1e293b" }}>
                  Sistema interno Soccer Mind • Uso exclusivo da equipe
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
