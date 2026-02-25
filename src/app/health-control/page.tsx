
"use client"

import * as React from "react"
import { 
  HeartPulse, 
  Calendar as CalendarIcon, 
  Bell, 
  MessageSquare, 
  Stethoscope, 
  CheckCircle2,
  MoreHorizontal,
  CalendarPlus,
  Building2,
  Clock,
  User,
  Send,
  MapPin,
  Loader2,
  Plus
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc } from "firebase/firestore"
import { getWhatsAppLink, MSG_TEMPLATES } from "@/lib/whatsapp-utils"
import { cn } from "@/lib/utils"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function HealthControl() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("queue")
  const [isSlotOpen, setIsSlotOpen] = React.useState(false)
  const [isBookingLoading, setIsBookingLoading] = React.useState(false)

  // Estados para novo slot
  const [newSlot, setNewSlot] = React.useState({
    clinicName: "CLINICA SQV - MATRIZ",
    examType: "Admissional",
    date: "",
    time: "",
    address: "Rua Comendador Araújo, 510 - Curitiba/PR"
  })

  // Consulta agendamentos reais
  const appointmentsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "exam_appointments"), orderBy("scheduledAt", "desc"))
  }, [db])
  const { data: appointments, isLoading } = useCollection(appointmentsQuery)

  const handleNotifyEmployee = (appt: any) => {
    const date = new Date(appt.scheduledAt)
    const formattedDate = date.toLocaleDateString('pt-BR')
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    
    const message = MSG_TEMPLATES.CONFIRMACAO_AGENDAMENTO(
      appt.employeeName || "Colaborador",
      appt.examType,
      appt.clinicName,
      formattedDate,
      formattedTime,
      appt.address || "Verificar com a clínica"
    )
    
    window.open(getWhatsAppLink(appt.employeePhone || "41999999999", message), '_blank')
    toast({ title: "Notificação Enviada", description: "WhatsApp aberto com os dados do agendamento." })
  }

  const handleCreateSlot = async () => {
    if (!db || !newSlot.date || !newSlot.time) return
    setIsBookingLoading(true)
    
    try {
      const scheduledAt = new Date(`${newSlot.date}T${newSlot.time}`).toISOString()
      await addDocumentNonBlocking(collection(db, "exam_appointments"), {
        clinicId: "SQV_01",
        clinicName: newSlot.clinicName,
        examType: newSlot.examType,
        scheduledAt,
        status: "disponivel",
        address: newSlot.address,
        createdAt: new Date().toISOString()
      })
      
      toast({ title: "Slot Publicado", description: "Horário disponível para agendamento dos clientes." })
      setIsSlotOpen(false)
    } finally {
      setIsBookingLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Saúde Ocupacional (PCMSO)</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Building2 className="size-3 text-accent" /> Automação de Agendamentos Nextcon & Clínicas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-6 border-primary text-primary font-black uppercase text-[10px] gap-2" onClick={() => window.open(getWhatsAppLink("41988887777", MSG_TEMPLATES.SOLICITAR_GRADE_CLINICA("SQV")), '_blank')}>
            <MessageSquare className="size-4" /> Solicitar Grade SQV
          </Button>
          
          <Dialog open={isSlotOpen} onOpenChange={setIsSlotOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-nextcon text-white h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg">
                <Plus className="size-4" /> Publicar Horário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
              <div className="p-8 bg-primary text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-lg"><Clock className="size-5 text-accent" /></div>
                  <DialogTitle className="text-xl font-headline font-black uppercase">Abrir Grade Clínica</DialogTitle>
                </div>
                <DialogDescription className="text-white/70 font-medium italic">Disponibilize horários para a rede Nextcon.</DialogDescription>
              </div>
              <div className="p-8 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Clínica</label>
                  <Input value={newSlot.clinicName} readOnly className="bg-slate-50 border-none h-12 font-bold text-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Data</label>
                    <Input type="date" value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Hora</label>
                    <Input type="time" value={newSlot.time} onChange={e => setNewSlot({...newSlot, time: e.target.value})} className="h-12 bg-slate-50 border-none rounded-xl font-bold" />
                  </div>
                </div>
                <Button onClick={handleCreateSlot} disabled={isBookingLoading} className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
                  {isBookingLoading ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5 text-accent" />}
                  Confirmar Disponibilidade
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-2 bg-muted/50 p-1.5 rounded-2xl h-16">
          <TabsTrigger value="queue" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Fila de Atendimento</TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-xl gap-2 text-[10px] font-black uppercase tracking-widest">Grade de Horários</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-black text-primary uppercase">Eventos do Dia</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Acompanhamento de exames agendados.</CardDescription>
                  </div>
                  <Badge variant="outline" className="border-accent text-accent font-black uppercase text-[10px] px-3">Sincronizado</Badge>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                      <TableRow>
                        <TableHead className="pl-8">Colaborador / Tipo</TableHead>
                        <TableHead>Clínica / Local</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right pr-8">Ação</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments?.filter(a => a.status === 'agendado').map((appt) => (
                        <TableRow key={appt.id} className="hover:bg-slate-50/50 transition-all">
                          <TableCell className="pl-8">
                            <div className="flex flex-col">
                              <p className="font-black text-xs text-primary uppercase">{appt.employeeName}</p>
                              <Badge variant="outline" className="w-fit text-[8px] font-black uppercase border-primary/10 mt-1">{appt.examType}</Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <p className="text-[10px] font-bold text-slate-600 uppercase">{appt.clinicName}</p>
                              <p className="text-[9px] text-slate-400 font-medium truncate w-40">{new Date(appt.scheduledAt).toLocaleDateString('pt-BR')} às {new Date(appt.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 text-[8px] font-black uppercase border-none px-3">AGENDADO</Badge>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <Button size="icon" variant="ghost" className="h-9 w-9 rounded-full text-emerald-600 hover:bg-emerald-50" onClick={() => handleNotifyEmployee(appt)}>
                              <Send className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!appointments || appointments.filter(a => a.status === 'agendado').length === 0) && (
                        <TableRow><TableCell colSpan={4} className="py-24 text-center opacity-30 font-black uppercase text-xs tracking-widest">Nenhum exame para hoje</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-lg bg-white rounded-[2rem]">
                <CardHeader className="pb-2 border-b">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <CalendarIcon className="size-4" /> Agenda Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center pt-4">
                  <Calendar mode="single" selected={new Date()} className="rounded-md border-none" />
                </CardContent>
              </Card>

              <Card className="bg-[#090e24] text-white border-none p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 p-6 opacity-10"><Stethoscope className="size-32 text-accent" /></div>
                <div className="relative z-10 space-y-4">
                  <Badge className="bg-accent text-primary border-none text-[8px] font-black uppercase tracking-[0.2em]">Dica NAI</Badge>
                  <h3 className="text-sm font-bold leading-tight uppercase tracking-widest">Controle de Absenteísmo</h3>
                  <p className="text-[11px] text-white/60 leading-relaxed font-medium">
                    "Notificar o colaborador 24h antes do exame reduz em 22% a taxa de 'no-show' nas clínicas de Curitiba."
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="mt-8">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary text-white py-6 px-8 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-black uppercase">Vagas Disponíveis na Rede</CardTitle>
                <CardDescription className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Clínicas Parceiras: Curitiba e RMC</CardDescription>
              </div>
              <Badge className="bg-accent text-primary font-black uppercase text-[10px] px-4 h-8 flex items-center border-none">LIVE GRADE</Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
                {appointments?.filter(a => a.status === 'disponivel').map((slot) => (
                  <div key={slot.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-accent/30 transition-all group relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <CalendarPlus className="size-5" />
                      </div>
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10 text-primary/60">{slot.examType}</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="font-black text-xs text-primary uppercase">{slot.clinicName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase flex items-center gap-1">
                        <MapPin className="size-2.5" /> {slot.address || 'Curitiba/PR'}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="size-3 text-accent" />
                        <span className="text-sm font-black text-primary">{new Date(slot.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <Button size="sm" className="h-9 px-4 bg-primary text-white font-black uppercase text-[9px] rounded-xl shadow-lg">Reservar Vaga</Button>
                    </div>
                  </div>
                ))}
                {(!appointments || appointments.filter(a => a.status === 'disponivel').length === 0) && (
                  <div className="col-span-full py-20 text-center opacity-30">
                    <CalendarIcon className="size-16 mx-auto mb-4" />
                    <p className="font-black uppercase text-xs tracking-widest">Nenhum horário liberado pelas clínicas</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
