"use client"

import * as React from "react"
import { AlertTriangle, ShieldCheck, History, Search, FileText, Gavel, Loader2, Sparkles, FileDown, Copy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { generateNtepContestation } from "@/ai/flows/ntep-contestation-generator"

const NTEP_MAPPING: Record<string, string[]> = {
  "25.3": ["M54", "G56", "S62"],
  "49.3": ["F32", "Z73", "M54"],
}

const initialRecords = [
  { id: 1, employee: "João Silva", role: "Soldador", cid: "M54.5", days: 18, status: "Afastado (INSS)", cnae: "25.3", environment: "Oficina de Metalurgia" },
  { id: 2, employee: "Ana Costa", role: "Motorista", cid: "F32.1", days: 45, status: "Aguardando Perícia", cnae: "49.3", environment: "Transporte de Cargas" },
  { id: 3, employee: "Carlos Oliveira", role: "Auxiliar", cid: "S62.0", days: 5, status: "Retorno", cnae: "25.3", environment: "Depósito" },
]

export default function LimboSentinel() {
  const { toast } = useToast()
  const [records] = React.useState(initialRecords)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [aiDraft, setAiDraft] = React.useState<string | null>(null)

  const checkNTEP = (cid: string, cnae: string) => {
    const baseCid = cid.split('.')[0]
    return NTEP_MAPPING[cnae]?.includes(baseCid)
  }

  async function handleGenerateContestation(record: typeof initialRecords[0]) {
    setIsGenerating(true)
    setAiDraft(null)
    try {
      const result = await generateNtepContestation({
        cnae: record.cnae,
        cid: record.cid,
        jobRole: record.role,
        workEnvironment: record.environment
      })
      setAiDraft(result.contestationDraft)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na IA",
        description: "Não foi possível gerar a contestação jurídica agora."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleExportPDF = () => {
    toast({
      title: "PDF Gerado",
      description: "O rascunho jurídico foi exportado com sucesso."
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Sentinela do Limbo (NTEP)</h1>
          <p className="text-muted-foreground">Validação de Nexo Técnico Epidemiológico e suporte jurídico automatizado.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><History className="size-4" /> Histórico</Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2 shadow-lg shadow-accent/20"><AlertTriangle className="size-4" /> Novo Registro</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Gestão de Absenteísmo</CardTitle>
            <CardDescription>Monitoramento de Nexo Técnico para proteção contra encargos indevidos.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>CID</TableHead>
                  <TableHead>Nexo NTEP</TableHead>
                  <TableHead>Dias</TableHead>
                  <TableHead className="text-right">Ação Jurídica</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => {
                  const isNtep = checkNTEP(record.cid, record.cnae)
                  return (
                    <TableRow key={record.id} className={isNtep ? "bg-red-50/50" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-bold text-primary">{record.employee}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{record.role}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono bg-white">{record.cid}</Badge>
                      </TableCell>
                      <TableCell>
                        {isNtep ? (
                          <Badge variant="destructive" className="gap-1 animate-pulse border-none shadow-sm shadow-destructive/40">
                            <AlertTriangle className="size-3" /> CRÍTICO (Nexo)
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 border-none">
                            <ShieldCheck className="size-3" /> Seguro
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{record.days} dias</TableCell>
                      <TableCell className="text-right">
                        {isNtep && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white" onClick={() => handleGenerateContestation(record)}>
                                <Sparkles className="size-3" /> Gerar Defesa
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl">
                              <DialogHeader className="p-6 bg-primary text-white">
                                <DialogTitle className="flex items-center gap-2 text-xl font-headline">
                                  <Gavel className="size-6 text-accent" /> 
                                  Rascunho Jurídico - Contestação NTEP
                                </DialogTitle>
                                <DialogDescription className="text-white/70">
                                  Defesa fundamentada em IA para o colaborador {record.employee}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex-1 overflow-y-auto p-6 bg-muted/20">
                                {isGenerating ? (
                                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="relative">
                                      <Loader2 className="size-12 animate-spin text-primary" />
                                      <Sparkles className="absolute -top-2 -right-2 size-6 text-accent animate-pulse" />
                                    </div>
                                    <p className="text-sm font-black text-primary animate-pulse uppercase tracking-widest">Consultando base legal e jurisprudência...</p>
                                  </div>
                                ) : aiDraft ? (
                                  <div className="bg-white p-8 rounded-xl border shadow-inner whitespace-pre-wrap text-sm leading-relaxed font-body">
                                    {aiDraft}
                                  </div>
                                ) : (
                                  <div className="text-center py-10 text-muted-foreground">Erro ao carregar rascunho.</div>
                                )}
                              </div>
                              <div className="p-4 bg-white border-t flex justify-between items-center">
                                <div className="text-[10px] text-muted-foreground uppercase font-black">Powered by Sentinel AI Legal</div>
                                <div className="flex gap-2">
                                  <Button variant="ghost" onClick={() => setAiDraft(null)}>Descartar</Button>
                                  <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
                                    <FileDown className="size-4" /> Exportar PDF
                                  </Button>
                                  <Button className="bg-primary gap-2">
                                    <Copy className="size-4" /> Copiar Texto
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2 font-black">
                <Gavel className="size-4 text-accent" /> Alertas Jurídicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                <p className="text-[10px] font-black text-accent mb-1 uppercase tracking-widest">Ação Necessária</p>
                <p className="text-xs leading-tight">O CID {records[0].cid} gera nexo automático. Prazo de contestação INSS: <span className="font-bold text-accent">15 dias</span>.</p>
              </div>
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                <p className="text-[10px] font-black text-green-400 mb-1 uppercase tracking-widest text-emerald-400">Sucesso Recente</p>
                <p className="text-xs leading-tight">A contestação gerada via IA evitou multa automática de <span className="font-bold">R$ 12.400,00</span> no eSocial (S-2240).</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Monitoramento INSS</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <h2 className="text-3xl font-bold text-primary">85%</h2>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Eficiência</Badge>
              </div>
              <Progress value={85} className="h-1.5 mt-2" />
              <p className="text-[10px] text-muted-foreground mt-2">Taxa de sucesso em contestações administrativas.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
