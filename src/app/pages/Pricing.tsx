import { MainLayout } from "../components/MainLayout";
import { DollarSign, TrendingUp, ChevronDown, ChevronUp, Shield, Zap, Target, AlertCircle, Eye, Activity, TrendingDown, Lock, FileText, BarChart3 } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { useState } from "react";

export function Pricing() {
  const [serieAOpen, setSerieAOpen] = useState(true);
  const [serieBOpen, setSerieBOpen] = useState(true);
  const [diferenciaisOpen, setDiferenciaisOpen] = useState(false);

  const serieAPlans = [
    {
      tier: "Primeira Prateleira",
      subtitle: "Top Clubs",
      price: "R$ 35.000 - R$ 45.000",
      period: "/ mês",
      features: [
        "Clubes com alta exposição midiática e folha elevada",
        "Uso completo da plataforma",
        "Prioridade máxima e shadow lists restritas",
        "Ticket médio esperado: R$ 50k+ com upsells",
      ],
      badge: "Premium Elite",
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      tier: "Segunda Prateleira",
      subtitle: "Série A",
      price: "R$ 20.000 - R$ 30.000",
      period: "/ mês",
      features: [
        "Clubes com orçamento intermediário",
        "Foco em eficiência e redução de erro",
        "Acesso completo com menor prioridade",
      ],
      badge: "Premium",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      tier: "Terceira Prateleira",
      subtitle: "Série A",
      price: "R$ 15.000 - R$ 20.000",
      period: "/ mês",
      features: [
        "Clubes de menor orçamento na Série A",
        "Foco em scout e revenda",
        "Menor customização",
      ],
      badge: "Standard",
      badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    },
  ];

  const serieBPlans = [
    {
      tier: "Primeira Prateleira",
      subtitle: "Série B",
      price: "R$ 15.000 - R$ 20.000",
      period: "/ mês",
      features: [
        "Clubes candidatos ao acesso",
        "Uso estratégico para montagem de elenco",
        "Foco em risco financeiro",
      ],
      badge: "Growth Elite",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      tier: "Segunda Prateleira",
      subtitle: "Série B",
      price: "R$ 10.000 - R$ 15.000",
      period: "/ mês",
      features: [
        "Clubes estáveis da Série B",
        "Scout focado e ranking por posição",
      ],
      badge: "Growth",
      badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
    {
      tier: "Terceira Prateleira",
      subtitle: "Série B",
      price: "R$ 7.000 - R$ 10.000",
      period: "/ mês",
      features: [
        "Clubes em reconstrução",
        "Modelo enxuto e altamente eficiente",
      ],
      badge: "Essential",
      badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    },
  ];

  const diferenciais = [
    {
      icon: Shield,
      title: "Anti-Flop (Redução de Erro)",
      iconBg: "bg-cyan-500/10",
      iconBorder: "border-cyan-500/20",
      iconColor: "text-cyan-400",
      features: [
        "Score de risco composto (performance, tático, físico, adaptação e financeiro)",
        "Comparação com padrões históricos de flops",
        "Registro técnico que protege decisões da diretoria",
        "Sistema de alerta — não substitui o scout humano",
      ],
    },
    {
      icon: Target,
      title: "Fit Tático (DNA do Clube)",
      iconBg: "bg-blue-500/10",
      iconBorder: "border-blue-500/20",
      iconColor: "text-blue-400",
      features: [
        "Modelagem do estilo de jogo do clube",
        "Compatibilidade real jogador × sistema",
        "Avaliação de encaixe com treinador atual e cenários futuros",
      ],
    },
    {
      icon: Zap,
      title: "War Room da Janela",
      iconBg: "bg-purple-500/10",
      iconBorder: "border-purple-500/20",
      iconColor: "text-purple-400",
      features: [
        "Simulação de entradas e saídas",
        "Impacto esportivo, financeiro e etário do elenco",
        "Base técnica para decisões sob pressão",
      ],
    },
    {
      icon: AlertCircle,
      title: "Alertas de Oportunidade de Mercado",
      iconBg: "bg-orange-500/10",
      iconBorder: "border-orange-500/20",
      iconColor: "text-orange-400",
      features: [
        "Fim de contrato",
        "Queda de valor de mercado",
        "Jogadores fora do radar da mídia",
      ],
    },
    {
      icon: Eye,
      title: "Shadow List (Lista Estratégica Protegida)",
      iconBg: "bg-indigo-500/10",
      iconBorder: "border-indigo-500/20",
      iconColor: "text-indigo-400",
      features: [
        "Lista privada de alvos por posição",
        "Controle de acesso e rastreabilidade",
        "Redução de vazamentos estratégicos",
      ],
    },
    {
      icon: TrendingDown,
      title: "Risk Score Financeiro",
      iconBg: "bg-red-500/10",
      iconBorder: "border-red-500/20",
      iconColor: "text-red-400",
      features: [
        "Avaliação do risco total do investimento",
        "Cenários de perda máxima",
        "Proteção contra contratos desequilibrados",
      ],
    },
    {
      icon: TrendingUp,
      title: "Liquidity Score (Revenda)",
      iconBg: "bg-green-500/10",
      iconBorder: "border-green-500/20",
      iconColor: "text-green-400",
      features: [
        "Probabilidade de revenda em 12–24 meses",
        "Mercados compradores prováveis",
        "Transformação do jogador em ativo financeiro",
      ],
    },
    {
      icon: Activity,
      title: "Módulo Físico / Prevenção",
      iconBg: "bg-pink-500/10",
      iconBorder: "border-pink-500/20",
      iconColor: "text-pink-400",
      features: [
        "Histórico e recorrência de lesões",
        "Stress físico por temporada",
        "Redução de risco de atleta improdutivo no DM",
      ],
    },
    {
      icon: BarChart3,
      title: "Scout de Adversários",
      iconBg: "bg-yellow-500/10",
      iconBorder: "border-yellow-500/20",
      iconColor: "text-yellow-400",
      features: [
        "Análise de padrões ofensivos e defensivos",
        "Exploração de fragilidades recorrentes",
        "Valor direto para comissão técnica",
      ],
    },
    {
      icon: FileText,
      title: "Governança e Auditoria de Decisão",
      iconBg: "bg-slate-500/10",
      iconBorder: "border-slate-500/20",
      iconColor: "text-slate-400",
      features: [
        "Histórico de recomendações",
        "Documentação técnica das decisões",
        "Blindagem política e institucional",
      ],
    },
  ];

  return (
    <MainLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Preços por Prateleira</h1>
            <p className="text-gray-400">
              Precificação estruturada por séries A e B, considerando orçamento, exposição midiática e complexidade de decisão
            </p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        {/* Série A Section - Retrátil */}
        <div className="mb-6">
          <button
            onClick={() => setSerieAOpen(!serieAOpen)}
            className="w-full bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-cyan-500/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Série A</h2>
            </div>
            {serieAOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {serieAOpen && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {serieAPlans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.tier}</h3>
                      <p className="text-sm text-gray-400">{plan.subtitle}</p>
                    </div>
                    <Badge className={plan.badgeColor}>{plan.badge}</Badge>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="text-2xl font-bold text-white">{plan.price}</div>
                    <div className="text-sm text-gray-400">{plan.period}</div>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Série B Section - Retrátil */}
        <div className="mb-6">
          <button
            onClick={() => setSerieBOpen(!serieBOpen)}
            className="w-full bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-purple-500/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Série B</h2>
            </div>
            {serieBOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {serieBOpen && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {serieBPlans.map((plan, index) => (
                <div
                  key={index}
                  className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{plan.tier}</h3>
                      <p className="text-sm text-gray-400">{plan.subtitle}</p>
                    </div>
                    <Badge className={plan.badgeColor}>{plan.badge}</Badge>
                  </div>

                  <div className="mb-6 pb-6 border-b border-white/10">
                    <div className="text-2xl font-bold text-white">{plan.price}</div>
                    <div className="text-sm text-gray-400">{plan.period}</div>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Diferenciais Completos da Plataforma - Retrátil */}
        <div className="mb-6">
          <button
            onClick={() => setDiferenciaisOpen(!diferenciaisOpen)}
            className="w-full bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:border-green-500/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-400" />
              <h2 className="text-2xl font-bold text-white">Diferenciais Completos da Plataforma</h2>
            </div>
            {diferenciaisOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {diferenciaisOpen && (
            <div className="mt-6 space-y-6">
              {/* Intro */}
              <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">
                <p className="text-gray-300 text-sm leading-relaxed">
                  Este documento consolida todos os diferenciais estratégicos, técnicos e operacionais da SoccerMind. 
                  O foco da plataforma é <span className="text-green-400 font-semibold">reduzir risco, aumentar eficiência de investimento e profissionalizar a tomada de decisão</span> em clubes de futebol.
                </p>
              </div>

              {/* Grid de Diferenciais */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {diferenciais.map((diferencial, index) => {
                  const Icon = diferencial.icon;
                  return (
                    <div
                      key={index}
                      className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-green-500/30 transition-all"
                    >
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`${diferencial.iconBg} ${diferencial.iconBorder} w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-5 h-5 ${diferencial.iconColor}`} />
                        </div>
                        <h3 className="text-lg font-bold text-white">{diferencial.title}</h3>
                      </div>

                      <div className="space-y-2">
                        {diferencial.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-[#0f1c2e]/50 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
              <DollarSign className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Estratégia de Precificação</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                A precificação da Soccer Mind é estruturada por prateleiras competitivas, considerando orçamento, 
                pressão política, exposição midiática e complexidade de decisão de cada clube. Os valores incluem 
                acesso à plataforma completa, com diferenciação em prioridade de atendimento, customização e 
                funcionalidades exclusivas conforme o tier contratado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}