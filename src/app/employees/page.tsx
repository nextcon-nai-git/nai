
"use client"

import * as React from "react"
import { Users, UserPlus, Search, Filter, MoreHorizontal, FileText, Calendar } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCollection, useUser, useMemoFirebase } from "@/firebase"
import { collection } from "firebase/firestore"
import { useFirestore } from "@/firebase"

export default function EmployeesPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")

  const employeesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    return collection(db, "clients", user.uid, "employees")
  }, [db, user])

  const { data: employees, isLoading } = useCollection(employeesQuery)

  const filteredEmployees = employees?.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.jobRole.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Gestão de Colaboradores</h1>
          <p className="text-muted-foreground">Controle central de prontuários, cargos e históricos de saúde.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2">
          <UserPlus className="size-4" /> Novo Colaborador
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome ou cargo..." 
            className="pl-10 bg-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="size-4" /> Filtros
        </Button>
      </div>

      <Card className="card-shadow border-none">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">Nome Completo</TableHead>
                <TableHead>Cargo / Função</TableHead>
                <TableHead>Admissão</TableHead>
                <TableHead>Status ASO</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Carregando colaboradores...</TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    {searchTerm ? "Nenhum colaborador encontrado para essa busca." : "Nenhum colaborador cadastrado ainda."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-bold text-primary">{employee.name}</TableCell>
                    <TableCell>{employee.jobRole}</TableCell>
                    <TableCell>{employee.admissionDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Vigente
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2">
                            <FileText className="size-4" /> Ver Prontuário
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Calendar className="size-4" /> Agendar Exame
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive gap-2">
                            Desativar Registro
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none bg-primary text-white card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest opacity-80">Total Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredEmployees.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">ASOs a Vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">04</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-muted-foreground">Novas Admissões (Mês)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">02</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
