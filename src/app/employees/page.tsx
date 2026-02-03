
"use client"

import * as React from "react"
import { Users, UserPlus, Search, Filter, MoreHorizontal, FileText, Calendar, Loader2 } from "lucide-react"
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
import { useCollection, useUser, useMemoFirebase, useFirestore } from "@/firebase"
import { collection, query, orderBy } from "firebase/firestore"

export default function EmployeesPage() {
  const { user } = useUser()
  const db = useFirestore()
  const [searchTerm, setSearchTerm] = React.useState("")

  const employeesQuery = useMemoFirebase(() => {
    if (!db || !user) return null
    // Busca na subcoleção correta conforme backend.json
    return query(
      collection(db, "clients", user.uid, "employees"),
      orderBy("name", "asc")
    )
  }, [db, user])

  const { data: employees, isLoading } = useCollection(employeesQuery)

  const filteredEmployees = React.useMemo(() => {
    if (!employees) return []
    return employees.filter(emp => 
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.jobRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [employees, searchTerm])

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight">Gestão de Colaboradores</h1>
          <p className="text-muted-foreground">Acompanhamento de prontuários, cargos e conformidade ocupacional.</p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 gap-2 shadow-lg shadow-accent/20">
          <UserPlus className="size-4" /> Novo Registro Individual
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nome, cargo ou matrícula..." 
            className="pl-10 bg-white border-muted h-11" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11">
          <Filter className="size-4" /> Filtros Avançados
        </Button>
      </div>

      <Card className="card-shadow border-none overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[300px]">Nome do Colaborador</TableHead>
                <TableHead>Cargo / Função</TableHead>
                <TableHead>Matrícula/ID</TableHead>
                <TableHead>Admissão</TableHead>
                <TableHead>Status ASO</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="size-8 animate-spin text-primary" />
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Sincronizando base de dados...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 text-muted-foreground">
                    <div className="max-w-xs mx-auto space-y-4">
                      <div className="p-4 bg-muted/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        <Users className="size-8 text-muted-foreground/50" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-primary">Nenhum colaborador encontrado</p>
                        <p className="text-xs">Tente ajustar sua busca ou use o módulo de importação para alimentar o sistema.</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold text-xs">
                          {employee.name?.charAt(0)}
                        </div>
                        <span className="font-bold text-primary">{employee.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none">
                        {employee.jobRole || "Não Informado"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{employee.id}</TableCell>
                    <TableCell>{employee.admissionDate || "---"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1">
                        <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                        Apto
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Gestão Ocupacional</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <FileText className="size-4" /> Prontuário Digital
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Calendar className="size-4" /> Agendar Periódico
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive gap-2 cursor-pointer">
                            Arquivar Registro
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none bg-primary text-white card-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Users className="size-16" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest opacity-80 font-black">Total de Efetivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{filteredEmployees.length}</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Pendências eSocial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-accent">0</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Afastados (INSS)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">0</div>
          </CardContent>
        </Card>
        <Card className="border-none bg-white card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Última Importação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-muted-foreground mt-2">
               {filteredEmployees.length > 0 ? new Date().toLocaleDateString('pt-BR') : 'Sem dados'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
