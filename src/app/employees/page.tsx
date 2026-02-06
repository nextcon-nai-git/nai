"use client"

import * as React from "react"
import { Users, UserPlus, Search, MoreHorizontal, Building2, MessageSquare, Loader2 } from "lucide-react"
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
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { getWhatsAppLink } from "@/lib/whatsapp-utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function EmployeesPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")

  // Queries otimizadas
  const employeesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "clients", user.uid, "employees"),
      orderBy("name", "asc"),
      limit(100) // Limite inicial para performance
    )
  }, [db, user])

  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "clients", user.uid, "managedCompanies"),
      orderBy("name", "asc")
    )
  }, [db, user])

  const { data: employees, isLoading: loadingEmployees } = useCollection(employeesQuery)
  const { data: companies, isLoading: loadingCompanies } = useCollection(companiesQuery)

  // Memoização do mapeamento de empresas
  const companyMap = React.useMemo(() => {
    const map: Record<string, string> = {}
    companies?.forEach(c => {
      map[c.id] = c.name
    })
    return map
  }, [companies])

  // Memoização do filtro de busca
  const filteredEmployees = React.useMemo(() => {
    if (!employees) return []
    const term = searchTerm.toLowerCase()
    return employees.filter(emp => {
      const matchesSearch = 
        (emp.name || "").toLowerCase().includes(term) ||
        (emp.jobRole || "").toLowerCase().includes(term) ||
        (emp.id || "").toLowerCase().includes(term)
      
      const matchesCompany = selectedCompanyId === "all" || emp.companyId === selectedCompanyId
      
      return matchesSearch && matchesCompany
    })
  }, [employees, searchTerm, selectedCompanyId])

  const handleContactWhatsApp = (employee: any) => {
    const phone = employee.phone || "11999999999";
    const message = `Olá ${employee.name}, a Nextcon Saúde Empresarial gostaria de entrar em contato sobre seu cadastro SST.`;
    window.open(getWhatsAppLink(phone, message), '_blank');
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Quadro de Colaboradores</h1>
          <p className="text-muted-foreground">Gestão técnica de vidas e vínculos empresariais.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2 shadow-lg shadow-accent/20 h-12 font-bold uppercase text-xs tracking-widest">
          <UserPlus className="size-4" /> Novo Colaborador
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, cargo ou matrícula..." 
            className="pl-10 bg-white border-muted h-11 transition-all focus:ring-2 ring-primary/5" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="h-11 bg-white">
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Filtrar por Empresa" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Empresas</SelectItem>
              {companies?.map(company => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="card-shadow border-none overflow-hidden bg-white">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase py-4">Colaborador</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Empresa Cliente</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Cargo / Função</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Matrícula</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEmployees || loadingCompanies ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-24 text-muted-foreground">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <Users className="size-12" />
                      <p className="font-bold uppercase tracking-widest text-sm">Base de Dados Vazia</p>
                      <p className="text-xs">Use o módulo de importação ou cadastre manualmente.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="group hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <div>
                        <p className="font-bold text-primary text-sm">{employee.name || "N/I"}</p>
                        <p className="text-[9px] text-muted-foreground uppercase font-black">Admissão: {employee.admissionDate || "---"}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="size-3 text-muted-foreground" />
                        <span className="text-xs font-medium text-primary/80">
                          {companyMap[employee.companyId] || employee.companyId || "Não vinculada"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-none font-bold text-[10px] py-0 h-6">
                        {employee.jobRole || "N/I"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-[10px] text-muted-foreground">{employee.id}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-green-600 hover:bg-green-50 rounded-full"
                          onClick={() => handleContactWhatsApp(employee)}
                          title="WhatsApp"
                        >
                          <MessageSquare className="size-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {filteredEmployees.length > 0 && (
        <div className="flex justify-center">
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest bg-muted/30 px-4 py-1 rounded-full">
            Listando {filteredEmployees.length} registros ativos
          </p>
        </div>
      )}
    </div>
  )
}