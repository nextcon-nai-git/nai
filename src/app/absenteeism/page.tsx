"use client"

import * as React from "react"
import { AlertTriangle, ShieldCheck, History, Search, FileText, Gavel, Loader2, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Sentinela do Limbo (NTEP)</h1>
          <p className="text-muted-foreground">Validação de Nexo Técnico Epidemiológico e suporte jurídico automatizado.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><History className="size-4" /> Histórico</Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2"><AlertTriangle className="size-4" /> Novo Registro</Button>
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
              <TableHeader>
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
                          <p className="font-bold">{record.employee}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">{record.role}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{record.cid}</Badge>
                      </TableCell>
                      <TableCell>
                        {isNtep ? (
                          <Badge variant="destructive" className="gap-1 animate-pulse">
                            <AlertTriangle className="size-3" /> CRÍTICO (Nexo)
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700">
                            <ShieldCheck className="size-3" /> Seguro
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{record.days} dias</TableCell>
                      <TableCell className="text-right">
                        {isNtep && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="gap-2 border-primary text-primary hover:bg-primary hover:text-white" onClick={() => handleGenerateContestation(record)}>
                                <Sparkles className="size-3" /> Gerar Defesa
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Gavel className="size-5 text-primary" /> 
                                  Rascunho Jurídico - Contestação NTEP
                                </DialogTitle>
                                <DialogDescription>
                                  Contestação fundamentada baseada em IA para o colaborador {record.employee}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="mt-4 p-4 bg-muted/50 rounded-lg border whitespace-pre-wrap text-sm leading-relaxed">
                                {isGenerating ? (
                                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <Loader2 className="size-8 animate-spin text-primary" />
                                    <p className="text-xs font-bold animate-pulse">Consultando base legal e jurisprudência...</p>
                                  </div>
                                ) : aiDraft ? (
                                  aiDraft
                                ) : (
                                  "Erro ao carregar rascunho."
                                )}
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button variant="ghost" onClick={() => setAiDraft(null)}>Descartar</Button>
                                <Button className="bg-primary">Copiar para Jurídico</Button>
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
              <CardTitle className="text-sm uppercase tracking-wider flex items-center gap-2">
                <Gavel className="size-4 text-accent" /> Alertas Jurídicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-[10px] font-black text-accent mb-1 uppercase tracking-widest">Ação Necessária</p>
                <p className="text-xs leading-tight">O CID {records[0].cid} gera nexo automático. Prazo de contestação: 15 dias.</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-[10px] font-black text-green-400 mb-1 uppercase tracking-widest">Sucesso Recente</p>
                <p className="text-xs leading-tight">A contestação gerada via IA evitou multa de R$ 12.400,00 no eSocial (S-2240).</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
