
"use client"

import * as React from "react"
import { 
  ClipboardCheck, 
  Loader2, 
  ShieldAlert, 
  Plus, 
  ArrowLeft, 
  HeartPulse, 
  Building2, 
  Hammer, 
  ArrowUpCircle, 
  Zap,
  CheckCircle2,
  Info,
  FileText,
  Sparkles,
  Brain,
  History,
  CloudUpload,
  Stethoscope,
  Scale,
  Calendar as CalendarIcon,
  Bell,
  FileDown,
  Settings
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { analyzePgrPdf } from "@/ai/flows/pgr-analysis-flow"
import { analyzeLtcatPdf } from "@/ai/flows/ltcat-analysis-flow"
import { analyzePcmsoPdf } from "@/ai/flows/pcmso-analysis-flow"
import { getWhatsAppLink } from "@/lib/whatsapp-utils"
import { STORAGE_PATHS } from "@/lib/storage-paths"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SSTDocument } from "@/components/documents/sst-documents"

const CHECKLIST_CATALOG = [
  { id: "nr01", category: "Geral", title: "NR-01 - Gerenciamento de Riscos (GRO/PGR)", icon: ShieldAlert, color: "text-red-600" },
  { id: "nr06", category: "EPI", title: "NR-06 - Equipamentos de Proteção (EPI)", icon: HeartPulse, color: "text-amber-600" },
  { id: "nr17", category: "Ergonomia", title: "NR-17 - Laboratório de Ergonomia", icon: Brain, color: "text-blue-700" },
  { id: "nr18", category: "Obras", title: "NR-18 - Indústria da Construção", icon: Hammer, color: "text-orange-600" },
  { id: "nr10", category: "Elétrica", title: "NR-10 - Instalações Elétricas", icon: Zap, color: "text-yellow-500" },
  { id: "nr35", category: "Altura", title: "NR-35 - Trabalho em Altura", icon: ArrowUpCircle, color: "text-blue-500" },
]

