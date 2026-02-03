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
    esocialStatus: "Validado 2026",
    recommendation: "Orientar sobre pausas conforme NR-17 (Rev. 2026)."
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
    esocialStatus: "Validado 2026",
    recommendation: "Orientar sobre pausas conforme NR-17."
  },
]

export default function RiskManagement() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
  const [selectedRisk, setSelectedRisk] = React.useState<typeof initialRisks[0] | null>(null)
  const [mitigationPlan, setMitigationPlan] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "managedCompanies"), orderBy("name", "asc"))
  }, [db, user])

  const { data: companies } = useCollection(companiesQuery)

  const filteredRisks = React.useMemo(() => {
    if (selectedCompanyId === "all") return initialRisks
    return initialRisks.filter(r => r.companyId === selectedCompanyId)
  }, [selectedCompanyId])

  const generatePlan = async (risk: typeof initialRisks[0]) => {
    setIsGenerating(true)
    setSelectedRisk(risk)
    try {
      const result = await riskMitigationPlanGenerator({
        identifiedRisks: `${risk.hazard}. Contexto NAI 2026.`,
        environment: risk.environment
      })
      setMitigationPlan(result.mitigationPlan)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na NAI",
        description: "Não foi possível obter as recomendações da IA NAI agora."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Gestão de Riscos (PGR) 2026</h1>
          <p className="text-muted-foreground">Inventário unificado e diretrizes NAI corporativas.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="card-shadow border-none overflow-hidden">
            <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Inventário NAI 2026</CardTitle>
                <CardDescription>Visualização GES com suporte NAI</CardDescription>
              </div>
              <Badge className="bg-emerald-600 text-white border-none gap-1">
                <ShieldCheck className="size-3" /> {filteredRisks.length} Riscos OK
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="font-bold">Setor / GES</TableHead>
                    <TableHead className="font-bold">Agente de Risco</TableHead>
                    <TableHead className="font-bold text-center">Nível (PR)</TableHead>
                    <TableHead className="font-bold">Controle eSocial 2026</TableHead>
                    <TableHead className="text-right font-bold">Refinar NAI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRisks.map((risk) => (
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
                        <Badge className="bg-emerald-600 border-none text-white text-[10px] font-black">
                          {risk.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <p className="text-[10px] leading-tight text-muted-foreground">{risk.recommendation}</p>
                          <Badge variant="outline" className="w-fit text-[8px] py-0 px-1.5 text-emerald-600 border-emerald-200">
                            {risk.esocialStatus}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-primary hover:bg-primary hover:text-white transition-all gap-2 font-bold"
                          onClick={() => generatePlan(risk)}
                        >
                          <Zap className="size-3 fill-current" />
                          NAI
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-accent">Vigência PGR 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-bold">13/08/2026</h2>
              <p className="text-[10px] font-medium text-white/60 uppercase mt-1">Status NAI: Atualizado</p>
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
                <CardTitle className="text-xl font-headline font-bold">Refinamento NAI 2026</CardTitle>
                <CardDescription className="text-white/60 font-medium">Análise avançada para {selectedRisk?.environment}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="size-10 animate-spin text-accent" />
                <p className="text-sm font-black uppercase tracking-widest text-accent/80 animate-pulse">NAI Analisando Normas 2026...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 whitespace-pre-wrap leading-relaxed text-sm font-body shadow-inner">
                  {mitigationPlan}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setMitigationPlan(null)}>Fechar</Button>
                  <Button variant="secondary" className="gap-2 font-bold px-8 shadow-xl shadow-black/40">
                    <CheckCircle2 className="size-4" /> Aplicar PGR 2026
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
