
"use client"

import * as React from "react"
import { 
  HeartPulse, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Download,
  Building2,
  Stethoscope
} from "lucide-react"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const EXAMS_DATA = [
  { company: "AC2 CORRETORA DE SEGUROS LTDA", id: "1164016", type: "DEM", date: "22/01/2025", exam: "Audiometria Tonal Ocupacional", result: "ALTERADO", doctor: "PATRICIA MENDES", provider: "SOCNET - Working", city: "Curitiba" },
  { company: "AC2 CORRETORA DE SEGUROS LTDA", id: "1164016", type: "DEM", date: "22/01/2025", exam: "Consulta Clinica", result: "NORMAL", doctor: "CAROLINE ROMANO ZAFALON", provider: "SOCNET - Working", city: "Curitiba" },
  { company: "AC2 CORRETORA DE SEGUROS LTDA", id: "1164016", type: "ADM", date: "14/01/2025", exam: "Consulta Clinica", result: "NORMAL", doctor: "LAURA ZATTAR OLIVEIRA", provider: "SOCNET - Working", city: "Curitiba" },
  { company: "ATLAS CONSULTORIA", id: "1783413", type: "ADM", date: "20/01/2025", exam: "Consulta Clinica", result: "NORMAL", doctor: "PATRICIA MENDES", provider: "SOCNET - Working", city: "Curitiba" },
  { company: "Barabach & Knopp Engenharia", id: "1781158", type: "ADM", date: "28/01/2025", exam: "Avaliação Clínica Ocupacional", result: "NORMAL", doctor: "LAURA ZATTAR OLIVEIRA", provider: "SOCNET - Working", city: "Curitiba" },
  { company: "Biavatti Sao Paulo", id: "1845468", type: "DEM", date: "22/01/2025", exam: "Acuidade Visual - Avaliação", result: "NORMAL", doctor: "N/I", provider: "ATEM CLINICA", city: "São Paulo" },
  { company: "CDA STEEL FABRICACAO", id: "1250739", type: "RETT", date: "14/01/2025", exam: "Consulta Clinica", result: "NORMAL", doctor: "THELMA ELISA AUFFINGER", provider: "SOCNET - Working", city: "Curitiba" },
  { company: "CENTRAL TURBOS PARANA", id: "1655589", type: "ADM", date: "14/01/2025", exam: "Eletrocardiograma - ECG", result: "ALTERADO", doctor: "Edilamar Moro Dach", provider: "Clinica SQV", city: "Curitiba" },
  { company: "INCORPORADORA GRAN-PARA", id: "1177322", type: "PER", date: "07/01/2025", exam: "Audiometria Tonal Ocupacional", result: "ALTERADO", doctor: "ARIEL BRASIL DE OLIVEIRA", provider: "SOCNET - Working", city: "Curitiba" },
  { company: "L L M CALCAMENTOS", id: "1266284", type: "PER", date: "07/01/2025", exam: "Espirometria", result: "ALTERADO", doctor: "João Ricardo Rebouças", provider: "Clinica SQV", city: "Curitiba" },
  { company: "Noxi Quimica LTDA", id: "2121259", type: "PER", date: "02/12/2025", exam: "Audiometria tonal ocupacional", result: "ALTERADO", doctor: "Sarah Fernanda Tiburcio", provider: "Clinica SQV", city: "Curitiba" },
  { company: "Noxi Quimica LTDA", id: "2121259", type: "PER", date: "02/12/2025", exam: "Eletrocardiograma - ECG", result: "ALTERADO", doctor: "Edilamar Moro Dach", provider: "Clinica SQV", city: "Curitiba" },
  { company: "Noxi Quimica LTDA", id: "2121259", type: "PER", date: "02/12/2025", exam: "Espirometria", result: "ALTERADO", doctor: "Roberto Arabe Abdanur", provider: "Clinica SQV", city: "Curitiba" },
]

