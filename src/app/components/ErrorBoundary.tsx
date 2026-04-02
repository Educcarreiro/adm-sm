import { useRouteError, useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "./ui/button";

export function ErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1929] via-[#0d1f33] to-[#0a1929] flex items-center justify-center p-8">
      <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Ops! Algo deu errado</h1>
        <p className="text-gray-400 mb-6">
          {error?.statusText || error?.message || "Erro desconhecido"}
        </p>
        <Button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          Voltar ao Dashboard
        </Button>
      </div>
    </div>
  );
}
