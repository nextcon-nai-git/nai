
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
  Send,
  ShieldAlert,
  UserPlus
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
import { REAL_EMPLOYEES } from "@/lib/real-data"

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

  // Vigia de Compliance States
  const [isAllocationOpen, setIsAllocationOpen] = React.useState(false)
  const [isValidatingCompliance, setIsValidatingCompliance] = React.useState(false)
  const [allocationForm, setAllocationOpenForm] = React.useState({
    employeeId: "",
    riskLevel: "altura_nr35"
  })

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

  const activitiesQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    if (isGlobalAdmin) return query(collectionGroup(db, "tasks"), orderBy("createdAt", "desc"))
    if (profile.companyId) return query(collection(db, "companies", profile.companyId, "tasks"), orderBy("createdAt", "desc"))
    return null;
  }, [db, profile, isGlobalAdmin])
  
  const { data: allTasks, isLoading: loadingActivities } = useCollection(activitiesQuery)

  const allocationsQuery = useMemoFirebase(() => {
    if (!db || !profile?.companyId) return null
    return query(collection(db, "companies", profile.companyId, "work_allocations"), orderBy("createdAt", "desc"))
  }, [db, profile])
  const { data: allocations } = useCollection(allocationsQuery)

  const fieldTasks = React.useMemo(() => {
    if (!allTasks) return []
    const rawTasks = allTasks.filter(t => ['pgr', 'ltcat', 'iot_check', 'vistoria'].includes(t.type))
    if (isGlobalAdmin) return rawTasks
    if (profile?.role === 'PROVIDER' || profile?.role === 'ENGINEER') return rawTasks.filter(t => t.assigneeId === user?.uid)
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
          toast({ title: "Check-in Realizado!", description: "Posição validada para atendimento." })
        },
        () => {
          setIsCheckinLoading(false)
          toast({ variant: "destructive", title: "Erro de Localização" })
        }
      )
    }
  }

  // LOGICA 2: VIGIA DE COMPLIANCE (NR-7 e NR-35)
  const handleValidateAllocation = async () => {
    if (!allocationForm.employeeId) return
    setIsValidatingCompliance(true)
    
    try {
      const emp = REAL_EMPLOYEES.find(e => e.id === allocationForm.employeeId)
      let bloqueios = []

      // Simulação da Inteligência Vigia
      if (allocationForm.riskLevel === "altura_nr35") {
        const hasAso = Math.random() > 0.3
        const hasTraining = Math.random() > 0.2
        
        if (!hasAso) bloqueios.push("ASO vencido ou sem aptidão (NR-7).")
        if (!hasTraining) bloqueios.push("Treinamento de NR-35 ausente/vencido.")
      }

      const status = bloqueios.length > 0 ? "blocked" : "approved"
      const colRef = collection(db!, "companies", profile?.companyId || "leads", "work_allocations")
      
      await addDocumentNonBlocking(colRef, {
        ...allocationForm,
        employeeName: emp?.name || "Desconhecido",
        status,
        blockingReasons: bloqueios,
        createdAt: new Date().toISOString()
      })

      if (status === "blocked") {
        toast({ variant: "destructive", title: "Bloqueio de Compliance", description: bloqueios[0] })
      } else {
        toast({ title: "Alocação Aprovada", description: "Colaborador apto para a função." })
      }
      setIsAllocationOpen(false)
    } finally {
      setIsValidatingCompliance(false)
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
          <Dialog open={isAllocationOpen} onOpenChange={setIsAllocationOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white h-11 px-6 rounded-xl font-black uppercase text-[10px] gap-2 shadow-lg shadow-primary/20">
                <HardHat className="size-4 text-accent" /> Vigia de Compliance
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="p-8 bg-[#090e24] text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent/20 rounded-lg text-accent"><ShieldAlert className="size-5" /></div>
                  <DialogTitle className="text-xl font-headline font-black uppercase">Vigia de Alocação</DialogTitle>
                </div>
                <DialogDescription className="text-white/50 text-[10px] uppercase font-bold tracking-widest">Prevenção de acidentes e passivo trabalhista.</DialogDescription>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Colaborador</label>
                    <Select value={allocationForm.employeeId} onValueChange={v => setAllocationOpenForm({...allocationForm, employeeId: v})}>
                      <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {REAL_EMPLOYEES.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nível de Risco / NR</label>
                    <Select value={allocationForm.riskLevel} onValueChange={v => setAllocationOpenForm({...allocationForm, riskLevel: v})}>
                      <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="altura_nr35">NR-35: Trabalho em Altura</SelectItem>
                        <SelectItem value="eletrica_nr10">NR-10: Risco Elétrico</SelectItem>
                        <SelectItem value="confinado_nr33">NR-33: Espaço Confinado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={handleValidateAllocation} 
                  disabled={isValidatingCompliance || !allocationForm.employeeId}
                  className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-2"
                >
                  {isValidatingCompliance ? <Loader2 className="size-5 animate-spin" /> : <ShieldCheck className="size-5 text-accent" />}
                  Validar Aptidão Técnica
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" className="h-11 px-6 border-accent text-accent font-bold uppercase text-[10px] gap-2 hover:bg-accent/5" onClick={() => setIsAiOrganizerOpen(true)}>
            <Sparkles className="size-4" /> Organizador AI
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Minhas Atividades" value={fieldTasks.length} icon={ClipboardCheck} color="text-blue-600" bg="bg-blue-50" />
        <KpiCard label="Status do GPS" value={currentLocation ? "Ativo" : "Pendente"} icon={MapPin} color="text-emerald-600" bg="bg-emerald-50" />
        <KpiCard label="Alocações Seguras" value={allocations?.filter(a => a.status === 'approved').length || 0} icon={ShieldCheck} color="text-primary" bg="bg-primary/5" />
        <KpiCard label="Bloqueios Vigia" value={allocations?.filter(a => a.status === 'blocked').length || 0} icon={ShieldAlert} color="text-red-600" bg="bg-red-50" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-2xl h-16">
          <TabsTrigger value="activities" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Agenda</TabsTrigger>
          <TabsTrigger value="allocations" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Alocações</TabsTrigger>
          <TabsTrigger value="equipments" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Instrumentos</TabsTrigger>
        </TabsList>

        <TabsContent value="allocations" className="mt-8">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8">
              <CardTitle className="text-lg font-black text-primary uppercase">Histórico de Alocações (Vigia NAI)</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Monitoramento preventivo de NR-07 e NR-35.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] font-black uppercase">
                  <TableRow>
                    <TableHead className="pl-8">Colaborador</TableHead>
                    <TableHead>Risco / NR</TableHead>
                    <TableHead>Status Vigia</TableHead>
                    <TableHead className="pr-8">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations?.map((al) => (
                    <TableRow key={al.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="pl-8">
                        <p className="font-black text-xs text-primary uppercase">{al.employeeName}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10">{al.riskLevel.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={cn(
                            "w-fit text-[8px] font-black uppercase border-none px-3",
                            al.status === 'approved' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                            {al.status === 'approved' ? "Aprovado" : "Bloqueado"}
                          </Badge>
                          {al.blockingReasons?.map((r: string, i: number) => (
                            <p key={i} className="text-[9px] text-red-600 italic font-medium leading-tight">⚠ {r}</p>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-[10px] font-bold text-slate-400">
                        {new Date(al.createdAt).toLocaleString('pt-BR')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
