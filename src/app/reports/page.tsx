
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
  Calendar,
  Building2,
  Filter,
  ArrowRight,
  Info
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

interface ReportItem {
  id: string
  legacyId: string
  name: string
  description: string
  icon: any
}

const REPORTS_DATA: Record<string, ReportItem[]> = {
  legal: [
    { id: "pgr", legacyId: "1422", name: "PGR - Programa de Gerenciamento de Riscos", description: "Gera o documento base da NR-01 (Inventário + Plano de Ação).", icon: FileText },
    { id: "pcmso", legacyId: "307", name: "PCMSO - Programa de Controle Médico", description: "Gera o documento base da NR-07.", icon: FileText },
    { id: "ltcat", legacyId: "431", name: "LTCAT - Laudo Técnico", description: "Laudo para Aposentadoria Especial (INSS).", icon: FileText },
    { id: "ppp", legacyId: "277", name: "PPP - Perfil Profissiográfico", description: "Histórico laboral do funcionário (Físico ou Digital).", icon: FileText },
    { id: "insalubridade", legacyId: "1313", name: "Laudo de Insalubridade (NR-15)", description: "Avaliação de adicionais de insalubridade.", icon: FileText },
    { id: "periculosidade", legacyId: "1383", name: "Laudo de Periculosidade (NR-16)", description: "Avaliação de adicionais de periculosidade.", icon: FileText },
    { id: "anual", legacyId: "306", name: "Relatório Anual do PCMSO", description: "Estatística obrigatória de exames anuais.", icon: FileText },
  ],
  health: [
    { id: "aso", legacyId: "321 / 1527", name: "ASOs Emitidos", description: "Lista de Atestados (Aptos, Inaptos, Restrições).", icon: HeartPulse },
    { id: "due", legacyId: "302", name: "Vencimento de Exames", description: "Quem precisa renovar exames (Vencidos e a Vencer).", icon: HeartPulse },
    { id: "absenteeism", legacyId: "226 / 1535", name: "Absenteísmo & Afastamentos", description: "Análise de faltas, atestados médicos e CIDs.", icon: HeartPulse },
    { id: "audio", legacyId: "304 / 440", name: "Relatório de Audiometria / PCA", description: "Acompanhamento da saúde auditiva.", icon: HeartPulse },
    { id: "epidemiological", legacyId: "324", name: "Perfil Epidemiológico", description: "Visão geral da saúde da população da empresa.", icon: BarChart3 },
  ],
  safety: [
    { id: "ppe", legacyId: "281 / 1511", name: "Comprovante de Entrega de EPI", description: "Histórico de fichas de EPI assinadas.", icon: ShieldAlert },
    { id: "actions", legacyId: "1393", name: "Plano de Ação (Cronograma)", description: "Status das ações corretivas do PGR.", icon: ShieldAlert },
    { id: "cat", legacyId: "322 / 1529", name: "Relatório de Acidentes/CAT", description: "Estatísticas de acidentes e taxas de gravidade.", icon: ShieldAlert },
    { id: "risk_map", legacyId: "338", name: "Mapa de Riscos", description: "Representação gráfica dos riscos por setor.", icon: ShieldAlert },
    { id: "training", legacyId: "260", name: "Status de Treinamentos", description: "Quem fez e quem precisa fazer cursos obrigatórios.", icon: ShieldAlert },
  ],
  indicators: [
    { id: "census", legacyId: "267", name: "Listagem de Funcionários Ativos", description: "Relatório simples de quem está na base (Censo).", icon: BarChart3 },
    { id: "ntep", legacyId: "350", name: "Relatório NTEP", description: "Nexo Técnico Epidemiológico (Relação Doença x Trabalho).", icon: BarChart3 },
  ]
}

export default function ReportsCenter() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = React.useState("legal")

  const handleAction = (report: ReportItem, action: string) => {
    toast({
      title: `${action} Relatório`,
      description: `Processando "${report.name}" (ID Legado: ${report.legacyId})...`
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Central de Relatórios NEXTCON</h1>
          <p className="text-muted-foreground">Interface unificada para documentos técnicos e indicadores de SST.</p>
        </div>
      </div>

      <Card className="card-shadow border-none bg-white">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Unidade / Setor</label>
              <Select defaultValue="all">
                <SelectTrigger className="bg-muted/30 border-none">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 opacity-50" />
                    <SelectValue placeholder="Todas as Unidades" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Unidades</SelectItem>
                  <SelectItem value="matriz">Matriz Curitiba</SelectItem>
                  <SelectItem value="unidade2">Unidade Industrial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Data Inicial</label>
              <Input type="date" className="bg-muted/30 border-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Data Final</label>
              <Input type="date" className="bg-muted/30 border-none" />
            </div>
            <div className="flex items-end">
              <Button className="w-full gap-2 bg-primary font-bold h-10">
                <Filter className="size-4" /> Aplicar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/50 p-1 rounded-xl h-14">
          <TabsTrigger value="legal" className="rounded-lg gap-2 text-xs font-bold">
            ⚖️ <span className="hidden sm:inline">Docs Legais</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="rounded-lg gap-2 text-xs font-bold">
            🩺 <span className="hidden sm:inline">Saúde</span>
          </TabsTrigger>
          <TabsTrigger value="safety" className="rounded-lg gap-2 text-xs font-bold">
            🦺 <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="indicators" className="rounded-lg gap-2 text-xs font-bold">
            📊 <span className="hidden sm:inline">Indicadores</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(REPORTS_DATA).map(([category, reports]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {reports.map((report) => (
                <Card key={report.id} className="card-shadow border-none hover:ring-2 ring-primary/10 transition-all group bg-white">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <report.icon className="size-5" />
                      </div>
                      <Badge variant="outline" className="text-[8px] font-black opacity-40 uppercase tracking-tighter">
                        ID: {report.legacyId}
                      </Badge>
                    </div>
                    <CardTitle className="text-sm font-bold text-primary mt-2">{report.name}</CardTitle>
                    <CardDescription className="text-[11px] leading-tight line-clamp-2 min-h-[2.5rem]">
                      {report.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2 border-t mt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[9px] font-black uppercase p-0 h-8 flex flex-col gap-0.5 hover:bg-blue-50 text-blue-700"
                        onClick={() => handleAction(report, 'Visualizar')}
                      >
                        <Eye className="size-3" /> Visualizar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[9px] font-black uppercase p-0 h-8 flex flex-col gap-0.5 hover:bg-emerald-50 text-emerald-700"
                        onClick={() => handleAction(report, 'Baixar PDF')}
                      >
                        <Download className="size-3" /> PDF
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[9px] font-black uppercase p-0 h-8 flex flex-col gap-0.5 hover:bg-amber-50 text-amber-700"
                        onClick={() => handleAction(report, 'Exportar Excel')}
                      >
                        <FileSpreadsheet className="size-3" /> Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 flex gap-3">
        <Info className="size-5 text-primary shrink-0" />
        <p className="text-xs text-primary/80">
          <strong>Dica NAI:</strong> Se você não encontrar um relatório específico pelo nome, tente buscar pelo <strong>ID Legado</strong> utilizando o filtro de pesquisa do navegador (Ctrl+F). Toda a base foi migrada com sucesso.
        </p>
      </div>
    </div>
  )
}
