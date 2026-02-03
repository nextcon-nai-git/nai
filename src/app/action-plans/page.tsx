
"use client"

import * as React from "react"
import { Plus, MoreVertical, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Action {
  id: number
  title: string
  category: string
  priority: string
  status: string
  deadline: string
}

const initialActions: Action[] = [
  { id: 1, title: "Instalar iluminação extra no Depósito", category: "PGR", priority: "Alta", status: "ParaFazer", deadline: "01/06/2024" },
  { id: 2, title: "Ata da reunião mensal CIPA", category: "Gestão", priority: "Média", status: "EmAndamento", deadline: "20/05/2024" },
  { id: 3, title: "Análise Ergonômica - Mesa 4", category: "Ergo", priority: "Baixa", status: "Concluido", deadline: "05/05/2024" },
  { id: 4, title: "Recarga de extintores Bloco-B", category: "Incêndio", priority: "Alta", status: "ParaFazer", deadline: "25/05/2024" },
]

export default function ActionPlans() {
  const [actions, setActions] = React.useState<Action[]>(initialActions)
  const [draggedId, setDraggedId] = React.useState<number | null>(null)
  const { toast } = useToast()

  const columns = [
    { id: "ParaFazer", label: "Para Fazer" },
    { id: "EmAndamento", label: "Em Andamento" },
    { id: "Concluido", label: "Concluído" }
  ]

  const onDragStart = (e: React.DragEvent, id: number) => {
    setDraggedId(id)
    e.dataTransfer.setData("text/plain", id.toString())
    // Efeito visual de transparência no elemento original
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.4"
    }
  }

  const onDragEnd = (e: React.DragEvent) => {
    setDraggedId(null)
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1"
    }
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault() // Necessário para permitir o drop
  }

  const onDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    const id = Number(e.dataTransfer.getData("text/plain"))
    
    setActions(prev => prev.map(action => 
      action.id === id ? { ...action, status: newStatus } : action
    ))

    const actionTitle = actions.find(a => a.id === id)?.title
    toast({
      title: "Status Atualizado",
      description: `"${actionTitle}" movido para ${newStatus}.`,
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Planos de Ação</h1>
          <p className="text-muted-foreground">Arraste os cards para gerenciar tarefas do PGR e CIPA.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2">
          <Plus className="size-4" /> Nova Ação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => (
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
                {actions.filter(a => a.status === col.id).length}
              </Badge>
            </div>
            
            <div className={`flex flex-col gap-3 min-h-[500px] p-2 bg-muted/30 rounded-xl border-2 border-dashed transition-colors duration-200 ${draggedId !== null ? 'border-primary/20 bg-primary/5' : 'border-muted'}`}>
              {actions.filter(a => a.status === col.id).map((action) => (
                <Card 
                  key={action.id} 
                  draggable
                  onDragStart={(e) => onDragStart(e, action.id)}
                  onDragEnd={onDragEnd}
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
