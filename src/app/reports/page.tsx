
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
    { id: "pgr", legacyId: "1422", name: "PGR - Gerenciamento de Riscos", description: "Documento base NR-01.", icon: FileText },
    { id: "pcmso", legacyId: "307", name: "PCMSO - Controle Médico", description: "Protocolos de saúde NR-07.", icon: HeartPulse },
  ],
  legal: [
    { id: "ltcat", legacyId: "431", name: "LTCAT - Aposentadoria", description: "Enquadramento para Aposentadoria Especial.", icon: FileText },
    { id: "nr15", legacyId: "150", name: "Laudo NR-15 (Insalubridade)", description: "Análise de exposição.", icon: Hammer },
  ],
  technical: [
    { id: "ergonomia", legacyId: "170", name: "Ergonomia (AEP/AET)", description: "NR-17.", icon: Settings },
  ]
}

export default function ReportsCenter() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [activeTab, setActiveTab] = React.useState("general")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState("all")

  // Perfil para multi-tenant
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const isPrivileged = React.useMemo(() => {
    return profile && ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role);
  }, [profile]);

  // Trava unidade para clientes
  React.useEffect(() => {
    if (profile && !isPrivileged && profile.companyId) {
      setSelectedCompanyId(profile.companyId);
    }
  }, [profile, isPrivileged]);

  // Lista de empresas para o filtro
  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])
  const { data: companies, isLoading: loadingCompanies } = useCollection(companiesQuery)

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
    
    // Se selecionou uma empresa específica ou se é cliente
    const companyIdToFilter = selectedCompanyId !== "all" ? selectedCompanyId : profile.companyId;

    if (companyIdToFilter) {
      return query(collection(db, "companies", companyIdToFilter, "reports"), orderBy("createdAt", "desc"))
    } else if (isPrivileged) {
      return query(collectionGroup(db, "reports"), orderBy("createdAt", "desc"))
    }
    return null
  }, [db, profile, selectedCompanyId, isPrivileged])

  const { data: uploadedReports } = useCollection(uploadedReportsQuery)

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-[#002d9c] tracking-tight uppercase">Central de Documentos</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Gestão de Laudos e Programas Técnicos.</p>
        </div>
      </div>

      <Card className="card-shadow border-none bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Unidade / Cliente Selecionado</label>
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId} disabled={!isPrivileged}>
                <SelectTrigger className="bg-muted/30 border-none h-12">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="size-4 opacity-50" />
                    <SelectValue placeholder={loadingCompanies ? "Carregando..." : "Todas as Unidades"} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {isPrivileged && <SelectItem value="all">Todas as Unidades</SelectItem>}
                  {groupedCompanies.parents.map(parent => (
                    <SelectGroup key={parent.id}>
                      <SelectLabel className="font-black text-primary uppercase text-[9px] bg-primary/5 py-2">{parent.name}</SelectLabel>
                      {groupedCompanies.children.filter(c => c.parentId === parent.id).map(child => (
                        <SelectItem key={child.id} value={child.id} className="pl-6 text-[11px] uppercase">{child.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                  {groupedCompanies.orphans.map(c => (
                    <SelectItem key={c.id} value={c.id} className="text-[11px] uppercase">{c.name}</SelectItem>
                  ))}
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
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="general" className="rounded-lg gap-2 text-xs font-bold">Gestão Geral</TabsTrigger>
          <TabsTrigger value="legal" className="rounded-lg gap-2 text-xs font-bold">Laudos Legais</TabsTrigger>
          <TabsTrigger value="technical" className="rounded-lg gap-2 text-xs font-bold">Engenharia</TabsTrigger>
        </TabsList>

        {Object.entries(REPORTS_MAPPING).map(([category, reports]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {reports.map((report) => {
                const realFile = uploadedReports?.find(r => r.reportType === report.id);
                const company = companies?.find(c => c.id === realFile?.companyId);
                const ReportIcon = report.icon;
                
                return (
                  <Card key={report.id} className="card-shadow border-none bg-white">
                    <CardHeader>
                      <ReportIcon className="size-5 text-[#002d9c]" />
                      <CardTitle className="text-sm font-bold text-[#002d9c] mt-2">{report.name}</CardTitle>
                      <CardDescription className="text-[11px] leading-tight">
                        {realFile ? `Unidade: ${company?.name || 'Local'}` : report.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2 border-t mt-2">
                      <Button variant="ghost" size="sm" className="w-full text-[9px] font-black uppercase bg-[#002d9c]/5">Visualizar Dossiê</Button>
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
