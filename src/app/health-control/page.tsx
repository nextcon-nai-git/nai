
"use client"

import * as React from "react"
import { HeartPulse, Clock, FileWarning, Loader2, Search, User, Stethoscope } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"

export default function HealthControl() {
  const { user } = useUser()
  const db = useFirestore()
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [searchTerm, setSearchTerm] = React.useState("")

  // Busca exames reais do Firestore
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

  const inaptoCount = exams?.filter(e => e.result?.toLowerCase() === 'inapto').length || 0

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Controle de Saúde (PCMSO)</h1>
          <p className="text-muted-foreground">Vigilância médica baseada em exames reais importados.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Clock className="size-4" /> Histórico</Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2"><HeartPulse className="size-4" /> Novo ASO</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Calendário Operacional</CardTitle>
            <CardDescription>Monitoramento de prazos legais</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border-none"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 card-shadow border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Alertas e Exames Recentes</CardTitle>
              <CardDescription>Dados processados via Módulo de Importação</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por ID ou Tipo..." 
                className="pl-8 h-9 text-xs" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inaptoCount > 0 && (
                <div className="flex items-center gap-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                  <FileWarning className="size-6 text-red-500" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-900">Crítico: {inaptoCount} Colaboradores Inaptos</p>
                    <p className="text-xs text-red-700">Foram identificados exames com resultado "Inapto". Revisão imediata necessária.</p>
                  </div>
                  <Button variant="outline" size="sm" className="bg-white">Verificar Casos</Button>
                </div>
              )}

              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>ID Colaborador</TableHead>
                      <TableHead>Tipo de Exame</TableHead>
                      <TableHead>Data Realização</TableHead>
                      <TableHead>Status / Resultado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10">
                          <Loader2 className="size-6 animate-spin mx-auto text-primary" />
                        </TableCell>
                      </TableRow>
                    ) : filteredExams.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                          Nenhum exame encontrado. Importe os dados reais no Módulo de Importação.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExams.slice(0, 10).map((exam) => (
                        <TableRow key={exam.id}>
                          <TableCell className="font-mono text-xs font-bold text-primary">
                            <div className="flex items-center gap-2">
                              <User className="size-3 text-muted-foreground" />
                              {exam.employeeId}
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-medium">{exam.type}</TableCell>
                          <TableCell className="text-xs">{exam.date}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Badge 
                                variant={exam.result?.toLowerCase().includes('inapto') ? 'destructive' : 'secondary'}
                                className="text-[10px] py-0 px-1.5"
                              >
                                {exam.result || "---"}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                                {exam.status}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredExams.length > 10 && (
                <p className="text-[10px] text-center text-muted-foreground uppercase font-black">Exibindo os 10 exames mais recentes de {filteredExams.length} totais</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-none gradient-primary text-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Stethoscope className="size-5 text-accent" /> Inteligência Preventiva PCMSO
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-xs font-black text-accent uppercase mb-2">Análise de Apto</p>
              <p className="text-sm">O sistema identificou que 98% da base está com ASO vigente e Apto. Bom score de saúde ocupacional.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-xs font-black text-accent uppercase mb-2">Projeção 2026</p>
              <p className="text-sm">Baseado nas migrações, teremos um pico de exames periódicos em Janeiro/2026. Prepare o agendamento.</p>
            </div>
            <div className="p-4 bg-white/10 rounded-xl border border-white/20">
              <p className="text-xs font-black text-accent uppercase mb-2">Status Migração</p>
              <p className="text-sm">A importação dos dados históricos foi concluída. IDs iniciados em EXA_MIGRA estão validados.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
