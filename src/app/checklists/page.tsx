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
  AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
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

const CHECKLIST_CATALOG = [
  { id: "nr01", category: "Gestão", title: "NR-01 - Gerenciamento de Riscos (PGR)", icon: ShieldAlert, color: "text-red-600" },
  { id: "nr07", category: "Saúde", title: "NR-07 - PCMSO", icon: HeartPulse, color: "text-emerald-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Hammer, color: "text-yellow-500" },
  { id: "nr12", category: "Máquinas", title: "NR-12 - Máquinas e Equipamentos", icon: BookOpen, color: "text-gray-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Construção Civil", icon: Building2, color: "text-orange-500" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: Layers, color: "text-blue-500" },
]

type ChecklistStatus = 'C' | 'NC' | 'NA' | null;

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [searchTerm, setSearchTerm] = React.useState("")

  // Estados do Checklist
  const [isChecklistOpen, setIsChecklistOpen] = React.useState(false)
  const [activeNR, setActiveNR] = React.useState<NRChecklist | null>(null)
  const [responses, setResponses] = React.useState<Record<string, ChecklistStatus>>({})
  const [expandedHelp, setExpandedHelp] = React.useState<Record<string, boolean>>({})
  const [selectedLawItem, setSelectedLawItem] = React.useState<ChecklistItem | null>(null)
  
  // Alerta de Risco Grave (Protocolo Ativo)
  const [criticalAlertOpen, setCriticalAlertOpen] = React.useState(false)
  const [lastCriticalItem, setLastCriticalItem] = React.useState<ChecklistItem | null>(null)

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  const filteredCatalog = React.useMemo(() => {
    return CHECKLIST_CATALOG.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleOpenChecklist = (nrId: string, title: string) => {
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Empresa Obrigatória", description: "Selecione um cliente antes de iniciar." });
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
    
    // --- LÓGICA DE NÃO CONFORMIDADE ATIVA ---
    if (status === 'NC' && item.criticality === 'critical') {
      setLastCriticalItem(item);
      setCriticalAlertOpen(true);
    }
  }

  const checklistProgress = React.useMemo(() => {
    if (!activeNR) return 0;
    const answered = Object.values(responses).filter(v => v !== null).length;
    return (answered / activeNR.items.length) * 100;
  }, [responses, activeNR])

  const getCriticalityBadge = (criticality: string) => {
    switch(criticality) {
      case 'critical': return { label: 'CRÍTICO', class: 'bg-slate-950 text-white shadow-lg' };
      case 'high': return { label: 'ALTO', class: 'bg-red-100 text-red-700' };
      case 'medium': return { label: 'MÉDIO', class: 'bg-orange-100 text-orange-700' };
      case 'low': return { label: 'BAIXO', class: 'bg-blue-100 text-blue-700' };
      default: return { label: 'BAIXO', class: 'bg-blue-100 text-blue-700' };
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Audit System NAI 2026</h1>
          <p className="text-muted-foreground font-medium">Motor de conformidade ativa e inspeção de campo.</p>
        </div>
        <div className="w-full md:w-72">
          <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Unidade em Auditoria:</label>
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="bg-white border-muted h-11 text-xs shadow-sm">
              <SelectValue placeholder="Selecione o Cliente" />
            </SelectTrigger>
            <SelectContent>
              {companies?.map(c => (
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
            placeholder="Buscar Norma ou Requisito..." 
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

      {/* Dialog do Checklist Ativo */}
      <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-[2rem]">
          <DialogHeader className="p-8 bg-primary text-white shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-headline font-black uppercase flex items-center gap-3">
                  <ClipboardCheck className="size-8 text-accent" /> {activeNR?.nr} - Auditoria Inteligente
                </DialogTitle>
                <DialogDescription className="text-white/70 font-bold uppercase text-[10px] mt-2">
                  Unidade: {companies?.find(c => c.id === selectedCompanyId)?.name}
                </DialogDescription>
              </div>
              <div className="text-right">
                <Badge className="bg-accent text-primary font-black mb-2">{Math.round(checklistProgress)}%</Badge>
                <p className="text-[9px] font-black text-white/40 uppercase">Inspeção em Tempo Real</p>
              </div>
            </div>
            <Progress value={checklistProgress} className="h-2 mt-6 bg-white/10" />
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
            <div className="space-y-6">
              {activeNR?.items.map((item) => {
                const criticalityInfo = getCriticalityBadge(item.criticality);
                const isCritical = item.criticality === 'critical';
                
                return (
                  <Card key={item.id} className={cn(
                    "border-none shadow-sm bg-white overflow-hidden transition-all",
                    isCritical ? "ring-1 ring-red-100 bg-red-50/5" : ""
                  )}>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge variant="outline" className="text-[9px] font-black border-primary/20 text-primary uppercase">Item {item.legal_ref}</Badge>
                              <Badge className={cn("text-[9px] font-black uppercase border-none", criticalityInfo.class)}>
                                {criticalityInfo.label}
                              </Badge>
                              <button 
                                onClick={() => setSelectedLawItem(item)}
                                className="size-7 flex items-center justify-center rounded-full bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all"
                                title="Ver Texto da Norma (📜)"
                              >
                                <Gavel className="size-3.5" />
                              </button>
                            </div>
                            <p className="text-base font-bold text-primary leading-tight">{item.question}</p>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 shrink-0 md:w-auto w-full">
                            <Button 
                              size="lg" 
                              variant="outline"
                              onClick={() => handleStatusChange(item, 'C')}
                              className={cn(
                                "flex-1 md:flex-none h-14 px-6 font-black text-[10px] uppercase tracking-widest transition-all",
                                responses[item.id] === 'C' ? "bg-emerald-500 text-white border-none shadow-lg scale-105" : "text-emerald-600 border-emerald-100 hover:bg-emerald-50"
                              )}
                            >
                              CONFORME
                            </Button>
                            <Button 
                              size="lg" 
                              variant="outline"
                              onClick={() => handleStatusChange(item, 'NC')}
                              className={cn(
                                "flex-1 md:flex-none h-14 px-6 font-black text-[10px] uppercase tracking-widest transition-all",
                                responses[item.id] === 'NC' ? "bg-red-500 text-white border-none shadow-lg scale-105" : "text-red-600 border-red-100 hover:bg-red-50"
                              )}
                            >
                              NÃO CONFORME
                            </Button>
                            <Button 
                              size="lg" 
                              variant="outline"
                              onClick={() => handleStatusChange(item, 'NA')}
                              className={cn(
                                "flex-1 md:flex-none h-14 px-6 font-black text-[10px] uppercase tracking-widest transition-all",
                                responses[item.id] === 'NA' ? "bg-slate-500 text-white border-none shadow-lg" : "text-slate-600 border-slate-100 hover:bg-slate-50"
                              )}
                            >
                              NÃO AVALIADO
                            </Button>
                          </div>
                        </div>

                        {/* Evidência Fotográfica Obrigatória */}
                        {isCritical && responses[item.id] === 'C' && (
                          <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center justify-between border border-blue-100 animate-in slide-in-from-top-2">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                <Camera className="size-4" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-blue-700 uppercase">Evidência Obrigatória</p>
                                <p className="text-[11px] text-blue-600">Capture uma foto para validar este item crítico.</p>
                              </div>
                            </div>
                            <Button size="sm" className="bg-blue-600 text-white gap-2 font-bold text-[10px] uppercase">
                              <Camera className="size-3" /> Abrir Câmera
                            </Button>
                          </div>
                        )}

                        <div className="border-t border-dashed pt-4">
                          <button 
                            onClick={() => setExpandedHelp(prev => ({...prev, [item.id]: !prev[item.id]}))}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:text-primary transition-colors"
                          >
                            <Info className="size-3" /> NAI Advisor (O que observar?)
                            {expandedHelp[item.id] ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                          </button>
                          {expandedHelp[item.id] && (
                            <div className="mt-3 p-4 bg-muted/30 rounded-xl border border-muted text-[11px] leading-relaxed text-primary/80 italic">
                              {item.help_text}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Seção de Assinaturas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Assinatura do Inspetor</label>
                  <div className="h-32 bg-white border-2 border-dashed border-muted rounded-2xl flex items-center justify-center text-muted-foreground/40 hover:border-primary/20 transition-all cursor-pointer">
                    <PenTool className="size-8" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Assinatura do Responsável</label>
                  <div className="h-32 bg-white border-2 border-dashed border-muted rounded-2xl flex items-center justify-center text-muted-foreground/40 hover:border-primary/20 transition-all cursor-pointer">
                    <PenTool className="size-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-white border-t shrink-0 flex justify-between items-center sm:justify-between">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase text-muted-foreground">
              <ShieldAlert className="size-3" /> Segurança de Dados LGPD
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setIsChecklistOpen(false)} className="font-black uppercase text-[10px] h-12 px-6">Descartar</Button>
              <Button 
                disabled={checklistProgress < 100}
                className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-10 h-12 shadow-xl shadow-primary/20"
              >
                <Sparkles className="size-4 text-accent mr-2" /> Finalizar Auditoria
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Base Legal (📜) */}
      <Dialog open={!!selectedLawItem} onOpenChange={() => setSelectedLawItem(null)}>
        <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-[#090e24] text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <BookOpen className="size-5 text-accent" />
              </div>
              <Badge variant="outline" className="text-accent font-black uppercase border-accent/20">Ref: {selectedLawItem?.legal_ref}</Badge>
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">{activeNR?.nr} - Conteúdo Normativo</DialogTitle>
          </DialogHeader>
          <div className="p-8 bg-white">
            <div className="bg-muted/30 p-8 rounded-[2rem] border border-muted-foreground/5 shadow-inner">
              <p className="text-sm leading-relaxed text-primary/90 font-medium italic">
                "{selectedLawItem?.legal_text || "O conteúdo integral desta cláusula está sendo sincronizado com a base oficial do MTE 2026."}"
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
              <Info className="size-3" /> Fonte: Portal Gov.br / Inspeção do Trabalho
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alerta de Risco Grave (Não Conformidade Ativa) */}
      <AlertDialog open={criticalAlertOpen} onOpenChange={setCriticalAlertOpen}>
        <AlertDialogContent className="bg-red-50 border-red-200 rounded-[3rem] p-10 max-w-xl">
          <AlertDialogHeader>
            <div className="mx-auto size-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
              <ShieldX className="size-14" />
            </div>
            <AlertDialogTitle className="text-3xl font-black text-red-950 uppercase text-center leading-none">
              Risco Grave e Iminente!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-red-900 font-bold text-center text-base mt-4">
              Detectamos uma Não Conformidade em um item **CRÍTICO** ({lastCriticalItem?.legal_ref}). 
              Isso pode resultar em acidentes fatais, multas gravíssimas ou interdição legal imediata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-8 p-6 bg-white/50 rounded-2xl border border-red-200">
            <p className="text-[10px] font-black text-red-600 uppercase mb-1">Item Violado:</p>
            <p className="text-sm font-bold text-red-950 leading-tight">{lastCriticalItem?.question}</p>
          </div>
          <AlertDialogFooter className="sm:justify-center gap-3">
            <AlertDialogCancel className="bg-white border-red-200 text-red-900 font-bold uppercase text-xs h-14 px-8 rounded-2xl">
              Apenas Registrar
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs h-14 px-8 rounded-2xl shadow-xl shadow-red-600/20">
              <AlertTriangle className="size-4 mr-2" /> Abrir Plano Urgente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
