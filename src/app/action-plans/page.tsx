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
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { SSTTask, KANBAN_COLUMNS, Status, Priority, TaskType } from "@/types/kanban"
import { TaskCard } from "@/components/kanban/task-card"

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
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Helper function to safely format dates
function safeFormat(date: any, formatStr: string) {
  if (!date) return "---";
  const d = new Date(date);
  if (!isValid(d)) return "---";
  return format(d, formatStr, { locale: ptBR });
}

export default function ActionPlans() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  // View State
  const [activeView, setActiveView] = React.useState<"board" | "list" | "calendar" | "map">("board")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterType, setFilterType] = React.useState<string>("all")
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<SSTTask | null>(null)
  const [taskForm, setTaskForm] = React.useState<Partial<SSTTask>>({
    title: "",
    company: "",
    type: "pgr",
    priority: "medium",
    status: "todo",
    dueDate: new Date().toISOString()
  })

  // Data Fetching
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "tasks"), orderBy("dueDate", "asc"))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection<SSTTask>(tasksQuery)

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const [activeId, setActiveId] = React.useState<string | null>(null)

  // Handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    // Check if dropped over a column
    let newStatus = overId as Status
    const columnIds = KANBAN_COLUMNS.map(c => c.id)
    
    if (!columnIds.includes(newStatus)) {
      // If dropped over a task, get that task's status
      const overTask = tasks?.find(t => t.id === overId)
      if (overTask) newStatus = overTask.status
    }

    const task = tasks?.find(t => t.id === taskId)
    if (task && task.status !== newStatus) {
      const taskRef = doc(db!, "clients", user!.uid, "tasks", taskId)
      updateDocumentNonBlocking(taskRef, { status: newStatus })
      toast({ title: "Status Atualizado", description: `Intervenção movida com sucesso.` })
    }

    setActiveId(null)
  }

  const handleCreateTask = () => {
    if (!user || !db || !taskForm.title) return
    const colRef = collection(db, "clients", user.uid, "tasks")
    addDocumentNonBlocking(colRef, {
      ...taskForm,
      createdAt: new Date().toISOString()
    })
    setIsCreateOpen(false)
    setTaskForm({ title: "", company: "", type: "pgr", priority: "medium", status: "todo", dueDate: new Date().toISOString() })
  }

  const handleUpdateTask = () => {
    if (!user || !db || !selectedTask) return
    const taskRef = doc(db, "clients", user.uid, "tasks", selectedTask.id)
    updateDocumentNonBlocking(taskRef, { ...taskForm })
    setIsEditOpen(false)
    setSelectedTask(null)
  }

  const filteredTasks = React.useMemo(() => {
    if (!tasks) return []
    return tasks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (t.company || "").toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || t.type === filterType
      return matchesSearch && matchesType
    })
  }, [tasks, searchTerm, filterType])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-primary uppercase tracking-tight font-headline">Fluxo de Intervenções</h1>
          <p className="text-muted-foreground font-medium">Gestão técnica de Planos de Ação, Engenharia e eSocial.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-muted/50 p-1 rounded-xl flex shadow-inner">
            <ViewToggle active={activeView === 'board'} onClick={() => setActiveView('board')} icon={LayoutGrid} label="Quadro" />
            <ViewToggle active={activeView === 'list'} onClick={() => setActiveView('list')} icon={ListIcon} label="Lista" />
            <ViewToggle active={activeView === 'calendar'} onClick={() => setActiveView('calendar')} icon={CalendarIcon} label="Agenda" />
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
                <DialogDescription>Cadastre intervenções baseadas nas NRs 2026.</DialogDescription>
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
            placeholder="Pesquisar por título, empresa ou descrição..." 
            className="pl-10 h-11 bg-white border-none shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full md:w-56 h-11 bg-white border-none shadow-sm font-bold text-xs uppercase">
            <Filter className="size-4 mr-2 text-primary" />
            <SelectValue placeholder="Tipo de Ação" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="pgr">PGR / Riscos</SelectItem>
            <SelectItem value="treinamento">Treinamentos</SelectItem>
            <SelectItem value="pcmso">Saúde / PCMSO</SelectItem>
            <SelectItem value="esocial">eSocial / S-2240</SelectItem>
            <SelectItem value="vistoria">Vistorias</SelectItem>
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
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
            {KANBAN_COLUMNS.map((col) => (
              <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={filteredTasks.filter(t => t.status === col.id)} 
                onEdit={(t) => { setSelectedTask(t); setTaskForm(t); setIsEditOpen(true); }}
              />
            ))}
          </div>
          <DragOverlay>
            {activeId ? (
              <TaskCard 
                task={filteredTasks.find(t => t.id === activeId)!} 
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {activeView === 'list' && (
        <Card className="border-none shadow-xl overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase">Intervenção</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Empresa / Unidade</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Prazo Final</TableHead>
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
                      <p className="text-[10px] text-muted-foreground italic uppercase">{task.type}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[10px] font-bold uppercase text-slate-500">
                    <Building2 className="size-3 inline mr-1" /> {task.company || "N/I"}
                  </TableCell>
                  <TableCell className="text-[10px] font-black uppercase text-primary">
                    {safeFormat(task.dueDate, 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase px-2 h-4 border-none",
                      task.priority === 'critical' ? 'bg-destructive' : 
                      task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'
                    )}>
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20">
                      {KANBAN_COLUMNS.find(c => c.id === task.status)?.title}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="size-8" onClick={() => { setSelectedTask(task); setTaskForm(task); setIsEditOpen(true); }}>
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
              const dayTasks = tasks?.filter(t => {
                const date = new Date(t.dueDate);
                return isValid(date) && isSameDay(date, day);
              })
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
                        t.priority === 'critical' ? 'bg-destructive/5 border-destructive/20 text-destructive' : 'bg-blue-50 border-blue-100 text-blue-600'
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

function KanbanColumn({ column, tasks, onEdit }: { 
  column: any, 
  tasks: SSTTask[], 
  onEdit: (t: SSTTask) => void
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
          {column.title}
        </h3>
        <Badge variant="secondary" className="bg-white text-[10px] font-black border-none shadow-sm">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
          />
        ))}
        {tasks.length === 0 && (
          <div className="py-10 border-2 border-dashed rounded-2xl flex items-center justify-center opacity-20">
            <p className="text-[9px] font-black uppercase">Sem tarefas</p>
          </div>
        )}
      </div>
    </div>
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
          placeholder="Ex: Treinamento NR-35 - Canteiro 01" 
          className="bg-slate-50 border-none h-11 text-sm font-bold"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Empresa / Unidade</label>
        <Input 
          value={form.company} 
          onChange={e => onChange({...form, company: e.target.value})} 
          placeholder="Ex: Time Now - Suzano" 
          className="bg-slate-50 border-none h-11 text-sm font-bold"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Tipo de Ação</label>
          <Select value={form.type} onValueChange={v => onChange({...form, type: v as TaskType})}>
            <SelectTrigger className="bg-slate-50 border-none h-11 text-xs font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pgr">PGR / NR-01</SelectItem>
              <SelectItem value="pcmso">Saúde / NR-07</SelectItem>
              <SelectItem value="treinamento">Treinamento</SelectItem>
              <SelectItem value="vistoria">Vistoria Técnica</SelectItem>
              <SelectItem value="esocial">eSocial S-2240</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Prioridade</label>
          <Select value={form.priority} onValueChange={v => onChange({...form, priority: v as Priority})}>
            <SelectTrigger className="bg-slate-50 border-none h-11 text-xs font-bold"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Crítica / Imediata</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="low">Baixa / Rotina</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-1">Data Prazo</label>
        <Input 
          type="date" 
          value={form.dueDate ? format(new Date(form.dueDate), 'yyyy-MM-dd') : ''} 
          onChange={e => onChange({...form, dueDate: new Date(e.target.value).toISOString()})} 
          className="bg-slate-50 border-none h-11 text-sm font-bold"
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
        "rounded-lg gap-2 text-[10px] font-black uppercase tracking-tighter px-4",
        active ? "bg-primary text-white" : "text-muted-foreground"
      )}
    >
      <Icon className="size-3.5" /> {label}
    </Button>
  )
}
