"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Loader2, 
  ShieldAlert, 
  HeartPulse, 
  Building2, 
  Hammer, 
  CheckCircle2,
  FileText,
  Sparkles,
  Layers,
  Search,
  Info,
  ChevronDown,
  ChevronUp,
  Gavel,
  ShieldX,
  Camera,
  BookOpen,
  PenTool,
  AlertTriangle,
  Save,
  Zap,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useStorage, useDoc } from "@/firebase"
import { collection, query, orderBy, addDoc, doc } from "firebase/firestore"
import { ref, uploadBytes } from "firebase/storage"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { NR_CHECKLISTS, getGenericChecklist, NRChecklist, ChecklistItem } from "@/lib/nr-data"
import { STORAGE_PATHS } from "@/lib/storage-paths"
import { addDocumentNonBlocking } from "@/firebase/non-blocking-updates"

const CHECKLIST_CATALOG = [
  { id: "nr01", category: "Gestão", title: "NR-01 - Gerenciamento de Riscos (PGR)", icon: ShieldAlert, color: "text-red-600" },
  { id: "nr07", category: "Saúde", title: "NR-07 - PCMSO", icon: HeartPulse, color: "text-emerald-600" },
  { id: "nr09", category: "Ambiental", title: "NR-09 - Agentes Nocivos", icon: Layers, color: "text-blue-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Hammer, color: "text-yellow-500" },
  { id: "nr12", category: "Máquinas", title: "NR-12 - Máquinas e Equipamentos", icon: BookOpen, color: "text-gray-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Construção Civil", icon: Building2, color: "text-orange-500" },
  { id: "nr33", category: "Confinado", title: "NR-33 - Espaço Confinado", icon: Zap, color: "text-purple-600" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: Layers, color: "text-blue-500" },
]

type ChecklistStatus = 'CONFORME' | 'NÃO CONFORME' | 'NÃO AVALIADO' | null;

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [searchTerm, setSearchTerm] = React.useState("")

  const [isChecklistOpen, setIsChecklistOpen] = React.useState(false)
  const [isFinalizing, setIsFinalizing] = React.useState(false)
  const [activeNR, setActiveNR] = React.useState<NRChecklist | null>(null)
  const [responses, setResponses] = React.useState<Record<string, ChecklistStatus>>({})
  const [expandedHelp, setExpandedHelp] = React.useState<Record<string, boolean>>({})
  
  const [criticalAlertOpen, setCriticalAlertOpen] = React.useState(false)
  const [lastCriticalItem, setLastCriticalItem] = React.useState<ChecklistItem | null>(null)
  const [isCreatingUrgentTask, setIsCreatingUrgentTask] = React.useState(false)

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
    }
  }, [profile, isPrivileged]);

  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])
  const { data: companies, isLoading: loadingCompanies } = useCollection(companiesQuery)

  const filteredCatalog = React.useMemo(() => {
    return CHECKLIST_CATALOG.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleOpenChecklist = (nrId: string, title: string) => {
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Unidade Obrigatória", description: "Selecione uma unidade antes de iniciar a inspeção." });
      return;
    }
    const config = NR_CHECKLISTS[nrId] || getGenericChecklist(nrId.toUpperCase(), title);
    setActiveNR(config);
    setResponses({});
    setExpandedHelp({});
    setIsChecklistOpen(true);
  }

  const handleStatusChange = (item: ChecklistItem, status: ChecklistStatus) => {
    setResponses(prev => ({ ...prev, [item.id]: status }));
    
    if (status === 'NÃO CONFORME' && item.criticality === 'critical') {
      setLastCriticalItem(item);
      setCriticalAlertOpen(true);
    }
  }

  const handleCreateUrgentAction = async () => {
    if (!user || !db || !lastCriticalItem || !selectedCompanyId) return;
    
    setIsCreatingUrgentTask(true);
    try {
      const company = companies?.find(c => c.id === selectedCompanyId);
      const tasksRef = collection(db, "companies", selectedCompanyId, "tasks");
      
      const urgentTask = {
        title: `URGENTE: Falha Crítica ${activeNR?.nr} - ${lastCriticalItem.category}`,
        companyId: selectedCompanyId,
        companyName: company?.name || "Unidade em Inspeção",
        type: activeNR?.nr.toLowerCase().replace('-', '') as any,
        status: "todo",
        priority: "critical",
        dueDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        ai_risk_score: 95,
        checklist: [
          { id: '1', text: `Corrigir: ${lastCriticalItem.question}`, checked: false, mandatory: true },
          { id: '2', text: 'Validar Medida de Engenharia', checked: false, mandatory: true }
        ]
      };

      await addDocumentNonBlocking(tasksRef, urgentTask);
      toast({ title: "Plano de Ação Criado com Sucesso" });
      setCriticalAlertOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao criar ação corretiva" });
    } finally {
      setIsCreatingUrgentTask(false);
    }
  }

  const checklistProgress = React.useMemo(() => {
    if (!activeNR) return 0;
    const answered = Object.values(responses).filter(v => v !== null).length;
    return (answered / activeNR.items.length) * 100;
  }, [responses, activeNR])

  const handleFinalizeAuditoria = async () => {
    if (!user || !storage || !db || !activeNR || !selectedCompanyId) return;

    setIsFinalizing(true);
    try {
      const company = companies?.find(c => c.id === selectedCompanyId);
      const auditData = {
        nr: activeNR.nr,
        nrTitle: activeNR.title,
        companyId: selectedCompanyId,
        companyName: company?.name || "Unidade Desconhecida",
        auditorId: user.uid,
        timestamp: new Date().toISOString(),
        responses: responses,
        progress: Math.round(checklistProgress),
        status: checklistProgress === 100 ? 'COMPLETED' : 'PARTIAL'
      };

      const storagePath = STORAGE_PATHS.FIELD_INSPECTION(selectedCompanyId, activeNR.nr);
      const storageRef = ref(storage, storagePath);
      const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
      await uploadBytes(storageRef, blob);

      await addDoc(collection(db, "companies", selectedCompanyId, "reports"), {
        reportType: activeNR.nr.toLowerCase().replace('-', ''),
        name: `Inspeção de Campo - ${activeNR.nr}`,
        companyId: selectedCompanyId,
        companyName: company?.name,
        storagePath: storagePath,
        createdAt: new Date().toISOString(),
        analysisData: {
          aiInsight: `Inspeção ${activeNR.nr} finalizada com ${auditData.progress}% de cobertura técnica.`
        }
      });

      toast({ title: "Auditoria Finalizada e Protocolada!" });
      setIsChecklistOpen(false);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro ao Salvar Protocolo" });
    } finally {
      setIsFinalizing(false);
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Inspeção de Campo</h1>
          <p className="text-muted-foreground font-medium">Motor de conformidade ativa e auditoria técnica 2026.</p>
        </div>
        <div className="w-full md:w-72">
          <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Unidade em Auditoria:</label>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId} disabled={!isPrivileged}>
            <SelectTrigger className="bg-white border-muted h-11 text-xs shadow-sm">
              <SelectValue placeholder={loadingCompanies ? "Carregando..." : "Selecione o Cliente"} />
            </SelectTrigger>
            <SelectContent>
              {companies?.map(c => (
                (!isPrivileged && c.id !== profile?.companyId) ? null :
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar Norma ou Requisito Técnico..." 
            className="pl-10 h-11 bg-white border-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCatalog.map((item) => {
          const Icon = item.icon
          return (
            <Card 
              key={item.id} 
              className="cursor-pointer hover:ring-2 ring-primary/10 transition-all group bg-white border-none card-shadow"
              onClick={() => handleOpenChecklist(item.id, item.title)}
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className={cn("p-3 rounded-xl bg-muted/50 group-hover:bg-primary group-hover:text-white transition-all shrink-0", item.color)}>
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase opacity-50 truncate">{item.category}</p>
                  <h3 className="text-[11px] font-bold text-primary leading-tight line-clamp-2">{item.title}</h3>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={isChecklistOpen} onOpenChange={(open) => !isFinalizing && setIsChecklistOpen(open)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-[2rem]">
          <DialogHeader className="p-8 bg-primary text-white shrink-0 relative">
            <button onClick={() => setIsChecklistOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors">
              <X className="size-5" />
            </button>
            <DialogTitle className="text-2xl font-headline font-black uppercase flex items-center gap-3">
              <ClipboardCheck className="size-8 text-accent" /> {activeNR?.nr} - Auditoria Inteligente
            </DialogTitle>
            <DialogDescription className="text-white/70 font-bold uppercase text-[10px] mt-2">
              Unidade: {companies?.find(c => c.id === selectedCompanyId)?.name || "Selecione Unidade"}
            </DialogDescription>
            <Progress value={checklistProgress} className="h-2 mt-6 bg-white/10" />
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
            {activeNR?.items.map((item) => (
              <div key={item.id} className="p-6 bg-white rounded-3xl border mb-4 shadow-sm group hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary/60">{item.category}</Badge>
                      {item.criticality === 'critical' && <Badge className="bg-red-100 text-red-700 border-none text-[8px] font-black uppercase">Risco Grave</Badge>}
                    </div>
                    <h4 className="text-sm font-bold text-primary leading-tight">{item.id}. {item.question}</h4>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 rounded-full hover:bg-primary/5" onClick={() => setExpandedHelp(prev => ({...prev, [item.id]: !prev[item.id]}))}>
                    <Info className={cn("size-4 transition-colors", expandedHelp[item.id] ? "text-primary" : "text-slate-300")} />
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {(['CONFORME', 'NÃO CONFORME', 'NÃO AVALIADO'] as ChecklistStatus[]).map((status) => (
                    <Button
                      key={status}
                      variant={responses[item.id] === status ? 'default' : 'outline'}
                      className={cn(
                        "h-10 text-[9px] font-black uppercase rounded-xl transition-all",
                        responses[item.id] === status && status === 'NÃO CONFORME' ? 'bg-red-600 hover:bg-red-700' : 
                        responses[item.id] === status && status === 'CONFORME' ? 'bg-accent hover:bg-accent/90' : 
                        responses[item.id] === status ? 'bg-primary' : 'hover:bg-primary/5 border-slate-200'
                      )}
                      onClick={() => handleStatusChange(item, status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>

                {expandedHelp[item.id] && (
                  <div className="mt-4 p-5 bg-blue-50 rounded-2xl border border-blue-100 text-[11px] animate-in slide-in-from-top-2 duration-300">
                    <p className="font-black text-blue-800 flex items-center gap-2 mb-2 uppercase tracking-widest">
                      <Gavel className="size-3" /> Referência: {item.legal_ref}
                    </p>
                    {item.legal_text && <p className="text-blue-700/70 italic mb-3 leading-relaxed border-l-2 border-blue-200 pl-3">"{item.legal_text}"</p>}
                    <div className="flex gap-3 items-start p-3 bg-white/50 rounded-xl">
                      <Zap className="size-4 text-accent shrink-0 mt-0.5" />
                      <p className="text-blue-900 font-bold">Dica NAI: {item.help_text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="p-6 bg-white border-t shrink-0 flex justify-between items-center sm:justify-between">
            <div className="text-[10px] font-black uppercase text-slate-400">NAI Technical Auditing</div>
            <div className="flex gap-2">
              <Button variant="ghost" className="font-bold uppercase text-[10px]" onClick={() => setIsChecklistOpen(false)} disabled={isFinalizing}>Fechar</Button>
              <Button 
                onClick={handleFinalizeAuditoria} 
                disabled={checklistProgress < 100 || isFinalizing}
                className="bg-primary hover:bg-primary/90 text-white font-black uppercase text-[10px] tracking-widest px-8 rounded-xl shadow-lg shadow-primary/20"
              >
                {isFinalizing ? <Loader2 className="size-4 animate-spin" /> : "Finalizar Auditoria"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={criticalAlertOpen} onOpenChange={setCriticalAlertOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-none p-10 shadow-2xl">
          <AlertDialogHeader className="flex flex-col items-center text-center">
            <div className="size-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 animate-pulse">
              <AlertTriangle size={40} />
            </div>
            <AlertDialogTitle className="text-2xl font-headline font-black uppercase text-red-700">Falha Crítica Identificada</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 font-medium text-sm mt-4">
              Você marcou uma **NÃO CONFORME** em um item de criticidade elevada. Deseja que a NAI gere automaticamente uma **Intervenção Urgente** no Kanban para o Engenheiro Responsável?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-10 gap-3 sm:justify-center">
            <AlertDialogCancel className="rounded-xl h-14 px-8 font-bold uppercase text-[10px]">Ignorar por agora</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleCreateUrgentAction}
              disabled={isCreatingUrgentTask}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-14 px-10 font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl shadow-red-600/20"
            >
              {isCreatingUrgentTask ? <Loader2 className="size-4 animate-spin" /> : <Zap className="size-4" />}
              Ativar Plano de Ação
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}