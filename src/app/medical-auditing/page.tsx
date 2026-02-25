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
  User,
  AlertTriangle,
  ClipboardCheck,
  Save,
  PenTool,
  History
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

  // Consulta protegida: Clientes vêem apenas suas auditorias
  const requestsQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    
    let q = collection(db, "medical_audit_requests")
    
    if (!isGlobalAdmin && profile.companyId) {
      // @ts-ignore
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
            <Brain className="size-4 text-accent" /> Super-Junta Jurídica e Glosa Reversa 2026.
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
          {selectedRequest ? (
            <div className="animate-in slide-in-from-right-4 duration-500 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1.5 rounded-2xl h-16">
                  <TabsTrigger value="defesa" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Parecer NAI</TabsTrigger>
                  <TabsTrigger value="checklist" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Dossiê Campo</TabsTrigger>
                </TabsList>

                <TabsContent value="defesa" className="mt-6">
                  {selectedRequest.defenseStrategy && (
                    <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] p-8">
                      <div className="space-y-6">
                        <Badge className="bg-primary text-accent border border-accent/20 font-bold uppercase text-[10px] h-8 px-3">{selectedRequest.defenseStrategy.norma_base}</Badge>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 italic text-sm leading-relaxed text-white/80">"{selectedRequest.defenseStrategy.texto_argumentacao}"</div>
                      </div>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="checklist" className="mt-6">
                  <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-8 space-y-6">
                    <Textarea value={checklistData.anamnese} onChange={e => setChecklistData({...checklistData, anamnese: e.target.value})} placeholder="Anamnese Ocupacional..." className="min-h-[100px] bg-slate-50 border-none rounded-2xl p-4 shadow-inner" />
                    <Button onClick={handleSaveChecklist} disabled={isSavingChecklist} className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
                      {isSavingChecklist ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5 text-accent" />}
                      Sincronizar Operação
                    </Button>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 border-2 border-dashed rounded-[3rem] opacity-30 bg-slate-50/50 min-h-[500px]">
              <History className="size-16 text-primary mb-4" />
              <p className="text-xs font-black uppercase tracking-widest">Auditoria em Saúde Segregada</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
