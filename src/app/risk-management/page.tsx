
"use client"

import * as React from "react"
import { 
  ShieldAlert, 
  Zap, 
  ShieldCheck, 
  Building2,
  Loader2,
  CheckCircle2,
  FileText
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { riskMitigationPlanGenerator } from "@/ai/flows/risk-mitigation-plan-generator"
import { useToast } from "@/hooks/use-toast"
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"
import { cn } from "@/lib/utils"

const initialRisks = [
  { 
    id: 1, 
    companyId: "44337647000189",
    role: "Operador de Produção", 
    hazard: "Físico: Ruído Contínuo 88dB", 
    probability: 3, 
    severity: 4, 
    level: "Crítico (PR1)", 
    environment: "Pátio de Estamparia", 
    esocialStatus: "Validado",
    recommendation: "Protetor auricular tipo concha."
  },
  { 
    id: 2, 
    companyId: "44337647000189",
    role: "Administrativo", 
    hazard: "Ergonômico: Postura sentada prolongada", 
    probability: 2, 
    severity: 2, 
    level: "Tolerável (PR4)", 
    environment: "Escritório Central", 
    esocialStatus: "Validado",
    recommendation: "Pausas regulares e kit ergonômico."
  },
]

export default function RiskInventoryPGR() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
  const [selectedRisk, setSelectedRisk] = React.useState<any>(null)
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

  const generatePlan = async (risk: any) => {
    setIsGenerating(true)
    setSelectedRisk(risk)
    setMitigationPlan(null)
    try {
      const result = await riskMitigationPlanGenerator({
        identifiedRisks: `${risk.hazard}. Contexto normativo 2026.`,
        environment: risk.environment
      })
      setMitigationPlan(result.mitigationPlan)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na NAI",
        description: "Não foi possível obter recomendações da IA agora."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-[#090e24] tracking-tight">Inventário de Riscos (PGR)</h1>
          <p className="text-muted-foreground">Mapeamento de perigos, riscos e controles para o eSocial.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-64">
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="h-11 bg-white border-[#090e24]/20">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-[#090e24]" />
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
          <Button className="bg-[#090e24] h-11 px-6 font-bold shadow-lg shadow-[#090e24]/20">Novo Inventário</Button>
        </div>
      </div>

      <Card className="card-shadow border-none overflow-hidden">
        <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Exposição por GES (Grupo de Exposição Similar)</CardTitle>
            <CardDescription>Visualização técnica atualizada conforme NR-01.</CardDescription>
          </div>
          <Badge className="bg-emerald-600 text-white border-none gap-1">
            <ShieldCheck className="size-3" /> {filteredRisks.length} Riscos Mapeados
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
                <TableHead className="text-right font-bold">Assistente IA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRisks.map((risk) => (
                <TableRow key={risk.id} className="hover:bg-[#090e24]/5 transition-colors group">
                  <TableCell>
                    <div>
                      <p className="font-bold text-[#090e24]">{risk.environment}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">{risk.role}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="text-xs font-medium">{risk.hazard}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "border-none text-white text-[10px] font-black",
                      risk.level.includes('Crítico') ? 'bg-red-600' : 'bg-emerald-600'
                    )}>
                      {risk.level}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] leading-tight text-muted-foreground">{risk.recommendation}</p>
                      <Badge variant="outline" className="w-fit text-[8px] py-0 px-1.5 text-emerald-600 border-emerald-200">
                        S-2240 {risk.esocialStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-[#090e24] hover:bg-[#090e24] hover:text-white transition-all gap-2 font-bold"
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

      {(selectedRisk || isGenerating) && (
        <Card className="card-shadow border-none bg-[#090e24] text-white overflow-hidden animate-in zoom-in-95 duration-300">
          <CardHeader className="border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#f59e0b]/20 rounded-2xl">
                <Zap className="size-6 text-[#f59e0b] animate-pulse" />
              </div>
              <div>
                <CardTitle className="text-xl font-headline font-bold">Refinamento Inteligente NAI</CardTitle>
                <CardDescription className="text-white/60 font-medium">Mitigação avançada para: {selectedRisk?.environment}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="size-10 animate-spin text-[#f59e0b]" />
                <p className="text-sm font-black uppercase tracking-widest text-[#f59e0b]/80 animate-pulse">NAI Consultando Base de Conhecimento...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 whitespace-pre-wrap leading-relaxed text-sm font-body shadow-inner">
                  {mitigationPlan}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                  <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setSelectedRisk(null)}>Fechar</Button>
                  <Button variant="secondary" className="gap-2 font-bold px-8 shadow-xl shadow-black/40">
                    <CheckCircle2 className="size-4" /> Validar PGR
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
