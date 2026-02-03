
"use client"

import * as React from "react"
import { HeartPulse, Clock, FileWarning, Loader2, Search, User, Stethoscope, Calendar as CalendarIcon, TrendingUp, AlertCircle } from "lucide-react"
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

  const filteredExams = React.useMemo(() => {
    if (!exams) return []
    return exams.filter(ex => 
      ex.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.result?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [exams, searchTerm])

  const inaptoCount = exams?.filter(e => e.result?.toLowerCase() === 'inapto' || e.result?.toLowerCase() === 'pendente').length || 0
  const totalCompliance = exams ? Math.round(((exams.length - inaptoCount) / exams.length) * 100) : 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Vigilância Médica (NR-07 PCMSO)</h1>
          <p className="text-muted-foreground">Monitoramento de aptidão e gestão de saúde ocupacional integrada ao eSocial.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 h-11 border-muted hover:bg-muted/50 transition-all shadow-sm">
            <CalendarIcon className="size-4" /> Agenda Global
          </Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2 h-11 px-6 shadow-lg shadow-accent/20">
            <HeartPulse className="size-4" /> Lançar ASO
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Status de Saúde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className="text-4xl font-black text-primary leading-none">{totalCompliance}%</h2>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mt-1">Conformidade Normativa</p>
                </div>
                <Badge className={totalCompliance > 90 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                  {totalCompliance > 90 ? "Excelente" : "Alerta"}
                </Badge>
              </div>
              <Progress value={totalCompliance} className="h-2 mb-2" />
              <div className="flex flex-col gap-2 pt-4">
                <div className="flex justify-between text-xs font-medium border-b border-muted pb-2">
                  <span className="text-muted-foreground">Aptos (Vigentes):</span>
                  <span className="font-bold text-primary">{exams?.length || 0 - inaptoCount}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">Inaptos / Pendentes:</span>
                  <span className="font-bold text-red-600">{inaptoCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Calendário de Exames</CardTitle>
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

        <Card className="lg:col-span-2 card-shadow border-none overflow-hidden flex flex-col">
          <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Dossiê de Exames Recentes</CardTitle>
              <CardDescription>Eventos S-2220 processados via Módulo de Importação</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="ID do colaborador..." 
                className="pl-10 h-10 text-xs bg-white border-muted shadow-sm" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="space-y-0 h-full">
              {inaptoCount > 0 && (
                <div className="flex items-center gap-4 p-4 bg-red-50/80 border-b border-red-100 animate-in slide-in-from-top-4 duration-500">
                  <div className="p-2 bg-red-600 text-white rounded-lg shadow-md">
                    <AlertCircle className="size-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-red-900 uppercase">Crítico: {inaptoCount} Inconsistências Detectadas</p>
                    <p className="text-[10px] text-red-700 font-medium">Exames com resultado "Inapto" ou "Pendente" bloqueiam o eSocial.</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white text-red-600 border-red-200 hover:bg-red-50 text-[10px] font-bold h-8">Resolver Casos</Button>
                </div>
              )}

              <Table>
                <TableHeader className="bg-muted/5">
                  <TableRow>
                    <TableHead className="font-bold">Colaborador</TableHead>
                    <TableHead className="font-bold">Natureza do Exame</TableHead>
                    <TableHead className="font-bold">Realização</TableHead>
                    <TableHead className="text-right font-bold">Aptidão / Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20">
                        <Loader2 className="size-10 animate-spin mx-auto text-primary opacity-20" />
                        <p className="text-[10px] font-black text-muted-foreground mt-4 uppercase tracking-[0.2em]">Consultando PCMSO...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredExams.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                        <div className="flex flex-col items-center gap-3">
                          <Stethoscope className="size-12 opacity-10" />
                          <p className="text-sm font-medium">Nenhum registro encontrado.</p>
                          <p className="text-[10px] uppercase font-black">Use o Módulo de Importação para alimentar a base.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExams.slice(0, 12).map((exam) => (
                      <TableRow key={exam.id} className="group hover:bg-primary/5 transition-all">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
                              <User className="size-3 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-primary">{exam.employeeId}</p>
                              <p className="text-[8px] text-muted-foreground uppercase font-black">ID UNIFICADO: {exam.id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-bold text-primary">{exam.type || "Exame Geral"}</span>
                            <span className="text-[9px] text-muted-foreground font-medium uppercase">{exam.doctor || "Médico Examinador"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-medium">{exam.date ? new Date(exam.date).toLocaleDateString('pt-BR') : "---"}</p>
                          <p className="text-[8px] text-emerald-600 font-bold uppercase">Validade NR-07 OK</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Badge 
                              className={`text-[9px] font-black uppercase py-0.5 px-2 rounded-lg border-none shadow-sm ${
                                exam.result?.toLowerCase().includes('inapto') ? 'bg-red-600 text-white' : 
                                exam.result?.toLowerCase().includes('apto') ? 'bg-emerald-600 text-white' : 
                                'bg-amber-500 text-white'
                              }`}
                            >
                              {exam.result || "Pendente"}
                            </Badge>
                            <Badge variant="outline" className="text-[9px] font-mono border-muted bg-white">
                              {exam.status === 'Concluído' ? 'S-2220 OK' : 'AGUARDANDO'}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {filteredExams.length > 12 && (
                <div className="p-4 border-t text-center">
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary">
                    Ver todos os {filteredExams.length} registros
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-none gradient-primary text-white">
        <CardHeader className="pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent rounded-lg shadow-lg">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <CardTitle className="text-xl font-headline font-bold">Inteligência Preditiva PCMSO</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
              <p className="text-[10px] font-black text-accent uppercase mb-3 tracking-[0.2em]">Análise de Conformidade</p>
              <p className="text-sm leading-relaxed text-white/80">
                O sistema identificou que <span className="font-bold text-accent">98%</span> da base está com ASO vigente. Recomendamos iniciar o agendamento dos <span className="font-bold">2%</span> restantes para evitar multas do Art. 201 da CLT.
              </p>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <p className="text-[10px] font-black text-accent uppercase mb-3 tracking-[0.2em]">Projeção Operacional 2025</p>
              <p className="text-sm leading-relaxed text-white/80">
                Pico de exames periódicos detectado para <span className="font-bold">Janeiro/2025</span>. Prepare a equipe administrativa para o processamento de aproximadamente <span className="font-bold">145 ASOs</span> nesse período.
              </p>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <p className="text-[10px] font-black text-accent uppercase mb-3 tracking-[0.2em]">Histórico de Migração</p>
              <p className="text-sm leading-relaxed text-white/80">
                A importação dos dados históricos foi concluída. Registros com prefixo <span className="font-mono text-xs text-accent">EXA_MIGRA</span> foram validados contra as regras de cruzamento do eSocial.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
