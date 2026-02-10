
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

  // Perfil para controle RBAC
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid);
  }, [db, user]);
  const { data: profile } = useDoc(profileRef);

  const isPrivileged = React.useMemo(() => {
    return profile && ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role);
  }, [profile]);

  // Trava unidade para clientes
  React.useEffect(() => {
    if (profile && !isPrivileged && profile.companyId) {
      setSelectedCompanyId(profile.companyId);
      setTaskForm(prev => ({ ...prev, companyId: profile.companyId }));
    }
  }, [profile, isPrivileged]);

  // Busca de empresas
  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])
  const { data: companies, isLoading: loadingCompanies } = useCollection(companiesQuery)

  // Busca de tarefas
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
        { 
          cid: "CLI_NATIVA", 
          name: "NATIVA EMPREENDIMENTOS", 
          tasks: [
            { id: "T_NAT_01", title: "Treinamento NR Integrada (18, 35, 11, 12)", type: "treinamento", priority: "high", status: "doing" }
          ]
        },
        { 
          cid: "CLI_TIMENOW", 
          name: "TIMENOW GESTÃO DE OBRAS", 
          tasks: [
            { id: "T_TIME_01", title: "Auditagem Agrupador 859 (Download XML)", type: "esocial", priority: "critical", status: "todo" }
          ]
        },
        { 
          cid: "CLI_BRITANIA", 
          name: "BRITÂNIA ELETRODOMÉSTICOS", 
          tasks: [
            { id: "T_BRIT_01", title: "Renovação PGR 2026 - Unidade Fabril", type: "pgr", priority: "medium", status: "todo" }
          ]
        },
        { 
          cid: "CLI_GULA", 
          name: "GULA ALIMENTOS", 
          tasks: [
            { id: "T_GULA_01", title: "Triagem Forense de Atestados (NAI Forensic)", type: "pcmso", priority: "high", status: "review" }
          ]
        }
      ]

      cases.forEach(comp => {
        comp.tasks.forEach(t => {
          const taskRef = doc(db, "companies", comp.cid, "tasks", t.id)
          batch.set(taskRef, {
            ...t,
            companyId: comp.cid,
            companyName: comp.name,
            dueDate: now,
            createdAt: now,
            ai_risk_score: 85,
            checklist: [
              { id: '1', text: 'Coletar evidências de campo', checked: true, mandatory: true },
              { id: '2', text: 'Validar com Engenheiro Responsável', checked: false, mandatory: true }
            ]
          }, { merge: true })
        })
      })

      await batch.commit()
      toast({ title: "Casos Reais Importados", description: "Nativa, Britânia e TimeNow carregados no Kanban." })
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
            <Button 
              variant="outline" 
              onClick={handleImportRealCases} 
              disabled={isImporting}
              className="h-14 px-6 border-dashed border-primary/30 text-primary/60 hover:text-primary gap-2 rounded-2xl font-black uppercase text-[10px]"
            >
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
              <Button className="gradient-nextcon hover:opacity-90 text-white gap-2 h-14 px-8 font-black uppercase text-[10px] tracking-widest shadow-2xl shadow-primary/30 rounded-2xl">
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
                  <Input 
                    value={taskForm.title} 
                    onChange={e => setTaskForm({...taskForm, title: e.target.value})} 
                    className="bg-slate-50 border-none h-14 text-sm font-bold rounded-2xl shadow-inner"
                    placeholder="Ex: Atualização PGR Unidade Fabril"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Unidade Responsável</label>
                  <Select 
                    value={taskForm.companyId} 
                    onValueChange={v => setTaskForm({...taskForm, companyId: v})}
                    disabled={!isPrivileged && !!profile?.companyId}
                  >
                    <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {companies?.map(c => (
                        (!isPrivileged && c.id !== profile?.companyId) ? null : 
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Vertical</label>
                    <Select value={taskForm.type} onValueChange={v => setTaskForm({...taskForm, type: v as TaskType})}>
                      <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pgr">NR-01 / PGR</SelectItem>
                        <SelectItem value="pcmso">NR-07 / PCMSO</SelectItem>
                        <SelectItem value="esocial">eSocial (S-2240)</SelectItem>
                        <SelectItem value="treinamento">Capacitação</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Criticidade</label>
                    <Select value={taskForm.priority} onValueChange={v => setTaskForm({...taskForm, priority: v as Priority})}>
                      <SelectTrigger className="bg-slate-50 border-none h-14 text-xs font-bold rounded-2xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="critical">Crítica (Interdição)</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleCreateTask} className="w-full h-16 gradient-nextcon font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl">
                <Sparkles className="size-5 text-accent mr-2" /> Ativar Fluxo de Auditoria
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Eficiência Operacional" value="94.2%" icon={ShieldCheck} color="text-emerald-600" trend="+2.1%" />
        <StatCard label="Capacidade Técnica" value="88%" icon={Activity} color="text-blue-600" trend="Estável" />
        <StatCard label="Fila de Espera" value={loadingTasks ? "..." : tasks?.length || 0} icon={LayoutGrid} color="text-accent" />
      </div>

      <div className="min-h-[600px] glass-panel rounded-[3rem] p-8">
         {loadingTasks ? (
           <div className="flex flex-col items-center justify-center h-96 gap-4 opacity-30">
             <Loader2 className="size-12 animate-spin" />
             <p className="text-xs font-black uppercase tracking-widest">Sincronizando Operações...</p>
           </div>
         ) : (
           <KanbanBoard tasks={tasks || []} />
         )}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, trend }: any) {
  return (
    <Card className="glass-panel border-none p-6 group hover:scale-[1.02] transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
          <div className="flex items-baseline gap-3">
            <h3 className="text-3xl font-black text-primary font-headline">{value}</h3>
            {trend && (
              <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", trend.includes('+') ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600")}>
                {trend}
              </span>
            )}
          </div>
        </div>
        <div className={cn("p-3 rounded-2xl bg-white/50 shadow-inner group-hover:rotate-12 transition-transform", color)}>
          <Icon className="size-6" />
        </div>
      </div>
    </Card>
  )
}
