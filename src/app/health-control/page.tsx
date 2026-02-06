
"use client"

import * as React from "react"
import { 
  HeartPulse, 
  Calendar as CalendarIcon, 
  Bell, 
  MessageSquare, 
  ChevronRight, 
  Stethoscope, 
  Clock, 
  CheckCircle2,
  MoreHorizontal,
  CalendarPlus,
  SendHorizontal,
  Building2
} from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore } from "@/firebase"
import { getWhatsAppLink } from "@/lib/whatsapp-utils"
import { cn } from "@/lib/utils"

const upcomingAlerts = [
  { 
    employeeName: "Carlos Eduardo", 
    company: "LAVIERS ARTIGOS MASCULINOS", 
    id: "#1164165", 
    date: "10/01/2026", 
    type: "Periódico", 
    phone: "11999999999", 
    status: "Aguardando",
    clinic: "Clinica SQV - Matriz",
    clinicPhone: "11988887777"
  },
  { 
    employeeName: "Carlos Eduardo", 
    company: "NXC SST EMPRESARIAL", 
    id: "#1005519", 
    date: "30/01/2026", 
    type: "Periódico", 
    phone: "11888888888", 
    status: "Concluído",
    clinic: "Working Segurança",
    clinicPhone: "11977776666"
  },
  { 
    employeeName: "Carlos Eduardo", 
    company: "INCORPORADORA GRAN-PARA", 
    id: "#1177322", 
    date: "01/01/2026", 
    type: "Periódico", 
    phone: "11777777777", 
    status: "Em Atendimento",
    clinic: "Clinica SQV - Filial",
    clinicPhone: "11988887777"
  },
]

export default function HealthControl() {
  const { toast } = useToast()
  const { user } = useUser()
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const handleAction = (action: string, record: typeof upcomingAlerts[0]) => {
    if (action === 'whatsapp') {
      const message = `Olá, aqui é da Nextcon. Gostaria de confirmar o atendimento de ${record.employeeName} para o exame ${record.type} na empresa ${record.company}.`;
      window.open(getWhatsAppLink(record.clinicPhone, message), '_blank');
      return;
    }

    if (action === 'schedule') {
      toast({
        title: "Agendamento Iniciado",
        description: `Abrindo grade de horários para ${record.clinic}.`,
      });
      return;
    }

    toast({
      title: "Status Atualizado",
      description: `Atendimento de ${record.employeeName} marcado como ${action}.`,
    });
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
                <Bell className="size-4" /> Próximos Vencimentos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAlerts.slice(0, 2).map((alert, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-[#f59e0b] uppercase mb-0.5">{alert.employeeName}</p>
                      <p className="text-[9px] font-medium text-white/60 truncate">{alert.company}</p>
                    </div>
                    <Badge className="bg-[#f59e0b] text-[#090e24] text-[8px] px-1.5 h-4 font-black">{alert.date}</Badge>
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
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary text-primary font-black uppercase text-[10px] px-3">{upcomingAlerts.length} Na Fila</Badge>
            </div>
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
                      <div className="flex flex-col">
                        <p className="font-bold text-[#090e24] text-xs">{alert.employeeName}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black">{alert.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[9px] font-bold border-muted-foreground/20">{alert.type}</Badge>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Gestão de Atendimento</DropdownMenuLabel>
                          {alert.status !== 'Concluído' && (
                            <DropdownMenuItem onClick={() => handleAction('iniciado', alert)} className="cursor-pointer">
                              <Stethoscope className="mr-2 h-4 w-4 text-blue-600" />
                              <span className="font-bold">Iniciar Atendimento</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleAction('schedule', alert)} className="cursor-pointer">
                            <CalendarPlus className="mr-2 h-4 w-4 text-[#f59e0b]" />
                            <span className="font-bold">Agendar Novo Exame</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">Comunicação Externa</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleAction('whatsapp', alert)} className="cursor-pointer text-green-600 focus:text-green-700 focus:bg-green-50">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span className="font-bold">Notificar Clínica (Zap)</span>
                          </DropdownMenuItem>
                          {alert.status === 'Concluído' && (
                            <DropdownMenuItem className="cursor-pointer">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" />
                              <span className="font-bold">Visualizar ASO</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center gap-3 text-blue-700 bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase leading-none mb-1">Clínicas Parceiras Online</p>
                  <p className="text-[10px] font-medium leading-tight opacity-80">
                    O sistema está sincronizado com a grade da Clinica SQV e Working Segurança. Use o botão de WhatsApp para envio imediato de guias.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
