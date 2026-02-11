"use client"

import * as React from "react"
import { AlertTriangle, ShieldCheck, History, Search, FileText, Gavel, Loader2, Sparkles, FileDown, Copy, MessageSquare, TrendingUp, Plus, Trash2, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, collectionGroup, doc } from "firebase/firestore"
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates"
import { generateNtepContestation } from "@/ai/flows/ntep-contestation-generator"
import { getWhatsAppLink, MSG_TEMPLATES } from "@/lib/whatsapp-utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

// Schema para novos registros de perícia/afastamento
const recordFormSchema = z.object({
  employeeName: z.string().min(3, "Nome obrigatório"),
  cid: z.string().min(3, "CID é obrigatório"),
  disease: z.string().min(3, "Descrição da doença obrigatória"),
  companyId: z.string().min(1, "Selecione uma unidade"),
  jobRole: z.string().optional(),
  caseNumber: z.string().optional(),
  value: z.string().optional(),
  status: z.enum(["Pendente", "Em Análise", "Concluído"]),
})

type RecordFormValues = z.infer<typeof recordFormSchema>

export default function LimboSentinel() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [aiDraft, setAiDraft] = React.useState<string | null>(null)

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const isPrivileged = React.useMemo(() => {
    return profile && ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role)
  }, [profile])

  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordFormSchema),
    defaultValues: {
      employeeName: "",
      cid: "",
      disease: "",
      companyId: "",
      jobRole: "",
      caseNumber: "",
      value: "",
      status: "Pendente",
    },
  })

  // Carrega empresas para o seletor do Admin
  const companiesQuery = useMemoFirebase(() => {
    if (!db) return null
    return query(collection(db, "companies"), orderBy("name", "asc"))
  }, [db])
  const { data: companies } = useCollection(companiesQuery)

  // Sincroniza empresa no formulário caso o usuário não seja Admin
  React.useEffect(() => {
    if (profile && !isPrivileged && profile.companyId) {
      form.setValue("companyId", profile.companyId)
    }
  }, [profile, isPrivileged, form])

  // Consulta real das perícias
  const expertisesQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    if (isPrivileged) {
      return query(collectionGroup(db, "legalExpertises"), orderBy("date", "desc"))
    } else if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "legalExpertises"), orderBy("date", "desc"))
    }
    return null
  }, [db, profile, isPrivileged])

  const { data: expertises, isLoading } = useCollection(expertisesQuery)

  const checkNTEP = (cid: string) => {
    if (!cid) return false
    const dangerousPrefixes = ["M75", "M54", "F33", "M77", "M65"]
    return dangerousPrefixes.some(p => cid.toUpperCase().startsWith(p))
  }

  async function handleCreateRecord(values: RecordFormValues) {
    if (!db) return
    setIsSubmitting(true)
    try {
      const colRef = collection(db, "companies", values.companyId, "legalExpertises")
      await addDocumentNonBlocking(colRef, {
        ...values,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        type: "Afastamento Previdenciário"
      })
      toast({ title: "Registro Criado", description: "O caso foi inserido no radar Sentinela." })
      setIsCreateOpen(false)
      form.reset()
    } catch (e) {
      toast({ variant: "destructive", title: "Erro ao Salvar" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRecord = (record: any) => {
    if (!db || !record.companyId) return
    const confirm = window.confirm(`Remover registro de ${record.employeeName}?`)
    if (!confirm) return

    const docRef = doc(db, "companies", record.companyId, "legalExpertises", record.id)
    deleteDocumentNonBlocking(docRef)
    toast({ title: "Registro Removido" })
  }

  async function handleGenerateContestation(record: any) {
    setIsGenerating(true)
    setAiDraft(null)
    try {
      const result = await generateNtepContestation({
        cnae: "25.3",
        cid: record.cid || "M75.1",
        jobRole: record.jobRole || "Operacional",
        workEnvironment: "Linha de Produção / Metalurgia"
      })
      setAiDraft(result.contestationDraft)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na NAI",
        description: "A NAI não conseguiu gerar a contestação jurídica agora."
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNotifyWhatsApp = (record: any) => {
    const message = MSG_TEMPLATES.ALERTA_LIMBO(record.employeeName);
    window.open(getWhatsAppLink("11999999999", message), '_blank');
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Sentinela do Limbo (NTEP) 2026</h1>
          <p className="text-muted-foreground">Vigilância ativa de afastamentos e nexo técnico baseado em processos reais.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-11"><History className="size-4" /> Histórico</Button>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent text-primary hover:bg-accent/90 gap-2 h-11 px-6 shadow-lg font-black uppercase text-[10px] tracking-widest rounded-xl">
                <Plus className="size-4" /> Novo Registro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden bg-white">
              <DialogHeader className="p-8 bg-primary text-white">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 rounded-lg"><AlertTriangle className="size-5 text-accent" /></div>
                  <DialogTitle className="text-xl font-headline font-black uppercase">Registrar Afastamento</DialogTitle>
                </div>
                <DialogDescription className="text-white/70 font-medium italic">Insira os dados do colaborador para análise de nexo NTEP.</DialogDescription>
              </DialogHeader>
              
              <div className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateRecord)} className="space-y-5">
                    <FormField
                      control={form.control}
                      name="employeeName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Nome do Colaborador</FormLabel>
                          <FormControl><Input placeholder="Ex: JOÃO DA SILVA" {...field} className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">CID (Código)</FormLabel>
                            <FormControl><Input placeholder="Ex: M75.1" {...field} className="h-12 bg-slate-50 border-none rounded-xl font-bold uppercase" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="companyId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] font-black uppercase text-slate-400">Unidade Cliente</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isPrivileged}>
                              <FormControl><SelectTrigger className="h-12 bg-slate-50 border-none rounded-xl font-bold"><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                              <SelectContent>
                                {companies?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="disease"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[10px] font-black uppercase text-slate-400">Doença Alegada (Descrição)</FormLabel>
                          <FormControl><Input placeholder="Ex: Síndrome do Túnel do Carpo" {...field} className="h-12 bg-slate-50 border-none rounded-xl font-bold" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full h-14 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-2xl shadow-xl gap-3">
                      {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : <CheckCircle2 className="size-5 text-accent" />}
                      Salvar Registro
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 card-shadow border-none bg-white">
          <CardHeader>
            <CardTitle className="text-lg">Gestão de Absenteísmo & Nexo</CardTitle>
            <CardDescription>Monitoramento de casos com CIDs documentados em processos judiciais.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>CID / Doença</TableHead>
                  <TableHead>Nexo IA</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-2xl bg-[#090e24] flex items-center justify-center text-white font-black text-xl shadow-xl animate-bounce">N</div>
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sincronizando Base Jurídica...</span>
                    </div>
                  </TableCell></TableRow>
                ) : expertises?.length ? expertises.map((record) => {
                  const isNtep = checkNTEP(record.cid)
                  return (
                    <TableRow key={record.id} className={isNtep ? "bg-red-50/30" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-bold text-primary uppercase text-xs">{record.employeeName}</p>
                          <p className="text-[9px] text-muted-foreground uppercase font-black">{record.jobRole || 'Não informado'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="font-mono bg-white text-[10px]">{record.cid || "N/I"}</Badge>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{record.disease}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isNtep ? (
                          <Badge variant="destructive" className="gap-1 border-none shadow-sm shadow-destructive/40 animate-pulse text-[9px] font-black">
                            <AlertTriangle className="size-3" /> CRÍTICO (Nexo)
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 border-none text-[9px] font-black">
                            <ShieldCheck className="size-3" /> Monitorado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDeleteRecord(record)}><Trash2 className="size-4" /></Button>
                          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={() => handleNotifyWhatsApp(record)}><MessageSquare className="size-3" /></Button>
                          {isNtep && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 border-primary text-primary h-8 px-3 text-[9px] font-black uppercase" onClick={() => handleGenerateContestation(record)}>
                                  <Sparkles className="size-3" /> NAI Defesa
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl rounded-[2rem]">
                                <DialogHeader className="p-8 bg-primary text-white shrink-0">
                                  <DialogTitle className="flex items-center gap-3 text-xl font-headline font-black uppercase">
                                    <Gavel className="size-6 text-accent" /> Contestação NAI
                                  </DialogTitle>
                                  <DialogDescription className="text-white/70 font-bold uppercase text-[10px] mt-2">
                                    Fundamentação para {record.employeeName} (CID: {record.cid}).
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
                                  {isGenerating ? (
                                    <div className="flex flex-col items-center justify-center py-20 gap-6">
                                      <div className="size-20 rounded-[2rem] bg-[#090e24] flex items-center justify-center text-white font-black text-4xl shadow-2xl animate-bounce">N</div>
                                      <p className="text-xs font-black uppercase tracking-widest animate-pulse text-primary text-center">NAI Cruzando Base Legal 2026...</p>
                                    </div>
                                  ) : aiDraft ? (
                                    <div className="bg-white p-8 rounded-3xl border shadow-inner whitespace-pre-wrap text-sm leading-relaxed font-body">
                                      {aiDraft}
                                    </div>
                                  ) : (
                                    <div className="text-center py-10 text-muted-foreground italic">Erro ao carregar rascunho NAI.</div>
                                  )}
                                </div>
                                <div className="p-6 bg-white border-t flex justify-between items-center shrink-0">
                                  <div className="text-[10px] font-black uppercase text-slate-400">NAI Forensic Intelligence</div>
                                  <div className="flex gap-2">
                                    <Button variant="ghost" className="font-bold uppercase text-[10px]" onClick={() => setAiDraft(null)}>Descartar</Button>
                                    <Button className="bg-primary px-8 h-11 rounded-xl gap-2 font-black uppercase text-[10px] text-white">
                                      <Copy className="size-4" /> Copiar Texto
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                }) : (
                  <TableRow><TableCell colSpan={4} className="text-center py-32 opacity-20">
                    <AlertTriangle className="size-16 mx-auto mb-4" />
                    <p className="font-black uppercase text-sm tracking-widest">Nenhum registro no radar</p>
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="card-shadow border-none bg-[#090e24] text-white">
            <CardHeader>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-[#f59e0b] flex items-center gap-2">
                <TrendingUp className="size-4" /> Risco Previdenciário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase opacity-50 mb-1">Casos Críticos (NTEP)</p>
                <p className="text-3xl font-black text-[#f59e0b]">
                  {expertises?.filter(e => checkNTEP(e.cid)).length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Eficiência NAI</CardTitle>
            </CardHeader>
            <CardContent>
              <h2 className="text-2xl font-black text-primary">91%</h2>
              <Progress value={91} className="h-1.5 mt-2" />
              <p className="text-[10px] text-muted-foreground mt-2">Taxa de êxito em contestações.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
