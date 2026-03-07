
"use client"

import * as React from "react"
import { 
  HeartPulse, 
  Thermometer, 
  Activity, 
  ClipboardList, 
  UserPlus, 
  Search, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle,
  Stethoscope,
  Clock,
  User,
  Building2,
  Plus,
  Save,
  Droplet,
  Calendar,
  Users,
  Brain,
  TrendingUp,
  ChevronRight,
  Info
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, addDoc, doc, serverTimestamp, limit } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { REAL_EMPLOYEES, MOCK_NURSING_ATTENDANCES } from "@/lib/real-data"

export default function HealthManagementUnified() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [activeTab, setActiveTab] = React.useState("attendance")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  const [formData, setFormData] = React.useState({
    employeeId: "",
    complaint: "",
    bp_sys: "",
    bp_dia: "",
    heart_rate: "",
    temperature: "",
    spo2: "",
    conduct: "observation",
    medication: "",
    coren: ""
  })

  // Perfil e Dados
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const attendancesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "nursing_attendances"), orderBy("createdAt", "desc"), limit(50))
  }, [db])
  const { data: remoteAttendances, isLoading: loadingAttendances } = useCollection(attendancesQuery)

  const attendances = React.useMemo(() => {
    const list = [...(remoteAttendances || [])]
    if (!list.find(a => a.employeeId === 'COL_JOAO_SILVA')) {
      list.push(...MOCK_NURSING_ATTENDANCES)
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [remoteAttendances])

  // Lógica de Atendimento
  async function handleSaveAttendance() {
    if (!db || !formData.employeeId || !formData.coren) {
      toast({ variant: "destructive", title: "Dados Incompletos", description: "Colaborador e Registro COREN são obrigatórios." })
      return
    }
    setIsSubmitting(true)
    try {
      const emp = REAL_EMPLOYEES.find(e => e.id === formData.employeeId)
      await addDoc(collection(db, "nursing_attendances"), {
        ...formData,
        employeeName: emp?.name || "Colaborador",
        companyId: emp?.companyId || "DALL_ATMOSPHERE",
        nurseId: user?.uid,
        nurseName: profile?.name || user?.email,
        createdAt: new Date().toISOString(),
        timestamp: serverTimestamp()
      })
      toast({ title: "Atendimento Registrado" })
      setIsCreateOpen(false)
      setFormData({ ...formData, employeeId: "", complaint: "", bp_sys: "", bp_dia: "", heart_rate: "", temperature: "", spo2: "", conduct: "observation", medication: "" })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Dados da Escala
  const scale = [
    { week: "1", role: "Técnico A", seg: "Trabalha", ter: "Folga", qua: "Trabalha", qui: "Folga", sex: "Trabalha", sab: "Folga" },
    { week: "1", role: "Técnico B", seg: "Folga", ter: "Trabalha", qua: "Folga", qui: "Trabalha", sex: "Folga", sab: "Trabalha" },
    { week: "2", role: "Técnico A", seg: "Folga", ter: "Trabalha", qua: "Folga", qui: "Trabalha", sex: "Folga", sab: "Trabalha" },
    { week: "2", role: "Técnico B", seg: "Trabalha", ter: "Folga", qua: "Trabalha", qui: "Folga", sex: "Trabalha", sab: "Folga" },
  ]

  // Dados Psicossociais
  const sectors = [
    { name: "Operacional (Nativa)", stress: 85, mood: "Crítico", trend: "+12%", color: "bg-red-500", lives: 42 },
    { name: "Engenharia (TimeNow)", stress: 42, mood: "Estável", trend: "-5%", color: "bg-green-500", lives: 18 },
    { name: "Logística", stress: 68, mood: "Alerta", trend: "+2%", color: "bg-orange-500", lives: 25 },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Gestão de Saúde & Ambulatório</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Building2 className="size-3" /> Central Atmosphere • NR-07 | NR-18 | COFEN
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-6 border-primary text-primary font-black uppercase text-[10px] gap-2">
            <ClipboardList className="size-4" /> Relatório Consolidado
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-nextcon text-white h-11 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">
                <Plus className="size-4" /> Novo Atendimento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
              <div className="p-8 bg-primary text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-lg text-accent"><HeartPulse className="size-5" /></div>
                  <DialogTitle className="text-xl font-headline font-black uppercase">Ficha de Triagem Técnica</DialogTitle>
                </div>
                <DialogDescription className="text-white/60 font-medium italic">Registro auditável de intercorrência em obra.</DialogDescription>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Colaborador</label>
                    <Select value={formData.employeeId} onValueChange={v => setFormData({...formData, employeeId: v})}>
                      <SelectTrigger className="h-11 bg-slate-50 border-none rounded-xl font-bold"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>{REAL_EMPLOYEES.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">COREN-UF</label>
                    <Input placeholder="Ex: 123456-TE/PR" value={formData.coren} onChange={e => setFormData({...formData, coren: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">PA</label>
                    <Input placeholder="120/80" value={formData.bp_sys} onChange={e => setFormData({...formData, bp_sys: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">FC</label>
                    <Input type="number" placeholder="72" value={formData.heart_rate} onChange={e => setFormData({...formData, heart_rate: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">Temp</label>
                    <Input type="number" placeholder="36.5" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400">SpO2</label>
                    <Input type="number" placeholder="98" value={formData.spo2} onChange={e => setFormData({...formData, spo2: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase text-slate-400">Queixa / Relato</label>
                  <Textarea placeholder="Descreva os sintomas..." value={formData.complaint} onChange={e => setFormData({...formData, complaint: e.target.value})} className="min-h-[80px] bg-slate-50 border-none rounded-xl p-3 text-xs" />
                </div>
              </div>
              <DialogFooter className="p-8 bg-slate-50">
                <Button onClick={handleSaveAttendance} disabled={isSubmitting} className="w-full h-14 bg-primary text-white font-black uppercase text-xs rounded-2xl shadow-xl gap-2">
                  {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5 text-accent" />}
                  Salvar Prontuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[750px] grid-cols-3 bg-muted/50 p-1.5 rounded-2xl h-16">
          <TabsTrigger value="attendance" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Thermometer className="size-4" /> Atendimento & Triagem
          </TabsTrigger>
          <TabsTrigger value="operation" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Clock className="size-4" /> Escala & Operação
          </TabsTrigger>
          <TabsTrigger value="psychosocial" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">
            <Brain className="size-4" /> Risco Psicossocial
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Triagens Hoje" value={attendances.filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString()).length} icon={Activity} color="text-blue-600" bg="bg-blue-50" />
            <StatCard label="Casos Críticos" value={attendances.filter(a => Number(a.bp_sys) >= 160).length} icon={AlertTriangle} color="text-red-600" bg="bg-red-50" />
            <StatCard label="SLA Atendimento" value="4.2 min" icon={Timer} color="text-emerald-600" bg="bg-emerald-50" />
            <StatCard label="Vidas em Obra" value="806" icon={Users} color="text-primary" bg="bg-slate-100" />
          </div>

          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black text-primary uppercase">Log de Atendimentos</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Registros de enfermagem em tempo real.</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 size-4 text-slate-300" />
                <Input placeholder="Buscar na base..." className="pl-10 h-10 border-none bg-white shadow-sm text-xs rounded-xl" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                  <TableRow>
                    <TableHead className="pl-8">Colaborador / Horário</TableHead>
                    <TableHead>Sinais Vitais (PA / FC)</TableHead>
                    <TableHead>Queixa Principal</TableHead>
                    <TableHead className="pr-8 text-right">Conduta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loadingAttendances ? (
                    <TableRow><TableCell colSpan={4} className="py-20 text-center"><Loader2 className="size-10 animate-spin mx-auto opacity-20" /></TableCell></TableRow>
                  ) : attendances.filter(a => a.employeeName.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div>
                          <p className="font-black text-xs text-primary uppercase">{item.employeeName}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(item.createdAt).toLocaleTimeString('pt-BR')} • {new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={cn("text-[10px] font-mono border-primary/10", Number(item.bp_sys) >= 140 && "bg-red-50 text-red-600 border-red-200")}>{item.bp_sys}/{item.bp_dia}</Badge>
                          <span className="text-[10px] font-black text-slate-400">{item.heart_rate} bpm</span>
                        </div>
                      </TableCell>
                      <TableCell><p className="text-[11px] text-slate-600 italic line-clamp-1 max-w-[250px]">"{item.complaint}"</p></TableCell>
                      <TableCell className="pr-8 text-right">
                        <Badge className={cn("text-[8px] font-black uppercase border-none px-3 h-5", item.conduct === 'work' ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700")}>
                          {item.conduct === 'work' ? "Trabalho" : "Observação"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operation" className="mt-8 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="card-shadow border-none bg-white rounded-[2rem] p-8 flex gap-6 items-start">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 shadow-inner"><Clock className="size-8" /></div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-primary uppercase">Regime Atmosphere</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">Segunda a Sexta: 07h às 19h (12x36h).<br/>Sábado: 07h às 13h (Checklist Geral).</p>
                <Badge variant="outline" className="border-emerald-100 text-emerald-700 bg-emerald-50 text-[8px] font-black uppercase mt-2">Operação Ativa</Badge>
              </div>
            </Card>
            <Card className="card-shadow border-none bg-white rounded-[2rem] p-8 flex gap-6 items-start">
              <div className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20"><ClipboardList className="size-8" /></div>
              <div className="space-y-2">
                <h4 className="text-sm font-black text-primary uppercase">Fechamento de Insumos</h4>
                <p className="text-xs text-primary/70 leading-relaxed font-medium italic">"O técnico do sábado é responsável pela reposição de DEA e Oxigênio para a segunda-feira."</p>
              </div>
            </Card>
          </div>

          <Card className="card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-slate-50 border-b p-8">
              <CardTitle className="text-xl font-black text-primary uppercase">Escala Técnica (Modelo Quinzena)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="pl-8 text-[9px] font-black uppercase">Semana</TableHead>
                    <TableHead className="text-[9px] font-black uppercase">Profissional</TableHead>
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => <TableHead key={d} className="text-[9px] font-black uppercase text-center">{d}</TableHead>)}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scale.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-8 py-5"><Badge variant="secondary" className="font-black text-[10px]">{item.week}</Badge></TableCell>
                      <TableCell><span className="font-bold text-primary text-xs uppercase">{item.role}</span></TableCell>
                      {[item.seg, item.ter, item.qua, item.qui, item.sex, item.sab].map((s, idx) => (
                        <TableCell key={idx} className="text-center">
                          <Badge className={cn("text-[8px] font-black uppercase border-none h-5", s === 'Trabalha' ? "bg-primary text-white" : "bg-slate-100 text-slate-400")}>{s}</Badge>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="psychosocial" className="mt-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 card-shadow border-none bg-white rounded-[2.5rem] p-10">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary text-accent rounded-2xl shadow-xl"><Brain className="size-6" /></div>
                  <div>
                    <h2 className="text-2xl font-black text-primary uppercase font-headline leading-tight">Mapa de Stress Ocupacional</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Indicadores de Absenteísmo Mental e Clima.</p>
                  </div>
                </div>
                <div className="space-y-10">
                  {sectors.map((s) => (
                    <div key={s.name} className="space-y-4">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-black text-primary uppercase tracking-tight">{s.name} ({s.lives} Vidas)</span>
                        <div className="text-right">
                          <span className="text-lg font-black text-primary">{s.stress}%</span>
                          <span className={cn("block text-[9px] font-black uppercase", s.trend.includes('+') ? 'text-red-500' : 'text-green-500')}>{s.trend} Tendência</span>
                        </div>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className={cn("h-full transition-all duration-1000", s.color)} style={{ width: `${s.stress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="card-shadow border-none bg-[#090e24] text-white rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Sparkles className="size-32 text-accent" /></div>
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-2">
                    <Activity className="size-4" /> Insight NAI Mental
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <p className="text-sm italic text-white/80 leading-relaxed font-medium">
                    "Detectada correlação de 0.82 entre stress e absenteísmo na unidade Nativa. Recomendamos Pausa Ativa de 15min."
                  </p>
                  <Button className="w-full h-12 bg-accent text-primary font-black uppercase text-[10px] rounded-xl shadow-lg">Solicitar Blitz Ergonômica</Button>
                </CardContent>
              </Card>
              <Card className="card-shadow border-none bg-emerald-50 rounded-[2.5rem] p-8 flex flex-col items-center text-center gap-4">
                <div className="size-16 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm"><ShieldCheck className="size-8" /></div>
                <h4 className="text-sm font-black text-primary uppercase">Privacidade Total</h4>
                <p className="text-[10px] text-primary/60 font-medium italic">"Dados agrupados garantem o anonimato nas pulse surveys semanais."</p>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl group hover:ring-2 ring-primary/5 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn("p-3 rounded-2xl", bg, color)}><Icon className="size-5" /></div>
          <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-300">Live</Badge>
        </div>
        <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</p>
        <h3 className={cn("text-2xl font-black leading-none", color)}>{value}</h3>
      </CardContent>
    </Card>
  )
}

function Timer(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>
  )
}
