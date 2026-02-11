"use client"

import * as React from "react"
import { 
  MapPin, 
  ClipboardCheck, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  Users, 
  FileText, 
  Camera, 
  Clock, 
  HardHat,
  Gauge,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ArrowRight,
  MoreVertical,
  Signal,
  Map as MapIcon,
  RefreshCw,
  Info,
  UserCheck,
  Sparkles,
  FolderTree,
  Send
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, useStorage } from "@/firebase"
import { collection, query, orderBy, doc, collectionGroup, addDoc } from "firebase/firestore"
import { ref, uploadString } from "firebase/storage"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { extractStorageData } from "@/ai/flows/storage-manager-flow"

/**
 * @fileOverview Painel Operacional Field Control 2026
 * Gestão de ordens de serviço designadas a técnicos e engenheiros externos.
 */

export default function FieldControlOperational() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [activeTab, setActiveTab] = React.useState("activities")
  const [isCheckinLoading, setIsCheckinLoading] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [currentLocation, setCurrentLocation] = React.useState<{lat: number, lng: number} | null>(null)
  
  const [isAiOrganizerOpen, setIsAiOrganizerOpen] = React.useState(false)
  const [aiQuery, setAiQuery] = React.useState("")
  const [isAiProcessing, setIsAiProcessing] = React.useState(false)
  const [aiResult, setAiResult] = React.useState<any>(null)

  const [measurementForm, setMeasurementForm] = React.useState({
    agent: "ruido",
    intensity: "",
    equipmentId: ""
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

  const isPrivileged = React.useMemo(() => {
    if (!profile) return false;
    const role = (profile.role || '').toUpperCase();
    return ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'ADMIN'].includes(role);
  }, [profile])

  const activitiesQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    
    // Se for Administrador Global, usa Collection Group
    if (isGlobalAdmin) {
      return query(collectionGroup(db, "tasks"), orderBy("createdAt", "desc"))
    }
    
    // Se for usuário de cliente ou prestador vinculado, restringe à sua empresa
    if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "tasks"), orderBy("createdAt", "desc"))
    }

    return null;
  }, [db, profile, isGlobalAdmin])
  
  const { data: allTasks, isLoading: loadingActivities } = useCollection(activitiesQuery)

  const fieldTasks = React.useMemo(() => {
    if (!allTasks) return []
    const rawTasks = allTasks.filter(t => ['pgr', 'ltcat', 'iot_check', 'vistoria'].includes(t.type))
    
    if (isGlobalAdmin) return rawTasks
    
    // Filtra tarefas atribuídas ao usuário se não for admin de cliente
    if (profile?.role === 'PROVIDER' || profile?.role === 'ENGINEER') {
      return rawTasks.filter(t => t.assigneeId === user?.uid)
    }
    
    return rawTasks
  }, [allTasks, isGlobalAdmin, profile, user])

  const equipments = [
    { id: "DEC-001", name: "Decibelímetro Digital", brand: "Instrutherm", lastCal: "2025-01-10", nextCal: "2026-01-10", status: "expired" },
    { id: "DOS-042", name: "Dosímetro de Ruído", brand: "Bruel & Kjaer", lastCal: "2025-06-15", nextCal: "2026-06-15", status: "ok" },
    { id: "TERM-012", name: "Termômetro de Globo", brand: "Quest", lastCal: "2025-08-20", nextCal: "2026-08-20", status: "ok" },
  ]

  const handleCheckin = () => {
    setIsCheckinLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
          setIsCheckinLoading(false)
          toast({
            title: "Check-in Realizado!",
            description: `Posição validada para atendimento no cliente.`,
          })
        },
        () => {
          setIsCheckinLoading(false)
          toast({
            variant: "destructive",
            title: "Erro de Localização",
            description: "Ative o GPS para validar o início do serviço.",
          })
        }
      )
    }
  }

  const handleSaveMeasurement = async (task: any) => {
    if (!measurementForm.intensity || !measurementForm.equipmentId) {
      toast({ variant: "destructive", title: "Dados Incompletos", description: "Informe a intensidade e o equipamento." })
      return
    }

    setIsSubmitting(true)
    try {
      const reportsRef = collection(db, "companies", task.companyId, "reports")
      await addDocumentNonBlocking(reportsRef, {
        reportType: "measurement",
        name: `Medição de Campo - ${measurementForm.agent.toUpperCase()}`,
        companyId: task.companyId,
        companyName: task.companyName,
        technicalInfo: {
          ...measurementForm,
          technicianId: user?.uid,
          technicianName: profile?.name,
          location: currentLocation,
          timestamp: new Date().toISOString()
        },
        createdAt: new Date().toISOString()
      })

      toast({ title: "Medição Protocolada", description: "Os dados foram salvos no dossiê do cliente." })
      setMeasurementForm({ agent: "ruido", intensity: "", equipmentId: "" })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao Salvar" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAiOrganize = async () => {
    if (!aiQuery.trim()) return
    setIsAiProcessing(true)
    try {
      const result = await extractStorageData(aiQuery)
      setAiResult(result)
    } catch (error) {
      toast({ variant: "destructive", title: "Erro na NAI", description: "Não consegui interpretar seu comando." })
    } finally {
      setIsAiProcessing(false)
    }
  }

  const finalizeAiCreation = async () => {
    if (!aiResult || !storage) return
    setIsAiProcessing(true)
    try {
      const fileRef = ref(storage, aiResult.caminhoStorage)
      await uploadString(fileRef, aiResult.placeholderContent, 'raw')
      toast({ title: "Organização Concluída", description: `Pasta para ${aiResult.nomeEmpresa} criada via IA.` })
      setIsAiOrganizerOpen(false)
      setAiResult(null)
      setAiQuery("")
    } catch (e) {
      toast({ variant: "destructive", title: "Erro de Permissão", description: "Falha ao criar arquivo no Storage." })
    } finally {
      setIsAiProcessing(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Field Control Center</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest flex items-center gap-2">
            <Signal className="size-3 text-accent animate-pulse" /> 
            {isGlobalAdmin ? "Gestão Global de Engenharia" : `Painel do Prestador: ${profile?.name || 'Técnico'}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAiOrganizerOpen} onOpenChange={setIsAiOrganizerOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 px-6 border-accent text-accent font-bold uppercase text-[10px] gap-2 hover:bg-accent/5">
                <Sparkles className="size-4" /> Organizador AI
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
              <div className="p-8 bg-primary text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-lg"><FolderTree className="size-5 text-accent" /></div>
                  <DialogTitle className="text-xl font-headline font-black uppercase">Assistente de Organização</DialogTitle>
                </div>
                <DialogDescription className="text-white/70 font-medium">Use a NAI para estruturar pastas de evidências no Storage por voz ou texto.</DialogDescription>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">O que você quer arquivar?</label>
                  <div className="relative group">
                    <Input 
                      placeholder="Ex: Crie a pasta do projeto NR-18 para a COCEL, CNPJ 75.805.895/0001-30" 
                      value={aiQuery}
                      onChange={(e) => setAiQuery(e.target.value)}
                      className="h-14 bg-slate-50 border-none rounded-2xl p-4 pr-12 text-sm font-medium focus-visible:ring-primary/10 shadow-inner"
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={handleAiOrganize}
                      disabled={isAiProcessing || !aiQuery}
                      className="absolute right-2 top-2 h-10 w-10 text-primary hover:bg-primary/5"
                    >
                      {isAiProcessing ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    </Button>
                  </div>
                </div>

                {aiResult && (
                  <div className="p-5 bg-accent/5 border border-accent/20 rounded-2xl space-y-4 animate-in slide-in-from-bottom-2">
                    <div>
                      <p className="text-[9px] font-black uppercase text-accent mb-1">Estrutura Sugerida:</p>
                      <code className="text-[10px] font-bold text-primary break-all block bg-white/50 p-2 rounded-lg border">{aiResult.caminhoStorage}</code>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Empresa</p>
                        <p className="text-[10px] font-bold truncate">{aiResult.nomeEmpresa}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-[8px] font-black text-slate-400 uppercase">Projeto</p>
                        <p className="text-[10px] font-bold truncate">{aiResult.nomeProjeto}</p>
                      </div>
                    </div>
                    <Button onClick={finalizeAiCreation} className="w-full bg-accent text-primary font-black uppercase text-[10px] h-12 rounded-xl shadow-lg">Confirmar Organização</Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gradient-nextcon text-white h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 gap-2">
            <Smartphone className="size-4" /> Modo Offline
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Minhas Atividades" value={fieldTasks.length} icon={ClipboardCheck} color="text-blue-600" bg="bg-blue-50" />
        <KpiCard label="Status do GPS" value={currentLocation ? "Ativo" : "Pendente"} icon={MapPin} color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard label="Alertas de Calibração" value="01" icon={Gauge} color="text-red-600" bg="bg-red-50" />
        <KpiCard label="Atendimento 2026" value="SLA OK" icon={ShieldCheck} color="text-primary" bg="bg-primary/5" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-2xl h-16">
          <TabsTrigger value="activities" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6">
            <Clock className="size-4" /> Minha Agenda
          </TabsTrigger>
          <TabsTrigger value="equipments" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6">
            <Gauge className="size-4" /> Instrumentos
          </TabsTrigger>
          <TabsTrigger value="team" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest px-6">
            <UserCheck className="size-4" /> Atribuições
          </TabsTrigger>
        </TabsList>

        <TabsContent value="activities" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Ordens de Serviço Designadas</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Acesso restrito aos clientes atribuídos pela Nextcon.</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
                <Input placeholder="Buscar por cliente..." className="pl-9 h-10 w-64 bg-white border-none shadow-inner text-xs" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Status / OS</TableHead>
                    <TableHead>Unidade Cliente</TableHead>
                    <TableHead>Responsável</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead className="text-right pr-8">Ação Técnica</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingActivities ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-20"><Loader2 className="size-8 animate-spin mx-auto opacity-20" /></TableCell></TableRow>
                  ) : fieldTasks.length > 0 ? fieldTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-2 rounded-full animate-pulse",
                            task.status === 'doing' ? 'bg-emerald-500' : 'bg-slate-300'
                          )} />
                          <div>
                            <p className="font-black text-xs text-primary uppercase">{task.title}</p>
                            <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10">{task.type}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-bold text-slate-600">{task.companyName}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                            {(task.assigneeName || 'NC').substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-[11px] font-bold">{task.assigneeName || "Aguardando"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[9px] font-black gap-1 border-primary/10">
                          <MapPin className="size-2.5 text-accent" /> {currentLocation ? "Validado" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          {!currentLocation && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-[9px] font-black uppercase border-accent text-accent"
                              onClick={handleCheckin}
                              disabled={isCheckinLoading}
                            >
                              {isCheckinLoading ? <Loader2 className="size-3 animate-spin" /> : "Validar GPS"}
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="h-8 text-[9px] font-black uppercase bg-primary" disabled={!currentLocation}>Alimentar Dados</Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-xl rounded-[2rem] border-none shadow-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-headline font-black text-primary uppercase">Coleta de Dados: {task.companyName}</DialogTitle>
                                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-accent">Entrada de dados para laudos eSocial</DialogDescription>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-4 py-6">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Risco / Agente</label>
                                  <Select value={measurementForm.agent} onValueChange={(v) => setMeasurementForm({...measurementForm, agent: v})}>
                                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="ruido">Ruído Contínuo</SelectItem>
                                      <SelectItem value="calor">Calor (IBUTG)</SelectItem>
                                      <SelectItem value="quimico">Particulados / Químicos</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Intensidade / Concentração</label>
                                  <Input 
                                    placeholder="Ex: 85.4" 
                                    value={measurementForm.intensity}
                                    onChange={(e) => setMeasurementForm({...measurementForm, intensity: e.target.value})}
                                    className="h-12 bg-slate-50 border-none rounded-xl font-bold" 
                                  />
                                </div>
                                <div className="space-y-2 col-span-2">
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Instrumento de Medição</label>
                                  <Select value={measurementForm.equipmentId} onValueChange={(v) => setMeasurementForm({...measurementForm, equipmentId: v})}>
                                    <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl"><SelectValue placeholder="Selecione o equipamento calibrado..." /></SelectTrigger>
                                    <SelectContent>
                                      {equipments.map(e => (
                                        <SelectItem key={e.id} value={e.id} disabled={e.status === 'expired'}>
                                          {e.name} ({e.id}) {e.status === 'expired' ? '- VENCIDO' : ''}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button 
                                  onClick={() => handleSaveMeasurement(task)}
                                  disabled={isSubmitting}
                                  className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-2"
                                >
                                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5 text-accent" />}
                                  Sincronizar com Cliente
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-24 opacity-30">
                      <HardHat className="size-16 mx-auto mb-4" />
                      <p className="font-black uppercase text-sm tracking-widest">Nenhuma OS designada ao seu perfil</p>
                    </TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipments" className="mt-8">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b py-6 px-8">
              <CardTitle className="text-lg font-black text-primary uppercase">Inventário de Instrumentos</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Os técnicos só podem lançar dados com equipamentos calibrados.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Equipamento</TableHead>
                    <TableHead>Vencimento Calibração</TableHead>
                    <TableHead>Status RBC</TableHead>
                    <TableHead className="text-right pr-8">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipments.map((eq) => (
                    <TableRow key={eq.id}>
                      <TableCell className="pl-8">
                        <p className="font-bold text-xs text-primary">{eq.name}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase">ID: {eq.id}</p>
                      </TableCell>
                      <TableCell className="text-xs font-black">{new Date(eq.nextCal).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-none px-3",
                          eq.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        )}>
                          {eq.status === 'ok' ? 'Calibrado' : 'Bloqueado'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary"><RefreshCw className="size-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-8">
          <Card className="card-shadow border-none bg-white rounded-[2.5rem] p-10 text-center">
            <div className="max-w-md mx-auto space-y-6 opacity-40">
              <UserCheck className="size-16 mx-auto text-primary" />
              <div className="space-y-2">
                <h3 className="text-xl font-black text-primary uppercase">Minha Credencial Técnica</h3>
                <p className="text-sm">Você está autenticado como <strong>Prestador Credenciado</strong> da Nextcon. Suas atividades são monitoradas por geolocalização e as medições passam por revisão técnica antes da emissão final dos laudos.</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function KpiCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl group hover:ring-2 ring-primary/5 transition-all overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", bg, color)}>
            <Icon className="size-5" />
          </div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-primary leading-none">{value}</h3>
      </CardContent>
    </Card>
  )
}
