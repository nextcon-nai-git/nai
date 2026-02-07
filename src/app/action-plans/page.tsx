
"use client"

import * as React from "react"
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Filter,
  Search,
  Trash2,
  Edit3,
  Calendar as CalendarIcon,
  LayoutGrid,
  Map as MapIcon,
  List as ListIcon,
  ChevronRight,
  ChevronLeft,
  Building2,
  ShieldAlert,
  MoreVertical,
  ArrowRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"

// DnD Kit Imports
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

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

const COLUMNS = [
  { id: "ParaFazer", label: "Planejado / Backlog", color: "bg-slate-400" },
  { id: "EmAndamento", label: "Em Execução", color: "bg-blue-500" },
  { id: "Concluido", label: "Finalizado / Entrega", color: "bg-emerald-500" }
]

export default function ActionPlans() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  // View State
  const [activeView, setActiveView] = React.useState<"board" | "list" | "calendar" | "map">("board")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("all")
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<ActionTask | null>(null)
  const [taskForm, setTaskForm] = React.useState<Partial<ActionTask>>({
    title: "",
    description: "",
    category: "PGR",
    priority: "Média",
    deadline: format(new Date(), 'yyyy-MM-dd'),
    unit: ""
  })

  // DnD State
  const [activeId, setActiveId] = React.useState<string | null>(null)

  // Data Fetching
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "tasks"), orderBy("deadline", "asc"))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection<ActionTask>(tasksQuery)

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Handlers
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id
    const overId = over.id

    // Check if dropped over a column or a task in a column
    let newStatus = overId
    if (!COLUMNS.find(c => c.id === overId)) {
      const overTask = tasks?.find(t => t.id === overId)
      if (overTask) newStatus = overTask.status
    }

    const task = tasks?.find(t => t.id === taskId)
    if (task && task.status !== newStatus) {
      const taskRef = doc(db!, "clients", user!.uid, "tasks", taskId)
      updateDocumentNonBlocking(taskRef, { status: newStatus })
      toast({ title: "Status Atualizado", description: `Movido para ${newStatus}` })
    }

    setActiveId(null)
  }

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
    toast({ title: "Removido", variant: "destructive" })
  }

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return []
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (t.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || t.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [tasks, searchTerm, filterCategory])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-primary uppercase tracking-tight font-headline">Fluxo de Intervenções</h1>
          <p className="text-muted-foreground font-medium">Gestão técnica de Planos de Ação e Engenharia.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-muted/50 p-1 rounded-xl flex shadow-inner">
            <ViewToggle active={activeView === 'board'} onClick={() => setActiveView('board')} icon={LayoutGrid} label="Quadro" />
            <ViewToggle active={activeView === 'list'} onClick={() => setActiveView('list')} icon={ListIcon} label="Lista" />
            <ViewToggle active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={CalendarIcon} label="Calendário" />
            <ViewToggle active={activeView === 'map'} onClick={() => setActiveView('map')} icon={MapIcon} label="Mapa" />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2 h-11 px-6 font-black uppercase text-[10px] tracking-widest shadow-xl">
                <Plus className="size-4" /> Nova Intervenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Ação Técnica</DialogTitle>
                <DialogDescription>Cadastre intervenções corretivas ou preventivas.</DialogDescription>
              </DialogHeader>
              <TaskFormValues form={taskForm} onChange={setTaskForm} />
              <Button onClick={handleCreateTask} className="w-full bg-primary h-12 font-bold uppercase">Cadastrar Ação</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar por título, local ou descrição..." 
            className="pl-10 h-11 bg-white border-none shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-56 h-11 bg-white border-none shadow-sm font-bold text-xs uppercase">
            <Filter className="size-4 mr-2 text-primary" />
            <SelectValue placeholder="Todas as Categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="PGR">PGR / NR-01</SelectItem>
            <SelectItem value="Treinamento">Treinamentos NR</SelectItem>
            <SelectItem value="Obra">Obras / EPC</SelectItem>
            <SelectItem value="Saúde">Saúde / PCMSO</SelectItem>
            <SelectItem value="Vistoria">Vistoria Técnica</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Views */}
      {activeView === 'board' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
            {COLUMNS.map((col) => (
              <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={filteredTasks.filter(t => t.status === col.id)} 
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <TaskCard 
                task={filteredTasks.find(t => t.id === activeId)!} 
                isOverlay 
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {activeView === 'list' && (
        <Card className="border-none shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase">Intervenção</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Local / Unidade</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Prazo</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Prioridade</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Status</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id} className="hover:bg-primary/5 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-bold text-primary text-xs uppercase">{task.title}</p>
                      <p className="text-[10px] text-muted-foreground italic">{task.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-bold uppercase text-slate-500">
                    <Building2 className="size-3 inline mr-1" /> {task.unit || "N/I"}
                  </TableCell>
                  <TableCell className="text-[10px] font-black uppercase text-primary">
                    {format(new Date(task.deadline), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase px-2 h-4 border-none",
                      task.priority === 'Alta' ? 'bg-destructive' : 'bg-blue-500'
                    )}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20">
                      {COLUMNS.find(c => c.id === task.status)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => handleEditTask(task)}>
                      <Edit3 className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeView === 'calendar' && (
        <Card className="card-shadow border-none bg-white p-6 shadow-2xl">
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
                <div key={i} className="min-h-[120px] p-2 border-r border-b bg-white group hover:bg-slate-50 transition-colors">
                  <span className={cn(
                    "text-[10px] font-bold p-1 rounded-md",
                    isSameDay(day, new Date()) ? "bg-primary text-white" : "text-slate-400"
                  )}>{format(day, 'd')}</span>
                  <div className="mt-2 space-y-1">
                    {dayTasks?.map(t => (
                      <div key={t.id} className={cn(
                        "text-[8px] p-1.5 rounded-lg font-bold truncate border flex items-center gap-1",
                        t.priority === 'Alta' ? 'bg-destructive/5 border-destructive/20 text-destructive' : 'bg-blue-50 border-blue-100 text-blue-600'
                      )}>
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
        <Card className="card-shadow border-none bg-white overflow-hidden min-h-[600px] flex flex-col shadow-2xl">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-sm font-black uppercase flex items-center gap-2"><MapIcon className="size-4 text-primary" /> Distribuição de Ações por Unidade</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative bg-slate-100 flex items-center justify-center">
            <div className="absolute inset-0 grayscale opacity-40">
              <iframe 
                width="100%" height="100%" frameBorder="0" 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.123456789!2d-49.2733!3d-25.4284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce41197ebad69%3A0x40169b40a335831!2sNextCon!5e0!3m2!1spt-BR!2sbr!4v123456789"
              />
            </div>
            <div className="relative z-10 p-8 bg-white/95 backdrop-blur-md rounded-[2rem] shadow-2xl border border-white max-w-sm text-center">
              <ShieldAlert className="size-12 mx-auto text-primary mb-4" />
              <h3 className="text-xs font-black uppercase text-primary mb-2 tracking-widest">Geolocalização Ativa</h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase leading-relaxed">
                As intervenções estão concentradas nas unidades: <br/>
                {Array.from(new Set(tasks?.map(t => t.unit).filter(Boolean))).join(", ") || "Sem locais definidos"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Intervenção</DialogTitle>
            <DialogDescription>Atualize os dados técnicos ou o progresso da ação.</DialogDescription>
          </DialogHeader>
          <TaskFormValues form={taskForm} onChange={setTaskForm} />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 font-bold" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTask} className="flex-1 bg-primary font-bold">Salvar Alterações</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function KanbanColumn({ column, tasks, onEdit, onDelete }: { 
  column: any, 
  tasks: ActionTask[], 
  onEdit: (t: ActionTask) => void,
  onDelete: (id: string) => void
}) {
  const { setNodeRef } = useSortable({ id: column.id })

  return (
    <div 
      ref={setNodeRef}
      className="flex flex-col gap-4 p-4 rounded-3xl bg-slate-100/50 border-2 border-transparent transition-all min-h-[500px]"
    >
      <div className="flex items-center justify-between px-2">
        <h3 className="font-black text-primary uppercase text-[10px] tracking-widest flex items-center gap-2">
          <div className={cn("size-2 rounded-full", column.color)} />
          {column.label}
        </h3>
        <Badge variant="secondary" className="bg-white text-[10px] font-black border-none shadow-sm">
          {tasks.length}
        </Badge>
      </div>
      
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <SortableTaskCard 
              key={task.id} 
              task={task} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
          {tasks.length === 0 && (
            <div className="py-10 border-2 border-dashed rounded-2xl flex items-center justify-center opacity-20">
              <p className="text-[9px] font-black uppercase">Vazio</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableTaskCard({ task, onEdit, onDelete }: { task: ActionTask, onEdit: (t: ActionTask) => void, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  )
}

function TaskCard({ task, isOverlay, onEdit, onDelete }: { 
  task: ActionTask, 
  isOverlay?: boolean,
  onEdit?: (t: ActionTask) => void,
  onDelete?: (id: string) => void
}) {
  return (
    <Card className={cn(
      "card-shadow border-none hover:ring-2 ring-primary/10 transition-all bg-white relative overflow-hidden",
      isOverlay && "shadow-2xl scale-105 cursor-grabbing"
    )}>
      <div className={cn("absolute top-0 left-0 w-1 h-full", 
        task.priority === 'Alta' ? 'bg-destructive' : 'bg-primary'
      )} />
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="text-[8px] font-black uppercase bg-slate-50 border-none h-5 px-2">
            {task.category}
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="size-6 rounded-md" onClick={() => onEdit?.(task)}>
              <Edit3 className="size-3 text-muted-foreground" />
            </Button>
          </div>
        </div>
        
        <p className="text-xs font-bold text-primary uppercase leading-tight">{task.title}</p>
        
        {task.unit && (
          <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase">
            <Building2 className="size-3" /> {task.unit}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-dashed">
          <div className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase">
            <Clock className="size-3" />
            {format(new Date(task.deadline), 'dd/MM')}
          </div>
          <Badge className={cn(
            "text-[8px] font-black uppercase px-2 h-4 border-none text-white",
            task.priority === 'Alta' ? 'bg-destructive' : 'bg-primary'
          )}>
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}

function TaskFormValues({ form, onChange }: { form: any, onChange: any }) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Título da Intervenção</label>
        <Input 
          value={form.title} 
          onChange={e => onChange({...form, title: e.target.value})} 
          placeholder="Ex: Treinamento NR-35 - Unidade Suzano" 
          className="bg-slate-50 border-none h-11 text-sm font-bold"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Descrição Técnica</label>
        <Textarea 
          value={form.description} 
          onChange={e => onChange({...form, description: e.target.value})} 
          placeholder="Detalhes da conformidade..." 
          className="bg-slate-50 border-none text-xs"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Categoria</label>
          <Select value={form.category} onValueChange={v => onChange({...form, category: v})}>
            <SelectTrigger className="bg-slate-50 border-none h-11 text-xs font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PGR">PGR / Riscos</SelectItem>
              <SelectItem value="Treinamento">Treinamento</SelectItem>
              <SelectItem value="Obra">Obras / EPC</SelectItem>
              <SelectItem value="Saúde">Saúde / PCMSO</SelectItem>
              <SelectItem value="Vistoria">Vistoria</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Prioridade</label>
          <Select value={form.priority} onValueChange={v => onChange({...form, priority: v})}>
            <SelectTrigger className="bg-slate-50 border-none h-11 text-xs font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Alta">Alta / Crítica</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Baixa">Baixa / Preventiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Unidade</label>
          <Input 
            value={form.unit} 
            onChange={e => onChange({...form, unit: e.target.value})} 
            placeholder="Ex: Matriz Curitiba" 
            className="bg-slate-50 border-none h-11 text-sm font-bold"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Data Prazo</label>
          <Input 
            type="date" 
            value={form.deadline} 
            onChange={e => onChange({...form, deadline: e.target.value})} 
            className="bg-slate-50 border-none h-11 text-sm font-bold"
          />
        </div>
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
        "rounded-lg gap-2 text-[10px] font-black uppercase tracking-tighter px-4",
        active ? "bg-primary text-white" : "text-muted-foreground"
      )}
    >
      <Icon className="size-3.5" /> {label}
    </Button>
  )
}
