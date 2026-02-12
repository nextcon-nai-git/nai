
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
import { collection, query, orderBy, doc, getDoc, addDoc, updateDoc } from "firebase/firestore"
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

  const requestsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "medical_audit_requests"), orderBy("createdAt", "desc"))
  }, [db])
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
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha o paciente e a categoria profissional." })
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
            textoExtra = `\n\nJurisprudência Aplicável: ${jurSnap.data()?.argumento_automatico}`
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

        toast({ title: "Defesa Gerada", description: "A NAI estruturou a argumentação com base nas normas vigentes." })
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
      toast({ title: "Checklist de Campo Salvo", description: "Os achados da perícia foram integrados ao dossiê." })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao Salvar", description: "Verifique sua conexão." })
    } finally {
      setIsSavingChecklist(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Auditoria & Perícia Médica</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Brain className="size-4 text-accent" /> Inteligência na emissão de pareceres e checklists de campo.
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-nextcon text-white h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg gap-2">
              <Plus className="size-4" /> Nova Solicitação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
            <div className="p-8 bg-primary text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg"><Stethoscope className="size-5 text-accent" /></div>
                <DialogTitle className="text-xl font-headline font-black uppercase">Solicitar Análise NAI</DialogTitle>
              </div>
              <DialogDescription className="text-white/70 font-medium">A IA cruzará normas e jurisprudência, preparando o checklist de campo.</DialogDescription>
            </div>
            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Paciente / Beneficiário</label>
                <Input 
                  placeholder="Nome completo" 
                  value={formData.patientName}
                  onChange={e => setFormData({...formData, patientName: e.target.value})}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase shadow-inner" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Categoria Profissional</label>
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
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Diagnóstico / CID (Opcional)</label>
                <Input 
                  placeholder="Ex: TEA, Cirurgia de Quadril..." 
                  value={formData.diagnosis}
                  onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                  className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase shadow-inner" 
                />
              </div>
              <Button 
                onClick={handleCreateAndAnalyze} 
                disabled={isAnalyzing}
                className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-2 mt-4"
              >
                {isAnalyzing ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5 text-accent" />}
                Iniciar Auditoria Inteligente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-[700px]">
          <CardHeader className="bg-primary/5 border-b py-6 px-8 shrink-0">
            <CardTitle className="text-lg font-black text-primary uppercase">Fila de Perícias</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Solicitações aguardando parecer ou checklist.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-20 text-center"><Loader2 className="size-8 animate-spin mx-auto opacity-20" /></div>
            ) : requests && requests.length > 0 ? (
              <div className="divide-y">
                {requests.map((req) => (
                  <div 
                    key={req.id} 
                    className={cn(
                      "p-6 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between group",
                      selectedRequest?.id === req.id && "bg-primary/5 border-l-4 border-accent"
                    )}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-slate-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shadow-inner">
                        <User className="size-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-xs text-primary uppercase truncate w-40">{req.patientName}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10">{req.professionalCategory.replace('_', ' ')}</Badge>
                          <Badge className={cn(
                            "text-[8px] font-black uppercase border-none",
                            req.status === 'concluido' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          )}>
                            {req.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="size-5 text-slate-200 group-hover:text-primary transition-all" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-32 text-center opacity-20 space-y-4">
                <Search className="size-16 mx-auto" />
                <p className="font-black uppercase text-xs tracking-widest">Nenhuma solicitação</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          {selectedRequest ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1.5 rounded-2xl h-16">
                  <TabsTrigger value="defesa" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
                    <ShieldAlert className="size-4" /> Estratégia de Defesa
                  </TabsTrigger>
                  <TabsTrigger value="checklist" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
                    <ClipboardCheck className="size-4" /> Checklist de Campo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="defesa" className="mt-6 space-y-6">
                  {selectedRequest.defenseStrategy ? (
                    <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] overflow-hidden">
                      <CardHeader className="bg-white/5 border-b border-white/5 p-8">
                        <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                          <Sparkles className="size-4" /> Argumentação Técnica Sugerida
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                          <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Base Normativa:</p>
                          <Badge className="bg-primary text-accent border border-accent/20 font-bold uppercase text-[10px] h-8 px-3">
                            {selectedRequest.defenseStrategy.norma_base}
                          </Badge>
                        </div>
                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 italic text-sm leading-relaxed text-white/80">
                          "{selectedRequest.defenseStrategy.texto_argumentacao}"
                        </div>
                        <div className="flex gap-3 p-4 bg-accent/10 rounded-2xl border border-accent/20">
                          <AlertTriangle className="size-5 text-accent shrink-0" />
                          <p className="text-[11px] font-bold text-accent uppercase leading-tight">
                            {selectedRequest.defenseStrategy.alerta_sistema}
                          </p>
                        </div>
                        <Button className="w-full h-14 bg-accent text-primary font-black uppercase text-[10px] rounded-2xl shadow-xl hover:opacity-90">
                          Copiar Parecer Técnico
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="p-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed opacity-30">
                      <Loader2 className="size-12 animate-spin mx-auto mb-4" />
                      <p className="font-black uppercase text-xs">NAI Processando Estratégia...</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="checklist" className="mt-6">
                  <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b p-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary text-white rounded-lg"><PenTool className="size-5" /></div>
                        <div>
                          <CardTitle className="text-xl font-black text-primary uppercase">Ficha de Achados Periciais</CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Preenchimento obrigatório para auditoria de campo.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Anamnese Ocupacional (Queixas e Histórico)</label>
                        <Textarea 
                          value={checklistData.anamnese}
                          onChange={e => setChecklistData({...checklistData, anamnese: e.target.value})}
                          placeholder="Descreva o relato do paciente e histórico laboral..." 
                          className="min-h-[100px] bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Exame Físico Dirigido (Achados e Manobras)</label>
                        <Textarea 
                          value={checklistData.exameFisico}
                          onChange={e => setChecklistData({...checklistData, exameFisico: e.target.value})}
                          placeholder="Informe manobras realizadas, pontos de dor e amplitude..." 
                          className="min-h-[100px] bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium shadow-inner"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Conclusão de Nexo</label>
                          <Select value={checklistData.nexoCausal} onValueChange={v => setChecklistData({...checklistData, nexoCausal: v})}>
                            <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="confirmado">Nexo Confirmado</SelectItem>
                              <SelectItem value="excluido">Nexo Excluído</SelectItem>
                              <SelectItem value="concausa">Concausa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Observações Adicionais</label>
                          <Input 
                            value={checklistData.observacoes}
                            onChange={e => setChecklistData({...checklistData, observacoes: e.target.value})}
                            placeholder="Ex: Divergência de exames..." 
                            className="h-12 bg-slate-50 border-none rounded-xl font-bold shadow-inner"
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={handleSaveChecklist}
                        disabled={isSavingChecklist}
                        className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3 mt-4"
                      >
                        {isSavingChecklist ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5 text-accent" />}
                        Salvar e Sincronizar Achados
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <Card className="card-shadow border-none bg-white rounded-[2rem] p-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Scale className="size-6" /></div>
                  <div>
                    <h4 className="font-black text-primary uppercase text-sm">Integridade Técnica 2026</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold mt-1">
                      Os dados coletados neste checklist fundamentam a impugnação de laudos periciais externos.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed rounded-[3rem] opacity-30 bg-slate-50/50 min-h-[500px]">
              <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <History className="size-10" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] leading-relaxed max-w-sm">
                Selecione um processo na fila lateral para visualizar a defesa ou preencher o checklist pericial.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
