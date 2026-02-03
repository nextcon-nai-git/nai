"use client"

import * as React from "react"
import { Plus, MoreVertical, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { addDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase/non-blocking-updates"
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

interface Action {
  id: string
  title: string
  category: string
  priority: string
  status: string
  deadline: string
}

export default function ActionPlans() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  // Form State
  const [newAction, setNewAction] = React.useState({
    title: "",
    category: "PGR",
    priority: "Média",
    deadline: ""
  })

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "tasks"), orderBy("deadline", "asc"))
  }, [db, user])

  const { data: actions, isLoading } = useCollection<Action>(tasksQuery)

  const columns = [
    { id: "ParaFazer", label: "Para Fazer" },
    { id: "EmAndamento", label: "Em Andamento" },
    { id: "Concluido", label: "Concluído" }
  ]

  const onDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id)
    e.dataTransfer.setData("text/plain", id)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (!user || !db) return

    const taskRef = doc(db, "clients", user.uid, "tasks", id)
    updateDocumentNonBlocking(taskRef, { status: newStatus })

    toast({
      title: "Status Atualizado",
      description: `Ação movida para ${newStatus}.`,
    })
  }

  const handleCreateAction = () => {
    if (!user || !db || !newAction.title) return

    const colRef = collection(db, "clients", user.uid, "tasks")
    addDocumentNonBlocking(colRef, {
      ...newAction,
      status: "ParaFazer",
      createdAt: new Date().toISOString()
    })

    toast({
      title: "Ação Criada",
      description: "O novo plano de ação foi registrado com sucesso."
    })
    setIsDialogOpen(false)
    setNewAction({ title: "", category: "PGR", priority: "Média", deadline: "" })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Planos de Ação</h1>
          <p className="text-muted-foreground">Arraste os cards para gerenciar tarefas do PGR e CIPA.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 gap-2">
              <Plus className="size-4" /> Nova Ação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Plano de Ação</DialogTitle>
              <DialogDescription>Preencha os detalhes da tarefa normativa.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-bold">Título da Ação</label>
                <Input value={newAction.title} onChange={e => setNewAction({...newAction, title: e.target.value})} placeholder="Ex: Recarga de extintores" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Categoria</label>
                  <Select value={newAction.category} onValueChange={v => setNewAction({...newAction, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PGR">PGR</SelectItem>
                      <SelectItem value="CIPA">CIPA</SelectItem>
                      <SelectItem value="Ergo">Ergonômico</SelectItem>
                      <SelectItem value="Gestão">Gestão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Prioridade</label>
                  <Select value={newAction.priority} onValueChange={v => setNewAction({...newAction, priority: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Alta">Alta</SelectItem>
                      <SelectItem value="Média">Média</SelectItem>
                      <SelectItem value="Baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold">Prazo (Data)</label>
                <Input type="date" value={newAction.deadline} onChange={e => setNewAction({...newAction, deadline: e.target.value})} />
              </div>
              <Button onClick={handleCreateAction} className="w-full bg-primary font-bold">Salvar Plano de Ação</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 py-20 flex flex-col items-center justify-center opacity-40">
            <Loader2 className="size-10 animate-spin mb-2" />
            <p className="text-xs font-black uppercase tracking-widest">Sincronizando tarefas...</p>
          </div>
        ) : columns.map((col) => (
          <div 
            key={col.id} 
            className="flex flex-col gap-4"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline font-bold text-primary/70 uppercase text-xs tracking-widest">
                {col.label}
              </h3>
              <Badge variant="secondary" className="bg-muted">
                {actions?.filter(a => a.status === col.id).length || 0}
              </Badge>
            </div>
            
            <div className={`flex flex-col gap-3 min-h-[500px] p-2 bg-muted/30 rounded-xl border-2 border-dashed transition-colors duration-200 ${draggedId !== null ? 'border-primary/20 bg-primary/5' : 'border-muted'}`}>
              {actions?.filter(a => a.status === col.id).map((action) => (
                <Card 
                  key={action.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, action.id)}
                  className="card-shadow border-none hover:ring-2 ring-primary/20 transition-all cursor-grab active:cursor-grabbing bg-card"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px]">{action.category}</Badge>
                      <button className="text-muted-foreground hover:text-primary">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold leading-tight">{action.title}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <Clock className="size-3" />
                        {action.deadline}
                      </div>
                      <div className="flex items-center gap-1">
                        {action.priority === 'Alta' && <AlertCircle className="size-3 text-red-500" />}
                        {action.status === 'Concluido' && <CheckCircle2 className="size-3 text-green-500" />}
                        <span className={`text-[10px] font-bold ${action.priority === 'Alta' ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {action.priority}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
