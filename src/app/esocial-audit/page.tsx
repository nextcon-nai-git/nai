
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
  Ban
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

const auditRules = [
  { 
    id: 1, 
    event: "S-2240", 
    rule: "Vínculo Risco x Exame",
    description: "Todo risco Físico (Ruído) deve possuir Audiometria vigente no S-2220.", 
    status: "Falha", 
    impact: "Multa de R$ 2.345,00 por colaborador (Art. 201 CLT)",
    count: 12 
  },
  { 
    id: 2, 
    event: "S-2220", 
    rule: "Retorno ao Trabalho",
    description: "Exames de Retorno obrigatórios para afastamentos > 30 dias (INSS).", 
    status: "OK", 
    impact: "Bloqueio de folha de pagamento",
    count: 0 
  },
  { 
    id: 3, 
    event: "S-2240", 
    rule: "Cronologia de Admissão",
    description: "Início da condição de risco não pode ser anterior à data de admissão.", 
    status: "Falha", 
    impact: "Erro de validação no portal eSocial",
    count: 3 
  },
  { 
    id: 4, 
    event: "S-2210", 
    rule: "Prazo de CAT",
    description: "Abertura de CAT deve ocorrer em até 24h do evento.", 
    status: "Alerta", 
    impact: "Fiscalização imediata do Ministério do Trabalho",
    count: 2 
  },
]

const criticalGaps = [
  { employee: "João Silva", risk: "Ruído (88dB)", missing: "Audiometria", sector: "Manutenção" },
  { employee: "Marcos Souza", risk: "Poeira de Sílica", missing: "Raio-X Tórax", sector: "Produção" },
  { employee: "Ana Paula", risk: "Químico (Acetona)", missing: "EAS/Sangue", sector: "Laboratório" },
]

