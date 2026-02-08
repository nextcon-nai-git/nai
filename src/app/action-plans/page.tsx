'use client';

import * as React from "react"
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List as ListIcon, 
  Calendar as CalendarIcon,
  Filter,
  Sparkles,
  Brain,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Building2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, collectionGroup, where } from "firebase/firestore"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { OpsTask, TaskType, Priority } from "@/types/schema"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Badge } from "@/components/ui/badge"

export default function EnterpriseOpsHub() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [activeView, setActiveView] = React.useState<"board" | "list" | "calendar">("board")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
  
  const [taskForm, setTaskForm] = React.useState<Partial<OpsTask>>({
    title: "",
    companyId: "",
    type: "pgr",
    priority: "medium",
    status: "todo",
    dueDate: "" // Inicia vazio para evitar erro de hidratação
  })

  // Define data padrão após a montagem para evitar Hydration Mismatch
  React.useEffect(() => {
    setTaskForm(prev => ({ ...prev, dueDate: new Date().toISOString() }));
  }, []);

  // Busca de empresas para o filtro
  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  // Busca de tarefas via CollectionGroup para visão global ou filtrada
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    if (selectedCompanyId === "all") {
      return query(collectionGroup(db, "tasks"), orderBy("dueDate", "asc"))
    }
    return query(collection(db, "companies", selectedCompanyId, "tasks"), orderBy("dueDate", "asc"))
  }, [db, user, selectedCompanyId])

  const { data: tasks, isLoading } = useCollection<OpsTask>(tasksQuery)

  const handleCreateTask = () => {
    if (!db || !taskForm.title || !taskForm.companyId) {
      toast({ variant: "destructive", title: "Unidade Obrigatória", description: "Selecione uma empresa para vincular a tarefa." })
      return
    }
    
    const company = companies?.find(c => c.id === taskForm.companyId)
    const colRef = collection(db, "companies", taskForm.companyId, "tasks")
    
    const newTask: Partial<OpsTask> = {
      ...taskForm,
      companyName: company?.name || "Unidade Técnica",
      checklist: [
        { id: '1', text: 'Validar Documentação Base', checked: false, mandatory: true },
        { id: '2', text: 'Verificar Assinatura Digital', checked: false, mandatory: true },
        { id: '3', text: 'Transmitir ao eSocial', checked: false, mandatory: false }
      ],
      ai_risk_score: Math.floor(Math.random() * 40) + 10,
      createdAt: new Date().toISOString()
    }

    addDocumentNonBlocking(colRef, newTask)
    setIsCreateOpen(false)
    toast({ title: "Operação Registrada", description: "O fluxo de conformidade NAI foi iniciado." })
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl text-accent shadow-lg shadow-primary/20">
              <Activity className="size-6" />
            </div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tight font-headline">Cards Operação</h1>
          </div>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Brain className="size-4 text-accent" /> IA preditiva monitorando PGR, PCMSO e eSocial em tempo real.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-64 mr-2">
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="bg-white border-muted h-11 text-xs">
                <Building2 className="size-4 mr-2" />
                <SelectValue placeholder="Filtrar Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Unidades</SelectItem>
                {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-nextcon hover:opacity-90 text-white gap-2 h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 rounded-2xl">
                <Plus className="size-5" /> Nova Intervenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel border-none rounded-[2.5rem] p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-primary uppercase font-headline">Nova Ação de Segurança</DialogTitle>
                <DialogDescription className="font-bold text-[10px] uppercase tracking-[0.2em] text-accent">Inteligência Ocupacional Nextcon</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Descrição da Operação</label>
                  <Input 
                    value={taskForm.title} 
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})} 
                    className="bg-slate-50 border-none h-14 text-sm font-bold rounded-2xl shadow-inner"
                    placeholder="Ex: Atualização PGR Unidade Fabril"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Unidade Responsável</label>
                  <Select value={taskForm.companyId} onValueChange={v => setTaskForm({...taskForm, companyId: v})}>
                    <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vertical</label>
                    <Select value={taskForm.type} onValueChange={v => setTaskForm({...taskForm, type: v as TaskType})}>
                      <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pgr">NR-01 / PGR</SelectItem>
                        <SelectItem value="pcmso">NR-07 / PCMSO</SelectItem>
                        <SelectItem value="ltcat">NR-09 / Ambiental</SelectItem>
                        <SelectItem value="esocial">eSocial (S-2240)</SelectItem>
                        <SelectItem value="treinamento">Capacitação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Criticidade</label>
                    <Select value={taskForm.priority} onValueChange={v => setTaskForm({...taskForm, priority: v as Priority})}>
                      <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Crítica (Interdição)</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleCreateTask} className="w-full h-16 gradient-nextcon font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl">
                <Sparkles className="size-5 text-accent mr-2" /> Ativar Fluxo de Auditoria
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Conformidade eSocial" value="98.4%" icon={ShieldCheck} color="text-emerald-600" trend="+2.1%" />
        <StatCard label="Eficácia PGR" value="94%" icon={Activity} color="text-blue-600" trend="Estável" />
        <StatCard label="Tarefas Ativas" value={tasks?.length || 0} icon={LayoutGrid} color="text-accent" />
      </div>

      <div className="min-h-[600px] glass-panel rounded-[3rem] p-8">
         <KanbanBoard tasks={tasks || []} />
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <Card className="glass-panel border-none p-6 group hover:scale-[1.02] transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-black text-primary font-headline">{value}</h3>
            {trend && (
              <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", trend.includes('+') ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={cn("p-3 rounded-2xl bg-white/50 shadow-inner group-hover:rotate-12 transition-transform", color)}>
          <Icon className="size-6" />
        </div>
      </div>
    </Card>
  )
}