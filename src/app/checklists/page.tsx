"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Loader2, 
  ShieldAlert, 
  HeartPulse, 
  Building2, 
  Hammer, 
  ArrowUpCircle, 
  Zap,
  CheckCircle2,
  FileText,
  Sparkles,
  CloudUpload,
  Layers,
  Search,
  Filter,
  Ban,
  Users,
  ShieldCheck,
  Thermometer,
  Truck,
  Settings,
  Gauge,
  Flame,
  Bomb,
  Droplets,
  Sun,
  Mountain,
  Bath,
  Trash2,
  AlertTriangle,
  Scale,
  Anchor,
  Ship,
  Leaf,
  Stethoscope,
  Box,
  Utensils,
  HardHat,
  Recycle,
  Check,
  AlertOctagon,
  MinusCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Gavel,
  ShieldX,
  Camera,
  BookOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useStorage } from "@/firebase"
import { collection, addDoc, query, orderBy } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { classifyDocument } from "@/ai/flows/document-classifier-flow"
import { STORAGE_PATHS } from "@/lib/storage-paths"
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
  { id: "nr03", category: "Legal", title: "NR-03 - Embargo e Interdição", icon: Ban, color: "text-red-700" },
  { id: "nr04", category: "Gestão", title: "NR-04 - SESMT", icon: Users, color: "text-blue-600" },
  { id: "nr05", category: "Gestão", title: "NR-05 - CIPA", icon: Users, color: "text-emerald-600" },
  { id: "nr06", category: "EPI", title: "NR-06 - Equipamentos de Proteção Individual", icon: ShieldCheck, color: "text-blue-500" },
  { id: "nr07", category: "Saúde", title: "NR-07 - PCMSO", icon: HeartPulse, color: "text-emerald-600" },
  { id: "nr08", category: "Infra", title: "NR-08 - Edificações", icon: Building2, color: "text-gray-600" },
  { id: "nr09", category: "Higiene", title: "NR-09 - Avaliação de Exposições", icon: Thermometer, color: "text-orange-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Zap, color: "text-yellow-500" },
  { id: "nr11", category: "Logística", title: "NR-11 - Transporte e Movimentação", icon: Truck, color: "text-blue-700" },
  { id: "nr12", category: "Máquinas", title: "NR-12 - Máquinas e Equipamentos", icon: Settings, color: "text-gray-700" },
  { id: "nr13", category: "Técnico", title: "NR-13 - Vasos de Pressão", icon: Gauge, color: "text-blue-400" },
  { id: "nr14", category: "Técnico", title: "NR-14 - Fornos", icon: Flame, color: "text-orange-700" },
  { id: "nr15", category: "Legal", title: "NR-15 - Insalubridade", icon: Hammer, color: "text-blue-800" },
  { id: "nr16", category: "Legal", title: "NR-16 - Periculosidade", icon: Zap, color: "text-red-500" },
  { id: "nr17", category: "Ergonomia", title: "NR-17 - Ergonomia", icon: BookOpen, color: "text-blue-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Construção Civil", icon: HardHat, color: "text-orange-500" },
  { id: "nr33", category: "Espaço", title: "NR-33 - Espaços Confinados", icon: Box, color: "text-blue-600" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
]

type ChecklistStatus = 'C' | 'NC' | 'NA' | null;

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("all")

  // Estados do Checklist
  const [isChecklistOpen, setIsChecklistOpen] = React.useState(false)
  const [activeNR, setActiveNR] = React.useState<NRChecklist | null>(null)
  const [responses, setResponses] = React.useState<Record<string, ChecklistStatus>>({})
  const [expandedHelp, setExpandedHelp] = React.useState<Record<string, boolean>>({})
  const [selectedLawItem, setSelectedLawItem] = React.useState<ChecklistItem | null>(null)
  
  // Alerta de Risco Grave
  const [criticalAlertOpen, setCriticalAlertOpen] = React.useState(false)
  const [lastCriticalItem, setLastCriticalItem] = React.useState<ChecklistItem | null>(null)

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  const filteredCatalog = React.useMemo(() => {
    return CHECKLIST_CATALOG.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.id.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === "all" || item.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, filterCategory])

  const handleOpenChecklist = (nrId: string, title: string) => {
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Empresa Obrigatória", description: "Selecione um cliente no topo da página antes de iniciar o checklist." });
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
    
    // Lógica de Intervenção Ativa para NC Crítico
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
      case 'critical': return { label: 'CRÍTICO', class: 'bg-slate-900 text-white' };
      case 'high': return { label: 'ALTO', class: 'bg-red-100 text-red-700' };
      case 'medium': return { label: 'MÉDIO', class: 'bg-orange-100 text-orange-700' };
      case 'low': return { label: 'BAIXO', class: 'bg-blue-100 text-blue-700' };
      default: return { label: 'BAIXO', class: 'bg-blue-100 text-blue-700' };
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Audit System NAI</h1>
          <p className="text-muted-foreground font-medium">Gestão normativa e inteligência de inspeção 2026.</p>
        </div>
        <div className="w-full md:w-72">
          <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Auditando Unidade:</label>
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2 font-bold uppercase text-[10px]">Catálogo NRs 2026</TabsTrigger>
          <TabsTrigger value="scanner" className="rounded-lg gap-2 font-bold uppercase text-[10px]">
            <Layers className="size-4 text-[#00b4ff]" /> Scanner em Lote
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2 font-bold uppercase text-[10px]">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar Norma (ex: NR-12, Altura, PET)..." 
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
        </TabsContent>
      </Tabs>

      {/* Dialog do Checklist Ativo */}
      <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="p-6 bg-primary text-white">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-headline font-black uppercase flex items-center gap-2">
                  <ClipboardCheck className="size-6 text-accent" /> {activeNR?.nr} - Auditoria de Campo
                </DialogTitle>
                <DialogDescription className="text-white/70 font-bold uppercase text-[10px] mt-1">
                  Unidade: {companies?.find(c => c.id === selectedCompanyId)?.name}
                </DialogDescription>
              </div>
              <Badge className="bg-accent text-primary font-black">{Math.round(checklistProgress)}%</Badge>
            </div>
            <Progress value={checklistProgress} className="h-1.5 mt-4 bg-white/20" />
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
            <div className="space-y-4">
              {activeNR?.items.map((item) => {
                const criticalityInfo = getCriticalityBadge(item.criticality);
                return (
                  <Card key={item.id} className={cn(
                    "border-none shadow-sm bg-white overflow-hidden transition-all",
                    item.criticality === 'critical' ? "ring-1 ring-red-100" : ""
                  )}>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary uppercase">Item {item.legal_ref}</Badge>
                              <Badge className={cn("text-[8px] font-black uppercase border-none", criticalityInfo.class)}>
                                {criticalityInfo.label}
                              </Badge>
                              <button 
                                onClick={() => setSelectedLawItem(item)}
                                className="text-slate-400 hover:text-primary transition-colors"
                                title="Ver Base Legal"
                              >
                                <Gavel className="size-3.5" />
                              </button>
                            </div>
                            <p className="text-sm font-bold text-primary leading-snug">{item.question}</p>
                          </div>
                          
                          <div className="flex gap-1 shrink-0">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(item, 'C')}
                              className={cn(
                                "h-10 px-4 font-black text-[10px]",
                                responses[item.id] === 'C' ? "bg-emerald-500 text-white border-none shadow-md" : "text-emerald-600 border-emerald-100"
                              )}
                            >
                              C
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(item, 'NC')}
                              className={cn(
                                "h-10 px-4 font-black text-[10px]",
                                responses[item.id] === 'NC' ? "bg-red-500 text-white border-none shadow-md" : "text-red-600 border-red-100"
                              )}
                            >
                              NC
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleStatusChange(item, 'NA')}
                              className={cn(
                                "h-10 px-4 font-black text-[10px]",
                                responses[item.id] === 'NA' ? "bg-slate-500 text-white border-none shadow-md" : "text-slate-600 border-slate-100"
                              )}
                            >
                              NA
                            </Button>
                          </div>
                        </div>

                        {item.criticality === 'critical' && responses[item.id] === 'C' && (
                          <div className="bg-blue-50 p-2 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-1">
                            <Camera className="size-3 text-primary" />
                            <span className="text-[9px] font-bold text-primary uppercase">Evidência fotográfica recomendada para este item.</span>
                          </div>
                        )}

                        <div className="border-t border-dashed pt-3">
                          <button 
                            onClick={() => setExpandedHelp(prev => ({...prev, [item.id]: !prev[item.id]}))}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:text-primary transition-colors"
                          >
                            <Info className="size-3" /> Guia NAI Advisor
                            {expandedHelp[item.id] ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                          </button>
                          {expandedHelp[item.id] && (
                            <p className="mt-2 p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-[11px] leading-relaxed text-primary/80 italic">
                              {item.help_text}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <DialogFooter className="p-4 bg-white border-t">
            <Button variant="ghost" onClick={() => setIsChecklistOpen(false)} className="font-black uppercase text-[10px]">Cancelar</Button>
            <Button 
              disabled={checklistProgress < 100}
              className="bg-primary text-white font-black uppercase text-[10px] tracking-widest px-8 h-12"
            >
              <Sparkles className="size-4 text-accent mr-2" /> Finalizar Inspeção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Base Legal */}
      <Dialog open={!!selectedLawItem} onOpenChange={() => setSelectedLawItem(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-primary font-black uppercase border-primary/20">NR-Ref: {selectedLawItem?.legal_ref}</Badge>
            </div>
            <DialogTitle className="text-xl font-black text-primary uppercase">{activeNR?.nr} - Embasamento Legal</DialogTitle>
          </DialogHeader>
          <div className="bg-muted/30 p-6 rounded-2xl border border-muted-foreground/10">
            <p className="text-sm leading-relaxed text-primary/80 font-medium italic">
              "{selectedLawItem?.legal_text || "O conteúdo integral desta cláusula está sendo atualizado pela base legal 2026."}"
            </p>
          </div>
          <div className="text-[10px] text-muted-foreground uppercase font-bold text-center mt-4">
            Fonte: Portal do Governo Federal / MTE 2026
          </div>
        </DialogContent>
      </Dialog>

      {/* Alerta de Risco Grave */}
      <AlertDialog open={criticalAlertOpen} onOpenChange={setCriticalAlertOpen}>
        <AlertDialogContent className="bg-red-50 border-red-200 rounded-[2.5rem]">
          <AlertDialogHeader>
            <div className="mx-auto size-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <ShieldX className="size-10" />
            </div>
            <AlertDialogTitle className="text-2xl font-black text-red-900 uppercase text-center">Risco Grave e Iminente!</AlertDialogTitle>
            <AlertDialogDescription className="text-red-800 font-medium text-center">
              Você identificou uma Não Conformidade em um item **CRÍTICO** ({lastCriticalItem?.legal_ref}). 
              Isso pode resultar em acidentes graves ou interdição legal imediata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-2 mt-6">
            <AlertDialogCancel className="bg-white border-red-200 text-red-900 font-bold uppercase text-xs h-12 px-6">
              Apenas Registrar
            </AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs h-12 px-6">
              Abrir Plano de Ação Urgente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
