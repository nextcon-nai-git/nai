
"use client"

import * as React from "react"
import { 
  Building2, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight,
  Users,
  HardHat,
  ShieldAlert,
  ClipboardCheck,
  Zap,
  Monitor,
  Brain,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileWarning,
  Flame,
  ZapOff,
  MoveUp,
  Stethoscope,
  Construction
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import Link from "next/link"

const SIMULATOR_DATA = [
  {
    phase: "Fase 1: Baixa Complexidade (Canteiro)",
    lives: "200 vidas",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    cipa: "14 Membros",
    sesmt: "2 Técnicos de Seg.",
    status: "Risco Baixo",
    statusCor: "text-emerald-600",
    subStatus: "S-2240 Estável",
    nrs: [
      { 
        nr: "NR-18 (A Bíblia da Construção)", 
        items: [
          "PGR específico do canteiro emitido e atualizado?", 
          "Áreas de vivência (alojamento/refeitório) limpas e higienizadas?", 
          "Proteções coletivas (bandejas e guarda-corpos) instaladas?",
          "Sinalização de segurança visível em todas as frentes de obra?"
        ], 
        solution: "Checklist digital via App Nextcon com coleta de evidências fotográficas e geolocalização." 
      },
      { 
        nr: "NR-35 (Trabalho em Altura)", 
        items: [
          "Análise de Risco (APR) preenchida e assinada por todos?", 
          "Cinto de segurança paraquedista inspecionado e registrado?", 
          "Linha de vida instalada e certificada por engenheiro?",
          "Treinamento de 8h realizado para 100% dos executantes?"
        ], 
        solution: "Bloqueio inteligente: O sistema impede o check-in do colaborador se o treinamento NR-35 estiver vencido." 
      },
      { 
        nr: "NR-24 (Condições Sanitárias)", 
        items: [
          "Número de chuveiros e vasos sanitários atende ao efetivo atual?", 
          "Refeitório possui local adequado para lavagem de mãos?", 
          "Vestiários possuem armários individuais com cadeado?"
        ], 
        solution: "Dimensionamento automático no sistema baseado no número de vidas importado do RH." 
      }
    ]
  },
  {
    phase: "Fase 2: Média Complexidade (EXPANSÃO PLANEJADA)",
    lives: "500 vidas",
    color: "text-amber-600",
    bg: "bg-amber-50",
    cipa: "18 Membros (Eleição Digital)",
    sesmt: "Engenheiro e Médico + TSTs",
    status: "Risco Médio",
    statusCor: "text-amber-600",
    subStatus: "Cruzamento eSocial Ativo",
    nrs: [
      { 
        nr: "NR-01 (GRO / PGR)", 
        items: [
          "Inventário de riscos cruzado com o eSocial S-2240?", 
          "Plano de ação possui prazos e responsáveis designados?",
          "Identificação de perigos inclui fatores psicossociais?"
        ], 
        solution: "Dashboard de Gestão de Riscos: Visualização em tempo real das ações pendentes e críticas." 
      },
      { 
        nr: "NR-04 & NR-05 (SESMT e CIPA)", 
        items: [
          "Dimensionamento do SESMT atende ao Quadro II da norma?", 
          "Eleição da CIPA realizada digitalmente com atas registradas?",
          "Treinamento de assédio realizado para toda a comissão?"
        ], 
        solution: "Módulo CIPA Digital: Votação, atas e treinamentos 100% sem papel e auditáveis." 
      },
      { 
        nr: "NR-06 (Controle de EPIs)", 
        items: [
          "Fichas de EPI assinadas digitalmente (sem papel)?", 
          "Controle de validade do CA (Certificado de Aprovação)?",
          "Reposição periódica baseada na vida útil do equipamento?"
        ], 
        solution: "Quiosque Digital EPI: Assinatura biométrica/foto na entrega, gerando validade jurídica total." 
      },
      { 
        nr: "NR-07 (PCMSO)", 
        items: [
          "Cronograma de exames (Admissionais/Periódicos) em dia?", 
          "Exames complementares (audiometria/visão) realizados?",
          "ASOs emitidos conforme riscos do PGR (NR-01)?"
        ], 
        solution: "Sincronização PGR x PCMSO: Se o PGR muda, o sistema alerta a necessidade de novos exames." 
      },
      { 
        nr: "NR-09 (Exposições Ocupacionais)", 
        items: [
          "Medições de ruído (dosimetria) realizadas recentemente?", 
          "Avaliação quantitativa de poeira (sílica/cimento)?",
          "Laudo de Higiene Ocupacional assinado por técnico?"
        ], 
        solution: "Central de Laudos NAI: Armazenamento e alerta de vencimento de medições ambientais." 
      },
      { 
        nr: "NR-12 (Máquinas e Equipamentos)", 
        items: [
          "Betoneiras e serras possuem proteções fixas e móveis?", 
          "Sensores de segurança testados e funcionando?",
          "Manutenções preventivas registradas em livro próprio?"
        ], 
        solution: "QR Code nas máquinas: Inspeção diária via celular antes de ligar o equipamento." 
      },
      { 
        nr: "NR-10 (Segurança Elétrica)", 
        items: [
          "Instalações provisórias possuem DR (Diferencial Residual)?", 
          "Quadros de força trancados e sinalizados corretamente?",
          "Eletricistas possuem treinamento NR-10 Básico e SEP?"
        ], 
        solution: "Firewall Elétrico: Monitoramento de certificados de treinamento na admissão do eletricista." 
      }
    ]
  },
  {
    phase: "Fase 3: Alta Complexidade (Mini-Hospital)",
    lives: "800+ vidas",
    color: "text-red-600",
    bg: "bg-red-50",
    cipa: "22 Membros (Gestão Atas)",
    sesmt: "Ambulatório e Enfermagem",
    status: "Risco Crítico",
    statusCor: "text-red-600",
    subStatus: "Responsabilidade Solidária",
    nrs: [
      { 
        nr: "NR-11 (Movimentação de Cargas)", 
        items: [
          "Cachorros, eslingas e cabos de aço inspecionados?", 
          "Operadores de grua possuem ASO específico?",
          "Plano de Içamento (Rigging) aprovado para cargas pesadas?"
        ], 
        solution: "Gestão de Ativos: Controle rigoroso de inspeções de acessórios de içamento." 
      },
      { 
        nr: "NR-33 (Espaços Confinados)", 
        items: [
          "Permissão de Entrada e Trabalho (PET) emitida?", 
          "Vigilante de espaço confinado presente no local?",
          "Medição de gases realizada antes e durante o acesso?"
        ], 
        solution: "Monitoramento de Riscos Críticos: Alerta instantâneo para o SESMT ao abrir uma PET." 
      },
      { 
        nr: "NR-15 & NR-16 (Insalubridade / Periculosidade)", 
        items: [
          "Laudos técnicos fundamentam o pagamento de adicionais?", 
          "Cruzamento de rubricas da folha com eventos eSocial?",
          "Avaliação de agentes químicos e vibração em dia?"
        ], 
        solution: "ROI Tributário: Auditoria NAI para evitar pagamentos indevidos ou multas por omissão." 
      },
      { 
        nr: "NR-17 (Ergonomia)", 
        items: [
          "Análise Ergonômica do Trabalho (AET) das funções pesadas?", 
          "Equipamentos de auxílio para transporte de sacaria?",
          "Rodízio de atividades para evitar LER/DORT implementado?"
        ], 
        solution: "Diagrama de Risco NAI: Identificação visual de postos com alta carga ergonômica." 
      },
      { 
        nr: "NR-23 (Incêndio) & NR-35", 
        items: [
          "Brigada de Incêndio formada e treinada conforme carga?", 
          "Extintores desobstruídos e com validade de carga OK?",
          "Rotas de fuga sinalizadas e iluminadas?"
        ], 
        solution: "Checklist de Segurança Predial: Inspeção mensal automatizada dos itens de combate a incêndio." 
      },
      { 
        nr: "Gestão de Terceiros (O Maior Passivo)", 
        items: [
          "Empreiteiras enviaram PGR e PCMSO compatíveis?", 
          "Terceirizados possuem ASO e treinamentos em dia?",
          "Controle de acesso bloqueia terceiros irregulares?"
        ], 
        solution: "Portal do Terceiro Nextcon: A subcontratada sobe os documentos e o sistema valida a entrada." 
      }
    ]
  }
];

const ERGO_DATA: Record<string, { title: string; risk: string; action: string }> = {
  head: { 
    title: "Cabeça, Pescoço e Audição", 
    risk: "Ruído excessivo de bate-estacas e postura inadequada olhando para cima (cargas suspensas). Risco alto de PAIR.", 
    action: "O algoritmo cruza a audiometria do ASO com a dosimetria de ruído do PGR, alertando a troca preventiva de setor." 
  },
  back: { 
    title: "Lombar e Coluna", 
    risk: "Levantamento de sacos de cimento (50kg). Causa nº 1 de afastamentos previdenciários na construção.", 
    action: "Módulo de AET mapeia o posto. O sistema bloqueia tarefas pesadas para funcionários recém-retornados do INSS." 
  },
  arms: { 
    title: "Braços e Punhos", 
    risk: "Movimentos repetitivos de armadores. Gera passivo por LER/DORT ao fim da obra.", 
    action: "Controle de pausas e ginástica laboral rastreada via sistema. Ficha médica eletrônica comprova a prevenção." 
  },
  legs: { 
    title: "Joelhos e Pernas", 
    risk: "Trabalho ajoelhado prolongado (pisos) e terrenos acidentados.", 
    action: "Gestão inteligente de EPIs: Controle automático de validade e reposição de joelheiras aprovadas." 
  }
};

const FIXED_PAYROLL = 30000000;
const FAP_OPTIONS = [1.0, 1.1, 1.2];

export default function ScaleSimulator() {
  const [scaleSlider, setScaleSlider] = React.useState([0]);
  const [fapIndex, setFapIndex] = React.useState([2]); 
  const [selectedPart, setSelectedPart] = React.useState<string | null>(null);

  const dallLogo = "https://i.ibb.co/gZv2fyXt/logo.png";

  const currentData = SIMULATOR_DATA[scaleSlider[0]];
  const currentFap = FAP_OPTIONS[fapIndex[0]];
  
  const ratBase = 0.03;
  const annualRatCost = FIXED_PAYROLL * ratBase * currentFap;
  const bestCaseCost = FIXED_PAYROLL * ratBase * 1.0;
  const potentialSaving = annualRatCost - bestCaseCost;

  return (
    <div className="space-y-10 pb-20 animate-in fade-in duration-700">
      <style jsx global>{`
        .dall-custom-slider [role="slider"] {
          width: 110px !important;
          height: 60px !important;
          border-radius: 12px !important;
          background-image: url('${dallLogo}') !important;
          background-size: 90% !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-color: white !important;
          border: 2px solid #001F3F !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2) !important;
          cursor: grab;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .dall-custom-slider [role="slider"]:active {
          cursor: grabbing;
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(0,0,0,0.3) !important;
        }
      `}</style>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">DALL CONSTRUCOES LTDA</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
            <Building2 className="size-3" /> CNPJ: 11.306.970/0001-36 • Simulador de Escala e Acidentalidade
          </p>
        </div>
        <Badge className="bg-[#090e24] text-[#f59e0b] font-black uppercase text-[10px] tracking-widest h-10 px-4 border border-[#f59e0b]/20 shadow-lg">
          FAP ATUAL: 1,2137
        </Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary text-white p-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <DollarSign className="size-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Impacto Tributário (RAT/FAP)</CardTitle>
                <CardDescription className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Análise baseada em folha anual de R$ 30M.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10 space-y-12">
            <div className="space-y-6">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Fator FAP Alvo (Arraste a Logo)</label>
                <span className={cn(
                  "text-2xl font-black font-headline px-4 py-1 rounded-xl shadow-inner",
                  currentFap === 1.0 ? "text-emerald-600 bg-emerald-50" : 
                  currentFap === 1.1 ? "text-amber-600 bg-amber-50" : 
                  "text-red-600 bg-red-50"
                )}>
                  {currentFap.toFixed(1)}
                </span>
              </div>
              <div className="px-4">
                <Slider 
                  value={fapIndex} 
                  onValueChange={setFapIndex} 
                  max={2} 
                  step={1} 
                  className="py-4 dall-custom-slider"
                />
                <div className="flex justify-between mt-2 text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                  <span>1.0 (Meta)</span>
                  <span>1.1</span>
                  <span>1.2 (Atual)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-slate-900 text-white rounded-[2.5rem] flex flex-col overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <TrendingUp className="size-48" />
          </div>
          <CardHeader className="p-8 pb-4">
            <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.3em]">Custo RAT Anual</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0 flex-1 flex flex-col justify-between space-y-8">
            <div>
              <h2 className="text-4xl font-black font-headline tracking-tighter">
                {annualRatCost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </h2>
              <p className="text-[10px] font-bold text-white/40 uppercase mt-2">Base RAT 3% x FAP {currentFap.toFixed(1)}</p>
            </div>

            {potentialSaving > 0 && (
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-2 animate-in zoom-in-95">
                <p className="text-[9px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-2">
                  <TrendingDown className="size-3" /> Potencial de Economia
                </p>
                <h3 className="text-2xl font-black text-emerald-400">
                  {potentialSaving.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </h3>
                <p className="text-[9px] text-white/40 leading-tight">Economia gerada pela gestão ativa Nextcon.</p>
              </div>
            )}

            <Button asChild className="w-full h-14 bg-accent hover:bg-accent/90 text-primary font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-2xl mt-auto">
              <Link href="/comercial" className="gap-2">Solicitar Blindagem ROI <ArrowUpRight className="size-4" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-10">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-4">
            <div className="flex justify-between items-end px-4">
              {["200", "500", "800+"].map((label, i) => (
                <span key={label} className={cn("text-[10px] font-black uppercase tracking-widest", scaleSlider[0] === i ? "text-primary scale-110" : "text-slate-300")}>
                  {label} Vidas
                </span>
              ))}
            </div>
            <Slider 
              value={scaleSlider} 
              onValueChange={setScaleSlider} 
              max={2} 
              step={1} 
              className="py-4 dall-custom-slider"
            />
          </div>
          
          <div className="text-center">
            <h2 className={cn("text-2xl font-black uppercase tracking-tight font-headline transition-colors", currentData.color)}>
              {currentData.phase}
            </h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{currentData.lives}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="card-shadow border-none bg-red-50/50 border-l-4 border-red-500 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase text-red-600 tracking-widest flex items-center gap-2">
              <FileWarning className="size-3" /> Acidentalidade Previdenciária
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-red-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase">CAT Emitidas</span>
              <span className="text-xl font-black text-primary">0</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-xl border border-red-100 shadow-sm">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Auxílio B91 (Acidente)</span>
              <span className="text-xl font-black text-red-600 animate-pulse">1</span>
            </div>
            <div className="p-3 bg-red-600 text-white rounded-xl text-center">
              <p className="text-[8px] font-black uppercase opacity-70">FAP Consolidado</p>
              <p className="text-lg font-black tracking-tighter">1,2137</p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard label="CIPA (NR-05)" value={currentData.cipa} icon={Users} color="text-blue-600" bg="bg-blue-50" />
          <StatCard label="SESMT (NR-04)" value={currentData.sesmt} icon={HardHat} color="text-orange-600" bg="bg-orange-50" />
          <StatCard label="Status eSocial" value={currentData.status} sub={currentData.subStatus} icon={ShieldAlert} color={currentData.statusCor} bg={currentData.bg} />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-headline font-black text-primary uppercase flex items-center gap-3">
          <ClipboardCheck className="size-6 text-primary" /> Central de NRs e Checklists Digitais
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentData.nrs.map((item, idx) => (
            <Card key={idx} className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="px-8 py-6 hover:no-underline hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 bg-primary/5 rounded-xl text-primary"><ClipboardCheck className="size-5" /></div>
                      <span className="font-black text-primary uppercase text-sm">{item.nr}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-8 pt-2">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Itens de Inspeção Obrigatória:</p>
                      <div className="space-y-3">
                        {item.items.map((check, cIdx) => (
                          <div key={cIdx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                            <Checkbox id={`check-${idx}-${cIdx}`} className="mt-0.5" />
                            <label htmlFor={`check-${idx}-${cIdx}`} className="text-xs font-medium text-slate-600 leading-tight cursor-pointer">
                              {check}
                            </label>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 p-4 bg-primary text-white rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10"><Zap className="size-8 text-white" /></div>
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">🚀 Automação Nextcon:</p>
                        <p className="text-xs font-medium leading-relaxed italic">{item.solution}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-headline font-black text-primary uppercase flex items-center gap-3">
          <Brain className="size-6 text-primary" /> Diagrama de Risco Ergonômico (NR-17)
        </h2>
        
        <Card className="card-shadow border-none bg-slate-100 rounded-[3rem] p-10 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-inner flex flex-col items-center">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-widest">Interativo: Clique nas partes</p>
              <svg viewBox="0 0 200 400" className="w-full max-w-[200px] h-auto drop-shadow-xl">
                <circle cx="100" cy="50" r="30" className={cn("transition-all duration-300 cursor-pointer stroke-[3]", selectedPart === 'head' ? "fill-red-500 stroke-red-700" : "fill-blue-100 stroke-blue-400")} onClick={() => setSelectedPart('head')} />
                <path d="M 60 90 L 140 90 L 130 220 L 70 220 Z" className={cn("transition-all duration-300 cursor-pointer stroke-[3]", selectedPart === 'back' ? "fill-red-500 stroke-red-700" : "fill-blue-100 stroke-blue-400")} onClick={() => setSelectedPart('back')} />
                <path d="M 55 95 L 15 180 L 35 190 L 65 110 Z" className={cn("transition-all duration-300 cursor-pointer stroke-[3]", selectedPart === 'arms' ? "fill-red-500 stroke-red-700" : "fill-blue-100 stroke-blue-400")} onClick={() => setSelectedPart('arms')} />
                <path d="M 145 95 L 185 180 L 165 190 L 135 110 Z" className={cn("transition-all duration-300 cursor-pointer stroke-[3]", selectedPart === 'arms' ? "fill-red-500 stroke-red-700" : "fill-blue-100 stroke-blue-400")} onClick={() => setSelectedPart('arms')} />
                <path d="M 70 225 L 50 380 L 80 380 L 95 225 Z" className={cn("transition-all duration-300 cursor-pointer stroke-[3]", selectedPart === 'legs' ? "fill-red-500 stroke-red-700" : "fill-blue-100 stroke-blue-400")} onClick={() => setSelectedPart('legs')} />
                <path d="M 130 225 L 150 380 L 120 380 L 105 225 Z" className={cn("transition-all duration-300 cursor-pointer stroke-[3]", selectedPart === 'legs' ? "fill-red-500 stroke-red-700" : "fill-blue-100 stroke-blue-400")} onClick={() => setSelectedPart('legs')} />
              </svg>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {selectedPart ? (
                <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
                  <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border-l-[12px] border-red-500">
                    <h3 className="text-2xl font-black text-primary uppercase font-headline mb-4 flex items-center gap-3">
                      <AlertTriangle className="size-8 text-red-500" /> {ERGO_DATA[selectedPart].title}
                    </h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed italic mb-8">
                      "{ERGO_DATA[selectedPart].risk}"
                    </p>
                    <div className="bg-primary text-white p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400">🛡️ Blindagem Nextcon</p>
                      <p className="text-sm font-bold leading-relaxed">{ERGO_DATA[selectedPart].action}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-20 border-4 border-dashed rounded-[3rem] opacity-30 text-center space-y-4">
                  <Monitor className="size-20 text-primary" />
                  <p className="text-xl font-black uppercase tracking-widest text-primary">Aguardando Interação Ergonômica</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-center pt-10">
        <Button asChild size="lg" className="h-16 px-12 bg-primary text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-2xl gap-3">
          <Link href="/comercial" className="gap-2">Solicitar Proposta de Blindagem <ArrowRight className="size-5" /></Link>
        </Button>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", bg, color)}><Icon className="size-5" /></div>
          <Badge variant="outline" className="text-[8px] font-black uppercase">LIVE</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className={cn("text-xl font-black leading-none", color)}>{value}</h3>
        {sub && <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{sub}</p>}
      </CardContent>
    </Card>
  )
}
