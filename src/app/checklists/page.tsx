
"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Loader2, 
  ShieldAlert, 
  Plus, 
  ArrowLeft, 
  Ban, 
  Users, 
  HeartPulse, 
  Building2, 
  Biohazard, 
  Settings2, 
  Box, 
  Flame, 
  Skull, 
  AlertTriangle, 
  Accessibility, 
  Bomb, 
  Fuel, 
  Sun, 
  Mountain, 
  FireExtinguisher, 
  Bath, 
  Recycle, 
  Megaphone, 
  Gavel, 
  Ship, 
  Anchor, 
  Sprout, 
  Stethoscope, 
  Hammer, 
  ArrowUpCircle, 
  Beef, 
  Droplets, 
  Trash2,
  Zap,
  CheckCircle2,
  Info,
  FileText,
  Sparkles,
  Activity,
  Brain
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, addDoc, query, orderBy, limit } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { analyzePgrPdf, type PgrAnalysisOutput } from "@/ai/flows/pgr-analysis-flow"
import { getWhatsAppLink } from "@/lib/whatsapp-utils"

const CHECKLIST_CATALOG = [
  { id: "nr01", category: "Geral", title: "NR-01 - Gerenciamento de Riscos (GRO/PGR)", icon: ShieldAlert, color: "text-red-600" },
  { id: "nr06", category: "EPI", title: "NR-06 - Equipamentos de Proteção (EPI)", icon: HeartPulse, color: "text-amber-600" },
  { id: "nr17", category: "Ergonomia", title: "NR-17 - Laboratório de Ergonomia", icon: Brain, color: "text-blue-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Indústria da Construção", icon: Hammer, color: "text-orange-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Zap, color: "text-yellow-500" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
]

const ERGO_METHODS = [
  { id: "rula", name: "RULA", desc: "Membros Superiores" },
  { id: "reba", name: "REBA", desc: "Corpo Inteiro" },
  { id: "niosh", name: "NIOSH", desc: "Levantamento de Cargas" },
  { id: "corlett", name: "Corlett", desc: "Diagrama de Desconforto" },
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedChecklistId, setSelectedChecklistId] = React.useState<string | null>(null)
  const [isAnalyzingPgr, setIsAnalyzingPgr] = React.useState(false)
  const [pgrResult, setPgrResult] = React.useState<PgrAnalysisOutput | null>(null)
  const [formResponses, setFormResponses] = React.useState<Record<string, string>>({})

  const handlePgrFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "O PDF deve ter no máximo 10MB." })
      return
    }
    setIsAnalyzingPgr(true)
    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const result = await analyzePgrPdf({ pdfDataUri: event.target?.result as string, fileName: file.name })
        setPgrResult(result)
        toast({ title: "Análise Concluída", description: "NAI processou o PGR com sucesso." })
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro na Análise", description: error.message })
    } finally { setIsAnalyzingPgr(false) }
  }

  const handleSaveNRChecklist = async () => {
    if (!user || !db || !selectedChecklistId) return
    try {
      await addDoc(collection(db, "clients", user.uid, "checklists"), {
        userId: user.uid, type: "NR_AUDIT", nr: selectedChecklistId, responses: formResponses, createdAt: new Date().toISOString()
      })
      toast({ title: "Inspeção Salva!" })
      setSelectedChecklistId(null)
    } catch (e) { toast({ variant: "destructive", title: "Erro ao salvar" }) }
  }

  // Visualização especial para NR-17
  if (selectedChecklistId === "nr17") {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4">
        <Button variant="ghost" onClick={() => setSelectedChecklistId(null)}><ArrowLeft className="mr-2" /> Voltar ao Catálogo</Button>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-headline font-bold text-primary">Laboratório de Ergonomia (NR-17)</h1>
            <p className="text-muted-foreground">Avaliações biomecânicas e análise postural 2026.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 card-shadow border-none bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary uppercase">Mapeamento de Desconforto (Corlett)</CardTitle>
              <CardDescription>Selecione as regiões de incômodo no avatar anatômico.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-10">
              <div className="w-64 h-96 relative bg-muted/20 rounded-3xl flex items-center justify-center">
                <Brain className="size-20 text-primary opacity-10" />
                <p className="text-[10px] uppercase font-black opacity-40 absolute bottom-4">Avatar 3D em Construção</p>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                {ERGO_METHODS.map(m => (
                  <Button key={m.id} variant="outline" className="h-16 flex flex-col gap-1 items-start px-4">
                    <span className="font-black text-sm">{m.name}</span>
                    <span className="text-[9px] uppercase opacity-60">{m.desc}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none bg-[#090e24] text-white">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase text-accent tracking-widest">Resumo da Análise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Risco Biomecânico</p>
                <Badge className="bg-emerald-500">Baixo / Moderado</Badge>
              </div>
              <Button className="w-full bg-accent text-primary font-black uppercase text-[10px] h-12">
                Gerar Parecer Ergonômico
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Hub de Operações SST</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2">Catálogo NRs</TabsTrigger>
          <TabsTrigger value="pgr" className="rounded-lg gap-2">Análise PGR (PDF)</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2">Histórico</TabsTrigger>
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

        <TabsContent value="pgr" className="mt-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2"><Sparkles className="size-5 text-accent" /> Scanner PGR Inteligente</CardTitle>
              <CardDescription>Análise via IA para extração de inventário e planos de ação (Max 10MB).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="border-2 border-dashed rounded-3xl p-12 text-center bg-muted/10 hover:bg-muted/20 relative group transition-all">
                <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePgrFileUpload} />
                {isAnalyzingPgr ? (
                  <div className="space-y-4">
                    <Loader2 className="animate-spin size-12 mx-auto text-primary" />
                    <p className="text-xs font-black uppercase tracking-widest animate-pulse">NAI Lendo Documento Técnico...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileText className="size-12 mx-auto text-primary opacity-40 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-primary">Arraste ou Clique para importar PGR</p>
                    <p className="text-[10px] uppercase font-black text-muted-foreground">Formato PDF • Limite 10MB</p>
                  </div>
                )}
              </div>

              {pgrResult && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6">
                  <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-100 flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-headline font-black text-blue-900">{pgrResult.companyInfo.name}</h3>
                      <p className="text-xs text-blue-700 font-bold uppercase">Vigência: {pgrResult.companyInfo.validity}</p>
                    </div>
                    <Badge className="bg-blue-600 px-4 py-1.5 font-black uppercase text-[10px]">IA Processado</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-none shadow-sm">
                      <CardHeader className="pb-2"><CardTitle className="text-sm font-black uppercase">Inventário de Riscos</CardTitle></CardHeader>
                      <CardContent className="space-y-2">
                        {pgrResult.identifiedRisks.map((r, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border">
                            <Badge variant="outline" className="text-[8px] uppercase font-black h-5">{r.category}</Badge>
                            <span className="text-xs font-bold text-primary">{r.hazard}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm">
                      <CardHeader className="pb-2"><CardTitle className="text-sm font-black uppercase">Plano de Ação</CardTitle></CardHeader>
                      <CardContent className="space-y-2">
                        {pgrResult.actionPlan.map((a, i) => (
                          <div key={i} className="p-3 bg-muted/30 rounded-xl border space-y-1">
                            <div className="flex justify-between">
                              <p className="text-xs font-bold text-primary">{a.description}</p>
                              <Badge className={cn("text-[8px] h-4 uppercase", a.priority === 'Alta' ? 'bg-red-500' : 'bg-blue-500')}>{a.priority}</Badge>
                            </div>
                            <p className="text-[10px] text-muted-foreground uppercase font-black">Prazo: {a.deadline}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <div className="p-6 bg-accent rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-5 text-primary" />
                      <h4 className="font-black uppercase text-xs text-primary">Insight Estratégico NAI</h4>
                    </div>
                    <p className="text-sm italic text-primary leading-relaxed">"{pgrResult.aiInsight}"</p>
                    <Button 
                      className="w-full bg-primary text-white h-12 font-bold uppercase gap-2"
                      onClick={() => window.open(getWhatsAppLink("11999999999", `*Resumo PGR NAI*\n\n${pgrResult.aiInsight}`))}
                    >
                      Enviar Dossiê via WhatsApp
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-xl bg-white">
            <CardHeader><CardTitle>Histórico de Inspeções</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center py-20 text-center opacity-40">
              <History className="size-12 mb-4" />
              <p className="text-sm font-bold uppercase tracking-widest">Sem registros recentes.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
        <Info className="size-5 text-blue-600 shrink-0" />
        <p className="text-[10px] text-blue-700 font-bold uppercase leading-tight">
          Todas as evidências fotográficas e assinaturas coletadas via Checklists são armazenadas em buckets isolados por cliente conforme a LGPD.
        </p>
      </div>
    </div>
  )
}
