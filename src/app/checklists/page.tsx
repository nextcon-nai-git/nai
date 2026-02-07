"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Loader2, 
  ShieldAlert, 
  Plus, 
  HeartPulse, 
  Building2, 
  Hammer, 
  ArrowUpCircle, 
  Zap,
  CheckCircle2,
  FileText,
  Sparkles,
  Brain,
  History,
  CloudUpload,
  Calendar as CalendarIcon,
  FileDown,
  Layers,
  X,
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
  MinusCircle
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
import { NR_CHECKLISTS, getGenericChecklist, NRChecklist } from "@/lib/nr-data"

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
  { id: "nr17", category: "Ergonomia", title: "NR-17 - Ergonomia", icon: Brain, color: "text-blue-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Construção Civil", icon: HardHat, color: "text-orange-500" },
  { id: "nr19", category: "Risco", title: "NR-19 - Explosivos", icon: Bomb, color: "text-red-600" },
  { id: "nr20", category: "Risco", title: "NR-20 - Inflamáveis", icon: Droplets, color: "text-red-500" },
  { id: "nr21", category: "Trabalho", title: "NR-21 - Trabalho a Céu Aberto", icon: Sun, color: "text-yellow-600" },
  { id: "nr22", category: "Mineração", title: "NR-22 - Mineração", icon: Mountain, color: "text-gray-800" },
  { id: "nr23", category: "Fogo", title: "NR-23 - Proteção Contra Incêndios", icon: Flame, color: "text-red-500" },
  { id: "nr24", category: "Conforto", title: "NR-24 - Condições Sanitárias", icon: Bath, color: "text-blue-300" },
  { id: "nr25", category: "Resíduos", title: "NR-25 - Resíduos Industriais", icon: Trash2, color: "text-emerald-700" },
  { id: "nr26", category: "Sinalização", title: "NR-26 - Sinalização de Segurança", icon: AlertTriangle, color: "text-yellow-600" },
  { id: "nr28", category: "Legal", title: "NR-28 - Fiscalização e Penalidades", icon: Scale, color: "text-blue-900" },
  { id: "nr29", category: "Porto", title: "NR-29 - Trabalho Portuário", icon: Anchor, color: "text-blue-900" },
  { id: "nr30", category: "Náutico", title: "NR-30 - Trabalho Aquaviário", icon: Ship, color: "text-blue-800" },
  { id: "nr31", category: "Rural", title: "NR-31 - Agrícola e Florestal", icon: Leaf, color: "text-green-600" },
  { id: "nr32", category: "Saúde", title: "NR-32 - Serviços de Saúde", icon: Stethoscope, color: "text-emerald-500" },
  { id: "nr33", category: "Espaço", title: "NR-33 - Espaços Confinados", icon: Box, color: "text-blue-600" },
  { id: "nr34", category: "Naval", title: "NR-34 - Construção Naval", icon: Ship, color: "text-blue-800" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
  { id: "nr36", category: "Alimentos", title: "NR-36 - Abate e Processamento", icon: Utensils, color: "text-red-400" },
  { id: "nr37", category: "Petróleo", title: "NR-37 - Plataformas de Petróleo", icon: HardHat, color: "text-gray-700" },
  { id: "nr38", category: "Limpeza", title: "NR-38 - Limpeza Urbana", icon: Recycle, color: "text-green-500" },
]

interface UploadingFile {
  id: string
  name: string
  status: 'CLASSIFYING' | 'ANALYZING' | 'UPLOADING' | 'COMPLETED' | 'ERROR'
  progress: number
  type?: string
  result?: any
}

