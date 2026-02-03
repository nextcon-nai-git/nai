
"use client"

import * as React from "react"
import { ShieldAlert, Zap, Search, CheckCircle2, Loader2, AlertTriangle, ShieldCheck } from "lucide-react"
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
  { id: 1, role: "Soldador", hazard: "Fumos Metálicos e UV", probability: 3, severity: 4, level: "Alto", environment: "Oficina de Metalurgia", esocialStatus: "Bloqueado" },
  { id: 2, role: "Auxiliar de Almoxarifado", hazard: "Ergonômico (Levantamento de Peso)", probability: 4, severity: 2, level: "Médio", environment: "Hub Logístico", esocialStatus: "Validado" },
  { id: 3, role: "Assistente Administrativo", hazard: "L.E.R./D.O.R.T.", probability: 2, severity: 1, level: "Baixo", environment: "Escritório Central", esocialStatus: "Validado" },
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
          const intensity = (4 - row) + col;
          let bgClass = "bg-green-100";
          if (intensity > 6) bgClass = "bg-red-500";
          else if (intensity > 4) bgClass = "bg-orange-400";
          else if (intensity > 2) bgClass = "bg-yellow-300";

          return (
            <div 
              key={i} 
              className={`${bgClass} rounded-sm flex items-center justify-center text-[8px] font-bold text-black/40`}
            >
              {intensity}
            </div>
          )
        })}
      </div>
    )
  }, []);

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary">Gestão de Riscos (PGR)</h1>
          <p className="text-muted-foreground">Inventário de riscos e sincronização automática com o eSocial S-2240.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Filtrar por cargo..." className="w-64" />
          <Button variant="outline" size="icon"><Search className="size-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Inventário de Riscos Ativos</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-emerald-600 bg-emerald-50 border-emerald-100 gap-1">
                <ShieldCheck className="size-3" /> 142 Validados
              </Badge>
              <Badge variant="outline" className="text-red-600 bg-red-50 border-red-100 gap-1">
                <AlertTriangle className="size-3" /> 15 Bloqueados
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Cargo / GHE</TableHead>
                  <TableHead>Perigo Identificado</TableHead>
                  <TableHead className="text-center">Matriz</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status Vigilante</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {risks.map((risk) => (
                  <TableRow key={risk.id}>
                    <TableCell>
                      <div>
                        <p className="font-bold text-primary">{risk.role}</p>
                        <p className="text-[10px] text-muted-foreground uppercase font-black">GHE-00{risk.id}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] text-sm">{risk.hazard}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-xs font-bold text-muted-foreground">{risk.probability}x{risk.severity}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={risk.level === 'Alto' ? 'destructive' : risk.level === 'Médio' ? 'default' : 'secondary'}
                        className={risk.level === 'Médio' ? 'bg-accent hover:bg-accent/90' : ''}
                      >
                        {risk.level}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`gap-1 ${risk.esocialStatus === 'Bloqueado' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'} border-none`}
                      >
                        {risk.esocialStatus === 'Bloqueado' ? <AlertTriangle className="size-3" /> : <ShieldCheck className="size-3" />}
                        {risk.esocialStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-primary gap-2"
                        onClick={() => generatePlan(risk)}
                      >
                        <Zap className="size-3 fill-current" />
                        Plano IA
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Matriz de Riscos</CardTitle>
            <CardDescription>Probabilidade vs Gravidade</CardDescription>
          </CardHeader>
          <CardContent>
            {RiskMatrix}
            <div className="mt-4 flex justify-between text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
              <span>Risco Baixo</span>
              <span>Risco Crítico</span>
            </div>
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
               <p className="text-[10px] font-black text-primary uppercase mb-2">Atenção eSocial</p>
               <p className="text-xs text-primary/80 leading-relaxed">
                 Riscos de nível <span className="font-bold">Alto</span> sem mitigação (EPI) ou exame médico bloqueiam automaticamente o envio S-2240 via Módulo Vigilante.
               </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(selectedRisk || isLoading) && (
        <Card className="card-shadow border-none gradient-primary text-white overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="size-5 text-accent animate-pulse" />
              <CardTitle className="text-lg">Estratégia IA: {selectedRisk?.role}</CardTitle>
            </div>
            <CardDescription className="text-white/70">Melhores práticas para {selectedRisk?.hazard} em {selectedRisk?.environment}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <Loader2 className="size-8 animate-spin text-accent" />
                <p className="text-sm">Analisando ambiente de trabalho e normas regulamentadoras...</p>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-white/10 p-4 rounded-lg border border-white/20 whitespace-pre-wrap leading-relaxed text-sm">
                  {mitigationPlan}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" size="sm" className="gap-2">
                    <CheckCircle2 className="size-3" /> Salvar no PGR e Sincronizar eSocial
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
