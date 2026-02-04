"use client"

import * as React from "react"
import { HeartPulse, Clock, FileWarning, Loader2, Search, User, Stethoscope, Calendar as CalendarIcon, TrendingUp, AlertCircle, Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

export default function HealthControl() {
  const { user } = useUser()
  const db = useFirestore()
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = React.useState("")

  const examsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "clients", user.uid, "medicalExams"),
      orderBy("date", "desc")
    )
  }, [db, user])

  const { data: exams, isLoading } = useCollection(examsQuery)

  const upcomingAlerts = [
    { company: "LAVIERS ARTIGOS MASCULINOS", id: "#1164165", date: "10/01/2026", type: "Exame Clínico" },
    { company: "LAVIERS ARTIGOS MASCULINOS", id: "#1164165", date: "01/01/2026", type: "ASO" },
    { company: "NXC SST EMPRESARIAL LTDA", id: "#1005519", date: "30/01/2026", type: "Periódico" },
    { company: "INCORPORADORA GRAN-PARA LTDA", id: "#1177322", date: "01/01/2026", type: "Exame Geral" },
  ]

  const inaptoCount = exams?.filter(e => e.result?.toLowerCase() === 'inapto' || e.result?.toLowerCase() === 'pendente').length || 0
  const totalCompliance = exams ? Math.round(((exams.length - inaptoCount) / exams.length) * 100) : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#090e24] tracking-tight">Vigilância Médica (NR-07)</h1>
          <p className="text-muted-foreground">Monitoramento de aptidão e gestão de saúde ocupacional integrada.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#f59e0b] text-[#090e24] hover:bg-[#f59e0b]/90 gap-2 h-11 px-6 shadow-lg">
            <HeartPulse className="size-4" /> Lançar ASO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-[#090e24] text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-[#f59e0b] flex items-center gap-2">
                <Bell className="size-4" /> Vencimentos Iminentes 2026
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingAlerts.map((alert, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-[9px] font-black text-white truncate max-w-[150px]">{alert.company}</p>
                    <Badge className="bg-[#f59e0b] text-[#090e24] text-[8px] px-1.5 h-4 font-black">{alert.date}</Badge>
                  </div>
                  <p className="text-[10px] text-white/60 font-medium">{alert.type} {alert.id}</p>
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
              <CardTitle className="text-lg font-bold text-[#090e24]">Dossiê de Exames</CardTitle>
              <CardDescription>Eventos S-2220 e conformidade NR-07</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold">Colaborador / Empresa</TableHead>
                  <TableHead className="font-bold">Natureza</TableHead>
                  <TableHead className="font-bold">Data</TableHead>
                  <TableHead className="text-right font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-20 text-[#090e24]/40 font-bold uppercase text-xs">
                      Consultando PCMSO...
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {upcomingAlerts.map((alert, i) => (
                      <TableRow key={`mock-${i}`} className="group hover:bg-gray-50 bg-amber-50/20">
                        <TableCell>
                          <p className="font-bold text-[#090e24] text-xs">{alert.company}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-black">{alert.id}</p>
                        </TableCell>
                        <TableCell className="text-xs font-medium">{alert.type}</TableCell>
                        <TableCell className="text-xs font-bold text-[#090e24]">{alert.date}</TableCell>
                        <TableCell className="text-right">
                          <Badge className="bg-[#f59e0b] text-[#090e24] text-[9px] font-black uppercase">A VENCER</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {exams?.slice(0, 8).map((exam) => (
                      <TableRow key={exam.id} className="group hover:bg-gray-50 transition-all">
                        <TableCell>
                          <p className="font-bold text-[#090e24]">{exam.employeeId}</p>
                          <p className="text-[8px] text-muted-foreground uppercase font-black">ID: {exam.id.substring(0, 8)}</p>
                        </TableCell>
                        <TableCell className="text-xs">{exam.type}</TableCell>
                        <TableCell className="text-xs">{exam.date ? new Date(exam.date).toLocaleDateString('pt-BR') : "---"}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={exam.result?.toLowerCase() === 'apto' ? "bg-emerald-600" : "bg-red-600"}>
                            {exam.result || "Pendente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