export default function EsocialAudit() {
  const { toast } = useToast()
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [auditComplete, setAuditComplete] = React.useState(false)

  const runAudit = () => {
    setIsAuditing(true)
    setAuditComplete(false)
    setTimeout(() => {
      setIsAuditing(false)
      setAuditComplete(true)
      toast({
        title: "Auditoria Concluída",
        description: "Foram encontrados 15 pontos críticos que impedem o envio seguro.",
      })
    }, 2500)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Vigilante eSocial</h1>
          <p className="text-muted-foreground">Módulo de Auditoria Ativa: Bloqueio de envios inconsistentes para o Governo.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={runAudit} 
            disabled={isAuditing} 
            className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20 h-12 px-6"
          >
            {isAuditing ? <RefreshCw className="size-4 animate-spin" /> : <SearchCheck className="size-5" />}
            {isAuditing ? "Auditando Base..." : "Rodar Auditoria Completa"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-none bg-red-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Ban className="size-20 text-red-900" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-600 text-white rounded-2xl shadow-lg">
                <ShieldAlert className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-red-900 uppercase tracking-widest">Envios Bloqueados</p>
                <p className="text-4xl font-bold text-red-700">15</p>
              </div>
            </div>
            <p className="text-[10px] text-red-600 font-bold mt-4 uppercase">Risco de Multa Imediata</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-amber-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertCircle className="size-20 text-amber-900" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg">
                <FileWarning className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Avisos de Atenção</p>
                <p className="text-4xl font-bold text-amber-700">08</p>
              </div>
            </div>
            <p className="text-[10px] text-amber-600 font-bold mt-4 uppercase">Inconsistências Cadastrais</p>
          </CardContent>
        </Card>

        <Card className="card-shadow border-none bg-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 className="size-20 text-emerald-900" />
          </div>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg">
                <ShieldCheck className="size-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-900 uppercase tracking-widest">Score de Compliance</p>
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-bold text-emerald-700">82%</p>
                  <div className="flex-1 w-20">
                    <Progress value={82} className="h-2 bg-emerald-200" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-emerald-600 font-bold mt-4 uppercase">Base Segura para Envio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-headline">Relatório de Auditoria PGR vs PCMSO</CardTitle>
              <CardDescription>O sistema impede o envio do evento S-2240 se o colaborador não tiver o exame do S-2220 correspondente.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="size-4" /> PDF Completo
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[100px]">Evento</TableHead>
                  <TableHead>Regra de Cruzamento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Impacto Jurídico</TableHead>
                  <TableHead className="text-center">Gaps</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditRules.map((rule) => (
                  <TableRow key={rule.id} className={rule.status === 'Falha' ? 'bg-red-50/30' : ''}>
                    <TableCell>
                      <Badge variant="outline" className="font-bold">{rule.event}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-primary">{rule.rule}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight">{rule.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`gap-1 font-bold ${
                          rule.status === 'Falha' ? 'bg-red-100 text-red-700' : 
                          rule.status === 'Alerta' ? 'bg-amber-100 text-amber-700' : 
                          'bg-emerald-100 text-emerald-700'
                        } border-none`}
                      >
                        {rule.status === 'Falha' ? <Ban className="size-3" /> : rule.status === 'Alerta' ? <AlertCircle className="size-3" /> : <CheckCircle2 className="size-3" />}
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-[10px] font-medium text-muted-foreground italic leading-tight max-w-[150px]">
                        {rule.impact}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      {rule.count > 0 ? (
                        <Badge variant="destructive" className="rounded-full size-6 flex items-center justify-center p-0">
                          {rule.count}
                        </Badge>
                      ) : <span className="text-emerald-500 font-bold">0</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      {rule.count > 0 && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="font-bold text-primary hover:text-accent">
                              Resolver <ArrowRight className="size-3 ml-1" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <ShieldAlert className="size-5 text-red-600" /> 
                                Detalhes do Gap: {rule.rule}
                              </DialogTitle>
                              <DialogDescription>
                                Os colaboradores abaixo possuem exposição a riscos no PGR, mas não possuem o exame médico correspondente no PCMSO.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Colaborador</TableHead>
                                    <TableHead>Setor</TableHead>
                                    <TableHead>Risco (PGR)</TableHead>
                                    <TableHead>Exame Faltante</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {criticalGaps.map((gap, i) => (
                                    <TableRow key={i}>
                                      <TableCell className="font-bold">{gap.employee}</TableCell>
                                      <TableCell className="text-xs">{gap.sector}</TableCell>
                                      <TableCell>
                                        <Badge variant="secondary" className="text-[10px]">{gap.risk}</Badge>
                                      </TableCell>
                                      <TableCell>
                                        <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50">{gap.missing}</Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        <Button size="sm" className="h-8 bg-primary">Agendar</Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                            <DialogFooter className="bg-muted/50 p-4 -m-6 mt-4 rounded-b-lg">
                              <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                                <Info className="size-3" /> Ao agendar os exames, o bloqueio do S-2240 será removido automaticamente após a baixa do ASO.
                              </p>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none gradient-primary text-white">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="size-5 text-accent" /> Inteligência Vigilante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-xs leading-relaxed">
                  Detectamos que <span className="font-bold">12 soldadores</span> estão com o risco "Fumos Metálicos" ativo, mas sem o exame de "Espirometria" vigente.
                </p>
                <div className="mt-3 flex items-center justify-between">
                   <p className="text-[10px] font-black text-accent uppercase">Risco de Glosa</p>
                   <Button variant="link" className="text-white p-0 h-auto text-[10px] font-bold">Verificar Todos <ExternalLink className="size-2 ml-1" /></Button>
                </div>
              </div>
              
              <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                <p className="text-xs leading-relaxed">
                  O sistema <span className="font-bold text-red-400">BLOQUEOU</span> 15 envios automáticos para evitar multas por inconsistência de dados no portal do Governo.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Próximo Lote (S-2240)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base Validada:</span>
                  <span className="font-bold text-emerald-600">142 registros</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Base com Erro:</span>
                  <span className="font-bold text-red-600">15 registros</span>
                </div>
                <Separator />
                <Button className="w-full bg-accent hover:bg-accent/90 font-bold" disabled={!auditComplete}>
                   Enviar Lote Validado
                </Button>
                <p className="text-[8px] text-center text-muted-foreground uppercase font-bold tracking-tighter">
                  Assinatura Digital via Certificado A1 Nextcon
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
