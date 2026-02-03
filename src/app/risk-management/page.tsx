
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
  ClipboardCheck
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { riskMitigationPlanGenerator } from "@/ai/flows/risk-mitigation-plan-generator"
import { useToast } from "@/hooks/use-toast"

const risks = [
  { 
    id: 1, 
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
    role: "Técnico(a) de SST; Gerente Comercial", 
    hazard: "Acidentes: Condução de veículo em vias públicas", 
    probability: 2, 
    severity: 2, 
    level: "Tolerável (PR4)", 
    environment: "GES 02 - Admin/Operacional", 
    esocialStatus: "Validado",
    recommendation: "Orientar os trabalhadores sobre direção defensiva."
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
  const [selectedRisk, setSelectedRisk] = React.useState<typeof risks[0] | null>(null)
  const [mitigationPlan, setMitigationPlan] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast()

  const generatePlan = async (risk: typeof risks[0]) => {
    setIsLoading(true)
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
      setIsLoading(false)
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
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Gestão de Riscos (NR-01 PGR)</h1>
          <p className="text-muted-foreground">Inventário de riscos e diretrizes de mitigação NXC SST EMPRESARIAL LTDA.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-white border-primary text-primary font-bold px-4 h-11">
            CNPJ: 44.337.647/0001-89
          </Badge>
          <Button className="bg-primary h-11 px-6 font-bold shadow-lg shadow-primary/20">Novo Inventário</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <Card className="card-shadow border-none overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Inventário de Riscos Ativos</CardTitle>
                  <CardDescription>Visualização por Grupo de Exposição Similar (GES)</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-emerald-600 text-white border-none gap-1">
                    <ShieldCheck className="size-3" /> 3 Riscos Mapeados
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow>
                    <TableHead className="font-bold">GES / Setor</TableHead>
                    <TableHead className="font-bold">Agente de Risco</TableHead>
                    <TableHead className="font-bold text-center">Nível (PR)</TableHead>
                    <TableHead className="font-bold">Medida de Controle</TableHead>
                    <TableHead className="text-right font-bold">Refinar IA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {risks.map((risk) => (
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
                        <p className="text-[10px] leading-tight text-muted-foreground">
                          {risk.recommendation}
                        </p>
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
                  ))}
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
                   Os riscos da Nextcon estão em zona <span className="font-bold text-emerald-600">Verde</span>. Monitoramento periódico recomendado.
                 </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-accent">Vencimento PGR</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-bold">13/08/2026</h2>
              <p className="text-[10px] font-medium text-white/60 uppercase mt-1">Status: Vigente (Curitiba/PR)</p>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-emerald-500" style={{ width: '85%' }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {(selectedRisk || isLoading) && (
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
            {isLoading ? (
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
