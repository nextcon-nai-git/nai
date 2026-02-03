
"use client"

import * as React from "react"
import { SearchCheck, FileWarning, CheckCircle2, AlertCircle, RefreshCw, Download } from "lucide-react"
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

const auditRules = [
  { id: 1, event: "S-2240", description: "Riscos Físicos (Ruído) sem Audiometria no S-2220", status: "Falha", count: 12 },
  { id: 2, event: "S-2220", description: "Exames de Retorno ao Trabalho após 30 dias de afastamento", status: "OK", count: 0 },
  { id: 3, event: "S-2240", description: "Data de Início da Condição posterior à admissão", status: "Falha", count: 3 },
  { id: 4, event: "S-2220", description: "Exames Periódicos Vencidos", status: "Alerta", count: 8 },
]

export default function EsocialAudit() {
  const [auditing, setAuditing] = React.useState(false)

  const runAudit = () => {
    setAuditing(true)
    setTimeout(() => setAuditing(false), 2000)
  }

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Pré-Auditoria eSocial (Vigilante)</h1>
          <p className="text-muted-foreground">Cruzamento inteligente de dados antes do envio oficial para o Governo.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={runAudit} disabled={auditing} className="bg-primary hover:bg-primary/90 gap-2">
            {auditing ? <RefreshCw className="size-4 animate-spin" /> : <SearchCheck className="size-4" />}
            Rodar Auditoria Completa
          </Button>
          <Button variant="outline" className="gap-2"><Download className="size-4" /> Exportar Relatório</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow border-none bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500 text-white rounded-xl">
                <AlertCircle className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">Gaps Críticos</p>
                <p className="text-3xl font-bold text-red-700">15</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow border-none bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 text-white rounded-xl">
                <FileWarning className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-orange-900">Inconsistências Leves</p>
                <p className="text-3xl font-bold text-orange-700">32</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-shadow border-none bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500 text-white rounded-xl">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-900">Saúde dos Dados</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-green-700">82%</p>
                  <Progress value={82} className="h-2 w-24 bg-green-200" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-shadow border-none">
        <CardHeader>
          <CardTitle className="text-lg">Cruzamento de PGR vs PCMSO vs eSocial</CardTitle>
          <CardDescription>O sistema bloqueia envios que podem gerar multas automáticas no portal do Governo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Regra de Auditoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Impactos Encontrados</TableHead>
                <TableHead className="text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-bold">{rule.event}</TableCell>
                  <TableCell className="max-w-md">{rule.description}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={rule.status === 'Falha' ? 'destructive' : rule.status === 'Alerta' ? 'default' : 'secondary'}
                      className={rule.status === 'Alerta' ? 'bg-orange-500 hover:bg-orange-600' : rule.status === 'OK' ? 'bg-green-500 hover:bg-green-600 text-white' : ''}
                    >
                      {rule.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {rule.count > 0 ? <span className="text-red-600">{rule.count}</span> : <span className="text-green-600">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="font-bold text-primary">Ver Detalhes</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
