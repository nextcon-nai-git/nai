
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
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, doc, getDoc, addDoc, serverTimestamp, updateDoc } from "firebase/firestore"
import { cn } from "@/lib/utils"

export default function MedicalAuditingPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [selectedRequest, setSelectedRequest] = React.useState<any>(null)

  const [formData, setFormData] = React.useState({
    patientName: "",
    professionalCategory: "",
    diagnosis: "",
    complexity: "media"
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

  async function handleCreateAndAnalyze() {
    if (!db || !formData.patientName || !formData.professionalCategory) {
      toast({ variant: "destructive", title: "Campos obrigatórios", description: "Preencha o paciente e a categoria profissional." })
      return
    }

    setIsAnalyzing(true)
    try {
      // 1. Criar a solicitação
      const docRef = await addDoc(collection(db, "medical_audit_requests"), {
        ...formData,
        status: "pendente",
        createdAt: new Date().toISOString(),
        companyId: profile?.companyId || "nextcon_central"
      })

      // 2. Executar Lógica de Defesa Inteligente (Simulação da Cloud Function em tempo real)
      const normaRef = doc(db, "config_normas_profissionais", formData.professionalCategory)
      const normaSnap = await getDoc(normaRef)

      if (normaSnap.exists()) {
        const norma = normaSnap.data()
        let textoExtra = ""

        // Jurisprudência para casos complexos (Ex: TEA)
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Auditoria Médica & Regulação</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Brain className="size-4 text-accent" /> Inteligência na emissão de pareceres e defesas técnicas.
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
              <DialogDescription className="text-white/70 font-medium">A IA cruzará normas dos conselhos e jurisprudência para gerar sua defesa.</DialogDescription>
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
                Processar Defesa Inteligente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-primary/5 border-b py-6 px-8">
            <CardTitle className="text-lg font-black text-primary uppercase">Fila de Pareceres</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Acompanhamento de solicitações e auditorias.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
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
                      <div>
                        <p className="font-black text-xs text-primary uppercase">{req.patientName}</p>
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
                <p className="font-black uppercase text-xs tracking-widest">Nenhuma solicitação pendente</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {selectedRequest?.defenseStrategy ? (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 p-8">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-[0.2em] flex items-center gap-2">
                    <Sparkles className="size-4" /> Estratégia de Defesa NAI
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-white/40 tracking-widest">Norma Regulamentadora Base:</p>
                    <Badge className="bg-primary text-accent border border-accent/20 font-bold uppercase text-[10px] h-8 px-3">
                      {selectedRequest.defenseStrategy.norma_base}
                    </Badge>
                  </div>
                  
                  <div className="bg-white/5 p-5 rounded-2xl border border-white/10 italic text-sm leading-relaxed text-white/80">
                    "{selectedRequest.defenseStrategy.texto_argumentacao}"
                  </div>

                  <div className="flex gap-3 p-4 bg-accent/10 rounded-2xl border border-accent/20">
                    <AlertTriangle className="size-5 text-accent shrink-0" />
                    <p className="text-[11px] font-bold text-accent uppercase leading-tight">
                      {selectedRequest.defenseStrategy.alerta_sistema}
                    </p>
                  </div>

                  <Button className="w-full h-14 bg-accent text-primary font-black uppercase text-[10px] rounded-2xl shadow-xl hover:opacity-90">
                    Copiar Argumentação Técnica
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-shadow border-none bg-white rounded-[2rem] p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Scale className="size-6" /></div>
                  <h4 className="font-black text-primary uppercase text-sm">Respaldo Jurídico</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Esta defesa foi gerada cruzando as resoluções vigentes dos conselhos de classe com teses consolidadas do STJ em 2026.
                </p>
              </Card>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-[3rem] opacity-30 bg-slate-50/50 min-h-[400px]">
              <Info className="size-12 mb-4 text-primary" />
              <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
                Selecione uma solicitação ao lado para visualizar a estratégia de defesa gerada pela NAI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
