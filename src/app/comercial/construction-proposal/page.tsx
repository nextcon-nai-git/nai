
"use client"

import * as React from "react"
import { 
  HardHat, 
  Calculator, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  ShieldAlert, 
  Zap,
  FileText,
  Plus,
  Minus,
  Briefcase,
  Loader2,
  Construction,
  Hammer,
  ShieldCheck,
  Clock,
  ShieldPlus,
  Target
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const COMERCIAL_CONFIG = {
  taxa_setup_unica: 4500.00,
  planos: [
    {
      id: "essencial",
      nome: "Plano Essencial",
      foco: "Gestão Básica",
      icon: Construction,
      tiers: {
        ate_200: 1590.00,
        "201_a_500": 3290.00,
        "501_a_800": 4590.00
      },
      features: ["Armazenamento Nuvem ASOs", "Alertas de Vencimento", "Emissão PGR/PCMSO"]
    },
    {
      id: "avancado",
      nome: "Plano Avançado",
      foco: "Automação eSocial",
      icon: Zap,
      tiers: {
        ate_200: 2490.00,
        "201_a_500": 5190.00,
        "501_a_800": 7490.00
      },
      features: ["Tudo do Essencial", "Integração eSocial S-2220/S-2240", "CIPA Digital"]
    },
    {
      id: "enterprise",
      nome: "Plano Enterprise",
      foco: "Blindagem Total + Terceiros",
      icon: ShieldPlus,
      tiers: {
        ate_200: 3890.00,
        "201_a_500": 7990.00,
        "501_a_800": 10990.00
      },
      features: ["Tudo do Avançado", "Gestão de Empreiteiras/Terceiros", "Prontuário Ambulatório", "SLA Exclusivo"]
    }
  ]
};

export default function ConstructionProposalPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [selectedPlanId, setSelectedPlanId] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [companyName, setCompanyName] = React.useState("")
  const [numLives, setNumLives] = React.useState("200")

  const selectedPlan = React.useMemo(() => 
    COMERCIAL_CONFIG.planos.find(p => p.id === selectedPlanId), 
  [selectedPlanId]);

  const pricingDetails = React.useMemo(() => {
    if (!selectedPlan) return { monthly: 0, total: 0, tier: "" };
    
    const lives = Number(numLives);
    let tierKey: keyof typeof selectedPlan.tiers = "ate_200";
    let tierLabel = "Até 200 Vidas";

    if (lives > 800) {
      tierKey = "501_a_800"; // Fallback para teto do tier
      tierLabel = "Acima de 800 (Sob Consulta)";
    } else if (lives > 500) {
      tierKey = "501_a_800";
      tierLabel = "501 a 800 Vidas";
    } else if (lives > 200) {
      tierKey = "201_a_500";
      tierLabel = "201 a 500 Vidas";
    }

    const monthly = selectedPlan.tiers[tierKey];
    return { 
      monthly, 
      total: monthly + COMERCIAL_CONFIG.taxa_setup_unica,
      tier: tierLabel
    };
  }, [selectedPlan, numLives]);

  const handleCreateProposal = async () => {
    if (!db || !selectedPlan || !companyName) {
      toast({ variant: "destructive", title: "Dados Incompletos", description: "Informe a empresa e selecione um plano." })
      return
    }

    setIsSaving(true)
    try {
      const proposalData = {
        title: `Proposta Construtora: ${selectedPlan.nome}`,
        companyId: "leads",
        companyName: companyName.toUpperCase(),
        type: 'comercial',
        status: 'to_review',
        priority: 'high',
        origin: 'construction_specialized',
        metadata: {
          planId: selectedPlan.id,
          lives: Number(numLives),
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
        title: "Proposta de Engenharia Gerada!", 
        description: `O card foi enviado para o funil comercial da ${companyName}.` 
      })
      setSelectedPlanId(null)
      setCompanyName("")
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao Protocolar" })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Proposta Especializada: Construtoras</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest mt-2 flex items-center gap-2">
            <HardHat className="size-3 text-accent" /> Orçamentos estruturados por tiers de vidas 2026.
          </p>
        </div>
        <Badge className="bg-primary text-white font-black uppercase text-[10px] tracking-widest h-10 px-4 flex items-center gap-2">
          <Target className="size-4" /> FOCO ENGENHARIA
        </Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-8">
              <CardTitle className="text-lg font-black text-primary uppercase">Planos Nextcon SST</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Taxa de Setup Única: R$ 4.500,00</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-4">
                {COMERCIAL_CONFIG.planos.map((plan) => {
                  const Icon = plan.icon;
                  const isActive = selectedPlanId === plan.id;
                  return (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={cn(
                        "p-6 rounded-[2rem] border-2 transition-all cursor-pointer group flex items-start gap-6",
                        isActive ? "bg-primary/5 border-primary shadow-lg scale-[1.01]" : "bg-slate-50 border-transparent hover:border-slate-200"
                      )}
                    >
                      <div className={cn(
                        "p-4 rounded-2xl shadow-inner group-hover:scale-110 transition-transform",
                        isActive ? "bg-primary text-white" : "bg-white text-primary"
                      )}>
                        <Icon className="size-8" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-black text-primary uppercase text-sm">{plan.nome}</h3>
                          <Badge className="bg-slate-200 text-slate-600 font-black text-[8px] uppercase px-2">{plan.foco}</Badge>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500">A partir de {plan.tiers.ate_200.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} / mês</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {plan.features.map(f => (
                            <Badge key={f} variant="outline" className="text-[8px] font-black uppercase border-primary/10 text-primary/40">{f}</Badge>
                          ))}
                        </div>
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
                <Building2 className="size-4 text-accent" /> Configurar Proposta
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Empresa Construtora</label>
                <Input 
                  placeholder="Ex: DALL EMPREENDIMENTOS" 
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase shadow-inner" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Número de Vidas</label>
                <Input 
                  type="number"
                  value={numLives}
                  onChange={e => setNumLives(e.target.value)}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold shadow-inner" 
                />
              </div>

              {selectedPlan && (
                <div className="pt-6 border-t border-dashed space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Tier Identificado</p>
                    <Badge variant="secondary" className="text-[9px] font-black uppercase">{pricingDetails.tier}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Mensalidade</p>
                    <p className="text-sm font-bold text-primary">{pricingDetails.monthly.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black uppercase text-slate-400">Taxa Setup (Única)</p>
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
                      disabled={isSaving || !selectedPlanId || !companyName}
                      className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                    >
                      {isSaving ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5 text-accent" />}
                      Gerar Proposta Comercial
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-[#090e24] text-white border-none p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck className="size-24 text-accent" />
            </div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-[10px] font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                <Sparkles className="size-3" /> Diferencial NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-[11px] leading-relaxed italic text-white/60">
                "Nossas propostas automatizam o cruzamento de dados para os eventos S-2220 e S-2240, garantindo que a sua unidade não sofra multas por omissão ou erro de tier no eSocial."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
