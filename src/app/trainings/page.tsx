
"use client"

import * as React from "react"
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Plus, 
  Download, 
  ChevronRight,
  HardHat,
  Brain,
  Building2,
  MoreHorizontal,
  Loader2,
  FileText
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, collectionGroup } from "firebase/firestore"
import { REAL_TRAININGS } from "@/lib/real-data"
import { cn } from "@/lib/utils"

export default function TrainingDashboard() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")

  // Em um ambiente real, buscaríamos do Firestore via useCollection. 
  // Para este MVP, vamos usar os dados simulados que injetamos na lib.
  const trainings = REAL_TRAININGS;

  const totalStudents = trainings.reduce((acc, curr) => acc + curr.students.length, 0);
  const completedHours = trainings.reduce((acc, curr) => acc + (curr.status === 'completed' ? curr.totalHours : 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Academia NRs & Engenharia</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Gestão de capacitação técnica, treinamentos presenciais e EAD.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-primary text-primary h-11 px-6">
            <Download className="size-4" /> Relatório MEC
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-white gap-2 h-11 px-6 shadow-lg font-bold">
            <Plus className="size-4" /> Novo Treinamento
          </Button>
        </div>
      </header>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard label="Alunos Ativos" value={totalStudents} icon={Users} color="text-blue-600" />
        <KpiCard label="Horas de Instrução" value={`${completedHours}h`} icon={Clock} color="text-emerald-600" />
        <KpiCard label="Nativa Empreendimentos" value="40h / 5 Dias" icon={HardHat} color="text-orange-600" />
        <KpiCard label="Conformidade NR" value="96%" icon={CheckCircle2} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visualização Linha do Tempo (Gantt-like) */}
        <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-primary uppercase">Cronograma de Capacitação</CardTitle>
                <CardDescription>Escopo: NR 18, 35, 11, 12 e Riscos Psicossociais.</CardDescription>
              </div>
              <Badge className="bg-primary text-white">Fev 2026</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8">
              {trainings.map((trn) => (
                <div key={trn.id} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="font-black text-primary uppercase text-sm">{trn.title}</h3>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase flex items-center gap-1">
                        <Building2 className="size-3" /> {trn.companyName}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] border-accent text-accent font-black">EM CURSO</Badge>
                  </div>
                  
                  {/* Visualização de Dias (Gantt Simulado) */}
                  <div className="grid grid-cols-5 gap-2 h-16">
                    {['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map((day, i) => (
                      <div key={day} className="flex flex-col gap-1">
                        <div className={cn(
                          "flex-1 rounded-lg border-2 border-dashed flex items-center justify-center transition-all",
                          i < 3 ? "bg-accent/10 border-accent/20 text-accent font-black" : "bg-muted/30 border-muted text-muted-foreground opacity-40"
                        )}>
                          {i < 3 ? <CheckCircle2 className="size-4" /> : <Calendar className="size-4" />}
                        </div>
                        <span className="text-[9px] font-black uppercase text-center text-slate-400">{day}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-3">
                      {trn.nrs.map(nr => (
                        <Badge key={nr} variant="secondary" className="text-[8px] font-black uppercase bg-primary/5 text-primary border-none">{nr}</Badge>
                      ))}
                    </div>
                    <p className="text-[10px] font-black text-primary/40 uppercase">Total: {trn.totalHours} Horas Presenciais</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Participantes da Nativa */}
        <Card className="border-none shadow-xl bg-white flex flex-col overflow-hidden">
          <CardHeader className="bg-[#090e24] text-white">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Users className="size-4 text-accent" /> Alunos Matriculados
            </CardTitle>
            <CardDescription className="text-white/50 text-[10px] uppercase">Filtro: Nativa Empreendimentos</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto max-h-[500px]">
            <div className="divide-y">
              {trainings[0].students.map((student) => (
                <div key={student.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/5 flex items-center justify-center text-primary font-black text-[10px]">
                      {student.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary">{student.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black">Trabalhador Construção Civil</p>
                    </div>
                  </div>
                  <Badge className={cn(
                    "text-[8px] font-black uppercase border-none",
                    student.status === 'certified' ? "bg-emerald-100 text-emerald-700" :
                    student.status === 'present' ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {student.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-4 bg-slate-50 border-t mt-auto">
            <Button className="w-full h-12 bg-primary text-white font-black uppercase text-[10px] tracking-widest gap-2">
              <FileText className="size-4" /> Gerar Certificados em Lote
            </Button>
          </div>
        </Card>
      </div>

      {/* Lista Geral de Treinamentos */}
      <Card className="border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="text-lg font-bold text-primary uppercase">Histórico de Turmas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase py-4">Treinamento / Unidade</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Período</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Carga Horária</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Alunos</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((trn) => (
                <TableRow key={trn.id} className="hover:bg-slate-50">
                  <TableCell>
                    <div>
                      <p className="font-bold text-primary text-xs uppercase">{trn.title}</p>
                      <p className="text-[9px] text-muted-foreground font-black uppercase">{trn.companyName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {new Date(trn.startDate).toLocaleDateString('pt-BR')} - {new Date(trn.endDate).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-black uppercase">{trn.totalHours}h ({trn.modality})</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="size-3 text-muted-foreground" />
                      <span className="text-xs font-bold text-primary">{trn.students.length} Participantes</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase border-none",
                      trn.status === 'completed' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {trn.status === 'completed' ? 'Concluído' : 'Em Andamento'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="border-none shadow-sm bg-white hover:ring-2 ring-primary/5 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{label}</p>
          <Icon className={cn("size-4", color)} />
        </div>
        <h2 className="text-2xl font-black text-primary">{value}</h2>
      </CardContent>
    </Card>
  )
}
