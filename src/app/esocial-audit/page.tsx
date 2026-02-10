
"use client"

import * as React from "react"
import { 
  SearchCheck, 
  FileWarning, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  ShieldCheck, 
  Sparkles, 
  Loader2, 
  History, 
  SendHorizontal,
  Layers,
  ChevronDown,
  Mail,
  Calendar,
  Settings2,
  FileDown,
  Trash2,
  Save,
  Check,
  Filter,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { runEsocialAudit, type EsocialAuditOutput } from "@/ai/flows/esocial-audit-flow"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, addDoc, query, orderBy, limit, doc, setDoc, collectionGroup, where } from "firebase/firestore"
import { updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"
import { differenceInDays, parseISO } from "date-fns"

export default function EsocialAudit() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [aiReport, setAiReport] = React.useState<EsocialAuditOutput | null>(null)
  const [activeTab, setActiveTab] = React.useState("agrupador")

  // Filtros do Agrupador 859
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [eventType, setEventType] = React.useState("ALL")
  const [isDownloading, setIsDownloading] = React.useState(false)

  const [routineSettings, setRoutineSettings] = React.useState({
    frequency: "weekly",
    customEmail: "",
    active: true
  })

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const routineRef = useMemoFirebase(() => {
    if (!db || !profile?.companyId) return null
    return doc(db, "companies", profile.companyId, "settings", "emailRoutine")
  }, [db, profile])
  const { data: remoteSettings } = useDoc(routineRef)

  React.useEffect(() => {
    if (remoteSettings) {
      setRoutineSettings({
        frequency: remoteSettings.frequency || "weekly",
        customEmail: remoteSettings.customEmail || "",
        active: remoteSettings.active !== false
      })
    }
  }, [remoteSettings])

  const handleDownloadXML = () => {
    if (!startDate || !endDate) {
      toast({ variant: "destructive", title: "Datas Obrigatórias", description: "Selecione o período para extração." })
      return
    }

    const days = differenceInDays(parseISO(endDate), parseISO(startDate))
    if (days > 31) {
      toast({ 
        variant: "destructive", 
        title: "Limite Excedido", 
        description: "O intervalo máximo para download de XML é de 31 dias." 
      })
      return
    }

    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
      toast({ 
        title: "Download Iniciado", 
        description: `Exportando XMLs do evento ${eventType} entre ${startDate} e ${endDate}.` 
      })
    }, 1500)
  }

  // Simulação de Eventos do Agrupador 859
  const groupedEvents = [
    { id: "S-2220", emp: "BRUNO GADELHA", type: "Monitoramento", date: "2026-02-08", status: "Pronto", prot: "---" },
    { id: "S-2240", emp: "JOÃO BESTEL", type: "Condições Amb.", date: "2026-02-07", status: "Pronto", prot: "---" },
    { id: "S-2210", emp: "ERICK HENRIQUE", type: "CAT", date: "2026-02-05", status: "Transmitido", prot: "2.202602.12345" },
    { id: "S-2220", emp: "ADRIANO SANTOS", type: "Monitoramento", date: "2026-02-08", status: "Erro", prot: "---" },
  ]

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Portal e-Social 2026</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Motor de conformidade e agrupador de eventos (859).</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setActiveTab("auditoria")}
            className="bg-white text-primary border border-primary/10 hover:bg-slate-50 gap-2 h-12 px-6 rounded-xl shadow-sm font-black uppercase text-[10px] tracking-widest"
          >
            <SearchCheck className="size-4" /> Nova Auditoria
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[650px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="agrupador" className="rounded-lg gap-2 text-xs font-bold">
            <Layers className="size-4" /> Agrupador (859)
          </TabsTrigger>
          <TabsTrigger value="auditoria" className="rounded-lg gap-2 text-xs font-bold">
            <Sparkles className="size-4" /> Auditoria Técnica
          </TabsTrigger>
          <TabsTrigger value="config" className="rounded-lg gap-2 text-xs font-bold">
            <Settings2 className="size-4" /> Rotinas NAI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agrupador" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 border-b pb-8">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-headline font-black text-primary uppercase flex items-center gap-2">
                    <FileDown className="size-6 text-accent" /> Extração de XML e-Social
                  </CardTitle>
                  <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Filtro especializado por tipo e período (máx. 31 dias).</CardDescription>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full lg:w-auto">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Tipo de Evento</label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger className="bg-white border-none h-11 text-xs font-bold shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Todos os Eventos</SelectItem>
                        <SelectItem value="S2210">S-2210 (CAT)</SelectItem>
                        <SelectItem value="S2220">S-2220 (Atestados)</SelectItem>
                        <SelectItem value="S2240">S-2240 (Riscos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Data Inicial</label>
                    <Input 
                      type="date" 
                      className="bg-white border-none h-11 text-xs font-bold shadow-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">Data Final</label>
                    <Input 
                      type="date" 
                      className="bg-white border-none h-11 text-xs font-bold shadow-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleDownloadXML}
                      disabled={isDownloading}
                      className="w-full h-11 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-lg shadow-lg gap-2"
                    >
                      {isDownloading ? <Loader2 className="size-3.5 animate-spin" /> : <FileDown className="size-3.5" />}
                      Download XML
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase py-4 pl-8">Evento</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Colaborador</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-center">Referência</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Protocolo e-Social</TableHead>
                    <TableHead className="text-right pr-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedEvents.map((evt, i) => (
                    <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8"><Badge variant="outline" className="font-mono text-primary border-primary/20 bg-primary/5">{evt.id}</Badge></TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-xs uppercase text-primary">{evt.emp}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-medium">{evt.type}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-xs font-bold text-slate-600">{new Date(evt.date).toLocaleDateString('pt-BR')}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-none px-3",
                          evt.status === 'Pronto' ? 'bg-blue-100 text-blue-700' : 
                          evt.status === 'Erro' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        )}>{evt.status}</Badge>
                      </TableCell>
                      <TableCell className="text-[10px] font-mono opacity-50 tracking-tighter">{evt.prot}</TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 text-primary">
                          <FileDown className="size-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-6 bg-slate-50/50 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exibindo 4 de 128 eventos pendentes</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="h-10 text-[9px] font-black uppercase px-6">Anterior</Button>
                  <Button variant="outline" className="h-10 text-[9px] font-black uppercase px-6">Próxima</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auditoria" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className="card-shadow border-none bg-white">
                <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
                  <div>
                    <CardTitle className="text-xl font-headline font-black text-primary uppercase">Diagnóstico Gemini 2.0</CardTitle>
                    <CardDescription>Auditoria cruzada entre Riscos PGR e Protocolos PCMSO.</CardDescription>
                  </div>
                  <Button 
                    onClick={async () => {
                      setIsAuditing(true)
                      try {
                        const res = await runEsocialAudit({
                          sector: "Produção Metalúrgica",
                          riskList: ["Ruído 88dB", "Calor"],
                          examList: ["Clínico"]
                        })
                        setAiReport(res)
                      } finally {
                        setIsAuditing(false)
                      }
                    }}
                    disabled={isAuditing}
                    className="gradient-nextcon text-white h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2"
                  >
                    {isAuditing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4 text-accent" />}
                    Executar Scanner
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  {aiReport ? (
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="text-[10px] font-black uppercase py-4 pl-8">Divergência</TableHead>
                          <TableHead className="text-[10px] font-black uppercase">Impacto Legal</TableHead>
                          <TableHead className="text-[10px] font-black uppercase pr-8">Ação Recomendada</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aiReport.criticalGaps.map((gap, i) => (
                          <TableRow key={i}>
                            <TableCell className="pl-8 font-bold text-red-700 text-xs">{gap.description}</TableCell>
                            <TableCell className="text-[11px] text-muted-foreground italic">{gap.legalImpact}</TableCell>
                            <TableCell className="pr-8">
                              <Badge className="bg-primary/5 text-primary text-[9px] font-black uppercase border-none">
                                {gap.recommendation}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-24 opacity-30 flex flex-col items-center gap-4">
                      <ShieldCheck className="size-16 text-primary" />
                      <p className="font-black uppercase text-sm tracking-widest">Aguardando Execução do Scanner NAI</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="gradient-nextcon text-white border-none p-6 rounded-[2rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles className="size-20 text-accent" /></div>
                <CardTitle className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-4 flex items-center gap-2">
                  <SendHorizontal className="size-4" /> Conformidade S-2240
                </CardTitle>
                <div className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <p className="text-[9px] font-black text-white/50 uppercase mb-1">Score Geral</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black">{aiReport ? aiReport.complianceScore : 92}%</span>
                      <Progress value={aiReport ? aiReport.complianceScore : 92} className="h-1.5 flex-1 bg-white/10" />
                    </div>
                  </div>
                  <Button className="w-full h-14 bg-accent text-primary font-black uppercase text-[10px] rounded-2xl shadow-xl hover:opacity-90 transition-all">
                    Transmitir Lote Auditado
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="config" className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-shadow border-none bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 border-b pb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                    <Mail className="size-6 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-headline font-black text-primary uppercase">Rotina de Envio NAI</CardTitle>
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Automação de relatórios para conformidade.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-primary uppercase tracking-tight">Ativar Notificações</p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase">A NAI enviará os resumos de eventos automaticamente.</p>
                  </div>
                  <Switch 
                    checked={routineSettings.active} 
                    onCheckedChange={(v) => setRoutineSettings({...routineSettings, active: v})} 
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Frequência da Rotina</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'daily', label: 'Diária', icon: Calendar },
                      { id: 'weekly', label: 'Semanal', icon: History },
                      { id: 'monthly', label: 'Mensal', icon: Check }
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        onClick={() => setRoutineSettings({...routineSettings, frequency: freq.id})}
                        className={cn(
                          "flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all gap-2 group",
                          routineSettings.frequency === freq.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-slate-100 hover:border-slate-200 text-slate-400 bg-white"
                        )}
                      >
                        <freq.icon className={cn("size-5", routineSettings.frequency === freq.id ? "text-primary" : "text-slate-300 group-hover:text-slate-400")} />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{freq.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail de Destino Avulso</label>
                    <Badge variant="secondary" className="text-[8px] font-black uppercase bg-accent/10 text-accent border-none px-2.5">Opcional</Badge>
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Ex: gestoria.externa@consultoria.com.br" 
                      className="pl-12 h-14 bg-slate-50 border-none rounded-2xl shadow-inner font-bold text-sm focus-visible:ring-primary/10"
                      value={routineSettings.customEmail}
                      onChange={(e) => setRoutineSettings({...routineSettings, customEmail: e.target.value})}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
                    * Este e-mail receberá os relatórios independente de possuir conta ativa no portal.
                  </p>
                </div>

                <Button 
                  className="w-full h-16 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-2xl shadow-primary/20 hover:opacity-90 gap-3"
                  onClick={() => {
                    toast({ title: "Rotina Configurada", description: "Configurações de envio salvas com sucesso." })
                  }}
                >
                  <Save className="size-5 text-accent" /> Salvar Configuração NAI
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#090e24] text-white border-none p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles className="size-48 text-accent" /></div>
                <CardHeader className="p-0 mb-8">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-3">
                    <AlertCircle className="size-5" /> Ecossistema 2026
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-8">
                  <div className="space-y-6">
                    {[
                      { step: "1", text: "A NAI consolida todos os eventos transmitidos no período de busca (máx. 31 dias)." },
                      { step: "2", text: "Os XMLs são separados por tipo (S-2210, S-2220, S-2240) para facilitar a importação externa." },
                      { step: "3", text: "O relatório NAI enviado por e-mail inclui o Score de Conformidade e alertas de gaps técnicos." }
                    ].map((item) => (
                      <div key={item.step} className="flex gap-5">
                        <div className="size-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-sm text-accent shrink-0 shadow-inner">{item.step}</div>
                        <p className="text-xs opacity-70 leading-relaxed font-medium">
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-white/5">
                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                      <div className="size-12 bg-accent/10 rounded-xl flex items-center justify-center">
                        <FileDown className="size-6 text-accent" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-accent mb-0.5 tracking-widest">Endpoint NAI</p>
                        <p className="text-[11px] font-medium opacity-60 italic">"Conector unificado para download massivo de evidências eSocial."</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
