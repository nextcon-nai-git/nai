"use client"

import * as React from "react"
import { 
  SearchCheck, 
  FileWarning, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Download, 
  ShieldAlert, 
  ShieldCheck,
  ArrowRight,
  Info,
  ExternalLink,
  Ban,
  Sparkles,
  Loader2,
  History,
  Save,
  Clock,
  SendHorizontal
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { useToast } from "@/hooks/use-toast"
import { runEsocialAudit, type EsocialAuditOutput } from "@/ai/flows/esocial-audit-flow"
import { useUser, useFirestore, useCollection, useMemoFirebase, useDoc } from "@/firebase"
import { collection, addDoc, query, orderBy, limit, doc, collectionGroup } from "firebase/firestore"
import { cn } from "@/lib/utils"

export default function EsocialAudit() {
  const { toast } = useToast()
  const { user } = useUser()
  const db = useFirestore()
  const [isAuditing, setIsAuditing] = React.useState(false)
  const [aiReport, setAiReport] = React.useState<EsocialAuditOutput | null>(null)

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null
    return doc(db, "users", user.uid)
  }, [db, user])
  const { data: profile } = useDoc(profileRef)

  // Status simulado dos eventos eSocial
  const esocialEvents = [
    { id: "S-2210", title: "CAT (Acidentes)", status: "OK", lastSent: "12/05/2025", pending: 0, color: "text-emerald-600" },
    { id: "S-2220", title: "Saúde (Exames)", status: "Alerta", lastSent: "15/05/2025", pending: 12, color: "text-amber-600" },
    { id: "S-2240", title: "Ambiente (Riscos)", status: "Crítico", lastSent: "01/05/2025", pending: 4, color: "text-red-600" },
  ]

  const historyQuery = useMemoFirebase(() => {
    if (!db || !profile) return null
    
    const isPrivileged = ['SUPER_ADMIN', 'ENGINEER', 'DOCTOR', 'admin'].includes(profile.role)
    
    // Admins veem via Collection Group global. Clientes veem apenas sua sub-coleção.
    if (isPrivileged) {
      return query(collectionGroup(db, "auditHistory"), orderBy("createdAt", "desc"), limit(5))
    } else if (profile.companyId) {
      return query(collection(db, "companies", profile.companyId, "auditHistory"), orderBy("createdAt", "desc"), limit(5))
    }
    return null
  }, [db, profile])

  const { data: history } = useCollection(historyQuery)

  const handleRunAiAudit = async () => {
    if (!profile || !user) return;
    setIsAuditing(true)
    setAiReport(null)
    
    try {
      const result = await runEsocialAudit({
        sector: "Produção e Metalurgia",
        riskList: ["Ruído Contínuo 88dB", "Fumos Metálicos", "Calor"],
        examList: ["Exame Clínico", "Espirometria"]
      })
      
      setAiReport(result)
      
      if (db && profile.companyId) {
        await addDoc(collection(db, "companies", profile.companyId, "auditHistory"), {
          ...result,
          sector: "Produção e Metalurgia",
          userId: user.uid,
          createdAt: new Date().toISOString()
        })
      }

      toast({ title: "Auditoria Finalizada", description: "O Gemini validou a conformidade técnica." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Falha na Auditoria", description: error.message })
    } finally {
      setIsAuditing(false)
    }
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-headline font-black text-primary tracking-tight uppercase">Vigilante eSocial 2026</h1>
          <p className="text-muted-foreground font-medium">Controle de conformidade para S-2210, S-2220 e S-2240.</p>
        </div>
        <Button 
          onClick={handleRunAiAudit} 
          disabled={isAuditing} 
          className="gradient-nextcon hover:opacity-90 gap-2 h-14 px-8 rounded-2xl shadow-xl font-black uppercase text-[10px] tracking-widest"
        >
          {isAuditing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-5 text-accent" />}
          {isAuditing ? "NAI Analisando Prazos..." : "Auditoria Inteligente (IA)"}
        </Button>
      </header>

      {/* Monitor de Eventos Críticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {esocialEvents.map((evt) => (
          <Card key={evt.id} className="glass-panel border-none p-6 relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{evt.id}</p>
                <h3 className="text-lg font-black text-primary">{evt.title}</h3>
              </div>
              <Badge className={cn(
                "font-black text-[9px] uppercase border-none px-3",
                evt.status === 'OK' ? 'bg-emerald-100 text-emerald-700' : 
                evt.status === 'Alerta' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
              )}>
                {evt.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase">
                Pendente: <span className={cn("font-black", evt.pending > 0 ? evt.color : "text-slate-400")}>{evt.pending}</span>
              </div>
              <div className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                <Clock className="size-3" /> Último envio: {evt.lastSent}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <Card className="card-shadow border-none bg-white">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-headline font-black text-primary uppercase">Conformidade de Dados (Cruzamento NAI)</CardTitle>
              <CardDescription>Auditoria ativa de inconsistências entre PGR (S-2240) e PCMSO (S-2220).</CardDescription>
            </CardHeader>
            <CardContent>
              {aiReport ? (
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="font-black text-[10px] uppercase">Divergência Detectada</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Impacto Legal</TableHead>
                      <TableHead className="font-black text-[10px] uppercase">Correção Recomendada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {aiReport.criticalGaps.map((gap, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-bold text-red-700 text-xs">{gap.description}</TableCell>
                        <TableCell className="text-[11px] text-muted-foreground italic">{gap.legalImpact}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] font-black uppercase border-none">
                            {gap.recommendation}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-[2rem] opacity-30 flex flex-col items-center gap-4">
                  <ShieldCheck className="size-16 text-primary" />
                  <div className="space-y-1">
                    <p className="font-black uppercase tracking-widest text-sm">Pronto para Auditar</p>
                    <p className="text-xs">Clique em 'Auditoria Inteligente' para validar os lotes pendentes.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="gradient-nextcon text-white border-none p-6 rounded-[2.5rem] shadow-2xl">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xs font-black uppercase text-accent tracking-widest flex items-center gap-2">
                <SendHorizontal className="size-4" /> Gateway eSocial
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black text-white/50 uppercase mb-1">Score de Prontidão</p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-black">{aiReport ? aiReport.complianceScore : 92}%</span>
                  <Progress value={aiReport ? aiReport.complianceScore : 92} className="h-1.5 flex-1 bg-white/10" />
                </div>
              </div>
              <Button className="w-full h-14 bg-accent text-primary font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-accent/90" disabled={!aiReport}>
                Transmitir Validado
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel border-none p-6 rounded-[2.5rem]">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <History className="size-3" /> Logs de Transmissão
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-3">
                {history?.map((audit) => (
                  <div key={audit.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
                    <div className="overflow-hidden">
                      <p className="text-[10px] font-black text-primary uppercase truncate">{audit.sector}</p>
                      <p className="text-[9px] text-slate-400 font-bold">{new Date(audit.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 text-[8px] border-none">{audit.complianceScore}%</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
