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
  Stethoscope,
  Loader2
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

export default function ExamsHistoryPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterResult, setFilterResult] = React.useState("all")

  const examsQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(collection(db, "clients", user.uid, "examHistory"), orderBy("date", "desc"))
  }, [db, user])

  const { data: exams, isLoading } = useCollection(examsQuery)

  const filteredExams = React.useMemo(() => {
    if (!exams) return []
    return exams.filter(item => {
      const matchesSearch = 
        (item.employeeName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.companyName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.provider || "").toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterResult === "all" || item.aso === filterResult
      
      return matchesSearch && matchesFilter
    })
  }, [exams, searchTerm, filterResult])

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-[#002d9c] tracking-tight uppercase">Histórico de Atendimentos</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">Monitoramento consolidado de exames, ASOs e envios eSocial.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 border-[#002d9c] text-[#002d9c]">
            <Download className="size-4" /> Exportar Planilha
          </Button>
          <Button className="bg-[#00b4ff] text-white hover:bg-[#00b4ff]/90 font-bold gap-2 shadow-lg">
            <HeartPulse className="size-4" /> Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por funcionário, empresa ou clínica..." 
            className="pl-10 bg-white h-11 border-none shadow-sm" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterResult} onValueChange={setFilterResult}>
          <SelectTrigger className="h-11 bg-white border-none shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <SelectValue placeholder="Status ASO" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="OK">OK (Apto)</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
        <div className="bg-white rounded-md shadow-sm h-11 flex items-center px-4 justify-between">
          <span className="text-[10px] font-black uppercase text-muted-foreground">Total:</span>
          <span className="text-sm font-bold text-[#002d9c]">{filteredExams.length} Registros</span>
        </div>
      </div>

      <Card className="border-none shadow-xl overflow-hidden bg-white">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <Loader2 className="size-10 animate-spin text-primary opacity-20" />
              <p className="text-xs font-black uppercase text-muted-foreground">Carregando Base de Atendimentos...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 border-b">
                <TableRow>
                  <TableHead className="font-black text-[10px] uppercase py-4">Funcionário / Empresa</TableHead>
                  <TableHead className="font-black text-[10px] uppercase">Data / Tipo</TableHead>
                  <TableHead className="font-black text-[10px] uppercase">Credenciado</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-center">ASO</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-center">S-2220</TableHead>
                  <TableHead className="font-black text-[10px] uppercase text-center">S-2240</TableHead>
                  <TableHead className="text-right font-black text-[10px] uppercase">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExams.map((item, index) => (
                  <TableRow key={index} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-bold text-[#002d9c] text-xs leading-tight uppercase">{item.employeeName}</p>
                        <p className="text-[9px] text-muted-foreground font-black uppercase">{item.companyName}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-xs font-black text-[#002d9c]">{new Date(item.date).toLocaleDateString('pt-BR')}</p>
                        <Badge variant="outline" className="text-[8px] h-4 border-[#002d9c]/20 uppercase">{item.type}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-100 rounded-md">
                          <Stethoscope className="size-3 text-[#002d9c]" />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground uppercase">{item.provider}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black border-none uppercase",
                        item.aso === "OK" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {item.aso === "OK" ? <CheckCircle2 className="size-2 mr-1" /> : <AlertCircle className="size-2 mr-1" />}
                        {item.aso}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[8px] font-black border-none uppercase",
                        item.s2220 === "OK" ? "bg-emerald-50 text-emerald-600" : item.s2220 === "NA" ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-600"
                      )}>
                        {item.s2220}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[8px] font-black border-none uppercase",
                        item.s2240 === "OK" ? "bg-emerald-50 text-emerald-600" : item.s2240 === "NA" ? "bg-gray-100 text-gray-400" : "bg-red-50 text-red-600"
                      )}>
                        {item.s2240}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#002d9c] hover:text-white" title="Visualizar ASO">
                          <FileText className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#00b4ff] hover:text-white" title="Baixar PDF">
                          <Download className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-[#002d9c] text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-[#00b4ff] tracking-widest">Resumo Operacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[9px] text-white/50 font-black uppercase">Eventos Processados</p>
                <p className="text-2xl font-black">{filteredExams.length}</p>
              </div>
              <HeartPulse className="size-8 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-red-900 tracking-widest">Pendências eSocial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 rounded-lg text-white">
                <AlertCircle className="size-4" />
              </div>
              <p className="text-xs font-bold text-red-900">
                {filteredExams.filter(e => e.s2220 === 'pendente' || e.s2240 === 'pendente').length} envios aguardando.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase text-emerald-900 tracking-widest">Conformidade ASO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg text-white">
                <CheckCircle2 className="size-4" />
              </div>
              <p className="text-xs font-bold text-emerald-900">
                {Math.round((filteredExams.filter(e => e.aso === 'OK').length / (filteredExams.length || 1)) * 100)}% de Aptidão
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
