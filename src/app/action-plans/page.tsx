'use client';

import * as React from "react"
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  Calendar as CalendarIcon,
  Filter,
  Sparkles,
  Brain,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Building2,
  Loader2,
  Database,
  Zap
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, collectionGroup, doc, writeBatch } from "firebase/firestore"
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
import { OpsTask, TaskType, Priority } from "@/types/schema"
import { KanbanBoard } from "@/components/kanban/kanban-board"
import { Badge } from "@/components/ui/badge"

export default function EnterpriseOpsHub() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [activeView, setActiveView] = React.useState<"board" | "list" | "calendar">("board")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
  const [isImporting, setIsImporting] = React.useState(false)
  
  const [taskForm, setTaskForm] = React.useState<Partial<OpsTask>>({
    title: "",
    companyId: "",
    type: "pgr",
    priority: "medium",
    status: "todo",
    dueDate: new Date().toISOString()
  })

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);

  const isPrivileged = React.useMemo(() => {
    return profile && ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role);
  }, [profile]);

  React.useEffect(() => {
    if (profile && !isPrivileged && profile.companyId) {
      setSelectedCompanyId(profile.companyId);
      setTaskForm(prev => ({ ...prev, companyId: profile.companyId }));
    }
  }, [profile, isPrivileged]);

  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])
  const { data: companies, isLoading: loadingCompanies } = useCollection(companiesQuery)

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    if (selectedCompanyId === "all") {
      if (isPrivileged) {
        return query(collectionGroup(db, "tasks"), orderBy("dueDate", "asc"))
      } else if (profile.companyId) {
        return query(collection(db, "companies", profile.companyId, "tasks"), orderBy("dueDate", "asc"))
      }
    } else {
      return query(collection(db, "companies", selectedCompanyId, "tasks"), orderBy("dueDate", "asc"))
    }
    return null;
  }, [db, profile, selectedCompanyId, isPrivileged])

  const { data: tasks, isLoading: loadingTasks } = useCollection<OpsTask>(tasksQuery)

  const handleCreateTask = () => {
    if (!db || !taskForm.title || !taskForm.companyId) {
      toast({ variant: "destructive", title: "Dados Incompletos", description: "Preencha o título e a unidade responsável." })
      return
    }
    const company = companies?.find(c => c.id === taskForm.companyId)
    const colRef = collection(db, "companies", taskForm.companyId, "tasks")
    const newTask: Partial<OpsTask> = {
      ...taskForm,
      companyName: company?.name || "Unidade Técnica",
      checklist: [
        { id: '1', text: 'Validar Documentação Base', checked: false, mandatory: true },
        { id: '2', text: 'Transmitir ao eSocial', checked: false, mandatory: false }
      ],
      ai_risk_score: Math.floor(Math.random() * 40) + 10,
      createdAt: new Date().toISOString()
    }
    addDocumentNonBlocking(colRef, newTask)
    setIsCreateOpen(false)
    toast({ title: "Operação Registrada", description: "O fluxo de conformidade NAI foi iniciado." })
  }

  const handleImportRealCases = async () => {
    if (!db || !user) return
    setIsImporting(true)
    try {
      const batch = writeBatch(db)
      const now = new Date().toISOString()
      const cases = [
        { id: "T_NAT_01", title: "Treinamento NR Integrada (18, 35, 11, 12)", companyId: "CLI_NATIVA", companyName: "NATIVA EMPREENDIMENTOS", type: "treinamento", priority: "high", status: "doing" },
        { id: "T_TIME_01", title: "Auditagem Agrupador 859 (Download XML)", companyId: "CLI_TIMENOW", companyName: "TIMENOW GESTÃO DE OBRAS", type: "esocial", priority: "critical", status: "todo" },
        { id: "T_BRIT_01", title: "Renovação PGR 2026 - Unidade Fabril", companyId: "CLI_BRITANIA", companyName: "BRITÂNIA ELETRODOMÉSTICOS", type: "pgr", priority: "medium", status: "todo" }
      ]
      cases.forEach(t => {
        const taskRef = doc(db, "companies", t.companyId, "tasks", t.id)
        batch.set(taskRef, {
          ...t,
          dueDate: now,
          createdAt: now,
          ai_risk_score: 85,
          checklist: [
            { id: '1', text: 'Coletar evidências de campo', checked: true, mandatory: true },
            { id: '2', text: 'Validar com Engenheiro Responsável', checked: false, mandatory: true }
          ]
        }, { merge: true })
      })
      await batch.commit()
      toast({ title: "Casos Reais Importados" })
    } catch (e) {
      toast({ variant: "destructive", title: "Erro na Importação" })
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-xl text-accent shadow-lg shadow-primary/20">
              <Activity className="size-6" />
            </div>
            <h1 className="text-3xl font-black text-primary uppercase tracking-tight font-headline">Cards Operação</h1>
          </div>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Brain className="size-4 text-accent" /> Gestão tática de segurança e conformidade multi-unidade.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {isPrivileged && (
            <Button variant="outline" onClick={handleImportRealCases} disabled={isImporting} className="h-14 px-6 border-dashed border-primary/30 text-primary/60 hover:text-primary gap-2 rounded-2xl font-black uppercase text-[10px]">
              {isImporting ? <Loader2 className="size-4 animate-spin" /> : <Database className="size-4" />}
              Importar Casos Reais
            </Button>
          )}
          <div className="w-64">
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId} disabled={!isPrivileged}>
              <SelectTrigger className="bg-white border-muted h-11 text-xs">
                <Building2 className="size-4 mr-2" />
                <SelectValue placeholder={loadingCompanies ? "Carregando..." : "Filtrar Unidade"} />
              </SelectTrigger>
              <SelectContent>
                {isPrivileged && <SelectItem value="all">Todas as Unidades</SelectItem>}
                {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-nextcon text-white gap-2 h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl rounded-2xl">
                <Plus className="size-5" /> Nova Intervenção
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] glass-panel border-none rounded-[2.5rem] p-8">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-primary uppercase font-headline">Nova Ação de Segurança</DialogTitle>
                <DialogDescription className="font-bold text-[10px] uppercase tracking-[0.2em] text-accent">Inteligência Ocupacional Nextcon</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Descrição da Operação</label>
                  <Input value={taskForm.title} onChange={e => setTaskForm({...taskForm, title: e.target.value})} className="bg-slate-50 border-none h-14 text-sm font-bold rounded-2xl shadow-inner" placeholder="Ex: Atualização PGR Unidade Fabril" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Unidade Responsável</label>
                  <Select value={taskForm.companyId} onValueChange={v => setTaskForm({...taskForm, companyId: v})}>
                    <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleCreateTask} className="w-full h-16 gradient-nextcon font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl">
                <Sparkles className="size-5 text-accent mr-2" /> Ativar Fluxo de Auditoria
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="min-h-[600px] glass-panel rounded-[3rem] p-8 relative flex flex-col items-center justify-center">
         {loadingTasks ? (
           <div className="flex flex-col items-center justify-center gap-6 py-20">
             <div className="size-20 rounded-[2rem] bg-[#090e24] flex items-center justify-center text-white font-black text-4xl shadow-2xl animate-bounce">N</div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40 animate-pulse">Sincronizando Operações...</p>
           </div>
         ) : tasks && tasks.length > 0 ? (
           <div className="w-full h-full">
             <KanbanBoard tasks={tasks} />
           </div>
         ) : (
           <div className="text-center opacity-30 space-y-4">
             <LayoutGrid className="size-16 mx-auto" />
             <p className="font-black uppercase text-xs tracking-widest">Nenhuma intervenção ativa encontrada</p>
           </div>
         )}
      </div>
    </div>
  )
}
