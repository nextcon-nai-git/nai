
"use client"

import * as React from "react"
import { HeartPulse, Calendar as CalendarIcon, Bell, MessageSquare, ChevronRight, Stethoscope, Clock, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useUser, useFirestore } from "@/firebase"
import { getWhatsAppLink, MSG_TEMPLATES } from "@/lib/whatsapp-utils"

const upcomingAlerts = [
  { company: "LAVIERS ARTIGOS MASCULINOS", id: "#1164165", date: "10/01/2026", type: "Exame Clínico", phone: "11999999999", status: "Aguardando" },
  { company: "NXC SST EMPRESARIAL", id: "#1005519", date: "30/01/2026", type: "EXAMES", phone: "11888888888", status: "Concluído" },
  { company: "INCORPORADORA GRAN-PARA", id: "#1177322", date: "01/01/2026", type: "EXAMES", phone: "11777777777", status: "Em Atendimento" },
]

export default function HealthControl() {
  const { user } = useUser()
  const db = useFirestore()
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleWhatsAppAlert = (alert: typeof upcomingAlerts[0]) => {
    const message = MSG_TEMPLATES.AVISO_GESTOR(alert.company, "Colaborador " + alert.id, alert.type);
    window.open(getWhatsAppLink(alert.phone, message), '_blank');
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-[#090e24] tracking-tight uppercase">Saúde Ocupacional (PCMSO)</h1>
          <p className="text-muted-foreground">Fila de atendimento, agendamentos e vigilância médica.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#f59e0b] text-[#090e24] hover:bg-[#f59e0b]/90 gap-2 h-11 px-6 shadow-lg font-bold">
            <HeartPulse className="size-4" /> Novo Atendimento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-[#090e24] flex items-center gap-2">
                <CalendarIcon className="size-4" /> Agenda Técnica
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none"
              />
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-[#090e24] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-[#f59e0b] flex items-center gap-2">
                <Bell className="size-4" /> Alertas Críticos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAlerts.slice(0, 2).map((alert, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[9px] font-black text-white truncate max-w-[150px]">{alert.company}</p>
                    <Badge className="bg-[#f59e0b] text-[#090e24] text-[8px] px-1.5 h-4 font-black">{alert.date}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-white/60 font-medium uppercase">{alert.type}</p>
                    <button onClick={() => handleWhatsAppAlert(alert)} className="p-1 bg-green-500 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <MessageSquare className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2 border-none shadow-lg overflow-hidden flex flex-col bg-white">
          <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg font-bold text-[#090e24] uppercase tracking-tight">Fila de Atendimento (ASO)</CardTitle>
              <CardDescription>Acompanhamento de exames em tempo real na clínica.</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary text-primary font-black uppercase text-[10px]">{upcomingAlerts.length} Na Fila</Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader className="bg-gray-50/50 text-[10px] uppercase font-black tracking-widest">
                <TableRow>
                  <TableHead>Colaborador / Empresa</TableHead>
                  <TableHead>Tipo de Exame</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAlerts.map((alert, i) => (
                  <TableRow key={i} className="group hover:bg-gray-50 transition-all">
                    <TableCell>
                      <div>
                        <p className="font-bold text-[#090e24] text-xs">Carlos Eduardo</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black">{alert.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[10px] font-bold text-[#090e24] uppercase">Periódico</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[8px] font-black uppercase border-none",
                        alert.status === 'Concluído' ? 'bg-emerald-100 text-emerald-700' : 
                        alert.status === 'Aguardando' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      )}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {alert.status === 'Concluído' ? (
                        <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase text-muted-foreground">
                          <CheckCircle2 className="size-3 mr-1" /> Ver ASO
                        </Button>
                      ) : (
                        <Button variant="link" size="sm" className="text-[9px] font-black uppercase text-blue-600">
                          Iniciar <ChevronRight className="size-3 ml-1" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center gap-3 text-blue-700 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <Stethoscope className="size-5" />
                <p className="text-[11px] font-medium leading-relaxed">
                  Utilize a Fila de Atendimento para gerenciar o fluxo de pacientes na clínica. Novos atendimentos geram eventos automáticos no eSocial após a finalização.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
