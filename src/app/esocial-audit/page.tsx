
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
  Check
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
import { collection, addDoc, query, orderBy, limit, doc, setDoc, collectionGroup } from "firebase/firestore"
import { updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { cn } from "@/lib/utils"

export default function EsocialAudit() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [aiReport, setAiReport] = React.useState<EsocialAuditOutput | null>(null)
  const [activeTab, setActiveTab] = React.useState("auditoria")

  // Estado da Rotina de E-mail
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

  // Busca configurações da rotina
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

  // Simulação de Eventos do Agrupador 859
  const groupedEvents = [
    { id: "S-2220", emp: "BRUNO GADELHA", type: "Monitoramento", date: "2026-02-08", status: "Pronto", prot: "---" },
    { id: "S-2240", emp: "JOÃO BESTEL", type: "Condições Amb.", date: "2026-02-07", status: "Pronto", prot: "---" },
    { id: "S-2210", emp: "ERICK HENRIQUE", type: "CAT", date: "2026-02-05", status: "Transmitido", prot: "2.202602.12345" },
    { id: "S-2220", emp: "ADRIANO SANTOS", type: "Monitoramento", date: "2026-02-08", status: "Erro", prot: "---" },
  ]

  const historyQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    const isPrivileged = ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role)
    if (isPrivileged) {
      return query(collectionGroup(db, "auditHistory"), orderBy("createdAt", "desc"), limit(5))
    } else if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "auditHistory"), orderBy("createdAt", "desc"), limit(5))
    }
    return null
  }, [db, profile])

  const { data: history } = useCollection(historyQuery)

  const handleRunAiAudit = async () => {
    if (!profile || !user) return;
    setIsAuditing(true)
    setAiReport(null)
    try {
      const result = await runEsocialAudit({
        sector: "Produção e Metalurgia",
        riskList: ["Ruído Contínuo 88dB", "Fumos Metálicos", "Calor"],
        examList: ["Exame Clínico", "Espirometria"]
      })
      setAiReport(result)
      if (db && profile.companyId) {
        await addDoc(collection(db, "companies", profile.companyId, "auditHistory"), {
          ...result,
          sector: "Produção e Metalurgia",
          userId: user.uid,
          createdAt: new Date().toISOString()
        })
      }
      toast({ title: "Auditoria Finalizada" })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha na Auditoria", description: error.message })
    } finally {
      setIsAuditing(false)
    }
  }

  const handleSaveRoutine = () => {
    if (!db || !profile?.companyId || !routineRef) return
    setDocumentNonBlocking(routineRef, {
      ...routineSettings,
      updatedAt: new Date().toISOString()
    }, { merge: true })
    toast({ title: "Rotina NAI Configurada", description: `Envios ${routineSettings.frequency} ativos para ${routineSettings.customEmail || 'contatos padrão'}.` })
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Portal e-Social 2026</h1>
          <p className="text-muted-foreground font-medium">Motor de conformidade e agrupador de eventos (859).</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleRunAiAudit} 
            disabled={isAuditing} 
            className="gradient-nextcon hover:opacity-90 gap-2 h-12 px-6 rounded-xl shadow-xl font-black uppercase text-[10px] tracking-widest"
          >
            {isAuditing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-5 text-accent" />}
            Auditoria IA
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="auditoria" className="rounded-lg gap-2 text-xs font-bold">
            <SearchCheck className="size-4" /> Auditoria Técnica
          </TabsTrigger>
          <TabsTrigger value="agrupador" className="rounded-lg gap-2 text-xs font-bold">
            <Layers className="size-4" /> Agrupador (859)
          </TabsTrigger>
          <TabsTrigger value="config" className="rounded-lg gap-2 text-xs font-bold">
            <Settings2 className="size-4" /> Rotinas NAI
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auditoria" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className="card-shadow border-none bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-headline font-black text-primary uppercase">Gaps Identificados pela IA</CardTitle>
                  <CardDescription>Cruzamento preventivo entre riscos ambientais e protocolos médicos.</CardDescription>
                </CardHeader>
                <CardContent>
                  {aiReport ? (
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="text-[10px] font-black uppercase">Divergência</TableHead>
                          <TableHead className="text-[10px] font-black uppercase">Impacto Legal</TableHead>
                          <TableHead className="text-[10px] font-black uppercase">Ação NAI</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {aiReport.criticalGaps.map((gap, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-bold text-red-700 text-xs">{gap.description}</TableCell>
                            <TableCell className="text-[11px] text-muted-foreground italic">{gap.legalImpact}</TableCell>
                            <TableCell>
                              <Badge className="bg-primary/5 text-primary text-[9px] font-black uppercase border-none">
                                {gap.recommendation}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-24 opacity-30 border-2 border-dashed rounded-[2rem] flex flex-col items-center gap-4">
                      <ShieldCheck className="size-16 text-primary" />
                      <p className="font-black uppercase text-sm tracking-widest">Pronto para Auditoria</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="gradient-nextcon text-white border-none p-6 rounded-[2rem] shadow-2xl">
                <CardTitle className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-4 flex items-center gap-2">
                  <SendHorizontal className="size-4" /> Prontidão eSocial
                </CardTitle>
                <div className="space-y-6">
                  <div className="bg-white/10 p-4 rounded-2xl">
                    <p className="text-[9px] font-black text-white/50 uppercase mb-1">Score Geral</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-black">{aiReport ? aiReport.complianceScore : 92}%</span>
                      <Progress value={aiReport ? aiReport.complianceScore : 92} className="h-1.5 flex-1 bg-white/10" />
                    </div>
                  </div>
                  <Button className="w-full h-12 bg-accent text-primary font-black uppercase text-[10px] rounded-xl" disabled={!aiReport}>
                    Transmitir Lote
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="agrupador" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
              <div>
                <CardTitle className="text-xl font-headline font-black text-primary uppercase">Eventos Pendentes (859)</CardTitle>
                <CardDescription>Gerenciamento unificado de transmissões e arquivos XML.</CardDescription>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-primary text-white gap-2 font-black uppercase text-[10px] tracking-widest h-11 px-6 rounded-xl shadow-lg">
                      Ações em Massa <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Transmissão</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2 font-bold cursor-pointer">
                      <SendHorizontal className="size-4 text-emerald-600" /> Transmitir Selecionados
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Exportação</DropdownMenuLabel>
                    <DropdownMenuItem className="gap-2 font-bold cursor-pointer text-blue-600">
                      <FileDown className="size-4" /> Download Eventos (XML)
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 font-bold cursor-pointer">
                      <Download className="size-4" /> Gerar Planilha Conferência
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 font-bold cursor-pointer text-red-600">
                      <Trash2 className="size-4" /> Excluir Eventos Locais
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase">Evento</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Colaborador</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Data Geração</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Protocolo</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groupedEvents.map((evt, i) => (
                    <TableRow key={i}>
                      <TableCell><Badge variant="outline" className="font-mono text-primary border-primary/20">{evt.id}</Badge></TableCell>
                      <TableCell className="font-bold text-xs uppercase">{evt.emp}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(evt.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase",
                          evt.status === 'Pronto' ? 'bg-blue-100 text-blue-700' : 
                          evt.status === 'Erro' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        )}>{evt.status}</Badge>
                      </TableCell>
                      <TableCell className="text-[10px] font-mono opacity-50">{evt.prot}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/5">
                          <FileDown className="size-4 text-primary" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
                    <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400">Notificações automáticas de conformidade.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-primary uppercase">Ativar Envio Automático</p>
                    <p className="text-xs text-muted-foreground">A NAI enviará os resumos de eventos por e-mail.</p>
                  </div>
                  <Switch 
                    checked={routineSettings.active} 
                    onCheckedChange={(v) => setRoutineSettings({...routineSettings, active: v})} 
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Frequência da Rotina</label>
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
                          "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2",
                          routineSettings.frequency === freq.id 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-muted hover:border-slate-200 text-slate-400"
                        )}
                      >
                        <freq.icon className="size-5" />
                        <span className="text-[10px] font-black uppercase">{freq.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">E-mail Avulso (Opcional)</label>
                    <Badge variant="secondary" className="text-[8px] font-black uppercase bg-accent/10 text-accent border-none">Personalizado</Badge>
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <Input 
                      placeholder="Ex: gestor.externo@empresa.com.br" 
                      className="pl-12 h-14 bg-slate-50 border-none rounded-2xl shadow-inner font-bold text-sm"
                      value={routineSettings.customEmail}
                      onChange={(e) => setRoutineSettings({...routineSettings, customEmail: e.target.value})}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    * Este e-mail receberá os relatórios independente de estar cadastrado como usuário do portal.
                  </p>
                </div>

                <Button 
                  className="w-full h-14 bg-primary text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl hover:opacity-90 gap-2"
                  onClick={handleSaveRoutine}
                >
                  <Save className="size-4" /> Salvar Configuração
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#090e24] text-white border-none p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Sparkles className="size-32 text-accent" /></div>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-2">
                    <Info className="size-4" /> Como funciona
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="size-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs shrink-0">1</div>
                      <p className="text-xs opacity-70 leading-relaxed">
                        A NAI processa todos os eventos gerados no agrupador <strong>(859)</strong> no final de cada período.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="size-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs shrink-0">2</div>
                      <p className="text-xs opacity-70 leading-relaxed">
                        Um e-mail estruturado é disparado contendo o <strong>Score de Conformidade</strong> e a lista de pendências críticas.
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="size-8 rounded-full bg-white/10 flex items-center justify-center font-black text-xs shrink-0">3</div>
                      <p className="text-xs opacity-70 leading-relaxed">
                        Arquivos XML transmitidos com sucesso são anexados como recibos oficiais para arquivo morto do cliente.
                      </p>
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

function Info({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  )
}
