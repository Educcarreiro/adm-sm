import { MainLayout } from "../components/MainLayout";
import { Package, Target, TrendingUp, Shield, Activity, FileText, BarChart3 } from "lucide-react";
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

const upsellDetails: UpsellDetail[] = [
  {
    name: "Fit Tático",
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
  {
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
  {
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
  {
    name: "Health Analytics",
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
  {
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
  {
    name: "Análises",
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
];

const cardStyle = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "16px",
  padding: "24px",
};

export function Upsells() {
  const [selectedUpsell, setSelectedUpsell] = useState<UpsellDetail | null>(null);

  return (
    <MainLayout>
      <div className="p-8 max-w-7xl mx-auto">

        <div className="mb-12">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Upsells</h1>
          <p className="text-sm" style={{ color: "#475569" }}>Módulos disponíveis na plataforma Soccer Mind</p>
        </div>

        {/* Stats */}
        <div className="mb-12">
          <div style={{ ...cardStyle, display: "inline-flex", alignItems: "center", gap: "16px", padding: "20px 28px" }}>
            <Package className="w-5 h-5" style={{ color: "#334155" }} />
            <div>
              <p className="text-2xl font-semibold tracking-tight text-white">{upsellDetails.length}</p>
              <p className="text-xs" style={{ color: "#475569" }}>Total de Módulos</p>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upsellDetails.map((upsell) => {
            const Icon = upsell.icon;
            return (
              <div
                key={upsell.name}
                style={cardStyle}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.border = "1px solid rgba(255,255,255,0.05)"; }}
                className="transition-all duration-200"
              >
                <div className="mb-5">
                  <Icon className="w-5 h-5" style={{ color: "#334155" }} />
                </div>

                <h3 className="text-base font-semibold text-white mb-2">{upsell.name}</h3>
                <p className="text-sm mb-6" style={{ color: "#475569" }}>{upsell.description}</p>

                <button
                  onClick={() => setSelectedUpsell(upsell)}
                  className="text-xs font-medium transition-colors duration-150"
                  style={{ color: "#334155" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#334155"; }}
                >
                  Ver detalhes →
                </button>
              </div>
            );
          })}
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedUpsell} onOpenChange={() => setSelectedUpsell(null)}>
          <DialogContent style={{ background: "#080f1e", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", color: "white", maxWidth: "640px" }} className="max-h-[90vh] overflow-y-auto">
            {selectedUpsell && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-1">
                    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "10px" }}>
                      <selectedUpsell.icon className="w-5 h-5" style={{ color: "#475569" }} />
                    </div>
                    <div>
                      <DialogTitle className="text-lg font-semibold text-white">{selectedUpsell.name}</DialogTitle>
                      <DialogDescription className="text-sm" style={{ color: "#475569" }}>{selectedUpsell.description}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>{selectedUpsell.fullDescription}</p>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#334155" }}>Funcionalidades</p>
                    <div className="space-y-2">
                      {selectedUpsell.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#334155" }} />
                          <span className="text-sm" style={{ color: "#94a3b8" }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "#334155" }}>Benefícios Estratégicos</p>
                    <div className="space-y-2">
                      {selectedUpsell.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.02)" }}>
                          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#334155" }} />
                          <span className="text-sm" style={{ color: "#94a3b8" }}>{benefit}</span>
                        </div>
                      ))}
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