type ChecklistStatus = 'C' | 'NC' | 'NA' | null;

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [uploadQueue, setUploadQueue] = React.useState<UploadingFile[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("all")

  // Estados para o Checklist Ativo
  const [isChecklistOpen, setIsChecklistOpen] = React.useState(false)
  const [activeNR, setActiveNR] = React.useState<NRChecklist | null>(null)
  const [responses, setResponses] = React.useState<Record<string, ChecklistStatus>>({})

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

  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(CHECKLIST_CATALOG.map(i => i.category)))
    return ["all", ...cats]
  }, [])

  const handleOpenChecklist = (nrId: string, title: string) => {
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Empresa Obrigatória", description: "Selecione um cliente no topo da página antes de iniciar o checklist." });
      return;
    }
    const config = NR_CHECKLISTS[nrId] || getGenericChecklist(nrId.toUpperCase(), title);
    setActiveNR(config);
    setResponses({});
    setIsChecklistOpen(true);
  }

  const handleStatusChange = (itemId: string, status: ChecklistStatus) => {
    setResponses(prev => ({ ...prev, [itemId]: status }));
  }

  const checklistProgress = React.useMemo(() => {
    if (!activeNR) return 0;
    const answered = Object.values(responses).filter(v => v !== null).length;
    return (answered / activeNR.items.length) * 100;
  }, [responses, activeNR])

  const handleFinishInspection = async () => {
    if (!user || !db || !activeNR) return;
    
    try {
      await addDoc(collection(db, "clients", user.uid, "inspections"), {
        companyId: selectedCompanyId,
        nr: activeNR.nr,
        responses,
        score: Object.values(responses).filter(v => v === 'C').length / activeNR.items.length * 100,
        createdAt: new Date().toISOString(),
        technician: user.email
      });
      
      toast({ title: "Inspeção Finalizada", description: `Dados da ${activeNR.nr} salvos com sucesso.` });
      setIsChecklistOpen(false);
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao salvar inspeção" });
    }
  }

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Empresa Não Selecionada", description: "Selecione um cliente antes de subir os documentos." })
      return
    }

    const newUploads: UploadingFile[] = Array.from(files).map(f => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      status: 'CLASSIFYING',
      progress: 10
    }))

    setUploadQueue(prev => [...newUploads, ...prev])
    setActiveTab("scanner")

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const queueId = newUploads[i].id

      try {
        const reader = new FileReader()
        reader.onload = async (event) => {
          const dataUri = event.target?.result as string
          const classification = await classifyDocument({ pdfDataUri: dataUri, fileName: file.name })
          const detectedType = classification.docType
          
          updateFileStatus(queueId, { status: 'UPLOADING', type: detectedType, progress: 90 })
          const storagePath = STORAGE_PATHS.COMPANY_DOCS(selectedCompanyId, detectedType)
          const fileRef = ref(storage, storagePath)
          const uploadResult = await uploadBytes(fileRef, file)
          const downloadUrl = await getDownloadURL(uploadResult.ref)

          await addDoc(collection(db, "clients", user!.uid, "reports"), {
            companyId: selectedCompanyId,
            reportType: detectedType,
            fileName: file.name,
            fileUrl: downloadUrl,
            createdAt: new Date().toISOString(),
            status: "AVAILABLE"
          })

          updateFileStatus(queueId, { status: 'COMPLETED', progress: 100 })
        }
        reader.readAsDataURL(file)
      } catch (err: any) {
        updateFileStatus(queueId, { status: 'ERROR', progress: 0 })
      }
    }
  }

  const updateFileStatus = (id: string, updates: Partial<UploadingFile>) => {
    setUploadQueue(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#002d9c] tracking-tight uppercase">Operações SST Inteligentes</h1>
          <p className="text-muted-foreground font-medium">Gestão normativa e checklists de campo em tempo real.</p>
        </div>
        <div className="w-full md:w-72">
          <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Vincular Atividades a:</label>
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
            <Layers className="size-4 text-[#00b4ff]" /> Upload em Lote
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2 font-bold uppercase text-[10px]">Arquivos Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input 
                placeholder="Pesquisar Norma (ex: NR-35, Altura, PGR)..." 
                className="pl-10 h-11 bg-white border-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48 h-11 bg-white border-none shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="size-4 text-muted-foreground" />
                  <SelectValue placeholder="Categoria" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {cat === "all" ? "Todas Categorias" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCatalog.map((item) => {
              const Icon = item.icon
              return (
                <Card 
                  key={item.id} 
                  className="cursor-pointer hover:ring-2 ring-[#002d9c]/10 transition-all group bg-white border-none card-shadow"
                  onClick={() => handleOpenChecklist(item.id, item.title)}
                >
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl bg-muted/50 group-hover:bg-[#002d9c] group-hover:text-white transition-all shrink-0", item.color)}>
                      <Icon className="size-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase opacity-50 truncate">{item.category}</p>
                      <h3 className="text-[11px] font-bold text-[#002d9c] leading-tight line-clamp-2">{item.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="scanner" className="mt-6 space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2 text-[#002d9c]">Triagem Automática NAI</CardTitle>
              <CardDescription>A IA identificará o tipo do laudo e vinculará à empresa selecionada.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className={cn(
                "border-2 border-dashed rounded-3xl p-12 text-center relative group transition-all",
                selectedCompanyId ? "bg-muted/10 hover:bg-muted/20 border-muted" : "bg-muted/5 border-muted/20 opacity-50 cursor-not-allowed"
              )}>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf" 
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  onChange={handleFilesUpload}
                  disabled={!selectedCompanyId}
                />
                <div className="space-y-2">
                  <CloudUpload className="size-12 mx-auto text-[#002d9c] opacity-40 group-hover:scale-110 transition-transform" />
                  <p className="font-bold text-[#002d9c]">
                    {selectedCompanyId ? `Solte o lote de laudos aqui` : "Selecione um cliente para habilitar o upload"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog do Checklist Ativo */}
      <Dialog open={isChecklistOpen} onOpenChange={setIsChecklistOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-3xl">
          <DialogHeader className="p-6 bg-[#002d9c] text-white">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-xl font-headline font-black uppercase flex items-center gap-2">
                  <ClipboardCheck className="size-6 text-[#00b4ff]" /> {activeNR?.nr} - Auditoria de Campo
                </DialogTitle>
                <DialogDescription className="text-white/70 font-bold uppercase text-[10px] mt-1">
                  Cliente: {companies?.find(c => c.id === selectedCompanyId)?.name}
                </DialogDescription>
              </div>
              <Badge className="bg-[#00b4ff] text-[#002d9c] font-black">{Math.round(checklistProgress)}%</Badge>
            </div>
            <Progress value={checklistProgress} className="h-1.5 mt-4 bg-white/20" />
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
            <div className="space-y-4">
              {activeNR?.items.map((item) => (
                <Card key={item.id} className="border-none shadow-sm bg-white overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[8px] font-black border-[#002d9c]/20 text-[#002d9c] uppercase">Ref: {item.legalRef}</Badge>
                        </div>
                        <p className="text-sm font-bold text-[#002d9c] leading-snug">{item.question}</p>
                      </div>
                      
                      <div className="flex gap-1 shrink-0">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(item.id, 'C')}
                          className={cn(
                            "h-10 px-4 gap-2 font-black text-[10px] transition-all",
                            responses[item.id] === 'C' ? "bg-emerald-500 text-white border-emerald-500 shadow-md" : "hover:bg-emerald-50 text-emerald-600 border-emerald-100"
                          )}
                        >
                          <Check className="size-3" /> C
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(item.id, 'NC')}
                          className={cn(
                            "h-10 px-4 gap-2 font-black text-[10px] transition-all",
                            responses[item.id] === 'NC' ? "bg-red-500 text-white border-red-500 shadow-md" : "hover:bg-red-50 text-red-600 border-red-100"
                          )}
                        >
                          <AlertOctagon className="size-3" /> NC
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleStatusChange(item.id, 'NA')}
                          className={cn(
                            "h-10 px-4 gap-2 font-black text-[10px] transition-all",
                            responses[item.id] === 'NA' ? "bg-slate-500 text-white border-slate-500 shadow-md" : "hover:bg-slate-50 text-slate-600 border-slate-100"
                          )}
                        >
                          <MinusCircle className="size-3" /> NA
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter className="p-4 bg-white border-t">
            <Button variant="ghost" onClick={() => setIsChecklistOpen(false)} className="font-black uppercase text-[10px]">Cancelar</Button>
            <Button 
              onClick={handleFinishInspection} 
              disabled={checklistProgress < 100}
              className="bg-[#002d9c] text-white font-black uppercase text-[10px] tracking-widest px-8 h-12 shadow-lg"
            >
              <Sparkles className="size-4 text-[#00b4ff] mr-2" /> Finalizar Inspeção
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
