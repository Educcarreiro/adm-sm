import { Navigate } from "react-router";
import { MainLayout } from "../components/MainLayout";
import { useAuth } from "../contexts/AuthContext";
import { mockUpsells } from "../data/mockData";
import { Badge } from "../components/ui/badge";
import { Users, DollarSign, Package, Shield, Target, TrendingUp, Activity, BarChart3, FileText, Pencil } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

interface UpsellDetail {
  name: string;
  description: string;
  fullDescription: string;
  icon: any;
  features: string[];
  benefits: string[];
}

const upsellDetails: { [key: string]: UpsellDetail } = {
  "Fit Tático": {
    name: "Fit Tático (DNA do Clube)",
    description: "Análise de compatibilidade tática jogador × sistema",
    fullDescription: "Modelagem do estilo de jogo do clube e compatibilidade real entre jogador e sistema tático",
    icon: Target,
    features: [
      "Modelagem do estilo de jogo do clube",
      "Compatibilidade real jogador × sistema",
      "Avaliação de encaixe com treinador atual e cenários futuros",
      "Análise de DNA tático do atleta",
    ],
    benefits: [
      "Reduz erro na contratação por incompatibilidade tática",
      "Protege investimento com decisões baseadas em dados",
      "Aumenta taxa de sucesso de integração ao elenco",
      "Permite planejamento de cenários futuros",
    ],
  },
  "Ranking de Jogadores": {
    name: "Ranking de Jogadores",
    description: "Sistema de classificação baseado em performance e potencial",
    fullDescription: "Sistema avançado de classificação de atletas com base em múltiplos indicadores de performance",
    icon: TrendingUp,
    features: [
      "Score de risco composto (performance, tático, físico, adaptação e financeiro)",
      "Comparação com padrões históricos de flops",
      "Registro técnico que protege decisões da diretoria",
      "Sistema de alerta — não substitui o scout humano",
    ],
    benefits: [
      "Visão clara de priorização de alvos",
      "Redução de subjetividade na tomada de decisão",
      "Documentação técnica para blindagem institucional",
      "Base sólida para negociações",
    ],
  },
  "Player vs Player": {
    name: "Player vs Player",
    description: "Comparação direta entre atletas da mesma posição",
    fullDescription: "Ferramenta de comparação detalhada entre jogadores para decisões de contratação e substituição",
    icon: Shield,
    features: [
      "Comparação lado a lado de métricas técnicas",
      "Análise de custo-benefício entre opções",
      "Projeção de impacto no elenco",
      "Cenários de substituição e upgrade",
    ],
    benefits: [
      "Clareza na escolha entre múltiplos alvos",
      "Justificativa técnica para diretoria",
      "Redução de tempo na tomada de decisão",
      "Otimização de investimento",
    ],
  },
  "Health Analytics": {
    name: "Health Analytics (Módulo Físico / Prevenção)",
    description: "Análise de histórico de lesões e prevenção",
    fullDescription: "Sistema de prevenção e análise de risco físico para proteção do investimento em atletas",
    icon: Activity,
    features: [
      "Histórico e recorrência de lesões",
      "Stress físico por temporada",
      "Redução de risco de atleta improdutivo no DM",
      "Alertas preventivos de sobrecarga",
    ],
    benefits: [
      "Proteção contra contratação de atletas com alto risco físico",
      "Economia com atletas fora por lesão",
      "Planejamento de carga de trabalho",
      "Maximização de disponibilidade do elenco",
    ],
  },
  "Relatório Executivo": {
    name: "Relatório Executivo",
    description: "Documentação consolidada para diretoria",
    fullDescription: "Relatórios completos e profissionais para apresentação à diretoria e conselho",
    icon: FileText,
    features: [
      "Histórico de recomendações",
      "Documentação técnica das decisões",
      "Blindagem política e institucional",
      "Exportação profissional para apresentações",
    ],
    benefits: [
      "Proteção política do departamento de futebol",
      "Transparência nas decisões",
      "Rastreabilidade de processos",
      "Credibilidade institucional",
    ],
  },
  "Análises": {
    name: "Análises Avançadas",
    description: "Ferramentas analíticas completas da plataforma",
    fullDescription: "Suite completa de análises para decisões estratégicas em múltiplas frentes",
    icon: BarChart3,
    features: [
      "War Room da Janela (simulação de entradas e saídas)",
      "Alertas de Oportunidade de Mercado",
      "Shadow List (lista estratégica protegida)",
      "Risk Score Financeiro e Liquidity Score",
      "Scout de Adversários",
    ],
    benefits: [
      "Decisões sob pressão com base técnica",
      "Identificação de oportunidades ocultas",
      "Redução de vazamentos estratégicos",
      "Transformação de jogador em ativo financeiro",
      "Vantagem competitiva sobre adversários",
    ],
  },
};

