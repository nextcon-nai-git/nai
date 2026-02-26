
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
  ArrowRight
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

const COMERCIAL_CONFIG = {
  taxa_setup_unica: 4500.00,
  planos: [
    {
      id: "essencial",
      nome: "Plano Essencial",
      foco: "Gestão Básica",
      icon: Construction,
      tiers: {
        200: 1590.00,
        400: 3290.00,
        600: 4590.00,
        800: 5890.00
      },
      features: ["Armazenamento Nuvem ASOs", "Alertas de Vencimento", "Emissão PGR/PCMSO"]
    },
    {
      id: "avancado",
      nome: "Plano Avançado",
      foco: "Automação eSocial",
      icon: Zap,
      tiers: {
        200: 2490.00,
        400: 5190.00,
        600: 7490.00,
        800: 9890.00
      },
      features: ["Tudo do Essencial", "Integração eSocial S-2220/S-2240", "CIPA Digital"]
    },
    {
      id: "enterprise",
      nome: "Plano Enterprise",
      foco: "Blindagem Total + Terceiros",
      icon: ShieldPlus,
      tiers: {
        200: 3890.00,
        400: 7990.00,
        600: 10990.00,
        800: 13990.00
      },
      features: ["Tudo do Avançado", "Gestão de Empreiteiras", "Prontuário Ambulatório", "SLA Exclusivo"]
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
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Proposta Especializada: Construtoras</h1>
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
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-8">
              <CardTitle className="text-lg font-black text-primary uppercase">Planos Nextcon SST</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Escala de Preços para {numLives} Vidas</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-4">
                {COMERCIAL_CONFIG.planos.map((plan) => {
                  const Icon = plan.icon;
                  const isActive = selectedPlanId === plan.id;
                  const currentPrice = plan.tiers[numLives as keyof typeof plan.tiers];
                  
                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all cursor-pointer group flex items-center gap-6",
                        isActive ? "bg-primary/5 border-primary shadow-lg scale-[1.01]" : "bg-slate-50 border-transparent hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform",
                        isActive ? "bg-primary text-white" : "bg-white text-primary"
                      )}>
                        <Icon className="size-8" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-black text-primary uppercase text-sm">{plan.nome}</h3>
                          <Badge className="bg-slate-200 text-slate-600 font-black text-[8px] uppercase px-2">{plan.foco}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {plan.features.map(f => (
                            <Badge key={f} variant="outline" className="text-[8px] font-bold uppercase border-primary/10 text-primary/40 h-5 px-2">{f}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Mensal</p>
                        <p className="text-xl font-black text-primary font-headline">
                          {currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden sticky top-24">
            <CardHeader className="bg-primary text-white p-8">
              <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Building2 className="size-4 text-accent" /> Fechar Proposta
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
                  <p className="text-[10px] font-black uppercase text-slate-400">Setup Único</p>
                  <p className="text-sm font-bold text-primary">R$ 4.500,00</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-end mb-6">
                    <p className="text-[10px] font-black uppercase text-slate-400">Total Inicial</p>
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
              <CardTitle className="text-[10px] font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="size-3" /> Blindagem NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-[11px] leading-relaxed italic text-white/60">
                "Este orçamento já contempla a automação de eventos S-2220 e S-2240 para o tier de {numLives} vidas, garantindo 100% de conformidade com a Reforma eSocial."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
