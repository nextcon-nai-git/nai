
"use client"

import * as React from "react"
import { Users, UserPlus, Search, Building2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import { collection, query, orderBy, collectionGroup } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

export default function EmployeesPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")

  // Busca global via CollectionGroup ou Filtrada por Empresa
  const employeesQuery = useMemoFirebase(() => {
    if (!db) return null
    if (selectedCompanyId === "all") {
      // Nota: CollectionGroup exige índice no Firestore
      return query(collectionGroup(db, "employees"), orderBy("name", "asc"))
    }
    return query(collection(db, "companies", selectedCompanyId, "employees"), orderBy("name", "asc"))
  }, [db, selectedCompanyId])

  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])

  const { data: employees, isLoading: loadingEmployees } = useCollection(employeesQuery)
  const { data: companies } = useCollection(companiesQuery)

  const filteredEmployees = React.useMemo(() => {
    if (!employees) return []
    const term = searchTerm.toLowerCase()
    return employees.filter(emp => (emp.name || "").toLowerCase().includes(term))
  }, [employees, searchTerm])

  return (
    <div className="space-y-6 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-headline font-bold text-primary uppercase">Quadro de Vidas (Multi-tenant)</h1>
        <Button className="bg-accent font-bold uppercase text-xs">
          <UserPlus className="size-4 mr-2" /> Novo Colaborador
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar em todas as empresas..." 
            className="pl-10 h-11" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-64">
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="h-11">
              <Building2 className="size-4 mr-2" />
              <SelectValue placeholder="Filtrar Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visão Global</SelectItem>
              {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-none shadow-xl bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[10px] font-black uppercase">Colaborador</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Cargo (Desnormalizado)</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loadingEmployees ? (
              <TableRow><TableCell colSpan={3}><Skeleton className="h-10 w-full" /></TableCell></TableRow>
            ) : filteredEmployees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-bold text-primary">{emp.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{emp.job_role?.title}</span>
                    <span className="text-[9px] text-muted-foreground">CBO: {emp.job_role?.cbo}</span>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="uppercase text-[9px]">{emp.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