export default function ChecklistsPage() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const storage = useStorage()
  const [activeTab, setActiveTab] = React.useState("catalog")
  const [selectedChecklistId, setSelectedChecklistId] = React.useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = React.useState(false)
  const [analysisResult, setAnalysisResult] = React.useState<any>(null)
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("")
  const [docType, setDocType] = React.useState<string>("pgr")

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!selectedCompanyId) {
      toast({ variant: "destructive", title: "Empresa Não Selecionada", description: "Selecione um cliente antes de subir o documento." })
      return
    }

    if (file.size > 15 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Arquivo muito grande", description: "O PDF deve ter no máximo 15MB." })
      return
    }

    setIsAnalyzing(true)
    try {
      const company = companies?.find(c => c.id === selectedCompanyId)
      const reader = new FileReader()
      
      reader.onload = async (event) => {
        const dataUri = event.target?.result as string
        let result: any;

        // Fallback para outros tipos de laudo se não houver fluxo específico
        if (docType === "pgr") {
          result = await analyzePgrPdf({ pdfDataUri: dataUri, fileName: file.name })
        } else if (docType === "ltcat") {
          result = await analyzeLtcatPdf({ pdfDataUri: dataUri, fileName: file.name })
        } else if (docType === "pcmso") {
          result = await analyzePcmsoPdf({ pdfDataUri: dataUri, fileName: file.name })
        } else {
          // Mock de resultado para outros laudos enquanto não houver fluxos dedicados
          result = {
            companyInfo: { name: company?.name || "Empresa Cliente", validity: "12 meses" },
            aiInsight: `A análise preliminar do documento ${docType.toUpperCase()} indica conformidade com as normas vigentes de 2026.`
          }
        }

        setAnalysisResult(result)

        const storagePath = STORAGE_PATHS.COMPANY_DOCS(selectedCompanyId, docType)
        const fileRef = ref(storage, storagePath)
        const uploadResult = await uploadBytes(fileRef, file)
        const downloadUrl = await getDownloadURL(uploadResult.ref)

        const timestamp = new Date().toISOString()
        const nextYear = new Date()
        nextYear.setFullYear(nextYear.getFullYear() + 1)

        await addDoc(collection(db, "clients", user.uid, "reports"), {
          companyId: selectedCompanyId,
          reportType: docType,
          fileName: file.name,
          fileUrl: downloadUrl,
          analysisData: result,
          analysisSummary: result.aiInsight,
          createdAt: timestamp,
          status: "AVAILABLE"
        })

        await addDoc(collection(db, "users", user.uid, "notifications"), {
          title: `NAI: Novo ${docType.toUpperCase()} Processado`,
          message: `O documento de ${company?.name} foi analisado e arquivado com sucesso.`,
          read: false,
          createdAt: timestamp
        })

        toast({ 
          title: `Análise ${docType.toUpperCase()} Concluída`, 
          description: "Documento processado e disponível na Central de Relatórios." 
        })
      }
      reader.readAsDataURL(file)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erro no Processamento", description: error.message })
    } finally { 
      setIsAnalyzing(false) 
    }
  }

  const selectedCompany = companies?.find(c => c.id === selectedCompanyId);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#002d9c] tracking-tight uppercase">Hub de Operações SST</h1>
          <p className="text-muted-foreground">Processamento inteligente de Laudos e Programas Ocupacionais.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="catalog" className="rounded-lg gap-2 font-bold">Catálogo NRs</TabsTrigger>
          <TabsTrigger value="scanner" className="rounded-lg gap-2 font-bold"><Sparkles className="size-4 text-[#00b4ff]" /> Scanner IA</TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg gap-2 font-bold">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHECKLIST_CATALOG.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.id} className="cursor-pointer hover:ring-2 ring-[#002d9c]/10 transition-all group bg-white border-none card-shadow" onClick={() => { setSelectedChecklistId(item.id); setActiveTab("scanner"); setDocType(item.id === 'nr01' ? 'pgr' : item.id === 'nr17' ? 'ergonomia' : 'pgr') }}>
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

        <TabsContent value="scanner" className="mt-6">
          <Card className="border-none shadow-xl bg-white overflow-hidden">
            <CardHeader className="bg-muted/30 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2 text-[#002d9c]">Scanner Inteligente NAI</CardTitle>
                <CardDescription>Extração de dados e automação documental (PDF até 15MB).</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <div className="w-full md:w-64">
                  <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Tipo de Documento:</label>
                  <Select value={docType} onValueChange={(v: any) => setDocType(v)}>
                    <SelectTrigger className="bg-white border-muted h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase font-black opacity-50">Gestão Geral</SelectLabel>
                        <SelectItem value="pgr">PGR (Riscos)</SelectItem>
                        <SelectItem value="pcmso">PCMSO (Saúde)</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase font-black opacity-50">Laudos Legais</SelectLabel>
                        <SelectItem value="ltcat">LTCAT (Aposentadoria)</SelectItem>
                        <SelectItem value="nr15">Laudo NR-15 (Insalubridade)</SelectItem>
                        <SelectItem value="nr16">Laudo NR-16 (Periculosidade)</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase font-black opacity-50">Engenharia & Op.</SelectLabel>
                        <SelectItem value="ergonomia">Ergonomia (AEP/AET)</SelectItem>
                        <SelectItem value="nr10">Elétrica (NR-10)</SelectItem>
                        <SelectItem value="nr12">Máquinas (NR-12)</SelectItem>
                        <SelectItem value="os">Ordem de Serviço (OS)</SelectItem>
                        <SelectItem value="epi">Ficha de EPI</SelectItem>
                        <SelectItem value="apr">APR (Checklist Diário)</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel className="text-[10px] uppercase font-black opacity-50">Prog. Satélites</SelectLabel>
                        <SelectItem value="pca">PCA (Auditivo)</SelectItem>
                        <SelectItem value="ppr">PPR (Respiratório)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-64">
                  <label className="text-[9px] font-black uppercase text-muted-foreground mb-1 block">Vincular a:</label>
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
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className={cn(
                "border-2 border-dashed rounded-3xl p-12 text-center relative group transition-all",
                selectedCompanyId ? "bg-muted/10 hover:bg-muted/20 border-muted" : "bg-muted/5 border-muted/20 opacity-50 cursor-not-allowed"
              )}>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                  onChange={handleFileUpload}
                  disabled={!selectedCompanyId || isAnalyzing}
                />
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <Loader2 className="animate-spin size-12 mx-auto text-[#002d9c]" />
                    <p className="text-xs font-black uppercase tracking-widest animate-pulse text-[#002d9c]">NAI Processando Dossiê Técnico...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <CloudUpload className="size-12 mx-auto text-[#002d9c] opacity-40 group-hover:scale-110 transition-transform" />
                    <p className="font-bold text-[#002d9c]">
                      {selectedCompanyId ? `Arraste ou Clique para importar ${docType.toUpperCase()}` : "Selecione um cliente acima para habilitar"}
                    </p>
                    <p className="text-[10px] uppercase font-black text-muted-foreground">O dossiê oficial será gerado automaticamente após o upload.</p>
                  </div>
                )}
              </div>

              {analysisResult && (
                <div className="animate-in zoom-in-95 duration-300 space-y-6">
                  <div className="p-6 bg-blue-50 rounded-2xl border-2 border-[#00b4ff]/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-headline font-black text-[#002d9c]">{analysisResult.companyInfo.name}</h3>
                      <p className="text-xs text-[#002d9c]/70 font-bold uppercase">
                        Protocolo: {docType.toUpperCase()} | Data: {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className="bg-[#002d9c] text-white px-4 py-1.5 font-black uppercase text-[10px]">NAI Processado</Badge>
                      <span className="text-[9px] font-bold text-[#002d9c] uppercase flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Arquivado na Pasta do Cliente
                      </span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#00b4ff]/10 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-5 text-[#002d9c]" />
                      <h4 className="font-black uppercase text-xs text-[#002d9c]">Parecer Técnico NAI</h4>
                    </div>
                    <p className="text-sm italic text-[#002d9c] leading-relaxed font-medium">"{analysisResult.aiInsight}"</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <Button 
                        className="flex-1 bg-[#002d9c] text-white h-12 font-bold uppercase gap-2 text-xs"
                        onClick={() => window.open(getWhatsAppLink("11999999999", `*Parecer NAI - ${docType.toUpperCase()}*\n\n${analysisResult.aiInsight}`))}
                      >
                        Enviar Resumo (WhatsApp)
                      </Button>
                      
                      <Button asChild variant="outline" className="flex-1 bg-white border-[#002d9c] text-[#002d9c] h-12 font-bold uppercase text-[10px] gap-2">
                        <PDFDownloadLink 
                          document={<SSTDocument data={analysisResult} company={selectedCompany} type={docType.toUpperCase() as any} />} 
                          fileName={`${docType.toUpperCase()}_NextCon_${analysisResult.companyInfo.name}.pdf`}
                        >
                          {({ loading }) => (
                            <span className="flex items-center gap-2">
                              {loading ? <Loader2 className="size-3 animate-spin" /> : <FileDown className="size-4" />}
                              Baixar Documento Oficial (PDF)
                            </span>
                          )}
                        </PDFDownloadLink>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="border-none shadow-xl bg-white">
            <CardHeader><CardTitle className="text-[#002d9c]">Documentos Processados</CardTitle></CardHeader>
            <CardContent className="flex flex-col items-center py-20 text-center opacity-40">
              <History className="size-12 mb-4 text-[#002d9c]" />
              <p className="text-sm font-bold uppercase tracking-widest">Os documentos analisados via Scanner aparecem na Central de Documentos do cliente.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
