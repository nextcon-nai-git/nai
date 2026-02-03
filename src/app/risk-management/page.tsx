
"use client"

import * as React from "react"
import { ShieldAlert, Zap, Search, CheckCircle2, Loader2, AlertTriangle, ShieldCheck, BarChart4 } from "lucide-react"
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
import { riskMitigationPlanGenerator } from "@/ai/flows/risk-mitigation-plan-generator"
import { useToast } from "@/hooks/use-toast"

const risks = [
  { id: 1, role: "Soldador", hazard: "Fumos Metálicos e UV", probability: 4, severity: 5, level: "Crítico", environment: "Oficina de Metalurgia", esocialStatus: "Bloqueado" },
  { id: 2, role: "Auxiliar de Almoxarifado", hazard: "Ergonômico (Levantamento de Peso)", probability: 3, severity: 2, level: "Médio", environment: "Hub Logístico", esocialStatus: "Validado" },
  { id: 3, role: "Assistente Administrativo", hazard: "L.E.R./D.O.R.T. (Teclado)", probability: 2, severity: 1, level: "Baixo", environment: "Escritório Central", esocialStatus: "Validado" },
  { id: 4, role: "Motorista de Caminhão", hazard: "Vibração de Corpo Inteiro", probability: 3, severity: 3, level: "Médio", environment: "Transporte Pesado", esocialStatus: "Validado" },
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
        identifiedRisks: `${risk.hazard} - Nível de impacto: ${risk.level}`,
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
          // Lógica de Severidade (Vertical) x Probabilidade (Horizontal)
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
          <p className="text-muted-foreground">Inventário de riscos dinâmico com matriz de criticidade normativa.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input placeholder="Buscar por GHE ou Cargo..." className="w-64 pl-10 h-11 bg-white border-muted shadow-sm" />
          </div>
          <Button className="bg-primary h-11 px-6 font-bold shadow-lg shadow-primary/20">Novo Inventário</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Inventário de Riscos Ativos</CardTitle>
                <CardDescription>Sincronização automática com eSocial S-2240</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-emerald-600 text-white border-none gap-1">
                  <ShieldCheck className="size-3" /> 142 Validados
                </Badge>
                <Badge variant="destructive" className="animate-pulse gap-1 border-none shadow-md">
                  <AlertTriangle className="size-3" /> 15 Bloqueados
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/10">
                <TableRow>
                  <TableHead className="font-bold">Cargo / Unidade</TableHead>
                  <TableHead className="font-bold">Perigo (Agente)</TableHead>
                  <TableHead className="text-center font-bold">Matriz S x P</TableHead>
                  <TableHead className="font-bold">Nível</TableHead>
                  <TableHead className="font-bold">Compliance eSocial</TableHead>
                  <TableHead className="text-right font-bold">Plano de Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => (
                  <TableRow key={risk.id} className="hover:bg-primary/5 transition-colors group">
                    <TableCell>
                      <div>
                        <p className="font-bold text-primary">{risk.role}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">GHE-00{risk.id} • {risk.environment}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">{risk.hazard}</span>
                        <Badge variant="outline" className="text-[8px] w-fit font-mono uppercase">Cód. eSocial: 01.01.001</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-xs font-black p-1.5 rounded-lg border-2 ${risk.severity * risk.probability > 10 ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-100 bg-emerald-50 text-emerald-700'}`}>
                          {risk.severity}x{risk.probability}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`font-black uppercase text-[10px] ${
                          risk.level === 'Crítico' ? 'bg-red-600' : 
                          risk.level === 'Médio' ? 'bg-orange-500' : 
                          'bg-emerald-600'
                        } border-none text-white`}
                      >
                        {risk.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className={`flex items-center gap-1.5 text-[10px] font-bold ${risk.esocialStatus === 'Bloqueado' ? 'text-red-600' : 'text-emerald-600'}`}>
                          {risk.esocialStatus === 'Bloqueado' ? <AlertTriangle className="size-3" /> : <ShieldCheck className="size-3" />}
                          {risk.esocialStatus}
                        </div>
                        {risk.esocialStatus === 'Bloqueado' && (
                          <p className="text-[8px] text-muted-foreground uppercase">Falta CA vigente no S-2240</p>
                        )}
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
                        IA Estratégica
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <BarChart4 className="size-4 text-primary" />
                <CardTitle className="text-sm font-bold uppercase tracking-widest">Matriz Normativa</CardTitle>
              </div>
              <CardDescription className="text-[10px]">Severidade vs Probabilidade (NR-01)</CardDescription>
            </CardHeader>
            <CardContent>
              {RiskMatrix}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex justify-between text-[10px] text-muted-foreground font-black uppercase">
                  <span>Inócuo</span>
                  <span>Catastrófico</span>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 space-y-2">
                   <p className="text-[10px] font-black text-primary uppercase">Bloqueio Ativo</p>
                   <p className="text-[10px] leading-tight text-primary/70">
                     Riscos em <span className="font-bold text-red-600">Vermelho</span> exigem Plano de Mitigação imediato para liberação do eSocial.
                   </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-accent">Status PGR 2024</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-2">
                <h2 className="text-4xl font-bold">92%</h2>
                <p className="text-[10px] font-medium text-white/60 uppercase">Conformidade Global</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Ações Concluídas</span>
                  <span>18/24</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-accent" style={{ width: '75%' }} />
                </div>
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
                <CardTitle className="text-xl font-headline font-bold">Estratégia de Controle (NR-01/NR-09)</CardTitle>
                <CardDescription className="text-white/60 font-medium">Mitigação de {selectedRisk?.hazard} para o GHE {selectedRisk?.role}</CardDescription>
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-white/10">
                  <p className="text-[10px] text-white/40 uppercase font-black tracking-widest flex items-center gap-2">
                    <ShieldCheck className="size-3" /> Baseado na Portaria 6.730/2020
                  </p>
                  <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => setMitigationPlan(null)}>Descartar</Button>
                    <Button variant="secondary" className="gap-2 font-bold px-8 shadow-xl shadow-black/40">
                      <CheckCircle2 className="size-4" /> Salvar e Atualizar eSocial
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
