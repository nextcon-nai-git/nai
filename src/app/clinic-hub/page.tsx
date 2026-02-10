
"use client"

import * as React from "react"
import { 
  Building2, 
  Stethoscope, 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  MoreVertical,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Landmark,
  BadgeDollarSign,
  HeartPulse,
  DoorOpen,
  Monitor
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/**
 * @fileOverview Hub de Operações da Clínica
 * Controle de salas, faturamento de prestadores e status de atendimentos digitais.
 */

export default function ClinicHub() {
  const [activeTab, setActiveTab] = React.useState("rooms")

  const rooms = [
    { id: "S01", name: "Sala 01 - Exame Clínico", status: "occupied", doctor: "Dr. Paulo Curvelo", patient: "Bruno Gadelha" },
    { id: "S02", name: "Sala 02 - Audiometria", status: "ready", doctor: "Dra. Eliana Silva", patient: "---" },
    { id: "S03", name: "Sala 03 - Acuidade Visual", status: "cleaning", doctor: "---", patient: "---" },
    { id: "S04", name: "Sala 04 - Coleta", status: "ready", doctor: "Enf. Thamires", patient: "---" },
  ]

  const providerBilling = [
    { provider: "Clínica SQV Matriz", exams: 128, total: "R$ 4.560,00", status: "ready" },
    { provider: "Working Segurança", exams: 42, total: "R$ 1.240,00", status: "pending" },
    { provider: "Acre SST", exams: 85, total: "R$ 3.100,00", status: "paid" },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Gestão da Clínica Nextcon</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-[0.2em]">Centro de Operações, Agendamento e Faturamento de Rede.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-accent text-primary font-black uppercase text-[10px] h-12 px-6 rounded-xl shadow-lg shadow-accent/20">
            <Plus className="size-4 mr-2" /> Novo Agendamento
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Atendimentos Hoje" value="128" icon={Users} color="text-blue-600" />
        <KpiCard label="Tempo Médio" value="18min" icon={Clock} color="text-emerald-600" />
        <KpiCard label="Salas Ativas" value="04 / 06" icon={DoorOpen} color="text-orange-600" />
        <KpiCard label="ASO Digital (Cert.)" value="100%" icon={Monitor} color="text-primary" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-xl h-14 w-full md:w-[600px] grid grid-cols-3">
          <TabsTrigger value="rooms" className="rounded-lg gap-2 text-xs font-bold">Monitor de Salas</TabsTrigger>
          <TabsTrigger value="billing" className="rounded-lg gap-2 text-xs font-bold">Faturamento Rede</TabsTrigger>
          <TabsTrigger value="reports" className="rounded-lg gap-2 text-xs font-bold">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="rooms" className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Card key={room.id} className="card-shadow border-none bg-white rounded-3xl overflow-hidden group">
              <CardHeader className={cn(
                "pb-4 border-b border-dashed",
                room.status === 'occupied' ? "bg-red-50" : room.status === 'cleaning' ? "bg-amber-50" : "bg-emerald-50"
              )}>
                <div className="flex justify-between items-center">
                  <Badge variant="outline" className="font-black text-[9px] uppercase border-none bg-white/50">{room.id}</Badge>
                  <div className={cn(
                    "size-2 rounded-full animate-pulse",
                    room.status === 'occupied' ? "bg-red-500" : room.status === 'cleaning' ? "bg-amber-500" : "bg-emerald-500"
                  )} />
                </div>
                <CardTitle className="text-sm font-black text-primary uppercase mt-3">{room.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Profissional</p>
                  <p className="text-xs font-bold text-primary">{room.doctor}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Paciente</p>
                  <p className="text-xs font-bold text-primary">{room.patient}</p>
                </div>
                <Button variant="ghost" className="w-full text-[9px] font-black uppercase text-primary bg-slate-50 group-hover:bg-primary group-hover:text-white transition-all h-9">
                  Chamar Próximo
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="billing" className="mt-8">
          <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
            <CardHeader className="bg-primary/5 border-b py-6">
              <CardTitle className="text-lg font-black text-primary uppercase">Faturamento de Prestadores</CardTitle>
              <CardDescription className="text-xs font-bold uppercase opacity-60">Consolidação de exames realizados na rede credenciada.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase py-4 pl-8">Prestador</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-center">Exames</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Valor Total</TableHead>
                    <TableHead className="text-[10px] font-black uppercase text-center">Status Fatura</TableHead>
                    <TableHead className="text-right pr-8"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerBilling.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-8 font-bold text-xs uppercase text-primary">{item.provider}</TableCell>
                      <TableCell className="text-center font-bold text-xs">{item.exams}</TableCell>
                      <TableCell className="font-black text-xs text-primary">{item.total}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn(
                          "text-[8px] font-black uppercase border-none px-3",
                          item.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        )}>
                          {item.status === 'paid' ? 'Liquidado' : 'Aguardando'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="size-4" /></Button>
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

function KpiCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm bg-white hover:ring-2 ring-primary/5 transition-all rounded-2xl">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
          <div className={cn("p-2 rounded-lg bg-slate-50", color)}>
            <Icon className="size-4" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-primary leading-none">{value}</h2>
      </CardContent>
    </Card>
  )
}
