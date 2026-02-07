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
  X
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { analyzePgrPdf } from "@/ai/flows/pgr-analysis-flow"
import { analyzeLtcatPdf } from "@/ai/flows/ltcat-analysis-flow"
import { analyzePcmsoPdf } from "@/ai/flows/pcmso-analysis-flow"
import { classifyDocument } from "@/ai/flows/document-classifier-flow"
import { getWhatsAppLink } from "@/lib/whatsapp-utils"
import { STORAGE_PATHS } from "@/lib/storage-paths"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SSTDocument } from "@/components/documents/sst-documents"
import { Progress } from "@/components/ui/progress"

const CHECKLIST_CATALOG = [
  { id: "pgr", category: "Geral", title: "PGR - Gerenciamento de Riscos", icon: ShieldAlert, color: "text-red-600" },
  { id: "pcmso", category: "Saúde", title: "PCMSO - Controle Médico", icon: HeartPulse, color: "text-emerald-600" },
  { id: "ltcat", category: "Legal", title: "LTCAT - Aposentadoria", icon: FileText, color: "text-blue-600" },
  { id: "ergonomia", category: "Ergonomia", title: "NR-17 - Ergonomia", icon: Brain, color: "text-blue-700" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Elétrica", icon: Zap, color: "text-yellow-500" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
]

interface UploadingFile {
  id: string
  name: string
  status: 'CLASSIFYING' | 'ANALYZING' | 'UPLOADING' | 'COMPLETED' | 'ERROR'
  progress: number
  type?: string
  result?: any
}

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [uploadQueue, setUploadQueue] = React.useState<UploadingFile[]>([])

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  const handleFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Empresa Não Selecionada", description: "Selecione um cliente antes de subir os documentos." })
      return
    }

    const company = companies?.find(c => c.id === selectedCompanyId)
    const newUploads: UploadingFile[] = Array.from(files).map(f => ({
      id: Math.random().toString(36).substring(7),
      name: f.name,
      status: 'CLASSIFYING',
      progress: 10
    }))

    setUploadQueue(prev => [...newUploads, ...prev])
    setActiveTab("scanner")

    // Processar cada arquivo
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const queueId = newUploads[i].id

      try {
        if (file.size > 15 * 1024 * 1024) throw new Error("Arquivo excede 15MB")

        const reader = new FileReader()
        reader.onload = async (event) => {
          const dataUri = event.target?.result as string
          
          // 1. Classificação Automática NAI
          updateFileStatus(queueId, { status: 'CLASSIFYING', progress: 30 })
          const classification = await classifyDocument({ pdfDataUri: dataUri, fileName: file.name })
          const detectedType = classification.docType
          updateFileStatus(queueId, { type: detectedType, progress: 50 })

          // 2. Análise Técnica Profunda
          updateFileStatus(queueId, { status: 'ANALYZING', progress: 70 })
          let analysis: any;
          if (detectedType === "pgr") analysis = await analyzePgrPdf({ pdfDataUri: dataUri })
          else if (detectedType === "ltcat") analysis = await analyzeLtcatPdf({ pdfDataUri: dataUri })
          else if (detectedType === "pcmso") analysis = await analyzePcmsoPdf({ pdfDataUri: dataUri })
          else {
            analysis = {
              companyInfo: { name: company?.name || "Cliente", validity: "12 meses" },
              aiInsight: classification.reasoning
            }
          }

          // 3. Upload e Persistência
          updateFileStatus(queueId, { status: 'UPLOADING', progress: 90 })
          const storagePath = STORAGE_PATHS.COMPANY_DOCS(selectedCompanyId, detectedType)
          const fileRef = ref(storage, storagePath)
          const uploadResult = await uploadBytes(fileRef, file)
          const downloadUrl = await getDownloadURL(uploadResult.ref)

          await addDoc(collection(db, "clients", user!.uid, "reports"), {
            companyId: selectedCompanyId,
            reportType: detectedType,
            fileName: file.name,
            fileUrl: downloadUrl,
            analysisData: analysis,
            analysisSummary: analysis.aiInsight,
            createdAt: new Date().toISOString(),
            status: "AVAILABLE"
          })

          updateFileStatus(queueId, { status: 'COMPLETED', progress: 100, result: analysis })
          
          toast({ title: "Arquivo Processado", description: `${file.name} identificado como ${detectedType.toUpperCase()}.` })
        }
        reader.readAsDataURL(file)
      } catch (err: any) {
        updateFileStatus(queueId, { status: 'ERROR', progress: 0 })
        toast({ variant: "destructive", title: "Erro no arquivo", description: file.name })
      }
    }
  }

  const updateFileStatus = (id: string, updates: Partial<UploadingFile>) => {
    setUploadQueue(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const removeFileFromQueue = (id: string) => {
    setUploadQueue(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#002d9c] tracking-tight uppercase">Operações SST Inteligentes</h1>
          <p className="text-muted-foreground font-medium">Classificação e análise automática de documentos em lote.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2 font-bold uppercase text-[10px]">Catálogo NRs</TabsTrigger>
          <TabsTrigger value="scanner" className="rounded-lg gap-2 font-bold uppercase text-[10px]">
            <Layers className="size-4 text-[#00b4ff]" /> Upload em Lote
            {uploadQueue.length > 0 && <Badge className="ml-1 bg-[#00b4ff] text-white size-5 p-0 flex items-center justify-center rounded-full text-[10px]">{uploadQueue.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2 font-bold uppercase text-[10px]">Arquivos Recentes</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECKLIST_CATALOG.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.id} className="cursor-pointer hover:ring-2 ring-[#002d9c]/10 transition-all group bg-white border-none card-shadow">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl bg-muted/50 group-hover:bg-[#002d9c] group-hover:text-white transition-all", item.color)}><Icon className="size-6" /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase opacity-50">{item.category}</p>
                      <h3 className="text-sm font-bold text-[#002d9c]">{item.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="scanner" className="mt-6 space-y-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-[#002d9c]">Triagem Automática NAI</CardTitle>
                <CardDescription>Arraste múltiplos arquivos. A IA identificará o tipo e a pasta correta.</CardDescription>
              </div>
              <div className="w-full md:w-72">
                <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Vincular Dossiês a:</label>
                <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                  <SelectTrigger className="bg-white border-muted h-10 text-xs">
                    <SelectValue placeholder="Selecione o Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies?.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                    {selectedCompanyId ? `Solte o lote de arquivos aqui para triagem` : "Selecione um cliente para habilitar o lote"}
                  </p>
                  <p className="text-[10px] uppercase font-black text-muted-foreground">A NAI distribuirá os laudos nas pastas de PGR, PCMSO, LTCAT, etc.</p>
                </div>
              </div>

              {uploadQueue.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Fila de Processamento Inteligente</h4>
                  <div className="grid gap-2">
                    {uploadQueue.map((file) => (
                      <div key={file.id} className="p-4 bg-muted/20 rounded-2xl border flex items-center gap-4 group">
                        <div className={cn(
                          "size-10 rounded-xl flex items-center justify-center shrink-0",
                          file.status === 'COMPLETED' ? "bg-emerald-100 text-emerald-600" : "bg-white text-[#002d9c]"
                        )}>
                          {file.status === 'COMPLETED' ? <CheckCircle2 className="size-5" /> : <Loader2 className="size-5 animate-spin" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <p className="text-xs font-bold truncate pr-4">{file.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge className={cn(
                                  "text-[8px] font-black uppercase border-none h-4",
                                  file.status === 'COMPLETED' ? "bg-emerald-500 text-white" : "bg-[#00b4ff] text-white"
                                )}>
                                  {file.status}
                                </Badge>
                                {file.type && <span className="text-[9px] font-black text-[#002d9c] uppercase tracking-tighter">Tipo: {file.type}</span>}
                              </div>
                            </div>
                            <button onClick={() => removeFileFromQueue(file.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all">
                              <X className="size-4" />
                            </button>
                          </div>
                          <Progress value={file.progress} className="h-1 bg-white" />
                        </div>
                        {file.status === 'COMPLETED' && file.result && (
                          <div className="shrink-0 flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase border-[#002d9c] text-[#002d9c] gap-1" asChild>
                              <PDFDownloadLink 
                                document={<SSTDocument data={file.result} company={companies?.find(c => c.id === selectedCompanyId)} type={file.type?.toUpperCase() as any} />} 
                                fileName={`${file.type?.toUpperCase()}_NextCon_${file.name}.pdf`}
                              >
                                {({ loading }) => loading ? "..." : "Dossiê"}
                              </PDFDownloadLink>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-xl bg-white">
            <CardHeader><CardTitle className="text-[#002d9c]">Documentos Distribuídos</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center py-20 text-center opacity-40">
              <History className="size-12 mb-4 text-[#002d9c]" />
              <p className="text-sm font-bold uppercase tracking-widest">Os arquivos distribuídos automaticamente aparecem na Central de Relatórios do cliente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
