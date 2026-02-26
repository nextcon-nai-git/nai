
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
  Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase"
import { collection, query, orderBy, collectionGroup, doc, addDoc } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const CONSTRUCTION_KITS = [
  {
    id: "low",
    title: "Kit Canteiro Inicial (200 Vidas)",
    description: "Foco no Pilar Central e NR-18.",
    icon: Construction,
    price: 4500,
    services: ["PGR NR-18", "PCMSO", "ASO", "Checklist NR-35", "NR-24"]
  },
  {
    id: "medium",
    title: "Kit Expansão Planejada (500 Vidas)",
    description: "Gestão completa SESMT e NRs de Máquinas.",
    icon: Hammer,
    price: 8500,
    services: ["PGR/GRO", "LTCAT", "Gestão CIPA Digital", "Treinamento NR-12", "Higiene Ocupacional"]
  },
  {
    id: "high",
    title: "Kit Alta Complexidade (Mini-Hospital)",
    description: "Blindagem de Terceiros e Riscos Pesados.",
    icon: ShieldAlert,
    price: 15000,
    services: ["Portal de Terceiros", "NR-33 Espaço Confinado", "NR-11 Içamento", "Auditoria NR-17", "Firewall eSocial Full"]
  }
];

export default function ConstructionProposalPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [selectedKit, setSelectedKit] = React.useState<string | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [companyName, setCompanyName] = React.useState("")
  const [numLives, setNumLives] = React.useState("200")

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const handleCreateProposal = async () => {
    if (!db || !selectedKit || !companyName) {
      toast({ variant: "destructive", title: "Dados Incompletos", description: "Informe a empresa e selecione um kit técnico." })
      return
    }

    setIsSaving(true)
    try {
      const kit = CONSTRUCTION_KITS.find(k => k.id === selectedKit)
      const proposalData = {
        title: `Proposta Construtora: ${kit?.title}`,
        companyId: "leads",
        companyName: companyName.toUpperCase(),
        type: 'comercial',
        status: 'to_review',
        priority: 'high',
        origin: 'construction_specialized',
        totalValue: (kit?.price || 0) + (Number(numLives) * 15), // Base + mensalidade/vida
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        checklist: [
          { id: '1', text: 'Vincular cronograma de obra', checked: false, mandatory: true },
          { id: '2', text: 'Validar lista de subempreiteiras', checked: false, mandatory: true },
          { id: '3', text: 'Gerar PDF com selo de Engenharia', checked: false, mandatory: true }
        ]
      }

      await addDocumentNonBlocking(collection(db, "companies", "leads", "tasks"), proposalData)
      
      toast({ 
        title: "Proposta de Engenharia Criada!", 
        description: `O card foi enviado para o funil comercial da ${companyName}.` 
      })
      setSelectedKit(null)
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
            <HardHat className="size-3 text-accent" /> Orçamentos técnicos focados em canteiros de obra 2026.
          </p>
        </div>
        <Badge className="bg-accent text-primary font-black uppercase text-[10px] tracking-widest h-10 px-4 flex items-center gap-2">
          <Zap className="size-4" /> FOCO ENGENHARIA
        </Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b p-8">
              <CardTitle className="text-lg font-black text-primary uppercase">Kits de Conformidade NRs</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Selecione o pacote ideal para a fase atual do projeto.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-4">
                {CONSTRUCTION_KITS.map((kit) => {
                  const Icon = kit.icon;
                  const isActive = selectedKit === kit.id;
                  return (
                    <div 
                      key={kit.id}
                      onClick={() => setSelectedKit(kit.id)}
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
                          <h3 className="font-black text-primary uppercase text-sm">{kit.title}</h3>
                          <Badge className={cn("font-black text-[10px] border-none px-3", isActive ? "bg-primary text-white" : "bg-slate-200 text-slate-500")}>
                            {kit.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </Badge>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500">{kit.description}</p>
                        <div className="flex flex-wrap gap-2 pt-2">
                          {kit.services.map(s => (
                            <Badge key={s} variant="outline" className="text-[8px] font-black uppercase border-primary/10 text-primary/40 group-hover:text-primary transition-colors">{s}</Badge>
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

              <div className="pt-6 border-t border-dashed">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-[10px] font-black uppercase text-slate-400">Total Previsto</p>
                  <h2 className="text-2xl font-black text-primary font-headline">
                    {selectedKit ? (CONSTRUCTION_KITS.find(k => k.id === selectedKit)!.price + (Number(numLives) * 15)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00"}
                  </h2>
                </div>
                <Button 
                  onClick={handleCreateProposal} 
                  disabled={isSaving || !selectedKit || !companyName}
                  className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
                >
                  {isSaving ? <Loader2 className="size-5 animate-spin" /> : <FileText className="size-5 text-accent" />}
                  Gerar Proposta Técnica
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#090e24] text-white border-none p-6 rounded-[2rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <ShieldCheck className="size-24 text-accent" />
            </div>
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-[10px] font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                <Brain className="size-3" /> Diferencial NAI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <p className="text-[11px] leading-relaxed italic text-white/60">
                "Nossas propostas de construção civil já incluem a integração via API com catracas de obra, automatizando o bloqueio de entrada para ASOs vencidos (NR-07)."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