export default function ExamsHistoryPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterResult, setFilterResult] = React.useState("all")

  const filteredExams = EXAMS_DATA.filter(item => {
    const matchesSearch = 
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterResult === "all" || item.result === filterResult
    
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-[#090e24] tracking-tight uppercase">Exames & ASO (Histórico)</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Monitoramento NAI de exames realizados - Dez/Jan 2025</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-[#090e24] text-[#090e24]">
            <Download className="size-4" /> Exportar Relatório
          </Button>
          <Button className="bg-[#f59e0b] text-[#090e24] hover:bg-[#f59e0b]/90 font-bold gap-2">
            <HeartPulse className="size-4" /> Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por empresa, exame ou médico..." 
            className="pl-10 bg-white h-11 border-none shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterResult} onValueChange={setFilterResult}>
          <SelectTrigger className="h-11 bg-white border-none shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Status do Exame" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Resultados</SelectItem>
            <SelectItem value="NORMAL">Normal (Apto)</SelectItem>
            <SelectItem value="ALTERADO">Alterado (Verificar)</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-white rounded-md shadow-sm h-11 flex items-center px-4 justify-between">
          <span className="text-[10px] font-black uppercase text-muted-foreground">Total:</span>
          <span className="text-sm font-bold text-[#090e24]">{filteredExams.length} Registros</span>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-gray-50 border-b">
              <TableRow>
                <TableHead className="font-black text-[10px] uppercase py-4">Empresa / ID</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Data / Tipo</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Natureza do Exame</TableHead>
                <TableHead className="font-black text-[10px] uppercase text-center">Resultado</TableHead>
                <TableHead className="font-black text-[10px] uppercase">Médico Examinador</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExams.map((item, index) => (
                <TableRow key={index} className="hover:bg-blue-50/30 transition-colors">
                  <TableCell>
                    <div>
                      <p className="font-bold text-[#090e24] text-xs leading-tight">{item.company}</p>
                      <p className="text-[9px] text-muted-foreground font-black">ID: {item.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-black text-[#090e24]">{item.date}</p>
                      <Badge variant="outline" className="text-[8px] h-4 border-[#090e24]/20 uppercase">{item.type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-gray-100 rounded-md">
                        <Stethoscope className="size-3 text-[#090e24]" />
                      </div>
                      <span className="text-xs font-medium text-[#090e24]">{item.exam}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "text-[9px] font-black border-none uppercase",
                      item.result === "NORMAL" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {item.result === "NORMAL" ? <CheckCircle2 className="size-2 mr-1" /> : <AlertCircle className="size-2 mr-1" />}
                      {item.result}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-xs font-bold text-[#090e24]">{item.doctor}</p>
                      <p className="text-[9px] text-muted-foreground uppercase">{item.provider} - {item.city}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#090e24] hover:text-white" title="Visualizar ASO">
                        <FileText className="size-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#f59e0b]" title="Baixar PDF">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-[#090e24] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-[#f59e0b] tracking-widest">Resumo Operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-white/50 font-black uppercase">Exames Realizados</p>
                <p className="text-2xl font-black">{EXAMS_DATA.length}</p>
              </div>
              <HeartPulse className="size-8 opacity-20" />
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] leading-relaxed italic text-white/70">
                A Nextcon processou {EXAMS_DATA.length} eventos de saúde ocupacional no último bimestre, garantindo a conformidade técnica das empresas clientes.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-red-900 tracking-widest">Alerta de Alterações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg text-white">
                <AlertCircle className="size-4" />
              </div>
              <p className="text-xs font-bold text-red-900">
                {EXAMS_DATA.filter(e => e.result === 'ALTERADO').length} exames apresentam alterações.
              </p>
            </div>
            <p className="text-[10px] text-red-700 font-medium">Recomendado: Iniciar investigação de nexo ou convocar para reavaliação médica.</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-emerald-900 tracking-widest">Rede Credenciada</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <Building2 className="size-4" />
              </div>
              <p className="text-xs font-bold text-emerald-900">SOCNET & Clinica SQV</p>
            </div>
            <p className="text-[10px] text-emerald-700 font-medium">Principais prestadores ativos no período Curitiba/PR.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
