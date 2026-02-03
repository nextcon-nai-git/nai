"use client"

import * as React from "react"
import { 
  SearchCheck, 
  FileWarning, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  ShieldAlert, 
  ShieldCheck,
  ArrowRight,
  Info,
  ExternalLink,
  Ban,
  Sparkles,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { runEsocialAudit, type EsocialAuditOutput } from "@/ai/flows/esocial-audit-flow"

export default function EsocialAudit() {
  const { toast } = useToast()
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [aiReport, setAiReport] = React.useState<EsocialAuditOutput | null>(null)

  const handleRunAiAudit = async () => {
    setIsAuditing(true)
    setAiReport(null)
    
    try {
      const result = await runEsocialAudit({
        sector: "Produção e Metalurgia",
        riskList: ["Ruído Contínuo 88dB", "Fumos Metálicos", "Calor"],
        examList: ["Exame Clínico", "Espirometria"]
      })
      
      setAiReport(result)
      toast({
        title: "Auditoria Finalizada",
        description: "A IA Gemini analisou as inconsistências do seu eSocial com sucesso.",
      })
    } catch (error: any) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Falha na Auditoria",
        description: error.message || "Erro desconhecido ao processar a IA.",
      })
    } finally {
      setIsAuditing(false)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Vigilante eSocial</h1>
          <p className="text-muted-foreground">Módulo de Auditoria Ativa com Inteligência Artificial Gemini.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRunAiAudit} 
            disabled={isAuditing} 
            className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20 h-12 px-6"
          >
            {isAuditing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-5 text-accent" />}
            {isAuditing ? "Gemini Analisando..." : "Auditoria Inteligente (IA)"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-none bg-red-50 relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-red-900 uppercase tracking-widest">Inconsistências</p>
                <p className="text-4xl font-bold text-red-700">
                  {aiReport ? aiReport.criticalGaps.length : "---"}
                </p>
              </div>
            </div>
            <p className="text-[10px] text-red-600 font-bold mt-4 uppercase">Gaps Identificados pela IA</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-emerald-50 relative overflow-hidden">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Compliance Score</p>
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-bold text-emerald-700">
                    {aiReport ? `${aiReport.complianceScore}%` : "---"}
                  </p>
                  {aiReport && (
                    <div className="flex-1 w-20">
                      <Progress value={aiReport.complianceScore} className="h-2 bg-emerald-200" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-4 uppercase">Nível de Conformidade eSocial</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none gradient-primary text-white">
          <CardHeader className="py-4">
            <CardTitle className="text-xs uppercase font-black flex items-center gap-2">
              <Sparkles className="size-3 text-accent" /> Insight Estratégico
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] leading-relaxed italic text-white/80">
              {aiReport ? aiReport.aiInsight : "Clique no botão acima para iniciar a análise dos dados cruzados de PGR e PCMSO pelo Gemini."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-xl">Relatório Detalhado de Conformidade</CardTitle>
            <CardDescription>Cruzamento de Riscos (S-2240) vs Exames Médicos (S-2220).</CardDescription>
          </CardHeader>
          <CardContent>
            {aiReport ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Gap de Segurança / eSocial</TableHead>
                      <TableHead>Impacto Jurídico/Multa</TableHead>
                      <TableHead>Medida Corretiva</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiReport.criticalGaps.map((gap, i) => (
                      <TableRow key={i} className="hover:bg-red-50/10 transition-colors">
                        <TableCell className="font-bold text-red-700">{gap.description}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{gap.legalImpact}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] border-primary text-primary bg-primary/5 uppercase font-black">
                            {gap.recommendation}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-24 border-2 border-dashed rounded-xl opacity-40">
                <SearchCheck className="size-14 mx-auto mb-4 text-primary" />
                <p className="text-sm font-black uppercase tracking-widest">Aguardando Auditoria</p>
                <p className="text-xs mt-1">A IA está pronta para validar seu próximo lote de envios.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-muted-foreground tracking-widest">Resumo do Lote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Prontos para envio:</span>
                <span className="font-bold text-emerald-600">142</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Bloqueios Críticos:</span>
                <span className="font-bold text-red-600">{aiReport ? aiReport.criticalGaps.length : "0"}</span>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 h-12 font-bold shadow-lg" disabled={!aiReport || aiReport.criticalGaps.length > 0}>
                Transmitir Validado
              </Button>
              {!aiReport && (
                <p className="text-[9px] text-center text-muted-foreground uppercase font-bold">Inicie a Auditoria para liberar o lote</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
