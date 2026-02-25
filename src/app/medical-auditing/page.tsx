
"use client"

import * as React from "react"
import { 
  Stethoscope, 
  ShieldAlert, 
  Search, 
  Plus, 
  Scale, 
  Gavel, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  Sparkles,
  Info,
  ChevronRight,
  ChevronDown,
  User,
  AlertTriangle,
  ClipboardCheck,
  Save,
  PenTool,
  History,
  Workflow,
  Thermometer,
  Zap,
  Hammer
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, doc, getDoc, addDoc, updateDoc, limit, where } from "firebase/firestore"
import { cn } from "@/lib/utils"

export default function MedicalAuditingPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [isSavingChecklist, setIsSavingChecklist] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null)
  const [activeTab, setActiveTab] = React.useState("defesa")

  const [formData, setFormData] = React.useState({
    patientName: "",
    professionalCategory: "",
    diagnosis: "",
    complexity: "media"
  })

  const [checklistData, setChecklistData] = React.useState({
    anamnese: "",
    exameFisico: "",
    nexoCausal: "excluido",
    observacoes: ""
  })

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const isGlobalAdmin = React.useMemo(() => {
    if (!profile) return false;
    const role = (profile.role || '').toUpperCase();
    const companyId = profile.companyId;
    return ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'ADMIN'].includes(role) && (!companyId || companyId === "");
  }, [profile]);

  const requestsQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    let q = collection(db, "medical_audit_requests")
    if (!isGlobalAdmin && profile.companyId) {
      return query(q, where("companyId", "==", profile.companyId), orderBy("createdAt", "desc"), limit(30))
    }
    return query(q, orderBy("createdAt", "desc"), limit(30))
  }, [db, profile, isGlobalAdmin])

  const { data: requests, isLoading } = useCollection(requestsQuery)

  const normsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "config_normas_profissionais"))
  }, [db])
  const { data: norms } = useCollection(normsQuery)

  React.useEffect(() => {
    if (selectedRequest?.expertiseChecklist) {
      setChecklistData({
        anamnese: selectedRequest.expertiseChecklist.anamnese || "",
        exameFisico: selectedRequest.expertiseChecklist.exameFisico || "",
        nexoCausal: selectedRequest.expertiseChecklist.nexoCausal || "excluido",
        observacoes: selectedRequest.expertiseChecklist.observacoes || ""
      })
    } else {
      setChecklistData({ anamnese: "", exameFisico: "", nexoCausal: "excluido", observacoes: "" })
    }
  }, [selectedRequest])

  async function handleCreateAndAnalyze() {
    if (!db || !formData.patientName || !formData.professionalCategory) {
      toast({ variant: "destructive", title: "Campos obrigatórios" })
      return
    }

    setIsAnalyzing(true)
    try {
      const docRef = await addDoc(collection(db, "medical_audit_requests"), {
        ...formData,
        status: "pendente",
        createdAt: new Date().toISOString(),
        companyId: profile?.companyId || "nextcon_central"
      })

      const normaRef = doc(db, "config_normas_profissionais", formData.professionalCategory)
      const normaSnap = await getDoc(normaRef)

      if (normaSnap.exists()) {
        const norma = normaSnap.data()
        let textoExtra = ""

        if (formData.diagnosis.toUpperCase().includes("TEA") || formData.complexity === "alta") {
          const jurRef = doc(db, "config_jurisprudencia", "tema_1069_stj")
          const jurSnap = await getDoc(jurRef)
          if (jurSnap.exists()) {
            textoExtra = `\n\nJurisprudência Aplicável (STJ): ${jurSnap.data()?.argumento_automatico}`
          }
        }

        const defenseStrategy = {
          norma_base: norma?.norma_principal,
          texto_argumentacao: (norma?.texto_legal_padrao || "") + textoExtra,
          alerta_sistema: `Atenção: Caso regido por ${norma?.orgao}. Focar em ${norma?.foco_defesa}.`
        }

        await updateDoc(docRef, {
          status: "concluido",
          defenseStrategy: defenseStrategy
        })

        toast({ title: "Super-Junta Finalizada", description: "Defesa gerada com base no curso normativo." })
      }

      setIsCreateOpen(false)
      setFormData({ patientName: "", professionalCategory: "", diagnosis: "", complexity: "media" })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na Análise" })
    } finally {
      setIsAnalyzing(false)
    }
  }

  async function handleSaveChecklist() {
    if (!db || !selectedRequest) return
    setIsSavingChecklist(true)
    try {
      const docRef = doc(db, "medical_audit_requests", selectedRequest.id)
      await updateDoc(docRef, {
        expertiseChecklist: {
          ...checklistData,
          filledAt: new Date().toISOString(),
          filledBy: user?.uid
        }
      })
      toast({ title: "Checklist de Campo Salvo", description: "Dados sincronizados com o dossiê pericial." })
    } finally {
      setIsSavingChecklist(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Módulo Operação Saúde</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Brain className="size-4 text-accent" /> Super-Junta Jurídica e Gestão NR-17.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-nextcon text-white h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg gap-2">
              <Plus className="size-4" /> Nova Auditoria
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
            <div className="p-8 bg-primary text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg"><Gavel className="size-5 text-accent" /></div>
                <DialogTitle className="text-xl font-headline font-black uppercase">Solicitar Super-Junta</DialogTitle>
              </div>
              <DialogDescription className="text-white/70 font-medium">Cruzamento normativo STJ/ANS.</DialogDescription>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Paciente / Beneficiário</label>
                <Input placeholder="Nome completo" value={formData.patientName} onChange={e => setFormData({...formData, patientName: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold shadow-inner" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoria</label>
                  <Select value={formData.professionalCategory} onValueChange={v => setFormData({...formData, professionalCategory: v})}>
                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {norms?.map(n => <SelectItem key={n.id} value={n.id}>{n.categoria} ({n.orgao})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Complexidade</label>
                  <Select value={formData.complexity} onValueChange={v => setFormData({...formData, complexity: v})}>
                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta / Judicial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateAndAnalyze} disabled={isAnalyzing} className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-2 mt-4">
                {isAnalyzing ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5 text-accent" />}
                Ativar Inteligência
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-[700px]">
          <CardHeader className="bg-primary/5 border-b py-6 px-8 shrink-0">
            <CardTitle className="text-lg font-black text-primary uppercase">Fila de Auditoria (Silo)</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-20 text-center"><Loader2 className="size-8 animate-spin mx-auto opacity-20" /></div>
            ) : requests?.map((req) => (
              <div key={req.id} className={cn("p-6 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group", selectedRequest?.id === req.id && "bg-primary/5 border-l-4 border-accent")} onClick={() => setSelectedRequest(req)}>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white shadow-inner"><User className="size-6" /></div>
                  <div>
                    <p className="font-black text-xs text-primary uppercase truncate w-40">{req.patientName}</p>
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10 mt-1">{req.professionalCategory.replace('_', ' ')}</Badge>
                  </div>
                </div>
                <ChevronRight className="size-5 text-slate-200 group-hover:text-primary" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1.5 rounded-2xl h-16">
              <TabsTrigger value="defesa" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Parecer NAI</TabsTrigger>
              <TabsTrigger value="checklist" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Dossiê Campo</TabsTrigger>
              <TabsTrigger value="nr17" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest text-accent">Análise NR-17</TabsTrigger>
            </TabsList>

            <TabsContent value="defesa" className="mt-6">
              {selectedRequest?.defenseStrategy ? (
                <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] p-8">
                  <div className="space-y-6">
                    <Badge className="bg-primary text-accent border border-accent/20 font-bold uppercase text-[10px] h-8 px-3">{selectedRequest.defenseStrategy.norma_base}</Badge>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 italic text-sm leading-relaxed text-white/80">"{selectedRequest.defenseStrategy.texto_argumentacao}"</div>
                  </div>
                </Card>
              ) : (
                <EmptyState icon={Gavel} label="Auditoria Médica em Silo" />
              )}
            </TabsContent>

            <TabsContent value="checklist" className="mt-6">
              {selectedRequest ? (
                <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Anamnese Ocupacional</label>
                    <Textarea value={checklistData.anamnese} onChange={e => setChecklistData({...checklistData, anamnese: e.target.value})} placeholder="Inicie o preenchimento técnico..." className="min-h-[100px] bg-slate-50 border-none rounded-2xl p-4 shadow-inner" />
                  </div>
                  <Button onClick={handleSaveChecklist} disabled={isSavingChecklist} className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
                    {isSavingChecklist ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5 text-accent" />}
                    Sincronizar Operação
                  </Button>
                </Card>
              ) : (
                <EmptyState icon={ClipboardCheck} label="Dossiê de Campo Vazio" />
              )}
            </TabsContent>

            <TabsContent value="nr17" className="mt-6 space-y-8 animate-in slide-in-from-right-4 duration-500">
              {/* Fluxograma NR-17 Visual */}
              <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-primary/5 border-b py-6 px-8">
                  <CardTitle className="text-sm font-black uppercase text-primary tracking-widest flex items-center gap-2">
                    <Workflow className="size-4 text-accent" /> Fluxo de Decisão NR-17 (2026)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="relative flex flex-col items-center gap-8">
                    {/* Início */}
                    <div className="w-48 p-4 bg-slate-100 border-2 border-slate-200 rounded-xl text-center shadow-sm">
                      <p className="text-[10px] font-black uppercase text-slate-500">Início</p>
                      <p className="text-xs font-bold text-primary leading-tight">Situação de Trabalho</p>
                    </div>
                    
                    <ChevronDown className="size-5 text-slate-300" />

                    {/* AEP - Destaque Rosa */}
                    <div className="w-56 p-5 bg-[#f9f0ff] border-2 border-[#f9f] rounded-[2rem] text-center shadow-md relative group">
                      <div className="absolute -top-3 -right-2 bg-[#f9f] text-white text-[8px] font-black px-2 py-0.5 rounded-full">NR-17.3</div>
                      <p className="text-[10px] font-black uppercase text-[#d946ef]">Etapa Obrigatória</p>
                      <p className="text-xs font-bold text-[#701a75]">Avaliação Ergonômica Preliminar (AEP)</p>
                    </div>

                    <div className="flex gap-20 items-start relative mt-4">
                      {/* Sim -> Plano de Ação */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center">
                          <p className="text-[10px] font-black text-emerald-500 mb-2">RISCO EVIDENTE</p>
                          <ChevronDown className="size-5 text-emerald-200" />
                        </div>
                        <div className="w-44 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center">
                          <p className="text-xs font-bold text-emerald-700">Plano de Ação Imediato</p>
                        </div>
                      </div>

                      {/* Não/Dúvida -> AET */}
                      <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col items-center">
                          <p className="text-[10px] font-black text-blue-500 mb-2">DÚVIDA / COMPLEXO</p>
                          <ChevronDown className="size-5 text-blue-200" />
                        </div>
                        <div className="w-56 p-5 bg-[#f0f7ff] border-2 border-[#ccf] rounded-[2rem] text-center shadow-md relative">
                          <div className="absolute -top-3 -right-2 bg-[#ccf] text-white text-[8px] font-black px-2 py-0.5 rounded-full">Aprofundamento</div>
                          <p className="text-[10px] font-black uppercase text-blue-600">Investigação Técnica</p>
                          <p className="text-xs font-bold text-blue-900">Análise Ergonômica (AET)</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-slate-100 mt-4" />
                    
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                      <Badge variant="outline" className="h-8 border-slate-200 bg-slate-50 text-slate-400 font-bold uppercase text-[9px] px-4">
                        Monitoramento e Retorno ao AEP
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Toolbox de Métodos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ToolCard 
                  title="RULA & REBA" 
                  desc="Avaliação postural dinâmica. REBA foca no corpo inteiro, RULA prioriza membros superiores e repetitividade."
                  badge="Biomecânica"
                  icon={Hammer}
                />
                <ToolCard 
                  title="Equação NIOSH" 
                  desc="Cálculo de Limite de Peso Recomendado (LPR). Identifica risco de lesões em tarefas de levantamento de cargas."
                  badge="Carga Física"
                  icon={Scale}
                />
                <ToolCard 
                  title="Diagrama de Corlett" 
                  desc="Mapeamento de desconforto corporal percebido pelo colaborador. Essencial para validação de queixas osteomusculares."
                  badge="Psicofísica"
                  icon={Thermometer}
                />
                <ToolCard 
                  title="Análise NAI Cognitiva" 
                  desc="Triagem IA para riscos psicossociais e carga mental, integrada aos novos requisitos da NR-17.4."
                  badge="NAI Intelligence"
                  icon={Sparkles}
                  isAi
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function ToolCard({ title, desc, badge, icon: Icon, isAi }: any) {
  return (
    <Card className={cn(
      "border-none shadow-sm rounded-3xl overflow-hidden group hover:ring-2 transition-all duration-500",
      isAi ? "bg-primary text-white ring-accent/20" : "bg-white ring-primary/5"
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "p-2.5 rounded-xl transition-colors",
            isAi ? "bg-white/10 text-accent" : "bg-primary/5 text-primary"
          )}>
            <Icon className="size-5" />
          </div>
          <Badge className={cn(
            "text-[8px] font-black uppercase border-none px-3",
            isAi ? "bg-accent text-primary" : "bg-slate-100 text-slate-500"
          )}>
            {badge}
          </Badge>
        </div>
        <h4 className={cn("font-black uppercase text-sm tracking-tight mb-2", isAi ? "text-white" : "text-primary")}>{title}</h4>
        <p className={cn("text-[11px] leading-relaxed font-medium italic", isAi ? "text-white/60" : "text-slate-400")}>"{desc}"</p>
      </CardContent>
    </Card>
  )
}

function EmptyState({ icon: Icon, label }: any) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-[3rem] opacity-30 bg-slate-50/50 min-h-[500px]">
      <Icon className="size-16 text-primary mb-4" />
      <p className="text-xs font-black uppercase tracking-widest text-center">{label}</p>
    </div>
  )
}
