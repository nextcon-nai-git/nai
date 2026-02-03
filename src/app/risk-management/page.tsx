
"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Zap, 
  Search, 
  CheckCircle2, 
  Loader2, 
  AlertTriangle, 
  ShieldCheck, 
  BarChart4,
  LayoutList,
  Monitor,
  Accessibility,
  Ban,
  ClipboardCheck,
  Building2,
  CalendarClock,
  AlertCircle,
  Filter
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { riskMitigationPlanGenerator } from "@/ai/flows/risk-mitigation-plan-generator"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

const initialRisks = [
  { 
    id: 1, 
    companyId: "44337647000189",
    role: "Estagiário(a) de SST; Estagiário(a) Comercial", 
    hazard: "Ergonômico: Postura sentada por longos períodos", 
    probability: 2, 
    severity: 2, 
    level: "Tolerável (PR4)", 
    environment: "GES 01 - Administrativo", 
    esocialStatus: "Validado",
    recommendation: "Orientar sobre pausas e posturas conforme NR-17."
  },
  { 
    id: 2, 
    companyId: "44337647000189",
    role: "Técnico(a) de SST; Gerente Comercial", 
    hazard: "Ergonômico: Postura sentada por longos períodos", 
    probability: 2, 
    severity: 2, 
    level: "Tolerável (PR4)", 
    environment: "GES 02 - Admin/Operacional", 
    esocialStatus: "Validado",
    recommendation: "Orientar sobre pausas e posturas conforme NR-17."
  },
  { 
    id: 3, 
    companyId: "44337647000189",
    role: "Técnico(a) de SST; Gerente Comercial", 
    hazard: "Acidentes: Condução de veículo em vias públicas", 
    probability: 2, 
    severity: 2, 
    level: "Tolerável (PR4)", 
    environment: "GES 02 - Admin/Operacional", 
    esocialStatus: "Validado",
    recommendation: "Orientar os trabalhadores sobre direção defensiva."
  },
  { 
    id: 4, 
    companyId: "outra_empresa",
    role: "Operador de Empilhadeira", 
    hazard: "Físico: Ruído Contínuo 92dB", 
    probability: 4, 
    severity: 4, 
    level: "Substancial (PR16)", 
    environment: "Produção", 
    esocialStatus: "Pendente",
    recommendation: "Uso obrigatório de protetor auricular e enclausuramento de fonte."
  }
]

const pgrChecklist = [
  {
    category: "Mobiliário e Equipamentos",
    icon: Monitor,
    items: [
      "Uso de adaptador de altura para monitor e suporte para notebook.",
      "Uso de apoio para os pés e suporte para antebraços.",
      "Cadeira com regulagens e mesa confortável."
    ]
  },
  {
    category: "Postura e Pausas",
    icon: Accessibility,
    items: [
      "Manter pescoço reto, ombros relaxados e lombar totalmente encostada na cadeira.",
      "Evitar cruzar as pernas; mantê-las afastadas e apoiadas.",
      "Realizar pequenas pausas, levantar-se e movimentar-se durante a jornada."
    ]
  },
  {
    category: "Proibições e Deveres",
    icon: Ban,
    items: [
      "Proibido o uso de celular durante o horário de trabalho.",
      "Proibido o consumo de bebida alcoólica durante toda a jornada (incluindo almoço).",
      "Manter o ambiente limpo e organizado."
    ]
  }
]

