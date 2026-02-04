"use client"

import * as React from "react"
import { HeartPulse, Clock, FileWarning, Loader2, Search, User, Stethoscope, Calendar as CalendarIcon, TrendingUp, AlertCircle, Bell, MessageSquare } from "lucide-react"
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
  { company: "LAVIERS ARTIGOS MASCULINOS E CONFECCOES LTDA", id: "#1164165", date: "10/01/2026", type: "Exame Clínico", phone: "11999999999" },
  { company: "LAVIERS ARTIGOS MASCULINOS E CONFECCOES LTDA", id: "#1164165", date: "01/01/2026", type: "ASO", phone: "11999999999" },
  { company: "NXC SST EMPRESARIAL LTDA", id: "#1005519", date: "30/01/2026", type: "EXAMES", phone: "11888888888" },
  { company: "INCORPORADORA GRAN-PARA LTDA", id: "#1177322", date: "01/01/2026", type: "EXAMES", phone: "11777777777" },
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
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#090e24] tracking-tight uppercase">Vigilância Médica (NR-07)</h1>
          <p className="text-muted-foreground">Monitoramento de aptidão e gestão de saúde ocupacional integrada 2026.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#f59e0b] text-[#090e24] hover:bg-[#f59e0b]/90 gap-2 h-11 px-6 shadow-lg font-bold">
            <HeartPulse className="size-4" /> Lançar ASO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-[#090e24] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-[#f59e0b] flex items-center gap-2">
                <Bell className="size-4" /> Alertas de Vencimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAlerts.map((alert, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[9px] font-black text-white truncate max-w-[150px]">{alert.company}</p>
                    <Badge className="bg-[#f59e0b] text-[#090e24] text-[8px] px-1.5 h-4 font-black">{alert.date}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-white/60 font-medium uppercase">{alert.type} {alert.id}</p>
                    <button 
                      onClick={() => handleWhatsAppAlert(alert)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-green-500 rounded text-white"
                    >
                      <MessageSquare className="size-3" />
                    </button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-[#090e24]">Calendário de Saúde</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pt-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border-none"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2 border-none shadow-lg overflow-hidden flex flex-col bg-white">
          <CardHeader className="bg-gray-50 border-b flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg font-bold text-[#090e24] uppercase tracking-tight">Dossiê de Exames a Vencer</CardTitle>
              <CardDescription className="font-medium">Filtrado por criticidade e conformidade NR-07</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary text-primary font-black uppercase text-[10px]">{upcomingAlerts.length} Registros Críticos</Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Empresa Cliente / ID</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Natureza do Exame</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-widest">Vencimento</TableHead>
                  <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">Aviso WhatsApp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingAlerts.map((alert, i) => (
                  <TableRow key={i} className="group hover:bg-amber-50/30 transition-all border-l-4 border-l-[#f59e0b]">
                    <TableCell>
                      <div>
                        <p className="font-bold text-[#090e24] text-xs leading-tight">{alert.company}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">{alert.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-[10px] font-bold border-none uppercase">
                        {alert.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-black text-[#090e24]">{alert.date}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100 gap-2 h-8 text-[10px] font-black uppercase"
                        onClick={() => handleWhatsAppAlert(alert)}
                      >
                        <MessageSquare className="size-3" /> Notificar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="p-6 bg-gray-50 border-t">
              <div className="flex items-center gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200">
                <AlertCircle className="size-5" />
                <p className="text-[11px] font-medium leading-relaxed">
                  Atenção: Os exames acima ultrapassam o prazo de 30 dias para renovação. Utilize o botão de WhatsApp para notificar os gestores ou colaboradores imediatamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
