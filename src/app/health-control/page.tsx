
"use client"

import * as React from "react"
import { 
  HeartPulse, 
  Calendar as CalendarIcon, 
  Bell, 
  MessageSquare, 
  Stethoscope, 
  CheckCircle2,
  CalendarPlus,
  Building2,
  Clock,
  User,
  Send,
  MapPin,
  Loader2,
  Plus,
  QrCode,
  AlertTriangle,
  Zap,
  ChevronRight,
  ShieldCheck
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { collection, query, orderBy, addDoc, serverTimestamp, where, doc, updateDoc } from "firebase/firestore"
import { getWhatsAppLink, MSG_TEMPLATES } from "@/lib/whatsapp-utils"
import { cn } from "@/lib/utils"
import { updateDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

export default function HealthControl() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("queue")
  const [isQrOpen, setIsQrOpen] = React.useState(false)
  const [isSlotOpen, setIsSlotOpen] = React.useState(false)
  const [isBookingLoading, setIsBookingLoading] = React.useState(false)
  const [currentTime, setCurrentTime] = React.useState(new Date())

  // Atualiza relógio para cálculo de espera real-time
  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000)
    return () => clearInterval(timer)
  }, [])

  const appointmentsQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "agendamentos"), orderBy("data_hora", "asc"))
  }, [db])
  const { data: appointments, isLoading } = useCollection(appointmentsQuery)

  const handleCheckIn = (appt: any) => {
    if (!db) return
    const docRef = doc(db, "agendamentos", appt.id)
    updateDocumentNonBlocking(docRef, {
      status: "Em Espera",
      check_in_realizado: true,
      check_in_at: new Date().toISOString()
    })
    toast({ title: "Check-in Realizado", description: `${appt.colaborador_nome} entrou na fila de espera.` })
  }

  const handleStartConsultation = (appt: any) => {
    if (!db) return
    const docRef = doc(db, "agendamentos", appt.id)
    updateDocumentNonBlocking(docRef, { status: "Em Atendimento" })
    toast({ title: "Atendimento Iniciado", description: "Iniciando protocolos médicos." })
  }

  const handleFinalizeASO = async (appt: any) => {
    if (!db || !user) return
    
    const docRef = doc(db, "agendamentos", appt.id)
    updateDocumentNonBlocking(docRef, { status: "Concluído" })

    // Simula geração de ASO e envio eSocial
    const asoRef = collection(db, "atendimentos_aso")
    await addDocumentNonBlocking(asoRef, {
      agendamento_id: appt.id,
      medico_id: user.uid,
      employeeName: appt.colaborador_nome,
      companyId: appt.companyId || "CLI_NATIVA",
      data_emissao: new Date().toISOString(),
      resultado: "Apto",
      status_esocial: "Pendente",
      createdAt: new Date().toISOString()
    })

    toast({ 
      title: "ASO Concluído", 
      description: "Documento assinado digitalmente e fila eSocial acionada." 
    })
  }

  const getWaitTime = (checkInAt: string) => {
    if (!checkInAt) return 0
    const diff = currentTime.getTime() - new Date(checkInAt).getTime()
    return Math.floor(diff / 60000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Fila Zero Medicina</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Zap className="size-3 text-accent animate-pulse" /> Monitoramento de Fluxo e Conformidade eSocial.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-11 px-6 border-primary text-primary font-black uppercase text-[10px] gap-2">
                <QrCode className="size-4" /> Check-in QR
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none shadow-2xl p-8 text-center bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-primary uppercase">Check-in Inteligente</DialogTitle>
                <DialogDescription className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">Aproxime o crachá do colaborador</DialogDescription>
              </DialogHeader>
              <div className="py-8">
                <div className="size-48 mx-auto bg-slate-50 rounded-3xl border-4 border-dashed border-primary/10 flex items-center justify-center relative">
                  <QrCode className="size-32 text-primary opacity-20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent rounded-3xl" />
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">"Reduzindo erros de digitação e acelerando o PCMSO."</p>
            </DialogContent>
          </Dialog>
          <Button className="gradient-nextcon text-white h-11 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">
            <Plus className="size-4" /> Novo Agendamento
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1 bg-[#090e24] text-white border-none p-8 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10"><Zap className="size-32 text-accent" /></div>
          <div className="relative z-10 space-y-6">
            <Badge className="bg-accent text-primary border-none text-[8px] font-black uppercase tracking-[0.2em]">Fila Inteligente</Badge>
            <div>
              <p className="text-[9px] font-black uppercase text-white/40 tracking-widest mb-1">Tempo Médio de Espera</p>
              <h3 className="text-3xl font-black text-accent">14 min</h3>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/10">
              <p className="text-[11px] text-white/60 leading-relaxed italic font-medium">
                "O sistema otimiza a agenda baseada no tipo de exame. Admissionais têm prioridade na triagem."
              </p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-3 card-shadow border-none bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-slate-50 border-b py-6 px-8 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-black text-primary uppercase">Fila de Atendimento do Dia</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Controle de Fluxo: Triagem &gt; Médico &gt; eSocial.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="h-7 gap-2 border-emerald-100 text-emerald-700 font-black uppercase text-[8px] bg-emerald-50">
                <div className="size-1.5 bg-emerald-500 rounded-full animate-ping" /> Live Monitor
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50 text-[10px] uppercase font-black">
                <TableRow>
                  <TableHead className="pl-8">Colaborador / Tipo</TableHead>
                  <TableHead>Status / Espera</TableHead>
                  <TableHead>Ação Técnica</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="py-20 text-center"><Loader2 className="size-8 animate-spin mx-auto opacity-20" /></TableCell></TableRow>
                ) : appointments?.filter(a => a.status !== 'Concluído').map((appt) => {
                  const waitTime = getWaitTime(appt.check_in_at);
                  const isCritical = waitTime >= 20;

                  return (
                    <TableRow key={appt.id} className="hover:bg-slate-50/50 transition-all group">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-xs shadow-inner">
                            {appt.colaborador_nome?.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-xs text-primary uppercase leading-tight">{appt.colaborador_nome}</p>
                            <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/10 mt-1">{appt.tipo}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1.5">
                          <Badge className={cn(
                            "w-fit text-[8px] font-black uppercase border-none px-3",
                            appt.status === 'Em Espera' ? "bg-amber-100 text-amber-700" : 
                            appt.status === 'Em Atendimento' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"
                          )}>
                            {appt.status}
                          </Badge>
                          {appt.status === 'Em Espera' && (
                            <div className={cn(
                              "flex items-center gap-1.5 text-[10px] font-black",
                              isCritical ? "text-red-600 animate-pulse" : "text-slate-400"
                            )}>
                              <Clock className="size-3" /> {waitTime} min em espera
                              {isCritical && <AlertTriangle className="size-3 ml-1" />}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="pr-8 text-right">
                        <div className="flex justify-end gap-2">
                          {appt.status === 'Agendado' && (
                            <Button onClick={() => handleCheckIn(appt)} className="h-9 px-4 bg-primary text-white font-black uppercase text-[9px] rounded-xl shadow-lg">Check-in</Button>
                          )}
                          {appt.status === 'Em Espera' && (
                            <Button onClick={() => handleStartConsultation(appt)} className="h-9 px-4 bg-emerald-600 text-white font-black uppercase text-[9px] rounded-xl shadow-lg">Chamar Médico</Button>
                          )}
                          {appt.status === 'Em Atendimento' && (
                            <Button onClick={() => handleFinalizeASO(appt)} className="h-9 px-4 bg-accent text-primary font-black uppercase text-[9px] rounded-xl shadow-lg gap-2">
                              <ShieldCheck className="size-3" /> Finalizar & Assinar
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
                {(!appointments || appointments.length === 0) && (
                  <TableRow><TableCell colSpan={3} className="py-24 text-center opacity-30 font-black uppercase text-xs tracking-widest">Nenhum agendamento para hoje</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
