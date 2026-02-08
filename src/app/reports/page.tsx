
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
  FolderOpen,
  Zap,
  Settings,
  Hammer
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, where, doc, collectionGroup } from "firebase/firestore"
import { PDFDownloadLink } from '@react-pdf/renderer'
import { SSTDocument } from "@/components/documents/sst-documents"
import { cn } from "@/lib/utils"

interface ReportItem {
  id: string
  legacyId: string
  name: string
  description: string
  icon: any
}

const REPORTS_MAPPING: Record<string, ReportItem[]> = {
  general: [
    { id: "pgr", legacyId: "1422", name: "PGR - Gerenciamento de Riscos", description: "Documento base NR-01 (Inventário + Plano de Ação).", icon: FileText },
    { id: "pcmso", legacyId: "307", name: "PCMSO - Controle Médico", description: "Protocolos de saúde NR-07.", icon: HeartPulse },
  ],
  legal: [
    { id: "ltcat", legacyId: "431", name: "LTCAT - Aposentadoria", description: "Enquadramento para Aposentadoria Especial.", icon: FileText },
    { id: "nr15", legacyId: "150", name: "Laudo NR-15 (Insalubridade)", description: "Análise de exposição para adicional de insalubridade.", icon: Hammer },
    { id: "nr16", legacyId: "160", name: "Laudo NR-16 (Periculosidade)", description: "Análise de atividades e operações perigosas.", icon: Zap },
  ],
  technical: [
    { id: "ergonomia", legacyId: "170", name: "Ergonomia (AEP/AET)", description: "Análise Ergonômica Preliminar ou do Trabalho NR-17.", icon: Settings },
    { id: "nr10", legacyId: "100", name: "Elétrica (NR-10)", description: "Prontuário de instalações e serviços em eletricidade.", icon: Zap },
    { id: "nr12", legacyId: "120", name: "Máquinas (NR-12)", description: "Laudo de segurança em máquinas e equipamentos.", icon: Settings },
  ],
  operational: [
    { id: "os", legacyId: "010", name: "Ordens de Serviço (OS)", description: "Instruções de segurança por cargo ou função.", icon: FileText },
    { id: "epi", legacyId: "281", name: "Fichas de EPI", description: "Histórico de entregas e assinaturas digitais.", icon: ShieldAlert },
    { id: "apr", legacyId: "020", name: "APR (Checklist Diário)", description: "Análise Preliminar de Riscos operacional.", icon: ShieldAlert },
  ],
  programs: [
    { id: "pca", legacyId: "071", name: "PCA - Conservação Auditiva", description: "Gestão de audiometrias e proteção auditiva.", icon: HeartPulse },
    { id: "ppr", legacyId: "072", name: "PPR - Proteção Respiratória", description: "Ensaio de vedação e gestão de respiradores.", icon: ShieldAlert },
  ]
}

export default function ReportsCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("general")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState("all")

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  // Lista de empresas para o filtro
  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])
  const { data: companies } = useCollection(companiesQuery)

  const groupedCompanies = React.useMemo(() => {
    if (!companies) return { parents: [], orphans: [] }
    const parents = companies.filter(c => c.isParent)
    const children = companies.filter(c => c.parentId)
    const orphans = companies.filter(c => !c.parentId && !c.isParent)
    return { parents, children, orphans }
  }, [companies])

  // Busca documentos reais nas sub-coleções
  const uploadedReportsQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    
    const isPrivileged = ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role)
    
    // Se selecionou uma empresa específica ou se é cliente (que tem companyId travado no profile)
    const companyIdToFilter = selectedCompanyId !== "all" ? selectedCompanyId : profile.companyId;

    if (companyIdToFilter) {
      return query(collection(db, "companies", companyIdToFilter, "reports"), orderBy("createdAt", "desc"))
    } else if (isPrivileged) {
      // Admin vendo tudo
      return query(collectionGroup(db, "reports"), orderBy("createdAt", "desc"))
    }
    return null
  }, [db, profile, selectedCompanyId])

  const { data: uploadedReports } = useCollection(uploadedReportsQuery)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#002d9c] tracking-tight uppercase">Central de Documentos NextCon</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Gestão de Laudos, Programas e Documentação Operacional.</p>
        </div>
      </div>

      <Card className="card-shadow border-none bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Unidade / Cliente Selecionado</label>
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
              <Button className="w-full gap-2 bg-[#002d9c] font-bold h-12 uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 text-white">
                <Filter className="size-4" /> Aplicar Filtro
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="general" className="rounded-lg gap-2 text-xs font-bold">Gestão Geral</TabsTrigger>
          <TabsTrigger value="legal" className="rounded-lg gap-2 text-xs font-bold">Laudos Legais</TabsTrigger>
          <TabsTrigger value="technical" className="rounded-lg gap-2 text-xs font-bold">Engenharia</TabsTrigger>
          <TabsTrigger value="operational" className="rounded-lg gap-2 text-xs font-bold">Operacional</TabsTrigger>
          <TabsTrigger value="programs" className="rounded-lg gap-2 text-xs font-bold">Satélites</TabsTrigger>
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
                    "card-shadow border-none hover:ring-2 ring-[#002d9c]/10 transition-all group bg-white",
                    realFile ? "border-l-4 border-l-[#00b4ff]" : ""
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className={cn(
                          "p-2 rounded-lg transition-colors",
                          realFile ? "bg-[#00b4ff] text-[#002d9c]" : "bg-[#002d9c]/5 text-[#002d9c] group-hover:bg-[#002d9c] group-hover:text-white"
                        )}>
                          <ReportIcon className="size-5" />
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black opacity-40 uppercase tracking-tighter">ID {report.legacyId}</Badge>
                      </div>
                      <CardTitle className="text-sm font-bold text-[#002d9c] mt-2">{report.name}</CardTitle>
                      <CardDescription className="text-[11px] leading-tight line-clamp-2 min-h-[2.5rem]">
                        {realFile ? `Unidade: ${company?.name || 'Local'}` : report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 border-t mt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {realFile?.analysisData ? (
                          <PDFDownloadLink 
                            document={<SSTDocument data={realFile.analysisData} company={company} type={report.id.toUpperCase() as any} />} 
                            fileName={`${report.id.toUpperCase()}_NextCon_${company?.name || 'Relatorio'}.pdf`}
                            className="w-full"
                          >
                            {({ loading }) => (
                              <Button variant="ghost" size="sm" className="w-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 hover:bg-emerald-100 h-9 gap-2">
                                {loading ? <Loader2 className="size-3 animate-spin" /> : <FileDown className="size-3" />}
                                Dossiê NAI
                              </Button>
                            )}
                          </PDFDownloadLink>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase text-muted-foreground opacity-30 h-9" disabled>
                            <FileDown className="size-3 mr-2" /> Sem Dados
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase bg-[#002d9c]/5 text-[#002d9c] hover:bg-[#002d9c]/10 h-9">
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
