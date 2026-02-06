
"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Loader2, 
  ShieldAlert, 
  Plus, 
  ArrowLeft, 
  HeartPulse, 
  Building2, 
  Hammer, 
  ArrowUpCircle, 
  Zap,
  CheckCircle2,
  Info,
  FileText,
  Sparkles,
  Brain,
  History,
  CloudUpload,
  Stethoscope,
  Scale,
  Calendar as CalendarIcon,
  Bell
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useStorage } from "@/firebase"
import { collection, addDoc, query, orderBy } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyzePgrPdf } from "@/ai/flows/pgr-analysis-flow"
import { analyzeLtcatPdf } from "@/ai/flows/ltcat-analysis-flow"
import { analyzePcmsoPdf } from "@/ai/flows/pcmso-analysis-flow"
import { getWhatsAppLink } from "@/lib/whatsapp-utils"
import { STORAGE_PATHS } from "@/lib/storage-paths"

const CHECKLIST_CATALOG = [
  { id: "nr01", category: "Geral", title: "NR-01 - Gerenciamento de Riscos (GRO/PGR)", icon: ShieldAlert, color: "text-red-600" },
  { id: "nr06", category: "EPI", title: "NR-06 - Equipamentos de Proteção (EPI)", icon: HeartPulse, color: "text-amber-600" },
  { id: "nr17", category: "Ergonomia", title: "NR-17 - Laboratório de Ergonomia", icon: Brain, color: "text-blue-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Indústria da Construção", icon: Hammer, color: "text-orange-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Zap, color: "text-yellow-500" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedChecklistId, setSelectedChecklistId] = React.useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [analysisResult, setAnalysisResult] = React.useState<any>(null)
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [docType, setDocType] = React.useState<"pgr" | "ltcat" | "pcmso">("pgr")

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Empresa Não Selecionada", description: "Selecione um cliente antes de subir o documento." })
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "O PDF deve ter no máximo 10MB." })
      return
    }

    setIsAnalyzing(true)
    try {
      const company = companies?.find(c => c.id === selectedCompanyId)
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        const dataUri = event.target?.result as string
        let result: any;

        // 1. Chamar fluxo específico de IA
        if (docType === "pgr") {
          result = await analyzePgrPdf({ pdfDataUri: dataUri, fileName: file.name })
        } else if (docType === "ltcat") {
          result = await analyzeLtcatPdf({ pdfDataUri: dataUri, fileName: file.name })
        } else if (docType === "pcmso") {
          result = await analyzePcmsoPdf({ pdfDataUri: dataUri, fileName: file.name })
        }

        setAnalysisResult(result)

        // 2. Salvar no Storage
        const storagePath = STORAGE_PATHS.COMPANY_DOCS(selectedCompanyId, docType)
        const fileRef = ref(storage, storagePath)
        const uploadResult = await uploadBytes(fileRef, file)
        const downloadUrl = await getDownloadURL(uploadResult.ref)

        // 3. Persistência e Gatilhos Automáticos (Sincronização com Calendário e Planos)
        const timestamp = new Date().toISOString()
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)

        // a) Central de Relatórios
        await addDoc(collection(db, "clients", user.uid, "reports"), {
          companyId: selectedCompanyId,
          reportType: docType,
          fileName: file.name,
          fileUrl: downloadUrl,
          analysisSummary: result.aiInsight,
          createdAt: timestamp,
          status: "AVAILABLE"
        })

        // b) Alimentar Calendário (Renovação)
        await addDoc(collection(db, "clients", user.uid, "sst_events"), {
          type: `RENOVAÇÃO ${docType.toUpperCase()}`,
          date: nextYear.toISOString(),
          time: "09:00",
          companyName: company?.name || "Cliente",
          location: "Escritório Nextcon / Unidade Cliente",
          status: "SCHEDULED",
          description: `Vencimento do documento importado em ${new Date().toLocaleDateString()}`
        })

        // c) Planos de Ação Automáticos (Apenas PGR)
        if (docType === 'pgr' && result.actionPlan) {
          for (const action of result.actionPlan) {
            await addDoc(collection(db, "clients", user.uid, "tasks"), {
              title: action.description,
              category: "PGR",
              priority: action.priority || "Média",
              deadline: action.deadline || "A definir",
              status: "ParaFazer",
              companyId: selectedCompanyId,
              createdAt: timestamp
            })
          }
        }

        // d) Alarme para a Equipe Interna
        await addDoc(collection(db, "users", user.uid, "notifications"), {
          title: `NAI: Novo ${docType.toUpperCase()} Processado`,
          message: `O laudo de ${company?.name} foi analisado. ${result.actionPlan?.length || 0} novas ações criadas no Kanban.`,
          read: false,
          createdAt: timestamp
        })

        toast({ 
          title: `Análise ${docType.toUpperCase()} Concluída`, 
          description: "Calendário alimentado e Planos de Ação gerados automaticamente." 
        })
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Processamento", description: error.message })
    } finally { 
      setIsAnalyzing(false) 
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Hub de Operações SST</h1>
          <p className="text-muted-foreground">Gestão ativa de documentos com automação de agenda e planos.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2 font-bold">Catálogo NRs</TabsTrigger>
          <TabsTrigger value="scanner" className="rounded-lg gap-2 font-bold"><Sparkles className="size-4 text-accent" /> Scanner IA</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2 font-bold">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECKLIST_CATALOG.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.id} className="cursor-pointer hover:ring-2 ring-primary/10 transition-all group bg-white border-none card-shadow" onClick={() => setSelectedChecklistId(item.id)}>
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all", item.color)}><Icon className="size-6" /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase opacity-50">{item.category}</p>
                      <h3 className="text-sm font-bold text-primary">{item.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="scanner" className="mt-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">Scanner Inteligente NAI</CardTitle>
                <CardDescription>Extração de dados e automação de calendário (PDF até 10MB).</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="w-full md:w-48">
                  <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Tipo de Laudo:</label>
                  <Select value={docType} onValueChange={(v: any) => setDocType(v)}>
                    <SelectTrigger className="bg-white border-muted h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pgr">PGR (Riscos)</SelectItem>
                      <SelectItem value="ltcat">LTCAT (Previdenciário)</SelectItem>
                      <SelectItem value="pcmso">PCMSO (Saúde)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-64">
                  <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Vincular a:</label>
                  <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                    <SelectTrigger className="bg-white border-muted h-10 text-xs">
                      <SelectValue placeholder="Selecione o Cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className={cn(
                "border-2 border-dashed rounded-3xl p-12 text-center relative group transition-all",
                selectedCompanyId ? "bg-muted/10 hover:bg-muted/20 border-muted" : "bg-muted/5 border-muted/20 opacity-50 cursor-not-allowed"
              )}>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  onChange={handleFileUpload}
                  disabled={!selectedCompanyId || isAnalyzing}
                />
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <Loader2 className="animate-spin size-12 mx-auto text-primary" />
                    <p className="text-xs font-black uppercase tracking-widest animate-pulse">NAI Alimentando Agenda e Planos...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudUpload className="size-12 mx-auto text-primary opacity-40 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-primary">
                      {selectedCompanyId ? `Arraste ou Clique para importar ${docType.toUpperCase()}` : "Selecione um cliente acima para habilitar"}
                    </p>
                    <p className="text-[10px] uppercase font-black text-muted-foreground">A automação de calendário e tarefas será ativada após o upload.</p>
                  </div>
                )}
              </div>

              {analysisResult && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                      <div className="p-2 bg-emerald-500 rounded-lg text-white"><CalendarIcon className="size-4" /></div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-700 uppercase">Calendário</p>
                        <p className="text-xs font-bold text-emerald-900">Agenda de Renovação Criada</p>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
                      <div className="p-2 bg-blue-500 rounded-lg text-white"><ClipboardCheck className="size-4" /></div>
                      <div>
                        <p className="text-[9px] font-black text-blue-700 uppercase">Planos de Ação</p>
                        <p className="text-xs font-bold text-blue-900">{docType === 'pgr' ? `${analysisResult.actionPlan?.length || 0} Tarefas Injetadas` : 'Sem novas tarefas'}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                      <div className="p-2 bg-amber-500 rounded-lg text-white"><Bell className="size-4" /></div>
                      <div>
                        <p className="text-[9px] font-black text-amber-700 uppercase">Alertas</p>
                        <p className="text-xs font-bold text-amber-900">Equipe Técnica Notificada</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-headline font-black text-blue-900">{analysisResult.companyInfo.name}</h3>
                      <p className="text-xs text-blue-700 font-bold uppercase">
                        {docType === 'pgr' ? `Vigência: ${analysisResult.companyInfo.validity}` : 
                         docType === 'ltcat' ? `Data: ${analysisResult.companyInfo.date}` : 
                         `Responsável: ${analysisResult.companyInfo.responsibleDoctor}`}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className="bg-blue-600 px-4 py-1.5 font-black uppercase text-[10px]">IA Processado ({docType})</Badge>
                      <span className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Arquivado na Pasta do Cliente
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                          {docType === 'pcmso' ? <HeartPulse className="size-4" /> : <ShieldAlert className="size-4" />}
                          {docType === 'pcmso' ? 'Protocolo de Exames' : 'Levantamento Técnico'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {docType === 'pgr' && analysisResult.identifiedRisks?.map((r: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border">
                            <Badge variant="outline" className="text-[8px] uppercase font-black h-5">{r.category}</Badge>
                            <span className="text-xs font-bold text-primary">{r.hazard}</span>
                          </div>
                        ))}
                        {docType === 'ltcat' && analysisResult.hazards?.map((h: any, i: number) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-xl border space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-primary">{h.agent}</span>
                              {h.specialRetirement && <Badge className="bg-orange-500 text-[8px]">APOS. ESPECIAL</Badge>}
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase">Medição: {h.intensity} | Limite: {h.limit}</p>
                          </div>
                        ))}
                        {docType === 'pcmso' && analysisResult.examProtocol?.map((e: any, i: number) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-xl border flex justify-between items-center">
                            <div>
                              <p className="text-xs font-bold text-primary">{e.examName}</p>
                              <p className="text-[9px] text-muted-foreground uppercase">{e.targetGroup}</p>
                            </div>
                            <Badge variant="outline" className="text-[9px] font-black">{e.periodicity}</Badge>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-black uppercase flex items-center gap-2">
                          <Scale className="size-4" /> Plano de Ação & Orientações
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {docType === 'pgr' && analysisResult.actionPlan?.map((a: any, i: number) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-xl border space-y-1">
                            <div className="flex justify-between">
                              <p className="text-xs font-bold text-primary">{a.description}</p>
                              <Badge className={cn("text-[8px] h-4 uppercase", a.priority === 'Alta' ? 'bg-red-500' : 'bg-blue-500')}>{a.priority}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase font-black">Prazo: {a.deadline}</p>
                          </div>
                        ))}
                        {(docType === 'ltcat' || docType === 'pcmso') && (analysisResult.recommendations || analysisResult.medicalGuidelines)?.map((rec: string, i: number) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-xl border flex items-start gap-2">
                            <div className="mt-1 size-1.5 bg-primary rounded-full shrink-0" />
                            <p className="text-[11px] font-medium text-primary">{rec}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-6 bg-accent rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-5 text-primary" />
                      <h4 className="font-black uppercase text-xs text-primary">Análise Estratégica NAI</h4>
                    </div>
                    <p className="text-sm italic text-primary leading-relaxed font-medium">"{analysisResult.aiInsight}"</p>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-primary text-white h-12 font-bold uppercase gap-2 text-xs"
                        onClick={() => window.open(getWhatsAppLink("11999999999", `*Resumo NAI - ${docType.toUpperCase()}*\n\n${analysisResult.aiInsight}`))}
                      >
                        Enviar para o Cliente (WhatsApp)
                      </Button>
                      <Button variant="outline" className="bg-white border-primary text-primary h-12 font-bold uppercase text-[10px]">
                        Ver PDF Original
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-xl bg-white">
            <CardHeader><CardTitle>Documentos Processados</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center py-20 text-center opacity-40">
              <History className="size-12 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Os documentos analisados via Scanner aparecem na Central de Relatórios do cliente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
        <Info className="size-5 text-blue-600 shrink-0" />
        <p className="text-[10px] text-blue-700 font-bold uppercase leading-tight">
          O Scanner NAI agora alimenta automaticamente o calendário de vigências e cria tarefas no Kanban baseadas nas recomendações da IA.
        </p>
      </div>
    </div>
  )
}
