
"use client"

import * as React from "react"
import { 
  MapPin, 
  ClipboardCheck, 
  ShieldCheck, 
  Zap, 
  HardHat,
  Plus,
  Loader2,
  Signal,
  Sparkles,
  ShieldAlert,
  Lock,
  History,
  AlertTriangle,
  DoorOpen,
  UserCheck,
  Building2,
  Search,
  MoreVertical,
  Cpu
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc, useStorage } from "@/firebase"
import { collection, query, orderBy, doc, collectionGroup, addDoc, serverTimestamp } from "firebase/firestore"
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
import { REAL_EMPLOYEES } from "@/lib/real-data"

export default function FieldControlOperational() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [activeTab, setActiveTab] = React.useState("activities")
  const [currentLocation, setCurrentLocation] = React.useState<{lat: number, lng: number} | null>(null)
  
  const [isAiOrganizerOpen, setIsAiOrganizerOpen] = React.useState(false)
  const [aiQuery, setAiQuery] = React.useState("")
  const [isAiProcessing, setIsAiProcessing] = React.useState(false)
  const [aiResult, setAiResult] = React.useState<any>(null)

  // Turnstile (Gatekeeper) States
  const [isGatekeeperLoading, setIsGatekeeperLoading] = React.useState(false)
  const [gatekeeperForm, setGatekeeperForm] = React.useState({
    employeeId: "",
    area: "caldeira_nr33"
  })

  // Vigia de Compliance States
  const [isAllocationOpen, setIsAllocationOpen] = React.useState(false)
  const [isValidatingCompliance, setIsValidatingCompliance] = React.useState(false)
  const [allocationForm, setAllocationOpenForm] = React.useState({
    employeeId: "",
    riskLevel: "altura_nr35"
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

  const activitiesQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    if (isGlobalAdmin) return query(collectionGroup(db, "tasks"), orderBy("createdAt", "desc"))
    if (profile.companyId) return query(collection(db, "companies", profile.companyId, "tasks"), orderBy("createdAt", "desc"))
    return null;
  }, [db, profile, isGlobalAdmin])
  
  const { data: allTasks, isLoading: loadingActivities } = useCollection(activitiesQuery)

  const accessLogsQuery = useMemoFirebase(() => {
    if (!db || !profile?.companyId) return null
    return query(collection(db, "companies", profile.companyId, "access_logs"), orderBy("timestamp", "desc"))
  }, [db, profile])
  const { data: accessLogs } = useCollection(accessLogsQuery)

  const fieldTasks = React.useMemo(() => {
    if (!allTasks) return []
    const rawTasks = allTasks.filter(t => ['pgr', 'ltcat', 'iot_check', 'vistoria'].includes(t.type))
    if (isGlobalAdmin) return rawTasks
    if (profile?.role === 'PROVIDER' || profile?.role === 'ENGINEER') return rawTasks.filter(t => t.assigneeId === user?.uid)
    return rawTasks
  }, [allTasks, isGlobalAdmin, profile, user])

  // LOGICA 4: GATEKEEPER NAI (Controle de Acesso IoT)
  const handleValidateTurnstile = async () => {
    if (!gatekeeperForm.employeeId || !db || !profile?.companyId) return
    setIsGatekeeperLoading(true)
    
    try {
      const emp = REAL_EMPLOYEES.find(e => e.id === gatekeeperForm.employeeId)
      let bloqueios = []
      const hoje = new Date()

      // Simulação da Lógica do Webhook da Catraca
      if (gatekeeperForm.area === "caldeira_nr33") {
        const hasAso = Math.random() > 0.3
        const hasTraining = Math.random() > 0.2
        if (!hasAso) bloqueios.push("ASO Vencido ou Inapto para NR-33.")
        if (!hasTraining) bloqueios.push("Treinamento NR-33 Ausente/Vencido.")
      } else if (gatekeeperForm.area === "obra_externa_nr35") {
        const hasAso = Math.random() > 0.3
        const hasTraining = Math.random() > 0.2
        if (!hasAso) bloqueios.push("ASO Vencido ou Inapto para NR-35.")
        if (!hasTraining) bloqueios.push("Treinamento NR-35 Ausente/Vencido.")
      }

      const isAuthorized = bloqueios.length === 0
      const logRef = collection(db, "companies", profile.companyId, "access_logs")
      
      await addDoc(logRef, {
        employeeId: gatekeeperForm.employeeId,
        employeeName: emp?.name || "Desconhecido",
        area: gatekeeperForm.area,
        status: isAuthorized ? "authorized" : "denied",
        reason: isAuthorized ? "Acesso Liberado" : bloqueios[0],
        timestamp: serverTimestamp()
      })

      if (isAuthorized) {
        toast({ title: "Acesso Autorizado", description: `Bem-vindo, ${emp?.name}. Catraca liberada.` })
      } else {
        toast({ variant: "destructive", title: "Acesso Negado!", description: bloqueios[0] })
      }
    } finally {
      setIsGatekeeperLoading(false)
    }
  }

  const handleAiOrganize = async () => {
    if (!aiQuery.trim()) return
    setIsAiProcessing(true)
    try {
      const result = await extractStorageData(aiQuery)
      setAiResult(result)
    } catch (error) {
      toast({ variant: "destructive", title: "Erro na NAI" })
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
            Motor de Inteligência Operacional NAI
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-6 border-accent text-accent font-bold uppercase text-[10px] gap-2 hover:bg-accent/5" onClick={() => setIsAiOrganizerOpen(true)}>
            <Sparkles className="size-4" /> Organizador AI
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Minhas Atividades" value={fieldTasks.length} icon={ClipboardCheck} color="text-blue-600" bg="bg-blue-50" />
        <KpiCard label="Status do GPS" value={currentLocation ? "Ativo" : "Pendente"} icon={MapPin} color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard label="Tentativas Negadas" value={accessLogs?.filter(l => l.status === 'denied').length || 0} icon={ShieldAlert} color="text-red-600" bg="bg-red-50" />
        <KpiCard label="Acessos Seguros" value={accessLogs?.filter(l => l.status === 'authorized').length || 0} icon={ShieldCheck} color="text-primary" bg="bg-primary/5" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[750px] grid-cols-4 bg-muted/50 p-1 rounded-2xl h-16">
          <TabsTrigger value="activities" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Agenda</TabsTrigger>
          <TabsTrigger value="gatekeeper" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Catracas (IoT)</TabsTrigger>
          <TabsTrigger value="allocations" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Alocações</TabsTrigger>
          <TabsTrigger value="equipments" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Instrumentos</TabsTrigger>
        </TabsList>

        <TabsContent value="gatekeeper" className="mt-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <div className="p-8 bg-primary text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-lg text-accent"><Cpu className="size-5" /></div>
                  <h3 className="text-xl font-headline font-black uppercase">Simular Catraca</h3>
                </div>
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest leading-tight">Validação biométrica e documental do perímetro.</p>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Colaborador (RFID)</label>
                    <Select value={gatekeeperForm.employeeId} onValueChange={v => setGatekeeperForm({...gatekeeperForm, employeeId: v})}>
                      <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue placeholder="Bipar Crachá..." /></SelectTrigger>
                      <SelectContent>
                        {REAL_EMPLOYEES.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Zona de Risco</label>
                    <Select value={gatekeeperForm.area} onValueChange={v => setGatekeeperForm({...gatekeeperForm, area: v})}>
                      <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caldeira_nr33">Caldeira (Espaço Confinado)</SelectItem>
                        <SelectItem value="obra_externa_nr35">Obra Externa (Altura)</SelectItem>
                        <SelectItem value="refeitorio">Refeitório (Área Comum)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleValidateTurnstile} 
                  disabled={isGatekeeperLoading || !gatekeeperForm.employeeId}
                  className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-2"
                >
                  {isGatekeeperLoading ? <Loader2 className="size-5 animate-spin" /> : <Lock className="size-5 text-accent" />}
                  Simular Bipagem RFID
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-black text-primary uppercase">Histórico do Perímetro (Gatekeeper)</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Logs de acesso sincronizados com sensores IoT.</CardDescription>
                </div>
                <Badge variant="outline" className="h-8 gap-2 border-primary/20 text-primary font-black uppercase text-[10px]">
                  <Signal className="size-3 text-accent animate-pulse" /> Live
                </Badge>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                    <TableRow>
                      <TableHead className="pl-8">Colaborador</TableHead>
                      <TableHead>Área / Zona</TableHead>
                      <TableHead>Status NAI</TableHead>
                      <TableHead className="pr-8 text-right">Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessLogs?.map((log) => (
                      <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="pl-8">
                          <p className="font-black text-xs text-primary uppercase">{log.employeeName}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10">{log.area.replace('_', ' ')}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge className={cn(
                              "w-fit text-[8px] font-black uppercase border-none px-3",
                              log.status === 'authorized' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            )}>
                              {log.status === 'authorized' ? "Autorizado" : "Negado"}
                            </Badge>
                            {log.status === 'denied' && (
                              <p className="text-[9px] text-red-600 italic font-medium leading-tight">⚠ {log.reason}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="pr-8 text-right text-[10px] font-bold text-slate-400">
                          {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString('pt-BR') : 'Agora'}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!accessLogs || accessLogs.length === 0) && (
                      <TableRow><TableCell colSpan={4} className="py-24 text-center opacity-30 font-black uppercase text-xs tracking-widest">Nenhuma atividade no perímetro</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activities" className="mt-8 space-y-6">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Agenda de Campo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Status / OS</TableHead>
                    <TableHead>Unidade Cliente</TableHead>
                    <TableHead className="text-right pr-8">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fieldTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-slate-50/50">
                      <TableCell className="pl-8">
                        <p className="font-black text-xs text-primary uppercase">{task.title}</p>
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10">{task.type}</Badge>
                      </TableCell>
                      <TableCell><p className="text-xs font-bold text-slate-600">{task.companyName}</p></TableCell>
                      <TableCell className="text-right pr-8">
                        <Button size="sm" className="h-8 text-[9px] font-black uppercase bg-primary">Coletar Dados</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function KpiCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden group hover:ring-2 ring-primary/5 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl group-hover:scale-110 transition-transform", bg, color)}><Icon className="size-5" /></div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className="text-2xl font-black text-primary leading-none">{value}</h3>
      </CardContent>
    </Card>
  )
}
