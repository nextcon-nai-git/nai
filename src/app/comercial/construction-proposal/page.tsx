"use client"

import * as React from "react"
import { 
  HardHat, 
  Building2, 
  Zap,
  FileText,
  Loader2,
  ShieldCheck,
  ShieldPlus,
  Target,
  Construction,
  Sparkles,
  ArrowRight,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { collection } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const COMERCIAL_CONFIG = {
  taxa_setup_unica: 4500.00,
  planos: [
    {
      id: "essencial",
      nome: "Plano Essencial",
      foco: "Gestão Básica & NR-18",
      icon: Construction,
      tiers: {
        200: 1590.00,
        400: 3290.00,
        600: 4590.00,
        800: 5890.00
      },
      features: [
        { title: "PGR e PCMSO Digital", desc: "Emissão e controle de validade automática." },
        { title: "Gestão de EPIs (NR-06)", desc: "Ficha digital com assinatura por foto/biometria." },
        { title: "Checklists NR-18", desc: "Inspeções de canteiro via App mobile." },
        { title: "Alertas de Vencimento", desc: "Avisos automáticos para ASOs e Exames." }
      ]
    },
    {
      id: "avancado",
      nome: "Plano Avançado",
      foco: "Automação e-Social",
      icon: Zap,
      tiers: {
        200: 2490.00,
        400: 5190.00,
        600: 7490.00,
        800: 9890.00
      },
      features: [
        { title: "Tudo do Essencial", desc: "Base de gestão completa inclusa." },
        { title: "Firewall eSocial", desc: "Envio automático de S-2220 e S-2240 sem erros." },
        { title: "Treinamentos via QR Code", desc: "Presença digital em treinamentos de NR-35/18." },
        { title: "CIPA Digital (NR-05)", desc: "Eleição, atas e reuniões 100% no sistema." },
        { title: "Dashboards de BI", desc: "Visão estratégica de saúde e segurança por obra." }
      ]
    },
    {
      id: "enterprise",
      nome: "Plano Enterprise",
      foco: "Blindagem Total & Terceiros",
      icon: ShieldPlus,
      tiers: {
        200: 3890.00,
        400: 7990.00,
        600: 10990.00,
        800: 13990.00
      },
      features: [
        { title: "Tudo do Avançado", desc: "Automação total de processos inclusa." },
        { title: "Gestão de Terceiros", desc: "Auditoria documental de empreiteiras (Passivo Solidário)." },
        { title: "Prontuário de Ambulatório", desc: "Gestão clínica para enfermaria de canteiro." },
        { title: "Integração Catracas IoT", desc: "Bloqueio físico de entrada para funcionários irregulares." },
        { title: "SLA de Suporte Exclusivo", desc: "Gerente de conta dedicado para implantação VIP." }
      ]
    }
  ]
};

const LIVES_STEPS = [200, 400, 600, 800];

export default function ConstructionProposalPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [selectedPlanId, setSelectedPlanId] = React.useState<string>("essencial")
  const [isSaving, setIsSaving] = React.useState(false)
  const [companyName, setCompanyName] = React.useState("")
  const [livesIndex, setLivesIndex] = React.useState([0])

  const dallLogo = "https://i.ibb.co/gZv2fyXt/logo.png";
  const numLives = LIVES_STEPS[livesIndex[0]];

  const selectedPlan = React.useMemo(() => 
    COMERCIAL_CONFIG.planos.find(p => p.id === selectedPlanId), 
  [selectedPlanId]);

  const pricingDetails = React.useMemo(() => {
    if (!selectedPlan) return { monthly: 0, total: 0 };
    const monthly = selectedPlan.tiers[numLives as keyof typeof selectedPlan.tiers] || 0;
    return { 
      monthly, 
      total: monthly + COMERCIAL_CONFIG.taxa_setup_unica
    };
  }, [selectedPlan, numLives]);

  const handleCreateProposal = async () => {
    if (!db || !selectedPlan || !companyName) {
      toast({ variant: "destructive", title: "Dados Incompletos", description: "Informe a empresa antes de gerar." })
      return
    }

    setIsSaving(true)
    try {
      const proposalData = {
        title: `Proposta Construtora: ${selectedPlan.nome} (${numLives} Vidas)`,
        companyId: "leads",
        companyName: companyName.toUpperCase(),
        type: 'comercial',
        status: 'to_review',
        priority: 'high',
        origin: 'construction_specialized',
        metadata: {
          planId: selectedPlan.id,
          lives: numLives,
          setupFee: COMERCIAL_CONFIG.taxa_setup_unica,
          monthlyFee: pricingDetails.monthly,
          totalInitial: pricingDetails.total
        },
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        checklist: [
          { id: '1', text: 'Vincular cronograma de obra', checked: false, mandatory: true },
          { id: '2', text: 'Validar lista de subempreiteiras', checked: false, mandatory: true },
          { id: '3', text: 'Confirmar Taxa de Setup R$ 4.500', checked: false, mandatory: true }
        ]
      }

      await addDocumentNonBlocking(collection(db, "companies", "leads", "tasks"), proposalData)
      
      toast({ 
        title: "Proposta Comercial Gerada!", 
        description: `O card para ${companyName} foi enviado para o funil comercial.` 
      })
      setCompanyName("")
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao Protocolar" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <style jsx global>{`
        .dall-proposal-slider [role="slider"] {
          width: 80px !important;
          height: 45px !important;
          border-radius: 8px !important;
          background-image: url('${dallLogo}') !important;
          background-size: 85% !important;
          background-repeat: no-repeat !important;
          background-position: center !important;
          background-color: white !important;
          border: 2px solid #001F3F !important;
          box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
          cursor: grab;
          transition: transform 0.2s ease;
        }
        .dall-proposal-slider [role="slider"]:active { cursor: grabbing; transform: scale(1.05); }
      `}</style>

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">NAI para Construtoras Premium</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest mt-2 flex items-center gap-2">
            <HardHat className="size-3 text-accent" /> Orçamentos automatizados por escala de canteiro.
          </p>
        </div>
        <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-10 px-4 flex items-center gap-2">
          <Target className="size-4" /> FOCO ENGENHARIA
        </Badge>
      </header>

      <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-10 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Building2 className="size-40" /></div>
        <div className="max-w-2xl mx-auto space-y-10 relative z-10">
          <div className="text-center space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Arraste para definir a escala de vidas</label>
            <h2 className="text-4xl font-black text-primary font-headline tracking-tighter">{numLives} VIDAS</h2>
          </div>
          
          <div className="px-10">
            <Slider 
              value={livesIndex} 
              onValueChange={setLivesIndex} 
              max={LIVES_STEPS.length - 1} 
              step={1} 
              className="dall-proposal-slider"
            />
            <div className="flex justify-between mt-6">
              {LIVES_STEPS.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={cn("size-2 rounded-full mb-2", livesIndex[0] === i ? "bg-primary" : "bg-slate-200")} />
                  <span className={cn("text-[9px] font-black uppercase tracking-tighter", livesIndex[0] === i ? "text-primary" : "text-slate-300")}>
                    {step} Vidas
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {COMERCIAL_CONFIG.planos.map((plan) => {
              const Icon = plan.icon;
              const isActive = selectedPlanId === plan.id;
              const currentPrice = plan.tiers[numLives as keyof typeof plan.tiers];
              
              return (
                <Card 
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={cn(
                    "cursor-pointer border-2 transition-all duration-500 rounded-[2.5rem] overflow-hidden group",
                    isActive ? "bg-white border-primary shadow-2xl scale-[1.02]" : "bg-slate-50 border-transparent hover:border-slate-200"
                  )}
                >
                  <CardHeader className={cn(
                    "p-8 border-b transition-colors",
                    isActive ? "bg-primary/5" : "bg-transparent"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform",
                          isActive ? "bg-primary text-white" : "bg-white text-primary"
                        )}>
                          <Icon className="size-8" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-primary uppercase leading-none">{plan.nome}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{plan.foco}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Investimento Mensal</p>
                        <p className="text-3xl font-black text-primary font-headline">
                          {currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-white rounded-2xl border border-slate-100 group-hover:border-primary/10 transition-all">
                          <div className="p-1.5 bg-primary/5 rounded-lg h-fit">
                            <CheckCircle2 className="size-3.5 text-primary" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[11px] font-black text-primary uppercase">{feature.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium leading-tight">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden sticky top-24">
            <CardHeader className="bg-primary text-white p-8">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Building2 className="size-4 text-accent" /> Protocolar Proposta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Empresa Alvo</label>
                <Input 
                  placeholder="Nome da Construtora" 
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase shadow-inner" 
                />
              </div>

              <div className="pt-6 border-t border-dashed space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-slate-400">Plano Selecionado</p>
                  <Badge variant="secondary" className="text-[9px] font-black uppercase">{selectedPlan?.nome}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-slate-400">Setup Único (Engenharia)</p>
                  <p className="text-sm font-bold text-primary">R$ 4.500,00</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-end mb-6">
                    <p className="text-[10px] font-black uppercase text-slate-400">Total Primeiro Mês</p>
                    <h2 className="text-2xl font-black text-accent font-headline">
                      {pricingDetails.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h2>
                  </div>
                  <Button 
                    onClick={handleCreateProposal} 
                    disabled={isSaving || !companyName}
                    className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                  >
                    {isSaving ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5 text-accent" />}
                    Ativar Card Comercial
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#090e24] text-white border-none p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck className="size-24 text-accent" />
            </div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-2">
                <Sparkles className="size-3" /> Blindagem Especializada
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-[11px] leading-relaxed italic text-white/60">
                "Esta proposta contempla a automação de conformidade para o canteiro de {numLives} vidas, incluindo a gestão de eventos e-Social e a proteção jurídica contra o passivo solidário de empreiteiras."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
