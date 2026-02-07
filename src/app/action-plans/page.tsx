
"use client"

import * as React from "react"
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  Map as MapIcon, 
  List as ListIcon, 
  Calendar as CalendarIcon,
  Filter,
  Sparkles
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
import { SSTTask, TaskType, Priority } from "@/types/kanban"
import { KanbanBoard } from "@/components/kanban/kanban-board"

export default function ActionPlans() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  // View State
  const [activeView, setActiveView] = React.useState<"board" | "list" | "calendar" | "map">("board")
  const [searchTerm, setSearchTerm] = React.useState("")

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [taskForm, setTaskForm] = React.useState<Partial<SSTTask>>({
    title: "",
    company: "",
    type: "pgr",
    priority: "medium",
    status: "todo",
    dueDate: new Date()
  })

  // Data Fetching
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "tasks"), orderBy("dueDate", "asc"))
  }, [db, user])

  const { data: tasks } = useCollection<SSTTask>(tasksQuery)

  const handleCreateTask = () => {
    if (!user || !db || !taskForm.title) return
    const colRef = collection(db, "clients", user.uid, "tasks")
    addDocumentNonBlocking(colRef, {
      ...taskForm,
      dueDate: taskForm.dueDate?.toISOString(),
      createdAt: new Date().toISOString()
    })
    setIsCreateOpen(false)
    setTaskForm({ title: "", company: "", type: "pgr", priority: "medium", status: "todo", dueDate: new Date() })
    toast({ title: "Intervenção Criada", description: "A ação foi registrada no fluxo NAI." })
  }

  return (
    <div className="min-h-[calc(100vh-100px)] relative overflow-hidden flex flex-col">
      {/* Elementos de Fundo (NextCon Identity) */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-50 via-white to-transparent -z-10" />
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <main className="flex-1 flex flex-col gap-8">
        {/* Header Estratégico */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="size-2 bg-accent rounded-full animate-pulse" />
              <h1 className="text-3xl font-black text-primary uppercase tracking-tight font-headline">Fluxo de Intervenções</h1>
            </div>
            <p className="text-muted-foreground font-medium">Acompanhe laudos, treinamentos e eSocial em tempo real.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/50 backdrop-blur-sm p-1 rounded-xl flex shadow-sm border border-white">
              <ViewToggle active={activeView === 'board'} onClick={() => setActiveView('board')} icon={LayoutGrid} label="Quadro" />
              <ViewToggle active={activeView === 'list'} onClick={() => setActiveView('list')} icon={ListIcon} label="Lista" />
              <ViewToggle active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={CalendarIcon} label="Agenda" />
              <ViewToggle active={activeView === 'map'} onClick={() => setActiveView('map')} icon={MapIcon} label="Mapa" />
            </div>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-12 px-6 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20 rounded-xl">
                  <Plus className="size-4" /> Nova Intervenção
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-black text-primary uppercase">Nova Ação Técnica</DialogTitle>
                  <DialogDescription className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Cadastre demandas baseadas nas NRs 2026.</DialogDescription>
                </DialogHeader>
                <TaskFormValues form={taskForm} onChange={setTaskForm} />
                <Button onClick={handleCreateTask} className="w-full bg-primary h-14 font-black uppercase text-xs tracking-widest rounded-2xl shadow-lg">
                  <Sparkles className="size-4 text-accent" /> Cadastrar no Sistema
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Filtros e Busca */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-3.5 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Pesquisar intervenção, empresa ou unidade..." 
              className="pl-12 h-12 bg-white/80 backdrop-blur-md border-none shadow-sm rounded-2xl focus-visible:ring-primary/10 font-medium" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 rounded-2xl px-6 bg-white/80 border-none shadow-sm gap-2 font-bold text-xs uppercase text-primary">
            <Filter className="size-4" /> Filtros Avançados
          </Button>
        </div>

        {/* Área Principal - Kanban Board */}
        <div className="flex-1 min-h-0 bg-white/30 backdrop-blur-sm rounded-[2.5rem] border border-white p-6 shadow-inner">
           <KanbanBoard tasks={tasks || []} />
        </div>
      </main>
    </div>
  )
}

function TaskFormValues({ form, onChange }: { form: any, onChange: any }) {
  return (
    <div className="space-y-5 py-6">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Título da Intervenção</label>
        <Input 
          value={form.title} 
          onChange={e => onChange({...form, title: e.target.value})} 
          placeholder="Ex: Renovação de PGR - Unidade 01" 
          className="bg-slate-50 border-none h-12 text-sm font-bold rounded-xl"
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Empresa / Unidade</label>
        <Input 
          value={form.company} 
          onChange={e => onChange({...form, company: e.target.value})} 
          placeholder="Ex: Britânia Eletrodomésticos" 
          className="bg-slate-50 border-none h-12 text-sm font-bold rounded-xl"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Tipo de Ação</label>
          <Select value={form.type} onValueChange={v => onChange({...form, type: v as TaskType})}>
            <SelectTrigger className="bg-slate-50 border-none h-12 text-xs font-bold rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pgr">PGR / NR-01</SelectItem>
              <SelectItem value="treinamento">Treinamento</SelectItem>
              <SelectItem value="pcmso">Saúde / PCMSO</SelectItem>
              <SelectItem value="esocial">eSocial / S-2240</SelectItem>
              <SelectItem value="vistoria">Vistorias</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Prioridade</label>
          <Select value={form.priority} onValueChange={v => onChange({...form, priority: v as Priority})}>
            <SelectTrigger className="bg-slate-50 border-none h-12 text-xs font-bold rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Crítica</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Prazo Final</label>
        <Input 
          type="date" 
          value={form.dueDate ? format(new Date(form.dueDate), 'yyyy-MM-dd') : ''} 
          onChange={e => onChange({...form, dueDate: new Date(e.target.value)})} 
          className="bg-slate-50 border-none h-12 text-sm font-bold rounded-xl"
        />
      </div>
    </div>
  )
}

function ViewToggle({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <Button 
      variant={active ? 'default' : 'ghost'} 
      size="sm" 
      onClick={onClick}
      className={cn(
        "rounded-lg gap-2 text-[10px] font-black uppercase tracking-tighter px-4 h-9",
        active ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-primary/5"
      )}
    >
      <Icon className="size-3.5" /> {label}
    </Button>
  )
}
