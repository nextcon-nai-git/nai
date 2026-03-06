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
  MoreVertical,
  Plus,
  Save,
  Phone,
  Droplet
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
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, addDoc, doc, serverTimestamp, limit } from "firebase/firestore"
import { cn } from "@/lib/utils"
import { REAL_EMPLOYEES, MOCK_NURSING_ATTENDANCES } from "@/lib/real-data"

export default function NursingAttendancePage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
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

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const attendancesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "nursing_attendances"), orderBy("createdAt", "desc"), limit(50))
  }, [db])
  const { data: remoteAttendances, isLoading } = useCollection(attendancesQuery)

  // Integração de Dados: Une o histórico mockado (necessário para o alerta do João Silva) com os registros reais
  const attendances = React.useMemo(() => {
    const list = [...(remoteAttendances || [])]
    // Se João Silva não estiver na lista remota, injetamos o mock para consistência do dashboard
    if (!list.find(a => a.employeeId === 'COL_JOAO_SILVA')) {
      list.push(...MOCK_NURSING_ATTENDANCES)
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [remoteAttendances])

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

      toast({ title: "Atendimento Registrado", description: "Prontuário salvo na nuvem Nextcon." })
      setIsCreateOpen(false)
      setFormData({
        employeeId: "", complaint: "", bp_sys: "", bp_dia: "",
        heart_rate: "", temperature: "", spo2: "",
        conduct: "observation", medication: "", coren: formData.coren
      })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao Salvar" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Triagem e Prontuário</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Droplet className="size-3 text-red-500" /> Ambulatório Obra Atmosphere • NR-07 & COFEN
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-nextcon text-white h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg gap-2">
              <UserPlus className="size-4" /> Novo Atendimento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
            <div className="p-8 bg-primary text-white shrink-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg text-accent"><ClipboardList className="size-5" /></div>
                <DialogTitle className="text-xl font-headline font-black uppercase">Ficha de Atendimento</DialogTitle>
              </div>
              <DialogDescription className="text-white/60 font-medium italic">Documentação técnica de enfermagem do trabalho.</DialogDescription>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-primary border-b pb-2 tracking-widest">Identificação</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Colaborador em Obra</label>
                    <Select value={formData.employeeId} onValueChange={v => setFormData({...formData, employeeId: v})}>
                      <SelectTrigger className="h-11 bg-slate-50 border-none rounded-xl font-bold shadow-inner">
                        <SelectValue placeholder="Selecione o paciente..." />
                      </SelectTrigger>
                      <SelectContent>
                        {REAL_EMPLOYEES.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">COREN-UF do Técnico</label>
                    <Input placeholder="Ex: 123456-TE/PR" value={formData.coren} onChange={e => setFormData({...formData, coren: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold shadow-inner" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-primary border-b pb-2 tracking-widest">Triagem (Sinais Vitais)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">PA (Sist/Diast)</label>
                    <div className="flex items-center gap-1">
                      <Input placeholder="120" value={formData.bp_sys} onChange={e => setFormData({...formData, bp_sys: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center shadow-inner" />
                      <span className="text-slate-300">/</span>
                      <Input placeholder="80" value={formData.bp_dia} onChange={e => setFormData({...formData, bp_dia: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">FC (bpm)</label>
                    <Input type="number" placeholder="72" value={formData.heart_rate} onChange={e => setFormData({...formData, heart_rate: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Temp (°C)</label>
                    <Input type="number" placeholder="36.5" value={formData.temperature} onChange={e => setFormData({...formData, temperature: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center shadow-inner" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">SpO2 (%)</label>
                    <Input type="number" placeholder="98" value={formData.spo2} onChange={e => setFormData({...formData, spo2: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold text-center shadow-inner" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-primary border-b pb-2 tracking-widest">Avaliação e Conduta</h4>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Relato do Colaborador / Queixa</label>
                    <Textarea 
                      placeholder="Descreva os sintomas e observações..." 
                      className="min-h-[100px] bg-slate-50 border-none rounded-2xl p-4 text-xs font-medium shadow-inner" 
                      value={formData.complaint}
                      onChange={e => setFormData({...formData, complaint: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Conduta Imediata</label>
                      <Select value={formData.conduct} onValueChange={v => setFormData({...formData, conduct: v})}>
                        <SelectTrigger className="h-11 bg-slate-50 border-none rounded-xl font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="work">Retorno ao Trabalho</SelectItem>
                          <SelectItem value="observation">Repouso/Observação</SelectItem>
                          <SelectItem value="doctor">Encaminhar ao Médico</SelectItem>
                          <SelectItem value="emergency">Remoção de Emergência</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Medicação Sob Protocolo</label>
                      <Input placeholder="Se houver..." value={formData.medication} onChange={e => setFormData({...formData, medication: e.target.value})} className="h-11 bg-slate-50 border-none rounded-xl font-bold shadow-inner" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="p-8 bg-slate-50">
              <Button 
                onClick={handleSaveAttendance} 
                disabled={isSubmitting}
                className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3"
              >
                {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5 text-accent" />}
                Finalizar e Protocolar Prontuário
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Atendimentos Hoje" value={attendances?.filter(a => new Date(a.createdAt).toDateString() === new Date().toDateString()).length || 0} icon={Activity} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Encaminhados Médicos" value={attendances?.filter(a => a.conduct === 'doctor').length || 0} icon={Stethoscope} color="text-amber-600" bg="bg-amber-50" />
        <StatCard label="SLA Emergência" value="Sub 5min" icon={Clock} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Unidade Atmosphere" value="Ativa" icon={ShieldCheck} color="text-primary" bg="bg-slate-100" />
      </div>

      <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-black text-primary uppercase">Log de Intercorrências</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Registros auditáveis conforme Resolução COFEN 0514/2016.</CardDescription>
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
                <TableHead>Triagem (PA / FC)</TableHead>
                <TableHead>Queixa Principal</TableHead>
                <TableHead>Conduta</TableHead>
                <TableHead className="pr-8 text-right">Técnico Resp.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="py-20 text-center"><Loader2 className="size-10 animate-spin mx-auto text-primary opacity-20" /></TableCell></TableRow>
              ) : attendances?.filter(a => a.employeeName.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="pl-8 py-5">
                    <div>
                      <p className="font-black text-xs text-primary uppercase">{item.employeeName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {new Date(item.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={cn(
                        "text-[10px] font-mono border-primary/10 text-primary",
                        Number(item.bp_sys) >= 140 && "bg-red-50 text-red-600 border-red-200"
                      )}>{item.bp_sys}/{item.bp_dia}</Badge>
                      <div className="flex items-center gap-1 text-[9px] font-black text-slate-400">
                        <HeartPulse className="size-3 text-red-400" /> {item.heart_rate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-[11px] text-slate-600 italic line-clamp-1 max-w-[200px]">"{item.complaint}"</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase border-none px-3 h-5",
                      item.conduct === 'work' ? "bg-emerald-100 text-emerald-700" :
                      item.conduct === 'doctor' ? "bg-amber-100 text-amber-700" :
                      item.conduct === 'emergency' ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                    )}>
                      {item.conduct === 'work' ? "Retorno Trabalho" : 
                       item.conduct === 'doctor' ? "Encam. Médico" :
                       item.conduct === 'emergency' ? "EMERGÊNCIA" : "Em Observação"}
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-8 text-right">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-primary uppercase">{item.nurseName}</p>
                      <p className="text-[8px] text-slate-400 font-bold">{item.coren}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {(!attendances || attendances.length === 0) && (
                <TableRow><TableCell colSpan={5} className="py-32 text-center opacity-30 font-black uppercase text-xs tracking-widest">Nenhum atendimento protocolado</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
