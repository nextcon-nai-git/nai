"use client"

import * as React from "react"
import { AlertTriangle, ShieldCheck, History, Search, FileText, Gavel, Loader2, Sparkles, FileDown, Copy, MessageSquare, TrendingUp } from "lucide-react"
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
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, query, orderBy, collectionGroup, doc } from "firebase/firestore"
import { generateNtepContestation } from "@/ai/flows/ntep-contestation-generator"
import { getWhatsAppLink, MSG_TEMPLATES } from "@/lib/whatsapp-utils"

export default function LimboSentinel() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [aiDraft, setAiDraft] = React.useState<string | null>(null)

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  const expertisesQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    const isPrivileged = ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role)
    if (isPrivileged) {
      return query(collectionGroup(db, "legalExpertises"), orderBy("date", "desc"))
    } else if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "legalExpertises"), orderBy("date", "desc"))
    }
    return null
  }, [db, profile])

  const { data: expertises, isLoading } = useCollection(expertisesQuery)

  const checkNTEP = (cid: string) => {
    if (!cid) return false
    const dangerousPrefixes = ["M75", "M54", "F33", "M77", "M65"]
    return dangerousPrefixes.some(p => cid.startsWith(p))
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
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-primary tracking-tight uppercase">Sentinela do Limbo (NTEP) 2026</h1>
          <p className="text-muted-foreground">Vigilância ativa de afastamentos e nexo técnico baseado em processos reais.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 h-11"><History className="size-4" /> Histórico</Button>
          <Button className="bg-accent hover:bg-accent/90 gap-2 h-11 shadow-lg shadow-accent/20 font-bold"><AlertTriangle className="size-4" /> Novo Registro</Button>
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
                  <TableHead>Ação</TableHead>
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
                ) : expertises?.map((record) => {
                  const isNtep = checkNTEP(record.cid)
                  return (
                    <TableRow key={record.id} className={isNtep ? "bg-red-50/30" : ""}>
                      <TableCell>
                        <div>
                          <p className="font-bold text-primary">{record.employeeName}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-black">{record.jobRole || 'Não informado'}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline" className="font-mono bg-white">{record.cid || "N/I"}</Badge>
                          <p className="text-[10px] text-muted-foreground truncate max-w-[200px]">{record.disease}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isNtep ? (
                          <Badge variant="destructive" className="gap-1 border-none shadow-sm shadow-destructive/40 animate-pulse">
                            <AlertTriangle className="size-3" /> CRÍTICO (Nexo)
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 border-none">
                            <ShieldCheck className="size-3" /> Monitorado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleNotifyWhatsApp(record)}><MessageSquare className="size-3" /></Button>
                          {isNtep && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="gap-2 border-primary text-primary" onClick={() => handleGenerateContestation(record)}>
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
                                    <Button className="bg-primary px-8 h-11 rounded-xl gap-2 font-black uppercase text-[10px]">
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
                })}
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
