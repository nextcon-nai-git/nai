
"use client"

import * as React from "react"
import { 
  Plus, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Filter,
  Search,
  Trash2,
  Edit3,
  X,
  Calendar as CalendarIcon,
  LayoutGrid,
  Map as MapIcon,
  List as ListIcon,
  ChevronRight,
  ChevronLeft,
  Building2,
  ShieldAlert,
  ArrowUpRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc, deleteDoc } from "firebase/firestore"
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

interface ActionTask {
  id: string
  title: string
  description?: string
  category: string
  priority: 'Alta' | 'Média' | 'Baixa'
  status: 'ParaFazer' | 'EmAndamento' | 'Concluido'
  deadline: string
  unit?: string
  createdAt: string
}

export default function ActionPlans() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  // Estados de UI
  const [activeView, setActiveTab] = React.useState("board")
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [overColumnId, setOverColumnId] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("all")
  
  // Calendário
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  // Estados de Modais
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<ActionTask | null>(null)

  // Estado de Nova/Edição de Tarefa
  const [taskForm, setTaskForm] = React.useState<Partial<ActionTask>>({
    title: "",
    description: "",
    category: "PGR",
    priority: "Média",
    deadline: format(new Date(), 'yyyy-MM-dd'),
    unit: ""
  })

  // Queries
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "tasks"), orderBy("deadline", "asc"))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection<ActionTask>(tasksQuery)

  const columns = [
    { id: "ParaFazer", label: "Backlog / Planejado", color: "border-slate-200 bg-slate-50/50" },
    { id: "EmAndamento", label: "Em Execução", color: "border-blue-100 bg-blue-50/30" },
    { id: "Concluido", label: "Entrega / Concluído", color: "border-emerald-100 bg-emerald-50/30" }
  ]

  // Handlers de Drag and Drop
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.setData("text/plain", id)
  }

  const onDragEnd = () => {
    setDraggedId(null)
    setOverColumnId(null)
  }

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (!user || !db) return
    
    const taskRef = doc(db, "clients", user.uid, "tasks", id)
    updateDocumentNonBlocking(taskRef, { status: newStatus })
    
    toast({
      title: "Fluxo Atualizado",
      description: `Tarefa movida para ${newStatus}.`,
    })
  }

  // Operações de Dados
  const handleCreateTask = () => {
    if (!user || !db || !taskForm.title) return
    const colRef = collection(db, "clients", user.uid, "tasks")
    addDocumentNonBlocking(colRef, {
      ...taskForm,
      status: "ParaFazer",
      createdAt: new Date().toISOString()
    })
    setIsCreateOpen(false)
    setTaskForm({ title: "", description: "", category: "PGR", priority: "Média", deadline: format(new Date(), 'yyyy-MM-dd'), unit: "" })
  }

  const handleEditTask = (task: ActionTask) => {
    setSelectedTask(task)
    setTaskForm({ ...task })
    setIsEditOpen(true)
  }

  const handleUpdateTask = () => {
    if (!user || !db || !selectedTask) return
    const taskRef = doc(db, "clients", user.uid, "tasks", selectedTask.id)
    updateDocumentNonBlocking(taskRef, { ...taskForm })
    setIsEditOpen(false)
    setSelectedTask(null)
  }

  const handleDeleteTask = (id: string) => {
    if (!user || !db) return
    const taskRef = doc(db, "clients", user.uid, "tasks", id)
    deleteDocumentNonBlocking(taskRef)
    toast({ title: "Registro removido", variant: "destructive" })
  }

  // Filtragem
  const filteredTasks = React.useMemo(() => {
    if (!tasks) return []
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (t.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || t.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [tasks, searchTerm, filterCategory])

  // --- RENDERS ---

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-primary uppercase tracking-tight font-headline">Fluxo de Intervenções</h1>
          <p className="text-muted-foreground font-medium">Gestão unificada de Planos de Ação, Engenharia e Segurança.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-muted/50 p-1 rounded-xl flex">
            <Button 
              variant={activeView === 'board' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('board')}
              className="rounded-lg gap-2 text-xs font-bold"
            >
              <LayoutGrid className="size-4" /> Quadro
            </Button>
            <Button 
              variant={activeView === 'calendar' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('calendar')}
              className="rounded-lg gap-2 text-xs font-bold"
            >
              <CalendarIcon className="size-4" /> Calendário
            </Button>
            <Button 
              variant={activeView === 'map' ? 'default' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveTab('map')}
              className="rounded-lg gap-2 text-xs font-bold"
            >
              <MapIcon className="size-4" /> Mapa
            </Button>
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary/20">
                <Plus className="size-4" /> Nova Ação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Intervenção Técnica</DialogTitle>
                <DialogDescription>Cadastre uma nova ação corretiva ou preventiva.</DialogDescription>
              </DialogHeader>
              <TaskFormValues form={taskForm} onChange={setTaskForm} />
              <Button onClick={handleCreateTask} className="w-full bg-primary h-12 font-bold uppercase tracking-widest">Criar Cartão</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar intervenções..." 
            className="pl-10 h-11 bg-white border-none shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-56 h-11 bg-white border-none shadow-sm font-bold text-xs">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Todas as Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="PGR">PGR / Riscos</SelectItem>
            <SelectItem value="Treinamento">Treinamento NR</SelectItem>
            <SelectItem value="Obra">Obras / EPC</SelectItem>
            <SelectItem value="Saúde">Saúde / PCMSO</SelectItem>
            <SelectItem value="Vistoria">Vistoria Técnica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeView === 'board' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
          {columns.map((col) => (
            <div 
              key={col.id} 
              className={cn(
                "flex flex-col gap-4 p-4 rounded-3xl border-2 border-dashed transition-all duration-300",
                col.color,
                overColumnId === col.id ? "scale-[1.02] border-primary/40 bg-primary/5" : "border-transparent"
              )}
              onDragOver={(e) => {
                e.preventDefault()
                setOverColumnId(col.id)
              }}
              onDragLeave={() => setOverColumnId(null)}
              onDrop={(e) => onDrop(e, col.id)}
            >
              <div className="flex items-center justify-between px-2">
                <h3 className="font-black text-primary uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                  <div className={cn("size-2 rounded-full", 
                    col.id === 'Concluido' ? 'bg-accent' : 
                    col.id === 'EmAndamento' ? 'bg-blue-500' : 'bg-slate-400')} 
                  />
                  {col.label}
                </h3>
                <Badge variant="secondary" className="bg-white text-[10px] font-black border-none shadow-sm">
                  {filteredTasks.filter(a => (a.status || 'ParaFazer') === col.id).length}
                </Badge>
              </div>
              
              <div className="flex flex-col gap-4 flex-1">
                {isLoading ? (
                  <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-primary/20" /></div>
                ) : filteredTasks.filter(a => (a.status || 'ParaFazer') === col.id).length === 0 ? (
                  <div className="flex-1 rounded-2xl flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <ArrowUpRight className="size-10 mb-2" />
                    <p className="text-[10px] font-black uppercase">Arraste tarefas aqui</p>
                  </div>
                ) : filteredTasks.filter(a => (a.status || 'ParaFazer') === col.id).map((task) => (
                  <Card 
                    key={task.id} 
                    draggable
                    onDragStart={(e) => onDragStart(e, task.id)}
                    onDragEnd={onDragEnd}
                    className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all cursor-grab active:cursor-grabbing bg-white group relative overflow-hidden"
                  >
                    <div className={cn("absolute top-0 left-0 w-1 h-full", 
                      task.priority === 'Alta' ? 'bg-destructive' : 
                      task.priority === 'Média' ? 'bg-blue-500' : 'bg-accent'
                    )} />
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="text-[8px] font-black uppercase bg-slate-50 border-none px-2 h-5">
                          {task.category}
                        </Badge>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <Button variant="ghost" size="icon" className="size-7 rounded-lg" onClick={() => handleEditTask(task)}>
                            <Edit3 className="size-3 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-7 rounded-lg hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDeleteTask(task.id)}>
                            <Trash2 className="size-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs font-bold leading-tight text-primary uppercase">{task.title}</p>
                        {task.description && (
                          <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed italic">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {task.unit && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
                          <Building2 className="size-3" /> {task.unit}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-dashed">
                        <div className={cn(
                          "flex items-center gap-1.5 text-[9px] font-black uppercase",
                          isOverdue(task.deadline) && task.status !== 'Concluido' ? 'text-destructive animate-pulse' : 'text-slate-400'
                        )}>
                          <Clock className="size-3" />
                          {task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR') : '---'}
                        </div>
                        <Badge className={cn(
                          "text-[8px] font-black uppercase px-2 h-4 border-none",
                          task.priority === 'Alta' ? 'bg-destructive text-white' : 
                          task.priority === 'Baixa' ? 'bg-accent text-white' : 'bg-blue-500 text-white'
                        )}>
                          {task.priority}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeView === 'calendar' && (
        <Card className="card-shadow border-none bg-white p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-headline font-black text-primary uppercase">{format(currentMonth, 'MMMM yyyy', { locale: ptBR })}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="size-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}><ChevronRight className="size-4" /></Button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 border rounded-3xl overflow-hidden shadow-inner bg-slate-50/50">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
              <div key={d} className="p-4 text-center text-[10px] font-black uppercase text-slate-400 border-b bg-white">{d}</div>
            ))}
            {eachDayOfInterval({
              start: startOfMonth(currentMonth),
              end: endOfMonth(currentMonth)
            }).map((day, i) => {
              const dayTasks = tasks?.filter(t => isSameDay(new Date(t.deadline), day))
              return (
                <div key={i} className="min-h-[140px] p-2 border-r border-b bg-white group hover:bg-slate-50 transition-colors">
                  <span className={cn(
                    "text-[10px] font-bold p-1 rounded-md",
                    isSameDay(day, new Date()) ? "bg-primary text-white" : "text-slate-400"
                  )}>{format(day, 'd')}</span>
                  <div className="mt-2 space-y-1">
                    {dayTasks?.map(t => (
                      <div key={t.id} className={cn(
                        "text-[8px] p-1.5 rounded-lg font-bold truncate border flex items-center gap-1",
                        t.priority === 'Alta' ? 'bg-destructive/5 border-destructive/20 text-destructive' : 
                        t.status === 'Concluido' ? 'bg-accent/5 border-accent/20 text-accent' : 'bg-blue-50 border-blue-100 text-blue-600'
                      )}>
                        <div className="size-1 rounded-full bg-current shrink-0" />
                        {t.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {activeView === 'map' && (
        <Card className="card-shadow border-none bg-white overflow-hidden min-h-[600px] flex flex-col">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><MapIcon className="size-4 text-primary" /> Distribuição Geográfica de Ações</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative bg-slate-100 flex items-center justify-center">
            <div className="absolute inset-0 grayscale opacity-50 contrast-125">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14412.3456789!2d-49.2733!3d-25.4284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce41197ebad69%3A0x40169b40a335831!2sCuritiba%2C%20PR!5e0!3m2!1spt-BR!2sbr!4v123456789"
              />
            </div>
            <div className="relative z-10 p-8 bg-white/90 backdrop-blur-md rounded-[2.5rem] shadow-2xl border border-white max-w-sm text-center">
              <ShieldAlert className="size-12 mx-auto text-primary mb-4" />
              <h3 className="text-sm font-black uppercase text-primary mb-2 tracking-tight">Geolocalização Ativa</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed">
                As intervenções estão mapeadas nas unidades: <br/>
                {Array.from(new Set(tasks?.map(t => t.unit).filter(Boolean))).join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Intervenção</DialogTitle>
            <DialogDescription>Atualize os dados ou o progresso da ação técnica.</DialogDescription>
          </DialogHeader>
          <TaskFormValues form={taskForm} onChange={setTaskForm} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 font-bold uppercase text-[10px]" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTask} className="flex-1 bg-primary font-bold uppercase text-[10px] tracking-widest">Salvar Alterações</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskFormValues({ form, onChange }: { form: any, onChange: any }) {
  return (
    <div className="space-y-5 py-6">
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Título da Ação</label>
        <Input 
          value={form.title} 
          onChange={e => onChange({...form, title: e.target.value})} 
          placeholder="Ex: Treinamento NR-35 - Unidade Curitiba" 
          className="bg-slate-50 border-none h-12 text-sm font-bold shadow-inner"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Descrição Técnica</label>
        <Textarea 
          value={form.description} 
          onChange={e => onChange({...form, description: e.target.value})} 
          placeholder="Detalhes sobre a intervenção..." 
          className="bg-slate-50 border-none min-h-[100px] text-xs font-medium shadow-inner"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Categoria</label>
          <Select value={form.category} onValueChange={v => onChange({...form, category: v})}>
            <SelectTrigger className="bg-slate-50 border-none h-12 text-xs font-bold shadow-inner"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PGR">PGR / SESMT</SelectItem>
              <SelectItem value="Treinamento">Treinamento</SelectItem>
              <SelectItem value="Obra">Obras / EPC</SelectItem>
              <SelectItem value="Saúde">Saúde / PCMSO</SelectItem>
              <SelectItem value="Vistoria">Vistoria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Prioridade</label>
          <Select value={form.priority} onValueChange={v => onChange({...form, priority: v})}>
            <SelectTrigger className="bg-slate-50 border-none h-12 text-xs font-bold shadow-inner"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Alta">Crítica / Alta</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Baixa">Preventiva / Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Unidade / Local</label>
          <Input 
            value={form.unit} 
            onChange={e => onChange({...form, unit: e.target.value})} 
            placeholder="Ex: Matriz Curitiba" 
            className="bg-slate-50 border-none h-12 text-xs font-bold shadow-inner"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Prazo Final</label>
          <Input 
            type="date" 
            value={form.deadline} 
            onChange={e => onChange({...form, deadline: e.target.value})} 
            className="bg-slate-50 border-none h-12 text-xs font-bold shadow-inner"
          />
        </div>
      </div>
    </div>
  )
}

function isOverdue(dateStr: string) {
  if (!dateStr) return false
  const deadline = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return deadline < today
}
