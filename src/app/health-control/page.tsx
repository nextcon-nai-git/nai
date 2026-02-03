
"use client"

import * as React from "react"
import { HeartPulse, Clock, FileWarning } from "lucide-react"
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

const upcomingExams = [
  { id: 1, name: "João Silva", type: "Periódico", date: "15/05/2024", status: "Pendente", result: "N/A" },
  { id: 2, name: "Maria Oliveira", type: "Retorno ao Trabalho", date: "18/05/2024", status: "Agendado", result: "N/A" },
  { id: 3, name: "Carlos Santos", type: "Admissional", date: "10/05/2024", status: "Atrasado", result: "Inapto" },
  { id: 4, name: "Ana Costa", type: "Periódico", date: "22/05/2024", status: "Agendado", result: "N/A" },
]

export default function HealthControl() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Controle de Saúde (PCMSO)</h1>
          <p className="text-muted-foreground">Vigilância médica e saúde ocupacional conforme NR-07.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Clock className="size-4" /> Histórico</Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2"><HeartPulse className="size-4" /> Novo ASO</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Calendário de Exames</CardTitle>
            <CardDescription>Exames de saúde ocupacional agendados</CardDescription>
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
          <CardHeader>
            <CardTitle className="text-lg">Alertas Ativos</CardTitle>
            <CardDescription>Status críticos e resultados que requerem ação</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <FileWarning className="size-6 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-900">Crítico: Colaborador Inapto Identificado</p>
                  <p className="text-xs text-red-700">Carlos Santos foi marcado como Inapto para as funções atuais. Revisão imediata necessária.</p>
                </div>
                <Button variant="outline" size="sm" className="bg-white">Revisar Caso</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Tipo de Exame</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingExams.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell className="font-medium">{exam.name}</TableCell>
                      <TableCell>{exam.type}</TableCell>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={exam.status === 'Atrasado' ? 'destructive' : 'secondary'}
                          className={exam.status === 'Agendado' ? 'bg-primary text-white' : ''}
                        >
                          {exam.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-none">
        <CardHeader>
          <CardTitle className="text-lg">Sugestões de Saúde Ocupacional</CardTitle>
          <CardDescription>Ajustes baseados no histórico médico e riscos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-secondary/10 rounded-xl border border-secondary/20">
              <p className="text-xs font-bold text-primary uppercase mb-2">Sugestão PCMSO</p>
              <p className="text-sm text-primary/80">Reduzir intervalo de exame periódico para o cargo "Soldador" de 12 para 6 meses devido a relatos de sensibilidade a fumos.</p>
            </div>
            <div className="p-4 bg-accent/10 rounded-xl border border-accent/20">
              <p className="text-xs font-bold text-accent uppercase mb-2">Score de Presença</p>
              <p className="text-sm text-accent/80">98.5% dos exames realizados dentro do prazo legal neste trimestre. Tendência de alta.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-xs font-bold text-green-700 uppercase mb-2">Prevenção</p>
              <p className="text-sm text-green-600">O monitoramento proativo reduziu afastamentos por doenças ocupacionais em 12% ano a ano.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
