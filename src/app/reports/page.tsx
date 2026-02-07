
"use client"

import * as React from "react"
import { 
  FileText, 
  HeartPulse, 
  ShieldAlert, 
  BarChart3, 
  Download, 
  Eye, 
  FileSpreadsheet, 
  Search, 
  Building2, 
  Filter,
  ArrowRight,
  Info,
  Loader2,
  ExternalLink,
  FileDown,
  ChevronRight,
  FolderOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, where } from "firebase/firestore"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SSTDocument } from "@/components/documents/sst-documents"

interface ReportItem {
  id: string
  legacyId: string
  name: string
  description: string
  icon: any
}

const REPORTS_MAPPING: Record<string, ReportItem[]> = {
  legal: [
    { id: "pgr", legacyId: "1422", name: "PGR - Gerenciamento de Riscos", description: "Documento base NR-01 (Inventário + Plano de Ação).", icon: FileText },
    { id: "pcmso", legacyId: "307", name: "PCMSO - Controle Médico", description: "Protocolos de saúde NR-07.", icon: FileText },
    { id: "ltcat", legacyId: "431", name: "LTCAT - Laudo Previdenciário", description: "Enquadramento para Aposentadoria Especial.", icon: FileText },
    { id: "ppp", legacyId: "277", name: "PPP - Perfil Profissiográfico", description: "Histórico laboral digital do funcionário.", icon: FileText },
  ],
  health: [
    { id: "aso", legacyId: "321", name: "ASOs Emitidos", description: "Lista de Atestados (Aptos e Inaptos).", icon: HeartPulse },
    { id: "due", legacyId: "302", name: "Vencimento de Exames", description: "Próximas renovações por unidade.", icon: HeartPulse },
    { id: "absenteeism", legacyId: "226", name: "Absenteísmo & CIDs", description: "Análise de faltas e afastamentos médicos.", icon: HeartPulse },
  ],
  safety: [
    { id: "ppe", legacyId: "281", name: "Ficha de EPI", description: "Histórico de entregas e assinaturas digitais.", icon: ShieldAlert },
    { id: "actions", legacyId: "1393", name: "Cronograma de Ações", description: "Status das medidas corretivas do PGR.", icon: ShieldAlert },
  ],
  indicators: [
    { id: "census", legacyId: "267", name: "Censo de Funcionários", description: "Listagem de vidas ativas na base.", icon: BarChart3 },
    { id: "ntep", legacyId: "350", name: "Fator Acidentário (FAP)", description: "Impacto tributário por nexo epidemiológico.", icon: BarChart3 },
  ]
}

export default function ReportsCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("legal")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState("all")

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])
  const { data: companies } = useCollection(companiesQuery)

  const groupedCompanies = React.useMemo(() => {
    if (!companies) return { parents: [], orphans: [] }
    const parents = companies.filter(c => c.isParent)
    const children = companies.filter(c => c.parentId)
    const orphans = companies.filter(c => !c.parentId && !c.isParent)
    return { parents, children, orphans }
  }, [companies])

  const uploadedReportsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    let q = query(collection(db, "clients", user.uid, "reports"), orderBy("createdAt", "desc"))
    if (selectedCompanyId !== "all") {
      q = query(collection(db, "clients", user.uid, "reports"), where("companyId", "==", selectedCompanyId))
    }
    return q
  }, [db, user, selectedCompanyId])
  const { data: uploadedReports } = useCollection(uploadedReportsQuery)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Central de Relatórios NextCon</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Interface unificada para pastas e unidades do cliente.</p>
        </div>
      </div>

      <Card className="card-shadow border-none bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Pasta / Unidade Selecionada</label>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="bg-muted/30 border-none h-12">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="size-4 opacity-50" />
                    <SelectValue placeholder="Todas as Unidades" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Unidades</SelectItem>
                  {groupedCompanies.parents.map(parent => (
                    <SelectGroup key={parent.id}>
                      <SelectLabel className="font-black text-primary uppercase text-[9px] bg-primary/5 py-2">{parent.name}</SelectLabel>
                      {groupedCompanies.children.filter(c => c.parentId === parent.id).map(child => (
                        <SelectItem key={child.id} value={child.id} className="pl-6 text-[11px] uppercase">{child.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                  {groupedCompanies.orphans.length > 0 && (
                    <SelectGroup>
                      <SelectLabel className="font-black uppercase text-[9px]">Empresas Gerais</SelectLabel>
                      {groupedCompanies.orphans.map(c => (
                        <SelectItem key={c.id} value={c.id} className="text-[11px] uppercase">{c.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Filtrar por Período</label>
              <Input type="date" className="bg-muted/30 border-none h-12" />
            </div>
            <div className="flex items-end">
              <Button className="w-full gap-2 bg-primary font-bold h-12 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                <Filter className="size-4" /> Aplicar Filtro
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="legal" className="rounded-lg gap-2 text-xs font-bold">Documentos Legais</TabsTrigger>
          <TabsTrigger value="health" className="rounded-lg gap-2 text-xs font-bold">Saúde Ocupacional</TabsTrigger>
          <TabsTrigger value="safety" className="rounded-lg gap-2 text-xs font-bold">Segurança do Trabalho</TabsTrigger>
          <TabsTrigger value="indicators" className="rounded-lg gap-2 text-xs font-bold">Indicadores & BI</TabsTrigger>
        </TabsList>

        {Object.entries(REPORTS_MAPPING).map(([category, reports]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {reports.map((report) => {
                const realFile = uploadedReports?.find(r => r.reportType === report.id);
                const company = companies?.find(c => c.id === realFile?.companyId);
                const ReportIcon = report.icon;
                
                return (
                  <Card key={report.id} className={cn(
                    "card-shadow border-none hover:ring-2 ring-primary/10 transition-all group bg-white",
                    realFile ? "border-l-4 border-l-accent" : ""
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          realFile ? "bg-accent text-primary" : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white"
                        )}>
                          <ReportIcon className="size-5" />
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black opacity-40 uppercase tracking-tighter">ID {report.legacyId}</Badge>
                      </div>
                      <CardTitle className="text-sm font-bold text-primary mt-2">{report.name}</CardTitle>
                      <CardDescription className="text-[11px] leading-tight line-clamp-2 min-h-[2.5rem]">
                        {realFile ? `Unidade: ${company?.name}` : report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 border-t mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {realFile?.analysisData ? (
                          <PDFDownloadLink 
                            document={<SSTDocument data={realFile.analysisData} company={company} type={report.id.toUpperCase() as any} />} 
                            fileName={`${report.id.toUpperCase()}_NextCon_${company?.name}.pdf`}
                            className="w-full"
                          >
                            {({ loading }) => (
                              <Button variant="ghost" size="sm" className="w-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 hover:bg-emerald-100 h-9 gap-2">
                                {loading ? <Loader2 className="size-3 animate-spin" /> : <FileDown className="size-3" />}
                                Dossiê Oficial
                              </Button>
                            )}
                          </PDFDownloadLink>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase text-muted-foreground opacity-30 h-9" disabled>
                            <FileDown className="size-3 mr-2" /> Sem Dados
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase bg-primary/5 text-primary hover:bg-primary/10 h-9">
                          <Eye className="size-3 mr-2" /> Detalhes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
