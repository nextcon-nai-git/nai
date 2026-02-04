
"use client"

import * as React from "react"
import { Plus, MoreVertical, Clock, CheckCircle2, AlertCircle, Loader2, Filter } from "lucide-react"
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

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (!user || !db) return
    const taskRef = doc(db, "clients", user.uid, "tasks", id)
    updateDocumentNonBlocking(taskRef, { status: newStatus })
    setDraggedId(null)
  }

  const handleCreateAction = () => {
    if (!user || !db || !newAction.title) return
    const colRef = collection(db, "clients", user.uid, "tasks")
    addDocumentNonBlocking(colRef, {
      ...newAction,
      status: "ParaFazer",
      createdAt: new Date().toISOString()
    })
    setIsDialogOpen(false)
    setNewAction({ title: "", category: "PGR", priority: "Média", deadline: "" })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary uppercase tracking-tight">Fluxo de Intervenções</h1>
          <p className="text-muted-foreground">Gestão unificada de Planos de Ação, Treinamentos e Obras.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 gap-2 h-12 px-6 font-bold shadow-lg">
              <Plus className="size-5" /> Nova Intervenção
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nova Ação/Tarefa</DialogTitle>
              <DialogDescription>Tarefas originadas de Inspeções, PGR ou PCMSO.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase opacity-50">Título da Ação</label>
                <Input value={newAction.title} onChange={e => setNewAction({...newAction, title: e.target.value})} placeholder="Ex: Abertura de Obra - NR-18" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase opacity-50">Categoria</label>
                  <Select value={newAction.category} onValueChange={v => setNewAction({...newAction, category: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PGR">PGR / SESMT</SelectItem>
                      <SelectItem value="Treinamento">Treinamento</SelectItem>
                      <SelectItem value="Obra">Obras / PCMAT</SelectItem>
                      <SelectItem value="Saúde">Saúde / PCMSO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase opacity-50">Prioridade</label>
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
                <label className="text-xs font-black uppercase opacity-50">Prazo Final</label>
                <Input type="date" value={newAction.deadline} onChange={e => setNewAction({...newAction, deadline: e.target.value})} />
              </div>
              <Button onClick={handleCreateAction} className="w-full bg-primary h-12 font-bold uppercase">Confirmar Registro</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
          <div 
            key={col.id} 
            className="flex flex-col gap-4"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline font-bold text-primary/70 uppercase text-[10px] tracking-[0.2em]">
                {col.label}
              </h3>
              <Badge variant="secondary" className="bg-muted text-[10px]">
                {actions?.filter(a => a.status === col.id).length || 0}
              </Badge>
            </div>
            
            <div className={`flex flex-col gap-3 min-h-[500px] p-2 bg-muted/20 rounded-2xl border-2 border-dashed transition-colors duration-200 ${draggedId !== null ? 'border-primary/20 bg-primary/5' : 'border-muted'}`}>
              {actions?.filter(a => a.status === col.id).map((action) => (
                <Card 
                  key={action.id} 
                  draggable
                  onDragStart={(e) => {
                    setDraggedId(action.id)
                    e.dataTransfer.setData("text/plain", action.id)
                  }}
                  className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all cursor-grab active:cursor-grabbing bg-white"
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[9px] font-black uppercase">{action.category}</Badge>
                      <MoreVertical className="size-3 opacity-30" />
                    </div>
                    <p className="text-xs font-bold leading-tight text-primary">{action.title}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-[9px] text-muted-foreground font-medium">
                        <Clock className="size-3" />
                        {action.deadline}
                      </div>
                      <Badge className={action.priority === 'Alta' ? 'bg-red-500' : 'bg-primary/10 text-primary border-none'} text-[8px]>
                        {action.priority}
                      </Badge>
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
