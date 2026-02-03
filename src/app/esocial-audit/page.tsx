
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
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
      // Simulando a análise de uma amostra da base real
      const result = await runEsocialAudit({
        sector: "Produção e Metalurgia",
        riskList: ["Ruído Contínuo 88dB", "Fumos Metálicos", "Calor"],
        examList: ["Exame Clínico", "Espirometria"]
      })
      
      setAiReport(result)
      toast({
        title: "Auditoria Finalizada",
        description: "A IA Gemini analisou as inconsistências do seu eSocial.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Falha na IA",
        description: "Verifique sua chave GOOGLE_GENAI_API_KEY no arquivo .env.local",
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
                <p className="text-[10px] font-black text-red-900 uppercase tracking-widest">Envios Bloqueados</p>
                <p className="text-4xl font-bold text-red-700">{aiReport ? aiReport.criticalGaps.length : "15"}</p>
              </div>
            </div>
            <p className="text-[10px] text-red-600 font-bold mt-4 uppercase">Inconsistências Detectadas</p>
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
                  <p className="text-4xl font-bold text-emerald-700">{aiReport ? `${aiReport.complianceScore}%` : "82%"}</p>
                  <div className="flex-1 w-20">
                    <Progress value={aiReport ? aiReport.complianceScore : 82} className="h-2 bg-emerald-200" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-4 uppercase">Validado pela IA</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none gradient-primary text-white">
          <CardHeader className="py-4">
            <CardTitle className="text-xs uppercase font-black flex items-center gap-2">
              <Sparkles className="size-3 text-accent" /> Insight do Gemini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] leading-relaxed italic text-white/80">
              {aiReport ? aiReport.aiInsight : "Inicie a auditoria para que o Gemini analise o cruzamento de dados entre PGR e PCMSO."}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-xl">Relatório de Auditoria Detalhado</CardTitle>
            <CardDescription>Conformidade de cruzamento de eventos S-2240 (Riscos) e S-2220 (Saúde).</CardDescription>
          </CardHeader>
          <CardContent>
            {aiReport ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead>Inconsistência</TableHead>
                      <TableHead>Impacto Jurídico</TableHead>
                      <TableHead>Ação Recomendada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiReport.criticalGaps.map((gap, i) => (
                      <TableRow key={i} className="bg-red-50/20">
                        <TableCell className="font-bold text-red-700">{gap.description}</TableCell>
                        <TableCell className="text-xs">{gap.legalImpact}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] border-primary text-primary">
                            {gap.recommendation}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed rounded-xl opacity-40">
                <SearchCheck className="size-12 mx-auto mb-4" />
                <p className="text-sm font-bold uppercase">Nenhuma auditoria processada nesta sessão</p>
                <p className="text-xs">Utilize o botão "Auditoria Inteligente" para iniciar.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-muted-foreground">Próximo Lote eSocial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Registros Prontos:</span>
                <span className="font-bold text-emerald-600">142</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bloqueados (IA):</span>
                <span className="font-bold text-red-600">{aiReport ? aiReport.criticalGaps.length : "15"}</span>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90" disabled={!aiReport}>
                Liberar Lote Validado
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
