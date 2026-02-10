
"use client"

import * as React from "react"
import { HeartPulse, Search, Filter, CheckCircle2, AlertCircle, FileText, Download, Stethoscope, Loader2, SendHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, doc } from "firebase/firestore"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Histórico de Atendimentos (Portal do Cliente)
 * Visão consolidada de ASOs e conformidade eSocial para a unidade logada.
 */

export default function ClientExamsHistory() {
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const examsQuery = useMemoFirebase(() => {
    if (!db || !profile?.companyId) return null
    return query(collection(db, "companies", profile.companyId, "examHistory"), orderBy("date", "desc"))
  }, [db, profile])

  const { data: exams, isLoading } = useCollection(examsQuery)

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Vigilância Médica (RH)</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Monitoramento de ASOs, Vencimentos e eSocial S-2220.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-11 px-6 border-primary text-primary font-bold uppercase text-[10px] tracking-widest gap-2">
            <Download className="size-4" /> Exportar Planilha
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-3">
          <Search className="absolute left-4 top-3.5 size-4 text-slate-400" />
          <Input 
            placeholder="Buscar colaborador por nome ou CPF..." 
            className="pl-12 h-12 bg-white border-none shadow-sm rounded-xl font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-12 bg-white border-none shadow-sm rounded-xl font-bold uppercase text-[10px]">
            <SelectValue placeholder="Status do ASO" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="ok">Apto (OK)</SelectItem>
            <SelectItem value="expired">Vencido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-24 text-center flex flex-col items-center gap-4">
              <Loader2 className="size-12 animate-spin text-primary opacity-20" />
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sincronizando Base de Saúde...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="text-[10px] font-black uppercase py-5 pl-8">Colaborador</TableHead>
                  <TableHead className="text-[10px] font-black uppercase">Data / Tipo</TableHead>
                  <TableHead className="text-[10px] font-black uppercase">Credenciado</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-center">ASO</TableHead>
                  <TableHead className="text-[10px] font-black uppercase text-center">eSocial (S-2220)</TableHead>
                  <TableHead className="text-right pr-8"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams?.filter(e => e.employeeName.toLowerCase().includes(searchTerm.toLowerCase())).map((exam, i) => (
                  <TableRow key={i} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="pl-8">
                      <p className="font-bold text-primary text-xs uppercase">{exam.employeeName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Matrícula: {exam.employeeId || '---'}</p>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs font-bold text-primary">{new Date(exam.date).toLocaleDateString('pt-BR')}</p>
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary/60">{exam.type}</Badge>
                    </TableCell>
                    <TableCell className="text-[10px] font-black text-slate-500 uppercase">{exam.provider}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[9px] font-black uppercase border-none px-3",
                        exam.aso === 'OK' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {exam.aso === 'OK' ? <CheckCircle2 className="size-2.5 mr-1" /> : <AlertCircle className="size-2.5 mr-1" />}
                        {exam.aso}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <SendHorizontal className={cn("size-3", exam.s2220 === 'OK' ? "text-emerald-500" : "text-slate-300")} />
                        <span className="text-[9px] font-black uppercase text-slate-400">{exam.s2220}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-primary hover:bg-primary/5">
                        <FileText className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
