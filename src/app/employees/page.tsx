"use client"

import * as React from "react"
import { 
  Users, 
  UserPlus, 
  Search, 
  Building2, 
  Loader2, 
  MoreVertical, 
  Trash2, 
  Pencil, 
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useCollection, useUser, useMemoFirebase, useFirestore, useDoc } from "@/firebase"
import { collection, query, orderBy, collectionGroup, doc, deleteDoc } from "firebase/firestore"
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// Schema de validação eSocial Ready
const employeeFormSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00"),
  companyId: z.string().min(1, "Selecione uma unidade"),
  jobTitle: z.string().min(2, "Informe o cargo"),
  jobCbo: z.string().optional(),
  status: z.enum(["active", "leave", "fired"]),
})

type EmployeeFormValues = z.infer<typeof employeeFormSchema>

export default function EmployeesPage() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<string>("all")
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // 1. Perfil do Usuário para RBAC
  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const isGlobalAdmin = React.useMemo(() => {
    if (!profile?.role) return false;
    const role = profile.role.toUpperCase();
    return ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'ADMIN'].includes(role) && !profile.companyId;
  }, [profile]);

  // 2. Formulário de Cadastro
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      cpf: "",
      companyId: "",
      jobTitle: "",
      jobCbo: "",
      status: "active",
    },
  })

  // Sincroniza empresa no formulário caso o usuário não seja Admin
  React.useEffect(() => {
    if (profile && !isGlobalAdmin && profile.companyId) {
      setSelectedCompanyId(profile.companyId)
      form.setValue("companyId", profile.companyId)
    }
  }, [profile, isGlobalAdmin, form])

  // 3. Consultas Firestore
  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])
  const { data: companies } = useCollection(companiesQuery)

  const employeesQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    
    if (selectedCompanyId === "all" && isGlobalAdmin) {
      return query(collectionGroup(db, "employees"), orderBy("name", "asc"))
    } else {
      const companyIdToFilter = selectedCompanyId !== "all" ? selectedCompanyId : profile.companyId;
      if (companyIdToFilter) {
        return query(collection(db, "companies", companyIdToFilter, "employees"), orderBy("name", "asc"))
      }
    }
    return null
  }, [db, profile, selectedCompanyId, isGlobalAdmin])

  const { data: employees, isLoading: loadingEmployees } = useCollection(employeesQuery)

  // 4. Ações
  async function onSubmit(values: EmployeeFormValues) {
    if (!db) return
    setIsSubmitting(true)
    
    try {
      const targetColRef = collection(db, "companies", values.companyId, "employees")
      const newEmployee = {
        name: values.name.toUpperCase(),
        cpf: values.cpf,
        companyId: values.companyId,
        job_role: {
          title: values.jobTitle,
          cbo: values.jobCbo || ""
        },
        status: values.status,
        createdAt: new Date().toISOString()
      }

      await addDocumentNonBlocking(targetColRef, newEmployee)
      
      toast({ title: "Colaborador Cadastrado", description: `${values.name} foi inserido na base eSocial.` })
      setIsCreateOpen(false)
      form.reset()
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao Salvar", description: "Verifique sua conexão ou permissões." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (emp: any) => {
    if (!db || !emp.companyId) return
    
    const confirm = window.confirm(`Deseja realmente excluir ${emp.name}? Esta ação é irreversível.`)
    if (!confirm) return

    try {
      const docRef = doc(db, "companies", emp.companyId, "employees", emp.id)
      deleteDocumentNonBlocking(docRef)
      toast({ title: "Registro Removido" })
    } catch (e) {
      toast({ variant: "destructive", title: "Falha na Exclusão" })
    }
  }

  const filteredEmployees = React.useMemo(() => {
    if (!employees) return []
    const term = searchTerm.toLowerCase()
    return employees.filter(emp => (emp.name || "").toLowerCase().includes(term))
  }, [employees, searchTerm])

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase leading-none">Quadro de Vidas (Multi-tenant)</h1>
          <p className="text-muted-foreground font-medium uppercase text-[9px] tracking-widest mt-2 flex items-center gap-2">
            <Users className="size-3 text-accent" /> Gestão consolidada de vidas sob vigilância SESMT.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent text-primary hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest h-12 px-8 rounded-xl shadow-lg shadow-accent/20 gap-2">
              <UserPlus className="size-4" /> Novo Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
            <DialogHeader className="p-8 bg-primary text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg"><UserPlus className="size-5 text-accent" /></div>
                <DialogTitle className="text-xl font-headline font-black uppercase">Admitir Colaborador</DialogTitle>
              </div>
              <DialogDescription className="text-white/70 font-medium italic">Preencha os dados básicos para iniciar a vigilância médica.</DialogDescription>
            </DialogHeader>
            
            <div className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[10px] font-black uppercase text-slate-400">Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: JOÃO DA SILVA" {...field} className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} className="h-12 bg-slate-50 border-none rounded-xl font-bold" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="companyId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Unidade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isGlobalAdmin}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold">
                                <SelectValue placeholder="Selecione..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Cargo</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: PEDREIRO" {...field} className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Status</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Ativo</SelectItem>
                              <SelectItem value="leave">Afastado</SelectItem>
                              <SelectItem value="fired">Desligado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
                    {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5 text-accent" />}
                    Salvar Colaborador
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-3.5 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Pesquisar por nome ou CPF..." 
            className="pl-12 h-12 bg-white border-none shadow-sm rounded-xl font-medium" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isGlobalAdmin && (
          <div className="w-72">
            <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
              <SelectTrigger className="h-12 bg-white border-none shadow-sm rounded-xl font-bold uppercase text-[10px]">
                <Building2 className="size-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Filtrar Unidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Visão Global (Rede)</SelectItem>
                {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <Card className="card-shadow border-none bg-white rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase py-5 pl-8">Colaborador</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Cargo / CBO</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Unidade</TableHead>
                <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
                <TableHead className="text-right pr-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingEmployees ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={5} className="pl-8 py-6"><Skeleton className="h-8 w-full" /></TableCell></TableRow>
                ))
              ) : filteredEmployees.length > 0 ? filteredEmployees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-slate-50 transition-colors group">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-black text-xs shadow-inner">
                        {emp.name?.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-primary text-xs uppercase leading-tight">{emp.name}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{emp.cpf || '---'}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-600 uppercase">{emp.job_role?.title}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">CBO: {emp.job_role?.cbo || '---'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-[10px] font-black text-slate-500 uppercase">
                      {companies?.find(c => c.id === emp.companyId)?.name || 'Nextcon Unidade'}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "text-[8px] font-black uppercase border-none px-3",
                      emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                      emp.status === 'leave' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    )}>
                      {emp.status === 'active' ? 'Ativo' : emp.status === 'leave' ? 'Afastado' : 'Desligado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-primary/5 text-slate-400">
                          <MoreVertical className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl border-none shadow-2xl">
                        <DropdownMenuItem className="gap-2 text-xs font-bold py-3"><Pencil className="size-3.5" /> Editar Cadastro</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(emp)} className="gap-2 text-xs font-bold text-red-600 py-3 focus:bg-red-50 focus:text-red-700">
                          <Trash2 className="size-3.5" /> Remover Vínculo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-24 text-center opacity-30">
                    <AlertCircle className="size-16 mx-auto mb-4 text-primary" />
                    <p className="font-black uppercase text-sm tracking-widest">Nenhum registro localizado</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}