export default function RiskManagement() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
  const [selectedRisk, setSelectedRisk] = React.useState<typeof initialRisks[0] | null>(null)
  const [mitigationPlan, setMitigationPlan] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)

  // Busca empresas reais do Firestore para o filtro
  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])

  const { data: companies, isLoading: loadingCompanies } = useCollection(companiesQuery)

  const filteredRisks = React.useMemo(() => {
    if (selectedCompanyId === "all") return initialRisks
    return initialRisks.filter(r => r.companyId === selectedCompanyId)
  }, [selectedCompanyId])

  const urgentRisks = initialRisks.filter(r => {
    const score = r.probability * r.severity
    return score >= 15
  })

  const selectedCompany = companies?.find(c => c.id === selectedCompanyId)

  const generatePlan = async (risk: typeof initialRisks[0]) => {
    setIsGenerating(true)
    setSelectedRisk(risk)
    try {
      const result = await riskMitigationPlanGenerator({
        identifiedRisks: `${risk.hazard}. Contexto Nextcon: Mobiliário ergonômico, pausas NR-17 e proibição de distrações.`,
        environment: risk.environment
      })
      setMitigationPlan(result.mitigationPlan)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar plano",
        description: "Não foi possível obter as recomendações da IA neste momento."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const RiskMatrix = React.useMemo(() => {
    return (
      <div className="grid grid-cols-5 gap-1 aspect-square w-full">
        {Array.from({ length: 25 }).map((_, i) => {
          const row = Math.floor(i / 5);
          const col = i % 5;
          const severity = 5 - row;
          const probability = col + 1;
          const score = severity * probability;
          
          let bgClass = "bg-emerald-100";
          if (score >= 15) bgClass = "bg-red-600";
          else if (score >= 9) bgClass = "bg-orange-500";
          else if (score >= 4) bgClass = "bg-yellow-400";

          return (
            <div 
              key={i} 
              className={`${bgClass} rounded-sm flex items-center justify-center text-[10px] font-black text-black/60 transition-all hover:scale-110 cursor-help`}
              title={`Severidade ${severity} x Probabilidade ${probability} = Score ${score}`}
            >
              {score}
            </div>
          )
        })}
      </div>
    )
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Gestão de Riscos (PGR)</h1>
          <p className="text-muted-foreground">Inventário unificado e diretrizes de mitigação corporativas.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="h-11 bg-white border-primary/20">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  <SelectValue placeholder="Filtrar por Cliente" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Clientes</SelectItem>
                {companies?.map(company => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-primary h-11 px-6 font-bold shadow-lg shadow-primary/20">Novo Inventário</Button>
        </div>
      </div>

      {/* Seção de Alertas Críticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedCompany?.pgrExpiry && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-900 shadow-sm">
            <CalendarClock className="size-4 text-amber-600" />
            <AlertTitle className="font-bold uppercase text-[10px] tracking-widest">Alerta de Vigência</AlertTitle>
            <AlertDescription className="text-sm">
              O PGR de <span className="font-bold">{selectedCompany.name}</span> vence em <span className="font-bold">{new Date(selectedCompany.pgrExpiry).toLocaleDateString('pt-BR')}</span>. Restam aproximadamente {Math.ceil((new Date(selectedCompany.pgrExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias.
            </AlertDescription>
          </Alert>
        )}
        
        {urgentRisks.length > 0 && selectedCompanyId === "all" && (
          <Alert variant="destructive" className="border-red-200 shadow-sm">
            <AlertCircle className="size-4" />
            <AlertTitle className="font-bold uppercase text-[10px] tracking-widest">Criticidade Urgente</AlertTitle>
            <AlertDescription className="text-sm">
              Identificamos <span className="font-bold">{urgentRisks.length} risco(s)</span> com nível de PR substancial na base global. Requer revisão imediata de EPIs.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="card-shadow border-none overflow-hidden">
            <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Inventário de Riscos Ativos</CardTitle>
                <CardDescription>Visualização por Grupo de Exposição Similar (GES)</CardDescription>
              </div>
              <Badge className="bg-emerald-600 text-white border-none gap-1">
                <ShieldCheck className="size-3" /> {filteredRisks.length} Riscos Exibidos
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="font-bold">Setor / GES</TableHead>
                    <TableHead className="font-bold">Agente de Risco</TableHead>
                    <TableHead className="font-bold text-center">Nível (PR)</TableHead>
                    <TableHead className="font-bold">Controle eSocial</TableHead>
                    <TableHead className="text-right font-bold">Refinar IA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRisks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                        <Filter className="size-10 mx-auto opacity-10 mb-4" />
                        <p>Nenhum risco mapeado para este filtro.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRisks.map((risk) => {
                      const score = risk.probability * risk.severity
                      return (
                        <TableRow key={risk.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell>
                            <div>
                              <p className="font-bold text-primary">{risk.environment}</p>
                              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{risk.role}</p>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px]">
                            <span className="text-xs font-medium">{risk.hazard}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={`${score >= 15 ? 'bg-red-600' : 'bg-emerald-600'} border-none text-white text-[10px] font-black`}>
                              {risk.level}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <p className="text-[10px] leading-tight text-muted-foreground">{risk.recommendation}</p>
                              <Badge variant="outline" className={`w-fit text-[8px] py-0 px-1.5 ${risk.esocialStatus === 'Validado' ? 'text-emerald-600 border-emerald-200' : 'text-amber-600 border-amber-200'}`}>
                                S-2240: {risk.esocialStatus}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-primary hover:bg-primary hover:text-white transition-all gap-2 font-bold group-hover:scale-105"
                              onClick={() => generatePlan(risk)}
                            >
                              <Zap className="size-3 fill-current" />
                              IA
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="p-2 bg-primary text-white rounded-lg">
                <ClipboardCheck className="size-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Diretrizes de Mitigação e OS</CardTitle>
                <CardDescription>Critérios mandatórios para rotina diária e Ordens de Serviço.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pgrChecklist.map((section) => (
                  <div key={section.category} className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                      <section.icon className="size-4 text-primary" />
                      <h3 className="text-xs font-black uppercase tracking-widest text-primary">{section.category}</h3>
                    </div>
                    <ul className="space-y-3">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex gap-2 items-start">
                          <div className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                          <span className="text-xs leading-relaxed text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart4 className="size-4 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Matriz Normativa</CardTitle>
              </div>
              <CardDescription className="text-[10px]">Análise de Criticidade NR-01</CardDescription>
            </CardHeader>
            <CardContent>
              {RiskMatrix}
              <div className="mt-4 p-3 bg-primary/5 rounded-xl border border-primary/10">
                 <p className="text-[10px] font-black text-primary uppercase">Diagnóstico</p>
                 <p className="text-[10px] leading-tight text-primary/70 mt-1">
                   Os riscos exibidos estão majoritariamente em zona <span className="font-bold text-emerald-600">Verde</span>. Atenção aos riscos em <span className="font-bold text-red-600">Vermelho</span>.
                 </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-accent">Status PGR Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-bold">{selectedCompany?.pgrExpiry ? new Date(selectedCompany.pgrExpiry).toLocaleDateString('pt-BR') : "---"}</h2>
              <p className="text-[10px] font-medium text-white/60 uppercase mt-1">
                {selectedCompany ? `Empresa: ${selectedCompany.name}` : "Selecione um cliente"}
              </p>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-emerald-500" style={{ width: selectedCompany ? '85%' : '0%' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {(selectedRisk || isGenerating) && (
        <Card className="card-shadow border-none gradient-primary text-white overflow-hidden animate-in zoom-in-95 duration-300">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/20 rounded-2xl">
                <Zap className="size-6 text-accent animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold">Refinamento IA - NR-17 / NR-01</CardTitle>
                <CardDescription className="text-white/60 font-medium">Estratégia avançada para {selectedRisk?.environment}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="size-10 animate-spin text-accent" />
                <p className="text-sm font-black uppercase tracking-widest text-accent/80 animate-pulse">Consultando Normas Regulamentadoras...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 whitespace-pre-wrap leading-relaxed text-sm font-body shadow-inner">
                  {mitigationPlan}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setMitigationPlan(null)}>Fechar</Button>
                  <Button variant="secondary" className="gap-2 font-bold px-8 shadow-xl shadow-black/40">
                    <CheckCircle2 className="size-4" /> Aplicar ao PGR
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
