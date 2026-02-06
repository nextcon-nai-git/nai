
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
  ChevronRight,
  ClipboardList
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import { cn } from "@/lib/utils"

interface ActionTask {
  id: string
  title: string
  description?: string
  category: string
  priority: string
  status: string
  deadline: string
  createdAt: string
}

export default function ActionPlans() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  // Estados de UI
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [overColumnId, setOverColumnId] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("all")
  
  // Estados de Modais
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [selectedTask, setSelectedTask] = React.useState<ActionTask | null>(null)

  // Estado de Nova/Edição de Tarefa
  const [taskForm, setTaskForm] = React.useState({
    title: "",
    description: "",
    category: "PGR",
    priority: "Média",
    deadline: ""
  })

  // Queries
  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "tasks"), orderBy("deadline", "asc"))
  }, [db, user])

  const { data: tasks, isLoading } = useCollection<ActionTask>(tasksQuery)

  const columns = [
    { id: "ParaFazer", label: "Para Fazer", color: "bg-gray-100" },
    { id: "EmAndamento", label: "Em Andamento", color: "bg-blue-50" },
    { id: "Concluido", label: "Concluído", color: "bg-emerald-50" }
  ]

  // Handlers de Drag and Drop
  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.setData("text/plain", id)
    // Efeito fantasma
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '0.4'
  }

  const onDragEnd = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    target.style.opacity = '1'
    setDraggedId(null)
    setOverColumnId(null)
  }

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (!user || !db) return
    
    const taskRef = doc(db, "clients", user.uid, "tasks", id)
    updateDocumentNonBlocking(taskRef, { status: newStatus })
    
    setDraggedId(null)
    setOverColumnId(null)
    
    toast({
      title: "Status Atualizado",
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
    setTaskForm({ title: "", description: "", category: "PGR", priority: "Média", deadline: "" })
  }

  const handleEditTask = (task: ActionTask) => {
    setSelectedTask(task)
    setTaskForm({
      title: task.title,
      description: task.description || "",
      category: task.category,
      priority: task.priority,
      deadline: task.deadline
    })
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
    toast({ title: "Tarefa removida", variant: "destructive" })
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

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary uppercase tracking-tight">Fluxo de Intervenções</h1>
          <p className="text-muted-foreground">Gestão unificada de Planos de Ação, Obras e Segurança.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-primary-foreground gap-2 h-12 px-6 font-bold shadow-lg">
                <Plus className="size-5" /> Criar Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Nova Tarefa Operacional</DialogTitle>
                <DialogDescription>Defina os detalhes da intervenção técnica.</DialogDescription>
              </DialogHeader>
              <TaskFormValues form={taskForm} onChange={setTaskForm} />
              <Button onClick={handleCreateTask} className="w-full bg-primary h-12 font-bold uppercase">Criar Cartão</Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar tarefas..." 
            className="pl-10 h-10 bg-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-48 bg-white">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="PGR">PGR / Riscos</SelectItem>
            <SelectItem value="Treinamento">Treinamento</SelectItem>
            <SelectItem value="Obra">Obras / Engenharia</SelectItem>
            <SelectItem value="Saúde">Saúde / PCMSO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[600px]">
        {columns.map((col) => (
          <div 
            key={col.id} 
            className={cn(
              "flex flex-col gap-4 p-3 rounded-2xl transition-all duration-200 border-2 border-transparent",
              col.color,
              overColumnId === col.id && "border-primary/20 bg-primary/5 scale-[1.01]"
            )}
            onDragOver={(e) => {
              e.preventDefault()
              setOverColumnId(col.id)
            }}
            onDragLeave={() => setOverColumnId(null)}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="font-headline font-black text-primary/60 uppercase text-[11px] tracking-widest flex items-center gap-2">
                <div className={cn("size-2 rounded-full", col.id === 'Concluido' ? 'bg-emerald-500' : col.id === 'EmAndamento' ? 'bg-blue-500' : 'bg-gray-400')} />
                {col.label}
              </h3>
              <Badge variant="secondary" className="bg-white/50 text-[10px] font-black">
                {filteredTasks.filter(a => tStatus(a.status) === col.id).length}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-3 h-full">
              {isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="size-6 animate-spin text-primary/20" /></div>
              ) : filteredTasks.filter(a => tStatus(a.status) === col.id).length === 0 ? (
                <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-center p-6 opacity-30">
                  <p className="text-[10px] font-black uppercase">Solte cartões aqui</p>
                </div>
              ) : filteredTasks.filter(a => tStatus(a.status) === col.id).map((task) => (
                <Card 
                  key={task.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id)}
                  onDragEnd={onDragEnd}
                  className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all cursor-grab active:cursor-grabbing bg-white group"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="text-[9px] font-black uppercase bg-muted/20 border-none px-2 h-5">
                        {task.category}
                      </Badge>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="size-6 rounded-full" onClick={() => handleEditTask(task)}>
                          <Edit3 className="size-3 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="size-6 rounded-full hover:bg-red-50 hover:text-red-600" onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-bold leading-tight text-primary">{task.title}</p>
                      {task.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-dashed">
                      <div className={cn(
                        "flex items-center gap-1 text-[10px] font-bold",
                        isOverdue(task.deadline) && task.status !== 'Concluido' ? 'text-red-600' : 'text-muted-foreground'
                      )}>
                        <Clock className="size-3" />
                        {task.deadline ? new Date(task.deadline).toLocaleDateString('pt-BR') : 'Sem prazo'}
                      </div>
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-1.5 h-4 border-none",
                        task.priority === 'Alta' ? 'bg-red-500 text-white shadow-sm' : 
                        task.priority === 'Baixa' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
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

      {/* Modal de Edição */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Intervenção</DialogTitle>
            <DialogDescription>Atualize os dados ou o progresso da ação.</DialogDescription>
          </DialogHeader>
          <TaskFormValues form={taskForm} onChange={setTaskForm} />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 font-bold uppercase" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateTask} className="flex-1 bg-primary font-bold uppercase">Salvar Alterações</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TaskFormValues({ form, onChange }: { form: any, onChange: any }) {
  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Título da Ação</label>
        <Input 
          value={form.title} 
          onChange={e => onChange({...form, title: e.target.value})} 
          placeholder="Ex: Treinamento NR-35 - Unidade Curitiba" 
          className="bg-muted/30 border-none h-12 text-sm font-medium"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Descrição / Observações</label>
        <Textarea 
          value={form.description} 
          onChange={e => onChange({...form, description: e.target.value})} 
          placeholder="Detalhes sobre o que precisa ser feito..." 
          className="bg-muted/30 border-none min-h-[100px] text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Categoria</label>
          <Select value={form.category} onValueChange={v => onChange({...form, category: v})}>
            <SelectTrigger className="bg-muted/30 border-none h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PGR">PGR / SESMT</SelectItem>
              <SelectItem value="Treinamento">Treinamento</SelectItem>
              <SelectItem value="Obra">Obras / Engenharia</SelectItem>
              <SelectItem value="Saúde">Saúde / PCMSO</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Prioridade</label>
          <Select value={form.priority} onValueChange={v => onChange({...form, priority: v})}>
            <SelectTrigger className="bg-muted/30 border-none h-12"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Alta">Alta</SelectItem>
              <SelectItem value="Média">Média</SelectItem>
              <SelectItem value="Baixa">Baixa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase opacity-50 tracking-widest">Prazo de Conclusão</label>
        <Input 
          type="date" 
          value={form.deadline} 
          onChange={e => onChange({...form, deadline: e.target.value})} 
          className="bg-muted/30 border-none h-12"
        />
      </div>
    </div>
  )
}

// Helpers
function tStatus(status: string) {
  if (!status) return "ParaFazer"
  return status
}

function isOverdue(dateStr: string) {
  if (!dateStr) return false
  const deadline = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return deadline < today
}
