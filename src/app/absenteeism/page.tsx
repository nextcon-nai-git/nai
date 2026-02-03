
"use client"

import * as React from "react"
import { AlertTriangle, ShieldCheck, History, Search, FileText } from "lucide-react"
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
import { useToast } from "@/hooks/use-toast"

// Simulação de mapeamento NTEP (Decreto 3.048 - Lista C)
// CNAE -> CIDs que geram nexo técnico
const NTEP_MAPPING: Record<string, string[]> = {
  "25.3": ["M54", "G56", "S62"], // Metalurgia -> Coluna, Túnel do Carpo, Fraturas
  "49.3": ["F32", "Z73", "M54"], // Transporte -> Depressão, Burnout, Coluna
}

const initialRecords = [
  { id: 1, employee: "João Silva", role: "Soldador", cid: "M54.5", days: 18, status: "Afastado (INSS)", cnae: "25.3" },
  { id: 2, employee: "Ana Costa", role: "Motorista", cid: "F32.1", days: 45, status: "Aguardando Perícia", cnae: "49.3" },
  { id: 3, employee: "Carlos Oliveira", role: "Auxiliar", cid: "S62.0", days: 5, status: "Retorno", cnae: "25.3" },
]

export default function LimboSentinel() {
  const { toast } = useToast()
  const [records, setRecords] = React.useState(initialRecords)

  const checkNTEP = (cid: string, cnae: string) => {
    const baseCid = cid.split('.')[0]
    return NTEP_MAPPING[cnae]?.includes(baseCid)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary">Sentinela do Limbo (NTEP)</h1>
          <p className="text-muted-foreground">Validação automática de Nexo Técnico Epidemiológico e risco de limbo jurídico.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2"><History className="size-4" /> Histórico</Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2"><AlertTriangle className="size-4" /> Novo Afastamento</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none">
          <CardHeader>
            <CardTitle className="text-lg">Gestão de Absenteísmo</CardTitle>
            <CardDescription>Monitoramento de CID vs CNAE para identificação de doenças ocupacionais.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>CID</TableHead>
                  <TableHead>Nexo NTEP</TableHead>
                  <TableHead>Dias</TableHead>
                  <TableHead>Status Jurídico</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => {
                  const isNtep = checkNTEP(record.cid, record.cnae)
                  return (
                    <TableRow key={record.id} className={isNtep ? "bg-red-50/50" : ""}>
                      <TableCell className="font-bold">{record.employee}</TableCell>
                      <TableCell>{record.role}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{record.cid}</Badge>
                      </TableCell>
                      <TableCell>
                        {isNtep ? (
                          <Badge variant="destructive" className="gap-1 animate-pulse">
                            <AlertTriangle className="size-3" /> CRÍTICO (Nexo)
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
                            <ShieldCheck className="size-3" /> Seguro
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{record.days} dias</TableCell>
                      <TableCell>
                        <span className="text-xs font-medium">{record.status}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-primary font-bold">Gerir Limbo</Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-primary text-white">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider">Alertas Jurídicos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-xs font-bold text-accent mb-1">BLOQUEIO IMEDIATO</p>
                <p className="text-sm leading-tight">O CID {records[0].cid} tem nexo com o CNAE {records[0].cnae}. Contestação de NTEP recomendada.</p>
              </div>
              <div className="p-3 bg-white/10 rounded-lg border border-white/20">
                <p className="text-xs font-bold text-green-400 mb-1">PROTEÇÃO FINANCEIRA</p>
                <p className="text-sm leading-tight">3 contestações vitoriosas este mês evitaram R$ 42k em aumento de FAP.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow border-none">
            <CardHeader>
              <CardTitle className="text-sm">Busca de CID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input placeholder="Digite o CID..." className="bg-muted" />
                <Button size="icon" variant="secondary"><Search className="size-4" /></Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 uppercase font-bold">Consulte Nexo Técnico Preventivamente</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
