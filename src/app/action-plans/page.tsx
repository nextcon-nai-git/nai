
"use client"

import * as React from "react"
import { Plus, MoreVertical, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const initialActions = [
  { id: 1, title: "Install extra lighting in Warehouse", category: "PGR", priority: "High", status: "ToDo", deadline: "2024-06-01" },
  { id: 2, title: "CIPA monthly meeting minutes", category: "Management", priority: "Medium", status: "InProgress", deadline: "2024-05-20" },
  { id: 3, title: "Ergonomics assessment - Desk 4", category: "Ergo", priority: "Low", status: "Done", deadline: "2024-05-05" },
  { id: 4, title: "Replace fire extinguishers B-block", category: "Fire", priority: "High", status: "ToDo", deadline: "2024-05-25" },
]

export default function ActionPlans() {
  const columns = ["ToDo", "InProgress", "Done"]

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Action Plans</h1>
          <p className="text-muted-foreground">Manage tasks from PGR, CIPA, and Ergonomic assessments.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2">
          <Plus className="size-4" /> New Action
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((status) => (
          <div key={status} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-headline font-bold text-primary/70 uppercase text-xs tracking-widest">
                {status === 'ToDo' ? 'To Do' : status === 'InProgress' ? 'In Progress' : 'Completed'}
              </h3>
              <Badge variant="secondary" className="bg-muted">
                {initialActions.filter(a => a.status === status).length}
              </Badge>
            </div>
            
            <div className="flex flex-col gap-3 min-h-[500px] p-2 bg-muted/30 rounded-xl border-2 border-dashed border-muted">
              {initialActions.filter(a => a.status === status).map((action) => (
                <Card key={action.id} className="card-shadow border-none hover:ring-2 ring-primary/20 transition-all cursor-grab active:cursor-grabbing">
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
                        {action.priority === 'High' && <AlertCircle className="size-3 text-red-500" />}
                        {action.status === 'Done' && <CheckCircle2 className="size-3 text-green-500" />}
                        <span className={`text-[10px] font-bold ${action.priority === 'High' ? 'text-red-500' : 'text-muted-foreground'}`}>
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
