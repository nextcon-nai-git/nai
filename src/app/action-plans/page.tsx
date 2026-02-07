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
  Activity
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
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
  const [taskForm, setTaskForm] = React.useState<Partial<OpsTask>>({
    title: "",
    companyName: "",
    type: "pgr",
    priority: "medium",
    status: "todo",
    dueDate: new Date().toISOString()
  })

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "tasks"), orderBy("dueDate", "asc"))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection<OpsTask>(tasksQuery)

  const handleCreateTask = () => {
    if (!user || !db || !taskForm.title) return
    const colRef = collection(db, "clients", user.uid, "tasks")
    
    const newTask: Partial<OpsTask> = {
      ...taskForm,
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
      {/* Dashboard de Operações Estratégicas */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl text-accent shadow-lg shadow-primary/20">
              <Activity className="size-6" />
            </div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tight font-headline">Operations OS</h1>
          </div>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Brain className="size-4 text-accent" /> IA preditiva monitorando 24/7 os riscos de vida e compliance.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass-panel p-1 rounded-2xl flex">
            <ViewToggle active={activeView === 'board'} onClick={() => setActiveView('board')} icon={LayoutGrid} label="Ops Board" />
            <ViewToggle active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={CalendarIcon} label="Scheduler" />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-nextcon hover:opacity-90 text-white gap-2 h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 rounded-2xl">
                <Plus className="size-5" /> Iniciar Intervenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel border-none rounded-[2.5rem] p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-primary uppercase font-headline">Nova Ação Técnica</DialogTitle>
                <DialogDescription className="font-bold text-[10px] uppercase tracking-[0.2em] text-accent">Inteligência Ocupacional Nextcon</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Descrição da Operação</label>
                  <Input 
                    value={taskForm.title} 
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})} 
                    className="bg-slate-50 border-none h-14 text-sm font-bold rounded-2xl shadow-inner"
                    placeholder="Ex: Renovação PGR - Unidade Master"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vertical</label>
                    <Select value={taskForm.type} onValueChange={v => setTaskForm({...taskForm, type: v as TaskType})}>
                      <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pgr">Engenharia / PGR</SelectItem>
                        <SelectItem value="pcmso">Saúde / PCMSO</SelectItem>
                        <SelectItem value="esocial">eSocial / S-2240</SelectItem>
                        <SelectItem value="treinamento">Capacitação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Criticidade</label>
                    <Select value={taskForm.priority} onValueChange={v => setTaskForm({...taskForm, priority: v as Priority})}>
                      <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Crítica</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Preventiva</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleCreateTask} className="w-full h-16 gradient-nextcon font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl">
                <Sparkles className="size-5 text-accent mr-2" /> Ativar Fluxo de Conformidade
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Visão de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Tasks em Aberto" value={tasks?.filter(t => t.status !== 'done').length || 0} icon={Activity} color="text-blue-600" />
        <StatCard label="Score Médio de Risco" value="12%" icon={Brain} color="text-accent" />
        <StatCard label="Compliance eSocial" value="98.4%" icon={ShieldCheck} color="text-primary" />
      </div>

      {/* Kanban Engine */}
      <div className="min-h-[600px] glass-panel rounded-[3rem] p-8">
         <KanbanBoard tasks={tasks || []} />
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: any) {
  return (
    <Card className="glass-panel border-none p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
          <h3 className="text-3xl font-black text-primary font-headline">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-2xl bg-white/50", color)}>
          <Icon className="size-6" />
        </div>
      </div>
    </Card>
  )
}

function ViewToggle({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={onClick}
      className={cn(
        "rounded-xl gap-2 text-[9px] font-black uppercase tracking-widest px-6 h-11 transition-all",
        active ? "bg-primary text-white shadow-xl" : "text-slate-400 hover:bg-slate-100"
      )}
    >
      <Icon className="size-4" /> {label}
    </Button>
  )
}
