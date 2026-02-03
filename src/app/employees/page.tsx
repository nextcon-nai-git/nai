
"use client"

import * as React from "react"
import { Users, UserPlus, Search, Filter, MoreHorizontal, FileText, Calendar, Loader2, Building2 } from "lucide-react"
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
import { collection, query, orderBy } from "firebase/firestore"

export default function EmployeesPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")

  // Query para buscar colaboradores
  const employeesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "clients", user.uid, "employees"),
      orderBy("name", "asc")
    )
  }, [db, user])

  // Query para buscar empresas (para o relacionamento/filtro)
  const companiesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return query(
      collection(db, "clients", user.uid, "managedCompanies"),
      orderBy("name", "asc")
    )
  }, [db, user])

  const { data: employees, isLoading: loadingEmployees } = useCollection(employeesQuery)
  const { data: companies, isLoading: loadingCompanies } = useCollection(companiesQuery)

  // Mapeamento de ID da empresa para Nome da empresa
  const companyMap = React.useMemo(() => {
    const map: Record<string, string> = {}
    companies?.forEach(c => {
      map[c.id] = c.name
    })
    return map
  }, [companies])

  const filteredEmployees = React.useMemo(() => {
    if (!employees) return []
    return employees.filter(emp => {
      const matchesSearch = 
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCompany = selectedCompanyId === "all" || emp.companyId === selectedCompanyId
      
      return matchesSearch && matchesCompany
    })
  }, [employees, searchTerm, selectedCompanyId])

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Quadro de Colaboradores</h1>
          <p className="text-muted-foreground">Listagem completa vinculada às empresas clientes.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2 shadow-lg shadow-accent/20">
          <UserPlus className="size-4" /> Novo Colaborador
        </Button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, cargo ou matrícula..." 
            className="pl-10 bg-white border-muted h-11" 
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

      <Card className="card-shadow border-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Empresa Cliente</TableHead>
                <TableHead>Cargo / Função</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEmployees || loadingCompanies ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <Loader2 className="size-8 animate-spin mx-auto text-primary" />
                    <p className="text-xs text-muted-foreground mt-2 uppercase font-black tracking-widest">Carregando base de dados...</p>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="size-10 opacity-20" />
                      <p>Nenhum colaborador encontrado.</p>
                      <p className="text-[10px] uppercase font-bold">Dica: Use o módulo de importação para alimentar a base.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="group hover:bg-primary/5 transition-colors">
                    <TableCell>
                      <p className="font-bold text-primary">{employee.name}</p>
                      <p className="text-[9px] text-muted-foreground uppercase font-black">Admissão: {employee.admissionDate || "---"}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="size-3 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {companyMap[employee.companyId] || "Empresa não vinculada"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                        {employee.jobRole || "N/I"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{employee.id}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="group-hover:text-primary transition-colors">
                        <MoreHorizontal className="size-4" />
                      </Button>
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
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
            Exibindo {filteredEmployees.length} colaboradores
          </p>
        </div>
      )}
    </div>
  )
}