export function Upsells() {
  const { user } = useAuth();
  const [selectedUpsell, setSelectedUpsell] = useState<UpsellDetail | null>(null);
  const [upsellPrices, setUpsellPrices] = useState<Record<string, number>>(
    Object.fromEntries(mockUpsells.map((u) => [u.id, u.price]))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const isAdmin = user?.role === "Administrador";
  if (!isAdmin) return <Navigate to="/dashboard" replace />;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Analytics":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Medical":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      case "Tactics":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Transfers":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Reports":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upsells</h1>
          <p className="text-gray-400">Gerenciar todos os módulos disponíveis na plataforma</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Package className="w-5 h-5 text-cyan-400" />
              <p className="text-sm text-gray-400">Total de Módulos</p>
            </div>
            <p className="text-3xl font-bold text-white">{mockUpsells.length}</p>
          </div>
        </div>

        {/* Upsells Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUpsells.map((upsell) => (
            <div
              key={upsell.id}
              className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Package className="w-6 h-6 text-cyan-400" />
                </div>
                <Badge className={getCategoryColor(upsell.category)}>
                  {upsell.category}
                </Badge>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-white mb-2">{upsell.name}</h3>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-6">{upsell.description}</p>

              {/* Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Preço Mensal</span>
                  {editingId === upsell.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold">€</span>
                      <input
                        type="number"
                        className="w-24 bg-[#0a1628] border border-cyan-500/40 rounded-lg px-2 py-0.5 text-white text-sm outline-none"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = parseInt(editValue);
                            if (!isNaN(val) && val > 0) setUpsellPrices((p) => ({ ...p, [upsell.id]: val }));
                            setEditingId(null);
                          } else if (e.key === "Escape") {
                            setEditingId(null);
                          }
                        }}
                        onBlur={() => {
                          const val = parseInt(editValue);
                          if (!isNaN(val) && val > 0) setUpsellPrices((p) => ({ ...p, [upsell.id]: val }));
                          setEditingId(null);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-white">€{upsellPrices[upsell.id]}</span>
                      <button
                        onClick={() => { setEditingId(upsell.id); setEditValue(String(upsellPrices[upsell.id])); }}
                        className="text-gray-600 hover:text-cyan-400 transition-colors ml-1"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Clientes Ativos</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white">{upsell.activeClients}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Receita Mensal</span>
                  <span className="font-semibold text-green-400">
                    €{(upsellPrices[upsell.id] * upsell.activeClients).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Detail Button */}
              <button
                className="mt-2 w-full px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg text-sm font-semibold transition-colors"
                onClick={() => setSelectedUpsell(upsellDetails[upsell.name])}
              >
                Ver Detalhes do Módulo
              </button>
            </div>
          ))}
        </div>

        {/* Upsell Detail Dialog */}
        <Dialog open={!!selectedUpsell} onOpenChange={() => setSelectedUpsell(null)}>
          <DialogContent className="bg-[#0f1c2e] border-white/10 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedUpsell && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <selectedUpsell.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-white">
                        {selectedUpsell.name}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-gray-400">
                        {selectedUpsell.description}
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-6">
                  {/* Full Description */}
                  <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-cyan-500/20">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedUpsell.fullDescription}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-cyan-400" />
                      Funcionalidades
                    </h3>
                    <div className="space-y-2">
                      {selectedUpsell.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-[#0a1628]/30 rounded-lg p-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Benefícios Estratégicos
                    </h3>
                    <div className="space-y-2">
                      {selectedUpsell.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3 bg-[#0a1628]/30 rounded-lg p-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Preço Mensal</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        €{upsellPrices[mockUpsells.find((u) => u.name === selectedUpsell.name)?.id ?? "1"]}
                      </p>
                    </div>
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-gray-400">Clientes Ativos</span>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {mockUpsells.find((u) => u.name === selectedUpsell.name)?.activeClients}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
